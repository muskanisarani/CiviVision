"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Settings = () => {
  const router = useRouter();
  
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [language, setLanguage] = useState('English');
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    // Load config from localStorage if available
    const saved = JSON.parse(localStorage.getItem('userSettings') || '{}');
    if (saved.emailUpdates !== undefined) setEmailUpdates(saved.emailUpdates);
    if (saved.smsAlerts !== undefined) setSmsAlerts(saved.smsAlerts);
    if (saved.language !== undefined) setLanguage(saved.language);
  }, []);

  const handleSave = () => {
    const config = { emailUpdates, smsAlerts, language };
    localStorage.setItem('userSettings', JSON.stringify(config));
    setAlertMessage('Portal preferences updated successfully!');
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
    },
    title: {
      margin: 0,
      fontSize: '20px',
      fontWeight: '800',
      color: '#0f172a',
      letterSpacing: '-0.25px',
    },
    sectionHeading: {
      fontSize: '13px',
      fontWeight: '800',
      color: '#475569',
      margin: '18px 0 10px 0',
      textTransform: 'uppercase',
      letterSpacing: '0.75px',
    },
    optionRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      backgroundColor: 'rgba(255, 255, 255, 0.45)',
      border: '1px solid rgba(15, 23, 42, 0.06)',
      borderRadius: '12px',
      marginBottom: '10px',
    },
    optionLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b',
    },
    optionDesc: {
      fontSize: '12px',
      color: '#64748b',
      marginTop: '2px',
    },
    toggle: {
      width: '44px',
      height: '24px',
      borderRadius: '12px',
      backgroundColor: '#cbd5e1',
      position: 'relative',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    toggleActive: {
      backgroundColor: '#6366f1',
    },
    toggleCircle: {
      position: 'absolute',
      top: '2px',
      left: '2px',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(15, 23, 42, 0.1)',
      transition: 'left 0.2s',
    },
    toggleCircleActive: {
      left: '22px',
    },
    select: {
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid rgba(15, 23, 42, 0.1)',
      fontSize: '13px',
      fontWeight: '600',
      color: '#0f172a',
      outline: 'none',
      backgroundColor: '#ffffff',
    },
    saveBtn: {
      width: '100%',
      backgroundColor: '#6366f1',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      padding: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
      transition: 'all 0.2s',
      marginTop: '24px',
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title}>System Settings</h3>
        </div>

        <div>
          <h4 style={styles.sectionHeading}>Notification Channels</h4>
          
          <div style={styles.optionRow}>
            <div>
              <div style={styles.optionLabel}>Email Updates</div>
              <div style={styles.optionDesc}>Receive status changes on registered email</div>
            </div>
            <div 
              style={{ ...styles.toggle, ...(emailUpdates ? styles.toggleActive : {}) }}
              onClick={() => setEmailUpdates(!emailUpdates)}
            >
              <div style={{ ...styles.toggleCircle, ...(emailUpdates ? styles.toggleCircleActive : {}) }}></div>
            </div>
          </div>

          <div style={styles.optionRow}>
            <div>
              <div style={styles.optionLabel}>SOS Hazard SMS alerts</div>
              <div style={styles.optionDesc}>Receive immediate local danger notifications</div>
            </div>
            <div 
              style={{ ...styles.toggle, ...(smsAlerts ? styles.toggleActive : {}) }}
              onClick={() => setSmsAlerts(!smsAlerts)}
            >
              <div style={{ ...styles.toggleCircle, ...(smsAlerts ? styles.toggleCircleActive : {}) }}></div>
            </div>
          </div>

          <h4 style={styles.sectionHeading}>Localization Settings</h4>

          <div style={styles.optionRow}>
            <div>
              <div style={styles.optionLabel}>Preferred Language</div>
              <div style={styles.optionDesc}>Portal interface language translation</div>
            </div>
            <select 
              style={styles.select}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="English">English</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
              <option value="Gujarati">ગુજરાતી (Gujarati)</option>
            </select>
          </div>

          <button style={styles.saveBtn} className="btn-save-hover" onClick={handleSave}>
            Save Preferences
          </button>
        </div>
      </div>

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
              ⚙️
            </div>
            <h5 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '12px', fontSize: '16px' }}>Settings Saved</h5>
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
              onClick={() => {
                setAlertMessage(null);
                router.push('/user/dashboard');
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .btn-save-hover:hover {
          background-color: #4f46e5 !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35) !important;
        }
      `}</style>
    </div>
  );
};

export default Settings;
