import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, TrendingUp, Zap, ShoppingCart, RefreshCw, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function NodeInspector({ node, onClose }) {
  if (!node) return null

  const isProduct = node.type === 'product'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 380, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 380, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-96 bg-[#070f26]/95 border-l border-cyan-500/30 backdrop-blur-2xl p-6 flex flex-col justify-between shadow-2xl h-full z-40"
      >
        {/* Header */}
        <div>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full shadow-[0_0_12px]" 
                style={{ backgroundColor: node.color, boxShadow: `0 0 12px ${node.color}` }} 
              />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                  NODE TYPE: {node.type.toUpperCase()}
                </span>
                <h3 className="text-xl font-bold text-white tracking-wide">{node.label}</h3>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Node Health Badge */}
          <div className="mb-6 p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/20 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400">NODE CLUSTER STATUS</span>
              <div className="flex items-center space-x-2 mt-1">
                {node.status === 'critical' ? (
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>CRITICAL INVENTORY ALERT</span>
                  </span>
                ) : node.status === 'warning' ? (
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>LOW STOCK WARNING</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>HEALTHY STREAM</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Product Metrics Grid */}
          {isProduct ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/15">
                  <span className="text-[11px] text-gray-400 font-mono">CURRENT STOCK</span>
                  <div className="text-2xl font-extrabold text-white mt-1">
                    {node.stock} <span className="text-xs text-gray-400 font-normal">units</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/15">
                  <span className="text-[11px] text-gray-400 font-mono">MIN THRESHOLD</span>
                  <div className="text-2xl font-extrabold text-cyan-300 mt-1">
                    {node.minStock} <span className="text-xs text-gray-400 font-normal">units</span>
                  </div>
                </div>
              </div>

              {/* Stock Meter */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/20">
                <div className="flex justify-between text-xs mb-1.5 font-mono">
                  <span className="text-gray-400">Stock Fill Level</span>
                  <span className="text-cyan-300">
                    {Math.round((node.stock / (node.minStock * 2.5)) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/20">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      node.stock <= node.minStock ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 'bg-cyan-400 shadow-[0_0_10px_#00f0ff]'
                    }`}
                    style={{ width: `${Math.min(100, Math.round((node.stock / (node.minStock * 2.5)) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Price & Velocity */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/10 text-xs">
                  <span className="text-gray-400">UNIT PRICE</span>
                  <p className="text-lg font-bold text-emerald-400 mt-0.5">₹{node.price}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/10 text-xs">
                  <span className="text-gray-400">SALES VELOCITY</span>
                  <p className="text-lg font-bold text-purple-400 mt-0.5">{node.velocity}</p>
                </div>
              </div>

              {/* AI Prediction Box */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 to-purple-950/40 border border-cyan-500/30">
                <div className="flex items-center space-x-2 text-cyan-300 text-xs font-bold mb-1">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>AIRA AI PREDICTION</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {node.stock <= node.minStock 
                    ? `Estimated stockout in 1.5 days. Automated purchase order recommendation generated.`
                    : `Demands projected to rise by 24% over the upcoming weekend.`}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/20 text-center space-y-3">
              <Layers className="w-10 h-10 text-cyan-400 mx-auto" />
              <h4 className="font-bold text-cyan-200">CLUSTER OVERVIEW</h4>
              <p className="text-xs text-gray-400">
                Aggregating real-time telemetry across all child node items attached to this group.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-6">
          <button className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-opacity">
            <RefreshCw className="w-4 h-4" />
            <span>TRIGGER NEURAL RE-SYNC</span>
          </button>

          {isProduct && node.stock <= node.minStock && (
            <button className="w-full py-3 px-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs tracking-wider flex items-center justify-center space-x-2 hover:bg-rose-500/30 transition-colors">
              <ShoppingCart className="w-4 h-4" />
              <span>AUTO RESTOCK (PO #8492)</span>
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
