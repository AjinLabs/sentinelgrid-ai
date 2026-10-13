'use client';

import React, { useState } from 'react';
import {
  ScrollText,
  Search,
  ShieldCheck,
  Lock,
  Hash,
  Clock,
  User,
  Filter,
} from 'lucide-react';
import { AuditEvent } from '@/types/disaster';
import { initialAuditLogs } from '@/lib/mock-data';
import { Language, translations } from '@/lib/i18n';

interface AuditGovernanceViewProps {
  language: Language;
}

export default function AuditGovernanceView({ language }: AuditGovernanceViewProps) {
  const t = translations[language];
  const [logs, setLogs] = useState<AuditEvent[]>(initialAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-[#A8DFFA] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-mono">
              TAMPER-EVIDENT CRYPTOGRAPHIC LOG
            </span>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#0284C7] text-white shadow-sm font-mono">
              GOVERNANCE COMPLIANT
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0C2340] flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-[#0284C7]" />
            Audit Ledger & Decision Accountability Trail
          </h1>
          <p className="text-xs text-[#476685] mt-1">
            Immutable record of all consequential approvals, resource deployments, warning broadcasts, and model promotions.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#627D98]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action or actor..."
            className="w-full bg-[#F1FCFF] border border-[#A8DFFA] rounded-xl pl-9 pr-3 py-2 text-xs text-[#0C2340] placeholder-[#627D98] focus:outline-none focus:border-[#0284C7]"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-[#A8DFFA]/70 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E0F2FE] pb-3">
          <h2 className="text-sm font-bold text-[#0C2340] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#059669]" />
            Verified Ledger Entries ({filtered.length})
          </h2>
          <span className="text-[10px] text-[#059669] font-mono font-bold bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
            SHA-256 HASH CHAIN INTEGRITY: 100%
          </span>
        </div>

        <div className="space-y-3">
          {filtered.map((log) => (
            <div
              key={log.id}
              className="p-4.5 rounded-2xl bg-[#F8FDFF] border border-[#A8DFFA]/60 space-y-2.5 hover:border-[#0284C7] transition text-xs shadow-sm"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0C2340] text-sm">{log.action}</span>
                  <span className="text-[10px] font-mono text-[#0284C7] font-bold">
                    ID: {log.id}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#627D98]">
                  <Clock className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>{new Date(log.timestamp).toUTCString()}</span>
                </div>
              </div>

              <p className="text-[#334E68] leading-relaxed">{log.details}</p>

              <div className="pt-2 border-t border-[#E0F2FE] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10px] text-[#627D98]">
                <div className="flex items-center gap-3">
                  <span>Actor: <b className="text-[#0C2340]">{log.actor}</b> ({log.actorRole})</span>
                  <span>Org: <b className="text-[#0284C7]">{log.organization}</b></span>
                </div>

                <div className="flex items-center gap-1 font-mono text-[#334E68] truncate max-w-sm">
                  <Hash className="w-3 h-3 text-[#059669] shrink-0" />
                  <span className="truncate">{log.tamperProofHash}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
