import { useState, useEffect } from 'react';
import { getUserPoints, getPointHistory, createOrUpdateUser } from '../services/pointsService';
import type { TourMember, PointTransaction } from '../types';
import { PointsHistory } from './PointsHistory';
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

export const PointsDashboard = ({ userId, displayName }: PointsDashboardProps) => {
  const [user, setUser] = useState<TourMember | null>(null);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'my-redemptions' | 'history'>('overview');
  const [showTopUp, setShowTopUp] = useState(false);
  const [redemptionId, setRedemptionId] = useState<string | null>(null);
  const [refreshRedemptions, setRefreshRedemptions] = useState(0);

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
    // Trigger refresh for My Redemptions tab
    setRefreshRedemptions(prev => prev + 1);
  };

  const handleRedeem = (id: string) => {
    setRedemptionId(id);
  };

  const handleCloseRedemption = () => {
    setRedemptionId(null);
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  if (!user) return <div className="error-message">{t('message.error')}</div>;

  // Calculate progress (assuming max 500 points for progress bar)
  const maxPoints = 500;
  const progressPercentage = Math.min((user.points_balance / maxPoints) * 100, 100);

  return (
    <div className="dashboard-container">
      <header className="app-header-rewards">
        <button className="header-back-btn" onClick={() => window.history.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="header-title">Rewards club</h1>
        <button className="header-help-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
        </button>
      </header>

      <div className="content-area">
        {activeTab === 'overview' && (
          <>
            {/* Your Points Card with Progress */}
            <div className="points-card-rewards">
              <div className="points-card-content">
                <div className="points-icon-wrapper">
                  <svg className="progress-ring" width="60" height="60">
                    <circle
                      className="progress-ring-circle-bg"
                      stroke="#E0E0E0"
                      strokeWidth="3"
                      fill="transparent"
                      r="26"
                      cx="30"
                      cy="30"
                    />
                    <circle
                      className="progress-ring-circle"
                      stroke="#FFA500"
                      strokeWidth="3"
                      fill="transparent"
                      r="26"
                      cx="30"
                      cy="30"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 26}`,
                        strokeDashoffset: `${2 * Math.PI * 26 * (1 - progressPercentage / 100)}`,
                        transform: 'rotate(-90deg)',
                        transformOrigin: '30px 30px',
                        transition: 'stroke-dashoffset 0.3s ease',
                      }}
                    />
                  </svg>
                  <div className="points-icon-circle">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                  </div>
                </div>
                <div className="points-info">
                  <div className="points-label">Your points</div>
                  <div className="points-value-large">{user.points_balance}</div>
                  <div className="points-max">/{maxPoints}</div>
                </div>
                <button className="points-arrow-btn" onClick={() => setActiveTab('history')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </div>

            {/* Navigation Cards */}
            <div className="nav-cards-grid">
              <button className="nav-card" onClick={() => setActiveTab('history')}>
                <div className="nav-card-icon history-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div className="nav-card-label">History</div>
              </button>
              <button className="nav-card" onClick={() => setActiveTab('products')}>
                <div className="nav-card-icon explore-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.3-4.3"/>
                    <circle cx="11" cy="11" r="3" fill="currentColor" opacity="0.3"/>
                  </svg>
                </div>
                <div className="nav-card-label">Explore rewards</div>
              </button>
              <button className="nav-card" onClick={() => setActiveTab('my-redemptions')}>
                <div className="nav-card-icon rewards-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 7h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v3H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V9c0-1.11-.89-2-2-2zm-6 0h-4V4h4v3z"/>
                    <path d="M12 12v4M10 14h4" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="nav-card-label">Your rewards</div>
              </button>
            </div>

            {/* Promotional Banner */}
            <div className="promo-banner">
              <div className="promo-content">
                <div className="promo-text">
                  <div className="promo-title">Discover today's top deals.</div>
                  <div className="promo-subtitle">Treat yourself and collect more points while you're at it.</div>
                  <button className="promo-link" onClick={() => setActiveTab('products')}>Shop now</button>
                </div>
                <div className="promo-image-placeholder"></div>
              </div>
            </div>

            {/* Missions Section */}
            <h3 className="section-label-missions">Missions</h3>
            <div className="missions-grid">
              <button className="mission-card mission-card-blue" onClick={() => setShowTopUp(true)}>
                <div className="mission-icon-wrapper">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M9 9h6v6H9z"/>
                    <path d="M9 3v6M15 3v6M9 15v6M15 15v6"/>
                  </svg>
                </div>
                <div className="mission-reward">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  <span>10 x3</span>
                </div>
                <div className="mission-title">Top up points</div>
              </button>
              <button className="mission-card mission-card-yellow" onClick={() => setActiveTab('products')}>
                <div className="mission-icon-wrapper">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div className="mission-reward">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  <span>10 x10</span>
                </div>
                <div className="mission-title">Redeem rewards</div>
              </button>
            </div>

            {/* Recent Activity */}
            <h3 className="section-label-missions" style={{ marginTop: '32px' }}>Recent Activity</h3>
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
          <MyRedemptions key={refreshRedemptions} userId={userId} />
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
