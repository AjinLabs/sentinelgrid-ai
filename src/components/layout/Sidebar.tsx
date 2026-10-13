'use client';

import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Map as MapIcon,
  TrendingUp,
  AlertOctagon,
  Users,
  Truck,
  Navigation,
  Building2,
  Cpu,
  Bot,
  Database,
  FileText,
  Smartphone,
  BellRing,
  FlaskConical,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Language, translations } from '@/lib/i18n';

export type ActiveTab =
  | 'overview'
  | 'commandCenter'
  | 'gisMap'
  | 'riskForecasting'
  | 'incidents'
  | 'communityReports'
  | 'resources'
  | 'routes'
  | 'shelters'
  | 'digitalTwin'
  | 'multiAgent'
  | 'dataSources'
  | 'briefings'
  | 'fieldPortal'
  | 'alerts'
  | 'modelLab'
  | 'audit'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  language: Language;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  language,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const t = translations[language];

  const navGroups = [
    {
      category: language === 'ml' ? 'കമാൻഡ് ഓപ്പറേഷൻസ്' : 'COMMAND OPERATIONS',
      items: [
        { id: 'commandCenter' as ActiveTab, label: t.nav.commandCenter, icon: Compass, badge: 'LIVE' },
        { id: 'overview' as ActiveTab, label: t.nav.overview, icon: LayoutDashboard },
        { id: 'gisMap' as ActiveTab, label: t.nav.gisMap, icon: MapIcon },
      ],
    },
    {
      category: language === 'ml' ? 'ഇന്റലിജൻസ് & സിമുലേഷൻ' : 'AI & DIGITAL TWIN',
      items: [
        { id: 'digitalTwin' as ActiveTab, label: t.nav.digitalTwin, icon: Cpu, highlight: true },
        { id: 'multiAgent' as ActiveTab, label: t.nav.multiAgent, icon: Bot, badge: '10 AGENTS' },
        { id: 'riskForecasting' as ActiveTab, label: t.nav.riskForecasting, icon: TrendingUp },
        { id: 'modelLab' as ActiveTab, label: t.nav.modelLab, icon: FlaskConical },
      ],
    },
    {
      category: language === 'ml' ? 'പ്രതികരണ ഏകോപനം' : 'RESPONSE COORDINATION',
      items: [
        { id: 'incidents' as ActiveTab, label: t.nav.incidents, icon: AlertOctagon },
        { id: 'communityReports' as ActiveTab, label: t.nav.communityReports, icon: Users },
        { id: 'resources' as ActiveTab, label: t.nav.resources, icon: Truck },
        { id: 'routes' as ActiveTab, label: t.nav.routes, icon: Navigation },
        { id: 'shelters' as ActiveTab, label: t.nav.shelters, icon: Building2 },
      ],
    },
    {
      category: language === 'ml' ? 'ഫീൽഡ് & ഭരണനിർവ്വഹണം' : 'FIELD & GOVERNANCE',
      items: [
        { id: 'fieldPortal' as ActiveTab, label: t.nav.fieldPortal, icon: Smartphone, badge: 'OFFLINE' },
        { id: 'briefings' as ActiveTab, label: t.nav.briefings, icon: FileText },
        { id: 'alerts' as ActiveTab, label: t.nav.alerts, icon: BellRing },
        { id: 'dataSources' as ActiveTab, label: t.nav.dataSources, icon: Database },
        { id: 'audit' as ActiveTab, label: t.nav.audit, icon: ScrollText },
        { id: 'settings' as ActiveTab, label: t.nav.settings, icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`relative h-[calc(100vh-4rem)] border-r border-[#A8DFFA] bg-[#F8FDFF] transition-all duration-300 flex flex-col z-10 shadow-xs ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation Links Scrollable Area */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
        {navGroups.map((grp, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <div className="px-2.5 py-1 text-[10px] font-black tracking-widest text-[#0284C7] uppercase">
                {grp.category}
              </div>
            )}
            {grp.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition group relative ${
                    isActive
                      ? 'bg-[#0284C7] text-white shadow-md shadow-[#0284C7]/25 font-bold'
                      : item.highlight
                      ? 'bg-[#E0F2FE] text-[#0284C7] hover:bg-[#A8DFFA]/40 border border-[#A8DFFA]'
                      : 'text-[#334E68] hover:text-[#0C2340] hover:bg-[#E0F2FE]/70'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive
                        ? 'text-white scale-110'
                        : item.highlight
                        ? 'text-[#0284C7]'
                        : 'text-[#527494] group-hover:text-[#0C2340]'
                    }`}
                  />
                  {!collapsed && (
                    <span className="truncate text-left flex-1">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-black ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : item.badge === 'LIVE'
                          ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 animate-pulse'
                          : 'bg-[#A8DFFA]/40 text-[#0369A1] border border-[#A8DFFA]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Friendly Decision Support Safety Footer */}
      {!collapsed && (
        <div className="p-3 m-2.5 rounded-xl bg-white border border-[#A8DFFA] text-[10px] text-[#334E68] leading-relaxed shadow-xs">
          <div className="flex items-center gap-1.5 text-[#0284C7] font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
            <span>Decision Support Mode</span>
          </div>
          <p className="text-[10px] text-[#527494]">
            Official public warnings require verified incident commander authorization.
          </p>
        </div>
      )}

      {/* Collapse Toggle Button */}
      <div className="p-2 border-t border-[#A8DFFA] flex justify-end bg-white/50">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-xl text-[#527494] hover:text-[#0C2340] hover:bg-[#E0F2FE] transition"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-[#0284C7]" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-[#0284C7]" />
          )}
        </button>
      </div>
    </aside>
  );
}
