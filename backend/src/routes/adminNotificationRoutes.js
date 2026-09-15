import express from 'express'
import { broadcastNotification, getNotificationHistory } from '../controllers/adminNotificationController.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Protect all routes with auth and operator role
router.use(requireAuth, requireRole('operator'))

router.post('/', broadcastNotification)
router.get('/', getNotificationHistory)

export default router
