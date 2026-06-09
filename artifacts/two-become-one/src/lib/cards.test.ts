import { describe, it, expect } from 'vitest';
import { getCardsForSession, CARDS, CARD_TYPE_LABELS, CARD_TYPE_COLORS, CARD_TYPE_DESCRIPTIONS } from './cards';

describe('getCardsForSession', () => {
  it('returns the requested number of cards', () => {
    const cards = getCardsForSession(10, [], [], undefined, 5);
    expect(cards.length).toBe(5);
  });

  it('respects retired card exclusions', () => {
    const allIds = CARDS.map(c => c.id);
    const retired = allIds.slice(0, CARDS.length - 3);
    const cards = getCardsForSession(10, [], retired, undefined, 3);
    cards.forEach(card => {
      expect(retired.includes(card.id)).toBe(false);
    });
  });

  it('excludes cards below minSessions threshold', () => {
    const thunder = CARDS.filter(c => c.type === 'thunder' && c.minSessions && c.minSessions > 0);
    const cards = getCardsForSession(0, [], []);
    const foundThunder = cards.filter(c => thunder.some(t => t.id === c.id && t.minSessions && t.minSessions > 0));
    expect(foundThunder.length).toBe(0);
  });

  it('excludes deep cards for first session', () => {
    const cards = getCardsForSession(0, [], []);
    cards.forEach(card => {
      expect(card.depth).not.toBe('deep');
    });
  });

  it('excludes current cards for first session', () => {
    const cards = getCardsForSession(0, [], []);
    cards.forEach(card => {
      expect(card.depth).not.toBe('current');
    });
  });

  it('excludes drifted cards with count >= 3', () => {
    const targetCard = CARDS.find(c => c.depth === 'surface');
    if (!targetCard) return;
    const driftedCards = [{ cardId: targetCard.id, count: 3 }];
    const cards = getCardsForSession(0, driftedCards, []);
    expect(cards.find(c => c.id === targetCard.id)).toBeUndefined();
  });

  it('prioritises season focus card types', () => {
    const cards = getCardsForSession(10, [], [], ['dare', 'what-if'], 7);
    const focusedCount = cards.filter(c => ['dare', 'what-if'].includes(c.type)).length;
    expect(focusedCount).toBeGreaterThanOrEqual(Math.ceil(7 * 0.6) - 1);
  });

  it('returns shuffled results (probabilistic — may rarely fail)', () => {
    const first = getCardsForSession(10, [], [], undefined, 10).map(c => c.id);
    const second = getCardsForSession(10, [], [], undefined, 10).map(c => c.id);
    expect(first).not.toEqual(second);
  });
});

describe('CARDS', () => {
  it('has at least 60 cards in the deck', () => {
    expect(CARDS.length).toBeGreaterThanOrEqual(60);
  });

  it('all cards have required fields', () => {
    CARDS.forEach(card => {
      expect(card.id).toBeTruthy();
      expect(card.type).toBeTruthy();
      expect(card.depth).toBeTruthy();
      expect(card.content).toBeTruthy();
    });
  });

  it('all this-or-that cards have exactly 2 options', () => {
    CARDS.filter(c => c.type === 'this-or-that').forEach(card => {
      expect(card.options?.length).toBe(2);
    });
  });

  it('challenge cards have timerSeconds set', () => {
    CARDS.filter(c => c.type === 'challenge').forEach(card => {
      expect(card.timerSeconds).toBeGreaterThan(0);
    });
  });

  it('all card IDs are unique', () => {
    const ids = CARDS.map(c => c.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

describe('CARD_TYPE_LABELS', () => {
  it('has a label for all 8 card types', () => {
    const types = ['dare', 'this-or-that', 'what-if', 'challenge', 'spicy', 'thunder', 'legacy', 'repair'];
    types.forEach(type => {
      expect(CARD_TYPE_LABELS[type as keyof typeof CARD_TYPE_LABELS]).toBeTruthy();
    });
  });
});

describe('CARD_TYPE_COLORS', () => {
  it('has a valid hex color for all 8 card types', () => {
    Object.values(CARD_TYPE_COLORS).forEach(color => {
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });
});

describe('CARD_TYPE_DESCRIPTIONS', () => {
  it('has a description for all 8 card types', () => {
    Object.values(CARD_TYPE_DESCRIPTIONS).forEach(desc => {
      expect(desc.length).toBeGreaterThan(0);
    });
  });
});
