'use client';

import React, { useState } from 'react';
import TopNav from '@/components/layout/TopNav';
import Sidebar, { ActiveTab } from '@/components/layout/Sidebar';
import LiveCommandCenter from '@/components/command-center/LiveCommandCenter';
import ExecutiveOverview from '@/components/executive/ExecutiveOverview';
import SentinelMap from '@/components/map/SentinelMap';
import DigitalDisasterTwin from '@/components/digital-twin/DigitalDisasterTwin';
import MultiAgentWorkspace from '@/components/multi-agent/MultiAgentWorkspace';
import RiskForecastingView from '@/components/risk-forecasting/RiskForecastingView';
import IncidentManagement from '@/components/incidents/IncidentManagement';
import CommunityReports from '@/components/community/CommunityReports';
import ResourceRescueOperations from '@/components/resources/ResourceRescueOperations';
import EvacuationRoutePlanner from '@/components/routes/EvacuationRoutePlanner';
import SheltersHospitalsManager from '@/components/shelters/SheltersHospitalsManager';
import FieldResponderPortal from '@/components/field-portal/FieldResponderPortal';
import SituationBriefingGenerator from '@/components/briefings/SituationBriefingGenerator';
import AlertNotificationCenter from '@/components/alerts/AlertNotificationCenter';
import DataSourcesManager from '@/components/data-sources/DataSourcesManager';
import ModelPerformanceLab from '@/components/model-lab/ModelPerformanceLab';
import AuditGovernanceView from '@/components/audit/AuditGovernanceView';
import PlatformSettings from '@/components/settings/PlatformSettings';

import {
  initialIncidents,
  initialFacilities,
  initialResources,
  initialRiverStations,
  initialRainfallStations,
  initialDataSources,
  initialCurrentUser,
  initialAlerts,
} from '@/lib/mock-data';
import { Language, translations } from '@/lib/i18n';
import { IncidentStatus, Incident } from '@/types/disaster';
import { AlertOctagon, X, Search, Command } from 'lucide-react';

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<ActiveTab>('commandCenter');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Core persistent operational state
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [facilities, setFacilities] = useState(initialFacilities);
  const [resources, setResources] = useState(initialResources);
  const [riverStations, setRiverStations] = useState(initialRiverStations);
  const [rainfallStations, setRainfallStations] = useState(initialRainfallStations);
  const [dataSources, setDataSources] = useState(initialDataSources);
  const [alerts, setAlerts] = useState(initialAlerts);

  // Command palette search modal
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');

  // Emergency banner visibility
  const [showEmergencyBanner, setShowEmergencyBanner] = useState(true);

  const t = translations[language];

  const handleUpdateIncidentStatus = (
    incidentId: string,
    newStatus: IncidentStatus
  ) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              status: newStatus,
              timeline: [
                ...inc.timeline,
                {
                  timestamp: new Date().toISOString(),
                  action: `Status transitioned to ${newStatus}`,
                  actor: `${initialCurrentUser.name} (${initialCurrentUser.role})`,
                },
              ],
            }
          : inc
      )
    );
  };

  const commandItems = [
    { label: 'Live Command Centre (GIS Map)', tab: 'commandCenter' as ActiveTab },
    { label: 'Executive Disaster Overview', tab: 'overview' as ActiveTab },
    { label: 'Digital Disaster Twin Simulator', tab: 'digitalTwin' as ActiveTab },
    { label: 'Multi-Agent AI Ops Workspace', tab: 'multiAgent' as ActiveTab },
    { label: 'AI Risk Forecasting (Flood / Landslide)', tab: 'riskForecasting' as ActiveTab },
    { label: 'Incident Command Lifecycle', tab: 'incidents' as ActiveTab },
    { label: 'Community Ground Reports', tab: 'communityReports' as ActiveTab },
    { label: 'Rescue Teams & Inventory', tab: 'resources' as ActiveTab },
    { label: 'Evacuation & Route Planning', tab: 'routes' as ActiveTab },
    { label: 'Relief Shelters & Hospitals', tab: 'shelters' as ActiveTab },
    { label: 'Field Responder Portal (Offline)', tab: 'fieldPortal' as ActiveTab },
    { label: 'Situation Briefing (SITREP)', tab: 'briefings' as ActiveTab },
    { label: 'Early Warning Broadcast Centre', tab: 'alerts' as ActiveTab },
    { label: 'Data Sources & Telemetry Ingestion', tab: 'dataSources' as ActiveTab },
    { label: 'Model Performance & Drift Lab', tab: 'modelLab' as ActiveTab },
    { label: 'Audit Ledger & Decisions', tab: 'audit' as ActiveTab },
    { label: 'System Configuration', tab: 'settings' as ActiveTab },
  ];

  const filteredCommands = commandItems.filter((c) =>
    c.label.toLowerCase().includes(commandSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F1FCFF] text-[#0C2340] flex flex-col font-sans">
      {/* Emergency Alert Banner - Friendly Reassuring Sky Alert */}
      {showEmergencyBanner && (
        <div className="bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] text-white px-4 py-2.5 flex items-center justify-between text-xs font-semibold shadow-md z-30">
          <div className="flex items-center gap-2 max-w-5xl truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping shrink-0" />
            <AlertOctagon className="w-4 h-4 shrink-0 text-white" />
            <span className="truncate">
              {language === 'ml'
                ? 'അതീവ ജാഗ്രത: വയനാട് ചൂരൽമലയിൽ കനത്ത ഉരുൾപൊട്ടൽ; പെരിയാറിൽ ജലനിരപ്പ് അപകടനില കടന്നു.'
                : 'CRITICAL ALERT: Catastrophic debris flow at Chooralmala-Meppadi axis; Periyar River bank overflow active at Aluva.'}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('alerts')}
              className="text-[11px] underline font-bold hover:text-[#F1FCFF] transition"
            >
              {language === 'ml' ? 'മുന്നറിയിപ്പ് കാണുക' : 'View Advisory'}
            </button>
            <button
              onClick={() => setShowEmergencyBanner(false)}
              className="hover:opacity-80 p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <TopNav
        language={language}
        onLanguageChange={setLanguage}
        selectedDistrict={selectedDistrict}
        onDistrictChange={setSelectedDistrict}
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
        currentUser={initialCurrentUser}
        unreadAlertCount={alerts.filter((a) => a.status !== 'APPROVED_DISPATCHED').length}
        onOpenAlerts={() => setActiveTab('alerts')}
        onSearchClick={() => setCommandOpen(true)}
      />

      {/* Main Operational Container */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          language={language}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Dynamic Workspace Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F1FCFF]">
          {activeTab === 'commandCenter' && (
            <LiveCommandCenter
              language={language}
              incidents={incidents}
              facilities={facilities}
              riverStations={riverStations}
              rainfallStations={rainfallStations}
              selectedDistrict={selectedDistrict}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'overview' && (
            <ExecutiveOverview
              language={language}
              incidents={incidents}
              facilities={facilities}
              resources={resources}
              riverStations={riverStations}
              rainfallStations={rainfallStations}
              dataSources={dataSources}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'gisMap' && (
            <div className="h-[calc(100vh-8rem)]">
              <SentinelMap
                incidents={incidents}
                facilities={facilities}
                riverStations={riverStations}
                rainfallStations={rainfallStations}
                selectedDistrict={selectedDistrict}
              />
            </div>
          )}

          {activeTab === 'digitalTwin' && (
            <DigitalDisasterTwin
              language={language}
              onPromotePlanToOps={(planId) => {
                setActiveTab('incidents');
              }}
            />
          )}

          {activeTab === 'multiAgent' && (
            <MultiAgentWorkspace
              language={language}
              selectedDistrict={selectedDistrict}
              onApprovePlan={(sess) => {
                setActiveTab('incidents');
              }}
            />
          )}

          {activeTab === 'riskForecasting' && (
            <RiskForecastingView
              language={language}
              selectedDistrict={selectedDistrict}
            />
          )}

          {activeTab === 'incidents' && (
            <IncidentManagement
              language={language}
              incidents={incidents}
              onUpdateIncidentStatus={handleUpdateIncidentStatus}
              onSelectIncidentForMap={(inc) => {
                setActiveTab('commandCenter');
              }}
            />
          )}

          {activeTab === 'communityReports' && (
            <CommunityReports language={language} />
          )}

          {activeTab === 'resources' && (
            <ResourceRescueOperations language={language} />
          )}

          {activeTab === 'routes' && (
            <EvacuationRoutePlanner language={language} />
          )}

          {activeTab === 'shelters' && (
            <SheltersHospitalsManager language={language} />
          )}

          {activeTab === 'fieldPortal' && (
            <FieldResponderPortal language={language} />
          )}

          {activeTab === 'briefings' && (
            <SituationBriefingGenerator
              language={language}
              incidents={incidents}
              facilities={facilities}
              resources={resources}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertNotificationCenter language={language} />
          )}

          {activeTab === 'dataSources' && (
            <DataSourcesManager language={language} />
          )}

          {activeTab === 'modelLab' && (
            <ModelPerformanceLab language={language} />
          )}

          {activeTab === 'audit' && (
            <AuditGovernanceView language={language} />
          )}

          {activeTab === 'settings' && (
            <PlatformSettings language={language} />
          )}
        </main>
      </div>

      {/* Global Command Palette Modal */}
      {commandOpen && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-xs z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-white border border-[#A8DFFA] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-3.5 border-b border-[#A8DFFA] flex items-center gap-2.5 bg-[#F8FDFF]">
              <Search className="w-4 h-4 text-[#0284C7]" />
              <input
                type="text"
                autoFocus
                value={commandSearch}
                onChange={(e) => setCommandSearch(e.target.value)}
                placeholder="Jump to operational section or module..."
                className="bg-transparent text-sm text-[#0C2340] placeholder-[#627D98] focus:outline-none w-full"
              />
              <button
                onClick={() => setCommandOpen(false)}
                className="text-[#627D98] hover:text-[#0C2340] text-xs px-2 py-0.5 rounded-lg bg-[#E0F2FE] border border-[#A8DFFA]"
              >
                ESC
              </button>
            </div>

            <div className="p-2 max-h-80 overflow-y-auto space-y-1">
              {filteredCommands.map((item) => (
                <button
                  key={item.tab}
                  onClick={() => {
                    setActiveTab(item.tab);
                    setCommandOpen(false);
                  }}
                  className="w-full text-left p-3 rounded-xl text-xs hover:bg-[#E0F2FE] text-[#334E68] hover:text-[#0C2340] transition flex items-center justify-between"
                >
                  <span className="font-semibold">{item.label}</span>
                  <span className="text-[10px] text-[#0284C7] font-mono font-bold">
                    /{item.tab}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
