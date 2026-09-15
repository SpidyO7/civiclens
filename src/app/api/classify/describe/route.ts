import { NextRequest, NextResponse } from 'next/server';
import { generateDescription } from '@/lib/services/ai-classifier';

export async function POST(request: NextRequest) {
  try {
    const { category, subcategory, severity } = await request.json();
    const description = await generateDescription(category, subcategory, severity);
    return NextResponse.json({ description });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 });
  }
}
