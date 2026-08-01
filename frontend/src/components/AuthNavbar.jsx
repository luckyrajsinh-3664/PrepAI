import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, Sun, Moon, ArrowRight } from 'lucide-react';

export default function AuthNavbar() {
  const { darkMode, toggleDarkMode } = useContext(AuthContext);

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white/90 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-300/80 dark:border-white/10 shadow-sm shadow-cyan-950/[0.03] dark:shadow-none transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 text-white shadow-md shadow-cyan-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex items-center">
            <span className="text-base sm:text-lg font-black tracking-wide text-slate-900 dark:text-white">
              Prep<span className="text-cyan-600 dark:text-cyan-500">AI</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider ml-2 px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30 dark:border-cyan-500/20">
              Creole Internship
            </span>
          </div>
        </Link>

        {/* Action Controls: Light/Dark Mode Toggle + Get Started */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Light/Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 sm:p-2.5 rounded-xl border border-slate-300/80 dark:border-white/10 bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/50 transition-all shadow-sm cursor-pointer"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-800" />}
          </button>

          {/* Single "Get Started" Button pointing to Login with elevated light-mode glow */}
          <Link
            to="/login"
            className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-500 shadow-md shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 sm:gap-2"
          >
            <span>Get Started</span> <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
}