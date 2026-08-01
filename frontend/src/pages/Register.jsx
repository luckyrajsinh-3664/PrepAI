import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';
import AuthNavbar from '../components/AuthNavbar';
import { FLAT_ROLES_LIST } from '../utils/rolesData';
import { Eye, EyeOff, Lock, Mail, User, Sparkles, Briefcase, Loader2 } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/register', { name, email, password, targetRole });
      toast.success('Registration successful! Please login with your credentials.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center px-4 pt-20 sm:pt-24 pb-8 sm:pb-12 overflow-y-auto">
      <AuthNavbar />

      {/* Glassmorphic Auth Card */}
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl relative z-10 border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl shadow-2xl transition-all my-auto">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 text-white mb-2 shadow-lg shadow-cyan-500/25">
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-slate-600 dark:text-gray-300 text-xs sm:text-sm mt-1">Join Creole Ventures Prep Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-gray-200 block mb-1 uppercase tracking-wider">
              Full Name
            </label>
            <div className="flex items-center gap-3 px-3.5 py-3 bg-slate-100/80 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-xl focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
              <User className="w-5 h-5 text-slate-400 dark:text-gray-400 shrink-0" />
              <input
                type="text"
                required
                disabled={loading}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-gray-500 p-0 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-gray-200 block mb-1 uppercase tracking-wider">
              Email Address
            </label>
            <div className="flex items-center gap-3 px-3.5 py-3 bg-slate-100/80 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-xl focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
              <Mail className="w-5 h-5 text-slate-400 dark:text-gray-400 shrink-0" />
              <input
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-gray-500 p-0 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>

          {/* Target Role */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-gray-200 block mb-1 uppercase tracking-wider">
              Target Role
            </label>
            <div className="flex items-center gap-3 px-3.5 py-3 bg-slate-100/80 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-xl focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
              <Briefcase className="w-5 h-5 text-slate-400 dark:text-gray-400 shrink-0" />
              <select
                value={targetRole}
                disabled={loading}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white text-sm p-0 focus:ring-0 focus:outline-none cursor-pointer"
              >
                {FLAT_ROLES_LIST && FLAT_ROLES_LIST.length > 0 ? (
                  FLAT_ROLES_LIST.map((role, idx) => (
                    <option key={idx} value={role} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {role}
                    </option>
                  ))
                ) : (
                  <option value="Full Stack Developer">Full Stack Developer</option>
                )}
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-gray-200 block mb-1 uppercase tracking-wider">
              Password
            </label>
            <div className="flex items-center gap-3 px-3.5 py-3 bg-slate-100/80 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-xl focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
              <Lock className="w-5 h-5 text-slate-400 dark:text-gray-400 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-gray-500 p-0 focus:ring-0 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white transition-colors shrink-0 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 font-bold text-white shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Creating Account...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-4">
          Already registered?{' '}
          <Link to="/login" className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}