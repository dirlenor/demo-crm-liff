-- Migration: Add execute_sql RPC function for MCP support
-- This function allows the Supabase MCP server to execute SQL queries

-- Create execute_sql function for MCP
-- This function executes arbitrary SQL queries and returns results
CREATE OR REPLACE FUNCTION execute_sql(
  sql_query TEXT,
  read_only BOOLEAN DEFAULT TRUE
) RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Security: Only allow SELECT queries if read_only is true
  IF read_only AND NOT (LOWER(TRIM(sql_query)) LIKE 'select%' OR LOWER(TRIM(sql_query)) LIKE 'with%') THEN
    RAISE EXCEPTION 'Only SELECT queries are allowed in read-only mode';
  END IF;

  -- Execute the query and return as JSONB
  -- Note: This is a simplified version. For production, you may want more security checks
  EXECUTE format('SELECT jsonb_agg(row_to_json(t)) FROM (%s) t', sql_query) INTO result;
  
  RETURN COALESCE(result, '[]'::JSONB);
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'SQL execution error: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users and service role
GRANT EXECUTE ON FUNCTION execute_sql(TEXT, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION execute_sql(TEXT, BOOLEAN) TO service_role;
GRANT EXECUTE ON FUNCTION execute_sql(TEXT, BOOLEAN) TO anon;

-- Note: The MCP server may use a different approach
-- Some MCP servers use direct database connections instead of RPC functions
-- If this doesn't work, the issue might be with the MCP server configuration


