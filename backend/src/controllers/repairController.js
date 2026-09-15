import { query } from '../config/db.js'
import { notifyNewRepairToOperators, notifyAssignmentToTechnician, notifyStatusChangeToUser, notifyRepairCompleted, notifyRejectionToOperators, pushMessage, buildRepairCompletedFlexMessage } from '../utils/lineNotify.js'

/**
 * แปลงข้อมูลจาก Format ของตารางในฐานข้อมูล (snake_case)
 * ให้กลายเป็น Format Object สำหรับ Frontend (camelCase)
 */
function toClientShape(row) {
  return {
    id: row.request_id,
    title: row.title,
    category: row.repair_type, // electricity | water
    description: row.problem_desc,
    community: row.community,
    location: row.location_name,
    coords: row.latitude != null ? { lat: Number(row.latitude), lng: Number(row.longitude) } : null,
    priority: row.priority, // low | normal | high | urgent
    contactPhone: row.contact_phone,
    images: row.images_before || [],
    imagesAfter: row.images_after || [],
    repairResult: row.repair_result,
    status: row.status_code, // reported | accepted | assigned | in_progress | completed | cancelled
    reporterId: row.user_id,
    reporterName: row.reporter_name || null,
    technicianId: row.technician_id || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at || row.created_at,
  }
}

/**
 * ฟังก์ชันสร้างรหัสแจ้งซ่อมถัดไปแบบอัตโนมัติ
 * รูปแบบ: SR2569-001 (SR + ปี พ.ศ. + รหัสลำดับ 3 หลัก)
 */
async function nextRequestId() {
  const year = new Date().getFullYear() + 543 // แปลงปี ค.ศ. เป็น ปี พ.ศ. (เช่น 2026 -> 2569)
  const res = await query(`SELECT COUNT(*)::int AS count FROM tb_repairrequest WHERE request_id LIKE $1`, [`SR${year}-%`])
  const seq = res.rows[0].count + 1
  return `SR${year}-${String(seq).padStart(3, '0')}`
}

/**
 * ดึงรายการคำขอแจ้งซ่อมทั้งหมด (รองรับตัวกรอง status, category, reporterId, technicianId, search)
 */
export async function list(req, res) {
  const { status, category, reporterId, technicianId, search } = req.query
  const conditions = []
  const params = []

  // ดึงรายการคำขอแจ้งซ่อมพร้อมช่างซ่อมคนล่าสุดที่ได้รับมอบหมาย
  let sql = `
    SELECT r.*, a.technician_id, u.name AS reporter_name
    FROM tb_repairrequest r
    LEFT JOIN LATERAL (
      SELECT technician_id FROM tb_repairassignment
      WHERE request_id = r.request_id ORDER BY assigned_date DESC LIMIT 1
    ) a ON true
    LEFT JOIN tb_user u ON r.user_id = u.user_id
  `

  // กรองตามสถานะ
  if (status) { params.push(status); conditions.push(`r.status_code = $${params.length}`) }
  // กรองตามหมวดหมู่ปัญหา (electricity / water)
  if (category) { params.push(category); conditions.push(`r.repair_type = $${params.length}`) }
  // กรองตามผู้แจ้ง
  if (reporterId) { params.push(reporterId); conditions.push(`r.user_id = $${params.length}`) }
  // กรองตามช่างซ่อม
  if (technicianId) { params.push(technicianId); conditions.push(`a.technician_id = $${params.length}`) }
  // ค้นหาตามรหัสคำขอ หรือ หัวข้อปัญหา
  if (search) { params.push(`%${search.toLowerCase()}%`); conditions.push(`(LOWER(r.request_id) LIKE $${params.length} OR LOWER(r.title) LIKE $${params.length})`) }

  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ')
  sql += ' ORDER BY r.created_at DESC'

  const result = await query(sql, params)
  res.json(result.rows.map(toClientShape))
}

/**
 * ดึงรายละเอียดคำขอแจ้งซ่อมตาม ID (เช่น SR2569-001)
 */
export async function getById(req, res) {
  const result = await query(
    `SELECT r.*, a.technician_id, u.name AS reporter_name FROM tb_repairrequest r
     LEFT JOIN LATERAL (
       SELECT technician_id FROM tb_repairassignment WHERE request_id = r.request_id ORDER BY assigned_date DESC LIMIT 1
     ) a ON true
     LEFT JOIN tb_user u ON r.user_id = u.user_id
     WHERE r.request_id = $1`,
    [req.params.id.toUpperCase()]
  )
  if (!result.rows.length) return res.status(404).json({ message: 'ไม่พบคำขอแจ้งซ่อม' })
  res.json(toClientShape(result.rows[0]))
}

/**
 * สร้างรายการแจ้งซ่อมใหม่ (สำหรับ Citizen)
 */
export async function create(req, res) {
  const { title, category, description, community, location, coords, priority, contactPhone, reporterId, images } = req.body
  const id = await nextRequestId() // สร้างรหัสแจ้งซ่อมอัตโนมัติ

  const result = await query(
    `INSERT INTO tb_repairrequest
      (request_id, user_id, repair_type, title, problem_desc, community, location_name, latitude, longitude, priority, contact_phone, images_before, status_code)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'reported')
     RETURNING *`,
    [id, reporterId, category, title, description, community || null, location || null,
      coords?.lat ?? null, coords?.lng ?? null, priority || 'normal', contactPhone, images || []]
  )
  const repairData = toClientShape(result.rows[0])
  res.status(201).json(repairData)

  // แจ้งเตือน Operator ทุกคนผ่าน LINE (ทำแบบ async — ไม่ block response)
  notifyNewRepairToOperators(repairData).catch((err) => console.error('[LINE] notify error:', err))
}

/**
 * มอบหมายงานให้ช่างซ่อม (สำหรับ Operator/Admin)
 */
export async function assignTechnician(req, res) {
  const { id } = req.params
  const { technicianId, priority, operatorId, note } = req.body

  // ใช้ Database Transaction เพื่อให้แน่ใจว่าบันทึกทั้งการตั้งค่าช่างและการอัปเดตสถานะพร้อมกัน
  await query('BEGIN')
  try {
    // 1. บันทึกประวัติการมอบหมายลงใน tb_repairassignment
    await query(
      `INSERT INTO tb_repairassignment (request_id, technician_id, operator_id, note) VALUES ($1,$2,$3,$4)`,
      [id, technicianId, operatorId || req.user?.id, note || null]
    )
    // 2. อัปเดตสถานะงานแจ้งซ่อมเป็น 'assigned' (มอบหมายงานแล้ว) และล้างเหตุผลการปฏิเสธเดิมหากมี
    await query(
      `UPDATE tb_repairrequest 
       SET status_code = 'assigned', 
           priority = COALESCE($2, priority),
           repair_result = CASE WHEN repair_result LIKE '[ปฏิเสธ]%' THEN NULL ELSE repair_result END,
           updated_at = NOW() 
       WHERE request_id = $1`,
      [id, priority]
    )
    await query('COMMIT')
  } catch (err) {
    await query('ROLLBACK')
    throw err
  }

  const updated = await query('SELECT * FROM tb_repairrequest WHERE request_id = $1', [id])
  const repairData = toClientShape({ ...updated.rows[0], technician_id: technicianId })
  res.json(repairData)

  // แจ้งช่างซ่อมผ่าน In-app notification และ LINE ว่าได้รับมอบหมายงาน
  try {
    await query(
      `INSERT INTO tb_notification (recipient_id, recipient_role, request_id, type, title, message)
       VALUES ($1, 'technician', $2, 'new_assignment', 'มอบหมายงานใหม่', $3)`,
      [technicianId, id, `คุณได้รับมอบหมายงานแจ้งซ่อมใหม่: ${repairData.title}`]
    )
    await notifyAssignmentToTechnician(repairData, technicianId)
  } catch (err) {
    console.error('[Notification] Error in assignTechnician:', err)
  }
}

/**
 * ช่างปฏิเสธงานที่ได้รับมอบหมาย
 * - เปลี่ยนสถานะเป็น rejected
 * - บันทึกเหตุผลปฏิเสธ
 * - แจ้ง Operator ผ่าน LINE
 */
export async function rejectAssignment(req, res) {
  const { id } = req.params
  const { reason } = req.body
  const techId = req.user?.id

  // อัปเดตสถานะเป็น rejected พร้อมบันทึกเหตุผล
  await query(
    `UPDATE tb_repairrequest SET status_code = 'rejected', repair_result = $2, updated_at = NOW() WHERE request_id = $1`,
    [id, reason ? `[ปฏิเสธ] ${reason}` : '[ปฏิเสธ] ไม่ระบุเหตุผล']
  )

  const result = await query('SELECT * FROM tb_repairrequest WHERE request_id = $1', [id])
  const repairData = toClientShape(result.rows[0])
  res.json(repairData)

  // ดึงชื่อช่างแล้วแจ้ง Operator ผ่าน LINE
  const tech = await query('SELECT name FROM tb_technician WHERE technician_id = $1', [techId])
  const techName = tech.rows[0]?.name || 'ไม่ทราบ'
  notifyRejectionToOperators(repairData, techName, reason).catch((err) => console.error('[LINE] notify error:', err))
}

/**
 * อัปเดตสถานะงานซ่อม (สำหรับ Technician และ Operator)
 * เช่น อัปเดตเป็น in_progress (กำลังซ่อม) หรือ completed (เสร็จสิ้น พร้อมรูปหลังซ่อม)
 */
export async function updateStatus(req, res) {
  const { id } = req.params
  const { status, repairResult, imagesAfter } = req.body

  // ตรวจสอบข้อมูลบังคับก่อนบันทึกงานเสร็จสิ้น
  if (status === 'completed') {
    if (!repairResult || !repairResult.trim()) {
      return res.status(400).json({ message: 'กรุณากรอกรายละเอียดการซ่อมก่อนบันทึกงานเสร็จสิ้น' })
    }
    if (!imagesAfter || imagesAfter.length === 0) {
      return res.status(400).json({ message: 'กรุณาแนบรูปภาพหลังซ่อมอย่างน้อย 1 รูปก่อนบันทึกงานเสร็จสิ้น' })
    }
  }

  await query(
    `UPDATE tb_repairrequest
     SET status_code = $2, repair_result = COALESCE($3, repair_result),
         images_after = COALESCE($4, images_after), updated_at = NOW()
     WHERE request_id = $1`,
    [id, status, repairResult || null, imagesAfter || null]
  )

  // ถ้าซ่อมเสร็จสิ้น (completed) ให้บันทึกเวลาเสร็จสิ้นใน tb_repairassignment
  if (status === 'completed') {
    await query(`UPDATE tb_repairassignment SET completed_date = NOW() WHERE request_id = $1`, [id])
  }

  const result = await query('SELECT * FROM tb_repairrequest WHERE request_id = $1', [id])
  const repairData = toClientShape(result.rows[0])
  res.json(repairData)

  // แจ้งเตือนผู้แจ้งผ่าน LINE เมื่อสถานะเปลี่ยน
  if (status === 'completed') {
    try {
      // In-app notification for citizen
      await query(
        `INSERT INTO tb_notification (recipient_id, recipient_role, request_id, type, title, message)
         VALUES ($1, 'citizen', $2, 'status_update', 'งานซ่อมเสร็จสิ้น', $3)`,
        [repairData.reporterId, id, `รายการ ${repairData.title} เสร็จสิ้นเรียบร้อยแล้ว`]
      )

      // Send Flex Message to Citizen
      const userRes = await query('SELECT line_id FROM tb_user WHERE user_id = $1', [repairData.reporterId])
      const userLineId = userRes.rows[0]?.line_id
      
      if (userLineId) {
        const flexMsg = buildRepairCompletedFlexMessage({
          title: repairData.title,
          community: repairData.community,
          repairResult: repairData.repairResult,
          imageUrls: repairData.imagesAfter,
          requestId: id
        })
        await pushMessage(userLineId, flexMsg)
      }

      // Notify operators as well (using existing basic text notification for ops inside notifyRepairCompleted)
      // Actually we can just call notifyRepairCompleted, but it also notifies the citizen with a basic text.
      // Since we just sent a flex message, we can just notify operators directly here.
      const ops = await query(`SELECT line_id FROM tb_operator WHERE status = 'active' AND line_id IS NOT NULL`)
      const opMsg = {
        type: 'text',
        text: `✅ งานซ่อมเสร็จสิ้น\n📋 ${id} — ${repairData.title}\n📊 สถานะ: เสร็จสิ้น`
      }
      for (const op of ops.rows) {
        await pushMessage(op.line_id, opMsg)
      }

    } catch (err) {
      console.error('[Notification] Error in updateStatus (completed):', err)
    }
  } else {
    // สถานะอื่นๆ → แจ้งผู้แจ้ง
    notifyStatusChangeToUser(repairData, status).catch((err) => console.error('[LINE] notify error:', err))
  }
}

/**
 * ดึงข้อมูลสถิติสำหรับหน้า Dashboard ของ Operator
 * รวบรวมสถิติจำนวนงานตามสถานะ, แยกตามประเภท (ไฟฟ้า/ประปา), และแนวโน้มรายเดือน
 */
export async function getStats(req, res) {
  // สรุปจำนวนงานแยกตามสถานะ
  const counts = await query(`
    SELECT status_code, COUNT(*)::int AS count FROM tb_repairrequest GROUP BY status_code
  `)
  // สรุปจำนวนงานแยกตามประเภทปัญหา (ไฟฟ้า / ประปา)
  const byCategory = await query(`
    SELECT repair_type AS category, COUNT(*)::int AS count FROM tb_repairrequest GROUP BY repair_type ORDER BY count DESC
  `)
  // สรุปแนวโน้มจำนวนงานแจ้งซ่อมย้อนหลัง 6 เดือน
  const monthlyTrend = await query(`
    SELECT to_char(created_at, 'Mon') AS month, COUNT(*)::int AS count
    FROM tb_repairrequest
    WHERE created_at > NOW() - INTERVAL '6 months'
    GROUP BY 1, date_trunc('month', created_at)
    ORDER BY date_trunc('month', created_at)
  `)
  const map = Object.fromEntries(counts.rows.map((r) => [r.status_code, r.count]))
  res.json({
    pending: (map.reported || 0) + (map.accepted || 0) + (map.assigned || 0),
    inProgress: map.in_progress || 0,
    completed: map.completed || 0,
    cancelled: (map.cancelled || 0) + (map.rejected || 0),
    byCategory: byCategory.rows,
    monthlyTrend: monthlyTrend.rows,
  })
}
