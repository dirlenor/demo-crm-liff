import { useEffect, useState } from 'react';
import { getUserRedemptions } from '../services/redemptionService';
import type { RedemptionDetail } from '../services/redemptionService';
import { getLanguage } from '../utils/i18n';
import { ProductRedemptionDetail } from './ProductRedemptionDetail';
import './MyRedemptions.css';

interface MyRedemptionsProps {
  userId: string;
}

export const MyRedemptions = ({ userId }: MyRedemptionsProps) => {
  const [redemptions, setRedemptions] = useState<RedemptionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRedemptionId, setSelectedRedemptionId] = useState<string | null>(null);

  useEffect(() => {
    loadRedemptions();
  }, [userId]);

  const loadRedemptions = async () => {
    try {
      setLoading(true);
      const data = await getUserRedemptions(userId);
      setRedemptions(data);
    } catch (error) {
      console.error('Error loading redemptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getProductName = (product: any) => {
    const lang = getLanguage();
    return lang === 'th' ? product.name : (product.name_en || product.name);
  };

  if (loading) {
    return (
      <div className="my-redemptions-loading">
        <div className="spinner"></div>
        <p>กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <>
      <div className="my-redemptions-section">
        <div className="my-redemptions-header">
          <h2 className="my-redemptions-title">ของรางวัลที่เคยแลก</h2>
          <p className="my-redemptions-subtitle">รายการทั้งหมด {redemptions.length} รายการ</p>
        </div>

        {redemptions.length === 0 ? (
          <div className="my-redemptions-empty">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 9h6v6H9z" />
              </svg>
            </div>
            <p>ยังไม่มีรายการแลกรางวัล</p>
          </div>
        ) : (
          <div className="my-redemptions-list">
            {redemptions.map((redemption) => {
              const expired = isExpired(redemption.expires_at);
              
              return (
                <div
                  key={redemption.id}
                  className={`redemption-item ${expired ? 'expired' : ''}`}
                  onClick={() => setSelectedRedemptionId(redemption.id)}
                >
                  {redemption.product.image_url ? (
                    <img
                      src={redemption.product.image_url}
                      alt={getProductName(redemption.product)}
                      className="redemption-item-image"
                    />
                  ) : (
                    <div className="redemption-item-image-placeholder">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M9 9h6v6H9z" />
                      </svg>
                    </div>
                  )}

                  <div className="redemption-item-content">
                    <div className="redemption-item-header">
                      <h3 className="redemption-item-name">{getProductName(redemption.product)}</h3>
                      {expired && <span className="redemption-item-expired-badge">หมดอายุ</span>}
                    </div>

                    <div className="redemption-item-info">
                      <div className="redemption-item-code">
                        <span className="code-label">รหัส:</span>
                        <span className="code-value">{redemption.redemption_code || '-'}</span>
                      </div>
                      <div className="redemption-item-date">
                        แลกเมื่อ: {formatDate(redemption.created_at)}
                      </div>
                    </div>

                    <div className="redemption-item-footer">
                      <div className="redemption-item-points">
                        ใช้ไป {redemption.points_used.toLocaleString()} แต้ม
                      </div>
                      <button className="redemption-item-view-btn">
                        ดูรายละเอียด
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedRedemptionId && (
        <ProductRedemptionDetail
          redemptionId={selectedRedemptionId}
          userId={userId}
          onClose={() => setSelectedRedemptionId(null)}
        />
      )}
    </>
  );
};

