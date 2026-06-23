"use client";
import React, { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';

const GlobalHeader = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const router = useRouter();

  const handleLogoutClick = () => {
    logout();
    router.push('/select-role');
  };

  return (
    <header className="global-header">
      <div className="header-container">
        <div className="d-flex align-items-center gap-3">
          <Link href="/" className="global-logo">CiviVision</Link>
          <span className="header-badge d-none d-sm-inline-block">Official GMC Portal</span>
        </div>

        <nav className="header-nav">
          {currentUser ? (
            <div className="header-user-info">
              {currentUser.role === 'admin' ? (
                <>
                  <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1" style={{ fontSize: '11px', fontWeight: '700' }}>ADMIN</span>
                  <Link href="/admin/dashboard" className="header-link">Control Board</Link>
                </>
              ) : (
                <>
                  <Link href="/user/dashboard" className="header-link">Dashboard</Link>
                  <Link href="/user/profile" className="header-link">Profile</Link>
                </>
              )}
              <button onClick={handleLogoutClick} className="header-btn-outline" style={{ border: '1px solid rgba(239, 68, 68, 0.2)', color: '#dc2626', background: 'rgba(239, 68, 68, 0.05)' }}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/user/login" className="header-link">Login</Link>
              <Link href="/user/register" className="header-btn">Register</Link>
              <Link href="/admin/login" className="header-link d-none d-md-inline-block" style={{ fontSize: '12px', opacity: 0.8 }}>Admin Portal</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default GlobalHeader;
