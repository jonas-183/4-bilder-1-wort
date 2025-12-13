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

const scoreDatabase: Score[] = [];

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
