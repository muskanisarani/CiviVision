"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AlertsPage = () => {
  const router = useRouter();

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await fetch('/api/alerts');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            const mapped = data.alerts.map(a => {
              let type = 'info';
              let icon = '📢';
              
              if (a.severity === 'danger') {
                type = 'critical';
                icon = '🚨';
              } else if (a.severity === 'warning') {
                type = 'warning';
                icon = '⚠️';
              } else if (a.severity === 'success') {
                type = 'success';
                icon = '✅';
              } else {
                if (a.category === 'Sanitation Drive') icon = '🧹';
                if (a.category === 'Health Camp') icon = '💉';
              }

              return {
                id: a.id,
                type,
                icon,
                title: a.title,
                body: a.details,
                time: a.date
              };
            });
            setAlerts(mapped);
          }
        }
      } catch (err) {
        console.error('Failed to fetch alerts:', err);
      }
    }
    loadAlerts();
  }, []);

  const styles = {
    body: {
      minHeight: 'calc(100vh - 150px)',
      fontFamily: '"Segoe UI", sans-serif',
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    container: {
      maxWidth: '1000px',
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.55)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(15, 23, 42, 0.08)',
      borderRadius: '24px',
      padding: '30px',
      boxShadow: '0 20px 45px rgba(15, 23, 42, 0.05)',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
      borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
      paddingBottom: '16px',
    },
    back: {
      cursor: 'pointer',
      fontSize: '22px',
      color: '#475569',
      transition: 'color 0.2s',
    },
    title: {
      margin: 0,
      fontSize: '20px',
      fontWeight: '800',
      color: '#0f172a',
      letterSpacing: '-0.25px',
    },
    card: {
      border: '1px solid rgba(15, 23, 42, 0.06)',
      borderRadius: '16px',
      padding: '16px 20px',
      marginBottom: '16px',
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start',
      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.01)',
      transition: 'transform 0.2s',
    },
    cardCritical: {
      backgroundColor: 'rgba(254, 226, 226, 0.4)',
      borderColor: 'rgba(239, 68, 68, 0.15)',
    },
    cardWarning: {
      backgroundColor: 'rgba(254, 243, 199, 0.4)',
      borderColor: 'rgba(245, 158, 11, 0.15)',
    },
    cardInfo: {
      backgroundColor: 'rgba(219, 234, 254, 0.4)',
      borderColor: 'rgba(59, 130, 246, 0.15)',
    },
    cardSuccess: {
      backgroundColor: 'rgba(209, 250, 229, 0.4)',
      borderColor: 'rgba(16, 185, 129, 0.15)',
    },
    iconCircle: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      boxShadow: '0 4px 8px rgba(15, 23, 42, 0.04)',
      flexShrink: 0,
    },
    cardTitle: {
      fontSize: '15px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 6px 0',
    },
    cardBody: {
      fontSize: '13px',
      color: '#475569',
      lineHeight: '1.55',
      margin: '0 0 10px 0',
    },
    cardTime: {
      fontSize: '11px',
      color: '#94a3b8',
      fontWeight: '600',
      margin: 0,
      textTransform: 'uppercase',
      letterSpacing: '0.25px',
    }
  };

  const getCardStyle = (type) => {
    switch (type) {
      case 'critical': return styles.cardCritical;
      case 'warning': return styles.cardWarning;
      case 'success': return styles.cardSuccess;
      default: return styles.cardInfo;
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title}>Municipal Alerts & Announcements</h3>
        </div>

        <div>
          {alerts.map((a) => (
            <div key={a.id} style={{ ...styles.card, ...getCardStyle(a.type) }} className="alert-card-hover">
              <div style={styles.iconCircle}>{a.icon}</div>
              <div>
                <h4 style={styles.cardTitle}>{a.title}</h4>
                <p style={styles.cardBody}>{a.body}</p>
                <p style={styles.cardTime}>{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .alert-card-hover:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04) !important;
        }
      `}</style>
    </div>
  );
};

export default AlertsPage;
