"use client";
import React, { useEffect, useRef, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const router = useRouter();
  const mapRef = useRef(null);
  const [alertMessage, setAlertMessage] = useState(null);

  const handleLogout = () => {
    logout();
    router.push('/select-role');
  };

  useEffect(() => {
    const initMap = () => {
      if (!window.google || !mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 23.0225, lng: 72.5714 },
        zoom: 8,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
          { featureType: 'poi', stylers: [{ visibility: 'off' }] },
          { featureType: 'road', stylers: [{ color: '#ffffff' }] },
          { featureType: 'water', stylers: [{ color: '#e9e9e9' }] }
        ]
      });

      const complaints = [
        { lat: 23.2156, lng: 72.6369, title: 'Garbage Overflow – Gandhinagar', status: 'Pending' },
        { lat: 23.0225, lng: 72.5714, title: 'Broken Streetlight – Ahmedabad', status: 'Resolved' },
        { lat: 23.5879, lng: 72.3693, title: 'Pothole – Mehsana', status: 'In Progress' }
      ];

      complaints.forEach(c => {
        const marker = new window.google.maps.Marker({
          position: { lat: c.lat, lng: c.lng },
          map,
          title: c.title,
          icon: {
            url:
              c.status === 'Resolved'
                ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                : c.status === 'In Progress'
                ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                : 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
          }
        });

        const info = new window.google.maps.InfoWindow({
          content: `<div style="color: #333; font-family: sans-serif;"><strong>${c.title}</strong><br>Status: ${c.status}</div>`
        });

        marker.addListener('click', () => info.open(map, marker));
      });
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDl3yhByebUuTUwsWwznypXjr6c_fEGu3w';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initMap();
      };
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  const styles = {
    body: {
      minHeight: '100vh',
      maxWidth: '1000px',
      margin: '0 auto',
      width: '100%',
    },
    topbar: {
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
      color: '#0f172a',
      padding: '16px 24px',
      fontWeight: '800',
      fontSize: '1.25rem',
      letterSpacing: '-0.5px',
      borderBottomLeftRadius: '24px',
      borderBottomRightRadius: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.55)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(15, 23, 42, 0.08)',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
    },
    statusNumber: {
      fontSize: '1.8rem',
      fontWeight: '800',
      letterSpacing: '-1px',
    },
    map: {
      width: '100%',
      height: '350px',
      borderRadius: '15px',
      backgroundColor: '#f1f5f9',
    },
    btnLogout: {
      backgroundColor: 'rgba(239, 68, 68, 0.08)',
      color: '#ef4444',
      border: '1px solid rgba(239, 68, 68, 0.15)',
      borderRadius: '14px',
      padding: '10px 24px',
      fontWeight: '700',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }
  };

  return (
    <div style={styles.body}>
      {/* TOP BAR */}
      <div style={styles.topbar}>
        <span>Admin Control Board</span>
        <button 
          style={{
            background: 'rgba(15, 23, 42, 0.05)',
            border: '1px solid rgba(15, 23, 42, 0.1)',
            borderRadius: '8px',
            color: '#475569',
            fontSize: '13px',
            fontWeight: '600',
            padding: '6px 12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          className="admin-settings-btn"
          onClick={() => router.push('/admin/settings')}
        >
          ⚙️ System Settings
        </button>
      </div>

      <div className="container my-4">
        {/* DASHBOARD STATS */}
        <div className="row g-3 text-center mb-4">
          <div className="col-md-4">
            <div style={styles.card}>
              <h5 style={{ fontSize: '14px', color: '#475569', fontWeight: '600', marginBottom: '8px' }}>Resolved</h5>
              <div style={{ ...styles.statusNumber, color: '#10b981' }}>25</div>
            </div>
          </div>

          <div className="col-md-4">
            <div style={styles.card}>
              <h5 style={{ fontSize: '14px', color: '#475569', fontWeight: '600', marginBottom: '8px' }}>In Progress</h5>
              <div style={{ ...styles.statusNumber, color: '#2563eb' }}>12</div>
            </div>
          </div>

          <div className="col-md-4">
            <div style={styles.card}>
              <h5 style={{ fontSize: '14px', color: '#475569', fontWeight: '600', marginBottom: '8px' }}>Pending</h5>
              <div style={{ ...styles.statusNumber, color: '#d97706' }}>8</div>
            </div>
          </div>
        </div>

        {/* MUNICIPAL PERFORMANCE METRICS */}
        <div className="row g-3 text-center mb-4">
          <div className="col-6 col-md-4">
            <div style={styles.card}>
              <h5 style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '8px' }}>Avg Resolution Time</h5>
              <div style={{ ...styles.statusNumber, color: '#4f46e5', fontSize: '1.5rem' }}>4.2 Hrs</div>
            </div>
          </div>
          <div className="col-6 col-md-4">
            <div style={styles.card}>
              <h5 style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '8px' }}>Citizen Satisfaction (CSAT)</h5>
              <div style={{ ...styles.statusNumber, color: '#06b6d4', fontSize: '1.5rem' }}>94.6%</div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div style={styles.card}>
              <h5 style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '8px' }}>Sanitation Dispatch Crews</h5>
              <div style={{ ...styles.statusNumber, color: '#10b981', fontSize: '1.5rem' }}>18 Active</div>
            </div>
          </div>
        </div>

        {/* COMPLAINT LIST */}
        <div style={{ ...styles.card, marginBottom: '24px' }}>
          <h5 className="text-center mb-3" style={{ fontWeight: '700', fontSize: '16px', color: '#0f172a' }}>Active Complaint List</h5>
          <div className="table-responsive">
            <table className="table table-striped align-middle table-borderless" style={{ margin: 0, backgroundColor: 'transparent' }}>
              <thead>
                <tr>
                  <th style={{ backgroundColor: 'transparent', color: '#64748b', fontSize: '13px' }}>ID</th>
                  <th style={{ backgroundColor: 'transparent', color: '#64748b', fontSize: '13px' }}>Category</th>
                  <th style={{ backgroundColor: 'transparent', color: '#64748b', fontSize: '13px' }}>Location</th>
                  <th style={{ backgroundColor: 'transparent', color: '#64748b', fontSize: '13px' }}>Status</th>
                  <th style={{ backgroundColor: 'transparent', color: '#64748b', fontSize: '13px' }}>Dispatch Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ backgroundColor: 'transparent' }}>#001</td>
                  <td style={{ backgroundColor: 'transparent' }}>Garbage Overflow</td>
                  <td style={{ backgroundColor: 'transparent' }}>Gandhinagar</td>
                  <td style={{ backgroundColor: 'transparent' }}><span className="badge bg-warning text-dark">Pending</span></td>
                  <td style={{ backgroundColor: 'transparent' }}>
                    <select className="form-select form-select-sm" style={{ maxWidth: '180px', fontSize: '12px', padding: '4px 8px', background: 'rgba(255,255,255,0.7)' }} onChange={(e) => {
                      if(e.target.value) setAlertMessage(`🚛 Dispatch orders sent: "${e.target.value}" has been assigned to Garbage Overflow ID #001.`);
                    }}>
                      <option value="">-- Assign Crew --</option>
                      <option value="SBM Clean Zone 4 GMC">SBM Clean Zone 4 GMC</option>
                      <option value="Road Repair Crew Zone-2">Road Repair Crew Zone-2</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td style={{ backgroundColor: 'transparent' }}>#002</td>
                  <td style={{ backgroundColor: 'transparent' }}>Broken Streetlight</td>
                  <td style={{ backgroundColor: 'transparent' }}>Ahmedabad</td>
                  <td style={{ backgroundColor: 'transparent' }}><span className="badge bg-success">Resolved</span></td>
                  <td style={{ backgroundColor: 'transparent' }}>
                    <select className="form-select form-select-sm" style={{ maxWidth: '180px', fontSize: '12px', padding: '4px 8px', background: 'rgba(255,255,255,0.7)' }} disabled>
                      <option value="">Assigned: GMC Electra</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td style={{ backgroundColor: 'transparent' }}>#003</td>
                  <td style={{ backgroundColor: 'transparent' }}>Pothole</td>
                  <td style={{ backgroundColor: 'transparent' }}>Mehsana</td>
                  <td style={{ backgroundColor: 'transparent' }}><span className="badge bg-primary">In Progress</span></td>
                  <td style={{ backgroundColor: 'transparent' }}>
                    <select className="form-select form-select-sm" style={{ maxWidth: '180px', fontSize: '12px', padding: '4px 8px', background: 'rgba(255,255,255,0.7)' }} onChange={(e) => {
                      if(e.target.value) setAlertMessage(`🚛 Dispatch orders sent: "${e.target.value}" has been assigned to Pothole ID #003.`);
                    }}>
                      <option value="">-- Assign Crew --</option>
                      <option value="Mehsana Paving Unit 8">Mehsana Paving Unit 8</option>
                      <option value="Zone 9 Drainage Operations">Zone 9 Drainage Operations</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* MAP */}
        <div style={{ ...styles.card, marginBottom: '24px' }}>
          <h5 className="text-center mb-3" style={{ fontWeight: '700', fontSize: '16px', color: '#0f172a' }}>Geospatial Heatmap</h5>
          <div ref={mapRef} style={styles.map}></div>
        </div>

        {/* CITIZEN FEEDBACK LOG */}
        <div style={{ ...styles.card, marginBottom: '24px' }}>
          <h5 className="text-center mb-3" style={{ fontWeight: '700', fontSize: '16px', color: '#0f172a' }}>Real-time Citizen Feedback Feed</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '200px', overflowY: 'auto', paddingRight: '8px' }}>
            <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.4)', borderRadius: '12px', border: '1px solid rgba(15, 23, 42, 0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong style={{ fontSize: '13px', color: '#1e293b' }}>Ramesh K. (Sector 12)</strong>
                <span style={{ fontSize: '12px', color: '#eab308' }}>⭐⭐⭐⭐⭐</span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>"Awesome response! Garbage reported yesterday in Sector 12 was cleared within 3 hours. Great initiative by GMC."</p>
            </div>
            <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.4)', borderRadius: '12px', border: '1px solid rgba(15, 23, 42, 0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong style={{ fontSize: '13px', color: '#1e293b' }}>Anjali P. (Ahmedabad)</strong>
                <span style={{ fontSize: '12px', color: '#eab308' }}>⭐⭐⭐⭐⭐</span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>"The toilet tracker app is very useful near Bus Stand. It showed Clean status and it was indeed very tidy."</p>
            </div>
          </div>
        </div>

        {/* LOGOUT */}
        <div className="text-center mt-4">
          <button style={styles.btnLogout} onClick={handleLogout} className="btn-logout">
            Logout
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
              🚛
            </div>
            <h5 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '12px', fontSize: '16px' }}>Dispatch Status</h5>
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
        .btn-logout:hover {
          background-color: rgba(239, 68, 68, 0.25) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
