import { NextResponse } from 'next/server';
import { getLeaderboard, updateScore } from '@/lib/database';

export async function GET() {
  try {
    const scores = await getLeaderboard();
    return NextResponse.json(scores);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerName, score, completedGames, gameId } = body;

    if (!playerName || score === undefined || completedGames === undefined) {
      return NextResponse.json(
        { error: 'playerName, score und completedGames erforderlich' },
        { status: 400 }
      );
    }

    const result = await updateScore(playerName, score, completedGames, gameId);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error posting score:', error);
    return NextResponse.json({ error: 'Failed to post score' }, { status: 500 });
  }
}
