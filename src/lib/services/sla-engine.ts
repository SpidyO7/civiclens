import { Incident } from '@/types';
import { updateIncident, createNotification } from '@/lib/db/queries';

export function calculateSlaDeadline(category: string, severity: string, createdAt: Date): Date {
  let hours = 48; // default
  
  if (severity === 'critical' || category === 'public_safety') {
    hours = 6;
  } else if (severity === 'high' && category === 'water') {
    hours = 24;
  } else if (severity === 'high' && category === 'road') {
    hours = 48;
  } else if (severity === 'medium') {
    hours = 48;
  } else if (severity === 'low') {
    hours = 72;
  }
  
  return new Date(createdAt.getTime() + hours * 60 * 60 * 1000);
}

export function getSlaRemaining(slaDeadline: string | Date): { hours: number, minutes: number, isBreached: boolean, percentage: number } {
  const now = new Date();
  const deadline = new Date(slaDeadline);
  
  const diffMs = deadline.getTime() - now.getTime();
  const isBreached = diffMs < 0;
  
  const absDiff = Math.abs(diffMs);
  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    hours,
    minutes,
    isBreached,
    percentage: isBreached ? 100 : Math.min(100, Math.max(0, 100 - (diffMs / (48 * 60 * 60 * 1000)) * 100))
  };
}

export function checkAndEscalate(incident: Incident): void {
  if (!incident.slaDeadline) return;
  const { isBreached } = getSlaRemaining(incident.slaDeadline);
  
  if (isBreached && !incident.slaBreached) {
    updateIncident(incident.id, { slaBreached: 1, status: 'overdue' });
    
    if (incident.userId) {
      createNotification({
        userId: incident.userId,
        incidentId: incident.id,
        type: 'SLA_BREACH',
        title: 'SLA Breached',
        message: \`Incident \${incident.incidentId} has breached its SLA.\`
      });
    }
  }
}
