"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Notifications = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('userNotifications') || '[]');
    if (saved.length === 0) {
      const defaults = [
        {
          id: 'notif-1',
          title: '🔧 Issue Scheduled for Repair',
          body: 'GMC Ward 2 Electrical Crew has checked your report #002 (Broken Streetlight) and scheduled the bulb replacement.',
          date: '2 hours ago',
          unread: true
        },
        {
          id: 'notif-2',
          title: '✅ Complaint Resolved Successfully',
          body: 'GMC Water Engineers have repaired the pipeline leak reported in #003. Thank you for reporting!',
          date: 'Yesterday',
          unread: false
        },
        {
          id: 'notif-3',
          title: '🚨 Emergency Dispatch Confirmation',
          body: 'Immediate drainage crew dispatched to report #009 (Flooded Roadway). Resolving target within 2 hours.',
          date: '3 days ago',
          unread: false
        }
      ];
      localStorage.setItem('userNotifications', JSON.stringify(defaults));
      setNotifications(defaults);
    } else {
      setNotifications(saved);
    }
  }, []);

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, unread: false }));
    localStorage.setItem('userNotifications', JSON.stringify(updated));
    setNotifications(updated);
  };

  const clearNotifications = () => {
    localStorage.setItem('userNotifications', JSON.stringify([]));
    setNotifications([]);
  };

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
      position: 'relative',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
      paddingBottom: '16px',
    },
    titleSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    back: {
      cursor: 'pointer',
      fontSize: '22px',
      color: '#475569',
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
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <h3 style={styles.title}>Notifications Inbox</h3>
          </div>
          {notifications.length > 0 && (
            <div style={styles.controls}>
              <button style={styles.controlBtn} onClick={markAllAsRead}>Mark read</button>
              <span style={{ color: '#cbd5e1', fontSize: '12px' }}>|</span>
              <button style={styles.controlBtn} onClick={clearNotifications} style={{ ...styles.controlBtn, color: '#dc2626' }}>Clear</button>
            </div>
          )}
        </div>

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

      <style jsx global>{`
        .notif-card-hover:hover {
          border-color: rgba(99, 102, 241, 0.25) !important;
          background-color: rgba(255, 255, 255, 0.75) !important;
        }
      `}</style>
    </div>
  );
};

export default Notifications;
