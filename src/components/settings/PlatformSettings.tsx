'use client';

import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Radio,
  Sliders,
  CheckCircle2,
  Key,
  Database,
  Lock,
} from 'lucide-react';
import { Language, translations } from '@/lib/i18n';
import { initialCurrentUser } from '@/lib/mock-data';

export default function PlatformSettings({ language }: { language: Language }) {
  const t = translations[language];

  const [rainfallThreshold, setRainfallThreshold] = useState(204);
  const [riverStageOffset, setRiverStageOffset] = useState(0.5);
  const [saveMsg, setSaveMsg] = useState(false);

  const handleSave = () => {
    setSaveMsg(true);
    setTimeout(() => setSaveMsg(false), 2000);
  };

  const integrations = [
    {
      name: 'Google Maps Engine & Direct Satellite Feed',
      category: 'Photorealistic Imagery & Hybrid Vectors',
      status: 'CONNECTED',
      credentials: 'Native High-Res Satellite Active (No Watermarks)',
    },
    {
      name: 'India Meteorological Department (IMD) API',
      category: 'Weather Radar & ARG Feeds',
      status: 'CONNECTED',
      credentials: 'API-KEY (Configured in .env)',
    },
    {
      name: 'Central Water Commission (CWC) Telemetry',
      category: 'River Stage Gauge Sensors',
      status: 'CONNECTED',
      credentials: 'OAuth2 Certificate Valid',
    },
    {
      name: 'NDMA Common Alerting Protocol (CAP) Gateway',
      category: 'Statewide Cell Broadcast & SMS',
      status: 'CONNECTED',
      credentials: 'Digital Signature Cert Active',
    },
    {
      name: 'Copernicus Open Access Hub (Sentinel-1 SAR)',
      category: 'Synthetic Aperture Radar Flood Extent',
      status: 'STANDBY',
      credentials: 'User Token Configured',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-white border border-[#A8DFFA] rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-[#0284C7] text-white shadow-sm font-mono">
              SYSTEM CONFIGURATION
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0C2340] flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#0284C7]" />
            Platform Governance & Environmental Thresholds
          </h1>
          <p className="text-xs text-[#476685] mt-1">
            Configure multi-organization policies, environmental trigger thresholds, and external API gateways.
          </p>
        </div>
      </div>

      {saveMsg && (
        <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#10B981]/30 text-xs text-[#065F46] flex items-center gap-2 font-semibold shadow-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#10B981]" />
          <span>Platform configuration updated and broadcast to EOC nodes.</span>
        </div>
      )}

      {/* Threshold Rules */}
      <div className="bg-white border border-[#A8DFFA]/70 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E0F2FE] pb-3">
          <h2 className="text-sm font-bold text-[#0C2340] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#0284C7]" />
            Internal Automated Watch Thresholds
          </h2>
          <span className="text-[10px] text-[#059669] font-mono font-bold bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
            POLICY COMPLIANT
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-[#334E68] font-semibold block">
              IMD Red Alert Rainfall Trigger (mm / 24h)
            </label>
            <input
              type="number"
              value={rainfallThreshold}
              onChange={(e) => setRainfallThreshold(Number(e.target.value))}
              className="w-full bg-[#F1FCFF] border border-[#A8DFFA] rounded-xl p-3 text-[#0C2340] font-mono font-bold focus:outline-none focus:border-[#0284C7]"
            />
            <span className="text-[10px] text-[#627D98] block">
              Standard IMD Extremely Heavy Rainfall baseline: 204.5 mm
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[#334E68] font-semibold block">
              River Danger Pre-Warning Offset (Meters below Danger Mark)
            </label>
            <input
              type="number"
              step="0.1"
              value={riverStageOffset}
              onChange={(e) => setRiverStageOffset(Number(e.target.value))}
              className="w-full bg-[#F1FCFF] border border-[#A8DFFA] rounded-xl p-3 text-[#0C2340] font-mono font-bold focus:outline-none focus:border-[#0284C7]"
            />
            <span className="text-[10px] text-[#627D98] block">
              Triggers amber watch advisory prior to bank overflow.
            </span>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-extrabold shadow-md shadow-[#0284C7]/20 transition"
        >
          Save Threshold Policy
        </button>
      </div>

      {/* External Integration Gateways */}
      <div className="bg-white border border-[#A8DFFA]/70 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E0F2FE] pb-3">
          <h2 className="text-sm font-bold text-[#0C2340] flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#0284C7]" />
            External Telemetry Gateways & Credentials Status
          </h2>
          <span className="text-[10px] text-[#059669] font-mono font-bold bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
            ALL OPERATIONAL
          </span>
        </div>

        <div className="space-y-3">
          {integrations.map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA]/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs"
            >
              <div>
                <b className="text-[#0C2340] text-sm">{item.name}</b>
                <div className="text-[11px] text-[#476685]">{item.category}</div>
                <div className="text-[10px] text-[#0284C7] font-mono mt-0.5 font-bold">
                  {item.credentials}
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black ${
                  item.status === 'CONNECTED'
                    ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                    : 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]'
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
