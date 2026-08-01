import React, { useState, useEffect, useRef } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FLAT_ROLES_LIST } from '../utils/rolesData';
import { Play, Send, Bot, ChevronDown, Search, Check } from 'lucide-react';

export default function Interview() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState('Full Stack Developer');
  const [rolesList, setRolesList] = useState(FLAT_ROLES_LIST);
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(5);
  const [activeAttempt, setActiveAttempt] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  // Custom Role Dropdown State & Ref
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Check for role passed in URL query parameter
    const roleParam = searchParams.get('role');
    if (roleParam) {
      setRole(roleParam);
      if (!FLAT_ROLES_LIST.includes(roleParam)) {
        setRolesList([roleParam, ...FLAT_ROLES_LIST]);
      }
    }

    // Check for existing in-progress attempt
    API.get('/interview/current')
      .then((res) => {
        if (res.data) {
          setActiveAttempt(res.data);
        }
      })
      .catch(() => {});
  }, [searchParams]);

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

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await API.post('/interview/start', { role, difficulty, count: Number(count) });
      setActiveAttempt(res.data);
      setCurrentIndex(0);
      toast.success('AI Question Generation Complete!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate AI interview questions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return toast.error('Please enter an answer');
    setEvaluating(true);
    
    const questionsList = activeAttempt?.questions || activeAttempt?.answers || [];
    const currentQuestion = questionsList[currentIndex];

    try {
      await API.post('/interview/submit', {
        attemptId: activeAttempt.attemptId || activeAttempt._id,
        questionId: currentQuestion?.questionId || currentQuestion?._id,
        userAnswer,
      });

      toast.success('Answer evaluated!');
      setUserAnswer('');

      if (currentIndex < questionsList.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        toast.success('Interview Completed!');
        navigate(`/results/${activeAttempt.attemptId || activeAttempt._id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('AI Evaluation error');
    } finally {
      setEvaluating(false);
    }
  };

  const filteredRoles = rolesList.filter((r) =>
    r.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <Bot className="w-12 h-12 text-cyan-600 dark:text-cyan-400 animate-bounce" />
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Gemini AI is crafting unique questions...
        </h2>
        <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm max-w-md">
          Role: <span className="font-semibold text-cyan-600 dark:text-cyan-400">{role}</span> ({difficulty})
        </p>
      </div>
    );
  }

  if (!activeAttempt) {
    return (
      <div className="max-w-2xl mx-auto px-4 pb-12">
        <div className="p-1">
          <div className="glass-card hover-glow p-5 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-6 bg-white/80 dark:bg-slate-900/70 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 hover:scale-[1.01]">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Setup Your AI Mock Interview
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
                Select target role parameters for tailored AI question generation.
              </p>
            </div>

            <div className="space-y-5">
              {/* Custom Searchable Role Select */}
              <div className="relative" ref={dropdownRef}>
                <label className="text-xs font-semibold text-slate-700 dark:text-gray-300 block mb-1.5">
                  Select Role
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
                  <span className="truncate font-medium">{role}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                      isDropdownOpen ? 'rotate-180 text-cyan-500' : ''
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 p-2.5 space-y-2 max-h-64 overflow-hidden flex flex-col backdrop-blur-2xl">
                    <div className="relative flex items-center bg-slate-100 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2 shrink-0 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500">
                      <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                      <input
                        type="text"
                        placeholder="Search role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent text-slate-900 dark:text-white text-xs focus:outline-none placeholder:text-slate-400 dark:placeholder:text-gray-500"
                        autoFocus
                      />
                    </div>

                    <div className="overflow-y-auto space-y-1 flex-1 pr-1 custom-scrollbar">
                      {filteredRoles.length > 0 ? (
                        filteredRoles.map((r, i) => {
                          const isSelected = role === r;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setRole(r);
                                setIsDropdownOpen(false);
                                setSearchTerm('');
                              }}
                              className={`w-full text-left px-3 py-2.5 text-xs rounded-xl transition flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold'
                                  : 'text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                              }`}
                            >
                              <span className="truncate">{r}</span>
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

              {/* Difficulty & Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-gray-300 block mb-1.5">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 rounded-xl">
                    {['Easy', 'Medium', 'Hard'].map((level) => {
                      const isActive = difficulty === level;
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setDifficulty(level)}
                          className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md shadow-cyan-500/20'
                              : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-gray-300 block mb-1.5">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleStart}
                className="w-full mt-2 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-500 font-bold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:opacity-95 cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider"
              >
                <Play className="w-4 h-4 fill-current" />
                Generate AI Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const questionsList = activeAttempt.questions || activeAttempt.answers || [];
  const currentQ = questionsList[currentIndex] || {};

  return (
    <div className="max-w-3xl mx-auto px-4 pb-12 space-y-6">
      {/* Progress Bar & Header */}
      <div className="p-1">
        <div className="glass-card hover-glow p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/80 dark:bg-slate-900/70 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-md hover:shadow-cyan-500/10 hover:scale-[1.01]">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Question {currentIndex + 1} of {questionsList.length}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold border border-cyan-500/20">
              {activeAttempt.role || role}
            </span>
          </div>

          <div className="w-full sm:w-1/2 bg-slate-200 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-violet-600 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / (questionsList.length || 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="p-1">
        <div className="glass-card hover-glow p-5 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-5 bg-white/80 dark:bg-slate-900/70 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 hover:scale-[1.01]">
          <div className="space-y-2">
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
              Prompt Question
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.questionText || currentQ.question || 'No question prompt available.'}
            </h3>
          </div>

          <textarea
            rows="6"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your structured answer here..."
            className="w-full p-4 bg-white/90 dark:bg-gray-900/80 border border-slate-300 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-xs sm:text-sm placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition leading-relaxed"
          ></textarea>

          <button
            type="button"
            onClick={handleSubmitAnswer}
            disabled={evaluating}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 font-semibold text-white text-xs sm:text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 flex items-center justify-center gap-2 hover:opacity-95 cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {evaluating ? (
              'Gemini AI Evaluating...'
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit & Next Question</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}