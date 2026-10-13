export type UserRole =
  | 'PLATFORM_ADMIN'
  | 'ORG_ADMIN'
  | 'STATE_COORDINATOR'
  | 'DISTRICT_COORDINATOR'
  | 'INCIDENT_COMMANDER'
  | 'GIS_ANALYST'
  | 'RISK_ANALYST'
  | 'FIELD_RESPONDER'
  | 'SHELTER_MANAGER'
  | 'MEDICAL_COORDINATOR'
  | 'RELIEF_COORDINATOR'
  | 'AUDITOR'
  | 'PUBLIC_INFO_OFFICER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  district: string;
  avatar?: string;
  phone?: string;
}

export type HazardType =
  | 'FLOOD'
  | 'LANDSLIDE'
  | 'EXTREME_RAINFALL'
  | 'CYCLONE'
  | 'DAM_OVERFLOW'
  | 'COASTAL_INUNDATION';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type IncidentStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'VERIFICATION_REQUIRED'
  | 'VERIFIED'
  | 'OPEN'
  | 'RESPONSE_ASSIGNED'
  | 'IN_PROGRESS'
  | 'MONITORING'
  | 'RESOLVED'
  | 'CLOSED';

export type PriorityLevel = 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW';

export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
  district: string;
  panchayatOrTown?: string;
}

export interface Incident {
  id: string;
  title: string;
  hazardType: HazardType;
  description: string;
  location: GeoLocation;
  severity: RiskLevel;
  priority: PriorityLevel;
  status: IncidentStatus;
  verificationStatus: 'UNVERIFIED' | 'VERIFIED' | 'REJECTED';
  assignedCommander?: string;
  assignedTeamId?: string;
  responsibleOrganization: string;
  affectedPopulationEstimate: number;
  reportedAt: string;
  updatedAt: string;
  timeline: {
    timestamp: string;
    action: string;
    actor: string;
    notes?: string;
  }[];
  resourceNeeds: string[];
  isDemoData?: boolean;
}

export type ReportStatus =
  | 'SUBMITTED'
  | 'AWAITING_VERIFICATION'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'DUPLICATE'
  | 'ESCALATED'
  | 'RESOLVED';

export interface CommunityReport {
  id: string;
  category: 'FLOODED_ROAD' | 'WATER_IN_BUILDING' | 'LANDSLIDE' | 'FALLEN_TREE' | 'INFRASTRUCTURE_DAMAGE' | 'SHELTER_NEEDED' | 'MEDICAL_EMERGENCY' | 'SUPPLY_SHORTAGE';
  title: string;
  description: string;
  location: GeoLocation;
  reporterName?: string;
  isAnonymous: boolean;
  contactPhone?: string;
  urgency: 'ROUTINE' | 'ELEVATED' | 'LIFE_SAFETY_CRITICAL';
  status: ReportStatus;
  aiSuggestedCategory?: string;
  aiDuplicateScore?: number;
  duplicateOfId?: string;
  submittedAt: string;
  photoUrl?: string;
  isDemoData?: boolean;
}

export type ResourceType =
  | 'RESCUE_TEAM'
  | 'BOAT'
  | 'AMBULANCE'
  | 'HIGH_CLEARANCE_TRUCK'
  | 'MEDICAL_SUPPLIES'
  | 'FOOD_RATIONS'
  | 'DRINKING_WATER'
  | 'POWER_GENERATOR'
  | 'SATELLITE_COMMS'
  | 'DRONE_SURVEILLANCE';

export type ResourceStatus =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'ASSIGNED'
  | 'DEPLOYING'
  | 'DEPLOYED'
  | 'UNAVAILABLE'
  | 'MAINTENANCE';

export interface ResourceItem {
  id: string;
  name: string;
  type: ResourceType;
  organization: string;
  status: ResourceStatus;
  capacityOrQuantity: number;
  unit: string;
  location: GeoLocation;
  assignedIncidentId?: string;
  contactPerson: string;
  phone: string;
  lastVerifiedAt: string;
  isDemoData?: boolean;
}

export type FacilityType = 'SHELTER' | 'HOSPITAL' | 'RELIEF_CAMP' | 'FIRE_STATION' | 'EOC_HQ';

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  district: string;
  location: GeoLocation;
  totalCapacity: number;
  currentOccupancy: number;
  availableCapacity: number;
  contactPhone: string;
  operationalStatus: 'OPERATIONAL' | 'NEARING_CAPACITY' | 'FULL' | 'OFFLINE';
  medicalBeds?: number;
  icuAvailable?: number;
  hasPowerBackup: boolean;
  hasCleanWater: boolean;
  lastUpdatedAt: string;
  isDemoData?: boolean;
}

export interface RiverStation {
  id: string;
  name: string;
  river: string;
  district: string;
  lat: number;
  lng: number;
  currentLevelMeters: number;
  warningLevelMeters: number;
  dangerLevelMeters: number;
  trend: 'RISING' | 'FALLING' | 'STABLE';
  lastObservedAt: string;
  flowDischargeCumecs?: number;
}

export interface RainfallStation {
  id: string;
  stationName: string;
  district: string;
  lat: number;
  lng: number;
  rainfallLast1hMm: number;
  rainfallLast24hMm: number;
  cumulative3DayMm: number;
  anomalyPercent: number;
  alertColor: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  lastObservedAt: string;
}

export interface RiskPrediction {
  id: string;
  regionName: string;
  district: string;
  hazardType: HazardType;
  riskScore: number; // 0 to 1
  riskCategory: RiskLevel;
  uncertaintyMargin: number; // e.g. +/- 0.08
  dataCompletenessScore: number; // 0 to 100%
  forecastHorizon: string; // e.g., 'Next 6 Hours'
  modelVersion: string;
  topContributingFeatures: {
    feature: string;
    weight: number;
    value: string;
    impact: 'INCREASING' | 'DECREASING';
  }[];
  limitations: string[];
  recommendedAction: string;
  computedAt: string;
  isDemoData?: boolean;
}

export interface DigitalTwinScenario {
  id: string;
  title: string;
  description: string;
  hazardFocus: HazardType;
  districtFocus: string;
  parameters: {
    rainfallSurgeMm: number;
    riverLevelRiseMeters: number;
    damReleaseCumecs: number;
    simulatedRoadBreaches: number;
    simulatedShelterFailures: number;
  };
  simulatedImpacts: {
    submergedRoadKm: number;
    projectedDisplacedPopulation: number;
    unmetShelterDemand: number;
    highRiskIsolations: number;
    emergencyTeamsShortfall: number;
  };
  cascadingFailures: {
    triggerNode: string;
    affectedNode: string;
    consequence: string;
    severity: RiskLevel;
  }[];
  alternativeResponsePlans: {
    planId: string;
    name: string;
    evacuationRoutingStrategy: string;
    shelterReallocationCost: string;
    avgTravelDistanceKm: number;
    unmetDemandRatio: number;
  }[];
  createdAt: string;
  author: string;
  status: 'DRAFT' | 'SIMULATED' | 'EVALUATED' | 'PROMOTED_TO_OPS';
}

export interface AgentMessage {
  agentName: string;
  agentRole: string;
  reasoningSummary: string;
  toolInvoked?: string;
  evidenceCited: string[];
  outputData: Record<string, unknown>;
  confidence: number;
  policyStatus: 'PASSED' | 'REQUIRES_SUPERVISOR_APPROVAL' | 'FLAGGED';
  timestamp: string;
}

export interface MultiAgentSession {
  sessionId: string;
  incidentOrHazardContext: string;
  district: string;
  status: 'RUNNING' | 'AWAITING_HUMAN_APPROVAL' | 'APPROVED' | 'REJECTED';
  agentRuns: AgentMessage[];
  synthesizedRecommendation: {
    executiveSummary: string;
    recommendedActions: string[];
    resourceAllocationPlan: string[];
    routeCautions: string[];
    uncertaintyWarnings: string[];
    requiredApprovalRole: UserRole;
  };
  humanApprover?: string;
  approvalTimestamp?: string;
  decisionNotes?: string;
}

export interface DataSourceRecord {
  id: string;
  name: string;
  provider: string;
  category: 'WEATHER_RADAR' | 'RIVER_GAUGE' | 'SATELLITE_SAR' | 'ROAD_STATUS' | 'SEISMIC_TERRAIN' | 'OFFICIAL_BULLETIN';
  updateFrequencyMinutes: number;
  lastSuccessfulSync: string;
  isStale: boolean;
  stalenessThresholdMinutes: number;
  dataQualityScore: number;
  status: 'ACTIVE' | 'WARNING_STALE' | 'OFFLINE_ERROR' | 'CONFIGURING';
  credentialsRequired: boolean;
  isSimulatedDemoFeed: boolean;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  titleMalayalam: string;
  hazardType: HazardType;
  district: string;
  severity: RiskLevel;
  publicMessage: string;
  publicMessageMalayalam: string;
  actionGuidance: string[];
  actionGuidanceMalayalam: string[];
  status: 'DRAFT' | 'AWAITING_APPROVAL' | 'APPROVED_DISPATCHED' | 'SUPERSEDED' | 'CANCELLED';
  dispatchedChannels: ('SMS_BROADCAST' | 'CAP_NDMA' | 'PUBLIC_RADIO' | 'OFFICIAL_PORTAL')[];
  sourceEvidence: string[];
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  isDemoData?: boolean;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  organization: string;
  action: string;
  targetType: 'INCIDENT' | 'RESOURCE' | 'SCENARIO' | 'ALERT' | 'MODEL' | 'DATA_SOURCE';
  targetId: string;
  details: string;
  tamperProofHash: string;
  ipAddress?: string;
}
