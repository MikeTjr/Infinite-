# Infinite Us — 18+ Immersive Couples Card Game Platform

> *The thunder didn’t make her love him more. It just made the moment possible.*

A living relationship platform — not a quiz, not a checklist. A place where couples do the work, together.

18+ adults only. No ads. No data selling. Built for the long haul.

-----

## Project Analysis

This is a **pnpm monorepo** with three deployable artifacts and four shared libraries. The web frontend is a React/Vite SPA. The backend is an Express 5 + Socket.io 4 server. A React Native mobile app lives alongside them. All packages share TypeScript types, a Zod validation layer, and a Drizzle ORM schema targeting PostgreSQL.

**Critical architecture note for Netlify:** The frontend (`artifacts/two-become-one/`) deploys cleanly to Netlify as a static site. The backend (`artifacts/api-server/`) uses persistent WebSocket connections via Socket.io and **cannot run as Netlify Functions** — it must be deployed separately to a persistent server (Render, Railway, or Fly.io are ideal). The database likewise needs an external PostgreSQL provider (Neon, Supabase, or Railway).

**Replit artifacts to delete after migration** — these files are Replit-only and serve no purpose on Netlify:

- `.replit`
- `.replitignore`
- `artifacts/api-server/.replit-artifact/`
- `artifacts/mockup-sandbox/.replit-artifact/`
- `artifacts/two-become-one/` Replit plugin imports in `vite.config.ts` are already conditionally gated behind `process.env.REPL_ID !== undefined`, so they will be silently skipped on Netlify — no code change required there.

-----

## What Is Implemented

|Feature                                                                                                                                                                                                                                                     |Location                                                                                        |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|
|**172 game cards** — 8 types (`dare`, `this-or-that`, `what-if`, `challenge`, `spicy`, `thunder`, `legacy`, `repair`), 3 depth levels (Surface → Current → Deep), frameworks from Gottman, EFT, Esther Perel, Attachment Theory, Brené Brown, Love Languages|`artifacts/two-become-one/src/lib/cards.ts`                                                     |
|**Real-time 2-player live sync** — room creation, partner join, choice lock, score tracking via Socket.io                                                                                                                                                   |`artifacts/api-server/src/lib/socketServer.ts`                                                  |
|**TV Observer Mode** — read-only viewer at `/watch/:code`, receives live card state and scores                                                                                                                                                              |`artifacts/two-become-one/src/pages/TvViewer.tsx`                                               |
|**Two Become One** — AI couple portrait via Pollinations.ai (free, zero API keys, URL-based)                                                                                                                                                                |`artifacts/two-become-one/src/pages/TwoBecomOne.tsx`, `artifacts/api-server/src/routes/blend.ts`|
|**Hidden Admin Panel** — 7-tap on the landing page title within 3 seconds opens a passphrase modal                                                                                                                                                          |`artifacts/two-become-one/src/pages/Landing.tsx`, `artifacts/api-server/src/routes/admin.ts`    |
|**Mobile App (Expo 53)** — Google OAuth framework wired, nostalgia card data present (29 cards, 80s–2020s era-tagged)                                                                                                                                       |`artifacts/mobile/`                                                                             |
|**Growth Score, The Mirror, The Archive, The Journey, Bonds** — relationship tracking features                                                                                                                                                              |`artifacts/two-become-one/src/pages/`                                                           |
|**PWA** — installable, offline-capable via `vite-plugin-pwa`                                                                                                                                                                                                |`artifacts/two-become-one/vite.config.ts`                                                       |

-----

## Pending Tasks (implement in order)

### 1. Google Sign-In on Web App — HIGH PRIORITY

Web app has zero Google OAuth. Mobile `AuthContext.tsx` has the full framework — port it.

1. Add GIS script to `artifacts/two-become-one/index.html`:
   
   ```html
   <script src="https://accounts.google.com/gsi/client" async defer></script>
   ```
1. In `Landing.tsx`: call `window.google.accounts.id.initialize()` with `import.meta.env.VITE_GOOGLE_CLIENT_ID`, decode the JWT on callback, persist to `localStorage` under `'infinite-user'`, navigate to `/setup` (new user) or `/dashboard` (returning).
1. Files to modify: `index.html`, `Landing.tsx`, `src/lib/types.ts` (add `googleUserId?: string` to `CoupleProfile`), `src/lib/storage.ts`.

### 2. Port Nostalgia Cards to Web App — HIGH PRIORITY

29 nostalgia cards exist in `artifacts/mobile/data/nostalgiaCards.ts` with full era tagging and `getNostalgiaCardsForYear()` helper. None of it is in the web app.

1. Add `'nostalgia'` to `CardType` union in `types.ts`.
1. Add `era?: string`, `yearRange?: [number, number]`, `category?` fields to `Card` type.
1. Append all 29 cards to `cards.ts` with `depth: 'surface'`.
1. Port `getNostalgiaCardsForYear()` into `cards.ts`.
1. In `Play.tsx`: if couple profile has `anniversaryDate`, inject 3–5 nostalgia cards per session and mark them with a `🕰️` or “Nostalgia” label.

### 3. QR Code TV Connect Flow — MEDIUM PRIORITY

1. `pnpm --filter @workspace/two-become-one add qrcode.react`
1. In the live game UI, add a “Watch on TV” button that shows a modal with a QR code for `/watch/<code>` and the 6-character room code in large text.
1. `TvViewer.tsx` already handles `join-as-observer` — no backend changes needed.

### 4. New Card Batch — LOW PRIORITY (ongoing)

Add 10–15 “current era” cards to `cards.ts`. Theme: modern couple life (streaming, AI anxiety, post-pandemic recalibration). Use `this-or-that` or `what-if` types, `depth: 'surface'` or `'current'`.

-----

## Architecture

```
workspace/
├── artifacts/
│   ├── two-become-one/          # React 19 + Vite 7 — deploys to Netlify
│   │   └── src/
│   │       ├── pages/           # Landing, Play, TvViewer, TwoBecomOne, Setup,
│   │       │                    # Dashboard, Archive, Bonds, Mirror, Journey, Leaderboard
│   │       └── lib/
│   │           ├── cards.ts     # 172 game cards
│   │           ├── types.ts     # CardType, CoupleProfile, AppState
│   │           ├── gameLogic.ts # Scoring, session logic
│   │           └── storage.ts   # localStorage helpers
│   ├── api-server/              # Express 5 + Socket.io — deploy to Render/Railway
│   │   └── src/
│   │       ├── routes/          # blend, admin, rooms, bonds, journey, health
│   │       ├── middlewares/     # auth, rateLimit, security
│   │       └── lib/
│   │           └── socketServer.ts  # Real-time game + TV observer
│   └── mobile/                  # Expo 53 React Native
│       ├── app/                 # Expo Router screens
│       ├── context/
│       │   └── AuthContext.tsx  # Google OAuth + local SecureStore auth
│       └── data/
│           └── nostalgiaCards.ts  # 29 nostalgia cards (PORT TO WEB APP)
└── lib/
    ├── db/                      # Drizzle ORM — schema for PostgreSQL
    │   └── src/schema/          # couples, rooms, sessions, bonds, journeys,
    │                            # mirror_results, growth_scores, drifted_cards
    ├── api-zod/                 # Shared Zod validation schemas (generated)
    ├── api-spec/                # OpenAPI spec + orval codegen config
    └── api-client-react/        # Generated React query hooks
```

-----

## Netlify Deployment

### Step 1 — Add `netlify.toml` to the repo root

```toml
[build]
  command = "pnpm install --no-frozen-lockfile && pnpm --filter @workspace/two-become-one run build"
  publish = "artifacts/two-become-one/dist/public"

[build.environment]
  NODE_VERSION = "24"
  PORT = "3000"
  BASE_PATH = "/"

[[redirects]]
  from = "/api/*"
  to = "https://YOUR_BACKEND_URL/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Replace `YOUR_BACKEND_URL` with the live URL of your deployed backend (see Backend Deployment below).

### Step 2 — Set environment variables in Netlify

Go to **Site configuration → Environment variables** and add:

|Variable               |Value                                                      |
|-----------------------|-----------------------------------------------------------|
|`PORT`                 |`3000`                                                     |
|`BASE_PATH`            |`/`                                                        |
|`VITE_GOOGLE_CLIENT_ID`|Your Google OAuth 2.0 Client ID                            |
|`VITE_API_URL`         |Your backend URL (e.g. `https://infinite-api.onrender.com`)|

`VITE_GOOGLE_CLIENT_SECRET` and `ADMIN_PASSPHRASE` are server-side secrets — set them on the backend host only, not in Netlify.

### Step 3 — Google OAuth authorized origins

In Google Cloud Console, add your Netlify domain (e.g. `https://your-site.netlify.app`) to **Authorized JavaScript origins** for the OAuth Client ID.

### Step 4 — Deploy

Connect your repo to Netlify. The build command and publish directory are already in `netlify.toml`. Netlify will detect the pnpm lockfile automatically.

-----

## Backend Deployment (Render / Railway / Fly.io)

The backend **must** run on a persistent server — Socket.io’s WebSocket connections are incompatible with serverless functions.

### Build & start commands for your host

```bash
# Build
pnpm install --no-frozen-lockfile && pnpm --filter @workspace/api-server run build

# Start
node --enable-source-maps artifacts/api-server/dist/index.mjs
```

### Backend environment variables

|Variable                   |Description                                                             |
|---------------------------|------------------------------------------------------------------------|
|`DATABASE_URL`             |PostgreSQL connection string — `postgresql://user:pass@host:5432/dbname`|
|`ADMIN_PASSPHRASE`         |Passphrase for the hidden admin panel                                   |
|`VITE_GOOGLE_CLIENT_SECRET`|Google OAuth Client Secret (server-side only, never exposed to browser) |
|`NODE_ENV`                 |Set to `production`                                                     |
|`PORT`                     |Port the server listens on (host usually sets this automatically)       |

### Database setup

After deploying the backend, run schema push once:

```bash
pnpm --filter @workspace/db run push
```

Requires `DATABASE_URL` to be set. Recommended PostgreSQL providers: **Neon** (serverless, free tier), **Supabase**, or a Railway PostgreSQL addon.

-----

## Tech Stack

|Layer          |Technology                                                              |
|---------------|------------------------------------------------------------------------|
|Web Frontend   |React 19, Vite 7, TailwindCSS 4, Framer Motion, Wouter, socket.io-client|
|Backend        |Express 5, Socket.io 4, Zod v4, Pino logger, esbuild (CJS bundle)       |
|Mobile         |Expo 53, Expo Router v5, expo-auth-session                              |
|Database       |PostgreSQL + Drizzle ORM                                                |
|AI Portrait    |Pollinations.ai — free, URL-based, zero API keys, zero signup           |
|Auth (web)     |Google Identity Services (GIS) script — no Node SDK required            |
|Auth (mobile)  |expo-auth-session + SecureStore                                         |
|Real-Time      |Socket.io 4 (WebSocket + polling fallback)                              |
|Package Manager|pnpm workspaces, Node.js 24, TypeScript 5.9                             |

-----

## Environment Variables Reference

|Variable                   |Used By                        |Description                                           |
|---------------------------|-------------------------------|------------------------------------------------------|
|`PORT`                     |Frontend build, Backend runtime|Build-time: set to `3000`. Runtime: set by host.      |
|`BASE_PATH`                |Frontend build                 |Set to `/` on Netlify.                                |
|`VITE_GOOGLE_CLIENT_ID`    |Frontend, Mobile               |Google OAuth 2.0 Client ID.                           |
|`VITE_GOOGLE_CLIENT_SECRET`|Backend only                   |Google OAuth Client Secret — never exposed to browser.|
|`VITE_API_URL`             |Frontend                       |Backend base URL for API calls.                       |
|`ADMIN_PASSPHRASE`         |Backend                        |Passphrase for the 7-tap hidden admin panel.          |
|`DATABASE_URL`             |Backend                        |PostgreSQL connection string for Drizzle ORM.         |


> There is **no `OPENAI_API_KEY`** in this project. Avatar generation uses Pollinations.ai — free, no key required.

-----

## API Routes

|Method|Path                   |Description                                    |
|------|-----------------------|-----------------------------------------------|
|`GET` |`/api/health`          |Server health check                            |
|`POST`|`/api/blend`           |Generate couple AI portrait via Pollinations.ai|
|`POST`|`/api/rooms`           |Create a game room                             |
|`GET` |`/api/rooms/join/:code`|Join room by 6-char code                       |
|`POST`|`/api/bonds`           |Create a bond group                            |
|`POST`|`/api/journey/start`   |Start a journey season                         |
|`POST`|`/api/admin/verify`    |Verify admin passphrase → returns JWT          |

-----

## Socket.io Events

### Player Events

|Event         |Direction      |Description                   |
|--------------|---------------|------------------------------|
|`create-room` |Client → Server|Host creates a game room      |
|`join-room`   |Client → Server|Partner joins with 6-char code|
|`make-choice` |Client → Server|Player locks in A, B, or drift|
|`advance-card`|Client → Server|Host advances to next card    |
|`ping-room`   |Client → Server|Heartbeat keepalive           |

### TV Observer Events

|Event                      |Direction      |Description                                 |
|---------------------------|---------------|--------------------------------------------|
|`join-as-observer`         |Client → Server|TV viewer joins read-only                   |
|`observer-joined`          |Server → Client|Confirms join with current state snapshot   |
|`observer-player-chose`    |Server → Client|A player locked in (choice not yet revealed)|
|`observer-choices-revealed`|Server → Client|Both choices + scores                       |
|`observer-card-advanced`   |Server → Client|Next card + updated scores                  |
|`observer-session-finished`|Server → Client|Game over + final scores                    |

-----

## Dev Commands

```bash
# Install all workspace dependencies
pnpm install

# Run the API server (port 5000)
pnpm --filter @workspace/api-server run dev

# Run the web app (port 8080)
pnpm --filter @workspace/two-become-one run dev

# Run the Expo mobile app
pnpm --filter @workspace/mobile run dev

# Full typecheck across all packages
pnpm run typecheck

# Build all packages
pnpm run build

# Push DB schema (dev only — requires DATABASE_URL)
pnpm --filter @workspace/db run push

# Regenerate API hooks and Zod schemas from OpenAPI spec
pnpm --filter @workspace/api-spec run codegen
```

-----

## Hidden Admin Panel

There is no menu, no link, no visible affordance.

**Trigger:** Tap or click the **“Infinite Us”** title on the landing page **7 times within 3 seconds.**

A passphrase modal appears. Enter the `ADMIN_PASSPHRASE` value. On success, a JWT admin token is returned for use with admin API routes.

-----

## Database Schema (Drizzle ORM)

Tables defined in `lib/db/src/schema/`:

|Table           |Purpose                                                                |
|----------------|-----------------------------------------------------------------------|
|`couples`       |Couple profiles — names, avatar JSON, anniversary date, blend image URL|
|`rooms`         |Game rooms — join code, phase, current card, expires at                |
|`sessions`      |Completed game sessions — scores, card history                         |
|`bonds`         |Small couple groups                                                    |
|`journeys`      |Seasonal relationship programs                                         |
|`mirror_results`|Love Language & Conflict Style assessment results                      |
|`growth_scores` |Running growth score per couple                                        |
|`drifted_cards` |Cards a couple skipped (local drift tracking)                          |