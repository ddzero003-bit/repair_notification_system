import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// นำเข้า Routes ต่างๆ สำหรับระบบ
import authRoutes from './routes/authRoutes.js'
import repairRoutes from './routes/repairRoutes.js'
import userRoutes from './routes/userRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import webhookRoutes from './routes/webhookRoutes.js'
import publicRepairRoutes from './routes/publicRepairRoutes.js'
import adminNotificationRoutes from './routes/adminNotificationRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import profileRoutes from './routes/profileRoutes.js'

// ตั้งค่า Path อ้างอิงสำหรับ ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// โหลด Environment Variables จากไฟล์ .env
dotenv.config()
const app = express()

// Middleware: อนุญาต CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning', 'X-Requested-With', 'Accept'],
  })
)

// ⚠️ สำคัญ: LINE Webhook ต้องวางก่อน express.json()
// เพราะ LINE SDK ต้องการอ่าน raw body เพื่อตรวจสอบ Signature (ป้องกันปลอมแปลง)
app.use('/api/webhook', webhookRoutes)
app.use('/api/webhook/line', webhookRoutes)

// Middleware: อ่าน Request Body เป็น JSON (เพิ่ม limit 5mb สำหรับรองรับรูปภาพหรือข้อมูลขนาดใหญ่)
app.use(express.json({ limit: '5mb' }))

// Middleware: แสดง Log การเรียกใช้ HTTP API ในหน้า Console ด้วย format morgan 'dev'
app.use(morgan('dev'))

// Health Check Endpoint: สำหรับตรวจสอบว่า Backend API พร้อมใช้งานหรือไม่
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'repair-line-oa-backend' }))

// Serve Static Files: ให้ภายนอกสามารถเข้าถึงไฟล์รูปภาพในโฟลเดอร์ uploads ผ่าน URL เช่น http://localhost:3000/uploads/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// ประกาศใช้งาน Routes ของระบบ
app.use('/api/auth', authRoutes)        // ระบบยืนยันตัวตน (Login, Register, LINE Login)
app.use('/api/repairs', repairRoutes)   // ระบบจัดการคำขอแจ้งซ่อมและสถิติ
app.use('/api/users', userRoutes)       // ระบบจัดการผู้ใช้งานและช่างซ่อม
app.use('/api/upload', uploadRoutes)    // ระบบอัปโหลดรูปภาพ
app.use('/api/public', publicRepairRoutes) // ระบบแจ้งซ่อมสาธารณะ (ไม่ต้องล็อกอิน)
app.use('/api/admin/notifications', adminNotificationRoutes) // ระบบ Admin Notification Broadcast
app.use('/api/notifications', notificationRoutes) // ระบบ In-App Notification
app.use('/api/profile', profileRoutes) // ระบบจัดการโปรไฟล์

// Serve Frontend SPA Build
const frontendDist = path.join(__dirname, '../../frontend/dist')
app.use(express.static(frontendDist))
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next()
  res.sendFile(path.join(frontendDist, 'index.html'))
})

// Central Error Handler: ตัวจัดการ Error ตรงกลางของ Express เพื่อคืนค่า Error message ที่อ่านง่าย
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'เกิดข้อผิดพลาดในระบบ' })
})

// เริ่มต้นรันเซิร์ฟเวอร์ Express API ที่พอร์ต 3000 (หรือตาม PORT ใน .env)
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`🚀 API running at http://localhost:${PORT}`))
