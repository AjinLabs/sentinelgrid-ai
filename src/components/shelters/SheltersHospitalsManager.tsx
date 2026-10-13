'use client';

import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Droplet,
  Phone,
  Search,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { Facility } from '@/types/disaster';
import { initialFacilities } from '@/lib/mock-data';
import { optimizeShelterAllocation } from '@/lib/optimization-engine';
import { Language, translations } from '@/lib/i18n';

interface SheltersHospitalsManagerProps {
  language: Language;
}

export default function SheltersHospitalsManager({
  language,
}: SheltersHospitalsManagerProps) {
  const t = translations[language];
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'SHELTER' | 'HOSPITAL'>('ALL');
  const [optimizationRun, setOptimizationRun] = useState<any>(null);

  const filtered = facilities.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || f.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleRunOptimizer = () => {
    const demandNodes = [
      {
        id: 'DEM-01',
        name: 'Chooralmala Hamlet Survivors',
        lat: 11.5312,
        lng: 76.1625,
        displacedPopulation: 420,
        hazardRisk: 0.94,
      },
      {
        id: 'DEM-02',
        name: 'Aluva Riverside Inundation Wards',
        lat: 10.1118,
        lng: 76.3533,
        displacedPopulation: 850,
        hazardRisk: 0.86,
      },
    ];

    const shelterNodes = facilities
      .filter((f) => f.type === 'SHELTER')
      .map((s) => ({
        id: s.id,
        name: s.name,
        lat: s.location.lat,
        lng: s.location.lng,
        totalCapacity: s.totalCapacity,
        currentOccupancy: s.currentOccupancy,
        isAccessible: true,
      }));

    const result = optimizeShelterAllocation(demandNodes, shelterNodes);
    setOptimizationRun(result);
  };

  return (
    <div className="space-y-6">
      {/* Banner & Controls in Cloud & Sky */}
      <div className="bg-white border border-[#A8DFFA] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-[#0284C7] text-white shadow-xs font-mono">
              CAPACITY TELEMETRY
            </span>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#E0F2FE] text-[#0369A1] border border-[#A8DFFA]">
              LP OPTIMIZER INTEGRATED
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0C2340] flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#0284C7]" />
            Relief Shelters, Hospitals & Critical Facilities
          </h1>
          <p className="text-xs text-[#476685]">
            Directory of emergency relief camps, trauma care facilities, ICU bed inventories, and optimal evacuee allocation algorithms.
          </p>
        </div>

        <button
          onClick={handleRunOptimizer}
          className="px-5 py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs transition flex items-center gap-2 shadow-sm shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Run Shelter Allocation Optimizer</span>
        </button>
      </div>

      {/* Optimizer Result Panel (if run) */}
      {optimizationRun && (
        <div className="p-6 rounded-2xl bg-white border border-[#A8DFFA] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#A8DFFA] pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0C2340]">
              <Sparkles className="w-4 h-4 text-[#0284C7]" />
              <span>Optimal Evacuation-to-Shelter Matching Results</span>
            </div>
            <span className="text-xs font-mono text-[#0284C7] font-bold">
              Avg Travel Distance: {optimizationRun.averageDistanceKm} km
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {optimizationRun.allocations.map((alloc: any, i: number) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA] space-y-1.5 text-xs shadow-2xs"
              >
                <div className="flex justify-between font-bold text-[#0C2340]">
                  <span>{alloc.demandNodeName}</span>
                  <span className="text-[#059669] font-mono font-bold">
                    {alloc.peopleAssigned} people
                  </span>
                </div>
                <div className="text-[11px] text-[#476685]">
                  Target: <b className="text-[#0C2340]">{alloc.shelterName}</b>
                </div>
                <div className="flex justify-between text-[10px] text-[#627D98] pt-1 border-t border-[#A8DFFA]/50">
                  <span>Dist: {alloc.distanceKm} km</span>
                  <span>{alloc.transportMode}</span>
                </div>
              </div>
            ))}
          </div>

          {optimizationRun.bottlenecksIdentified.length > 0 && (
            <div className="p-3.5 rounded-xl bg-[#FFF1F2] border border-[#E11D48]/30 text-xs text-[#E11D48] space-y-1">
              <b className="block">Identified Regional Bottlenecks:</b>
              {optimizationRun.bottlenecksIdentified.map((b: string, i: number) => (
                <div key={i}>• {b}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((fac) => {
          const isHospital = fac.type === 'HOSPITAL';
          const percentOccupied = Math.round(
            (fac.currentOccupancy / fac.totalCapacity) * 100
          );

          return (
            <div
              key={fac.id}
              className="bg-white border border-[#A8DFFA] rounded-2xl p-5 space-y-4 shadow-2xs hover:border-[#0284C7] transition"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    isHospital
                      ? 'bg-[#E0F2FE] text-[#0284C7] border border-[#A8DFFA]'
                      : 'bg-[#ECFDF5] text-[#059669] border border-[#10B981]/30'
                  }`}
                >
                  {fac.type}
                </span>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    fac.operationalStatus === 'OPERATIONAL'
                      ? 'bg-[#ECFDF5] text-[#059669]'
                      : 'bg-[#FEF3C7] text-[#D97706]'
                  }`}
                >
                  {fac.operationalStatus}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#0C2340]">{fac.name}</h3>
                <div className="text-[11px] text-[#476685] flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                  <span>{fac.location.address}</span>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-1.5 pt-2 border-t border-[#A8DFFA]/50">
                <div className="flex justify-between text-xs">
                  <span className="text-[#476685]">Occupancy:</span>
                  <span className="font-mono font-bold text-[#0C2340]">
                    {fac.currentOccupancy} / {fac.totalCapacity} ({percentOccupied}%)
                  </span>
                </div>

                <div className="w-full h-2 bg-[#F1FCFF] rounded-full overflow-hidden border border-[#A8DFFA]/40">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentOccupied}%`,
                      backgroundColor:
                        percentOccupied > 90
                          ? '#EF4444'
                          : percentOccupied > 75
                          ? '#F97316'
                          : '#10B981',
                    }}
                  />
                </div>
              </div>

              {/* Amenities & Contact */}
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#A8DFFA]/50 text-[#476685]">
                <div className="flex items-center gap-3">
                  <span title="Power Backup" className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>GenSet</span>
                  </span>
                  <span title="Clean Water" className="flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Water</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 font-mono text-[#0C2340] text-[10px] font-bold">
                  <Phone className="w-3 h-3 text-[#0284C7]" />
                  <span>{fac.contactPhone}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
