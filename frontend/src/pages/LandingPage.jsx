import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen dark-landing-bg text-slate-100 font-sans select-none overflow-x-hidden flex flex-col justify-between">
      {/* Top Glass Navbar */}
      <nav className="sticky top-0 z-50 bg-[#07111f]/90 border-b border-slate-800 backdrop-blur-xl px-4 sm:px-6 md:px-12 py-3 sm:py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2.5 sm:space-x-3 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform shrink-0">
            <img src="/logo.png" alt="AIRA Logo" className="w-full h-full rounded-[10px] object-cover" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-extrabold tracking-wider aira-gradient-text">AIRA</span>
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono uppercase tracking-widest">AI Retail OS</p>
          </div>
        </Link>

        {/* Auth Action CTAs */}
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          <Link to="/login" className="px-2.5 sm:px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors">
            Log In
          </Link>
          <Link to="/register" className="hidden sm:inline-block px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 border border-slate-700 text-cyan-300 hover:bg-slate-700 transition-colors">
            Register
          </Link>
          <Link to="/onboarding" className="aira-gradient-btn px-3 sm:px-5 py-2 sm:py-2.5 text-xs font-bold tracking-wider flex items-center space-x-1.5 sm:space-x-2 shadow-lg">
            <span>Start Store</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>
      </nav>

      {/* Main Full-Screen Horizontal Video Hero Section */}
      <main className="flex-1 w-full flex flex-col justify-center items-center relative overflow-hidden">
        {/* Full-Width Edge-to-Edge Horizontal Video Canvas */}
        <div className="w-full relative bg-slate-950 flex justify-center items-center overflow-hidden border-y border-cyan-500/30 shadow-[0_0_80px_rgba(0,217,255,0.25)]">
          <video 
            src="/aira_promo_8s.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)] min-h-[380px] sm:min-h-[500px] max-h-[900px] object-cover pointer-events-none"
          />

          {/* Top & Bottom Glass Lighting Overlays */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#07111f] via-[#07111f]/50 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#07111f] via-[#07111f]/85 to-transparent pointer-events-none" />

          {/* Floating Glass Control Overlay */}
          <div className="absolute bottom-6 sm:bottom-8 inset-x-0 flex flex-col items-center justify-center text-center px-4 space-y-3 sm:space-y-4 z-20">
            <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#07111f]/80 border border-cyan-500/40 text-cyan-300 text-[11px] sm:text-xs font-semibold backdrop-blur-md shadow-lg max-w-[90vw]">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
              <span className="truncate">AIRA REALISTIC AI STORE MANAGEMENT ENGINE</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full max-w-xs sm:max-w-none">
              <Link to="/register" className="w-full sm:w-auto aira-gradient-btn px-6 sm:px-8 py-3 sm:py-3.5 text-xs font-bold flex items-center justify-center space-x-2 shadow-2xl hover:scale-105 transition-transform text-center">
                <span>Register Store Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link to="/login" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-[#07111f]/90 border border-slate-700 text-slate-100 font-semibold text-xs hover:bg-slate-900 transition-colors backdrop-blur-md shadow-lg text-center">
                Log In to Command Center
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 px-8 border-t border-slate-800 text-slate-500 text-xs text-center bg-[#07111f]">
        <div className="flex items-center justify-center space-x-2">
          <img src="/logo.png" alt="AIRA" className="w-5 h-5 rounded-md object-cover" />
          <span className="font-bold text-white">AIRA</span>
          <span>© 2026 AIRA Retail OS. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
