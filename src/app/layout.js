import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import GlobalHeader from "../components/GlobalHeader";

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
                <p className="footer-text">© 2026 CiviVision | Swachh Bharat Mission | GMC Municipal Portal</p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
