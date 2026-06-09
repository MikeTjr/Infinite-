import { describe, it, expect } from 'vitest';
import { scoreSession, updateGrowthScore, getLeaderboardEntries } from './gameLogic';
import { computeStreak, computeMomentum } from './storage';
import { AppState, SessionRecord } from './types';

const makeState = (overrides: Partial<AppState> = {}): AppState => ({
  couple: null,
  growthScore: { total: 0, streak: 0, history: [], momentum: 'steady' },
  sessions: [],
  mirror: {},
  bonds: [],
  driftedCards: [],
  retiredCards: [],
  setupComplete: false,
  ...overrides,
});

const makeSession = (overrides: Partial<Omit<SessionRecord, 'scoreEarned'>> = {}): Omit<SessionRecord, 'scoreEarned'> => ({
  id: 'test-session',
  date: new Date().toISOString(),
  cardsPlayed: 5,
  cardsDrifted: 0,
  durationSeconds: 400,
  thisOrThatMatches: 2,
  thisOrThatTotal: 3,
  cardTypes: ['dare', 'what-if'],
  ...overrides,
});

describe('scoreSession', () => {
  it('returns 0 for sessions with fewer than 2 cards', () => {
    const score = scoreSession(makeSession({ cardsPlayed: 1 }), makeState());
    expect(score).toBe(0);
  });

  it('awards 40 points per card played', () => {
    const session = makeSession({ cardsPlayed: 3, durationSeconds: 100 });
    const score = scoreSession(session, makeState());
    expect(score).toBeGreaterThanOrEqual(120);
  });

  it('awards bonus for sessions over 5 minutes', () => {
    const shortScore = scoreSession(makeSession({ durationSeconds: 100 }), makeState());
    const longScore = scoreSession(makeSession({ durationSeconds: 310 }), makeState());
    expect(longScore).toBeGreaterThan(shortScore);
  });

  it('awards bonus for sessions over 10 minutes', () => {
    const fiveMin = scoreSession(makeSession({ durationSeconds: 310 }), makeState());
    const tenMin = scoreSession(makeSession({ durationSeconds: 650 }), makeState());
    expect(tenMin).toBeGreaterThan(fiveMin);
  });

  it('awards 60 bonus for thunder cards', () => {
    const without = scoreSession(makeSession({ cardTypes: ['dare'] }), makeState());
    const with_ = scoreSession(makeSession({ cardTypes: ['dare', 'thunder'] }), makeState());
    expect(with_ - without).toBe(60);
  });

  it('awards 25 bonus for deep card types', () => {
    const without = scoreSession(makeSession({ cardTypes: ['dare'] }), makeState());
    const with_ = scoreSession(makeSession({ cardTypes: ['dare', 'spicy'] }), makeState());
    expect(with_ - without).toBe(25);
  });

  it('awards 30 bonus for sessions within 48 hours of last session', () => {
    const recent = new Date();
    recent.setHours(recent.getHours() - 24);
    const state = makeState({
      sessions: [{ id: 'prev', date: recent.toISOString(), cardsPlayed: 3, cardsDrifted: 0, durationSeconds: 200, thisOrThatMatches: 0, thisOrThatTotal: 0, scoreEarned: 120, cardTypes: ['dare'] }],
    });
    const withRecent = scoreSession(makeSession(), state);
    const withoutRecent = scoreSession(makeSession(), makeState());
    expect(withRecent - withoutRecent).toBe(30);
  });

  it('awards streak bonuses for 3+ day streaks', () => {
    const dates = Array.from({ length: 3 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (2 - i));
      return d.toISOString();
    });
    const state = makeState({
      sessions: dates.map((date, i) => ({
        id: `s${i}`,
        date,
        cardsPlayed: 3,
        cardsDrifted: 0,
        durationSeconds: 200,
        thisOrThatMatches: 0,
        thisOrThatTotal: 0,
        scoreEarned: 120,
        cardTypes: ['dare'],
      })),
    });
    const scoreWithStreak = scoreSession(makeSession(), state);
    const scoreNoStreak = scoreSession(makeSession(), makeState());
    expect(scoreWithStreak).toBeGreaterThan(scoreNoStreak);
  });
});

describe('updateGrowthScore', () => {
  it('adds session score to total', () => {
    const state = makeState();
    const session: SessionRecord = { ...makeSession(), scoreEarned: 200 };
    const result = updateGrowthScore(state, session);
    expect(result.total).toBe(200);
  });

  it('appends to history (up to 90 entries)', () => {
    const longHistory = Array.from({ length: 90 }, (_, i) => ({
      date: new Date(Date.now() - i * 86400000).toISOString(),
      score: i * 100,
      delta: 100,
    }));
    const state = makeState({ growthScore: { total: 9000, streak: 0, history: longHistory, momentum: 'steady' } });
    const session: SessionRecord = { ...makeSession(), scoreEarned: 100 };
    const result = updateGrowthScore(state, session);
    expect(result.history.length).toBe(90);
  });

  it('sets lastPlayed to session date', () => {
    const state = makeState();
    const session: SessionRecord = { ...makeSession(), scoreEarned: 100 };
    const result = updateGrowthScore(state, session);
    expect(result.lastPlayed).toBe(session.date);
  });
});

describe('computeStreak', () => {
  it('returns 0 for empty sessions', () => {
    expect(computeStreak([])).toBe(0);
  });

  it('counts consecutive day sessions', () => {
    const sessions = Array.from({ length: 3 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (2 - i));
      d.setHours(12, 0, 0, 0);
      return {
        id: `s${i}`,
        date: d.toISOString(),
        cardsPlayed: 3,
        cardsDrifted: 0,
        durationSeconds: 200,
        thisOrThatMatches: 0,
        thisOrThatTotal: 0,
        scoreEarned: 120,
        cardTypes: ['dare'] as SessionRecord['cardTypes'],
      };
    });
    expect(computeStreak(sessions)).toBe(3);
  });

  it('breaks streak on gap day', () => {
    const sessions = [
      { id: 's1', date: new Date(Date.now() - 4 * 86400000).toISOString(), cardsPlayed: 3, cardsDrifted: 0, durationSeconds: 200, thisOrThatMatches: 0, thisOrThatTotal: 0, scoreEarned: 120, cardTypes: ['dare'] as SessionRecord['cardTypes'] },
      { id: 's2', date: new Date(Date.now() - 3 * 86400000).toISOString(), cardsPlayed: 3, cardsDrifted: 0, durationSeconds: 200, thisOrThatMatches: 0, thisOrThatTotal: 0, scoreEarned: 120, cardTypes: ['dare'] as SessionRecord['cardTypes'] },
    ];
    expect(computeStreak(sessions)).toBe(0);
  });
});

describe('computeMomentum', () => {
  it('returns steady for short history', () => {
    expect(computeMomentum([{ date: '2024-01-01', score: 100, delta: 50 }])).toBe('steady');
  });

  it('returns rising when avg delta > 80', () => {
    const history = Array.from({ length: 5 }, (_, i) => ({
      date: `2024-01-0${i + 1}`,
      score: (i + 1) * 100,
      delta: 100,
    }));
    expect(computeMomentum(history)).toBe('rising');
  });

  it('returns cooling when avg delta < 20', () => {
    const history = Array.from({ length: 5 }, (_, i) => ({
      date: `2024-01-0${i + 1}`,
      score: (i + 1) * 10,
      delta: 10,
    }));
    expect(computeMomentum(history)).toBe('cooling');
  });
});

describe('getLeaderboardEntries', () => {
  it('includes the current couple in results', () => {
    const entries = getLeaderboardEntries(5000, 'Test Couple');
    const mine = entries.find(e => e.isYou);
    expect(mine).toBeDefined();
    expect(mine?.name).toBe('Test Couple');
    expect(mine?.score).toBe(5000);
  });

  it('sorts by score descending', () => {
    const entries = getLeaderboardEntries(99999, 'Top Couple');
    expect(entries[0].rank).toBe(1);
    expect(entries[0].isYou).toBe(true);
  });

  it('returns at least 10 entries (seeded + current)', () => {
    const entries = getLeaderboardEntries(0, 'Last Place');
    expect(entries.length).toBeGreaterThanOrEqual(10);
  });
});
