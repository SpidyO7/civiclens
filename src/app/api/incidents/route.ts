import { NextRequest, NextResponse } from 'next/server';
import { getAllIncidents, createIncident, addStatusHistory, createNotification } from '@/lib/db/queries';
import { routeIncident } from '@/lib/services/routing-engine';
import { calculateSlaDeadline } from '@/lib/services/sla-engine';
import { getCurrentUserId } from '@/lib/auth';
import { generateIncidentId } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters = {
      category: searchParams.get('category') || undefined,
      severity: searchParams.get('severity') || undefined,
      status: searchParams.get('status') || undefined,
      departmentId: searchParams.get('departmentId') || undefined,
      wardNumber: searchParams.get('wardNumber') ? parseInt(searchParams.get('wardNumber')!) : undefined,
      userId: searchParams.get('userId') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
    };
    
    const incidents = getAllIncidents(filters);
    return NextResponse.json(incidents);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch incidents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, subcategory, description, latitude, longitude, address, imageUrl, severity, aiConfidence, aiCategory, aiSubcategory } = body;
    
    const incidentId = generateIncidentId();
    const routingInfo = routeIncident(latitude, longitude, category);
    const slaDeadline = calculateSlaDeadline(category, severity, new Date());
    const userId = getCurrentUserId();
    
    const newIncident = createIncident({
      incidentId,
      category,
      subcategory,
      description,
      latitude,
      longitude,
      address,
      imageUrl,
      severity,
      aiConfidence,
      aiCategory,
      aiSubcategory,
      departmentId: routingInfo.departmentId,
      jurisdictionId: routingInfo.jurisdictionId,
      wardNumber: routingInfo.wardNumber,
      slaDeadline,
      status: 'authority_notified',
      reportedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    const statuses = ['reported', 'location_verified', 'classified', 'authority_identified', 'forwarded', 'authority_notified'];
    statuses.forEach(status => {
      addStatusHistory({
        incidentId: newIncident.id,
        fromStatus: 'reported',
        toStatus: status as any,
        changedBy: 'system',
      });
    });
    
    createNotification({
      userId: routingInfo.departmentId,
      title: 'New Incident Assigned',
      message: `Incident ${incidentId} has been assigned to your department.`,
      read: false,
      createdAt: new Date()
    });
    
    return NextResponse.json({ ...newIncident, routingInfo });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create incident' }, { status: 500 });
  }
}
