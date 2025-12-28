import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { getRedemptionDetail } from '../services/redemptionService';
import type { RedemptionDetail } from '../services/redemptionService';
import { getLanguage } from '../utils/i18n';
import './ProductRedemptionDetail.css';

interface ProductRedemptionDetailProps {
  redemptionId: string;
  userId?: string;
  onClose: () => void;
}

export const ProductRedemptionDetail = ({
  redemptionId,
  onClose,
}: ProductRedemptionDetailProps) => {
  const [redemption, setRedemption] = useState<RedemptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const loadRedemption = async () => {
      try {
        const data = await getRedemptionDetail(redemptionId);
        setRedemption(data);
        
        // Calculate initial time remaining
        if (data.expires_at) {
          const expiresAt = new Date(data.expires_at).getTime();
          const now = Date.now();
          const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
          setTimeRemaining(remaining);
          setExpired(remaining === 0);
        }
      } catch (error) {
        console.error('Error loading redemption detail:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRedemption();
  }, [redemptionId]);

  useEffect(() => {
    if (!redemption?.expires_at || expired) return;

    const interval = setInterval(() => {
      const expiresAt = new Date(redemption.expires_at).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
      
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        setExpired(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [redemption?.expires_at, expired]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyCode = () => {
    if (redemption?.redemption_code) {
      navigator.clipboard.writeText(redemption.redemption_code);
      // You could add a toast notification here
    }
  };

  const getProductName = () => {
    if (!redemption?.product) return '';
    const lang = getLanguage();
    return lang === 'th'
      ? redemption.product.name
      : redemption.product.name_en || redemption.product.name;
  };

  const getProductDescription = () => {
    if (!redemption?.product) return '';
    const lang = getLanguage();
    return lang === 'th'
      ? redemption.product.description
      : redemption.product.description_en || redemption.product.description;
  };

  if (loading) {
    return (
      <div className="redemption-detail-overlay">
        <div className="redemption-detail-loading">
          <div className="spinner"></div>
          <p>กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!redemption) {
    return (
      <div className="redemption-detail-overlay">
        <div className="redemption-detail-error">
          <p>ไม่พบข้อมูลการแลกรางวัล</p>
          <button onClick={onClose}>ปิด</button>
        </div>
      </div>
    );
  }

  return (
    <div className="redemption-detail-overlay" onClick={onClose}>
      <div className="redemption-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="redemption-detail-header">
          <h2>การแลกรางวัล</h2>
          <button className="redemption-detail-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="redemption-detail-content">
          {/* Product Info */}
          {redemption.product.image_url ? (
            <img
              src={redemption.product.image_url}
              alt={getProductName()}
              className="redemption-detail-product-image"
            />
          ) : (
            <div className="redemption-detail-product-image-placeholder">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 9h6v6H9z" />
              </svg>
            </div>
          )}

          <div className="redemption-detail-product-info">
            <h3 className="redemption-detail-product-name">{getProductName()}</h3>
            {getProductDescription() && (
              <p className="redemption-detail-product-description">{getProductDescription()}</p>
            )}
          </div>

          {/* Countdown Timer */}
          {!expired && timeRemaining !== null && (
            <div className="redemption-detail-timer">
              <div className="redemption-detail-timer-label">QR Code หมดอายุใน</div>
              <div className="redemption-detail-timer-value">{formatTime(timeRemaining)}</div>
            </div>
          )}

          {expired && (
            <div className="redemption-detail-expired">
              QR Code หมดอายุแล้ว
            </div>
          )}

          {/* QR Code */}
          {redemption.redemption_code && !expired && (
            <div className="redemption-detail-qr-section">
              <div className="redemption-detail-qr-code">
                <QRCodeSVG
                  value={redemption.redemption_code}
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              </div>
            </div>
          )}

          {/* Redemption Code */}
          {redemption.redemption_code && (
            <div className="redemption-detail-code-section">
              <label className="redemption-detail-code-label">รหัสการแลก</label>
              <div className="redemption-detail-code-box">
                <span className="redemption-detail-code-value">{redemption.redemption_code}</span>
                <button
                  className="redemption-detail-copy-btn"
                  onClick={handleCopyCode}
                  disabled={expired}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  คัดลอก
                </button>
              </div>
              <p className="redemption-detail-code-hint">
                กรอกรหัสหรือสแกน QR Code เพื่อยืนยันการแลกรางวัล
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

