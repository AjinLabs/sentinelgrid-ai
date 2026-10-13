'use client';

import React, { useState } from 'react';
import SentinelMap, { MapLayerState } from '@/components/map/SentinelMap';
import {
  Incident,
  Facility,
  RiverStation,
  RainfallStation,
} from '@/types/disaster';
import {
  Layers,
  Info,
  MapPin,
  AlertTriangle,
  Building2,
  Waves,
  CloudRain,
  ChevronRight,
  ShieldAlert,
  Send,
  Navigation,
  ExternalLink,
  Clock,
  Gauge,
  Flame,
  Radio,
  Eye,
  CheckCircle2,
  Activity,
  Layers2,
} from 'lucide-react';
import { Language, translations } from '@/lib/i18n';

interface LiveCommandCenterProps {
  language: Language;
  incidents: Incident[];
  facilities: Facility[];
  riverStations: RiverStation[];
  rainfallStations: RainfallStation[];
  selectedDistrict: string;
  onNavigateToTab: (tab: any) => void;
}

export default function LiveCommandCenter({
  language,
  incidents,
  facilities,
  riverStations,
  rainfallStations,
  selectedDistrict,
  onNavigateToTab,
}: LiveCommandCenterProps) {
  const t = translations[language];

  // Layer Toggles
  const [layers, setLayers] = useState<MapLayerState>({
    incidents: true,
    floodZones: true,
    landslideZones: true,
    shelters: true,
    riverGauges: true,
    rainfallStations: true,
    roadClosures: true,
  });

  // Selected feature in Context Inspector
  const [selectedFeature, setSelectedFeature] = useState<{
    type: 'INCIDENT' | 'FACILITY' | 'RIVER' | 'RAIN' | 'REGION';
    data: any;
  }>({
    type: 'INCIDENT',
    data: incidents[0],
  });

  const [inspectorOpen, setInspectorOpen] = useState(true);

  const handleToggleLayer = (layerKey: keyof MapLayerState) => {
    setLayers((p) => ({
      ...p,
      [layerKey]: !p[layerKey],
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-7rem)] min-h-[640px]">
      {/* Main Operational Map Workspace (Left/Center) */}
      <div className="flex-1 flex flex-col h-full bg-white border border-[#A8DFFA] rounded-2xl overflow-hidden relative shadow-md">
        {/* Interactive GIS Map with Unified Cloud & Sky Google Maps Toolbar */}
        <SentinelMap
          incidents={incidents}
          facilities={facilities}
          riverStations={riverStations}
          rainfallStations={rainfallStations}
          selectedDistrict={selectedDistrict}
          activeLayers={layers}
          onToggleLayer={handleToggleLayer}
          highlightedIncidentId={
            selectedFeature.type === 'INCIDENT'
              ? selectedFeature.data.id
              : undefined
          }
          onSelectFeature={(feat) => {
            setSelectedFeature(feat);
            setInspectorOpen(true);
          }}
        />
      </div>

      {/* Right Contextual Spatial Inspector Panel in Cloud & Sky */}
      {inspectorOpen && (
        <div className="w-full lg:w-[420px] bg-white border border-[#A8DFFA] rounded-2xl flex flex-col h-full shadow-md overflow-hidden shrink-0">
          {/* Header */}
          <div className="p-3.5 border-b border-[#A8DFFA] flex items-center justify-between bg-[#F8FDFF]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0284C7] animate-ping" />
              <h2 className="text-xs font-extrabold text-[#0C2340] uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Contextual Spatial Inspector</span>
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0284C7] border border-[#A8DFFA] font-bold">
              {selectedFeature.type}
            </span>
          </div>

          {/* Details Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* If Incident */}
            {selectedFeature.type === 'INCIDENT' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        selectedFeature.data.severity === 'CRITICAL'
                          ? 'bg-[#EF4444] text-white shadow-xs'
                          : 'bg-[#F97316] text-white shadow-xs'
                      }`}
                    >
                      {selectedFeature.data.severity} {selectedFeature.data.hazardType}
                    </span>
                    <span className="text-[10px] font-mono text-[#476685] bg-[#F1FCFF] px-2 py-0.5 rounded border border-[#A8DFFA]">
                      ID: {selectedFeature.data.id}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0C2340] leading-tight">
                    {selectedFeature.data.title}
                  </h3>
                  <div className="text-[11px] text-[#476685] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                    <span>{selectedFeature.data.location.address}</span>
                  </div>
                </div>

                {/* Direct Google Maps Action Bar */}
                <div className="p-2.5 rounded-xl bg-[#F1FCFF] border border-[#A8DFFA] flex items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#334E68] font-medium">
                    <Navigation className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Google Maps Lat/Lng:</span>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${selectedFeature.data.location.lat},${selectedFeature.data.location.lng}&t=k`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white text-[11px] font-bold transition shadow-xs"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Incident Narrative */}
                <div className="p-3.5 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA] text-[11px] text-[#334E68] leading-relaxed shadow-2xs">
                  {selectedFeature.data.description}
                </div>

                {/* Tactical Status Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-[#F1FCFF] border border-[#A8DFFA]">
                    <span className="text-[#627D98] block text-[10px] font-medium">Operational Status</span>
                    <b className="text-[#0C2340] font-bold flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse" />
                      {selectedFeature.data.status}
                    </b>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F1FCFF] border border-[#A8DFFA]">
                    <span className="text-[#627D98] block text-[10px] font-medium">Population Exposed</span>
                    <b className="text-[#0284C7] font-mono font-bold text-xs mt-0.5 block">
                      {selectedFeature.data.affectedPopulationEstimate.toLocaleString()} est.
                    </b>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F1FCFF] border border-[#A8DFFA]">
                    <span className="text-[#627D98] block text-[10px] font-medium">Assigned Unit</span>
                    <b className="text-[#0C2340] font-mono mt-0.5 block font-bold">
                      {selectedFeature.data.assignedTeamId || 'Unassigned'}
                    </b>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F1FCFF] border border-[#A8DFFA]">
                    <span className="text-[#627D98] block text-[10px] font-medium">KSDMA Verification</span>
                    <b className="text-[#059669] flex items-center gap-1 mt-0.5 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {selectedFeature.data.verificationStatus}
                    </b>
                  </div>
                </div>

                {/* Resource Requirements */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-[#627D98] uppercase tracking-wider block">
                    Critical Resource Needs:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFeature.data.resourceNeeds.map((need: string, i: number) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-[#E0F2FE] border border-[#A8DFFA] text-[10px] text-[#0369A1] font-bold"
                      >
                        {need}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Incident Timeline */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-[#627D98] uppercase tracking-wider block">
                    Operational Chronology:
                  </span>
                  <div className="space-y-2 border-l-2 border-[#0284C7] pl-3 ml-1">
                    {selectedFeature.data.timeline.map((item: any, i: number) => (
                      <div key={i} className="text-[10px] space-y-0.5">
                        <div className="text-[#0284C7] font-mono font-bold">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="text-[#0C2340] font-medium">{item.action}</div>
                        <div className="text-[#627D98]">{item.actor}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* If Facility */}
            {selectedFeature.type === 'FACILITY' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#059669] uppercase tracking-wider">
                    {selectedFeature.data.type}
                  </span>
                  <h3 className="text-sm font-bold text-[#0C2340]">
                    {selectedFeature.data.name}
                  </h3>
                  <p className="text-[11px] text-[#476685]">
                    {selectedFeature.data.location.address}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F1FCFF] border border-[#A8DFFA] flex items-center justify-between">
                  <span className="text-[#334E68] text-[11px] font-medium">Google Maps Route:</span>
                  <a
                    href={`https://maps.google.com/?q=${selectedFeature.data.location.lat},${selectedFeature.data.location.lng}&t=k`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0284C7] text-white text-[11px] font-bold"
                  >
                    <span>Navigate</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-[#F1FCFF] border border-[#A8DFFA]">
                    <span className="text-[#627D98] block text-[10px]">Occupancy</span>
                    <b className="text-[#0C2340]">
                      {selectedFeature.data.currentOccupancy} / {selectedFeature.data.totalCapacity}
                    </b>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F1FCFF] border border-[#A8DFFA]">
                    <span className="text-[#627D98] block text-[10px]">Available Beds</span>
                    <b className="text-[#059669] font-mono text-xs font-bold">
                      {selectedFeature.data.availableCapacity} beds
                    </b>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA] space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#627D98]">Backup Generator:</span>
                    <b className="text-[#059669]">
                      {selectedFeature.data.hasPowerBackup ? 'Operational' : 'No'}
                    </b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#627D98]">Clean Water Supply:</span>
                    <b className="text-[#059669]">
                      {selectedFeature.data.hasCleanWater ? 'Available' : 'No'}
                    </b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#627D98]">Hotline Contact:</span>
                    <b className="text-[#0C2340] font-mono">
                      {selectedFeature.data.contactPhone}
                    </b>
                  </div>
                </div>
              </div>
            )}

            {/* If River Gauge */}
            {selectedFeature.type === 'RIVER' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#0284C7] uppercase tracking-wider">
                    CWC RIVER GAUGE TELEMETRY
                  </span>
                  <h3 className="text-sm font-bold text-[#0C2340]">
                    {selectedFeature.data.name}
                  </h3>
                  <p className="text-[11px] text-[#476685]">
                    River: {selectedFeature.data.river} ({selectedFeature.data.district})
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F1FCFF] border border-[#A8DFFA] space-y-2 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[#627D98]">Current River Stage:</span>
                    <b className="text-xl font-mono text-[#EF4444]">
                      {selectedFeature.data.currentLevelMeters} m
                    </b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#627D98]">Danger Level:</span>
                    <b className="text-[#0C2340] font-mono">
                      {selectedFeature.data.dangerLevelMeters} m
                    </b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#627D98]">Hydrograph Trend:</span>
                    <b className="text-[#EF4444] font-bold">
                      {selectedFeature.data.trend}
                    </b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#627D98]">Dam Discharge:</span>
                    <b className="text-[#0284C7] font-mono font-bold">
                      {selectedFeature.data.flowDischargeCumecs} cumecs
                    </b>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Inspector Actions in Friendly Sky Buttons */}
          <div className="p-3.5 border-t border-[#A8DFFA] bg-[#F8FDFF] space-y-2">
            <button
              onClick={() => onNavigateToTab('digitalTwin')}
              className="w-full py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Simulate in Digital Twin</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateToTab('multiAgent')}
              className="w-full py-2.5 rounded-xl bg-[#F1FCFF] hover:bg-[#E0F2FE] text-[#0284C7] border border-[#A8DFFA] font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>Deploy Multi-Agent AI Swarm</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
