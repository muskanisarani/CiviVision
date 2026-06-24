"use client";
import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
import UserBottomNav from '../../components/UserBottomNav';

const Profile = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/select-role');
  };

  const styles = {
    body: {
      minHeight: '100vh',
      paddingBottom: '90px', // space for navbar
      fontFamily: 'Segoe UI, sans-serif',
    },
    header: {
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
      color: '#0f172a',
      padding: '35px 20px',
      textAlign: 'center',
      borderBottomLeftRadius: '24px',
      borderBottomRightRadius: '24px',
    },
    avatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: 'rgba(15, 23, 42, 0.04)',
      border: '2px solid rgba(15, 23, 42, 0.1)',
      margin: 'auto',
      fontSize: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
    },
    title: {
      margin: '16px 0 4px',
      fontWeight: '800',
      fontSize: '20px',
      letterSpacing: '-0.25px',
      background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      margin: 0,
      fontSize: '13px',
      color: '#475569',
    },
    container: {
      padding: '24px 20px',
      maxWidth: '1000px',
      margin: 'auto',
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.55)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(15, 23, 42, 0.08)',
      borderRadius: '18px',
      padding: '16px 20px',
      marginBottom: '15px',
      boxShadow: '0 4px 10px rgba(15, 23, 42, 0.03)',
      fontWeight: '500',
      color: '#1e293b',
      fontSize: '14px',
    },
    logoutBtn: {
      width: '100%',
      padding: '14px',
      borderRadius: '14px',
      border: 'none',
      backgroundColor: 'rgba(239, 68, 68, 0.08)',
      color: '#ef4444',
      border: '1px solid rgba(239, 68, 68, 0.15)',
      fontWeight: '700',
      fontSize: '15px',
      cursor: 'pointer',
      marginTop: '15px',
      transition: 'all 0.2s',
    }
  };

  return (
    <div style={styles.body}>
      <div style={{ ...styles.header, position: 'relative' }}>
        <div style={styles.avatar}>👤</div>
        <h3 style={styles.title}>{currentUser ? currentUser.name : 'Citizen'}</h3>
        <p style={styles.subtitle}>{currentUser ? currentUser.email : 'user@gmail.com'}</p>
      </div>

      {/* CONTENT */}
      <div style={styles.container}>
        <div style={styles.card}>📍 Location: Gandhinagar, Gujarat</div>
        <div style={styles.card}>📝 Complaints Filed: 3</div>
        <div style={styles.card}>⚙ Settings</div>
        
        <button style={styles.logoutBtn} onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>

      <UserBottomNav />

      <style jsx global>{`
        .btn-logout:hover {
          background-color: rgba(239, 68, 68, 0.25) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default Profile;
