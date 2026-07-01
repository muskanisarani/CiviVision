"use client";
import React, { useEffect, useRef, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const router = useRouter();
  const mapRef = useRef(null);
  const [alertMessage, setAlertMessage] = useState(null);

  const [complaints, setComplaints] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const handleLogout = () => {
    logout();
    router.push('/select-role');
  };

  const fetchComplaints = async () => {
    try {
      const response = await fetch('/api/complaints');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const mapped = data.complaints.map(c => ({
            ...c,
            date: new Date(c.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            location: c.locationName || 'Pinned Location',
            description: c.details
          }));
          setComplaints(mapped);

          // Extract actual feedbacks from resolved reviews
          const reviews = data.complaints
            .filter(c => c.rating !== null)
            .map(c => ({
              id: `fb-${c.id}`,
              name: `${c.user?.name || 'Citizen'} (${c.locationName || 'Pinned Location'})`,
              rating: c.rating,
              comment: c.comment,
              date: new Date(c.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            }));
          setFeedbacks(reviews);
        }
      }
    } catch (error) {
      console.error('Fetch complaints error:', error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdateStatus = async (complaintId, newStatus) => {
    try {
      const response = await fetch(`/api/complaints/${complaintId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Failed to update status');
        return;
      }

      setAlertMessage(`Complaint status updated to "${newStatus}"! Notification sent to the citizen.`);
      await fetchComplaints();
    } catch (error) {
      console.error('Update status error:', error);
      alert('Network error updating status.');
    }
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

      const mapComplaints = [
        { lat: 23.2156, lng: 72.6369, title: 'Garbage Overflow – Gandhinagar', status: 'Pending' },
        { lat: 23.0225, lng: 72.5714, title: 'Broken Streetlight – Ahmedabad', status: 'Resolved' },
        { lat: 23.5879, lng: 72.3693, title: 'Pothole – Mehsana', status: 'In Progress' }
      ];

      mapComplaints.forEach(c => {
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
      minHeight: 'calc(100vh - 150px)',
      fontFamily: '"Segoe UI", sans-serif',
      padding: '40px 20px',
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
      padding: '40px 30px',
      boxShadow: '0 20px 45px rgba(15, 23, 42, 0.05)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
      paddingBottom: '20px',
    },
    title: {
      margin: '0',
      fontSize: '28px',
      fontWeight: '800',
      letterSpacing: '-0.5px',
      background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
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

  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const progressCount = complaints.filter(c => c.status === 'In Progress').length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <h2 style={styles.title}>Admin Control Board</h2>
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

        {/* DASHBOARD STATS */}
        <div className="row g-3 text-center mb-4">
          <div className="col-md-4">
            <div style={styles.card}>
              <h5 style={{ fontSize: '14px', color: '#475569', fontWeight: '600', marginBottom: '8px' }}>Resolved</h5>
              <div style={{ ...styles.statusNumber, color: '#10b981' }}>{resolvedCount}</div>
            </div>
          </div>

          <div className="col-md-4">
            <div style={styles.card}>
              <h5 style={{ fontSize: '14px', color: '#475569', fontWeight: '600', marginBottom: '8px' }}>In Progress</h5>
              <div style={{ ...styles.statusNumber, color: '#2563eb' }}>{progressCount}</div>
            </div>
          </div>

          <div className="col-md-4">
            <div style={styles.card}>
              <h5 style={{ fontSize: '14px', color: '#475569', fontWeight: '600', marginBottom: '8px' }}>Pending</h5>
              <div style={{ ...styles.statusNumber, color: '#d97706' }}>{pendingCount}</div>
            </div>
          </div>
        </div>

        {/* MUNICIPAL PERFORMANCE METRICS */}
        <div className="row g-3 text-center mb-4">
          <div className="col-6 col-md-4">
            <div style={styles.card}>
              <h5 style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '8px' }}>Avg Resolution Time</h5>
              <div style={{ ...styles.statusNumber, color: '#4f46e5', fontSize: '1.5rem' }}>3.8 Hrs</div>
            </div>
          </div>
          <div className="col-6 col-md-4">
            <div style={styles.card}>
              <h5 style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '8px' }}>Citizen Satisfaction (CSAT)</h5>
              <div style={{ ...styles.statusNumber, color: '#06b6d4', fontSize: '1.5rem' }}>96.2%</div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div style={styles.card}>
              <h5 style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '8px' }}>Sanitation Dispatch Crews</h5>
              <div style={{ ...styles.statusNumber, color: '#10b981', fontSize: '1.5rem' }}>20 Active</div>
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
                  <th style={{ backgroundColor: 'transparent', color: '#64748b', fontSize: '13px' }}>Dispatch Action / Update Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center" style={{ backgroundColor: 'transparent', color: '#64748b', padding: '20px' }}>
                      No active complaints found in system database.
                    </td>
                  </tr>
                ) : (
                  complaints.map(c => (
                    <tr key={c.id}>
                      <td style={{ backgroundColor: 'transparent', fontWeight: '700', fontSize: '13px' }}>{c.id}</td>
                      <td style={{ backgroundColor: 'transparent' }}>{c.category}</td>
                      <td style={{ backgroundColor: 'transparent' }}>{c.location}</td>
                      <td style={{ backgroundColor: 'transparent' }}>
                        <span className={`badge ${
                          c.status === 'Resolved' ? 'bg-success' : c.status === 'In Progress' ? 'bg-primary' : 'bg-warning text-dark'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td style={{ backgroundColor: 'transparent' }}>
                        <div className="d-flex gap-2 align-items-center">
                          <select 
                            className="form-select form-select-sm" 
                            style={{ maxWidth: '130px', fontSize: '12px', padding: '4px 8px', background: 'rgba(255,255,255,0.7)', borderRadius: '8px' }}
                            value={c.status}
                            onChange={(e) => handleUpdateStatus(c.id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                          <select 
                            className="form-select form-select-sm" 
                            style={{ maxWidth: '145px', fontSize: '12px', padding: '4px 8px', background: 'rgba(255,255,255,0.7)', borderRadius: '8px' }} 
                            onChange={(e) => {
                              if(e.target.value) setAlertMessage(`🚛 Dispatch orders sent: "${e.target.value}" has been assigned to Complaint ID ${c.id}.`);
                            }}
                          >
                            <option value="">-- Assign Crew --</option>
                            <option value="SBM Clean Zone 4 GMC">SBM Clean Zone 4 GMC</option>
                            <option value="Road Repair Crew Zone-2">Road Repair Crew Zone-2</option>
                            <option value="GMC Electra squad">GMC Electra squad</option>
                            <option value="Toilet Sanitation Unit C">Toilet Sanitation Unit C</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
            {feedbacks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '13px' }}>
                No citizen reviews received yet.
              </div>
            ) : (
              feedbacks.map((f, i) => (
                <div key={f.id || i} style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.4)', borderRadius: '12px', border: '1px solid rgba(15, 23, 42, 0.05)' }}>
                  <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13px', color: '#1e293b' }}>{f.name}</strong>
                    <span style={{ fontSize: '12px', color: '#eab308' }}>
                      {'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#475569' }}>"{f.comment}"</p>
                  <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginTop: '4px', textAlign: 'right' }}>{f.date}</span>
                </div>
              ))
            )}
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
