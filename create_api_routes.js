const fs = require('fs');
const path = require('path');
const root = 'C:\\\\Users\\\\sneha\\\\.gemini\\\\antigravity\\\\scratch\\\\CivicLens\\\\src';
const files = {
  'app/api/incidents/route.ts': `import { NextRequest, NextResponse } from 'next/server';
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
      message: \`Incident \${incidentId} has been assigned to your department.\`,
      read: false,
      createdAt: new Date()
    });
    
    return NextResponse.json({ ...newIncident, routingInfo });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create incident' }, { status: 500 });
  }
}
`,
  'app/api/incidents/[id]/route.ts': `import { NextRequest, NextResponse } from 'next/server';
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
`,
  'app/api/incidents/[id]/support/route.ts': `import { NextRequest, NextResponse } from 'next/server';
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
`,
  'app/api/incidents/[id]/status/route.ts': `import { NextRequest, NextResponse } from 'next/server';
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
        message: \`Incident \${incident.incidentId} requires your verification.\`,
        read: false,
        createdAt: new Date()
      });
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
`,
  'app/api/incidents/[id]/resolve/route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { updateIncident, getIncidentById, getIncidentByIncidentId, addStatusHistory, createNotification, createResolution } from '@/lib/db/queries';
import { getCurrentUserId } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    let incident = getIncidentById(params.id) || getIncidentByIncidentId(params.id);
    if (!incident) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    const { imageUrl, note } = await request.json();
    const userId = getCurrentUserId() || 'system';
    
    const resolution = createResolution({
      incidentId: incident.id,
      resolvedBy: userId,
      resolutionNote: note,
      imageUrl,
      resolvedAt: new Date()
    });
    
    addStatusHistory({
      incidentId: incident.id,
      fromStatus: incident.status,
      toStatus: 'awaiting_verification',
      changedBy: userId,
      note: 'Resolved and awaiting citizen verification'
    });
    
    const updated = updateIncident(incident.id, { status: 'awaiting_verification', updatedAt: new Date() });
    
    createNotification({
      userId: incident.reportedBy,
      title: 'Incident Resolved - Please Verify',
      message: \`Incident \${incident.incidentId} has been resolved. Please verify.\`,
      read: false,
      createdAt: new Date()
    });
    
    return NextResponse.json({ resolution, incident: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to resolve incident' }, { status: 500 });
  }
}
`,
  'app/api/incidents/[id]/verify/route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { updateIncident, getIncidentById, getIncidentByIncidentId, addStatusHistory, createNotification, createVerification } from '@/lib/db/queries';
import { getCurrentUserId } from '@/lib/auth';

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
    
    const newStatus = verified ? 'verified_resolved' : 'reopened';
    const transitionStatus = verified ? undefined : 'verification_failed';
    
    if (transitionStatus) {
      addStatusHistory({
        incidentId: incident.id,
        fromStatus: incident.status,
        toStatus: transitionStatus as any,
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
    
    const updated = updateIncident(incident.id, { status: newStatus, updatedAt: new Date() });
    
    if (incident.departmentId) {
       createNotification({
         userId: incident.departmentId,
         title: verified ? 'Verification Successful' : 'Verification Failed',
         message: \`Incident \${incident.incidentId} verification \${verified ? 'successful' : 'failed'}.\`,
         read: false,
         createdAt: new Date()
       });
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify incident' }, { status: 500 });
  }
}
`,
  'app/api/incidents/[id]/escalate/route.ts': `import { NextRequest, NextResponse } from 'next/server';
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
      note: \`Escalated to level \${escalation.escalationLevel}\`
    });
    
    if (escalation.notifiedUserId) {
      createNotification({
        userId: escalation.notifiedUserId,
        title: 'Incident Escalated',
        message: \`Incident \${incident.incidentId} has been escalated to level \${escalation.escalationLevel}.\`,
        read: false,
        createdAt: new Date()
      });
    }
    
    return NextResponse.json({ incident: updated, escalation });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to escalate incident' }, { status: 500 });
  }
}
`,
  'app/api/incidents/[id]/assign/route.ts': `import { NextRequest, NextResponse } from 'next/server';
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
        message: \`Incident \${incident.incidentId} has been assigned to you.\`,
        read: false,
        createdAt: new Date()
      });
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to assign incident' }, { status: 500 });
  }
}
`,
  'app/api/classify/route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { classifyImage } from '@/lib/services/ai-classifier';

export async function POST(request: NextRequest) {
  try {
    const { imageDataUrl } = await request.json();
    const result = await classifyImage(imageDataUrl);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to classify image' }, { status: 500 });
  }
}
`,
  'app/api/classify/describe/route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { generateDescription } from '@/lib/services/ai-classifier';

export async function POST(request: NextRequest) {
  try {
    const { category, subcategory, severity } = await request.json();
    const description = await generateDescription(category, subcategory, severity);
    return NextResponse.json({ description });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 });
  }
}
`,
  'app/api/duplicates/route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { findDuplicates } from '@/lib/services/duplicate-detector';

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude, category, subcategory } = await request.json();
    const duplicates = await findDuplicates(latitude, longitude, category, subcategory);
    return NextResponse.json(duplicates);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to find duplicates' }, { status: 500 });
  }
}
`,
  'app/api/notifications/route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { getNotifications, markNotificationRead } from '@/lib/db/queries';
import { getCurrentUserId } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const userId = getCurrentUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const notifications = getNotifications(userId);
    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get notifications' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id } = await request.json();
    markNotificationRead(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to mark read' }, { status: 500 });
  }
}
`,
  'app/api/analytics/route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats, getIncidentsByCategory, getIncidentsByWard } from '@/lib/db/queries';
import { calculateCivicHealth, detectRecurringProblems } from '@/lib/services/civic-health';

export async function GET(request: NextRequest) {
  try {
    const stats = getDashboardStats();
    const byCategory = getIncidentsByCategory();
    const byWard = getIncidentsByWard();
    
    const wardNumbers = [1, 2, 3];
    const civicHealthScores = await Promise.all(wardNumbers.map(w => calculateCivicHealth(w)));
    const recurringProblems = await detectRecurringProblems();
    
    return NextResponse.json({
      stats,
      byCategory,
      byWard,
      civicHealthScores,
      recurringProblems
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
`,
  'app/api/auth/switch-role/route.ts': `import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { role } = await request.json();
    const validRoles = ['citizen', 'authority', 'admin'];
    
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    
    const response = NextResponse.json({ role, userId: \`mock-\${role}-id\` });
    response.cookies.set('civiclens-role', role, { path: '/' });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to switch role' }, { status: 500 });
  }
}
`,
  'app/api/seed/route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { seed } from '@/lib/db/seed';

export async function POST(request: NextRequest) {
  try {
    await seed();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to seed db' }, { status: 500 });
  }
}
`,
  'app/api/geocode/route.ts': `import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    
    if (!lat || !lng) return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
    
    return NextResponse.json({
      address: '123 Civic Street, Downtown Area',
      wardNumber: 2,
      wardName: 'Downtown',
      municipality: 'Metro City'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Geocoding failed' }, { status: 500 });
  }
}
`,
  'app/api/upload/route.ts': `import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let fileName = \`upload-\${Date.now()}.jpg\`;
    let buffer: Buffer;
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
      
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      fileName = \`upload-\${Date.now()}-\${file.name}\`;
    } else {
      const { dataUrl } = await request.json();
      if (!dataUrl) return NextResponse.json({ error: 'No dataUrl' }, { status: 400 });
      
      const base64Data = dataUrl.replace(/^data:image\\/\\w+;base64,/, '');
      buffer = Buffer.from(base64Data, 'base64');
    }
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);
    
    return NextResponse.json({ url: \`/uploads/\${fileName}\` });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
`
};

Object.keys(files).forEach(relPath => {
  const fullPath = path.join(root, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, files[relPath]);
});
console.log('Done');
