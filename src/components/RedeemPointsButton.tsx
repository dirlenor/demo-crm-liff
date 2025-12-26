import { useState } from 'react';
import { redeemPoints } from '../services/pointsService';
import { t } from '../utils/i18n';
import './Button.css';

interface RedeemPointsButtonProps {
  userId: string;
  amount?: number;
  onSuccess?: () => void;
}

export const RedeemPointsButton = ({
  userId,
  amount = 50,
  onSuccess,
}: RedeemPointsButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRedeem = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const success = await redeemPoints(
        userId,
        amount,
        t('button.redeemAmount', { amount })
      );

      if (success) {
        setMessage(t('message.pointsRedeemed', { amount }));
        onSuccess?.();
      } else {
        setMessage(t('message.insufficientPoints'));
      }

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error redeeming points:', error);
      setMessage(t('message.error'));
    } finally {
      setLoading(false);
    }
  };

  const isError = message && (message.includes('ไม่พอ') || message.includes('Insufficient') || message.includes('error') || message.includes('ข้อผิดพลาด'));

  return (
    <div className="button-wrapper-compact">
      <button
        onClick={handleRedeem}
        disabled={loading}
        className="action-button-compact redeem"
      >
        {loading ? (
          <>
            <span className="button-spinner-small"></span>
          </>
        ) : (
          <>
            {t('button.redeemAmount', { amount })}
          </>
        )}
      </button>
      {message && (
        <div className={`message-compact ${isError ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
    </div>
  );
};
