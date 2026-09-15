# 05 — API Reference

Base URL: `http://localhost:3000/api`

## Authentication

ทุก endpoint ที่มี 🔒 ต้องส่ง header:
```
Authorization: Bearer <token>
```
Token ได้จาก `/auth/login` หรือ `/auth/register`

---

## Auth Endpoints

### POST /auth/login
Staff + Citizen login ด้วย username/password

**Request:**
```json
{ "username": "operator1", "password": "password123" }
```

**Response 200:**
```json
{
  "user": {
    "id": 1, "name": "วิภาพร ชื่นบาน", "username": "operator1",
    "role": "operator", "phone": "0821112222", "email": "operator1@example.com"
  },
  "token": "eyJhbGciOi..."
}
```

**Errors:** 400 (missing fields), 401 (wrong credentials), 403 (inactive)

---

### POST /auth/register
สมัครสมาชิกใหม่ทุก role

**Request:**
```json
{
  "name": "สมชาย ใจดี",
  "username": "somchai",
  "phone": "0812345678",
  "password": "mypassword",
  "role": "citizen"
}
```

**Response 201:** (เหมือน login — ส่ง user + token กลับมา)

**Errors:** 400 (missing/short password), 409 (username ซ้ำ)

---

### POST /auth/line-login
Citizen login ด้วย LIFF access token

**Request:**
```json
{
  "accessToken": "LIFF_ACCESS_TOKEN",
  "profile": { "userId": "U1234", "displayName": "สมชาย" }
}
```

---

## Repair Endpoints

### GET /repairs 🔒
รายการงานซ่อมทั้งหมด (filter ได้)

**Query Params:**
| Param | Type | คำอธิบาย |
|-------|------|---------|
| status | string | filter ตามสถานะ (reported, assigned, ...) |
| category | string | filter ตามประเภท (electricity, water) |
| reporterId | int | filter ตาม user_id ผู้แจ้ง |
| technicianId | int | filter ตาม technician_id |
| search | string | ค้นหาจาก id หรือ title |

**Response 200:**
```json
[
  {
    "id": "SR2569-001",
    "title": "ไฟฟ้าดับหน้าซอย",
    "category": "electricity",
    "description": "...",
    "community": "หมู่ 3",
    "location": "123/45 ซอย...",
    "coords": { "lat": 14.xxx, "lng": 100.xxx },
    "priority": "urgent",
    "contactPhone": "0812345678",
    "images": [],
    "imagesAfter": [],
    "repairResult": null,
    "status": "reported",
    "reporterId": 1,
    "technicianId": null,
    "createdAt": "2026-02-07T08:15:00"
  }
]
```

---

### GET /repairs/stats 🔒 (operator only)
สถิติสำหรับ dashboard (รวม rejected ในยอด cancelled แล้ว)

**Response 200:**
```json
{
  "pending": 8,
  "inProgress": 15,
  "completed": 38,
  "cancelled": 3,
  "byCategory": [
    { "category": "electricity", "count": 24 },
    { "category": "water", "count": 18 }
  ],
  "monthlyTrend": [
    { "month": "Jan", "count": 32 },
    { "month": "Feb", "count": 41 }
  ]
}
```

---

### GET /repairs/:id 🔒
รายละเอียดคำขอแจ้งซ่อม

---

### POST /repairs 🔒 (citizen only)
สร้างคำขอแจ้งซ่อมใหม่

**Request:**
```json
{
  "title": "ไฟฟ้าดับ",
  "category": "electricity",
  "description": "ไฟดับทั้งซอย",
  "community": "หมู่ 3",
  "location": "123/45 ซอย...",
  "coords": { "lat": 14.xxx, "lng": 100.xxx },
  "priority": "high",
  "contactPhone": "0812345678",
  "reporterId": 1,
  "images": []
}
```

**Response 201:** (repair object)

---

### POST /repairs/:id/assign 🔒 (operator only)
มอบหมายช่างซ่อม

**Request:**
```json
{
  "technicianId": 3,
  "priority": "high",
  "note": "ด่วน ให้ไปดูทันที"
}
```

---

### POST /repairs/:id/reject 🔒 (technician only) ✅ ใหม่
ช่างปฏิเสธงาน → สถานะกลับไป reported เพื่อให้ Operator มอบหมายช่างคนใหม่

**Request:**
```json
{
  "reason": "ติดงานอื่น ไปไม่ได้"
}
```

---

### PATCH /repairs/:id/status 🔒 (technician/operator)
อัปเดตสถานะงาน

**Request:**
```json
{
  "status": "completed",
  "repairResult": "เปลี่ยนหม้อแปลงใหม่แล้ว",
  "imagesAfter": ["https://..."]
}
```

---

## User Endpoints

### GET /users/technicians 🔒
รายชื่อช่างทั้งหมด

**Response 200:**
```json
[
  { "id": 1, "name": "วิชัย มั่นคง", "phone": "0823456789", "specialty": "ไฟฟ้า", "status": "active" }
]
```

---

### GET /users 🔒 (operator only)
รายชื่อผู้ใช้ทั้งระบบ (ทุก role)

---

### POST /users 🔒 (operator only) ✅ ใหม่
สร้างผู้ใช้ใหม่ (Operator หรือ Technician)

**Request:**
```json
{
  "name": "สมชาย ช่างทอง",
  "username": "tech5",
  "phone": "0812345678",
  "email": "somchai@email.com",
  "password": "password123",
  "role": "technician",
  "specialty": "ไฟฟ้า"
}
```

---

### PUT /users/:role/:id 🔒 (operator only) ✅ ใหม่
แก้ไขข้อมูลผู้ใช้ (ชื่อ, เบอร์โทร, อีเมล, ความชำนาญ, รหัสผ่าน)

---

### DELETE /users/:role/:id 🔒 (operator only) ✅ ใหม่
ลบผู้ใช้ออกจากระบบ

---

### PATCH /users/:role/:id/toggle-status 🔒 (operator only)
เปิด/ปิดบัญชี

**Params:** role = `operator` | `technician`, id = user id

---

## Upload Endpoint ✅ ใหม่

### POST /upload
อัปโหลดรูปภาพ (สูงสุด 5 รูปต่อครั้ง, ขนาดไม่เกิน 25MB)

**Request:** `multipart/form-data` — field name `images`

**Response 200:**
```json
{
  "urls": ["/uploads/172345678-123456.jpg"]
}
```

---

## Public Repair Endpoints ✅ ใหม่

### GET /public/token 🔒 (operator only)
สร้าง Token สำหรับลิงก์แจ้งซ่อมสาธารณะ (อายุ 48 ชม.)

**Response 200:**
```json
{
  "token": "eyJhbGciOi...",
  "reportUrl": "https://your-domain.com/report?token=eyJhbGciOi..."
}
```

---

### POST /public/repairs
ประชาชนส่งฟอร์มแจ้งซ่อม (ไม่ต้อง JWT — ใช้ Token จาก URL แทน)

**Request:**
```json
{
  "token": "eyJhbGciOi...",
  "name": "สมบูรณ์ ใจดี",
  "contactPhone": "0812345678",
  "category": "electricity",
  "description": "ไฟดับหน้าซอย",
  "location": "หมู่ 3 บ้านหนองบัว (หน้าโรงเรียน)",
  "coords": { "lat": 16.2, "lng": 103.27 },
  "images": ["/uploads/xxx.jpg"]
}
```

---

## Webhook Endpoint ✅ ใหม่

### POST /webhook
LINE Webhook handler — รับข้อความ/รูปภาพ/ตำแหน่งจาก LINE OA

> ⚠️ ต้องวางก่อน `express.json()` middleware เพราะ LINE SDK ต้องอ่าน raw body

---

## Admin Notification Endpoints ✅ ใหม่

### POST /admin/notifications/broadcast 🔒 (operator only)
ส่งประกาศ/แจ้งเตือนผ่าน LINE ไปยังผู้ใช้ที่เลือก

---

### GET /admin/notifications/history 🔒 (operator only)
ดูประวัติการส่งแจ้งเตือน

---

## In-App Notification Endpoints ✅ ใหม่

### GET /notifications 🔒
ดึงรายการแจ้งเตือนในระบบ

### PATCH /notifications/:id/read 🔒
อ่านแจ้งเตือน

### PATCH /notifications/read-all 🔒
อ่านแจ้งเตือนทั้งหมด

---

## Profile Endpoint ✅ ใหม่

### PUT /profile 🔒
อัปเดตข้อมูลโปรไฟล์ตัวเอง
