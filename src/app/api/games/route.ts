import { NextResponse } from 'next/server';
import { getGameData, addGameData } from '@/lib/database';

export async function GET() {
  try {
    const games = await getGameData();
    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { images, answer, category, difficulty } = body;

    if (!images || !Array.isArray(images) || images.length !== 4) {
      return NextResponse.json(
        { error: 'Bitte exakt 4 Bilder angeben' },
        { status: 400 }
      );
    }

    if (!answer || !category) {
      return NextResponse.json(
        { error: 'Antwort und Kategorie erforderlich' },
        { status: 400 }
      );
    }

    const game = await addGameData({
      images,
      answer,
      category,
      difficulty: difficulty || 'easy',
    });

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    );
  }
}
