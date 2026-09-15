import { NextRequest, NextResponse } from 'next/server';
import { findDuplicates } from '@/lib/services/duplicate-detector';

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude, category, subcategory } = await request.json();
    const duplicates = await findDuplicates(latitude, longitude, category, subcategory);
    return NextResponse.json(duplicates);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to find duplicates' }, { status: 500 });
  }
}
