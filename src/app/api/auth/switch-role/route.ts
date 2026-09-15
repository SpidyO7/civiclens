import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { role } = await request.json();
    const validRoles = ['citizen', 'authority', 'admin'];
    
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    
    const response = NextResponse.json({ role, userId: `mock-${role}-id` });
    response.cookies.set('civiclens-role', role, { path: '/' });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to switch role' }, { status: 500 });
  }
}
