"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import UserBottomNav from '../../components/UserBottomNav';

const Search = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const styles = {
    body: {
      minHeight: '100vh',
      paddingBottom: '90px', // space for navbar
      fontFamily: 'Segoe UI, sans-serif',
    },
    header: {
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
      color: '#0f172a',
      padding: '18px 25px',
      borderBottomLeftRadius: '24px',
      borderBottomRightRadius: '24px',
    },
    title: {
      margin: 0,
      fontSize: '18px',
      fontWeight: '800',
      letterSpacing: '-0.25px',
    },
    subtitle: {
      margin: '4px 0 0',
      fontSize: '13px',
      color: '#475569',
    },
    container: {
      padding: '24px 20px',
      maxWidth: '600px',
      margin: 'auto',
    },
    searchBox: {
      backgroundColor: 'rgba(255, 255, 255, 0.65)',
      border: '1px solid rgba(15, 23, 42, 0.12)',
      borderRadius: '30px',
      padding: '12px 18px',
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      boxShadow: '0 4px 15px rgba(15, 23, 42, 0.03)',
      marginBottom: '20px',
      transition: 'all 0.2s',
    },
    input: {
      border: 'none',
      outline: 'none',
      fontSize: '15px',
      width: '100%',
      backgroundColor: 'transparent',
      color: '#0f172a',
    },
    result: {
      backgroundColor: 'rgba(255, 255, 255, 0.55)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(15, 23, 42, 0.08)',
      borderRadius: '18px',
      padding: '16px 20px',
      marginTop: '12px',
      boxShadow: '0 4px 10px rgba(15, 23, 42, 0.03)',
      transition: 'transform 0.2s',
    }
  };

  const allItems = [
    { title: 'Garbage Issue – Market Area', status: 'In Progress' },
    { title: 'Streetlight – Sector 9', status: 'Resolved' },
    { title: 'Water Leakage – Main Road', status: 'Resolved' },
    { title: 'Pothole – High Street', status: 'Pending' }
  ];

  const filteredItems = allItems.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.status.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={styles.body}>
      {/* HEADER */}
      <div style={{ ...styles.header, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ cursor: 'pointer', fontSize: '22px' }} onClick={() => router.push('/user/dashboard')}>←</div>
        <div>
          <h3 style={styles.title}>Search</h3>
          <p style={styles.subtitle}>Find complaints, locations</p>
        </div>
      </div>

      {/* CONTENT */}
      <div style={styles.container}>
        <div style={styles.searchBox} className="search-focus">
          <i className="bi bi-search" style={{ color: '#818cf8' }}></i>
          <input
            type="text"
            placeholder="Search complaint or location"
            style={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {filteredItems.map((item, idx) => (
          <div key={idx} style={styles.result} className="search-result">
            <strong style={{ color: '#1e293b' }}>{item.title}</strong>
            <p style={{ margin: '5px 0 0', fontSize: '13px', color: '#64748b' }}>
              Status: {item.status}
            </p>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center mt-4" style={{ color: '#64748b' }}>
            No complaints found matching "{query}"
          </div>
        )}
      </div>

      <UserBottomNav />

      <style jsx global>{`
        .search-focus:focus-within {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important;
        }
        .search-result:hover {
          transform: translateY(-2px);
          border-color: rgba(99, 102, 241, 0.25) !important;
          background-color: rgba(255, 255, 255, 0.8) !important;
        }
      `}</style>
    </div>
  );
};

export default Search;
