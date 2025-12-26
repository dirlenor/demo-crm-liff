import { supabase } from './supabase';
import type { TourMember, PointTransaction, QRCoupon, DashboardStats, Product } from '../types';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const [membersResult, transactionsResult, qrResult] = await Promise.all([
    supabase.from('tour_members').select('points_balance', { count: 'exact' }),
    supabase.from('point_transactions').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(10),
    supabase.from('qr_coupons').select('used', { count: 'exact' }),
  ]);

  const totalMembers = membersResult.count || 0;
  const totalPoints = membersResult.data?.reduce((sum, m) => sum + (m.points_balance || 0), 0) || 0;
  const totalTransactions = transactionsResult.count || 0;
  const totalQRCodes = qrResult.count || 0;
  const usedQRCodes = qrResult.data?.filter(q => q.used).length || 0;

  return {
    totalMembers,
    totalPoints,
    totalTransactions,
    totalQRCodes,
    usedQRCodes,
    recentTransactions: (transactionsResult.data || []) as PointTransaction[],
  };
};

export const getAllMembers = async (): Promise<TourMember[]> => {
  const { data, error } = await supabase
    .from('tour_members')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getMemberTransactions = async (userId: string): Promise<PointTransaction[]> => {
  const { data, error } = await supabase
    .from('point_transactions')
    .select('*')
    .eq('line_user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updateMemberPoints = async (userId: string, points: number): Promise<void> => {
  const { error } = await supabase
    .from('tour_members')
    .update({ points_balance: points, updated_at: new Date().toISOString() })
    .eq('line_user_id', userId);

  if (error) throw error;
};

export const getAllQRCodes = async (): Promise<QRCoupon[]> => {
  const { data, error } = await supabase
    .from('qr_coupons')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createQRCode = async (code: string, points: number): Promise<void> => {
  const { error } = await supabase
    .from('qr_coupons')
    .insert({ code, points, used: false });

  if (error) throw error;
};

export const deleteQRCode = async (code: string): Promise<void> => {
  const { error } = await supabase
    .from('qr_coupons')
    .delete()
    .eq('code', code);

  if (error) throw error;
};

export const getAllTransactions = async (limit: number = 100): Promise<PointTransaction[]> => {
  const { data, error } = await supabase
    .from('point_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

export const getAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

