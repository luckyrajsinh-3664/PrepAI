import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { Link } from 'react-router-dom';
import { History as HistoryIcon, Search, ArrowRight, Calendar, Award } from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/interview/history')
      .then((res) => setHistory(res.data || []))
      .catch((err) => console.error('Error fetching history:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredHistory = history.filter((item) =>
    item.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 pb-12 space-y-6">
      {/* Header & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400 shrink-0" /> Interview History
          </h1>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            Review past AI mock interviews and track score evaluations.
          </p>
        </div>

        {/* Search Input Container */}
        <div className="relative w-full sm:w-72 flex items-center">
          <Search className="w-4 h-4 text-slate-400 dark:text-gray-400 absolute left-3.5 z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by target role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
            className="w-full pr-4 py-2.5 bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* History Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="glass-card p-8 rounded-2xl text-center text-slate-500 dark:text-gray-400 text-sm border border-slate-200/80 dark:border-white/10">
            Loading interview history...
          </div>
        ) : filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <div key={item._id} className="p-1">
              <div className="glass-card hover-glow p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 hover:scale-[1.005]">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                    {item.role}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-gray-400">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-gray-800 font-medium capitalize text-slate-700 dark:text-gray-300">
                      Difficulty: {item.difficulty || 'Medium'}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-white/5">
                  <div className="flex items-center gap-1.5 bg-cyan-500/10 dark:bg-cyan-500/20 px-3 py-1.5 rounded-xl border border-cyan-500/20">
                    <Award className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span className="text-base sm:text-lg font-extrabold text-cyan-600 dark:text-cyan-400">
                      {item.overallScore || 0}%
                    </span>
                  </div>

                  {/* Light Mode Optimized "View Results" Button */}
                  <Link
                    to={`/results/${item._id}`}
                    className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 dark:bg-none dark:bg-white/10 text-xs font-bold text-white dark:text-white dark:hover:bg-cyan-500 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/40"
                  >
                    <span className="!text-white font-bold tracking-wide">View Results</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card p-8 rounded-2xl text-center text-slate-500 dark:text-gray-400 text-xs sm:text-sm border border-slate-200/80 dark:border-white/10">
            {search
              ? 'No interview history matches your search query.'
              : 'No interview sessions found. Complete your first mock interview to get started!'}
          </div>
        )}
      </div>
    </div>
  );
}