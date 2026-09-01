import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const UserBottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const styles = {
    bottomNav: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '70px',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px 0',
      alignItems: 'center',
      borderTop: '1px solid rgba(15, 23, 42, 0.08)',
      borderTopLeftRadius: '25px',
      borderTopRightRadius: '25px',
      boxShadow: '0 -4px 20px rgba(15, 23, 42, 0.05)',
      zIndex: 1000,
    },
    navItem: {
      textAlign: 'center',
      fontSize: '11px',
      color: '#64748b',
      cursor: 'pointer',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    },
    icon: {
      fontSize: '18px',
      marginBottom: '2px',
    },
    active: {
      color: '#6366f1',
      fontWeight: '700',
    }
  };

  const isHome = pathname === '/user/dashboard';
  const isSearch = pathname === '/user/search';
  const isNotifications = pathname === '/user/notifications';
  const isProfile = pathname === '/user/profile';

  return (
    <div style={styles.bottomNav} className="user-bottom-nav">
      <div 
        style={{ ...styles.navItem, ...(isHome ? styles.active : {}) }}
        onClick={() => navigate('/user/dashboard')}
      >
        <i className="bi bi-house" style={styles.icon}></i>
        Home
      </div>
      <div 
        style={{ ...styles.navItem, ...(isSearch ? styles.active : {}) }}
        onClick={() => navigate('/user/search')}
      >
        <i className="bi bi-search" style={styles.icon}></i>
        Search
      </div>
      <div 
        style={{ ...styles.navItem, ...(isNotifications ? styles.active : {}) }}
        onClick={() => navigate('/user/notifications')}
      >
        <i className="bi bi-bell" style={styles.icon}></i>
        Inbox
      </div>
      <div 
        style={{ ...styles.navItem, ...(isProfile ? styles.active : {}) }}
        onClick={() => navigate('/user/profile')}
      >
        <i className="bi bi-person" style={styles.icon}></i>
        Profile
      </div>
    </div>
  );
};

export default UserBottomNav;
