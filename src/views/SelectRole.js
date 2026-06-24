"use client";
import React from 'react';
import Link from 'next/link';

const SelectRole = () => {
  const styles = {
    wrapper: {
      minHeight: 'calc(100vh - 150px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.05) 0%, transparent 50%), linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
    },
    card: {
      width: '100%',
      maxWidth: '400px',
      backgroundColor: 'rgba(255, 255, 255, 0.55)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(15, 23, 42, 0.08)',
      borderRadius: '24px',
      padding: '45px 35px',
      textAlign: 'center',
      boxShadow: '0 20px 45px rgba(15, 23, 42, 0.06)',
    },
    logo: {
      fontSize: '32px',
      fontWeight: '800',
      letterSpacing: '-1px',
      background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '6px',
    },
    subtitle: {
      fontSize: '14px',
      color: '#475569',
      marginBottom: '32px',
    },
    btnUser: {
      display: 'block',
      width: '100%',
      padding: '14px',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      textDecoration: 'none',
      transition: 'all 0.25s ease',
      backgroundColor: '#6366f1',
      color: '#fff',
      marginBottom: '16px',
      border: 'none',
      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
    },
    btnAdmin: {
      display: 'block',
      width: '100%',
      padding: '14px',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      textDecoration: 'none',
      transition: 'all 0.25s ease',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      color: '#0f172a',
      border: '1px solid rgba(15, 23, 42, 0.12)',
    },
    footer: {
      marginTop: '32px',
      fontSize: '11px',
      opacity: '0.8',
      color: '#64748b',
      textAlign: 'center',
      letterSpacing: '0.25px',
    }
  };

  return (
    <div style={{ ...styles.wrapper, position: 'relative' }}>

      <div style={styles.card}>
        <h2 style={styles.logo}>CiviVision</h2>
        <p style={styles.subtitle}>Select your role to continue</p>
 
        <Link href="/user/login" style={styles.btnUser} className="btn-hover-effect">
          Login as User
        </Link>
 
        <Link href="/admin/login" style={styles.btnAdmin} className="btn-hover-effect">
          Login as Admin
        </Link>
      </div>


      <style jsx global>{`
        .btn-hover-effect:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default SelectRole;
