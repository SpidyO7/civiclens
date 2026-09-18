import { NextRequest, NextResponse } from 'next/server';
import { updateIncident, getIncidentById, getIncidentByIncidentId, addStatusHistory, createNotification, createVerification } from '@/lib/db/queries';
import { getCurrentUserId } from '@/lib/auth';
import { IncidentStatus } from '@/types';
import { persistStore } from '@/lib/db';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    let incident = getIncidentById(params.id) || getIncidentByIncidentId(params.id);
    if (!incident) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    const { verified, comment } = await request.json();
    const userId = getCurrentUserId() || 'system';
    
    createVerification({
      incidentId: incident.id,
      userId,
      verified,
      comment
    });
    
    const newStatus: IncidentStatus = verified ? 'verified_resolved' : 'reopened';
    const transitionStatus: IncidentStatus | undefined = verified ? undefined : 'verification_failed';
    
    if (transitionStatus) {
      addStatusHistory({
        incidentId: incident.id,
        fromStatus: incident.status,
        toStatus: transitionStatus,
        changedBy: userId,
        note: comment
      });
    }
    
    addStatusHistory({
      incidentId: incident.id,
      fromStatus: transitionStatus || incident.status,
      toStatus: newStatus,
      changedBy: userId,
      note: comment
    });
    
    const updated = updateIncident(incident.id, { status: newStatus });
    
    if (incident.departmentId) {
       createNotification({
         userId: incident.departmentId,
         title: verified ? 'Verification Successful' : 'Verification Failed',
         message: `Incident ${incident.incidentId} verification ${verified ? 'successful' : 'failed'}.`,
         read: false,
         createdAt: new Date().toISOString()
       });
    }
    persistStore();
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify incident' }, { status: 500 });
  }
}
