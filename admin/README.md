# CRM Admin Dashboard

Admin dashboard สำหรับจัดการหลังบ้านของ LINE LIFF Points Demo Application

## Features

- 📊 **Dashboard**: ดูสถิติรวม (สมาชิก, แต้ม, รายการ, QR Codes)
- 👥 **Members Management**: จัดการสมาชิกและแต้ม
- 📝 **Transactions History**: ดูประวัติการทำรายการทั้งหมด
- 🔲 **QR Codes Management**: สร้างและจัดการ QR Codes

## Setup

1. ติดตั้ง dependencies:
```bash
cd admin
npm install
```

2. สร้างไฟล์ `.env`:
```env
VITE_SUPABASE_URL=https://ooqvqbwewumvepdywkwe.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_DCTvzWNZqpnmjkH1zTkEBg_RGchboNW
```

3. รัน dev server:
```bash
npm run dev
```

4. เปิด browser ไปที่: `http://localhost:3001`

## Deploy

```bash
npm run build
vercel --prod
```

## Note

สำหรับ production ควรเพิ่ม authentication (Supabase Auth) เพื่อป้องกันการเข้าถึงโดยไม่ได้รับอนุญาต

