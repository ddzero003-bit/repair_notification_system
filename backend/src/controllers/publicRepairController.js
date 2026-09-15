/**
 * Public Repair Controller — สำหรับการแจ้งซ่อมแบบสาธารณะ (ไม่ต้องล็อกอิน)
 *
 * รองรับ 2 โหมด:
 * 1. Token Mode (48ชม.) — ผู้ใช้พิมพ์ "แจ้งซ่อม" ใน LINE → ได้ URL พร้อม token ผูก LINE userId
 * 2. Rich Menu Mode (ถาวร) — กดปุ่ม Rich Menu → เปิด /report โดยตรง ไม่มี token
 */
import jwt from 'jsonwebtoken'
import { query } from '../config/db.js'
import { notifyNewRepairToOperators } from '../utils/lineNotify.js'

/**
 * สร้าง Token สาธารณะสำหรับเปิดหน้าฟอร์มแจ้งซ่อม
 * ใช้ JWT ลงนามด้วย JWT_SECRET — มีอายุ 48 ชั่วโมง
 * ผูกกับ LINE userId เพื่อให้รู้ว่าใครแจ้ง
 */
export function generateReportToken(lineUserId = null) {
  const payload = { type: 'public_report', lineUserId, iat: Date.now() }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '48h' })
}

/**
 * ตรวจสอบความถูกต้องของ Token
 * - ถ้าไม่มี token → Rich Menu Mode (อนุญาต แต่ไม่รู้ LINE userId)
 * - ถ้ามี token แต่ผิด/หมดอายุ → ปฏิเสธ
 * - ถ้ามี token ถูกต้อง → Token Mode (ผูก LINE userId)
 */
function verifyReportToken(token) {
  if (!token) {
    // Rich Menu Mode — ไม่มี token แต่อนุญาตให้ใช้งานได้
    return { type: 'public_report', lineUserId: null, isRichMenu: true }
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (payload.type !== 'public_report') throw new Error('Invalid token type')
    return { ...payload, isRichMenu: false }
  } catch {
    return null
  }
}

/**
 * สร้างรหัสแจ้งซ่อมถัดไปอัตโนมัติ (SR + ปี พ.ศ. + ลำดับ 3 หลัก)
 */
async function nextRequestId() {
  const year = new Date().getFullYear() + 543
  const res = await query(
    `SELECT COUNT(*)::int AS count FROM tb_repairrequest WHERE request_id LIKE $1`,
    [`SR${year}-%`]
  )
  const seq = res.rows[0].count + 1
  return `SR${year}-${String(seq).padStart(3, '0')}`
}

/**
 * GET /api/public/token
 * ให้ Operator ขอ Token เพื่อสร้าง URL สำหรับส่งให้ประชาชน
 * ต้อง Login เป็น Operator จึงจะสร้าง Token ได้
 */
export async function createReportToken(req, res) {
  const lineUserId = req.query.lineUserId || null
  const token = generateReportToken(lineUserId)
  const reportUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/report?token=${token}`
  res.json({ token, reportUrl })
}

/**
 * GET /api/public/verify-token?token=xxx
 * ตรวจสอบความถูกต้องของ Token จาก Frontend
 * - ไม่มี token → Rich Menu Mode → valid: true
 * - มี token ถูกต้อง → valid: true
 * - มี token แต่ผิด/หมดอายุ → valid: false
 */
export async function verifyToken(req, res) {
  const { token } = req.query
  if (!token) {
    // Rich Menu Mode — อนุญาตเสมอ
    return res.json({ valid: true, mode: 'rich_menu' })
  }
  const payload = verifyReportToken(token)
  if (!payload) {
    return res.json({ valid: false, message: 'ลิงก์นี้หมดอายุแล้ว กรุณาพิมพ์ "แจ้งซ่อม" ใน LINE ใหม่อีกครั้ง' })
  }
  return res.json({ valid: true, mode: 'token', lineUserId: payload.lineUserId })
}


/**
 * POST /api/public/repairs
 * สร้างคำขอแจ้งซ่อมสาธารณะ (ไม่ต้องล็อกอิน)
 * ต้องส่ง Token ที่ถูกต้องมาด้วย
 *
 * Required fields: token, name, contactPhone, location, category, description, images, coords
 */
export async function createPublicRepair(req, res) {
  const { token, name, contactPhone, location, category, description, images, coords } = req.body

  // 1. ตรวจสอบ Token
  // - ไม่มี token → Rich Menu Mode (อนุญาต)
  // - มี token แต่หมดอายุ/ผิด → ปฏิเสธ
  const tokenPayload = verifyReportToken(token || null)
  if (!tokenPayload) return res.status(401).json({ message: 'Token ไม่ถูกต้องหรือหมดอายุ กรุณาขอลิงก์ใหม่จาก LINE' })

  // 2. ตรวจสอบ Required Fields
  const missing = []
  if (!name?.trim()) missing.push('ชื่อผู้แจ้งซ่อม')
  if (!contactPhone?.trim()) missing.push('เบอร์โทรศัพท์')
  if (!location?.trim()) missing.push('ที่อยู่/สถานที่เกิดเหตุ')
  if (!category) missing.push('ประเภทปัญหา')
  if (!description?.trim()) missing.push('รายละเอียดปัญหา')
  if (!images || images.length === 0) missing.push('รูปภาพปัญหา (อย่างน้อย 1 รูป)')
  if (!coords?.lat || !coords?.lng) missing.push('พิกัด GPS')

  if (missing.length > 0) {
    return res.status(400).json({ message: `กรุณากรอกข้อมูลให้ครบ: ${missing.join(', ')}` })
  }

  // 3. ค้นหาหรือสร้างผู้ใช้ (ไม่มี line_id ก็ได้)
  let userId = null
  if (tokenPayload.lineUserId) {
    // ถ้ามี LINE userId ให้ผูกกับ LINE Account
    const existing = await query('SELECT user_id FROM tb_user WHERE line_id = $1', [tokenPayload.lineUserId])
    if (existing.rows.length) {
      userId = existing.rows[0].user_id
      // อัปเดตชื่อและเบอร์โทร
      await query('UPDATE tb_user SET name = $1, phone = $2 WHERE user_id = $3', [name.trim(), contactPhone.trim(), userId])
    } else {
      const inserted = await query(
        'INSERT INTO tb_user (line_id, name, phone) VALUES ($1,$2,$3) RETURNING user_id',
        [tokenPayload.lineUserId, name.trim(), contactPhone.trim()]
      )
      userId = inserted.rows[0].user_id
    }
  } else {
    // Public Token — ไม่มี LINE ID สร้าง user ใหม่ทุกครั้ง (หรือค้นหาจากเบอร์โทร)
    const byPhone = await query('SELECT user_id FROM tb_user WHERE phone = $1', [contactPhone.trim()])
    if (byPhone.rows.length) {
      userId = byPhone.rows[0].user_id
      await query('UPDATE tb_user SET name = $1 WHERE user_id = $2', [name.trim(), userId])
    } else {
      const inserted = await query(
        'INSERT INTO tb_user (name, phone) VALUES ($1,$2) RETURNING user_id',
        [name.trim(), contactPhone.trim()]
      )
      userId = inserted.rows[0].user_id
    }
  }

  // 4. สร้างรหัสแจ้งซ่อมและบันทึกลงฐานข้อมูล
  const requestId = await nextRequestId()
  const title = description.substring(0, 100)

  await query(
    `INSERT INTO tb_repairrequest
      (request_id, user_id, repair_type, title, problem_desc, location_name, latitude, longitude,
       contact_phone, images_before, priority, status_code)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'normal','reported')`,
    [requestId, userId, category, title, description.trim(), location.trim(),
     coords.lat, coords.lng, contactPhone.trim(), images]
  )

  const repairData = {
    id: requestId,
    title,
    category,
    description: description.trim(),
    location: location.trim(),
    coords,
    images,
    status: 'reported',
    reporterName: name.trim(),
    contactPhone: contactPhone.trim(),
    createdAt: new Date().toISOString(),
  }

  res.status(201).json(repairData)

  // 5. แจ้งเตือน Operator ผ่าน LINE (async — ไม่ block response)
  notifyNewRepairToOperators(repairData).catch((err) => console.error('[LINE] notify error:', err))
}
