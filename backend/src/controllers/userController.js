import bcrypt from 'bcryptjs'
import { query } from '../config/db.js'

/**
 * ดึงรายชื่อช่างซ่อมทั้งหมดในระบบ (สำหรับให้ Operator เลือกมอบหมายงาน)
 */
export async function listTechnicians(req, res) {
  const result = await query(`SELECT technician_id AS id, name, phone, specialty, status FROM tb_technician ORDER BY name`)
  res.json(result.rows)
}

/**
 * ดึงรายชื่อผู้ใช้งานทั้งหมดในระบบจากทั้ง 3 ตาราง (tb_operator, tb_technician, tb_user)
 * สำหรับหน้าจัดการผู้ใช้ของ Operator / Admin
 */
export async function listUsers(req, res) {
  const [ops, techs, citizens] = await Promise.all([
    query(`SELECT operator_id AS id, name, username, phone, email, status, 'operator' AS role FROM tb_operator`),
    query(`SELECT technician_id AS id, name, username, phone, email, TRIM(specialty) AS specialty, status, 'technician' AS role FROM tb_technician`),
    query(`SELECT user_id AS id, name, username, phone, email, 'active' AS status, 'citizen' AS role FROM tb_user`),
  ])
  res.json([...ops.rows, ...techs.rows, ...citizens.rows])
}

/**
 * สร้างผู้ใช้ใหม่ (Operator หรือ Technician)
 * Citizen สมัครผ่านหน้า Register หรือ LINE Login แทน
 */
export async function createUser(req, res) {
  const { name, username, phone, email, password, role, specialty } = req.body

  if (!name || !username || !password || !role) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' })
  }

  // เข้ารหัสรหัสผ่านด้วย bcrypt
  const passwordHash = await bcrypt.hash(password, 10)

  if (role === 'operator') {
    // ตรวจสอบชื่อผู้ใช้ซ้ำ
    const dup = await query('SELECT 1 FROM tb_operator WHERE username = $1', [username])
    if (dup.rows.length) return res.status(409).json({ message: 'ชื่อผู้ใช้นี้มีอยู่แล้วในระบบ' })

    const result = await query(
      `INSERT INTO tb_operator (username, password_hash, name, phone, email)
       VALUES ($1,$2,$3,$4,$5) RETURNING operator_id AS id, name, username, phone, email, status`,
      [username, passwordHash, name, phone || null, email || null]
    )
    res.status(201).json({ ...result.rows[0], role: 'operator' })

  } else if (role === 'technician') {
    const dup = await query('SELECT 1 FROM tb_technician WHERE username = $1', [username])
    if (dup.rows.length) return res.status(409).json({ message: 'ชื่อผู้ใช้นี้มีอยู่แล้วในระบบ' })

    const result = await query(
      `INSERT INTO tb_technician (username, password_hash, name, phone, email, specialty)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING technician_id AS id, name, username, phone, email, specialty, status`,
      [username, passwordHash, name, phone || null, email || null, specialty || null]
    )
    res.status(201).json({ ...result.rows[0], role: 'technician' })

  } else {
    return res.status(400).json({ message: 'สามารถสร้างได้เฉพาะ operator หรือ technician' })
  }
}

/**
 * แก้ไขข้อมูลผู้ใช้ (ชื่อ, เบอร์โทร, อีเมล, ความชำนาญ, รหัสผ่าน)
 */
export async function updateUser(req, res) {
  const { role, id } = req.params
  const { name, phone, email, specialty, password } = req.body

  const table = role === 'operator' ? 'tb_operator' : role === 'technician' ? 'tb_technician' : 'tb_user'
  const idCol = role === 'operator' ? 'operator_id' : role === 'technician' ? 'technician_id' : 'user_id'

  // อัปเดตข้อมูลพื้นฐาน
  await query(
    `UPDATE ${table} SET name = COALESCE($1, name), phone = COALESCE($2, phone), email = COALESCE($3, email) WHERE ${idCol} = $4`,
    [name || null, phone || null, email || null, id]
  )

  // อัปเดต specialty (เฉพาะช่าง)
  if (role === 'technician' && specialty !== undefined) {
    await query(`UPDATE tb_technician SET specialty = $1 WHERE technician_id = $2`, [specialty, id])
  }

  // อัปเดตรหัสผ่าน (ถ้าส่งมา)
  if (password) {
    const hash = await bcrypt.hash(password, 10)
    await query(`UPDATE ${table} SET password_hash = $1 WHERE ${idCol} = $2`, [hash, id])
  }

  res.json({ message: 'อัปเดตข้อมูลสำเร็จ' })
}

/**
 * ลบผู้ใช้ออกจากระบบ
 */
export async function deleteUser(req, res) {
  const { role, id } = req.params
  const table = role === 'operator' ? 'tb_operator' : role === 'technician' ? 'tb_technician' : 'tb_user'
  const idCol = role === 'operator' ? 'operator_id' : role === 'technician' ? 'technician_id' : 'user_id'

  await query(`DELETE FROM ${table} WHERE ${idCol} = $1`, [id])
  res.json({ message: 'ลบผู้ใช้สำเร็จ' })
}

/**
 * เปิด/ปิด การใช้งานบัญชีผู้ใช้ (Toggle Active/Inactive Status)
 */
export async function toggleUserStatus(req, res) {
  const { role, id } = req.params
  const table = role === 'operator' ? 'tb_operator' : 'tb_technician'
  const idCol = role === 'operator' ? 'operator_id' : 'technician_id'
  const result = await query(
    `UPDATE ${table} SET status = CASE WHEN status = 'active' THEN 'inactive' ELSE 'active' END
     WHERE ${idCol} = $1 RETURNING status`,
    [id]
  )
  res.json(result.rows[0])
}
