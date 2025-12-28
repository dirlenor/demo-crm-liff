import type { PointTransaction } from '../types';
import { t } from '../utils/i18n';
import './PointsHistory.css';

interface PointsHistoryProps {
  transactions: PointTransaction[];
}

export const PointsHistory = ({ transactions }: PointsHistoryProps) => {
  if (transactions.length === 0) {
    return (
      <div className="no-transactions">
        <div className="no-transactions-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
          </svg>
        </div>
        <p>{t('dashboard.noTransactions')}</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('common.justNow') || 'เมื่อสักครู่';
    if (minutes < 60) return `${minutes} ${t('common.minutesAgo') || 'นาทีที่แล้ว'}`;
    if (hours < 24) return `${hours} ${t('common.hoursAgo') || 'ชั่วโมงที่แล้ว'}`;
    if (days < 7) return `${days} ${t('common.daysAgo') || 'วันที่แล้ว'}`;
    
    return date.toLocaleDateString('th-TH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTransactionIcon = (type: string, description: string | null) => {
    if (description?.includes('QR')) {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="14" height="14" rx="1"/>
          <path d="M7 7h6v6H7z"/>
        </svg>
      );
    }
    if (description?.includes('Redeem')) {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="14" height="14" rx="2"/>
          <path d="M8 7v6M12 7v6"/>
        </svg>
      );
    }
    if (type === 'earn') {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 5v10M5 10h10"/>
        </svg>
      );
    }
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 10h10"/>
      </svg>
    );
  };

  return (
    <div className="transactions-list">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className={`transaction-item ${transaction.type}`}
        >
          <div className="transaction-icon-wrapper">
            <div className="transaction-icon">
              {getTransactionIcon(transaction.type, transaction.description)}
            </div>
          </div>
          <div className="transaction-content">
            <div className="transaction-main">
              <div className="transaction-title">
                {transaction.description || t(`transaction.${transaction.type}`)}
              </div>
              <div className={`transaction-amount ${transaction.type}`}>
                {transaction.type === 'earn' ? '+' : '-'}
                {transaction.amount.toLocaleString()}
              </div>
            </div>
            <div className="transaction-date">{formatDate(transaction.created_at)}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
