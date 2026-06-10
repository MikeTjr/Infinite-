export type CardType = 'thisOrThat' | 'dare' | 'whatIf' | 'challenge' | 'spicy' | 'legacy' | 'repair';

export interface DemoCard {
  id: string;
  type: CardType;
  prompt: string;
  subtext?: string;
  optionA?: string;
  optionB?: string;
  timerSeconds?: number;
}

export const DEMO_QUESTIONS: DemoCard[] = [
  {
    id: 'demo-01',
    type: 'thisOrThat',
    prompt: 'Would you rather...',
    optionA: 'Spend a weekend completely offline together',
    optionB: 'Explore a new city for a weekend',
  },
  {
    id: 'demo-02',
    type: 'whatIf',
    prompt: 'What if we could teleport anywhere in the world right now?',
    subtext: 'Where would we go first, and what would we do there?',
  },
  {
    id: 'demo-03',
    type: 'dare',
    prompt: 'Share your most embarrassing song on your playlist.',
    subtext: 'Play the first 10 seconds for your partner.',
  },
  {
    id: 'demo-04',
    type: 'legacy',
    prompt: 'What is one thing about our relationship that you hope people notice?',
    subtext: 'Think about how others might describe us from the outside.',
  },
  {
    id: 'demo-05',
    type: 'challenge',
    prompt: 'Without using words, express how much you love your partner.',
    timerSeconds: 30,
    subtext: 'You have 30 seconds. No talking — just show it.',
  },
  {
    id: 'demo-06',
    type: 'thisOrThat',
    prompt: 'Would you rather...',
    optionA: 'Cook dinner together every night for a month',
    optionB: 'Have a surprise date planned by your partner every week',
  },
  {
    id: 'demo-07',
    type: 'whatIf',
    prompt: 'What if we had an extra free hour every single day?',
    subtext: 'How would we spend it differently than we do now?',
  },
  {
    id: 'demo-08',
    type: 'repair',
    prompt: 'Name one small thing your partner does that you never properly thanked them for.',
    subtext: 'Say thank you right now — out loud, with eye contact.',
  },
  {
    id: 'demo-09',
    type: 'dare',
    prompt: 'Send one screenshot to your partner right now.',
    subtext: 'Open your phone and show the most recent photo in your camera roll.',
  },
  {
    id: 'demo-10',
    type: 'legacy',
    prompt: 'If our relationship were a movie, what genre would it be?',
    subtext: 'Each of you answers separately, then compare.',
  },
  {
    id: 'demo-11',
    type: 'challenge',
    prompt: 'List five things you love about your partner in under 60 seconds.',
    timerSeconds: 60,
    subtext: 'No repeating. Go.',
  },
  {
    id: 'demo-12',
    type: 'thisOrThat',
    prompt: 'Would you rather...',
    optionA: 'Always know what your partner is thinking',
    optionB: 'Always feel exactly what your partner is feeling',
  },
  {
    id: 'demo-13',
    type: 'whatIf',
    prompt: 'What if we had to describe our relationship in three emojis?',
    subtext: 'Each of you picks three — then explain your choices.',
  },
  {
    id: 'demo-14',
    type: 'dare',
    prompt: 'Let your partner pick what you eat for dinner tonight.',
    subtext: 'No vetoing. Trust the process.',
  },
  {
    id: 'demo-15',
    type: 'repair',
    prompt: 'What is something you wish you said sooner in our relationship?',
    subtext: 'Take turns. No judgment — just honesty.',
  },
];

export const CARD_TYPE_LABELS: Record<CardType, string> = {
  thisOrThat: 'This or That',
  dare: 'Dare',
  whatIf: 'What If',
  challenge: 'Challenge',
  spicy: 'Spicy',
  legacy: 'Legacy',
  repair: 'Repair',
};

export const CARD_TYPE_COLORS: Record<CardType, string> = {
  thisOrThat: '#8b5cf6',
  dare: '#e879a0',
  whatIf: '#0ea5e9',
  challenge: '#f59e0b',
  spicy: '#ef4444',
  legacy: '#7ec8a4',
  repair: '#a78bfa',
};
