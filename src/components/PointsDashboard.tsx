import { useState, useEffect } from 'react';
import { getUserPoints, getPointHistory, createOrUpdateUser } from '../services/pointsService';
import type { TourMember, PointTransaction } from '../types';
import { PointsHistory } from './PointsHistory';
import { EarnPointsButton } from './EarnPointsButton';
import { RedeemPointsButton } from './RedeemPointsButton';
import { Products } from './Products';
import { MyRedemptions } from './MyRedemptions';
import { TopUpPoints } from './TopUpPoints';
import { ProductRedemptionDetail } from './ProductRedemptionDetail';
import { t } from '../utils/i18n';
import './PointsDashboard.css';

interface PointsDashboardProps {
  userId: string;
  displayName: string;
  profilePicture?: string;
}

export const PointsDashboard = ({ userId, displayName, profilePicture }: PointsDashboardProps) => {
  const [user, setUser] = useState<TourMember | null>(null);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'my-redemptions' | 'history'>('overview');
  const [showTopUp, setShowTopUp] = useState(false);
  const [redemptionId, setRedemptionId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      let userData = await getUserPoints(userId);
      if (!userData) userData = await createOrUpdateUser(userId, displayName);
      setUser(userData);
      const history = await getPointHistory(userId, 10);
      setTransactions(history);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const handlePointsUpdate = () => {
    loadData();
  };

  const handleRedeem = (id: string) => {
    setRedemptionId(id);
  };

  const handleCloseRedemption = () => {
    setRedemptionId(null);
  };

  const totalEarned = transactions.filter(tx => tx.type === 'earn').reduce((sum, tx) => sum + tx.amount, 0);
  const totalRedeemed = transactions.filter(tx => tx.type === 'redeem').reduce((sum, tx) => sum + tx.amount, 0);

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  if (!user) return <div className="error-message">{t('message.error')}</div>;

  return (
    <div className="dashboard-container">
      <header className="app-header">
        <div className="header-left">
          {profilePicture ? (
            <img src={profilePicture} alt={displayName} className="profile-picture" />
          ) : (
            <div className="profile-picture-placeholder"></div>
          )}
        </div>
        <div className="header-right">
          <button className="icon-button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
          <button className="icon-button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          </button>
        </div>
      </header>

      <div className="content-area">
        {activeTab === 'overview' && (
          <>
            <h3 className="section-label-tiny">MY ACCOUNT</h3>
            <div className="balance-card-modern">
              <div className="balance-header">
                <span className="balance-label">{t('dashboard.pointsBalance')}</span>
                <span className="balance-change">↑ 12%</span>
              </div>
              <div className="balance-value">{user.points_balance.toLocaleString()}</div>
              <div className="balance-label">{t('common.points')}</div>
            </div>

            <h3 className="section-label-tiny">STATISTICS</h3>
            <div className="stats-row-modern">
              <div className="stat-item-mini">
                <div className="stat-item-label">{t('stats.earned')}</div>
                <div className="stat-item-value">{totalEarned.toLocaleString()}</div>
              </div>
              <div className="stat-item-mini">
                <div className="stat-item-label">{t('stats.redeemed')}</div>
                <div className="stat-item-value">{totalRedeemed.toLocaleString()}</div>
              </div>
            </div>

            <h3 className="section-label-tiny">QUICK ACTIONS</h3>
            <div className="action-grid-modern">
              <button className="action-btn-topup" onClick={() => setShowTopUp(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>เติมเงิน</span>
              </button>
              <EarnPointsButton userId={userId} amount={10} onSuccess={handlePointsUpdate} />
              <RedeemPointsButton userId={userId} amount={50} onSuccess={handlePointsUpdate} />
            </div>

            {user.current_tour && (
              <>
                <h3 className="section-label-tiny">CURRENT TRIP</h3>
                <div className="tour-card-minimal">
                  <div className="tour-info-box">
                    <div className="tour-name-main">{user.current_tour}</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </>
            )}

            <h3 className="section-label-tiny">RECENT ACTIVITY</h3>
            <PointsHistory transactions={transactions.slice(0, 5)} />
          </>
        )}

        {activeTab === 'products' && (
          <Products
            userId={userId}
            onRedeemSuccess={handlePointsUpdate}
            onRedeem={handleRedeem}
          />
        )}
        {activeTab === 'my-redemptions' && (
          <MyRedemptions userId={userId} />
        )}
        {activeTab === 'history' && <PointsHistory transactions={transactions} />}
      </div>

      <div className="bottom-nav-modern">
        <button className={`nav-item-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </button>
        <button className={`nav-item-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>
        </button>
        <button className={`nav-item-btn ${activeTab === 'my-redemptions' ? 'active' : ''}`} onClick={() => setActiveTab('my-redemptions')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v3H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V9c0-1.11-.89-2-2-2zm-6 0h-4V4h4v3z"/></svg>
        </button>
        <button className={`nav-item-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
        </button>
      </div>

      {showTopUp && (
        <TopUpPoints
          userId={userId}
          onSuccess={handlePointsUpdate}
          onClose={() => setShowTopUp(false)}
        />
      )}

      {redemptionId && (
        <ProductRedemptionDetail
          redemptionId={redemptionId}
          userId={userId}
          onClose={handleCloseRedemption}
        />
      )}
    </div>
  );
};
