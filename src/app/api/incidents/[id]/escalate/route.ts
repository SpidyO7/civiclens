import { NextRequest, NextResponse } from 'next/server';
import { updateIncident, getIncidentById, getIncidentByIncidentId, addStatusHistory, createNotification } from '@/lib/db/queries';
import { escalateIncident } from '@/lib/services/escalation-engine';
import { getCurrentUserId } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    let incident = getIncidentById(params.id) || getIncidentByIncidentId(params.id);
    if (!incident) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    const userId = getCurrentUserId() || 'system';
    
    const escalation = escalateIncident(incident.id, incident.escalationLevel || 0);
    
    const updated = updateIncident(incident.id, { 
      escalationLevel: escalation.escalationLevel, 
      status: 'escalated',
      updatedAt: new Date() 
    });
    
    addStatusHistory({
      incidentId: incident.id,
      fromStatus: incident.status,
      toStatus: 'escalated',
      changedBy: userId,
      note: `Escalated to level ${escalation.escalationLevel}`
    });
    
    if (escalation.notifiedUserId) {
      createNotification({
        userId: escalation.notifiedUserId,
        title: 'Incident Escalated',
        message: `Incident ${incident.incidentId} has been escalated to level ${escalation.escalationLevel}.`,
        read: false,
        createdAt: new Date()
      });
    }
    
    return NextResponse.json({ incident: updated, escalation });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to escalate incident' }, { status: 500 });
  }
}
