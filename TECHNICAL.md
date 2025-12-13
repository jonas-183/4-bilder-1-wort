# 🔧 TECHNISCHE DOKUMENTATION

## Architektur-Übersicht

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (React + Next.js)             │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  MainPage    │  │  AdminPanel  │  │ Leaderboard  │  │
│  │ (page.tsx)   │  │ (admin.tsx)  │  │ (.tsx)       │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                 │                 │            │
│         └─────────────────┼─────────────────┘            │
│                           │                              │
│         ┌─────────────────┼─────────────────┐           │
│         │   Components     │                 │           │
│         │                  │                 │           │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────┐     │
│  │GameImageGrid │  │ AddGameForm   │  │ Leaderbd │     │
│  │(.tsx)        │  │ (.tsx)        │  │ (.tsx)   │     │
│  └──────────────┘  └───────────────┘  └──────────┘     │
│         │                 │                 │            │
└─────────┼─────────────────┼─────────────────┼────────────┘
          │                 │                 │
┌─────────┼─────────────────┼─────────────────┼────────────┐
│         │      API Routes (Next.js)         │            │
│  ┌──────────────────────────────────────────────┐        │
│  │          /api/games       │     /api/scores  │        │
│  │          (route.ts)       │     (route.ts)   │        │
│  └──────────────────────────────────────────────┘        │
│         │                    │                           │
└─────────┼────────────────────┼───────────────────────────┘
          │                    │
┌─────────┼────────────────────┼───────────────────────────┐
│         │    In-Memory Database                          │
│  ┌──────────────────────────────────────────────┐        │
│  │  src/lib/database.ts                         │        │
│  │  - gameDatabase: GameData[]                  │        │
│  │  - scoreDatabase: Score[]                    │        │
│  └──────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

---

## Datenstrukturen

### GameData
```typescript
interface GameData {
  id: string;                           // Eindeutige ID (timestamp)
  images: string[];                     // Array mit 4 Bild-URLs
  answer: string;                       // Gesuchtes Wort
  difficulty: 'easy' | 'medium' | 'hard';  // Schwierigkeitsgrad
  category: string;                     // Kategorie (z.B. "Tiere")
}
```

### Score
```typescript
interface Score {
  id: string;                      // Eindeutige ID
  playerName: string;              // Spieler-Name
  score: number;                   // Gesamtpunkte (10 pro Rätsel)
  completedGames: number;          // Anzahl gelöster Rätsel
  lastPlayed: string;              // ISO-Datum des letzten Spiels
  timestamp: number;               // Unix-Timestamp
}
```

---

## API Endpoints

### GET /api/games
Alle Rätsel abrufen
```bash
curl http://localhost:3000/api/games
```

**Response:**
```json
[
  {
    "id": "1234567890",
    "images": ["url1", "url2", "url3", "url4"],
    "answer": "hund",
    "difficulty": "easy",
    "category": "Tiere"
  }
]
```

### POST /api/games
Neues Rätsel hinzufügen
```bash
curl -X POST http://localhost:3000/api/games \
  -H "Content-Type: application/json" \
  -d '{
    "images": ["url1", "url2", "url3", "url4"],
    "answer": "hund",
    "category": "Tiere",
    "difficulty": "easy"
  }'
```

### GET /api/scores
Leaderboard abrufen (sortiert nach Punkte, max 50)
```bash
curl http://localhost:3000/api/scores
```

**Response:**
```json
[
  {
    "id": "1234567890",
    "playerName": "Max",
    "score": 100,
    "completedGames": 10,
    "lastPlayed": "2024-01-15T10:30:00Z",
    "timestamp": 1234567890
  }
]
```

### POST /api/scores
Score speichern / aktualisieren
```bash
curl -X POST http://localhost:3000/api/scores \
  -H "Content-Type: application/json" \
  -d '{
    "playerName": "Max",
    "score": 50,
    "completedGames": 5
  }'
```

---

## Komponenten-Details

### GameImageGrid.tsx
**Props:**
```typescript
{
  images: string[];           // 4 Bild-URLs
  answer: string;             // Korrekte Antwort
  onAnswerSubmit: Function;   // Callback bei richtiger Antwort
  disabled?: boolean;         // Eingabe deaktiviert
}
```

**Features:**
- 2x2 Bild-Grid mit Image Optimization
- Text-Input für Spieler-Antwort
- Case-insensitive Überprüfung
- Erfolgsmeldung bei richtiger Antwort

### AddGameForm.tsx
**Props:**
```typescript
{
  onSubmit: Function;  // Callback mit Rätsel-Daten
}
```

**Features:**
- 4 separate URL-Input Felder
- Bild-Vorschau nach URL-Eingabe
- Validierung aller Felder
- Error-Handling

### Leaderboard.tsx
**Props:**
```typescript
{
  scores: Score[];  // Array aus Scores
}
```

**Features:**
- Tabellen-Ansicht mit Rankings
- Medaillen für Top 3 (🥇🥈🥉)
- Sortiert nach Punkte (absteigend)

---

## Styling-System

### Tailwind CSS Custom Colors
```typescript
// tailwind.config.ts
colors: {
  primary: '#8D3A37',
  'primary-dark': '#6b2a28',
}
```

### Verwendete Utility-Klassen
```
bg-primary          // Hintergrund Rot-Braun
text-primary        // Text Rot-Braun
border-primary      // Border Rot-Braun
hover:bg-primary-dark
bg-white            // Weiß
text-black          // Schwarz
```

---

## State Management

### Auf der Hauptseite (page.tsx)
```typescript
const [games, setGames] = useState<Game[]>([]);      // Alle Rätsel
const [scores, setScores] = useState<Score[]>([]);   // Leaderboard
const [currentGameIndex, setCurrentGameIndex] = useState(0); // Aktuelles Rätsel
const [playerName, setPlayerName] = useState('');    // Spieler-Name
const [playerScore, setPlayerScore] = useState(0);   // Aktuelle Punkte
const [gameStarted, setGameStarted] = useState(false); // Spiel läuft
```

### Auf der Admin-Seite (admin/page.tsx)
```typescript
const [isAuthenticated, setIsAuthenticated] = useState(false); // Login-Status
const [images, setImages] = useState<string[]>(['', '', '', '']); // Form Images
const [answer, setAnswer] = useState('');
const [category, setCategory] = useState('');
const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
```

---

## Datenbankfunktionen

### src/lib/database.ts

```typescript
// Abrufen
getGameData()          // Alle Rätsel
getGameById(id)        // Ein Rätsel nach ID
getLeaderboard()       // Top 50 Spieler sortiert

// Erstellen
addGameData(game)      // Neues Rätsel hinzufügen
addScore(name, ...)    // Neuer Score

// Aktualisieren
updateScore(name, ...) // Score aktualisieren oder erstellen
```

---

## Produktions-Deployment

### Build
```bash
npm run build         # Erstellt .next Ordner
npm start            # Startet Production Server
```

### Environment Variables
```
NEXT_PUBLIC_ADMIN_PASSWORD=sicheres_passwort
```

### Vercel Deployment
```
Vercel kümmert sich automatisch um:
- Build Process
- Environment Variables
- SSL/HTTPS
- CDN Distribution
- Auto Redeployment bei Git Push
```

---

## Performance-Tipps

1. **Image Optimization**: Next.js Image Component nutzen ✅ (bereits implementiert)
2. **Code Splitting**: Next.js App Router macht es automatisch ✅
3. **API Caching**: Optional mit ISR (Incremental Static Regeneration)
4. **Database**: Upgrade zu MongoDB für bessere Performance

---

## Testing

### Lokal testen
```bash
npm run dev
# Browser: http://localhost:3000
# Admin: http://localhost:3000/admin (Passwort: admin123)
```

### Production Build testen
```bash
npm run build
npm start
# Browser: http://localhost:3000
```

### API testen
```bash
# Games abrufen
curl http://localhost:3000/api/games

# Rätsel hinzufügen
curl -X POST http://localhost:3000/api/games \
  -H "Content-Type: application/json" \
  -d '{"images":["url1","url2","url3","url4"],"answer":"test","category":"test","difficulty":"easy"}'

# Scores abrufen
curl http://localhost:3000/api/scores
```

---

## Erweiterungsmöglichkeiten

### 1. Echte Datenbank
```typescript
// MongoDB Beispiel
import { MongoClient } from 'mongodb';
const client = new MongoClient(process.env.MONGODB_URI);
```

### 2. User Authentication
```typescript
// NextAuth.js für Login/Signup
import { getServerSession } from 'next-auth';
```

### 3. Statistiken & Analytics
```typescript
// Google Analytics Integration
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

### 4. Multiplayer-Mode
```typescript
// WebSocket für Live Multiplayer
import { io } from 'socket.io-client';
```

### 5. Admin Funktionen
- Rätsel bearbeiten/löschen
- Score-Validation
- Spieler-Management
- Analytics Dashboard

---

## Code-Qualität

### Lint-Check
```bash
npm run lint
```

### TypeScript Strict Mode
```typescript
// Bereits aktiviert in tsconfig.json
"strict": true,
"noUnusedLocals": true,
"noUnusedParameters": true,
```

---

## Sicherheit

### Aktuelle Sicherheitsmaßnahmen
- Admin-Passwort-Schutz ✅
- Input-Validierung ✅
- API Endpoints geschützt ✅

### Empfohlene Upgrades
- Rate Limiting für API
- CORS-Restrictions
- Input Sanitization
- SQL-Injection Protection (mit echte Datenbank)

---

## Lizenz & Credits

- Framework: Next.js 14
- Styling: Tailwind CSS 3
- Komponenten: React 18
- Deployment: Vercel, Netlify, etc.

---

**Viel Spaß beim Entwickeln! 🚀**
