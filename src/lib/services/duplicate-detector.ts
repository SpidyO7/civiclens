import { Incident } from '@/types';
import { getAllIncidents } from '@/lib/db/queries';
import { haversineDistance } from '@/lib/utils';

export interface DuplicateCandidate {
  incident: Incident;
  similarityScore: number;
}

export function findDuplicates(lat: number, lng: number, category: string, subcategory: string): DuplicateCandidate[] {
  const activeIncidents = getAllIncidents().filter(i => !['verified_resolved', 'closed', 'rejected'].includes(i.status));
  const candidates: DuplicateCandidate[] = [];
  
  for (const incident of activeIncidents) {
    if (incident.category === category) {
      const distance = haversineDistance(lat, lng, incident.latitude, incident.longitude);
      // within 200m
      if (distance <= 0.2) {
        let score = 0.5; // base for same category and close distance
        if (incident.subcategory === subcategory) score += 0.3;
        if (distance <= 0.05) score += 0.2; // very close
        
        candidates.push({
          incident,
          similarityScore: score
        });
      }
    }
  }
  
  return candidates.sort((a, b) => b.similarityScore - a.similarityScore);
}
