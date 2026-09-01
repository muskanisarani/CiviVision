import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const GlobalHeader = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogoutClick = () => {
    logout();
    navigate('/select-role');
  };

  return (
    <header className="global-header">
      <div className="header-container">
        <div className="d-flex align-items-center gap-2">
          <Link to="/" className="global-logo">CiviVision</Link>
          <span className="header-badge d-none d-sm-inline-block">Official GMC Portal</span>
        </div>

        <nav className="header-nav">
          {/* THEME TOGGLE BUTTON */}
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            style={{
              background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.05)',
              border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(15, 23, 42, 0.1)',
              borderRadius: '10px',
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: '700',
              color: theme === 'dark' ? '#fbbf24' : '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              marginRight: '8px'
            }}
          >
            {theme === 'dark' ? (
              <>
                <i className="bi bi-sun-fill" style={{ color: '#fbbf24', fontSize: '14px' }}></i>
                <span className="d-none d-sm-inline" style={{ color: '#f8fafc' }}>Light Mode</span>
              </>
            ) : (
              <>
                <i className="bi bi-moon-stars-fill" style={{ color: '#6366f1', fontSize: '14px' }}></i>
                <span className="d-none d-sm-inline" style={{ color: '#334155' }}>Dark Mode</span>
              </>
            )}
          </button>

          {currentUser ? (
            <div className="header-user-info">
              {currentUser.role === 'admin' ? (
                <>
                  <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1" style={{ fontSize: '11px', fontWeight: '700' }}>ADMIN</span>
                  {pathname !== '/admin/dashboard' && (
                    <Link to="/admin/dashboard" className="header-link">Control Board</Link>
                  )}
                  {pathname !== '/admin/analytics' && (
                    <Link to="/admin/analytics" className="header-link">Analytics & Reports</Link>
                  )}
                  {pathname !== '/admin/settings' && (
                    <Link to="/admin/settings" className="header-link d-none d-sm-inline-block">System Settings</Link>
                  )}
                </>
              ) : (
                <>
                  {pathname !== '/user/dashboard' && (
                    <Link to="/user/dashboard" className="header-link">Dashboard</Link>
                  )}
                  {pathname !== '/user/view-status' && (
                    <Link to="/user/view-status" className="header-link">Tickets</Link>
                  )}
                  {pathname !== '/user/leaderboard' && (
                    <Link to="/user/leaderboard" className="header-link">Leaderboard</Link>
                  )}
                  {pathname !== '/user/alerts' && (
                    <Link to="/user/alerts" className="header-link">Alerts</Link>
                  )}
                  {pathname !== '/user/profile' && (
                    <Link to="/user/profile" className="header-link">Profile</Link>
                  )}
                </>
              )}
              <button onClick={handleLogoutClick} className="header-btn-outline" style={{ border: '1px solid rgba(239, 68, 68, 0.2)', color: '#dc2626', background: 'rgba(239, 68, 68, 0.05)' }}>
                Logout
              </button>
            </div>
          ) : (
            <>
              {pathname !== '/' && (
                <Link to="/" className="header-link">Home</Link>
              )}
              {pathname !== '/how-to-use' && (
                <Link to="/how-to-use" className="header-link d-none d-sm-inline-block">How to Use</Link>
              )}
              {pathname !== '/faqs' && (
                <Link to="/faqs" className="header-link d-none d-md-inline-block">FAQs</Link>
              )}
              {pathname !== '/contact' && (
                <Link to="/contact" className="header-link d-none d-md-inline-block">Contact</Link>
              )}
              {pathname !== '/user/login' && (
                <Link to="/user/login" className="header-link">Login</Link>
              )}
              {pathname !== '/user/register' && (
                <Link to="/user/register" className="header-btn">Register</Link>
              )}
              {pathname !== '/admin/login' && (
                <Link to="/admin/login" className="header-link d-none d-lg-inline-block" style={{ fontSize: '12px', opacity: 0.8 }}>Admin Portal</Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default GlobalHeader;
