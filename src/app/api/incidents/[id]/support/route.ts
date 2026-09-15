import { NextRequest, NextResponse } from 'next/server';
import { addIncidentSupport, getIncidentById, getIncidentByIncidentId } from '@/lib/db/queries';
import { getCurrentUserId } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    let incident = getIncidentById(params.id) || getIncidentByIncidentId(params.id);
    if (!incident) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    const userId = getCurrentUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    addIncidentSupport(incident.id, userId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add support' }, { status: 500 });
  }
}
