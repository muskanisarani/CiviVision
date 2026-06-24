import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import GlobalHeader from "../components/GlobalHeader";
import Link from 'next/link';

// Import Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export const metadata = {
  title: "CiviVision | AI for Society",
  description: "An AI-powered civic intelligence platform to report and resolve city problems.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="aurora-bg">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <GlobalHeader />
            
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {children}
            </main>
            
            <footer className="global-footer">
              <div className="footer-container">
                <div className="row text-start g-4 py-4">
                  <div className="col-md-4">
                    <h5 style={{ fontWeight: '800', fontSize: '15px', color: '#0f172a', marginBottom: '12px' }}>CiviVision</h5>
                    <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
                      An AI-powered civic intelligence platform to detect, prioritize, and resolve municipal problems. Official GMC & Swachh Bharat Mission Portal.
                    </p>
                  </div>
                  <div className="col-6 col-md-3">
                    <h5 style={{ fontWeight: '700', fontSize: '13px', color: '#0f172a', marginBottom: '12px' }}>Citizens Portal</h5>
                    <ul style={{ listStyle: 'none', padding: 0, fontSize: '13px', lineHeight: '2.2' }}>
                      <li><Link href="/user/login" style={{ color: '#475569', textDecoration: 'none' }} className="footer-link-custom">Post Complaint</Link></li>
                      <li><Link href="/user/view-status" style={{ color: '#475569', textDecoration: 'none' }} className="footer-link-custom">Track Status</Link></li>
                      <li><Link href="/user/toilet-tracker" style={{ color: '#475569', textDecoration: 'none' }} className="footer-link-custom">Toilet Tracker</Link></li>
                      <li><Link href="/user/alerts" style={{ color: '#475569', textDecoration: 'none' }} className="footer-link-custom">Active Alerts</Link></li>
                    </ul>
                  </div>
                  <div className="col-6 col-md-3">
                    <h5 style={{ fontWeight: '700', fontSize: '13px', color: '#0f172a', marginBottom: '12px' }}>Support & Resources</h5>
                    <ul style={{ listStyle: 'none', padding: 0, fontSize: '13px', lineHeight: '2.2' }}>
                      <li><Link href="/how-to-use" style={{ color: '#475569', textDecoration: 'none' }} className="footer-link-custom">How It Works</Link></li>
                      <li><Link href="/faqs" style={{ color: '#475569', textDecoration: 'none' }} className="footer-link-custom">FAQs Accordion</Link></li>
                      <li><Link href="/contact" style={{ color: '#475569', textDecoration: 'none' }} className="footer-link-custom">Help Support</Link></li>
                      <li><Link href="/admin/login" style={{ color: '#475569', textDecoration: 'none' }} className="footer-link-custom">Admin Control</Link></li>
                    </ul>
                  </div>
                  <div className="col-md-2">
                    <h5 style={{ fontWeight: '700', fontSize: '13px', color: '#0f172a', marginBottom: '12px' }}>GMC Helpline</h5>
                    <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 6px 0' }}>📞 1969 (SBM)</p>
                    <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>📧 info@gmc.gov.in</p>
                  </div>
                </div>
                <hr style={{ margin: '14px 0', borderColor: 'rgba(15, 23, 42, 0.08)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <p className="footer-text" style={{ margin: 0 }}>© 2026 CiviVision | Swachh Bharat Mission | GMC Municipal Portal</p>
                  <div style={{ display: 'flex', gap: '25px', fontSize: '12px' }}>
                    <span style={{ color: '#64748b' }}>Privacy Policy</span>
                    <span style={{ color: '#64748b' }}>Terms of Service</span>
                    <span style={{ color: '#64748b' }}>Accessibility</span>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
