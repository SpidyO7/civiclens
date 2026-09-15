import { getStore } from './index';
import { Incident, User, Department, Jurisdiction, StatusHistoryEntry, Escalation, Resolution, Verification, Notification, SlaRule, EscalationRule } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export function getAllIncidents(filters?: {
  category?: string;
  severity?: string;
  status?: string;
  departmentId?: string;
  wardNumber?: number;
  userId?: string;
  limit?: number;
  offset?: number;
}): Incident[] {
  let incidents = [...getStore().incidents];
  if (filters) {
    if (filters.status) {
      incidents = incidents.filter(i => i.status === filters.status);
    }
    if (filters.category) {
      incidents = incidents.filter(i => i.category === filters.category);
    }
    if (filters.severity) {
      incidents = incidents.filter(i => i.severity === filters.severity);
    }
    if (filters.departmentId) {
      incidents = incidents.filter(i => i.departmentId === filters.departmentId);
    }
    if (filters.wardNumber) {
      incidents = incidents.filter(i => i.wardNumber === filters.wardNumber);
    }
    if (filters.userId) {
      incidents = incidents.filter(i => i.userId === filters.userId);
    }
    if (filters.limit) {
      const offset = filters.offset || 0;
      incidents = incidents.slice(offset, offset + filters.limit);
    }
  }
  // Sort by urgency: overdue/critical first, then by creation date
  incidents.sort((a, b) => {
    if (a.slaBreached && !b.slaBreached) return -1;
    if (!a.slaBreached && b.slaBreached) return 1;
    if (a.severity === 'critical' && b.severity !== 'critical') return -1;
    if (a.severity !== 'critical' && b.severity === 'critical') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  return incidents;
}

export function getIncidentById(id: string): Incident | undefined {
  return getStore().incidents.find(i => i.id === id);
}

export function getIncidentByIncidentId(incidentId: string): Incident | undefined {
  return getStore().incidents.find(i => i.incidentId === incidentId);
}

export function createIncident(data: Partial<Incident>): Incident {
  const store = getStore();
  const now = new Date().toISOString();

  const incident: Incident = {
    id: data.id || uuidv4(),
    incidentId: data.incidentId || `CL-${Math.floor(10000 + Math.random() * 90000)}`,
    userId: data.userId || '',
    category: data.category || 'other',
    subcategory: data.subcategory || 'other',
    description: data.description || '',
    latitude: data.latitude || 0,
    longitude: data.longitude || 0,
    address: data.address || '',
    wardNumber: data.wardNumber,
    municipality: data.municipality || '',
    imageUrl: data.imageUrl || '',
    severity: data.severity || 'low',
    status: data.status || 'reported',
    supportCount: data.supportCount || 1,
    departmentId: data.departmentId,
    assignedToId: data.assignedToId,
    slaDeadline: data.slaDeadline,
    slaBreached: data.slaBreached ?? false,
    escalationLevel: data.escalationLevel || 0,
    aiConfidence: data.aiConfidence,
    aiCategory: data.aiCategory,
    aiSubcategory: data.aiSubcategory,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
  };

  store.incidents.push(incident);
  return incident;
}

export function updateIncident(id: string, data: Partial<Incident>): Incident | undefined {
  const store = getStore();
  const index = store.incidents.findIndex(i => i.id === id);
  if (index === -1) return undefined;

  const updated = { ...store.incidents[index], ...data, updatedAt: new Date().toISOString() };
  store.incidents[index] = updated;
  return updated;
}

export function getStatusHistory(incidentId: string): StatusHistoryEntry[] {
  return getStore().status_history
    .filter(s => s.incidentId === incidentId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function addStatusHistory(data: Partial<StatusHistoryEntry>): StatusHistoryEntry {
  const store = getStore();
  const now = new Date().toISOString();
  const entry: StatusHistoryEntry = {
    id: data.id || uuidv4(),
    incidentId: data.incidentId!,
    fromStatus: data.fromStatus ?? null,
    toStatus: data.toStatus!,
    changedBy: data.changedBy || 'system',
    note: data.note,
    createdAt: data.createdAt || now,
  };
  store.status_history.push(entry);
  return entry;
}

export function getEscalations(incidentId: string): Escalation[] {
  return getStore().escalations.filter(e => e.incidentId === incidentId);
}

export function createEscalation(data: Partial<Escalation>): Escalation {
  const store = getStore();
  const now = new Date().toISOString();
  const escalation: Escalation = {
    id: data.id || uuidv4(),
    incidentId: data.incidentId!,
    level: data.level!,
    escalatedTo: data.escalatedTo!,
    reason: data.reason!,
    escalatedAt: data.escalatedAt || now,
    resolvedAt: data.resolvedAt,
  };
  store.escalations.push(escalation);
  return escalation;
}

export function createResolution(data: Partial<Resolution>): Resolution {
  const store = getStore();
  const now = new Date().toISOString();
  const resolution: Resolution = {
    id: data.id || uuidv4(),
    incidentId: data.incidentId!,
    resolvedBy: data.resolvedBy!,
    imageUrl: data.imageUrl,
    note: data.note || '',
    createdAt: data.createdAt || now,
  };
  store.resolutions.push(resolution);
  return resolution;
}

export function getResolutions(incidentId: string): Resolution[] {
  return getStore().resolutions
    .filter(r => r.incidentId === incidentId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createVerification(data: Partial<Verification>): Verification {
  const store = getStore();
  const now = new Date().toISOString();
  const verification: Verification = {
    id: data.id || uuidv4(),
    incidentId: data.incidentId!,
    userId: data.userId!,
    verified: data.verified!,
    comment: data.comment,
    createdAt: data.createdAt || now,
  };
  store.verifications.push(verification);
  return verification;
}

export function getVerifications(incidentId: string): Verification[] {
  return getStore().verifications.filter(v => v.incidentId === incidentId);
}

export function addIncidentSupport(incidentId: string, userId: string): boolean {
  const store = getStore();
  const existing = store.incident_support.find(s => s.incidentId === incidentId && s.userId === userId);
  if (!existing) {
    store.incident_support.push({
      id: uuidv4(),
      incidentId,
      userId,
      createdAt: new Date().toISOString(),
    });
    const incident = store.incidents.find(i => i.id === incidentId);
    if (incident) {
      incident.supportCount = (incident.supportCount || 0) + 1;
    }
    return true;
  }
  return false;
}

export function getNotifications(userId: string): Notification[] {
  return getStore().notifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createNotification(data: Partial<Notification>): Notification {
  const store = getStore();
  const now = new Date().toISOString();
  const notification: Notification = {
    id: data.id || uuidv4(),
    userId: data.userId!,
    incidentId: data.incidentId,
    type: data.type!,
    title: data.title!,
    message: data.message!,
    read: false,
    createdAt: data.createdAt || now,
  };
  store.notifications.push(notification);
  return notification;
}

export function markNotificationRead(id: string): void {
  const store = getStore();
  const notif = store.notifications.find(n => n.id === id);
  if (notif) {
    notif.read = true;
  }
}

export function getDepartments(): Department[] {
  return [...getStore().departments];
}

export function getDepartmentById(id: string): Department | undefined {
  return getStore().departments.find(d => d.id === id);
}

export function getJurisdictions(): Jurisdiction[] {
  return [...getStore().jurisdictions];
}

export function getSlaRules(): SlaRule[] {
  return [...getStore().sla_rules];
}

export function getEscalationRules(): EscalationRule[] {
  return [...getStore().escalation_rules];
}

export function getUserById(id: string): User | undefined {
  return getStore().users.find(u => u.id === id);
}

export function getUsersByRole(role: string): User[] {
  return getStore().users.filter(u => u.role === role);
}

export function createUser(data: Partial<User>): User {
  const store = getStore();
  const now = new Date().toISOString();
  const user: User = {
    id: data.id || uuidv4(),
    name: data.name!,
    email: data.email!,
    phone: data.phone,
    role: data.role!,
    departmentId: data.departmentId,
    avatarUrl: data.avatarUrl,
    createdAt: data.createdAt || now,
  };
  store.users.push(user);
  return user;
}

export function updateUser(id: string, data: Partial<User>): void {
  const store = getStore();
  const index = store.users.findIndex(u => u.id === id);
  if (index !== -1) {
    store.users[index] = { ...store.users[index], ...data };
  }
}

export function getDashboardStats() {
  const store = getStore();
  const incidents = store.incidents;
  const total = incidents.length;
  const active = incidents.filter(i => !['verified_resolved', 'closed'].includes(i.status)).length;
  const critical = incidents.filter(i => i.severity === 'critical').length;
  const overdue = incidents.filter(i => i.slaBreached).length;
  const inProgress = incidents.filter(i => i.status === 'in_progress').length;
  const resolved = incidents.filter(i => ['verified_resolved', 'closed'].includes(i.status)).length;
  const verified = incidents.filter(i => i.status === 'verified_resolved').length;

  return {
    totalReports: total,
    activeIncidents: active,
    criticalIncidents: critical,
    overdueIncidents: overdue,
    inProgressIncidents: inProgress,
    resolvedIncidents: resolved,
    citizenVerified: verified,
    avgResponseTimeHours: 4.2,
    avgResolutionTimeHours: 18.6,
    slaComplianceRate: 94.2,
    escalationRate: 3.8,
  };
}

export function getIncidentsByCategory() {
  const store = getStore();
  const counts: Record<string, number> = {};
  store.incidents.forEach(i => {
    counts[i.category] = (counts[i.category] || 0) + 1;
  });
  const total = store.incidents.length || 1;
  return Object.entries(counts).map(([category, count]) => ({
    category,
    count,
    percentage: Math.round((count / total) * 100),
  }));
}

export function getIncidentsByWard() {
  const store = getStore();
  const counts: Record<number, { count: number; overdue: number }> = {};
  store.incidents.forEach(i => {
    if (i.wardNumber != null) {
      if (!counts[i.wardNumber]) counts[i.wardNumber] = { count: 0, overdue: 0 };
      counts[i.wardNumber].count++;
      if (i.slaBreached) counts[i.wardNumber].overdue++;
    }
  });
  const jurisdictions = store.jurisdictions;
  return Object.entries(counts).map(([wardStr, data]) => {
    const wn = parseInt(wardStr, 10);
    const j = jurisdictions.find(j => j.wardNumber === wn);
    return {
      wardNumber: wn,
      wardName: j?.wardName || `Ward ${wn}`,
      count: data.count,
      overdueCount: data.overdue,
      healthScore: Math.max(0, 100 - data.overdue * 15),
    };
  });
}
