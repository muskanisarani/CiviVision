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

  const loginUser = (value, password) => {
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

    const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = savedUsers.find(u => {
      if (isEmail) {
        return u.email.toLowerCase() === value.toLowerCase() && u.password === password;
      } else {
        return u.mobile === value && u.password === password;
      }
    });

    let name = 'Citizen';
    let emailAddress = isEmail ? value : 'citizen@gmail.com';
    let phone = isEmail ? '9876543210' : value;
    let ward = 'Sector 5';

    if (user) {
      name = user.name;
      emailAddress = user.email;
      phone = user.mobile;
      ward = user.city + ', ' + user.state;
    } else {
      if (!isEmail) {
        alert('Mobile credentials not found. Please register first.');
        return false;
      }
    }

    const userData = { name, email: emailAddress, role: 'user' };
    setCurrentUser(userData);
    localStorage.setItem('userRole', 'user');
    localStorage.setItem('userEmail', emailAddress);
    localStorage.setItem('userName', name);
    localStorage.setItem('userPhone', phone);
    localStorage.setItem('userWard', ward);
    return true;
  };

  const registerUser = (name, email, mobile, password, city, state) => {
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

    const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (savedUsers.some(u => u.email === email)) {
      alert('Email already registered!');
      return false;
    }

    const newUser = { name, email, mobile, password, city, state };
    savedUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(savedUsers));

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

  const updateUser = (name, additionalData = {}) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, name, ...additionalData };
      setCurrentUser(updatedUser);
      localStorage.setItem('userName', name);
      if (additionalData.phone) localStorage.setItem('userPhone', additionalData.phone);
      if (additionalData.ward) localStorage.setItem('userWard', additionalData.ward);
      if (additionalData.language) localStorage.setItem('userLanguage', additionalData.language);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userWard');
    localStorage.removeItem('userLanguage');
  };

  return (
    <AuthContext.Provider value={{ currentUser, loginUser, registerUser, loginAdmin, registerAdmin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
