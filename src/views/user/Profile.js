"use client";
import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
import UserBottomNav from '../../components/UserBottomNav';

const Profile = () => {
  const { currentUser, logout, updateUser } = useContext(AuthContext);
  const router = useRouter();

  // Profile Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ward, setWard] = useState('');
  const [language, setLanguage] = useState('English');

  // Preferences Toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [gpsShare, setGpsShare] = useState(true);

  // Avatar Customization States
  const [avatarType, setAvatarType] = useState('badge');
  const [avatarBadge, setAvatarBadge] = useState('eco');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Dynamic Statistics
  const [stats, setStats] = useState({
    filed: 0,
    resolved: 0,
    feedbacks: 0,
    points: 0,
    rank: 'Civic Novice 🥉'
  });

  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(localStorage.getItem('userPhone') || '');
      setWard(localStorage.getItem('userWard') || 'Sector 5');
      setLanguage(localStorage.getItem('userLanguage') || 'English');
    }

    // Load Avatar preferences
    const savedType = localStorage.getItem('userAvatarType') || 'badge';
    const savedBadge = localStorage.getItem('userAvatarBadge') || 'initials';
    const savedUrl = localStorage.getItem('userAvatarUrl') || null;
    setAvatarType(savedType);
    setAvatarBadge(savedBadge);
    setAvatarUrl(savedUrl);

    // Load statistics
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const feedbacks = JSON.parse(localStorage.getItem('citizenFeedbacks') || '[]');
    
    const filedCount = complaints.length;
    const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
    const feedbackCount = feedbacks.length;

    // Calculate Points
    const pointsTotal = (filedCount * 10) + (resolvedCount * 50) + (feedbackCount * 5);
    
    let rankLevel = 'Civic Novice 🥉';
    if (pointsTotal >= 300) {
      rankLevel = 'Swachh Ambassador 🥇';
    } else if (pointsTotal >= 100) {
      rankLevel = 'Sanitation Champion 🥈';
    }

    setStats({
      filed: filedCount,
      resolved: resolvedCount,
      feedbacks: feedbackCount,
      points: pointsTotal,
      rank: rankLevel
    });
  }, [currentUser]);

  const getInitials = (userName) => {
    if (!userName) return 'C';
    const parts = userName.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const handleLogout = () => {
    logout();
    router.push('/select-role');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (phone.length > 0 && phone.length !== 10) {
      alert('Mobile number must be exactly 10 digits.');
      return;
    }

    updateUser(name, { phone, ward, language });
    setAlertMessage('Profile updated successfully! Municipal citizen credentials synchronized.');
  };

  // Avatar handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Avatar image size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setAvatarUrl(dataUrl);
      setAvatarType('upload');
      localStorage.setItem('userAvatarUrl', dataUrl);
      localStorage.setItem('userAvatarType', 'upload');
      setShowAvatarModal(false);
      
      // Update global header or notifications triggers if needed
      const currentNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
      currentNotifications.unshift({
        id: `notif-avatar-${Date.now()}`,
        title: 'Avatar Photo Saved',
        body: 'Your custom profile photo has been uploaded and synchronized.',
        date: 'Just now',
        unread: true
      });
      localStorage.setItem('userNotifications', JSON.stringify(currentNotifications));
    };
    reader.readAsDataURL(file);
  };

  const handleSelectBadge = (badgeKey) => {
    setAvatarBadge(badgeKey);
    setAvatarType('badge');
    localStorage.setItem('userAvatarBadge', badgeKey);
    localStorage.setItem('userAvatarType', 'badge');
    setShowAvatarModal(false);
  };

  const getBadgeEmoji = (badge) => {
    switch(badge) {
      case 'initials': return getInitials(name);
      case 'eco': return '🍃';
      case 'defender': return '🛡️';
      case 'urban': return '🏙️';
      case 'hero': return '🦸‍♂️';
      case 'elite': return '🌟';
      case 'power': return '⚡';
      default: return getInitials(name);
    }
  };

  const getBadgeGradient = (badge) => {
    switch(badge) {
      case 'initials': return 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
      case 'eco': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'defender': return 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)';
      case 'urban': return 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)';
      case 'hero': return 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)';
      case 'elite': return 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)';
      case 'power': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      default: return 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
    }
  };

  const getBadgeName = (badge) => {
    switch(badge) {
      case 'initials': return 'Letter Initials';
      case 'eco': return 'Eco Warrior';
      case 'defender': return 'Civic Defender';
      case 'urban': return 'Urban Champion';
      case 'hero': return 'Swachh Hero';
      case 'elite': return 'Elite Resident';
      case 'power': return 'Power Warden';
      default: return 'Letter Initials';
    }
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
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      marginBottom: '30px',
      borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
      paddingBottom: '24px',
    },
    avatarContainer: {
      width: '85px',
      height: '85px',
      borderRadius: '50%',
      position: 'relative',
      cursor: 'pointer',
      padding: '4px',
      background: 'linear-gradient(220deg, #6366f1 0%, #06b6d4 50%, #10b981 100%)',
      boxShadow: '0 10px 28px rgba(99, 102, 241, 0.25)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    avatarWrapper: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      backgroundColor: '#ffffff',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarContent: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontWeight: 'bold',
    },
    avatarEditOverlay: {
      position: 'absolute',
      bottom: '0',
      right: '0',
      width: '28px',
      height: '28px',
      backgroundColor: '#6366f1',
      border: '2px solid #ffffff',
      borderRadius: '50%',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '13px',
      boxShadow: '0 4px 10px rgba(99, 102, 241, 0.35)',
      transition: 'all 0.2s',
    },
    title: {
      margin: '0',
      fontSize: '26px',
      fontWeight: '800',
      letterSpacing: '-0.5px',
      background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      margin: '4px 0 0 0',
      fontSize: '13px',
      color: '#64748b',
    },
    badge: {
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '8px',
      fontSize: '11px',
      fontWeight: '700',
      marginTop: '8px',
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      color: '#10b981',
      border: '1px solid rgba(16, 185, 129, 0.15)',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '800',
      color: '#0f172a',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.55)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(15, 23, 42, 0.08)',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
      height: '100%',
    },
    input: {
      width: '100%',
      border: '1px solid rgba(15, 23, 42, 0.12)',
      borderRadius: '12px',
      padding: '11px 16px',
      fontSize: '13px',
      backgroundColor: 'rgba(255, 255, 255, 0.65)',
      color: '#0f172a',
      outline: 'none',
      transition: 'all 0.2s',
      marginTop: '6px',
      marginBottom: '14px',
    },
    label: {
      fontWeight: '700',
      fontSize: '12px',
      color: '#475569',
    },
    saveBtn: {
      backgroundColor: '#6366f1',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
      transition: 'all 0.2s',
      width: '100%',
      marginTop: '10px'
    },
    logoutBtn: {
      backgroundColor: 'rgba(239, 68, 68, 0.06)',
      color: '#ef4444',
      border: '1px solid rgba(239, 68, 68, 0.15)',
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.2s',
      width: '100%',
    },
    toggleRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: '1px solid rgba(15, 23, 42, 0.04)',
    },
    toggleLabel: {
      fontSize: '13px',
      color: '#334155',
      fontWeight: '500',
    },
    statNum: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#4f46e5',
      letterSpacing: '-0.5px'
    },
    statDesc: {
      fontSize: '11px',
      color: '#64748b',
      marginTop: '2px',
      fontWeight: '600'
    },
    passCard: {
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
      border: '1px solid rgba(99, 102, 241, 0.15)',
      borderRadius: '16px',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(99, 102, 241, 0.03)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        
        {/* INTERACTIVE PROFILE HEADER */}
        <div style={styles.header}>
          <div 
            style={styles.avatarContainer} 
            className="avatar-ring-container"
            onClick={() => setShowAvatarModal(true)}
            title="Customize Avatar"
          >
            <div style={styles.avatarWrapper}>
              {avatarType === 'upload' && avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Profile Avatar" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ ...styles.avatarContent, background: getBadgeGradient(avatarBadge) }}>
                  <span style={{ fontSize: '32px' }}>{getBadgeEmoji(avatarBadge)}</span>
                </div>
              )}
            </div>
            <div style={styles.avatarEditOverlay} className="edit-overlay">
              <i className="bi bi-pencil-fill" style={{ fontSize: '11px' }}></i>
            </div>
          </div>
          <div>
            <h3 style={styles.title}>{name || 'Citizen'}</h3>
            <p style={styles.subtitle}>{currentUser ? currentUser.email : 'user@gmail.com'}</p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={styles.badge}>
                <i className="bi bi-shield-check-fill"></i> Active GMC Citizen
              </span>
              <span style={{ ...styles.badge, backgroundColor: 'rgba(99, 102, 241, 0.08)', color: '#6366f1', borderColor: 'rgba(99, 102, 241, 0.15)' }}>
                🏆 {getBadgeName(avatarBadge)}
              </span>
            </div>
          </div>
        </div>

        {/* ROW 1: STATS & GMC PASS */}
        <div className="row g-4 mb-4">
          <div className="col-lg-6">
            <div style={styles.card}>
              <h4 style={styles.sectionTitle}>
                <i className="bi bi-award" style={{ color: '#6366f1' }}></i> Swachh Rank & Statistics
              </h4>
              
              <div className="row text-center g-2 mb-3">
                <div className="col-4">
                  <div style={{ padding: '12px 6px', background: 'rgba(15, 23, 42, 0.02)', borderRadius: '10px' }}>
                    <div style={styles.statNum}>{stats.filed}</div>
                    <div style={styles.statDesc}>Filed</div>
                  </div>
                </div>
                <div className="col-4">
                  <div style={{ padding: '12px 6px', background: 'rgba(15, 23, 42, 0.02)', borderRadius: '10px' }}>
                    <div style={{ ...styles.statNum, color: '#10b981' }}>{stats.resolved}</div>
                    <div style={styles.statDesc}>Resolved</div>
                  </div>
                </div>
                <div className="col-4">
                  <div style={{ padding: '12px 6px', background: 'rgba(15, 23, 42, 0.02)', borderRadius: '10px' }}>
                    <div style={{ ...styles.statNum, color: '#06b6d4' }}>{stats.feedbacks}</div>
                    <div style={styles.statDesc}>Reviewed</div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(15,23,42,0.06)', paddingTop: '14px' }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Swachh Points Balance</span>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#4f46e5' }}>{stats.points} Pts</span>
                </div>
                <div className="progress" style={{ height: '8px', borderRadius: '4px', backgroundColor: 'rgba(15, 23, 42, 0.05)' }}>
                  <div 
                    className="progress-bar progress-bar-striped progress-bar-animated" 
                    role="progressbar" 
                    style={{ width: `${Math.min((stats.points / 500) * 100, 100)}%`, backgroundColor: '#6366f1' }}
                  ></div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Badge Level: <strong>{stats.rank}</strong></span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Next Rank at 300 pts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div style={styles.passCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h5 style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: '#4f46e5', letterSpacing: '1px' }}>CITIZEN SMART CARD</h5>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>Gandhinagar Municipal Corporation</span>
                </div>
                <span style={{ fontSize: '16px' }}>🇮🇳</span>
              </div>

              <div style={{ margin: '10px 0' }}>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{name || 'Citizen'}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>ID: GMC-{currentUser ? currentUser.email.split('@')[0].toUpperCase() : 'USER'}</div>
              </div>

              <div className="d-flex justify-content-between align-items-end" style={{ marginTop: '10px' }}>
                <div>
                  <div style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase' }}>Ward Location</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>{ward || 'Sector 5'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '14px', letterSpacing: '2px', color: '#475569', opacity: 0.8 }}>||||| | ||||| ||</div>
                  <div style={{ fontSize: '9px', color: '#94a3b8' }}>Verified Citizen Pass</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: EDIT PROFILE & PREFERENCES */}
        <div className="row g-4">
          <div className="col-lg-7">
            <form style={styles.card} onSubmit={handleSaveProfile}>
              <h4 style={styles.sectionTitle}>
                <i className="bi bi-person-gear" style={{ color: '#6366f1' }}></i> Edit Profile Details
              </h4>
              
              <div className="row">
                <div className="col-md-6">
                  <label style={styles.label}>Full Name</label>
                  <input 
                    type="text" 
                    style={styles.input} 
                    className="input-focus"
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label style={styles.label}>Mobile Number</label>
                  <input 
                    type="text" 
                    style={styles.input} 
                    className="input-focus"
                    placeholder="Enter 10-digit mobile"
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label style={styles.label}>Residential Ward</label>
                  <select 
                    style={styles.input} 
                    className="input-focus"
                    value={ward} 
                    onChange={(e) => setWard(e.target.value)}
                  >
                    <option value="Sector 1">Sector 1</option>
                    <option value="Sector 2">Sector 2</option>
                    <option value="Sector 3">Sector 3</option>
                    <option value="Sector 4">Sector 4</option>
                    <option value="Sector 5">Sector 5</option>
                    <option value="Sector 9">Sector 9</option>
                    <option value="Market Area">Market Area</option>
                    <option value="Gandhinagar Center">Gandhinagar Center</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label style={styles.label}>Preferred Language</label>
                  <select 
                    style={styles.input} 
                    className="input-focus"
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi (हिन्दी)</option>
                    <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                  </select>
                </div>
              </div>

              <button type="submit" style={styles.saveBtn} className="btn-save-hover">
                <i className="bi bi-cloud-arrow-up-fill"></i> Save Profile Details
              </button>
            </form>
          </div>

          <div className="col-lg-5">
            <div style={{ ...styles.card, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={styles.sectionTitle}>
                  <i className="bi bi-sliders" style={{ color: '#6366f1' }}></i> Alert Preferences
                </h4>

                <div style={styles.toggleRow}>
                  <span style={styles.toggleLabel}>Receive Email Resolutions</span>
                  <div className="form-check form-switch" style={{ margin: 0 }}>
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      style={{ cursor: 'pointer' }}
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                    />
                  </div>
                </div>

                <div style={styles.toggleRow}>
                  <span style={styles.toggleLabel}>Emergency SMS SOS Alerts</span>
                  <div className="form-check form-switch" style={{ margin: 0 }}>
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      style={{ cursor: 'pointer' }}
                      checked={smsAlerts}
                      onChange={(e) => setSmsAlerts(e.target.checked)}
                    />
                  </div>
                </div>

                <div style={styles.toggleRow}>
                  <span style={styles.toggleLabel}>Auto-Share GPS Coordinates</span>
                  <div className="form-check form-switch" style={{ margin: 0 }}>
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      style={{ cursor: 'pointer' }}
                      checked={gpsShare}
                      onChange={(e) => setGpsShare(e.target.checked)}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <button style={styles.logoutBtn} onClick={handleLogout} className="btn-logout">
                  <i className="bi bi-box-arrow-right"></i> Logout Citizen Session
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <UserBottomNav />

      {/* AVATAR SELECTION MODAL */}
      {showAvatarModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            borderRadius: '24px',
            padding: '24px',
            maxWidth: '520px',
            width: '90%',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px rgba(15, 23, 42, 0.15)',
          }}>

            {/* Header */}
            <div style={{ flexShrink: 0, marginBottom: '16px' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 style={{ fontWeight: '800', color: '#0f172a', margin: 0, fontSize: '17px' }}>
                  🎨 Customize Citizen Avatar
                </h5>
                <button 
                  onClick={() => setShowAvatarModal(false)}
                  style={{ background: 'none', border: 'none', fontSize: '20px', color: '#64748b', cursor: 'pointer', lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Choose a default high-fidelity character badge or upload your own custom photo.
              </p>
            </div>

            {/* Scrollable Body */}
            <div style={{
              flex: '1 1 auto',
              overflowY: 'auto',
              paddingRight: '4px',
              marginBottom: '16px'
            }} className="modal-scrollbar-style">
              
              {/* UPLOAD SECTION */}
              <div style={{
                border: '2px dashed rgba(99, 102, 241, 0.25)',
                borderRadius: '14px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: 'rgba(99, 102, 241, 0.03)',
                marginBottom: '20px'
              }} className="avatar-upload-box">
                <i className="bi bi-cloud-arrow-up" style={{ fontSize: '28px', color: '#6366f1', display: 'block', marginBottom: '6px' }}></i>
                <label 
                  style={{
                    backgroundColor: '#6366f1',
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'inline-block',
                    boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
                  }}
                  className="btn-save-hover"
                >
                  Upload Custom Photo
                  <input 
                    type="file" 
                    hidden 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
                <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', marginTop: '6px' }}>
                  PNG, JPG up to 2MB
                </span>
              </div>

              {/* BADGES SELECTION GRID */}
              <h6 style={{ fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                Or Select Municipal Character Badge
              </h6>
              
              <div className="row g-2 mb-2">
                {[
                  { key: 'initials', emoji: getInitials(name), name: 'Letter Initials' },
                  { key: 'eco', emoji: '🍃', name: 'Eco Warrior' },
                  { key: 'defender', emoji: '🛡️', name: 'Civic Defender' },
                  { key: 'urban', emoji: '🏙️', name: 'Urban Champion' },
                  { key: 'hero', emoji: '🦸‍♂️', name: 'Swachh Hero' },
                  { key: 'elite', emoji: '🌟', name: 'Elite Resident' },
                  { key: 'power', emoji: '⚡', name: 'Power Warden' }
                ].map(badge => (
                  <div key={badge.key} className="col-4">
                    <div 
                      style={{
                        borderRadius: '14px',
                        padding: '12px 6px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        border: avatarBadge === badge.key && avatarType === 'badge' ? '2px solid #6366f1' : '1px solid rgba(15, 23, 42, 0.06)',
                        background: avatarBadge === badge.key && avatarType === 'badge' ? 'rgba(99, 102, 241, 0.05)' : '#ffffff',
                        transition: 'all 0.2s',
                      }}
                      className="badge-select-card"
                      onClick={() => handleSelectBadge(badge.key)}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        margin: '0 auto 6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: getBadgeGradient(badge.key),
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)'
                      }}>
                        <span style={{ fontSize: '20px' }}>{badge.emoji}</span>
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {badge.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{ 
              flexShrink: 0, 
              borderTop: '1px solid rgba(15, 23, 42, 0.06)', 
              paddingTop: '16px', 
              textAlign: 'right' 
            }}>
              <button 
                style={{
                  background: 'rgba(15, 23, 42, 0.05)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: '#475569',
                }}
                onClick={() => setShowAvatarModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
            <h5 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '12px', fontSize: '16px' }}>Action Successful</h5>
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
              Okay
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .modal-scrollbar-style::-webkit-scrollbar {
          width: 6px;
        }
        .modal-scrollbar-style::-webkit-scrollbar-track {
          background: transparent;
        }
        .modal-scrollbar-style::-webkit-scrollbar-thumb {
          background: rgba(15, 23, 42, 0.12);
          border-radius: 3px;
        }
        .modal-scrollbar-style::-webkit-scrollbar-thumb:hover {
          background: rgba(15, 23, 42, 0.24);
        }
        .avatar-ring-container:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 32px rgba(99, 102, 241, 0.4) !important;
        }
        .avatar-ring-container:hover .edit-overlay {
          background-color: #4f46e5 !important;
          transform: scale(1.1);
        }
        .badge-select-card:hover {
          transform: translateY(-2px);
          border-color: rgba(99, 102, 241, 0.3) !important;
          background-color: rgba(99, 102, 241, 0.02) !important;
        }
        .input-focus:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important;
          background-color: rgba(255, 255, 255, 0.85) !important;
        }
        .btn-save-hover:hover {
          background-color: #4f46e5 !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3) !important;
        }
        .btn-logout:hover {
          background-color: rgba(239, 68, 68, 0.22) !important;
          transform: translateY(-1px);
        }
        .form-switch .form-check-input:checked {
          background-color: #6366f1 !important;
          border-color: #6366f1 !important;
        }
      `}</style>
    </div>
  );
};

export default Profile;
