#!/bin/bash

# Script to fix Supabase MCP configuration with database URL

echo "🔧 Fixing Supabase MCP Configuration with Database URL..."
echo ""

# Check if MCP config exists
MCP_CONFIG="$HOME/.cursor/mcp.json"
if [ ! -f "$MCP_CONFIG" ]; then
    echo "❌ MCP config not found at $MCP_CONFIG"
    echo "Creating new config..."
    mkdir -p "$HOME/.cursor"
fi

# Backup existing config
if [ -f "$MCP_CONFIG" ]; then
    cp "$MCP_CONFIG" "$MCP_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"
    echo "✅ Backed up existing config"
fi

# Prompt for service role key
echo ""
echo "📋 Please provide your Supabase Service Role Key"
echo "   (Find it at: Supabase Dashboard → Project Settings → API → service_role key)"
echo ""
read -p "Enter Service Role Key: " SERVICE_KEY

if [ -z "$SERVICE_KEY" ]; then
    echo "❌ Service Role Key is required!"
    exit 1
fi

# Prompt for database connection string
echo ""
echo "📋 Please provide your Supabase Database Connection String"
echo "   (Find it at: Supabase Dashboard → Project Settings → Database → Connection string → URI)"
echo "   Format: postgresql://postgres.[ref]:[password]@[host]:[port]/postgres"
echo ""
read -p "Enter Database Connection String (or press Enter to skip): " DB_URL

# Create new config
if [ -z "$DB_URL" ]; then
    # Without DB URL
    cat > "$MCP_CONFIG" << EOF
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
        "$SERVICE_KEY"
      ]
    },
    "Figma": {
      "url": "https://mcp.figma.com/mcp",
      "headers": {}
    }
  }
}
EOF
else
    # With DB URL
    cat > "$MCP_CONFIG" << EOF
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
        "$SERVICE_KEY",
        "--db-url",
        "$DB_URL"
      ]
    },
    "Figma": {
      "url": "https://mcp.figma.com/mcp",
      "headers": {}
    }
  }
}
EOF
fi

echo ""
echo "✅ MCP config updated!"
echo ""
echo "📝 Updated configuration:"
echo "   - Project URL: https://ooqvqbwewumvepdywkwe.supabase.co"
echo "   - Anon Key: sb_publishable_DCTvzWNZqpnmjkH1zTkEBg_RGchboNW"
echo "   - Service Key: ${SERVICE_KEY:0:20}..."
if [ -n "$DB_URL" ]; then
    echo "   - Database URL: ${DB_URL:0:30}..."
fi
echo ""
echo "🔄 Next steps:"
echo "   1. Restart Cursor completely (Cmd+Q, then reopen)"
echo "   2. Test connection with: mcp_supabase_list_tables"
echo ""

