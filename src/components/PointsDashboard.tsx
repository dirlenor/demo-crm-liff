import { useState, useEffect } from 'react';
import { getUserPoints, getPointHistory, createOrUpdateUser } from '../services/pointsService';
import type { TourMember, PointTransaction, Product } from '../types';
import { PointsHistory } from './PointsHistory';
import { Products } from './Products';
import { MyRedemptions } from './MyRedemptions';
import { TopUpPoints } from './TopUpPoints';
import { ProductRedemptionDetail } from './ProductRedemptionDetail';
import { getActiveProducts } from '../services/productService';
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'reward' | 'history'>('overview');
  const [rewardSubTab, setRewardSubTab] = useState<'products' | 'my-redemptions'>('products');
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
      const productsData = await getActiveProducts();
      setProducts(productsData.slice(0, 3)); // Show first 3 for preview
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

  // Calculate tier progress (Gold Tier: 750/1000)
  const currentTier = 'Gold Tier';
  const currentProgress = user.points_balance;
  const nextTierPoints = 1000;
  const progressToNext = Math.min((currentProgress / nextTierPoints) * 100, 100);
  const pointsToNext = Math.max(0, nextTierPoints - currentProgress);

  return (
    <div className="reward-dashboard">
      {/* Top Navigation */}
      <header className="reward-header">
        <div className="header-left">
          {profilePicture ? (
            <img src={profilePicture} alt={displayName} className="header-avatar" />
          ) : (
            <div className="header-avatar placeholder"></div>
          )}
          <span className="header-greeting">Hi, {displayName.split(' ')[0]}!</span>
        </div>
        <button className="header-notification-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
          <span className="notification-badge"></span>
        </button>
      </header>

      <div className="reward-content">
        {activeTab === 'overview' && (
          <>
            {/* Hero Section: Points & Mascot */}
            <section className="hero-section">
              <div className="hero-container">
                {/* Mascot Placeholder */}
                <div className="mascot-container">
                  <div className="mascot-bounce">
                    <svg width="128" height="128" viewBox="0 0 128 128" fill="none">
                      <circle cx="64" cy="64" r="60" fill="#FFD700"/>
                      <circle cx="64" cy="64" r="50" fill="#FFA500"/>
                      <circle cx="50" cy="50" r="8" fill="#1a1a1a"/>
                      <circle cx="78" cy="50" r="8" fill="#1a1a1a"/>
                      <path d="M50 75 Q64 85 78 75" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
                {/* Points Display */}
                <div className="points-display">
                  <h1 className="points-value">{user.points_balance.toLocaleString()}</h1>
                  <p className="points-label">Total Points</p>
                </div>
              </div>
            </section>

            {/* Progress Bar Section */}
            <section className="progress-section">
              <div className="progress-card">
                <div className="progress-header">
                  <span className="tier-name">{currentTier}</span>
                  <span className="tier-progress">{currentProgress} / {nextTierPoints} to next level</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${progressToNext}%` }}></div>
                  </div>
                </div>
                <div className="progress-hint">
                  Earn {pointsToNext} more points to unlock <span className="highlight">2x Multiplier</span>
                </div>
              </div>
            </section>

            {/* Available Rewards */}
            <section className="rewards-section">
              <div className="rewards-header">
                <h2 className="rewards-title">Available Rewards</h2>
                <button className="rewards-see-all" onClick={() => { setActiveTab('reward'); setRewardSubTab('products'); }}>See All</button>
              </div>
              <div className="rewards-scroll">
                {products.map((product) => (
                  <div key={product.id} className="reward-card" onClick={() => { setActiveTab('reward'); setRewardSubTab('products'); }}>
                    <div className="reward-image">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} />
                      ) : (
                        <div className="reward-image-placeholder"></div>
                      )}
                    </div>
                    <div className="reward-info">
                      <h3 className="reward-name">{product.name}</h3>
                      <p className="reward-desc">{product.description || 'Digital Code'}</p>
                      <div className="reward-footer">
                        <span className="reward-points">{product.points_required} Pts</span>
                        <button className="reward-arrow">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m9 18 6-6-6-6"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="no-rewards">No rewards available</div>
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === 'reward' && (
          <div className="reward-tab-container">
            <div className="reward-tab-header">
              <button 
                className={`reward-tab-btn ${rewardSubTab === 'products' ? 'active' : ''}`}
                onClick={() => setRewardSubTab('products')}
              >
                Explore Rewards
              </button>
              <button 
                className={`reward-tab-btn ${rewardSubTab === 'my-redemptions' ? 'active' : ''}`}
                onClick={() => setRewardSubTab('my-redemptions')}
              >
                My Rewards
              </button>
            </div>
            {rewardSubTab === 'products' && (
              <Products
                userId={userId}
                onRedeemSuccess={handlePointsUpdate}
                onRedeem={handleRedeem}
              />
            )}
            {rewardSubTab === 'my-redemptions' && (
              <MyRedemptions key={refreshRedemptions} userId={userId} />
            )}
          </div>
        )}
        {activeTab === 'history' && <PointsHistory transactions={transactions} />}
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="bottom-nav">
        <div className="bottom-nav-container">
          <button className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span className="nav-label">Home</span>
          </button>
          <button className={`nav-btn ${activeTab === 'reward' ? 'active' : ''}`} onClick={() => { setActiveTab('reward'); setRewardSubTab('products'); }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            <span className="nav-label">Reward</span>
          </button>
          <button className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="nav-label">History</span>
          </button>
        </div>
      </nav>

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
