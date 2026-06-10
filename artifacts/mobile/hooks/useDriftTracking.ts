import { useCallback } from 'react';
import { useSecureStorage } from './useSecureStorage';
import { CardType } from '../data/demoQuestions';

export interface DriftRecord {
  cardId: string;
  cardType: CardType;
  count: number;
  lastDriftedAt: string;
}

export interface CardIntelligence {
  driftedCards: Record<string, DriftRecord>;
  avoidedTypes: CardType[];
  reintroductionQueue: Array<{ cardType: CardType; stakes: 'low' | 'medium' | 'high' }>;
  totalDrifts: number;
  insights: string[];
}

const DRIFT_THRESHOLD = 3;
const AVOID_THRESHOLD = 5;

const TYPE_INSIGHTS: Record<CardType, string> = {
  thisOrThat: 'You tend to skip choice questions — try the lighter ones first.',
  dare: 'Dares feel uncomfortable right now — we\'ll keep them playful.',
  whatIf: 'Hypotheticals can feel abstract — we\'ll ground them more.',
  challenge: 'Timed challenges create pressure — we\'ll ease back in.',
  spicy: 'You\'re avoiding spicy cards — no rush, they\'ll come back gently.',
  legacy: 'Deep reflection questions feel heavy — we\'ll pace them out.',
  repair: 'Repair cards take courage — we respect that, and we\'ll return.',
};

const DEFAULT_INTELLIGENCE: CardIntelligence = {
  driftedCards: {},
  avoidedTypes: [],
  reintroductionQueue: [],
  totalDrifts: 0,
  insights: [],
};

export function useDriftTracking() {
  const { value: intelligence, set: setIntelligence } = useSecureStorage<CardIntelligence>(
    'card-intelligence',
    DEFAULT_INTELLIGENCE
  );

  const recordDrift = useCallback(
    async (cardId: string, cardType: CardType) => {
      const current = { ...intelligence };
      const existing = current.driftedCards[cardId];

      current.driftedCards[cardId] = {
        cardId,
        cardType,
        count: (existing?.count ?? 0) + 1,
        lastDriftedAt: new Date().toISOString(),
      };

      current.totalDrifts += 1;

      const avoidedTypes = computeAvoidedTypes(current.driftedCards);
      current.avoidedTypes = avoidedTypes;
      current.reintroductionQueue = buildReintroductionQueue(avoidedTypes, current.driftedCards);
      current.insights = avoidedTypes.map((t) => TYPE_INSIGHTS[t]);

      await setIntelligence(current);
    },
    [intelligence, setIntelligence]
  );

  const recordPlay = useCallback(
    async (cardId: string) => {
      const current = { ...intelligence };
      current.reintroductionQueue = current.reintroductionQueue.filter(
        (q) => !cardId.startsWith(q.cardType)
      );
      await setIntelligence(current);
    },
    [intelligence, setIntelligence]
  );

  const getNextCardStakes = useCallback(
    (cardType: CardType): 'low' | 'medium' | 'high' => {
      const item = intelligence.reintroductionQueue.find((q) => q.cardType === cardType);
      if (item) return item.stakes;
      if (intelligence.avoidedTypes.includes(cardType)) return 'low';
      return 'high';
    },
    [intelligence]
  );

  const shouldSuggestBreak = useCallback(
    (recentDrifts: number): boolean => recentDrifts >= 3,
    []
  );

  const resetIntelligence = useCallback(async () => {
    await setIntelligence(DEFAULT_INTELLIGENCE);
  }, [setIntelligence]);

  return {
    intelligence,
    recordDrift,
    recordPlay,
    getNextCardStakes,
    shouldSuggestBreak,
    resetIntelligence,
    avoidedTypes: intelligence.avoidedTypes,
    insights: intelligence.insights,
  };
}

function computeAvoidedTypes(driftedCards: Record<string, DriftRecord>): CardType[] {
  const typeCounts: Partial<Record<CardType, number>> = {};
  for (const record of Object.values(driftedCards)) {
    typeCounts[record.cardType] = (typeCounts[record.cardType] ?? 0) + record.count;
  }

  const avoided: CardType[] = [];
  for (const [type, count] of Object.entries(typeCounts) as [CardType, number][]) {
    if (count >= DRIFT_THRESHOLD) avoided.push(type);
  }
  return avoided;
}

function buildReintroductionQueue(
  avoidedTypes: CardType[],
  driftedCards: Record<string, DriftRecord>
): Array<{ cardType: CardType; stakes: 'low' | 'medium' | 'high' }> {
  const typeCounts: Partial<Record<CardType, number>> = {};
  for (const record of Object.values(driftedCards)) {
    typeCounts[record.cardType] = (typeCounts[record.cardType] ?? 0) + record.count;
  }

  return avoidedTypes.map((cardType) => {
    const count = typeCounts[cardType] ?? 0;
    const stakes: 'low' | 'medium' | 'high' =
      count >= AVOID_THRESHOLD ? 'low' : count >= DRIFT_THRESHOLD ? 'medium' : 'high';
    return { cardType, stakes };
  });
}
