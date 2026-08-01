import React from 'react';
import { Link } from 'react-router-dom';
import AuthNavbar from '../components/AuthNavbar';
import { 
  Bot, 
  FileText, 
  TrendingUp, 
  Building2, 
  UserCheck, 
  Sparkles, 
  User, 
  ArrowRight, 
  Mail, 
  Phone,
  Globe 
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen relative text-slate-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      {/* Top Navigation */}
      <AuthNavbar />

      {/* Hero Section - Strict viewport height constraint prevents next section from peeking */}
      <section className="h-[calc(100vh-80px)] min-h-[550px] pt-12 sm:pt-20 pb-8 sm:pb-12 px-4 max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center justify-center">
        
        {/* Project Tag Pill - Elevated Light Mode Contrast */}
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-cyan-500/15 dark:bg-cyan-500/10 border border-cyan-500/30 dark:border-cyan-500/20 text-cyan-800 dark:text-cyan-400 text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wider mb-4 sm:mb-6 shadow-sm shadow-cyan-500/10">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-cyan-600 dark:text-cyan-400" /> "Web Design With MERN Stack" Internship Project
        </div>

        {/* Main Headline */}
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl text-slate-900 dark:text-white">
          Hi, Welcome to <span className="bg-gradient-to-r from-cyan-600 via-violet-600 to-pink-600 dark:from-cyan-500 dark:to-violet-600 bg-clip-text text-transparent">PrepAI</span>! An AI-powered mock interview & career preparation platform.
        </h1>

        {/* Subtitle */}
        <p className="mt-3 sm:mt-5 text-sm sm:text-base md:text-xl text-slate-700 dark:text-slate-300 max-w-2xl font-medium leading-relaxed px-2">
          Designed and engineered by <strong className="text-slate-900 dark:text-white font-bold">Luckyrajsinh Kathiya</strong> during my internship at <strong className="text-slate-900 dark:text-white font-bold">Creole Ventures Pvt. Ltd.</strong>
        </p>

        {/* Rounded Pill CTA - Vibrant Light Mode Glow */}
        <div className="mt-6 sm:mt-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-7 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-500 hover:scale-105 active:scale-95 text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 uppercase cursor-pointer"
          >
            <span>Get Started Here</span> <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </section>

      {/* Information Cards Section */}
      <section className="pt-12 sm:pt-16 pb-12 px-4 max-w-6xl mx-auto relative z-10">
        <div className="glass-card p-6 sm:p-10 rounded-3xl space-y-8 border border-slate-300/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/70 backdrop-blur-xl shadow-2xl shadow-cyan-950/[0.04]">
          <div className="text-center">
            <span className="text-xs sm:text-sm md:text-base font-bold tracking-widest uppercase text-cyan-700 dark:text-cyan-400">
              Project Background
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mt-1 sm:mt-2 tracking-tight text-slate-900 dark:text-white">
              Internship & Developer Highlights
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Developer / About Me Card */}
            <div className="glass-card hover-glow p-6 rounded-2xl flex flex-col justify-between border border-slate-300/80 dark:border-white/10 bg-slate-50/80 dark:bg-slate-900/40">
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-cyan-500/15 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30 dark:border-cyan-500/20 w-fit">
                  <User className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">About Developer</h3>
                  <p className="text-xs sm:text-sm text-cyan-700 dark:text-cyan-400 font-bold">Luckyrajsinh D. Kathiya</p>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
                  MERN Stack Developer with a strong focus on UI/UX Design, responsive interfaces, and modern web application development. Designed PrepAI to deliver a seamless, interactive environment for AI-driven interview practice.
                </p>
              </div>

              {/* Developer Contact Info */}
              <div className="pt-4 mt-4 border-t border-slate-300/80 dark:border-white/10 space-y-2 text-xs">
                <a 
                  href="mailto:luckyrajsinhkathiya12@gmail.com" 
                  className="flex items-center gap-2 text-slate-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-medium"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-500 shrink-0" />
                  <span className="truncate">luckyrajsinhkathiya12@gmail.com</span>
                </a>
                <a 
                  href="tel:+917016422280" 
                  className="flex items-center gap-2 text-slate-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-500 shrink-0" />
                  <span>+91 70164 22280</span>
                </a>
              </div>
            </div>

            {/* Internship Company Card */}
            <div className="glass-card hover-glow p-6 rounded-2xl flex flex-col justify-between border border-slate-300/80 dark:border-white/10 bg-slate-50/80 dark:bg-slate-900/40">
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-violet-500/15 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-500/30 dark:border-violet-500/20 w-fit">
                  <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Creole Ventures Pvt. Ltd.</h3>
                  <p className="text-xs sm:text-sm text-violet-700 dark:text-violet-400 font-bold">Host Internship Organization</p>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
                  Completed my Web Design With MERN Stack internship here. Built PrepAI while gaining hands-on industry experience and following professional software development standards.
                </p>
              </div>

              {/* Company Website Info */}
              <div className="pt-4 mt-4 border-t border-slate-300/80 dark:border-white/10 text-xs">
                <a 
                  href="https://creolestudios.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-slate-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors font-medium"
                >
                  <Globe className="w-3.5 h-3.5 text-violet-600 dark:text-violet-500 shrink-0" />
                  <span className="truncate">www.creolestudios.com</span>
                </a>
              </div>
            </div>

            {/* Mentorship Card */}
            <div className="glass-card hover-glow p-6 rounded-2xl flex flex-col justify-between border border-slate-300/80 dark:border-white/10 bg-slate-50/80 dark:bg-slate-900/40">
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 dark:border-emerald-500/20 w-fit">
                  <UserCheck className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Technical Mentorship</h3>
                  <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 font-bold">Industry & Academic Guidance</p>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
                  Developed under direct mentorship from Mr. Nirmalsinh Rathod (Creole Ventures Pvt. Ltd.) and academic guidance from Dr. Shakti Mishra (PDEU, Gandhinagar).
                </p>
              </div>

              {/* Mentors Email Info */}
              <div className="pt-4 mt-4 border-t border-slate-300/80 dark:border-white/10 space-y-2 text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 dark:text-gray-200 block">Industry Mentor:</span>
                  <a 
                    href="mailto:nirmalsinh@creolestudios.com" 
                    className="flex items-center gap-2 text-slate-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                    <span className="truncate">nirmalsinh@creolestudios.com</span>
                  </a>
                </div>

                <div className="space-y-0.5 pt-1">
                  <span className="font-bold text-slate-800 dark:text-gray-200 block">Academic Guide:</span>
                  <a 
                    href="mailto:Shakti.Mishra@sot.pdpu.ac.in" 
                    className="flex items-center gap-2 text-slate-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                    <span className="truncate">Shakti.Mishra@sot.pdpu.ac.in</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Platform Capabilities Section */}
      <section className="py-8 sm:py-12 px-4 max-w-6xl mx-auto relative z-10 mb-12 space-y-8 sm:space-y-10">
        <div className="text-center">
          <span className="text-xs sm:text-sm md:text-base font-bold tracking-widest uppercase text-cyan-700 dark:text-cyan-400">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mt-1 sm:mt-2 tracking-tight text-slate-900 dark:text-white">
            What PrepAI Does
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: AI Question Generation */}
          <div className="glass-card hover-glow p-6 rounded-3xl space-y-3 border border-slate-300/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/70 shadow-lg shadow-cyan-950/[0.03]">
            <div className="p-3 w-fit rounded-2xl bg-cyan-500/15 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30 dark:border-cyan-500/20 mb-2">
              <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              AI Question Generation
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
              Generates customized situational and technical interview questions powered by Google Gemini AI, tailored dynamically to your target career role.
            </p>
          </div>

          {/* Card 2: Resume ATS Analysis */}
          <div className="glass-card hover-glow p-6 rounded-3xl space-y-3 border border-slate-300/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/70 shadow-lg shadow-cyan-950/[0.03]">
            <div className="p-3 w-fit rounded-2xl bg-violet-500/15 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-500/30 dark:border-violet-500/20 mb-2">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Resume ATS Analysis & Job Matcher
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
              Extracts skills from PDF resumes, calculates ATS compatibility scores, and matches your profile against Kaggle job datasets to recommend roles.
            </p>
          </div>

          {/* Card 3: Real-Time Analytics & Feedback */}
          <div className="glass-card hover-glow p-6 rounded-3xl space-y-3 border border-slate-300/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/70 shadow-lg shadow-cyan-950/[0.03] sm:col-span-2 lg:col-span-1">
            <div className="p-3 w-fit rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 dark:border-emerald-500/20 mb-2">
              <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Real-Time Analytics & Feedback
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
              Provides instant AI feedback on answer accuracy while tracking your overall performance trajectory and skill growth over time with interactive charts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}