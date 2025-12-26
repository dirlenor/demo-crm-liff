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
        <div className="no-transactions-icon">📋</div>
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
    if (description?.includes('QR')) return '🔲';
    if (description?.includes('Redeem')) return '🎁';
    if (type === 'earn') return '➕';
    return '➖';
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
