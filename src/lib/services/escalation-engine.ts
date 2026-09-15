import { Escalation, EscalationRule } from '@/types';
import { getEscalationRules, createEscalation, updateIncident } from '@/lib/db/queries';
import { v4 as uuidv4 } from 'uuid';

export interface EscalationPackage {
  incidentId: string;
  currentLevel: number;
  history: Escalation[];
}

export function escalateIncident(incidentId: string, currentLevel: number): Escalation {
  const newLevel = currentLevel + 1;
  const escalation: Escalation = {
    id: uuidv4(),
    incidentId,
    level: newLevel,
    escalatedTo: \`Level \${newLevel} Authority\`,
    reason: \`SLA Breached for level \${currentLevel}\`,
    escalatedAt: new Date().toISOString()
  };
  
  createEscalation(escalation);
  updateIncident(incidentId, { escalationLevel: newLevel });
  return escalation;
}

export function getEscalationPackage(incidentId: string): EscalationPackage {
  // Mock implementation since history would usually be pulled from db
  return {
    incidentId,
    currentLevel: 1,
    history: []
  };
}

export function getEscalationHierarchy(): EscalationRule[] {
  return [
    { id: '1', level: 1, title: 'Assigned department', description: '0h after SLA breach', triggerAfterHours: 0 },
    { id: '2', level: 2, title: 'Department supervisor', description: '12h after breach', triggerAfterHours: 12 },
    { id: '3', level: 3, title: 'Municipal senior authority', description: '24h after breach', triggerAfterHours: 24 },
    { id: '4', level: 4, title: 'Official grievance channel', description: '48h after breach', triggerAfterHours: 48 },
  ];
}
