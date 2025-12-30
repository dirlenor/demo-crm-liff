# Supabase MCP Configuration Guide

## ปัญหาที่พบ
MCP ของ Supabase ถูกตั้งค่าไว้แล้ว แต่เชื่อมต่อกับ project ผิด

## วิธีแก้ไข

### 1. หา Service Role Key จาก Supabase Dashboard

1. ไปที่ [Supabase Dashboard](https://supabase.com/dashboard)
2. เลือก project: `ooqvqbwewumvepdywkwe`
3. ไปที่ **Project Settings** → **API**
4. คัดลอก **service_role key** (ไม่ใช่ anon key!)

### 2. อัปเดต MCP Config

แก้ไขไฟล์ `~/.cursor/mcp.json` ให้เป็น:

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

**สำคัญ**: แทนที่ `YOUR_SERVICE_ROLE_KEY_HERE` ด้วย service_role key ที่คัดลอกจาก Supabase Dashboard

### 3. Restart Cursor

หลังจากแก้ไขแล้ว:
1. ปิด Cursor
2. เปิด Cursor ใหม่
3. MCP จะเชื่อมต่อกับ project ที่ถูกต้อง

## ตรวจสอบการเชื่อมต่อ

หลังจาก restart แล้ว ลองใช้คำสั่ง:
- `mcp_supabase_list_tables` - ดูตารางทั้งหมด
- `mcp_supabase_get_project_url` - ตรวจสอบ project URL

## ข้อมูล Project ที่ถูกต้อง

- **Project URL**: `https://ooqvqbwewumvepdywkwe.supabase.co`
- **Anon Key**: `sb_publishable_DCTvzWNZqpnmjkH1zTkEBg_RGchboNW`
- **Service Role Key**: หาได้จาก Supabase Dashboard (Project Settings → API)



