-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  description_en TEXT,
  points_required INTEGER NOT NULL,
  image_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  stock INTEGER DEFAULT -1, -- -1 means unlimited
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create product_redemptions table
CREATE TABLE IF NOT EXISTS product_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_user_id TEXT NOT NULL REFERENCES tour_members(line_user_id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  points_used INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_product_redemptions_user ON product_redemptions(line_user_id);
CREATE INDEX IF NOT EXISTS idx_product_redemptions_product ON product_redemptions(product_id);
CREATE INDEX IF NOT EXISTS idx_product_redemptions_created ON product_redemptions(created_at DESC);

-- Function to redeem product
CREATE OR REPLACE FUNCTION redeem_product(
  p_user_id TEXT,
  p_product_id UUID
) RETURNS UUID AS $$
DECLARE
  v_product products%ROWTYPE;
  v_current_balance INTEGER;
  v_redemption_id UUID;
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
  
  -- Deduct points
  UPDATE tour_members
  SET points_balance = points_balance - v_product.points_required,
      updated_at = NOW()
  WHERE line_user_id = p_user_id;
  
  -- Create redemption record
  INSERT INTO product_redemptions (line_user_id, product_id, points_used, status)
  VALUES (p_user_id, p_product_id, v_product.points_required, 'completed')
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
  
  RETURN v_redemption_id;
END;
$$ LANGUAGE plpgsql;




