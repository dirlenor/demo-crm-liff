import { supabase } from './supabase';
import type { Product } from '../types';

export const getActiveProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('points_required', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return data || [];
};

export const redeemProduct = async (
  userId: string,
  productId: string
): Promise<{ redemptionId: string; redemptionCode: string }> => {
  const { data, error } = await supabase.rpc('redeem_product', {
    p_user_id: userId,
    p_product_id: productId,
  });

  if (error) {
    console.error('Error redeeming product:', error);
    throw error;
  }

  // Handle different return types:
  // 1. New format: returns TABLE (array) with {redemption_id, redemption_code}
  // 2. Old format: returns UUID directly (for backward compatibility)
  
  if (Array.isArray(data)) {
    // New format - TABLE return
    if (data.length === 0) {
      throw new Error('Failed to redeem product');
    }
    const result = data[0];
    return {
      redemptionId: result.redemption_id,
      redemptionCode: result.redemption_code || '',
    };
  } else if (typeof data === 'string') {
    // Old format - UUID return (backward compatibility if migration not run)
    // Fetch redemption details to get code
    const { data: redemption, error: fetchError } = await supabase
      .from('product_redemptions')
      .select('id, redemption_code')
      .eq('id', data)
      .single();
    
    if (fetchError || !redemption) {
      throw new Error('Failed to fetch redemption details');
    }
    
    return {
      redemptionId: redemption.id,
      redemptionCode: redemption.redemption_code || '',
    };
  } else if (data && typeof data === 'object' && 'redemption_id' in data) {
    // Direct object return
    return {
      redemptionId: data.redemption_id,
      redemptionCode: data.redemption_code || '',
    };
  }
  
  throw new Error('Unexpected response format from redeem_product');
};


