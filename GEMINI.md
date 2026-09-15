# ระบบแจ้งซ่อมสาธารณูปโภคด้วย LINE OA

> ⚠️ **AI: อ่านไฟล์นี้ก่อนเสมอ** เมื่อทำงานกับโปรเจคนี้

## Quick Summary

ระบบแจ้งซ่อมสาธารณูปโภค (ไฟฟ้า/ประปา) ผ่าน LINE OA สำหรับองค์กรปกครองส่วนท้องถิ่น
ประชาชนแจ้งปัญหาผ่าน LINE → Operator รับเรื่อง+มอบหมายช่าง → ช่างซ่อม+รายงานผล → แจ้งผลกลับผู้แจ้ง

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + MUI (Material UI)
- **Backend**: Node.js + Express + PostgreSQL
- **LINE Integration**: LINE Messaging API + LIFF (LINE Front-end Framework)
- **Auth**: JWT + bcrypt

## ผู้ใช้ 3 บทบาท

| บทบาท | คำอธิบาย |
|--------|---------|
| **User (Citizen)** | ประชาชนผู้แจ้งปัญหา |
| **Operator (Admin)** | หัวหน้าช่าง/ผู้ดูแลระบบ (บทบาทเดียวกัน) |
| **Technician** | ช่างซ่อม |

## ประเภทปัญหา 2 แบบ

- ⚡ ไฟฟ้า (electricity)
- 💧 ประปา (water)

## 📁 เอกสารโปรเจค (อ่านตามลำดับ)

| ลำดับ | ไฟล์ | เนื้อหา |
|-------|------|---------|
| 1 | [PROJECT_OVERVIEW.md](docs/01_PROJECT_OVERVIEW.md) | ภาพรวม, เป้าหมาย, flow การทำงาน |
| 2 | [REQUIREMENTS.md](docs/02_REQUIREMENTS.md) | ข้อกำหนดระบบทั้ง 42 ข้อ + สถานะ |
| 3 | [ARCHITECTURE.md](docs/03_ARCHITECTURE.md) | สถาปัตยกรรม, โครงสร้างโฟลเดอร์, data flow |
| 4 | [DATABASE_SCHEMA.md](docs/04_DATABASE_SCHEMA.md) | ER diagram, ตาราง, ความสัมพันธ์ |
| 5 | [API_REFERENCE.md](docs/05_API_REFERENCE.md) | Endpoints ทั้งหมด, request/response format |
| 6 | [DEVELOPMENT_ROADMAP.md](docs/06_DEVELOPMENT_ROADMAP.md) | แผนพัฒนา, ลำดับการทำ, priorities |
| 7 | [LINE_INTEGRATION.md](docs/07_LINE_INTEGRATION.md) | คู่มือเชื่อม LINE OA, Webhook, LIFF |
| 8 | [UI_DESIGN.md](docs/08_UI_DESIGN.md) | Design system: สี, ฟอนต์, component standards, UI TODO |

## 🔑 Credentials & Config

- **Backend .env**: `D:\project-demo-main\backend\.env`
- **Frontend .env**: `D:\project-demo-main\frontend\.env`
- **PostgreSQL**: database `repair_line_oa`, user `postgres`, password `123456`
- **LINE OA**: ยังไม่ได้เชื่อม (credentials เป็น placeholder)

## ⚠️ กฎสำคัญสำหรับ AI

1. **ประเภทปัญหามีแค่ 2 แบบ**: ไฟฟ้า กับ ประปา เท่านั้น
2. **Operator = Administrator**: เป็นบทบาทเดียวกัน ไม่ต้องสร้าง role แยก
3. **LINE OA เป็นช่องทางหลัก**: ทุก feature ต้องทำงานผ่าน LINE ได้
4. **อ่าน docs/ ก่อนแก้โค้ด**: เพื่อไม่ให้แก้ผิดทิศ
