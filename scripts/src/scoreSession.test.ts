/**
 * Standalone unit tests for core scoring logic.
 * Mirrors the web app's gameLogic.ts in an environment-agnostic way.
 */

import { describe, it, expect } from "vitest";

function computeStreak(sessions: Array<{ date: string }>): number {
  if (sessions.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const uniqueDays = [
    ...new Set(
      sessions.map((s) => {
        const d = new Date(s.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    ),
  ].sort((a, b) => b - a);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (
    uniqueDays[0] !== today.getTime() &&
    uniqueDays[0] !== yesterday.getTime()
  ) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const diff = uniqueDays[i - 1] - uniqueDays[i];
    if (diff === 86_400_000) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function computeMomentum(
  history: Array<{ delta: number }>
): "rising" | "steady" | "cooling" {
  if (history.length < 3) return "steady";
  const recent = history.slice(-5);
  const avg = recent.reduce((sum, h) => sum + h.delta, 0) / recent.length;
  if (avg > 80) return "rising";
  if (avg < 20) return "cooling";
  return "steady";
}

function scoreSession(
  session: {
    cardsPlayed: number;
    durationSeconds: number;
    thisOrThatMatches: number;
    thisOrThatTotal: number;
    cardTypes: string[];
  },
  streak: number,
  recentlySessions: boolean
): number {
  if (session.cardsPlayed < 2) return 0;

  let score = session.cardsPlayed * 40;

  if (session.durationSeconds > 300) score += 50;
  if (session.durationSeconds > 600) score += 50;

  if (session.cardTypes.includes("thunder")) score += 60;

  const deepTypes = ["spicy", "legacy", "repair", "what-if"];
  if (session.cardTypes.some((t) => deepTypes.includes(t))) score += 25;

  if (recentlySessions) score += 30;

  if (streak >= 3) score += Math.min(streak * 10, 100);

  return Math.round(score);
}

describe("computeStreak", () => {
  const day = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(12, 0, 0, 0);
    return { date: d.toISOString() };
  };

  it("returns 0 for empty sessions", () => {
    expect(computeStreak([])).toBe(0);
  });

  it("returns 1 for session today", () => {
    expect(computeStreak([day(0)])).toBe(1);
  });

  it("returns 1 for session yesterday", () => {
    expect(computeStreak([day(1)])).toBe(1);
  });

  it("returns 0 for session 2 days ago", () => {
    expect(computeStreak([day(2)])).toBe(0);
  });

  it("counts 5-day consecutive streak", () => {
    expect(computeStreak([day(0), day(1), day(2), day(3), day(4)])).toBe(5);
  });

  it("breaks on gap", () => {
    expect(computeStreak([day(0), day(1), day(3), day(4)])).toBe(2);
  });

  it("deduplicates same-day sessions", () => {
    const d = new Date();
    d.setHours(10, 0, 0, 0);
    const d2 = new Date();
    d2.setHours(20, 0, 0, 0);
    expect(computeStreak([{ date: d.toISOString() }, { date: d2.toISOString() }])).toBe(1);
  });
});

describe("computeMomentum", () => {
  it("returns steady for < 3 entries", () => {
    expect(computeMomentum([{ delta: 200 }, { delta: 300 }])).toBe("steady");
  });

  it("returns rising for avg > 80", () => {
    const history = Array.from({ length: 5 }, () => ({ delta: 90 }));
    expect(computeMomentum(history)).toBe("rising");
  });

  it("returns cooling for avg < 20", () => {
    const history = Array.from({ length: 5 }, () => ({ delta: 10 }));
    expect(computeMomentum(history)).toBe("cooling");
  });

  it("returns steady for avg in 20–80 range", () => {
    const history = Array.from({ length: 5 }, () => ({ delta: 50 }));
    expect(computeMomentum(history)).toBe("steady");
  });

  it("uses only last 5 entries for rising", () => {
    const old = Array.from({ length: 10 }, () => ({ delta: 5 }));
    const recent = Array.from({ length: 5 }, () => ({ delta: 95 }));
    expect(computeMomentum([...old, ...recent])).toBe("rising");
  });
});

describe("scoreSession", () => {
  const base = {
    cardsPlayed: 5,
    durationSeconds: 400,
    thisOrThatMatches: 2,
    thisOrThatTotal: 3,
    cardTypes: ["dare"],
  };

  it("returns 0 for < 2 cards", () => {
    expect(scoreSession({ ...base, cardsPlayed: 1 }, 0, false)).toBe(0);
  });

  it("awards 40 points per card", () => {
    const score = scoreSession({ ...base, durationSeconds: 100, cardTypes: [] }, 0, false);
    expect(score).toBe(200);
  });

  it("awards +50 bonus for sessions > 5 min", () => {
    const short = scoreSession({ ...base, durationSeconds: 100, cardTypes: [] }, 0, false);
    const long = scoreSession({ ...base, durationSeconds: 310, cardTypes: [] }, 0, false);
    expect(long - short).toBe(50);
  });

  it("awards +50 more bonus for sessions > 10 min", () => {
    const fiveMin = scoreSession({ ...base, durationSeconds: 310, cardTypes: [] }, 0, false);
    const tenMin = scoreSession({ ...base, durationSeconds: 610, cardTypes: [] }, 0, false);
    expect(tenMin - fiveMin).toBe(50);
  });

  it("awards +60 for thunder card type", () => {
    const without = scoreSession({ ...base, cardTypes: [] }, 0, false);
    const with_ = scoreSession({ ...base, cardTypes: ["thunder"] }, 0, false);
    expect(with_ - without).toBe(60);
  });

  it("awards +25 for spicy/legacy/repair/what-if types", () => {
    const without = scoreSession({ ...base, cardTypes: [] }, 0, false);
    const withDeep = scoreSession({ ...base, cardTypes: ["spicy"] }, 0, false);
    expect(withDeep - without).toBe(25);
  });

  it("awards +30 for recent sessions bonus", () => {
    const without = scoreSession({ ...base, cardTypes: [] }, 0, false);
    const withRecent = scoreSession({ ...base, cardTypes: [] }, 0, true);
    expect(withRecent - without).toBe(30);
  });

  it("awards streak bonus for streak >= 3", () => {
    const noStreak = scoreSession({ ...base, cardTypes: [] }, 2, false);
    const withStreak = scoreSession({ ...base, cardTypes: [] }, 3, false);
    expect(withStreak).toBeGreaterThan(noStreak);
  });

  it("caps streak bonus at 100", () => {
    const bigStreak = scoreSession({ ...base, cardTypes: [] }, 100, false);
    const cappedStreak = scoreSession({ ...base, cardTypes: [] }, 50, false);
    expect(bigStreak).toBe(cappedStreak);
  });
});
