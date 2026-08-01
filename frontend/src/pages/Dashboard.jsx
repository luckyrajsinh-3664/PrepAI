import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import { Link } from 'react-router-dom';
import { 
  Play, 
  TrendingUp, 
  Filter, 
  Loader2, 
  Search, 
  ChevronDown, 
  Globe, 
  Target 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function Dashboard() {
  const { user, darkMode } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [marketTrends, setMarketTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('All');

  // Custom Searchable Dropdown States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const roleQuery = user?.targetRole ? `?role=${encodeURIComponent(user.targetRole)}` : '';
        const [histRes, trendRes] = await Promise.all([
          API.get('/interview/history'),
          API.get(`/market/analytics${roleQuery}`)
        ]);
        setHistory(histRes.data || []);
        
        const analyticsData = trendRes.data?.data || trendRes.data || [];
        setMarketTrends(analyticsData);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.targetRole]);

  // Close custom dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalAttempts = history.length;
  const avgScore = totalAttempts ? Math.round(history.reduce((a, b) => a + (b.overallScore || 0), 0) / totalAttempts) : 0;
  const bestScore = totalAttempts ? Math.max(...history.map(h => h.overallScore || 0)) : 0;
  const totalQuestions = history.reduce((a, b) => a + (b.answers?.length || 0), 0);

  const uniqueRoles = ['All', ...new Set(history.map((h) => h.role).filter(Boolean))];

  // Filter dropdown items based on search input
  const filteredRoleOptions = uniqueRoles.filter((role) =>
    role.toLowerCase().includes(roleSearchTerm.toLowerCase())
  );

  const filteredHistory = selectedRole === 'All' 
    ? history 
    : history.filter((h) => h.role === selectedRole);

  const chartData = filteredHistory.slice(0, 10).reverse().map((item, idx) => ({
    name: `Session ${idx + 1}`,
    score: item.overallScore || 0,
    role: item.role || 'General'
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 pt-6 pb-12 space-y-6 sm:space-y-8 overflow-x-hidden w-full">
      {/* Welcome Banner */}
      <div className="p-1">
        <div className="glass-card hover-glow p-5 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-300/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/70 shadow-xl shadow-cyan-950/[0.04] w-full transition-all duration-300 hover:border-cyan-500/50">
          <div className="space-y-2.5 z-10 w-full md:max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-cyan-500/15 dark:bg-cyan-500/10 text-cyan-800 dark:text-cyan-400 border border-cyan-500/30 dark:border-cyan-500/20">
              Creole Ventures Internship 2026
            </span>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight break-words flex flex-wrap items-center gap-x-2">
              <span>Hello,</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-violet-600 to-pink-600 dark:from-cyan-400 dark:to-violet-400">
                {user?.name}
              </span>
            </h1>

            <p className="text-slate-700 dark:text-gray-400 text-xs sm:text-sm max-w-xl font-medium leading-relaxed break-words">
              Target Role: <strong className="text-cyan-800 dark:text-cyan-300 font-bold">{user?.targetRole || 'Software Engineer'}</strong>. Your AI-driven preparation roadmap is live.
            </p>
          </div>

          <Link
            to="/interview"
            className="w-full sm:w-auto z-10 flex items-center justify-center gap-2.5 px-6 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-500 font-bold text-white shadow-xl shadow-cyan-500/30 hover:scale-[1.02] active:scale-95 transition duration-300 text-sm cursor-pointer shrink-0"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> Start Mock Interview
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        <div className="glass-card hover-glow p-4 sm:p-5 rounded-2xl border border-slate-300/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/70 shadow-md shadow-cyan-950/[0.03] min-w-0">
          <p className="text-slate-600 dark:text-gray-400 text-xs font-bold truncate">Total Attempts</p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 truncate">{totalAttempts}</h3>
        </div>
        <div className="glass-card hover-glow p-4 sm:p-5 rounded-2xl border border-slate-300/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/70 shadow-md shadow-cyan-950/[0.03] min-w-0">
          <p className="text-slate-600 dark:text-gray-400 text-xs font-bold truncate">Average Score</p>
          <h3 className="text-xl sm:text-2xl font-black text-cyan-700 dark:text-cyan-400 mt-1 truncate">{avgScore}%</h3>
        </div>
        <div className="glass-card hover-glow p-4 sm:p-5 rounded-2xl border border-slate-300/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/70 shadow-md shadow-cyan-950/[0.03] min-w-0">
          <p className="text-slate-600 dark:text-gray-400 text-xs font-bold truncate">Best Score</p>
          <h3 className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1 truncate">{bestScore}%</h3>
        </div>
        <div className="glass-card hover-glow p-4 sm:p-5 rounded-2xl border border-slate-300/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/70 shadow-md shadow-cyan-950/[0.03] min-w-0">
          <p className="text-slate-600 dark:text-gray-400 text-xs font-bold truncate">Questions Answered</p>
          <h3 className="text-xl sm:text-2xl font-black text-violet-700 dark:text-violet-400 mt-1 truncate">{totalQuestions}</h3>
        </div>
      </div>

      {/* Real-Time Job Market Analytics Dashboard */}
      <div className="glass-card p-4 sm:p-6 rounded-3xl space-y-4 border border-slate-300/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/70 shadow-xl shadow-cyan-950/[0.04] overflow-hidden w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <TrendingUp className="w-5 h-5 text-cyan-700 dark:text-cyan-400 shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              Live Job Market Analytics ({user?.targetRole || 'All Roles'})
            </h2>
          </div>
          <span className="text-[11px] sm:text-xs text-slate-600 dark:text-gray-400 font-bold shrink-0">
            Synced with AI Target Role
          </span>
        </div>

        {loading ? (
          <div className="py-8 flex items-center justify-center gap-2 text-slate-600 dark:text-gray-400 text-sm font-medium">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-600" /> Analyzing live job market data...
          </div>
        ) : marketTrends.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 w-full">
            {marketTrends.slice(0, 6).map((trend, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 dark:bg-gray-900/60 p-4 rounded-2xl border border-slate-300/80 dark:border-white/10 space-y-2 hover-glow w-full min-w-0 flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex justify-between items-start gap-2 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-2 break-words leading-snug min-w-0 pr-1">
                      {trend.job_title || trend.role || 'Data Role'}
                    </h3>
                    <span className="text-[10px] sm:text-[11px] text-emerald-800 dark:text-emerald-400 font-bold whitespace-nowrap bg-emerald-500/15 dark:bg-emerald-500/10 border border-emerald-500/30 dark:border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                      {trend.demand_percentage ? `${trend.demand_percentage} Demand` : trend.hiringGrowthRate || '+12% High Demand'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-gray-400 font-medium">
                    Avg Package: <span className="text-slate-900 dark:text-gray-200 font-bold">
                      {trend.avg_package || trend.averageSalaryRange || 'N/A'}
                    </span>
                  </p>
                </div>

                <div className="space-y-1.5 pt-1 min-w-0">
                  {(trend.total_postings || trend.postingsAnalyzed) && (
                    <p className="text-[11px] text-cyan-800 dark:text-cyan-300 font-bold truncate">
                      Postings analyzed: {trend.total_postings || trend.postingsAnalyzed}
                    </p>
                  )}
                  {trend.inDemandSkills && trend.inDemandSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {trend.inDemandSkills.slice(0, 4).map((sk, sIdx) => (
                        <span key={sIdx} className="text-[10px] bg-cyan-500/15 dark:bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 font-bold px-2 py-0.5 rounded-full border border-cyan-500/30 dark:border-cyan-500/20 max-w-full truncate">
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-600 dark:text-gray-400 py-4 font-medium">No matching job market analytics found.</p>
        )}
      </div>

      {/* Progress Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <div className="lg:col-span-2 glass-card hover-glow p-5 sm:p-6 rounded-3xl space-y-4 border border-slate-300/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/70 shadow-xl shadow-cyan-950/[0.04] overflow-visible w-full relative z-20">
          
          {/* Header & Searchable Role Dropdown Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Performance Trajectory</h2>
              <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">Track score progress across interview sessions</p>
            </div>

            {/* Photo 2 Style Searchable Dropdown */}
            {uniqueRoles.length > 1 && (
              <div className="relative w-full sm:w-64" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between gap-2 px-3.5 py-2 bg-slate-100 dark:bg-[#0f172a] border border-cyan-500/40 dark:border-cyan-500/50 rounded-xl text-xs font-bold text-slate-900 dark:text-white hover:border-cyan-400 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Filter className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span className="truncate">
                      {selectedRole === 'All' ? 'All Roles (Combined)' : selectedRole}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-gray-400 transition-transform duration-200 shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Popup Panel matching Photo 2 */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-full min-w-[260px] sm:w-72 bg-white dark:bg-[#0d1527] border border-cyan-500/40 dark:border-cyan-500/50 rounded-2xl shadow-2xl shadow-cyan-950/40 p-2.5 z-50 space-y-2 transition-all duration-200">
                    
                    {/* Search Input Box with Cyan Highlight */}
                    <div className="relative flex items-center">
                      <Search className="w-3.5 h-3.5 text-slate-400 dark:text-gray-400 absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search target role..."
                        value={roleSearchTerm}
                        onChange={(e) => setRoleSearchTerm(e.target.value)}
                        style={{ paddingLeft: '2.25rem' }}
                        className="w-full pr-3 py-1.5 bg-slate-50 dark:bg-[#080d19] border border-cyan-500/50 dark:border-cyan-500/60 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/80 transition-all"
                        autoFocus
                      />
                    </div>

                    {/* Scrollable Role List */}
                    <div className="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                      {filteredRoleOptions.length > 0 ? (
                        filteredRoleOptions.map((role, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSelectedRole(role);
                              setIsDropdownOpen(false);
                              setRoleSearchTerm('');
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left truncate cursor-pointer ${
                              selectedRole === role
                                ? 'bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-bold border border-cyan-500/30'
                                : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-cyan-600 dark:hover:text-cyan-300'
                            }`}
                          >
                            {role === 'All' ? (
                              <Globe className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                            ) : (
                              <Target className="w-3.5 h-3.5 text-pink-500 dark:text-pink-400 shrink-0" />
                            )}
                            <span className="truncate">{role === 'All' ? 'All Roles (Combined)' : role}</span>
                          </button>
                        ))
                      ) : (
                        <div className="py-3 text-center text-xs text-slate-500 dark:text-gray-400">
                          No matching roles found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chart Display Area */}
          <div className="h-56 sm:h-64 pt-2 w-full relative z-10">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke={darkMode ? "#9ca3af" : "#475569"} fontSize={11} fontWeight={600} />
                  <YAxis stroke={darkMode ? "#9ca3af" : "#475569"} domain={[0, 100]} fontSize={11} fontWeight={600} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-xl border border-white/10 space-y-1 z-50">
                            <p className="font-bold text-cyan-400">{data.role}</p>
                            <p>Score: <span className="font-bold text-emerald-400">{data.score}%</span></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="score" stroke={darkMode ? "#06b6d4" : "#0284c7"} fill={darkMode ? "#06b6d4" : "#0284c7"} fillOpacity={0.25} strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 dark:text-gray-500 text-xs sm:text-sm font-medium">
                No interview attempts found for this selection.
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4 border border-slate-300/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/70 shadow-xl shadow-cyan-950/[0.04] overflow-hidden w-full">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Recent Attempts</h2>
          <div className="space-y-3">
            {history.length > 0 ? (
              history.slice(0, 4).map((att) => (
                <div 
                  key={att._id} 
                  className="p-3 rounded-xl bg-slate-50 dark:bg-gray-900/50 border border-slate-300/80 dark:border-white/10 flex items-center justify-between hover-glow min-w-0 shadow-sm"
                >
                  <div className="pr-2 min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">{att.role}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-gray-400 font-medium truncate">{att.difficulty} • {new Date(att.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-cyan-700 dark:text-cyan-400 shrink-0">{att.overallScore || 0}%</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-600 dark:text-gray-400 py-4 font-medium">No recent attempts logged.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}