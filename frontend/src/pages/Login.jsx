import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Lock, Mail, Eye, EyeOff, CheckCircle2, AlertCircle, KeyRound, UserCheck } from 'lucide-react'
import { authenticateUser } from '../utils/userStore'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('demo@airamart.in')
  const [password, setPassword] = useState('DemoUser@123')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Quick Auto-Fill Demo Credentials
  const fillDemoCredentials = () => {
    setEmail('demo@airamart.in')
    setPassword('DemoUser@123')
    setErrorMsg('')
    setSuccessMsg('Demo credentials auto-filled! Click "Login to Command Center".')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    // Validate Credentials against DB/LocalStorage registered users
    const matchedUser = authenticateUser(email.trim(), password)

    if (matchedUser) {
      // Set Auth Session
      localStorage.setItem('aira_auth', 'true')
      localStorage.setItem('aira_is_demo', matchedUser.isDemo ? 'true' : 'false')
      localStorage.setItem('aira_user_email', matchedUser.email)
      localStorage.setItem('aira_user_name', matchedUser.name || matchedUser.owner_name || 'Store Owner')
      localStorage.setItem('aira_store_name', matchedUser.storeName || matchedUser.store_name || 'My Store')

      setSuccessMsg(`Welcome back, ${matchedUser.name || 'Store Manager'}! Opening Command Center...`)
      setTimeout(() => {
        window.location.href = '/app'
      }, 600)
    } else {
      setErrorMsg('Account not found. No store account matches these credentials. Please register first or use the Demo Account.')
    }
  }

  const handleGoogleLogin = () => {
    localStorage.setItem('aira_auth', 'true')
    localStorage.setItem('aira_is_demo', 'true')
    localStorage.setItem('aira_user_email', 'demo@airamart.in')
    localStorage.setItem('aira_user_name', 'Google Store Admin')
    window.location.href = '/app'
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-3xl bg-[#0d1b2a] border border-slate-700/80 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Side: 3D AI Retail Branding & Demo Account Info Card */}
        <div className="md:col-span-6 bg-gradient-to-br from-[#07111f] via-[#0d1b2a] to-[#111e2e] p-5 sm:p-8 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 relative overflow-hidden">
          {/* Logo Brand Header */}
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/30">
              <img src="/logo.png" alt="AIRA" className="w-full h-full rounded-[10px] object-cover" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-wider aira-gradient-text">AIRA</span>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">AI Retail OS</p>
            </div>
          </div>

          {/* 3D Illustration & Features */}
          <div className="relative my-6 text-center space-y-4 z-10">
            <div className="w-32 h-32 mx-auto rounded-3xl bg-slate-900/90 border border-slate-700 p-2 shadow-2xl relative flex items-center justify-center group">
              <img src="/logo.png" alt="AIRA 3D Core" className="w-full h-full rounded-2xl object-cover shadow-[0_0_30px_rgba(0,217,255,0.4)]" />
              <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-cyan-400 border-2 border-[#0d1b2a] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-slate-950" />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Your Store. Smarter with AI.</h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">Real-time inventory intelligence, demand forecasting, and automated reordering.</p>
            </div>

            {/* Prominent Demo Credentials Showcase Banner */}
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 text-left text-xs space-y-2 max-w-sm mx-auto backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-cyan-300 font-bold uppercase text-[10px] font-mono tracking-wider flex items-center space-x-1">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>DEMO ACCOUNT CREDENTIALS</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-mono text-[9px]">Pre-Loaded Store</span>
              </div>
              <div className="space-y-1 text-slate-200 font-mono text-[11px] bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div><span className="text-slate-400">Email:</span> <span className="text-cyan-300 font-bold">demo@airamart.in</span></div>
                <div><span className="text-slate-400">Pass:</span> <span className="text-cyan-300 font-bold">DemoUser@123</span></div>
              </div>
              <button 
                type="button" 
                onClick={fillDemoCredentials}
                className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold rounded-lg border border-cyan-500/50 text-[11px] transition-colors flex items-center justify-center space-x-1"
              >
                <span>Click to Auto-Fill Demo Credentials</span>
              </button>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-[11px] text-slate-500 font-mono relative z-10 text-center md:text-left">
            AIRA Retail OS © 2026 Enterprise Edition
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:col-span-6 bg-[#f8fafc] text-slate-900 p-5 sm:p-8 md:p-10 flex flex-col justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Welcome Back 👋</h2>
            <p className="text-xs text-slate-500">Login to your AIRA store command center account.</p>
          </div>

          {/* Error / Success Feedback Banners */}
          {errorMsg && (
            <div className="my-3 p-3.5 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 text-xs font-medium space-y-2 animate-fade-in">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
              <div className="pt-1 flex space-x-2">
                <Link to="/register" className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold text-[11px] hover:bg-rose-700">
                  Register Account Now
                </Link>
                <button type="button" onClick={fillDemoCredentials} className="px-3 py-1 bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] hover:bg-slate-300">
                  Use Demo Login
                </button>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="my-3 p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Email address</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@airamart.in"
                  className="w-full p-3 pl-10 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 shadow-sm"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 pl-10 pr-10 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 shadow-sm"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-blue-600 w-4 h-4" />
                <span>Remember me</span>
              </label>
              <button type="button" onClick={fillDemoCredentials} className="text-blue-600 hover:underline font-semibold">
                Use Demo Login
              </button>
            </div>

            <button type="submit" className="w-full py-3.5 aira-gradient-btn text-xs font-extrabold shadow-lg">
              LOGIN TO COMMAND CENTER
            </button>

            <div className="relative text-center my-3">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
              <span className="relative bg-[#f8fafc] px-3 text-slate-400 font-mono text-[10px]">OR</span>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin} 
              className="w-full py-3 rounded-xl bg-white border border-slate-300 text-slate-700 font-medium text-xs flex items-center justify-center space-x-2 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              <span>Continue with Google</span>
            </button>
          </form>

          <div className="text-center text-xs text-slate-600 pt-2">
            New to AIRA? <Link to="/register" className="text-blue-600 font-extrabold hover:underline">Register your store account</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
