# 🔧 แก้ไขปัญหา MCP Supabase Connection

## ปัญหาที่พบ
MCP ไม่สามารถ execute SQL ได้ - Error: `execute_sql RPC function not found or client not properly initialized`

## สาเหตุที่เป็นไปได้

1. **MCP Server ใช้ RPC function แทน direct database connection**
2. **ต้องใช้ Database Connection String แทน**
3. **MCP Server ยังไม่ได้ restart หลังจากแก้ไข config**

## วิธีแก้ไข

### วิธีที่ 1: เพิ่ม Database Connection String (แนะนำ)

MCP package `@iflow-mcp/selfhosted-supabase-mcp` รองรับ `--db-url` สำหรับ direct database connection

#### ขั้นตอน:

1. **หา Database Connection String จาก Supabase Dashboard**:
   - ไปที่ [Supabase Dashboard](https://supabase.com/dashboard)
   - เลือก project: `ooqvqbwewumvepdywkwe`
   - ไปที่ **Project Settings** → **Database**
   - หา **Connection string** → **URI**
   - Format: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
   - หรือ **Connection pooling** → **Session mode** → Copy connection string

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
        "YOUR_SERVICE_ROLE_KEY",
        "--db-url",
        "postgresql://postgres.ooqvqbwewumvepdywkwe:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres"
      ]
    },
    "Figma": {
      "url": "https://mcp.figma.com/mcp",
      "headers": {}
    }
  }
}
```

**สำคัญ**: 
- แทนที่ `[PASSWORD]` ด้วย database password ของคุณ
- แทนที่ `[region]` ด้วย region ของ Supabase project
- หรือใช้ connection string จาก Supabase Dashboard โดยตรง

### วิธีที่ 2: ใช้ Supabase Official MCP Package แทน

ลองใช้ package อื่นที่อาจทำงานได้ดีกว่า:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase",
        "--url",
        "https://ooqvqbwewumvepdywkwe.supabase.co",
        "--anon-key",
        "sb_publishable_DCTvzWNZqpnmjkH1zTkEBg_RGchboNW",
        "--service-key",
        "YOUR_SERVICE_ROLE_KEY"
      ]
    }
  }
}
```

### วิธีที่ 3: Restart Cursor อย่างสมบูรณ์

1. **ปิด Cursor อย่างสมบูรณ์**:
   - Quit Cursor (Cmd+Q)
   - ตรวจสอบว่าไม่มี process ค้างอยู่: `ps aux | grep -i cursor`

2. **ลบ MCP cache** (ถ้ามี):
   ```bash
   rm -rf ~/.cursor/mcp-cache
   ```

3. **เปิด Cursor ใหม่**

### วิธีที่ 4: ตรวจสอบ MCP Server Logs

1. เปิด Cursor
2. ไปที่ **View** → **Output**
3. เลือก **MCP** จาก dropdown
4. ดู error messages

## ตรวจสอบการเชื่อมต่อ

หลังจากแก้ไขแล้ว ลองใช้คำสั่ง:
- `mcp_supabase_get_project_url` - ควรแสดง project URL ที่ถูกต้อง
- `mcp_supabase_list_tables` - ควรแสดงตารางทั้งหมด
- `mcp_supabase_execute_sql` - ควรสามารถรัน SQL ได้

## ข้อมูลที่ต้องใช้

- **Project URL**: `https://ooqvqbwewumvepdywkwe.supabase.co`
- **Anon Key**: `sb_publishable_DCTvzWNZqpnmjkH1zTkEBg_RGchboNW`
- **Service Role Key**: หาได้จาก Supabase Dashboard → Project Settings → API
- **Database Password**: หาได้จาก Supabase Dashboard → Project Settings → Database
- **Database Connection String**: หาได้จาก Supabase Dashboard → Project Settings → Database → Connection string

## หมายเหตุ

- Database Connection String มี password อย่าแชร์หรือ commit ลง Git!
- ถ้ายังไม่ได้ อาจต้องตรวจสอบว่า Supabase project อนุญาต external connections หรือไม่
- บาง MCP packages อาจต้องการ configuration เพิ่มเติม

