import React from 'react'
import { customerAnalytics } from '../utils/demoData'
import { Users, UserPlus, RefreshCw, DollarSign, TrendingUp } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid } from 'recharts'

export default function Customers() {
  return (
    <div className="space-y-6 animate-fade-in pb-24 dashboard-workspace-bg">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Analytics</h1>
        <p className="text-xs text-slate-500">Track customer growth, repeat purchase rate, and average spending per store visitor.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl card-light flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><Users className="w-5 h-5" /></div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Total Customers</span>
            <div className="text-2xl font-bold text-slate-900">{customerAnalytics.totalCustomers}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl card-light flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-cyan-50 text-cyan-600"><UserPlus className="w-5 h-5" /></div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium">New Customers</span>
            <div className="text-2xl font-bold text-slate-900">{customerAnalytics.newCustomers}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl card-light flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600"><RefreshCw className="w-5 h-5" /></div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Repeat Purchase Rate</span>
            <div className="text-2xl font-bold text-slate-900">{customerAnalytics.repeatRate}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl card-light flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600"><DollarSign className="w-5 h-5" /></div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Avg Spending / Visit</span>
            <div className="text-2xl font-bold text-slate-900">{customerAnalytics.avgSpending}</div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl card-light">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Customer Base Growth Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={customerAnalytics.growthChart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#07111f', borderRadius: '12px', color: '#fff' }} />
              <Area type="monotone" dataKey="customers" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
