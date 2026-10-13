'use client';

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Wifi,
  WifiOff,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  AlertOctagon,
  RefreshCw,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import {
  OfflineReportDraft,
  getOfflineDrafts,
  saveOfflineDraft,
  markDraftSynced,
} from '@/lib/offline-store';
import { Language, translations } from '@/lib/i18n';

interface FieldResponderPortalProps {
  language: Language;
}

export default function FieldResponderPortal({
  language,
}: FieldResponderPortalProps) {
  const t = translations[language];

  const [isOnline, setIsOnline] = useState(true);
  const [drafts, setDrafts] = useState<OfflineReportDraft[]>([]);
  const [formCategory, setFormCategory] = useState('LANDSLIDE');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');

  useEffect(() => {
    setDrafts(getOfflineDrafts());
  }, []);

  const handleCreateDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDescription) return;

    const draft: OfflineReportDraft = {
      idempotencyKey: `FLD-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      category: formCategory,
      title: formTitle,
      description: formDescription,
      lat: 11.5312,
      lng: 76.1625,
      district: 'Wayanad',
      timestamp: new Date().toISOString(),
      syncStatus: isOnline ? 'SYNCED' : 'QUEUED',
    };

    saveOfflineDraft(draft);
    setDrafts(getOfflineDrafts());
    setFormTitle('');
    setFormDescription('');
    setSyncStatusMsg(
      isOnline
        ? 'Report transmitted to Command Center EOC.'
        : 'Offline mode active: Report cached locally in IndexedDB/Storage queue.'
    );
  };

  const handleSyncAll = () => {
    if (!isOnline) {
      alert('Cannot sync while offline. Please toggle Network Status to Online first.');
      return;
    }
    drafts.forEach((d) => {
      if (d.syncStatus === 'QUEUED') {
        markDraftSynced(d.idempotencyKey);
      }
    });
    setDrafts(getOfflineDrafts());
    setSyncStatusMsg('All offline queued reports synchronized with Headquarters.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner with Connectivity Toggle in Cloud & Sky */}
      <div className="bg-white border border-[#A8DFFA] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-[#0284C7] text-white shadow-xs font-mono">
              OFFLINE-FIRST PWA ARCHITECTURE
            </span>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#10B981]/30">
              FIELD SECURE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0C2340] flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-[#0284C7]" />
            Field Tactical Responder Portal
          </h1>
          <p className="text-xs text-[#476685]">
            Designed for harsh terrain, intermittent 4G/satellite drops, and immediate offline local caching.
          </p>
        </div>

        {/* Network Toggle Button */}
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs border transition shadow-xs ${
            isOnline
              ? 'bg-[#ECFDF5] text-[#059669] border-[#10B981]/40 hover:bg-[#D1FAE5]'
              : 'bg-[#FFF1F2] text-[#E11D48] border-[#E11D48]/40 hover:bg-[#FFE4E6]'
          }`}
          title="Simulate network connectivity state"
        >
          {isOnline ? (
            <>
              <Wifi className="w-4 h-4 text-[#059669]" />
              <span>Network: ONLINE</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-[#E11D48] animate-pulse" />
              <span>Network: OFFLINE (Local Mode)</span>
            </>
          )}
        </button>
      </div>

      {syncStatusMsg && (
        <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#10B981]/40 text-xs text-[#065F46] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#059669]" />
            <span>{syncStatusMsg}</span>
          </div>
          <button
            onClick={() => setSyncStatusMsg('')}
            className="text-[10px] underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Grid: Form & Offline Sync Queue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rapid Damage & Incident Form */}
        <form
          onSubmit={handleCreateDraft}
          className="bg-white border border-[#A8DFFA] rounded-2xl p-6 space-y-4 shadow-sm"
        >
          <div className="border-b border-[#A8DFFA] pb-3">
            <h2 className="text-sm font-bold text-[#0C2340]">
              Log Ground Field Report
            </h2>
            <p className="text-[11px] text-[#627D98]">
              Updates will persist locally if network link is severed.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-[#627D98] uppercase">
              Incident Category
            </label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="w-full bg-[#F1FCFF] border border-[#A8DFFA] rounded-xl px-3 py-2 text-xs text-[#0C2340] focus:outline-none focus:border-[#0284C7]"
            >
              <option value="LANDSLIDE">Landslide / Mudflow</option>
              <option value="FLOODED_ROAD">Flooded Road / Submerged Causeway</option>
              <option value="MEDICAL_EMERGENCY">Medical Evacuation Need</option>
              <option value="INFRASTRUCTURE_DAMAGE">Bridge / Power Grid Severed</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-[#627D98] uppercase">
              Title / Landmark
            </label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g., Chooralmala Bridge South Abutment Washout"
              required
              className="w-full bg-[#F1FCFF] border border-[#A8DFFA] rounded-xl px-3.5 py-2.5 text-xs text-[#0C2340] placeholder-[#627D98] focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-[#627D98] uppercase">
              Field Observations & Victims Count
            </label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Record immediate ground details, water depth, stranded people..."
              required
              rows={3}
              className="w-full bg-[#F1FCFF] border border-[#A8DFFA] rounded-xl p-3 text-xs text-[#0C2340] placeholder-[#627D98] focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isOnline ? 'Submit to Headquarters' : 'Save Offline Draft'}</span>
          </button>
        </form>

        {/* Local Storage & Queue */}
        <div className="bg-white border border-[#A8DFFA] rounded-2xl p-6 space-y-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b border-[#A8DFFA] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#0C2340]">
                Local Device Queue ({drafts.length})
              </h2>
              <span className="text-[10px] text-[#627D98] font-mono">
                IDEMPOTENT LOCAL STORAGE
              </span>
            </div>
            <button
              onClick={handleSyncAll}
              disabled={!isOnline}
              className="px-3.5 py-1.5 rounded-xl bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0369A1] border border-[#A8DFFA] text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 transition shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync All</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[350px]">
            {drafts.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#627D98]">
                No offline queued items. All submissions synchronized.
              </div>
            ) : (
              drafts.map((d) => (
                <div
                  key={d.idempotencyKey}
                  className="p-3.5 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA] space-y-1.5 text-xs shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0C2340]">{d.title}</span>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        d.syncStatus === 'SYNCED'
                          ? 'bg-[#ECFDF5] text-[#059669]'
                          : 'bg-[#FFF7ED] text-[#EA580C]'
                      }`}
                    >
                      {d.syncStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#476685]">{d.description}</p>
                  <div className="text-[10px] text-[#627D98] font-mono">
                    Key: {d.idempotencyKey}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
