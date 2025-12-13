# 4 Bilder 1 Wort - Webanwendung

Eine vollständige Webanwendung zum Spielen des beliebten Wortleiterspiels "4 Bilder 1 Wort" mit Leaderboard, Admin-Panel und schöner Benutzeroberfläche.

## 🎮 Features

- ✅ Interaktives Wortratespiel mit 4 Bildern
- ✅ Admin-Panel zum Hinzufügen neuer Rätsel
- ✅ Leaderboard mit Top-Spielern
- ✅ Responsive Design (Mobile & Desktop)
- ✅ Theme mit Farbe #8D3A37 (Rot-Braun), Weiß und Schwarz
- ✅ Schwierigkeitsgrade (Einfach, Mittel, Schwer)
- ✅ Kategorisierung von Rätseln

## 🚀 Installation & Setup

### Voraussetzungen

- Node.js (v18+)
- npm, yarn oder pnpm

### Installation

```bash
# Repository klonen oder in den Projektordner navigieren
cd /Users/jonasreimer/Desktop/academyconsult

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Anwendung läuft dann unter `http://localhost:3000`

## 📝 Wo du Rätsel hinzufügst

### Über das Admin-Panel

1. Öffne `http://localhost:3000/admin`
2. Login mit dem Admin-Passwort (Standard: `admin123`)
3. Fülle die Form aus:
   - **Bild 1-4 URLs**: Links zu 4 verschiedenen Bildern (externe URLs von Unsplash, Pixabay, etc.)
   - **Antwort**: Das gesuchte Wort (z.B. "Hund")
   - **Kategorie**: Kategorie des Rätsels (z.B. "Tiere")
   - **Schwierigkeit**: Einfach / Mittel / Schwer
4. Klicke "Rätsel hinzufügen"

### Direkt in der Datenbasis

Falls du mehrere Rätsel auf einmal hinzufügen möchtest, bearbeite `src/lib/database.ts`:

```typescript
const gameDatabase: GameData[] = [
  {
    id: '1',
    images: [
      'https://images.unsplash.com/photo-1...',  // Bild 1
      'https://images.unsplash.com/photo-2...',  // Bild 2
      'https://images.unsplash.com/photo-3...',  // Bild 3
      'https://images.unsplash.com/photo-4...',  // Bild 4
    ],
    answer: 'hund',
    difficulty: 'easy',
    category: 'Tiere',
  },
  // Weitere Rätsel hier...
];
```

## 🌐 Hosting & Deployment

### Option 1: Vercel (Empfohlen für Next.js)

Schnellste und einfachste Lösung:

1. **Vercel Account erstellen**: https://vercel.com
2. **GitHub Repository verbinden** oder direktes Deployment:
   ```bash
   npm install -g vercel
   vercel
   ```
3. Folge den Anweisungen - die App wird automatisch deployed
4. Persönliche URL wie `https://4-bilder-1-wort.vercel.app` erhalten

### Option 2: Netlify

1. **Netlify Account**: https://netlify.com
2. **Repository verbinden** oder manuelles Deployment
3. Build Command: `npm run build`
4. Publish directory: `.next`

### Option 3: Eigener Server (Beliebig - AWS, Heroku, DigitalOcean, etc.)

```bash
# Production bauen
npm run build

# Production starten
npm start
```

Der Server läuft dann auf Port 3000 (bei Bedarf konfigurierbar).

### Option 4: Docker (für Vollkontrolle)

Erstelle eine `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Dann bauen und laufen lassen:

```bash
docker build -t 4-bilder-1-wort .
docker run -p 3000:3000 4-bilder-1-wort
```

## 🔐 Admin-Passwort ändern

Bearbeite `src/app/admin/page.tsx`:

```typescript
const ADMIN_PASSWORD = 'dein_sicheres_passwort'; // Zeile ändern
```

**WICHTIG**: In Produktion verwende eine Umgebungsvariable:

1. Erstelle `.env.local`:
   ```
   NEXT_PUBLIC_ADMIN_PASSWORD=dein_sicheres_passwort
   ```

2. Bearbeite die Admin-Seite:
   ```typescript
   const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
   ```

## 📊 Datenstruktur

### Rätsel hinzufügen

```typescript
{
  id: string;              // Eindeutige ID
  images: string[];        // Array mit 4 Bild-URLs
  answer: string;          // Das gesuchte Wort
  difficulty: string;      // 'easy', 'medium' oder 'hard'
  category: string;        // Z.B. 'Tiere', 'Natur', 'Berufe'
}
```

### Leaderboard-Daten

```typescript
{
  playerName: string;      // Name des Spielers
  score: number;           // Punkte (10 pro Rätsel)
  completedGames: number;  // Anzahl gelöster Rätsel
}
```

## 🎨 Theme & Farben

Alle Farben sind in `tailwind.config.ts` definiert:

```typescript
colors: {
  primary: '#8D3A37',       // Hauptfarbe (Rot-Braun)
  'primary-dark': '#6b2a28' // Dunklere Variante für Hover
}
```

## 📱 Bild-URLs Quellen

Kostenlose Quellen für Bilder:

- **Unsplash**: https://unsplash.com
- **Pexels**: https://pexels.com
- **Pixabay**: https://pixabay.com
- **Unsplash API**: `https://images.unsplash.com/photo-ID?w=300`

## 🔗 API Endpoints

- `GET /api/games` - Alle Rätsel abrufen
- `POST /api/games` - Neues Rätsel hinzufügen
- `GET /api/scores` - Leaderboard abrufen
- `POST /api/scores` - Score speichern

## 📦 Production Build

```bash
npm run build
npm start
```

Die Anwendung läuft dann optimiert auf Port 3000.

## 🛠️ Technologie-Stack

- **Frontend**: React 18 + Next.js 14
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Database**: In-Memory (für Demo - upgrade zu MongoDB/PostgreSQL für Produktion)

## 📋 Wichtige Hinweise

1. **Bilder müssen von außen erreichbar sein** (öffentliche URLs)
2. **Datenspeicherung**: Die aktuelle Implementierung speichert Daten im RAM (gehen verloren nach Neustart). Für Produktion: MongoDB, PostgreSQL oder Firestore verwenden
3. **Sicherheit**: Admin-Passwort nicht hartcodiert in Produktion lassen
4. **Rate Limiting**: Für öffentliche Nutzung implementieren

## 🚀 Nächste Schritte

1. Lade die App auf Vercel/Netlify hoch
2. Teile den Link mit Freunden
3. Füge über das Admin-Panel Rätsel hinzu
4. Spieler können sich registrieren und Scores sammeln

Viel Spaß! 🎮
