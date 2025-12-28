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
      <div className="dashboard-controls">
        <div className="control-tabs">
          <button className="tab active">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Table View
          </button>
        </div>
        <div className="control-actions">
          <button className="action-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M6 12h12m-9 6h6"/></svg> Filter</button>
          <button className="action-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 10l5-5 5 5M7 14l5 5 5-5"/></svg> Sort</button>
          <div className="stat-toggle">
            <span>Show Statistics</span>
            <div className="toggle-switch active"></div>
          </div>
          <button className="customize-action"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg> Customize</button>
          <button className="export-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 10l-4 4m0 0l-4-4m4 4V4"/></svg> Export</button>
          <button className="add-btn">+ Add New Product</button>
        </div>
      </div>

      <div className="stats-grid-modern">
        <div className="stat-card-modern">
          <div className="stat-header">
            <span>Total Product</span>
            <svg className="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          </div>
          <div className="stat-body">
            <span className="stat-value-large">{stats.totalMembers.toLocaleString()}</span>
            <div className="stat-change positive">vs last month <span>+ 3 product</span></div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-header">
            <span>Total Points</span>
            <svg className="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          </div>
          <div className="stat-body">
            <span className="stat-value-large">{stats.totalPoints.toLocaleString()}</span>
            <div className="stat-change positive">vs last month <span>↑ 9%</span></div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-header">
            <span>Product Sold</span>
            <svg className="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          </div>
          <div className="stat-body">
            <span className="stat-value-large">{stats.totalTransactions.toLocaleString()}</span>
            <div className="stat-change positive">vs last month <span>↑ 7%</span></div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-header">
            <span>Avg. Monthly Sales</span>
            <svg className="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          </div>
          <div className="stat-body">
            <span className="stat-value-large">890</span>
            <div className="stat-change positive">vs last month <span>↑ 5%</span></div>
          </div>
        </div>
      </div>

      <div className="table-section-modern">
        <div className="table-header-modern">
          <div className="col-checkbox"><input type="checkbox" /></div>
          <div className="col-product">Product</div>
          <div className="col-price">Price</div>
          <div className="col-sales">Sales</div>
          <div className="col-revenue">Revenue</div>
          <div className="col-stock">Stock</div>
          <div className="col-status">Status</div>
          <div className="col-rating">Rating</div>
          <div className="col-more">+</div>
        </div>
        <div className="table-body-modern">
          {stats.recentTransactions.map((tx, index) => (
            <div key={tx.id} className="table-row-modern">
              <div className="col-checkbox"><input type="checkbox" /></div>
              <div className="col-product">
                <div className="product-cell">
                  <div className="product-image-small"></div>
                  <span>{tx.description || 'Transaction Item'}</span>
                </div>
              </div>
              <div className="col-price">$1.35</div>
              <div className="col-sales">471 pcs</div>
              <div className="col-revenue">${tx.amount.toLocaleString()}</div>
              <div className="col-stock">100</div>
              <div className="col-status">
                <span className={`status-badge ${index % 2 === 0 ? 'in-stock' : 'out-stock'}`}>
                  {index % 2 === 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <div className="col-rating">⭐ 5.0</div>
              <div className="col-more">⋮</div>
            </div>
          ))}
        </div>
        
        <div className="table-footer-modern">
          <div className="footer-left">
            Showing per page 
            <select className="page-select">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>
          <div className="footer-pagination">
            <button className="page-btn">‹</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <span className="page-dots">...</span>
            <button className="page-btn">25</button>
            <button className="page-btn">›</button>
          </div>
          <div className="footer-jump">
            Go to page <input type="text" className="jump-input" placeholder="1" /> <button className="jump-btn">Go ›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
