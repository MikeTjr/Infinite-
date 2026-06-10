# Infinite Us — 18+ Immersive Couples Card Game Platform

  > *The thunder didn't make her love him more. It just made the moment possible.*

  A living relationship platform — not a quiz, not a checklist. A place where couples do the work, together.

  ## Features

  ### 🃏 The Card Game
  - **260+ cards** across 8 types (Dare, Spark, Reflect, Desire, Ritual, Memory, Vision, Conflict)
  - **3 depth levels**: Surface → Current → Deep
  - Frameworks from Gottman, EFT, Esther Perel, Attachment Theory, Brené Brown, Love Languages
  - Real-time **2-player live sync** via Socket.io — play together, room codes included

  ### 📺 TV Observer Mode (NEW)
  - Any device joins as read-only **TV viewer** at `/watch/:code`
  - Observers see live card state, scores, and player choices in real time
  - Perfect for streaming or big-screen game nights

  ### 🎨 Two Become One — AI Portrait Generator (NEW)
  - Powered by **Pollinations.ai** — free, no API key, no photos needed
  - Enter your couple name + vibe, choose a style (Cartoon, Watercolor, Anime, Painterly)
  - Generates a beautiful AI portrait of your couple instantly

  ### 📊 Growth Score · 🪞 The Mirror · 📖 The Archive · 🌿 The Journey · 🤝 Bonds

  ---

  ## Architecture

  ```
  workspace/
  ├── artifacts/
  │   ├── api-server/         # Express 5 + Socket.io backend
  │   │   └── src/
  │   │       ├── routes/     # blend, admin, rooms, bonds, journey, health
  │   │       └── lib/socketServer.ts  # Real-time game + TV observer
  │   ├── two-become-one/     # React + Vite web app (mounted at /)
  │   └── mobile/             # Expo React Native app
  └── lib/
      ├── api-zod/            # Shared Zod schemas
      └── db/                 # Drizzle ORM + PostgreSQL
  ```

  ## Socket.io Observer Events (NEW)

  | Event | Description |
  |-------|-------------|
  | `join-as-observer` | TV viewer joins room read-only |
  | `observer-joined` | Confirms join with current state |
  | `observer-player-chose` | A player locked in (no choice revealed yet) |
  | `observer-choices-revealed` | Both choices + scores |
  | `observer-card-advanced` | Next card + updated scores |
  | `observer-session-finished` | Game over + final scores |

  ## API Routes

  | Method | Path | Description |
  |--------|------|-------------|
  | `GET` | `/api/health` | Server health |
  | `POST` | `/api/blend` | Generate couple portrait (Pollinations.ai) |
  | `POST` | `/api/rooms` | Create game room |
  | `GET` | `/api/rooms/join/:code` | Join by code |
  | `POST` | `/api/bonds` | Create bond group |
  | `POST` | `/api/journey/start` | Start journey season |
  | `POST` | `/api/admin/verify` | Hidden admin verify |

  ## Hidden Admin
  Tap **"Infinite Us"** title **7 times in 3 seconds** on the landing page to open the admin passphrase modal. Set `ADMIN_PASSPHRASE` as an environment secret.

  ## Environment Variables

  | Variable | Type | Description |
  |----------|------|-------------|
  | `ADMIN_PASSPHRASE` | Secret | Admin modal passphrase |
  | `VITE_GOOGLE_CLIENT_ID` | Env Var | Google OAuth 2.0 client ID |

  ## Tech Stack
  - **Frontend**: React 19, Vite 7, TailwindCSS 4, Framer Motion, socket.io-client
  - **Backend**: Express 5, Socket.io 4, Zod, Pino
  - **AI Portrait**: [Pollinations.ai](https://pollinations.ai) — free, zero API key

  ---
  *18+ adults only. No ads. No data selling. Built for the long haul.*