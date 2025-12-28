import { useState } from 'react';
import { purchasePoints } from '../services/paymentService';
import './TopUpPoints.css';

interface TopUpPointsProps {
  userId: string;
  onSuccess?: () => void;
  onClose: () => void;
}

const AMOUNT_OPTIONS = [100, 200, 500, 1000, 2000, 5000];

export const TopUpPoints = ({ userId, onSuccess, onClose }: TopUpPointsProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;

    if (!amount || amount < 1) {
      setError('กรุณาเลือกจำนวนเงินที่ต้องการเติม');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      await purchasePoints(userId, amount);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error('Error purchasing points:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการเติมเงิน');
    } finally {
      setIsProcessing(false);
    }
  };

  const displayAmount = customAmount ? parseInt(customAmount) || 0 : selectedAmount;
  const pointsToReceive = displayAmount; // 1 baht = 1 point

  return (
    <div className="topup-modal-overlay" onClick={onClose}>
      <div className="topup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="topup-header">
          <h2>เติมเงินซื้อ Point</h2>
          <button className="topup-close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="topup-content">
          <div className="topup-info">
            <p className="topup-rate">อัตราแลกเปลี่ยน: 1 บาท = 1 Point</p>
          </div>

          <div className="topup-amount-section">
            <label className="topup-label">เลือกจำนวนเงิน</label>
            <div className="topup-amount-grid">
              {AMOUNT_OPTIONS.map((amount) => (
                <button
                  key={amount}
                  className={`topup-amount-btn ${selectedAmount === amount && !customAmount ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                >
                  {amount.toLocaleString()} ฿
                </button>
              ))}
            </div>

            <div className="topup-custom-amount">
              <label className="topup-label">หรือระบุจำนวนเอง</label>
              <input
                type="number"
                className="topup-custom-input"
                placeholder="ระบุจำนวนเงิน"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(0);
                }}
                min="1"
              />
            </div>
          </div>

          <div className="topup-summary">
            <div className="topup-summary-row">
              <span>จำนวนเงิน</span>
              <span className="topup-summary-value">{displayAmount.toLocaleString()} บาท</span>
            </div>
            <div className="topup-summary-row">
              <span>Point ที่จะได้รับ</span>
              <span className="topup-summary-value points">{pointsToReceive.toLocaleString()} Point</span>
            </div>
          </div>

          {error && (
            <div className="topup-error">
              {error}
            </div>
          )}

          <button
            className="topup-submit-btn"
            onClick={handlePurchase}
            disabled={isProcessing || displayAmount < 1}
          >
            {isProcessing ? 'กำลังดำเนินการ...' : 'ยืนยันการเติมเงิน'}
          </button>

          <p className="topup-note">* นี่เป็นการจำลองการเติมเงิน (Mock Payment)</p>
        </div>
      </div>
    </div>
  );
};

