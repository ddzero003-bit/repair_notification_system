import bcrypt from 'bcryptjs'
import { query } from '../config/db.js'

/**
 * ดึงชื่อตารางและ PK ตามบทบาทของผู้ใช้ (citizen, operator, technician)
 */
function getTableInfo(role) {
  if (role === 'operator') return { table: 'tb_operator', idCol: 'operator_id' }
  if (role === 'technician') return { table: 'tb_technician', idCol: 'technician_id' }
  return { table: 'tb_user', idCol: 'user_id' }
}

/**
 * อัปเดตข้อมูลส่วนตัว (ชื่อ, เบอร์โทร, อีเมล, รหัสผ่าน, รูปโปรไฟล์)
 */
export async function updateProfile(req, res) {
  const { id, role } = req.user
  const { name, phone, email, avatar_url, password } = req.body

  const { table, idCol } = getTableInfo(role)

  let sql = `UPDATE ${table} SET `
  const values = []
  let paramIdx = 1

  const addField = (field, value) => {
    sql += `${field} = $${paramIdx}, `
    values.push(value)
    paramIdx++
  }

  if (name !== undefined) addField('name', name || null)
  if (phone !== undefined) addField('phone', phone || null)
  if (email !== undefined) addField('email', email || null)
  if (avatar_url !== undefined) addField('avatar_url', avatar_url || null)

  if (values.length === 0 && !password) {
    return res.status(400).json({ message: 'ไม่มีข้อมูลให้อัปเดต' })
  }

  // หากมีการเปลี่ยนรหัสผ่าน
  if (password) {
    const passwordHash = await bcrypt.hash(password, 10)
    addField('password_hash', passwordHash)
  }

  // ลบ comma ตัวสุดท้าย
  sql = sql.slice(0, -2)
  sql += ` WHERE ${idCol} = $${paramIdx} RETURNING *`
  values.push(id)

  try {
    const result = await query(sql, values)
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' })
    }
    const updatedUser = result.rows[0]
    // ลบรหัสผ่านออกจาก response
    delete updatedUser.password_hash

    res.json({ message: 'อัปเดตโปรไฟล์สำเร็จ', user: updatedUser })
  } catch (err) {
    console.error('Update profile error:', err)
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์' })
  }
}
