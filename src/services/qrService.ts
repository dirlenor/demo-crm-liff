import { supabase } from './supabase';
import type { QRCoupon } from '../types';

export const validateQRCode = async (code: string): Promise<QRCoupon | null> => {
  const { data, error } = await supabase
    .from('qr_coupons')
    .select('*')
    .eq('code', code)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Code not found
    }
    console.error('Error validating QR code:', error);
    throw error;
  }

  return data;
};

export const redeemQRCode = async (code: string, userId: string): Promise<number> => {
  const { data, error } = await supabase.rpc('redeem_qr_code', {
    p_code: code,
    p_user_id: userId,
  });

  if (error) {
    console.error('Error redeeming QR code:', error);
    throw error;
  }

  return data;
};


