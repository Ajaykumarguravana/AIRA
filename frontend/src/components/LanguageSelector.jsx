import React, { useState, useRef, useEffect } from 'react'
import { Languages, ChevronDown, Check, Globe } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function LanguageSelector({ variant = 'navbar', className = '' }) {
  const { language, setLanguage, currentLanguageInfo, languages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1.5 transition-all text-xs font-semibold rounded-xl ${
          variant === 'sidebar'
            ? 'w-full p-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 justify-between'
            : variant === 'settings'
            ? 'p-2.5 bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100 justify-between w-full'
            : 'px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 hover:border-blue-400'
        }`}
        title="Switch Indian Language (भाषा बदलें)"
      >
        <div className="flex items-center space-x-1 sm:space-x-1.5 truncate">
          <span className="text-sm shrink-0">{currentLanguageInfo.flag}</span>
          <span className={`${variant === 'navbar' ? 'hidden sm:inline' : 'inline'} truncate`}>{currentLanguageInfo.nativeName}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 sm:w-56 max-h-72 sm:max-h-80 overflow-y-auto bg-[#07111f] border border-slate-700/80 rounded-2xl shadow-2xl p-1.5 z-50 text-xs backdrop-blur-xl animate-fade-in scrollbar-thin">
          <div className="px-3 py-2 border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-cyan-400 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Languages className="w-3.5 h-3.5" />
              <span>Select Indian Language</span>
            </span>
            <span className="text-slate-500">10 Languages</span>
          </div>

          <div className="py-1 space-y-0.5">
            {languages.map((lang) => {
              const isSelected = lang.code === language
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code)
                    setIsOpen(false)
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="text-base shrink-0">{lang.flag}</span>
                    <div className="truncate">
                      <div className="font-semibold text-xs leading-none">{lang.nativeName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-none">{lang.name}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-cyan-300 shrink-0 ml-1" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
