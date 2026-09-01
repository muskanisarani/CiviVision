import React, { useEffect, useRef, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [alertMessage, setAlertMessage] = useState(null);

  const [complaints, setComplaints] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const handleLogout = () => {
    logout();
    navigate('/select-role');
  };

  const fetchComplaints = async () => {
    try {
      const response = await fetch('/api/complaints', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const mapped = data.complaints.map(c => ({
            ...c,
            ticketId: c.ticketNumber || `TKT-${c.id.substring(0, 8).toUpperCase()}`,
            date: new Date(c.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            location: c.locationName || 'Live GPS Coordinates',
            description: c.details
          }));
          setComplaints(mapped);

          // Extract feedbacks from reviews
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
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Failed to update status');
        return;
      }

      setAlertMessage(`Ticket status updated to "${newStatus}"! Citizen notification sent.`);
      await fetchComplaints();
    } catch (error) {
      console.error('Update status error:', error);
      alert('Network error updating status.');
    }
  };

  useEffect(() => {
    const initMap = () => {
      if (!window.google || !mapRef.current) return;

      const mapComplaints = complaints
        .filter(c => c.latitude !== null && c.longitude !== null)
        .map(c => ({
          lat: parseFloat(c.latitude),
          lng: parseFloat(c.longitude),
          title: `#${c.ticketId}: ${c.category} – ${c.locationName || 'Location'}`,
          status: c.status
        }));

      const centerCoord = mapComplaints.length > 0
        ? { lat: mapComplaints[0].lat, lng: mapComplaints[0].lng }
        : { lat: 23.2156, lng: 72.6369 };

      const map = new window.google.maps.Map(mapRef.current, {
        center: centerCoord,
        zoom: 12,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#f8fafc' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
          { featureType: 'poi', stylers: [{ visibility: 'off' }] },
          { featureType: 'road', stylers: [{ color: '#ffffff' }] },
          { featureType: 'water', stylers: [{ color: '#cbd5e1' }] }
        ]
      });

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
          content: `<div style="color: #0f172a; font-family: sans-serif; font-size: 13px;"><strong>${c.title}</strong><br><span style="color: #64748b;">Status: ${c.status}</span></div>`
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
  }, [complaints]);

  const styles = {
    body: {
      minHeight: 'calc(100vh - 120px)',
      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
    },
    container: {
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(15, 23, 42, 0.08)',
      borderRadius: '24px',
      padding: '28px 24px',
      boxShadow: '0 20px 45px rgba(15, 23, 42, 0.05)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '12px'
    },
    title: {
      fontSize: '22px',
      fontWeight: '800',
      color: '#0f172a',
      margin: 0,
      letterSpacing: '-0.5px',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '18px',
      padding: '18px 20px',
      boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
      border: '1px solid rgba(15, 23, 42, 0.06)',
    },
    statusNumber: {
      fontSize: '2rem',
      fontWeight: '800',
      lineHeight: '1',
    },
    map: {
      height: '350px',
      width: '100%',
      borderRadius: '14px',
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
          <div>
            <h2 style={styles.title}>GMC Municipal Control Board</h2>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Real-Time AI-Verified Citizen Dispatch & Incident Routing
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              style={{
                background: '#6366f1',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '700',
                padding: '8px 14px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
              }}
              onClick={() => navigate('/admin/analytics')}
            >
              📊 Research Analytics & Charts
            </button>
            <button 
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                color: '#334155',
                fontSize: '13px',
                fontWeight: '600',
                padding: '8px 14px',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/admin/settings')}
            >
              ⚙️ System Settings
            </button>
          </div>
        </div>

        {/* DASHBOARD STATS */}
        <div className="row g-3 text-center mb-4">
          <div className="col-md-4">
            <div style={styles.card}>
              <h5 style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '8px' }}>Resolved Tickets</h5>
              <div style={{ ...styles.statusNumber, color: '#10b981' }}>{resolvedCount}</div>
            </div>
          </div>

          <div className="col-md-4">
            <div style={styles.card}>
              <h5 style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '8px' }}>In Progress / Crew Dispatched</h5>
              <div style={{ ...styles.statusNumber, color: '#2563eb' }}>{progressCount}</div>
            </div>
          </div>

          <div className="col-md-4">
            <div style={styles.card}>
              <h5 style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '8px' }}>Pending SLA Review</h5>
              <div style={{ ...styles.statusNumber, color: '#d97706' }}>{pendingCount}</div>
            </div>
          </div>
        </div>

        {/* COMPLAINTS & TICKETS TABLE */}
        <div style={{ ...styles.card, marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h5 style={{ fontWeight: '800', fontSize: '16px', color: '#0f172a', margin: 0 }}>
              Live Civic Tickets & Dispatch Management
            </h5>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Showing {complaints.length} Total Reports
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle" style={{ margin: 0 }}>
              <thead className="table-light">
                <tr>
                  <th style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Ticket ID</th>
                  <th style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Citizen & Location</th>
                  <th style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Defect & Volume</th>
                  <th style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Status</th>
                  <th style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Dispatch / Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4" style={{ color: '#64748b', fontSize: '13px' }}>
                      No complaints registered in system.
                    </td>
                  </tr>
                ) : (
                  complaints.map(c => (
                    <tr key={c.id}>
                      {/* Ticket Number & Date */}
                      <td>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '800',
                          backgroundColor: '#e0e7ff',
                          color: '#4338ca',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          display: 'inline-block'
                        }}>
                          #{c.ticketId}
                        </span>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          {c.date}
                        </div>
                      </td>

                      {/* Citizen Info & Location */}
                      <td>
                        <strong style={{ fontSize: '13px', color: '#0f172a' }}>
                          {c.user?.name || 'Citizen'}
                        </strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {c.user?.mobile || ''} • {c.location}
                        </div>
                      </td>

                      {/* Category, Waste Type & Volume */}
                      <td>
                        <div style={{ fontWeight: '600', fontSize: '13px', color: '#0f172a' }}>
                          {c.category}
                        </div>
                        <div style={{ fontSize: '11px', color: '#475569' }}>
                          Type: {c.wasteType || 'General'} | Vol: {c.wasteVolume || 'Standard'}
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`badge ${
                          c.status === 'Resolved' ? 'bg-success' : c.status === 'In Progress' ? 'bg-primary' : 'bg-warning text-dark'
                        }`} style={{ padding: '6px 10px', fontSize: '11px' }}>
                          {c.status}
                        </span>
                      </td>

                      {/* Action & Dispatch */}
                      <td>
                        <div className="d-flex gap-2 align-items-center">
                          <select 
                            className="form-select form-select-sm" 
                            style={{ maxWidth: '120px', fontSize: '12px', borderRadius: '8px' }}
                            value={c.status}
                            onChange={(e) => handleUpdateStatus(c.id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                          <select 
                            className="form-select form-select-sm" 
                            style={{ maxWidth: '140px', fontSize: '12px', borderRadius: '8px' }} 
                            onChange={(e) => {
                              if(e.target.value) setAlertMessage(`🚛 Dispatch order: "${e.target.value}" routed to Ticket #${c.ticketId}.`);
                            }}
                          >
                            <option value="">Assign Crew</option>
                            <option value="SBM Clean Zone 4 GMC">SBM Zone 4 Squad</option>
                            <option value="Road Repair Crew 2">Road Repair Unit</option>
                            <option value="GMC Electra Squad">GMC Electra Squad</option>
                            <option value="Toilet Sanitation Unit">Sanitation Unit C</option>
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
          <h5 style={{ fontWeight: '800', fontSize: '16px', color: '#0f172a', marginBottom: '14px' }}>
            Geospatial Ward Dispatch Map
          </h5>
          <div ref={mapRef} style={styles.map}></div>
        </div>

        {/* CITIZEN REVIEWS */}
        <div style={styles.card}>
          <h5 style={{ fontWeight: '800', fontSize: '16px', color: '#0f172a', marginBottom: '14px' }}>
            Real-Time Citizen Feedback Feed
          </h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto' }}>
            {feedbacks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px', color: '#64748b', fontSize: '13px' }}>
                No feedback reviews received yet.
              </div>
            ) : (
              feedbacks.map((f, i) => (
                <div key={f.id || i} style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13px', color: '#1e293b' }}>{f.name}</strong>
                    <span style={{ fontSize: '13px', color: '#eab308' }}>
                      {'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>"{f.comment}"</p>
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

      {/* ALERT TOAST */}
      {alertMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '14px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          zIndex: 9999,
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>{alertMessage}</span>
          <button 
            onClick={() => setAlertMessage(null)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px' }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
