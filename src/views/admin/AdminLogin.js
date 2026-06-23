"use client";
import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
import '../../user.css';

const AdminLogin = () => {
  const { loginAdmin, registerAdmin } = useContext(AuthContext);
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [loginType, setLoginType] = useState('email');
  
  // Login Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginMobile, setLoginMobile] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const loginValue = loginType === 'email' ? loginEmail : loginMobile;
    const success = loginAdmin(loginType, loginValue, loginPassword);
    if (success) {
      router.push('/admin/dashboard');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const success = registerAdmin(regName, regEmail, regMobile, regPassword);
    if (success) {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ position: 'relative', minHeight: 'calc(100vh - 150px)' }}>
      <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
        <Link href="/select-role" style={{ color: '#475569', fontSize: '15px', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <i className="bi bi-arrow-left"></i> Back to Roles
        </Link>
      </div>
      {!isRegister ? (
        // LOGIN CARD
        <div className="auth-card-custom">
          <h3>Admin Login</h3>
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-3">
              <label>Login With</label>
              <select
                value={loginType}
                onChange={(e) => setLoginType(e.target.value)}
                className="form-select"
              >
                <option value="email">Email (Gmail)</option>
                <option value="mobile">Mobile Number</option>
              </select>
            </div>

            {loginType === 'email' ? (
              <div className="mb-3">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="example@gmail.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="mb-3">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="10-digit number"
                  pattern="[0-9]{10}"
                  value={loginMobile}
                  onChange={(e) => setLoginMobile(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                />
              </div>
            )}

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-main-custom w-100">
              Login
            </button>

            <div className="text-center mt-3">
              <span className="toggle-link-custom" onClick={() => setIsRegister(true)}>
                New Member? Register
              </span>
            </div>
          </form>
        </div>
      ) : (
        // REGISTER CARD
        <div className="auth-card-custom">
          <h3>Register New Admin</h3>
          <form onSubmit={handleRegisterSubmit}>
            <div className="mb-3">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter full name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label>Email Address (Gmail)</label>
              <input
                type="email"
                className="form-control"
                placeholder="example@gmail.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label>Mobile Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="10-digit number"
                pattern="[0-9]{10}"
                value={regMobile}
                onChange={(e) => setRegMobile(e.target.value.replace(/[^0-9]/g, ''))}
                required
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Create password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-main-custom w-100">
              Register
            </button>

            <div className="text-center mt-3">
              <span className="toggle-link-custom" onClick={() => setIsRegister(false)}>
                Back to Login
              </span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
