/**
 * User Routes — เส้นทางจัดการผู้ใช้งานในระบบ (CRUD)
 */
import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { listTechnicians, listUsers, createUser, updateUser, deleteUser, toggleUserStatus } from '../controllers/userController.js'

const router = Router()

// ดึงรายชื่อช่างซ่อม (สำหรับ dropdown มอบหมายงาน)
router.get('/technicians', requireAuth, asyncHandler(listTechnicians))

// ดึงรายชื่อผู้ใช้ทั้งหมด (เฉพาะ Operator)
router.get('/', requireAuth, requireRole('operator'), asyncHandler(listUsers))

// สร้างผู้ใช้ใหม่ (เฉพาะ Operator)
router.post('/', requireAuth, requireRole('operator'), asyncHandler(createUser))

// แก้ไขข้อมูลผู้ใช้ (เฉพาะ Operator)
router.put('/:role/:id', requireAuth, requireRole('operator'), asyncHandler(updateUser))

// ลบผู้ใช้ (เฉพาะ Operator)
router.delete('/:role/:id', requireAuth, requireRole('operator'), asyncHandler(deleteUser))

// เปิด/ปิด สถานะการใช้งาน (เฉพาะ Operator)
router.patch('/:role/:id/toggle-status', requireAuth, requireRole('operator'), asyncHandler(toggleUserStatus))

export default router
