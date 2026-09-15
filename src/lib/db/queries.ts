import { getStore } from './index';
import { Incident, User, Department, Jurisdiction, StatusHistory, Escalation, Resolution, Verification, Notification, SLARule, EscalationRule } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export function getAllIncidents(filters?: any): Incident[] {
  let incidents = getStore().incidents;
  if (filters) {
    if (filters.status) {
      incidents = incidents.filter(i => i.status === filters.status);
    }
    if (filters.category) {
      incidents = incidents.filter(i => i.category === filters.category);
    }
  }
  return [...incidents];
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
    incidentId: data.incidentId || \`INC-\${Date.now()}\`,
    userId: data.userId || null,
    category: data.category || '',
    subcategory: data.subcategory || '',
    description: data.description || '',
    latitude: data.latitude || 0,
    longitude: data.longitude || 0,
    address: data.address || '',
    wardNumber: data.wardNumber || null,
    municipality: data.municipality || '',
    imageUrl: data.imageUrl || null,
    severity: (data.severity as any) || 'low',
    status: (data.status as any) || 'reported',
    supportCount: data.supportCount || 1,
    departmentId: data.departmentId || null,
    assignedToId: data.assignedToId || null,
    slaDeadline: data.slaDeadline || null,
    slaBreached: data.slaBreached || 0,
    escalationLevel: data.escalationLevel || 0,
    aiConfidence: data.aiConfidence || null,
    aiCategory: data.aiCategory || null,
    aiSubcategory: data.aiSubcategory || null,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
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

export function getStatusHistory(incidentId: string): StatusHistory[] {
  return getStore().status_history.filter(s => s.incidentId === incidentId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addStatusHistory(data: Partial<StatusHistory>) {
  const store = getStore();
  const now = new Date().toISOString();
  store.status_history.push({
    id: data.id || uuidv4(),
    incidentId: data.incidentId!,
    fromStatus: data.fromStatus as any,
    toStatus: data.toStatus as any,
    changedBy: data.changedBy!,
    note: data.note || null,
    createdAt: data.createdAt || now
  });
}

export function getEscalations(incidentId: string): Escalation[] {
  return getStore().escalations.filter(e => e.incidentId === incidentId);
}

export function createEscalation(data: Partial<Escalation>) {
  const store = getStore();
  const now = new Date().toISOString();
  store.escalations.push({
    id: data.id || uuidv4(),
    incidentId: data.incidentId!,
    level: data.level!,
    escalatedTo: data.escalatedTo!,
    reason: data.reason!,
    escalatedAt: data.escalatedAt || now,
    resolvedAt: data.resolvedAt || null
  });
}

export function createResolution(data: Partial<Resolution>) {
  const store = getStore();
  const now = new Date().toISOString();
  store.resolutions.push({
    id: data.id || uuidv4(),
    incidentId: data.incidentId!,
    resolvedBy: data.resolvedBy!,
    imageUrl: data.imageUrl || null,
    note: data.note || null,
    createdAt: data.createdAt || now
  });
}

export function getResolutions(incidentId: string): Resolution[] {
  return getStore().resolutions.filter(r => r.incidentId === incidentId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createVerification(data: Partial<Verification>) {
  const store = getStore();
  const now = new Date().toISOString();
  store.verifications.push({
    id: data.id || uuidv4(),
    incidentId: data.incidentId!,
    userId: data.userId!,
    verified: data.verified!,
    comment: data.comment || null,
    createdAt: data.createdAt || now
  });
}

export function getVerifications(incidentId: string): Verification[] {
  return getStore().verifications.filter(v => v.incidentId === incidentId);
}

export function addIncidentSupport(incidentId: string, userId: string) {
  const store = getStore();
  const existing = store.incident_support.find(s => s.incidentId === incidentId && s.userId === userId);
  if (!existing) {
    store.incident_support.push({
      id: uuidv4(),
      incidentId,
      userId,
      createdAt: new Date().toISOString()
    });
    const incident = store.incidents.find(i => i.id === incidentId);
    if (incident) {
      incident.supportCount = (incident.supportCount || 0) + 1;
    }
  }
}

export function getNotifications(userId: string): Notification[] {
  return getStore().notifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createNotification(data: Partial<Notification>) {
  const store = getStore();
  const now = new Date().toISOString();
  store.notifications.push({
    id: data.id || uuidv4(),
    userId: data.userId!,
    incidentId: data.incidentId!,
    type: data.type as any,
    title: data.title!,
    message: data.message!,
    read: 0,
    createdAt: data.createdAt || now
  });
}

export function markNotificationRead(id: string) {
  const store = getStore();
  const notif = store.notifications.find(n => n.id === id);
  if (notif) {
    notif.read = 1;
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

export function getSlaRules(): SLARule[] {
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
    phone: data.phone || null,
    role: data.role as any,
    departmentId: data.departmentId || null,
    avatarUrl: data.avatarUrl || null,
    createdAt: data.createdAt || now
  };
  store.users.push(user);
  return user;
}

export function updateUser(id: string, data: Partial<User>) {
  const store = getStore();
  const index = store.users.findIndex(u => u.id === id);
  if (index !== -1) {
    store.users[index] = { ...store.users[index], ...data };
  }
}

export function getDashboardStats() {
  const store = getStore();
  const total = store.incidents.length;
  const resolved = store.incidents.filter(i => i.status === 'verified_resolved' || i.status === 'closed').length;
  const open = store.incidents.filter(i => i.status !== 'verified_resolved' && i.status !== 'closed' && i.status !== 'rejected').length;
  
  return {
    total,
    resolved,
    open
  };
}

export function getIncidentsByCategory() {
  const store = getStore();
  const counts: Record<string, number> = {};
  store.incidents.forEach(i => {
    counts[i.category] = (counts[i.category] || 0) + 1;
  });
  return Object.entries(counts).map(([category, count]) => ({ category, count }));
}

export function getIncidentsByWard() {
  const store = getStore();
  const counts: Record<number, number> = {};
  store.incidents.forEach(i => {
    if (i.wardNumber != null) {
      counts[i.wardNumber] = (counts[i.wardNumber] || 0) + 1;
    }
  });
  return Object.entries(counts).map(([wardNumber, count]) => ({ wardNumber: parseInt(wardNumber, 10), count }));
}
