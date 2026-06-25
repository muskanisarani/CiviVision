"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const ToiletTracker = () => {
  const router = useRouter();

  const styles = {
    body: {
      minHeight: '100vh',
      fontFamily: '"Segoe UI", sans-serif',
      paddingBottom: '40px',
    },
    header: {
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
      color: '#0f172a',
      padding: '18px 25px',
      borderBottomLeftRadius: '24px',
      borderBottomRightRadius: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    back: {
      cursor: 'pointer',
      fontSize: '22px',
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
      padding: '18px 20px',
      marginBottom: '15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
      transition: 'transform 0.2s',
    },
    cardTitle: {
      margin: 0,
      fontWeight: '700',
      fontSize: '16px',
      color: '#1e293b',
    },
    cardSubtitle: {
      margin: '6px 0 0',
      fontSize: '13px',
      color: '#64748b',
    },
    statusBadge: {
      padding: '6px 14px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '700',
    },
    badgeClean: {
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      color: '#10b981',
      border: '1px solid rgba(16, 185, 129, 0.15)',
    },
    badgeModerate: {
      backgroundColor: 'rgba(245, 158, 11, 0.08)',
      color: '#d97706',
      border: '1px solid rgba(245, 158, 11, 0.15)',
    },
    badgeNeedsCleaning: {
      backgroundColor: 'rgba(239, 68, 68, 0.08)',
      color: '#ef4444',
      border: '1px solid rgba(239, 68, 68, 0.15)',
    }
  };

  const toilets = [
    { id: 1, name: 'Public Toilet – Sector 5', details: '500m away • Open', status: 'Clean' },
    { id: 2, name: 'Community Toilet – Market Road', details: '1.2km away • Open', status: 'Moderate' },
    { id: 3, name: 'SBM Toilet – Bus Stand', details: '2km away • 24x7', status: 'Needs Cleaning' }
  ];

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'clean': return styles.badgeClean;
      case 'moderate': return styles.badgeModerate;
      default: return styles.badgeNeedsCleaning;
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.header}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', letterSpacing: '-0.25px' }}>Public Toilet Tracker</h3>
      </div>

      <div style={styles.container}>
        {toilets.map(t => (
          <div key={t.id} style={styles.card} className="toilet-card">
            <div>
              <h4 style={styles.cardTitle}>{t.name}</h4>
              <p style={styles.cardSubtitle}>{t.details}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              <div style={{ ...styles.statusBadge, ...getStatusStyle(t.status) }}>{t.status}</div>
              <button 
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.06)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                  borderRadius: '10px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                className="report-btn-hover"
                onClick={() => router.push(`/user/complaint?category=Public Toilet Issue&location=${encodeURIComponent(t.name)}`)}
              >
                ⚠️ Report Issue
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .toilet-card:hover {
          transform: translateY(-2px);
          border-color: rgba(99, 102, 241, 0.25) !important;
          background-color: rgba(255, 255, 255, 0.8) !important;
        }
        .report-btn-hover:hover {
          background-color: #ef4444 !important;
          color: #ffffff !important;
          box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2) !important;
        }
      `}</style>
    </div>
  );
};

export default ToiletTracker;
