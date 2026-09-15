/**
 * LINE Notify — ระบบแจ้งเตือนผ่าน LINE Messaging API (Flex Message Edition)
 *
 * ส่ง Flex Message (Bubble) สวยงามแทนข้อความ Text ธรรมดา
 * ทำหน้าที่ส่ง Push Notification ไปหาผู้ใช้ LINE ในสถานการณ์ต่างๆ เช่น
 * - มีงานแจ้งซ่อมใหม่ → แจ้ง Operator
 * - มอบหมายงานให้ช่าง → แจ้งช่าง
 * - สถานะงานเปลี่ยน → แจ้งผู้แจ้ง
 * - ซ่อมเสร็จ → แจ้งผู้แจ้ง + Operator
 * - ช่างปฏิเสธงาน → แจ้ง Operator
 */
import lineClient from './lineClient.js'
import { query } from '../config/db.js'

// ===== ฟังก์ชันช่วย (Helper Functions) =====

/**
 * แปลง status code เป็นชื่อภาษาไทย
 */
function statusText(code) {
  const map = {
    reported: '📝 แจ้งแล้ว',
    accepted: '✅ รับเรื่องแล้ว',
    assigned: '👷 มอบหมายงานแล้ว',
    rejected: '❌ ช่างปฏิเสธ',
    in_progress: '🔨 กำลังดำเนินการ',
    completed: '✅ เสร็จสิ้น',
    cancelled: '❌ ยกเลิก',
  }
  return map[code] || code
}

/**
 * แปลง status code เป็นสี
 */
function statusColor(code) {
  const map = {
    reported: '#64748b',
    accepted: '#0369a1',
    assigned: '#1e40af',
    rejected: '#b91c1c',
    in_progress: '#b45309',
    completed: '#15803d',
    cancelled: '#b91c1c',
  }
  return map[code] || '#334155'
}

/**
 * แปลงประเภทปัญหาเป็นภาษาไทย (พร้อม Emoji)
 */
function categoryLabel(type) {
  return type === 'electricity' ? '⚡ ไฟฟ้าสาธารณะ' : '💧 ประปาหมู่บ้าน'
}

/**
 * แปลงประเภทปัญหาเป็นสี Header
 */
function categoryColor(type) {
  return type === 'electricity' ? '#b45309' : '#0369a1'
}

/**
 * ดึง URL ระบบ Frontend
 */
function getSystemUrl() {
  return process.env.FRONTEND_URL || 'http://localhost:5173'
}

/**
 * ส่งข้อความ Push ไปหาผู้ใช้ LINE (ปลอดภัย — ถ้าล้มเหลวจะไม่ทำให้ระบบหลักพัง)
 */
async function safePush(lineId, messages) {
  if (!lineId) return
  try {
    await lineClient.pushMessage({ to: lineId, messages })
    console.log(`[LINE] ส่งข้อความไปยัง ${lineId} สำเร็จ`)
  } catch (err) {
    console.error(`[LINE] ส่งข้อความไปยัง ${lineId} ล้มเหลว:`, err.message)
  }
}

// =====================================================
// ===== Flex Message Bubble Builder (ตัวสร้างการ์ด) =====
// =====================================================

/**
 * สร้าง Flex Message แบบ Bubble สวยงาม
 *
 * @param {object} options
 * @param {string} options.title        - หัวข้อหลัก (แสดงใน Header)
 * @param {string} [options.subtitle]   - หัวข้อรอง (แสดงใต้หัวข้อหลัก)
 * @param {string} options.headerColor  - สี Background ของ Header (Hex)
 * @param {Array}  options.rows         - ข้อมูลแต่ละแถว [{label, value, valueColor?, valueWeight?}]
 * @param {string} [options.footerLabel] - ข้อความบนปุ่ม Footer
 * @param {string} [options.footerUri]   - URL เมื่อกดปุ่ม Footer
 * @param {string} [options.altText]     - ข้อความสำรอง (แสดงใน Push Notification)
 */
function buildFlexBubble({ title, subtitle, headerColor, rows, footerLabel, footerUri, altText }) {
  // ─── Header ───
  const headerContents = [
    {
      type: 'text',
      text: title,
      weight: 'bold',
      color: '#ffffff',
      size: 'lg',
    },
  ]
  if (subtitle) {
    headerContents.push({
      type: 'text',
      text: subtitle,
      color: '#ffffffcc',
      size: 'xs',
      margin: 'sm',
    })
  }

  // ─── Body (Rows) ───
  const bodyContents = []
  rows.forEach((row, index) => {
    // เพิ่มเส้นแบ่งระหว่างแถว (ยกเว้นแถวแรก)
    if (index > 0) {
      bodyContents.push({
        type: 'separator',
        color: '#eeeeee',
        margin: 'lg',
      })
    }
    bodyContents.push({
      type: 'box',
      layout: 'horizontal',
      contents: [
        {
          type: 'text',
          text: row.label,
          color: '#8c8c8c',
          size: 'sm',
          flex: 2,
        },
        {
          type: 'text',
          text: row.value || '-',
          wrap: true,
          color: row.valueColor || '#333333',
          size: 'sm',
          flex: 4,
          weight: row.valueWeight || 'regular',
        },
      ],
      margin: index === 0 ? 'none' : 'lg',
    })
  })

  // ─── Bubble Structure ───
  const bubble = {
    type: 'bubble',
    size: 'mega',
    header: {
      type: 'box',
      layout: 'vertical',
      contents: headerContents,
      backgroundColor: headerColor,
      paddingAll: '20px',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: bodyContents,
      paddingAll: '20px',
    },
  }

  // ─── Footer (ปุ่มกด — ถ้ามี) ───
  if (footerLabel && footerUri) {
    bubble.footer = {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'button',
          action: {
            type: 'uri',
            label: footerLabel,
            uri: footerUri,
          },
          style: 'primary',
          color: headerColor,
          height: 'sm',
        },
      ],
      paddingAll: '12px',
    }
  }

  return {
    type: 'flex',
    altText: altText || title,
    contents: bubble,
  }
}

// =====================================================
// ===== ฟังก์ชันแจ้งเตือนหลัก (Notification Functions) =====
// =====================================================

/**
 * 1. แจ้ง Operator ทุกคน เมื่อมีงานแจ้งซ่อมใหม่เข้ามา
 *    Header สี: ตามประเภท (ไฟฟ้า=ส้ม / ประปา=ฟ้า)
 */
export async function notifyNewRepairToOperators(repair) {
  const ops = await query(`SELECT line_id FROM tb_operator WHERE status = 'active' AND line_id IS NOT NULL`)

  const message = buildFlexBubble({
    title: '🔔 แจ้งซ่อมใหม่',
    subtitle: 'มีคำขอแจ้งซ่อมเข้ามาในระบบ',
    headerColor: categoryColor(repair.category),
    rows: [
      { label: '📋 เลขที่', value: repair.id, valueWeight: 'bold' },
      { label: '🏷️ ประเภท', value: categoryLabel(repair.category) },
      { label: '📝 รายละเอียด', value: repair.title },
      { label: '📍 สถานที่', value: repair.location || '-' },
      { label: '⚠️ ความเร่งด่วน', value: repair.priority || 'ปกติ' },
    ],
    footerLabel: 'เข้าระบบมอบหมายงาน',
    footerUri: `${getSystemUrl()}/operator/requests`,
    altText: `🔔 แจ้งซ่อมใหม่ ${repair.id}`,
  })

  const promises = ops.rows.map((op) => safePush(op.line_id, [message]))
  await Promise.all(promises)
}

/**
 * 2. แจ้งช่างซ่อม เมื่อได้รับมอบหมายงาน
 *    Header สี: น้ำเงินเข้ม (#1e40af)
 */
export async function notifyAssignmentToTechnician(repair, technicianId) {
  const tech = await query(`SELECT line_id FROM tb_technician WHERE technician_id = $1`, [technicianId])
  const lineId = tech.rows[0]?.line_id
  if (!lineId) return

  const message = buildFlexBubble({
    title: '🔧 ได้รับมอบหมายงาน',
    subtitle: 'คุณได้รับมอบหมายงานซ่อมใหม่',
    headerColor: '#1e40af',
    rows: [
      { label: '📋 เลขที่', value: repair.id, valueWeight: 'bold' },
      { label: '🏷️ ประเภท', value: categoryLabel(repair.category) },
      { label: '📝 รายละเอียด', value: repair.title },
      { label: '📍 สถานที่', value: repair.location || '-' },
      { label: '📞 เบอร์ติดต่อ', value: repair.contactPhone || '-' },
    ],
    footerLabel: 'เข้าระบบรับงาน',
    footerUri: `${getSystemUrl()}/technician/jobs`,
    altText: `🔧 คุณได้รับมอบหมายงาน ${repair.id}`,
  })

  await safePush(lineId, [message])
}

/**
 * 3. แจ้งผู้แจ้ง (Citizen) เมื่อสถานะงานเปลี่ยน
 *    Header สี: ตามสถานะใหม่
 */
export async function notifyStatusChangeToUser(repair, newStatus) {
  const user = await query(`SELECT line_id FROM tb_user WHERE user_id = $1`, [repair.reporterId])
  const lineId = user.rows[0]?.line_id
  if (!lineId) return

  const message = buildFlexBubble({
    title: '📢 อัปเดตสถานะงานซ่อม',
    subtitle: 'สถานะงานซ่อมของคุณมีการเปลี่ยนแปลง',
    headerColor: statusColor(newStatus),
    rows: [
      { label: '📋 เลขที่', value: repair.id, valueWeight: 'bold' },
      { label: '📝 รายการ', value: repair.title },
      { label: '📊 สถานะใหม่', value: statusText(newStatus), valueColor: statusColor(newStatus), valueWeight: 'bold' },
    ],
    altText: `📢 อัปเดตสถานะ ${repair.id}: ${statusText(newStatus)}`,
  })

  await safePush(lineId, [message])
}

/**
 * 4. แจ้งผู้แจ้ง + Operator เมื่อซ่อมเสร็จสิ้น
 *    Header สี: เขียว (#15803d)
 */
export async function notifyRepairCompleted(repair) {
  // ─── แจ้งผู้แจ้ง ───
  const user = await query(`SELECT line_id FROM tb_user WHERE user_id = $1`, [repair.reporterId])
  const userLineId = user.rows[0]?.line_id

  const userMsg = buildFlexBubble({
    title: '✅ ซ่อมเสร็จเรียบร้อย',
    subtitle: 'งานซ่อมของคุณดำเนินการเสร็จสิ้นแล้ว',
    headerColor: '#15803d',
    rows: [
      { label: '📋 เลขที่', value: repair.id, valueWeight: 'bold' },
      { label: '🏷️ ประเภท', value: categoryLabel(repair.category) },
      { label: '📝 รายการ', value: repair.title },
      { label: '🔧 ผลการซ่อม', value: repair.repairResult || 'เรียบร้อย' },
      { label: '📊 สถานะ', value: '✅ เสร็จสิ้น', valueColor: '#15803d', valueWeight: 'bold' },
    ],
    altText: `✅ งานซ่อม ${repair.id} เสร็จสิ้น — ขอบคุณที่แจ้งปัญหาครับ 🙏`,
  })

  if (userLineId) await safePush(userLineId, [userMsg])

  // ─── แจ้ง Operator ทุกคน ───
  const ops = await query(`SELECT line_id FROM tb_operator WHERE status = 'active' AND line_id IS NOT NULL`)

  const opMsg = buildFlexBubble({
    title: '✅ งานซ่อมเสร็จสิ้น',
    subtitle: `${repair.id} ดำเนินการเสร็จแล้ว`,
    headerColor: '#15803d',
    rows: [
      { label: '📋 เลขที่', value: repair.id, valueWeight: 'bold' },
      { label: '📝 รายการ', value: repair.title },
      { label: '🔧 ผลการซ่อม', value: repair.repairResult || 'เรียบร้อย' },
    ],
    footerLabel: 'ดูรายละเอียด',
    footerUri: `${getSystemUrl()}/operator/requests/${repair.id}`,
    altText: `✅ งานซ่อม ${repair.id} เสร็จสิ้น`,
  })

  const promises = ops.rows.map((op) => safePush(op.line_id, [opMsg]))
  await Promise.all(promises)
}

/**
 * 5. แจ้ง Operator เมื่อช่างปฏิเสธงาน (พร้อมเหตุผล)
 *    Header สี: แดง (#b91c1c)
 */
export async function notifyRejectionToOperators(repair, techName, reason) {
  const ops = await query(`SELECT line_id FROM tb_operator WHERE status = 'active' AND line_id IS NOT NULL`)

  const message = buildFlexBubble({
    title: '⚠️ ช่างปฏิเสธงาน',
    subtitle: 'กรุณามอบหมายช่างคนใหม่',
    headerColor: '#b91c1c',
    rows: [
      { label: '📋 เลขที่', value: repair.id, valueWeight: 'bold' },
      { label: '📝 รายการ', value: repair.title },
      { label: '👷 ช่าง', value: techName },
      { label: '💬 เหตุผล', value: reason || 'ไม่ระบุ', valueColor: '#b91c1c' },
    ],
    footerLabel: 'มอบหมายช่างใหม่',
    footerUri: `${getSystemUrl()}/operator/requests/${repair.id}`,
    altText: `⚠️ ช่างปฏิเสธงาน ${repair.id}`,
  })

  const promises = ops.rows.map((op) => safePush(op.line_id, [message]))
  await Promise.all(promises)
}

// =====================================================
// ===== ฟังก์ชันสำหรับระบบ Admin Notification =====
// =====================================================

/**
 * ส่งข้อความและคืนค่าสถานะความสำเร็จเพื่อนำไปบันทึก Log
 */
export async function pushMessage(lineUserId, messagePayload) {
  if (!lineUserId) return { success: false, error: 'No lineUserId provided' }
  const messages = Array.isArray(messagePayload) ? messagePayload : [messagePayload]
  try {
    await lineClient.pushMessage({
      to: lineUserId,
      messages,
    })
    return { success: true }
  } catch (err) {
    console.error(`[LINE] pushMessage to ${lineUserId} failed:`, err.message)
    return { success: false, error: err.message }
  }
}

/**
 * สร้าง Flex Message สำหรับประกาศจาก Admin
 */
export function buildNotificationFlexMessage(text, lineOaBasicId) {
  return {
    type: 'flex',
    altText: 'ประกาศจากระบบแจ้งซ่อม',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '📢 ประกาศจากระบบ',
            weight: 'bold',
            color: '#ffffff',
            size: 'lg',
          },
        ],
        backgroundColor: '#0369a1',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: text,
            wrap: true,
            size: 'md',
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'button',
            action: {
              type: 'uri',
              label: 'ติดต่อเจ้าหน้าที่',
              uri: `https://line.me/R/ti/p/${lineOaBasicId || ''}`,
            },
            style: 'link',
          },
        ],
      },
    },
  }
}

/**
 * สร้าง Flex Message สำหรับแจ้งงานซ่อมเสร็จสิ้น (พร้อมรูป)
 */
export function buildRepairCompletedFlexMessage({ title, community, repairResult, imageUrls, requestId }) {
  // สร้าง carousel bubbles สำหรับรูปภาพ
  const bubbles = (imageUrls || []).slice(0, 10).map((url) => ({
    type: 'bubble',
    hero: {
      type: 'image',
      url: (() => {
        const base = process.env.FRONTEND_URL || 'http://localhost:3000'
        const fullUrl = url.startsWith('http') ? url : `${base}${url}`
        // เพิ่ม ngrok-skip-browser-warning เพื่อให้ LINE ดึงรูปผ่าน ngrok ได้โดยไม่ติด interstitial page
        return fullUrl.includes('ngrok') ? `${fullUrl}?ngrok-skip-browser-warning=true` : fullUrl
      })(),
      size: 'full',
      aspectRatio: '20:13',
      aspectMode: 'cover',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: `ซ่อมเสร็จสิ้น: ${requestId}`,
          weight: 'bold',
          size: 'xl',
        },
        {
          type: 'box',
          layout: 'vertical',
          margin: 'lg',
          spacing: 'sm',
          contents: [
            {
              type: 'box',
              layout: 'baseline',
              spacing: 'sm',
              contents: [
                {
                  type: 'text',
                  text: 'รายการ',
                  color: '#aaaaaa',
                  size: 'sm',
                  flex: 1,
                },
                {
                  type: 'text',
                  text: title,
                  wrap: true,
                  color: '#666666',
                  size: 'sm',
                  flex: 3,
                },
              ],
            },
            {
              type: 'box',
              layout: 'baseline',
              spacing: 'sm',
              contents: [
                {
                  type: 'text',
                  text: 'ผลการซ่อม',
                  color: '#aaaaaa',
                  size: 'sm',
                  flex: 1,
                },
                {
                  type: 'text',
                  text: repairResult || 'เรียบร้อย',
                  wrap: true,
                  color: '#666666',
                  size: 'sm',
                  flex: 3,
                },
              ],
            },
          ],
        },
      ],
    },
  }))

  // ถ้าไม่มีรูปภาพเลย ให้ส่งเป็น Flex Bubble แทน text ธรรมดา
  if (bubbles.length === 0) {
    return buildFlexBubble({
      title: '✅ งานซ่อมเสร็จสิ้น',
      subtitle: requestId,
      headerColor: '#15803d',
      rows: [
        { label: '📋 เลขที่', value: requestId, valueWeight: 'bold' },
        { label: '📝 รายการ', value: title },
        { label: '🔧 ผลการซ่อม', value: repairResult || 'เรียบร้อย' },
      ],
      altText: `✅ งานซ่อมเสร็จสิ้น: ${requestId}`,
    })
  }

  return {
    type: 'flex',
    altText: `งานซ่อมเสร็จสิ้น: ${requestId}`,
    contents: {
      type: 'carousel',
      contents: bubbles,
    },
  }
}
