import { SessionRecord, AppState, GrowthScore } from './types';
import { computeMomentum, computeStreak } from './storage';

export function scoreSession(session: Omit<SessionRecord, 'scoreEarned'>, state: AppState): number {
  let score = 0;

  if (session.cardsPlayed < 2) return 0;

  score += session.cardsPlayed * 40;

  if (session.durationSeconds > 300) score += 40;
  if (session.durationSeconds > 600) score += 40;

  const avgDuration = state.sessions.length > 0
    ? state.sessions.reduce((s, r) => s + r.durationSeconds, 0) / state.sessions.length
    : 0;
  if (avgDuration > 0 && session.durationSeconds > avgDuration * 1.2) score += 30;

  const hasThunder = session.cardTypes.includes('thunder');
  if (hasThunder) score += 60;

  const hasDeep = session.cardTypes.some(t => ['spicy', 'legacy', 'repair'].includes(t));
  if (hasDeep) score += 25;

  const lastSession = state.sessions[state.sessions.length - 1];
  if (lastSession) {
    const lastDate = new Date(lastSession.date);
    const now = new Date(session.date);
    const hoursDiff = (now.getTime() - lastDate.getTime()) / 3600000;
    if (hoursDiff < 48) score += 30;
  }

  const streak = computeStreak(state.sessions);
  if (streak >= 3) score += 50;
  if (streak >= 7) score += 100;
  if (streak >= 14) score += 200;
  if (streak >= 30) score += 500;

  return Math.round(score);
}

export function updateGrowthScore(state: AppState, session: SessionRecord): GrowthScore {
  const newTotal = state.growthScore.total + session.scoreEarned;
  const newHistory = [
    ...state.growthScore.history,
    { date: session.date, score: newTotal, delta: session.scoreEarned },
  ].slice(-90);
  const newStreak = computeStreak([...state.sessions, session]);
  const momentum = computeMomentum(newHistory);

  return {
    total: newTotal,
    streak: newStreak,
    lastPlayed: session.date,
    history: newHistory,
    momentum,
  };
}

export function getLeaderboardEntries(myScore: number, myName: string): Array<{ rank: number; name: string; score: number; isYou?: boolean }> {
  const seed = [
    { name: 'The Storm Chasers', score: 18420 },
    { name: 'Midnight & Maple', score: 15890 },
    { name: 'The Long Way Home', score: 14200 },
    { name: 'Golden Hours', score: 12750 },
    { name: 'Two Moons', score: 11340 },
    { name: 'Wildfire & Rain', score: 9870 },
    { name: 'The Quiet House', score: 8650 },
    { name: 'Papercut & Honey', score: 7400 },
    { name: 'Soft Thunder', score: 6200 },
    { name: 'Always Already', score: 4900 },
  ];

  const all = [...seed, { name: myName || 'Your Couple', score: myScore, isYou: true }];
  const sorted = all.sort((a, b) => b.score - a.score);
  return sorted.map((entry, i) => ({ ...entry, rank: i + 1 }));
}

export const LOVE_LANGUAGE_QUESTIONS = [
  {
    id: 'll1',
    scenario: 'After a tough week, what would mean more to you?',
    optionA: 'Your partner plans a special outing — just the two of you',
    optionB: 'Your partner tells you exactly why you make them proud',
    a: 'Quality Time',
    b: 'Words of Affirmation',
  },
  {
    id: 'll2',
    scenario: 'You\'re feeling disconnected. What would bring you back?',
    optionA: 'A long hug that doesn\'t end too quickly',
    optionB: 'Your partner takes something off your plate without being asked',
    a: 'Physical Touch',
    b: 'Acts of Service',
  },
  {
    id: 'll3',
    scenario: 'Your partner wants to show love on an ordinary Tuesday. What lands most?',
    optionA: 'A small, specific gift they saw and thought of you',
    optionB: 'Putting the phone away and just being with you',
    a: 'Receiving Gifts',
    b: 'Quality Time',
  },
  {
    id: 'll4',
    scenario: 'You had a hard conversation. What helps you feel resolved?',
    optionA: 'They reach over and hold your hand',
    optionB: 'They say clearly: "I love you. We\'re okay."',
    a: 'Physical Touch',
    b: 'Words of Affirmation',
  },
  {
    id: 'll5',
    scenario: 'You\'re feeling unappreciated. What would fix it?',
    optionA: 'They handle something you\'ve been dreading',
    optionB: 'They write you a note — something real, not a text',
    a: 'Acts of Service',
    b: 'Receiving Gifts',
  },
];

export const CONFLICT_STYLE_QUESTIONS = [
  {
    id: 'cs1',
    question: 'When an argument starts, your first instinct is to...',
    options: [
      { text: 'Lean in — say what needs to be said now', style: 'Pursuer' },
      { text: 'Step back — you need a minute before you can speak', style: 'Withdrawer' },
      { text: 'Shift gears — find common ground before it escalates', style: 'Redirector' },
    ],
  },
  {
    id: 'cs2',
    question: 'When your partner shuts down during a fight...',
    options: [
      { text: 'You push harder — silence feels like abandonment', style: 'Pursuer' },
      { text: 'You pull back too — pressure makes it worse', style: 'Withdrawer' },
      { text: 'You try to name what\'s happening and slow things down', style: 'Redirector' },
    ],
  },
  {
    id: 'cs3',
    question: 'After a difficult conversation, you feel better when...',
    options: [
      { text: 'You\'ve said everything and gotten a response', style: 'Pursuer' },
      { text: 'You\'ve had time alone to process before reconnecting', style: 'Withdrawer' },
      { text: 'You\'ve found the thing you both agree on', style: 'Redirector' },
    ],
  },
  {
    id: 'cs4',
    question: 'Your biggest fear in conflict is...',
    options: [
      { text: 'That things will go unresolved and fester', style: 'Pursuer' },
      { text: 'That the emotion will overwhelm you both', style: 'Withdrawer' },
      { text: 'That you\'ll win the argument but lose the connection', style: 'Redirector' },
    ],
  },
  {
    id: 'cs5',
    question: 'When things are tense, you\'re most likely to...',
    options: [
      { text: 'Say the hard thing — you\'d rather face it head-on', style: 'Pursuer' },
      { text: 'Go quiet — not because you don\'t care, but because words fail', style: 'Withdrawer' },
      { text: 'Make a joke, change the subject, or suggest a break', style: 'Redirector' },
    ],
  },
  {
    id: 'cs6',
    question: 'You feel safest in conflict when your partner...',
    options: [
      { text: 'Stays in it with you — doesn\'t walk away', style: 'Pursuer' },
      { text: 'Gives you room to breathe before coming back', style: 'Withdrawer' },
      { text: 'Focuses on the issue, not the intensity', style: 'Redirector' },
    ],
  },
];

export const MOOD_EMOJIS = ['✨', '🌿', '🔥', '🌊', '💜', '🌙', '☀️', '🫂', '💫', '🕊️', '🌹', '⚡'];

export const AVATAR_SHAPES = ['circle', 'heart', 'star', 'shield', 'diamond', 'infinity', 'hexagon', 'cloud'];
export const AVATAR_PATTERNS = ['none', 'dots', 'lines', 'waves', 'grid', 'floral', 'geometric', 'stars', 'organic', 'grain'];
export const AVATAR_AURAS = ['none', 'gold', 'rose', 'violet', 'teal', 'coral', 'sky', 'midnight'];
export const AVATAR_ICONS = ['♾️','💫','🌙','✨','🌿','🌊','🔥','⚡','🌹','🕊️','🌸','🍃','💜','🌟','🦋','🌈','🪐','❄️','🌺','🍀'];
export const AVATAR_BACKGROUNDS = ['gradient-warm', 'gradient-cool', 'gradient-dusk', 'solid-dark', 'solid-light', 'pattern-stars', 'pattern-waves', 'gradient-forest'];
export const AVATAR_ANIMATIONS = ['pulse', 'drift', 'shimmer', 'breathe', 'glow'];
