# 📖 DOKUMENTATION - Detaillierte Anleitung

## 🎯 Inhalt

1. [Schnellstart](#schnellstart)
2. [Rätsel erstellen](#rätsel-erstellen)
3. [Hosting & Deployment](#hosting--deployment)
4. [Admin Panel](#admin-panel)
5. [Häufig gestellte Fragen](#faq)

---

## ⚡ Schnellstart

### Lokal starten (für Entwicklung)

```bash
cd /Users/jonasreimer/Desktop/academyconsult
npm install
npm run dev
```

Öffne dann: **http://localhost:3000**

### Erste Schritte

1. Gehe zu **http://localhost:3000/admin**
2. Login: Passwort `admin123`
3. Füge dein erstes Rätsel hinzu
4. Starte ein Spiel auf der Hauptseite

---

## 📸 Rätsel erstellen - Detaillierte Anleitung

### Was ist ein Rätsel?

Ein Rätsel besteht aus:
- **4 Bildern** (PNG, JPG, etc. - müssen online abrufbar sein)
- **1 Wort** (die Antwort)
- **Kategorie** (z.B. Tiere, Berufe, Natur)
- **Schwierigkeit** (Einfach/Mittel/Schwer)

### Bild-URLs finden

#### Methode 1: Unsplash API (Empfohlen)

```
https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop
```

Ersetze die ID mit einer anderen aus: https://unsplash.com

Beispiele:
- Hund: `photo-1633722715463-d30628e5a5e7`
- Katze: `photo-1514888286974-6c03bf1a7a77`
- Auto: `photo-1566023967268-a4be2fb55651`

#### Methode 2: Pexels URLs

Direkt nutzbar von: https://pexels.com

Beispiel:
```
https://images.pexels.com/photos/61579/pexels-photo-61579.jpeg?auto=compress&cs=tinysrgb&w=600
```

#### Methode 3: Pixabay URLs

Von: https://pixabay.com

### Rätsel-Beispiele

**Beispiel 1: "HUND"**
```
Bilder:
1. https://images.unsplash.com/photo-1633722715463-d30628e5a5e7?w=300
2. https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300
3. https://images.unsplash.com/photo-1600511463779-c6fb37f34c20?w=300
4. https://images.unsplash.com/photo-1719986479706-e12a7ec8cbf8?w=300

Antwort: hund
Kategorie: Tiere
Schwierigkeit: einfach
```

**Beispiel 2: "BAUM"**
```
Bilder:
1. https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300
2. https://images.unsplash.com/photo-1511497584788-876760111969?w=300
3. https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300
4. https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=300

Antwort: baum
Kategorie: Natur
Schwierigkeit: einfach
```

### Direkt in der Datei hinzufügen

Öffne `src/lib/database.ts` und bearbeite `gameDatabase`:

```typescript
const gameDatabase: GameData[] = [
  {
    id: '1',
    images: [
      'https://images.unsplash.com/photo-1633722715463-d30628e5a5e7?w=300',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
      'https://images.unsplash.com/photo-1600511463779-c6fb37f34c20?w=300',
      'https://images.unsplash.com/photo-1719986479706-e12a7ec8cbf8?w=300',
    ],
    answer: 'hund',
    difficulty: 'easy',
    category: 'Tiere',
  },
  // Weitere Rätsel...
];
```

Speichern → `npm run dev` neu starten → Fertig!

---

## 🌐 Hosting & Deployment

### Option 1: ⭐ VERCEL (Beste Option für Next.js)

**Dauer**: 5 Minuten | **Kosten**: Kostenlos

1. GitHub Account erstellen: https://github.com/signup
2. Dein Projekt zu GitHub pushen:
   ```bash
   cd /Users/jonasreimer/Desktop/academyconsult
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/DEIN_NAME/4-bilder-1-wort.git
   git push -u origin main
   ```

3. Auf https://vercel.com anmelden
4. "New Project" → GitHub Repository auswählen
5. "Deploy" klicken
6. **Fertig!** Die App läuft jetzt unter: `https://4-bilder-1-wort.vercel.app`

**Freunden den Link teilen** - Sie können sofort spielen!

### Option 2: Netlify

1. Auf https://netlify.com anmelden
2. "Add new site" → GitHub verbinden
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Deploy

### Option 3: Heroku (für Backend-Apps)

```bash
npm install -g heroku
heroku login
heroku create 4-bilder-1-wort
git push heroku main
```

URL: `https://4-bilder-1-wort.herokuapp.com`

### Option 4: DigitalOcean (Eigener Server)

1. DigitalOcean Account: https://digitalocean.com
2. App Platform auswählen
3. GitHub Repository verbinden
4. Automatic Deploy aktivieren
5. **App läuft öffentlich**

### Option 5: Lokaler Server (Freunde im gleichen Netzwerk)

```bash
npm run build
npm start
```

Dann geben Freunde die IP-Adresse ein:
- Gib `ipconfig getifaddr en0` ein (macOS)
- Freunde geben im Browser ein: `http://[deine-ip]:3000`

---

## 🔧 Admin Panel

### Admin-Passwort ändern

**Datei**: `src/app/admin/page.tsx`

```typescript
const ADMIN_PASSWORD = 'dein_sicheres_passwort'; // Diese Zeile ändern
```

### Bild-Vorschau im Admin Panel

Wenn du eine Bild-URL eingibst, wird die Vorschau angezeigt. Falls nicht:
- URL ist ungültig oder nicht öffentlich
- Domain blockiert externe Anfragen
- Bild wurde gelöscht

### Rätsel verwalten

**Aktuell können Rätsel nicht gelöscht werden** (nur hinzugefügt). Um Rätsel zu entfernen:

1. Öffne `src/lib/database.ts`
2. Lösche das Rätsel aus dem Array
3. Speichern
4. `npm run dev` neu starten

---

## ❓ FAQ

### F: Können mehrere Leute gleichzeitig spielen?
**A**: Ja! Wenn du die App gehostet hast (z.B. auf Vercel), können unbegrenzt viele Leute über den Link spielen.

### F: Speichern sich die Scores dauerhaft?
**A**: Momentan nur während die App läuft. Bei einem Neustart gehen sie verloren. Für Persistenz:
- Upgrade zu einer echten Datenbank (MongoDB, PostgreSQL)
- Oder verwende Supabase/Firebase

### F: Wie viele Rätsel sollte ich haben?
**A**: Mindestens 5-10 für ein gutes Spielerlebnis. 50+ für längeres Gameplay.

### F: Kann ich eigene Bilder hochladen statt URLs?
**A**: Aktuell nicht direkt. Lösung:
1. Bilder auf kostenlose Hosting-Seite hochladen (imgbb.com)
2. URL kopieren
3. In Admin-Panel einfügen

### F: Funktioniert es auf dem Handy?
**A**: Ja! Die App ist vollständig responsive.

### F: Kann ich das Design ändern?
**A**: Ja! Bearbeite `tailwind.config.ts` für Farben oder `src/app/globals.css` für allgemeine Stile.

### F: Wie kann ich das zu meiner Website hinzufügen?
**A**: Mit einem `<iframe>`:
```html
<iframe src="https://4-bilder-1-wort.vercel.app" 
        width="100%" 
        height="800px" 
        frameborder="0">
</iframe>
```

### F: Gibt es eine Mobile App?
**A**: Die Web-App funktioniert auf mobilen Geräten perfekt. Eine native App könnte mit React Native erstellt werden.

### F: Kann ich Statistiken sehen?
**A**: Momentan gibt es nur das Leaderboard. Für erweiterte Analytics: Tracking-Tool wie Google Analytics integrieren.

---

## 🎓 Für Anfänger

Wenn du nicht technisch versiert bist:

1. **Vercel nutzen** (einfachste Lösung):
   - GitHub Account erstellen
   - Projekt hochladen
   - Vercel verbinden
   - **Fertig - Freunde können spielen!**

2. **Rätsel hinzufügen**:
   - 4 Bilder von Unsplash/Pexels finden
   - Admin-Panel öffnen
   - Bilder-URLs einfügen
   - Wort eingeben
   - Speichern

3. **Freunde einladen**:
   - Link teilen (z.B. `4-bilder-1-wort.vercel.app`)
   - Sie klicken Namen ein
   - Sie spielen!

---

## 🆘 Häufige Fehler

| Fehler | Lösung |
|--------|--------|
| "Bilder werden nicht angezeigt" | URL ist ungültig oder nicht öffentlich |
| "npm command not found" | Node.js nicht installiert (https://nodejs.org) |
| "Leaderboard ist leer" | Normal - erst wenn Spieler spielen |
| "Admin-Panel passwort falsch" | Standard ist `admin123` |
| "Deployment schlägt fehl" | Logs in Vercel/Netlify checken |

---

Fragen? Schau in `README.md` oder kontakt mich! 🚀
