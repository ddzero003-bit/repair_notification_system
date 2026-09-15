/**
 * Webhook Routes — เส้นทางสำหรับรับ Event จาก LINE Platform
 *
 * LINE จะส่ง HTTP POST มาที่ /api/webhook ทุกครั้งที่มีผู้ใช้ส่งข้อความมาที่ LINE OA
 * Middleware ของ LINE SDK จะตรวจสอบ Signature เพื่อให้แน่ใจว่า request มาจาก LINE จริง
 */
import { Router } from 'express'
import * as line from '@line/bot-sdk'
import { lineConfig } from '../utils/lineClient.js'
import { handleWebhook } from '../controllers/webhookController.js'

const router = Router()

/**
 * POST /api/webhook
 * LINE Middleware จะ:
 * 1. ตรวจสอบ X-Line-Signature header (ป้องกันปลอมแปลง)
 * 2. Parse raw body เป็น JSON
 * 3. ส่งต่อให้ handleWebhook ทำงาน
 */
router.post('/', line.middleware(lineConfig), handleWebhook)

export default router
