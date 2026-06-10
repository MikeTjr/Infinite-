# Infinite Us

A relationship growth platform for couples — card sessions, adaptive intelligence, journey tracking, and couple avatar generation.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/mobile run dev` — run the Expo mobile app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `OPENAI_API_KEY` — for avatar (Two Become One) generation

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- Mobile: Expo 53 + Expo Router v5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- AI: OpenAI (GPT-4o Vision + DALL-E 3 for avatar generation)

## Where things live

- `artifacts/mobile/` — Expo React Native mobile app
- `artifacts/mobile/app/` — Expo Router screens (tabs, game, demo, blend-screen, welcome)
- `artifacts/mobile/context/AuthContext.tsx` — Auth state (local profile, sign in/out)
- `artifacts/mobile/data/demoQuestions.ts` — 15 unique demo questions + card type config
- `artifacts/mobile/hooks/useDriftTracking.ts` — Adaptive card intelligence engine
- `artifacts/mobile/app/components/MiniGame.tsx` — Mini-game shown during avatar processing
- `artifacts/api-server/src/routes/blend.ts` — Two Become One avatar endpoint (faster AI)
- `lib/db/src/schema/` — PostgreSQL schema via Drizzle ORM

## Architecture decisions

- **Auth is local-first**: Profile (couple names, avatar) stored in SecureStore. No external auth service required. Sign out clears all local state.
- **Avatar AI uses two-step pipeline**: GPT-4o Vision describes both photos → DALL-E 3 generates portrait. ~2–3× faster than `gpt-image-1` multi-image edit. Trade-off: less photo-accurate, more stylized.
- **Drift tracking is local**: Card skip patterns stored in SecureStore per device. No server round-trip needed for intelligence — patterns compute offline.
- **Progress saving with 24h expiry**: Active game sessions saved to SecureStore with a timestamp. Stale sessions (>24h) are auto-cleared on next open.
- **Photo privacy**: Photos are held in memory only; the AI result is stored as a pending URL in SecureStore and not displayed until the couple approves it.

## Product

- **Home** — Growth score, streak, momentum. Quick access to sessions and demo.
- **Play** — Start a Pass & Play card session. See your drift patterns. Try the 15-question demo.
- **Game** (full-screen modal) — 15-card session with back button, exit + save, drift tracking, timer cards.
- **Demo** (full-screen modal) — 15 unique sample questions to learn the game mechanics. Not in the real deck.
- **Archive** — All past sessions with date, score, card types played.
- **Bonds** — Create/join small couple groups with a shared invite code.
- **Profile** — Edit couple names, anniversary. Reset leaderboard score. Sign out.
- **Two Become One** — Upload photos, see quality warning, mini-game during AI processing, approve avatar in private before it goes live.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `expo-image-picker` must be added to Expo config (`app.json` plugins) for camera/library access on device.
- Google Sign In requires a Google Cloud OAuth client ID — not yet configured. Framework is ready in `AuthContext.tsx`.
- The blend route uses `openai` package — ensure `OPENAI_API_KEY` is set in environment secrets.
- Mobile app uses `expo start --tunnel` for Replit preview (not `--web`).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- GitHub repo: https://github.com/MikeTjr/Infinite-.git (token-authenticated pushes via API)
