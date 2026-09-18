import { NextRequest, NextResponse } from 'next/server';
import { updateIncident, getIncidentById, getIncidentByIncidentId, addStatusHistory, createNotification } from '@/lib/db/queries';
import { escalateIncident } from '@/lib/services/escalation-engine';
import { getCurrentUserId } from '@/lib/auth';
import { persistStore } from '@/lib/db';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    let incident = getIncidentById(params.id) || getIncidentByIncidentId(params.id);
    if (!incident) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    const userId = getCurrentUserId() || 'system';
    
    const escalation = escalateIncident(incident.id, incident.escalationLevel || 0);
    
    const updated = updateIncident(incident.id, { 
      escalationLevel: escalation.level,
    });
    
    addStatusHistory({
      incidentId: incident.id,
      fromStatus: incident.status,
      toStatus: 'authority_notified',
      changedBy: userId,
      note: `Escalated to level ${escalation.level}`
    });
    
    if (incident.departmentId) {
      createNotification({
        userId: incident.departmentId,
        title: 'Incident Escalated',
        message: `Incident ${incident.incidentId} has been escalated to level ${escalation.level}.`,
        read: false,
        createdAt: new Date().toISOString()
      });
    }
    persistStore();
    
    return NextResponse.json({ incident: updated, escalation });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to escalate incident' }, { status: 500 });
  }
}
