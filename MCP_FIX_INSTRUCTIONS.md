# 🔧 วิธีแก้ไข Supabase MCP Connection

## ปัญหาที่พบ
MCP ของ Supabase ถูกตั้งค่าไว้แล้ว แต่เชื่อมต่อกับ **project ผิด**:
- ❌ MCP config ใช้: `https://jlrkukqmtejoxceskklv.supabase.co`
- ✅ แอปใช้: `https://ooqvqbwewumvepdywkwe.supabase.co`

## วิธีแก้ไข (เลือก 1 วิธี)

### วิธีที่ 1: ใช้สคริปต์อัตโนมัติ (แนะนำ)

```bash
cd /Users/apple/Desktop/DemoCRM_LIFF
./fix_mcp_config.sh
```

สคริปต์จะถาม Service Role Key จากคุณ

### วิธีที่ 2: แก้ไขด้วยมือ

1. **หา Service Role Key**:
   - ไปที่ [Supabase Dashboard](https://supabase.com/dashboard)
   - เลือก project: `ooqvqbwewumvepdywkwe`
   - ไปที่ **Project Settings** → **API**
   - คัดลอก **service_role key** (⚠️ ไม่ใช่ anon key!)

2. **แก้ไขไฟล์** `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@iflow-mcp/selfhosted-supabase-mcp",
        "--url",
        "https://ooqvqbwewumvepdywkwe.supabase.co",
        "--anon-key",
        "sb_publishable_DCTvzWNZqpnmjkH1zTkEBg_RGchboNW",
        "--service-key",
        "YOUR_SERVICE_ROLE_KEY_HERE"
      ]
    },
    "Figma": {
      "url": "https://mcp.figma.com/mcp",
      "headers": {}
    }
  }
}
```

**สำคัญ**: แทนที่ `YOUR_SERVICE_ROLE_KEY_HERE` ด้วย service_role key จริง

3. **Restart Cursor**:
   - ปิด Cursor
   - เปิด Cursor ใหม่

## ตรวจสอบการเชื่อมต่อ

หลังจาก restart แล้ว ลองใช้คำสั่ง MCP:
- `mcp_supabase_list_tables` - ดูตารางทั้งหมด
- `mcp_supabase_get_project_url` - ตรวจสอบ project URL
- `mcp_supabase_execute_sql` - รัน SQL query

## สถานะปัจจุบัน

✅ **Project URL**: ถูกต้องแล้ว (`https://ooqvqbwewumvepdywkwe.supabase.co`)
✅ **Anon Key**: ถูกต้องแล้ว
✅ **Service Key**: ถูกต้องแล้ว

⚠️ **ปัญหาที่เหลือ**: MCP server ยังไม่สามารถ execute SQL ได้
- Error: `execute_sql RPC function not found or client not properly initialized`

### วิธีแก้ปัญหา execute_sql

1. **รัน Migration** `005_add_mcp_execute_sql.sql` ใน Supabase:
   - ไปที่ Supabase Dashboard → SQL Editor
   - Copy เนื้อหาจากไฟล์ `src/supabase/migrations/005_add_mcp_execute_sql.sql`
   - Paste และ Run

2. **หรือ Restart MCP Server**:
   - ปิด Cursor อย่างสมบูรณ์
   - เปิด Cursor ใหม่
   - MCP server จะ restart อัตโนมัติ

3. **ตรวจสอบ MCP Package**:
   - MCP ใช้ package: `@iflow-mcp/selfhosted-supabase-mcp`
   - Package นี้ควรจะใช้ direct database connection ไม่ใช่ RPC
   - ถ้ายังไม่ได้ อาจต้องตรวจสอบว่า Supabase project อนุญาต direct connection หรือไม่

## ข้อมูล Project ที่ถูกต้อง

- **Project URL**: `https://ooqvqbwewumvepdywkwe.supabase.co`
- **Anon Key**: `sb_publishable_DCTvzWNZqpnmjkH1zTkEBg_RGchboNW`
- **Service Role Key**: หาได้จาก Supabase Dashboard (Project Settings → API → service_role key)

⚠️ **คำเตือน**: Service Role Key มีสิทธิ์เต็มในฐานข้อมูล อย่าแชร์หรือ commit ลง Git!


