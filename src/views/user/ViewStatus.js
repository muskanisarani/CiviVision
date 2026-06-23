"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ViewStatus = () => {
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    // Fetch from localStorage, fallback to default static items if empty
    const saved = JSON.parse(localStorage.getItem('complaints') || '[]');
    if (saved.length === 0) {
      const defaults = [
        { id: '#001', category: 'Garbage Overflow', location: 'Market Area', status: 'Pending', date: '12 Jan 2026' },
        { id: '#002', category: 'Broken Streetlight', location: 'Sector 9', status: 'In Progress', date: '10 Jan 2026' },
        { id: '#003', category: 'Water Leakage', location: 'Main Road', status: 'Resolved', date: '08 Jan 2026' }
      ];
      localStorage.setItem('complaints', JSON.stringify(defaults));
      setComplaints(defaults);
    } else {
      setComplaints(saved);
    }
  }, []);

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
      maxWidth: '600px',
      margin: 'auto',
    },
    statusCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.55)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(15, 23, 42, 0.08)',
      borderRadius: '18px',
      padding: '18px 20px',
      marginBottom: '15px',
      boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
      transition: 'transform 0.2s',
    },
    cardTitle: {
      margin: 0,
      fontWeight: '700',
      fontSize: '16px',
      color: '#1e293b',
    },
    cardText: {
      margin: '6px 0',
      fontSize: '13px',
      color: '#64748b',
    },
    badge: {
      display: 'inline-block',
      padding: '5px 12px',
      borderRadius: '10px',
      fontSize: '12px',
      fontWeight: '700',
    },
    badgePending: { 
      backgroundColor: 'rgba(245, 158, 11, 0.08)', 
      color: '#d97706',
      border: '1px solid rgba(245, 158, 11, 0.15)',
    },
    badgeProgress: { 
      backgroundColor: 'rgba(59, 130, 246, 0.08)', 
      color: '#2563eb',
      border: '1px solid rgba(59, 130, 246, 0.15)',
    },
    badgeResolved: { 
      backgroundColor: 'rgba(16, 185, 129, 0.08)', 
      color: '#10b981',
      border: '1px solid rgba(16, 185, 129, 0.15)',
    }
  };

  const getBadgeStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved': return styles.badgeResolved;
      case 'in progress': return styles.badgeProgress;
      default: return styles.badgePending;
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.header}>
        <div style={styles.back} onClick={() => router.back()}>←</div>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', letterSpacing: '-0.25px' }}>Complaint Status</h3>
      </div>

      <div style={styles.container}>
        {complaints.map((c, index) => (
          <div key={index} style={styles.statusCard} className="status-card">
            <h4 style={styles.cardTitle}>{c.category} – {c.location}</h4>
            <p style={styles.cardText}>Reported: {c.date || 'Recent'}</p>
            <span style={{ ...styles.badge, ...getBadgeStyle(c.status) }}>
              {c.status}
            </span>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .status-card:hover {
          transform: translateY(-2px);
          border-color: rgba(99, 102, 241, 0.25) !important;
          background-color: rgba(255, 255, 255, 0.8) !important;
        }
      `}</style>
    </div>
  );
};

export default ViewStatus;
