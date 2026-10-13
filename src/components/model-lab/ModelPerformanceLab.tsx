'use client';

import React from 'react';
import {
  FlaskConical,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import { Language, translations } from '@/lib/i18n';

export default function ModelPerformanceLab({ language }: { language: Language }) {
  const t = translations[language];

  const models = [
    {
      id: 'MOD-LANDSLIDE-01',
      name: 'SG-GeoML-Landslide-v2.4',
      type: 'XGBoost + Geotechnical Gradient Boosting',
      rocAuc: 0.932,
      prAuc: 0.894,
      brierScore: 0.082,
      falseNegativeRate: '2.1%',
      status: 'APPROVED_FOR_DECISION_SUPPORT',
      trainingCutoff: '2018-2024 Historical Western Ghats Debris Flow Inventory',
      featureDriftAlert: 'STABLE (PSI < 0.05)',
    },
    {
      id: 'MOD-FLOOD-02',
      name: 'SG-HydroBoost-Flood-v3.1',
      type: '1D Hydrodynamic + Random Forest Ensemble',
      rocAuc: 0.948,
      prAuc: 0.916,
      brierScore: 0.065,
      falseNegativeRate: '1.8%',
      status: 'APPROVED_FOR_DECISION_SUPPORT',
      trainingCutoff: '2018-2024 CWC River Gauge Hydrographs',
      featureDriftAlert: 'STABLE (PSI < 0.04)',
    },
    {
      id: 'MOD-SAR-03',
      name: 'SG-SAR-FloodExtent-v1.2',
      type: 'U-Net Deep Semantic Segmentation (Sentinel-1)',
      rocAuc: 0.915,
      prAuc: 0.872,
      brierScore: 0.098,
      falseNegativeRate: '4.2%',
      status: 'EXPERIMENTAL_MONITORING',
      trainingCutoff: 'Copernicus SAR Imagery 2020-2024',
      featureDriftAlert: 'ELEVATED (Cloud Retardation / Specular Reflection)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-[#A8DFFA] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-[#0284C7] text-white shadow-sm font-mono">
              MLOPS & CALIBRATION BENCHMARK
            </span>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#E0F2FE] text-[#0284C7] border border-[#A8DFFA]">
              LEAKAGE-AUDITED
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0C2340] flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-[#0284C7]" />
            Model Performance Lab & Drift Observatory
          </h1>
          <p className="text-xs text-[#476685] mt-1">
            Rigorous evaluation of predictive discrimination, probability calibration, class imbalance handling, and population drift.
          </p>
        </div>
      </div>

      {/* Model Cards */}
      <div className="space-y-4">
        {models.map((mod) => (
          <div
            key={mod.id}
            className="bg-white border border-[#A8DFFA]/70 rounded-2xl p-6 space-y-4 shadow-sm hover:border-[#0284C7] transition"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#E0F2FE] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#0C2340]">{mod.name}</h3>
                  <span
                    className={`text-[9px] font-black px-2.5 py-0.5 rounded-full ${
                      mod.status.includes('APPROVED')
                        ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                        : 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]'
                    }`}
                  >
                    {mod.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-[11px] text-[#627D98] mt-0.5">{mod.type}</div>
              </div>

              <span className="text-[10px] font-mono text-[#0284C7] font-bold bg-[#F1FCFF] px-3 py-1 rounded-xl border border-[#A8DFFA]">
                Drift: {mod.featureDriftAlert}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F1FCFF] border border-[#A8DFFA]/60">
                <span className="text-[#627D98] text-[10px] block font-medium">ROC-AUC Score</span>
                <b className="text-xl font-mono text-[#0284C7]">{mod.rocAuc}</b>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F1FCFF] border border-[#A8DFFA]/60">
                <span className="text-[#627D98] text-[10px] block font-medium">PR-AUC (Imbalance)</span>
                <b className="text-xl font-mono text-[#0C2340]">{mod.prAuc}</b>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F1FCFF] border border-[#A8DFFA]/60">
                <span className="text-[#627D98] text-[10px] block font-medium">Brier Calibration</span>
                <b className="text-xl font-mono text-[#059669]">{mod.brierScore}</b>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F1FCFF] border border-[#A8DFFA]/60">
                <span className="text-[#627D98] text-[10px] block font-medium">False-Negative Rate</span>
                <b className="text-xl font-mono text-[#EF4444]">{mod.falseNegativeRate}</b>
              </div>
            </div>

            <div className="text-[11px] text-[#476685] flex items-center justify-between pt-1">
              <span>Training Cutoff: <b className="text-[#0C2340]">{mod.trainingCutoff}</b></span>
              <span className="text-[10px] text-[#627D98]">Holdout: 5-Fold Stratified Spatial Split</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
