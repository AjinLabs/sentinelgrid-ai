'use client';

import React, { useState } from 'react';
import {
  Truck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { ResourceItem, ResourceStatus, ResourceType } from '@/types/disaster';
import { initialResources } from '@/lib/mock-data';
import { Language, translations } from '@/lib/i18n';

interface ResourceRescueOperationsProps {
  language: Language;
}

export default function ResourceRescueOperations({
  language,
}: ResourceRescueOperationsProps) {
  const t = translations[language];
  const [resources, setResources] = useState<ResourceItem[]>(initialResources);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = resources.filter((res) => {
    const matchesSearch =
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.location.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleDeploy = (resId: string) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === resId
          ? {
              ...r,
              status: r.status === 'AVAILABLE' ? ('DEPLOYED' as ResourceStatus) : ('AVAILABLE' as ResourceStatus),
            }
          : r
      )
    );
  };

  const deployedCount = resources.filter((r) => r.status === 'DEPLOYED').length;
  const availableCount = resources.filter((r) => r.status === 'AVAILABLE').length;

  return (
    <div className="space-y-6">
      {/* Banner in Cloud & Sky */}
      <div className="bg-white border border-[#A8DFFA] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-[#0284C7] text-white shadow-xs font-mono">
              CENTRAL LOGISTICS INVENTORY
            </span>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#10B981]/30">
              NDRF & STATE FORCES
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0C2340] flex items-center gap-2">
            <Truck className="w-6 h-6 text-[#0284C7]" />
            Rescue Teams & Operational Resource Management
          </h1>
          <p className="text-xs text-[#476685]">
            Real-time status tracking of multi-agency disaster response teams, motorized boats, ambulances, satellite comms, and relief supply stockpiles.
          </p>
        </div>

        {/* Counter Badges */}
        <div className="flex items-center gap-4 bg-[#F8FDFF] p-3 rounded-2xl border border-[#A8DFFA] text-xs shadow-2xs">
          <div>
            <span className="text-[#627D98] block text-[10px] font-bold">Available</span>
            <b className="text-[#059669] font-mono text-base font-extrabold">{availableCount} Units</b>
          </div>
          <div className="h-8 w-px bg-[#A8DFFA]" />
          <div>
            <span className="text-[#627D98] block text-[10px] font-bold">Deployed</span>
            <b className="text-[#0284C7] font-mono text-base font-extrabold">{deployedCount} Units</b>
          </div>
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((res) => {
          const isAvailable = res.status === 'AVAILABLE';

          return (
            <div
              key={res.id}
              className="bg-white border border-[#A8DFFA] rounded-2xl p-5 space-y-4 shadow-2xs hover:border-[#0284C7] transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1] border border-[#A8DFFA]">
                  {res.type}
                </span>

                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    isAvailable
                      ? 'bg-[#ECFDF5] text-[#059669] border border-[#10B981]/30'
                      : 'bg-[#FFF7ED] text-[#EA580C] border border-[#F97316]/30'
                  }`}
                >
                  {res.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#0C2340]">{res.name}</h3>
                <div className="text-[11px] text-[#476685] flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                  <span>{res.location.address} ({res.location.district})</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#627D98]">Commander:</span>
                  <b className="text-[#0C2340]">{res.contactPerson}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#627D98]">Organization:</span>
                  <b className="text-[#0284C7]">{res.organization}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#627D98]">Squad Capacity:</span>
                  <b className="text-[#0C2340] font-mono">{res.capacityOrQuantity} Personnel</b>
                </div>
              </div>

              <div className="pt-2 border-t border-[#A8DFFA]/50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-[#476685] font-mono">
                  <Phone className="w-3 h-3 text-[#0284C7]" />
                  <span>{res.phone}</span>
                </div>

                <button
                  onClick={() => handleToggleDeploy(res.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition shadow-2xs ${
                    isAvailable
                      ? 'bg-[#0284C7] hover:bg-[#0369A1] text-white'
                      : 'bg-[#E0F2FE] hover:bg-[#A8DFFA] text-[#0369A1] border border-[#A8DFFA]'
                  }`}
                >
                  {isAvailable ? 'Dispatch Unit' : 'Recall to Base'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
