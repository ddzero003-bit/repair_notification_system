# 03 — สถาปัตยกรรมระบบ (Architecture)

## System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                          LINE Platform                           │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │ LINE OA Chat│  │ LIFF (Web)   │  │ LINE Messaging API     │  │
│  │ (แจ้งปัญหา) │  │ (Login/Form) │  │ (Push/Reply messages)  │  │
│  └──────┬──────┘  └──────┬───────┘  └────────┬───────────────┘  │
└─────────┼────────────────┼───────────────────┼──────────────────┘
          │ Webhook         │ HTTPS              │ API calls
          ▼                 ▼                    ▲
┌─────────────────────────────────────────────────────────────────┐
│                     Backend (Node.js + Express)                  │
│                     Port: 3000                                   │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ Auth     │ │ Repairs   │ │ Users    │ │ LINE Webhook     │  │
│  │ Routes   │ │ Routes    │ │ Routes   │ │ Handler          │  │
│  └────┬─────┘ └─────┬─────┘ └────┬─────┘ └────────┬─────────┘  │
│       │             │            │                 │             │
│  ┌────▼─────────────▼────────────▼─────────────────▼──────────┐ │
│  │                    Controllers                              │ │
│  └────────────────────────┬────────────────────────────────────┘ │
│                           │                                      │
│  ┌────────────────────────▼────────────────────────────────────┐ │
│  │              Middleware (Auth/JWT + Role Check)              │ │
│  └────────────────────────┬────────────────────────────────────┘ │
│                           │                                      │
│  ┌────────────────────────▼────────────────────────────────────┐ │
│  │                   PostgreSQL (pg)                            │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
          ▲
          │ API calls (axios)
          │
┌─────────┴───────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                        │
│                    Port: 5173                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Services Layer: apiClient.js → authService / repairService│   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
│  ┌──────────┐ ┌─────────────▼──┐ ┌────────────────────────────┐ │
│  │ Contexts │ │ Pages          │ │ Components                 │ │
│  │ Auth     │ │ /citizen/*     │ │ Sidebar, DataTable,        │ │
│  │ Notif    │ │ /operator/*    │ │ StatusBadge, StatCard,     │ │
│  │          │ │ /technician/*  │ │ RepairTimeline, EmptyState │ │
│  └──────────┘ └────────────────┘ └────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## โครงสร้างโฟลเดอร์

```
project-demo-main/
├── GEMINI.md                    ← AI อ่านไฟล์นี้ก่อน
├── docs/                        ← เอกสารโปรเจคทั้งหมด
│
├── backend/
│   ├── .env                     ← credentials (PostgreSQL, JWT, LINE)
│   ├── package.json
│   ├── sql/
│   │   └── schema.sql           ← DDL สร้างตาราง
│   └── src/
│       ├── server.js            ← entry point (Express app)
│       ├── config/
│       │   ├── db.js            ← PostgreSQL connection pool
│       │   └── initDb.js        ← สร้างตาราง + seed data
│       ├── controllers/
│       │   ├── authController.js    ← login, register, LINE login
│       │   ├── repairController.js  ← CRUD งานซ่อม + stats
│       │   └── userController.js    ← จัดการผู้ใช้
│       ├── middleware/
│       │   └── auth.js          ← JWT verify + role check
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── repairRoutes.js
│       │   └── userRoutes.js
│       └── utils/
│           ├── asyncHandler.js  ← try/catch wrapper
│           ├── jwt.js           ← sign/verify token
│           └── lineAuth.js      ← LINE token verification
│
└── frontend/
    ├── .env                     ← VITE_API_BASE_URL
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx              ← React Router config
        ├── main.jsx             ← entry point
        ├── index.css
        ├── components/common/   ← reusable UI components
        ├── contexts/
        │   ├── AuthContext.jsx   ← auth state management
        │   └── NotificationContext.jsx
        ├── layouts/             ← MainLayout, AuthLayout, DashboardLayout
        ├── pages/
        │   ├── public/          ← Home, Login, Register
        │   ├── citizen/         ← Dashboard, แจ้งซ่อม, ติดตาม
        │   ├── operator/        ← Dashboard, คำขอ, มอบหมาย, จัดการผู้ใช้
        │   ├── technician/      ← Dashboard, งานที่ได้รับ, อัปเดต
        │   └── shared/          ← Notifications, Profile, Settings
        ├── routes/
        │   └── ProtectedRoute.jsx  ← role-based guard
        ├── services/
        │   ├── apiClient.js     ← axios instance + interceptors
        │   ├── authService.js   ← login/register API calls
        │   ├── repairService.js ← repair CRUD API calls
        │   └── mock/            ← mock data (ไม่ใช้แล้ว)
        ├── theme/theme.js       ← MUI theme config
        └── utils/constants.js   ← roles, categories, statuses
```

## Data Flow: แจ้งซ่อม (ผ่าน Web)

```
1. User กรอกฟอร์ม → repairService.create(payload)
2. apiClient.post('/repairs', payload)  [+ Bearer token]
3. Backend: requireAuth → requireRole('citizen') → repairController.create
4. สร้าง request_id อัตโนมัติ (SR2569-xxx)
5. INSERT INTO tb_repairrequest → RETURNING *
6. Response → frontend แสดงผล
```

## Data Flow: แจ้งซ่อม (ผ่าน LINE OA — ยังไม่ได้ทำ)

```
1. User ส่งข้อความใน LINE OA
2. LINE Platform → POST /api/webhook (backend)
3. Backend parse message (text/image/location)
4. สร้าง repair request ใน DB
5. Push notification ไปหา Operator ผ่าน LINE Messaging API
6. Reply message กลับ User พร้อมเลขที่แจ้งซ่อม
```
