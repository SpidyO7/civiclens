import { NextRequest, NextResponse } from 'next/server';
import { updateIncident, getIncidentById, getIncidentByIncidentId, addStatusHistory, createNotification } from '@/lib/db/queries';
import { getCurrentUserId } from '@/lib/auth';
import { IncidentStatus } from '@/types';
import { persistStore } from '@/lib/db';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    let incident = getIncidentById(params.id) || getIncidentByIncidentId(params.id);
    if (!incident) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    const { status, note } = await request.json() as { status: IncidentStatus; note?: string };
    const userId = getCurrentUserId() || 'system';
    
    addStatusHistory({
      incidentId: incident.id,
      fromStatus: incident.status,
      toStatus: status,
      changedBy: userId,
      note
    });
    
    const updated = updateIncident(incident.id, { status });
    
    if (status === 'awaiting_verification') {
      createNotification({
        userId: incident.userId,
        title: 'Verification Required',
        message: `Incident ${incident.incidentId} requires your verification.`,
        read: false,
        createdAt: new Date().toISOString()
      });
    }
    persistStore();
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
