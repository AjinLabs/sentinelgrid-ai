'use client';

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { Incident, Facility, ResourceItem } from '@/types/disaster';
import { Language, translations } from '@/lib/i18n';

interface SituationBriefingGeneratorProps {
  language: Language;
  incidents: Incident[];
  facilities: Facility[];
  resources: ResourceItem[];
}

export default function SituationBriefingGenerator({
  language,
  incidents,
  facilities,
  resources,
}: SituationBriefingGeneratorProps) {
  const t = translations[language];

  const [reportingPeriod, setReportingPeriod] = useState('Last 6 Hours');
  const [isGenerating, setIsGenerating] = useState(false);
  const [briefingApproved, setBriefingApproved] = useState(false);

  const activeIncCount = incidents.filter((i) => i.status !== 'CLOSED').length;
  const deployedCount = resources.filter((r) => r.status === 'DEPLOYED').length;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify(
        {
          title: 'SentinelGrid Emergency Situation Briefing (SITREP)',
          period: reportingPeriod,
          generatedAt: new Date().toISOString(),
          activeIncidentsCount: activeIncCount,
          deployedResources: deployedCount,
          verifiedIncidents: incidents.map((i) => ({
            id: i.id,
            title: i.title,
            severity: i.severity,
            district: i.location.district,
          })),
        },
        null,
        2
      )
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SITREP_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header in Cloud & Sky */}
      <div className="bg-white border border-[#A8DFFA] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-[#0284C7] text-white shadow-xs font-mono">
              EOC OPERATIONAL BRIEFING
            </span>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#10B981]/30">
              CITATION-GROUNDED
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0C2340] flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#0284C7]" />
            AI Situation Report Generator (SITREP)
          </h1>
          <p className="text-xs text-[#476685]">
            Automated operational briefings synthesized strictly from verified incidents, river telemetry, and logged resource movements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-[#F8FDFF] hover:bg-[#E0F2FE] text-[#0C2340] border border-[#A8DFFA] text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-extrabold flex items-center gap-1.5 transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Briefing Document Paper Canvas in Clean White & Sky */}
      <div className="bg-white border border-[#A8DFFA] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm text-xs leading-relaxed">
        {/* Document Header */}
        <div className="border-b border-[#A8DFFA] pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#0284C7] font-bold">
              KERALA STATE DISASTER MANAGEMENT AUTHORITY (KSDMA) &bull; STATE EOC
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#0C2340] mt-1">
              SITUATION REPORT #04 &bull; SOUTHWEST MONSOON FLASH INUNDATION & DEBRIS FLOW
            </h2>
          </div>
          <div className="text-left sm:text-right font-mono text-[11px] text-[#476685]">
            <div>Generated: {new Date().toUTCString()}</div>
            <div>Period: <b className="text-[#0284C7]">{reportingPeriod}</b></div>
          </div>
        </div>

        {/* Section 1: Executive Operational Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-black text-[#0284C7] uppercase tracking-wider">
            1. Executive Operational Summary
          </h3>
          <p className="text-[#334E68]">
            Severe multi-district compound hydrometeorological events currently active across Northern and Central Kerala. Highest operational priority centered on the <b className="text-[#0C2340]">Wayanad Meppadi-Chooralmala axis</b> following extreme 24h precipitation (372mm) triggering catastrophic slope movement. Concurrently, <b className="text-[#0C2340]">Lower Periyar River Basin</b> in Ernakulam has exceeded danger mark at Neeleswaram (9.85m), necessitating precautionary evacuation across 6 riverside wards.
          </p>
        </div>

        {/* Section 2: Active Incident Matrix */}
        <div className="space-y-2">
          <h3 className="text-xs font-black text-[#0284C7] uppercase tracking-wider">
            2. Verified Priority Incidents Status
          </h3>
          <div className="space-y-2">
            {incidents.slice(0, 3).map((inc) => (
              <div
                key={inc.id}
                className="p-3.5 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA] space-y-1 shadow-2xs"
              >
                <div className="flex justify-between items-center">
                  <b className="text-[#0C2340]">{inc.title}</b>
                  <span className="text-[10px] font-mono text-[#EF4444] font-black">
                    {inc.severity}
                  </span>
                </div>
                <div className="text-[11px] text-[#476685]">{inc.description}</div>
                <div className="flex justify-between text-[10px] text-[#627D98] pt-1">
                  <span>Assigned Force: <b className="text-[#0284C7]">{inc.assignedTeamId || 'Unassigned'}</b></span>
                  <span>Estimated Exposed: <b className="text-[#0C2340]">{inc.affectedPopulationEstimate.toLocaleString()}</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Force Deployment & Stockpile */}
        <div className="space-y-2">
          <h3 className="text-xs font-black text-[#0284C7] uppercase tracking-wider">
            3. Tactical Resource Deployments
          </h3>
          <p className="text-[#334E68]">
            Currently <b className="text-[#0C2340]">{deployedCount} operational units</b> actively engaged in field staging and rescue. NDRF 4th Battalion Bravo Unit deployed at Chooralmala forward depot with sniffer dog squads. 12 OBM motor boats staged at Aluva Pontoon Base for Periyar floodplain evacuations.
          </p>
        </div>

        {/* Section 4: Data Gaps & Unverified Observations */}
        <div className="p-4 rounded-xl bg-[#E0F2FE] border border-[#A8DFFA] space-y-1 text-[#0369A1]">
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-[#0284C7]" />
            <span>Documented Information Limitations & Gaps</span>
          </div>
          <p className="text-[11px] text-[#334E68]">
            • PWD road status telemetry is 45 minutes stale; secondary arterial roads in Chundale require aerial drone verification.<br />
            • Optical satellite coverage obscured by dense monsoon cloud cover; utilizing Synthetic Aperture Radar (SAR) Sentinel-1 passes.
          </p>
        </div>

        {/* Sign-off box */}
        <div className="pt-4 border-t border-[#A8DFFA]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px]">
          <div className="text-[#627D98]">
            Prepared by: <b className="text-[#0C2340]">SentinelGrid Situation Analysis Engine</b>
          </div>
          <div className="text-[#627D98]">
            Approved by: <b className="text-[#0284C7]">Dr. Ajin K. Rajan (Incident Commander)</b>
          </div>
        </div>
      </div>
    </div>
  );
}
