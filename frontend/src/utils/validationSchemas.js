/**
 * validationSchemas.js — รวม Yup Schemas ทุก Form ไว้ที่เดียว
 * ใช้ร่วมกับ react-hook-form + @hookform/resolvers/yup
 */
import * as yup from 'yup'

// ── ตัวช่วย ──────────────────────────────────────────────────────
const PHONE_REGEX = /^0[0-9]{8,9}$/          // 09-10 หลัก ขึ้นต้นด้วย 0
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/ // a-z A-Z 0-9 _

// ── Login ─────────────────────────────────────────────────────────
export const loginSchema = yup.object({
  username: yup
    .string()
    .required('กรุณากรอกชื่อผู้ใช้')
    .min(3, 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร'),
  password: yup
    .string()
    .required('กรุณากรอกรหัสผ่าน')
    .min(1, 'กรุณากรอกรหัสผ่าน'),
})

// ── Register ──────────────────────────────────────────────────────
export const registerSchema = yup.object({
  name: yup
    .string()
    .required('กรุณากรอกชื่อ-นามสกุล')
    .min(3, 'ชื่อ-นามสกุลต้องมีอย่างน้อย 3 ตัวอักษร'),
  username: yup
    .string()
    .required('กรุณากรอกชื่อผู้ใช้')
    .matches(USERNAME_REGEX, 'ชื่อผู้ใช้ใช้ได้แค่ a-z, A-Z, 0-9 และ _ (3-30 ตัว)'),
  phone: yup
    .string()
    .required('กรุณากรอกเบอร์โทรศัพท์')
    .matches(PHONE_REGEX, 'เบอร์โทรไม่ถูกต้อง (ตัวอย่าง: 0812345678)'),
  role: yup.string().required('กรุณาเลือกประเภทผู้ใช้'),
  password: yup
    .string()
    .required('กรุณากรอกรหัสผ่าน')
    .min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
    .matches(/[A-Za-z]/, 'รหัสผ่านต้องมีตัวอักษรอย่างน้อย 1 ตัว')
    .matches(/[0-9]/, 'รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว'),
  confirmPassword: yup
    .string()
    .required('กรุณายืนยันรหัสผ่าน')
    .oneOf([yup.ref('password')], 'รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน'),
})

// ── CreateRepairRequest ───────────────────────────────────────────
export const createRepairSchema = yup.object({
  title: yup
    .string()
    .required('กรุณากรอกหัวข้อปัญหา')
    .min(5, 'หัวข้อปัญหาต้องมีอย่างน้อย 5 ตัวอักษร')
    .max(200, 'หัวข้อปัญหาต้องไม่เกิน 200 ตัวอักษร'),
  description: yup
    .string()
    .required('กรุณาอธิบายรายละเอียดปัญหา')
    .min(10, 'รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร'),
  contactPhone: yup
    .string()
    .required('กรุณากรอกเบอร์ติดต่อกลับ')
    .matches(PHONE_REGEX, 'เบอร์โทรไม่ถูกต้อง (ตัวอย่าง: 0812345678)'),
  category: yup.string().required('กรุณาเลือกประเภทปัญหา'),
})

// ── Profile (ข้อมูลส่วนตัว) ───────────────────────────────────────
export const profileSchema = yup.object({
  name: yup
    .string()
    .required('กรุณากรอกชื่อ-นามสกุล')
    .min(3, 'ชื่อ-นามสกุลต้องมีอย่างน้อย 3 ตัวอักษร'),
  phone: yup
    .string()
    .required('กรุณากรอกเบอร์โทรศัพท์')
    .matches(PHONE_REGEX, 'เบอร์โทรไม่ถูกต้อง (ตัวอย่าง: 0812345678)'),
  email: yup
    .string()
    .email('รูปแบบอีเมลไม่ถูกต้อง')
    .nullable()
    .transform((v) => (v === '' ? null : v)), // ยอมให้ว่างได้
})

// ── Profile (เปลี่ยนรหัสผ่าน) ────────────────────────────────────
export const changePasswordSchema = yup.object({
  current: yup.string().required('กรุณากรอกรหัสผ่านปัจจุบัน'),
  next: yup
    .string()
    .required('กรุณากรอกรหัสผ่านใหม่')
    .min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
    .matches(/[A-Za-z]/, 'รหัสผ่านต้องมีตัวอักษรอย่างน้อย 1 ตัว')
    .matches(/[0-9]/, 'รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว'),
  confirm: yup
    .string()
    .required('กรุณายืนยันรหัสผ่านใหม่')
    .oneOf([yup.ref('next')], 'รหัสผ่านใหม่และการยืนยันไม่ตรงกัน'),
})

// ── PublicReportForm ──────────────────────────────────────────────
export const publicReportSchema = yup.object({
  name: yup
    .string()
    .required('กรุณากรอกชื่อผู้แจ้งซ่อม')
    .min(3, 'ชื่อต้องมีอย่างน้อย 3 ตัวอักษร'),
  phone: yup
    .string()
    .required('กรุณากรอกเบอร์โทรศัพท์')
    .matches(PHONE_REGEX, 'เบอร์โทรไม่ถูกต้อง (ตัวอย่าง: 0812345678)'),
  locationName: yup
    .string()
    .required('กรุณาระบุจุดสังเกต / สถานที่')
    .min(3, 'สถานที่ต้องมีอย่างน้อย 3 ตัวอักษร'),
  problemDesc: yup
    .string()
    .required('กรุณาระบุรายละเอียดปัญหา')
    .min(10, 'รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร'),
})
