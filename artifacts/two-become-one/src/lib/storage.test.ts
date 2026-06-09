import { describe, it, expect, beforeEach } from 'vitest';
import { computeStreak, computeMomentum } from './storage';
import { SessionRecord, ScoreHistoryPoint } from './types';

function makeSession(daysAgo: number): SessionRecord {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(12, 0, 0, 0);
  return {
    id: `s-${daysAgo}`,
    date: d.toISOString(),
    cardsPlayed: 5,
    cardsDrifted: 0,
    durationSeconds: 400,
    thisOrThatMatches: 2,
    thisOrThatTotal: 3,
    scoreEarned: 200,
    cardTypes: ['dare'],
  };
}

describe('computeStreak', () => {
  it('returns 0 for empty sessions array', () => {
    expect(computeStreak([])).toBe(0);
  });

  it('returns 1 for a single session today', () => {
    expect(computeStreak([makeSession(0)])).toBe(1);
  });

  it('returns 1 for a single session yesterday', () => {
    expect(computeStreak([makeSession(1)])).toBe(1);
  });

  it('returns 0 for a single session 2 days ago', () => {
    expect(computeStreak([makeSession(2)])).toBe(0);
  });

  it('counts a consecutive 5-day streak', () => {
    const sessions = [0, 1, 2, 3, 4].map(makeSession);
    expect(computeStreak(sessions)).toBe(5);
  });

  it('stops counting at a gap', () => {
    const sessions = [0, 1, 3, 4].map(makeSession);
    expect(computeStreak(sessions)).toBe(2);
  });

  it('handles multiple sessions on the same day (counts as 1)', () => {
    const today = new Date();
    today.setHours(10, 0, 0, 0);
    const today2 = new Date();
    today2.setHours(20, 0, 0, 0);
    const sessions: SessionRecord[] = [
      { ...makeSession(0), id: 'a', date: today.toISOString() },
      { ...makeSession(0), id: 'b', date: today2.toISOString() },
    ];
    expect(computeStreak(sessions)).toBe(1);
  });
});

describe('computeMomentum', () => {
  it('returns steady for empty history', () => {
    expect(computeMomentum([])).toBe('steady');
  });

  it('returns steady for 1-2 entries', () => {
    const history: ScoreHistoryPoint[] = [{ date: '2024-01-01', score: 100, delta: 100 }];
    expect(computeMomentum(history)).toBe('steady');
  });

  it('returns rising when recent average > 80', () => {
    const history: ScoreHistoryPoint[] = Array.from({ length: 5 }, (_, i) => ({
      date: `2024-01-0${i + 1}`,
      score: (i + 1) * 100,
      delta: 90,
    }));
    expect(computeMomentum(history)).toBe('rising');
  });

  it('returns cooling when recent average < 20', () => {
    const history: ScoreHistoryPoint[] = Array.from({ length: 5 }, (_, i) => ({
      date: `2024-01-0${i + 1}`,
      score: (i + 1) * 10,
      delta: 10,
    }));
    expect(computeMomentum(history)).toBe('cooling');
  });

  it('returns steady for average in 20–80 range', () => {
    const history: ScoreHistoryPoint[] = Array.from({ length: 5 }, (_, i) => ({
      date: `2024-01-0${i + 1}`,
      score: (i + 1) * 50,
      delta: 50,
    }));
    expect(computeMomentum(history)).toBe('steady');
  });

  it('uses only the last 5 entries', () => {
    const history: ScoreHistoryPoint[] = [
      ...Array.from({ length: 10 }, (_, i) => ({ date: `2024-01-${i + 1}`, score: i * 5, delta: 5 })),
      ...Array.from({ length: 5 }, (_, i) => ({ date: `2024-02-0${i + 1}`, score: (i + 11) * 100, delta: 95 })),
    ];
    expect(computeMomentum(history)).toBe('rising');
  });
});
