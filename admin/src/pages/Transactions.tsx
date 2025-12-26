import { useEffect, useState } from 'react';
import { getAllTransactions } from '../services/adminService';
import type { PointTransaction } from '../types';
import './Transactions.css';

export default function Transactions() {
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await getAllTransactions(200);
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h1 className="page-title">ประวัติการทำรายการ ({transactions.length})</h1>
        <button onClick={loadTransactions} className="refresh-btn">🔄 Refresh</button>
      </div>

      <div className="transactions-table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>เวลา</th>
              <th>ประเภท</th>
              <th>จำนวน</th>
              <th>รายละเอียด</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">ไม่มีรายการ</td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{new Date(tx.created_at).toLocaleString('th-TH')}</td>
                  <td>
                    <span className={`badge ${tx.type}`}>
                      {tx.type === 'earn' ? 'ได้รับ' : 'ใช้'}
                    </span>
                  </td>
                  <td className={tx.type === 'earn' ? 'positive' : 'negative'}>
                    {tx.type === 'earn' ? '+' : '-'}
                    {tx.amount.toLocaleString()}
                  </td>
                  <td>{tx.description || '-'}</td>
                  <td className="user-id">{tx.line_user_id.substring(0, 20)}...</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

