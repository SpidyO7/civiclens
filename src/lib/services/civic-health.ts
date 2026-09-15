import { getAllIncidents } from '@/lib/db/queries';

export interface CivicHealthScore {
  wardNumber: number;
  score: number;
  resolutionRate: number;
  overduePercentage: number;
}

export interface RecurringProblem {
  category: string;
  count: number;
  wardNumber: number;
}

export function calculateCivicHealth(wardNumber: number): CivicHealthScore {
  const incidents = getAllIncidents().filter(i => i.wardNumber === wardNumber);
  if (incidents.length === 0) {
    return { wardNumber, score: 100, resolutionRate: 100, overduePercentage: 0 };
  }
  
  const resolved = incidents.filter(i => ['verified_resolved', 'closed'].includes(i.status)).length;
  const overdue = incidents.filter(i => i.slaBreached).length;
  
  const resolutionRate = (resolved / incidents.length) * 100;
  const overduePercentage = (overdue / incidents.length) * 100;
  
  const score = Math.max(0, Math.min(100, resolutionRate - (overduePercentage * 0.5)));
  
  return {
    wardNumber,
    score,
    resolutionRate,
    overduePercentage
  };
}

export function detectRecurringProblems(): RecurringProblem[] {
  const incidents = getAllIncidents();
  const problems: Record<string, number> = {};
  
  incidents.forEach(i => {
    const key = \`\${i.wardNumber}-\${i.category}\`;
    problems[key] = (problems[key] || 0) + 1;
  });
  
  const recurring: RecurringProblem[] = [];
  for (const [key, count] of Object.entries(problems)) {
    if (count >= 3) {
      const [wardStr, category] = key.split('-');
      recurring.push({
        wardNumber: parseInt(wardStr, 10),
        category,
        count
      });
    }
  }
  
  return recurring;
}
