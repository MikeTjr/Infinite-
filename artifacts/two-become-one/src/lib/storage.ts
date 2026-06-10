import { AppState, GrowthScore, GoogleUser } from './types';

const STORAGE_KEY = 'infinite-us-state';
const GOOGLE_USER_KEY = 'infinite-user';

export const DEFAULT_STATE: AppState = {
  couple: null,
  growthScore: {
    total: 0,
    streak: 0,
    history: [],
    momentum: 'steady',
  },
  sessions: [],
  mirror: {},
  bonds: [],
  driftedCards: [],
  retiredCards: [],
  setupComplete: false,
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.error('Failed to save state');
  }
}

export function updateState(updater: (prev: AppState) => AppState): AppState {
  const prev = loadState();
  const next = updater(prev);
  saveState(next);
  return next;
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function computeMomentum(history: GrowthScore['history']): GrowthScore['momentum'] {
  if (history.length < 3) return 'steady';
  const recent = history.slice(-5);
  const avg = recent.reduce((sum, p) => sum + p.delta, 0) / recent.length;
  if (avg > 80) return 'rising';
  if (avg < 20) return 'cooling';
  return 'steady';
}

export function computeStreak(sessions: AppState['sessions']): number {
  if (sessions.length === 0) return 0;
  const sorted = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let currentDate = today;

  for (const session of sorted) {
    const sessionDate = new Date(session.date);
    sessionDate.setHours(0, 0, 0, 0);
    const diff = Math.round((currentDate.getTime() - sessionDate.getTime()) / 86400000);
    
    if (diff === 0 || diff === 1) {
      streak++;
      currentDate = sessionDate;
    } else {
      break;
    }
  }
  return streak;
}

// ─── Google User Persistence ──────────────────────────────────────────────────

export function saveGoogleUser(user: GoogleUser): void {
  try {
    localStorage.setItem(GOOGLE_USER_KEY, JSON.stringify(user));
  } catch {
    console.error('Failed to save Google user');
  }
}

export function loadGoogleUser(): GoogleUser | null {
  try {
    const raw = localStorage.getItem(GOOGLE_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GoogleUser;
  } catch {
    return null;
  }
}

export function clearGoogleUser(): void {
  localStorage.removeItem(GOOGLE_USER_KEY);
}
