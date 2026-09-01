import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const HowToUse = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const handleGetStarted = () => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/complaint');
      }
    } else {
      navigate('/user/login');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 65px)', padding: '24px 20px 80px 20px' }}>
      <div style={{ maxWidth: '1350px', width: '100%', margin: '0 auto' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => navigate(-1)} 
              style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', width: '36px', height: '36px', borderRadius: '50%', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <i className="bi bi-arrow-left"></i>
            </button>
            <div>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                How CiviVision Works
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                Official Municipal AI Grievance Guide — Gandhinagar Municipal Corporation
              </p>
            </div>
          </div>
          <button 
            onClick={handleGetStarted}
            style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}
          >
            🚀 Launch Grievance Form
          </button>
        </div>

        {/* 4-Step Resolution Lifecycle */}
        <div style={{ marginBottom: '36px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: 'var(--text-primary, #0f172a)' }}>
            4-Step Instant Civic Resolution Lifecycle
          </h3>
          <div className="how-steps-grid">
            
            <div className="glass-card-detailed" style={{ position: 'relative', paddingTop: '32px' }}>
              <div style={{ position: 'absolute', top: '-14px', left: '20px', width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px', boxShadow: '0 4px 10px rgba(99,102,241,0.3)' }}>
                1
              </div>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📍</div>
              <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary, #0f172a)' }}>
                Live GPS Pinning
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted, #64748b)', lineHeight: '1.5', margin: 0 }}>
                Share your live on-site GPS location. This guarantees on-the-spot reporting and automatically routes the incident to the correct municipal ward boundary.
              </p>
            </div>

            <div className="glass-card-detailed" style={{ position: 'relative', paddingTop: '32px' }}>
              <div style={{ position: 'absolute', top: '-14px', left: '20px', width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px', boxShadow: '0 4px 10px rgba(99,102,241,0.3)' }}>
                2
              </div>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🧠</div>
              <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary, #0f172a)' }}>
                On-Device AI Computer Vision
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted, #64748b)', lineHeight: '1.5', margin: 0 }}>
                Our on-device TensorFlow neural network classifies the defect (Garbage, Pothole, Water Leak, Streetlight) and rejects photos of private items (cars, shoes, clothes).
              </p>
            </div>

            <div className="glass-card-detailed" style={{ position: 'relative', paddingTop: '32px' }}>
              <div style={{ position: 'absolute', top: '-14px', left: '20px', width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px', boxShadow: '0 4px 10px rgba(99,102,241,0.3)' }}>
                3
              </div>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>⚡</div>
              <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary, #0f172a)' }}>
                Smart Ward Crew Dispatch
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted, #64748b)', lineHeight: '1.5', margin: 0 }}>
                High-priority risks (water pipeline bursts, hazardous craters) trigger urgent 2-hour field dispatches, assigning the nearest sanitation or road crew vehicle.
              </p>
            </div>

            <div className="glass-card-detailed" style={{ position: 'relative', paddingTop: '32px' }}>
              <div style={{ position: 'absolute', top: '-14px', left: '20px', width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px', boxShadow: '0 4px 10px rgba(99,102,241,0.3)' }}>
                4
              </div>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🏆</div>
              <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary, #0f172a)' }}>
                Verified Fix & Rewards (+50 Credits)
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted, #64748b)', lineHeight: '1.5', margin: 0 }}>
                Inspectors upload after-fix photo evidence. You receive a push notification, the ticket is transparently resolved, and you earn +50 Swachh citizen points.
              </p>
            </div>

          </div>
        </div>

        {/* 2-Column Detailed Info: SLAs & Verification Guidelines */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '36px' }}>
          
          {/* Municipal SLA Guarantees */}
          <div className="glass-card-detailed">
            <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', color: 'var(--text-primary, #0f172a)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⏱️</span> Official Municipal SLA Target Times
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary, #0f172a)' }}>🚰 Water Pipeline Breach & Sewer Leak</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)' }}>Emergency municipal engineering response</span>
                </div>
                <span className="badge-pill-detailed badge-pill-amber">2 Hours Max</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary, #0f172a)' }}>🗑️ Unattended Roadside Solid Waste Heap</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)' }}>Ward sanitation compactor truck dispatch</span>
                </div>
                <span className="badge-pill-detailed badge-pill-emerald">4 - 8 Hours</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary, #0f172a)' }}>💡 Public Streetlight Bulb & Pole Outage</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)' }}>Electrical maintenance line crew inspection</span>
                </div>
                <span className="badge-pill-detailed badge-pill-indigo">12 Hours</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary, #0f172a)' }}>🚧 Asphalt Potholes & Road Cave-in</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)' }}>Cold-mix asphalt patch squad deployment</span>
                </div>
                <span className="badge-pill-detailed badge-pill-indigo">24 - 48 Hours</span>
              </div>

            </div>
          </div>

          {/* Strict AI Verification Rules */}
          <div className="glass-card-detailed">
            <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', color: 'var(--text-primary, #0f172a)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🛡️</span> Strict AI Mode: Verification Rules
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div style={{ padding: '12px 14px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                <strong style={{ fontSize: '13px', color: '#059669', display: 'block', marginBottom: '4px' }}>
                  ✅ Allowed On-Site Captures
                </strong>
                <p style={{ fontSize: '12px', color: 'var(--text-muted, #64748b)', margin: 0, lineHeight: '1.4' }}>
                  Photos of real public municipal defects captured on-site (roadside garbage heaps, broken tar, burst pipes, overflowing storm drains, dead streetlights).
                </p>
              </div>

              <div style={{ padding: '12px 14px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                <strong style={{ fontSize: '13px', color: '#dc2626', display: 'block', marginBottom: '4px' }}>
                  🚫 Automatically Rejected Content
                </strong>
                <p style={{ fontSize: '12px', color: 'var(--text-muted, #64748b)', margin: 0, lineHeight: '1.4' }}>
                  Digital screenshots, memes, photos of computer/phone screens, vehicles, shoes, clothing, indoor household furniture, selfies, or pets.
                </p>
              </div>

              <div style={{ padding: '12px 14px', background: 'rgba(99, 102, 241, 0.06)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <strong style={{ fontSize: '13px', color: '#4f46e5', display: 'block', marginBottom: '4px' }}>
                  ⚡ Zero Cost & 100% Privacy
                </strong>
                <p style={{ fontSize: '12px', color: 'var(--text-muted, #64748b)', margin: 0, lineHeight: '1.4' }}>
                  All visual classification runs on-device using WebAssembly & TensorFlow.js. Your photos are private and audited instantly.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Quick Launch Action Banner */}
        <div className="glass-card-detailed" style={{ textAlign: 'center', padding: '36px 24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.06) 100%)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary, #0f172a)' }}>
            Ready to make Gandhinagar cleaner and smarter?
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted, #64748b)', marginBottom: '20px', maxWidth: '600px', margin: '0 auto 20px auto' }}>
            Report your first civic issue in under 30 seconds with automatic GPS pinning and AI auto-categorization.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={handleGetStarted} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 28px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' }}>
              📸 Report an Issue (+50 Credits)
            </button>
            <Link to="/user/toilet-tracker" style={{ background: 'rgba(255, 255, 255, 0.6)', color: 'var(--text-primary, #0f172a)', border: '1px solid rgba(15, 23, 42, 0.12)', borderRadius: '12px', padding: '12px 24px', fontSize: '15px', fontWeight: '700', textDecoration: 'none' }}>
              🗺️ Public Toilet Tracker
            </Link>
          </div>
        </div>

      </div>

      <style jsx="true" global="true">{`
        .how-steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1024px) {
          .how-steps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .how-steps-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default HowToUse;
