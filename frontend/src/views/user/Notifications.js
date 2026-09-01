import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserBottomNav from '../../components/UserBottomNav';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const mapped = data.notifications.map(n => ({
            id: n.id,
            title: n.title,
            body: n.message,
            unread: !n.read,
            date: new Date(n.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          }));
          setNotifications(mapped);
        }
      }
    } catch (error) {
      console.error('Fetch notifications error:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
        credentials: 'include'
      });
      if (response.ok) {
        await fetchNotifications();
      }
    } catch (error) {
      console.error('Mark all as read error:', error);
    }
  };

  const clearNotifications = () => {
    markAllAsRead();
  };

  const styles = {
    body: {
      minHeight: '100vh',
      fontFamily: '"Segoe UI", sans-serif',
      paddingBottom: '90px',
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
      justifyContent: 'space-between',
      gap: '12px',
    },
    container: {
      padding: '24px 20px',
      maxWidth: '100%',
      margin: 'auto',
      width: '100%',
    },
    titleSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    title: {
      margin: 0,
      fontSize: '20px',
      fontWeight: '800',
      color: '#0f172a',
      letterSpacing: '-0.25px',
    },
    controls: {
      display: 'flex',
      gap: '10px',
    },
    controlBtn: {
      background: 'none',
      border: 'none',
      color: '#6366f1',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.45)',
      border: '1px solid rgba(15, 23, 42, 0.06)',
      borderRadius: '16px',
      padding: '16px 20px',
      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.01)',
      transition: 'all 0.2s',
      position: 'relative',
    },
    cardUnread: {
      backgroundColor: 'rgba(99, 102, 241, 0.03)',
      borderColor: 'rgba(99, 102, 241, 0.15)',
    },
    dot: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#6366f1',
    },
    cardTitle: {
      fontSize: '14px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 6px 0',
      paddingRight: '12px',
    },
    cardBody: {
      fontSize: '13px',
      color: '#475569',
      lineHeight: '1.5',
      margin: '0 0 8px 0',
    },
    cardDate: {
      fontSize: '11px',
      color: '#94a3b8',
      fontWeight: '600',
      margin: 0,
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#64748b',
    }
  };

  return (
    <div style={styles.body} className="user-notifications-body">
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <button 
            onClick={() => navigate(-1)} 
            style={{ background: 'none', border: 'none', color: '#475569', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', letterSpacing: '-0.25px' }}>Notifications Inbox</h3>
        </div>
        {notifications.length > 0 && (
          <div style={styles.controls}>
            <button style={styles.controlBtn} onClick={markAllAsRead}>Mark read</button>
            <span style={{ color: '#cbd5e1', fontSize: '12px' }}>|</span>
            <button style={{ ...styles.controlBtn, color: '#dc2626' }} onClick={clearNotifications}>Clear</button>
          </div>
        )}
      </div>

      <div style={styles.container}>

        {notifications.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📭</div>
            <p style={{ margin: 0, fontSize: '14px' }}>Your notification inbox is clean and empty.</p>
          </div>
        ) : (
          <div style={styles.list}>
            {notifications.map((n) => (
              <div 
                key={n.id} 
                style={{ ...styles.card, ...(n.unread ? styles.cardUnread : {}) }} 
                className="notif-card-hover"
              >
                {n.unread && <div style={styles.dot}></div>}
                <h4 style={styles.cardTitle}>{n.title}</h4>
                <p style={styles.cardBody}>{n.body}</p>
                <p style={styles.cardDate}>{n.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx="true" global="true">{`
        .notif-card-hover:hover {
          border-color: rgba(99, 102, 241, 0.25) !important;
          background-color: rgba(255, 255, 255, 0.75) !important;
        }
      `}</style>
      <UserBottomNav />
    </div>
  );
};

export default Notifications;
