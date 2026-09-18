import { NextRequest, NextResponse } from 'next/server';
import { updateIncident, getIncidentById, getIncidentByIncidentId, addStatusHistory, createNotification, createResolution } from '@/lib/db/queries';
import { getCurrentUserId } from '@/lib/auth';
import { persistStore } from '@/lib/db';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    let incident = getIncidentById(params.id) || getIncidentByIncidentId(params.id);
    if (!incident) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    const { imageUrl, note } = await request.json();
    const userId = getCurrentUserId() || 'system';
    
    const resolution = createResolution({
      incidentId: incident.id,
      resolvedBy: userId,
      note,
      imageUrl
    });
    
    addStatusHistory({
      incidentId: incident.id,
      fromStatus: incident.status,
      toStatus: 'awaiting_verification',
      changedBy: userId,
      note: 'Resolved and awaiting citizen verification'
    });
    
    const updated = updateIncident(incident.id, { status: 'awaiting_verification' });
    
    createNotification({
      userId: incident.userId,
      title: 'Incident Resolved - Please Verify',
      message: `Incident ${incident.incidentId} has been resolved. Please verify.`,
      read: false,
      createdAt: new Date().toISOString()
    });
    persistStore();
    
    return NextResponse.json({ resolution, incident: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to resolve incident' }, { status: 500 });
  }
}
