'use client';

import React, { useState } from 'react';
import {
  BellRing,
  ShieldAlert,
  CheckCircle2,
  Send,
  AlertTriangle,
  Radio,
  FileText,
  Lock,
} from 'lucide-react';
import { EmergencyAlert } from '@/types/disaster';
import { initialAlerts } from '@/lib/mock-data';
import { Language, translations } from '@/lib/i18n';

interface AlertNotificationCenterProps {
  language: Language;
}

export default function AlertNotificationCenter({
  language,
}: AlertNotificationCenterProps) {
  const t = translations[language];
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(initialAlerts);
  const [selectedAlert, setSelectedAlert] = useState<EmergencyAlert>(alerts[0]);
  const [previewChannel, setPreviewChannel] = useState<'SMS' | 'CAP' | 'PORTAL'>('SMS');

  const handleApproveAndDispatch = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'APPROVED_DISPATCHED',
              approvedBy: 'Dr. Ajin K. Rajan (Incident Commander)',
              approvedAt: new Date().toISOString(),
            }
          : a
      )
    );
    if (selectedAlert.id === alertId) {
      setSelectedAlert((prev) => ({
        ...prev,
        status: 'APPROVED_DISPATCHED',
        approvedBy: 'Dr. Ajin K. Rajan (Incident Commander)',
        approvedAt: new Date().toISOString(),
      }));
    }
    alert(`Alert ${alertId} cryptographically signed and dispatched via NDMA CAP gateway.`);
  };

  return (
    <div className="space-y-6">
      {/* Banner in Cloud & Sky */}
      <div className="bg-white border border-[#A8DFFA] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-[#EF4444] text-white shadow-xs font-mono">
              COMMON ALERTING PROTOCOL (CAP)
            </span>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#10B981]/30">
              NDMA FEDERATED
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0C2340] flex items-center gap-2">
            <BellRing className="w-6 h-6 text-[#0284C7]" />
            Early Warning Support & Alert Dispatch Centre
          </h1>
          <p className="text-xs text-[#476685]">
            Multi-channel public dissemination engine with mandatory human-in-the-loop authorization gates and bilingual preview.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Alerts List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-[#627D98] uppercase tracking-wider">
            Broadcast Advisory Queue ({alerts.length})
          </div>

          <div className="space-y-3">
            {alerts.map((alt) => {
              const isSelected = selectedAlert.id === alt.id;
              const isDispatched = alt.status === 'APPROVED_DISPATCHED';

              return (
                <div
                  key={alt.id}
                  onClick={() => setSelectedAlert(alt)}
                  className={`p-4 rounded-2xl border cursor-pointer transition space-y-3 shadow-2xs ${
                    isSelected
                      ? 'bg-[#F1FCFF] border-[#0284C7] ring-2 ring-[#0284C7]'
                      : 'bg-white border-[#A8DFFA] hover:border-[#0284C7]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF1F2] text-[#E11D48] border border-[#E11D48]/30">
                      {alt.severity} {alt.hazardType}
                    </span>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        isDispatched
                          ? 'bg-[#ECFDF5] text-[#059669] border border-[#10B981]/30'
                          : 'bg-[#FFF7ED] text-[#EA580C] border border-[#F97316]/30'
                      }`}
                    >
                      {alt.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#0C2340]">{alt.title}</h3>
                    <div className="text-[11px] text-[#0284C7] mt-0.5 font-bold">
                      {alt.titleMalayalam}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#627D98] pt-2 border-t border-[#A8DFFA]/50">
                    <span>District: <b className="text-[#0C2340]">{alt.district}</b></span>
                    <span>Channels: {alt.dispatchedChannels.length} Active</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Bilingual Broadcast Preview & Approval (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#A8DFFA] rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#A8DFFA] pb-3">
            <div>
              <span className="text-[10px] font-mono text-[#0284C7] font-bold">
                STATUTORY DISPATCH ADVISORY: {selectedAlert.id}
              </span>
              <h2 className="text-base font-extrabold text-[#0C2340] mt-1">
                {selectedAlert.title}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F1FCFF] p-1 rounded-xl text-xs border border-[#A8DFFA]">
              <button
                onClick={() => setPreviewChannel('SMS')}
                className={`px-2.5 py-1 rounded-lg font-bold ${
                  previewChannel === 'SMS' ? 'bg-[#0284C7] text-white' : 'text-[#476685]'
                }`}
              >
                SMS
              </button>
              <button
                onClick={() => setPreviewChannel('CAP')}
                className={`px-2.5 py-1 rounded-lg font-bold ${
                  previewChannel === 'CAP' ? 'bg-[#0284C7] text-white' : 'text-[#476685]'
                }`}
              >
                CAP-XML
              </button>
            </div>
          </div>

          {/* Bilingual Message Preview Box */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA] space-y-1">
              <span className="text-[10px] font-black text-[#627D98] uppercase block">
                English Message Preview:
              </span>
              <p className="text-xs text-[#334E68] leading-relaxed">
                {selectedAlert.publicMessage}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA] space-y-1">
              <span className="text-[10px] font-black text-[#0284C7] uppercase block">
                മലയാളം മുന്നറിയിപ്പ് സന്ദേശം (Malayalam):
              </span>
              <p className="text-xs text-[#0C2340] leading-relaxed font-sans font-medium">
                {selectedAlert.publicMessageMalayalam}
              </p>
            </div>
          </div>

          {/* Source Evidence Checklist */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black text-[#627D98] uppercase tracking-wider block">
              Audited Source Evidence:
            </span>
            <ul className="text-xs text-[#334E68] space-y-1">
              {selectedAlert.sourceEvidence.map((ev, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Approval Action */}
          <div className="pt-3 border-t border-[#A8DFFA] space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-[#476685]">
                Approval Status:{' '}
                <b className="text-[#0C2340]">
                  {selectedAlert.status === 'APPROVED_DISPATCHED'
                    ? `Dispatched by ${selectedAlert.approvedBy}`
                    : 'Awaiting Commander Signature'}
                </b>
              </div>
            </div>

            {selectedAlert.status !== 'APPROVED_DISPATCHED' ? (
              <button
                onClick={() => handleApproveAndDispatch(selectedAlert.id)}
                className="w-full py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Lock className="w-4 h-4" />
                <span>Authorize & Dispatch Emergency Broadcast</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#10B981]/30 text-xs text-[#059669] flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Dispatched to telecom cell towers and public media. Record logged in tamper-proof audit trail.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
