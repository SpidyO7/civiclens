import { User, Department, Jurisdiction, Incident, IncidentEvidence, IncidentSupport, StatusHistory, Escalation, Resolution, Verification, Notification, SLARule, EscalationRule } from '@/types';

class DataStore {
  users: User[] = [];
  departments: Department[] = [];
  jurisdictions: Jurisdiction[] = [];
  incidents: Incident[] = [];
  incident_evidence: IncidentEvidence[] = [];
  incident_support: IncidentSupport[] = [];
  status_history: StatusHistory[] = [];
  escalations: Escalation[] = [];
  resolutions: Resolution[] = [];
  verifications: Verification[] = [];
  notifications: Notification[] = [];
  sla_rules: SLARule[] = [];
  escalation_rules: EscalationRule[] = [];

  clear() {
    this.users = [];
    this.departments = [];
    this.jurisdictions = [];
    this.incidents = [];
    this.incident_evidence = [];
    this.incident_support = [];
    this.status_history = [];
    this.escalations = [];
    this.resolutions = [];
    this.verifications = [];
    this.notifications = [];
    this.sla_rules = [];
    this.escalation_rules = [];
  }
}

let store: DataStore | null = null;

export function getStore(): DataStore {
  if (!store) {
    store = new DataStore();
  }
  return store;
}

export function initializeDb() {
  getStore(); // Just initializes the in-memory store
}
