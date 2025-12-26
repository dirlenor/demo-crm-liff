import { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/adminService';
import type { DashboardStats } from '../types';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!stats) {
    return <div className="error">Failed to load dashboard</div>;
  }

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalMembers.toLocaleString()}</div>
            <div className="stat-label">สมาชิกทั้งหมด</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalPoints.toLocaleString()}</div>
            <div className="stat-label">แต้มรวมทั้งหมด</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalTransactions.toLocaleString()}</div>
            <div className="stat-label">รายการทั้งหมด</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔲</div>
          <div className="stat-content">
            <div className="stat-value">
              {stats.usedQRCodes} / {stats.totalQRCodes}
            </div>
            <div className="stat-label">QR Codes ใช้แล้ว/ทั้งหมด</div>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <h2 className="section-title">รายการล่าสุด</h2>
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>เวลา</th>
                <th>ประเภท</th>
                <th>จำนวน</th>
                <th>รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty-state">ไม่มีรายการ</td>
                </tr>
              ) : (
                stats.recentTransactions.map((tx) => (
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

