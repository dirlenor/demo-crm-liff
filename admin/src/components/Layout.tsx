import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/products', label: 'Product', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { path: '/members', label: 'Customer', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { path: '/transactions', label: 'Order', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  ];

  const toolItems = [
    { path: '/qr-codes', label: 'QR Generator', icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z' },
  ];

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">w.</div>
          <div className="brand-info">
            <span className="brand-name">Uxerflow Inc.</span>
            <span className="brand-plan">Free Plan</span>
          </div>
        </div>

        <div className="sidebar-search">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="9" r="6"/>
              <path d="m15 15-3-3"/>
            </svg>
            <input type="text" placeholder="Search" />
            <span className="search-shortcut">⌘ K</span>
          </div>
        </div>

        <nav className="sidebar-sections">
          <div className="nav-section">
            <h3 className="section-label">MAIN MENU</h3>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="nav-section">
            <h3 className="section-label">TOOLS</h3>
            {toolItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="footer-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>
            </svg>
            <span>Help center</span>
          </div>
          <div className="footer-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <span>Feedback</span>
          </div>
          <div className="footer-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>Settings</span>
          </div>
          
          <div className="upgrade-card">
            <div className="upgrade-icon">🚀</div>
            <div className="upgrade-text">
              <strong>Upgrade & unlock</strong>
              <span>all features</span>
            </div>
            <div className="upgrade-arrow">›</div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="top-bar-left">
            <div className="breadcrumb">
              <span className="breadcrumb-current">{location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.slice(2)}</span>
            </div>
          </div>
          <div className="top-bar-right">
            <button className="top-action-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8.684 4.082A2.25 2.25 0 0110.728 2.25h2.544a2.25 2.25 0 012.044 1.832l.332 1.661c.018.09.039.179.062.267a12.13 12.13 0 001.322-.65 1.875 1.875 0 012.14.23l1.44 1.439a1.875 1.875 0 01.23 2.14 12.13 12.13 0 00-.65 1.322c.088.023.177.044.267.062l1.661.332a2.25 2.25 0 011.832 2.044v2.544a2.25 2.25 0 01-1.832 2.044l-1.661.332c-.09.018-.179.039-.267.062a12.13 12.13 0 00.65 1.322 1.875 1.875 0 01-.23 2.14l-1.439 1.44a1.875 1.875 0 01-2.14.23 12.13 12.13 0 00-1.322-.65c-.023.088-.044.177-.062.267l-.332 1.661a2.25 2.25 0 01-2.044 1.832h-2.544a2.25 2.25 0 01-2.044-1.832l-.332-1.661a12.13 12.13 0 00-1.322.65 1.875 1.875 0 01-2.14-.23l-1.44-1.439a1.875 1.875 0 01-.23-2.14 12.13 12.13 0 00.65-1.322 2.25 2.25 0 01-.267-.062l-1.661-.332a2.25 2.25 0 01-1.832-2.044v-2.544a2.25 2.25 0 011.832-2.044l1.661-.332c.09-.018.179-.039.267-.062a12.13 12.13 0 00-.65-1.322 1.875 1.875 0 01.23-2.14l1.439-1.44a1.875 1.875 0 012.14-.23 12.13 12.13 0 001.322.65c.023-.088.044-.177.062-.267l.332-1.661z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button className="top-action-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="user-profile-nav">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
              <div className="user-badges">+3</div>
            </div>
            <button className="customize-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 5a1 1 0 01.8-1H19a1 1 0 011 1v2a1 1 0 01-1 1H4.8a1 1 0 01-1-1V5zM4 13a1 1 0 01.8-1H19a1 1 0 011 1v2a1 1 0 01-1 1H4.8a1 1 0 01-1-1v-2zM4 21a1 1 0 01.8-1H19a1 1 0 011 1v2a1 1 0 01-1 1H4.8a1 1 0 01-1-1v-2z" />
              </svg>
              Customize Widget
            </button>
          </div>
        </header>
        <div className="content-container">
          {children}
        </div>
      </main>
    </div>
  );
}
