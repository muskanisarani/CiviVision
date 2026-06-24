"use client";
import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
import '../../user.css';

const UserLogin = () => {
  const { loginUser } = useContext(AuthContext);
  const router = useRouter();

  const [loginType, setLoginType] = useState('email');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const loginValue = loginType === 'email' ? email : mobile;
    const success = loginUser(loginValue, password);
    if (success) {
      router.push('/user/dashboard');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ position: 'relative', minHeight: 'calc(100vh - 150px)' }}>
      <div className="auth-card-custom">
        <h3>User Login</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Login With</label>
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
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          ) : (
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
          )}

          <div className="mb-3 password-field">
            <label className="form-label">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              placeholder="Enter password"
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

          <button type="submit" className="btn-main-custom w-100">Login</button>

          <div className="text-center mt-3">
            <Link href="/user/register" className="toggle-link-custom">New user? Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
