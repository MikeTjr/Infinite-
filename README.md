# Infinite Us

> *The most serious of games. Built for couples who want more.*

Infinite Us is an immersive, 18+ couples card game platform designed to make partners feel like they just left the world's best couples counselor — thrilled, connected, and changed. It plays on your phone today and is being built toward a full living-room TV experience where the phone becomes the controller.

---

## What It Is

A **relationship growth game** disguised as entertainment. Not a quiz. Not a survey. A **game** — one with real stakes, real laughter, real honesty, and real points. Every session is different because the deck learns from you.

Think of it like: *couples counseling meets an escape room meets a late-night talk show*.

---

## How It Plays

### Pass & Play (Available Now)
One device, passed back and forth. Partners take turns — private choices on *This or That* cards are made face-down, then revealed together. The tension is the point.

### Live Sync (Available Now)
Two devices. Same room (or anywhere). Each partner gets a 6-character room code to join. Choices are made simultaneously and revealed only when **both** have answered. No peeking. The host controls card progression. WebSocket-powered, real-time.

### TV Mode *(Coming Soon)*
Connect your session to a TV screen. The phone becomes a controller — joystick, buzzer, reveal trigger. Pair via QR code scan. The app and TV stay in sync. Think *game show for two, broadcast-quality, played from your couch*.

---

## The Card Deck

Cards are grouped by type, each with its own energy:

| Type | What It Does |
|---|---|
| **This or That** | Choose A or B privately, then reveal. Compare. Discuss. |
| **Legacy** | Slow-burn reflection — who you were, who you are, who you're becoming. |
| **Dare** | Low-risk, high-laugh moments that break routine. |
| **What If** | Hypotheticals designed to surface values neither partner knew the other held. |
| **Challenge** | Timed. Physical. Performative. Get up and do something. |
| **Spicy** | 18+. Desires, longings, intimacy. These cards go *there*. |
| **Repair** | The hardest cards. Things unsaid. Things held. Said safely. |
| **Nostalgia** | Retro trivia and memory prompts tied to the couple's anniversary era. |

### Nostalgia Deck
Cards are personalized to your anniversary year. Met in 2007? Expect MySpace, iPod classics, and the Titanic door debate. 2015? TikTok spirals and Snapchat streaks. The deck spans the 80s through the 2020s and grows with every update.

### Adaptive Card Intelligence
The deck watches for *drift patterns* — cards you skip. After 3 skips on a card type, it's flagged as avoided and reintroduced later at lower stakes. After 5, it's in the hard-avoid queue. The game never punishes a skip. It just pays attention.

---

## Scoring

- **Done** → +10 points (card played)
- **Drift** → 0 points (skip, no judgment — drift is tracked)
- **Finish streak** → Streak bonus multiplier *(coming soon)*
- **Session complete** → Score saved to Growth Score

The **Growth Score** is your cumulative relationship investment, tracked locally. It shows up on your profile and leaderboard. You own it. Reset it anytime.

---

## Features

### Live Sync Game
- Create a room → get a 6-character join code
- Partner joins on their device
- Cards display simultaneously
- Choices locked in privately, revealed when both respond
- Host controls card advancement
- Real-time via WebSocket (socket.io)

### Two Become One (Avatar Generation)
Upload photos of each partner. The AI (GPT-4o Vision → DALL-E 3) generates a stylized couple portrait in your chosen art style: Cartoon, Watercolor, Anime, or Painterly. Processing takes ~20-30 seconds. A mini-game plays while you wait. The result is shown to both partners in private — **nothing goes live until you both approve it.**

### Google Sign In
Native Google OAuth via `expo-auth-session`. Your profile, score, and history stay local on your device. Google sign-in pre-fills your name.

### Adaptive Intelligence Engine
Tracks drift patterns per card type. Surfaces insights like *"You tend to skip Repair cards — we'll pace them back in at a lower stake."* All local. No server needed.

### 24-Hour Progress Saving
Walk away mid-session. Come back within 24 hours and resume exactly where you left off. After 24 hours, the session is cleared automatically.

### Photo Privacy First
Photos used for avatar generation are held in memory only. The result is previewed privately before it's ever shown as your profile. Delete it, redo it, or approve it — on your own terms.

### Profile & Identity
- Set your couple name and individual names
- Add your anniversary date (used to personalize the Nostalgia deck)
- View your Growth Score, streak, and session history
- Reset leaderboard score at any time

---

## The TV Vision *(Roadmap)*

The endgame for Infinite Us is a **living-room game show experience**:

1. Open the TV app on your smart TV (Apple TV, Fire TV, Chromecast, browser)
2. On the phone: scan a QR code or enter a code to pair
3. The TV screen shows the shared game interface — full bleed, cinematic
4. The phone becomes the **controller**: tap to reveal, swipe to drift, hold to think
5. Sound design, transitions, and reveal animations make it feel like a broadcast
6. Bluetooth controller support planned for later versions

This is the arc. Every update moves toward it.

---

## Architecture

```
/
├── artifacts/
│   ├── mobile/          # Expo 53 + React Native (Expo Router v5)
│   │   ├── app/         # Screens: tabs, game, demo, live-game, room-lobby, admin, blend-screen
│   │   ├── context/     # AuthContext (local-first, Google Sign In ready)
│   │   ├── data/        # Card decks: demoQuestions, nostalgiaCards
│   │   └── hooks/       # useDriftTracking, useRoomSync, useSecureStorage
│   └── api-server/      # Express 5 + socket.io + OpenAI
│       └── src/
│           ├── routes/  # health, blend, admin
│           └── lib/     # socketServer (room management), logger
└── lib/
    └── db/              # Drizzle ORM + PostgreSQL schema
```

### Key Architecture Decisions

- **Local-first auth**: Profile stored in SecureStore. No backend required for auth. Google Sign In pre-fills. Sign out clears all local state.
- **Avatar AI pipeline**: GPT-4o Vision (low detail) describes both faces → DALL-E 3 generates portrait. ~3× faster than `gpt-image-1` image edit.
- **WebSocket rooms**: socket.io on a shared HTTP server. Rooms are in-memory (6-hour TTL). No DB needed for real-time play.
- **Drift tracking**: Fully local (SecureStore). No analytics server needed. Intelligence computes offline.
- **Admin access**: Server-side verification only. Passphrase never in the client bundle. 7-tap gesture on the home title opens the admin login (no visible UI link).

---

## Environment Variables

| Key | Where | Purpose |
|---|---|---|
| `DATABASE_URL` | Secret | PostgreSQL connection |
| `OPENAI_API_KEY` | Secret | GPT-4o Vision + DALL-E 3 |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID` | Env var | Google OAuth (mobile) |
| `ADMIN_PASSPHRASE` | Env var | Admin login passphrase |
| `PORT` | Runtime | Server port (auto-assigned) |

---

## Running Locally

```bash
# API Server
pnpm --filter @workspace/api-server run dev

# Mobile (Expo)
pnpm --filter @workspace/mobile run dev
# Opens Expo Go URL — scan with phone or use simulator
```

---

## Admin Access

Admin login is hidden. There is no visible menu option or link. Access it by:

1. Tapping the greeting text on the Home screen **7 times within 3 seconds**
2. Entering the admin passphrase when prompted
3. The passphrase is stored as the `ADMIN_PASSPHRASE` environment variable

The passphrase is verified server-side only — it is never bundled into the mobile app.

---

## Roadmap

- [ ] TV screen app (web-based, WebSocket-synced)
- [ ] QR code room pairing
- [ ] Phone-as-controller interface
- [ ] Persistent leaderboard (couples vs. couples)
- [ ] Deck expansion (new card types, seasonal packs)
- [ ] Couple bond groups (invite friends, shared archive)
- [ ] Sound design + haptic choreography
- [ ] In-app card editor (admin)

---

*Built with care. Played with honesty. For the couples who take love seriously.*
