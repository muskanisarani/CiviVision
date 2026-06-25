"use client";
import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';

const HowToUse = () => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);

  const handleGetStarted = () => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/user/dashboard');
      }
    } else {
      router.push('/user/login');
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
      textAlign: 'center',
    },
    title: {
      fontSize: '28px',
      fontWeight: '800',
      color: '#0f172a',
      marginBottom: '10px',
      letterSpacing: '-0.5px',
      background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      fontSize: '15px',
      color: '#475569',
      marginBottom: '40px',
      lineHeight: '1.6',
    },
    stepsGrid: {
      display: 'grid',
      marginBottom: '40px',
    },
    stepCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.45)',
      border: '1px solid rgba(15, 23, 42, 0.06)',
      borderRadius: '16px',
      padding: '24px 20px',
      position: 'relative',
      textAlign: 'left',
      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.02)',
      transition: 'transform 0.2s, border-color 0.2s',
    },
    stepNum: {
      position: 'absolute',
      top: '-15px',
      left: '20px',
      width: '32px',
      height: '32px',
      backgroundColor: '#6366f1',
      color: '#ffffff',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '800',
      fontSize: '14px',
      boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
    },
    stepTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#1e293b',
      marginTop: '8px',
      marginBottom: '8px',
    },
    stepDesc: {
      fontSize: '13px',
      color: '#64748b',
      lineHeight: '1.5',
      margin: 0,
    },
    backBtn: {
      backgroundColor: '#6366f1',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 30px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
      transition: 'all 0.2s',
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2 style={styles.title}>How CiviVision Works</h2>
        <p style={styles.subtitle}>
          Reporting city issues and dispatching solutions is simplified with our AI-powered community portal. Learn how to log and track your complaints in 4 simple steps.
        </p>

        <div style={styles.stepsGrid} className="steps-grid-custom">
          <div style={styles.stepCard} className="step-card">
            <div style={styles.stepNum}>1</div>
            <h4 style={styles.stepTitle}>📸 Snap & Upload</h4>
            <p style={styles.stepDesc}>
              Take a clear photo of the civic issue (garbage heap, broken streetlight, or leak) and upload it to the form.
            </p>
          </div>

          <div style={styles.stepCard} className="step-card">
            <div style={styles.stepNum}>2</div>
            <h4 style={styles.stepTitle}>🤖 AI Diagnostics</h4>
            <p style={styles.stepDesc}>
              Our local AI auto-categorizes the image, evaluates size and severity levels, and logs GPS coordinates instantly.
            </p>
          </div>

          <div style={styles.stepCard} className="step-card">
            <div style={styles.stepNum}>3</div>
            <h4 style={styles.stepTitle}>⚡ Priority Dispatch</h4>
            <p style={styles.stepDesc}>
              Critical hazards are flagged for immediate action. Assignments are auto-routed to the specific Ward municipal crews.
            </p>
          </div>

          <div style={styles.stepCard} className="step-card">
            <div style={styles.stepNum}>4</div>
            <h4 style={styles.stepTitle}>✅ Status Tracking</h4>
            <p style={styles.stepDesc}>
              Follow resolution logs transparently on your dashboard. Receive immediate push notifications once the problem is resolved.
            </p>
          </div>
        </div>

        <button style={styles.backBtn} className="btn-back-hover" onClick={handleGetStarted}>
          Get Started Now
        </button>
      </div>

      <style jsx global>{`
        .steps-grid-custom {
          display: grid !important;
          gap: 20px !important;
        }
        @media (min-width: 768px) {
          .steps-grid-custom {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (max-width: 767px) and (min-width: 480px) {
          .steps-grid-custom {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 479px) {
          .steps-grid-custom {
            grid-template-columns: 1fr !important;
          }
        }
        .step-card:hover {
          transform: translateY(-3px);
          border-color: rgba(99, 102, 241, 0.25) !important;
          background-color: rgba(255, 255, 255, 0.75) !important;
        }
        .btn-back-hover:hover {
          background-color: #4f46e5 !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35) !important;
        }
      `}</style>
    </div>
  );
};

export default HowToUse;
