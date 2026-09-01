import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [redeemSuccess, setRedeemSuccess] = useState(null);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setLeaderboard(data.leaderboard);
        }
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Fetch leaderboard error:', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleRedeem = (title, cost) => {
    const userCredits = currentUser?.credits || 50;
    if (userCredits < cost) {
      alert(`Insufficient Swachh Credits. You have ${userCredits} Credits, but ${cost} Credits are required.`);
      return;
    }
    setRedeemSuccess(`🎉 Successfully Claimed: "${title}"! Check your registered email for your municipal digital certificate/voucher.`);
  };

  const userCredits = currentUser?.credits || 50;
  const userRankTitle = currentUser?.rankTitle || 'Civic Scout';
  const userReports = currentUser?.verifiedReportsCount || 0;

  const styles = {
    body: {
      minHeight: '100vh',
      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
      padding: '20px 16px',
      paddingBottom: '80px'
    },
    container: {
      maxWidth: '850px',
      margin: '0 auto'
    },
    headerCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRadius: '24px',
      padding: '24px',
      border: '1px solid rgba(15, 23, 42, 0.08)',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px'
    },
    walletCard: {
      background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
      borderRadius: '20px',
      padding: '24px',
      color: '#ffffff',
      marginBottom: '24px',
      boxShadow: '0 12px 30px rgba(79, 70, 229, 0.25)',
      position: 'relative',
      overflow: 'hidden'
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRadius: '20px',
      padding: '22px',
      border: '1px solid rgba(15, 23, 42, 0.08)',
      boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)',
      marginBottom: '24px'
    },
    rewardCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.65)',
      borderRadius: '16px',
      padding: '16px',
      border: '1px solid rgba(15, 23, 42, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%'
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>

        {/* TOP HEADER */}
        <div style={styles.headerCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => navigate(-1)} 
              style={{ background: 'none', border: 'none', color: '#0f172a', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <i className="bi bi-arrow-left"></i>
            </button>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                🏅 Swachhata Citizen Leaderboard
              </h2>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Earn Swachh Credits by reporting verified municipal defects
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/user/complaint')}
            style={{
              backgroundColor: '#6366f1',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            + Earn +50 Credits
          </button>
        </div>

        {/* USER'S LIVE WALLET BADGE */}
        <div style={styles.walletCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.85, fontWeight: '700' }}>
                Your Civic Karma Wallet
              </span>
              <h1 style={{ fontSize: '36px', fontWeight: '900', margin: '4px 0 2px 0' }}>
                {userCredits} <span style={{ fontSize: '20px', fontWeight: '600' }}>Credits</span>
              </h1>
              <div style={{ fontSize: '13px', opacity: 0.95 }}>
                Current Tier: <strong>{userRankTitle}</strong> • {userReports} Verified Reports
              </div>
            </div>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              padding: '10px 18px',
              borderRadius: '14px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '22px', display: 'block' }}>
                {userCredits >= 1000 ? '🏆' : (userCredits >= 500 ? '🥇' : (userCredits >= 250 ? '🥈' : '🥉'))}
              </span>
              <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
                {userRankTitle}
              </span>
            </div>
          </div>

          {/* Progress Bar to next tier */}
          <div style={{ marginTop: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>
              <span>Progress to Gold Champion (500 Credits)</span>
              <span>{Math.min(100, Math.round((userCredits / 500) * 100))}%</span>
            </div>
            <div className="progress" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: '4px' }}>
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${Math.min(100, Math.round((userCredits / 500) * 100))}%`,
                  backgroundColor: '#ffffff',
                  borderRadius: '4px'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* CITY LEADERBOARD TABLE */}
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
              🌟 Gandhinagar Top Civic Champions
            </h4>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Live Ward Standings</span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle" style={{ margin: 0 }}>
              <thead className="table-light">
                <tr>
                  <th style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Rank</th>
                  <th style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Citizen & Ward</th>
                  <th style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Tier</th>
                  <th style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Verified Reports</th>
                  <th style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Swachh Credits</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4" style={{ color: '#64748b', fontSize: '13px' }}>
                      No ranked citizens found.
                    </td>
                  </tr>
                ) : (
                  leaderboard.map(citizen => {
                    const isSelf = citizen.id === currentUser?.id || citizen.email === currentUser?.email;

                    return (
                      <tr key={citizen.id} style={{ backgroundColor: isSelf ? 'rgba(99, 102, 241, 0.08)' : 'transparent' }}>
                        <td>
                          <span style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '12px',
                            backgroundColor: citizen.rank === 1 ? '#fef3c7' : (citizen.rank === 2 ? '#f1f5f9' : (citizen.rank === 3 ? '#ffedd5' : '#f8fafc')),
                            color: citizen.rank === 1 ? '#b45309' : (citizen.rank === 2 ? '#475569' : (citizen.rank === 3 ? '#c2410c' : '#64748b')),
                            border: '1px solid rgba(15,23,42,0.1)'
                          }}>
                            {citizen.rank === 1 ? '🥇' : (citizen.rank === 2 ? '🥈' : (citizen.rank === 3 ? '🥉' : citizen.rank))}
                          </span>
                        </td>
                        <td>
                          <strong style={{ fontSize: '13px', color: '#0f172a' }}>
                            {citizen.name} {isSelf && <span className="badge bg-primary" style={{ fontSize: '9px', marginLeft: '4px' }}>YOU</span>}
                          </strong>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            📍 {citizen.ward || 'Sector 5'}, {citizen.city || 'Gandhinagar'}
                          </div>
                        </td>
                        <td>
                          <span className="badge" style={{
                            backgroundColor: citizen.credits >= 1000 ? '#f3e8ff' : (citizen.credits >= 500 ? '#fef3c7' : '#e0e7ff'),
                            color: citizen.credits >= 1000 ? '#7e22ce' : (citizen.credits >= 500 ? '#b45309' : '#4338ca'),
                            border: '1px solid rgba(15,23,42,0.08)',
                            fontSize: '11px'
                          }}>
                            {citizen.badgeIcon} {citizen.tier}
                          </span>
                        </td>
                        <td style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
                          {citizen.verifiedReportsCount || 0} issues
                        </td>
                        <td>
                          <strong style={{ fontSize: '14px', color: '#4f46e5' }}>
                            {citizen.credits}
                          </strong>
                          <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '3px' }}>pts</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* REDEEM MUNICIPAL REWARDS SECTION */}
        <div style={styles.card}>
          <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '6px', color: '#0f172a' }}>
            🎁 Municipal Reward Redemption Catalog
          </h4>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
            Use your earned Swachh Credits to unlock smart city government incentives & certificates.
          </p>

          <div className="row g-3">
            <div className="col-md-4">
              <div style={styles.rewardCard}>
                <div>
                  <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>🧾</span>
                  <h5 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>
                    5% Property Tax Rebate
                  </h5>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                    Discount coupon code applied to next fiscal year GMC property tax bill.
                  </p>
                </div>
                <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#4f46e5' }}>500 Pts</span>
                  <button
                    type="button"
                    onClick={() => handleRedeem('5% Property Tax Rebate', 500)}
                    style={{
                      backgroundColor: '#6366f1',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Redeem
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div style={styles.rewardCard}>
                <div>
                  <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>🏆</span>
                  <h5 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>
                    GMC SBM Eco-Champion Certificate
                  </h5>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                    Official government verified certificate for resume & academic honours.
                  </p>
                </div>
                <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#4f46e5' }}>750 Pts</span>
                  <button
                    type="button"
                    onClick={() => handleRedeem('GMC SBM Eco-Champion Certificate', 750)}
                    style={{
                      backgroundColor: '#6366f1',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Redeem
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div style={styles.rewardCard}>
                <div>
                  <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>🚌</span>
                  <h5 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>
                    Free 1-Month City Bus Pass
                  </h5>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                    Unlimited travel pass on Gandhinagar Municipal EV City bus routes.
                  </p>
                </div>
                <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#4f46e5' }}>1000 Pts</span>
                  <button
                    type="button"
                    onClick={() => handleRedeem('1-Month City Bus Pass', 1000)}
                    style={{
                      backgroundColor: '#6366f1',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Redeem
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* REDEEM SUCCESS MODAL */}
      {redeemSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '28px',
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎉</div>
            <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
              Reward Voucher Issued
            </h4>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', marginBottom: '20px' }}>
              {redeemSuccess}
            </p>
            <button
              onClick={() => setRedeemSuccess(null)}
              style={{
                width: '100%',
                backgroundColor: '#6366f1',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
