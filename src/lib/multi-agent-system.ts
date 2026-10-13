import { AgentMessage, MultiAgentSession, UserRole } from "@/types/disaster";

export interface AgentRunContext {
  incidentId?: string;
  district: string;
  hazardType: string;
  selectedRainfallMm: number;
  riverLevelMeters: number;
  availableBoats: number;
  availableNdrfTeams: number;
  staleSourcesCount: number;
}

export function runMultiAgentOrchestration(context: AgentRunContext): MultiAgentSession {
  const timestamp = new Date().toISOString();
  const runs: AgentMessage[] = [];

  // 1. Data Quality Agent
  const dataQualityStale = context.staleSourcesCount > 0;
  runs.push({
    agentName: "Data Quality Agent",
    agentRole: "Telemetry Validation & Temporal Integrity",
    reasoningSummary: dataQualityStale
      ? `Detected ${context.staleSourcesCount} data feed(s) with stale latency (PWD road status latency > 30m). Flagging unverified road segments for downstream agents.`
      : "All 5 core real-time telemetry pipelines (IMD Radar, CWC Gauges, KSEB Dam Outflows) verified active within 15-minute sync SLA.",
    toolInvoked: "telemetry_health_check()",
    evidenceCited: [
      "CWC Neeleswaram Gauge (Timestamp 06:30Z, Latency 4m)",
      "IMD Vellarimala ARG (Timestamp 06:30Z, Latency 2m)",
      "Kerala PWD Road Blockage Feed (Latency 45m - Stale Warning)",
    ],
    outputData: {
      freshFeeds: 4,
      staleFeeds: context.staleSourcesCount,
      telemetryConfidenceIndex: dataQualityStale ? 0.82 : 0.96,
      staleFeedsList: dataQualityStale ? ["SRC-PWD-ROADS"] : [],
    },
    confidence: dataQualityStale ? 0.84 : 0.98,
    policyStatus: "PASSED",
    timestamp: new Date(Date.now() - 35000).toISOString(),
  });

  // 2. Hazard Analyst Agent
  runs.push({
    agentName: "Hazard Analyst Agent",
    agentRole: "Physical Risk & Precipitation Dynamics",
    reasoningSummary: `Synthesizing hydrological and geotechnical vectors for ${context.district}. Extreme cumulative rainfall (${context.selectedRainfallMm}mm) combined with river gauge height (${context.riverLevelMeters}m) pushes hazard index to Critical threshold (0.91/1.0).`,
    toolInvoked: "hydro_geotech_evaluator()",
    evidenceCited: [
      `ARG Accumulated Rainfall: ${context.selectedRainfallMm}mm (320% above seasonal normal)`,
      `River Stage Height: ${context.riverLevelMeters}m (+0.65m over designated Danger Level)`,
      "Antecedent Soil Moisture Saturation: 98.4%",
    ],
    outputData: {
      hazardClassification: context.hazardType,
      compositeRiskScore: 0.92,
      probabilityOfSecondaryDebrisFlow: 0.78,
      recommendedMonitoringInterval: "15 minutes",
    },
    confidence: 0.91,
    policyStatus: "PASSED",
    timestamp: new Date(Date.now() - 30000).toISOString(),
  });

  // 3. Geospatial Analyst Agent
  runs.push({
    agentName: "Geospatial Analyst Agent",
    agentRole: "Spatial Buffer & Infrastructure Vulnerability",
    reasoningSummary: `Executed 2.5km radial buffer analysis along river corridor in ${context.district}. Identified 3 low-lying hamlets, 1 primary school shelter at 84% capacity, and 2 bridge bottlenecks at risk of submersion.`,
    toolInvoked: "spatial_buffer_intersection(radius_km=2.5, crs='EPSG:4326')",
    evidenceCited: [
      "OSM Road Network Geometry Layer (ID: KL-WY-SH59)",
      "Survey of India 1:25k Drainage Basin Shapefile",
      "KSDMA Critical Infrastructure Asset Register 2024",
    ],
    outputData: {
      exposedPanchayats: ["Meppadi", "Mundakkai", "Chooralmala"],
      criticalInfrastructureAtRisk: ["Chooralmala Bailey Bridge", "Meppadi Substation", "Pump Junction Causeways"],
      vulnerablePopulationCount: 4200,
      safeHighGroundElevations: ">780m MSL",
    },
    confidence: 0.93,
    policyStatus: "PASSED",
    timestamp: new Date(Date.now() - 25000).toISOString(),
  });

  // 4. Logistics Agent
  runs.push({
    agentName: "Logistics Agent",
    agentRole: "Corridor Accessibility & Fuel/Supply Routing",
    reasoningSummary: "Primary route SH-59 compromised at bridge crossing. Calculating alternate feeder corridor via Kalpetta North Bypass. Heavy vehicles restricted; 4x4 high-clearance trucks and boat trailers prioritized.",
    toolInvoked: "routing_engine_hazard_penalty_eval(avoid_closed=true)",
    evidenceCited: [
      "Kerala Police Traffic Advisory Alert #19",
      "PWD Structural Integrity Status Report on Minor Bridges",
    ],
    outputData: {
      primaryRouteStatus: "BLOCKED",
      recommendedAlternateCorridor: "Kalpetta Bypass - Chundale - Meppadi High Ridge Road",
      routeFeasibilityIndex: 0.74,
      travelTimePenaltyMinutes: 42,
    },
    confidence: 0.88,
    policyStatus: "PASSED",
    timestamp: new Date(Date.now() - 20000).toISOString(),
  });

  // 5. Resource Planning Agent
  const boatsNeeded = 6;
  const ndrfShortfall = context.availableNdrfTeams < 2 ? 1 : 0;
  runs.push({
    agentName: "Resource Planning Agent",
    agentRole: "Force Allocation & Deficit Optimization",
    reasoningSummary: `Matching required assets for ${context.district} incident command. Projected rescue demand requires ${boatsNeeded} motorized boat squads and 2 NDRF teams. Available: ${context.availableBoats} boats, ${context.availableNdrfTeams} NDRF teams.`,
    toolInvoked: "resource_min_cost_matching(priority='LIFE_SAFETY')",
    evidenceCited: [
      "Central Inventory Resource Repository (ID: RES-BOAT-01, RES-NDRF-04)",
      "KSDMA Standard Operating Procedure Annexure-IV (Force Ratios)",
    ],
    outputData: {
      allocatedTeams: ["NDRF 4th Battalion Bravo Unit", "Fishermen Rescue Fleet Alpha"],
      identifiedShortfalls: ndrfShortfall > 0 ? ["1 additional NDRF Battalion unit requested from Arakkonam staging hub"] : [],
      recommendedReliefSupplyTonnage: "12 metric tons potable water + 4,000 dry ration packets",
    },
    confidence: 0.92,
    policyStatus: "PASSED",
    timestamp: new Date(Date.now() - 15000).toISOString(),
  });

  // 6. Communications Drafting Agent
  runs.push({
    agentName: "Communications Drafting Agent",
    agentRole: "Bilingual Emergency Messaging Synthesis",
    reasoningSummary: "Drafted bilingual emergency alert advisory in English and Malayalam for civilian population in threatened zones. Highlighted designated high-ground shelters and emergency helpline 1077.",
    toolInvoked: "draft_bilingual_alert_notice(lang=['en', 'ml'])",
    evidenceCited: ["KSDMA Standard Warning Templates (Civil Defense Act 2005)"],
    outputData: {
      draftTitleEn: "Urgent Precautionary Evacuation Notice - High Hazard River Basin",
      draftTitleMl: "അടിയന്തര മുൻകരുതൽ ഒഴിപ്പിക്കൽ മുന്നറിയിപ്പ് - അപകടസാധ്യതയുള്ള തീരപ്രദേശങ്ങൾ",
      channelsSuggested: ["SMS", "NDMA CAP", "Local Radio"],
      requiresAuthorizedApproval: true,
    },
    confidence: 0.95,
    policyStatus: "REQUIRES_SUPERVISOR_APPROVAL",
    timestamp: new Date(Date.now() - 10000).toISOString(),
  });

  // 7. Policy Compliance Agent
  runs.push({
    agentName: "Policy Compliance Agent",
    agentRole: "Statutory Protocol & Authority Gatekeeper",
    reasoningSummary: "CRITICAL SAFETY CHECK: Inspected proposed multi-agent actions. The system is operating in Decision-Support mode. Prohibits autonomous broadcasting of evacuation orders or sirens. Enforcing human-in-the-loop authorization by District Emergency Coordinator or Incident Commander.",
    toolInvoked: "ndma_statutory_compliance_verifier()",
    evidenceCited: [
      "Disaster Management Act 2005 Section 30 & 34",
      "SentinelGrid Safety Principle 1 (Human Accountability)",
    ],
    outputData: {
      complianceStatus: "GATED",
      statutoryPrerequisite: "Requires cryptographic sign-off by INCIDENT_COMMANDER or DISTRICT_COORDINATOR",
      autonomousActionBlocked: true,
    },
    confidence: 1.0,
    policyStatus: "REQUIRES_SUPERVISOR_APPROVAL",
    timestamp: new Date(Date.now() - 5000).toISOString(),
  });

  // 8. Response Review Agent
  runs.push({
    agentName: "Response Review Agent",
    agentRole: "Red-Team Consistency & Assumption Validator",
    reasoningSummary: "Red-team audit completed across all 7 preceding agent proposals. Identified 1 potential blindspot: The primary alternate route has an unverified road section due to the stale PWD telemetry feed. Recommending drone recon before full convoy dispatch.",
    toolInvoked: "plan_cross_consistency_verifier()",
    evidenceCited: [
      "Logistics Agent Alternate Corridor recommendation",
      "Data Quality Agent Warning on SRC-PWD-ROADS",
    ],
    outputData: {
      consistencyScore: 0.94,
      identifiedBlindspots: [
        "Unverified 3.2km stretch on alternate bypass route near Chundale",
      ],
      suggestedMitigation: "Deploy Kerala Police Drone Forensics Lab (RES-DRONE-01) for 15-minute aerial check.",
    },
    confidence: 0.96,
    policyStatus: "PASSED",
    timestamp: new Date().toISOString(),
  });

  const session: MultiAgentSession = {
    sessionId: `SESS-${Date.now().toString(36).toUpperCase()}`,
    incidentOrHazardContext: `${context.hazardType} Incident Operations & Risk Mitigation in ${context.district}`,
    district: context.district,
    status: "AWAITING_HUMAN_APPROVAL",
    agentRuns: runs,
    synthesizedRecommendation: {
      executiveSummary: `Multi-agent consensus confirms severe risk profile for ${context.district} (${context.hazardType}) with composite threat score 0.92/1.0. Emergency response mobilization recommended with drone aerial verification of detour corridors.`,
      recommendedActions: [
        "Enact Stage-2 Precautionary Evacuation for low-lying settlements along river buffer",
        "Deploy RES-DRONE-01 for aerial verification of Chundale-Meppadi alternate detour",
        "Stage 12 OBM Boats and NDRF Bravo unit at Meppadi forward operations depot",
        "Open St. Joseph's Higher Secondary School Relief Camp expansion block",
      ],
      resourceAllocationPlan: [
        "Assign RES-NDRF-04 (45 personnel) to Chooralmala forward staging point",
        "Position RES-BOAT-01 (12 boats) on standby with trailer tractors",
        "Dispatch RES-MED-03 ALS Ambulances (4 units) along North bypass corridor",
      ],
      routeCautions: [
        "SH-59 Bailey bridge area impassable for civilian vehicles",
        "North Bypass has 3.2km unverified segment due to stale PWD telemetry; proceed with lead escort",
      ],
      uncertaintyWarnings: [
        "Subsurface geotechnical saturation data is interpolated (+/- 6% margin)",
        "PWD road telemetry is 45m stale; road condition must be confirmed by drone or wireless patrol",
      ],
      requiredApprovalRole: "INCIDENT_COMMANDER" as UserRole,
    },
  };

  return session;
}
