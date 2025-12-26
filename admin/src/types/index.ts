export interface TourMember {
  line_user_id: string;
  display_name: string;
  current_tour: string | null;
  points_balance: number;
  created_at: string;
  updated_at: string;
}

export interface PointTransaction {
  id: string;
  line_user_id: string;
  type: 'earn' | 'redeem';
  amount: number;
  description: string | null;
  created_at: string;
}

export interface QRCoupon {
  code: string;
  points: number;
  used: boolean;
  used_by: string | null;
  used_at: string | null;
  created_at: string;
}

export interface DashboardStats {
  totalMembers: number;
  totalPoints: number;
  totalTransactions: number;
  totalQRCodes: number;
  usedQRCodes: number;
  recentTransactions: PointTransaction[];
}

export interface Product {
  id: string;
  name: string;
  name_en: string | null;
  description: string | null;
  description_en: string | null;
  points_required: number;
  image_url: string | null;
  active: boolean;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface ProductRedemption {
  id: string;
  line_user_id: string;
  product_id: string;
  points_used: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

