# 🎮 4 Bilder 1 Wort - Schnellübersicht

## 📋 Was wurde erstellt?

Eine komplette, produktionsreife **Webanwendung** zum Spielen von "4 Bilder 1 Wort" mit:

✅ Interaktives Spiel mit 4 Bildern
✅ Admin-Panel zum Hinzufügen von Rätseln
✅ Leaderboard mit Rankings
✅ Responsive Design (Mobile & Desktop)
✅ Theme in #8D3A37 (Rot-Braun), Weiß & Schwarz
✅ Bereit zum Hosten für mehrere Nutzer

---

## 🚀 Sofort Starten

### macOS/Linux:
```bash
cd /Users/jonasreimer/Desktop/academyconsult
chmod +x setup.sh
./setup.sh
```

### Windows:
```
cd C:\Users\jonasreimer\Desktop\academyconsult
setup.bat
```

### Manuell:
```bash
npm install
npm run dev
```

Dann öffne: **http://localhost:3000**

---

## 📝 Wo du Rätsel hinzufügst

### 1️⃣ Über Admin-Panel (Empfohlen)
- Gehe zu: `http://localhost:3000/admin`
- Login mit: `admin123`
- Füge 4 Bilder-URLs, das Wort, Kategorie & Schwierigkeit ein
- Speichern!

### 2️⃣ Direkt im Code
- Bearbeite: `src/lib/database.ts`
- Füge Rätsel ins `gameDatabase` Array ein
- Speichern → Neu starten

### 3️⃣ Batch-Hinzufügen via API
```bash
curl -X POST http://localhost:3000/api/games \
  -H "Content-Type: application/json" \
  -d '{
    "images": ["url1", "url2", "url3", "url4"],
    "answer": "wort",
    "category": "Kategorie",
    "difficulty": "easy"
  }'
```

---

## 🌐 Hosting für Mehrere Nutzer

### Option 1: Vercel (⭐ BEST - 5 Min Setup)

```bash
# 1. GitHub Account erstellen
# 2. Projekt hochladen:
git init
git add .
git commit -m "Initial"
git push

# 3. Auf https://vercel.com deployen
# 4. Link teilen mit Freunden
# Fertig!
```

**Freunde spielen dann unter**: `https://4-bilder-1-wort.vercel.app`

### Option 2: Netlify (Ähnlich wie Vercel)
1. https://netlify.com
2. GitHub verbinden
3. Deploy
4. Link teilen

### Option 3: Eigener Server im Netzwerk
```bash
npm run build
npm start
```
Freunde geben `http://[deine-ip]:3000` im Browser ein

Siehe **DEPLOYMENT.md** für alle Optionen!

---

## 📸 Beispiel-Rätsel

### Rätsel 1: "HUND"
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

### Bilder-Quellen (Kostenlos):
- **Unsplash**: https://unsplash.com
- **Pexels**: https://pexels.com
- **Pixabay**: https://pixabay.com

---

## 🔧 Projektstruktur

```
academyconsult/
├── README.md              ← Umfassende Dokumentation
├── ANLEITUNG.md           ← Deutsche Schritt-für-Schritt Anleitung
├── DEPLOYMENT.md          ← Hosting-Optionen
├── QUICKSTART.md          ← Diese Datei!
│
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Hauptspiel-Seite
│   │   ├── admin/page.tsx        ← Admin-Panel (Rätsel hinzufügen)
│   │   ├── api/games/route.ts    ← API: Rätsel verwalten
│   │   ├── api/scores/route.ts   ← API: Leaderboard
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── GameImageGrid.tsx     ← Bild-Grid & Input
│   │   ├── Leaderboard.tsx       ← Rankings anzeigen
│   │   └── AddGameForm.tsx       ← Rätsel-Formular
│   │
│   └── lib/
│       └── database.ts           ← Alle Rätsel & Scores speichern
│
├── public/
├── package.json
├── tailwind.config.ts    ← Farben anpassen (#8D3A37)
└── next.config.ts
```

---

## ⚙️ Wichtige Funktionen

| Feature | Status | Details |
|---------|--------|---------|
| Spiel spielen | ✅ Fertig | 4 Bilder, Wort erraten |
| Admin Panel | ✅ Fertig | Rätsel hinzufügen mit 4 URLs |
| Leaderboard | ✅ Fertig | Top 50 Spieler |
| Responsive | ✅ Fertig | Mobile & Desktop |
| Themes | ✅ Fertig | #8D3A37 + Weiß + Schwarz |
| Persistente DB | ⚠️ Optional | Momentan im RAM (gehen verloren bei Neustart) |
| Benutzer-Auth | ⚠️ Optional | Momentan nur Spieler-Namen |

---

## 🔐 Admin-Passwort

**Standard**: `admin123`

**Ändern**:
1. Öffne: `src/app/admin/page.tsx`
2. Ändere Zeile: `const ADMIN_PASSWORD = 'admin123';`
3. Speichern & neu starten

---

## 🎯 Nächste Schritte

1. ✅ **Lokal testen**: `npm run dev`
2. ✅ **Rätsel hinzufügen**: Admin-Panel nutzen
3. ✅ **Mit Freunden testen**: `http://localhost:3000`
4. ✅ **Hosten**: Vercel / Netlify / Eigener Server
5. ✅ **Link teilen**: Alle können spielen!

---

## 📞 Hilfe

- **Lokal starten klappt nicht?** → Siehe ANLEITUNG.md
- **Hosting-Fragen?** → Siehe DEPLOYMENT.md
- **API-Nutzung?** → Siehe README.md
- **Fehler?** → Logs in der Browser-Console (F12)

---

## 🚀 Live gehen (Vercel)

```bash
# 1. Repository auf GitHub pushen
git add .
git commit -m "4 Bilder 1 Wort ready"
git push

# 2. Auf Vercel.com deployen (verbinde GitHub)
# 3. App läuft unter: https://4-bilder-1-wort.vercel.app
# 4. Teile Link mit Freunden!
```

---

**Viel Spaß mit der App! 🎮🎉**

Fragen? Schau in die Docs:
- README.md
- ANLEITUNG.md
- DEPLOYMENT.md
