import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/user.css';

const AdminLogin = () => {
  const { loginAdmin, registerAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [loginType, setLoginType] = useState('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Login Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginMobile, setLoginMobile] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loginValue = loginType === 'email' ? loginEmail : loginMobile;
    const success = await loginAdmin(loginType, loginValue, loginPassword);
    setIsSubmitting(false);
    if (success) {
      navigate('/admin/dashboard');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await registerAdmin(regName, regEmail, regMobile, regPassword);
    setIsSubmitting(false);
    if (success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 65px)', padding: '36px 20px 80px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
        
        <div className="auth-split-layout">
          
          {/* Left Side: Municipal Officer Capabilities */}
          <div className="auth-hero-info">
            <span className="badge-pill-detailed badge-pill-indigo" style={{ marginBottom: '14px' }}>
              🛡️ GMC Ward Officer Access
            </span>
            <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.75px', color: 'var(--text-primary, #0f172a)', lineHeight: '1.2', marginBottom: '16px' }}>
              Municipal Ward Control & Dispatch Operations
            </h1>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted, #64748b)', lineHeight: '1.6', marginBottom: '24px' }}>
              Centralized administrative dashboard for Gandhinagar Municipal Corporation ward inspectors, sanitation squad supervisors, and engineering leads.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                  🗺️
                </div>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary, #0f172a)' }}>Live Spatial Heatmaps</strong>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted, #64748b)' }}>18-ward real-time grievance pin visualization</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.1)', color: '#0891b2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                  ⚡
                </div>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary, #0f172a)' }}>SLA Emergency Dispatch</strong>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted, #64748b)' }}>Automatic 2-hour alerts for critical water/road risks</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                  🔍
                </div>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary, #0f172a)' }}>AI Anti-Fraud Verification</strong>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted, #64748b)' }}>Audit after-fix proof photos & release Swachh credits</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Admin Form Card */}
          <div className="glass-card-detailed" style={{ padding: '36px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--text-primary, #0f172a)' }}>
                  {isRegister ? 'Register Officer' : 'Officer Login'}
                </h2>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted, #64748b)', margin: 0 }}>
                  {isRegister ? 'Create authorized municipal officer credentials' : 'Sign in to access GMC control room'}
                </p>
              </div>
              <span className="badge-pill-detailed badge-pill-indigo" style={{ fontSize: '11px' }}>
                GMC Security
              </span>
            </div>

            {!isRegister ? (
              // LOGIN FORM
              <form onSubmit={handleLoginSubmit}>
                {/* Login Type Tabs */}
                <div style={{ display: 'flex', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '12px', padding: '4px', marginBottom: '18px' }}>
                  <button
                    type="button"
                    onClick={() => setLoginType('email')}
                    style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: loginType === 'email' ? '#6366f1' : 'transparent', color: loginType === 'email' ? '#fff' : 'var(--text-primary, #0f172a)', fontWeight: '700', fontSize: '12.5px', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    ✉️ Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginType('mobile')}
                    style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: loginType === 'mobile' ? '#6366f1' : 'transparent', color: loginType === 'mobile' ? '#fff' : 'var(--text-primary, #0f172a)', fontWeight: '700', fontSize: '12.5px', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    📱 Mobile
                  </button>
                </div>

                {loginType === 'email' ? (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary, #0f172a)', display: 'block', marginBottom: '6px' }}>
                      Officer Official Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. officer@gmc.gov.in"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                ) : (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary, #0f172a)', display: 'block', marginBottom: '6px' }}>
                      Registered Mobile Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      maxLength="10"
                      placeholder="10-digit mobile number"
                      value={loginMobile}
                      onChange={(e) => setLoginMobile(e.target.value.replace(/[^0-9]/g, ''))}
                      required
                    />
                  </div>
                )}

                <div style={{ marginBottom: '22px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary, #0f172a)', display: 'block', marginBottom: '6px' }}>
                    Officer Security Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter security password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{ width: '100%', padding: '12px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(15, 23, 42, 0.3)' }}
                >
                  {isSubmitting ? 'Authenticating...' : 'Sign In as Municipal Admin'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted, #64748b)' }}>New GMC Officer? </span>
                  <span onClick={() => setIsRegister(true)} style={{ color: '#6366f1', fontWeight: '700', cursor: 'pointer' }}>
                    Register Profile
                  </span>
                </div>
              </form>
            ) : (
              // REGISTER FORM
              <form onSubmit={handleRegisterSubmit}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary, #0f172a)', display: 'block', marginBottom: '6px' }}>
                    Officer Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Inspector R. Sharma"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary, #0f172a)', display: 'block', marginBottom: '6px' }}>
                    Officer Email (Gmail / Govt)
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="e.g. officer@gmc.gov.in"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary, #0f172a)', display: 'block', marginBottom: '6px' }}>
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    maxLength="10"
                    placeholder="10-digit mobile number"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value.replace(/[^0-9]/g, ''))}
                    required
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary, #0f172a)', display: 'block', marginBottom: '6px' }}>
                    Create Security Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Minimum 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{ width: '100%', padding: '12px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)' }}
                >
                  {isSubmitting ? 'Registering...' : 'Complete Admin Registration'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted, #64748b)' }}>Already registered? </span>
                  <span onClick={() => setIsRegister(false)} style={{ color: '#6366f1', fontWeight: '700', cursor: 'pointer' }}>
                    Back to Officer Login
                  </span>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>

      <style jsx="true" global="true">{`
        .auth-split-layout {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 40px;
          align-items: center;
        }
        @media (max-width: 860px) {
          .auth-split-layout {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
