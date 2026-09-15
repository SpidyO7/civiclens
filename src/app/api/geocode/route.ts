import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    
    if (!lat || !lng) return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
    
    return NextResponse.json({
      address: '123 Civic Street, Downtown Area',
      wardNumber: 2,
      wardName: 'Downtown',
      municipality: 'Metro City'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Geocoding failed' }, { status: 500 });
  }
}
