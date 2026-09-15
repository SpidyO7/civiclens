import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats, getIncidentsByCategory, getIncidentsByWard } from '@/lib/db/queries';
import { calculateCivicHealth, detectRecurringProblems } from '@/lib/services/civic-health';

export async function GET(request: NextRequest) {
  try {
    const stats = getDashboardStats();
    const byCategory = getIncidentsByCategory();
    const byWard = getIncidentsByWard();
    
    const wardNumbers = [1, 2, 3];
    const civicHealthScores = await Promise.all(wardNumbers.map(w => calculateCivicHealth(w)));
    const recurringProblems = await detectRecurringProblems();
    
    return NextResponse.json({
      stats,
      byCategory,
      byWard,
      civicHealthScores,
      recurringProblems
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
