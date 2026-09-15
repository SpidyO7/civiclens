import { NextRequest, NextResponse } from 'next/server';
import { getIncidentById, getIncidentByIncidentId, getStatusHistory, getEscalations, getResolutions, getVerifications, getDepartmentById, updateIncident } from '@/lib/db/queries';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    let incident = getIncidentById(params.id);
    if (!incident) {
      incident = getIncidentByIncidentId(params.id);
    }
    
    if (!incident) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    const statusHistory = getStatusHistory(incident.id);
    const escalations = getEscalations(incident.id);
    const resolutions = getResolutions(incident.id);
    const verifications = getVerifications(incident.id);
    const department = incident.departmentId ? getDepartmentById(incident.departmentId) : undefined;
    
    return NextResponse.json({
      ...incident,
      statusHistory,
      escalations,
      resolutions,
      verifications,
      department
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch incident' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    let incident = getIncidentById(params.id) || getIncidentByIncidentId(params.id);
    if (!incident) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    const body = await request.json();
    const updated = updateIncident(incident.id, body);
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update incident' }, { status: 500 });
  }
}
