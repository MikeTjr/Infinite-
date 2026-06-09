# Infinite Us — Product Specification

### Version 2.0 · Confidential · Living Document

-----

## The Soul of This Product

One night it was raining. A couple had been married nearly twenty years. The mood wasn’t quite right. Then it thundered outside, and a joke was made, and a joke came back, and then she said something she had been thinking the whole time — how much he meant to her, how much she loved him. And he couldn’t believe she said it. It meant everything.

Had it not thundered, the joke doesn’t happen. The joke doesn’t happen, she doesn’t say what she was already thinking. The moment is lost.

**Infinite Us is the thunder.**

The couple brings everything — their insecurities, their trust, their fears, their joy, their fifty years or their five days, their hopes and failures and dreams. The platform creates the conditions for the moment. They do the rest.

That is not a marketing line. That is the design principle behind every single decision in this product.

-----

## The One-Line Pitch

**Infinite Us is a living relationship platform that creates the conditions for moments couples didn’t know they needed — and makes them want to come back for more.**

-----

## The Problem Worth Solving

Marriage has a perception problem and a practice problem.

The perception problem: younger generations increasingly see marriage as incompatible, risky, not worth the risk. This isn’t entirely wrong. Most people walk into marriage with no real tools, no shared vocabulary, and no practice in the skills that actually make it last.

The practice problem: couples who want to do the work have nowhere to go that isn’t clinical (therapy apps, worksheets) or shallow (generic question cards). Nothing exists that makes the ongoing work of a relationship feel like something worth showing up for — let alone something they can’t put down.

Infinite Us solves the practice problem. When couples have a living platform to grow together — one that learns them, rewards them, and creates conditions for real moments — the perception problem begins to fix itself from the inside out.

-----

## Who This Is For

**Primary user: Committed couples who want more.**

Not couples in crisis requiring intervention. Not people looking for a match. The primary user is a couple — married or seriously committed — who loves each other, knows something could be deeper, and would invest 20 minutes if the experience was genuinely worth their time.

**Specific profiles:**

- Married 2–8 years. The early spark has settled into life. They want to rediscover each other with intention.
- Married 15–30 years. They know each other deeply but have stopped being curious. They want to feel seen again.
- Newly committed. They want to build the right foundation before bad habits form.
- After a hard season. They’re coming back toward each other and need a gentle re-entry point.

**Who this is NOT for (Phase 1):**

- Singles seeking a match
- Couples in acute crisis requiring professional help
- People looking for a social media feed

-----

## The Thunder Principle — Core Design Philosophy

Every feature, every card, every algorithm decision must pass this test:

> *Does this create a condition for a moment the couple wouldn’t have had otherwise?*

If the answer is no, it doesn’t belong in the product.

This means:

- Cards are not information delivery. They are doors.
- The algorithm is not a recommendation engine. It is a weather system.
- Points are not rewards for logging in. They are echoes of real moments.
- The journal is not a diary. It is a record of thunder.

-----

## The Living Algorithm — “The Weather System”

This is the engine that makes Infinite Us unlike anything else. The couple never fully understands it. They just know something is happening.

### What It Tracks (Inputs)

The algorithm builds a silent profile of each couple over time from behavioral signals — not surveys, not self-reporting. Observation only.

**Behavioral signals:**

- Which cards they linger on before advancing
- Which cards they skip (pass mechanic — see below)
- Time of day and day of week they play
- How long a session lasts vs. how long sessions usually last
- Which modes they return to vs. which they try once
- Streak patterns — when they fall off and when they come back
- This-or-that vote patterns — where they match vs. split consistently
- Which card types produce the longest sessions
- Seasonal and milestone data (anniversary month, relationship length)

**What it never tracks:**

- Content of conversations
- Text inputs of any kind
- Location beyond timezone
- Any personally identifiable behavioral data tied to real names

### What It Does (Outputs)

The algorithm uses these signals to:

1. **Shape the next session’s card order.** A couple who consistently lingers on vulnerability-type cards gets more of them, introduced earlier. A couple who always skips physical dares gets them introduced later and more gently.
1. **Detect emotional weather.** Late-night sessions that are shorter than usual signal low energy — the algorithm softens the next session. A couple on a long streak with high engagement gets pushed toward deeper cards.
1. **Create surprise.** Once every several sessions, the algorithm deliberately introduces a card type the couple has never played — their “thunder moment.” The unfamiliar card is the condition for the unexpected moment.
1. **Recognize seasons.** The algorithm knows when a couple’s anniversary month is approaching. It knows when they’ve been off the platform for 3 weeks. It adjusts accordingly without ever announcing that it noticed.
1. **Surface the unsaid.** Over time, split patterns on This or That votes reveal consistent differences in what each partner wants. The algorithm quietly builds sessions that create space for those differences to surface as conversation — not conflict.

### The Pass Mechanic — “The Drift”

Couples need to be able to skip an uncomfortable card without it being uncomfortable. The way this works:

- Every card has a subtle gesture: hold the card edge and let it drift to the side. No button. No “skip” label. Just a drift.
- The card drifts away like a leaf. A new one arrives.
- The algorithm registers the drift silently. No acknowledgment. No penalty.
- Drifted cards are not gone — they re-enter the deck reshaped for a future session when the conditions are different.
- A card that has been drifted three times by the same couple is permanently retired from their deck and replaced with a card that approaches the same territory from a different angle.

**Why this matters:** The discomfort around a card is data. The algorithm uses it. But the couple never feels judged for drifting. It’s subconscious.

-----

## The Growth Score — Redesigned

The Growth Score is not a points system. It is a living measure of relational intentionality. Couples don’t fully know how it’s calculated. They just know it moves when they show up.

### What earns score (weighted, partially opaque to user)

**Visible inputs (couples know these count):**

- Completing a full game session together
- Hitting a streak milestone
- Reaching a Journey season milestone
- Both partners completing a Mirror assessment

**Hidden inputs (couples sense these matter but can’t game them):**

- Session duration relative to their personal average (longer = more points, but the formula is never shown)
- Consistency of return — not just streaks but pattern regularity
- Depth engagement — lingering on a card signals presence; rushing signals distraction
- Surprise card completion — finishing a card type they’ve never played before earns a hidden bonus
- Post-session return rate — coming back within 48 hours after a long session signals connection momentum

**What explicitly does NOT earn score:**

- Simply opening the app
- Logging in without playing
- Completing a session in under 3 minutes (signals skipping through)

### Score Display

- Couples see their total score and a percentile (“Top 11% of couples this month”)
- They see a simple graph — their score over the last 90 days — but not a breakdown of exactly what drove each change
- Monthly leaderboard resets so new couples can compete
- All-time leaderboard rewards longevity
- A “Momentum” indicator shows whether score is trending up, steady, or cooling — represented visually, not numerically

-----

## The Guild System — “Bonds”

Couples don’t just compete individually. They can form Bonds — small groups of couples (3–8 couples maximum) who compete and grow together.

**How Bonds work:**

- One couple creates a Bond and names it — names must be unique across the platform
- They invite other couples by sharing a Bond code
- The Bond has a collective Growth Score — the sum of all member couples’ scores
- Bonds compete on the leaderboard as a unit as well as individually
- Bond members can see each other’s couple avatars and scores — nothing else
- Bonds have a shared milestone wall — when any couple in the Bond hits a milestone, it appears for the group (anonymized to just their couple name and avatar)

**Why Bonds are addictive:**

- The social accountability of a small group creates Duolingo-level return pressure
- Watching another couple in your Bond pull ahead is the exact competitive trigger that makes Candy Crush impossible to put down
- The Bond score means your inactivity affects people you’ve chosen to be accountable to
- Bond milestones create vicarious celebration — you feel good when another couple in your group grows

**Bond names:** Unique, creative, couple-chosen. Examples from the platform suggest poetic directions (“The Storm Chasers,” “Midnight & Maple,” “The Long Way Home”) but couples invent their own. No duplicates allowed globally.

-----

## Avatar System — “Your Face Here”

Every couple builds a shared avatar — their visual identity on the platform. This is their public face. No real names, no photos, no identifying details. Just their avatar.

### Avatar Customization Depth

The goal: **no two avatars look the same.** The system must have enough combinatorial depth that a couple can express themselves fully and still be unique.

**Customization layers:**

- Base form — abstract shape, silhouette, geometric, or illustrated (not realistic human faces)
- Primary color — full spectrum with custom hex input
- Secondary accent color
- Pattern or texture overlay — 40+ options (grain, geometric, organic, celestial, etc.)
- Aura / glow style — the ambient light around the avatar (color, intensity, shape)
- Icon or symbol — chosen from 200+ icons that represent something about the couple
- Background field — what’s behind the avatar (solid, gradient, scene, abstract)
- Animation style — how the avatar moves when idle (pulse, drift, shimmer, breathe, etc.)
- Name treatment — how their couple name is displayed (font family, size, position)
- Season badge — a small rotating element that updates with their current Journey season

**Minimum combinations:** The system should support at minimum 50 billion unique avatar combinations so that accidental similarity is essentially impossible.

**Avatar evolution:** Avatars can be updated anytime, but certain earned elements are locked behind Growth Score milestones — auras, animation styles, and rare icons unlock as the couple grows. This creates visible status without requiring wealth.

-----

## The Couple Journal — “The Archive”

Every session creates an automatic archive entry. Couples never have to write anything. The archive builds itself.

**What gets archived automatically:**

- Date and mode of every session
- Which card types they played (not the specific answers — there are no text answers)
- Their This-or-That vote results — match or split, with the topic category
- Timer challenges completed
- Dares marked done
- Milestones reached
- Growth Score at that session

**What couples can optionally add:**

- A single emoji that captures the session’s mood (chosen from a curated set, not the full emoji keyboard)
- A “moment tag” — a single word or short phrase (max 3 words) that labels the session. Not a description. A name. Like naming a chapter.

**Why this matters:**
After a year of playing, a couple opens their Archive and sees: 47 sessions. 12 dares completed. They matched on 68% of This-or-Thats. Their longest streak was 22 days. There’s a session from their anniversary month labeled “the good night.” There’s one from February labeled “after the hard week.”

That Archive is irreplaceable. It is the cooking diary. It is the record of who they’ve been building together. And it makes leaving the platform feel like losing something real.

-----

## Real-World Incentives — “The Stakes”

The leaderboard needs to mean something outside the screen. This is the layer that separates Infinite Us from every other relationship app.

### Phase 1 — Community Recognition

- Top couples on the monthly leaderboard are featured (by couple name and avatar only) on a public “Wall of Bonds” on the website
- Their couple name is permanently inscribed on an all-time honors list if they reach certain milestones
- Special avatar elements unlock that are only visible to couples who’ve reached certain tiers — visible status markers that other couples will recognize and aspire to

### Phase 2 — Partner Relationships

Build partnerships with brands that align with the platform’s values — experiences, not products.

**Target partner categories:**

- Hotel and travel (anniversary trip upgrades, couples retreat discounts)
- Dining (reservation access, special menus at partner restaurants)
- Experiences (cooking classes, dance lessons, escape rooms — things couples do together)
- Books and content (relationship authors, podcasts, therapist-curated resources)

**How it works:**

- Top couples in each monthly leaderboard tier receive a real-world reward from a partner — delivered digitally (a code, a reservation link, a gift)
- The reward is proportional to tier — top 1% gets the most significant reward
- Partners benefit from association with a values-aligned platform and access to couples who are actively investing in their relationship — a high-quality audience

**Critical:** Rewards are never cash. They are always experiences. Cash cheapens the meaning. An experience deepens it.

### Phase 3 — The Infinite Us Retreat

Once the platform has enough scale and revenue, the highest-scoring couples each year are invited to a real gathering — a weekend experience, location TBD. Not a conference. Not a seminar. An experience designed around the same principles as the game: create conditions for moments that wouldn’t have happened otherwise.

This becomes the aspirational peak of the entire platform. Every couple who hears about it wants to qualify.

-----

## Card System — Full Design

### Card Types

|Type        |Interaction                             |Design Principle                  |
|------------|----------------------------------------|----------------------------------|
|Dare        |Do it together, advance when done       |Physical presence over words      |
|This or That|Simultaneous tap, reveals match or split|Safe disagreement surface         |
|What If     |Read aloud, discuss out loud            |The door into the unsaid          |
|Challenge   |Built-in countdown timer                |Shared pressure creates connection|
|Spicy       |Say it out loud to each other           |Verbal vulnerability as intimacy  |
|Thunder     |Surprise card, unlocked by algorithm    |The unexpected moment             |
|Legacy      |Long-marriage reflection prompts        |Honoring what’s been built        |
|Repair      |Gentle re-entry after conflict          |The path back to each other       |

### Card Depth Layers

Every card exists at three depth levels. The algorithm decides which depth to serve based on the couple’s profile:

- **Surface** — playful, low-stakes, accessible to first-session couples
- **Current** — emotionally engaging, requires some trust and openness
- **Deep** — vulnerable, specific, only served to couples with established engagement history

The same topic can exist at all three levels. A couple is never served Deep cards in their first three sessions.

### Infinite Questions

The card deck is never finite. The AI layer continuously generates new cards within each type and depth level, validated against proven relationship frameworks (Gottman Method, Attachment Theory, Love Languages, Emotionally Focused Therapy principles). Human-curated cards form the foundation. AI-generated cards expand it. All AI-generated cards are reviewed before entering the live deck.

The deck a couple plays tonight is never exactly the deck another couple plays. And it’s never exactly the deck they played last month.

-----

## The Mirror — Self-Knowledge Tools

### Love Language Profile

5 quick scenarios, each with two options. Both partners complete separately. Platform reveals alignment and gaps in plain language — no jargon, no diagnosis.

### Conflict Style Map

6 questions revealing each partner’s pattern under stress: Pursue, Withdraw, or Redirect. Shows how the two styles interact and what that means practically.

### The Attachment Lens (Phase 2)

Brief assessment revealing each partner’s primary attachment style (Secure, Anxious, Avoidant, Disorganized) and how that shapes their behavior in the relationship. Framed as information, not pathology.

### Mirror Output: The Relationship Map

A single visual — updated every 90 days — showing the couple’s alignment profile, their growth areas, and three specific things the platform suggests they explore next. Not a score. A map.

-----

## The Journey — Seasonal Programming

Monthly seasons with curated challenges. Each season has an arc: a beginning, a development, and a milestone moment.

**Phase 1 Seasons:**

- **Rediscovery** — For couples who feel like roommates. 30 days of small prompts.
- **After the Hard Season** — Structured repair with escalating intimacy.
- **Year One** — Foundation-building for new couples.
- **The Long Game** — For couples 15+ years in. Reclaiming curiosity.
- **The Spark** — Intensity and desire. For couples wanting to reignite physical and emotional closeness.

Seasons are evergreen — a couple can enter any season at any time based on where they are, not what month it is.

-----

## Proven Relationship Frameworks — The Academic Foundation

Infinite Us is not invented from intuition. Every card, every algorithm signal, every Mirror question is grounded in one or more of the following:

- **The Gottman Method** — 40+ years of research on what makes marriages succeed or fail. The Four Horsemen (criticism, contempt, defensiveness, stonewalling) and their antidotes inform the Repair mode entirely.
- **Attachment Theory** — Bowlby and Ainsworth’s foundational work, applied by Sue Johnson in Emotionally Focused Therapy. The algorithm’s depth-level gating is based on attachment safety principles.
- **Love Languages** — Gary Chapman’s framework, used as the foundation for the Mirror’s first assessment.
- **Positive Psychology** — Seligman’s PERMA model applied to relationship flourishing.
- **Self-Determination Theory** — Deci and Ryan’s framework for intrinsic motivation. The reason the algorithm is partially opaque: intrinsic motivation is destroyed when rewards become too visible and predictable.

A brief “why this works” section will be available in-app for couples who want to understand the science behind what they’re experiencing.

-----

## Addiction Architecture — The Ethical Version

Infinite Us should be as hard to put down as Candy Crush. But not through manipulation — through genuine value delivery. The distinction matters and must be protected.

**What Candy Crush does that we replicate ethically:**

- Variable reward schedules — you don’t always know what you’ll get next (the algorithm’s surprise mechanic)
- Progress visibility — you can always see how far you’ve come and how far the next milestone is
- Social pressure — your Bond knows when you’ve gone quiet
- Loss aversion — your streak is something real to protect
- Completion loops — every session has a clear end state that triggers the “one more” impulse

**What Candy Crush does that we explicitly do not do:**

- Manufactured difficulty to force retry loops
- Pay-to-win mechanics that create inequality
- Notification spam
- Dark patterns around cancellation or data
- Engineered social comparison designed to create inadequacy

The platform is addictive because it delivers something real every single session. Not because it withholds something artificial.

-----

## Deployment Strategy

### Phase 1: Validation (Months 1–3)

**Goal:** 50 real couples. Not 50,000. Fifty. The only metric that matters is whether they come back a second time.

- Progressive Web App (PWA) on Vercel — free, real URL, installs like an app
- Supabase for database, auth, and real-time room sync
- No monetization
- No app store
- Find first users through direct outreach: marriage communities, faith groups, personal network

### Phase 2: Growth (Months 4–9)

**Goal:** 500 active couples. Leaderboard feels real. Bond system launches.

- Email capture and weekly digest
- Mirror feature live
- Bond system and avatar customization launch
- Couple referral mechanic: “We played Infinite Us — here’s your invite”

### Phase 3: Sustainability (Month 10+)

**Goal:** Proven retention. Revenue activates.

**Monetization (in order of fit):**

1. **Freemium** — Classic mode free forever. Deep, Spicy, Legacy, Repair, Thunder modes behind subscription. ~$7.99/month or $59/year per couple.
1. **Journey Seasons** — Seasonal programming as paid add-on. $4.99/season.
1. **Couples Gift** — Gift a subscription. High conversion around Valentine’s Day, anniversaries, weddings.
1. **Partner Rewards Program** — Revenue share with experience partners. No ads. Only aligned brands.

**What this is never:**

- Ad-supported
- Data-selling
- A marketplace
- A therapy substitute

### Mobile App

Build native (React Native via Expo) when monthly active couples exceed 1,000 and retention data confirms the habit is formed. The PWA handles everything before that point.

-----

## Technical Stack

|Layer             |Technology                                    |Why                       |
|------------------|----------------------------------------------|--------------------------|
|Frontend          |React (built)                                 |Done. Extend it.          |
|Hosting           |Vercel                                        |Free, instant, real URLs  |
|Database          |Supabase                                      |Free tier, auth, real-time|
|Real-time sync    |Supabase Realtime                             |Replaces localStorage hack|
|Algorithm engine  |Supabase Edge Functions + simple scoring logic|No ML needed at Phase 1   |
|AI card generation|Anthropic API (Claude)                        |Already integrated        |
|Payments          |Stripe (Phase 3)                              |Industry standard         |
|Mobile            |Expo / React Native (Phase 3)                 |Shares logic with web     |

**Cost at Phase 1:** $0/month
**Cost at Phase 2 (500 couples):** ~$25/month
**Cost at Phase 3 (5,000 couples):** ~$150/month before revenue

-----

## What Makes This Defensible

Features can be copied. These cannot:

1. **The Archive.** After a year of playing, a couple’s Archive is irreplaceable. Their history lives here. Leaving means losing it.
1. **The Bond community.** A leaderboard with 10,000 couples is harder to replicate than any feature.
1. **The algorithm’s memory.** The longer a couple plays, the better the platform knows them. A new competitor starts from zero.
1. **The brand.** Infinite Us positioned correctly becomes the word couples use when they mean intentional relationship growth. That’s a brand, not an app.
1. **Trust.** An intimate platform lives or dies on trust. It is built slowly and lost instantly. It cannot be manufactured or copied.

-----

## The 90-Day Honest Roadmap

|Week|Focus                                                                            |
|----|---------------------------------------------------------------------------------|
|1–2 |Landing page live, waitlist open, game polished and deployed to real URL         |
|3–4 |Supabase integration — real accounts, real room sync, basic Growth Score tracking|
|5–6 |Pass mechanic (the Drift) and basic algorithm signal collection                  |
|7–8 |Mirror feature: Love Language + Conflict Style                                   |
|9–10|Avatar system v1 — enough depth to feel personal, not yet the full system        |
|11  |Find 50 real couples. Get them playing. Watch what they do.                      |
|12  |Talk to every couple who used it. Build only what those conversations reveal.    |

-----

## The One Thing to Remember

The thunder didn’t make her love him more. It just made the moment possible.

That’s all this platform has to do. Make moments possible that wouldn’t have happened otherwise. Every couple already has everything they need. Infinite Us just has to get out of the way and create the conditions.

Everything in this document is a hypothesis until a real couple proves it right.

-----

*Infinite Us — Built for the long haul. Every last word of it.*
