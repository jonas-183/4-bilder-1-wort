# Production Deployment Guide

## Vor dem Deployment

### 1. Admin-Passwort sichern

Bearbeite `src/app/admin/page.tsx`:

```typescript
// NICHT SO:
const ADMIN_PASSWORD = 'admin123'; // ❌ UNSICHER!

// BESSER SO:
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sicheres_passwort_hier';
```

### 2. Umgebungsvariablen setzen

Erstelle `.env.local`:
```
NEXT_PUBLIC_ADMIN_PASSWORD=dein_sicheres_passwort_12345
```

### 3. Datenbank für Persistenz (Optional aber EMPFOHLEN)

Die aktuelle Lösung speichert Daten im RAM (gehen verloren nach Neustart).

**Upgrade zu MongoDB:**

1. MongoDB Atlas Account: https://www.mongodb.com/cloud/atlas
2. Free Cluster erstellen
3. Connection String kopieren
4. In `src/lib/database.ts` implementieren:

```typescript
import { MongoClient, Db } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);
let db: Db;

export async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db('4bilder1wort');
  }
  return db;
}
```

---

## Vercel Deployment (EMPFOHLEN)

### Schritt 1: GitHub Repository vorbereiten

```bash
cd /Users/jonasreimer/Desktop/academyconsult

# Git initialisieren
git init
git add .
git commit -m "4 Bilder 1 Wort - Initial commit"

# GitHub Push (vorher GitHub Account + Repo erstellen)
git branch -M main
git remote add origin https://github.com/DEIN_USERNAME/4-bilder-1-wort.git
git push -u origin main
```

### Schritt 2: Auf Vercel deployen

1. Gehe zu https://vercel.com
2. Mit GitHub anmelden
3. "New Project" wählen
4. Dein Repository auswählen
5. "Deploy" klicken
6. Warten... ✓ Fertig!

### Schritt 3: Umgebungsvariablen in Vercel setzen

1. Project → Settings → Environment Variables
2. `NEXT_PUBLIC_ADMIN_PASSWORD` hinzufügen
3. Wert eingeben
4. Save → Redeployment automatisch

**Öffentliche URL**: `https://4-bilder-1-wort.vercel.app`

---

## Netlify Deployment

### Schritt 1: Auf GitHub pushen (wie oben)

### Schritt 2: Netlify Deployment

1. Gehe zu https://netlify.com
2. "Add new site" → "Import an existing project"
3. GitHub auswählen
4. Repository auswählen
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Environment variables:
   - `NEXT_PUBLIC_ADMIN_PASSWORD` = dein_passwort
7. "Deploy site"

---

## DigitalOcean Deployment

### Schritt 1: App erstellen

1. https://cloud.digitalocean.com
2. "Create" → "App Platform"
3. GitHub auswählen
4. Repository wählen
5. Automatic deployments aktivieren

### Schritt 2: Konfigurieren

- Build Command: `npm run build`
- Run Command: `npm start`
- Port: 3000

### Schritt 3: Umgebungsvariablen

In den App Settings:
- `NEXT_PUBLIC_ADMIN_PASSWORD` setzen

---

## Dockerisierung (Fortgeschrittene)

### Dockerfile erstellen

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

ENV NODE_ENV production

CMD ["npm", "start"]
```

### .dockerignore

```
node_modules
.next
.git
README.md
```

### Bauen und Testen

```bash
docker build -t 4-bilder-1-wort:1.0 .
docker run -p 3000:3000 4-bilder-1-wort:1.0
```

### Auf Docker Hub pushen

```bash
docker tag 4-bilder-1-wort:1.0 DEIN_USERNAME/4-bilder-1-wort:1.0
docker push DEIN_USERNAME/4-bilder-1-wort:1.0
```

---

## Performance Optimierung

### 1. Bilder optimieren

Die App lädt Bilder von außen. Für bessere Performance:
- Verwende Bilder-CDN (Cloudinary, Imgix)
- Komprimiere Bilder (TinyPNG, ImageOptim)
- Verwende moderne Formate (WebP)

### 2. Caching

```typescript
// In next.config.ts
const nextConfig: NextConfig = {
  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'max-age=300' },
        ],
      },
    ];
  },
};
```

### 3. Code Splitting

Bereits optimal durch Next.js + Tailwind.

---

## Monitoring & Logs

### Vercel
- Project → Deployments
- Live Logs anschauen
- Errors sehen

### Netlify
- Deploys anschauen
- Deploy logs checken

### Lokal debuggen
```bash
npm run build
npm start
```

Dann im Browser F12 → Console öffnen.

---

## Datensicherung

### GitHub
```bash
git status
git add .
git commit -m "Backup - vor Änderungen"
git push
```

### Lokale Sicherung
```bash
cp -r /Users/jonasreimer/Desktop/academyconsult \
      /Users/jonasreimer/Desktop/academyconsult-backup
```

---

## SSL/HTTPS

- Vercel: ✓ Automatisch
- Netlify: ✓ Automatisch
- DigitalOcean: ✓ Automatisch
- Docker: Mit Nginx/Caddy

---

## Support & Hilfe

- Next.js Docs: https://nextjs.org/docs
- Vercel Support: https://vercel.com/support
- Netlify Support: https://netlify.com/support
- Stack Overflow: Tag "nextjs"

---

**Viel Erfolg beim Deployment!** 🚀
