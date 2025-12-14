// This is a mock database file. In production, use a real database like MongoDB, PostgreSQL, etc.

export interface GameData {
  id: string;
  images: string[]; // 4 image URLs
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface Score {
  id: string;
  playerName: string;
  score: number;
  completedGames: number;
  lastPlayed: string;
  timestamp: number;
  completedGameIds?: string[];
}

export interface User {
  id: string;
  username: string;
  password: string; // In production: hash this!
  email: string;
  score: number;
  completedGames: string[]; // Array of game IDs completed
  createdAt: string;
}

export interface PointsConfig {
  easy: number;
  medium: number;
  hard: number;
}

import { supabaseAdmin } from './supabaseServer';

// Mock data - Replace with database calls in production
const gameDatabase: GameData[] = [
  { 
    id: '1', // hier anpassen ########
    images: [
      '/images/Dorothee_Winkler1.png',
      '/images/Dorothee_Winkler2.png',
      '/images/Dorothee_Winkler3.png',
      '/images/Dorothee_Winkler4.jpg',
    ],
    answer: 'Dorothee Winkler',
    difficulty: 'easy',
    category: 'Alumni',
  },
    { 
    id: '2', // hier anpassen ########
    images: [
      '/images/Greta_Garkisch1.png',
      '/images/Greta_Garkisch2.jpg',
      '/images/Greta_Garkisch3.png',
      '/images/Greta_Garkisch4.png',
    ],
    answer: 'Greta Garkisch',
    difficulty: 'easy',
    category: 'Alumni',
  },
    { 
    id: '3', // hier anpassen ########
    images: [
      '/images/Jakob_Wohlhüter1.png',
      '/images/Jakob_Wohlhüter2.png',
      '/images/Jakob_Wohlhüter3.jpg',
      '/images/Jakob_Wohlhüter4.png',
    ],
    answer: 'Jakob Wohlhüter',
    difficulty: 'easy',
    category: 'Alumni',
  },
    { 
    id: '4', // hier anpassen ########
    images: [
      '/images/Sophia_Schmid1.jpg',
      '/images/Sophia_Schmid2.jpg',
      '/images/Sophia_Schmid3.jpg',
      '/images/Sophia_Schmid4.png',
    ],
    answer: 'Sophia Schmid',
    difficulty: 'easy',
    category: 'Alumni',
  },
      { 
    id: '5', // hier anpassen ########
    images: [
      '/images/Vincent_Delitz1.jpeg',
      '/images/Vincent_Delitz2.png',
      '/images/Vincent_Delitz3.png',
      '/images/Vincent_Delitz4.png',
    ],
    answer: 'Vincent Delitz',
    difficulty: 'easy',
    category: 'Alumni',
  },
        { 
    id: '6', // hier anpassen ########
    images: [
      '/images/Jakob_Albert1.png',
      '/images/Jakob_Albert2.avif',
      '/images/Jakob_Albert3.jpeg',
      '/images/Jakob_Albert4.png',
    ],
    answer: 'Jakob Albert',
    difficulty: 'easy',
    category: 'Alumni',
  },
          { 
    id: '7', // hier anpassen ########
    images: [
      '/images/Tim_Schneider1.jpg',
      '/images/Tim_Schneider2.jpeg',
      '/images/Tim_Schneider3.png',
      '/images/Tim_Schneider4.jpg',
    ],
    answer: 'Tim Schneider',
    difficulty: 'easy',
    category: 'Alumni',
  },
            { 
    id: '7', // hier anpassen ########
    images: [
      '/images/Tom_Biermann1.jpeg',
      '/images/Tom_Biermann2.jpeg',
      '/images/Tom_Biermann3.png',
      '/images/Tom_Biermann4.jpeg',
    ],
    answer: 'Tom Biermann',
    difficulty: 'easy',
    category: 'Alumni',
  },
];

const userDatabase: User[] = [];
const scoreDatabase: Score[] = [];

// Points configuration per difficulty
let pointsConfig: PointsConfig = {
  easy: 10,
  medium: 25,
  hard: 50,
};

export async function getGameData(): Promise<GameData[]> {
  return gameDatabase;
}

export async function getGameById(id: string): Promise<GameData | undefined> {
  return gameDatabase.find((game) => game.id === id);
}

export async function addGameData(game: Omit<GameData, 'id'>): Promise<GameData> {
  const newGame: GameData = {
    ...game,
    id: Date.now().toString(),
  };
  gameDatabase.push(newGame);
  return newGame;
}

export async function getLeaderboard(): Promise<Score[]> {
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('scores')
      .select('id, player_name, score, completed_games, completed_game_ids, last_played')
      .order('score', { ascending: false })
      .limit(50);
    if (error) {
      console.error('Supabase getLeaderboard error:', error);
      // fallback to in-memory
      return [...scoreDatabase].sort((a, b) => b.score - a.score).slice(0, 50);
    }
    return (
      (data || []) as any[]
    ).map((r) => ({
      id: r.id,
      playerName: r.player_name,
      score: r.score,
      completedGames: r.completed_games,
      lastPlayed: r.last_played,
      timestamp: r.last_played ? new Date(r.last_played).getTime() : Date.now(),
      completedGameIds: r.completed_game_ids || [],
    }));
  }

  // fallback: return a sorted copy to avoid mutating the in-memory array repeatedly
  return [...scoreDatabase].sort((a, b) => b.score - a.score).slice(0, 50);
}

export async function addScore(
  playerName: string,
  score: number,
  completedGames: number,
  gameId?: string
): Promise<Score> {
  const newScore: Score = {
    id: Date.now().toString(),
    playerName,
    score,
    completedGames,
    lastPlayed: new Date().toISOString(),
    timestamp: Date.now(),
    completedGameIds: gameId ? [gameId] : [],
  };
  if (supabaseAdmin) {
    const payload: any = {
      player_name: playerName,
      score,
      completed_games: completedGames,
      completed_game_ids: gameId ? [gameId] : [],
      last_played: new Date().toISOString(),
    };
    const { data, error } = await supabaseAdmin.from('scores').insert(payload).select().single();
    if (error) {
      console.error('Supabase addScore error:', error);
      // fallback to in-memory
    } else if (data) {
      return {
        id: data.id,
        playerName: data.player_name,
        score: data.score,
        completedGames: data.completed_games,
        lastPlayed: data.last_played,
        timestamp: data.last_played ? new Date(data.last_played).getTime() : Date.now(),
        completedGameIds: data.completed_game_ids || [],
      } as Score;
    }

    // if supabase failed, fall through to in-memory
  }

  const newScore: Score = {
    id: Date.now().toString(),
    playerName,
    score,
    completedGames,
    lastPlayed: new Date().toISOString(),
    timestamp: Date.now(),
    completedGameIds: gameId ? [gameId] : [],
  };
  scoreDatabase.push(newScore);
  return newScore;
}

export async function updateScore(
  playerName: string,
  score: number,
  completedGames: number,
  gameId?: string
): Promise<Score> {
  if (supabaseAdmin) {
    // try to fetch existing row
    const { data: existingData, error: getErr } = await supabaseAdmin
      .from('scores')
      .select('*')
      .eq('player_name', playerName)
      .maybeSingle();
    if (getErr) {
      console.error('Supabase updateScore fetch error:', getErr);
      // fallback to in-memory
    } else if (existingData) {
      const completedIds: string[] = existingData.completed_game_ids || [];
      if (gameId && completedIds.includes(gameId)) {
        // already counted
        await supabaseAdmin
          .from('scores')
          .update({ last_played: new Date().toISOString() })
          .eq('player_name', playerName);
        return {
          id: existingData.id,
          playerName: existingData.player_name,
          score: existingData.score,
          completedGames: existingData.completed_games,
          lastPlayed: existingData.last_played,
          timestamp: existingData.last_played ? new Date(existingData.last_played).getTime() : Date.now(),
          completedGameIds: existingData.completed_game_ids || [],
        } as Score;
      }

      const newIds = gameId ? Array.from(new Set([...(completedIds || []), gameId])) : completedIds;
      const { data: updated, error: updErr } = await supabaseAdmin
        .from('scores')
        .update({
          score: existingData.score + score,
          completed_games: existingData.completed_games + completedGames,
          completed_game_ids: newIds,
          last_played: new Date().toISOString(),
        })
        .eq('player_name', playerName)
        .select()
        .single();
      if (updErr) {
        console.error('Supabase updateScore update error:', updErr);
      } else if (updated) {
        return {
          id: updated.id,
          playerName: updated.player_name,
          score: updated.score,
          completedGames: updated.completed_games,
          lastPlayed: updated.last_played,
          timestamp: updated.last_played ? new Date(updated.last_played).getTime() : Date.now(),
          completedGameIds: updated.completed_game_ids || [],
        } as Score;
      }
    }
    // fallback to in-memory if supabase not available / errors
  }

  const existingScore = scoreDatabase.find((s) => s.playerName === playerName);
  if (existingScore) {
    // prevent double-counting the same game
    if (gameId && existingScore.completedGameIds && existingScore.completedGameIds.includes(gameId)) {
      // already counted this game for this player — return without increment
      existingScore.lastPlayed = new Date().toISOString();
      existingScore.timestamp = Date.now();
      return existingScore;
    }

    existingScore.score += score;
    existingScore.completedGames += completedGames;
    existingScore.lastPlayed = new Date().toISOString();
    existingScore.timestamp = Date.now();
    if (gameId) {
      existingScore.completedGameIds = Array.from(new Set([...(existingScore.completedGameIds || []), gameId]));
    }
    return existingScore;
  }
  return addScore(playerName, score, completedGames, gameId);
}
// ===== USER MANAGEMENT =====
export async function getUserById(id: string): Promise<User | undefined> {
  return userDatabase.find((u) => u.id === id);
}

export async function completeGame(
  userId: string,
  gameId: string,
  points: number
): Promise<User | null> {
  const user = userDatabase.find((u) => u.id === userId);
  if (!user) return null;

  // Check if already completed
  if (user.completedGames.includes(gameId)) {
    return null; // Already completed
  }

  user.completedGames.push(gameId);
  user.score += points;
  return user;
}

export async function getAllUsers(): Promise<User[]> {
  return userDatabase.sort((a, b) => b.score - a.score);
}

// Update a user's fields (score, completedGames, etc.)
export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const user = userDatabase.find((u) => u.id === id);
  if (!user) return null;
  Object.assign(user, updates);
  return user;
}

// ===== GAME MANAGEMENT =====
export async function updateGame(id: string, updates: Partial<GameData>): Promise<GameData | null> {
  const game = gameDatabase.find((g) => g.id === id);
  if (!game) return null;

  Object.assign(game, updates);
  return game;
}

export async function deleteGame(id: string): Promise<boolean> {
  const index = gameDatabase.findIndex((g) => g.id === id);
  if (index === -1) return false;

  gameDatabase.splice(index, 1);
  return true;
}

// ===== SCORE MANAGEMENT =====
export async function updateScoreEntry(id: string, updates: Partial<Score>): Promise<Score | null> {
  const score = scoreDatabase.find((s) => s.id === id);
  if (!score) return null;

  Object.assign(score, updates);
  return score;
}

export async function deleteScore(id: string): Promise<boolean> {
  const index = scoreDatabase.findIndex((s) => s.id === id);
  if (index === -1) return false;

  scoreDatabase.splice(index, 1);
  return true;
}

// ===== POINTS CONFIGURATION =====
export async function getPointsConfig(): Promise<PointsConfig> {
  return pointsConfig;
}

export async function updatePointsConfig(config: Partial<PointsConfig>): Promise<PointsConfig> {
  pointsConfig = { ...pointsConfig, ...config };
  return pointsConfig;
}
