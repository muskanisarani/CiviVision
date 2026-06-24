"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Feedback = () => {
  const router = useRouter();
  const [feedbackText, setFeedbackText] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlertMessage('Thank you for your feedback! Your ideas help make our city cleaner and better.');
  };

  const styles = {
    body: {
      minHeight: '100vh',
      fontFamily: 'Segoe UI, sans-serif',
      display: 'flex',
      flexDirection: 'column',
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
      flex: 1,
      padding: '24px 20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.55)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(15, 23, 42, 0.08)',
      borderRadius: '24px',
      padding: '30px 28px',
      width: '100%',
      maxWidth: '1000px',
      boxShadow: '0 20px 45px rgba(15, 23, 42, 0.06)',
    },
    textarea: {
      width: '100%',
      border: '1px solid rgba(15, 23, 42, 0.12)',
      borderRadius: '14px',
      padding: '16px',
      height: '140px',
      resize: 'none',
      outline: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      color: '#0f172a',
      fontSize: '14px',
      transition: 'all 0.2s',
    },
    button: {
      width: '100%',
      border: 'none',
      marginTop: '20px',
      backgroundColor: '#6366f1',
      color: 'white',
      padding: '14px',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
      transition: 'all 0.2s',
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.header}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Feedback</h3>
          <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#475569' }}>Your opinion matters</p>
        </div>
      </div>

      <div style={styles.container}>
        <form style={styles.card} onSubmit={handleSubmit}>
          <textarea
            placeholder="Write your feedback here..."
            style={styles.textarea}
            className="input-focus"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            required
          />
          <button type="submit" style={styles.button} className="btn-hover">Submit Feedback</button>
        </form>
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
              ✨
            </div>
            <h5 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '12px', fontSize: '16px' }}>Feedback Received</h5>
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
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .input-focus:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important;
          background-color: rgba(255, 255, 255, 0.85) !important;
        }
        .btn-hover:hover {
          background-color: #4f46e5 !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3) !important;
        }
      `}</style>
    </div>
  );
};

export default Feedback;
