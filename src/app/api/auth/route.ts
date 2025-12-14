import { NextResponse } from 'next/server';

// Authentication endpoint deprecated: app now uses anonymous name-only play.
export async function POST() {
  return NextResponse.json({ error: 'Authentication disabled. Use anonymous name entry.' }, { status: 410 });
}
