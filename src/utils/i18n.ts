export type Language = 'th' | 'en';

interface Translations {
  [key: string]: {
    th: string;
    en: string;
  };
}

const translations: Translations = {
  // Dashboard
  'dashboard.title': {
    th: 'คะแนนของฉัน',
    en: 'My Points',
  },
  'dashboard.welcome': {
    th: 'สวัสดี',
    en: 'Welcome',
  },
  'dashboard.currentTour': {
    th: 'ทริปปัจจุบัน',
    en: 'Current Tour',
  },
  'dashboard.pointsBalance': {
    th: 'คะแนนสะสม',
    en: 'Points Balance',
  },
  'dashboard.recentTransactions': {
    th: 'ประวัติล่าสุด',
    en: 'Recent Transactions',
  },
  'dashboard.noTransactions': {
    th: 'ยังไม่มีประวัติการทำรายการ',
    en: 'No transactions yet',
  },
  
  // Buttons
  'button.earnPoints': {
    th: 'ทดลองสะสมแต้ม',
    en: 'Test Earn Points',
  },
  'button.redeem': {
    th: 'แลกแต้ม',
    en: 'Redeem Points',
  },
  'button.redeemAmount': {
    th: 'แลก {amount} แต้ม',
    en: 'Redeem {amount} Points',
  },
  'button.earnAmount': {
    th: '+{amount} แต้ม',
    en: '+{amount} Points',
  },
  
  // Transactions
  'transaction.earn': {
    th: 'ได้รับ',
    en: 'Earned',
  },
  'transaction.redeem': {
    th: 'ใช้',
    en: 'Redeemed',
  },
  'transaction.qrCode': {
    th: 'QR Code',
    en: 'QR Code',
  },
  
  // Messages
  'message.pointsEarned': {
    th: 'ได้รับ {amount} แต้มสำเร็จ',
    en: 'Successfully earned {amount} points',
  },
  'message.pointsRedeemed': {
    th: 'แลก {amount} แต้มสำเร็จ',
    en: 'Successfully redeemed {amount} points',
  },
  'message.insufficientPoints': {
    th: 'แต้มไม่พอ',
    en: 'Insufficient points',
  },
  'message.qrCodeRedeemed': {
    th: 'แลก QR Code สำเร็จ ได้รับ {amount} แต้ม',
    en: 'QR Code redeemed successfully. Earned {amount} points',
  },
  'message.qrCodeInvalid': {
    th: 'QR Code ไม่ถูกต้องหรือใช้ไปแล้ว',
    en: 'QR Code is invalid or already used',
  },
  'message.qrCodeNotFound': {
    th: 'ไม่พบ QR Code นี้',
    en: 'QR Code not found',
  },
  'message.loading': {
    th: 'กำลังโหลด...',
    en: 'Loading...',
  },
  'message.error': {
    th: 'เกิดข้อผิดพลาด',
    en: 'An error occurred',
  },
  
  // Common
  'common.points': {
    th: 'แต้ม',
    en: 'points',
  },
  'common.language': {
    th: 'th',
    en: 'en',
  },
  
  // Products
  'products.title': {
    th: 'แลกของรางวัล',
    en: 'Redeem Rewards',
  },
  'products.noProducts': {
    th: 'ยังไม่มีสินค้า',
    en: 'No products available',
  },
  'products.redeem': {
    th: 'แลกเลย',
    en: 'Redeem',
  },
  
  // Messages
  'message.productRedeemed': {
    th: 'แลกสินค้าสำเร็จ',
    en: 'Product redeemed successfully',
  },
  
  // Tabs
  'tabs.overview': {
    th: 'ภาพรวม',
    en: 'Overview',
  },
  'tabs.products': {
    th: 'ของรางวัล',
    en: 'Rewards',
  },
  'tabs.history': {
    th: 'ประวัติ',
    en: 'History',
  },
  
  // Stats
  'stats.earned': {
    th: 'ได้รับ',
    en: 'Earned',
  },
  'stats.redeemed': {
    th: 'ใช้ไป',
    en: 'Redeemed',
  },
};

const STORAGE_KEY = 'liff_points_demo_language';

export const getLanguage = (): Language => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'th' || stored === 'en') {
    return stored;
  }
  return 'th'; // Default to Thai
};

export const setLanguage = (lang: Language): void => {
  localStorage.setItem(STORAGE_KEY, lang);
};

export const t = (key: string, params?: Record<string, string | number>): string => {
  const lang = getLanguage();
  const translation = translations[key]?.[lang] || translations[key]?.en || key;
  
  if (params) {
    return Object.entries(params).reduce(
      (str, [paramKey, value]) => str.replace(`{${paramKey}}`, String(value)),
      translation
    );
  }
  
  return translation;
};

