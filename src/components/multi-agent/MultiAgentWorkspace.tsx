'use client';

import React, { useState } from 'react';
import {
  Bot,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Cpu,
  Layers,
  ChevronDown,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { MultiAgentSession } from '@/types/disaster';
import { runMultiAgentOrchestration } from '@/lib/multi-agent-system';
import { Language, translations } from '@/lib/i18n';

interface MultiAgentWorkspaceProps {
  language: Language;
  selectedDistrict: string;
  onApprovePlan?: (session: MultiAgentSession) => void;
}

export default function MultiAgentWorkspace({
  language,
  selectedDistrict,
  onApprovePlan,
}: MultiAgentWorkspaceProps) {
  const t = translations[language];

  const [activeSession, setActiveSession] = useState<MultiAgentSession>(() =>
    runMultiAgentOrchestration({
      district: selectedDistrict === 'all' ? 'Wayanad' : selectedDistrict,
      hazardType: 'LANDSLIDE',
      selectedRainfallMm: 372,
      riverLevelMeters: 9.85,
      availableBoats: 12,
      availableNdrfTeams: 2,
      staleSourcesCount: 1,
    })
  );

  const [isRunning, setIsRunning] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<
    'PENDING' | 'APPROVED' | 'REJECTED'
  >('PENDING');
  const [decisionNotes, setDecisionNotes] = useState('');

  const handleRunAgents = () => {
    setIsRunning(true);
    setTimeout(() => {
      const newSession = runMultiAgentOrchestration({
        district: selectedDistrict === 'all' ? 'Wayanad' : selectedDistrict,
        hazardType: 'LANDSLIDE',
        selectedRainfallMm: 372,
        riverLevelMeters: 9.85,
        availableBoats: 12,
        availableNdrfTeams: 2,
        staleSourcesCount: 1,
      });
      setActiveSession(newSession);
      setApprovalStatus('PENDING');
      setIsRunning(false);
    }, 1500);
  };

  const handleApprove = () => {
    setApprovalStatus('APPROVED');
    onApprovePlan?.({
      ...activeSession,
      status: 'APPROVED',
      humanApprover: 'Dr. Ajin K. Rajan (Incident Commander)',
      approvalTimestamp: new Date().toISOString(),
      decisionNotes: decisionNotes || 'Approved multi-agent tactical dispatch plan.',
    });
  };

  const handleReject = () => {
    setApprovalStatus('REJECTED');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner in Cloud & Sky */}
      <div className="bg-white border border-[#A8DFFA] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-[#0284C7] text-white shadow-xs font-mono">
              GOVERNED MULTI-AGENT SWARM
            </span>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#10B981]/40">
              POLICY-BOUND SAFETY
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0C2340] flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#0284C7]" />
            Multi-Agent AI Disaster Intelligence Centre
          </h1>
          <p className="text-xs text-[#476685]">
            Collaborative analysis across 10 specialized disaster agents with mandatory statutory compliance and human authorization gates.
          </p>
        </div>

        <button
          onClick={handleRunAgents}
          disabled={isRunning}
          className="px-5 py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs transition flex items-center gap-2 shadow-sm shrink-0 disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin text-white" />
              <span>Orchestrating 10 Agents...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white text-white" />
              <span>Run Multi-Agent Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* Grid: Left Agent Step Trace, Right Synthesized Decision Brief */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Step-by-Step Agent Trace (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0C2340] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#0284C7]" />
              Agent Reasoning Execution Trace ({activeSession.agentRuns.length} Steps)
            </h2>
            <span className="text-[10px] font-mono text-[#0284C7] font-bold">
              ID: {activeSession.sessionId}
            </span>
          </div>

          <div className="space-y-3">
            {activeSession.agentRuns.map((agent, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#A8DFFA] rounded-2xl p-4.5 space-y-3 shadow-2xs hover:border-[#0284C7] transition"
              >
                {/* Agent Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#E0F2FE] border border-[#A8DFFA] flex items-center justify-center text-xs font-black text-[#0369A1]">
                      0{idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-[#0C2340]">
                        {agent.agentName}
                      </div>
                      <div className="text-[10px] text-[#627D98]">
                        {agent.agentRole}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#0C2340] bg-[#F1FCFF] px-2.5 py-1 rounded-lg border border-[#A8DFFA]">
                      Conf: {(agent.confidence * 100).toFixed(0)}%
                    </span>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        agent.policyStatus === 'PASSED'
                          ? 'bg-[#ECFDF5] text-[#059669] border border-[#10B981]/30'
                          : 'bg-[#FFF7ED] text-[#EA580C] border border-[#F97316]/40'
                      }`}
                    >
                      {agent.policyStatus === 'PASSED'
                        ? 'VERIFIED'
                        : 'GATE REQUIRED'}
                    </span>
                  </div>
                </div>

                {/* Reasoning summary */}
                <p className="text-xs text-[#334E68] leading-relaxed bg-[#F8FDFF] p-3 rounded-xl border border-[#A8DFFA]">
                  {agent.reasoningSummary}
                </p>

                {/* Tool call & Evidence cited */}
                <div className="space-y-1.5 text-[11px]">
                  {agent.toolInvoked && (
                    <div className="flex items-center gap-2 font-mono text-[10px] text-[#476685]">
                      <span className="text-[#627D98]">Tool:</span>
                      <code className="text-[#0284C7] bg-[#F1FCFF] px-2 py-0.5 rounded-md border border-[#A8DFFA]">
                        {agent.toolInvoked}
                      </code>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-[#627D98] uppercase tracking-wider block">
                      Evidence Cited:
                    </span>
                    <ul className="space-y-0.5">
                      {agent.evidenceCited.map((ev, i) => (
                        <li
                          key={i}
                          className="text-[10px] text-[#334E68] flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]" />
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Synthesized Tactical Plan & Human-in-the-Loop Gate (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-[#A8DFFA] rounded-2xl p-5 space-y-4 shadow-sm sticky top-4">
            <div className="flex items-center justify-between border-b border-[#A8DFFA] pb-3">
              <h2 className="text-sm font-bold text-[#0C2340] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#059669]" />
                Synthesized Tactical Recommendation
              </h2>
              <span className="text-[10px] font-mono text-[#0284C7] font-bold">
                STATUS: {approvalStatus}
              </span>
            </div>

            {/* Executive Summary */}
            <div className="text-xs text-[#334E68] leading-relaxed bg-[#F8FDFF] p-3.5 rounded-xl border border-[#A8DFFA]">
              {activeSession.synthesizedRecommendation.executiveSummary}
            </div>

            {/* Action Items Checklist */}
            <div className="space-y-2">
              <span className="text-[11px] font-black text-[#627D98] uppercase tracking-wider block">
                Recommended Operational Actions:
              </span>
              <div className="space-y-1.5">
                {activeSession.synthesizedRecommendation.recommendedActions.map(
                  (act, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA] text-xs text-[#334E68] flex items-start gap-2.5"
                    >
                      <span className="w-4 h-4 rounded-full bg-[#0284C7] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{act}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Resource Deployments */}
            <div className="space-y-2">
              <span className="text-[11px] font-black text-[#627D98] uppercase tracking-wider block">
                Resource Allocation Dispatch:
              </span>
              <div className="space-y-1.5">
                {activeSession.synthesizedRecommendation.resourceAllocationPlan.map(
                  (res, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA] text-xs text-[#334E68] flex items-start gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0 mt-1.5" />
                      <span>{res}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Uncertainty & Limitations Disclosure */}
            <div className="p-3.5 rounded-xl bg-[#FFF7ED] border border-[#F97316]/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#EA580C]">
                <AlertTriangle className="w-4 h-4" />
                <span>Explicit Uncertainty Warnings</span>
              </div>
              <ul className="text-[11px] text-[#476685] space-y-1 list-disc pl-4">
                {activeSession.synthesizedRecommendation.uncertaintyWarnings.map(
                  (w, i) => (
                    <li key={i}>{w}</li>
                  )
                )}
              </ul>
            </div>

            {/* Human Decision-Support Approval Gate */}
            <div className="pt-3 border-t border-[#A8DFFA] space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0C2340]">
                <Lock className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Human-in-the-Loop Statutory Sign-Off</span>
              </div>
              <p className="text-[11px] text-[#627D98]">
                In accordance with NDMA guidelines, multi-agent AI recommendations require official authorization before field dispatch.
              </p>

              <textarea
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                placeholder="Incident Commander operational notes or constraints..."
                className="w-full bg-[#F1FCFF] border border-[#A8DFFA] rounded-xl p-2.5 text-xs text-[#0C2340] placeholder-[#627D98] focus:outline-none focus:border-[#0284C7]"
                rows={2}
              />

              <div className="flex items-center gap-2">
                <button
                  onClick={handleApprove}
                  disabled={approvalStatus === 'APPROVED'}
                  className="flex-1 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs transition disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {approvalStatus === 'APPROVED' ? 'Approved & Logged' : 'Approve & Dispatch'}
                  </span>
                </button>
                <button
                  onClick={handleReject}
                  disabled={approvalStatus === 'REJECTED'}
                  className="px-4 py-2.5 rounded-xl bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#E11D48] border border-[#E11D48]/40 font-bold text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>

              {approvalStatus === 'APPROVED' && (
                <div className="p-2.5 bg-[#ECFDF5] border border-[#10B981]/40 rounded-xl text-center text-xs text-[#059669] font-bold">
                  Tactical dispatch order signed & entered into immutable Audit Ledger.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
