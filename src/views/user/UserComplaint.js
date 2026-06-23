"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const UserComplaint = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate complaint creation and save to localStorage
    const newComplaint = {
      id: `#00${Math.floor(Math.random() * 900) + 100}`,
      category: category || 'General',
      location: location,
      description: description,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const currentComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    currentComplaints.unshift(newComplaint);
    localStorage.setItem('complaints', JSON.stringify(currentComplaints));

    setAlertMessage('Complaint submitted successfully!');
  };

  const styles = {
    body: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Segoe UI", sans-serif',
    },
    topBar: {
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
      color: '#0f172a',
      padding: '18px 30px',
      fontSize: '18px',
      fontWeight: '600',
      borderBottomLeftRadius: '24px',
      borderBottomRightRadius: '24px',
      display: 'flex',
      alignItems: 'center',
    },
    backSpan: {
      cursor: 'pointer',
      marginRight: '12px',
      fontSize: '22px',
    },
    container: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px 20px',
    },
    formCard: {
      width: '100%',
      maxWidth: '600px',
      backgroundColor: 'rgba(255, 255, 255, 0.55)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(15, 23, 42, 0.08)',
      borderRadius: '24px',
      padding: '35px 32px',
      boxShadow: '0 20px 45px rgba(15, 23, 42, 0.06)',
    },
    label: {
      fontWeight: '600',
      fontSize: '13px',
      marginTop: '16px',
      display: 'block',
      color: '#475569',
    },
    input: {
      width: '100%',
      border: '1px solid rgba(15, 23, 42, 0.12)',
      borderRadius: '12px',
      padding: '12px 16px',
      marginTop: '6px',
      fontSize: '14px',
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      color: '#0f172a',
      outline: 'none',
      transition: 'all 0.2s',
    },
    textarea: {
      width: '100%',
      border: '1px solid rgba(15, 23, 42, 0.12)',
      borderRadius: '12px',
      padding: '12px 16px',
      marginTop: '6px',
      fontSize: '14px',
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      color: '#0f172a',
      outline: 'none',
      resize: 'none',
      height: '100px',
      transition: 'all 0.2s',
    },
    uploadBox: {
      marginTop: '8px',
      border: '2px dashed rgba(15, 23, 42, 0.12)',
      borderRadius: '14px',
      height: '130px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#64748b',
      cursor: 'pointer',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      transition: 'all 0.2s',
    },
    svg: {
      width: '32px',
      height: '32px',
      marginBottom: '8px',
      color: '#6366f1',
    },
    submitBtn: {
      width: '100%',
      marginTop: '24px',
      backgroundColor: '#6366f1',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '14px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
      transition: 'all 0.2s',
    }
  };

  return (
    <div style={styles.body}>
      {/* HEADER */}
      <div style={styles.topBar}>
        <span style={styles.backSpan} onClick={() => router.back()}>←</span>
        File a new complaint
      </div>

      {/* FORM */}
      <div style={styles.container}>
        <form style={styles.formCard} onSubmit={handleSubmit}>
          <label style={styles.label}>Your Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            style={styles.input}
            className="input-focus"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label style={styles.label}>Location</label>
          <input
            type="text"
            placeholder="Enter location details"
            style={styles.input}
            className="input-focus"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <label style={styles.label}>Category</label>
          <select
            style={styles.input}
            className="input-focus"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" style={{ background: '#ffffff', color: '#0f172a' }}>Select issue category</option>
            <option value="Garbage / Waste" style={{ background: '#ffffff', color: '#0f172a' }}>Garbage / Waste</option>
            <option value="Road Damage" style={{ background: '#ffffff', color: '#0f172a' }}>Road Damage</option>
            <option value="Water Issue" style={{ background: '#ffffff', color: '#0f172a' }}>Water Issue</option>
            <option value="Public Toilet" style={{ background: '#ffffff', color: '#0f172a' }}>Public Toilet</option>
            <option value="Other" style={{ background: '#ffffff', color: '#0f172a' }}>Other</option>
          </select>

          <label style={styles.label}>Description</label>
          <textarea
            placeholder="Describe the issue in detail"
            style={styles.textarea}
            className="input-focus"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label style={styles.label}>Upload Photo</label>
          <label style={styles.uploadBox} className="upload-hover">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.svg}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span style={{ fontSize: '13px' }}>
              {photo ? photo.name : 'Click to upload photo'}
            </span>
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </label>

          <button type="submit" style={styles.submitBtn} className="btn-submit-hover">Submit Complaint</button>
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
            <h5 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '12px', fontSize: '16px' }}>Submission Successful</h5>
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
                router.push('/user/view-status');
              }}
            >
              View Status
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
        .upload-hover:hover {
          border-color: rgba(99, 102, 241, 0.3) !important;
          background-color: rgba(255, 255, 255, 0.6) !important;
          color: #0f172a !important;
        }
        .btn-submit-hover:hover {
          background-color: #4f46e5 !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35) !important;
        }
      `}</style>
    </div>
  );
};

export default UserComplaint;
