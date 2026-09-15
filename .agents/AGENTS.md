# Project Rules — ระบบแจ้งซ่อม (repair-line-oa)

## 🔔 งานค้าง: Security Issues ที่ยังไม่ได้แก้ไข

ทุกครั้งที่ผู้ใช้ถามว่า **"มีงานค้างตรงไหน"**, **"ยังทำอะไรค้างอยู่บ้าง"**, **"ยังไม่ได้ทำอะไร"** หรือประโยคในทำนองเดียวกัน
ให้แจ้งรายการ Security Issues ด้านล่างนี้ทุกครั้ง พร้อมกับงานค้างอื่นๆ ที่มี

### 🔴 Critical (4 จุด — ยังไม่ได้แก้)
1. **CORS เปิด `origin: '*'`** → `backend/src/server.js` บรรทัด 29
   - แก้: จำกัดให้เฉพาะ `FRONTEND_URL` และ `localhost:5173`
2. **Password ขั้นต่ำแค่ 3 ตัวอักษร** → `backend/src/controllers/authController.js` บรรทัด 110
   - แก้: เพิ่มเป็น 8 ตัว + บังคับมีตัวเลข + ตัวอักษร
3. **Upload API ไม่มี Authentication** → `backend/src/routes/uploadRoutes.js` บรรทัด 49
   - แก้: เพิ่ม `requireAuth` middleware ก่อน upload handler
4. **GET /api/repairs/:id ไม่ต้อง login** → `backend/src/routes/repairRoutes.js` บรรทัด 12
   - แก้: เพิ่ม `requireAuth` — ป้องกันข้อมูลส่วนตัว (ชื่อ, เบอร์, พิกัด) รั่ว

### 🟡 High (4 จุด — ยังไม่ได้แก้)
5. **ไม่มี Rate Limiting บน Login** — brute-force ได้ไม่จำกัดครั้ง
   - แก้: ใช้ `express-rate-limit` จำกัด 10 ครั้ง / 15 นาที
6. **JWT ไม่มี Revoke/Blacklist** — logout แล้ว token ยังใช้ได้จนหมดอายุ
7. **Upload ตรวจแค่ mimetype ไม่ตรวจ Magic Bytes** — ปลอมไฟล์อันตรายเป็นรูปได้
   - แก้: ใช้ `file-type` library ตรวจ bytes จริงของไฟล์
8. **Error message บอก username ว่ามีอยู่ในระบบหรือเปล่า** → `authController.js` บรรทัด 58
   - แก้: ใช้ข้อความ error เดียวกันทุกกรณี

### 🟢 Medium (3 จุด — ยังไม่ได้แก้)
9. **ไม่มี Security Headers** — ติดตั้ง `helmet` ป้องกัน XSS, Clickjacking
10. **ไม่มี Input Sanitization** — ควรใช้ `xss` library กรองข้อมูลก่อนบันทึก DB
11. **ไม่มี Audit Log** — ควรบันทึก action สำคัญ (login, assign, เปลี่ยนสถานะ)
