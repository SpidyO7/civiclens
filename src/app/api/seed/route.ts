import { NextRequest, NextResponse } from 'next/server';
import { seed } from '@/lib/db/seed';

export async function POST(request: NextRequest) {
  try {
    await seed();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to seed db' }, { status: 500 });
  }
}
