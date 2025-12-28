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

  // RPC returns a table/array with redemption_id and redemption_code
  if (!data || (Array.isArray(data) && data.length === 0)) {
    throw new Error('Failed to redeem product');
  }

  // Handle array response
  const result = Array.isArray(data) ? data[0] : data;
  
  return {
    redemptionId: result.redemption_id,
    redemptionCode: result.redemption_code,
  };
};


