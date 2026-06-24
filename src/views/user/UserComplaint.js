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

  const handleSubmit = (e) => {
    e.preventDefault();
    
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
    }

    const fullDescription = description + categoryDetails;

    // Simulate complaint creation and save to localStorage
    const newComplaint = {
      id: `#00${Math.floor(Math.random() * 900) + 100}`,
      category: category || 'General',
      location: location,
      description: fullDescription,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const currentComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    currentComplaints.unshift(newComplaint);
    localStorage.setItem('complaints', JSON.stringify(currentComplaints));

    // Also trigger a user notification alert for real website feel
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
            <option value="Streetlights" style={{ background: '#ffffff', color: '#0f172a' }}>Streetlights</option>
            <option value="Drainage & Sewerage" style={{ background: '#ffffff', color: '#0f172a' }}>Drainage & Sewerage</option>
            <option value="Public Toilet" style={{ background: '#ffffff', color: '#0f172a' }}>Public Toilet</option>
            <option value="Other" style={{ background: '#ffffff', color: '#0f172a' }}>Other</option>
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
                <label style={styles.label}> streetlight Issue</label>
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
