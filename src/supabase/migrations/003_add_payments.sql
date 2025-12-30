-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_user_id TEXT NOT NULL REFERENCES tour_members(line_user_id) ON DELETE CASCADE,
  amount_baht INTEGER NOT NULL,
  points_purchased INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_method TEXT DEFAULT 'mock',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user ON payment_transactions(line_user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created ON payment_transactions(created_at DESC);

-- Function to purchase points (mock payment)
CREATE OR REPLACE FUNCTION purchase_points(
  p_user_id TEXT,
  p_amount_baht INTEGER
) RETURNS UUID AS $$
DECLARE
  v_points_purchased INTEGER;
  v_payment_id UUID;
BEGIN
  -- Calculate points (1 baht = 1 point)
  v_points_purchased := p_amount_baht;
  
  -- Create payment transaction record
  INSERT INTO payment_transactions (
    line_user_id,
    amount_baht,
    points_purchased,
    status,
    payment_method
  )
  VALUES (
    p_user_id,
    p_amount_baht,
    v_points_purchased,
    'completed',
    'mock'
  )
  RETURNING id INTO v_payment_id;
  
  -- Award points to user
  PERFORM earn_points(
    p_user_id,
    v_points_purchased,
    'Purchased ' || v_points_purchased || ' points for ' || p_amount_baht || ' THB'
  );
  
  -- Update payment transaction updated_at
  UPDATE payment_transactions
  SET updated_at = NOW()
  WHERE id = v_payment_id;
  
  RETURN v_payment_id;
END;
$$ LANGUAGE plpgsql;



