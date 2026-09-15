import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { updateProfile } from '../controllers/profileController.js'

const router = Router()

// อัปเดตข้อมูลส่วนตัว (รับค่า name, phone, email, avatar_url, password)
router.put('/', requireAuth, asyncHandler(updateProfile))

export default router
