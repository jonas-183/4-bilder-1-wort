# GitHub Copilot Instructions

This is a Next.js project for a "4 Bilder 1 Wort" (4 Pictures 1 Word) web game application.

## Project Overview

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: In-memory (mock for demo)
- **Color Theme**: #8D3A37 (Primary Red-Brown), White, Black

## Key Features

- Interactive word guessing game with 4 images
- Admin panel to add new puzzles
- Leaderboard system
- Responsive design
- Difficulty levels (easy, medium, hard)
- Puzzle categories

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Main game page
│   ├── admin/page.tsx        # Admin panel
│   ├── api/
│   │   ├── games/route.ts    # Games API endpoints
│   │   └── scores/route.ts   # Scores/Leaderboard API
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── GameImageGrid.tsx     # Game image display & input
│   ├── Leaderboard.tsx       # Leaderboard display
│   └── AddGameForm.tsx       # Admin form for adding puzzles
└── lib/
    └── database.ts           # Mock database & API functions
```

## How to Add Puzzles

### Via Admin Panel
1. Navigate to `/admin`
2. Login with password (default: `admin123`)
3. Fill in 4 image URLs, answer word, category, and difficulty
4. Submit form

### Direct in database.ts
Edit the `gameDatabase` array in `src/lib/database.ts` to add puzzles directly.

## Important Notes

- **Images**: Must be publicly accessible URLs
- **Data Persistence**: Currently in-memory only. Restart will lose data.
- **Admin Password**: Should be changed before production
- **Database**: Upgrade to MongoDB/PostgreSQL for production

## Deployment Options

- Vercel (recommended for Next.js)
- Netlify
- DigitalOcean
- Docker on any server

See `DEPLOYMENT.md` for detailed instructions.

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run linter
```

## Environment Variables

See `.env.local.example`:
- `NEXT_PUBLIC_ADMIN_PASSWORD` - Admin panel password

## Design System

- **Primary Color**: #8D3A37
- **Primary Dark**: #6b2a28
- **Background**: White
- **Text**: Black

See `tailwind.config.ts` for full configuration.
