"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ViewStatus = () => {
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    // Fetch from localStorage, fallback to default static items if empty
    const saved = JSON.parse(localStorage.getItem('complaints') || '[]');
    if (saved.length === 0) {
      const defaults = [
        { id: '#001', category: 'Garbage Overflow', location: 'Market Area', status: 'Pending', date: '12 Jan 2026', description: 'Large garbage heap blocking secondary market road.' },
        { id: '#002', category: 'Broken Streetlight', location: 'Sector 9', status: 'In Progress', date: '10 Jan 2026', description: 'Streetlight pole GMC-204 flickering repeatedly at night.' },
        { id: '#003', category: 'Water Leakage', location: 'Main Road', status: 'Resolved', date: '08 Jan 2026', description: 'Drinking water pipeline leakage producing water wastage.', feedback: { rating: 5, comment: 'Quick repair done within 12 hours. Excellent work!' } }
      ];
      localStorage.setItem('complaints', JSON.stringify(defaults));
      setComplaints(defaults);
    } else {
      setComplaints(saved);
    }
  }, []);

  const handleSetRating = (complaintId, ratingValue) => {
    setRatings(prev => ({ ...prev, [complaintId]: ratingValue }));
  };

  const handleSetComment = (complaintId, commentValue) => {
    setComments(prev => ({ ...prev, [complaintId]: commentValue }));
  };

  const handleSubmitFeedback = (complaintId) => {
    const rating = ratings[complaintId] || 0;
    const comment = comments[complaintId] || '';

    if (rating === 0) {
      alert('Please select a star rating before submitting.');
      return;
    }

    const updated = complaints.map(c => {
      if (c.id === complaintId) {
        return { ...c, feedback: { rating, comment } };
      }
      return c;
    });

    setComplaints(updated);
    localStorage.setItem('complaints', JSON.stringify(updated));

    // Store globally for Admin Control Board review feed
    const globalFeedbacks = JSON.parse(localStorage.getItem('citizenFeedbacks') || '[]');
    const targetComp = complaints.find(c => c.id === complaintId);
    globalFeedbacks.unshift({
      id: `fb-${Date.now()}`,
      complaintId,
      name: `Citizen (${targetComp ? targetComp.location : 'GMC Area'})`,
      rating,
      comment,
      date: 'Just now'
    });
    localStorage.setItem('citizenFeedbacks', JSON.stringify(globalFeedbacks));
  };

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
    container: {
      padding: '24px 20px',
      maxWidth: '1000px',
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
      margin: '4px 0',
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
        <button 
          onClick={() => router.back()} 
          style={{ background: 'none', border: 'none', color: '#475569', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <i className="bi bi-arrow-left"></i>
        </button>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', letterSpacing: '-0.25px' }}>Complaint Status</h3>
      </div>

      <div style={styles.container}>
        {complaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            No complaints reported yet.
          </div>
        ) : (
          complaints.map((c, index) => {
            const isResolved = c.status.toLowerCase() === 'resolved';
            const hasFeedback = c.feedback;

            return (
              <div key={c.id || index} style={styles.statusCard} className="status-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={styles.cardTitle}>{c.category} – {c.location}</h4>
                    <p style={styles.cardText}>Complaint ID: <strong>{c.id}</strong> • Reported: {c.date || 'Recent'}</p>
                  </div>
                  <span style={{ ...styles.badge, ...getBadgeStyle(c.status) }}>
                    {c.status}
                  </span>
                </div>
                
                {c.description && (
                  <p style={{ ...styles.cardText, marginTop: '8px', padding: '8px 12px', background: 'rgba(15,23,42,0.03)', borderRadius: '8px', fontSize: '12px' }}>
                    {c.description.includes('[Garbage Details]') || c.description.includes('[AI Report Details]') ? (
                      c.description.split('\n\n')[0]
                    ) : (
                      c.description
                    )}
                  </p>
                )}

                {/* POST RESOLUTION FEEDBACK COMPONENT */}
                {isResolved && (
                  <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed rgba(15, 23, 42, 0.08)' }}>
                    {hasFeedback ? (
                      <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.12)', borderRadius: '12px', padding: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <i className="bi bi-check-circle-fill"></i> Resolution Review Submitted
                        </span>
                        <div style={{ fontSize: '14px', color: '#eab308', margin: '4px 0' }}>
                          {'★'.repeat(c.feedback.rating)}{'☆'.repeat(5 - c.feedback.rating)}
                        </div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>"{c.feedback.comment}"</p>
                      </div>
                    ) : (
                      <div>
                        <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#4f46e5', margin: '0 0 6px 0' }}>
                          Rate municipal resolution:
                        </h5>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                          {[1, 2, 3, 4, 5].map(star => (
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
                          placeholder="Tell us what you think of the service/speed..."
                          style={{
                            width: '100%',
                            border: '1px solid rgba(15, 23, 42, 0.12)',
                            borderRadius: '10px',
                            padding: '8px 12px',
                            fontSize: '12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.6)',
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
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(99, 102, 241, 0.15)',
                            transition: 'all 0.2s',
                          }}
                          className="btn-submit-hover"
                          onClick={() => handleSubmitFeedback(c.id)}
                        >
                          Submit Feedback
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

      <style jsx global>{`
        .status-card:hover {
          transform: translateY(-2px);
          border-color: rgba(99, 102, 241, 0.25) !important;
          background-color: rgba(255, 255, 255, 0.8) !important;
        }
        .btn-submit-hover:hover {
          background-color: #4f46e5 !important;
        }
      `}</style>
    </div>
  );
};

export default ViewStatus;
