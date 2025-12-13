'use client';

import { useState, useEffect } from 'react';
import GameImageGrid from '@/components/GameImageGrid';
import Leaderboard from '@/components/Leaderboard';
import AuthForm from '@/components/AuthForm';
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
}

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [pointsConfig, setPointsConfig] = useState({ easy: 10, medium: 25, hard: 50 });

  useEffect(() => {
    fetchGames();
    fetchUsers();
    fetchPointsConfig();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      const data = await response.json();
      setGames(data);
      setLoading(false);
    } catch (error) {
      console.error('Fehler beim Laden der Spiele:', error);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Fehler beim Laden der Spieler:', error);
    }
  };

  const fetchPointsConfig = async () => {
    try {
      const response = await fetch('/api/admin/points');
      const data = await response.json();
      setPointsConfig(data);
    } catch (error) {
      console.error('Fehler beim Laden der Punkte-Config:', error);
    }
  };

  const handleAuth = async (username: string, password: string, email?: string) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isLoginMode ? 'login' : 'register',
          username,
          password,
          email,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const user = await response.json();
      setCurrentUser(user);
      setCurrentGameIndex(0);
      fetchUsers();
    } catch (error) {
      throw error;
    }
  };

  const handleCorrectAnswer = async () => {
    if (!currentUser) return;

    const game = games[currentGameIndex];
    if (!game) return;

    // Überprüfe ob Rätsel bereits gelöst
    if (currentUser.completedGames.includes(game.id)) {
      alert('Dieses Rätsel hast du bereits gelöst!');
      if (currentGameIndex < games.length - 1) {
        setCurrentGameIndex(currentGameIndex + 1);
      }
      return;
    }

    const points = pointsConfig[game.difficulty];

    try {
      // Speichere completed game
      const updatedUser = {
        ...currentUser,
        completedGames: [...currentUser.completedGames, game.id],
        score: currentUser.score + points,
      };

      setCurrentUser(updatedUser);

      if (currentGameIndex < games.length - 1) {
        setCurrentGameIndex(currentGameIndex + 1);
      } else {
        // Spiel vorbei
        alert(`🎉 Glückwunsch! Du hast alle Rätsel gelöst! Punkte: ${updatedUser.score}`);
        setCurrentUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-4">4 Bilder 1 Wort</div>
          <div className="text-black">Wird geladen...</div>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-4">4 Bilder 1 Wort</div>
          <div className="text-black mb-4">Noch keine Rätsel vorhanden!</div>
          <Link
            href="/admin"
            className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition"
          >
            Zur Admin-Seite
          </Link>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <h1 className="text-5xl font-bold text-primary mb-2">🎮 4 Bilder 1 Wort</h1>
            <p className="text-black text-lg">Erkenne das Wort anhand der 4 Bilder!</p>
          </div>

          {/* Auth Form */}
          <AuthForm
            isLogin={isLoginMode}
            onToggle={() => setIsLoginMode(!isLoginMode)}
            onSubmit={handleAuth}
          />

          {/* Leaderboard */}
          <div className="mt-12">
            <Leaderboard
              scores={users.map((u) => ({
                playerName: u.username,
                score: u.score,
                completedGames: u.completedGames.length,
              }))}
            />
          </div>

          {/* Admin Link */}
          <div className="text-center mt-8">
            <Link
              href="/admin"
              className="inline-block px-6 py-2 text-primary hover:text-primary-dark font-semibold underline"
            >
              Admin-Panel →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Spiel läuft
  return (
    <div className="min-h-screen bg-white p-4 flex flex-col items-center justify-center">
      {/* Game Header */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex justify-between items-center bg-primary p-4 rounded-lg">
          <div className="text-white font-bold">
            Spieler: <span className="text-xl">{currentUser.username}</span>
          </div>
          <div className="text-white font-bold">
            Punkte: <span className="text-xl">{currentUser.score}</span>
          </div>
          <div className="text-white font-bold">
            Rätsel: <span className="text-xl">{currentGameIndex + 1}/{games.length}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{
              width: `${((currentGameIndex + 1) / games.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Game Grid */}
      {games[currentGameIndex] && (
        <GameImageGrid
          images={games[currentGameIndex].images}
          answer={games[currentGameIndex].answer}
          onAnswerSubmit={handleCorrectAnswer}
        />
      )}

      {/* End Game Button */}
      <div className="mt-8">
        <button
          onClick={() => {
            setCurrentUser(null);
            fetchUsers();
          }}
          className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition"
        >
          Spiel beendet
        </button>
      </div>
    </div>
  );
}
