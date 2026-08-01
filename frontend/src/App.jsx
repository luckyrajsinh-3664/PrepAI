import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthNavbar from './components/AuthNavbar';
import AnimatedBackground from './components/AnimatedBackground';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import Results from './pages/Results';
import History from './pages/History';
import Profile from './pages/Profile';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import { Toaster } from 'react-hot-toast';
import { ArrowUp } from 'lucide-react';

// Automatically scrolls window to top when changing routes
const ScrollToTopOnNavigate = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Floating Back-to-Top Button Component (Bottom Middle)
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      if (scrolled > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 p-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-xl shadow-cyan-500/30 border border-white/20 backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 hover:shadow-cyan-500/60 cursor-pointer flex items-center justify-center ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5 stroke-[2.5]" />
    </button>
  );
};

// Protect routes that require user login
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Redirect logged-in users away ONLY from authentication pages (login & register)
const AuthOnlyRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Pages that display the public AuthNavbar when user is not logged in
  const publicPaths = ['/', '/login', '/register'];
  const isPublicPage = publicPaths.includes(location.pathname);

  return (
    <div className="relative min-h-screen pb-12 transition-colors duration-300">
      {/* Resets scroll position on route navigation */}
      <ScrollToTopOnNavigate />

      {/* Interactive Particle Constellation & Ambient Orbs Background */}
      <AnimatedBackground />

      {/* Global Bottom-Middle Scroll To Top Button */}
      <ScrollToTop />

      {/* Dynamic Toast Notifications */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'react-hot-toast-card',
          duration: 3500,
          style: {
            padding: '12px 16px',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />

      {/* Conditional Navbar rendering */}
      {isPublicPage && !user ? <AuthNavbar /> : <Navbar />}

      {/* Core Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Authentication Routes */}
          <Route 
            path="/login" 
            element={
              <AuthOnlyRoute>
                <Login />
              </AuthOnlyRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <AuthOnlyRoute>
                <Register />
              </AuthOnlyRoute>
            } 
          />

          {/* Protected Application Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/interview" 
            element={
              <ProtectedRoute>
                <Interview />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/results/:attemptId" 
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/resume" 
            element={
              <ProtectedRoute>
                <ResumeAnalyzer />
              </ProtectedRoute>
            } 
          />

          {/* Fallback Catch-all Route */}
          <Route 
            path="*" 
            element={<Navigate to={user ? "/dashboard" : "/"} replace />} 
          />
        </Routes>
      </main>
    </div>
  );
}