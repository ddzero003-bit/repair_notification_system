/**
 * Public Repair Routes — เส้นทางสำหรับแจ้งซ่อมสาธารณะ (ไม่ต้องล็อกอิน)
 *
 * GET  /api/public/token     — Operator ขอสร้าง URL สำหรับส่งให้ประชาชน (ต้อง login)
 * POST /api/public/repairs   — ประชาชนส่งฟอร์มแจ้งซ่อม (ใช้ Token จาก URL)
 */
import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createReportToken, createPublicRepair, verifyToken } from '../controllers/publicRepairController.js'

const router = Router()

// Operator/Admin กด "สร้างลิงก์แจ้งซ่อม" เพื่อรับ URL พร้อม Token
router.get('/token', requireAuth, requireRole('operator'), asyncHandler(createReportToken))

// ตรวจสอบความถูกต้องของ Token (รองรับทั้ง Token Mode และ Rich Menu Mode)
router.get('/verify-token', asyncHandler(verifyToken))

// ประชาชนส่งฟอร์มแจ้งซ่อม (รองรับทั้งแบบมี token และไม่มี token)
router.post('/repairs', asyncHandler(createPublicRepair))

export default router
