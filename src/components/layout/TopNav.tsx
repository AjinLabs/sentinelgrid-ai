'use client';

import React from 'react';
import {
  ShieldAlert,
  Globe,
  Radio,
  Bell,
  Search,
  User,
  Activity,
  Layers,
  ChevronDown,
  CloudSun,
} from 'lucide-react';
import { Language, translations } from '@/lib/i18n';
import { keralaDistrictsList } from '@/lib/mock-data';
import { UserProfile } from '@/types/disaster';

interface TopNavProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  currentUser: UserProfile;
  unreadAlertCount: number;
  onOpenAlerts: () => void;
  onSearchClick: () => void;
}

export default function TopNav({
  language,
  onLanguageChange,
  selectedDistrict,
  onDistrictChange,
  isDemoMode,
  onToggleDemoMode,
  currentUser,
  unreadAlertCount,
  onOpenAlerts,
  onSearchClick,
}: TopNavProps) {
  const t = translations[language];

  return (
    <header className="h-16 border-b border-[#A8DFFA] bg-white/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20 select-none shadow-sm">
      {/* Brand & Mission Tag in Cloud & Sky Palette */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#A8DFFA] text-[#0369A1] flex items-center justify-center shadow-md shadow-[#A8DFFA]/40 font-bold">
            <CloudSun className="w-5 h-5 text-[#0369A1]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base text-[#0C2340]">
                SENTINEL<span className="text-[#0284C7]">GRID</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1] border border-[#A8DFFA] font-bold">
                OS v2.4
              </span>
            </div>
            <p className="text-[10px] text-[#476685] hidden md:block">
              {t.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Operational Selectors: District & Global Search */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* District Selector */}
        <div className="relative">
          <select
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="bg-[#F1FCFF] text-[#0C2340] border border-[#A8DFFA] rounded-xl px-3.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-[#A8DFFA]/50 cursor-pointer shadow-sm transition"
          >
            <option value="all">🌐 {t.districts.all}</option>
            {keralaDistrictsList.map((d) => (
              <option key={d} value={d}>
                📍 {(t.districts as any)[d] || d}
              </option>
            ))}
          </select>
        </div>

        {/* Global Command Search */}
        <button
          onClick={onSearchClick}
          className="hidden lg:flex items-center gap-2 bg-[#F1FCFF] border border-[#A8DFFA] px-3.5 py-1.5 rounded-xl text-xs text-[#476685] hover:border-[#0284C7] hover:text-[#0C2340] transition shadow-sm"
        >
          <Search className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>Quick command search...</span>
          <kbd className="text-[10px] bg-white border border-[#A8DFFA] px-1.5 rounded text-[#0C2340] font-mono shadow-xs">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Mode Toggle, Language, Alert Center, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Demo / Live Indicator & Toggle */}
        <button
          onClick={onToggleDemoMode}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-bold border transition shadow-sm ${
            isDemoMode
              ? 'bg-[#E0F2FE] border-[#A8DFFA] text-[#0284C7]'
              : 'bg-[#ECFDF5] border-[#10B981]/40 text-[#059669]'
          }`}
          title="Toggle Simulation Demo / Live Telemetry Mode"
        >
          <Radio className={`w-3.5 h-3.5 ${isDemoMode ? '' : 'animate-pulse'}`} />
          <span className="hidden sm:inline">
            {isDemoMode ? t.common.demoMode : t.common.liveMode}
          </span>
        </button>

        {/* Language Switcher */}
        <div className="flex items-center bg-[#F1FCFF] border border-[#A8DFFA] rounded-xl p-0.5 text-xs shadow-sm">
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${
              language === 'en'
                ? 'bg-[#0284C7] text-white shadow-sm'
                : 'text-[#476685] hover:text-[#0C2340]'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange('ml')}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${
              language === 'ml'
                ? 'bg-[#0284C7] text-white shadow-sm'
                : 'text-[#476685] hover:text-[#0C2340]'
            }`}
          >
            മലയാളം
          </button>
        </div>

        {/* Notifications & Warnings */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 rounded-xl bg-[#F1FCFF] border border-[#A8DFFA] text-[#0C2340] hover:bg-[#E0F2FE] transition shadow-sm"
          title="Early Warning & Alerts"
        >
          <Bell className="w-4 h-4 text-[#0284C7]" />
          {unreadAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF4444] text-white rounded-full text-[9px] font-black flex items-center justify-center animate-pulse">
              {unreadAlertCount}
            </span>
          )}
        </button>

        {/* Current User Badge */}
        <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-[#A8DFFA]">
          <div className="w-8 h-8 rounded-full bg-[#A8DFFA] text-[#0369A1] flex items-center justify-center text-xs font-black shadow-sm">
            AR
          </div>
          <div className="text-left text-xs leading-tight">
            <div className="font-bold text-[#0C2340]">{currentUser.name}</div>
            <div className="text-[10px] text-[#0284C7] font-mono font-semibold">
              {currentUser.role}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
