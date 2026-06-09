export type CardType = 'dare' | 'this-or-that' | 'what-if' | 'challenge' | 'spicy' | 'thunder' | 'legacy' | 'repair';
export type CardDepth = 'surface' | 'current' | 'deep';

export interface Card {
  id: string;
  type: CardType;
  depth: CardDepth;
  content: string;
  subtext?: string;
  options?: [string, string];
  timerSeconds?: number;
  minSessions?: number;
  framework?: string;
}

export interface AvatarSettings {
  shape: string;
  primaryColor: string;
  secondaryColor: string;
  pattern: string;
  aura: string;
  icon: string;
  background: string;
  animation: string;
}

export const DEFAULT_AVATAR: AvatarSettings = {
  shape: 'circle',
  primaryColor: '#e879a0',
  secondaryColor: '#fda4af',
  pattern: 'none',
  aura: 'rose',
  icon: '♾️',
  background: 'gradient-warm',
  animation: 'pulse',
};

export interface CoupleProfile {
  id: string;
  name: string;
  partner1: string;
  partner2: string;
  avatar: AvatarSettings;
  createdAt: string;
  anniversaryDate?: string;
}

export interface SessionRecord {
  id: string;
  date: string;
  season?: string;
  cardsPlayed: number;
  cardsDrifted: number;
  durationSeconds: number;
  thisOrThatMatches: number;
  thisOrThatTotal: number;
  scoreEarned: number;
  moodEmoji?: string;
  momentTag?: string;
  cardTypes: CardType[];
}

export interface ScoreHistoryPoint {
  date: string;
  score: number;
  delta: number;
}

export interface GrowthScore {
  total: number;
  streak: number;
  lastPlayed?: string;
  history: ScoreHistoryPoint[];
  momentum: 'rising' | 'steady' | 'cooling';
}

export interface MirrorResults {
  loveLanguage?: {
    partner1Result: string;
    partner2Result: string;
    completedAt: string;
  };
  conflictStyle?: {
    partner1Result: 'Pursuer' | 'Withdrawer' | 'Redirector';
    partner2Result: 'Pursuer' | 'Withdrawer' | 'Redirector';
    completedAt: string;
  };
}

export interface Bond {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  memberNames: string[];
  collectiveScore: number;
}

export interface DriftRecord {
  cardId: string;
  count: number;
}

export interface JourneyState {
  currentSeason: string;
  startedAt: string;
  completedDays: number;
}

export interface AppState {
  couple: CoupleProfile | null;
  growthScore: GrowthScore;
  sessions: SessionRecord[];
  mirror: MirrorResults;
  bonds: Bond[];
  currentBondId?: string;
  driftedCards: DriftRecord[];
  journey?: JourneyState;
  retiredCards: string[];
  setupComplete: boolean;
  syncMode?: 'local' | 'live';
}

// ─── Real-Time / WebSocket Types ─────────────────────────────────────────────

export type GameEvent =
  | { type: 'CARD_DRAWN'; cardId: string }
  | { type: 'PARTNER_1_CHOICE'; choice: 'A' | 'B' }
  | { type: 'PARTNER_2_CHOICE'; choice: 'A' | 'B' }
  | { type: 'REVEAL' }
  | { type: 'SESSION_COMPLETE'; scoreEarned: number }
  | { type: 'PHASE_CHANGE'; phase: string }
  | { type: 'PARTNER_JOINED'; partnerName: string }
  | { type: 'PING' }
  | { type: 'PONG' };

export interface RoomState {
  id: string;
  joinCode: string;
  phase: string;
  currentCardId?: string;
  connectedPartners: number;
  stateJson: Record<string, unknown>;
  createdAt: string;
  expiresAt: string;
}
