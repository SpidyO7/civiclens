import { NextRequest, NextResponse } from 'next/server';
import { updateIncident, getIncidentById, getIncidentByIncidentId, addStatusHistory, createNotification } from '@/lib/db/queries';
import { getCurrentUserId } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    let incident = getIncidentById(params.id) || getIncidentByIncidentId(params.id);
    if (!incident) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    const { departmentId, assignedToId } = await request.json();
    const userId = getCurrentUserId() || 'system';
    
    const updated = updateIncident(incident.id, { 
      departmentId: departmentId || incident.departmentId,
      assignedTo: assignedToId || incident.assignedTo,
      updatedAt: new Date() 
    });
    
    addStatusHistory({
      incidentId: incident.id,
      fromStatus: incident.status,
      toStatus: incident.status,
      changedBy: userId,
      note: 'Reassigned'
    });
    
    if (assignedToId) {
      createNotification({
        userId: assignedToId,
        title: 'Incident Assigned',
        message: `Incident ${incident.incidentId} has been assigned to you.`,
        read: false,
        createdAt: new Date()
      });
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to assign incident' }, { status: 500 });
  }
}
