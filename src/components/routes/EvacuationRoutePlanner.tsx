'use client';

import React, { useState } from 'react';
import {
  Navigation,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MapPin,
  Clock,
  ShieldAlert,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { Language, translations } from '@/lib/i18n';

interface RouteOption {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distanceKm: number;
  durationMinutes: number;
  status: 'CLEAR' | 'CAUTION_UNVERIFIED' | 'IMPASSABLE_BLOCKED';
  hazardIntersection: string;
  recommendedMode: string;
}

export default function EvacuationRoutePlanner({ language }: { language: Language }) {
  const t = translations[language];

  const routes: RouteOption[] = [
    {
      id: 'RT-01-PRIMARY',
      name: 'Corridor 1: SH-59 Direct Meppadi - Chooralmala',
      origin: 'Chooralmala Tea Estates',
      destination: 'St. Joseph School Camp, Meppadi',
      distanceKm: 8.4,
      durationMinutes: 22,
      status: 'IMPASSABLE_BLOCKED',
      hazardIntersection: 'Bailey Bridge Collapse & 1.2m Debris Accumulation',
      recommendedMode: 'None — Civilians Prohibited',
    },
    {
      id: 'RT-02-NORTH-BYPASS',
      name: 'Corridor 2: North Ridge Forestry Detour (Via Chundale)',
      origin: 'Chooralmala Tea Estates',
      destination: 'Kalpetta Civil Station Shelter',
      distanceKm: 18.6,
      durationMinutes: 48,
      status: 'CAUTION_UNVERIFIED',
      hazardIntersection: '3.2km unverified road status; requires lead 4x4 escort',
      recommendedMode: 'High-Clearance 4x4 / KSRTC Rescue Convoys',
    },
    {
      id: 'RT-03-PERIYAR-SOUTH',
      name: 'Corridor 3: Aluva Manappuram to Kalamassery High Ground',
      origin: 'Aluva Riverfront Wards 4 & 12',
      destination: 'Govt Medical College Kalamassery',
      distanceKm: 7.2,
      durationMinutes: 26,
      status: 'CLEAR',
      hazardIntersection: 'Seaport-Airport Road elevated flyover; clear of standing water',
      recommendedMode: 'All Emergency Vehicles & Buses',
    },
  ];

  const [selectedRoute, setSelectedRoute] = useState<RouteOption>(routes[1]);

  return (
    <div className="space-y-6">
      {/* Banner in Cloud & Sky */}
      <div className="bg-white border border-[#A8DFFA] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-[#0284C7] text-white shadow-xs font-mono">
              HAZARD-AWARE ROUTING ENGINE
            </span>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#E0F2FE] text-[#0369A1] border border-[#A8DFFA]">
              LIVE DETOUR COMPUTATION
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0C2340] flex items-center gap-2">
            <Navigation className="w-6 h-6 text-[#0284C7]" />
            Evacuation Support & Route Optimization
          </h1>
          <p className="text-xs text-[#476685]">
            Multi-path safety routing intersecting topological road networks with active landslide closures and submerged river corridors.
          </p>
        </div>
      </div>

      {/* Grid: Route List & Detailed Feasibility Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Routes (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="text-xs font-bold text-[#627D98] uppercase tracking-wider">
            Evaluated Evacuation Corridors ({routes.length})
          </div>

          <div className="space-y-3">
            {routes.map((rt) => {
              const isSelected = selectedRoute.id === rt.id;
              const color =
                rt.status === 'CLEAR'
                  ? '#059669'
                  : rt.status === 'CAUTION_UNVERIFIED'
                  ? '#D97706'
                  : '#EF4444';

              return (
                <div
                  key={rt.id}
                  onClick={() => setSelectedRoute(rt)}
                  className={`p-4 rounded-2xl border cursor-pointer transition space-y-3 shadow-2xs ${
                    isSelected
                      ? 'bg-[#F1FCFF] border-[#0284C7] ring-2 ring-[#0284C7]'
                      : 'bg-white border-[#A8DFFA] hover:border-[#0284C7]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-black px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${color}15`,
                        color: color,
                        border: `1px solid ${color}40`,
                      }}
                    >
                      {rt.status.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-[#627D98]">
                      {rt.id}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#0C2340]">{rt.name}</h3>
                    <div className="text-[11px] text-[#476685] flex items-center gap-1.5 mt-1 font-medium">
                      <span>{rt.origin}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>{rt.destination}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#A8DFFA]/50 text-[#627D98]">
                    <span>Distance: <b className="text-[#0C2340] font-mono">{rt.distanceKm} km</b></span>
                    <span>Transit Time: <b className="text-[#0284C7] font-mono font-bold">~{rt.durationMinutes} mins</b></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Feasibility Detail View (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#A8DFFA] rounded-2xl p-5 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#A8DFFA] pb-3">
            <div>
              <span className="text-[10px] font-mono text-[#0284C7] font-bold">
                CORRIDOR FEASIBILITY AUDIT: {selectedRoute.id}
              </span>
              <h2 className="text-base font-extrabold text-[#0C2340] mt-1">
                {selectedRoute.name}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA]">
              <span className="text-[#627D98] text-[10px] block">Computed Distance</span>
              <b className="text-xl font-mono text-[#0C2340]">{selectedRoute.distanceKm} km</b>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA]">
              <span className="text-[#627D98] text-[10px] block">Estimated Duration</span>
              <b className="text-xl font-mono text-[#0284C7]">{selectedRoute.durationMinutes} mins</b>
            </div>
          </div>

          {/* Known Hazard Intersections */}
          <div className="p-4 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA] space-y-2">
            <span className="text-[10px] font-black text-[#0284C7] uppercase tracking-wider block">
              Identified Roadway Hazard Constraints:
            </span>
            <p className="text-xs text-[#334E68] leading-relaxed">
              {selectedRoute.hazardIntersection}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA] space-y-1">
            <span className="text-[10px] font-black text-[#627D98] uppercase tracking-wider block">
              Approved Vehicle Transit Mode:
            </span>
            <b className="text-xs text-[#0284C7]">{selectedRoute.recommendedMode}</b>
          </div>

          {/* Safety Rule Notice */}
          <div className="p-3.5 rounded-xl bg-[#E0F2FE] border border-[#A8DFFA] text-xs text-[#0369A1] space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-[#0284C7]" />
              <span>Critical Safety Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#476685]">
              Calculated travel durations are modeled baselines. Authorized police escort or aerial drone scouting is mandatory before routing civilian evacuation convoys across unverified segments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
