'use client';

import React from 'react';
import {
  AlertOctagon,
  Users,
  Building2,
  Truck,
  Activity,
  Radio,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Waves,
  CloudRain,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  Incident,
  Facility,
  ResourceItem,
  RiverStation,
  RainfallStation,
  DataSourceRecord,
} from '@/types/disaster';
import { Language, translations } from '@/lib/i18n';

interface ExecutiveOverviewProps {
  language: Language;
  incidents: Incident[];
  facilities: Facility[];
  resources: ResourceItem[];
  riverStations: RiverStation[];
  rainfallStations: RainfallStation[];
  dataSources: DataSourceRecord[];
  onNavigateToTab: (tab: any) => void;
}

export default function ExecutiveOverview({
  language,
  incidents,
  facilities,
  resources,
  riverStations,
  rainfallStations,
  dataSources,
  onNavigateToTab,
}: ExecutiveOverviewProps) {
  const t = translations[language];

  const activeIncidents = incidents.filter(
    (i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED'
  );
  const criticalIncidents = activeIncidents.filter(
    (i) => i.severity === 'CRITICAL' || i.priority === 'P1_CRITICAL'
  );
  const totalDisplacedEst = incidents.reduce(
    (acc, curr) => acc + curr.affectedPopulationEstimate,
    0
  );

  const totalShelterCapacity = facilities
    .filter((f) => f.type === 'SHELTER')
    .reduce((acc, f) => acc + f.totalCapacity, 0);
  const availableShelterCapacity = facilities
    .filter((f) => f.type === 'SHELTER')
    .reduce((acc, f) => acc + f.availableCapacity, 0);

  const deployedResources = resources.filter(
    (r) => r.status === 'DEPLOYED' || r.status === 'ASSIGNED'
  );
  const staleDataSources = dataSources.filter((d) => d.isStale);

  return (
    <div className="space-y-6">
      {/* Title & EOC Status Banner in Cloud & Sky */}
      <div className="bg-white border border-[#A8DFFA] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] animate-pulse" />
            <span className="text-xs font-mono font-bold text-[#0284C7] uppercase tracking-wider">
              STATE EOC ACTIVE WATCH &bull; KERALA DISASTER INTELLIGENCE OS
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0C2340]">
            Disaster Intelligence Executive Overview
          </h1>
          <p className="text-xs text-[#476685]">
            Consolidated operational metrics computed from verified telemetry, field logs, and registered response inventory.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F1FCFF] p-2.5 rounded-xl border border-[#A8DFFA] text-xs shadow-2xs">
          <Clock className="w-4 h-4 text-[#0284C7]" />
          <span className="text-[#476685]">Last Telemetry Sync:</span>
          <span className="font-mono font-bold text-[#0C2340]">06:30:00 UTC</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Active Incidents */}
        <div
          onClick={() => onNavigateToTab('incidents')}
          className="bg-white border border-[#A8DFFA] hover:border-[#0284C7] p-4 rounded-2xl cursor-pointer transition shadow-xs hover:shadow-md group"
        >
          <div className="flex items-center justify-between text-[#627D98] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#476685]">
              Active Incidents
            </span>
            <AlertOctagon className="w-4 h-4 text-[#EF4444] group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-[#0C2340]">
            {activeIncidents.length}
          </div>
          <div className="text-[10px] text-[#EF4444] font-bold mt-1">
            {criticalIncidents.length} Critical P1
          </div>
        </div>

        {/* Population at Risk */}
        <div
          onClick={() => onNavigateToTab('commandCenter')}
          className="bg-white border border-[#A8DFFA] hover:border-[#0284C7] p-4 rounded-2xl cursor-pointer transition shadow-xs hover:shadow-md group"
        >
          <div className="flex items-center justify-between text-[#627D98] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#476685]">
              Affected Est.
            </span>
            <Users className="w-4 h-4 text-[#0284C7] group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-[#0284C7]">
            {totalDisplacedEst.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#476685] mt-1">Across 4 Districts</div>
        </div>

        {/* Shelter Capacity */}
        <div
          onClick={() => onNavigateToTab('shelters')}
          className="bg-white border border-[#A8DFFA] hover:border-[#10B981] p-4 rounded-2xl cursor-pointer transition shadow-xs hover:shadow-md group"
        >
          <div className="flex items-center justify-between text-[#627D98] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#476685]">
              Shelter Vacancy
            </span>
            <Building2 className="w-4 h-4 text-[#10B981] group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-[#0C2340]">
            {availableShelterCapacity}
          </div>
          <div className="text-[10px] text-[#059669] font-bold mt-1">
            of {totalShelterCapacity} total beds
          </div>
        </div>

        {/* Deployed Resources */}
        <div
          onClick={() => onNavigateToTab('resources')}
          className="bg-white border border-[#A8DFFA] hover:border-[#0284C7] p-4 rounded-2xl cursor-pointer transition shadow-xs hover:shadow-md group"
        >
          <div className="flex items-center justify-between text-[#627D98] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#476685]">
              Teams Deployed
            </span>
            <Truck className="w-4 h-4 text-[#0284C7] group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-[#0C2340]">
            {deployedResources.length}
          </div>
          <div className="text-[10px] text-[#476685] mt-1">
            of {resources.length} units listed
          </div>
        </div>

        {/* River Danger Gauges */}
        <div
          onClick={() => onNavigateToTab('gisMap')}
          className="bg-white border border-[#A8DFFA] hover:border-[#0284C7] p-4 rounded-2xl cursor-pointer transition shadow-xs hover:shadow-md group"
        >
          <div className="flex items-center justify-between text-[#627D98] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#476685]">
              River Gauges
            </span>
            <Waves className="w-4 h-4 text-[#0284C7] group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-[#0C2340]">
            {riverStations.filter((r) => r.currentLevelMeters >= r.dangerLevelMeters).length} / {riverStations.length}
          </div>
          <div className="text-[10px] text-[#EF4444] font-bold mt-1">
            Over Danger Mark
          </div>
        </div>

        {/* Data Quality & Telemetry Health */}
        <div
          onClick={() => onNavigateToTab('dataSources')}
          className="bg-white border border-[#A8DFFA] hover:border-[#0284C7] p-4 rounded-2xl cursor-pointer transition shadow-xs hover:shadow-md group"
        >
          <div className="flex items-center justify-between text-[#627D98] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#476685]">
              Data Feeds
            </span>
            <Radio className="w-4 h-4 text-[#0284C7] group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-[#0C2340]">
            {dataSources.length - staleDataSources.length} / {dataSources.length}
          </div>
          <div className="text-[10px] text-[#0284C7] font-bold mt-1">
            {staleDataSources.length > 0 ? `${staleDataSources.length} Stale Warning` : 'All Synced'}
          </div>
        </div>
      </div>

      {/* District Operations Table & Environmental Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* District Risk Table (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#A8DFFA] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#A8DFFA] pb-3">
            <h2 className="text-sm font-bold text-[#0C2340] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#0284C7]" />
              District Operational Threat Matrix
            </h2>
            <button
              onClick={() => onNavigateToTab('incidents')}
              className="text-xs text-[#0284C7] hover:underline flex items-center gap-1 font-bold"
            >
              <span>Manage Incidents</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#A8DFFA] text-[#627D98] text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3">Dominant Threat</th>
                  <th className="py-2.5 px-3">Composite Risk</th>
                  <th className="py-2.5 px-3">Active Incidents</th>
                  <th className="py-2.5 px-3">24h Rainfall</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A8DFFA]/40">
                <tr className="hover:bg-[#F1FCFF] transition cursor-pointer">
                  <td className="py-3 px-3 font-bold text-[#0C2340]">Wayanad</td>
                  <td className="py-3 px-3 text-[#F97316] font-semibold">Debris Flow / Landslide</td>
                  <td className="py-3 px-3 font-mono font-bold text-[#EF4444]">
                    0.94 (Critical)
                  </td>
                  <td className="py-3 px-3 font-mono text-[#0C2340]">1 (Chooralmala Axis)</td>
                  <td className="py-3 px-3 font-mono text-[#EF4444] font-bold">372.0 mm</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30">
                      RED ALERT
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-[#F1FCFF] transition cursor-pointer">
                  <td className="py-3 px-3 font-bold text-[#0C2340]">Ernakulam</td>
                  <td className="py-3 px-3 text-[#0284C7] font-semibold">Riverine Inundation (Periyar)</td>
                  <td className="py-3 px-3 font-mono font-bold text-[#F97316]">
                    0.86 (High)
                  </td>
                  <td className="py-3 px-3 font-mono text-[#0C2340]">1 (Aluva Ghats)</td>
                  <td className="py-3 px-3 font-mono text-[#0284C7] font-bold">165.2 mm</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F97316]/15 text-[#EA580C] border border-[#F97316]/30">
                      ORANGE ALERT
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-[#F1FCFF] transition cursor-pointer">
                  <td className="py-3 px-3 font-bold text-[#0C2340]">Idukki</td>
                  <td className="py-3 px-3 text-[#EA580C] font-semibold">Gap Road Rockfall</td>
                  <td className="py-3 px-3 font-mono font-bold text-[#D97706]">
                    0.72 (Moderate-High)
                  </td>
                  <td className="py-3 px-3 font-mono text-[#0C2340]">1 (NH-85 Munnar)</td>
                  <td className="py-3 px-3 font-mono text-[#EF4444] font-bold">248.5 mm</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F97316]/15 text-[#EA580C] border border-[#F97316]/30">
                      ORANGE ALERT
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-[#F1FCFF] transition cursor-pointer">
                  <td className="py-3 px-3 font-bold text-[#0C2340]">Alappuzha</td>
                  <td className="py-3 px-3 text-[#0284C7] font-semibold">Kuttanad Polder Submersion</td>
                  <td className="py-3 px-3 font-mono font-bold text-[#D97706]">
                    0.68 (Moderate)
                  </td>
                  <td className="py-3 px-3 font-mono text-[#0C2340]">1 (Edathua)</td>
                  <td className="py-3 px-3 font-mono text-[#D97706] font-bold">122.0 mm</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F59E0B]/15 text-[#D97706] border border-[#F59E0B]/30">
                      YELLOW WATCH
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Environmental Radar & Gauges (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#A8DFFA] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#A8DFFA] pb-3">
            <h2 className="text-sm font-bold text-[#0C2340] flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-[#0284C7]" />
              Live Telemetry Stations
            </h2>
            <span className="text-[10px] text-[#059669] font-mono font-bold">LIVE STREAM</span>
          </div>

          <div className="space-y-3">
            {rainfallStations.slice(0, 3).map((st) => (
              <div
                key={st.id}
                className="p-3.5 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA] space-y-1 shadow-2xs"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#0C2340]">{st.stationName}</span>
                  <span className="font-mono text-[#EF4444] font-extrabold">
                    {st.rainfallLast24hMm} mm
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-[#476685]">
                  <span>District: {st.district}</span>
                  <span className="text-[#0284C7] font-bold">Anomaly: +{st.anomalyPercent}%</span>
                </div>
              </div>
            ))}

            {riverStations.slice(0, 2).map((gauge) => (
              <div
                key={gauge.id}
                className="p-3.5 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA] space-y-1 shadow-2xs"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#0C2340]">{gauge.name}</span>
                  <span
                    className={`font-mono font-bold ${
                      gauge.currentLevelMeters >= gauge.dangerLevelMeters
                        ? 'text-[#EF4444]'
                        : 'text-[#0284C7]'
                    }`}
                  >
                    {gauge.currentLevelMeters} m
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-[#476685]">
                  <span>Danger Level: {gauge.dangerLevelMeters}m</span>
                  <span className="text-[#EF4444] font-bold">Trend: {gauge.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
