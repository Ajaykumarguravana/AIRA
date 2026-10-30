import React, { useState } from 'react'
import IsometricStore3D from '../components/three/IsometricStore3D'
import { storeHealthDepartments, products } from '../utils/demoData'
import { Store, ShoppingCart, AlertTriangle, CheckCircle2, Sparkles, Box } from 'lucide-react'

export default function StoreHealth() {
  const [selectedDept, setSelectedDept] = useState(storeHealthDepartments[1]) // Default Grocery Critical

  return (
    <div className="space-y-6 animate-fade-in pb-24 dashboard-workspace-bg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
            <span>3D Interactive Store Health Map</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono aira-gradient-bg text-white">
              PHYSICAL-DIGITAL TWIN
            </span>
          </h1>
          <p className="text-xs text-slate-500">Visually connect physical retail store shelves with digital inventory telemetry and stock status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Store Canvas */}
        <div className="lg:col-span-8 p-3 sm:p-4 rounded-2xl card-dark relative min-h-[360px] sm:min-h-[480px] flex flex-col justify-between overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-white z-10 p-2 gap-2">
            <span className="text-xs font-mono text-cyan-400">ISOMETRIC 3D STORE FLOOR MAP</span>
            <div className="flex flex-wrap gap-2 sm:gap-3 text-[11px] font-medium">
              <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /><span>Healthy</span></span>
              <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /><span>Low Stock</span></span>
              <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /><span>Critical</span></span>
              <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /><span>Overstock</span></span>
            </div>
          </div>

          <div className="w-full h-[300px] sm:h-[400px]">
            <IsometricStore3D onSelectDepartment={setSelectedDept} interactive={true} />
          </div>
        </div>

        {/* Shelf Department Details Sidebar */}
        <div className="lg:col-span-4 p-6 rounded-2xl card-light space-y-5 flex flex-col justify-between">
          {selectedDept ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">DEPARTMENT INSPECTOR</span>
                  <h3 className="text-xl font-bold text-slate-900">{selectedDept.name}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  selectedDept.status === 'Critical' ? 'bg-rose-100 text-rose-700' :
                  selectedDept.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                  selectedDept.status === 'Overstock' ? 'bg-cyan-100 text-cyan-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {selectedDept.status}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Shelf Fill Rate:</span>
                  <span className="font-bold text-slate-900">{selectedDept.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full" 
                    style={{ width: `${selectedDept.percentage}%`, backgroundColor: selectedDept.color }} 
                  />
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Active Shelf Units:</span>
                  <span className="font-bold text-slate-900">{selectedDept.count} units</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1.5">
                <div className="flex items-center space-x-1.5 font-bold text-blue-700">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>AIRA Says...</span>
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">{selectedDept.note}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-xs text-slate-900">Items on this shelf</h4>
                {products.filter(p => p.category.toLowerCase().includes(selectedDept.name.toLowerCase().split(' ')[0])).slice(0, 3).map(prod => (
                  <div key={prod.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-900 truncate max-w-[140px]">{prod.name}</span>
                    <span className="font-bold text-slate-700">{prod.stock} left</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => window.location.href = '/app/inventory'}
                className="w-full py-3 aira-gradient-btn font-bold text-xs shadow-md hover:scale-[1.01] transition-transform"
              >
                Create Restock Action for {selectedDept.name}
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Store className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-xs">Click any shelf in the 3D store map to view stock health telemetry.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
