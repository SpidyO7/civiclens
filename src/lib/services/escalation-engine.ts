import { Escalation, EscalationRule, EscalationPackage, StatusHistoryEntry } from '@/types';
import { getEscalationRules, createEscalation, updateIncident, getIncidentById, getStatusHistory, getDepartmentById } from '@/lib/db/queries';
import { getSlaRemaining } from './sla-engine';
import { v4 as uuidv4 } from 'uuid';

const ESCALATION_TARGETS = [
  'Assigned Department Head',
  'Department Supervisor',
  'Municipal Commissioner (Senior)',
  'Official Grievance Redressal Channel',
];

export function escalateIncident(incidentId: string, currentLevel: number): Escalation {
  const newLevel = Math.min(currentLevel + 1, 4);
  const target = ESCALATION_TARGETS[newLevel - 1] || `Level ${newLevel} Authority`;

  const escalation: Escalation = {
    id: uuidv4(),
    incidentId,
    level: newLevel as 1 | 2 | 3 | 4,
    escalatedTo: target,
    reason: `SLA breach — incident unresolved at escalation level ${currentLevel}. Auto-escalated to level ${newLevel}.`,
    escalatedAt: new Date().toISOString(),
  };

  createEscalation(escalation);
  updateIncident(incidentId, { escalationLevel: newLevel as 0 | 1 | 2 | 3 | 4 });
  return escalation;
}

export function getEscalationPackage(incidentId: string): EscalationPackage | null {
  const incident = getIncidentById(incidentId);
  if (!incident) return null;

  const statusHistory = getStatusHistory(incidentId);
  const department = incident.departmentId ? getDepartmentById(incident.departmentId) : undefined;

  let timeOverdue = 'N/A';
  if (incident.slaDeadline) {
    const sla = getSlaRemaining(incident.slaDeadline);
    if (sla.isBreached) {
      timeOverdue = `${sla.hours}h ${sla.minutes}m overdue`;
    }
  }

  return {
    incidentId: incident.incidentId,
    originalPhoto: incident.imageUrl,
    gps: { lat: incident.latitude, lng: incident.longitude },
    timestamp: incident.createdAt,
    category: incident.category,
    subcategory: incident.subcategory,
    severity: incident.severity,
    description: incident.description,
    supportCount: incident.supportCount,
    assignedDepartment: department?.name || 'Unassigned',
    slaDeadline: incident.slaDeadline || '',
    timeOverdue,
    remindersSent: incident.escalationLevel,
    statusHistory,
    escalationLevel: (incident.escalationLevel || 1) as 1 | 2 | 3 | 4,
  };
}

export function getEscalationHierarchy(): EscalationRule[] {
  return [
    { id: '1', level: 1, title: 'Assigned Department', description: 'Immediate notification to the responsible department head upon SLA breach', triggerAfterHours: 0 },
    { id: '2', level: 2, title: 'Department Supervisor', description: 'Escalation to department supervisor if no action within 12 hours of breach', triggerAfterHours: 12 },
    { id: '3', level: 3, title: 'Municipal Senior Authority', description: 'Escalation to senior municipal authority if unresolved 24 hours after breach', triggerAfterHours: 24 },
    { id: '4', level: 4, title: 'Official Grievance Channel', description: 'Final escalation to official grievance redressal mechanism after 48 hours', triggerAfterHours: 48 },
  ];
}
