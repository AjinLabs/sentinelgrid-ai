'use client';

import React, { useState } from 'react';
import {
  AlertOctagon,
  Search,
  Filter,
  Plus,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Incident, IncidentStatus, PriorityLevel, RiskLevel } from '@/types/disaster';
import { Language, translations } from '@/lib/i18n';

interface IncidentManagementProps {
  language: Language;
  incidents: Incident[];
  onUpdateIncidentStatus?: (incidentId: string, newStatus: IncidentStatus) => void;
  onSelectIncidentForMap?: (incident: Incident) => void;
}

export default function IncidentManagement({
  language,
  incidents,
  onUpdateIncidentStatus,
  onSelectIncidentForMap,
}: IncidentManagementProps) {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [selectedIncident, setSelectedIncident] = useState<Incident>(incidents[0]);

  const filtered = incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.location.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSev =
      severityFilter === 'ALL' || inc.severity === severityFilter;
    return matchesSearch && matchesSev;
  });

  const statuses: IncidentStatus[] = [
    'VERIFIED',
    'RESPONSE_ASSIGNED',
    'IN_PROGRESS',
    'MONITORING',
    'RESOLVED',
    'CLOSED',
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls in Cloud & Sky */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0C2340] flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-[#0284C7]" />
            Active Incident Command & Operations Lifecycle
          </h1>
          <p className="text-xs text-[#476685]">
            Authoritative tracking of verified disaster events, resource dispatches, and operational status transitions.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#627D98]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search incidents or district..."
              className="w-full bg-white border border-[#A8DFFA] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#0C2340] placeholder-[#627D98] focus:outline-none focus:border-[#0284C7] shadow-2xs"
            />
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-white border border-[#A8DFFA] rounded-xl px-3 py-1.5 text-xs text-[#0C2340] focus:outline-none focus:border-[#0284C7] cursor-pointer shadow-2xs"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MODERATE">Moderate</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Incident Table & Detail Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Incident Cards (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          {filtered.map((inc) => {
            const isSelected = selectedIncident.id === inc.id;
            const color =
              inc.severity === 'CRITICAL'
                ? '#EF4444'
                : inc.severity === 'HIGH'
                ? '#F97316'
                : '#F59E0B';

            return (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`p-4 rounded-2xl border cursor-pointer transition space-y-3 shadow-2xs ${
                  isSelected
                    ? 'bg-[#F1FCFF] border-[#0284C7] ring-2 ring-[#0284C7]'
                    : 'bg-white border-[#A8DFFA] hover:border-[#0284C7]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${color}15`,
                        color: color,
                        border: `1px solid ${color}40`,
                      }}
                    >
                      {inc.severity}
                    </span>
                    <span className="text-[10px] font-mono text-[#627D98]">
                      {inc.id}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1] border border-[#A8DFFA]">
                    {inc.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#0C2340]">{inc.title}</h3>
                  <div className="text-[11px] text-[#476685] flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3 h-3 text-[#0284C7]" />
                    <span>{inc.location.address}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#A8DFFA]/50 text-[#627D98]">
                  <span>Population: <b className="text-[#0C2340] font-mono">{inc.affectedPopulationEstimate.toLocaleString()}</b></span>
                  <span>Unit: <b className="text-[#0284C7]">{inc.assignedTeamId || 'Unassigned'}</b></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Incident Command Detail View (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#A8DFFA] rounded-2xl p-5 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#A8DFFA] pb-3">
            <div>
              <span className="text-[10px] font-mono text-[#0284C7] font-bold">
                INCIDENT COMMAND FILE: {selectedIncident.id}
              </span>
              <h2 className="text-base font-extrabold text-[#0C2340] mt-1">
                {selectedIncident.title}
              </h2>
            </div>
            <button
              onClick={() => onSelectIncidentForMap?.(selectedIncident)}
              className="text-xs bg-[#0284C7] text-white px-3 py-1.5 rounded-xl font-bold hover:bg-[#0369A1] transition shadow-xs"
            >
              Locate on Map
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA] text-xs text-[#334E68] leading-relaxed shadow-2xs">
            {selectedIncident.description}
          </div>

          {/* Status Progression Workflow */}
          <div className="space-y-2">
            <span className="text-[11px] font-black text-[#627D98] uppercase tracking-wider block">
              Operational Status Transition:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateIncidentStatus?.(selectedIncident.id, st)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition ${
                    selectedIncident.status === st
                      ? 'bg-[#0284C7] text-white shadow-xs'
                      : 'bg-[#F1FCFF] text-[#334E68] hover:text-[#0C2340] border border-[#A8DFFA]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Assigned Organization & Commander */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA]">
              <span className="text-[#627D98] text-[10px] block">Command Lead</span>
              <b className="text-[#0C2340]">{selectedIncident.assignedCommander || 'District Collector'}</b>
            </div>
            <div className="p-3 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA]">
              <span className="text-[#627D98] text-[10px] block">Responsible Force</span>
              <b className="text-[#0C2340]">{selectedIncident.responsibleOrganization}</b>
            </div>
          </div>

          {/* Timeline of Decisions */}
          <div className="space-y-2">
            <span className="text-[11px] font-black text-[#627D98] uppercase tracking-wider block">
              Incident Decision Log:
            </span>
            <div className="space-y-2 border-l-2 border-[#0284C7] pl-3 ml-1 text-xs">
              {selectedIncident.timeline.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="text-[#0284C7] font-mono text-[10px] font-bold">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                  <div className="text-[#0C2340] font-medium">{item.action}</div>
                  <div className="text-[#627D98] text-[11px]">{item.actor}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
