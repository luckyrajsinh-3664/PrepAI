import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { FLAT_ROLES_LIST } from '../utils/rolesData';
import { User, Save, Loader2, Target, ChevronDown, Search, Check } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [rolesList, setRolesList] = useState(FLAT_ROLES_LIST);
  const [loading, setLoading] = useState(false);

  // Custom Dropdown State & Ref
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Sync component state when context user changes or loads
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      const userRole = user.targetRole || 'Full Stack Developer';
      setTargetRole(userRole);

      if (!FLAT_ROLES_LIST.includes(userRole)) {
        setRolesList([userRole, ...FLAT_ROLES_LIST]);
      }
    }
  }, [user]);

  // Handle clicking outside custom dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const res = await API.put('/auth/profile', { name, targetRole });

      const updatedData = res.data?.user || res.data?.data || res.data;

      if (updateUser) {
        updateUser(updatedData);
      }

      toast.success('Profile updated successfully');
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = rolesList.filter((r) =>
    r.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto px-4 pb-12">
      <div className="p-1">
        <div className="glass-card hover-glow p-5 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-6 bg-white/80 dark:bg-slate-900/70 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 hover:scale-[1.01]">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-6 h-6 text-cyan-600 dark:text-cyan-400 shrink-0" /> User Profile & Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
              Update your profile info and target role to customize your AI mock interview experience.
            </p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-gray-300 block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />
            </div>

            {/* Custom Searchable Target Job Role Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <label className="text-xs font-semibold text-slate-700 dark:text-gray-300 flex items-center gap-1.5 mb-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-500" />
                Target Job Role (70+ Roles)
              </label>

              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full p-3.5 bg-slate-50 dark:bg-slate-950/80 border rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none transition cursor-pointer flex items-center justify-between text-left ${
                  isDropdownOpen
                    ? 'border-cyan-500 ring-2 ring-cyan-500/20'
                    : 'border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20'
                }`}
              >
                <span className="truncate font-medium">{targetRole}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                    isDropdownOpen ? 'rotate-180 text-cyan-500' : ''
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 p-2.5 space-y-2 max-h-64 overflow-hidden flex flex-col backdrop-blur-2xl">
                  {/* Fixed Search Bar */}
                  <div className="relative flex items-center bg-slate-100 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2 shrink-0 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500">
                    <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                    <input
                      type="text"
                      placeholder="Search target role..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-transparent text-slate-900 dark:text-white text-xs focus:outline-none placeholder:text-slate-400 dark:placeholder:text-gray-500"
                      autoFocus
                    />
                  </div>

                  {/* Scrollable Role List */}
                  <div className="overflow-y-auto space-y-1 flex-1 pr-1 custom-scrollbar">
                    {filteredRoles.length > 0 ? (
                      filteredRoles.map((role, i) => {
                        const isSelected = targetRole === role;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setTargetRole(role);
                              setIsDropdownOpen(false);
                              setSearchTerm('');
                            }}
                            className={`w-full text-left px-3 py-2.5 text-xs rounded-xl transition flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold'
                                : 'text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            <span className="truncate">{role}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-cyan-500 shrink-0 ml-2" />}
                          </button>
                        );
                      })
                    ) : (
                      <div className="text-xs text-slate-400 dark:text-gray-500 p-3 text-center">
                        No matching roles found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-500 font-bold text-white text-xs sm:text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 flex items-center justify-center gap-2 hover:opacity-95 cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Profile
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}