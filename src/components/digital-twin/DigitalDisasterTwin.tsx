'use client';

import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Play,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Building,
  Navigation,
  CheckCircle2,
  GitBranch,
} from 'lucide-react';
import { DigitalTwinScenario } from '@/types/disaster';
import { initialDigitalTwinScenarios } from '@/lib/mock-data';
import { Language, translations } from '@/lib/i18n';

interface DigitalDisasterTwinProps {
  language: Language;
  onPromotePlanToOps?: (planName: string) => void;
}

export default function DigitalDisasterTwin({
  language,
  onPromotePlanToOps,
}: DigitalDisasterTwinProps) {
  const t = translations[language];
  const [selectedScenario, setSelectedScenario] = useState<DigitalTwinScenario>(
    initialDigitalTwinScenarios[0]
  );

  // Interactive Parameter Sliders
  const [rainfallDelta, setRainfallDelta] = useState<number>(
    selectedScenario.parameters.rainfallSurgeMm
  );
  const [riverLevelRise, setRiverLevelRise] = useState<number>(
    selectedScenario.parameters.riverLevelRiseMeters
  );
  const [damDischarge, setDamDischarge] = useState<number>(
    selectedScenario.parameters.damReleaseCumecs
  );
  const [simulatedBreaches, setSimulatedBreaches] = useState<number>(
    selectedScenario.parameters.simulatedRoadBreaches
  );

  const [activePlanId, setActivePlanId] = useState<string>(
    selectedScenario.alternativeResponsePlans[0]?.planId || 'PLAN-OPT-A1'
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationCompleteNotice, setSimulationCompleteNotice] = useState(false);

  // Dynamic calculations based on parameter controls
  const computedRoadSubmerged = parseFloat(
    (
      selectedScenario.simulatedImpacts.submergedRoadKm *
      (1 + (rainfallDelta - 100) / 250)
    ).toFixed(1)
  );
  const computedDisplaced = Math.round(
    selectedScenario.simulatedImpacts.projectedDisplacedPopulation *
      (1 + (rainfallDelta - 100) / 200 + (riverLevelRise - 1.5) / 5)
  );
  const computedUnmetShelter = Math.max(
    0,
    Math.round(
      selectedScenario.simulatedImpacts.unmetShelterDemand *
        (1 + (rainfallDelta - 100) / 180)
    )
  );
  const computedTeamsShortfall = Math.max(
    1,
    Math.round(
      selectedScenario.simulatedImpacts.emergencyTeamsShortfall *
        (1 + (simulatedBreaches - 2) / 4)
    )
  );

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationCompleteNotice(false);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationCompleteNotice(true);
    }, 1200);
  };

  const handleSelectPreset = (scen: DigitalTwinScenario) => {
    setSelectedScenario(scen);
    setRainfallDelta(scen.parameters.rainfallSurgeMm);
    setRiverLevelRise(scen.parameters.riverLevelRiseMeters);
    setDamDischarge(scen.parameters.damReleaseCumecs);
    setSimulatedBreaches(scen.parameters.simulatedRoadBreaches);
    if (scen.alternativeResponsePlans.length > 0) {
      setActivePlanId(scen.alternativeResponsePlans[0].planId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Signature Banner & Safety Sandbox Notice in Cloud & Sky */}
      <div className="bg-white border border-[#A8DFFA] rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-[#0284C7] text-white shadow-xs">
                SIGNATURE DIGITAL TWIN
              </span>
              <span className="px-3 py-0.5 rounded-full text-[10px] font-mono bg-[#E0F2FE] text-[#0369A1] border border-[#A8DFFA] font-bold">
                SANDBOX SIMULATION &bull; NOT LIVE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0C2340] flex items-center gap-2">
              <Cpu className="w-6 h-6 text-[#0284C7]" />
              Digital Disaster Twin & Cascading Failure Simulator
            </h1>
            <p className="text-xs text-[#476685] max-w-3xl">
              Model complex compound climate hazards, test counterfactual road cuts, forecast shelter capacity deficits, and optimize inter-agency emergency allocation before deploying real responders.
            </p>
          </div>

          {/* Preset Scenario Selector */}
          <div className="flex items-center gap-1.5 bg-[#F1FCFF] p-1.5 rounded-xl border border-[#A8DFFA]">
            <span className="text-xs text-[#476685] px-2 font-bold">Preset:</span>
            {initialDigitalTwinScenarios.map((scen) => (
              <button
                key={scen.id}
                onClick={() => handleSelectPreset(scen)}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${
                  selectedScenario.id === scen.id
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'text-[#334E68] hover:text-[#0C2340] hover:bg-[#E0F2FE]'
                }`}
              >
                {scen.districtFocus}: {scen.hazardFocus}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls & Right Cascading Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Scenario Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-[#A8DFFA] rounded-2xl p-5 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#A8DFFA] pb-3">
              <h2 className="text-sm font-bold text-[#0C2340] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0284C7]" />
                Scenario Parameter Sliders
              </h2>
              <span className="text-[10px] font-mono text-[#0284C7] font-bold">
                FOCUS: {selectedScenario.districtFocus.toUpperCase()}
              </span>
            </div>

            {/* Slider 1: Rainfall Surge */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#334E68] font-medium">Extreme Rainfall Delta</span>
                <span className="font-mono font-bold text-[#0284C7]">
                  +{rainfallDelta} mm
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={350}
                step={10}
                value={rainfallDelta}
                onChange={(e) => setRainfallDelta(Number(e.target.value))}
                className="w-full accent-[#0284C7] h-2 bg-[#E0F2FE] rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#627D98]">
                <span>+20mm (Moderate)</span>
                <span>+180mm (Severe)</span>
                <span>+350mm (Cloudburst)</span>
              </div>
            </div>

            {/* Slider 2: River Stage Rise */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#334E68] font-medium">River Gauge Surge Height</span>
                <span className="font-mono font-bold text-[#0284C7]">
                  +{riverLevelRise.toFixed(1)} m
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={5.0}
                step={0.1}
                value={riverLevelRise}
                onChange={(e) => setRiverLevelRise(Number(e.target.value))}
                className="w-full accent-[#0284C7] h-2 bg-[#E0F2FE] rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#627D98]">
                <span>+0.5m Bankfull</span>
                <span>+2.5m Danger</span>
                <span>+5.0m Overtopping</span>
              </div>
            </div>

            {/* Slider 3: Dam Spillway Discharge */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#334E68] font-medium">Controlled Spillway Discharge</span>
                <span className="font-mono font-bold text-[#0284C7]">
                  {damDischarge} cumecs
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={2000}
                step={50}
                value={damDischarge}
                onChange={(e) => setDamDischarge(Number(e.target.value))}
                className="w-full accent-[#0284C7] h-2 bg-[#E0F2FE] rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#627D98]">
                <span>100 Normal</span>
                <span>800 Regulated</span>
                <span>2,000 Extreme</span>
              </div>
            </div>

            {/* Slider 4: Simulated Road Breaches */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#334E68] font-medium">Simulated Road / Bridge Cuts</span>
                <span className="font-mono font-bold text-[#EF4444]">
                  {simulatedBreaches} Severed Points
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                step={1}
                value={simulatedBreaches}
                onChange={(e) => setSimulatedBreaches(Number(e.target.value))}
                className="w-full accent-[#EF4444] h-2 bg-[#FEE2E2] rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#627D98]">
                <span>0 Clear</span>
                <span>5 Localized</span>
                <span>15 Regional Paralysis</span>
              </div>
            </div>

            {/* Run Re-Simulation Button */}
            <div className="pt-2">
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full py-3 px-4 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-white" />
                    <span>Recalculating Hydro-Dynamic Mesh...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white text-white" />
                    <span>Run Digital Twin Simulation</span>
                  </>
                )}
              </button>
            </div>

            {simulationCompleteNotice && (
              <div className="p-3 rounded-xl bg-[#ECFDF5] border border-[#10B981]/40 text-[#059669] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Simulation synchronized with baseline topological geometry.</span>
              </div>
            )}
          </div>

          {/* Projected Impact Scorecards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-[#A8DFFA] rounded-xl p-4 space-y-1 shadow-2xs">
              <span className="text-[10px] text-[#627D98] uppercase font-bold tracking-wider">
                Road Inundation
              </span>
              <div className="text-xl font-bold font-mono text-[#0284C7]">
                {computedRoadSubmerged} km
              </div>
              <p className="text-[10px] text-[#476685]">Severed arterial transit</p>
            </div>

            <div className="bg-white border border-[#A8DFFA] rounded-xl p-4 space-y-1 shadow-2xs">
              <span className="text-[10px] text-[#627D98] uppercase font-bold tracking-wider">
                Displaced People
              </span>
              <div className="text-xl font-bold font-mono text-[#F97316]">
                {computedDisplaced.toLocaleString()}
              </div>
              <p className="text-[10px] text-[#476685]">High-hazard river zones</p>
            </div>

            <div className="bg-white border border-[#A8DFFA] rounded-xl p-4 space-y-1 shadow-2xs">
              <span className="text-[10px] text-[#627D98] uppercase font-bold tracking-wider">
                Unmet Camp Capacity
              </span>
              <div className="text-xl font-bold font-mono text-[#EF4444]">
                {computedUnmetShelter.toLocaleString()}
              </div>
              <p className="text-[10px] text-[#476685]">Deficit requiring auxiliary hubs</p>
            </div>

            <div className="bg-white border border-[#A8DFFA] rounded-xl p-4 space-y-1 shadow-2xs">
              <span className="text-[10px] text-[#627D98] uppercase font-bold tracking-wider">
                Rescue Squad Gap
              </span>
              <div className="text-xl font-bold font-mono text-[#D97706]">
                {computedTeamsShortfall} Teams
              </div>
              <p className="text-[10px] text-[#476685]">NDRF & Boat deficit</p>
            </div>
          </div>
        </div>

        {/* Right Column: Cascading Failure Graph & Alternative Plans (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Cascading Hazard Dependency Analysis */}
          <div className="bg-white border border-[#A8DFFA] rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#A8DFFA] pb-3">
              <h2 className="text-sm font-bold text-[#0C2340] flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#0284C7]" />
                Cascading System Dependencies & Bottlenecks
              </h2>
              <span className="text-[10px] bg-[#E0F2FE] text-[#0369A1] border border-[#A8DFFA] px-2 py-0.5 rounded font-bold">
                INFRASTRUCTURE GRAPH
              </span>
            </div>

            <div className="space-y-3">
              {selectedScenario.cascadingFailures.map((cascade, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA] hover:border-[#0284C7] transition space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0C2340]">
                      <span className="text-[#EF4444] font-bold">1° Trigger:</span>
                      <span>{cascade.triggerNode}</span>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        cascade.severity === 'CRITICAL'
                          ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                          : 'bg-[#F97316]/15 text-[#EA580C] border border-[#F97316]/30'
                      }`}
                    >
                      {cascade.severity} IMPACT
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#334E68] pl-2 border-l-2 border-[#0284C7]">
                    <ArrowRight className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                    <span className="font-bold text-[#0C2340]">{cascade.affectedNode}</span>
                  </div>

                  <p className="text-[11px] text-[#476685] pl-5">
                    {cascade.consequence}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Alternative Response Plan Comparison */}
          <div className="bg-white border border-[#A8DFFA] rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#A8DFFA] pb-3">
              <h2 className="text-sm font-bold text-[#0C2340] flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#0284C7]" />
                Alternative Response Plan Comparison
              </h2>
              <span className="text-[10px] text-[#627D98] font-bold">
                COUNTERFACTUAL DECISION MATRIX
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedScenario.alternativeResponsePlans.map((plan) => {
                const isSelected = activePlanId === plan.planId;
                return (
                  <div
                    key={plan.planId}
                    onClick={() => setActivePlanId(plan.planId)}
                    className={`p-4 rounded-xl border cursor-pointer transition space-y-3 ${
                      isSelected
                        ? 'bg-[#F1FCFF] border-[#0284C7] shadow-sm ring-2 ring-[#0284C7]'
                        : 'bg-[#F8FDFF] border-[#A8DFFA] hover:border-[#0284C7]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0C2340]">
                        {plan.name}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
                      )}
                    </div>

                    <p className="text-[11px] text-[#476685] leading-relaxed">
                      {plan.evacuationRoutingStrategy}
                    </p>

                    <div className="pt-2 border-t border-[#A8DFFA] grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[#627D98] block text-[10px]">Avg Travel Dist</span>
                        <b className="text-[#0C2340] font-mono">{plan.avgTravelDistanceKm} km</b>
                      </div>
                      <div>
                        <span className="text-[#627D98] block text-[10px]">Unmet Demand</span>
                        <b className="text-[#059669] font-mono">
                          {(plan.unmetDemandRatio * 100).toFixed(0)}%
                        </b>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Bar for Plan Promotion */}
            <div className="pt-3 border-t border-[#A8DFFA] flex items-center justify-between">
              <div className="text-xs text-[#476685]">
                Selected Plan: <b className="text-[#0284C7]">{activePlanId}</b>
              </div>
              <button
                onClick={() => {
                  onPromotePlanToOps?.(activePlanId);
                  alert(
                    `Plan ${activePlanId} has been successfully validated and prepared for Incident Commander sign-off.`
                  );
                }}
                className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs transition flex items-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Promote Plan to Incident Command</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
