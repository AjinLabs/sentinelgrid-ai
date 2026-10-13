import { calculateHaversineDistance } from "./geo-utils";

export interface DemandNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  displacedPopulation: number;
  hazardRisk: number; // 0 to 1
}

export interface ShelterNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  totalCapacity: number;
  currentOccupancy: number;
  isAccessible: boolean;
}

export interface AllocationResult {
  allocations: {
    demandNodeId: string;
    demandNodeName: string;
    shelterId: string;
    shelterName: string;
    peopleAssigned: number;
    distanceKm: number;
    transportMode: string;
  }[];
  totalEvacuees: number;
  totalAllocated: number;
  unmetDemand: number;
  averageDistanceKm: number;
  maxDistanceKm: number;
  bottlenecksIdentified: string[];
}

/**
 * Solves multi-criteria evacuation demand and shelter matching using a greedy min-distance cost solver with capacity constraints
 */
export function optimizeShelterAllocation(
  demandNodes: DemandNode[],
  shelterNodes: ShelterNode[],
  options: { preferHighCapacity?: boolean; maxEvacDistanceKm?: number } = {}
): AllocationResult {
  const maxDistance = options.maxEvacDistanceKm || 35;
  const remainingShelterCapacity = new Map<string, number>();

  shelterNodes.forEach((s) => {
    remainingShelterCapacity.set(
      s.id,
      Math.max(0, s.totalCapacity - s.currentOccupancy)
    );
  });

  const allocations: AllocationResult["allocations"] = [];
  let totalEvacuees = 0;
  let totalAllocated = 0;
  let totalDistanceWeight = 0;
  let maxDist = 0;
  const bottlenecks: string[] = [];

  // Sort demand by highest hazard risk first
  const sortedDemands = [...demandNodes].sort((a, b) => b.hazardRisk - a.hazardRisk);

  for (const demand of sortedDemands) {
    totalEvacuees += demand.displacedPopulation;
    let peopleToAssign = demand.displacedPopulation;

    // Find closest available shelters
    const candidates = shelterNodes
      .map((s) => {
        const dist = calculateHaversineDistance(demand.lat, demand.lng, s.lat, s.lng);
        const avail = remainingShelterCapacity.get(s.id) || 0;
        return { shelter: s, dist, avail };
      })
      .filter((c) => c.dist <= maxDistance && c.avail > 0)
      .sort((a, b) => a.dist - b.dist);

    for (const cand of candidates) {
      if (peopleToAssign <= 0) break;

      const assignCount = Math.min(peopleToAssign, cand.avail);
      if (assignCount > 0) {
        allocations.push({
          demandNodeId: demand.id,
          demandNodeName: demand.name,
          shelterId: cand.shelter.id,
          shelterName: cand.shelter.name,
          peopleAssigned: assignCount,
          distanceKm: cand.dist,
          transportMode: cand.dist > 15 ? "KSRTC Emergency Shuttle" : "Local Relief Vans",
        });

        peopleToAssign -= assignCount;
        totalAllocated += assignCount;
        totalDistanceWeight += assignCount * cand.dist;
        if (cand.dist > maxDist) maxDist = cand.dist;
        remainingShelterCapacity.set(cand.shelter.id, cand.avail - assignCount);
      }
    }

    if (peopleToAssign > 0) {
      bottlenecks.push(
        `Critical Deficit: ${peopleToAssign} residents from ${demand.name} cannot be accommodated within ${maxDistance}km radius. Shelter expansion required.`
      );
    }
  }

  const unmetDemand = Math.max(0, totalEvacuees - totalAllocated);
  const avgDistanceKm = totalAllocated > 0 ? parseFloat((totalDistanceWeight / totalAllocated).toFixed(2)) : 0;

  return {
    allocations,
    totalEvacuees,
    totalAllocated,
    unmetDemand,
    averageDistanceKm: avgDistanceKm,
    maxDistanceKm: maxDist,
    bottlenecksIdentified: bottlenecks,
  };
}
