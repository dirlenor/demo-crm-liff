import { supabase } from './supabase';
import type { PaymentTransaction } from '../types';

export const purchasePoints = async (
  userId: string,
  amountBaht: number
): Promise<PaymentTransaction> => {
  const { data, error } = await supabase.rpc('purchase_points', {
    p_user_id: userId,
    p_amount_baht: amountBaht,
  });

  if (error) {
    console.error('Error purchasing points:', error);
    throw error;
  }

  // Fetch the created payment transaction
  const { data: payment, error: fetchError } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('id', data)
    .single();

  if (fetchError || !payment) {
    console.error('Error fetching payment transaction:', fetchError);
    throw fetchError || new Error('Failed to fetch payment transaction');
  }

  return payment;
};

