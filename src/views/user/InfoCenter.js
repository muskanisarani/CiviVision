"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const InfoCenter = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('charter');

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
      marginBottom: '20px',
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
    tabContainer: {
      display: 'flex',
      borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
      marginBottom: '24px',
      gap: '16px',
    },
    tab: {
      padding: '10px 16px',
      fontSize: '14px',
      fontWeight: '700',
      color: '#64748b',
      cursor: 'pointer',
      borderBottom: '2px solid transparent',
      transition: 'all 0.2s',
    },
    activeTab: {
      color: '#6366f1',
      borderBottomColor: '#6366f1',
    },
    contentBlock: {
      lineHeight: '1.6',
    },
    charterRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 16px',
      backgroundColor: 'rgba(255, 255, 255, 0.45)',
      border: '1px solid rgba(15, 23, 42, 0.06)',
      borderRadius: '12px',
      marginBottom: '10px',
      fontSize: '13.5px',
    },
    charterHeader: {
      fontWeight: '700',
      color: '#0f172a',
    },
    charterTime: {
      fontWeight: '700',
      color: '#2563eb',
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      border: '1px solid rgba(15, 23, 42, 0.06)',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '16px',
    },
    cardTitle: {
      fontSize: '15px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '12px',
    },
    contactsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      fontSize: '13px',
      color: '#475569',
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title}>GMC Information Center</h3>
        </div>

        <div style={styles.tabContainer}>
          <div 
            style={{ ...styles.tab, ...(activeTab === 'charter' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('charter')}
          >
            Citizen SLA Charter
          </div>
          <div 
            style={{ ...styles.tab, ...(activeTab === 'contacts' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('contacts')}
          >
            Ward Contacts
          </div>
          <div 
            style={{ ...styles.tab, ...(activeTab === 'rules' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('rules')}
          >
            Civic Guidelines
          </div>
        </div>

        <div style={styles.contentBlock}>
          {/* TAB 1: CITIZEN SLA CHARTER */}
          {activeTab === 'charter' && (
            <div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                Under the Gandhinagar Municipal Citizen Charter, resolution times for verified civic issues are bound by the following strict Service Level Agreements (SLAs):
              </p>
              <div style={styles.charterRow}>
                <span style={styles.charterHeader}>🚨 Emergency Civic Hazards</span>
                <span style={{ ...styles.charterTime, color: '#dc2626' }}>Within 2 Hours</span>
              </div>
              <div style={styles.charterRow}>
                <span style={styles.charterHeader}>💧 Water Supply Leakage</span>
                <span style={styles.charterTime}>Within 12 Hours</span>
              </div>
              <div style={styles.charterRow}>
                <span style={styles.charterHeader}>🗑️ Garbage & Waste Accumulation</span>
                <span style={styles.charterTime}>Within 24 Hours</span>
              </div>
              <div style={styles.charterRow}>
                <span style={styles.charterHeader}>🔌 Broken Streetlights</span>
                <span style={styles.charterTime}>Within 48 Hours</span>
              </div>
              <div style={styles.charterRow}>
                <span style={styles.charterHeader}>🚽 Public Toilet Sanitation</span>
                <span style={styles.charterTime}>Within 24 Hours</span>
              </div>
              <div style={styles.charterRow}>
                <span style={styles.charterHeader}>🛣️ Road Potholes & Cave-ins</span>
                <span style={styles.charterTime}>Within 5-7 Days</span>
              </div>
            </div>
          )}

          {/* TAB 2: WARD CONTACTS */}
          {activeTab === 'contacts' && (
            <div>
              <div style={styles.card}>
                <h4 style={styles.cardTitle}>Sanitation & Health Department</h4>
                <div style={styles.contactsList}>
                  <div>📞 Swachh Bharat Helpline: <strong>1969</strong></div>
                  <div>📧 Nodal Grievance Office: <strong>grievance@gmc.gov.in</strong></div>
                  <div>👤 SBM Chief Inspector: <strong>+91 79 23250961</strong></div>
                </div>
              </div>

              <div style={styles.card}>
                <h4 style={styles.cardTitle}>Water Supply & Sewerage Board</h4>
                <div style={styles.contactsList}>
                  <div>📞 Water Complaints Hotline: <strong>+91 79 23250962</strong></div>
                  <div>📧 Drainage Maintenance Dept: <strong>drainage@gmc.gov.in</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CIVIC GUIDELINES */}
          {activeTab === 'rules' && (
            <div>
              <h4 style={{ ...styles.cardTitle, fontSize: '16px' }}>Garbage Sorting & Segregation Rules</h4>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                To maintain public hygiene and aid auto-composting, please segregate waste at the household level:
              </p>
              <ul style={{ fontSize: '13px', color: '#475569', paddingLeft: '20px', lineHeight: '1.7', marginBottom: '24px' }}>
                <li><strong>Green Bin (Wet Waste):</strong> Organic kitchen waste, vegetable peels, leftovers, tea leaves, fallen leaves.</li>
                <li><strong>Blue Bin (Dry Waste):</strong> Paper, plastic wrappers, clean milk pouches, cardboard box packaging, glass bottles.</li>
                <li><strong>Black Bin (Hazardous):</strong> Medical waste, dirty diapers, expired medicines, batteries, fluorescent bulbs.</li>
              </ul>

              <h4 style={{ ...styles.cardTitle, fontSize: '16px' }}>Sanitation Penalties</h4>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                Littering in public places, open spitting, and plastic disposal without authorization attract direct penalty checks under GMC Bye-laws, ranging from ₹200 to ₹1000. Let's work together for a clean city.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoCenter;
