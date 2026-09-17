import bcrypt from 'bcryptjs'
import { query } from '../config/db.js'
import { signToken } from '../utils/jwt.js'
import { verifyLineAccessToken, getLineProfile } from '../utils/lineAuth.js'

/**
 * ฟังก์ชันสำหรับการเข้าสู่ระบบ (Login)
 * รองรับทั้ง 3 บทบาท: Operator (หัวหน้าช่าง/แอดมิน), Technician (ช่างซ่อม), และ Citizen (ประชาชนผู้แจ้งซ่อม)
 */
export async function login(req, res) {
  const { username, password } = req.body

  // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
  if (!username || !password) {
    return res.status(400).json({ message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' })
  }

  try {
    // 1. ค้นหาในตาราง tb_operator (บทบาท หัวหน้าช่าง / แอดมิน)
    const opRes = await query('SELECT * FROM tb_operator WHERE username = $1', [username])
    if (opRes.rows.length) {
      const row = opRes.rows[0]
      // เปรียบเทียบรหัสผ่าน plaintext กับ bcrypt password_hash ในฐานข้อมูล
      const ok = await bcrypt.compare(password, row.password_hash)
      if (!ok) return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' })
      if (row.status !== 'active') return res.status(403).json({ message: 'บัญชีนี้ถูกปิดใช้งาน' })

      const user = { id: row.operator_id, name: row.name, username: row.username, role: 'operator', phone: row.phone, email: row.email, avatar_url: row.avatar_url }
      // สร้าง JWT Token คืนค่ากลับไปให้ Frontend
      return res.json({ user, token: signToken({ id: user.id, role: 'operator' }) })
    }

    // 2. ค้นหาในตาราง tb_technician (บทบาท ช่างซ่อม)
    const techRes = await query('SELECT * FROM tb_technician WHERE username = $1', [username])
    if (techRes.rows.length) {
      const row = techRes.rows[0]
      const ok = await bcrypt.compare(password, row.password_hash)
      if (!ok) return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' })
      if (row.status !== 'active') return res.status(403).json({ message: 'บัญชีนี้ถูกปิดใช้งาน' })

      const user = { id: row.technician_id, name: row.name, username: row.username, role: 'technician', phone: row.phone, specialty: row.specialty, email: row.email, avatar_url: row.avatar_url }
      return res.json({ user, token: signToken({ id: user.id, role: 'technician' }) })
    }

    // 3. ค้นหาในตาราง tb_user (บทบาท ประชาชน/ผู้แจ้งซ่อม)
    const userRes = await query('SELECT * FROM tb_user WHERE username = $1', [username])
    if (userRes.rows.length) {
      const row = userRes.rows[0]
      if (!row.password_hash) return res.status(401).json({ message: 'บัญชีนี้ใช้ LINE Login เท่านั้น' })
      const ok = await bcrypt.compare(password, row.password_hash)
      if (!ok) return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' })

      const user = { id: row.user_id, name: row.name, username: row.username, role: 'citizen', phone: row.phone, email: row.email, avatar_url: row.avatar_url }
      return res.json({ user, token: signToken({ id: user.id, role: 'citizen' }) })
    }

    // หากไม่พบชื่อผู้ใช้ในทั้ง 3 ตาราง
    return res.status(401).json({ message: 'ไม่พบบัญชีผู้ใช้นี้ในระบบ' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' })
  }
}

/**
 * ฟังก์ชันสำหรับเข้าสู่ระบบด้วย LINE LIFF
 * ยืนยัน Access Token กับเซิร์ฟเวอร์ LINE แล้วค้นหาหรือสร้างผู้ใช้ใหม่ใน tb_user อัตโนมัติ
 */
export async function lineLogin(req, res) {
  const { accessToken, profile } = req.body
  if (!accessToken) return res.status(400).json({ message: 'ไม่พบ access token จาก LIFF' })

  try {
    // ยืนยันความถูกต้องของ LINE access token
    await verifyLineAccessToken(accessToken)
    const lineProfile = profile || (await getLineProfile(accessToken))

    // ตรวจสอบว่ามี line_id นี้ในระบบแล้วหรือยัง
    const existing = await query('SELECT * FROM tb_user WHERE line_id = $1', [lineProfile.userId])
    let row
    if (existing.rows.length) {
      row = existing.rows[0]
    } else {
      // ถ้ายังไม่มี ให้ลงทะเบียนผู้ใช้ใหม่โดยอัตโนมัติ
      const inserted = await query(
        `INSERT INTO tb_user (line_id, name) VALUES ($1, $2) RETURNING *`,
        [lineProfile.userId, lineProfile.displayName || 'ผู้ใช้ LINE']
      )
      row = inserted.rows[0]
    }

    const user = { id: row.user_id, name: row.name, role: 'citizen', phone: row.phone, lineId: row.line_id, email: row.email, avatar_url: row.avatar_url }
    return res.json({ user, token: signToken({ id: user.id, role: 'citizen' }) })
  } catch (err) {
    console.error(err.response?.data || err)
    return res.status(401).json({ message: 'ยืนยันตัวตนกับ LINE ไม่สำเร็จ' })
  }
}

/**
 * ฟังก์ชันสำหรับการลงทะเบียนผู้ใช้ใหม่ (Register)
 * บันทึกข้อมูลแยกตามบทบาท (operator -> tb_operator, technician -> tb_technician, citizen -> tb_user)
 */
export async function register(req, res) {
  const { name, username, phone, password, role, specialty } = req.body

  if (!name || !username || !password) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' })
  }
  if (password.length < 3) {
    return res.status(400).json({ message: 'รหัสผ่านต้องมีอย่างน้อย 3 ตัวอักษร' })
  }

  try {
    // เข้ารหัสรหัสผ่านด้วย bcrypt (salt 10 rounds)
    const passwordHash = await bcrypt.hash(password, 10)

    if (role === 'operator') {
      // ตรวจสอบชื่อผู้ใช้ซ้ำใน tb_operator
      const dup = await query('SELECT 1 FROM tb_operator WHERE username = $1', [username])
      if (dup.rows.length) return res.status(409).json({ message: 'ชื่อผู้ใช้นี้มีอยู่แล้วในระบบ' })

      const result = await query(
        `INSERT INTO tb_operator (username, password_hash, name, phone) VALUES ($1,$2,$3,$4) RETURNING *`,
        [username, passwordHash, name, phone || null]
      )
      const row = result.rows[0]
      const user = { id: row.operator_id, name: row.name, username: row.username, role: 'operator', phone: row.phone, email: row.email, avatar_url: row.avatar_url }
      return res.status(201).json({ user, token: signToken({ id: user.id, role: 'operator' }) })

    } else if (role === 'technician') {
      // ตรวจสอบชื่อผู้ใช้ซ้ำใน tb_technician
      const dup = await query('SELECT 1 FROM tb_technician WHERE username = $1', [username])
      if (dup.rows.length) return res.status(409).json({ message: 'ชื่อผู้ใช้นี้มีอยู่แล้วในระบบ' })

      const result = await query(
        `INSERT INTO tb_technician (username, password_hash, name, phone, specialty) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [username, passwordHash, name, phone || null, specialty ? specialty.trim() : null]
      )
      const row = result.rows[0]
      const user = { id: row.technician_id, name: row.name, username: row.username, role: 'technician', phone: row.phone, specialty: row.specialty, email: row.email, avatar_url: row.avatar_url }
      return res.status(201).json({ user, token: signToken({ id: user.id, role: 'technician' }) })

    } else {
      // ลงทะเบียนประชาชน (Citizen -> tb_user)
      const dup = await query('SELECT 1 FROM tb_user WHERE username = $1', [username])
      if (dup.rows.length) return res.status(409).json({ message: 'ชื่อผู้ใช้นี้มีอยู่แล้วในระบบ' })

      const result = await query(
        `INSERT INTO tb_user (username, password_hash, name, phone) VALUES ($1,$2,$3,$4) RETURNING *`,
        [username, passwordHash, name, phone || null]
      )
      const row = result.rows[0]
      const user = { id: row.user_id, name: row.name, username: row.username, role: 'citizen', phone: row.phone, email: row.email, avatar_url: row.avatar_url }
      return res.status(201).json({ user, token: signToken({ id: user.id, role: 'citizen' }) })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' })
  }
}
