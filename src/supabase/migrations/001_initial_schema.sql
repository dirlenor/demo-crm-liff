-- Create tour_members table
CREATE TABLE IF NOT EXISTS tour_members (
  line_user_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  current_tour TEXT,
  points_balance INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create point_transactions table
CREATE TABLE IF NOT EXISTS point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_user_id TEXT NOT NULL REFERENCES tour_members(line_user_id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('earn', 'redeem')),
  amount INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for point_transactions
CREATE INDEX IF NOT EXISTS idx_point_transactions_user ON point_transactions(line_user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_created ON point_transactions(created_at DESC);

-- Create qr_coupons table
CREATE TABLE IF NOT EXISTS qr_coupons (
  code TEXT PRIMARY KEY,
  points INTEGER NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  used_by TEXT REFERENCES tour_members(line_user_id),
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for qr_coupons
CREATE INDEX IF NOT EXISTS idx_qr_coupons_used ON qr_coupons(used);

-- Create database functions for atomic operations

-- Function to earn points atomically
CREATE OR REPLACE FUNCTION earn_points(
  p_user_id TEXT,
  p_amount INTEGER,
  p_description TEXT
) RETURNS VOID AS $$
BEGIN
  UPDATE tour_members 
  SET points_balance = points_balance + p_amount,
      updated_at = NOW()
  WHERE line_user_id = p_user_id;
  
  INSERT INTO point_transactions (line_user_id, type, amount, description)
  VALUES (p_user_id, 'earn', p_amount, p_description);
END;
$$ LANGUAGE plpgsql;

-- Function to redeem points atomically
CREATE OR REPLACE FUNCTION redeem_points(
  p_user_id TEXT,
  p_amount INTEGER,
  p_description TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_current_balance INTEGER;
BEGIN
  -- Get current balance
  SELECT points_balance INTO v_current_balance
  FROM tour_members
  WHERE line_user_id = p_user_id
  FOR UPDATE;
  
  IF v_current_balance IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  IF v_current_balance < p_amount THEN
    RETURN FALSE;
  END IF;
  
  -- Deduct points
  UPDATE tour_members
  SET points_balance = points_balance - p_amount,
      updated_at = NOW()
  WHERE line_user_id = p_user_id;
  
  -- Create transaction
  INSERT INTO point_transactions (line_user_id, type, amount, description)
  VALUES (p_user_id, 'redeem', p_amount, p_description);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to redeem QR code atomically
CREATE OR REPLACE FUNCTION redeem_qr_code(
  p_code TEXT,
  p_user_id TEXT
) RETURNS INTEGER AS $$
DECLARE
  v_points INTEGER;
BEGIN
  -- Lock the row and get points
  SELECT points INTO v_points
  FROM qr_coupons
  WHERE code = p_code AND used = FALSE
  FOR UPDATE;
  
  IF v_points IS NULL THEN
    RAISE EXCEPTION 'QR code not found or already used';
  END IF;
  
  -- Update QR coupon
  UPDATE qr_coupons
  SET used = TRUE, used_by = p_user_id, used_at = NOW()
  WHERE code = p_code;
  
  -- Award points
  UPDATE tour_members
  SET points_balance = points_balance + v_points,
      updated_at = NOW()
  WHERE line_user_id = p_user_id;
  
  -- Create transaction
  INSERT INTO point_transactions (line_user_id, type, amount, description)
  VALUES (p_user_id, 'earn', v_points, 'QR Code: ' || p_code);
  
  RETURN v_points;
END;
$$ LANGUAGE plpgsql;

