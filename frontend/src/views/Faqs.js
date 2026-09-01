import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Faqs = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'AI & Camera', 'SLA & Resolution', 'GPS & Privacy', 'Credits & Badges'];

  const faqData = [
    {
      cat: 'AI & Camera',
      q: "How does the AI detect if an uploaded photo is real or fake?",
      a: "CiviVision uses on-device computer vision and Shannon optical entropy analysis to check sensor noise, color depth, and ImageNet visual object classes. It rejects digital screenshots, photos of computer/phone screens, and non-civic private items (cars, shoes, clothes, furniture) in real-time."
    },
    {
      cat: 'AI & Camera',
      q: "Why was my photo rejected by Strict AI Mode?",
      a: "Photos are rejected if they do not show an authentic municipal defect (garbage heaps, road potholes, water pipeline bursts, or broken streetlights). If you uploaded a photo of a vehicle, shoe, pet, person, or digital graphic, the AI will reject it to prevent fraudulent reporting."
    },
    {
      cat: 'SLA & Resolution',
      q: "What are the official municipal response timelines (SLAs)?",
      a: "Urgent hazards like clean drinking water pipeline breaches have a 2-hour emergency dispatch target. Roadside garbage dumps target a 4-8 hour window, streetlight outages are aimed at 12 hours, and road pothole repairs are scheduled within 24-48 hours."
    },
    {
      cat: 'GPS & Privacy',
      q: "Why is Live GPS location required before taking a photo?",
      a: "Live GPS coordinates ensure on-site reporting, preventing users from uploading downloaded stock images from home. It also automatically maps your complaint to the exact GMC Ward jurisdiction so the local squad can arrive promptly."
    },
    {
      cat: 'SLA & Resolution',
      q: "How do I know when my complaint has been fixed?",
      a: "When the municipal ward squad repairs the defect, they upload after-fix photo evidence to the portal. You will receive an instant in-app notification with the resolution photo and ticket closure report."
    },
    {
      cat: 'Credits & Badges',
      q: "What are Swachh Credits and how do I earn them?",
      a: "Active citizens earn +50 Swachh Credits for every verified grievance submitted and resolved. Credits rank you on the citywide Swachh Leaderboard and unlock official municipal citizen recognition certificates."
    },
    {
      cat: 'GPS & Privacy',
      q: "Is my personal identity and data protected?",
      a: "Yes. All on-device AI audits run locally on your browser without sending raw biometric or unrelated personal files to external servers. Your phone number and email are kept confidential with municipal ward administrators."
    }
  ];

  const filteredFaqs = activeCategory === 'All' 
    ? faqData 
    : faqData.filter(f => f.cat === activeCategory);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
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
                Frequently Asked Questions
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                Clear answers regarding AI diagnostics, SLAs, GPS audits, and Swachh credits
              </p>
            </div>
          </div>
          <Link 
            to="/user/complaint"
            style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 20px', fontSize: '14px', fontWeight: '700', textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}
          >
            📸 Report an Issue
          </Link>
        </div>

        {/* Category Pill Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setActiveIndex(null); }}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: activeCategory === cat ? '1px solid #6366f1' : '1px solid rgba(15, 23, 42, 0.1)',
                background: activeCategory === cat ? '#6366f1' : 'rgba(255, 255, 255, 0.6)',
                color: activeCategory === cat ? '#ffffff' : 'var(--text-primary, #0f172a)',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px' }}>
          {filteredFaqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div 
                key={idx} 
                className="glass-card-detailed"
                style={{ cursor: 'pointer', padding: '18px 24px' }}
                onClick={() => toggleAccordion(idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="badge-pill-detailed badge-pill-indigo" style={{ fontSize: '10px', padding: '2px 8px' }}>
                      {faq.cat}
                    </span>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--text-primary, #0f172a)' }}>
                      {faq.q}
                    </h4>
                  </div>
                  <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`} style={{ fontSize: '14px', color: '#6366f1', marginLeft: '12px' }}></i>
                </div>
                {isOpen && (
                  <p style={{ marginTop: '12px', marginBottom: 0, fontSize: '13.5px', color: 'var(--text-muted, #64748b)', lineHeight: '1.6', paddingTop: '10px', borderTop: '1px solid rgba(15, 23, 42, 0.06)' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Support Banner */}
        <div className="glass-card-detailed" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(16, 185, 129, 0.06) 100%)' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--text-primary, #0f172a)' }}>
              Still have questions or need ward support?
            </h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted, #64748b)' }}>
              Reach out directly to the Gandhinagar Municipal Corporation civic grievance helpline.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/contact" style={{ background: 'rgba(255, 255, 255, 0.7)', color: 'var(--text-primary, #0f172a)', border: '1px solid rgba(15, 23, 42, 0.12)', borderRadius: '10px', padding: '10px 18px', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
              📞 Contact Support
            </Link>
            <Link to="/" style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
              🏠 Homepage
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Faqs;
