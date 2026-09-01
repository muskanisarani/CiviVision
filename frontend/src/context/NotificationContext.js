import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [activeModal, setActiveModal] = useState(null);

  // Add Toast Notification
  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts(prev => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Show Designed Modal Dialog
  const showAlert = useCallback(({ title, message, type = 'info', confirmText = 'Dismiss', onConfirm }) => {
    setActiveModal({
      title: title || (type === 'error' || type === 'warning' ? 'Notice' : type === 'success' ? 'Success' : 'Information'),
      message: typeof message === 'object' ? JSON.stringify(message) : String(message || ''),
      type,
      confirmText,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        setActiveModal(null);
      }
    });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  // Seamlessly intercept any legacy window.alert calls across all pages
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (msg) => {
      if (!msg) return;
      const text = typeof msg === 'object' ? JSON.stringify(msg) : String(msg);
      const lower = text.toLowerCase();

      let title = 'Notice';
      let type = 'warning';
      let confirmText = 'Dismiss';

      if (lower.includes('reject') || lower.includes('non-civic') || lower.includes('authenticity') || lower.includes('stock')) {
        title = 'AI Verification Notice';
        type = 'warning';
      } else if (lower.includes('already') || lower.includes('register') || lower.includes('email') || lower.includes('mobile') || lower.includes('otp')) {
        title = 'Registration Notice';
        type = 'warning';
      } else if (lower.includes('password')) {
        title = 'Password Notice';
        type = 'warning';
      } else if (lower.includes('location') || lower.includes('gps')) {
        title = 'GPS Location Notice';
        type = 'info';
      } else if (lower.includes('success') || lower.includes('saved') || lower.includes('updated') || lower.includes('resolved') || lower.includes('submitted')) {
        title = 'Success';
        type = 'success';
        confirmText = 'Continue';
      } else if (lower.includes('fail') || lower.includes('error')) {
        title = 'Action Notice';
        type = 'error';
      }

      showAlert({
        title,
        message: text,
        type,
        confirmText
      });
    };

    return () => {
      window.alert = originalAlert;
    };
  }, [showAlert]);

  return (
    <NotificationContext.Provider value={{ showToast, showAlert, closeModal }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '420px',
        width: 'calc(100% - 48px)',
        pointerEvents: 'none'
      }}>
        {toasts.map(toast => {
          let bg = 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)';
          let border = '1px solid rgba(255, 255, 255, 0.15)';
          let icon = 'ℹ️';
          let textColor = '#ffffff';

          if (toast.type === 'success') {
            bg = 'linear-gradient(135deg, rgba(6, 78, 59, 0.95) 0%, rgba(4, 120, 87, 0.95) 100%)';
            border = '1px solid rgba(52, 211, 153, 0.4)';
            icon = '✅';
          } else if (toast.type === 'error') {
            bg = 'linear-gradient(135deg, rgba(127, 29, 29, 0.95) 0%, rgba(185, 28, 28, 0.95) 100%)';
            border = '1px solid rgba(248, 113, 113, 0.4)';
            icon = '⚠️';
          } else if (toast.type === 'warning') {
            bg = 'linear-gradient(135deg, rgba(120, 53, 15, 0.95) 0%, rgba(180, 83, 9, 0.95) 100%)';
            border = '1px solid rgba(251, 191, 36, 0.4)';
            icon = '⚠️';
          }

          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: 'auto',
                background: bg,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border,
                borderRadius: '16px',
                padding: '14px 18px',
                color: textColor,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                fontSize: '13.5px',
                fontWeight: '600',
                lineHeight: '1.4'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>{icon}</span>
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* Beautiful Designed Custom Alert Modal */}
      {activeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999999,
          padding: '20px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            background: 'var(--bg-glass, rgba(255, 255, 255, 0.95))',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '24px',
            padding: '32px 28px',
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.2)',
            animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '20px',
              margin: '0 auto 16px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              background: activeModal.type === 'error' || activeModal.type === 'warning'
                ? 'rgba(239, 68, 68, 0.12)'
                : activeModal.type === 'success'
                ? 'rgba(16, 185, 129, 0.12)'
                : 'rgba(99, 102, 241, 0.12)'
            }}>
              {activeModal.type === 'error' || activeModal.type === 'warning' ? '⚠️' : activeModal.type === 'success' ? '✅' : '📢'}
            </div>

            <h3 style={{
              fontSize: '19px',
              fontWeight: '800',
              color: 'var(--text-primary, #0f172a)',
              margin: '0 0 8px 0',
              letterSpacing: '-0.3px'
            }}>
              {activeModal.title}
            </h3>

            <p style={{
              fontSize: '14px',
              color: 'var(--text-muted, #64748b)',
              lineHeight: '1.6',
              margin: '0 0 24px 0'
            }}>
              {activeModal.message}
            </p>

            <button
              onClick={activeModal.onConfirm}
              style={{
                width: '100%',
                padding: '13px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)',
                transition: 'transform 0.15s ease'
              }}
            >
              {activeModal.confirmText || 'Dismiss'}
            </button>
          </div>
        </div>
      )}

      <style jsx="true" global="true">{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
