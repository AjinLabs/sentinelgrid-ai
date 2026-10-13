'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Copy,
  Clock,
  MapPin,
  AlertTriangle,
  Bot,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { CommunityReport, ReportStatus } from '@/types/disaster';
import { initialCommunityReports } from '@/lib/mock-data';
import { calculateDuplicateScore } from '@/lib/geo-utils';
import { Language, translations } from '@/lib/i18n';

interface CommunityReportsProps {
  language: Language;
}

export default function CommunityReports({ language }: CommunityReportsProps) {
  const t = translations[language];
  const [reports, setReports] = useState<CommunityReport[]>(initialCommunityReports);
  const [selectedReport, setSelectedReport] = useState<CommunityReport>(reports[0]);

  const handleUpdateStatus = (id: string, newStatus: ReportStatus) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    if (selectedReport.id === id) {
      setSelectedReport((prev) => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header in Cloud & Sky */}
      <div className="bg-white border border-[#A8DFFA] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-[#0284C7] text-white shadow-xs font-mono">
              CITIZEN & RESPONDER INTEL
            </span>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#E0F2FE] text-[#0369A1] border border-[#A8DFFA]">
              AI DUPLICATE DETECTION ACTIVE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0C2340] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#0284C7]" />
            Community Reports & Ground Intelligence
          </h1>
          <p className="text-xs text-[#476685]">
            Triage ground truth submissions, detect duplicate spatio-temporal clusters, and escalate verified reports to incident command.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Reports Feed (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="text-xs font-bold text-[#627D98] uppercase tracking-wider">
            Incoming Ground Reports ({reports.length})
          </div>

          <div className="space-y-3">
            {reports.map((rep) => {
              const isSelected = selectedReport.id === rep.id;
              const isDup = (rep.aiDuplicateScore || 0) > 0.6;

              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReport(rep)}
                  className={`p-4 rounded-2xl border cursor-pointer transition space-y-3 shadow-2xs ${
                    isSelected
                      ? 'bg-[#F1FCFF] border-[#0284C7] ring-2 ring-[#0284C7]'
                      : 'bg-white border-[#A8DFFA] hover:border-[#0284C7]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1] border border-[#A8DFFA]">
                      {rep.category}
                    </span>

                    <div className="flex items-center gap-2">
                      {isDup && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FFF7ED] text-[#EA580C] border border-[#F97316]/40 flex items-center gap-1">
                          <Copy className="w-3 h-3" />
                          <span>{((rep.aiDuplicateScore || 0) * 100).toFixed(0)}% Match</span>
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          rep.status === 'VERIFIED'
                            ? 'bg-[#ECFDF5] text-[#059669] border border-[#10B981]/30'
                            : rep.status === 'UNDER_REVIEW'
                            ? 'bg-[#E0F2FE] text-[#0284C7] border border-[#A8DFFA]'
                            : 'bg-white text-[#627D98] border border-slate-200'
                        }`}
                      >
                        {rep.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#0C2340]">{rep.title}</h3>
                    <div className="text-[11px] text-[#476685] flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>{rep.location.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#A8DFFA]/50 text-[#627D98]">
                    <span>Reporter: <b className="text-[#0C2340]">{rep.isAnonymous ? 'Anonymous' : rep.reporterName}</b></span>
                    <span>{new Date(rep.submittedAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Verification & Duplicate Inspector (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#A8DFFA] rounded-2xl p-5 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#A8DFFA] pb-3">
            <div>
              <span className="text-[10px] font-mono text-[#0284C7] font-bold">
                REPORT VERIFICATION DESK: {selectedReport.id}
              </span>
              <h2 className="text-base font-extrabold text-[#0C2340] mt-1">
                {selectedReport.title}
              </h2>
            </div>
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                selectedReport.urgency === 'LIFE_SAFETY_CRITICAL'
                  ? 'bg-[#FFF1F2] text-[#E11D48] border border-[#E11D48]/30 font-bold'
                  : 'bg-[#F1FCFF] text-[#476685] border border-[#A8DFFA]'
              }`}
            >
              {selectedReport.urgency}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA] text-xs text-[#334E68] leading-relaxed shadow-2xs">
            {selectedReport.description}
          </div>

          {/* AI Duplicate Detection Card */}
          {selectedReport.aiDuplicateScore && selectedReport.aiDuplicateScore > 0.5 && (
            <div className="p-4 rounded-xl bg-[#FFF7ED] border border-[#F97316]/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#EA580C]">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Duplicate Candidate Detected ({((selectedReport.aiDuplicateScore) * 100).toFixed(0)}% Similarity)</span>
                </div>
              </div>
              <p className="text-[11px] text-[#476685]">
                This report matches existing incident report <b className="text-[#0C2340]">{selectedReport.duplicateOfId || 'REP-2024-001'}</b> based on geographical proximity (&lt;250m) and overlapping textual descriptions.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedReport.id, 'DUPLICATE')}
                  className="px-3 py-1.5 rounded-lg bg-[#EA580C] text-white font-bold text-xs transition shadow-xs"
                >
                  Link as Duplicate
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedReport.id, 'VERIFIED')}
                  className="px-3 py-1.5 rounded-lg bg-white text-[#0C2340] border border-[#A8DFFA] text-xs hover:bg-[#F1FCFF] transition"
                >
                  Mark as Unique Event
                </button>
              </div>
            </div>
          )}

          {/* Location & Metadata */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA]">
              <span className="text-[#627D98] text-[10px] block">Location</span>
              <b className="text-[#0C2340]">{selectedReport.location.address}</b>
            </div>
            <div className="p-3 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA]">
              <span className="text-[#627D98] text-[10px] block">Contact</span>
              <b className="text-[#0C2340] font-mono">{selectedReport.contactPhone || 'Private'}</b>
            </div>
          </div>

          {/* Verification Decision Actions */}
          <div className="pt-3 border-t border-[#A8DFFA] space-y-2">
            <span className="text-[11px] font-black text-[#627D98] uppercase tracking-wider block">
              Authorized Ground Verification Action:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdateStatus(selectedReport.id, 'VERIFIED')}
                className="flex-1 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Escalate to Incident</span>
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedReport.id, 'REJECTED')}
                className="px-4 py-2.5 rounded-xl bg-[#FFF1F2] text-[#E11D48] border border-[#E11D48]/30 font-bold text-xs hover:bg-[#FFE4E6] transition"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
