'use client';

import { useState, useEffect } from 'react';
import GameImageGrid from '@/components/GameImageGrid';
import Leaderboard from '@/components/Leaderboard';
import Link from 'next/link';

interface Game {
  id: string;
  images: string[];
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface Score {
  playerName: string;
  score: number;
  completedGames: number;
}

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [playerScore, setPlayerScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
    fetchLeaderboard();
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

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/scores');
      const data = await response.json();
      setScores(data);
    } catch (error) {
      console.error('Fehler beim Laden des Leaderboards:', error);
    }
  };

  const handleStartGame = (name: string) => {
    if (name.trim()) {
      setPlayerName(name);
      setGameStarted(true);
      setPlayerScore(0);
      setCurrentGameIndex(0);
    }
  };

  const handleCorrectAnswer = async () => {
    const newScore = playerScore + 10;
    setPlayerScore(newScore);

    if (currentGameIndex < games.length - 1) {
      setCurrentGameIndex(currentGameIndex + 1);
    } else {
      // Game finished
      await submitScore(newScore);
    }
  };

  const submitScore = async (finalScore: number) => {
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName,
          score: finalScore,
          completedGames: games.length,
        }),
      });
      fetchLeaderboard();
      setGameStarted(false);
    } catch (error) {
      console.error('Fehler beim Speichern des Scores:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-4">
            4 Bilder 1 Wort
          </div>
          <div className="text-black">Wird geladen...</div>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-4">
            4 Bilder 1 Wort
          </div>
          <div className="text-black mb-4">
            Noch keine Rätsel vorhanden. Bitte füge Rätsel hinzu!
          </div>
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

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <h1 className="text-5xl font-bold text-primary mb-2">
              🎮 4 Bilder 1 Wort
            </h1>
            <p className="text-black text-lg">
              Erkenne das Wort anhand der 4 Bilder!
            </p>
          </div>

          {/* Start Form */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-4 border-primary max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Spieler Name
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleStartGame(playerName);
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
              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition text-lg"
              >
                Spiel starten
              </button>
            </form>
          </div>

          {/* Leaderboard */}
          <Leaderboard scores={scores} />

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

      {/* End of Game Message */}
      {currentGameIndex === games.length - 1 && playerScore > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setGameStarted(false);
              fetchLeaderboard();
            }}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition"
          >
            Spiel beendet - Zurück zum Menü
          </button>
        </div>
      )}
    </div>
  );
}
