import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../utils/api';
import { Trophy, ArrowLeft, Bot, UserCheck } from 'lucide-react';

export default function Results() {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    API.get(`/interview/results/${attemptId}`)
      .then((res) => setResult(res.data))
      .catch((err) => console.error('Error fetching results:', err));
  }, [attemptId]);

  if (!result) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3 text-slate-500 dark:text-gray-400 text-sm font-medium animate-pulse">
        <Trophy className="w-8 h-8 text-amber-500 animate-bounce" />
        <span>Loading assessment results...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12 space-y-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-xs sm:text-sm text-cyan-600 dark:text-cyan-400 hover:underline font-medium transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Main Score Header Card */}
      <div className="p-1">
        <div className="glass-card hover-glow p-6 sm:p-8 rounded-3xl text-center space-y-3 border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 hover:scale-[1.01]">
          <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 dark:text-amber-400 mx-auto drop-shadow-md" />
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Interview Assessment Complete
          </h1>
          <div className="text-4xl sm:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-emerald-600 dark:from-cyan-400 dark:to-emerald-400">
            {result.overallScore || 0}%
          </div>
          <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm">
            Target Role: <span className="font-semibold text-slate-900 dark:text-gray-200">{result.role}</span> ({result.difficulty})
          </p>
        </div>
      </div>

      {/* Answers & Feedback List */}
      <div className="space-y-4">
        {result.answers &&
          result.answers.map((item, idx) => (
            <div key={idx} className="p-1">
              <div className="glass-card hover-glow p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 hover:scale-[1.005] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug">
                    Q{idx + 1}: {item.questionText || item.question}
                  </h3>
                  <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20 shrink-0">
                    Score: {item.score}/10
                  </span>
                </div>

                {/* User Answer Container */}
                <div className="bg-slate-100/80 dark:bg-slate-950/80 p-4 rounded-2xl text-xs sm:text-sm text-slate-700 dark:text-gray-300 border border-slate-200/50 dark:border-white/5 space-y-1.5">
                  <strong className="text-slate-900 dark:text-gray-200 flex items-center gap-1.5 text-xs">
                    <UserCheck className="w-3.5 h-3.5 text-cyan-500" /> Your Answer:
                  </strong>
                  <p className="leading-relaxed">
                    {item.userAnswer || <span className="italic text-slate-400 dark:text-gray-500">No answer submitted</span>}
                  </p>
                </div>

                {/* AI Feedback Container */}
                <div className="bg-cyan-500/10 dark:bg-cyan-950/30 p-4 rounded-2xl border border-cyan-500/20 text-xs sm:text-sm text-cyan-950 dark:text-cyan-200 space-y-1.5">
                  <strong className="text-cyan-950 dark:text-cyan-100 flex items-center gap-1.5 text-xs">
                    <Bot className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> AI Feedback:
                  </strong>
                  <p className="leading-relaxed">{item.aiFeedback}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}