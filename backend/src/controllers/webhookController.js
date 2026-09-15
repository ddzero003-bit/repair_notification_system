/**
 * LINE Webhook Controller — ตัวรับและประมวลผลข้อความจาก LINE OA
 *
 * เมื่อผู้ใช้ส่งข้อความมาที่ LINE OA → LINE Platform จะส่ง HTTP POST มาที่ /api/webhook
 * ไฟล์นี้ทำหน้าที่:
 * 1. รับ Webhook Events จาก LINE
 * 2. แยกประเภทข้อความ (text/image/location)
 * 3. จัดการ Flow การแจ้งซ่อม (เก็บข้อมูลชั่วคราวไว้ใน memory จนกว่าจะครบ)
 * 4. สร้างคำขอแจ้งซ่อมในฐานข้อมูลเมื่อรวบรวมข้อมูลครบ
 * 5. ตอบกลับผู้ใช้ด้วยข้อความยืนยัน
 */
import lineClient from '../utils/lineClient.js'
import { query } from '../config/db.js'
import { notifyNewRepairToOperators } from '../utils/lineNotify.js'
import { generateReportToken } from '../controllers/publicRepairController.js'

// ===== เก็บ Session ชั่วคราวสำหรับ Flow การแจ้งซ่อม =====
// key = LINE userId, value = { step, data }
// ใช้ Map เก็บใน memory (เหมาะกับ prototype — production ควรใช้ Redis)
const sessions = new Map()

/**
 * ฟังก์ชันสร้างรหัสแจ้งซ่อมถัดไปแบบอัตโนมัติ (เหมือนใน repairController)
 */
async function nextRequestId() {
  const year = new Date().getFullYear() + 543
  const res = await query(`SELECT COUNT(*)::int AS count FROM tb_repairrequest WHERE request_id LIKE $1`, [`SR${year}-%`])
  const seq = res.rows[0].count + 1
  return `SR${year}-${String(seq).padStart(3, '0')}`
}

/**
 * ค้นหาหรือสร้างผู้ใช้จาก LINE userId
 * ถ้ามีแล้วก็ดึงข้อมูลเดิม ถ้ายังไม่มีก็สร้างใหม่อัตโนมัติ
 */
async function getOrCreateUser(lineUserId, displayName) {
  const existing = await query('SELECT * FROM tb_user WHERE line_id = $1', [lineUserId])
  if (existing.rows.length) return existing.rows[0]

  const inserted = await query(
    `INSERT INTO tb_user (line_id, name) VALUES ($1, $2) RETURNING *`,
    [lineUserId, displayName || 'ผู้ใช้ LINE']
  )
  return inserted.rows[0]
}

/**
 * ตอบกลับข้อความไปยัง LINE (Reply Message)
 */
async function reply(replyToken, text) {
  await lineClient.replyMessage({
    replyToken,
    messages: [{ type: 'text', text }],
  })
}

// ===== เมนูหลัก =====
const MAIN_MENU_TEXT = `🏠 เมนูหลัก — ระบบแจ้งซ่อมสาธารณูปโภค\n━━━━━━━━━━━━━━\nพิมพ์หมายเลขเพื่อเลือก:\n\n1️⃣  แจ้งซ่อม — แจ้งปัญหาไฟฟ้า/ประปา\n2️⃣  ตรวจสถานะ — ดูความคืบหน้างานซ่อม\n\nหรือพิมพ์ "เมนู" เพื่อดูเมนูนี้อีกครั้ง`

// ===== Webhook Handler หลัก =====

/**
 * ฟังก์ชันหลักที่รับ Webhook Events จาก LINE
 * LINE อาจส่งหลาย events มาพร้อมกัน (batch) จึงต้องวนลูปทีละ event
 */
export async function handleWebhook(req, res) {
  // ตอบ 200 ทันทีเพื่อให้ LINE รู้ว่ารับ event แล้ว (ถ้าไม่ตอบ LINE จะส่งซ้ำ)
  res.status(200).json({ status: 'ok' })

  const events = req.body.events || []
  for (const event of events) {
    try {
      await processEvent(event)
    } catch (err) {
      console.error('[Webhook] Error processing event:', err)
    }
  }
}

/**
 * ประมวลผลแต่ละ Event ที่ได้รับจาก LINE
 */
async function processEvent(event) {
  // เราสนใจเฉพาะ message events (ข้อความจากผู้ใช้)
  if (event.type !== 'message') return

  const userId = event.source.userId
  const replyToken = event.replyToken
  const msg = event.message

  // ===== จัดการตามประเภทข้อความ =====
  if (msg.type === 'text') {
    await handleTextMessage(userId, replyToken, msg.text.trim())
  } else if (msg.type === 'image') {
    await handleImageMessage(userId, replyToken, msg.id)
  } else if (msg.type === 'location') {
    await handleLocationMessage(userId, replyToken, msg.latitude, msg.longitude, msg.address)
  } else {
    await reply(replyToken, '⚠️ ระบบยังไม่รองรับข้อความประเภทนี้\nพิมพ์ "เมนู" เพื่อดูเมนูหลัก')
  }
}

// ===== จัดการข้อความตัวอักษร (Text) =====
async function handleTextMessage(userId, replyToken, text) {
  const lowerText = text.toLowerCase()
  const session = sessions.get(userId)

  // ----- คำสั่ง "เมนู" — ยกเลิก Flow ปัจจุบันและกลับเมนูหลักเสมอ -----
  if (['เมนู', 'menu', 'help', 'ยกเลิก', 'cancel'].includes(lowerText)) {
    sessions.delete(userId) // ล้าง session เก่า
    return reply(replyToken, MAIN_MENU_TEXT)
  }

  // ----- ✅ ถ้ากำลังอยู่ใน Flow แจ้งซ่อม → ไปต่อ Flow ก่อน (ไม่ตีความเป็นคำสั่งเมนู) -----
  if (session) {
    return handleRepairFlow(userId, replyToken, text, session)
  }

  // ----- เริ่มแจ้งซ่อม → ส่งลิงก์ฟอร์มสาธารณะ (ไม่ต้องถามทีละขั้น) -----
  if (['1', 'แจ้งซ่อม', 'แจ้ง'].includes(lowerText)) {
    const token = generateReportToken(userId)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const reportUrl = `${frontendUrl}/report?token=${token}`

    await lineClient.replyMessage({
      replyToken,
      messages: [
        {
          type: 'text',
          text: `🔧 แจ้งซ่อมสาธารณูปโภค\n━━━━━━━━━━━━━━\nกรุณากดลิงก์ด้านล่างเพื่อเปิดแบบฟอร์มแจ้งซ่อม\nกรอกข้อมูลให้ครบถ้วน พร้อมแนบรูปภาพและพิกัด GPS\n\n🔗 ${reportUrl}\n\n⏰ ลิงก์มีอายุ 48 ชั่วโมง`,
        },
      ],
    })
    return
  }

  // ----- ตรวจสถานะ -----
  if (['2', 'ตรวจสถานะ', 'สถานะ', 'เช็ค'].includes(lowerText)) {
    return handleCheckStatus(userId, replyToken)
  }

  // ----- ไม่เข้าใจคำสั่ง -----
  return reply(replyToken, `❓ ไม่เข้าใจคำสั่ง "${text}"\n\nพิมพ์ "เมนู" เพื่อดูเมนูหลัก`)
}

// ===== Flow การแจ้งซ่อมทีละขั้น =====
async function handleRepairFlow(userId, replyToken, text, session) {
  const { step, data } = session

  // ขั้น 1: เลือกประเภทปัญหา (ไฟฟ้า / ประปา)
  if (step === 'choose_category') {
    if (['1', 'ไฟฟ้า'].includes(text.toLowerCase())) {
      data.category = 'electricity'
    } else if (['2', 'ประปา'].includes(text.toLowerCase())) {
      data.category = 'water'
    } else {
      return reply(replyToken, '⚠️ กรุณาพิมพ์ 1 (ไฟฟ้า) หรือ 2 (ประปา)')
    }
    session.step = 'enter_description'
    sessions.set(userId, session)
    return reply(replyToken, `✅ เลือก: ${data.category === 'electricity' ? '⚡ ไฟฟ้า' : '💧 ประปา'}\n\n📝 กรุณาอธิบายปัญหาที่พบ\n(เช่น ไฟฟ้าดับหน้าซอย 5 ตั้งแต่เมื่อเช้า)`)
  }

  // ขั้น 2: อธิบายปัญหา
  if (step === 'enter_description') {
    data.description = text
    data.title = text.substring(0, 100) // ใช้ 100 ตัวอักษรแรกเป็นหัวข้อ
    session.step = 'send_image_or_skip'
    sessions.set(userId, session)
    return reply(replyToken, '📸 กรุณาส่งรูปภาพประกอบ (ถ้ามี)\nหรือพิมพ์ "ข้าม" เพื่อไปขั้นต่อไป')
  }

  // ขั้น 3: ส่งรูปภาพหรือข้าม
  if (step === 'send_image_or_skip') {
    if (['ข้าม', 'skip'].includes(text.toLowerCase())) {
      session.step = 'send_location_or_skip'
      sessions.set(userId, session)
      return reply(replyToken, '📍 กรุณาส่งพิกัดตำแหน่ง (กดปุ่ม + → ตำแหน่ง)\nหรือพิมพ์ที่อยู่/สถานที่\nหรือพิมพ์ "ข้าม"')
    }
    return reply(replyToken, '📸 กรุณาส่งรูปภาพ หรือพิมพ์ "ข้าม"')
  }

  // ขั้น 4: ส่งพิกัดหรือพิมพ์ที่อยู่ หรือข้าม
  if (step === 'send_location_or_skip') {
    if (['ข้าม', 'skip'].includes(text.toLowerCase())) {
      // ข้ามพิกัด → สร้างคำขอแจ้งซ่อมเลย
      return finishRepairRequest(userId, replyToken, session)
    }
    // ถ้าพิมพ์ข้อความ ถือว่าเป็นที่อยู่
    data.location = text
    sessions.set(userId, session)
    return finishRepairRequest(userId, replyToken, session)
  }
}

// ===== จัดการรูปภาพ =====
async function handleImageMessage(userId, replyToken, messageId) {
  const session = sessions.get(userId)

  if (session && session.step === 'send_image_or_skip') {
    // บันทึก message ID ของรูปภาพ (สามารถดึงรูปจาก LINE ได้ภายหลัง)
    if (!session.data.images) session.data.images = []
    session.data.images.push(messageId)
    sessions.set(userId, session)

    if (session.data.images.length >= 5) {
      // ครบ 5 รูปแล้ว ไปขั้นต่อไป
      session.step = 'send_location_or_skip'
      sessions.set(userId, session)
      return reply(replyToken, '✅ รับรูปภาพครบ 5 รูปแล้ว\n\n📍 กรุณาส่งพิกัดตำแหน่ง (กดปุ่ม + → ตำแหน่ง)\nหรือพิมพ์ที่อยู่/สถานที่\nหรือพิมพ์ "ข้าม"')
    }

    return reply(replyToken, `📸 รับรูปที่ ${session.data.images.length} แล้ว (สูงสุด 5 รูป)\nส่งเพิ่มได้ หรือพิมพ์ "ข้าม" เพื่อไปขั้นต่อไป`)
  }

  return reply(replyToken, '⚠️ กรุณาเริ่มแจ้งซ่อมก่อน โดยพิมพ์ "แจ้งซ่อม"')
}

// ===== จัดการพิกัดตำแหน่ง =====
async function handleLocationMessage(userId, replyToken, lat, lng, address) {
  const session = sessions.get(userId)

  if (session && session.step === 'send_location_or_skip') {
    session.data.lat = lat
    session.data.lng = lng
    session.data.location = address || `${lat}, ${lng}`
    sessions.set(userId, session)
    return finishRepairRequest(userId, replyToken, session)
  }

  // ถ้ายังไม่ได้อยู่ใน Flow ก็ข้ามรูปเลยไปรับ location
  if (session && session.step === 'send_image_or_skip') {
    session.data.lat = lat
    session.data.lng = lng
    session.data.location = address || `${lat}, ${lng}`
    session.step = 'send_location_or_skip' // ข้ามขั้นรูปภาพ
    sessions.set(userId, session)
    return finishRepairRequest(userId, replyToken, session)
  }

  return reply(replyToken, '⚠️ กรุณาเริ่มแจ้งซ่อมก่อน โดยพิมพ์ "แจ้งซ่อม"')
}

// ===== สร้างคำขอแจ้งซ่อมในฐานข้อมูล =====
async function finishRepairRequest(userId, replyToken, session) {
  const data = session.data

  try {
    // 1. ค้นหาหรือสร้างผู้ใช้
    const profile = await lineClient.getProfile(userId)
    const user = await getOrCreateUser(userId, profile.displayName)

    // 2. สร้างรหัสแจ้งซ่อมอัตโนมัติ
    const requestId = await nextRequestId()

    // 3. บันทึกลงฐานข้อมูล
    await query(
      `INSERT INTO tb_repairrequest
        (request_id, user_id, repair_type, title, problem_desc, location_name, latitude, longitude, priority, status_code)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'normal','reported')`,
      [requestId, user.user_id, data.category, data.title, data.description,
       data.location || null, data.lat || null, data.lng || null]
    )

    // 4. ลบ session (Flow เสร็จแล้ว)
    sessions.delete(userId)

    // 5. ตอบกลับผู้แจ้ง
    await reply(replyToken,
      `✅ บันทึกการแจ้งซ่อมสำเร็จ!\n━━━━━━━━━━━━━━\n📋 เลขที่: ${requestId}\n${data.category === 'electricity' ? '⚡' : '💧'} ประเภท: ${data.category === 'electricity' ? 'ไฟฟ้า' : 'ประปา'}\n📝 ${data.title}\n📍 ${data.location || '-'}\n📊 สถานะ: แจ้งแล้ว\n━━━━━━━━━━━━━━\nเราจะแจ้งความคืบหน้าให้ทราบครับ 🙏\n\nพิมพ์ "สถานะ" เพื่อเช็คความคืบหน้า`
    )

    // 6. แจ้ง Operator ทุกคนผ่าน LINE
    await notifyNewRepairToOperators({
      id: requestId,
      category: data.category,
      title: data.title,
      location: data.location,
      priority: 'normal',
    })

  } catch (err) {
    console.error('[Webhook] Error creating repair:', err)
    sessions.delete(userId)
    await reply(replyToken, '❌ เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่อีกครั้ง\nพิมพ์ "แจ้งซ่อม" เพื่อเริ่มใหม่')
  }
}

// ===== ตรวจสถานะงานซ่อม =====
async function handleCheckStatus(userId, replyToken) {
  // ดึงงานล่าสุด 5 รายการของผู้ใช้คนนี้
  const result = await query(
    `SELECT r.request_id, r.title, r.repair_type, r.status_code, r.created_at
     FROM tb_repairrequest r
     JOIN tb_user u ON r.user_id = u.user_id
     WHERE u.line_id = $1
     ORDER BY r.created_at DESC LIMIT 5`,
    [userId]
  )

  if (!result.rows.length) {
    return reply(replyToken, '📋 คุณยังไม่มีรายการแจ้งซ่อม\n\nพิมพ์ "แจ้งซ่อม" เพื่อเริ่มแจ้งปัญหา')
  }

  const statusMap = {
    reported: '📝 แจ้งแล้ว',
    accepted: '✅ รับเรื่อง',
    assigned: '👷 มอบหมายแล้ว',
    in_progress: '🔨 กำลังซ่อม',
    completed: '✅ เสร็จสิ้น',
    cancelled: '❌ ยกเลิก',
  }

  let msg = '📊 สถานะงานซ่อมของคุณ\n━━━━━━━━━━━━━━\n'
  for (const r of result.rows) {
    msg += `\n📋 ${r.request_id}\n   ${r.title}\n   ${statusMap[r.status_code] || r.status_code}\n`
  }
  msg += '\n━━━━━━━━━━━━━━\nพิมพ์ "เมนู" เพื่อกลับเมนูหลัก'

  return reply(replyToken, msg)
}
