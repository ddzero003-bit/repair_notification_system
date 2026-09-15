/**
 * LINE Client — ตัวเชื่อมต่อกับ LINE Messaging API
 *
 * ไฟล์นี้สร้าง LINE Client ที่ใช้ส่งข้อความหาผู้ใช้ผ่าน LINE
 * โดยใช้ Channel Access Token และ Channel Secret ที่ได้จาก LINE Developers Console
 */
import * as line from '@line/bot-sdk'
import dotenv from 'dotenv'
dotenv.config()

// ค่าคอนฟิกสำหรับเชื่อมต่อ LINE — อ่านจากไฟล์ .env
export const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
}

// สร้าง LINE Messaging API Client สำหรับส่งข้อความ (Push/Reply)
export const lineClient = new line.messagingApi.MessagingApiClient({
  channelAccessToken: lineConfig.channelAccessToken,
})

export default lineClient
