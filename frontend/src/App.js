import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { NotificationProvider } from './context/NotificationContext.js';
import GlobalHeader from './components/GlobalHeader.js';

// Views
import Home from './views/Home.js';
import SelectRole from './views/SelectRole.js';
import Contact from './views/Contact.js';
import Faqs from './views/Faqs.js';
import HowToUse from './views/HowToUse.js';

// User Views
import UserLogin from './views/user/UserLogin.js';
import UserRegister from './views/user/UserRegister.js';
import UserDashboard from './views/user/UserDashboard.js';
import UserComplaint from './views/user/UserComplaint.js';
import ViewStatus from './views/user/ViewStatus.js';
import ToiletTracker from './views/user/ToiletTracker.js';
import AlertsPage from './views/user/AlertsPage.js';
import Notifications from './views/user/Notifications.js';
import Profile from './views/user/Profile.js';
import Feedback from './views/user/Feedback.js';
import Search from './views/user/Search.js';
import InfoCenter from './views/user/InfoCenter.js';
import Settings from './views/user/Settings.js';
import Leaderboard from './views/user/Leaderboard.js';

// Admin Views
import AdminLogin from './views/admin/AdminLogin.js';
import AdminDashboard from './views/admin/AdminDashboard.js';
import AdminAnalytics from './views/admin/AdminAnalytics.js';
import AdminSettings from './views/admin/AdminSettings.js';

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter>
            <GlobalHeader />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/select-role" element={<SelectRole />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faqs" element={<Faqs />} />
              <Route path="/how-to-use" element={<HowToUse />} />

              {/* User Routes */}
              <Route path="/user/login" element={<UserLogin />} />
              <Route path="/user/register" element={<UserRegister />} />
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/complaint" element={<UserComplaint />} />
              <Route path="/user/view-status" element={<ViewStatus />} />
              <Route path="/user/leaderboard" element={<Leaderboard />} />
              <Route path="/user/toilet-tracker" element={<ToiletTracker />} />
              <Route path="/user/alerts" element={<AlertsPage />} />
              <Route path="/user/notifications" element={<Notifications />} />
              <Route path="/user/profile" element={<Profile />} />
              <Route path="/user/feedback" element={<Feedback />} />
              <Route path="/user/search" element={<Search />} />
              <Route path="/user/info-center" element={<InfoCenter />} />
              <Route path="/user/settings" element={<Settings />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/settings" element={<AdminSettings />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
