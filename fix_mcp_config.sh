#!/bin/bash

# Script to fix Supabase MCP configuration

echo "🔧 Fixing Supabase MCP Configuration..."
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
read -p "Enter Service Role Key (or press Enter to skip): " SERVICE_KEY

if [ -z "$SERVICE_KEY" ]; then
    SERVICE_KEY="REPLACE_WITH_SERVICE_ROLE_KEY"
    echo "⚠️  Using placeholder. Please update manually later."
fi

# Create new config
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

echo ""
echo "✅ MCP config updated!"
echo ""
echo "📝 Updated configuration:"
echo "   - Project URL: https://ooqvqbwewumvepdywkwe.supabase.co"
echo "   - Anon Key: sb_publishable_DCTvzWNZqpnmjkH1zTkEBg_RGchboNW"
echo "   - Service Key: ${SERVICE_KEY:0:20}..."
echo ""
echo "🔄 Next steps:"
echo "   1. Restart Cursor to apply changes"
echo "   2. Test connection with: mcp_supabase_list_tables"
echo ""



