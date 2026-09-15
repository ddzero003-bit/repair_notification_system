# 07 — คู่มือเชื่อม LINE OA (LINE Integration Guide)

## สิ่งที่ต้องเตรียม

### 1. LINE Official Account (LINE OA)
- สมัครที่ https://manager.line.biz/
- สร้าง Official Account (ฟรี)

### 2. LINE Developers Account
- สมัครที่ https://developers.line.biz/
- สร้าง **Provider**
- สร้าง **Messaging API Channel** (เชื่อมกับ LINE OA ที่สร้างไว้)

### 3. Credentials ที่ต้องใช้

| ค่า | หาได้จาก | ใส่ใน .env |
|-----|---------|-----------|
| Channel Secret | Basic settings | `LINE_CHANNEL_SECRET` |
| Channel Access Token | Messaging API → Issue | `LINE_CHANNEL_ACCESS_TOKEN` |
| LIFF ID | LIFF tab → Add | `LIFF_ID` |

---

## สถาปัตยกรรม LINE Integration

```
┌────────────────────────┐
│     LINE Platform      │
│                        │
│  User ส่งข้อความ       │
│         │              │
│         ▼              │
│  ┌─────────────────┐   │
│  │ Webhook Event   │───┼──► POST /api/webhook (Backend)
│  └─────────────────┘   │         │
│                        │         ├─ Parse message
│  ┌─────────────────┐   │         ├─ Save to DB
│  │ Reply API       │◄──┼─────── ├─ Reply to user
│  └─────────────────┘   │         │
│                        │         ▼
│  ┌─────────────────┐   │    Push to Operator
│  │ Push API        │◄──┼─── Push to Technician
│  └─────────────────┘   │    Push to User (status change)
│                        │
│  ┌─────────────────┐   │
│  │ LIFF            │───┼──► Frontend Web App (Login/Form)
│  └─────────────────┘   │
└────────────────────────┘
```

---

## Webhook Events ที่ต้อง Handle

### Message Events (ข้อความจากผู้ใช้)

| ประเภท | การจัดการ |
|--------|---------|
| **text** | วิเคราะห์ข้อความ → แจ้งซ่อม / ถามสถานะ / เมนู |
| **image** | ดาวน์โหลดรูป → แนบกับ repair request |
| **location** | บันทึก lat/lng → แนบกับ repair request |

### Flow การแจ้งซ่อมผ่าน Chat

```
User: "แจ้งซ่อมไฟฟ้า"
Bot:  "กรุณาอธิบายปัญหา"
User: "ไฟฟ้าดับหน้าซอย 5 ตั้งแต่เมื่อเช้า"
Bot:  "กรุณาส่งรูปภาพ (ถ้ามี) หรือพิมพ์ 'ข้าม'"
User: [ส่งรูป]
Bot:  "กรุณาส่งพิกัดตำแหน่ง (กดปุ่มแชร์ตำแหน่ง) หรือพิมพ์ที่อยู่"
User: [ส่ง location]
Bot:  "✅ บันทึกการแจ้งซ่อมสำเร็จ
       เลขที่: SR2569-001
       ประเภท: ไฟฟ้า
       สถานะ: แจ้งแล้ว
       เราจะแจ้งความคืบหน้าให้ทราบครับ"
```

---

## Push Notification Templates

### แจ้ง Operator — งานใหม่
```
🔔 มีการแจ้งซ่อมใหม่!
━━━━━━━━━━━━━━
📋 เลขที่: SR2569-001
⚡ ประเภท: ไฟฟ้า
📝 ไฟฟ้าดับหน้าซอย 5
📍 หมู่ 3 ต.สงเปลือย
⚠️ ความเร่งด่วน: สูง
━━━━━━━━━━━━━━
กดเพื่อมอบหมายงาน →
```

### แจ้ง Technician — ได้รับมอบหมาย
```
🔧 คุณได้รับมอบหมายงานซ่อม
━━━━━━━━━━━━━━
📋 เลขที่: SR2569-001
⚡ ประเภท: ไฟฟ้า
📝 ไฟฟ้าดับหน้าซอย 5
📍 หมู่ 3 ต.สงเปลือย
👤 ผู้แจ้ง: สมชาย ใจดี
📞 เบอร์: 081-234-5678
━━━━━━━━━━━━━━
[รับงาน]  [ปฏิเสธ]
```

### แจ้ง User — สถานะเปลี่ยน
```
📢 อัปเดตสถานะงานซ่อม
━━━━━━━━━━━━━━
📋 เลขที่: SR2569-001
📊 สถานะ: กำลังดำเนินการ 🔨
👷 ช่าง: วิชัย มั่นคง
━━━━━━━━━━━━━━
```

### แจ้ง User — ซ่อมเสร็จ
```
✅ งานซ่อมเสร็จสิ้น!
━━━━━━━━━━━━━━
📋 เลขที่: SR2569-001
⚡ ประเภท: ไฟฟ้า
🔧 ผลการซ่อม: เปลี่ยนหม้อแปลงใหม่
👷 ช่าง: วิชัย มั่นคง
━━━━━━━━━━━━━━
ขอบคุณที่แจ้งปัญหาครับ 🙏
```

---

## ไฟล์ที่ต้องสร้าง/แก้ไข

| ไฟล์ | ประเภท | คำอธิบาย |
|------|--------|---------|
| `backend/src/controllers/webhookController.js` | ใหม่ | Handle LINE webhook events |
| `backend/src/routes/webhookRoutes.js` | ใหม่ | Webhook route |
| `backend/src/utils/lineNotify.js` | ใหม่ | Push/Reply message functions |
| `backend/src/utils/lineAuth.js` | แก้ไข | เพิ่ม verify signature |
| `backend/src/server.js` | แก้ไข | เพิ่ม webhook route + raw body parser |
| `backend/.env` | แก้ไข | ใส่ credentials จริง |

---

## ตั้งค่า Webhook URL

ใน LINE Developers Console → Messaging API tab:
1. **Webhook URL**: `https://your-domain.com/api/webhook`
2. **Use webhook**: เปิด
3. **Auto-reply messages**: ปิด (ให้ bot ตอบเอง)

> ⚠️ ตอน dev ในเครื่อง ต้องใช้ **ngrok** เพื่อ expose localhost:
> ```bash
> ngrok http 3000
> ```
> แล้วใช้ URL จาก ngrok ตั้งเป็น Webhook URL

---

## Dependencies ที่ต้องเพิ่ม

```bash
cd backend
npm install @line/bot-sdk
```

`@line/bot-sdk` มี:
- `middleware()` — verify webhook signature
- `Client` — push/reply messages
- `validateSignature()` — manual verification
