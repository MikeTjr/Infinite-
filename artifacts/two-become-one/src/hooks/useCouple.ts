import { useState, useCallback } from 'react';
import { AppState, CoupleProfile, SessionRecord, MirrorResults, Bond, JourneyState } from '../lib/types';
import { loadState, saveState, DEFAULT_STATE } from '../lib/storage';
import { scoreSession, updateGrowthScore } from '../lib/gameLogic';

export function useCouple() {
  const [state, setState] = useState<AppState>(() => loadState());

  const persist = useCallback((next: AppState) => {
    saveState(next);
    setState(next);
  }, []);

  const setCouple = useCallback((couple: CoupleProfile) => {
    const next = loadState();
    persist({ ...next, couple, setupComplete: true });
  }, [persist]);

  const recordSession = useCallback((session: Omit<SessionRecord, 'scoreEarned'>) => {
    const current = loadState();
    const scored = scoreSession(session, current);
    const full: SessionRecord = { ...session, scoreEarned: scored };
    const newGrowth = updateGrowthScore(current, full);
    persist({
      ...current,
      sessions: [...current.sessions, full],
      growthScore: newGrowth,
    });
    return full;
  }, [persist]);

  const driftCard = useCallback((cardId: string) => {
    const current = loadState();
    const existing = current.driftedCards.find(d => d.cardId === cardId);
    let newDrifted = current.driftedCards;
    let newRetired = current.retiredCards;

    if (existing) {
      const newCount = existing.count + 1;
      newDrifted = current.driftedCards.map(d => d.cardId === cardId ? { ...d, count: newCount } : d);
      if (newCount >= 3) newRetired = [...newRetired, cardId];
    } else {
      newDrifted = [...current.driftedCards, { cardId, count: 1 }];
    }
    persist({ ...current, driftedCards: newDrifted, retiredCards: newRetired });
  }, [persist]);

  const saveMirror = useCallback((results: MirrorResults) => {
    const current = loadState();
    persist({ ...current, mirror: { ...current.mirror, ...results } });
  }, [persist]);

  const setJourney = useCallback((journey: JourneyState) => {
    const current = loadState();
    persist({ ...current, journey });
  }, [persist]);

  const addMoodToSession = useCallback((sessionId: string, emoji: string, tag?: string) => {
    const current = loadState();
    persist({
      ...current,
      sessions: current.sessions.map(s =>
        s.id === sessionId ? { ...s, moodEmoji: emoji, momentTag: tag } : s
      ),
    });
  }, [persist]);

  const createBond = useCallback((name: string) => {
    const current = loadState();
    const bond: Bond = {
      id: crypto.randomUUID(),
      name,
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdAt: new Date().toISOString(),
      memberNames: [current.couple?.name || 'Your Couple'],
      collectiveScore: current.growthScore.total,
    };
    persist({ ...current, bonds: [...current.bonds, bond], currentBondId: bond.id });
    return bond;
  }, [persist]);

  const joinBond = useCallback((code: string) => {
    const current = loadState();
    const existing = current.bonds.find(b => b.code === code);
    if (existing) {
      persist({ ...current, currentBondId: existing.id });
      return existing;
    }
    const mockBond: Bond = {
      id: crypto.randomUUID(),
      name: 'Joined Bond',
      code,
      createdAt: new Date().toISOString(),
      memberNames: ['Midnight & Maple', current.couple?.name || 'Your Couple'],
      collectiveScore: 4200 + current.growthScore.total,
    };
    persist({ ...current, bonds: [...current.bonds, mockBond], currentBondId: mockBond.id });
    return mockBond;
  }, [persist]);

  const reset = useCallback(() => {
    persist(DEFAULT_STATE);
  }, [persist]);

  const refresh = useCallback(() => {
    setState(loadState());
  }, []);

  return {
    state,
    setCouple,
    recordSession,
    driftCard,
    saveMirror,
    setJourney,
    addMoodToSession,
    createBond,
    joinBond,
    reset,
    refresh,
  };
}
