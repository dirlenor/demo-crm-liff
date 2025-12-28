import { supabase } from './supabase';
import type { ProductRedemption, Product } from '../types';

export interface RedemptionDetail extends ProductRedemption {
  product: Product;
}

export const getRedemptionDetail = async (
  redemptionId: string
): Promise<RedemptionDetail> => {
  const { data, error } = await supabase
    .from('product_redemptions')
    .select(`
      *,
      product:products(*)
    `)
    .eq('id', redemptionId)
    .single();

  if (error) {
    console.error('Error fetching redemption detail:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Redemption not found');
  }

  return {
    ...data,
    product: data.product as Product,
  };
};

export const getUserRedemptions = async (
  userId: string,
  limit: number = 50
): Promise<RedemptionDetail[]> => {
  const { data, error } = await supabase
    .from('product_redemptions')
    .select(`
      *,
      product:products(*)
    `)
    .eq('line_user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching user redemptions:', error);
    throw error;
  }

  if (!data) {
    return [];
  }

  return data.map((item) => ({
    ...item,
    product: item.product as Product,
  }));
};
