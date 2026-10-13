'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Layers,
  ShieldAlert,
  Percent,
  CheckCircle2,
  Info,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { RiskPrediction } from '@/types/disaster';
import { initialRiskPredictions } from '@/lib/mock-data';
import { Language, translations } from '@/lib/i18n';

interface RiskForecastingViewProps {
  language: Language;
  selectedDistrict: string;
}

export default function RiskForecastingView({
  language,
  selectedDistrict,
}: RiskForecastingViewProps) {
  const t = translations[language];
  const [selectedPrediction, setSelectedPrediction] = useState<RiskPrediction>(
    initialRiskPredictions[0]
  );

  const filteredPredictions = initialRiskPredictions.filter(
    (p) => selectedDistrict === 'all' || p.district === selectedDistrict
  );

  return (
    <div className="space-y-6">
      {/* Banner in Cloud & Sky */}
      <div className="bg-white border border-[#A8DFFA] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-[#0284C7] text-white shadow-xs font-mono">
              EXPLAINABLE GEOSPATIAL AI (XAI)
            </span>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#E0F2FE] text-[#0369A1] border border-[#A8DFFA]">
              DECISION SUPPORT
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0C2340] flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#0284C7]" />
            AI Risk Forecasting & Susceptibility Intelligence
          </h1>
          <p className="text-xs text-[#476685]">
            Calibrated Machine Learning models synthesizing antecedent rainfall, slope curvature, river gauge discharge, and soil moisture saturation.
          </p>
        </div>
      </div>

      {/* Grid: List of Regional Predictions & Deep Feature Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Regional Forecasts (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-[#627D98] uppercase tracking-wider">
            Active Hazard Model Predictions ({filteredPredictions.length})
          </div>

          <div className="space-y-3">
            {filteredPredictions.map((pred) => {
              const isSelected = selectedPrediction.id === pred.id;
              const color =
                pred.riskCategory === 'CRITICAL'
                  ? '#EF4444'
                  : pred.riskCategory === 'HIGH'
                  ? '#F97316'
                  : '#D97706';

              return (
                <div
                  key={pred.id}
                  onClick={() => setSelectedPrediction(pred)}
                  className={`p-4 rounded-2xl border cursor-pointer transition space-y-3 shadow-2xs ${
                    isSelected
                      ? 'bg-[#F1FCFF] border-[#0284C7] ring-2 ring-[#0284C7]'
                      : 'bg-white border-[#A8DFFA] hover:border-[#0284C7]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-black px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${color}15`,
                        color: color,
                        border: `1px solid ${color}40`,
                      }}
                    >
                      {pred.riskCategory} {pred.hazardType}
                    </span>
                    <span className="text-[10px] font-mono text-[#627D98]">
                      {pred.forecastHorizon}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#0C2340]">{pred.regionName}</h3>
                    <div className="text-[11px] text-[#476685]">
                      District: <b className="text-[#0C2340]">{pred.district}</b>
                    </div>
                  </div>

                  {/* Score & Uncertainty Bar */}
                  <div className="space-y-1.5 pt-2 border-t border-[#A8DFFA]/50">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#476685]">Risk Probability:</span>
                      <span className="font-mono font-bold text-[#0C2340]">
                        {(pred.riskScore * 100).toFixed(0)}% (±
                        {(pred.uncertaintyMargin * 100).toFixed(0)}%)
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-[#F1FCFF] rounded-full overflow-hidden border border-[#A8DFFA]/30">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pred.riskScore * 100}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Explainable Feature Importance & Provenance (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white border border-[#A8DFFA] rounded-2xl p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#A8DFFA] pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#0C2340]">
                  Explainable Feature Weights (SHAP Values)
                </h2>
                <div className="text-[10px] font-mono text-[#0284C7] font-bold">
                  Model: {selectedPrediction.modelVersion}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#627D98] block">Data Quality</span>
                <span className="text-xs font-mono font-bold text-[#059669]">
                  {selectedPrediction.dataCompletenessScore}% Complete
                </span>
              </div>
            </div>

            {/* Feature Bars */}
            <div className="space-y-3">
              {selectedPrediction.topContributingFeatures.map((feat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#0C2340] font-semibold">{feat.feature}</span>
                    <span className="font-mono text-[#0284C7] font-bold">
                      {feat.value} (Weight: {(feat.weight * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F1FCFF] rounded-full overflow-hidden border border-[#A8DFFA]/30">
                    <div
                      className="h-full bg-[#0284C7] rounded-full"
                      style={{ width: `${feat.weight * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Recommended Action */}
            <div className="p-4 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA] space-y-1 shadow-2xs">
              <span className="text-[10px] font-black text-[#0284C7] uppercase tracking-wider block">
                Model Recommended Operational Advisory:
              </span>
              <p className="text-xs text-[#334E68] leading-relaxed">
                {selectedPrediction.recommendedAction}
              </p>
            </div>

            {/* Model Limitations Disclosure */}
            <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#F59E0B]/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#D97706]">
                <AlertTriangle className="w-4 h-4" />
                <span>Known Constraints & Limitations:</span>
              </div>
              <ul className="text-[11px] text-[#476685] space-y-1 list-disc pl-4">
                {selectedPrediction.limitations.map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
