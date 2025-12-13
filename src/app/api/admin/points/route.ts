import { NextResponse } from 'next/server';
import { getPointsConfig, updatePointsConfig } from '@/lib/database';

export async function GET() {
  try {
    const config = await getPointsConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching points config:', error);
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const config = await updatePointsConfig(body);
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error updating points config:', error);
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}
