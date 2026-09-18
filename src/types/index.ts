// CivicLens — Core Type Definitions

export type UserRole = 'citizen' | 'authority' | 'admin';

export type IncidentCategory = 'road' | 'water' | 'waste' | 'electricity' | 'public_safety' | 'other';

export type IncidentSubcategory =
  | 'pothole' | 'damaged_road' | 'damaged_footpath'
  | 'water_leakage' | 'waterlogging' | 'overflowing_drain'
  | 'garbage_accumulation' | 'illegal_dumping'
  | 'broken_streetlight' | 'damaged_electrical'
  | 'open_manhole' | 'fallen_tree' | 'damaged_traffic_sign'
  | 'other';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type IncidentStatus =
  | 'reported'
  | 'location_verified'
  | 'classified'
  | 'authority_identified'
  | 'forwarded'
  | 'authority_notified'
  | 'acknowledged'
  | 'inspection'
  | 'in_progress'
  | 'repair_completed'
  | 'awaiting_verification'
  | 'verified_resolved'
  | 'verification_failed'
  | 'reopened'
  | 'closed';

export type SlaStatus = 'on_track' | 'approaching' | 'breached';
export type EscalationStatus = 'active' | 'resolved';

export type EscalationLevel = 1 | 2 | 3 | 4;

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  departmentId?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  headName: string;
  headEmail: string;
  categories: IncidentCategory[];
}

export interface Jurisdiction {
  id: string;
  wardNumber: number;
  wardName: string;
  municipality: string;
  city: string;
  state: string;
  boundaryLat: number;
  boundaryLng: number;
  boundaryRadius: number; // km
}

export interface Incident {
  id: string;
  incidentId: string; // CL-XXXXX
  userId: string;
  category: IncidentCategory;
  subcategory: IncidentSubcategory;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  wardNumber?: number;
  municipality?: string;
  imageUrl: string;
  severity: Severity;
  status: IncidentStatus;
  supportCount: number;
  departmentId?: string;
  assignedToId?: string;
  slaDeadline?: string;
  slaBreached: boolean;
  escalationLevel: EscalationLevel | 0;
  aiConfidence?: number;
  aiCategory?: IncidentCategory;
  aiSubcategory?: IncidentSubcategory;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentSupport {
  id: string;
  incidentId: string;
  userId: string;
  createdAt: string;
}

export interface IncidentEvidence {
  id: string;
  incidentId: string;
  imageUrl: string;
  type: 'report' | 'inspection' | 'resolution' | 'verification';
  uploadedBy: string;
  note?: string;
  createdAt: string;
}

export interface StatusHistoryEntry {
  id: string;
  incidentId: string;
  fromStatus: IncidentStatus | null;
  toStatus: IncidentStatus;
  changedBy: string;
  note?: string;
  createdAt: string;
}

export interface Escalation {
  id: string;
  incidentId: string;
  level: EscalationLevel;
  escalatedTo: string;
  reason: string;
  status: EscalationStatus;
  escalatedAt: string;
  resolvedAt?: string;
}

export type StatusHistory = StatusHistoryEntry;
export type SLARule = SlaRule;

export interface Resolution {
  id: string;
  incidentId: string;
  resolvedBy: string;
  imageUrl?: string;
  note: string;
  createdAt: string;
}

export interface Verification {
  id: string;
  incidentId: string;
  userId: string;
  verified: boolean;
  comment?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  incidentId?: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export type NotificationType =
  | 'report_created'
  | 'authority_assigned'
  | 'authority_acknowledged'
  | 'status_changed'
  | 'sla_approaching'
  | 'sla_breached'
  | 'escalation'
  | 'resolution_submitted'
  | 'verification_required'
  | 'incident_reopened';

export interface SlaRule {
  id: string;
  category: IncidentCategory;
  severity: Severity;
  durationHours: number;
}

export interface EscalationRule {
  id: string;
  level: EscalationLevel;
  title: string;
  description: string;
  triggerAfterHours: number;
}

// Service interfaces
export interface ClassificationResult {
  category: IncidentCategory;
  subcategory: IncidentSubcategory;
  confidence: number;
  suggestedSeverity: Severity;
  suggestedDescription: string;
}

export interface RoutingResult {
  wardNumber: number;
  wardName: string;
  municipality: string;
  department: Department;
  responsibleAuthority: string;
}

export interface DuplicateCandidate {
  incident: Incident;
  similarityScore: number;
  distance: number; // meters
}

export interface CivicHealthScore {
  wardNumber: number;
  wardName: string;
  score: number; // 0-100
  trend: 'improving' | 'stable' | 'needs_attention';
  factors: {
    resolutionRate: number;
    avgResolutionTimeHours: number;
    overdueIncidents: number;
    recurringProblems: number;
    citizenVerificationRate: number;
    criticalUnresolved: number;
  };
}

export interface RecurringProblem {
  location: { lat: number; lng: number };
  address: string;
  category: IncidentCategory;
  subcategory: IncidentSubcategory;
  incidentCount: number;
  periodDays: number;
  avgRepairIntervalDays: number;
  insight: string;
}

export interface EscalationPackage {
  incidentId: string;
  originalPhoto: string;
  gps: { lat: number; lng: number };
  timestamp: string;
  category: IncidentCategory;
  subcategory: IncidentSubcategory;
  severity: Severity;
  description: string;
  supportCount: number;
  assignedDepartment: string;
  slaDeadline: string;
  timeOverdue: string;
  remindersSent: number;
  statusHistory: StatusHistoryEntry[];
  escalationLevel: EscalationLevel;
}

// Analytics types
export interface DashboardStats {
  activeIncidents: number;
  criticalIncidents: number;
  overdueIncidents: number;
  inProgressIncidents: number;
  resolvedIncidents: number;
  citizenVerified: number;
  totalReports: number;
  avgResponseTimeHours: number;
  avgResolutionTimeHours: number;
  slaComplianceRate: number;
  escalationRate: number;
}

export interface CategoryBreakdown {
  category: IncidentCategory;
  count: number;
  percentage: number;
}

export interface WardBreakdown {
  wardNumber: number;
  wardName: string;
  count: number;
  overdueCount: number;
  healthScore: number;
}
