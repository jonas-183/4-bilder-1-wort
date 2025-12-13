import { NextResponse } from 'next/server';
import { registerUser, loginUser } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, username, password, email } = body;

    if (action === 'register') {
      const user = await registerUser(username, password, email);
      if (!user) {
        return NextResponse.json(
          { error: 'Benutzername bereits vorhanden' },
          { status: 400 }
        );
      }
      return NextResponse.json(user, { status: 201 });
    }

    if (action === 'login') {
      const user = await loginUser(username, password);
      if (!user) {
        return NextResponse.json(
          { error: 'Benutzername oder Passwort falsch' },
          { status: 401 }
        );
      }
      return NextResponse.json(user, { status: 200 });
    }

    return NextResponse.json(
      { error: 'Ungültige Aktion' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Fehler bei der Authentifizierung' },
      { status: 500 }
    );
  }
}
