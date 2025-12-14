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

// Mock data - Replace with database calls in production
const gameDatabase: GameData[] = [
  { 
    id: '1', // hier anpassen ########
    images: [
      '/images/Dorothee_Winkler1.png',
      '/images/Dorothee_Winkler2.png',
      '/images/Dorothee_Winkler3.png',
      '/images/Dorothee_Winkler3.png',
    ],
    answer: 'Dorothee Winkler',
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
  // return a sorted copy to avoid mutating the in-memory array repeatedly
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
  scoreDatabase.push(newScore);
  return newScore;
}

export async function updateScore(
  playerName: string,
  score: number,
  completedGames: number,
  gameId?: string
): Promise<Score> {
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
