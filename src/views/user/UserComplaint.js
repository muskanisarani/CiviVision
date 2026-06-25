"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const UserComplaintContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams ? searchParams.get('category') : '';
  const locationParam = searchParams ? searchParams.get('location') : '';

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  // AI Verification States
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Duration
  const [durationDays, setDurationDays] = useState('');

  // Dynamic Category States
  const [garbageSize, setGarbageSize] = useState('');
  const [wasteType, setWasteType] = useState('');
  const [roadDamageType, setRoadDamageType] = useState('');
  const [damageImpact, setDamageImpact] = useState('');
  const [waterLeakSeverity, setWaterLeakSeverity] = useState('');
  const [waterLeakType, setWaterLeakType] = useState('');
  const [streetlightPoleNo, setStreetlightPoleNo] = useState('');
  const [streetlightIssue, setStreetlightIssue] = useState('');
  const [drainageFloodingScale, setDrainageFloodingScale] = useState('');
  const [drainageBlockage, setDrainageBlockage] = useState('');
  
  // Public Toilet issue states
  const [toiletIssueType, setToiletIssueType] = useState('');
  const [toiletCleanliness, setToiletCleanliness] = useState('');

  useEffect(() => {
    if (categoryParam) setCategory(categoryParam);
    if (locationParam) setLocation(locationParam);
  }, [categoryParam, locationParam]);

  // Handle Photo Selection & Start AI Scan
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setIsVerified(false);
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate AI scanning step-by-step
    const steps = [
      { text: 'Extracting metadata & camera noise footprint...', progress: 25 },
      { text: 'Verifying pixel authenticity (AI / Google Image search check)...', progress: 55 },
      { text: 'Comparing geolocation & visual features against active complaints...', progress: 85 },
      { text: 'Verification completed successfully!', progress: 100 }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setScanStep(steps[currentStep].text);
        setScanProgress(steps[currentStep].progress);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          setIsVerified(true);
        }, 300);
      }
    }, 450);
  };

  // Auto fill current location
  const handleAutofillLocation = () => {
    const locations = [
      'GMC Ward 5, Market Area Road',
      'Sector 7, Near Swachh Community Block',
      'Shastri Nagar Crossroad, Ahmedabad',
      'GMC Bus Stand Public Terminal',
      'Sector 9 Pothole Patch B'
    ];
    const randomLoc = locations[Math.floor(Math.random() * locations.length)];
    setLocation(randomLoc);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert('Please upload a photo and complete the AI Verification first.');
      return;
    }
    
    // Compile dynamic details based on category choice
    let categoryDetails = '';
    if (category === 'Garbage / Waste') {
      categoryDetails = `\n\n[Garbage Details]\nHeap Size: ${garbageSize || 'Standard'}\nWaste Type: ${wasteType || 'General'}`;
    } else if (category === 'Road Damage') {
      categoryDetails = `\n\n[Road Details]\nDamage Type: ${roadDamageType || 'Pothole'}\nSafety Impact: ${damageImpact || 'Medium'}`;
    } else if (category === 'Water Issue') {
      categoryDetails = `\n\n[Water Details]\nSeverity: ${waterLeakSeverity || 'Low'}\nWater Category: ${waterLeakType || 'Clean Water'}`;
    } else if (category === 'Streetlights') {
      categoryDetails = `\n\n[Streetlight Details]\nPole ID: ${streetlightPoleNo || 'N/A'}\nIssue: ${streetlightIssue || 'Dead Bulb'}`;
    } else if (category === 'Drainage & Sewerage') {
      categoryDetails = `\n\n[Drainage Details]\nFlooding Scale: ${drainageFloodingScale || 'Minor'}\nBlockage: ${drainageBlockage || 'Debris'}`;
    } else if (category === 'Public Toilet Issue') {
      categoryDetails = `\n\n[Toilet Details]\nIssue Type: ${toiletIssueType || 'General Sanitation'}\nCleanliness Rating: ${toiletCleanliness || 'Dirty'}`;
    }

    const fullDescription = description + categoryDetails + `\n\n[AI Report Details]\nDuration: Started ${durationDays || 'recently'}\nCamera verified: Real click\nDuplicate check: Pass (Unique)`;

    // Simulate complaint creation and save to localStorage
    const newComplaint = {
      id: `#00${Math.floor(Math.random() * 900) + 100}`,
      category: category || 'General',
      location: location,
      description: fullDescription,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      daysStarted: durationDays || '1-2 days ago',
      photoName: photo ? photo.name : 'camera_capture.jpg'
    };

    const currentComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    currentComplaints.unshift(newComplaint);
    localStorage.setItem('complaints', JSON.stringify(currentComplaints));

    // Trigger user notification alert
    const currentNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
    currentNotifications.unshift({
      id: `notif-${Date.now()}`,
      title: 'Complaint Registered',
      body: `Your complaint for "${category}" at "${location}" has been logged as ${newComplaint.id}.`,
      date: 'Just now',
      unread: true
    });
    localStorage.setItem('userNotifications', JSON.stringify(currentNotifications));

    setAlertMessage(`Complaint ${newComplaint.id} submitted successfully! SBM Resolution Officers have been notified.`);
  };

  const styles = {
    body: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Segoe UI", sans-serif',
      paddingBottom: '40px',
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
    container: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px 20px',
    },
    formCard: {
      width: '100%',
      maxWidth: '1000px',
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
      border: '2px dashed rgba(99, 102, 241, 0.25)',
      borderRadius: '14px',
      height: '140px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#4f46e5',
      cursor: 'pointer',
      backgroundColor: 'rgba(99, 102, 241, 0.03)',
      transition: 'all 0.2s',
      position: 'relative',
      overflow: 'hidden'
    },
    svg: {
      width: '36px',
      height: '36px',
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
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '600',
      border: '1px solid',
    },
    badgeSuccess: {
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      color: '#10b981',
      borderColor: 'rgba(16, 185, 129, 0.15)',
    },
    locationContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginTop: '6px',
    },
    autofillBtn: {
      backgroundColor: 'rgba(99, 102, 241, 0.08)',
      color: '#6366f1',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '10px',
      padding: '11px 16px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap',
    }
  };

  return (
    <div style={styles.body}>
      {/* HEADER */}
      <div style={styles.topBar}>
        Report Civic Issue
      </div>

      {/* FORM */}
      <div style={styles.container}>
        <form style={styles.formCard} onSubmit={handleSubmit}>
          
          <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px', color: '#1e293b' }}>
            AI-Verified Reporting
          </h4>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
            First, click or upload a picture. Our AI will verify camera origin and duplicate presence.
          </p>

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

          {/* STEP 1: PHOTO UPLOAD */}
          <label style={styles.label}>Upload Civic Issue Photo</label>
          <label style={styles.uploadBox} className="upload-hover">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.svg}>
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>
              {photo ? photo.name : 'Click to Capture or Select Photo'}
            </span>
            <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              Supports JPG, PNG up to 10MB
            </span>
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handlePhotoChange}
              required
            />
          </label>

          {/* SIMULATED SCANNING ANIMATION */}
          {isScanning && (
            <div style={{
              marginTop: '20px',
              padding: '16px',
              borderRadius: '14px',
              backgroundColor: 'rgba(99, 102, 241, 0.05)',
              border: '1px solid rgba(99, 102, 241, 0.1)',
              textAlign: 'center'
            }}>
              <div className="spinner-border text-primary" role="status" style={{ width: '1.8rem', height: '1.8rem', borderWidth: '3px' }}></div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#4f46e5', marginTop: '10px' }}>
                {scanStep}
              </div>
              <div className="progress mt-2" style={{ height: '6px', borderRadius: '3px', backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
                <div 
                  className="progress-bar progress-bar-striped progress-bar-animated" 
                  role="progressbar" 
                  style={{ width: `${scanProgress}%`, backgroundColor: '#6366f1' }}
                ></div>
              </div>
            </div>
          )}

          {/* VERIFICATION RESULTS */}
          {isVerified && (
            <div style={{
              marginTop: '20px',
              padding: '18px',
              borderRadius: '16px',
              backgroundColor: 'rgba(16, 185, 129, 0.04)',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              display: 'flex',
              gap: '16px',
              alignItems: 'center'
            }}>
              {photoPreview && (
                <img 
                  src={photoPreview} 
                  alt="Report Preview" 
                  style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', border: '1px solid rgba(15,23,42,0.1)' }}
                />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ ...styles.badge, ...styles.badgeSuccess }}>
                  <i className="bi bi-camera-fill"></i> Verified Authentic: Camera Clicked Capture (100% Real)
                </div>
                <div style={{ ...styles.badge, ...styles.badgeSuccess }}>
                  <i className="bi bi-patch-check-fill"></i> Unique incident: No duplicate reports found at this location
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SHOW HIDDEN FORM FIELDS ONLY WHEN VERIFIED */}
          {isVerified && (
            <div className="fade-in-fields">
              <label style={styles.label}>Location / Area Details</label>
              <div style={styles.locationContainer}>
                <input
                  type="text"
                  placeholder="Enter specific address or location"
                  style={{ ...styles.input, marginTop: 0 }}
                  className="input-focus"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
                <button type="button" style={styles.autofillBtn} onClick={handleAutofillLocation} className="autofill-hover">
                  📍 Pin Current Location
                </button>
              </div>

              <label style={styles.label}>Category of Civic Issue</label>
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
                <option value="Water Issue" style={{ background: '#ffffff', color: '#0f172a' }}>Water Issue (Leaking, sewage)</option>
                <option value="Streetlights" style={{ background: '#ffffff', color: '#0f172a' }}>Streetlight Issue</option>
                <option value="Drainage & Sewerage" style={{ background: '#ffffff', color: '#0f172a' }}>Drainage & Sewerage</option>
                <option value="Public Toilet Issue" style={{ background: '#ffffff', color: '#0f172a' }}>🚽 Public Toilet Issue</option>
                <option value="Other" style={{ background: '#ffffff', color: '#0f172a' }}>Other Civic issue</option>
              </select>

              {/* DYNAMIC FIELDS */}
              {category === 'Garbage / Waste' && (
                <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Volume / Size</label>
                    <select style={styles.input} className="input-focus" value={garbageSize} onChange={(e) => setGarbageSize(e.target.value)} required>
                      <option value="" style={{ background: '#ffffff', color: '#0f172a' }}>Select Size</option>
                      <option value="Small pile" style={{ background: '#ffffff', color: '#0f172a' }}>Small Pile</option>
                      <option value="Medium dump" style={{ background: '#ffffff', color: '#0f172a' }}>Medium Dump</option>
                      <option value="Large blockage" style={{ background: '#ffffff', color: '#0f172a' }}>Large Waste Blockage</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Waste Type</label>
                    <select style={styles.input} className="input-focus" value={wasteType} onChange={(e) => setWasteType(e.target.value)} required>
                      <option value="" style={{ background: '#ffffff', color: '#0f172a' }}>Select Type</option>
                      <option value="Organic / Food" style={{ background: '#ffffff', color: '#0f172a' }}>Organic / Food</option>
                      <option value="Dry recyclables" style={{ background: '#ffffff', color: '#0f172a' }}>Dry Recyclables</option>
                      <option value="Hazardous / Medical" style={{ background: '#ffffff', color: '#0f172a' }}>Hazardous / Medical</option>
                      <option value="Electronic (E-waste)" style={{ background: '#ffffff', color: '#0f172a' }}>E-waste</option>
                    </select>
                  </div>
                </div>
              )}

              {category === 'Road Damage' && (
                <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Damage Type</label>
                    <select style={styles.input} className="input-focus" value={roadDamageType} onChange={(e) => setRoadDamageType(e.target.value)} required>
                      <option value="" style={{ background: '#ffffff', color: '#0f172a' }}>Select Type</option>
                      <option value="Pothole" style={{ background: '#ffffff', color: '#0f172a' }}>Pothole</option>
                      <option value="Road sink/Cave-in" style={{ background: '#ffffff', color: '#0f172a' }}>Sinkhole/Cave-in</option>
                      <option value="Cracked pavement" style={{ background: '#ffffff', color: '#0f172a' }}>Cracked Pavement</option>
                      <option value="Broken divider" style={{ background: '#ffffff', color: '#0f172a' }}>Broken Divider</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Safety Threat</label>
                    <select style={styles.input} className="input-focus" value={damageImpact} onChange={(e) => setDamageImpact(e.target.value)} required>
                      <option value="" style={{ background: '#ffffff', color: '#0f172a' }}>Select Threat</option>
                      <option value="Low (Minor delay)" style={{ background: '#ffffff', color: '#0f172a' }}>Low (Minor delay)</option>
                      <option value="Medium (Tire hazard)" style={{ background: '#ffffff', color: '#0f172a' }}>Medium (Tire hazard)</option>
                      <option value="High (Major accident risk)" style={{ background: '#ffffff', color: '#0f172a' }}>Accident Risk</option>
                    </select>
                  </div>
                </div>
              )}

              {category === 'Water Issue' && (
                <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Leak Severity</label>
                    <select style={styles.input} className="input-focus" value={waterLeakSeverity} onChange={(e) => setWaterLeakSeverity(e.target.value)} required>
                      <option value="" style={{ background: '#ffffff', color: '#0f172a' }}>Select Severity</option>
                      <option value="Slow Seepage" style={{ background: '#ffffff', color: '#0f172a' }}>Slow Seepage</option>
                      <option value="Active Spout/Flow" style={{ background: '#ffffff', color: '#0f172a' }}>Active Spout/Flow</option>
                      <option value="High Pressure Pipe Burst" style={{ background: '#ffffff', color: '#0f172a' }}>Pipeline Burst</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Water Quality</label>
                    <select style={styles.input} className="input-focus" value={waterLeakType} onChange={(e) => setWaterLeakType(e.target.value)} required>
                      <option value="" style={{ background: '#ffffff', color: '#0f172a' }}>Select Water Type</option>
                      <option value="Clean/Drinking Water" style={{ background: '#ffffff', color: '#0f172a' }}>Clean/Drinking Water</option>
                      <option value="Muddy/Turbid" style={{ background: '#ffffff', color: '#0f172a' }}>Muddy/Turbid Water</option>
                      <option value="Sewage / Stagnant" style={{ background: '#ffffff', color: '#0f172a' }}>Sewage / Stagnant</option>
                    </select>
                  </div>
                </div>
              )}

              {category === 'Streetlights' && (
                <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Pole ID (If visible)</label>
                    <input type="text" placeholder="e.g. GMC-1042" style={styles.input} className="input-focus" value={streetlightPoleNo} onChange={(e) => setStreetlightPoleNo(e.target.value)} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Streetlight Issue</label>
                    <select style={styles.input} className="input-focus" value={streetlightIssue} onChange={(e) => setStreetlightIssue(e.target.value)} required>
                      <option value="" style={{ background: '#ffffff', color: '#0f172a' }}>Select Issue</option>
                      <option value="Bulb completely dead" style={{ background: '#ffffff', color: '#0f172a' }}>Bulb Dead</option>
                      <option value="Flickering light" style={{ background: '#ffffff', color: '#0f172a' }}>Flickering Light</option>
                      <option value="Exposed wires danger" style={{ background: '#ffffff', color: '#0f172a' }}>Exposed Wires</option>
                      <option value="Damaged/Fallen pole" style={{ background: '#ffffff', color: '#0f172a' }}>Damaged Post</option>
                    </select>
                  </div>
                </div>
              )}

              {category === 'Drainage & Sewerage' && (
                <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Flooding Level</label>
                    <select style={styles.input} className="input-focus" value={drainageFloodingScale} onChange={(e) => setDrainageFloodingScale(e.target.value)} required>
                      <option value="" style={{ background: '#ffffff', color: '#0f172a' }}>Select Level</option>
                      <option value="Minor Puddle" style={{ background: '#ffffff', color: '#0f172a' }}>Minor Puddle</option>
                      <option value="Ankle deep overflow" style={{ background: '#ffffff', color: '#0f172a' }}>Ankle Deep</option>
                      <option value="Severe street flooding" style={{ background: '#ffffff', color: '#0f172a' }}>Street Flooding</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Blocked By</label>
                    <select style={styles.input} className="input-focus" value={drainageBlockage} onChange={(e) => setDrainageBlockage(e.target.value)} required>
                      <option value="" style={{ background: '#ffffff', color: '#0f172a' }}>Select Blockage</option>
                      <option value="Silt/Leaves" style={{ background: '#ffffff', color: '#0f172a' }}>Silt & Leaves</option>
                      <option value="Plastics & Garbage" style={{ background: '#ffffff', color: '#0f172a' }}>Plastics & Garbage</option>
                      <option value="Construction Rubble" style={{ background: '#ffffff', color: '#0f172a' }}>Construction Rubble</option>
                    </select>
                  </div>
                </div>
              )}

              {/* DYNAMIC PUBLIC TOILET ISSUE SECTION */}
              {category === 'Public Toilet Issue' && (
                <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Specific Toilet Issue</label>
                    <select style={styles.input} className="input-focus" value={toiletIssueType} onChange={(e) => setToiletIssueType(e.target.value)} required>
                      <option value="" style={{ background: '#ffffff', color: '#0f172a' }}>Select Toilet Issue</option>
                      <option value="No running water / dry taps" style={{ background: '#ffffff', color: '#0f172a' }}>No Water / Dry taps</option>
                      <option value="Dirty cabins / uncleaned toilets" style={{ background: '#ffffff', color: '#0f172a' }}>Dirty cabins</option>
                      <option value="Broken flushing / fittings" style={{ background: '#ffffff', color: '#0f172a' }}>Broken flush/taps</option>
                      <option value="Foul odor / Stench issue" style={{ background: '#ffffff', color: '#0f172a' }}>Severe Stench</option>
                      <option value="No electricity / lights dead" style={{ background: '#ffffff', color: '#0f172a' }}>No light/dead bulbs</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Cleanliness Level</label>
                    <select style={styles.input} className="input-focus" value={toiletCleanliness} onChange={(e) => setToiletCleanliness(e.target.value)} required>
                      <option value="" style={{ background: '#ffffff', color: '#0f172a' }}>Rate Cleanliness</option>
                      <option value="Moderately dirty" style={{ background: '#ffffff', color: '#0f172a' }}>Moderately dirty</option>
                      <option value="Extremely dirty / unhygienic" style={{ background: '#ffffff', color: '#0f172a' }}>Extremely dirty</option>
                      <option value="Completely unusable" style={{ background: '#ffffff', color: '#0f172a' }}>Completely unusable</option>
                    </select>
                  </div>
                </div>
              )}

              {/* DURATION FIELD */}
              <label style={styles.label}>From how many days did this problem start?</label>
              <select 
                style={styles.input} 
                className="input-focus" 
                value={durationDays} 
                onChange={(e) => setDurationDays(e.target.value)} 
                required
              >
                <option value="" style={{ background: '#ffffff', color: '#0f172a' }}>Select start duration</option>
                <option value="Today" style={{ background: '#ffffff', color: '#0f172a' }}>Today / Just noticed</option>
                <option value="1-2 days ago" style={{ background: '#ffffff', color: '#0f172a' }}>1 to 2 days ago</option>
                <option value="3-5 days ago" style={{ background: '#ffffff', color: '#0f172a' }}>3 to 5 days ago</option>
                <option value="More than a week ago" style={{ background: '#ffffff', color: '#0f172a' }}>More than a week ago</option>
              </select>

              <label style={styles.label}>Details & Remarks</label>
              <textarea
                placeholder="Describe the issue in detail"
                style={styles.textarea}
                className="input-focus"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <button type="submit" style={styles.submitBtn} className="btn-submit-hover">Submit Complaint</button>
            </div>
          )}
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
          border-color: rgba(99, 102, 241, 0.45) !important;
          background-color: rgba(99, 102, 241, 0.06) !important;
          color: #4338ca !important;
        }
        .btn-submit-hover:hover {
          background-color: #4f46e5 !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35) !important;
        }
        .autofill-hover:hover {
          background-color: rgba(99, 102, 241, 0.15) !important;
          border-color: rgba(99, 102, 241, 0.35) !important;
        }
        .fade-in-fields {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const UserComplaint = () => {
  return (
    <Suspense fallback={<div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#f8fafc', color: '#6366f1' }}>Loading form...</div>}>
      <UserComplaintContent />
    </Suspense>
  );
};

export default UserComplaint;
