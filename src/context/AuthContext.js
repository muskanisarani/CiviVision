"use client";
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in from localStorage on page load
    const userRole = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName') || 'Citizen';

    if (userRole && email) {
      setCurrentUser({ name, email, role: userRole });
    }
  }, []);

  const loginUser = (email, password) => {
    // Simulating login validation (same as in legacy user.js)
    if (!email.endsWith('@gmail.com')) {
      alert('Email must end with @gmail.com');
      return false;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return false;
    }

    const userData = { name: 'Citizen', email, role: 'user' };
    setCurrentUser(userData);
    localStorage.setItem('userRole', 'user');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', 'Citizen');
    return true;
  };

  const registerUser = (name, email, mobile, password) => {
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

    alert('Registration successful!');
    return true;
  };

  const loginAdmin = (type, value, password) => {
    const savedAdmins = JSON.parse(localStorage.getItem('registeredAdmins') || '[]');
    let valid = false;
    let name = 'Admin';

    if (type === 'email') {
      if (!value.endsWith('@gmail.com')) {
        alert('Please use a valid Gmail address.');
        return false;
      }
      const admin = savedAdmins.find(a => a.email === value && a.password === password);
      if (admin) {
        valid = true;
        name = admin.name;
      }
    } else {
      const admin = savedAdmins.find(a => a.mobile === value && a.password === password);
      if (admin) {
        valid = true;
        name = admin.name;
      }
    }

    if (valid) {
      const adminData = { name, email: type === 'email' ? value : 'admin@gmail.com', role: 'admin' };
      setCurrentUser(adminData);
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userEmail', adminData.email);
      localStorage.setItem('userName', name);
      return true;
    } else {
      alert('Invalid credentials! Please register first.');
      return false;
    }
  };

  const registerAdmin = (name, email, mobile, password) => {
    if (!email.endsWith('@gmail.com')) {
      alert('Please use a valid Gmail address.');
      return false;
    }

    const newAdmin = { name, email, mobile, password };
    const savedAdmins = JSON.parse(localStorage.getItem('registeredAdmins') || '[]');
    savedAdmins.push(newAdmin);
    localStorage.setItem('registeredAdmins', JSON.stringify(savedAdmins));

    const adminData = { name, email, role: 'admin' };
    setCurrentUser(adminData);
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
    alert('Registration successful!');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
  };

  return (
    <AuthContext.Provider value={{ currentUser, loginUser, registerUser, loginAdmin, registerAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
