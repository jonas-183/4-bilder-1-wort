import { NextResponse } from 'next/server';

export async function DELETE() {
  try {
    // In production, implement actual delete
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
