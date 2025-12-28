import { useState } from 'react';
import type { Product, TourMember } from '../types';
import { getLanguage } from '../utils/i18n';
import './RedeemConfirmation.css';

interface RedeemConfirmationProps {
  product: Product;
  user: TourMember;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RedeemConfirmation = ({ product, user, onConfirm, onCancel }: RedeemConfirmationProps) => {
  const [confirming, setConfirming] = useState(false);
  const lang = getLanguage();

  const getProductName = () => {
    return lang === 'th' ? product.name : (product.name_en || product.name);
  };

  const handleConfirm = () => {
    setConfirming(true);
    // Close modal immediately and let parent handle the redemption
    onConfirm();
  };

  const pointsAfter = user.points_balance - product.points_required;

  return (
    <div className="redeem-confirmation-overlay" onClick={onCancel}>
      <div className="redeem-confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="redeem-confirmation-header">
          <h2>ยืนยันการแลกรางวัล</h2>
          <button className="redeem-confirmation-close" onClick={onCancel}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="redeem-confirmation-content">
          {product.image_url ? (
            <img src={product.image_url} alt={getProductName()} className="redeem-confirmation-product-image" />
          ) : (
            <div className="redeem-confirmation-product-image-placeholder">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 9h6v6H9z" />
              </svg>
            </div>
          )}

          <div className="redeem-confirmation-product-info">
            <h3 className="redeem-confirmation-product-name">{getProductName()}</h3>
            <div className="redeem-confirmation-points-info">
              <div className="points-info-row">
                <span className="points-info-label">แต้มปัจจุบัน</span>
                <span className="points-info-value current">{user.points_balance.toLocaleString()} แต้ม</span>
              </div>
              <div className="points-info-row">
                <span className="points-info-label">ใช้ไป</span>
                <span className="points-info-value deduct">- {product.points_required.toLocaleString()} แต้ม</span>
              </div>
              <div className="points-info-divider"></div>
              <div className="points-info-row">
                <span className="points-info-label">แต้มคงเหลือ</span>
                <span className="points-info-value remaining">{pointsAfter.toLocaleString()} แต้ม</span>
              </div>
            </div>
          </div>

          <div className="redeem-confirmation-actions">
            <button
              className="redeem-confirmation-cancel-btn"
              onClick={onCancel}
              disabled={confirming}
            >
              ยกเลิก
            </button>
            <button
              className="redeem-confirmation-confirm-btn"
              onClick={handleConfirm}
              disabled={confirming}
            >
              {confirming ? 'กำลังดำเนินการ...' : 'ยืนยันการแลก'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

