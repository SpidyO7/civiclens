import { ClassificationResult, IncidentCategory, IncidentSubcategory, Severity } from '@/types';

const CLASSIFICATIONS: { category: IncidentCategory; subcategory: IncidentSubcategory; severity: Severity; description: string }[] = [
  { category: 'road', subcategory: 'pothole', severity: 'high', description: 'A significant pothole has been detected on the road surface. This poses a risk to vehicles and pedestrians, especially during rain.' },
  { category: 'road', subcategory: 'damaged_road', severity: 'medium', description: 'The road surface shows signs of significant wear and cracking. This area may require resurfacing to prevent further deterioration.' },
  { category: 'road', subcategory: 'damaged_footpath', severity: 'low', description: 'The footpath has visible damage including broken tiles or uneven surfaces. This could be a tripping hazard for pedestrians.' },
  { category: 'water', subcategory: 'water_leakage', severity: 'high', description: 'A water leakage has been detected, likely from a broken underground pipe. Continuous water flow is visible on the road surface.' },
  { category: 'water', subcategory: 'waterlogging', severity: 'medium', description: 'Significant waterlogging observed in the area. This may indicate blocked drainage or insufficient drainage infrastructure.' },
  { category: 'water', subcategory: 'overflowing_drain', severity: 'medium', description: 'A drain is overflowing, causing water and waste to spill onto the road. This creates unsanitary conditions and potential health hazards.' },
  { category: 'waste', subcategory: 'garbage_accumulation', severity: 'medium', description: 'A large accumulation of garbage has been observed at this location. The waste appears to have been uncollected for an extended period.' },
  { category: 'waste', subcategory: 'illegal_dumping', severity: 'low', description: 'Evidence of illegal dumping has been detected. Construction debris and household waste have been discarded at an unauthorized location.' },
  { category: 'electricity', subcategory: 'broken_streetlight', severity: 'low', description: 'A streetlight at this location is not functioning. This creates a safety concern for pedestrians and vehicles during nighttime.' },
  { category: 'electricity', subcategory: 'damaged_electrical', severity: 'high', description: 'Damaged electrical infrastructure detected. Exposed wires or damaged transformers pose a serious safety risk.' },
  { category: 'public_safety', subcategory: 'open_manhole', severity: 'critical', description: 'An open or uncovered manhole has been detected. This is an immediate public safety hazard requiring urgent attention.' },
  { category: 'public_safety', subcategory: 'fallen_tree', severity: 'high', description: 'A fallen tree is blocking the road/pathway. This obstructs traffic and may damage nearby structures or vehicles.' },
  { category: 'public_safety', subcategory: 'damaged_traffic_sign', severity: 'medium', description: 'A traffic sign at this location is damaged or missing. This can lead to traffic confusion and potential accidents.' },
];

export async function classifyImage(imageDataUrl: string): Promise<ClassificationResult> {
  // If a real Vision API key is configured, call it here
  // For now, use a deterministic mock based on image data
  const index = Math.abs(hashString(imageDataUrl)) % CLASSIFICATIONS.length;
  const picked = CLASSIFICATIONS[index];

  return {
    category: picked.category,
    subcategory: picked.subcategory,
    confidence: parseFloat((0.82 + Math.random() * 0.15).toFixed(2)),
    suggestedSeverity: picked.severity,
    suggestedDescription: picked.description,
  };
}

export async function generateDescription(category: string, subcategory: string, severity: string): Promise<string> {
  const match = CLASSIFICATIONS.find(c => c.category === category && c.subcategory === subcategory);
  if (match) return match.description;

  const severityText = severity === 'critical' ? 'requiring immediate attention' :
    severity === 'high' ? 'requiring prompt action' :
    severity === 'medium' ? 'that should be addressed soon' :
    'that can be scheduled for routine maintenance';

  return `A ${subcategory.replace(/_/g, ' ')} issue has been identified in the ${category} category. ` +
    `Based on assessment, this is a ${severity} severity issue ${severityText}. ` +
    `The responsible municipal department has been identified for routing.`;
}

function hashString(str: string): number {
  let hash = 0;
  const len = Math.min(str.length, 1000); // Only hash first 1000 chars for performance
  for (let i = 0; i < len; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
