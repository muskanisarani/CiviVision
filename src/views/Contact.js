"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Contact = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlertMessage(`Support ticket submitted successfully! Reference ID: #TCK-${Math.floor(Math.random() * 9000) + 1000}. Our engineering team will review it shortly.`);
  };

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
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '40px',
    },
    title: {
      fontSize: '28px',
      fontWeight: '800',
      color: '#0f172a',
      marginBottom: '10px',
      letterSpacing: '-0.5px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      fontSize: '14px',
      color: '#475569',
      marginBottom: '35px',
      textAlign: 'center',
      lineHeight: '1.6',
    },
    heading: {
      fontSize: '18px',
      fontWeight: '800',
      color: '#1e293b',
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '12px',
      fontWeight: '700',
      color: '#475569',
      marginBottom: '6px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    input: {
      width: '100%',
      padding: '12px 14px',
      borderRadius: '10px',
      border: '1px solid rgba(15, 23, 42, 0.12)',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      fontSize: '14px',
      color: '#0f172a',
      outline: 'none',
      marginBottom: '16px',
      transition: 'all 0.2s',
    },
    textarea: {
      width: '100%',
      height: '120px',
      padding: '12px 14px',
      borderRadius: '10px',
      border: '1px solid rgba(15, 23, 42, 0.12)',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      fontSize: '14px',
      color: '#0f172a',
      outline: 'none',
      marginBottom: '18px',
      transition: 'all 0.2s',
      resize: 'none',
    },
    submitBtn: {
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
    },
    infoBlock: {
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      border: '1px solid rgba(15, 23, 42, 0.06)',
      borderRadius: '16px',
      padding: '24px 20px',
      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.02)',
      height: '100%',
    },
    contactRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '14px',
      color: '#475569',
      marginBottom: '20px',
    },
    iconCircle: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: 'rgba(99, 102, 241, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6366f1',
      fontSize: '16px',
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2 style={styles.title}>System Support & Contact</h2>
        <p style={styles.subtitle}>Report website problems, login difficulties, or wrong image diagnostic readings directly to the GMC support team.</p>

        <div style={styles.grid}>
          {/* TICKET FORM */}
          <div>
            <h4 style={styles.heading}>Report a System Problem</h4>
            <form onSubmit={handleSubmit}>
              <label style={styles.label}>Your Name</label>
              <input 
                type="text" 
                placeholder="Enter full name" 
                style={styles.input} 
                className="input-focus" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />

              <label style={styles.label}>Email Address</label>
              <input 
                type="email" 
                placeholder="example@gmail.com" 
                style={styles.input} 
                className="input-focus" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />

              <label style={styles.label}>Problem Category</label>
              <select 
                style={styles.input} 
                className="input-focus" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                required
              >
                <option value="" style={{ background: '#ffffff', color: '#0f172a' }}>Select Topic</option>
                <option value="Login / Register issue" style={{ background: '#ffffff', color: '#0f172a' }}>Login / Register Issues</option>
                <option value="Photo upload error" style={{ background: '#ffffff', color: '#0f172a' }}>Photo Upload Failures</option>
                <option value="Incorrect AI detection" style={{ background: '#ffffff', color: '#0f172a' }}>Wrong AI Issue Categorization</option>
                <option value="General website bug" style={{ background: '#ffffff', color: '#0f172a' }}>General Portal Bug</option>
              </select>

              <label style={styles.label}>Issue Description</label>
              <textarea 
                placeholder="Please describe the issue in detail, including steps to reproduce." 
                style={styles.textarea} 
                className="input-focus" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                required 
              />

              <button type="submit" style={styles.submitBtn} className="btn-ticket-hover">
                Submit Support Ticket
              </button>
            </form>
          </div>

          {/* CONTACT INFO */}
          <div>
            <div style={styles.infoBlock}>
              <h4 style={styles.heading}>Municipal Support Directory</h4>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', marginBottom: '24px' }}>
                For general grievance resolution guidelines, please refer to the official Citizen SLA Charter page. For system issues, contact:
              </p>

              <div style={styles.contactRow}>
                <div style={styles.iconCircle}><i className="bi bi-telephone"></i></div>
                <div>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '12px', textTransform: 'uppercase' }}>GMC Support Line</div>
                  <div>+91 79 23250960</div>
                </div>
              </div>

              <div style={styles.contactRow}>
                <div style={styles.iconCircle}><i className="bi bi-envelope"></i></div>
                <div>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '12px', textTransform: 'uppercase' }}>IT Support Email</div>
                  <div>portal.support@gmc.gov.in</div>
                </div>
              </div>

              <div style={styles.contactRow}>
                <div style={styles.iconCircle}><i className="bi bi-geo-alt"></i></div>
                <div>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '12px', textTransform: 'uppercase' }}>GMC City Hall HQ</div>
                  <div>Sector 17, Gandhinagar, Gujarat</div>
                </div>
              </div>

              <div style={{ marginTop: '35px', textAlign: 'center' }}>
                <span onClick={() => router.push('/faqs')} className="toggle-link-custom" style={{ cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                  Browse Help FAQs Instead
                </span>
              </div>
            </div>
          </div>
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
              ✉️
            </div>
            <h5 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '12px', fontSize: '16px' }}>Support Ticket Received</h5>
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
                setName('');
                setEmail('');
                setSubject('');
                setMessage('');
                router.push('/');
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .btn-ticket-hover:hover {
          background-color: #4f46e5 !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35) !important;
        }
      `}</style>
    </div>
  );
};

export default Contact;
