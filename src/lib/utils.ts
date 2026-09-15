import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateIncidentId(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `CL-${num}`;
}

export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'high': return 'bg-red-100 text-red-800 border-red-200';
    case 'critical': return 'bg-red-200 text-red-900 border-red-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'reported':
    case 'location_verified':
    case 'classified':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'authority_identified':
    case 'forwarded':
    case 'authority_notified':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'acknowledged':
    case 'inspection':
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'repair_completed':
    case 'awaiting_verification':
      return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    case 'verified_resolved':
    case 'closed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'verification_failed':
    case 'reopened':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getStatusIcon(status: string): string {
  switch (status) {
    case 'reported': return '📋';
    case 'location_verified': return '📍';
    case 'classified': return '🏷️';
    case 'authority_identified': return '🏛️';
    case 'forwarded': return '📤';
    case 'authority_notified': return '🔔';
    case 'acknowledged': return '✅';
    case 'inspection': return '🔍';
    case 'in_progress': return '🔧';
    case 'repair_completed': return '🛠️';
    case 'awaiting_verification': return '⏳';
    case 'verified_resolved': return '✅';
    case 'verification_failed': return '❌';
    case 'reopened': return '🔄';
    case 'closed': return '🏁';
    default: return '⚪';
  }
}

export function getStatusLabel(status: string): string {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getCategoryLabel(category: string): string {
  switch (category) {
    case 'road': return 'Road & Infrastructure';
    case 'water': return 'Water & Drainage';
    case 'waste': return 'Waste Management';
    case 'electricity': return 'Electricity';
    case 'public_safety': return 'Public Safety';
    case 'other': return 'Other';
    default: return category;
  }
}

export function getSubcategoryLabel(subcategory: string): string {
  return subcategory
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getCategoryIcon(category: string): string {
  switch (category) {
    case 'road': return '🛣️';
    case 'water': return '💧';
    case 'waste': return '🗑️';
    case 'electricity': return '⚡';
    case 'public_safety': return '⚠️';
    default: return '📌';
  }
}

export function getMarkerColor(status: string): string {
  switch (status) {
    case 'verified_resolved':
    case 'closed':
      return '#22c55e'; // green
    case 'in_progress':
    case 'inspection':
    case 'acknowledged':
      return '#f59e0b'; // amber
    case 'reported':
    case 'forwarded':
    case 'authority_notified':
      return '#f97316'; // orange
    case 'verification_failed':
    case 'reopened':
      return '#ef4444'; // red
    default:
      return '#6366f1'; // indigo
  }
}

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
