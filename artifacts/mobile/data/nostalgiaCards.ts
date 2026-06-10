export interface NostalgiaCard {
  id: string;
  type: 'nostalgia';
  era: string;
  yearRange: [number, number];
  prompt: string;
  subtext?: string;
  category: 'music' | 'culture' | 'tech' | 'film' | 'daily';
}

export const NOSTALGIA_CARDS: NostalgiaCard[] = [
  // 1980s
  { id: 'nos-80-01', type: 'nostalgia', era: '80s', yearRange: [1980, 1989], category: 'tech', prompt: 'What was your first video game console — or the one you remember most?', subtext: 'Atari, Commodore 64, NES... Take your pick. Did your parents hate it as much as everyone\'s did?' },
  { id: 'nos-80-02', type: 'nostalgia', era: '80s', yearRange: [1980, 1989], category: 'music', prompt: 'If your relationship had an 80s power ballad as its theme song, which would it be?', subtext: '"Total Eclipse of the Heart"? "Here I Go Again"? Perform 10 seconds of it.' },
  { id: 'nos-80-03', type: 'nostalgia', era: '80s', yearRange: [1980, 1989], category: 'culture', prompt: 'Would you two have survived high school in the 80s together? Which clique would each of you have been in?', subtext: 'The jocks, nerds, preps, burnouts, or nobodies. Be honest.' },
  { id: 'nos-80-04', type: 'nostalgia', era: '80s', yearRange: [1980, 1989], category: 'film', prompt: 'Which 80s movie couple best describes where you two started?', subtext: 'Think Dirty Dancing, Pretty in Pink, Say Anything... or something darker.' },
  { id: 'nos-80-05', type: 'nostalgia', era: '80s', yearRange: [1980, 1989], category: 'daily', prompt: 'If you had to reach your partner with 1980s technology only, how would you do it?', subtext: 'No texts, no email. A pager? A note slipped under a door? Show up at their house?' },

  // 1990s
  { id: 'nos-90-01', type: 'nostalgia', era: '90s', yearRange: [1990, 1999], category: 'tech', prompt: 'What would you have put on a mixtape for your partner in 1995?', subtext: 'Think cassette tape, 90 minutes, Side A and Side B. Name at least three tracks.' },
  { id: 'nos-90-02', type: 'nostalgia', era: '90s', yearRange: [1990, 1999], category: 'culture', prompt: 'Tamagotchi, Furby, or Skip-It — which were you, and which is your partner?', subtext: 'Explain your reasoning. This reveals character.' },
  { id: 'nos-90-03', type: 'nostalgia', era: '90s', yearRange: [1990, 1999], category: 'film', prompt: '"I\'ll never let go." Titanic 1997. Would you have let go?', subtext: 'There was clearly room on that door. Who\'s getting on the door and who\'s in the water? Be honest.' },
  { id: 'nos-90-04', type: 'nostalgia', era: '90s', yearRange: [1990, 1999], category: 'music', prompt: 'NSYNC vs Backstreet Boys — and what does your answer say about you?', subtext: 'Everyone had an opinion. Don\'t try to dodge it in 2026.' },
  { id: 'nos-90-05', type: 'nostalgia', era: '90s', yearRange: [1990, 1999], category: 'daily', prompt: 'Before GPS, how would you two have found a new restaurant together?', subtext: 'Mapquest printout? Calling directory assistance? Getting hopelessly lost and pretending it was intentional?' },
  { id: 'nos-90-06', type: 'nostalgia', era: '90s', yearRange: [1990, 1999], category: 'tech', prompt: 'AIM screen name era. What would each of your screen names have been?', subtext: 'xoBeautifulDreamer99 or DarkStarGamer? Bonus: write each other\'s away message.' },

  // 2000s
  { id: 'nos-00-01', type: 'nostalgia', era: '2000s', yearRange: [2000, 2009], category: 'tech', prompt: 'What song was your MySpace profile playing, and what does your partner think that says about you?', subtext: 'Your "Top 8" and your profile song were the original personality test.' },
  { id: 'nos-00-02', type: 'nostalgia', era: '2000s', yearRange: [2000, 2009], category: 'culture', prompt: 'If your relationship had started on MSN Messenger, write your partner one message using only that era\'s slang.', subtext: 'ASL? BRB. WYD l8r? The pressure is on.' },
  { id: 'nos-00-03', type: 'nostalgia', era: '2000s', yearRange: [2000, 2009], category: 'daily', prompt: 'iPod classic. You can only put 1,000 songs on it. What percentage would be songs about your partner?', subtext: 'And are those songs songs they\'d be touched by — or embarrassed by?' },
  { id: 'nos-00-04', type: 'nostalgia', era: '2000s', yearRange: [2000, 2009], category: 'film', prompt: 'The rom-com formula: meet cute, conflict, airport run, grand gesture. Walk through ours using that format.', subtext: 'Even if your actual story was nothing like that. Make it work.' },
  { id: 'nos-00-05', type: 'nostalgia', era: '2000s', yearRange: [2000, 2009], category: 'tech', prompt: 'Y2K never happened. But what relationship fear from your early years also never materialized?', subtext: 'Something you were sure would destroy things — but didn\'t.' },
  { id: 'nos-00-06', type: 'nostalgia', era: '2000s', yearRange: [2000, 2009], category: 'music', prompt: 'Auto-Tune era. Which overly-produced, embarrassingly sincere 2000s song actually perfectly captures a moment in your relationship?', subtext: 'Don\'t reach for the cool answer. Find the real one.' },

  // 2010s
  { id: 'nos-10-01', type: 'nostalgia', era: '2010s', yearRange: [2010, 2019], category: 'tech', prompt: 'Show your partner the oldest Instagram photo of you that still exists. What does it say about who you were then?', subtext: 'And does your partner think that person is better or worse than who you are now?' },
  { id: 'nos-10-02', type: 'nostalgia', era: '2010s', yearRange: [2010, 2019], category: 'culture', prompt: 'Netflix and chill — but actually. What was the first thing you watched together that you knew was real?', subtext: 'Not the euphemism. The actual moment sitting on the couch, when comfort set in.' },
  { id: 'nos-10-03', type: 'nostalgia', era: '2010s', yearRange: [2010, 2019], category: 'tech', prompt: 'Read your partner your first ever text to them. Or the text you almost sent but deleted.', subtext: 'We know you scrolled back there at some point.' },
  { id: 'nos-10-04', type: 'nostalgia', era: '2010s', yearRange: [2010, 2019], category: 'music', prompt: 'What was the song Shazam identified the night something shifted between you two?', subtext: 'Every couple has one. What was playing?' },
  { id: 'nos-10-05', type: 'nostalgia', era: '2010s', yearRange: [2010, 2019], category: 'daily', prompt: 'Snapchat streaks were serious in 2014. What thing in your relationship do you protect with that same energy right now?', subtext: 'Not a physical thing. A ritual, a habit, a moment.' },
  { id: 'nos-10-06', type: 'nostalgia', era: '2010s', yearRange: [2010, 2019], category: 'culture', prompt: '"We need to talk." — When in your relationship did that text send a different level of fear than it does now?', subtext: 'How has your relationship\'s baseline security changed since the beginning?' },

  // 2020s (recent nostalgia)
  { id: 'nos-20-01', type: 'nostalgia', era: '2020s', yearRange: [2020, 2029], category: 'daily', prompt: 'Lockdown 2020. If you were locked down together — what habit from that time do you still secretly miss?', subtext: 'If you weren\'t together yet — where were you, and did you know this person existed yet?' },
  { id: 'nos-20-02', type: 'nostalgia', era: '2020s', yearRange: [2020, 2029], category: 'tech', prompt: 'Wordle, BeReal, TikTok spirals at midnight. Which digital thing of the early 2020s best describes a phase your relationship went through?', subtext: 'A Wordle streak of success? Or a 3am doom scroll phase where you both kind of checked out?' },
  { id: 'nos-20-03', type: 'nostalgia', era: '2020s', yearRange: [2020, 2029], category: 'culture', prompt: '"That girl / that guy era." Were you in your main character era when you met your partner — or were they the reason you entered it?', },

  // Anniversary-era specifics (selected dynamically based on anniversary year)
  { id: 'nos-ann-01', type: 'nostalgia', era: 'anniversary', yearRange: [1970, 2030], category: 'culture', prompt: 'What was #1 on the charts the week you got together?', subtext: 'Look it up right now. Play 10 seconds. Does it fit, or is it embarrassingly wrong?' },
  { id: 'nos-ann-02', type: 'nostalgia', era: 'anniversary', yearRange: [1970, 2030], category: 'film', prompt: 'What was the biggest movie of the year you first met? Did you see it together?', subtext: 'If not, is it on your watchlist now?' },
  { id: 'nos-ann-03', type: 'nostalgia', era: 'anniversary', yearRange: [1970, 2030], category: 'daily', prompt: 'Describe the world the year you fell in love — in one sentence each. Then compare.', subtext: 'What were people obsessed with? What felt scary? What felt possible?' },
];

/**
 * Get nostalgia cards relevant to a couple's anniversary year.
 * Prioritizes: anniversary-era cards first, then the era matching their year, then others.
 */
export function getNostalgiaCardsForYear(anniversaryYear?: number): NostalgiaCard[] {
  const year = anniversaryYear ?? new Date().getFullYear();
  const anniversaryCards = NOSTALGIA_CARDS.filter(c => c.era === 'anniversary');
  const eraCards = NOSTALGIA_CARDS.filter(c =>
    c.era !== 'anniversary' &&
    c.yearRange[0] <= year &&
    c.yearRange[1] >= year
  );
  const otherCards = NOSTALGIA_CARDS.filter(c =>
    c.era !== 'anniversary' &&
    !(c.yearRange[0] <= year && c.yearRange[1] >= year)
  );

  return [...anniversaryCards, ...eraCards, ...otherCards];
}
