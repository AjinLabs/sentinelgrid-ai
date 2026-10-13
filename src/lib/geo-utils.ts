import { GeoLocation } from "@/types/disaster";

/**
 * Computes Great-Circle distance between two points in kilometers using Haversine formula
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

/**
 * Checks if a point lies within a polygon using the Jordan curve ray-casting algorithm
 */
export function isPointInPolygon(
  point: [number, number], // [lat, lng]
  polygon: [number, number][]
): boolean {
  const x = point[1]; // lng
  const y = point[0]; // lat
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][1];
    const yi = polygon[i][0];
    const xj = polygon[j][1];
    const yj = polygon[j][0];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Calculates spatio-temporal and category similarity between two community reports for duplicate detection
 * Returns a score between 0.0 (unrelated) and 1.0 (definite duplicate)
 */
export function calculateDuplicateScore(
  rep1: { location: GeoLocation; submittedAt: string; category: string; description: string },
  rep2: { location: GeoLocation; submittedAt: string; category: string; description: string }
): number {
  // 1. Distance score (within 1.5km is very suspicious)
  const distKm = calculateHaversineDistance(
    rep1.location.lat,
    rep1.location.lng,
    rep2.location.lat,
    rep2.location.lng
  );
  let distScore = 0;
  if (distKm <= 0.3) distScore = 1.0;
  else if (distKm <= 1.0) distScore = 0.75;
  else if (distKm <= 2.5) distScore = 0.4;
  else distScore = 0.0;

  // 2. Time score (within 3 hours is very relevant)
  const t1 = new Date(rep1.submittedAt).getTime();
  const t2 = new Date(rep2.submittedAt).getTime();
  const diffHours = Math.abs(t1 - t2) / (1000 * 60 * 60);
  let timeScore = 0;
  if (diffHours <= 1.0) timeScore = 1.0;
  else if (diffHours <= 3.0) timeScore = 0.8;
  else if (diffHours <= 6.0) timeScore = 0.5;
  else timeScore = 0.1;

  // 3. Category match
  const categoryScore = rep1.category === rep2.category ? 1.0 : 0.2;

  // 4. Text token Jaccard similarity
  const words1 = new Set(rep1.description.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/));
  const words2 = new Set(rep2.description.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/));
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  const textScore = union.size > 0 ? intersection.size / union.size : 0;

  // Weighted composite score
  const totalScore = distScore * 0.45 + timeScore * 0.25 + categoryScore * 0.15 + textScore * 0.15;
  return parseFloat(totalScore.toFixed(3));
}

/**
 * Generates an approximated circular buffer as a list of coordinates
 */
export function generateBufferCoordinates(
  centerLat: number,
  centerLng: number,
  radiusKm: number,
  points: number = 32
): [number, number][] {
  const coords: [number, number][] = [];
  const earthRadius = 6371;

  for (let i = 0; i < points; i++) {
    const angle = (i * 2 * Math.PI) / points;
    const dLat = (radiusKm / earthRadius) * (180 / Math.PI) * Math.cos(angle);
    const dLng =
      ((radiusKm / earthRadius) * (180 / Math.PI) * Math.sin(angle)) /
      Math.cos((centerLat * Math.PI) / 180);
    coords.push([centerLat + dLat, centerLng + dLng]);
  }
  return coords;
}
