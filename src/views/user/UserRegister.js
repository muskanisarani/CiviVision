"use client";
import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
import '../../user.css';

const UserRegister = () => {
  const { registerUser } = useContext(AuthContext);
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setAlertMessage('Passwords do not match. Please verify and try again.');
      return;
    }
    const success = registerUser(name, email, mobile, password);
    if (success) {
      router.push('/user/login');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ position: 'relative', minHeight: 'calc(100vh - 150px)' }}>
      <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
        <Link href="/user/login" style={{ color: '#475569', fontSize: '15px', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <i className="bi bi-arrow-left"></i> Back to Login
        </Link>
      </div>
      <div className="auth-card-custom" style={{ margin: '30px auto' }}>
        <h3>Register New User</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address (Gmail)</label>
            <input
              type="email"
              className="form-control"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mobile Number</label>
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

          <div className="mb-3 password-field">
            <label className="form-label">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon-custom"
              onClick={() => setShowPassword(!showPassword)}
              style={{ top: '35px' }}
            >
              {showPassword ? '🙈' : '👁'}
            </span>
          </div>

          <div className="mb-3 password-field">
            <label className="form-label">Confirm Password</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="form-control"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon-custom"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ top: '35px' }}
            >
              {showConfirmPassword ? '🙈' : '👁'}
            </span>
          </div>

          <button type="submit" className="btn-main-custom w-100">Register</button>

          <div className="text-center mt-3">
            <Link href="/user/login" className="toggle-link-custom">Already user? Login</Link>
          </div>
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
              ⚠️
            </div>
            <h5 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '12px', fontSize: '16px' }}>Validation Alert</h5>
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
              onClick={() => setAlertMessage(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRegister;
