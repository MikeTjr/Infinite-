import { Card } from './types';

export const CARDS: Card[] = [
  // ─── DARE ───────────────────────────────────────────────
  { id: 'd1', type: 'dare', depth: 'surface', content: 'Give your partner the longest hug you\'ve given in the last month. Don\'t let go first.', subtext: 'Hold until it naturally ends.' },
  { id: 'd2', type: 'dare', depth: 'surface', content: 'Recreate your first photo together — same pose, same energy. Take it now.', subtext: 'Use whatever you have around.' },
  { id: 'd3', type: 'dare', depth: 'surface', content: 'Slow dance together for one full song — right now, wherever you are.', subtext: 'Pick a song that means something.' },
  { id: 'd4', type: 'dare', depth: 'current', content: 'Write three things you notice about your partner that you\'ve never said out loud. Read them aloud.', subtext: 'Specific. Not generic.' },
  { id: 'd5', type: 'dare', depth: 'current', content: 'Look your partner in the eyes without speaking for 60 seconds. Just look.', subtext: 'No phones. Just presence.' },
  { id: 'd6', type: 'dare', depth: 'current', content: 'Cook or prepare something your partner loves — right now or schedule it for within 48 hours.', subtext: 'Commit to the time before you advance.' },
  { id: 'd7', type: 'dare', depth: 'deep', content: 'Tell your partner the moment you knew you were in love. Be specific. Tell the story.', subtext: 'Don\'t summarize. Relive it.' },
  { id: 'd8', type: 'dare', depth: 'deep', content: 'Hold your partner\'s face in your hands and tell them one thing you\'ve been afraid to say.', subtext: 'You both have something. This is the time.' },

  // ─── THIS OR THAT ───────────────────────────────────────
  { id: 't1', type: 'this-or-that', depth: 'surface', content: 'How do you prefer to spend a Saturday morning?', options: ['Sleeping in late', 'Up early, coffee & quiet'] },
  { id: 't2', type: 'this-or-that', depth: 'surface', content: 'When you need to decompress, you prefer...', options: ['Total alone time', 'Being with your person'] },
  { id: 't3', type: 'this-or-that', depth: 'surface', content: 'Your ideal vacation is...', options: ['Adventure & exploring', 'Rest & doing nothing'] },
  { id: 't4', type: 'this-or-that', depth: 'surface', content: 'When life gets hard, your first instinct is...', options: ['Talk it through', 'Sit with it quietly first'] },
  { id: 't5', type: 'this-or-that', depth: 'current', content: 'What you need most right now is...', options: ['More quality time together', 'More space to be yourself'] },
  { id: 't6', type: 'this-or-that', depth: 'current', content: 'In this relationship, you more often feel...', options: ['Seen and known', 'Still figuring out how to be seen'] },
  { id: 't7', type: 'this-or-that', depth: 'current', content: 'When your partner is stressed, your instinct is...', options: ['Fix it for them', 'Just be near them'] },
  { id: 't8', type: 'this-or-that', depth: 'current', content: 'You feel most loved when your partner...', options: ['Does something for you', 'Tells you how they feel'] },
  { id: 't9', type: 'this-or-that', depth: 'deep', content: 'What scares you more in this relationship?', options: ['Growing apart', 'Never being fully known'] },
  { id: 't10', type: 'this-or-that', depth: 'deep', content: 'The thing you protect most in yourself is...', options: ['Your independence', 'Your heart'] },

  // ─── WHAT IF ────────────────────────────────────────────
  { id: 'w1', type: 'what-if', depth: 'surface', content: 'What if you could relive one day from your relationship — any day — which would you choose?', subtext: 'Share why.' },
  { id: 'w2', type: 'what-if', depth: 'surface', content: 'What if you had met 10 years earlier? What would have been different?', subtext: 'Discuss together.' },
  { id: 'w3', type: 'what-if', depth: 'surface', content: 'What if money was completely off the table — what would your ideal life together look like?', subtext: 'Paint the picture.' },
  { id: 'w4', type: 'what-if', depth: 'current', content: 'What if you could know — with certainty — one thing about your future together? What would you want to know?', subtext: 'And why that thing?' },
  { id: 'w5', type: 'what-if', depth: 'current', content: 'What if your relationship had a theme song right now — what would it be, and why?', subtext: 'Be honest.' },
  { id: 'w6', type: 'what-if', depth: 'current', content: 'What if you could go back and do one thing differently in this relationship? Not regret — just redirect.', subtext: 'What would you change?' },
  { id: 'w7', type: 'what-if', depth: 'deep', content: 'What if your partner could hear every thought you had about them for one week — would you be afraid of anything?', subtext: 'What would you want them to understand?' },
  { id: 'w8', type: 'what-if', depth: 'deep', content: 'What if the version of you that existed before this relationship could see you now — what would surprise them most?', subtext: 'What have you become together?' },

  // ─── CHALLENGE ──────────────────────────────────────────
  { id: 'c1', type: 'challenge', depth: 'surface', content: 'In 60 seconds, list every place you\'ve traveled to together. Go.', timerSeconds: 60, subtext: 'Whoever remembers more wins nothing — except bragging rights.' },
  { id: 'c2', type: 'challenge', depth: 'surface', content: 'In 45 seconds, describe your partner using only food. Go.', timerSeconds: 45, subtext: 'Be specific. Be honest.' },
  { id: 'c3', type: 'challenge', depth: 'current', content: 'In 90 seconds, take turns saying one thing you love about each other. No repeating. No stopping.', timerSeconds: 90, subtext: 'Keep going until the timer runs out.' },
  { id: 'c4', type: 'challenge', depth: 'current', content: 'In 60 seconds, plan the perfect date for next week. Both contribute. Alternate ideas.', timerSeconds: 60, subtext: 'Then actually do it.' },
  { id: 'c5', type: 'challenge', depth: 'deep', content: 'In 2 minutes, write a toast to your relationship — as if you were giving it at your 50th anniversary. Read it aloud.', timerSeconds: 120, subtext: 'Write, then read. Both of you.' },
  { id: 'c6', type: 'challenge', depth: 'surface', content: 'In 30 seconds, name 5 of your partner\'s quirks that secretly make you love them more.', timerSeconds: 30, subtext: 'Specific quirks. Not personality traits.' },

  // ─── SPICY ──────────────────────────────────────────────
  { id: 's1', type: 'spicy', depth: 'surface', content: 'Say out loud: the moment you realized this person was it for you.', subtext: 'No hedging. Say it directly to them.' },
  { id: 's2', type: 'spicy', depth: 'surface', content: 'Tell your partner what you think their superpower is. Then tell them the thing that superpower sometimes costs them.', subtext: 'Honest. Kind.' },
  { id: 's3', type: 'spicy', depth: 'current', content: 'Say out loud: the last time you felt truly close to your partner. What were you doing?', subtext: 'Both share.' },
  { id: 's4', type: 'spicy', depth: 'current', content: 'Tell your partner: one thing they do that makes you feel completely safe. One thing that sometimes makes you feel unseen.', subtext: 'Say both. Receive both.' },
  { id: 's5', type: 'spicy', depth: 'current', content: 'Say out loud: what your relationship has taught you about yourself that you couldn\'t have learned alone.', subtext: 'Both share. Take turns.' },
  { id: 's6', type: 'spicy', depth: 'deep', content: 'Say out loud: the version of yourself you\'re most afraid your partner will eventually stop finding enough.', subtext: 'Say it. Let them respond.' },
  { id: 's7', type: 'spicy', depth: 'deep', content: 'Tell your partner the one need you have that you\'ve been quietly hoping they\'d figure out without you asking.', subtext: 'Say it clearly. For the first time.' },
  { id: 's8', type: 'spicy', depth: 'deep', content: 'Say out loud: the dream you\'ve been quietly carrying that you\'ve been afraid to say because you didn\'t want to seem selfish.', subtext: 'It\'s not selfish. Say it.' },

  // ─── THUNDER ────────────────────────────────────────────
  { id: 'th1', type: 'thunder', depth: 'current', content: 'This card doesn\'t ask you to talk. It asks you to listen.\n\nFor the next 3 minutes, one person speaks. The other does not respond, react, or advise. They just receive.\n\nTopic: "Something I\'ve been carrying that I haven\'t known how to bring to you."', subtext: 'Then switch. Then hold each other.', minSessions: 3 },
  { id: 'th2', type: 'thunder', depth: 'deep', content: 'Write your partner a note. Not a text. An actual note. It can be short. It should say the thing you most want them to know — not today, but always.\n\nLeave it somewhere they\'ll find it later.', subtext: 'Do this now. Don\'t wait.', minSessions: 5 },
  { id: 'th3', type: 'thunder', depth: 'current', content: 'Create a ritual. Right now. Something small, specific, and yours — a gesture, a word, a moment that belongs only to you two.\n\nName it. Decide when you\'ll do it. Promise to keep it.', subtext: 'Rituals are the architecture of intimacy.', minSessions: 4 },
  { id: 'th4', type: 'thunder', depth: 'deep', content: 'Ask your partner this question, then sit with their answer without speaking for 30 seconds:\n\n"What is the most important thing I could do for you right now — this week, in this season of life?"', subtext: 'Then do it.', minSessions: 6 },

  // ─── LEGACY ─────────────────────────────────────────────
  { id: 'l1', type: 'legacy', depth: 'current', content: 'What\'s a moment from the early years that you still talk about? Retell it to each other — each from your own memory.', subtext: 'Notice what each of you remembers differently.' },
  { id: 'l2', type: 'legacy', depth: 'current', content: 'What\'s the hardest season your relationship has been through? What does the fact that you\'re still here say about you both?', subtext: 'Honor what you\'ve survived together.' },
  { id: 'l3', type: 'legacy', depth: 'deep', content: 'If you could bottle one era of your relationship and save it forever, which would you choose? What made it golden?', subtext: 'And how do you bring some of it into now?' },
  { id: 'l4', type: 'legacy', depth: 'deep', content: 'What do you want the story of this relationship to say in 30 years? Not what you think it will say. What you want it to say.', subtext: 'Then talk about the gap between those two things.' },
  { id: 'l5', type: 'legacy', depth: 'current', content: 'Tell your partner something they did — years ago, maybe — that they may not know you still think about.', subtext: 'Something that stayed.' },
  { id: 'l6', type: 'legacy', depth: 'deep', content: 'If someone who loved you both were to write the story of your relationship from the outside, what would the title be? What would the theme be?', subtext: 'Agree or disagree — both are interesting.' },

  // ─── REPAIR ─────────────────────────────────────────────
  { id: 'r1', type: 'repair', depth: 'surface', content: 'Something has been sitting between us. Neither of us has to name it directly tonight. Instead, just say: what would help you feel closer right now?', subtext: 'Not what the other person needs to do. What would help you.' },
  { id: 'r2', type: 'repair', depth: 'current', content: 'The thing I want you to know that I haven\'t known how to say is...', subtext: 'Both finish this sentence. No interrupting. No defending.' },
  { id: 'r3', type: 'repair', depth: 'current', content: 'What does it feel like in your body when things are off between us? Describe it physically.', subtext: 'Then: what makes that feeling soften?' },
  { id: 'r4', type: 'repair', depth: 'surface', content: 'If we had a "repair word" — a single word or signal either of us could use to say "I need to come back to each other" — what would it be?', subtext: 'Name it together. Use it.' },
  { id: 'r5', type: 'repair', depth: 'deep', content: 'The pattern I notice us falling into when things get hard is... I\'d like us to try something different. Here\'s what I\'d ask for.', subtext: 'Speak to the pattern, not the last argument.' },
  { id: 'r6', type: 'repair', depth: 'current', content: 'Tell your partner one thing they\'ve done recently that helped — even if they didn\'t know it helped. Thank them for it specifically.', subtext: 'Be specific. Let them receive it.' },
];

export type SeasonId = 'rediscovery' | 'after-hard' | 'year-one' | 'long-game' | 'spark';

export interface Season {
  id: SeasonId;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  durationDays: number;
  cardTypeFocus: Card['type'][];
  dailyPrompts: string[];
}

export const SEASONS: Season[] = [
  {
    id: 'rediscovery',
    name: 'Rediscovery',
    tagline: 'For couples who feel like roommates.',
    description: '30 days of small prompts designed to rebuild curiosity — asking questions you forgot to ask, noticing things you stopped noticing.',
    icon: '🌱',
    color: '#7ec8a4',
    durationDays: 30,
    cardTypeFocus: ['what-if', 'this-or-that', 'dare'],
    dailyPrompts: [
      'What\'s something your partner has gotten better at since you\'ve been together?',
      'What\'s a small kindness they did this week that you almost missed?',
      'What would your partner say their biggest worry is right now?',
      'When did you last laugh together until it hurt? What was it?',
      'What\'s something they do that you never told them you love?',
      'Name a belief your partner holds that you\'ve come to respect more over time.',
      'What\'s one way they\'ve changed that you haven\'t fully acknowledged?',
      'What do you still want to learn about them?',
    ],
  },
  {
    id: 'after-hard',
    name: 'After the Hard Season',
    tagline: 'Structured repair with escalating intimacy.',
    description: 'A gentle re-entry for couples coming back toward each other after difficulty. Each day is a small bridge.',
    icon: '🕊️',
    color: '#a78bfa',
    durationDays: 21,
    cardTypeFocus: ['repair', 'spicy', 'dare'],
    dailyPrompts: [
      'What would it feel like to feel close again?',
      'What do you need most from your partner right now?',
      'What are you grateful for that you haven\'t said?',
      'What does your partner do that makes it easier to be in this?',
      'What\'s one thing you\'ve both been carrying alone that you could carry together?',
      'What would it mean to forgive — not forget, but forgive?',
      'What do you want your partner to know about how you experienced the hard season?',
    ],
  },
  {
    id: 'year-one',
    name: 'Year One',
    tagline: 'Foundation-building for new couples.',
    description: 'The first years set everything that follows. These cards help you learn each other\'s language before the patterns calcify.',
    icon: '✨',
    color: '#f59e0b',
    durationDays: 30,
    cardTypeFocus: ['this-or-that', 'what-if', 'spicy'],
    dailyPrompts: [
      'What does a good conflict look like to you?',
      'How do you know when you\'re overwhelmed? What do you need then?',
      'What does "home" mean to you?',
      'What did your family teach you about love that you want to carry forward?',
      'What did they teach you that you want to leave behind?',
      'What scares you about building a life with someone?',
      'What are you hoping this relationship gives you that you\'ve never had?',
    ],
  },
  {
    id: 'long-game',
    name: 'The Long Game',
    tagline: 'For couples 15+ years in. Reclaiming curiosity.',
    description: 'You know each other deeply. These cards go to the edges of that knowing — the parts that keep evolving.',
    icon: '🌊',
    color: '#0ea5e9',
    durationDays: 30,
    cardTypeFocus: ['legacy', 'thunder', 'what-if'],
    dailyPrompts: [
      'What about your partner still surprises you?',
      'What have you stopped asking them about that you should ask again?',
      'What version of your partner are you most nostalgic for?',
      'What version of them are you most proud of right now?',
      'What do you know about them that no one else does?',
      'What do you still not fully understand about them?',
      'What has this relationship made possible that you could never have done alone?',
    ],
  },
  {
    id: 'spark',
    name: 'The Spark',
    tagline: 'Intensity and desire. For reigniting closeness.',
    description: 'Physical and emotional closeness are not separate. This season works both.',
    icon: '🔥',
    color: '#ef4444',
    durationDays: 14,
    cardTypeFocus: ['dare', 'spicy', 'challenge'],
    dailyPrompts: [
      'When do you feel most attracted to your partner?',
      'What\'s something you want to do together that you haven\'t made time for?',
      'What does desire look like in a long relationship?',
      'What\'s something physical — non-sexual — that makes you feel deeply connected?',
      'What\'s a memory that still makes your heart beat a little differently?',
      'What do you need more of from your partner right now?',
      'What would a perfect evening together look like right now?',
    ],
  },
];

export function getCardsForSession(
  totalSessions: number,
  driftedCards: { cardId: string; count: number }[],
  retiredCards: string[],
  seasonFocus?: Card['type'][],
  count: number = 7
): Card[] {
  const driftMap = new Map(driftedCards.map(d => [d.cardId, d.count]));
  
  const available = CARDS.filter(card => {
    if (retiredCards.includes(card.id)) return false;
    if (card.minSessions && totalSessions < card.minSessions) return false;
    if (card.depth === 'deep' && totalSessions < 3) return false;
    if (card.depth === 'current' && totalSessions < 1) return false;
    const driftCount = driftMap.get(card.id) || 0;
    return driftCount < 3;
  });

  let pool = available;
  if (seasonFocus && seasonFocus.length > 0 && totalSessions > 0) {
    const focused = available.filter(c => seasonFocus.includes(c.type));
    if (focused.length >= 3) {
      const other = available.filter(c => !seasonFocus.includes(c.type));
      pool = [...focused.slice(0, Math.ceil(count * 0.6)), ...other].slice(0, count * 2);
    }
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const CARD_TYPE_LABELS: Record<Card['type'], string> = {
  dare: 'Dare',
  'this-or-that': 'This or That',
  'what-if': 'What If',
  challenge: 'Challenge',
  spicy: 'Spicy',
  thunder: 'Thunder',
  legacy: 'Legacy',
  repair: 'Repair',
};

export const CARD_TYPE_COLORS: Record<Card['type'], string> = {
  dare: '#e879a0',
  'this-or-that': '#8b5cf6',
  'what-if': '#0ea5e9',
  challenge: '#f59e0b',
  spicy: '#ef4444',
  thunder: '#1e293b',
  legacy: '#7ec8a4',
  repair: '#a78bfa',
};

export const CARD_TYPE_DESCRIPTIONS: Record<Card['type'], string> = {
  dare: 'Do it together',
  'this-or-that': 'Choose simultaneously',
  'what-if': 'Discuss out loud',
  challenge: 'Beat the clock',
  spicy: 'Say it out loud',
  thunder: 'The unexpected moment',
  legacy: 'Honor what you\'ve built',
  repair: 'Come back to each other',
};
