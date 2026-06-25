"use client";
import React, { useContext } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';

const GlobalHeader = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogoutClick = () => {
    logout();
    router.push('/select-role');
  };

  const showBackBtn = pathname !== '/';

  return (
    <header className="global-header">
      <div className="header-container">
        <div className="d-flex align-items-center gap-2">
          {showBackBtn && (
            <button 
              onClick={() => router.back()} 
              style={{
                background: 'none',
                border: 'none',
                color: '#475569',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="header-back-arrow"
            >
              <i className="bi bi-arrow-left"></i>
            </button>
          )}
          <Link href="/" className="global-logo">CiviVision</Link>
          <span className="header-badge d-none d-sm-inline-block">Official GMC Portal</span>
        </div>

        <nav className="header-nav">
          {currentUser ? (
            <div className="header-user-info">
              {currentUser.role === 'admin' ? (
                <>
                  <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1" style={{ fontSize: '11px', fontWeight: '700' }}>ADMIN</span>
                  {pathname !== '/admin/dashboard' && (
                    <Link href="/admin/dashboard" className="header-link">Control Board</Link>
                  )}
                  {pathname !== '/admin/settings' && (
                    <Link href="/admin/settings" className="header-link d-none d-sm-inline-block">System Settings</Link>
                  )}
                </>
              ) : (
                <>
                  {pathname !== '/user/dashboard' && (
                    <Link href="/user/dashboard" className="header-link">Dashboard</Link>
                  )}
                  {pathname !== '/user/alerts' && (
                    <Link href="/user/alerts" className="header-link">Alerts</Link>
                  )}
                  {pathname !== '/user/profile' && (
                    <Link href="/user/profile" className="header-link">Profile</Link>
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
                <Link href="/" className="header-link">Home</Link>
              )}
              {pathname !== '/how-to-use' && (
                <Link href="/how-to-use" className="header-link d-none d-sm-inline-block">How to Use</Link>
              )}
              {pathname !== '/faqs' && (
                <Link href="/faqs" className="header-link d-none d-md-inline-block">FAQs</Link>
              )}
              {pathname !== '/contact' && (
                <Link href="/contact" className="header-link d-none d-md-inline-block">Contact</Link>
              )}
              {pathname !== '/user/login' && (
                <Link href="/user/login" className="header-link">Login</Link>
              )}
              {pathname !== '/user/register' && (
                <Link href="/user/register" className="header-btn">Register</Link>
              )}
              {pathname !== '/admin/login' && (
                <Link href="/admin/login" className="header-link d-none d-lg-inline-block" style={{ fontSize: '12px', opacity: 0.8 }}>Admin Portal</Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default GlobalHeader;
