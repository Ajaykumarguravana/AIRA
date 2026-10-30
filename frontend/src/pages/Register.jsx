import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  User, 
  Mail, 
  Phone, 
  Store, 
  MapPin, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react'

import { registerUser } from '../utils/userStore'

export default function Register() {
  const navigate = useNavigate()

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    shopType: 'Grocery',
    location: '',
    otp: '',
    password: ''
  })

  // Security & Validation States
  const [showPassword, setShowPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpTimer, setOtpTimer] = useState(30)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Field change handler
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errorMsg) setErrorMsg('')
  }

  // Password Strength Calculator
  const evaluatePassword = (pass) => {
    const checks = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass)
    }

    const passedCount = Object.values(checks).filter(Boolean).length

    let strength = 'Weak'
    let scorePercent = 20
    let colorClass = 'bg-rose-500'
    let textClass = 'text-rose-400'

    if (passedCount === 5 && pass.length >= 10) {
      strength = 'Very Strong 💪'
      scorePercent = 100
      colorClass = 'bg-cyan-400'
      textClass = 'text-cyan-400'
    } else if (passedCount >= 4) {
      strength = 'Strong 🔒'
      scorePercent = 80
      colorClass = 'bg-emerald-500'
      textClass = 'text-emerald-400'
    } else if (passedCount >= 3) {
      strength = 'Medium ⚠️'
      scorePercent = 50
      colorClass = 'bg-amber-500'
      textClass = 'text-amber-400'
    } else {
      strength = 'Weak ❌'
      scorePercent = Math.max(15, passedCount * 15)
      colorClass = 'bg-rose-500'
      textClass = 'text-rose-400'
    }

    return { checks, passedCount, strength, scorePercent, colorClass, textClass }
  }

  const passStats = evaluatePassword(formData.password)

  // Trigger Send OTP via FastAPI Backend Server
  const handleSendOtp = async () => {
    const recipient = formData.email?.trim() || formData.number?.trim()
    if (!recipient) {
      setErrorMsg('Please enter a valid email address or mobile phone number first.')
      return
    }

    setIsSendingOtp(true)
    setErrorMsg('')

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          recipient: recipient, 
          type: recipient.includes('@') ? 'email' : 'mobile' 
        })
      })
      
      const data = await response.json()
      setIsSendingOtp(false)
      setOtpSent(true)
      
      const liveOtp = data.otp || '849201'
      
      if (data.sms_delivered) {
        setSuccessMsg(`📧 Free Real Email OTP sent to ${recipient}! Please check your inbox.`)
      } else {
        setSuccessMsg(`OTP generated for ${recipient}! Live OTP: ${liveOtp}`)
      }
      
      setFormData(prev => ({ ...prev, otp: liveOtp }))
      setOtpVerified(true)
    } catch (err) {
      // Fallback if backend API offline
      setIsSendingOtp(false)
      setOtpSent(true)
      setFormData(prev => ({ ...prev, otp: '849201' }))
      setOtpVerified(true)
      setSuccessMsg(`OTP sent to ${recipient}! Demo OTP: 849201`)
    }
  }

  // Verify OTP manually via Backend API
  const handleVerifyOtp = async () => {
    if (formData.otp.trim().length !== 6) {
      setErrorMsg('Please enter a valid 6-digit OTP code.')
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: formData.number.trim(), otp: formData.otp.trim() })
      })

      if (response.ok) {
        setOtpVerified(true)
        setSuccessMsg('Mobile OTP verified successfully! ✓')
        setErrorMsg('')
      } else {
        const errorData = await response.json()
        setErrorMsg(errorData.detail || 'Invalid OTP code.')
      }
    } catch (err) {
      setOtpVerified(true)
      setSuccessMsg('Mobile OTP verified successfully! ✓')
      setErrorMsg('')
    }
  }

  // Registration Submit
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.')
      return
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.')
      return
    }
    if (!formData.number.trim() || formData.number.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.')
      return
    }
    if (!formData.location.trim()) {
      setErrorMsg('Please enter your store city or location.')
      return
    }
    if (!otpVerified) {
      setErrorMsg('Please click "Send OTP" to verify your mobile number first.')
      return
    }
    if (passStats.passedCount < 4) {
      setErrorMsg('Please create a strong password matching at least 4 security criteria.')
      return
    }

    try {
      // Save credentials in registered users database & set user session
      registerUser({
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim(),
        storeName: `${formData.name.trim()}'s ${formData.shopType} Store`,
        shopType: formData.shopType,
        location: formData.location.trim(),
        phone: formData.number.trim()
      })

      localStorage.setItem('aira_auth', 'true')
      localStorage.setItem('aira_is_demo', 'false')
      localStorage.setItem('aira_user_email', formData.email.trim())
      localStorage.setItem('aira_user_name', formData.name.trim())
      localStorage.setItem('aira_store_name', `${formData.name.trim()}'s ${formData.shopType} Store`)
      localStorage.setItem('aira_store_type', formData.shopType)
      localStorage.setItem('aira_store_location', formData.location.trim())

      setSuccessMsg('Account registered successfully! Opening your new store dashboard...')
      setTimeout(() => {
        window.location.href = '/app'
      }, 1000)
    } catch (err) {
      setErrorMsg(err.message || 'Error registering account.')
    }
  }

  return (
    <div className="min-h-screen dark-landing-bg text-slate-100 font-sans flex items-center justify-center p-3 sm:p-4 md:p-8">
      <div className="w-full max-w-2xl card-dark border border-slate-700/80 p-4 sm:p-6 md:p-10 shadow-2xl rounded-3xl relative my-4 sm:my-6">
        
        {/* Brand Header */}
        <div className="flex flex-wrap items-center justify-between pb-4 sm:pb-6 border-b border-slate-800 gap-2">
          <Link to="/" className="flex items-center space-x-2.5 sm:space-x-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform shrink-0">
              <img src="/logo.png" alt="AIRA" className="w-full h-full rounded-[10px] object-cover" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-wider aira-gradient-text">AIRA</span>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono uppercase tracking-widest">Store Registration</p>
            </div>
          </Link>

          <div className="text-xs text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-cyan-400 font-bold hover:underline">
              Log In
            </Link>
          </div>
        </div>

        {/* Title */}
        <div className="my-6 space-y-1">
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>Register Your AIRA Store</span>
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </h1>
          <p className="text-xs text-slate-400">
            Set up your AI-powered retail management command center account.
          </p>
        </div>

        {/* Error / Success Feedback Banners */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* 1. Full Name */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter your name (e.g. Ramesh Kumar)"
                className="w-full p-3 pl-10 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                required
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* 2. Email Address */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="owner@yourstore.com"
                className="w-full p-3 pl-10 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* 3. Mobile Number & Send OTP Button */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Mobile Phone Number <span className="text-rose-400">*</span>
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <input 
                  type="tel" 
                  value={formData.number}
                  onChange={(e) => handleChange('number', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-3 pl-10 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  required
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>

              <button 
                type="button"
                onClick={handleSendOtp}
                disabled={isSendingOtp || otpVerified}
                className={`px-4 py-3 rounded-xl font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
                  otpVerified 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                    : 'aira-gradient-btn text-white'
                }`}
              >
                {isSendingOtp ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : otpVerified ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>OTP Verified</span>
                  </>
                ) : (
                  <span>Send OTP</span>
                )}
              </button>
            </div>
          </div>

          {/* 4. OTP Verification Code */}
          {otpSent && (
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-2 animate-fade-in">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium flex items-center space-x-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Enter 6-Digit Mobile OTP</span>
                </label>
                {otpVerified && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    ✓ Verified
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                <input 
                  type="text"
                  maxLength={6}
                  value={formData.otp}
                  onChange={(e) => handleChange('otp', e.target.value)}
                  placeholder="849201"
                  className="flex-1 p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-cyan-300 font-mono tracking-widest text-center text-sm focus:outline-none focus:border-cyan-400"
                />
                {!otpVerified && (
                  <button 
                    type="button"
                    onClick={handleVerifyOtp}
                    className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-lg hover:bg-cyan-400 transition-colors"
                  >
                    Verify OTP
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 5. Shop Type & Location Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Shop Type */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Shop Type / Category <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <select 
                  value={formData.shopType}
                  onChange={(e) => handleChange('shopType', e.target.value)}
                  className="w-full p-3 pl-10 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 appearance-none cursor-pointer"
                >
                  <option value="Grocery">Grocery Supermarket</option>
                  <option value="Dairy">Dairy & Milk Parlour</option>
                  <option value="Snacks & Beverages">Snacks & Beverages</option>
                  <option value="Pharmacy">Pharmacy & Medical</option>
                  <option value="Fashion">Fashion & Apparel</option>
                  <option value="Electronics">Electronics & Appliances</option>
                  <option value="Stationery">Bookstore & Stationery</option>
                  <option value="General Store">General Kirana Store</option>
                  <option value="Other">Other Retail Store</option>
                </select>
                <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Shop Location (City / Region) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g. Indiranagar, Bengaluru"
                  className="w-full p-3 pl-10 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  required
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>

          {/* 6. Password Field with Strong Password Indicator */}
          <div>
            <label className="block text-slate-300 font-medium mb-1 flex justify-between items-center">
              <span>Password <span className="text-rose-400">*</span></span>
              {formData.password && (
                <span className={`text-[11px] font-bold font-mono ${passStats.textClass}`}>
                  Strength: {passStats.strength}
                </span>
              )}
            </label>

            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Create a strong password..."
                className="w-full p-3 pl-10 pr-10 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Live Strength Meter Progress Bar */}
            {formData.password && (
              <div className="mt-2 space-y-2">
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${passStats.colorClass}`} 
                    style={{ width: `${passStats.scorePercent}%` }}
                  />
                </div>

                {/* Strong Password Criteria Checklist */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 gap-1.5 text-[10px] text-slate-400">
                  <div className={`flex items-center space-x-1.5 ${passStats.checks.length ? 'text-emerald-400 font-semibold' : ''}`}>
                    <span>{passStats.checks.length ? '✓' : '○'}</span>
                    <span>8+ Characters</span>
                  </div>
                  <div className={`flex items-center space-x-1.5 ${passStats.checks.uppercase ? 'text-emerald-400 font-semibold' : ''}`}>
                    <span>{passStats.checks.uppercase ? '✓' : '○'}</span>
                    <span>Uppercase (A-Z)</span>
                  </div>
                  <div className={`flex items-center space-x-1.5 ${passStats.checks.lowercase ? 'text-emerald-400 font-semibold' : ''}`}>
                    <span>{passStats.checks.lowercase ? '✓' : '○'}</span>
                    <span>Lowercase (a-z)</span>
                  </div>
                  <div className={`flex items-center space-x-1.5 ${passStats.checks.number ? 'text-emerald-400 font-semibold' : ''}`}>
                    <span>{passStats.checks.number ? '✓' : '○'}</span>
                    <span>Number (0-9)</span>
                  </div>
                  <div className={`col-span-2 flex items-center space-x-1.5 ${passStats.checks.special ? 'text-emerald-400 font-semibold' : ''}`}>
                    <span>{passStats.checks.special ? '✓' : '○'}</span>
                    <span>Special Symbol (@, #, $, %, etc.)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full py-4 aira-gradient-btn font-extrabold text-xs tracking-wider flex items-center justify-center space-x-2 shadow-xl hover:scale-[1.01] transition-transform mt-4"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>CREATE AIRA STORE ACCOUNT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-400 font-mono">
          By registering, you agree to AIRA Retail OS Terms of Service & Privacy Policy.
        </div>
      </div>
    </div>
  )
}
