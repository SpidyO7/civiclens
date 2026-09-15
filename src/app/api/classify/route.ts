import { NextRequest, NextResponse } from 'next/server';
import { classifyImage } from '@/lib/services/ai-classifier';

export async function POST(request: NextRequest) {
  try {
    const { imageDataUrl } = await request.json();
    const result = await classifyImage(imageDataUrl);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to classify image' }, { status: 500 });
  }
}
