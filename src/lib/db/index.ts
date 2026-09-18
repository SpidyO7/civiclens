import { User, Department, Jurisdiction, Incident, IncidentEvidence, IncidentSupport, StatusHistory, Escalation, Resolution, Verification, Notification, SLARule, EscalationRule } from '@/types';
import fs from 'fs';
import path from 'path';

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
let demoSeedInProgress = false;
let storeLoaded = false;

function getStorePath(): string {
  const configuredPath = process.env.DATABASE_URL || './civiclens.db';
  return path.resolve(process.cwd(), configuredPath.replace(/^file:/, ''));
}

function loadStore(dataStore: DataStore) {
  if (storeLoaded) return;
  storeLoaded = true;

  const storePath = getStorePath();
  if (!fs.existsSync(storePath)) return;

  try {
    const saved = JSON.parse(fs.readFileSync(storePath, 'utf8')) as Partial<DataStore>;
    Object.assign(dataStore, saved);
  } catch (error) {
    console.warn('CivicLens datastore could not be loaded; starting empty.', error);
  }
}

export function persistStore() {
  if (!store) return;
  const storePath = getStorePath();
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
}

export function getStore(): DataStore {
  if (!store) {
    store = new DataStore();
  }
  loadStore(store);
  if (!demoSeedInProgress && process.env.NEXT_PUBLIC_DEMO_MODE !== 'false' && store.incidents.length === 0) {
    demoSeedInProgress = true;
    try {
      const { seed } = require('./seed') as typeof import('./seed');
      seed();
    } finally {
      demoSeedInProgress = false;
    }
  }
  return store;
}

export function beginSeed() {
  demoSeedInProgress = true;
}

export function endSeed() {
  demoSeedInProgress = false;
  persistStore();
}

export function initializeDb() {
  getStore();
}
