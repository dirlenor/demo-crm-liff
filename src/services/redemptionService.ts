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

