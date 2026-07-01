"use client";
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from backend session cookie on load
    async function checkSession() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setCurrentUser(data.user);
            // Sync local storage for non-critical legacy layout hooks
            localStorage.setItem('userRole', data.user.role);
            localStorage.setItem('userEmail', data.user.email);
            localStorage.setItem('userName', data.user.name);
            localStorage.setItem('userPhone', data.user.mobile);
            localStorage.setItem('userWard', data.user.ward);
            localStorage.setItem('userAvatarType', data.user.avatarType);
            localStorage.setItem('userAvatarBadge', data.user.avatarBadge);
            localStorage.setItem('userAvatarUrl', data.user.avatarUrl || '');
          }
        } else {
          // If session is invalid, clear state
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  const loginUser = async (value, password) => {
    const isEmail = value.includes('@');
    
    if (isEmail) {
      if (!value.endsWith('@gmail.com')) {
        alert('Email must end with @gmail.com');
        return false;
      }
    } else {
      if (value.length !== 10 || !/^\d+$/.test(value)) {
        alert('Please enter a valid 10-digit mobile number or Gmail address.');
        return false;
      }
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return false;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, password, isAdminLogin: false })
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Login failed');
        return false;
      }

      setCurrentUser(data.user);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userPhone', data.user.mobile);
      localStorage.setItem('userWard', data.user.ward);
      localStorage.setItem('userAvatarType', data.user.avatarType);
      localStorage.setItem('userAvatarBadge', data.user.avatarBadge);
      localStorage.setItem('userAvatarUrl', data.user.avatarUrl || '');
      return true;

    } catch (error) {
      console.error('Login error:', error);
      alert('Network error during login.');
      return false;
    }
  };

  const registerUser = async (name, email, mobile, password, city, state) => {
    if (!email.endsWith('@gmail.com')) {
      alert('Email must end with @gmail.com');
      return false;
    }
    if (mobile.length !== 10) {
      alert('Mobile number must be exactly 10 digits');
      return false;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return false;
    }
    if (!city || !state) {
      alert('City and State are compulsory fields');
      return false;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, mobile, password, city, state, role: 'user' })
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Registration failed');
        return false;
      }

      setCurrentUser(data.user);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userPhone', data.user.mobile);
      localStorage.setItem('userWard', data.user.ward);
      localStorage.setItem('userAvatarType', data.user.avatarType || 'badge');
      localStorage.setItem('userAvatarBadge', data.user.avatarBadge || 'initials');
      localStorage.setItem('userAvatarUrl', data.user.avatarUrl || '');
      alert('Registration successful!');
      return true;

    } catch (error) {
      console.error('Registration error:', error);
      alert('Network error during registration.');
      return false;
    }
  };

  const loginAdmin = async (type, value, password) => {
    if (type === 'email' && !value.endsWith('@gmail.com')) {
      alert('Please use a valid Gmail address.');
      return false;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, password, isAdminLogin: true })
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Admin login failed');
        return false;
      }

      setCurrentUser(data.user);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userName', data.user.name);
      return true;

    } catch (error) {
      console.error('Admin login error:', error);
      alert('Network error during admin login.');
      return false;
    }
  };

  const registerAdmin = async (name, email, mobile, password) => {
    if (!email.endsWith('@gmail.com')) {
      alert('Please use a valid Gmail address.');
      return false;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          mobile,
          password,
          city: 'Gandhinagar',
          state: 'Gujarat',
          role: 'admin'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Admin registration failed');
        return false;
      }

      setCurrentUser(data.user);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userName', data.user.name);
      alert('Registration successful!');
      return true;

    } catch (error) {
      console.error('Admin registration error:', error);
      alert('Network error during admin registration.');
      return false;
    }
  };

  const updateUser = async (name, additionalData = {}) => {
    if (!currentUser) return;

    try {
      // Map properties for database update request
      const payload = {
        name,
        mobile: additionalData.phone,
        ward: additionalData.ward,
        language: additionalData.language,
        avatarType: additionalData.avatarType,
        avatarBadge: additionalData.avatarBadge,
        avatarUrl: additionalData.avatarUrl
      };

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Failed to update profile');
        return;
      }

      setCurrentUser(data.user);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userPhone', data.user.mobile);
      localStorage.setItem('userWard', data.user.ward);
      localStorage.setItem('userLanguage', data.user.language || 'en');
      localStorage.setItem('userAvatarType', data.user.avatarType);
      localStorage.setItem('userAvatarBadge', data.user.avatarBadge);
      localStorage.setItem('userAvatarUrl', data.user.avatarUrl || '');

    } catch (error) {
      console.error('Update profile error:', error);
      alert('Network error updating profile.');
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCurrentUser(null);
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userPhone');
      localStorage.removeItem('userWard');
      localStorage.removeItem('userLanguage');
      localStorage.removeItem('userAvatarType');
      localStorage.removeItem('userAvatarBadge');
      localStorage.removeItem('userAvatarUrl');
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, loginUser, registerUser, loginAdmin, registerAdmin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
