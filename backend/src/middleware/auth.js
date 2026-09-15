import { verifyToken } from '../utils/jwt.js'

/**
 * Middleware สำหรับตรวจสอบว่าผู้ใช้ได้ส่ง JWT Bearer Token มาใน HTTP Header หรือไม่
 * ใช้ป้องกัน Route ที่ต้องการสิทธิ์การเข้าถึง (Protected Routes)
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'ไม่ได้เข้าสู่ระบบ' })
  }
  try {
    // ถอดรหัสโทเคนเพื่อรับข้อมูลผู้ใช้ { id, role }
    const payload = verifyToken(header.split(' ')[1])
    req.user = payload // แนบข้อมูลผู้ใช้ไปกับ Request Object
    next()
  } catch {
    return res.status(401).json({ message: 'โทเคนไม่ถูกต้องหรือหมดอายุ' })
  }
}

/**
 * Middleware สำหรับตรวจสอบบทบาทของผู้ใช้ (Role-based Authorization)
 * ตัวอย่างการใช้งาน: requireRole('operator', 'technician')
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึงส่วนนี้' })
    }
    next()
  }
}
