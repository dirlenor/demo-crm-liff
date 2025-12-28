# วิธี Deploy ไปที่ Vercel

## ขั้นตอนการ Deploy

### 1. ติดตั้ง Vercel CLI (ถ้ายังไม่มี)

```bash
npm install -g vercel
```

### 2. Login เข้า Vercel

```bash
vercel login
```

### 3. Deploy โปรเจกต์

```bash
# Deploy (ครั้งแรกจะถามคำถาม)
vercel

# หรือ Deploy แบบ production
vercel --prod
```

### 4. ตั้งค่า Environment Variables

หลังจาก deploy แล้ว ต้องตั้งค่า Environment Variables ใน Vercel Dashboard:

1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. เลือกโปรเจกต์ของคุณ
3. ไปที่ **Settings** → **Environment Variables**
4. เพิ่มตัวแปรต่อไปนี้:

```
VITE_SUPABASE_URL=https://ooqvqbwewumvepdywkwe.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_DCTvzWNZqpnmjkH1zTkEBg_RGchboNW
VITE_LIFF_ID=2008777680-kyoJofMo
```

5. กด **Save**
6. **Redeploy** โปรเจกต์ (ไปที่ **Deployments** → กด **...** → **Redeploy**)

### 5. อัปเดต LIFF Endpoint URL

1. ไปที่ [LINE Developers Console](https://developers.line.biz/)
2. เลือก Provider และ Channel ของคุณ
3. ไปที่แท็บ **LIFF**
4. กด **Edit** ที่ LIFF app ของคุณ
5. เปลี่ยน **Endpoint URL** เป็น Vercel URL (เช่น `https://your-project.vercel.app`)
6. กด **Update**

## วิธี Deploy แบบง่าย (ใช้ Vercel Dashboard)

### 1. Push โค้ดไป GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy ผ่าน Vercel Dashboard

1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. กด **Add New Project**
3. เชื่อมต่อ GitHub repository
4. เลือก repository ของคุณ
5. ตั้งค่า:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. เพิ่ม Environment Variables (ตามขั้นตอนที่ 4 ด้านบน)
7. กด **Deploy**

## หมายเหตุ

- Vercel จะให้ URL แบบ `https://your-project.vercel.app`
- URL นี้จะถาวรและไม่เปลี่ยน (เว้นแต่จะ deploy ใหม่)
- หลังจาก deploy แล้ว ต้องอัปเดต LIFF Endpoint URL ใน LINE Developers Console


