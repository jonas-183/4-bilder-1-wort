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
    id: '1',
    images: [
      'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300',
      'https://images.unsplash.com/photo-1552058544-f03b3d6e-custom?w=300',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
      'https://images.unsplash.com/photo-1516979187457-635ffe35ff91?w=300',
    ],
    answer: 'hund',
    difficulty: 'easy',
    category: 'Tiere',
  },
  {
    id: '2',
    images: [
      'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=300',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300',
      'https://images.unsplash.com/photo-1522869635100-ce306146efba?w=300',
      'https://images.unsplash.com/photo-1533995405351-e89aec32a822?w=300',
    ],
    answer: 'sonne',
    difficulty: 'easy',
    category: 'Natur',
  },
  {
    id: '3',
    images: [
      'https://images.unsplash.com/photo-1569163139394-de4798aa62b9?w=300',
      'https://images.unsplash.com/photo-1599399810694-b5ac4dd33cdf?w=300',
      'https://images.unsplash.com/photo-1575936123452-b7cf6858b19d?w=300',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300',
    ],
    answer: 'wasser',
    difficulty: 'medium',
    category: 'Natur',
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
  return scoreDatabase.sort((a, b) => b.score - a.score).slice(0, 50);
}

export async function addScore(
  playerName: string,
  score: number,
  completedGames: number
): Promise<Score> {
  const newScore: Score = {
    id: Date.now().toString(),
    playerName,
    score,
    completedGames,
    lastPlayed: new Date().toISOString(),
    timestamp: Date.now(),
  };
  scoreDatabase.push(newScore);
  return newScore;
}

export async function updateScore(
  playerName: string,
  score: number,
  completedGames: number
): Promise<Score> {
  const existingScore = scoreDatabase.find((s) => s.playerName === playerName);
  if (existingScore) {
    existingScore.score += score;
    existingScore.completedGames += completedGames;
    existingScore.lastPlayed = new Date().toISOString();
    existingScore.timestamp = Date.now();
    return existingScore;
  }
  return addScore(playerName, score, completedGames);
}

// ===== USER MANAGEMENT =====
export async function registerUser(
  username: string,
  password: string,
  email: string
): Promise<User | null> {
  // Check if user already exists
  if (userDatabase.find((u) => u.username === username)) {
    return null;
  }

  const newUser: User = {
    id: Date.now().toString(),
    username,
    password, // In production: hash this!
    email,
    score: 0,
    completedGames: [],
    createdAt: new Date().toISOString(),
  };

  userDatabase.push(newUser);
  return newUser;
}

export async function loginUser(
  username: string,
  password: string
): Promise<User | null> {
  const user = userDatabase.find(
    (u) => u.username === username && u.password === password
  );
  return user || null;
}

export async function getUserById(id: string): Promise<User | undefined> {
  return userDatabase.find((u) => u.id === id);
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  return userDatabase.find((u) => u.username === username);
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
