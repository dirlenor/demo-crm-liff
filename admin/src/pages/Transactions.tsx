import { useEffect, useState } from 'react';
import { getAllTransactions } from '../services/adminService';
import type { PointTransaction } from '../types';
import './Transactions.css';

export default function Transactions() {
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await getAllTransactions(200);
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  return (
    <div className="transactions-page">
      <div className="dashboard-controls">
        <div className="control-tabs">
          <button className="tab active">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
            Order History
          </button>
        </div>
        <div className="control-actions">
          <button className="action-btn" onClick={loadTransactions}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.001 0 01-15.357-2m15.357 2H15"/></svg> Refresh</button>
          <button className="export-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 10l-4 4m0 0l-4-4m4 4V4"/></svg> Export</button>
        </div>
      </div>

      <div className="table-section-modern">
        <div className="table-header-modern transactions-grid">
          <div className="col-checkbox"><input type="checkbox" /></div>
          <div className="col-date">Date & Time</div>
          <div className="col-user">User ID</div>
          <div className="col-type">Type</div>
          <div className="col-amount">Amount</div>
          <div className="col-desc">Description</div>
        </div>
        <div className="table-body-modern">
          {transactions.length === 0 ? (
            <div className="empty-state">No transactions found</div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="table-row-modern transactions-grid">
                <div className="col-checkbox"><input type="checkbox" /></div>
                <div className="col-date">{new Date(tx.created_at).toLocaleString('th-TH')}</div>
                <div className="col-user">
                  <span className="user-id-modern">{tx.line_user_id.substring(0, 12)}...</span>
                </div>
                <div className="col-type">
                  <span className={`status-badge ${tx.type === 'earn' ? 'in-stock' : 'out-stock'}`}>
                    {tx.type === 'earn' ? 'Received' : 'Redeemed'}
                  </span>
                </div>
                <div className={`col-amount ${tx.type === 'earn' ? 'positive' : 'negative'}`}>
                  {tx.type === 'earn' ? '+' : '-'}{tx.amount.toLocaleString()}
                </div>
                <div className="col-desc">{tx.description || '-'}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
