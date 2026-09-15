import { haversineDistance } from '@/lib/utils';
import { getJurisdictions, getDepartments } from '@/lib/db/queries';

export interface RoutingResult {
  wardNumber: number | null;
  departmentId: string | null;
}

export function routeIncident(lat: number, lng: number, category: string): RoutingResult {
  const jurisdictions = getJurisdictions();
  const departments = getDepartments();
  
  let nearestWard = null;
  let minDistance = Infinity;
  
  for (const j of jurisdictions) {
    if (j.boundaryLat && j.boundaryLng) {
      const dist = haversineDistance(lat, lng, j.boundaryLat, j.boundaryLng);
      if (dist < minDistance) {
        minDistance = dist;
        nearestWard = j.wardNumber;
      }
    }
  }
  
  let targetDepartmentId = null;
  for (const d of departments) {
    try {
      const cats = JSON.parse(d.categories || '[]');
      if (cats.includes(category)) {
        targetDepartmentId = d.id;
        break;
      }
    } catch (e) {
      // ignore
    }
  }
  
  return {
    wardNumber: nearestWard,
    departmentId: targetDepartmentId
  };
}
