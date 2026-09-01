import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/user.css';

const UserLogin = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState('email');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loginValue = loginType === 'email' ? email : mobile;
    const success = await loginUser(loginValue, password);
    setIsSubmitting(false);
    if (success) {
      navigate('/user/dashboard');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 65px)', padding: '36px 20px 80px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
        
        <div className="auth-split-layout">
          
          {/* Left Side: Citizen Perks & Highlights */}
          <div className="auth-hero-info">
            <span className="badge-pill-detailed badge-pill-emerald" style={{ marginBottom: '14px' }}>
              👤 Swachh Citizen Access
            </span>
            <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.75px', color: 'var(--text-primary, #0f172a)', lineHeight: '1.2', marginBottom: '16px' }}>
              Empowering Citizens to Clean & Improve Gandhinagar
            </h1>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted, #64748b)', lineHeight: '1.6', marginBottom: '24px' }}>
              Log in to submit civic issues with real-time AI computer vision audits, monitor SLA dispatches, and climb the Swachh leaderboard.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                  📸
                </div>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary, #0f172a)' }}>Instant Defect Audit</strong>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted, #64748b)' }}>On-device AI categorizes garbage, potholes & leaks</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                  🏆
                </div>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary, #0f172a)' }}>+50 Swachh Credits</strong>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted, #64748b)' }}>Earn recognized civic credit points for verified fixes</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.1)', color: '#0891b2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                  📍
                </div>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary, #0f172a)' }}>Live GPS Tracking</strong>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted, #64748b)' }}>Follow ward squad movement and resolution logs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Login Card */}
          <div className="glass-card-detailed" style={{ padding: '36px 32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px 0', color: 'var(--text-primary, #0f172a)' }}>
              Citizen Login
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted, #64748b)', marginBottom: '24px' }}>
              Sign in with your registered email or mobile number
            </p>

            {/* Login Type Tabs */}
            <div style={{ display: 'flex', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => setLoginType('email')}
                style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: loginType === 'email' ? '#6366f1' : 'transparent', color: loginType === 'email' ? '#fff' : 'var(--text-primary, #0f172a)', fontWeight: '700', fontSize: '12.5px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                ✉️ Email Address
              </button>
              <button
                type="button"
                onClick={() => setLoginType('mobile')}
                style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: loginType === 'mobile' ? '#6366f1' : 'transparent', color: loginType === 'mobile' ? '#fff' : 'var(--text-primary, #0f172a)', fontWeight: '700', fontSize: '12.5px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                📱 Mobile Number
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {loginType === 'email' ? (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary, #0f172a)', display: 'block', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="e.g. citizen@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary, #0f172a)', display: 'block', marginBottom: '6px' }}>
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    maxLength="10"
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                    required
                  />
                </div>
              )}

              <div style={{ marginBottom: '22px', position: 'relative' }}>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary, #0f172a)', display: 'block', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Enter your account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: '42px' }}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6366f1', fontSize: '16px' }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                  </span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ width: '100%', padding: '12px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' }}
              >
                {isSubmitting ? 'Authenticating...' : 'Sign In to Citizen Portal'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>New to CiviVision? </span>
                <Link to="/user/register" style={{ color: '#6366f1', fontWeight: '700', textDecoration: 'none' }}>
                  Create Free Account
                </Link>
              </div>
            </form>
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

export default UserLogin;
