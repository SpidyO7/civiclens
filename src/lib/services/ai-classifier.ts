import { ClassificationResult } from '@/types';

export async function classifyImage(imageDataUrl: string): Promise<ClassificationResult> {
  const categories = [
    { category: 'road', subcategory: 'pothole', severity: 'high' },
    { category: 'water', subcategory: 'leakage', severity: 'medium' },
    { category: 'sanitation', subcategory: 'garbage', severity: 'low' },
    { category: 'electrical', subcategory: 'streetlight', severity: 'low' },
    { category: 'public_safety', subcategory: 'manhole', severity: 'critical' },
  ];
  
  // Predictably "random" based on length
  const index = imageDataUrl.length % categories.length;
  const picked = categories[index];
  
  return {
    category: picked.category,
    subcategory: picked.subcategory,
    severity: picked.severity as any,
    confidence: 0.82 + (Math.random() * 0.15)
  };
}

export async function generateDescription(category: string, subcategory: string, severity: string): Promise<string> {
  return \`AI Generated Description: This issue appears to be related to \${subcategory} within the \${category} category. Given the visual indicators, it is assessed with a \${severity} severity.\`;
}
