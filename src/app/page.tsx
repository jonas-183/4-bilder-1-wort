'use client';

import { useState, useEffect } from 'react';
import GameImageGrid from '@/components/GameImageGrid';
import Leaderboard from '@/components/Leaderboard';
import Link from 'next/link';

interface Game {
  id: string;
  images: string[];
  answer: string;
  // difficulty/category kept in DB but not shown in anonymous play
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
}

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [playerStarted, setPlayerStarted] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [localCompleted, setLocalCompleted] = useState<string[]>([]);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pointsConfig, setPointsConfig] = useState({ easy: 10, medium: 25, hard: 50 });

  useEffect(() => {
    fetchGames();
    fetchLeaderboard();
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

  const fetchPointsConfig = async () => {
    try {
      const response = await fetch('/api/admin/points');
      const data = await response.json();
      setPointsConfig(data);
    } catch (error) {
      console.error('Fehler beim Laden der Punkte-Config:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/scores');
      const data = await response.json();
      setScores(data);
    } catch (error) {
      console.error('Fehler beim Laden des Leaderboards:', error);
    }
  };

  const startGame = (name: string) => {
    if (!name || !name.trim()) {
      alert('Bitte Namen eingeben');
      return;
    }
    const trimmed = name.trim();
    setPlayerName(trimmed);
    setPlayerStarted(true);
    setCurrentGameIndex(0);
    setPlayerScore(0);
    // load completed from localStorage by name
    try {
      const key = `completed_${trimmed}`;
      const raw = localStorage.getItem(key);
      const done = raw ? JSON.parse(raw) : [];
      setLocalCompleted(Array.isArray(done) ? done : []);
    } catch (e) {
      setLocalCompleted([]);
    }
  };

  const handleCorrectAnswer = async () => {
    if (!playerStarted) return;

    const unplayedGames = games.filter((g) => !localCompleted.includes(g.id));
    const game = unplayedGames[currentGameIndex];
    if (!game) return;

    const difficulty: 'easy' | 'medium' | 'hard' = (game as any).difficulty || 'easy';
    const points = pointsConfig[difficulty];

    try {
      const updatedDone = [...localCompleted, game.id];
      setLocalCompleted(updatedDone);
      // persist locally
      try {
        const key = `completed_${playerName}`;
        localStorage.setItem(key, JSON.stringify(updatedDone));
      } catch (e) {
        console.error('LocalStorage error:', e);
      }

      // update local score and leaderboard
      setPlayerScore((s) => s + points);
      try {
        await fetch('/api/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerName, score: points, completedGames: 1 }),
        });
        // refresh leaderboard
        fetchLeaderboard();
      } catch (e) {
        console.error('Fehler beim Aktualisieren des Leaderboards:', e);
      }

      if (currentGameIndex < unplayedGames.length - 1) {
        setCurrentGameIndex(currentGameIndex + 1);
      } else {
        alert(`🎉 Glückwunsch! Du hast alle Rätsel gelöst! Punkte: ${playerScore + points}`);
        setPlayerStarted(false);
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
          <Link href="/admin" className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition">
            Zur Admin-Seite
          </Link>
        </div>
      </div>
    );
  }

  if (!playerStarted) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <h1 className="text-5xl font-bold text-primary mb-2">🎮 4 Bilder 1 Wort</h1>
            <p className="text-black text-lg">Erkenne das Wort anhand der 4 Bilder!</p>
          </div>

          {/* Simple name input */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-4 border-primary max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-4">Spiel starten</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                startGame(playerName);
              }}
            >
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Gib deinen Namen ein"
                className="w-full px-4 py-3 border-2 border-primary rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-primary-dark mb-4"
                autoFocus
              />
              <button type="submit" className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition text-lg">
                Spiel starten
              </button>
            </form>
          </div>

          {/* Leaderboard */}
          <div className="mt-12">
            <Leaderboard scores={scores} />
          </div>

          {/* Admin Link */}
          <div className="text-center mt-8">
            <Link href="/admin" className="inline-block px-6 py-2 text-primary hover:text-primary-dark font-semibold underline">
              Admin-Panel →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Spiel läuft
  const unplayedGames = games.filter((g) => !localCompleted.includes(g.id));
  const currentGame = unplayedGames[currentGameIndex];

  if (unplayedGames.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-4">🎉 Glückwunsch!</div>
          <div className="text-2xl text-black mb-4">Du hast alle Rätsel gelöst!</div>
          <div className="text-xl text-primary mb-8">Punkte: {playerScore}</div>
          <button
            onClick={() => {
              setPlayerStarted(false);
              fetchLeaderboard();
            }}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition"
          >
            Zurück zum Menü
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col items-center justify-center">
      {/* Game Header */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex justify-between items-center bg-primary p-4 rounded-lg">
          <div className="text-white font-bold">
            Spieler: <span className="text-xl">{playerName}</span>
          </div>
          <div className="text-white font-bold">
            Punkte: <span className="text-xl">{playerScore}</span>
          </div>
          <div className="text-white font-bold">
            Rätsel: <span className="text-xl">{currentGameIndex + 1}/{unplayedGames.length}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-primary h-full transition-all duration-300" style={{ width: `${((currentGameIndex + 1) / unplayedGames.length) * 100}%` }} />
        </div>
      </div>

      {/* Game Grid */}
      {currentGame && (
        <GameImageGrid images={currentGame.images} answer={currentGame.answer} onAnswerSubmit={handleCorrectAnswer} />
      )}

      {/* End Game Button */}
      <div className="mt-8">
        <button
          onClick={async () => {
            // save progress before leaving
            try {
              const key = `completed_${playerName}`;
              localStorage.setItem(key, JSON.stringify(localCompleted));
            } catch (e) {
              console.error('Fehler beim Speichern vor Verlassen:', e);
            }
            setPlayerStarted(false);
            fetchLeaderboard();
          }}
          className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition"
        >
          Spiel beendet
        </button>
      </div>
    </div>
  );
}
