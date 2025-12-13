#!/bin/bash

# 4 Bilder 1 Wort - Setup Script
# Dieses Skript installiert die Anwendung und startet sie

set -e

echo "🎮 4 Bilder 1 Wort - Setup"
echo "============================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js ist nicht installiert!"
    echo "Bitte installiere Node.js von: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js gefunden: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installiere Dependencies..."
npm install

echo ""
echo "✓ Setup abgeschlossen!"
echo ""
echo "🚀 Starte Entwicklungsserver..."
echo "   URL: http://localhost:3000"
echo "   Admin: http://localhost:3000/admin"
echo "   Passwort: admin123"
echo ""
echo "Drücke Ctrl+C zum Stoppen"
echo ""

# Start dev server
npm run dev
