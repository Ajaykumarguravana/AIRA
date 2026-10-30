import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { salesOverviewChart, categoryPerformance, products } from '../utils/demoData'
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid } from 'recharts'
import { TrendingUp, DollarSign, Package, ShoppingBag, Calendar, Award, Filter, RefreshCw, ArrowRight } from 'lucide-react'

export default function SalesAnalytics() {
  const [rangeMode, setRangeMode] = useState('7d')
  
  // Custom Date Picker Calendar state
  const [startDate, setStartDate] = useState('2026-10-01')
  const [endDate, setEndDate] = useState('2026-10-07')
  const [activeData, setActiveData] = useState(salesOverviewChart)

  const CATEGORY_COLORS = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#00d9ff']

  // Handle custom date selection
  const handleDateChange = (start, end) => {
    setStartDate(start)
    setEndDate(end)
    setRangeMode('custom')

    // Filter or adjust dataset based on dates
    const filtered = salesOverviewChart.filter(item => {
      if (!item.date) return true
      return item.date >= start && item.date <= end
    })

    setActiveData(filtered.length > 0 ? filtered : salesOverviewChart)
  }

  return (
    <div className="space-y-6 animate-fade-in pb-24 dashboard-workspace-bg max-w-7xl mx-auto">
      {/* Title & Interactive Date Picker Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sales Intelligence & Revenue Analytics</h1>
          <p className="text-xs text-slate-500">Analyze sales volume, average order values, and pick custom calendar dates to inspect revenue trends.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link 
            to="/app/product-stats" 
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition-colors"
          >
            <DollarSign className="w-4 h-4" />
            <span>Product Profit & Stats Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Custom Calendar Date Picker Controls */}
        <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-700 font-semibold">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Select Dates:</span>
          </div>

          <div className="flex items-center space-x-2">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => handleDateChange(e.target.value, endDate)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-500"
            />
            <span className="text-slate-400 font-bold">to</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => handleDateChange(startDate, e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl font-semibold text-slate-600 text-[11px]">
            <button 
              onClick={() => { setRangeMode('7d'); setActiveData(salesOverviewChart); }} 
              className={`px-3 py-1 rounded-lg ${rangeMode === '7d' ? 'bg-white text-blue-600 shadow-sm' : ''}`}
            >
              Last 7 Days
            </button>
            <button 
              onClick={() => { setRangeMode('30d'); setActiveData(salesOverviewChart); }} 
              className={`px-3 py-1 rounded-lg ${rangeMode === '30d' ? 'bg-white text-blue-600 shadow-sm' : ''}`}
            >
              Last 30 Days
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl card-light">
          <span className="text-xs text-slate-500 font-medium">Average Order Value (AOV)</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">₹762.27</div>
          <span className="text-[11px] text-emerald-600 font-semibold">+4.2% vs previous period</span>
        </div>

        <div className="p-5 rounded-2xl card-light">
          <span className="text-xs text-slate-500 font-medium">Selected Date Range Sales</span>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            ₹{activeData.reduce((acc, curr) => acc + (curr.revenue || curr.sales || 0), 0).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">{startDate} to {endDate}</span>
        </div>

        <div className="p-5 rounded-2xl card-light">
          <span className="text-xs text-slate-500 font-medium">Peak Sales Hour</span>
          <div className="text-2xl font-bold text-purple-600 mt-1">6:00 PM - 8:30 PM</div>
          <span className="text-[11px] text-slate-500 font-semibold">Evening rush hour</span>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-2xl card-light">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Revenue & Order Volume Trend</h3>
              <p className="text-xs text-slate-500 font-mono">Filtered view: {startDate} → {endDate}</p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-600">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Revenue (₹)</span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(val) => `₹${val/1000}k`} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#07111f', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 p-6 rounded-2xl card-light">
          <h3 className="text-base font-bold text-slate-900 mb-4">Revenue Share by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryPerformance} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {categoryPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#07111f', borderRadius: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
