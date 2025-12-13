'use client';

import { useState } from 'react';
import AddGameForm from '@/components/AddGameForm';
import Link from 'next/link';

export default function AdminPage() {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Passwort aus Umgebungsvariable auslesen (oder Standard nutzen)
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setConfirmPassword('');
    } else {
      alert('Falsches Passwort');
    }
  };

  const handleAddGame = async (data: {
    images: string[];
    answer: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }) => {
    const response = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to add game');
    }

    return response.json();
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold text-primary mb-2">
            🔐 Admin Panel
          </h1>
          <p className="text-black text-lg mb-4">
            Verwalte Rätsel und Spieleinstellungen
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 text-primary hover:text-primary-dark font-semibold underline"
          >
            ← Zurück zum Spiel
          </Link>
        </div>

        {!isAuthenticated ? (
          // Login Form
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto border-4 border-primary">
            <h2 className="text-2xl font-bold text-primary mb-4 text-center">
              Admin Login
            </h2>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Admin Passwort"
                className="w-full px-4 py-3 border-2 border-primary rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-primary-dark mb-4"
                autoFocus
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition text-lg"
              >
                Anmelden
              </button>
            </form>
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded text-sm text-black">
            </div>
          </div>
        ) : (
          // Admin Content
          <div>
            <AddGameForm onSubmit={handleAddGame} />
          </div>
        )}
      </div>
    </div>
  );
}
