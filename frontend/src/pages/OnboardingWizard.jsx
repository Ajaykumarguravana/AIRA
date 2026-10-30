import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Upload, Store, Package, Sliders, ShieldCheck } from 'lucide-react'

export default function OnboardingWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  // Form States
  const [formData, setFormData] = useState({
    storeName: 'AIRA Mart Bengaluru',
    ownerName: 'Store Owner',
    email: 'owner@airamart.in',
    phone: '+91 98765 43210',
    password: '••••••••',
    confirmPassword: '••••••••',
    category: 'Grocery',
    city: 'Bengaluru',
    currency: '₹',
    storeSize: 'Medium (500 - 2000 sq ft)',
    lowStockThreshold: 15,
    enableAiAlerts: true,
    enableDailyDigest: true
  })

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }))
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (step < 5) {
      setStep(prev => prev + 1)
    } else {
      navigate('/app')
    }
  }

  // Step 3 Drag & Drop State
  const [isDraggingStep3, setIsDraggingStep3] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState('')

  const handleDragOverStep3 = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingStep3(true)
  }

  const handleDragLeaveStep3 = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingStep3(false)
  }

  const handleDropStep3 = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingStep3(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      setUploadedFileName(file.name)
    }
  }

  const handleFileSelectStep3 = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFileName(file.name)
    }
  }

  return (
    <div className="min-h-screen dark-landing-bg text-slate-100 font-sans flex flex-col justify-between p-3 sm:p-6">
      {/* Top Brand Header */}
      <div className="max-w-4xl mx-auto w-full flex justify-between items-center py-3 sm:py-4">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 p-0.5 shadow-md shrink-0">
            <img src="/logo.png" alt="AIRA" className="w-full h-full rounded-[10px] object-cover" />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-white">AIRA</span>
        </Link>
        <div className="text-xs text-slate-400 font-mono">
          STEP {step} OF 5
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto w-full mb-6 sm:mb-8">
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full aira-gradient-bg transition-all duration-300 ease-out" 
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Form Card Container */}
      <div className="max-w-xl mx-auto w-full card-dark border border-slate-700/80 p-4 sm:p-8 shadow-2xl rounded-3xl relative my-auto">
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-5 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">STEP 1</span>
              <h2 className="text-2xl font-bold text-white">Welcome to AIRA 👋</h2>
              <p className="text-xs text-slate-400">Let's create your store administrator profile.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Store Name</label>
                <input 
                  type="text" 
                  value={formData.storeName}
                  onChange={(e) => handleChange('storeName', e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Owner / Manager Name</label>
                <input 
                  type="text" 
                  value={formData.ownerName}
                  onChange={(e) => handleChange('ownerName', e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Password</label>
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Confirm Password</label>
                  <input 
                    type="password" 
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 aira-gradient-btn text-xs font-bold flex items-center justify-center space-x-2">
              <span>Continue to Store Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleNext} className="space-y-5 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">STEP 2</span>
              <h2 className="text-2xl font-bold text-white">Tell us about your store 🏪</h2>
              <p className="text-xs text-slate-400">Configure store region, category, and scale.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Store Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option>Grocery</option>
                  <option>Fashion</option>
                  <option>Electronics</option>
                  <option>Pharmacy</option>
                  <option>Stationery</option>
                  <option>General Store</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">City / Region</label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Currency Symbol</label>
                  <select 
                    value={formData.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option>₹ (INR)</option>
                    <option>$ (USD)</option>
                    <option>€ (EUR)</option>
                    <option>£ (GBP)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Store Floor Size</label>
                <select 
                  value={formData.storeSize}
                  onChange={(e) => handleChange('storeSize', e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option>Small (under 500 sq ft)</option>
                  <option>Medium (500 - 2000 sq ft)</option>
                  <option>Large (2000+ sq ft / Multi-floor)</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button type="button" onClick={() => setStep(1)} className="w-1/3 py-3.5 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800">
                Back
              </button>
              <button type="submit" className="w-2/3 py-3.5 aira-gradient-btn text-xs font-bold flex items-center justify-center space-x-2">
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleNext} className="space-y-5 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">STEP 3</span>
              <h2 className="text-2xl font-bold text-white">Set up your inventory 📦</h2>
              <p className="text-xs text-slate-400">Import existing product data or use AIRA demo dataset.</p>
            </div>

            <div 
              onDragOver={handleDragOverStep3}
              onDragLeave={handleDragLeaveStep3}
              onDrop={handleDropStep3}
              className={`p-8 rounded-2xl border-2 border-dashed text-center space-y-3 transition-all relative cursor-pointer ${
                isDraggingStep3 
                  ? 'border-cyan-400 bg-cyan-500/20 scale-[1.02]' 
                  : uploadedFileName 
                    ? 'border-emerald-500/80 bg-emerald-900/20'
                    : 'bg-slate-900 border-slate-700 hover:border-cyan-500/50'
              }`}
            >
              <input 
                type="file" 
                onChange={handleFileSelectStep3}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                accept=".csv, .xlsx, .xls"
              />
              <Upload className={`w-8 h-8 mx-auto ${uploadedFileName ? 'text-emerald-400' : 'text-cyan-400'}`} />
              <div>
                <p className="text-xs font-semibold text-white">
                  {uploadedFileName ? `✓ Loaded: ${uploadedFileName}` : 'Drag & Drop CSV or Excel File Here'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {uploadedFileName ? 'CSV parsed successfully' : 'Or click to select a file from your computer'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
              <p>Or proceed with AIRA's pre-populated 10 Indian retail demo products (Rice, Milk, Cooking Oil, Biscuits, Beverages, etc.).</p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button type="button" onClick={() => setStep(2)} className="w-1/3 py-3.5 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800">
                Back
              </button>
              <button type="submit" className="w-2/3 py-3.5 aira-gradient-btn text-xs font-bold flex items-center justify-center space-x-2">
                <span>{uploadedFileName ? 'Import & Continue' : 'Use Demo Dataset'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {step === 4 && (
          <form onSubmit={handleNext} className="space-y-5 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">STEP 4</span>
              <h2 className="text-2xl font-bold text-white">Customize AIRA ⚙️</h2>
              <p className="text-xs text-slate-400">Configure alert sensitivity and AI automation preferences.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Default Low-Stock Alert Threshold</label>
                <div className="flex items-center space-x-3">
                  <input 
                    type="range" 
                    min="5" 
                    max="50" 
                    value={formData.lowStockThreshold}
                    onChange={(e) => handleChange('lowStockThreshold', e.target.value)}
                    className="flex-1 accent-cyan-400"
                  />
                  <span className="font-mono text-cyan-400 font-bold px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-700">
                    {formData.lowStockThreshold} units
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-200 font-medium">Automated Stockout Predictions</span>
                  <input type="checkbox" checked={formData.enableAiAlerts} onChange={(e) => handleChange('enableAiAlerts', e.target.checked)} className="accent-cyan-400 w-4 h-4" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-200 font-medium">Daily Store Summary Email</span>
                  <input type="checkbox" checked={formData.enableDailyDigest} onChange={(e) => handleChange('enableDailyDigest', e.target.checked)} className="accent-cyan-400 w-4 h-4" />
                </label>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button type="button" onClick={() => setStep(3)} className="w-1/3 py-3.5 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800">
                Back
              </button>
              <button type="submit" className="w-2/3 py-3.5 aira-gradient-btn text-xs font-bold flex items-center justify-center space-x-2">
                <span>Finalize Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {step === 5 && (
          <div className="text-center space-y-6 animate-fade-in py-4">
            <div className="w-16 h-16 rounded-3xl aira-gradient-bg text-white flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,217,255,0.5)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-white">Your Store is Ready! 🎉</h2>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                AIRA has initialized your products, configured AI neural models, and generated initial sales forecasts.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-xs font-mono space-y-1.5">
              <div className="text-emerald-400 flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5" /><span>Store Profile Activated ({formData.storeName})</span></div>
              <div className="text-emerald-400 flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5" /><span>10 Demo Products Synced</span></div>
              <div className="text-emerald-400 flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5" /><span>Demand Forecast Model Online</span></div>
            </div>

            <button 
              onClick={() => navigate('/login')}
              className="w-full py-4 aira-gradient-btn text-xs font-bold flex items-center justify-center space-x-2 shadow-xl"
            >
              <span>COMPLETE REGISTRATION & LOG IN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-slate-500 py-4 font-mono">
        AIRA Retail OS © 2026
      </div>
    </div>
  )
}
