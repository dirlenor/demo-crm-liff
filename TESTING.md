# คู่มือการเทส Demo CRM LIFF

## 📱 วิธีเทส LIFF App

### 1. เทสใน LINE App (แนะนำ - เทสจริง)

**ขั้นตอน:**
1. เปิด LINE app บนมือถือ
2. ไปที่ **LINE Developers Console**: https://developers.line.biz/
3. เลือก Provider และ Channel ของคุณ
4. ไปที่แท็บ **LIFF**
5. ตรวจสอบว่า **LIFF Endpoint URL** ตั้งค่าเป็น: `https://demo-crm-liff.vercel.app`
6. เปิด LIFF app จาก:
   - ส่ง LIFF URL ไปให้ตัวเองใน LINE
   - หรือสแกน QR Code จาก LINE Developers Console
   - LIFF URL: `https://liff.line.me/2008777680-kyoJofMo`

**ฟีเจอร์ที่ควรเทส:**
- ✅ ดู Dashboard (Overview)
- ✅ ดู Point Balance
- ✅ ดู Statistics (Earned/Redeemed)
- ✅ **เติมเงิน (Top Up Points)** - กดปุ่ม "เติมเงิน" ใน Quick Actions
- ✅ ดู Products (ของรางวัล)
- ✅ **แลกรางวัล** - กดปุ่ม "แลกเลย" ที่สินค้า
- ✅ **ดู QR Code และ Countdown** - หลังแลกรางวัล
- ✅ ดู History (ประวัติการทำรายการ)
- ✅ Navigation ผ่าน Bottom Nav (3 tabs)

---

### 2. เทสใน Browser (จำกัดบางฟีเจอร์)

**ข้อจำกัด:**
- ❌ LIFF API ไม่ทำงาน (ไม่สามารถดึง LINE Profile ได้)
- ⚠️ ต้องใช้ Mock User ID
- ✅ UI/UX สามารถดูได้

**วิธีเทส:**
```bash
# 1. Clone และ setup
cd DemoCRM_LIFF
npm install

# 2. สร้างไฟล์ .env
VITE_SUPABASE_URL=https://ooqvqbwewumvepdywkwe.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_DCTvzWNZqpnmjkH1zTkEBg_RGchboNW
VITE_LIFF_ID=2008777680-kyoJofMo

# 3. รัน dev server
npm run dev

# 4. เปิด browser: http://localhost:5173
```

**หมายเหตุ:** ใน browser จะมี error เรื่อง LIFF initialization แต่ UI ยังดูได้

---

## 🖥️ วิธีเทส CRM Admin Dashboard

**URL:** `https://crm-admin-dashboard-zeta.vercel.app`

**หรือเทส Local:**
```bash
cd admin
npm install

# สร้างไฟล์ .env
VITE_SUPABASE_URL=https://ooqvqbwewumvepdywkwe.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_DCTvzWNZqpnmjkH1zTkEBg_RGchboNW

npm run dev
# เปิด: http://localhost:3001
```

**ฟีเจอร์ที่ควรเทส:**
- ✅ Dashboard - ดูสถิติรวม
- ✅ Members - จัดการสมาชิก
- ✅ Products - สร้าง/แก้ไข/ลบสินค้า
- ✅ Transactions - ดูประวัติการทำรายการ
- ✅ QR Codes - สร้าง QR Code coupons

---

## ✅ Checklist การเทส

### 🆕 ฟีเจอร์ใหม่ที่เพิ่มเข้ามา

#### 1. Mock Payment System (เติมเงิน)
- [ ] กดปุ่ม "เติมเงิน" ใน Overview tab
- [ ] Modal แสดงขึ้นมาถูกต้อง
- [ ] เลือกจำนวนเงิน (100, 200, 500, 1000, 2000, 5000 บาท)
- [ ] หรือกรอกจำนวนเงินเอง
- [ ] ดูว่า Point ที่จะได้รับ = จำนวนเงิน (1 บาท = 1 Point)
- [ ] กด "ยืนยันการเติมเงิน"
- [ ] ตรวจสอบว่า Point เพิ่มขึ้น
- [ ] ตรวจสอบว่า Payment Transaction ถูกบันทึกใน Database

#### 2. Product Redemption (QR Code + Countdown)
- [ ] ไปที่ Products tab
- [ ] เลือกสินค้าและกด "แลกเลย"
- [ ] หลังจากแลกสำเร็จ หน้า ProductRedemptionDetail ควรแสดงขึ้นมา
- [ ] ตรวจสอบ QR Code แสดงถูกต้อง
- [ ] ตรวจสอบ Redemption Code แสดง (format: RED-XXXXXXXX)
- [ ] ตรวจสอบ Countdown Timer เริ่มจาก 15:00 นาที
- [ ] ตรวจสอบ Countdown Timer นับถอยหลังถูกต้อง
- [ ] ตรวจสอบ Product Image/Name/Description แสดงถูกต้อง
- [ ] ทดสอบ Copy Code (กดปุ่มคัดลอก)
- [ ] หลังจาก Countdown หมดเวลา ตรวจสอบว่าแสดง "QR Code หมดอายุแล้ว"

#### 3. UI/UX Updates
- [ ] ตรวจสอบว่าไม่มี Top Navigation Tabs ด้านบน
- [ ] ตรวจสอบว่าไม่มี Language Toggle Button
- [ ] ตรวจสอบว่า Navigation ใช้ Bottom Nav เท่านั้น
- [ ] ตรวจสอบว่า Bottom Nav มี 3 tabs: Overview, Products, History
- [ ] ตรวจสอบว่า UI สวยงามและใช้งานง่าย

---

## 🧪 Test Cases ตาม Scenario

### Scenario 1: User Journey - ใหม่มาใช้ระบบ
1. เปิด LIFF app ครั้งแรก
2. ระบบสร้าง User ใหม่อัตโนมัติ
3. Point Balance = 0
4. ทดสอบเติมเงิน 500 บาท
5. ตรวจสอบ Point Balance = 500
6. ดู Products ที่มี
7. แลกรางวัล (ถ้ามี Point เพียงพอ)
8. ตรวจสอบ QR Code และ Countdown

### Scenario 2: User Journey - ใช้งานปกติ
1. เปิด LIFF app
2. ดู Point Balance
3. ดู Statistics (Earned/Redeemed)
4. ดู Recent Activity
5. ไปที่ Products tab
6. แลกรางวัลหลายครั้ง
7. ตรวจสอบว่า Stock ลดลง (ถ้าสินค้ามี Stock)
8. ตรวจสอบว่า Point Balance ลดลงตาม

### Scenario 3: Error Cases
1. ลองแลกรางวัลเมื่อ Point ไม่พอ → ควรแสดง "แต้มไม่พอ"
2. ลองแลกรางวัลเมื่อสินค้าหมด → ควรแสดง "สินค้าหมด"
3. ลองเติมเงิน 0 บาท หรือจำนวนติดลบ → ควรไม่อนุญาต
4. ลองกดปุ่มหลายครั้งเร็วๆ → ควรป้องกัน Double Submit

---

## 🔍 Debug และ Troubleshooting

### ถ้า LIFF App ไม่ทำงาน
1. ตรวจสอบ Environment Variables ใน Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_LIFF_ID`

2. ตรวจสอบ LIFF Endpoint URL ใน LINE Developers:
   - ควรเป็น: `https://demo-crm-liff.vercel.app`
   - ต้องไม่มี trailing slash

3. ดู Console Log:
   - เปิด LINE Developer Tools
   - หรือดูใน Vercel Logs

### ถ้าแลกรางวัลไม่ได้
1. ตรวจสอบว่า Migration รันแล้ว:
   - `003_add_payments.sql`
   - `004_add_redemption_codes.sql`

2. ตรวจสอบ Database:
   ```sql
   -- ตรวจสอบว่า function มีอยู่
   SELECT proname, pg_get_function_result(oid) 
   FROM pg_proc 
   WHERE proname = 'redeem_product';
   
   -- ตรวจสอบว่า columns มีอยู่
   SELECT column_name 
   FROM information_schema.columns 
   WHERE table_name = 'product_redemptions' 
     AND column_name IN ('redemption_code', 'expires_at');
   ```

3. ดู Browser Console สำหรับ Error Messages

### ถ้า QR Code ไม่แสดง
1. ตรวจสอบว่า Migration 004 รันแล้ว
2. ตรวจสอบว่า `redemption_code` ถูกสร้างใน Database
3. ตรวจสอบ Browser Console สำหรับ Error

---

## 📊 Database Queries สำหรับตรวจสอบ

### ตรวจสอบ Payment Transactions
```sql
SELECT * FROM payment_transactions 
ORDER BY created_at DESC 
LIMIT 10;
```

### ตรวจสอบ Product Redemptions
```sql
SELECT 
  pr.id,
  pr.redemption_code,
  pr.expires_at,
  pr.created_at,
  p.name as product_name,
  tm.display_name as user_name
FROM product_redemptions pr
JOIN products p ON pr.product_id = p.id
JOIN tour_members tm ON pr.line_user_id = tm.line_user_id
ORDER BY pr.created_at DESC
LIMIT 10;
```

### ตรวจสอบ User Points
```sql
SELECT 
  line_user_id,
  display_name,
  points_balance,
  updated_at
FROM tour_members
ORDER BY updated_at DESC;
```

---

## 🚀 Quick Test Commands

```bash
# รัน LIFF App Local
npm run dev

# รัน Admin Dashboard Local
cd admin && npm run dev

# Build และตรวจสอบ
npm run build

# Deploy
vercel --prod
```

---

## 📝 Notes

- **Migration สำคัญมาก**: ต้องรัน migrations ก่อนเพื่อให้ฟีเจอร์ใหม่ทำงาน
- **LIFF ต้องใช้ LINE App**: ไม่สามารถเทสฟีเจอร์หลักใน Browser ธรรมดาได้
- **Mock Payment**: การเติมเงินเป็นแบบ Mock ไม่ได้ใช้ Payment Gateway จริง
- **QR Code Expiry**: QR Code หมดอายุหลัง 15 นาที

