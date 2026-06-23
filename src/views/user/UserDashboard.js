"use client";
import React, { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
import UserBottomNav from '../../components/UserBottomNav';

const UserDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState(null);

  const styles = {
    body: {
      minHeight: '100vh',
      paddingBottom: '90px', // space for navbar
    },
    header: {
      background: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
      color: '#0f172a',
      padding: '24px 22px',
      borderBottomLeftRadius: '24px',
      borderBottomRightRadius: '24px',
    },
    headerTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
    iconCircle: {
      width: '38px',
      height: '38px',
      backgroundColor: 'rgba(15, 23, 42, 0.04)',
      border: '1px solid rgba(15, 23, 42, 0.08)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      color: '#475569',
    },
    title: {
      margin: '0 0 4px',
      fontSize: '22px',
      fontWeight: '800',
      letterSpacing: '-0.5px',
      background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      margin: 0,
      fontSize: '14px',
      color: '#475569',
    },
    container: {
      padding: '20px',
    },
    statusCard: {
      background: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(15, 23, 42, 0.08)',
      borderRadius: '18px',
      padding: '18px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
    },
    count: {
      fontSize: '28px',
      color: '#dc2626',
      fontWeight: '800',
      margin: '4px 0',
      letterSpacing: '-1px',
    },
    statusBtn: {
      backgroundColor: '#6366f1',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      padding: '8px 16px',
      fontSize: '13px',
      cursor: 'pointer',
      fontWeight: '600',
      boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '16px',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.55)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(15, 23, 42, 0.08)',
      borderRadius: '18px',
      padding: '18px',
      cursor: 'pointer',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
    },
    cardIcon: {
      width: '40px',
      height: '40px',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      border: '1px solid rgba(99, 102, 241, 0.15)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      marginBottom: '12px',
    }
  };

  return (
    <div style={styles.body}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.iconCircle} onClick={() => router.push('/user/profile')} className="icon-hover">
            <i className="bi bi-person"></i>
          </div>
          <div style={styles.iconCircle} className="icon-hover">
            <i className="bi bi-bell"></i>
          </div>
        </div>
        <h2 style={styles.title}>Good Morning, Welcome !</h2>
        <p style={styles.subtitle}>Hi dear {currentUser ? currentUser.name : 'Citizen'}</p>
      </div>

      {/* CONTENT */}
      <div style={styles.container}>
        <div style={styles.statusCard}>
          <div>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#475569' }}>Dustbins reported uncleaned</h4>
            <div style={styles.count}>0</div>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>in your reported locations</p>
          </div>
          <button style={styles.statusBtn} onClick={() => router.push('/user/view-status')} className="btn-hover">
            View Status
          </button>
        </div>

        <div style={styles.grid}>
          <div style={styles.card} onClick={() => router.push('/user/complaint')} className="dashboard-card">
            <div style={styles.cardIcon}>
              <i className="bi bi-file-earmark-text" style={{ color: '#6366f1' }}></i>
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 6px', color: '#1e293b' }}>Post AI Complaint</h4>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineStyle: '1.4' }}>AI auto-verifies Suroundings</p>
          </div>

          <div style={styles.card} onClick={() => router.push('/user/complaint')} className="dashboard-card">
            <div style={styles.cardIcon}>
              <i className="bi bi-geo-alt" style={{ color: '#6366f1' }}></i>
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 6px', color: '#1e293b' }}>New Public Issue</h4>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineStyle: '1.4' }}>Pin details on maps</p>
          </div>

          <div style={styles.card} onClick={() => router.push('/user/toilet-tracker')} className="dashboard-card">
            <div style={styles.cardIcon}>
              <i className="bi bi-person-standing" style={{ color: '#6366f1' }}></i>
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 6px', color: '#1e293b' }}>Toilet Tracker</h4>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineStyle: '1.4' }}>Find nearest Swachh Toilet</p>
          </div>

          <div style={styles.card} onClick={() => router.push('/user/feedback')} className="dashboard-card">
            <div style={styles.cardIcon}>
              <i className="bi bi-chat-dots" style={{ color: '#6366f1' }}></i>
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 6px', color: '#1e293b' }}>Give Feedback</h4>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineStyle: '1.4' }}>Share ideas for betterment</p>
          </div>
        </div>

        {/* EMERGENCY SOS SECTION */}
        <div style={{ marginTop: '28px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#b91c1c', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="bi bi-exclamation-triangle-fill"></i> SOS Emergency Civic Dispatch
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
            <div 
              style={{ padding: '14px', background: 'rgba(254, 226, 226, 0.55)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}
              onClick={() => setAlertMessage('🚨 Open Manhole SOS reported! GMC Sanitation Rescue Unit has been dispatched to your current location.')}
              className="sos-card"
            >
              <i className="bi bi-circle-square" style={{ fontSize: '20px', color: '#dc2626' }}></i>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#991b1b', marginTop: '6px' }}>Open Manhole</div>
            </div>
            <div 
              style={{ padding: '14px', background: 'rgba(254, 226, 226, 0.55)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}
              onClick={() => setAlertMessage('⚡ Live Electrical Wire SOS reported! PGVCL Power Squad has been alerted for immediate cutoff.')}
              className="sos-card"
            >
              <i className="bi bi-lightning-charge" style={{ fontSize: '20px', color: '#dc2626' }}></i>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#991b1b', marginTop: '6px' }}>Live Power Wire</div>
            </div>
            <div 
              style={{ padding: '14px', background: 'rgba(254, 226, 226, 0.55)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}
              onClick={() => setAlertMessage('💧 Severe Flooding SOS reported! GMC Drainage Pumping Crew has been dispatched.')}
              className="sos-card"
            >
              <i className="bi bi-water" style={{ fontSize: '20px', color: '#dc2626' }}></i>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#991b1b', marginTop: '6px' }}>Severe Flooding</div>
            </div>
          </div>
        </div>

        {/* SLA & OFFICIAL DIRECTORY */}
        <div style={{ marginTop: '28px', padding: '18px', background: 'rgba(255, 255, 255, 0.55)', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '18px', boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="bi bi-clock-history" style={{ color: '#4f46e5' }}></i> Citizen Charter (SLA Timescales)
          </h4>
          <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
              <span>🚨 Emergency Civic Hazards</span>
              <span style={{ fontWeight: '700', color: '#dc2626' }}>Immediate (2h)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
              <span>🗑️ Garbage & Waste Pileup</span>
              <span style={{ fontWeight: '600', color: '#2563eb' }}>Within 24 Hours</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
              <span>💧 Water Supply Leakage</span>
              <span style={{ fontWeight: '600', color: '#2563eb' }}>Within 12 Hours</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
              <span>🛣️ Road Damage & Potholes</span>
              <span style={{ fontWeight: '600', color: '#2563eb' }}>Within 5-7 Days</span>
            </div>
          </div>
          
          <hr style={{ margin: '14px 0', borderColor: 'rgba(15, 23, 42, 0.08)' }} />
          
          <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>Grievance Officers Directory</h4>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            <div>📞 Swachh Bharat Helpline: <strong>1969</strong></div>
            <div>📧 GMC Nodal Officer: <strong>grievance@gmc.gov.in</strong></div>
          </div>
        </div>
      </div>

      <UserBottomNav />

      {/* CUSTOM ALERT MODAL */}
      {alertMessage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(15, 23, 42, 0.3)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            borderRadius: '20px',
            padding: '24px 32px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.1)',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>
              {alertMessage.includes('🚨') || alertMessage.includes('⚡') || alertMessage.includes('💧') ? '🚨' : '✨'}
            </div>
            <h5 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '12px', fontSize: '16px' }}>Dispatch Alert</h5>
            <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>{alertMessage}</p>
            <button 
              style={{
                background: '#6366f1',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                transition: 'all 0.2s'
              }}
              onClick={() => setAlertMessage(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .icon-hover:hover {
          background-color: rgba(15, 23, 42, 0.08) !important;
          color: #0f172a !important;
        }
        .btn-hover:hover {
          background-color: #4f46e5 !important;
          transform: translateY(-1px);
        }
        .dashboard-card:hover {
          transform: translateY(-2px);
          border-color: rgba(99, 102, 241, 0.25) !important;
          background: rgba(255, 255, 255, 0.8) !important;
        }
        .sos-card:hover {
          transform: translateY(-2px);
          background-color: rgba(254, 202, 202, 0.85) !important;
          border-color: rgba(239, 68, 68, 0.4) !important;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.08) !important;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
