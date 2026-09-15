import { initializeDb, getStore } from './index';
import { v4 as uuidv4 } from 'uuid';
import { Incident } from '@/types';

export function seed() {
  const store = getStore();
  store.clear();

  const now = new Date().toISOString();

  // Departments
  const deps = [
    { id: uuidv4(), name: 'Road Division', code: 'RD', description: 'Roads', headName: 'A', headEmail: 'a@a.com', categories: JSON.stringify(['road']) },
    { id: uuidv4(), name: 'Water Department', code: 'WD', description: 'Water', headName: 'B', headEmail: 'b@b.com', categories: JSON.stringify(['water']) },
    { id: uuidv4(), name: 'Sanitation Division', code: 'SD', description: 'Sanitation', headName: 'C', headEmail: 'c@c.com', categories: JSON.stringify(['sanitation']) },
    { id: uuidv4(), name: 'Electrical Division', code: 'ED', description: 'Electrical', headName: 'D', headEmail: 'd@d.com', categories: JSON.stringify(['electrical']) },
    { id: uuidv4(), name: 'Public Safety', code: 'PS', description: 'Safety', headName: 'E', headEmail: 'e@e.com', categories: JSON.stringify(['public_safety']) }
  ];
  store.departments.push(...(deps as any));

  // Users
  const users = [
    { id: 'citizen-1', name: 'Demo Citizen', email: 'citizen@demo.com', phone: '1234567890', role: 'citizen', departmentId: null, avatarUrl: '', createdAt: now },
    { id: 'authority-1', name: 'Demo Authority', email: 'authority@demo.com', phone: '0987654321', role: 'authority', departmentId: deps[0].id, avatarUrl: '', createdAt: now },
    { id: 'admin-1', name: 'Demo Admin', email: 'admin@demo.com', phone: '1111111111', role: 'admin', departmentId: null, avatarUrl: '', createdAt: now }
  ];
  store.users.push(...(users as any));

  // Wards around Mumbai
  const wards = [
    { id: uuidv4(), wardNumber: 1, wardName: 'Colaba', municipality: 'BMC', city: 'Mumbai', state: 'MH', boundaryLat: 18.9067, boundaryLng: 72.8147, boundaryRadius: 2000 },
    { id: uuidv4(), wardNumber: 2, wardName: 'Bandra', municipality: 'BMC', city: 'Mumbai', state: 'MH', boundaryLat: 19.0596, boundaryLng: 72.8295, boundaryRadius: 2500 },
    { id: uuidv4(), wardNumber: 3, wardName: 'Andheri', municipality: 'BMC', city: 'Mumbai', state: 'MH', boundaryLat: 19.1136, boundaryLng: 72.8697, boundaryRadius: 3000 },
    { id: uuidv4(), wardNumber: 4, wardName: 'Kurla', municipality: 'BMC', city: 'Mumbai', state: 'MH', boundaryLat: 19.0728, boundaryLng: 72.8826, boundaryRadius: 2000 },
    { id: uuidv4(), wardNumber: 5, wardName: 'Dadar', municipality: 'BMC', city: 'Mumbai', state: 'MH', boundaryLat: 19.0178, boundaryLng: 72.8478, boundaryRadius: 1500 }
  ];
  store.jurisdictions.push(...(wards as any));

  // SLA Rules & Escalation Rules
  const escalationRules = [
    { id: uuidv4(), level: 1, title: 'Assigned department', description: '0h after SLA breach', triggerAfterHours: 0 },
    { id: uuidv4(), level: 2, title: 'Department supervisor', description: '12h after breach', triggerAfterHours: 12 },
    { id: uuidv4(), level: 3, title: 'Municipal senior authority', description: '24h after breach', triggerAfterHours: 24 },
    { id: uuidv4(), level: 4, title: 'Official grievance channel', description: '48h after breach', triggerAfterHours: 48 },
  ];
  store.escalation_rules.push(...(escalationRules as any));

  const pastDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
  
  const incidents: Partial<Incident>[] = [
    { id: uuidv4(), incidentId: 'INC-001', userId: 'citizen-1', category: 'road', subcategory: 'pothole', description: 'Large pothole', latitude: 19.076, longitude: 72.877, address: 'Main St', wardNumber: 4, municipality: 'BMC', imageUrl: null, severity: 'high', status: 'reported', supportCount: 27, departmentId: deps[0].id, assignedToId: null, slaDeadline: new Date(Date.now() + 48*3600*1000).toISOString(), slaBreached: 0, escalationLevel: 0, aiConfidence: 0.9, aiCategory: 'road', aiSubcategory: 'pothole', createdAt: now, updatedAt: now },
    { id: uuidv4(), incidentId: 'INC-002', userId: 'citizen-1', category: 'sanitation', subcategory: 'garbage', description: 'Garbage dump', latitude: 19.077, longitude: 72.878, address: 'Cross Rd', wardNumber: 4, municipality: 'BMC', imageUrl: null, severity: 'low', status: 'forwarded', supportCount: 5, departmentId: deps[2].id, assignedToId: null, slaDeadline: new Date(Date.now() + 72*3600*1000).toISOString(), slaBreached: 0, escalationLevel: 0, aiConfidence: 0.85, aiCategory: 'sanitation', aiSubcategory: 'garbage', createdAt: now, updatedAt: now },
    { id: uuidv4(), incidentId: 'INC-003', userId: 'citizen-1', category: 'electrical', subcategory: 'streetlight', description: 'Broken streetlight', latitude: 19.075, longitude: 72.879, address: 'Park Ave', wardNumber: 4, municipality: 'BMC', imageUrl: null, severity: 'low', status: 'overdue', supportCount: 2, departmentId: deps[3].id, assignedToId: null, slaDeadline: pastDate, slaBreached: 1, escalationLevel: 1, aiConfidence: 0.88, aiCategory: 'electrical', aiSubcategory: 'streetlight', createdAt: pastDate, updatedAt: pastDate },
    { id: uuidv4(), incidentId: 'INC-004', userId: 'citizen-1', category: 'public_safety', subcategory: 'manhole', description: 'Open manhole', latitude: 19.078, longitude: 72.876, address: 'Market St', wardNumber: 4, municipality: 'BMC', imageUrl: null, severity: 'critical', status: 'escalated', supportCount: 15, departmentId: deps[4].id, assignedToId: null, slaDeadline: pastDate, slaBreached: 1, escalationLevel: 2, aiConfidence: 0.95, aiCategory: 'public_safety', aiSubcategory: 'manhole', createdAt: pastDate, updatedAt: pastDate },
    { id: uuidv4(), incidentId: 'INC-005', userId: 'citizen-1', category: 'water', subcategory: 'leakage', description: 'Water pipeline burst', latitude: 19.079, longitude: 72.871, address: 'Link Rd', wardNumber: 4, municipality: 'BMC', imageUrl: null, severity: 'high', status: 'in_progress', supportCount: 10, departmentId: deps[1].id, assignedToId: null, slaDeadline: new Date(Date.now() + 10*3600*1000).toISOString(), slaBreached: 0, escalationLevel: 0, aiConfidence: 0.92, aiCategory: 'water', aiSubcategory: 'leakage', createdAt: now, updatedAt: now },
    { id: uuidv4(), incidentId: 'INC-006', userId: 'citizen-1', category: 'road', subcategory: 'waterlogging', description: 'Heavy waterlogging', latitude: 19.080, longitude: 72.880, address: 'MG Rd', wardNumber: 4, municipality: 'BMC', imageUrl: null, severity: 'medium', status: 'acknowledged', supportCount: 8, departmentId: deps[0].id, assignedToId: null, slaDeadline: new Date(Date.now() + 40*3600*1000).toISOString(), slaBreached: 0, escalationLevel: 0, aiConfidence: 0.87, aiCategory: 'road', aiSubcategory: 'waterlogging', createdAt: now, updatedAt: now },
    { id: uuidv4(), incidentId: 'INC-007', userId: 'citizen-1', category: 'road', subcategory: 'damaged_footpath', description: 'Damaged footpath', latitude: 19.071, longitude: 72.872, address: 'S V Rd', wardNumber: 4, municipality: 'BMC', imageUrl: null, severity: 'low', status: 'repair_completed', supportCount: 3, departmentId: deps[0].id, assignedToId: null, slaDeadline: new Date(Date.now() + 20*3600*1000).toISOString(), slaBreached: 0, escalationLevel: 0, aiConfidence: 0.91, aiCategory: 'road', aiSubcategory: 'damaged_footpath', createdAt: now, updatedAt: now },
    { id: uuidv4(), incidentId: 'INC-008', userId: 'citizen-1', category: 'sanitation', subcategory: 'illegal_dumping', description: 'Illegal dumping', latitude: 19.085, longitude: 72.875, address: 'Hill Rd', wardNumber: 4, municipality: 'BMC', imageUrl: null, severity: 'medium', status: 'verified_resolved', supportCount: 12, departmentId: deps[2].id, assignedToId: null, slaDeadline: new Date(Date.now() + 12*3600*1000).toISOString(), slaBreached: 0, escalationLevel: 0, aiConfidence: 0.89, aiCategory: 'sanitation', aiSubcategory: 'illegal_dumping', createdAt: pastDate, updatedAt: pastDate },
    { id: uuidv4(), incidentId: 'INC-009', userId: 'citizen-1', category: 'road', subcategory: 'damaged_sign', description: 'Damaged traffic sign', latitude: 19.090, longitude: 72.880, address: 'LBS Marg', wardNumber: 4, municipality: 'BMC', imageUrl: null, severity: 'low', status: 'reopened', supportCount: 4, departmentId: deps[0].id, assignedToId: null, slaDeadline: new Date(Date.now() + 48*3600*1000).toISOString(), slaBreached: 0, escalationLevel: 0, aiConfidence: 0.82, aiCategory: 'road', aiSubcategory: 'damaged_sign', createdAt: now, updatedAt: now },
    { id: uuidv4(), incidentId: 'INC-010', userId: 'citizen-1', category: 'water', subcategory: 'drain', description: 'Overflowing drain', latitude: 19.074, longitude: 72.885, address: 'Station Rd', wardNumber: 4, municipality: 'BMC', imageUrl: null, severity: 'medium', status: 'reported', supportCount: 1, departmentId: deps[1].id, assignedToId: null, slaDeadline: new Date(Date.now() + 48*3600*1000).toISOString(), slaBreached: 0, escalationLevel: 0, aiConfidence: 0.86, aiCategory: 'water', aiSubcategory: 'drain', createdAt: now, updatedAt: now },
    { id: uuidv4(), incidentId: 'INC-011', userId: 'citizen-1', category: 'public_safety', subcategory: 'tree', description: 'Fallen tree on road', latitude: 19.070, longitude: 72.870, address: 'Carter Rd', wardNumber: 4, municipality: 'BMC', imageUrl: null, severity: 'high', status: 'in_progress', supportCount: 22, departmentId: deps[4].id, assignedToId: null, slaDeadline: new Date(Date.now() + 24*3600*1000).toISOString(), slaBreached: 0, escalationLevel: 0, aiConfidence: 0.98, aiCategory: 'public_safety', aiSubcategory: 'tree', createdAt: now, updatedAt: now },
    { id: uuidv4(), incidentId: 'INC-012', userId: 'citizen-1', category: 'road', subcategory: 'damaged_road', description: 'Damaged road', latitude: 19.080, longitude: 72.890, address: 'CST Rd', wardNumber: 4, municipality: 'BMC', imageUrl: null, severity: 'high', status: 'closed', supportCount: 18, departmentId: deps[0].id, assignedToId: null, slaDeadline: new Date(Date.now() + 10*3600*1000).toISOString(), slaBreached: 0, escalationLevel: 0, aiConfidence: 0.93, aiCategory: 'road', aiSubcategory: 'damaged_road', createdAt: pastDate, updatedAt: pastDate },
  ];

  store.incidents.push(...(incidents as Incident[]));
  
  console.log('Database seeded successfully with in-memory store.');
}

if (require.main === module) {
  initializeDb();
  seed();
}
