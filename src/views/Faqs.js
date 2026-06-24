"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Faqs = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      q: "How does the AI identify civic problems?",
      a: "When you upload a photo, our computer vision model analyzes visual features to match it with typical civic categories (e.g. overflowing waste bin, potholes, or leaking mains). It registers severity scales to determine dispatch priority."
    },
    {
      q: "What are the resolution timelines (SLAs)?",
      a: "Critical civic hazards (gas leaks, open manholes) have an immediate 2-hour dispatch target. Garbage dumps and sanitation piles target a 24-hour window, water leakages are aimed at 12 hours, and road potholes are targeted for 5-7 days."
    },
    {
      q: "Do I need to manually specify my GPS location?",
      a: "No, if your camera device has geotagging enabled, the photo's EXIF metadata will automatically pin the exact latitude and longitude coordinates. Otherwise, you can type details in the Location field."
    },
    {
      q: "How do I verify that my complaint is resolved?",
      a: "Once the ward sanitation crew updates the complaint status, a resolution photo will be uploaded to your notification inbox. You can verify and mark it as satisfied, or reopen it if needed."
    },
    {
      q: "Is CiviVision linked to municipal authorities?",
      a: "Yes, CiviVision operates as an official civic outreach dashboard connected to the GMC Municipal Corporation and Swachh Bharat Mission (SBM) local offices."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
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
    title: {
      fontSize: '26px',
      fontWeight: '800',
      color: '#0f172a',
      marginBottom: '8px',
      letterSpacing: '-0.5px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      fontSize: '14px',
      color: '#475569',
      marginBottom: '32px',
      textAlign: 'center',
      lineHeight: '1.6',
    },
    faqList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '32px',
    },
    faqItem: {
      backgroundColor: 'rgba(255, 255, 255, 0.45)',
      border: '1px solid rgba(15, 23, 42, 0.06)',
      borderRadius: '12px',
      padding: '16px 20px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    faqQuestion: {
      fontSize: '14px',
      fontWeight: '700',
      color: '#1e293b',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: 0,
    },
    faqAnswer: {
      fontSize: '13px',
      color: '#64748b',
      lineHeight: '1.6',
      marginTop: '12px',
      paddingTop: '10px',
      borderTop: '1px solid rgba(15, 23, 42, 0.04)',
    },
    btnHome: {
      display: 'block',
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      color: '#475569',
      border: '1px solid rgba(15, 23, 42, 0.12)',
      borderRadius: '12px',
      padding: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      textAlign: 'center',
      textDecoration: 'none',
      transition: 'all 0.2s',
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2 style={styles.title}>Frequently Asked Questions</h2>
        <p style={styles.subtitle}>Find solutions to common questions regarding photo diagnostics, target response times, and system rules.</p>

        <div style={styles.faqList}>
          {faqData.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div 
                key={idx} 
                style={styles.faqItem} 
                className="faq-item-hover"
                onClick={() => toggleAccordion(idx)}
              >
                <h4 style={styles.faqQuestion}>
                  <span>{faq.q}</span>
                  <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`} style={{ fontSize: '12px', color: '#6366f1' }}></i>
                </h4>
                {isOpen && (
                  <p style={styles.faqAnswer}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <button style={styles.btnHome} className="btn-home-hover" onClick={() => router.push('/')}>
          Back to Homepage
        </button>
      </div>

      <style jsx global>{`
        .faq-item-hover:hover {
          border-color: rgba(99, 102, 241, 0.25) !important;
          background-color: rgba(255, 255, 255, 0.75) !important;
        }
        .btn-home-hover:hover {
          background-color: rgba(15, 23, 42, 0.03) !important;
          color: #0f172a !important;
        }
      `}</style>
    </div>
  );
};

export default Faqs;
