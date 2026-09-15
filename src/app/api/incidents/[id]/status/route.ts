import { NextRequest, NextResponse } from 'next/server';
import { updateIncident, getIncidentById, getIncidentByIncidentId, addStatusHistory, createNotification } from '@/lib/db/queries';
import { getCurrentUserId } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    let incident = getIncidentById(params.id) || getIncidentByIncidentId(params.id);
    if (!incident) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    const { status, note } = await request.json();
    const userId = getCurrentUserId() || 'system';
    
    addStatusHistory({
      incidentId: incident.id,
      fromStatus: incident.status,
      toStatus: status,
      changedBy: userId,
      note
    });
    
    const updated = updateIncident(incident.id, { status, updatedAt: new Date() });
    
    if (status === 'awaiting_verification') {
      createNotification({
        userId: incident.reportedBy,
        title: 'Verification Required',
        message: `Incident ${incident.incidentId} requires your verification.`,
        read: false,
        createdAt: new Date()
      });
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
