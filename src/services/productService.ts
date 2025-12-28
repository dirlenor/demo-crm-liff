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
  console.log('Calling redeem_product RPC with:', { userId, productId });
  
  const { data, error } = await supabase.rpc('redeem_product', {
    p_user_id: userId,
    p_product_id: productId,
  });

  if (error) {
    console.error('RPC Error redeeming product:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error details:', error.details);
    console.error('Error hint:', error.hint);
    
    // Create a more descriptive error message
    let errorMessage = error.message || 'Failed to redeem product';
    if (error.hint) {
      errorMessage += ` (${error.hint})`;
    }
    
    throw new Error(errorMessage);
  }

  console.log('RPC Response data:', data);
  console.log('Data type:', typeof data);
  console.log('Is array:', Array.isArray(data));

  // Handle different return types:
  // 1. New format: returns TABLE (array) with {redemption_id, redemption_code}
  // 2. Old format: returns UUID directly (for backward compatibility)
  
  if (Array.isArray(data)) {
    // New format - TABLE return
    if (data.length === 0) {
      throw new Error('Redemption failed: No data returned from server');
    }
    const result = data[0];
    console.log('Parsed result (array):', result);
    return {
      redemptionId: result.redemption_id,
      redemptionCode: result.redemption_code || '',
    };
  } else if (typeof data === 'string') {
    // Old format - UUID return (backward compatibility if migration not run)
    console.log('UUID format detected, fetching redemption details');
    // Fetch redemption details to get code
    const { data: redemption, error: fetchError } = await supabase
      .from('product_redemptions')
      .select('id, redemption_code')
      .eq('id', data)
      .single();
    
    if (fetchError || !redemption) {
      console.error('Failed to fetch redemption:', fetchError);
      throw new Error('Failed to fetch redemption details');
    }
    
    console.log('Fetched redemption:', redemption);
    return {
      redemptionId: redemption.id,
      redemptionCode: redemption.redemption_code || '',
    };
  } else if (data && typeof data === 'object' && 'redemption_id' in data) {
    // Direct object return
    console.log('Direct object format detected:', data);
    return {
      redemptionId: data.redemption_id,
      redemptionCode: data.redemption_code || '',
    };
  }
  
  console.error('Unexpected data format:', data);
  throw new Error('Unexpected response format from redeem_product');
};


