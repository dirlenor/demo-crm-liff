-- Add redemption_code and expires_at columns to product_redemptions
ALTER TABLE product_redemptions 
ADD COLUMN IF NOT EXISTS redemption_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Create index for redemption_code
CREATE INDEX IF NOT EXISTS idx_product_redemptions_code ON product_redemptions(redemption_code);

-- Drop existing function before recreating with different return type
DROP FUNCTION IF EXISTS redeem_product(text, uuid);

-- Create redeem_product function to generate redemption_code and set expires_at
CREATE FUNCTION redeem_product(
  p_user_id TEXT,
  p_product_id UUID
) RETURNS TABLE(redemption_id UUID, redemption_code TEXT) AS $$
DECLARE
  v_product products%ROWTYPE;
  v_current_balance INTEGER;
  v_redemption_id UUID;
  v_redemption_code TEXT;
BEGIN
  -- Get product info
  SELECT * INTO v_product
  FROM products
  WHERE id = p_product_id AND active = TRUE
  FOR UPDATE;
  
  IF v_product.id IS NULL THEN
    RAISE EXCEPTION 'Product not found or inactive';
  END IF;
  
  -- Check stock
  IF v_product.stock >= 0 AND v_product.stock < 1 THEN
    RAISE EXCEPTION 'Product out of stock';
  END IF;
  
  -- Get current balance
  SELECT points_balance INTO v_current_balance
  FROM tour_members
  WHERE line_user_id = p_user_id
  FOR UPDATE;
  
  IF v_current_balance IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  IF v_current_balance < v_product.points_required THEN
    RAISE EXCEPTION 'Insufficient points';
  END IF;
  
  -- Generate unique redemption code (format: RED-{8 random alphanumeric chars})
  -- Use UUID but take first 8 chars after removing hyphens
  v_redemption_code := 'RED-' || UPPER(REPLACE(SUBSTRING(gen_random_uuid()::TEXT, 1, 8), '-', ''));
  
  -- Ensure uniqueness (retry if duplicate)
  WHILE EXISTS (SELECT 1 FROM product_redemptions WHERE redemption_code = v_redemption_code) LOOP
    v_redemption_code := 'RED-' || UPPER(REPLACE(SUBSTRING(gen_random_uuid()::TEXT, 1, 8), '-', ''));
  END LOOP;
  
  -- Deduct points
  UPDATE tour_members
  SET points_balance = points_balance - v_product.points_required,
      updated_at = NOW()
  WHERE line_user_id = p_user_id;
  
  -- Create redemption record with code and expiry (15 minutes from now)
  INSERT INTO product_redemptions (
    line_user_id,
    product_id,
    points_used,
    status,
    redemption_code,
    expires_at
  )
  VALUES (
    p_user_id,
    p_product_id,
    v_product.points_required,
    'completed',
    v_redemption_code,
    NOW() + INTERVAL '15 minutes'
  )
  RETURNING id INTO v_redemption_id;
  
  -- Create transaction record
  INSERT INTO point_transactions (line_user_id, type, amount, description)
  VALUES (p_user_id, 'redeem', v_product.points_required, 'Redeem: ' || v_product.name);
  
  -- Update stock if not unlimited
  IF v_product.stock > 0 THEN
    UPDATE products
    SET stock = stock - 1,
        updated_at = NOW()
    WHERE id = p_product_id;
  END IF;
  
  RETURN QUERY SELECT v_redemption_id, v_redemption_code;
END;
$$ LANGUAGE plpgsql;

