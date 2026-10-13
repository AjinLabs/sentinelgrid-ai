'use client';

import React, { useState } from 'react';
import {
  Database,
  Radio,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Upload,
  RefreshCw,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import { DataSourceRecord } from '@/types/disaster';
import { initialDataSources } from '@/lib/mock-data';
import { Language, translations } from '@/lib/i18n';

interface DataSourcesManagerProps {
  language: Language;
}

export default function DataSourcesManager({ language }: DataSourcesManagerProps) {
  const t = translations[language];
  const [sources, setSources] = useState<DataSourceRecord[]>(initialDataSources);
  const [importStatus, setImportStatus] = useState<string>('');

  const handleSimulateSync = (id: string) => {
    setSources((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              lastSuccessfulSync: new Date().toISOString(),
              isStale: false,
              status: 'ACTIVE',
            }
          : s
      )
    );
  };

  const handleSimulateCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportStatus('Parsing & validating spatial schema (WGS84 EPSG:4326)...');
      setTimeout(() => {
        setImportStatus(
          `Successfully ingested ${file.name}: 142 observation rows validated. 0 duplicate records found.`
        );
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-[#A8DFFA] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-[#0284C7] text-white shadow-sm font-mono">
              TELEMETRY INGESTION PIPELINE
            </span>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#E0F2FE] text-[#0284C7] border border-[#A8DFFA]">
              PROVENANCE TRACKING
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0C2340] flex items-center gap-2">
            <Database className="w-6 h-6 text-[#0284C7]" />
            Data Sources & Ingestion Quality Engine
          </h1>
          <p className="text-xs text-[#476685] mt-1">
            Automated health tracking across Doppler radar, telemetric river gauges, satellite SAR products, and CSV/GeoJSON ingestion endpoints.
          </p>
        </div>

        {/* Upload Button */}
        <label className="px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs transition flex items-center gap-2 shadow-md shadow-[#0284C7]/20 cursor-pointer shrink-0">
          <Upload className="w-4 h-4" />
          <span>Import CSV / GeoJSON Dataset</span>
          <input
            type="file"
            accept=".csv,.geojson,.json"
            onChange={handleSimulateCSVUpload}
            className="hidden"
          />
        </label>
      </div>

      {importStatus && (
        <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#10B981]/30 text-xs text-[#065F46] flex items-center gap-2 shadow-sm font-semibold">
          <FileCheck className="w-4 h-4 shrink-0 text-[#10B981]" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Sources Table */}
      <div className="bg-white border border-[#A8DFFA]/70 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E0F2FE] pb-3">
          <h2 className="text-sm font-bold text-[#0C2340] flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#0284C7]" />
            Registered Feed Pipelines ({sources.length})
          </h2>
          <span className="text-[10px] text-[#627D98] font-mono">
            AUTOMATIC REFRESH DAEMON ACTIVE
          </span>
        </div>

        <div className="divide-y divide-[#E0F2FE]">
          {sources.map((src) => {
            const isStale = src.isStale;

            return (
              <div
                key={src.id}
                className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0C2340] text-sm">{src.name}</span>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        isStale
                          ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                          : 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                      }`}
                    >
                      {isStale ? 'STALE WARNING' : 'HEALTHY'}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#476685]">
                    Provider: <b className="text-[#0C2340]">{src.provider}</b> &bull; Category: {src.category}
                  </div>
                  <div className="text-[10px] text-[#627D98]">
                    Sync Frequency: Every {src.updateFrequencyMinutes}m &bull; Latency Threshold: {src.stalenessThresholdMinutes}m
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-[#627D98] block font-bold">Quality Score</span>
                    <b className="font-mono text-[#0284C7] font-black text-base">
                      {src.dataQualityScore}%
                    </b>
                  </div>

                  <button
                    onClick={() => handleSimulateSync(src.id)}
                    className="px-3.5 py-2 rounded-xl bg-[#F1FCFF] hover:bg-[#E0F2FE] text-[#0284C7] border border-[#A8DFFA] font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Feed</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
