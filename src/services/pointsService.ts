import { supabase } from './supabase';
import type { TourMember, PointTransaction } from '../types';

export const getUserPoints = async (userId: string): Promise<TourMember | null> => {
  const { data, error } = await supabase
    .from('tour_members')
    .select('*')
    .eq('line_user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // User not found, create new user
      return null;
    }
    console.error('Error fetching user points:', error);
    throw error;
  }

  return data;
};

export const createOrUpdateUser = async (
  userId: string,
  displayName: string,
  currentTour?: string
): Promise<TourMember> => {
  const { data, error } = await supabase
    .from('tour_members')
    .upsert(
      {
        line_user_id: userId,
        display_name: displayName,
        current_tour: currentTour || null,
        points_balance: 0,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'line_user_id',
      }
    )
    .select()
    .single();

  if (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }

  return data;
};

export const earnPoints = async (
  userId: string,
  amount: number,
  description: string
): Promise<void> => {
  const { error } = await supabase.rpc('earn_points', {
    p_user_id: userId,
    p_amount: amount,
    p_description: description,
  });

  if (error) {
    console.error('Error earning points:', error);
    throw error;
  }
};

export const redeemPoints = async (
  userId: string,
  amount: number,
  description: string
): Promise<boolean> => {
  const { data, error } = await supabase.rpc('redeem_points', {
    p_user_id: userId,
    p_amount: amount,
    p_description: description,
  });

  if (error) {
    console.error('Error redeeming points:', error);
    throw error;
  }

  return data === true;
};

export const getPointHistory = async (
  userId: string,
  limit: number = 10
): Promise<PointTransaction[]> => {
  const { data, error } = await supabase
    .from('point_transactions')
    .select('*')
    .eq('line_user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching point history:', error);
    throw error;
  }

  return data || [];
};


