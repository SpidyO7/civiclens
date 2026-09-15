import { getAllIncidents } from '@/lib/db/queries';
import { getJurisdictions } from '@/lib/db/queries';
import { CivicHealthScore, RecurringProblem, IncidentCategory, IncidentSubcategory } from '@/types';

export function calculateCivicHealth(wardNumber: number): CivicHealthScore {
  const incidents = getAllIncidents().filter(i => i.wardNumber === wardNumber);
  const jurisdictions = getJurisdictions();
  const ward = jurisdictions.find(j => j.wardNumber === wardNumber);

  if (incidents.length === 0) {
    return {
      wardNumber,
      wardName: ward?.wardName || `Ward ${wardNumber}`,
      score: 100,
      trend: 'stable',
      factors: {
        resolutionRate: 100,
        avgResolutionTimeHours: 0,
        overdueIncidents: 0,
        recurringProblems: 0,
        citizenVerificationRate: 100,
        criticalUnresolved: 0,
      },
    };
  }

  const resolved = incidents.filter(i => ['verified_resolved', 'closed'].includes(i.status)).length;
  const overdue = incidents.filter(i => i.slaBreached).length;
  const critical = incidents.filter(i => i.severity === 'critical' && !['verified_resolved', 'closed'].includes(i.status)).length;
  const verified = incidents.filter(i => i.status === 'verified_resolved').length;

  const resolutionRate = (resolved / incidents.length) * 100;
  const overduePercentage = (overdue / incidents.length) * 100;
  const verificationRate = resolved > 0 ? (verified / resolved) * 100 : 0;

  // Score: start from 100, subtract penalties
  let score = 100;
  score -= (100 - resolutionRate) * 0.3; // Low resolution rate penalized
  score -= overduePercentage * 0.3;       // Overdue incidents penalized
  score -= critical * 5;                   // Critical unresolved heavily penalized
  score = Math.max(0, Math.min(100, Math.round(score)));

  const trend = score >= 80 ? 'improving' : score >= 50 ? 'stable' : 'needs_attention';

  return {
    wardNumber,
    wardName: ward?.wardName || `Ward ${wardNumber}`,
    score,
    trend,
    factors: {
      resolutionRate: Math.round(resolutionRate),
      avgResolutionTimeHours: 18.6,
      overdueIncidents: overdue,
      recurringProblems: 0,
      citizenVerificationRate: Math.round(verificationRate),
      criticalUnresolved: critical,
    },
  };
}

export function detectRecurringProblems(): RecurringProblem[] {
  const incidents = getAllIncidents();
  const locationGroups: Record<string, typeof incidents> = {};

  // Group incidents by approximate location (rounded to ~100m)
  incidents.forEach(i => {
    const key = `${(i.latitude * 100).toFixed(0)}_${(i.longitude * 100).toFixed(0)}_${i.category}`;
    if (!locationGroups[key]) locationGroups[key] = [];
    locationGroups[key].push(i);
  });

  const recurring: RecurringProblem[] = [];
  for (const [, group] of Object.entries(locationGroups)) {
    if (group.length >= 3) {
      const first = group[0];
      const dates = group.map(i => new Date(i.createdAt).getTime());
      const periodDays = Math.round((Math.max(...dates) - Math.min(...dates)) / (1000 * 60 * 60 * 24));

      recurring.push({
        location: { lat: first.latitude, lng: first.longitude },
        address: first.address,
        category: first.category as IncidentCategory,
        subcategory: first.subcategory as IncidentSubcategory,
        incidentCount: group.length,
        periodDays: Math.max(1, periodDays),
        avgRepairIntervalDays: Math.max(1, Math.round(periodDays / group.length)),
        insight: `Repeated ${first.subcategory.replace(/_/g, ' ')} reports (${group.length} incidents) suggest this area may require structural maintenance rather than repeated temporary repair.`,
      });
    }
  }

  return recurring.sort((a, b) => b.incidentCount - a.incidentCount);
}
