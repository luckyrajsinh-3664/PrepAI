import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Sun, Moon, LogOut, LayoutDashboard, PlayCircle, 
  History, FileText, User as UserIcon, Sparkles, Menu, X 
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, darkMode, toggleDarkMode } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  // Upgraded light-mode active link styles with deeper cyan text and crisp pill background
  const isActive = (path) => 
    location.pathname === path 
      ? 'text-cyan-700 dark:text-cyan-400 bg-cyan-500/15 dark:bg-cyan-500/10 font-bold shadow-sm shadow-cyan-500/10 dark:shadow-none' 
      : 'text-slate-700 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-white/5 font-medium';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Interview', path: '/interview', icon: PlayCircle },
    { name: 'Resume Analyzer', path: '/resume', icon: FileText },
    { name: 'History', path: '/history', icon: History },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  return (
    <nav className="sticky top-0 z-50 px-4 py-3 mb-4 sm:mb-6 transition-colors duration-300 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-300/80 dark:border-white/10 shadow-sm shadow-cyan-950/[0.03] dark:shadow-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Brand Logo & Tag */}
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 text-white shadow-md shadow-cyan-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            {/* Richer Light Mode Gradient Text */}
            <span className="text-lg sm:text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 via-violet-700 to-pink-600 dark:from-cyan-400 dark:via-violet-400 dark:to-pink-400">
              PrepAI
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30 dark:border-cyan-500/20">
              Creole Internship
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links Container */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-gray-900/40 p-1.5 rounded-2xl border border-slate-300/80 dark:border-white/5 shadow-inner shadow-slate-200/50 dark:shadow-none transition-colors">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link 
                key={link.path}
                to={link.path} 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition ${isActive(link.path)}`}
              >
                <Icon className="w-4 h-4" /> {link.name}
              </Link>
            );
          })}
        </div>

        {/* Action Controls: Theme Toggle, Mobile Menu Trigger, & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={toggleDarkMode} 
            className="p-2 rounded-xl bg-slate-100 dark:bg-gray-800/60 border border-slate-300 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-gray-700/60 transition text-slate-800 dark:text-gray-300 shadow-sm cursor-pointer"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-700" />}
          </button>

          <button 
            onClick={handleLogout} 
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 dark:border-rose-500/20 hover:bg-rose-500/20 transition text-sm font-semibold cursor-pointer shadow-sm shadow-rose-500/5"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-gray-800/60 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-gray-300 shadow-sm"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-300/80 dark:border-white/10 flex flex-col gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link 
                key={link.path}
                to={link.path} 
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition ${isActive(link.path)}`}
              >
                <Icon className="w-5 h-5" /> {link.name}
              </Link>
            );
          })}
          
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }} 
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 dark:border-rose-500/20 text-sm font-semibold mt-1"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}