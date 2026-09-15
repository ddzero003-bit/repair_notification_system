import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { asyncHandler } from '../utils/asyncHandler.js'

import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.join(__dirname, '../../uploads')

// สร้างโฟลเดอร์ uploads อัตโนมัติหากยังไม่มีในระบบ
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

/**
 * ตั้งค่าการจัดเก็บไฟล์บนดิสก์ด้วย Multer DiskStorage
 * ไฟล์จะถูกเก็บบันทึกไว้ที่โฟลเดอร์ backend/uploads/ พร้อมสุ่มตั้งชื่อไฟล์ใหม่เพื่อป้องกันชื่อซ้ำ
 */
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`
    cb(null, name)
  },
})

/**
 * ตั้งค่า Multer Upload (จำกัดขนาดไฟล์ไม่เกิน 25MB และรองรับรูปภาพทุกประเภท)
 */
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // ขนาดสูงสุด 25MB ต่อไฟล์
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype.startsWith('image/') || /jpeg|jpg|png|gif|webp|heic|heif|bmp/i.test(path.extname(file.originalname))
    cb(isImage ? null : new Error('อนุญาตเฉพาะไฟล์รูปภาพเท่านั้น'), isImage)
  },
})

const router = Router()

/**
 * POST /api/upload
 * Endpoint อัปโหลดรูปภาพ (รองรับสูงสุด 5 รูปต่อครั้ง)
 * ส่งคืน URL สัมพัทธ์สำหรับเข้าถึงรูปภาพ เช่น /uploads/172345678-123456.jpg
 */
router.post('/', upload.array('images', 5), asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'กรุณาเลือกไฟล์รูปภาพ' })
  }

  const urls = req.files.map((f) => `/uploads/${f.filename}`)
  res.json({ urls })
}))

export default router
