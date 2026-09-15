# 08 · UI Design Guide

> เอกสารกำกับการออกแบบหน้าจอทั้งหมดของระบบ
> **AI: ต้องยึดตามไฟล์นี้ทุกครั้ง** เมื่อสร้างหน้าใหม่หรือแก้ UI

## 📐 ภาพรวมทิศทางดีไซน์

**แนวทาง: "Clean Official Government"**
- จริงจัง เรียบ สะอาดตา น่าเชื่อถือแบบหน่วยงานราชการ
- พื้นหลังสีขาว/เทาอ่อน ไม่ใช้ gradient, ไม่ใช้สีฉูดฉาด
- การ์ดขาว ขอบเทาบาง 1px เงาจางมาก
- สีน้ำเงินกรมท่า (Navy) เป็นสีหลักเพียงสีเดียว
- ฟอนต์ IBM Plex Sans Thai ทั้งระบบ

---

## 🎨 1. Design Tokens

### 1.1 สี (Colors)

| Token | Hex | การใช้งาน |
|-------|-----|-----------|
| `brand.900` | `#1b3752` | **Primary** — ปุ่มหลัก, header, ตัวอักษรเน้น |
| `brand.950` | `#112234` | Hover ของปุ่ม primary |
| `brand.50–800` | ดู `tailwind.config.js` | เฉดอ่อน–เข้มของ brand (badge, bg อ่อน) |
| `#0f172a` | slate-900 | Heading หลัก |
| `#475569` / `#64748b` | slate-600/500 | Body text / Secondary text |
| `#e2e8f0` / `#f1f5f9` | Border | เส้นขอบการ์ด / พื้น hover |
| `#f8fafc` | muted | พื้นหลังหน้า, พื้น table head |
| `#15803d` | Success | สถานะเสร็จสิ้น |
| `#b45309` | Warning | กำลังดำเนินการ |
| `#b91c1c` | Error/Danger | ยกเลิก/ลบ/ปฏิเสธงาน |
| `#0369a1` | Info/Water | ประปา, ข้อมูล |

**กฎ:** ❌ **ห้าม hardcode hex สีอื่น** ใน sx/class ใหม่ ๆ — ให้อ้าง palette จาก MUI theme (`theme.palette.brand[900]`) หรือ Tailwind `brand-*` เท่านั้น

### 1.2 ฟอนต์ (Typography)

| ระดับ | สเปค |
|-------|------|
| Font family | `"IBM Plex Sans Thai"`, `"Sarabun"` (fallback) — โหลดจาก Google Fonts ใน index.html แล้ว |
| h4 (Page title) | 20–24px, weight 600–700, สี `#0f172a` |
| Body | 14–15px, weight 400, สี `#475569` |
| Caption/Helper | 12–13px, สี `#64748b` |

**กฎ:** ❌ **ห้ามใช้ฟอนต์ "Prompt"** — 4 หน้าเก่า (`Profile`, `Settings`, `Notifications`, `ManageUsers`) ยังค้าง Prompt + สี `#162a45` + ส้ม `#fb923c` อยู่ → **ต้อง migrate ให้เข้าธีมนี้**

### 1.3 Shape & Elevation

| Token | ค่า |
|-------|-----|
| Border radius | Card/Dialog 8px, Button/TextField 8px, Chip pill |
| Border | `1px solid #e2e8f0` |
| Shadow | `0 1px 3px rgba(15,23,42,0.06)` เท่านั้น (เงาจาง) — ไม่ใช้เงาหนา |

### 1.4 Spacing

- ใช้ scale MUI/Tailwind: 4, 8, 16, 24, 32 px
- Gap ระหว่าง card grid: 16px (2)
- Padding ใน card: 24px
- Margin ระหว่าง section: 24–32px

---

## 🧩 2. Component Standards

### 2.1 Buttons

| ประเภท | สไตล์ |
|--------|-------|
| Primary action | `contained`, พื้น `brand.900`, textTransform none, radius 8 |
| Secondary | `outlined`, ขอบ `#e2e8f0`, ตัวอักษร `brand.900` |
| Danger (ลบ/ปฏิเสธ) | `outlined` สี error |
| ปุ่มสำหรับช่างในสนาม | class `.btn-field-touch` — สูง 46px เต็มความกว้าง (กดง่ายบนมือถือ) |

### 2.2 Cards

```jsx
<Card sx={{ p: 3, borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: 'subtle' }}>
```
- พื้นขาว ขอบเทา เงาจาง
- Interactive card เพิ่ม `.card-hover` (hover ยกเงาเล็กน้อย)

### 2.3 StatusBadge (chip สถานะ)

ใช้ component `components/common/StatusBadge.jsx` เสมอ — สีผูกกับ `STATUS_COLOR` ใน `utils/constants.js`:
- 🟢 เสร็จสิ้น = เขียว `#15803d`
- 🟡 กำลังดำเนินการ = ส้มอมน้ำตาล `#b45309`
- 🔴 ยกเลิก/ล่าช้า = แดง `#b91c1c`
- 🔵 ประปา/info = น้ำเงิน `#0369a1`

### 2.4 Tables

ใช้ `DataTable.jsx` กลางเสมอ (search/sort/pagination ในตัว):
- Head row พื้น `#f8fafc`, ตัวหนา สี `#475569`
- Row click ได้ → hover เป็น `#f8fafc`
- แถวคั่นด้วย `#f1f5f9`

### 2.5 Forms

- TextField/Select ทุกตัวมี `label` + ใช้ fullWidth ใน grid
- Required field มี `*`
- Validation message ใต้ field สีแดง 13px
- ปุ่ม submit ชิดขวา, ปุ่มยกเลิกเป็น outlined ชิดซ้ายของคู่ปุ่ม

### 2.6 Empty / Loading State

- Empty: ใช้ `EmptyState.jsx` — ไอคอน + ข้อความไทยสุภาพ + CTA ถ้ามี
- Loading: ใช้ `LoadingState.jsx` (skeleton หรือ spinner กลางจอ)

---

## 📱 3. Layout Structure

### 3.1 MainLayout (public: Home, CheckStatus, ฟอร์มแจ้งซ่อม)
AppBar ขาว sticky (โลโก้เทศบาล + nav ขวา) → content → Footer เทศบาล

### 3.2 AuthLayout (Login/Register/Forgot)
จัดกึ่งกลาง การ์ดขาว maxWidth 420 บนพื้น `#f8fafc` + brand header

### 3.3 DashboardLayout (ทั้ง 3 role)
- Sidebar ซ้ายถาวร 250px (mobile = temporary Drawer): active = พื้น `#f1f5f9` + ตัวหนา navy, logout แดงด้านล่าง
- Navbar บน sticky: role label + กระดิ่งแจ้งเตือน (unread badge) + avatar menu
- Content maxWidth 1400, padding 24

### 3.4 โครงหน้า Dashboard มาตรฐาน

```
Header row   : Title (h4 bold) ................. [ปุ่ม primary]
StatCards    : Grid 3–4 ใบ (StatCard.jsx)
Main content : Grid — กราฟ/รายการ (ซ้าย 2/3) + panel รายละเอียด (ขวา 1/3)
```

---

## 📄 4. สเปครายหน้า

### Public
| หน้า | Layout | หมายเหตุ |
|------|--------|----------|
| Home | Hero text ใหญ่ navy + ปุ่ม contained/outlined + การ์ดขอบเขตงาน 2 ใบ | ไม่มีรูป hero ก็ได้ แต่ต้องมี whitespace เยอะ |
| PublicReportForm | Grid 2 col (desktop): ฟอร์มซ้าย + Leaflet map ขวา | Mobile: map อยู่บน form, อัปโหลดรูป required |
| CheckStatus | กล่องค้นหารหัสกลางจอ → timeline ผลลัพธ์ | ใช้ RepairTimeline |
| ReportSuccess | Icon success เขียว + รหัสรายการเด่น + ปุ่มกลับ | |

### Citizen
Dashboard = StatCard × 3 + รายการล่าสุด · CreateRepairRequest = ฟอร์ม 2 col + map · TrackRepairStatus = list card + timeline

### Operator
Dashboard = StatCard × 4 + bar chart รายเดือน + progress สัดส่วนงาน · RepairRequests = filter row + DataTable · RequestDetails = ข้อมูลซ้าย + map/timeline ขวา + dialog มอบหมายช่าง

### Technician
ทุกปุ่ม action ต้อง `.btn-field-touch` (ใช้งานกลางแดด/สวมถุงมือ) · JobDetails = การ์ดรายละเอียดซ้าย + panel action ขวา + stepper

---

## ⚠️ 5. จุดที่ UI ปัจจุบันหลุดธีม (TODO ต้องแก้)

| # | ไฟล์ | ปัญหา | วิธีแก้ |
|---|------|-------|---------|
| 1 | `pages/operator/NotificationSender.jsx` | เขียน Tailwind ล้วน ใช้ `bg-sky-600` สีไม่ตรงธีม | แปลงเป็น MUI + สี brand.900 |
| 2 | `pages/shared/Profile.jsx`, `Settings.jsx`, `Notifications.jsx` | ฟอนต์ Prompt + น้ำเงิน `#162a45` + ส้ม `#fb923c` (สไตล์รุ่นเก่า) | เปลี่ยนเป็น Plex Sans Thai + navy `#1b3752` |
| 3 | `pages/operator/ManageUsers.jsx` | เหมือนข้อ 2 | เหมือนข้อ 2 |
| 4 | `pages/citizen/CitizenDashboard.jsx` | ส่ง `accent="#e08a1e"` ฯลฯ ให้ StatCard ซึ่งไม่ได้ใช้ | ลบ prop accent ทิ้ง |
| 5 | Bar chart ใน OperatorDashboard | วาดเองด้วย Box div สี navy ทึบ | อนุญาตชั่วคราว — ถ้า upgrade ให้ใช้ brand.500→brand.900 ไล่เฉด |

## ✅ / ❌ Do & Don't

| ✅ ทำ | ❌ อย่าทำ |
|-------|-----------|
| ใช้ MUI component + `sx` prop เป็นหลัก | ผสม Tailwind utility เข้าหน้า MUI (ยกเว้น 3 custom class ที่ประกาศใน index.css) |
| อ้างสีจาก theme/palette | Hardcode hex สุ่มสี่สุ่มห้า |
| ฟอนต์เดียวทั้งระบบ (Plex Sans Thai) | เพิ่มฟอนต์ใหม่ / hardcode fontFamily ใน sx |
| เงาจาง ขอบเทาบาง | Gradient, glow shadow, สี neon |
| ภาษาไทยสุภาพใน label/button | ศัพท์เทคนิคอังกฤษใน UI (ยกเว้นคำทั่วไป เช่น Email) |
| Responsive: ทดสอบ ≥360px | ตั้ง minWidth คงที่ให้ content |

## ♿ Accessibility & Mobile

- Contrast ตัวอักษร ≥ 4.5:1 (slate-600 บนขาวผ่าน, ห้ามใช้ slate-300 กับ body text)
- Touch target ≥ 44px บนหน้าที่ช่าง/ประชาชนใช้บนมือถือ (LIFF)
- Focus visible ทุก interactive element
- รูปอัปโหลด/แผนที่ต้องมี fallback เมื่อโหลดไม่สำเร็จ
