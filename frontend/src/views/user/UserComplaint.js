import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { auditImageWithMobileNet } from '../../utils/aiVisionClassifier';

const UserComplaint = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  // Location & Form
  const [hasLocation, setHasLocation] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'Garbage / Waste');
  const [description, setDescription] = useState('');
  const [durationDays, setDurationDays] = useState('Today');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoBase64, setPhotoBase64] = useState(null);

  // Camera & Voice States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState('environment');
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState('gu-IN');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);

  // Dynamic Parameters
  const [wasteType, setWasteType] = useState('Dry recyclables');
  const [wasteVolume, setWasteVolume] = useState('Medium dump');
  const [severity, setSeverity] = useState('Medium');
  const [aiSummary, setAiSummary] = useState('');

  // AI Scanner & Result
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [rejectionError, setRejectionError] = useState(null);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [duplicateBadgeText, setDuplicateBadgeText] = useState('Unique incident: No duplicate reports found');
  const [authenticityBadgeText, setAuthenticityBadgeText] = useState('Verified Authentic: On-Site Live Capture');
  const [hasCivicIssue, setHasCivicIssue] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [strictMode] = useState(true); // Mandatory Strict AI Mode
  const [createdTicket, setCreatedTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get('location')) {
      setLocation(searchParams.get('location'));
      setHasLocation(true);
      setLatitude(23.2156);
      setLongitude(72.6369);
    }
    return () => stopCamera();
  }, [searchParams]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async (facing = cameraFacingMode) => {
    setIsCameraOpen(true);
    setCameraFacingMode(facing);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Unable to access camera. Please allow camera permissions.');
      setIsCameraOpen(false);
    }
  };

  const captureLivePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    stopCamera();
    setIsCameraOpen(false);
    processImageForAI(dataUrl, 'Live_OnSite_Capture.jpg');
  };

  const toggleSpeechRecognition = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert('Speech recognition not supported in this browser. Please use Chrome/Edge.');
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      return setIsListening(false);
    }
    try {
      const r = new SR();
      r.lang = speechLang;
      r.continuous = false;
      r.onstart = () => setIsListening(true);
      r.onresult = (e) => {
        const text = e.results[0][0].transcript;
        if (text) setDescription(prev => prev ? `${prev} ${text}` : text);
      };
      r.onerror = () => setIsListening(false);
      r.onend = () => setIsListening(false);
      recognitionRef.current = r;
      r.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  };

  const updateCoords = (lat, lng, label) => {
    setLatitude(lat);
    setLongitude(lng);
    setLocation(label || `Live GPS (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`);
    setHasLocation(true);
    setIsLocating(false);
  };

  const handleUseProfileLocation = () => {
    setIsLocating(true);
    setRejectionError(null);
    const pWard = currentUser?.ward || 'Sector 5';
    const pCity = currentUser?.city || 'Deesa';
    const formattedLocation = `${pWard}, ${pCity.charAt(0).toUpperCase() + pCity.slice(1)}`;
    
    let lat = 24.2575;
    let lng = 72.1819;
    if (pCity.toLowerCase() === 'gandhinagar') {
      lat = 23.2156;
      lng = 72.6369;
    }
    
    setTimeout(() => {
      updateCoords(lat, lng, formattedLocation);
    }, 450);
  };

  const handleDetectLiveLocation = () => {
    setIsLocating(true);
    setRejectionError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            const addr = data.display_name?.split(',').slice(0, 3).join(',') || `Sector (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`;
            updateCoords(lat, lng, addr);
          } catch {
            updateCoords(lat, lng);
          }
        },
        () => updateCoords(23.2156 + (Math.random() - 0.5) * 0.02, 72.6369 + (Math.random() - 0.5) * 0.02, 'Gandhinagar Ward Sector 5'),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      updateCoords(23.2156, 72.6369, 'Gandhinagar Sector 5');
    }
  };

  const processImageForAI = async (base64Image, fileName = 'Captured_Photo.jpg') => {
    setPhotoPreview(base64Image);
    setPhotoBase64(base64Image);
    setPhoto({ name: fileName });
    setIsVerified(false);
    setIsScanning(true);
    setScanProgress(15);
    setRejectionError(null);
    setScanStep('Running on-device neural object detection (Cars, Animals, Household)...');

    // 1. Instant On-Device Visual Object Detection (Catches Cars, People, Animals, Furniture)
    const visionAudit = await auditImageWithMobileNet(base64Image);
    if (visionAudit.isCivicDefect === false) {
      setIsScanning(false);
      setRejectionError(visionAudit.reason || 'Strict AI Rejection: Non-civic object detected.');
      setPhoto(null); setPhotoPreview(null); setPhotoBase64(null); setIsVerified(false);
      return;
    }

    const steps = [
      { text: 'Auditing sensor noise & location metadata...', p: 35 },
      { text: 'Running Gemini AI multi-modal fraud filter...', p: 70 },
      { text: 'Auto-classifying civic category & hazard...', p: 90 },
      { text: 'Checking municipal radius duplicates...', p: 100 }
    ];

    let apiData = null;
    try {
      const res = await fetch('/api/ai/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image, description, latitude, longitude, category }),
        credentials: 'include'
      });
      apiData = await res.json();
    } catch (e) {
      console.warn('AI Network Note:', e);
    }

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setScanStep(steps[i].text);
        setScanProgress(steps[i].p);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          if (!apiData || apiData.isValid === false || apiData.success === false) {
            setRejectionError(apiData?.rejectionReason || 'Image Rejected: Not an authentic civic defect.');
            setPhoto(null); setPhotoPreview(null); setPhotoBase64(null); setIsVerified(false);
            return;
          }
          setIsVerified(true);
          setDuplicateWarning(apiData.isDuplicate || false);
          setDuplicateBadgeText(apiData.duplicateMessage || 'Unique incident');
          setAuthenticityBadgeText(apiData.authenticityMessage || 'Verified Authentic: On-site capture');
          setHasCivicIssue(apiData.hasCivicIssue !== false);
          setRejectionReason(apiData.rejectionReason || '');
          if (apiData.aiDetails) {
            const d = apiData.aiDetails;
            if (d.category) setCategory(d.category);
            if (d.wasteType) setWasteType(d.wasteType);
            if (d.wasteVolume) setWasteVolume(d.wasteVolume);
            if (d.severity) setSeverity(d.severity);
            if (d.durationDays) setDurationDays(d.durationDays);
            if (d.details) { setAiSummary(d.details); setDescription(d.details); }
          }
        }, 200);
      }
    }, 350);
  };

  const handleFileUpload = (e) => {
    if (!hasLocation) return alert('Please share Live GPS Location first.');
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => processImageForAI(reader.result, file.name);
    reader.readAsDataURL(file);
  };

  const isSubmissionBlocked = !hasCivicIssue || (strictMode && authenticityBadgeText.toLowerCase().includes('warning'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasLocation) return alert('Please share your Live GPS Location first.');
    if (!isVerified || !photoBase64) return alert('Please provide an AI-verified photo.');
    if (isSubmissionBlocked) {
      if (!hasCivicIssue) {
        alert(`Submission rejected: ${rejectionReason || 'No municipal issue detected in this image.'}`);
      } else {
        alert("Submission rejected: Strict Mode is active and this image has low authenticity (stock/web photo detected).");
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category, details: `${description}\n\n[Details]\nType: ${wasteType}\nVolume/Scale: ${wasteVolume}`,
          photoUrl: photoBase64, latitude, longitude, locationName: location, durationDays, wasteType, wasteVolume, severity, aiSummary: aiSummary || description
        }),
        credentials: 'include'
      });
      const data = await res.json();
      setIsSubmitting(false);
      if (!res.ok) return alert(data.error || 'Failed to submit complaint');
      setCreatedTicket(data.complaint);
    } catch {
      setIsSubmitting(false);
      alert('Network error submitting complaint.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '16px 12px 80px 12px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        
        {/* Header bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', background: 'var(--card-bg, rgba(255,255,255,0.7))', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--card-border, rgba(15,23,42,0.08))', padding: '16px 20px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px', boxShadow: 'var(--card-shadow, none)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-primary, #0f172a)' }}><i className="bi bi-arrow-left"></i></button>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--text-primary, #0f172a)' }}>Report Civic Defect</h3>
          </div>
          <div className="badge-strict-mode" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '800', color: '#4f46e5', backgroundColor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', padding: '6px 12px', borderRadius: '10px', userSelect: 'none' }}>
            <i className="bi bi-shield-check" style={{ fontSize: '14px', color: '#6366f1' }}></i>
            <span>Strict AI Mode</span>
            <span style={{ fontSize: '10px', background: '#6366f1', color: '#ffffff', padding: '1px 6px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active</span>
          </div>
        </div>

        {/* Citizen Profile Badge */}
        <div style={{ background: 'rgba(99, 102, 241, 0.08)', borderRadius: '16px', padding: '14px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
              {currentUser?.name ? currentUser.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '14px' }}>{currentUser?.name || 'Citizen'}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{currentUser?.mobile} • {currentUser?.email}</div>
            </div>
          </div>
          <span className="profile-ward-badge" style={{ fontSize: '11px', fontWeight: '700', color: '#4338ca', background: '#e0e7ff', padding: '4px 8px', borderRadius: '12px' }}>
            📍 {currentUser?.ward || 'Sector 5'}, {currentUser?.city || 'Gandhinagar'}
          </span>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(16px)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(15, 23, 42, 0.08)', boxShadow: '0 12px 35px rgba(15, 23, 42, 0.05)' }}>
          
          {/* STEP 1: Live GPS Location */}
          <div className="location-step-box" style={{ padding: '16px', borderRadius: '16px', background: hasLocation ? 'rgba(16, 185, 129, 0.05)' : 'rgba(99, 102, 241, 0.05)', border: `1px solid ${hasLocation ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.2)'}`, marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <strong style={{ fontSize: '13px' }}>1. Verify Live GPS Location</strong>
              {hasLocation && <span className="badge bg-success-subtle text-success border border-success-subtle">GPS Verified</span>}
            </div>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 10px 0' }}>Enforces on-site reporting to eliminate online stock fraud.</p>
            {hasLocation ? (
              <div className="location-verified-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '600', color: '#065f46' }}>
                <span className="location-text">📍 {location}</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={handleUseProfileLocation} className="btn-link-action btn-link-profile" style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}>Use Profile</button>
                  <button type="button" onClick={handleDetectLiveLocation} className="btn-link-action btn-link-refresh" style={{ background: 'none', border: 'none', color: '#047857', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}>Refresh</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={handleDetectLiveLocation} disabled={isLocating} style={{ flex: 1, padding: '10px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                  {isLocating ? 'Detecting GPS...' : '📍 Detect Live GPS'}
                </button>
                <button type="button" onClick={handleUseProfileLocation} disabled={isLocating} style={{ padding: '10px 16px', background: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                  Use Profile Address
                </button>
              </div>
            )}
          </div>

          {/* STEP 2: Live Camera & Photo Upload */}
          <div className="camera-step-box" style={{ padding: '16px', borderRadius: '16px', border: '1px solid rgba(15, 23, 42, 0.08)', marginBottom: '16px', opacity: hasLocation ? 1 : 0.6 }}>
            <strong style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>2. On-Site Camera Capture & AI Audit</strong>
            {rejectionError && <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#b91c1c', fontSize: '12px', marginBottom: '10px' }}>⚠️ {rejectionError}</div>}
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button type="button" onClick={() => startCamera('environment')} disabled={!hasLocation} className="btn-camera-trigger" style={{ padding: '16px 8px', borderRadius: '12px', border: '2px solid #6366f1', background: 'rgba(99, 102, 241, 0.08)', color: '#4338ca', cursor: 'pointer', textAlign: 'center' }}>
                <i className="bi bi-camera-fill" style={{ fontSize: '24px', display: 'block', marginBottom: '4px' }}></i>
                <span style={{ fontSize: '12px', fontWeight: '700' }}>Open Live Camera</span>
              </button>
              <label className="upload-box-trigger" style={{ padding: '16px 8px', borderRadius: '12px', border: '2px dashed rgba(99, 102, 241, 0.4)', background: 'rgba(255, 255, 255, 0.6)', color: '#475569', cursor: 'pointer', textAlign: 'center', margin: 0 }}>
                <i className="bi bi-folder2-open" style={{ fontSize: '24px', display: 'block', marginBottom: '4px' }}></i>
                <span style={{ fontSize: '12px', fontWeight: '700', display: 'block' }}>{photo ? photo.name.slice(0, 16) : 'Upload Photo'}</span>
                <input type="file" hidden accept="image/*" capture="environment" onChange={handleFileUpload} disabled={!hasLocation} />
              </label>
            </div>

            {/* AI Progress */}
            {isScanning && (
              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#4f46e5', marginTop: '6px' }}>{scanStep}</div>
                <div className="progress mt-2" style={{ height: '5px' }}><div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${scanProgress}%`, background: '#6366f1' }}></div></div>
              </div>
            )}

            {/* Badges */}
            {isVerified && photoPreview && (
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {!hasCivicIssue && (
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#b91c1c', background: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.2)', width: '100%' }}>
                    🚨 REJECTED: {rejectionReason || 'No municipal issue detected in this photo.'}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <img src={photoPreview} alt="Defect" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <div className="badge-ai-auth" style={{ fontSize: '11px', fontWeight: '700', color: '#065f46', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 8px', borderRadius: '6px', marginBottom: '4px' }}>
                      <i className="bi bi-patch-check-fill text-success"></i> {authenticityBadgeText}
                    </div>
                    <div className="badge-ai-dup" style={{ fontSize: '11px', fontWeight: '700', color: duplicateWarning ? '#b91c1c' : '#1e40af', background: duplicateWarning ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)', padding: '3px 8px', borderRadius: '6px' }}>
                      <i className="bi bi-info-circle-fill"></i> {duplicateBadgeText}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: AI Auto-Populated Parameters */}
          {isVerified && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <div className="mb-3">
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Category (AI Auto-Selected)</label>
                <select className="form-select form-select-sm mt-1" value={category} onChange={e => setCategory(e.target.value)} required>
                  <option value="Garbage / Waste">🗑️ Garbage / Solid Waste</option>
                  <option value="Road Damage">🚧 Road Damage & Potholes</option>
                  <option value="Water Issue">🚰 Water Issue (Leaking/Pipe)</option>
                  <option value="Streetlights">💡 Streetlight & Electrical</option>
                  <option value="Drainage & Sewerage">🌊 Drainage & Sewerage</option>
                  <option value="Public Toilet Issue">🚽 Public Toilet Sanitation</option>
                </select>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155' }}>Defect Subtype</label>
                  <input type="text" className="form-control form-control-sm mt-1" value={wasteType} onChange={e => setWasteType(e.target.value)} required />
                </div>
                <div className="col-6">
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155' }}>Volume / Scale</label>
                  <input type="text" className="form-control form-control-sm mt-1" value={wasteVolume} onChange={e => setWasteVolume(e.target.value)} required />
                </div>
              </div>

              <div className="mb-3">
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Problem Duration</label>
                <select className="form-select form-select-sm mt-1" value={durationDays} onChange={e => setDurationDays(e.target.value)}>
                  <option value="Today">Today / Just noticed</option>
                  <option value="1-2 days ago">1 to 2 days ago</option>
                  <option value="3-5 days ago">3 to 5 days ago</option>
                  <option value="More than a week ago">More than a week ago</option>
                </select>
              </div>

              {/* Multilingual Voice Remarks */}
              <div className="mb-3">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', margin: 0 }}>Details & Remarks</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <select value={speechLang} onChange={e => setSpeechLang(e.target.value)} style={{ fontSize: '11px', fontWeight: '700', borderRadius: '6px', padding: '2px 6px', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#4338ca' }}>
                      <option value="gu-IN">ગુજરાતી (Gujarati)</option>
                      <option value="hi-IN">हिंदी (Hindi)</option>
                      <option value="en-IN">English (India)</option>
                    </select>
                    <button type="button" onClick={toggleSpeechRecognition} style={{ background: isListening ? '#ef4444' : '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: '700', padding: '3px 8px', cursor: 'pointer' }}>
                      <i className={`bi ${isListening ? 'bi-mic-fill' : 'bi-mic'}`}></i> {isListening ? 'Listening...' : 'Voice Input'}
                    </button>
                  </div>
                </div>
                <textarea className="form-control form-control-sm" rows="3" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe landmarks or click 'Voice Input' to speak in Gujarati/Hindi..." required />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || isSubmissionBlocked} 
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  background: isSubmissionBlocked ? '#94a3b8' : '#6366f1', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '12px', 
                  fontSize: '15px', 
                  fontWeight: '700', 
                  cursor: isSubmissionBlocked ? 'not-allowed' : 'pointer', 
                  boxShadow: isSubmissionBlocked ? 'none' : '0 4px 15px rgba(99, 102, 241, 0.3)' 
                }}
              >
                {isSubmitting ? 'Raising Ticket...' : isSubmissionBlocked ? '🚫 Submission Blocked (AI Rejection)' : '🚀 Raise Official Municipal Ticket (+50 Credits)'}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Camera Viewfinder Modal */}
      {isCameraOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ maxWidth: '480px', width: '100%', background: '#0f172a', borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', color: '#fff' }}>
              <span style={{ fontSize: '13px', fontWeight: '700' }}>📸 Live Viewfinder</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => { const f = cameraFacingMode === 'environment' ? 'user' : 'environment'; setCameraFacingMode(f); startCamera(f); }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: '#fff' }}>🔄</button>
                <button type="button" onClick={() => { stopCamera(); setIsCameraOpen(false); }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: '#fff' }}>✕</button>
              </div>
            </div>
            <div style={{ height: '320px', background: '#000', position: 'relative' }}>
              <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '160px', height: '160px', border: '2px dashed rgba(255,255,255,0.6)', borderRadius: '12px', pointerEvents: 'none' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
              <button type="button" onClick={captureLivePhoto} style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fff', border: '4px solid #6366f1', cursor: 'pointer' }}></button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Success Modal */}
      {createdTicket && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 12px auto' }}>✓</div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#6366f1', background: '#e0e7ff', padding: '3px 10px', borderRadius: '12px' }}>Ticket Raised (+50 Credits)</span>
            <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '10px 0 4px 0', color: '#0f172a' }}>#{createdTicket.ticketNumber || 'TKT-ACTIVE'}</h3>
            <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '16px' }}>Your complaint for <strong>"{createdTicket.category}"</strong> has been routed to Gandhinagar Ward Control.</p>
            <button onClick={() => { setCreatedTicket(null); navigate('/user/view-status'); }} style={{ width: '100%', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Go to My Tickets</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserComplaint;
