import React from 'react';
import { Link } from 'react-router-dom';

const SelectRole = () => {
  return (
    <div style={{ minHeight: 'calc(100vh - 65px)', padding: '40px 20px 80px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
        
        {/* Title Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="badge-pill-detailed badge-pill-indigo" style={{ marginBottom: '12px' }}>
            🏛️ Gujarat Municipal Corporation
          </span>
          <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.75px', color: 'var(--text-primary, #0f172a)', margin: '0 0 10px 0' }}>
            Welcome to CiviVision Portal
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-muted, #64748b)', maxWidth: '600px', margin: '0 auto' }}>
            Select your access role to report municipal issues, track SLA dispatches, or manage ward operations.
          </p>
        </div>

        {/* 2-Column Role Selection Grid */}
        <div className="role-selection-grid">
          
          {/* Citizen Portal Card */}
          <Link to="/user/login" className="glass-card-detailed role-card-link" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '36px 32px' }}>
            <div>
              <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(99, 102, 241, 0.12)', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '20px' }}>
                👤
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: 'var(--text-primary, #0f172a)' }}>
                  Citizen Portal
                </h3>
                <span className="badge-pill-detailed badge-pill-emerald" style={{ fontSize: '10px' }}>
                  Public Access
                </span>
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted, #64748b)', lineHeight: '1.6', marginBottom: '20px' }}>
                Report potholes, garbage pileups, water leaks, and streetlight outages. Get automatic AI verification, track resolution status live, and earn Swachh Credits.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
                <div style={{ fontSize: '12.5px', color: 'var(--text-primary, #0f172a)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="bi bi-check-circle-fill text-success"></i> Instant Camera & GPS Complaint Filing
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-primary, #0f172a)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="bi bi-check-circle-fill text-success"></i> Public Toilet & Hygiene Tracker
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-primary, #0f172a)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="bi bi-check-circle-fill text-success"></i> +50 Swachh Credits per verified fix
                </div>
              </div>
            </div>
            <div style={{ background: '#6366f1', color: '#fff', textAlign: 'center', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: '700', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)' }}>
              Enter Citizen Portal →
            </div>
          </Link>

          {/* Municipal Officer Admin Card */}
          <Link to="/admin/login" className="glass-card-detailed role-card-link" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '36px 32px' }}>
            <div>
              <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(6, 182, 212, 0.12)', color: '#0891b2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '20px' }}>
                🛡️
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: 'var(--text-primary, #0f172a)' }}>
                  Municipal Admin
                </h3>
                <span className="badge-pill-detailed badge-pill-indigo" style={{ fontSize: '10px' }}>
                  GMC Officers
                </span>
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted, #64748b)', lineHeight: '1.6', marginBottom: '20px' }}>
                Ward control dashboard for municipal engineers, sanitation inspectors, and dispatch managers. View heatmaps, dispatch squads, and audit resolution photos.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
                <div style={{ fontSize: '12.5px', color: 'var(--text-primary, #0f172a)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="bi bi-shield-check text-primary"></i> 18 Ward Live Dispatch Management
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-primary, #0f172a)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="bi bi-shield-check text-primary"></i> Real-time SLA Timelines & Escalation
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-primary, #0f172a)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="bi bi-shield-check text-primary"></i> Spatial Analytics & AI Anti-Fraud Audits
                </div>
              </div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', color: '#fff', textAlign: 'center', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: '700', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              Enter Officer Admin →
            </div>
          </Link>

        </div>

      </div>

      <style jsx="true" global="true">{`
        .role-selection-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        @media (max-width: 768px) {
          .role-selection-grid {
            grid-template-columns: 1fr;
          }
        }
        .role-card-link:hover {
          transform: translateY(-5px);
          border-color: rgba(99, 102, 241, 0.35) !important;
          box-shadow: 0 20px 45px rgba(99, 102, 241, 0.12) !important;
        }
      `}</style>
    </div>
  );
};

export default SelectRole;
