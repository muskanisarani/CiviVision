import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewStatus = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});

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
            description: c.details,
            feedback: c.rating ? { rating: c.rating, comment: c.comment } : null
          }));
          setComplaints(mapped);
        }
      }
    } catch (error) {
      console.error('Fetch complaints error:', error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSetRating = (complaintId, ratingValue) => {
    setRatings(prev => ({ ...prev, [complaintId]: ratingValue }));
  };

  const handleSetComment = (complaintId, commentValue) => {
    setComments(prev => ({ ...prev, [complaintId]: commentValue }));
  };

  const handleSubmitFeedback = async (complaintId) => {
    const rating = ratings[complaintId] || 0;
    const comment = comments[complaintId] || '';

    if (rating === 0) {
      alert('Please select a star rating before submitting.');
      return;
    }

    try {
      const response = await fetch(`/api/complaints/${complaintId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Failed to submit feedback');
        return;
      }

      alert('Thank you for your feedback! GMC Officers have been informed.');
      await fetchComplaints();
    } catch (error) {
      console.error('Submit feedback error:', error);
      alert('Network error submitting feedback.');
    }
  };

  const styles = {
    body: {
      minHeight: '100vh',
      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
      paddingBottom: '60px',
    },
    header: {
      backgroundColor: 'var(--card-bg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--card-border)',
      color: 'var(--text-primary)',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
    },
    container: {
      padding: '24px 20px',
      maxWidth: '1400px',
      width: '100%',
      margin: '0 auto',
    },
    statusCard: {
      backgroundColor: 'var(--card-bg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid var(--card-border)',
      borderRadius: '20px',
      padding: '20px 22px',
      marginBottom: '18px',
      boxShadow: 'var(--card-shadow)',
      transition: 'all 0.2s',
    },
    cardTitle: {
      margin: 0,
      fontWeight: '800',
      fontSize: '16px',
      color: 'var(--text-primary)',
    },
    cardText: {
      margin: '4px 0',
      fontSize: '13px',
      color: 'var(--text-muted)',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
    },
    badgePending: { 
      backgroundColor: 'rgba(245, 158, 11, 0.1)', 
      color: '#d97706',
      border: '1px solid rgba(245, 158, 11, 0.2)',
    },
    badgeProgress: { 
      backgroundColor: 'rgba(59, 130, 246, 0.1)', 
      color: '#2563eb',
      border: '1px solid rgba(59, 130, 246, 0.2)',
    },
    badgeResolved: { 
      backgroundColor: 'rgba(16, 185, 129, 0.1)', 
      color: '#10b981',
      border: '1px solid rgba(16, 185, 129, 0.2)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', letterSpacing: '-0.25px', color: 'var(--text-primary)' }}>
              My Raised Tickets
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Real-time municipal SLA progress</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/user/complaint')}
          style={{
            backgroundColor: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 14px',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(99, 102, 241, 0.25)'
          }}
        >
          + Raise Issue
        </button>
      </div>

      <div style={styles.container}>
        
        <div className="tickets-grid-layout">
          
          {/* LEFT COLUMN: Tickets Feed */}
          <div>
            {complaints.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: 'var(--card-bg)',
                backdropFilter: 'blur(16px)',
                borderRadius: '24px',
                border: '1px dashed var(--card-border)',
                boxShadow: 'var(--card-shadow)'
              }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎫</div>
                <h4 style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '16px', marginBottom: '6px' }}>No Active Tickets Found</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '18px' }}>
                  You have not filed any civic defect reports yet.
                </p>
                <button
                  onClick={() => navigate('/user/complaint')}
                  style={{
                    backgroundColor: '#6366f1',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 20px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Report a Civic Issue Now
                </button>
              </div>
            ) : (
              complaints.map((c, index) => {
                const isResolved = c.status.toLowerCase() === 'resolved';
                const inProgress = c.status.toLowerCase() === 'in progress';
                const hasFeedback = c.feedback;

                return (
                  <div key={c.id || index} style={styles.statusCard} className="status-card">
                    
                    {/* Header & Ticket ID Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '800',
                            backgroundColor: '#e0e7ff',
                            color: '#4338ca',
                            padding: '3px 10px',
                            borderRadius: '6px',
                            letterSpacing: '0.5px'
                          }}>
                            #{c.ticketId}
                          </span>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>
                            {c.date || 'Today'}
                          </span>
                        </div>
                        <h4 style={styles.cardTitle}>{c.category}</h4>
                        <p style={{ ...styles.cardText, marginTop: '2px' }}>
                          📍 {c.location}
                        </p>
                      </div>
                      <span style={{ ...styles.badge, ...getBadgeStyle(c.status) }}>
                        <i className={isResolved ? "bi bi-check-circle-fill" : (inProgress ? "bi bi-arrow-repeat" : "bi bi-clock-history")}></i>
                        {c.status}
                      </span>
                    </div>

                    {/* AI Attributes Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                      gap: '10px',
                      backgroundColor: 'rgba(15, 23, 42, 0.03)',
                      borderRadius: '12px',
                      padding: '12px',
                      marginTop: '14px',
                      marginBottom: '14px'
                    }}>
                      <div>
                        <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>
                          Defect Subtype
                        </span>
                        <strong style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>
                          {c.wasteType || 'Standard'}
                        </strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>
                          Volume / Scale
                        </span>
                        <strong style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>
                          {c.wasteVolume || 'Medium'}
                        </strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>
                          Problem Duration
                        </span>
                        <strong style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>
                          {c.durationDays || 'Today'}
                        </strong>
                      </div>
                    </div>

                    {/* Description */}
                    {c.description && (
                      <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 14px 0' }}>
                        {c.description}
                      </p>
                    )}

                    {/* Progression Bar */}
                    <div style={{ marginTop: '10px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>
                        <span style={{ color: '#10b981' }}>✓ 1. AI Audited</span>
                        <span style={{ color: inProgress || isResolved ? '#2563eb' : '#94a3b8' }}>{inProgress || isResolved ? '✓' : '•'} 2. Crew Dispatched</span>
                        <span style={{ color: isResolved ? '#10b981' : '#94a3b8' }}>{isResolved ? '✓' : '•'} 3. Resolved on Site</span>
                      </div>
                      <div className="progress" style={{ height: '5px', backgroundColor: 'rgba(15, 23, 42, 0.08)' }}>
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: isResolved ? '100%' : (inProgress ? '60%' : '30%'),
                            backgroundColor: isResolved ? '#10b981' : (inProgress ? '#2563eb' : '#f59e0b')
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Resolution Section & Ratings */}
                    {isResolved && (
                      <div style={{
                        marginTop: '16px',
                        padding: '14px',
                        borderRadius: '14px',
                        backgroundColor: 'rgba(16, 185, 129, 0.06)',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '16px' }}>🎉</span>
                          <strong style={{ fontSize: '13px', color: '#065f46' }}>Ward Remediation Verified & Closed</strong>
                        </div>
                        {c.resolutionPhotoUrl && (
                          <div style={{ marginBottom: '10px' }}>
                            <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>After-Fix Evidence Photo:</span>
                            <img src={c.resolutionPhotoUrl} alt="Fixed" style={{ width: '90px', height: '90px', borderRadius: '8px', objectFit: 'cover' }} />
                          </div>
                        )}
                        
                        {hasFeedback ? (
                          <div style={{ fontSize: '12px', color: '#047857', marginTop: '6px' }}>
                            <span>Citizen Rating: {'⭐'.repeat(c.rating || 5)}</span>
                            {c.comment && <div style={{ fontStyle: 'italic', marginTop: '2px', color: '#64748b' }}>"{c.comment}"</div>}
                          </div>
                        ) : (
                          <div style={{ marginTop: '10px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                              Rate Ward Team Resolution:
                            </span>
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  style={{ 
                                    cursor: 'pointer', 
                                    fontSize: '20px', 
                                    color: star <= (ratings[c.id] || 0) ? '#eab308' : '#cbd5e1',
                                    transition: 'color 0.15s'
                                  }}
                                  onClick={() => handleSetRating(c.id, star)}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <textarea
                              placeholder="Share remarks on how quickly the ward team solved this issue..."
                              style={{
                                width: '100%',
                                border: '1px solid rgba(15, 23, 42, 0.12)',
                                borderRadius: '10px',
                                padding: '8px 12px',
                                fontSize: '12px',
                                backgroundColor: '#ffffff',
                                color: '#0f172a',
                                outline: 'none',
                                resize: 'none',
                                height: '55px',
                              }}
                              value={comments[c.id] || ''}
                              onChange={(e) => handleSetComment(c.id, e.target.value)}
                            />
                            <button
                              style={{
                                marginTop: '8px',
                                backgroundColor: '#6366f1',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '6px 14px',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 2px 6px rgba(99, 102, 241, 0.15)',
                                transition: 'all 0.2s',
                              }}
                              className="btn-submit-hover"
                              onClick={() => handleSubmitFeedback(c.id)}
                            >
                              Submit Citizen Rating
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT COLUMN: Ticket Summary Analytics & SLA Hotline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Live Stats Card */}
            <div className="glass-card-detailed" style={{ padding: '22px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', color: 'var(--text-primary, #0f172a)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📊</span> Grievance Overview
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '22px', fontWeight: '900', color: '#4f46e5', display: 'block' }}>
                    {complaints.length}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>Total Raised</span>
                </div>
                <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '22px', fontWeight: '900', color: '#10b981', display: 'block' }}>
                    {complaints.filter(c => c.status.toLowerCase() === 'resolved').length}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#047857' }}>Resolved</span>
                </div>
                <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '22px', fontWeight: '900', color: '#2563eb', display: 'block' }}>
                    {complaints.filter(c => c.status.toLowerCase() === 'in progress').length}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#1d4ed8' }}>In Progress</span>
                </div>
                <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '22px', fontWeight: '900', color: '#d97706', display: 'block' }}>
                    {complaints.filter(c => c.status.toLowerCase() === 'pending').length}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#b45309' }}>Pending</span>
                </div>
              </div>

              <div style={{ padding: '12px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)', borderRadius: '12px', fontSize: '12px', color: 'var(--text-primary, #0f172a)', lineHeight: '1.5' }}>
                💡 <strong>Resolution Tip:</strong> Each resolved ticket awards <strong>+50 Swachh Credits</strong> to your Civic Karma wallet!
              </div>
            </div>

            {/* Ward SLA Response Guarantee */}
            <div className="glass-card-detailed" style={{ padding: '22px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '12px', color: 'var(--text-primary, #0f172a)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⏱️</span> Municipal Ward SLA Guidelines
              </h4>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                All civic tickets are automatically dispatched to the nearest zonal squad based on your verified GPS coordinates.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(239, 68, 68, 0.06)', borderRadius: '8px' }}>
                  <span>🚰 Water Pipeline Breach</span>
                  <strong style={{ color: '#b91c1c' }}>2h Max</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(16, 185, 129, 0.06)', borderRadius: '8px' }}>
                  <span>🗑️ Solid Waste Pileup</span>
                  <strong style={{ color: '#047857' }}>4-8h</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(99, 102, 241, 0.06)', borderRadius: '8px' }}>
                  <span>💡 Public Streetlight</span>
                  <strong style={{ color: '#4338ca' }}>12h</strong>
                </div>
              </div>
            </div>

            {/* Emergency Hotline */}
            <div className="glass-card-detailed" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary, #0f172a)' }}>
                🚨 Ward Emergency Hotline
              </h4>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px 0' }}>
                For open live wires, burst mains, or gas leaks, dial the 24x7 Gandhinagar Control Room.
              </p>
              <a href="tel:18002330333" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: '#ef4444', color: '#fff', borderRadius: '10px', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}>
                <i className="bi bi-telephone-fill"></i> 1800-233-0333 (Toll Free)
              </a>
            </div>

          </div>

        </div>

      </div>

      <style jsx="true" global="true">{`
        .tickets-grid-layout {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 960px) {
          .tickets-grid-layout {
            grid-template-columns: 1fr;
          }
        }
        .status-card:hover {
          transform: translateY(-2px);
          border-color: rgba(99, 102, 241, 0.25) !important;
        }
        .btn-submit-hover:hover {
          background-color: #4f46e5 !important;
        }
      `}</style>
    </div>
  );
};

export default ViewStatus;
