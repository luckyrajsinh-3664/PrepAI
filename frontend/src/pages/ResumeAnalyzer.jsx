import React, { useState } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {
  FileUp,
  Sparkles,
  Briefcase,
  ChevronRight,
  Lightbulb,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [analysis, setAnalysis] = useState(() => {
    const savedAnalysis = localStorage.getItem('cachedResumeAnalysis');
    return savedAnalysis ? JSON.parse(savedAnalysis) : null;
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a PDF resume');

    const formData = new FormData();
    formData.append('resume', file);

    setLoading(true);
    try {
      const res = await API.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAnalysis(res.data);
      localStorage.setItem('cachedResumeAnalysis', JSON.stringify(res.data));
      toast.success('Resume analyzed against Market Trends!');
    } catch (err) {
      toast.error('Resume analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('cachedResumeAnalysis');
    setAnalysis(null);
    setFile(null);
    toast.success('Cleared previous analysis. Ready for a new upload!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12 space-y-6">
      {/* Header & File Upload Card */}
      <div className="p-1">
        <div className="glass-card hover-glow p-5 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-5 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyan-500/10 hover:shadow-xl hover:scale-[1.01]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-cyan-600 dark:text-cyan-400 shrink-0" />
                AI Resume Analyzer & Market Matcher
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
                Upload your PDF resume. Gemini AI evaluates ATS compliance, extracts key skills, and maps your profile against market roles.
              </p>
            </div>
            {analysis && (
              <button
                onClick={handleReset}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-gray-300 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-xl transition cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Analyze New Resume
              </button>
            )}
          </div>

          {!analysis && (
            <form onSubmit={handleUpload} className="space-y-4 pt-2">
              <div className="border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl p-6 sm:p-8 text-center hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 bg-slate-50/50 dark:bg-gray-900/40 hover:bg-cyan-500/5 relative">
                <FileUp className="w-10 h-10 text-cyan-600 dark:text-cyan-400 mx-auto mb-3 animate-bounce" />

                <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  {file ? file.name : 'Select or drag your PDF resume here'}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-gray-500 mb-4">
                  PDF format only (Max 5MB)
                </p>

                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full max-w-xs mx-auto text-xs text-slate-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-100 dark:file:bg-cyan-500/20 file:text-cyan-700 dark:file:text-cyan-300 hover:file:bg-cyan-200 dark:hover:file:bg-cyan-500/30 transition cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !file}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-500 font-bold text-white text-xs sm:text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:opacity-95 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing with AI & Market Data...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Analyze Resume Now
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6 animate-fade-in py-1">
          {/* Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card hover-glow p-5 sm:p-6 rounded-2xl text-center border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 shadow-sm transition-all duration-300 hover:border-cyan-500/50 hover:shadow-md hover:shadow-cyan-500/10 hover:scale-[1.02]">
              <span className="text-[11px] text-slate-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
                Overall Match Score
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-1">
                {analysis.overallScore || 0}%
              </h2>
            </div>
            <div className="glass-card hover-glow p-5 sm:p-6 rounded-2xl text-center border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 shadow-sm transition-all duration-300 hover:border-cyan-500/50 hover:shadow-md hover:shadow-cyan-500/10 hover:scale-[1.02]">
              <span className="text-[11px] text-slate-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
                ATS Compatibility Score
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-violet-600 dark:text-violet-400 mt-1">
                {analysis.atsScore || 0}%
              </h2>
            </div>
          </div>

          {/* Extracted & Missing Skills */}
          <div className="glass-card hover-glow p-5 sm:p-6 rounded-2xl space-y-4 border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 hover:scale-[1.01]">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Skills Breakdown & Gap Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Detected Skills Box */}
              <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 space-y-2 transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-500/15">
                <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Detected Skills
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {analysis.extractedSkills?.length > 0 ? (
                    analysis.extractedSkills.map((s, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-md"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-gray-500 italic">No explicit skills detected</span>
                  )}
                </div>
              </div>

              {/* Missing Market Skills Box */}
              <div className="bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 space-y-2 transition-all duration-300 hover:border-rose-500/40 hover:bg-rose-500/15">
                <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wide flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> Missing Recommended Skills
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {analysis.missingSkills?.length > 0 ? (
                    analysis.missingSkills.map((s, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 px-2.5 py-1 rounded-md"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-gray-500 italic">No missing skills flagged</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Job Roles */}
          {analysis.recommendedRoles && analysis.recommendedRoles.length > 0 && (
            <div className="glass-card hover-glow p-5 sm:p-6 rounded-3xl space-y-4 border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 hover:scale-[1.01]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    Recommended Target Roles
                  </h3>
                </div>
                <span className="self-start sm:self-auto text-[11px] font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
                  Dataset Matched
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {analysis.recommendedRoles.map((role, idx) => {
                  const roleTitle = typeof role === 'string' ? role : role.title || 'Target Role';
                  const matchScore = typeof role === 'object' && role.matchScore ? role.matchScore : 80;
                  const avgSalary = typeof role === 'object' && role.avgSalary ? role.avgSalary : 'Market Standard';

                  return (
                    <div
                      key={idx}
                      className="bg-slate-100/80 dark:bg-gray-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 space-y-3 flex flex-col justify-between hover:border-cyan-500/60 hover:shadow-md hover:shadow-cyan-500/10 hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-2">
                            {roleTitle}
                          </h4>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                            {matchScore}% Match
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400">
                          Avg Package: <span className="font-semibold text-slate-800 dark:text-gray-200">{avgSalary}</span>
                        </p>
                      </div>

                      <Link
                        to={`/interview?role=${encodeURIComponent(roleTitle)}`}
                        className="inline-flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline pt-2 border-t border-slate-200/60 dark:border-white/5 mt-auto"
                      >
                        Prepare Mock Interview <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Executive Summary */}
          {analysis.summary && (
            <div className="glass-card hover-glow p-5 sm:p-6 rounded-2xl space-y-2 border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 hover:scale-[1.01]">
              <h4 className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" /> AI Executive Summary
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
                {analysis.summary}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}