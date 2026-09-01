import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import '../../styles/user.css';

const UserRegister = () => {
  const { registerUser, sendOTP } = useContext(AuthContext);
  const { showToast, showAlert } = useNotification();
  const navigate = useNavigate();

  // Step 1: Details, Step 2: OTP Verification
  const [step, setStep] = useState(1);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Gujarat');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [devOtp, setDevOtp] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpNotice, setOtpNotice] = useState(null);

  // Timer countdown for resending OTP
  useEffect(() => {
    let interval = null;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showAlert({
        title: 'Password Mismatch',
        message: 'The confirmation password does not match. Please verify and try again.',
        type: 'warning'
      });
      return;
    }
    if (mobile.length !== 10) {
      showAlert({
        title: 'Invalid Mobile Number',
        message: 'Please enter a valid 10-digit mobile phone number.',
        type: 'warning'
      });
      return;
    }
    if (password.length < 6) {
      showAlert({
        title: 'Short Password',
        message: 'Security password must be at least 6 characters in length.',
        type: 'warning'
      });
      return;
    }

    setIsSubmitting(true);
    const result = await sendOTP(email, name);
    setIsSubmitting(false);

    if (result.success) {
      setStep(2);
      setResendTimer(60);
      setCanResend(false);
      setOtpNotice(result.message);
      if (result.devOtp) {
        setDevOtp(result.devOtp);
      }
      showToast('6-digit verification code dispatched to your email!', 'success');
    } else {
      showAlert({
        title: 'Registration Notice',
        message: result.error || 'Failed to dispatch verification code. Please check your email address.',
        type: 'error'
      });
    }
  };

  // Step 2: Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setIsSubmitting(true);
    const result = await sendOTP(email, name);
    setIsSubmitting(false);
    if (result.success) {
      setResendTimer(60);
      setCanResend(false);
      setOtpNotice('A fresh 6-digit verification code has been dispatched to your email.');
      if (result.devOtp) {
        setDevOtp(result.devOtp);
      }
      showToast('Fresh OTP code sent to your email!', 'info');
    } else {
      showAlert({
        title: 'Resend Failed',
        message: result.error || 'Failed to resend code.',
        type: 'error'
      });
    }
  };

  // Step 2: Verify OTP & Complete Registration
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      showAlert({
        title: 'Incomplete Verification Code',
        message: 'Please enter the complete 6-digit code received in your email.',
        type: 'warning'
      });
      return;
    }

    setIsSubmitting(true);
    const success = await registerUser(name, email, mobile, password, city, state, otp);
    setIsSubmitting(false);

    if (success) {
      showToast('🎉 Account registered successfully! +50 Swachh Credits earned.', 'success');
      navigate('/user/dashboard');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 65px)', padding: '36px 20px 80px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
        
        <div className="auth-split-layout">
          
          {/* Left Side: Citizen Registration Highlights */}
          <div className="auth-hero-info">
            <span className="badge-pill-detailed badge-pill-emerald" style={{ marginBottom: '14px' }}>
              ✨ Join Swachh Gandhinagar
            </span>
            <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.75px', color: 'var(--text-primary, #0f172a)', lineHeight: '1.2', marginBottom: '16px' }}>
              Create Your Free Citizen Account in Seconds
            </h1>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted, #64748b)', lineHeight: '1.6', marginBottom: '24px' }}>
              Help shape a cleaner, safer city. Register to report potholes, overflowing bins, and water leaks directly to GMC ward authorities.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                  🎁
                </div>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary, #0f172a)' }}>Welcome Bonus Credits</strong>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted, #64748b)' }}>Start with 50 Swachh points upon registration</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                  📬
                </div>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary, #0f172a)' }}>Email Verified Security</strong>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted, #64748b)' }}>Secure 6-digit OTP email verification for official reporting</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.1)', color: '#0891b2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                  🏆
                </div>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary, #0f172a)' }}>Citizen Recognition Certificates</strong>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted, #64748b)' }}>Earn verified badges on the citywide leaderboard</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Register Card */}
          <div className="glass-card-detailed" style={{ padding: '36px 32px' }}>
            
            {step === 1 ? (
              // STEP 1: Registration Form
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: 'var(--text-primary, #0f172a)' }}>
                    Create Account
                  </h2>
                  <span className="badge-pill-detailed badge-pill-indigo" style={{ fontSize: '11px' }}>
                    Step 1 of 2
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted, #64748b)', marginBottom: '22px' }}>
                  Fill in your details. We will send a verification code to your email.
                </p>

                <form onSubmit={handleSendOtp}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary, #0f172a)', display: 'block', marginBottom: '4px' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Rahul Patel"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary, #0f172a)', display: 'block', marginBottom: '4px' }}>
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        maxLength="10"
                        placeholder="10-digit number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary, #0f172a)', display: 'block', marginBottom: '4px' }}>
                      Email Address (OTP will be sent here)
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

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary, #0f172a)', display: 'block', marginBottom: '4px' }}>
                        City / Ward
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Gandhinagar"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary, #0f172a)', display: 'block', marginBottom: '4px' }}>
                        State
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '22px' }}>
                    <div style={{ position: 'relative' }}>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary, #0f172a)', display: 'block', marginBottom: '4px' }}>
                        Password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control"
                          placeholder="Min 6 chars"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          style={{ paddingRight: '36px' }}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6366f1', fontSize: '14px' }}
                          title={showPassword ? 'Hide password' : 'Show password'}
                        >
                          <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                        </span>
                      </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary, #0f172a)', display: 'block', marginBottom: '4px' }}>
                        Confirm Password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="form-control"
                          placeholder="Re-enter"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          style={{ paddingRight: '36px' }}
                        />
                        <span
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6366f1', fontSize: '14px' }}
                          title={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          <i className={`bi ${showConfirmPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{ width: '100%', padding: '12px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' }}
                  >
                    {isSubmitting ? 'Dispatching Verification Code...' : 'Continue: Send Verification OTP →'}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted, #64748b)' }}>Already have an account? </span>
                    <Link to="/user/login" style={{ color: '#6366f1', fontWeight: '700', textDecoration: 'none' }}>
                      Sign In
                    </Link>
                  </div>
                </form>
              </>
            ) : (
              // STEP 2: OTP Verification Form
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: 'var(--text-primary, #0f172a)' }}>
                    Verify Your Email
                  </h2>
                  <span className="badge-pill-detailed badge-pill-emerald" style={{ fontSize: '11px' }}>
                    Step 2 of 2
                  </span>
                </div>
                
                <p style={{ fontSize: '13px', color: 'var(--text-muted, #64748b)', marginBottom: '16px' }}>
                  We sent a 6-digit verification code to <strong style={{ color: '#6366f1' }}>{email}</strong>.
                </p>

                {devOtp && (
                  <div style={{ padding: '12px 16px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(16, 185, 129, 0.12) 100%)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.25)', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>
                        ⚡ Development OTP Code
                      </span>
                      <strong style={{ fontSize: '18px', color: 'var(--text-primary, #0f172a)', letterSpacing: '2px', fontFamily: 'monospace' }}>
                        {devOtp}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtp(devOtp)}
                      style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      📋 Auto-Fill OTP
                    </button>
                  </div>
                )}

                {otpNotice && !devOtp && (
                  <div style={{ padding: '10px 14px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '12.5px', color: '#4f46e5', marginBottom: '18px' }}>
                    ℹ️ {otpNotice}
                  </div>
                )}

                <form onSubmit={handleVerifyAndRegister}>
                  <div style={{ marginBottom: '22px', textAlign: 'center' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary, #0f172a)', display: 'block', marginBottom: '8px' }}>
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="6"
                      placeholder="• • • • • •"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      required
                      autoFocus
                      style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px', fontWeight: '800', padding: '12px' }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting || otp.length !== 6}
                    style={{ width: '100%', padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)', opacity: otp.length === 6 ? 1 : 0.7 }}
                  >
                    {isSubmitting ? 'Verifying...' : '✅ Verify & Complete Registration (+50 Credits)'}
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', fontSize: '13px' }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0, fontWeight: '600', textDecoration: 'underline' }}
                    >
                      ← Change Details
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={!canResend || isSubmitting}
                      style={{ background: 'none', border: 'none', color: canResend ? '#6366f1' : '#94a3b8', cursor: canResend ? 'pointer' : 'default', padding: 0, fontWeight: '700' }}
                    >
                      {canResend ? '🔄 Resend OTP Code' : `Resend in ${resendTimer}s`}
                    </button>
                  </div>
                </form>
              </>
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

export default UserRegister;
