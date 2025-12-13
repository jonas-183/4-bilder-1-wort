'use client';

import { useState, useEffect } from 'react';
import AddGameForm from '@/components/AddGameForm';
import GameManagement from '@/components/GameManagement';
import LeaderboardManagement from '@/components/LeaderboardManagement';
import PointsManagement from '@/components/PointsManagement';
import Link from 'next/link';

interface Game {
  id: string;
  images: string[];
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface User {
  id: string;
  username: string;
  score: number;
  completedGames: string[];
  createdAt: string;
}

export default function AdminPage() {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'games' | 'leaderboard' | 'points'>('games');
  const [games, setGames] = useState<Game[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Passwort aus Umgebungsvariable auslesen (oder Standard nutzen)
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

  useEffect(() => {
    if (isAuthenticated) {
      fetchGames();
      fetchUsers();
    }
  }, [isAuthenticated]);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error('Fehler beim Laden der Rätsel:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Fehler beim Laden der Benutzer:', error);
    }
  };

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

    fetchGames();
    return response.json();
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-5xl font-bold text-primary mb-2">🔐 Admin Dashboard</h1>
          <p className="text-black text-lg mb-4">Verwalte Rätsel, Spieler & Einstellungen</p>
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
            <h2 className="text-2xl font-bold text-primary mb-4 text-center">Admin Login</h2>
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
          </div>
        ) : (
          // Admin Dashboard
          <div>
            {/* Tab Navigation */}
            <div className="flex gap-4 mb-6 border-b-2 border-primary pb-4 flex-wrap">
              <button
                onClick={() => setActiveTab('games')}
                className={`px-6 py-2 font-bold rounded-lg transition ${
                  activeTab === 'games'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
              >
                📋 Rätsel
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-6 py-2 font-bold rounded-lg transition ${
                  activeTab === 'leaderboard'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
              >
                🏆 Leaderboard ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('points')}
                className={`px-6 py-2 font-bold rounded-lg transition ${
                  activeTab === 'points'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
              >
                ⭐ Punkte
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'games' && (
              <div>
                <AddGameForm onSubmit={handleAddGame} />
                <GameManagement games={games} onRefresh={fetchGames} />
              </div>
            )}

            {activeTab === 'leaderboard' && <LeaderboardManagement users={users} onRefresh={fetchUsers} />}

            {activeTab === 'points' && <PointsManagement onRefresh={fetchUsers} />}
          </div>
        )}
      </div>
    </div>
  );
}
