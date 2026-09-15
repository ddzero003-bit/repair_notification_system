import { Router } from 'express'
import { login, lineLogin, register } from '../controllers/authController.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()
router.post('/login', asyncHandler(login))
router.post('/line-login', asyncHandler(lineLogin))
router.post('/register', asyncHandler(register))

export default router
