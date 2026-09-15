# 06 — แผนพัฒนาและลำดับการทำ (Development Roadmap)

## ภาพรวม Phase ทั้งหมด

```
Phase 1 ✅ (เสร็จแล้ว)     Phase 2 ✅ (เสร็จ 2.1-2.4)  Phase 3 (LINE OA)
──────────────────      ──────────────────      ──────────────────
• Frontend UI ครบ       • Upload รูปภาพ ✅       • LINE Webhook ✅
• Backend API ครบ       • ลดประเภทเหลือ 2 ✅    • Push Notification ✅
• เชื่อม Frontend↔Backend • CRUD ผู้ใช้ให้ครบ ✅   • LIFF Login/Form ✅
• Auth (login/register) • ช่างปฏิเสธ→มอบใหม่ ✅ • Flex Messages ✅
• PostgreSQL            • สถิติรายวัน ❌         • Rich Menu ❌
                        • Export รายงาน ❌
```

---

## Phase 1 — พื้นฐาน ✅ เสร็จแล้ว

สิ่งที่ทำไปแล้ว:
- [x] Frontend React + Vite + MUI ครบทุกหน้า (3 role)
- [x] Backend Express + PostgreSQL + JWT Auth
- [x] เชื่อม Frontend ↔ Backend (ไม่ใช้ mock แล้ว)
- [x] Login / Register ทุก role ผ่าน Web
- [x] สร้างคำขอแจ้งซ่อม + เลขอัตโนมัติ
- [x] มอบหมายช่าง + อัปเดตสถานะ
- [x] Dashboard + สถิติพื้นฐาน
- [x] จัดการผู้ใช้ (เพิ่ม/ดู/toggle สถานะ)

---

## Phase 2 — เสริมฟีเจอร์ให้ครบ

### 2.1 ลดประเภทปัญหาเหลือ 2 แบบ ✅ เสร็จแล้ว
- [x] แก้ `constants.js` → เหลือ electricity / water
- [x] แก้ frontend ฟอร์มแจ้งซ่อม
- **ไฟล์ที่แก้**: `frontend/src/utils/constants.js`, หน้าฟอร์มแจ้งซ่อม

### 2.2 ระบบ Upload รูปภาพ ✅ เสร็จแล้ว
- [x] สร้าง `POST /api/upload` endpoint ด้วย multer
- [x] เก็บไฟล์ใน `/uploads` + serve static
- [x] เชื่อม frontend ฟอร์มแจ้งซ่อม (รูปก่อน)
- [x] เชื่อม frontend อัปเดตสถานะ (รูปหลังซ่อม)
- **ไฟล์ที่แก้**: `backend/src/routes/uploadRoutes.js`, `backend/src/server.js`, frontend forms

### 2.3 CRUD ผู้ใช้ให้ครบ ✅ เสร็จแล้ว
- [x] PUT `/users/:role/:id` — แก้ไขข้อมูล
- [x] DELETE `/users/:role/:id` — ลบผู้ใช้
- [x] Frontend: เพิ่มปุ่มแก้ไข/ลบในหน้าจัดการผู้ใช้
- **ไฟล์ที่แก้**: `backend/src/controllers/userController.js`, `frontend/src/pages/operator/ManageUsers.jsx`

### 2.4 ช่างปฏิเสธงาน → มอบหมายใหม่ ✅ เสร็จแล้ว
- [x] เมื่อช่างเปลี่ยนสถานะเป็น rejected → status กลับไป reported
- [x] Operator เห็นงานกลับมาในคิว → มอบหมายช่างคนใหม่
- **ไฟล์ที่แก้**: `backend/src/controllers/repairController.js`

### 2.5 สถิติเพิ่มเติม — ยังไม่เสร็จ
- [ ] สถิติรายวัน (todayCount)
- [ ] Export รายงานเป็น PDF/Excel
- **ความยาก**: ปานกลาง-ยาก (2-3 ชม.)

---

## Phase 3 — LINE OA Integration

> ⚠️ **ต้องมีก่อน**: Channel Access Token, Channel Secret, LIFF ID
> ✅ ได้ตั้งค่า credentials ใน `.env` เรียบร้อยแล้ว

### 3.1 LINE Webhook — รับข้อความแจ้งซ่อม ✅ เสร็จแล้ว
- [x] สร้าง `POST /api/webhook` endpoint
- [x] Parse message types: text, image, location
- [x] สร้าง repair request จาก chat message
- [x] Reply message พร้อมเลขที่แจ้งซ่อม
- **ไฟล์**: `backend/src/controllers/webhookController.js`, `backend/src/routes/webhookRoutes.js`

### 3.2 Push Notification — แจ้งเตือนผ่าน LINE ✅ เสร็จแล้ว
- [x] แจ้ง Operator เมื่อมีงานใหม่
- [x] แจ้งช่างเมื่อได้รับมอบหมาย
- [x] แจ้งผู้แจ้งเมื่อสถานะเปลี่ยน
- [x] แจ้งผู้แจ้ง+Operator เมื่อซ่อมเสร็จ
- [x] แจ้ง Operator เมื่อช่างปฏิเสธงาน
- **ไฟล์**: `backend/src/utils/lineNotify.js`

### 3.3 LIFF — Login/Register ผ่าน LINE ✅ เสร็จแล้ว
- [x] ตั้งค่า LIFF ID ใน `.env`
- [x] Frontend: ตรวจจับ LIFF environment → auto login
- [x] Register ผ่าน LIFF form
- [x] สร้างหน้าแจ้งซ่อมสาธารณะ (PublicReportForm) พร้อม Token ป้องกัน
- **ไฟล์**: `backend/src/controllers/authController.js`, `frontend/src/pages/public/PublicReportForm.jsx`

### 3.4 Flex Messages ✅ เสร็จแล้ว (อัปเดตล่าสุด 27 ส.ค. 2569)
- [x] Flex Message Bubble สำหรับแจ้งซ่อมใหม่ (สี Header ตามประเภท ไฟฟ้า/ประปา)
- [x] Flex Message Bubble สำหรับมอบหมายงาน (Header น้ำเงินเข้ม)
- [x] Flex Message Bubble สำหรับอัปเดตสถานะ (สี Header ตามสถานะ)
- [x] Flex Message Bubble สำหรับซ่อมเสร็จ (Header เขียว)
- [x] Flex Message Bubble สำหรับช่างปฏิเสธ (Header แดง)
- [x] Flex Message สำหรับประกาศจาก Admin
- [x] Flex Message Carousel สำหรับแจ้งซ่อมเสร็จพร้อมรูป
- **ไฟล์**: `backend/src/utils/lineNotify.js`

### 3.5 Rich Menu — ยังไม่เสร็จ
- [ ] สร้าง Rich Menu (ปุ่มแจ้งซ่อม/ตรวจสถานะ/ติดต่อ)
- **ความยาก**: ปานกลาง (1 ชม.)

---

## ฟีเจอร์เพิ่มเติมที่ทำแล้ว (นอก Roadmap เดิม)

- [x] ระบบแจ้งซ่อมสาธารณะผ่าน URL + Token (ไม่ต้องล็อกอิน)
- [x] ระบบ Admin Broadcast Notification ผ่าน LINE
- [x] ระบบ In-App Notification (แจ้งเตือนในระบบเว็บ)
- [x] ระบบจัดการโปรไฟล์ผู้ใช้
- [x] แก้ไข Dashboard สถิติ "ยกเลิก/ปฏิเสธ" ให้รวม rejected + cancelled
- **ไฟล์**: `publicRepairController.js`, `adminNotificationController.js`, `notificationController.js`, `profileController.js`

---

## ลำดับแนะนำในการทำ (ที่เหลือ)

```
Step 1: Phase 2.5 → สถิติรายวัน + Export รายงาน
Step 2: Phase 3.5 → Rich Menu
```

---

## ⏱️ ประมาณเวลาที่เหลือ

| งานที่เหลือ | เวลาโดยประมาณ |
|------------|--------------|
| Phase 2.5 สถิติ+รายงาน | 2-3 ชั่วโมง |
| Phase 3.5 Rich Menu | 1 ชั่วโมง |
| **รวม** | **3-4 ชั่วโมง** |
