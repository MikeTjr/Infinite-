# Infinite Us

A living relationship platform for couples — immersive card sessions, real-time live sync, journey tracking, couple avatar generation, and a hidden admin panel.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/two-become-one run dev` — run the web app (port 8080)
- `pnpm --filter @workspace/mobile run dev` — run the Expo mobile app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `VITE_GOOGLE_CLIENT_ID` — Google OAuth 2.0 Client ID (web + mobile)
- Required env: `ADMIN_PASSPHRASE` — unlocks the hidden admin panel (7-tap trigger)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 + Socket.io 4
- Web: React 19, Vite 7, TailwindCSS 4, Framer Motion, Wouter
- Mobile: Expo 53 + Expo Router v5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- Build: esbuild (CJS bundle)
- AI: Pollinations.ai (https://image.pollinations.ai) — free, zero API keys, URL-based
- Auth: Google Identity Services (web GIS script), expo-auth-session (mobile)

## Where things live

- `artifacts/two-become-one/` — React 19 + Vite 7 web app (served at /)
- `artifacts/two-become-one/src/pages/` — Landing, Play, TvViewer, TwoBecomOne, Setup, Dashboard, etc.
- `artifacts/two-become-one/src/lib/cards.ts` — 172+ game cards including nostalgia deck
- `artifacts/two-become-one/src/lib/types.ts` — CardType, CoupleProfile, AppState
- `artifacts/mobile/` — Expo React Native mobile app
- `artifacts/mobile/context/AuthContext.tsx` — Google OAuth + local profile auth
- `artifacts/mobile/data/nostalgiaCards.ts` — 29 nostalgia cards (80s–2020s + anniversary era)
- `artifacts/api-server/src/routes/blend.ts` — Two Become One avatar endpoint (Pollinations.ai)
- `artifacts/api-server/src/lib/socketServer.ts` — Real-time game + TV observer logic
- `lib/db/src/schema/` — PostgreSQL schema via Drizzle ORM

## Architecture decisions

- **Auth is Google-first on web**: Google Identity Services (GIS) script handles sign-in. JWT decoded client-side, user persisted to localStorage under `infinite-user` key. No server round-trip for auth state.
- **Auth is local-first on mobile**: Profile stored in SecureStore. Google OAuth via expo-auth-session. Sign out clears all local state.
- **Avatar AI uses Pollinations.ai**: Free, URL-based image generation. Zero API keys, zero signup. No OpenAI dependency.
- **Drift tracking is local**: Card skip patterns stored in localStorage. No server round-trip needed.
- **Real-time via Socket.io**: Room creation, partner joining, choice sync, score tracking. TV Observer mode for second-screen watching.
- **Nostalgia deck is era-aware**: Cards tagged by decade, injected dynamically based on couple anniversary year.

## Product

- **Landing** — Hero + Google Sign-In. Hidden admin panel (7-tap on title).
- **Setup** — Couple profile creation.
- **Dashboard** — Growth score, streak, momentum.
- **Play** — Pass & Play card session. Nostalgia cards injected from anniversary year. QR code for TV Observer.
- **TV Viewer** — Read-only observer mode at `/watch/:code`.
- **Two Become One** — AI portrait generator powered by Pollinations.ai.
- **Archive** — All past sessions.
- **Bonds** — Small couple groups.
- **Mirror** — Love Language & Conflict Style assessments.
- **Journey** — Seasonal relationship programs.

## User preferences

- Token-authenticated GitHub pushes via the GitHub Contents API — do not use Replit GitHub integration.

## Gotchas

- Google Sign In on web uses the GIS script (`accounts.google.com/gsi/client`), NOT a Node.js SDK.
- There is NO `OPENAI_API_KEY` required anywhere in this project — avatar generation uses Pollinations.ai.
- `expo-image-picker` must be added to Expo config (`app.json` plugins) for camera/library access.
- Mobile app uses `expo start --tunnel` for Replit preview (not `--web`).
- Nostalgia cards in web app are ported from `artifacts/mobile/data/nostalgiaCards.ts` — keep both in sync.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- GitHub repo: https://github.com/MikeTjr/Infinite-.git
