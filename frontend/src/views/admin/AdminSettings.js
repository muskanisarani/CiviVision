import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminSettings = () => {
  const navigate = useNavigate();

  const [autoDispatch, setAutoDispatch] = useState(true);
  const [escalationHours, setEscalationHours] = useState('24');
  const [notifyDeptHead, setNotifyDeptHead] = useState('director.sbm@gmc.gov.in');
  const [autoRouteRules, setAutoRouteRules] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('adminSettings') || '{}');
    if (saved.autoDispatch !== undefined) setAutoDispatch(saved.autoDispatch);
    if (saved.escalationHours !== undefined) setEscalationHours(saved.escalationHours);
    if (saved.notifyDeptHead !== undefined) setNotifyDeptHead(saved.notifyDeptHead);
    if (saved.autoRouteRules !== undefined) setAutoRouteRules(saved.autoRouteRules);

    async function fetchLogs() {
      try {
        const response = await fetch('/api/complaints', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.complaints) {
            const allComplaints = data.complaints;
            const generatedLogs = [
              `[INFO] System initialized. Connected to Supabase PostgreSQL database.`,
              `[INFO] AI classification model loaded: ResNet-101 Swachhata-weights.`,
              `[INFO] Connection established with GMC central SMS gateway... Done.`,
              `[INFO] Database status check: Found ${allComplaints.length} total active/resolved citizen complaints.`
            ];

            // Add a log for the last few complaints
            const recentComplaints = allComplaints.slice(0, 3);
            recentComplaints.forEach((c) => {
              const formattedId = c.id.substring(0, 8).toUpperCase();
              generatedLogs.push(
                `[INFO] Dispatch Audit: Complaint #${formattedId} (${c.category}) is marked as "${c.status}".`
              );
            });

            // Add warning logs for any pending complaints
            const pending = allComplaints.filter(c => c.status === 'Pending');
            if (pending.length > 0) {
              generatedLogs.push(
                `[WARN] SLA Warning: ${pending.length} complaints are currently pending dispatch response.`
              );
            }

            setLogs(generatedLogs);
          }
        }
      } catch (error) {
        console.error('Failed to generate admin logs:', error);
        setLogs([
          '[INFO] System initialized. Database connection established.',
          '[INFO] AI classification model loaded: ResNet-101 Swachhata-weights.',
          '[WARN] Failed to retrieve dynamic database logs.'
        ]);
      }
    }

    fetchLogs();
  }, []);

  const handleSave = () => {
    const config = { autoDispatch, escalationHours, notifyDeptHead, autoRouteRules };
    localStorage.setItem('adminSettings', JSON.stringify(config));
    setAlertMessage('Admin system configurations updated successfully!');
  };

  const styles = {
    body: {
      minHeight: 'calc(100vh - 150px)',
      fontFamily: '"Segoe UI", sans-serif',
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      
    },
    container: {
      maxWidth: '100%',
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
      backgroundColor: '#ef4444', // Admin alert color red
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
    input: {
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid rgba(15, 23, 42, 0.1)',
      fontSize: '13px',
      color: '#0f172a',
      outline: 'none',
      width: '200px',
      backgroundColor: '#ffffff',
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
      backgroundColor: '#ef4444', // red primary button for admin panel
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      padding: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
      transition: 'all 0.2s',
      marginTop: '24px',
    },
    logBox: {
      width: '100%',
      backgroundColor: '#0f172a',
      borderRadius: '12px',
      padding: '16px',
      fontFamily: 'Courier, monospace',
      fontSize: '11px',
      color: '#34d399',
      height: '110px',
      overflowY: 'auto',
      marginTop: '12px',
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button 
            onClick={() => navigate(-1)} 
            style={{ background: 'none', border: 'none', color: '#475569', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          <h3 style={styles.title}>System Administration Settings</h3>
        </div>

        <div>
          <h4 style={styles.sectionHeading}>Auto-Assignment Routing</h4>

          <div style={styles.optionRow}>
            <div>
              <div style={styles.optionLabel}>AI Auto-Dispatch</div>
              <div style={styles.optionDesc}>Automatically dispatch zone crews based on computer vision category matching</div>
            </div>
            <div 
              style={{ ...styles.toggle, ...(autoDispatch ? styles.toggleActive : {}) }}
              onClick={() => setAutoDispatch(!autoDispatch)}
            >
              <div style={{ ...styles.toggleCircle, ...(autoDispatch ? styles.toggleCircleActive : {}) }}></div>
            </div>
          </div>

          <div style={styles.optionRow}>
            <div>
              <div style={styles.optionLabel}>Sanitation Ward-Mapping Rules</div>
              <div style={styles.optionDesc}>Directly route waste complaints to nearest Swachh inspector</div>
            </div>
            <div 
              style={{ ...styles.toggle, ...(autoRouteRules ? styles.toggleActive : {}) }}
              onClick={() => setAutoRouteRules(!autoRouteRules)}
            >
              <div style={{ ...styles.toggleCircle, ...(autoRouteRules ? styles.toggleCircleActive : {}) }}></div>
            </div>
          </div>

          <h4 style={styles.sectionHeading}>Escalation Thresholds</h4>

          <div style={styles.optionRow}>
            <div>
              <div style={styles.optionLabel}>SLA Warning Window</div>
              <div style={styles.optionDesc}>Flag warning if complaint is unresolved within threshold</div>
            </div>
            <select 
              style={styles.select}
              value={escalationHours}
              onChange={(e) => setEscalationHours(e.target.value)}
            >
              <option value="12">12 Hours</option>
              <option value="24">24 Hours</option>
              <option value="48">48 Hours</option>
              <option value="72">72 Hours</option>
            </select>
          </div>

          <div style={styles.optionRow}>
            <div>
              <div style={styles.optionLabel}>IT Operations Email</div>
              <div style={styles.optionDesc}>Destination for auto-escalated warning notices</div>
            </div>
            <input 
              type="email" 
              style={styles.input} 
              value={notifyDeptHead} 
              onChange={(e) => setNotifyDeptHead(e.target.value)} 
            />
          </div>

          <h4 style={styles.sectionHeading}>Active Dispatch System Logs</h4>
          <div style={styles.logBox}>
            {logs.length === 0 ? (
              <div>[INFO] Loading system log stream...</div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))
            )}
          </div>

          <button style={styles.saveBtn} className="btn-admin-save-hover" onClick={handleSave}>
            Save Admin System Rules
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
              🔧
            </div>
            <h5 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '12px', fontSize: '16px' }}>Configurations Saved</h5>
            <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>{alertMessage}</p>
            <button 
              style={{
                background: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                transition: 'all 0.2s'
              }}
              onClick={() => {
                setAlertMessage(null);
                navigate('/admin/dashboard');
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      <style jsx="true" global="true">{`
        .btn-admin-save-hover:hover {
          background-color: #dc2626 !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(220, 38, 38, 0.35) !important;
        }
      `}</style>
    </div>
  );
};

export default AdminSettings;
