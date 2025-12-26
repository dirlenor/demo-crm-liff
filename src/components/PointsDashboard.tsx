import { useState, useEffect } from 'react';
import { getUserPoints, getPointHistory, createOrUpdateUser } from '../services/pointsService';
import type { TourMember, PointTransaction } from '../types';
import { PointsHistory } from './PointsHistory';
import { EarnPointsButton } from './EarnPointsButton';
import { RedeemPointsButton } from './RedeemPointsButton';
import { Products } from './Products';
import { LanguageToggle } from './LanguageToggle';
import { t, type Language, getLanguage } from '../utils/i18n';
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
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'history'>('overview');
  const [, setLanguage] = useState<Language>(getLanguage());

  const loadData = async () => {
    try {
      setLoading(true);
      let userData = await getUserPoints(userId);

      if (!userData) {
        userData = await createOrUpdateUser(userId, displayName);
      }

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

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const handlePointsUpdate = () => {
    loadData();
  };

  const totalEarned = transactions
    .filter(tx => tx.type === 'earn')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalRedeemed = transactions
    .filter(tx => tx.type === 'redeem')
    .reduce((sum, tx) => sum + tx.amount, 0);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>{t('message.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="error-message">{t('message.error')}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="app-header">
        <div className="header-left">
          {profilePicture ? (
            <img src={profilePicture} alt={displayName} className="profile-picture" />
          ) : (
            <div className="profile-picture-placeholder">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="header-right">
          <button className="icon-button">🔍</button>
          <button className="icon-button">🔔</button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          {t('tabs.overview') || 'ภาพรวม'}
        </button>
        <button
          className={`nav-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          {t('tabs.products') || 'ของรางวัล'}
        </button>
        <button
          className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          {t('tabs.history') || 'ประวัติ'}
        </button>
      </div>

      {/* Content Area */}
      <div className="content-area">
        {activeTab === 'overview' && (
          <>
            {/* Total Balance */}
            <div className="balance-section">
              <div className="balance-label">{t('dashboard.pointsBalance')}</div>
              <div className="balance-value">{user.points_balance.toLocaleString()}</div>
              <div className="balance-subtitle">{t('common.points')}</div>
            </div>

            {/* Income/Spending Circular Buttons */}
            <div className="stats-circles">
              <div className="stat-circle income">
                <div className="stat-icon">↑</div>
                <div className="stat-label">{t('stats.earned') || 'ได้รับ'}</div>
                <div className="stat-value">{totalEarned.toLocaleString()}</div>
              </div>
              <div className="stat-circle spending">
                <div className="stat-icon">↓</div>
                <div className="stat-label">{t('stats.redeemed') || 'ใช้ไป'}</div>
                <div className="stat-value">{totalRedeemed.toLocaleString()}</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <div className="action-item">
                <div className="action-icon">➕</div>
                <EarnPointsButton userId={userId} amount={10} onSuccess={handlePointsUpdate} />
              </div>
              <div className="action-item">
                <div className="action-icon">➖</div>
                <RedeemPointsButton userId={userId} amount={50} onSuccess={handlePointsUpdate} />
              </div>
            </div>

            {/* Tour Info */}
            {user.current_tour && (
              <div className="tour-card">
                <div className="tour-icon">✈️</div>
                <div className="tour-info">
                  <div className="tour-label">{t('dashboard.currentTour')}</div>
                  <div className="tour-name">{user.current_tour}</div>
                </div>
                <div className="tour-arrow">→</div>
              </div>
            )}

            {/* Recent Transactions */}
            <div className="transactions-header">
              <h3 className="transactions-title">{t('dashboard.recentTransactions')}</h3>
              <button className="more-button">⋯</button>
            </div>
            <PointsHistory transactions={transactions.slice(0, 5)} />
          </>
        )}

        {activeTab === 'products' && (
          <Products userId={userId} onRedeemSuccess={handlePointsUpdate} />
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <h3 className="section-title">{t('dashboard.recentTransactions')}</h3>
            <PointsHistory transactions={transactions} />
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="nav-icon">🏠</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <span className="nav-icon">🎁</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <span className="nav-icon">📊</span>
        </button>
      </div>

      {/* Language Toggle - Floating */}
      <div className="language-toggle-float">
        <LanguageToggle onLanguageChange={handleLanguageChange} />
      </div>
    </div>
  );
};
