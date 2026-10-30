import React, { useState } from 'react'
import { products, forecastChartData } from '../utils/demoData'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, Legend } from 'recharts'
import { BrainCircuit, Sparkles, TrendingUp, Calendar, AlertTriangle, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react'

export default function DemandForecast() {
  const [selectedProduct, setSelectedProduct] = useState(products[0])

  return (
    <div className="space-y-6 animate-fade-in pb-24 dashboard-workspace-bg">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>AI Demand Forecast</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono aira-gradient-bg text-white">
              LIGHTGBM / PROPHET ACTIVE
            </span>
          </h1>
          <p className="text-xs text-slate-500">Predict future product demand, stockout dates, and optimal purchase order quantities.</p>
        </div>
      </div>

      {/* Main Historical vs Forecast Chart Section */}
      <div className="p-6 rounded-2xl card-dark border border-slate-800 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white">Demand Forecast Model (Next 7 Days)</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono border border-cyan-500/40">
                Confidence: {selectedProduct.confidence}%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Comparing historical sales with AI predicted trend for {selectedProduct.name}</p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-1.5"><span className="w-3 h-1 bg-blue-500 rounded" /><span>Historical Sales</span></div>
            <div className="flex items-center space-x-1.5"><span className="w-3 h-1 bg-cyan-400 rounded" /><span>AI Prediction</span></div>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d9ff" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#00d9ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(val) => `₹${val/1000}k`} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#07111f', borderRadius: '12px', borderColor: '#00d9ff', color: '#fff' }}
                formatter={(val, name) => [`₹${val}`, name === 'historical' ? 'Historical' : 'AI Forecast']}
              />
              <Area type="monotone" dataKey="historical" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#histGrad)" />
              <Area type="monotone" dataKey="forecast" stroke="#00d9ff" strokeWidth={3} strokeDasharray="4 4" fillOpacity={1} fill="url(#predGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Prediction Cards & Explainability Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Product Cards Selection List */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Product Forecast Predictions</h3>

          {products.map((prod) => (
            <div 
              key={prod.id} 
              onClick={() => setSelectedProduct(prod)}
              className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                selectedProduct.id === prod.id 
                  ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20' 
                  : 'card-light hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{prod.name}</h4>
                    <span className="text-[10px] text-slate-500">{prod.category} • SKU: {prod.sku}</span>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <div className="font-bold text-slate-900">{prod.predictedDemand} units demand</div>
                  <span className="text-[10px] font-semibold text-emerald-600">AIRA confidence {prod.confidence}%</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-[10px] text-slate-400 font-mono">CURRENT STOCK</span>
                  <div className="font-bold text-slate-900">{prod.stock} units</div>
                </div>
                <div className="p-2 rounded-lg bg-amber-50 text-amber-900">
                  <span className="text-[10px] text-amber-700 font-mono">EXPECTED STOCKOUT</span>
                  <div className="font-bold text-amber-700">{prod.stock <= prod.minStock ? '2 - 4 Days' : '10+ Days'}</div>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 text-blue-900">
                  <span className="text-[10px] text-blue-700 font-mono">RECOMMENDED PO</span>
                  <div className="font-bold text-blue-700">{prod.orderRecommendation} units</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Explainability Panel ("Why this prediction?") */}
        <div className="lg:col-span-5 p-6 rounded-2xl card-dark text-white space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Why this prediction?</h3>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 mb-4">
              <h4 className="text-sm font-bold text-cyan-300">{selectedProduct.name}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                AIRA predicts a demand of <strong className="text-white">{selectedProduct.predictedDemand} units</strong> over the next 7 days based on 4 explainability factors:
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold text-white">Recent Sales Velocity</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Sales increased by 18% in the last 14 days for this category.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold text-white">Weekend Demand Surge</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Historical weekend demand is 35% higher than weekday averages.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold text-white">Category Cross-Trend</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Similar items in {selectedProduct.category} are also trending upward.</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => window.location.href = '/app/inventory'}
            className="w-full py-3 aira-gradient-btn text-xs font-bold flex items-center justify-center space-x-2 shadow-md hover:scale-[1.01] transition-transform"
          >
            <span>Create Purchase Order ({selectedProduct.orderRecommendation} units)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
