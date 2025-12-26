import { useState } from 'react';
import { earnPoints } from '../services/pointsService';
import { t } from '../utils/i18n';
import './Button.css';

interface EarnPointsButtonProps {
  userId: string;
  amount?: number;
  onSuccess?: () => void;
}

export const EarnPointsButton = ({
  userId,
  amount = 10,
  onSuccess,
}: EarnPointsButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleEarn = async () => {
    setLoading(true);
    setMessage(null);

    try {
      await earnPoints(userId, amount, t('button.earnAmount', { amount }));
      setMessage(t('message.pointsEarned', { amount }));
      onSuccess?.();
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error earning points:', error);
      setMessage(t('message.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="button-wrapper-compact">
      <button
        onClick={handleEarn}
        disabled={loading}
        className="action-button-compact earn"
      >
        {loading ? (
          <>
            <span className="button-spinner-small"></span>
          </>
        ) : (
          <>
            {t('button.earnAmount', { amount })}
          </>
        )}
      </button>
      {message && (
        <div className={`message-compact ${message.includes('error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
    </div>
  );
};
