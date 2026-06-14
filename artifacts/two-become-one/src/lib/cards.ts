import { Card } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// THE INFINITE US CARD DECK — 260+ cards
//
// Framework annotations draw from:
//   Gottman Institute (Sound Relationship House, Eight Dates)
//   Emotionally Focused Therapy — Dr. Sue Johnson
//   Esther Perel — desire, aliveness, mystery in long-term love
//   Attachment Theory — Bowlby, Ainsworth, Levine & Heller
//   Brené Brown — vulnerability, shame resilience, belonging
//   Love Languages — Dr. Gary Chapman
// ─────────────────────────────────────────────────────────────────────────────

export const CARDS: Card[] = [

  // ══════════════════════════════════════════════════════════════
  // DARE — physical presence, vulnerability through action
  // ══════════════════════════════════════════════════════════════

  { id: 'd1', type: 'dare', depth: 'surface',
    content: 'Give your partner the longest hug you\'ve given in the last month. Don\'t let go first.',
    subtext: 'Hold until it naturally ends — your nervous system will thank you.',
    framework: 'Oxytocin release requires ~20 seconds of sustained contact. Most couples hug for 3.' },

  { id: 'd2', type: 'dare', depth: 'surface',
    content: 'Recreate your first photo together — same pose, same energy. Take it right now.',
    subtext: 'Use whatever you have around you.',
    framework: 'Gottman: Shared rituals and reliving positive moments build the fondness system.' },

  { id: 'd3', type: 'dare', depth: 'surface',
    content: 'Slow dance together for one full song — right now, wherever you are.',
    subtext: 'Pick a song that means something.',
    framework: 'Physical synchrony — moving together — reactivates felt sense of connection.' },

  { id: 'd4', type: 'dare', depth: 'current',
    content: 'Write three things you notice about your partner that you\'ve never said out loud. Read them aloud slowly.',
    subtext: 'Specific. Observed. Not generic.',
    framework: 'Gottman: Fondness & Admiration — couples who stay together say 5 positives for every 1 negative.' },

  { id: 'd5', type: 'dare', depth: 'current',
    content: 'Look your partner in the eyes without speaking for 60 seconds. Just look.',
    subtext: 'No smiling required. No phones. Just presence.',
    framework: 'Sustained eye contact activates the anterior cingulate cortex — the brain\'s center for empathy and social bonding.' },

  { id: 'd6', type: 'dare', depth: 'current',
    content: 'Cook or prepare something your partner loves — right now or commit to a specific time this week.',
    subtext: 'Name the time before you advance.',
    framework: 'Love Languages: Acts of Service — anticipating a need before it\'s stated is one of the highest forms of care.' },

  { id: 'd7', type: 'dare', depth: 'deep',
    content: 'Tell your partner the exact moment you knew you were in love. Be specific. Tell the story as if it\'s the first time.',
    subtext: 'Don\'t summarize it. Relive it.',
    framework: 'Gottman: Love Maps — knowing and retelling your story deepens the felt reality of your bond.' },

  { id: 'd8', type: 'dare', depth: 'deep',
    content: 'Hold your partner\'s face in your hands and tell them one thing you\'ve been afraid to say.',
    subtext: 'You both have something. This is the time.',
    framework: 'EFT: Emotional accessibility — being reachable in a vulnerable moment is the core of secure attachment.' },

  { id: 'd9', type: 'dare', depth: 'surface',
    content: 'Give your partner a 2-minute shoulder or hand massage with full attention — no phones, no distraction.',
    subtext: 'Full presence is the gift.',
    framework: 'Love Languages: Physical Touch — non-sexual touch is one of the most underused expressions of care.' },

  { id: 'd10', type: 'dare', depth: 'surface',
    content: 'Write your partner a note by hand — right now, even just 3 sentences. Give it to them before this session ends.',
    subtext: 'Handwriting creates a different intimacy than a text.',
    framework: 'Love Languages: Words of Affirmation — the physical artifact of a handwritten note carries weight a text message cannot.' },

  { id: 'd11', type: 'dare', depth: 'current',
    content: 'List five specific things your partner has gotten better at since you\'ve been together. Say them out loud, one by one.',
    subtext: 'Growth you\'ve witnessed is the most intimate thing to name.',
    framework: 'Gottman: Fondness & Admiration — noticing your partner\'s growth keeps you from taking each other for granted.' },

  { id: 'd12', type: 'dare', depth: 'current',
    content: 'Do something for your partner in the next 3 minutes that they didn\'t ask for and won\'t expect.',
    subtext: 'Small. Specific. Unprompted.',
    framework: 'Gottman: Turning Toward — responding to bids and anticipating needs is how trust accumulates daily.' },

  { id: 'd13', type: 'dare', depth: 'surface',
    content: 'Put on a song that defined an early period of your relationship. Sit and listen together without talking.',
    subtext: 'Let the memory come.',
    framework: 'Music and autobiographical memory share neural pathways — a shared song is a stored emotional experience.' },

  { id: 'd14', type: 'dare', depth: 'deep',
    content: 'Tell your partner three things you admire about how they handle something hard in their life right now.',
    subtext: 'Not what you wish they\'d do differently. What you already admire.',
    framework: 'Gottman: Positive Perspective — couples in strong relationships interpret each other\'s actions charitably by default.' },

  { id: 'd15', type: 'dare', depth: 'deep',
    content: 'Tell your partner: the version of yourself you are most afraid they\'ll eventually get tired of. Then let them respond.',
    subtext: 'Say it directly. Hear them out fully.',
    framework: 'Brené Brown: Shame resilience — naming a fear of abandonment removes some of its power.' },

  { id: 'd16', type: 'dare', depth: 'surface',
    content: 'Show your partner three photos on your phone that you\'ve never shared with them. Tell the story behind each one.',
    subtext: 'Your inner life has a photo album. Open it.',
    framework: 'Gottman: Love Maps — knowing your partner\'s inner world, memories, and private moments builds true intimacy.' },

  { id: 'd17', type: 'dare', depth: 'current',
    content: 'Name one way you have changed in this relationship that you feel proud of. Be specific.',
    subtext: 'This relationship has changed you. Name how.',
    framework: 'Secure attachment promotes growth — partners in secure bonds show more self-development over time.' },

  { id: 'd18', type: 'dare', depth: 'current',
    content: 'Ask your partner: "What\'s one way I could show up better for you right now — this week?" Then just listen. Don\'t explain or defend.',
    subtext: 'The listening IS the dare.',
    framework: 'EFT: Responsiveness — being genuinely responsive to your partner\'s needs is the cornerstone of secure connection.' },

  { id: 'd19', type: 'dare', depth: 'deep',
    content: 'Touch your partner\'s hand and say: "The thing I want most for you in the next year is..." Finish it out loud.',
    subtext: 'Your desire for their flourishing is a gift worth giving.',
    framework: 'Gottman: Making Life Dreams Come True — actively supporting your partner\'s dreams is among the highest relationship skills.' },

  { id: 'd20', type: 'dare', depth: 'surface',
    content: 'Spend 60 seconds telling your partner everything you find physically beautiful about them. Don\'t stop early.',
    subtext: 'Specific details, not generalities.',
    framework: 'Perel: Aliveness — being truly seen by the person who knows you best is one of love\'s greatest gifts.' },

  { id: 'd21', type: 'dare', depth: 'current',
    content: 'Whisper something to your partner that you want to say out loud but haven\'t dared to.',
    subtext: 'Whispers are for the things that take courage.',
    framework: 'Perel: Erotic intelligence — desire lives in the space between the said and unsaid.' },

  { id: 'd22', type: 'dare', depth: 'deep',
    content: 'Tell your partner the story of the hardest day you\'ve ever had. The full version — not the summary you usually give.',
    subtext: 'They want the whole story. Give it.',
    framework: 'EFT: Emotional accessibility — sharing your most vulnerable experiences invites your partner into your deepest self.' },

  { id: 'd23', type: 'dare', depth: 'surface',
    content: 'Say five things your partner does that make ordinary life with them better. Not big things — the small ordinary ones.',
    subtext: 'Ordinary appreciation is rarer and more sustaining than peak-moment praise.',
    framework: 'Gottman: Fondness & Admiration — noticing everyday moments is how couples stay in love long-term.' },

  { id: 'd24', type: 'dare', depth: 'current',
    content: 'Plan something together — right now — that you\'ll do in the next two weeks. Agree on it before you put the phone down.',
    subtext: 'Anticipation is a form of intimacy.',
    framework: 'Shared future orientation predicts relationship satisfaction — couples who plan together feel more bonded.' },

  { id: 'd25', type: 'dare', depth: 'deep',
    content: 'Tell your partner: one thing they\'ve done that you\'ve never fully acknowledged. Something that mattered more than you said.',
    subtext: 'Belated gratitude is still nourishing.',
    framework: 'Gottman: Sentiment Override — a reservoir of positive acknowledgment buffers against conflict.' },

  // ══════════════════════════════════════════════════════════════
  // THIS OR THAT — reveal preferences, patterns, and needs
  // ══════════════════════════════════════════════════════════════

  { id: 't1', type: 'this-or-that', depth: 'surface',
    content: 'How do you prefer to spend a Saturday morning?',
    options: ['Sleeping in late, slow start', 'Up early — coffee and quiet'],
    framework: 'Reveals chronobiology compatibility and personal restoration styles.' },

  { id: 't2', type: 'this-or-that', depth: 'surface',
    content: 'When you need to decompress after a hard day, you prefer...',
    options: ['Total alone time first', 'Being with your person right away'],
    framework: 'Attachment: knowing this prevents misreading withdrawal as rejection.' },

  { id: 't3', type: 'this-or-that', depth: 'surface',
    content: 'Your ideal vacation is...',
    options: ['Adventure — new places, movement', 'Rest — stillness, doing nothing'],
    framework: 'Reveals approach vs. avoidance orientation — important before conflicts about planning.' },

  { id: 't4', type: 'this-or-that', depth: 'surface',
    content: 'When life gets hard, your first instinct is...',
    options: ['Talk it through right away', 'Sit with it quietly before talking'],
    framework: 'Processing style — verbal vs. internal. Mismatches here cause most "you won\'t open up" conflicts.' },

  { id: 't5', type: 'this-or-that', depth: 'current',
    content: 'What you need most from this relationship right now is...',
    options: ['More quality time together', 'More space to be yourself'],
    framework: 'EFT: The attachment paradox — we simultaneously need closeness and autonomy. A split here is valuable data.' },

  { id: 't6', type: 'this-or-that', depth: 'current',
    content: 'In this relationship, you more often feel...',
    options: ['Seen and known', 'Still figuring out how to be fully seen'],
    framework: 'EFT: Felt security — feeling known is the core of what a secure attachment bond provides.' },

  { id: 't7', type: 'this-or-that', depth: 'current',
    content: 'When your partner is stressed, your instinct is to...',
    options: ['Fix it — solve the problem', 'Just be near them — no fixing'],
    framework: 'Gottman: Bids for connection — understanding what support your partner actually wants prevents good intentions from landing badly.' },

  { id: 't8', type: 'this-or-that', depth: 'current',
    content: 'You feel most loved when your partner...',
    options: ['Does something for you', 'Tells you how they feel about you'],
    framework: 'Love Languages: Acts of Service vs. Words of Affirmation — feeling unloved is often a language mismatch, not a love shortage.' },

  { id: 't9', type: 'this-or-that', depth: 'deep',
    content: 'What scares you more in this relationship?',
    options: ['Growing apart over time', 'Never being fully known'],
    framework: 'Attachment: Two core fears — abandonment (anxious) and invisibility (avoidant). Both reveal something real.' },

  { id: 't10', type: 'this-or-that', depth: 'deep',
    content: 'The thing you protect most in yourself is...',
    options: ['Your independence', 'Your heart'],
    framework: 'Attachment: Avoidant strategies protect independence; anxious strategies protect the bond. A split here is worth exploring.' },

  { id: 't11', type: 'this-or-that', depth: 'surface',
    content: 'In a conflict, you\'re more likely to...',
    options: ['Push to resolve it now', 'Need time before you can talk'],
    framework: 'Gottman: Pursuer-Withdrawer — the most common negative cycle in relationships. Understanding your role breaks it.' },

  { id: 't12', type: 'this-or-that', depth: 'surface',
    content: 'When you achieve something big, your first instinct is to...',
    options: ['Share it immediately — celebrate out loud', 'Sit with it privately first'],
    framework: 'Reveals how you process joy — and whether your partner knows how to celebrate you.' },

  { id: 't13', type: 'this-or-that', depth: 'current',
    content: 'When you\'ve done something wrong in the relationship, you tend to...',
    options: ['Apologize quickly, even if still hurt', 'Need time to cool before you can repair'],
    framework: 'Gottman: Physiological soothing — some people can\'t repair while flooded. Neither style is wrong, but both need understanding.' },

  { id: 't14', type: 'this-or-that', depth: 'current',
    content: 'Right now, this relationship makes you feel...',
    options: ['Like the best version of yourself', 'Like you\'re still growing into who you want to be here'],
    framework: 'Perel: Love that allows growth vs. love that defines — both are valid, but they need different things from each other.' },

  { id: 't15', type: 'this-or-that', depth: 'surface',
    content: 'You feel most connected to your partner when you\'re...',
    options: ['Doing something active together', 'Doing nothing, just being present'],
    framework: 'Love Languages: Quality Time — understanding what "quality" means to each of you is critical.' },

  { id: 't16', type: 'this-or-that', depth: 'deep',
    content: 'When you imagine your relationship in 20 years, the image that comes to mind is...',
    options: ['Deep, steady, quietly profound', 'Still surprising each other, still changing'],
    framework: 'Perel: Stability vs. aliveness — the tension between security and desire is the central challenge of long-term love.' },

  { id: 't17', type: 'this-or-that', depth: 'current',
    content: 'The version of you that shows up when no one else is watching is...',
    options: ['The same as what your partner sees', 'Somewhat different from who they know'],
    framework: 'Vulnerability: The gap between public self and private self is where intimacy either grows or stalls.' },

  { id: 't18', type: 'this-or-that', depth: 'deep',
    content: 'When things are hard between you, you tend to...',
    options: ['Move toward your partner to repair', 'Move away and wait for them to come to you'],
    framework: 'EFT: Pursuers and withdrawers are both trying to protect the bond. The strategy is just opposite.' },

  { id: 't19', type: 'this-or-that', depth: 'surface',
    content: 'You feel more like yourself when...',
    options: ['You\'re around people — social and energized', 'You\'ve had enough quiet time alone'],
    framework: 'Introversion vs. extroversion of energy — couples who understand this stop taking it personally.' },

  { id: 't20', type: 'this-or-that', depth: 'current',
    content: 'In this relationship, you\'re more often...',
    options: ['The one who names what needs to change', 'The one who holds steady and adapts'],
    framework: 'Gottman: The pursuer and holder dynamic — both roles are necessary, and over time they should be flexible.' },

  { id: 't21', type: 'this-or-that', depth: 'deep',
    content: 'What you want most from love is...',
    options: ['To be completely safe with someone', 'To be fully alive with someone'],
    framework: 'Perel: Security and aliveness are both real needs that often pull in opposite directions.' },

  { id: 't22', type: 'this-or-that', depth: 'current',
    content: 'When your partner is upset with you, your body\'s first reaction is...',
    options: ['Urgency — I need to fix this now', 'Freeze or pull back — I need space'],
    framework: 'Gottman: Physiological flooding — the nervous system shuts down effective communication at elevated heart rate.' },

  { id: 't23', type: 'this-or-that', depth: 'surface',
    content: 'Your relationship with money is more...',
    options: ['Spend for the experience — life is now', 'Save for security — the future matters'],
    framework: 'Gottman: Money is the #1 topic couples fight about — not because of money, but different values around security and meaning.' },

  { id: 't24', type: 'this-or-that', depth: 'current',
    content: 'You feel more grateful for your partner when you\'re...',
    options: ['Together, in the middle of life', 'Apart — and you miss them'],
    framework: 'Perel: Desire needs space — some people feel love most in longing and reunion.' },

  { id: 't25', type: 'this-or-that', depth: 'deep',
    content: 'The part of yourself you show this person that no one else sees is...',
    options: ['Your vulnerability — the soft parts', 'Your wildness — the unleashed parts'],
    framework: 'Intimacy is built in the space where you are least defended — both vulnerability and joy require lowering the guard.' },

  { id: 't26', type: 'this-or-that', depth: 'surface',
    content: 'When you imagine growing old together, you picture...',
    options: ['A quiet life — simple, deeply felt', 'Still doing things — exploring, building'],
    framework: 'Gottman: Shared meaning — aligning on your vision of the future is part of what makes a relationship feel like a home.' },

  { id: 't27', type: 'this-or-that', depth: 'current',
    content: 'The thing this relationship gives you that nothing else can is...',
    options: ['Belonging — being truly known', 'Aliveness — being more fully yourself'],
    framework: 'Both are legitimate and necessary. A split here is one of the most valuable conversations you can have.' },

  { id: 't28', type: 'this-or-that', depth: 'deep',
    content: 'When you imagine the greatest risk to this relationship, it\'s...',
    options: ['External pressure — life getting too hard', 'Internal drift — slowly becoming strangers'],
    framework: 'Gottman: The Four Horsemen come from drift — not crisis.' },

  { id: 't29', type: 'this-or-that', depth: 'surface',
    content: 'You feel more appreciated when your partner...',
    options: ['Says it — words, compliments, thank yous', 'Shows it — actions, effort, doing things'],
    framework: 'Love Languages: Feeling unloved is often a language mismatch, not a love shortage.' },

  { id: 't30', type: 'this-or-that', depth: 'current',
    content: 'The hardest thing to ask your partner for is...',
    options: ['More closeness — admit you need them', 'More space — admit you need yourself'],
    framework: 'Attachment: Both needs are legitimate. The one that\'s hardest to name is usually the one most needed.' },

  { id: 't31', type: 'this-or-that', depth: 'deep',
    content: 'When you think about vulnerability in this relationship, you more often...',
    options: ['Lean in — share before you\'re ready', 'Hold back — share when it feels safe'],
    framework: 'Brené Brown: Vulnerability is the birthplace of connection — but it requires trust, built incrementally.' },

  { id: 't32', type: 'this-or-that', depth: 'surface',
    content: 'Your ideal Friday night is...',
    options: ['Out — people, energy, something happening', 'In — couch, comfort, just you two'],
    framework: 'Restoration style compatibility — understanding this prevents one partner from constantly feeling like they\'re compromising.' },

  { id: 't33', type: 'this-or-that', depth: 'current',
    content: 'In this season of life, you feel more...',
    options: ['Clear on who you are and what you want', 'Still becoming — uncertain, in motion'],
    framework: 'Adult development: being at different life stages simultaneously is one of the hardest challenges couples face.' },

  { id: 't34', type: 'this-or-that', depth: 'deep',
    content: 'When you think about commitment, it feels more like...',
    options: ['A home — shelter, stability, safety', 'A choice — renewed every day, never assumed'],
    framework: 'Gottman: Commitment is built through cherishing — the active daily choice to prioritize the relationship.' },

  { id: 't35', type: 'this-or-that', depth: 'surface',
    content: 'When someone you love is in pain, your instinct is...',
    options: ['Try to take the pain away — fix something', 'Just sit with them — witness it'],
    framework: 'Empathy styles: solution-focused vs. witness-based. Each has value; each partner may need the opposite.' },

  // ══════════════════════════════════════════════════════════════
  // WHAT IF — imagination, futures, identity, desire
  // ══════════════════════════════════════════════════════════════

  { id: 'w1', type: 'what-if', depth: 'surface',
    content: 'What if you could relive one day from your relationship — any day at all — which would you choose and why?',
    subtext: 'Be specific. Name the day.',
    framework: 'Gottman: Love Maps — revisiting shared memories renews the emotional bank account.' },

  { id: 'w2', type: 'what-if', depth: 'surface',
    content: 'What if you had met 10 years earlier — how would your relationship have been different? Would you have worked?',
    subtext: 'Discuss honestly.',
    framework: 'Timing and readiness matter — exploring this reveals what you each needed to become first.' },

  { id: 'w3', type: 'what-if', depth: 'surface',
    content: 'What if money was completely off the table — what would your ideal shared life look like?',
    subtext: 'Paint the picture in detail.',
    framework: 'Gottman: Shared meaning system — knowing each other\'s unconstrained vision reveals core values.' },

  { id: 'w4', type: 'what-if', depth: 'current',
    content: 'What if you could know — with certainty — one thing about your future together? What would you want to know?',
    subtext: 'And why that thing specifically?',
    framework: 'The thing you most want certainty about is usually where your deepest anxiety lives.' },

  { id: 'w5', type: 'what-if', depth: 'current',
    content: 'What if your relationship had a theme song right now — this actual week — what would it be and why?',
    subtext: 'Be honest, not aspirational.',
    framework: 'Perel: Music and metaphor reach emotional truths that direct language sometimes cannot.' },

  { id: 'w6', type: 'what-if', depth: 'current',
    content: 'What if you could go back and do one thing differently in this relationship — not erase it, just redirect it?',
    subtext: 'What would you change?',
    framework: 'Reflection without regret — examining the past as information, not verdict.' },

  { id: 'w7', type: 'what-if', depth: 'deep',
    content: 'What if your partner could hear every thought you had about them for one week — would there be anything you\'d be afraid of?',
    subtext: 'And what would you want them to understand about those thoughts?',
    framework: 'Brené Brown: The gap between inner narrative and what we express is where disconnection lives.' },

  { id: 'w8', type: 'what-if', depth: 'deep',
    content: 'What if the version of you that existed before this relationship could see who you are now — what would surprise them most?',
    subtext: 'What have you become together?',
    framework: 'Secure attachment creates developmental change — the person we become in love is different from who we\'d be alone.' },

  { id: 'w9', type: 'what-if', depth: 'surface',
    content: 'What if you two started over — met for the first time, right now, as you are today — do you think you\'d fall for each other?',
    subtext: 'What would you notice first?',
    framework: 'Perel: Seeing your partner with fresh eyes is a practice of renewal — familiarity and freshness can coexist.' },

  { id: 'w10', type: 'what-if', depth: 'current',
    content: 'What if you each had to name the biggest dream you\'ve been quietly holding that you haven\'t fully shared?',
    subtext: 'Both share.',
    framework: 'Gottman: Making Life Dreams Come True — unexpressed dreams become resentments when a partner seems to block them unknowingly.' },

  { id: 'w11', type: 'what-if', depth: 'current',
    content: 'What if this relationship ended tomorrow? What would you most regret not having said or done?',
    subtext: 'Say it now.',
    framework: 'Mortality salience activates appreciation — briefly imagining loss makes the present feel vivid.' },

  { id: 'w12', type: 'what-if', depth: 'deep',
    content: 'What if you could redesign this relationship from scratch — keep what works, rebuild what doesn\'t — what would you keep?',
    subtext: 'Then what would you rebuild?',
    framework: 'Perel: Relationships require reinvention — the couple that lasts often has 2–3 different relationships with the same person.' },

  { id: 'w13', type: 'what-if', depth: 'surface',
    content: 'What if you and your partner had to spend one month completely off the grid — no phones, no internet, just the two of you somewhere remote?',
    subtext: 'What do you think you\'d discover?',
    framework: 'Removing external stimulation reveals what\'s actually between two people.' },

  { id: 'w14', type: 'what-if', depth: 'deep',
    content: 'What if you could guarantee your relationship would stay exactly as it is right now — forever? Would you take that deal?',
    subtext: 'Why or why not? What does your answer tell you?',
    framework: 'This question reveals how satisfied you actually are vs. how satisfied you believe you should be.' },

  { id: 'w15', type: 'what-if', depth: 'current',
    content: 'What if there were no social expectations, no family pressure, no financial concerns — what would your life together look like in five years?',
    subtext: 'Describe the actual picture.',
    framework: 'Gottman: Dreams within conflict — understanding your partner\'s underlying dreams is the key to resolving gridlocked issues.' },

  { id: 'w16', type: 'what-if', depth: 'deep',
    content: 'What if your partner could change one thing about you — with your full permission — what do you think they\'d choose?',
    subtext: 'Then ask them if you were right.',
    framework: 'Knowing what our partner wishes we\'d work on — and being willing to hear it — is a profound act of openness.' },

  { id: 'w17', type: 'what-if', depth: 'surface',
    content: 'What if you could live anywhere in the world together — what city, country, or landscape would you choose?',
    subtext: 'Separately imagine, then share.',
    framework: 'Spatial imagination reveals values: community, climate, culture, pace of life.' },

  { id: 'w18', type: 'what-if', depth: 'current',
    content: 'What if the two of you started a project together — something you built, created, or ran — what would it be?',
    subtext: 'Dream it out loud.',
    framework: 'Gottman: Shared meaning — couples who have shared projects and purposes report higher satisfaction.' },

  { id: 'w19', type: 'what-if', depth: 'deep',
    content: 'What if you could write your partner a letter to be read in 10 years — what would you want to have said?',
    subtext: 'What would you need them to know — about right now, about your love, about your hopes?',
    framework: 'Future-oriented love letters activate gratitude, aspiration, and longitudinal commitment.' },

  { id: 'w20', type: 'what-if', depth: 'deep',
    content: 'What if neither of you was afraid of being fully known — what would you say that you haven\'t yet?',
    subtext: 'Both share. The question is the dare.',
    framework: 'EFT: Emotional accessibility — the invitation to be fully known and received is the heart of secure attachment.' },

  { id: 'w21', type: 'what-if', depth: 'surface',
    content: 'What if you could instantly resolve your most recurring argument — it just disappears — how would your relationship feel different?',
    subtext: 'Then: is the argument actually about what you think it\'s about?',
    framework: 'Gottman: 69% of relationship conflicts are perpetual — never fully solved, only managed through dialogue.' },

  { id: 'w22', type: 'what-if', depth: 'current',
    content: 'What if you could have done this — playing a game together, talking this deeply — one year ago? What would have been different?',
    subtext: 'And what does that tell you about what to do more of now?',
    framework: 'Reflection on missed connection creates motivation for present investment.' },

  // ══════════════════════════════════════════════════════════════
  // CHALLENGE — timed, energizing, playful
  // ══════════════════════════════════════════════════════════════

  { id: 'c1', type: 'challenge', depth: 'surface',
    content: 'In 60 seconds, list every place you\'ve been together. Go.',
    subtext: 'Whoever remembers more wins absolutely nothing — except bragging rights.',
    timerSeconds: 60, framework: 'Gottman: Love Maps — shared history is the emotional bank account of a relationship.' },

  { id: 'c2', type: 'challenge', depth: 'surface',
    content: 'In 45 seconds, describe your partner using only food. Go.',
    subtext: 'Be specific. Be honest. Explain your choices.',
    timerSeconds: 45, framework: 'Metaphorical thinking about someone we love activates different neural pathways than direct description.' },

  { id: 'c3', type: 'challenge', depth: 'current',
    content: 'In 90 seconds, take turns saying one thing you love about each other — alternating, no repeating, no stopping until the timer runs.',
    subtext: 'The constraint forces creativity. You\'ll find things you haven\'t named.',
    timerSeconds: 90, framework: 'Gottman: Fondness & Admiration — voicing appreciation builds positive sentiment that buffers conflict.' },

  { id: 'c4', type: 'challenge', depth: 'current',
    content: 'In 60 seconds, plan the perfect date for next week — both of you contribute alternating ideas. Then actually book it.',
    subtext: 'Commit to the time before you put the phone down.',
    timerSeconds: 60, framework: 'Anticipation and shared planning are independent predictors of relationship satisfaction.' },

  { id: 'c5', type: 'challenge', depth: 'deep',
    content: 'In 2 minutes, each of you writes a toast to this relationship — as if you\'re giving it at your 50th anniversary. Then read them aloud.',
    subtext: 'Write first. Read after. Listen without comment.',
    timerSeconds: 120, framework: 'Future-self projection — imagining you have already succeeded increases the sense that it is possible.' },

  { id: 'c6', type: 'challenge', depth: 'surface',
    content: 'In 30 seconds, name 5 of your partner\'s quirks that you secretly love. Specific quirks — not personality traits.',
    subtext: 'The weird, specific things.',
    timerSeconds: 30, framework: 'Gottman: Fondness — the specific, idiosyncratic things we love protect relationships from contempt.' },

  { id: 'c7', type: 'challenge', depth: 'surface',
    content: 'In 45 seconds, name as many things as you can that your partner is better at than you. Go.',
    subtext: 'Genuine ones. Don\'t be polite.',
    timerSeconds: 45, framework: 'Admiration without threat — truly seeing your partner\'s strengths requires ego security.' },

  { id: 'c8', type: 'challenge', depth: 'current',
    content: 'In 60 seconds, each describe what a perfect ordinary Tuesday looks like to you. Be specific.',
    subtext: 'Ordinary vision is more revealing than dream vision.',
    timerSeconds: 60, framework: 'Gottman: Shared meaning lives in the everyday — not just the peak moments.' },

  { id: 'c9', type: 'challenge', depth: 'current',
    content: 'In 90 seconds, list every shared inside joke, nickname, or reference only you two understand.',
    subtext: 'These are the architecture of your private world.',
    timerSeconds: 90, framework: 'Gottman: Shared meaning — private language and rituals are hallmarks of lasting couples.' },

  { id: 'c10', type: 'challenge', depth: 'deep',
    content: 'In 3 minutes, each of you writes the top 5 things you want for your life in the next 5 years. Then share and look for overlaps and gaps.',
    subtext: 'The overlaps are gifts. The gaps are conversations worth having.',
    timerSeconds: 180, framework: 'Gottman: Making Life Dreams Come True — regularly updating each other\'s life maps prevents growing apart.' },

  { id: 'c11', type: 'challenge', depth: 'surface',
    content: 'In 45 seconds, each name 5 things that made you happy this week. Any size.',
    subtext: 'Small is fine. Small is often realer.',
    timerSeconds: 45, framework: 'Shared positive affect — a habit of gratitude expression reshapes the emotional environment of a relationship.' },

  { id: 'c12', type: 'challenge', depth: 'current',
    content: 'In 60 seconds, take turns completing this sentence: "Something I wish you knew about how I feel this week is..."',
    subtext: 'Keep going until the timer runs out.',
    timerSeconds: 60, framework: 'EFT: Emotional disclosure in short, frequent doses is more effective than long infrequent conversations.' },

  { id: 'c13', type: 'challenge', depth: 'surface',
    content: 'In 30 seconds, both name your 3 happiest memories together — simultaneously. Then compare the overlap.',
    subtext: 'Say them at the same time.',
    timerSeconds: 30, framework: 'Shared peak experiences form the foundation of Gottman\'s Love Maps — knowing your partner\'s inner world.' },

  { id: 'c14', type: 'challenge', depth: 'deep',
    content: 'In 2 minutes, each write: "The version of myself I want to become." Then share. Then ask each other: "How can I support this?"',
    subtext: 'The support question matters as much as the vision.',
    timerSeconds: 120, framework: 'Gottman: Making Life Dreams Come True — the partner who supports the other\'s becoming is irresistible over time.' },

  { id: 'c15', type: 'challenge', depth: 'surface',
    content: 'In 60 seconds, name every movie, show, song, or book that has meaning to your relationship. Go.',
    subtext: 'The artifacts of a shared culture.',
    timerSeconds: 60, framework: 'Shared symbolic culture — the stories and art a couple returns to become part of their shared meaning system.' },

  // ══════════════════════════════════════════════════════════════
  // SPICY — direct verbal vulnerability, truth-telling
  // ══════════════════════════════════════════════════════════════

  { id: 's1', type: 'spicy', depth: 'surface',
    content: 'Say out loud: the exact moment you realized this person was it for you.',
    subtext: 'No hedging. Say it directly to them.',
    framework: 'Gottman: Love Maps — retelling the story of how you chose each other renews the emotional foundation.' },

  { id: 's2', type: 'spicy', depth: 'surface',
    content: 'Tell your partner what you think their superpower is. Then tell them the one thing that superpower sometimes costs them.',
    subtext: 'Honest. Kind. Both parts matter.',
    framework: 'Character strengths research: every strength has a shadow. Naming both is more intimate than praise alone.' },

  { id: 's3', type: 'spicy', depth: 'current',
    content: 'Say out loud: the last time you felt truly close to your partner. What were you doing?',
    subtext: 'Both share separately, then compare.',
    framework: 'Gottman: Turning Toward — identifying what creates closeness helps you do more of it intentionally.' },

  { id: 's4', type: 'spicy', depth: 'current',
    content: 'Tell your partner: one thing they do that makes you feel completely safe. Then one thing that sometimes makes you feel unseen.',
    subtext: 'Say both. Receive both without defending.',
    framework: 'EFT: Emotional responsiveness — feeling heard without defensiveness is what builds trust that lasts.' },

  { id: 's5', type: 'spicy', depth: 'current',
    content: 'Say out loud: what this relationship has taught you about yourself that you couldn\'t have learned alone.',
    subtext: 'Both share. Take turns.',
    framework: 'Relationships as developmental context — the self that emerges in secure love is often truer than the defended solo self.' },

  { id: 's6', type: 'spicy', depth: 'deep',
    content: 'Say out loud: the version of yourself you\'re most afraid your partner will eventually stop finding to be enough.',
    subtext: 'Say it. Let them respond.',
    framework: 'Brené Brown: Shame — the fear of being "not enough" is the most common and most corrosive relational shame.' },

  { id: 's7', type: 'spicy', depth: 'deep',
    content: 'Tell your partner the one need you have that you\'ve been quietly hoping they\'d figure out on their own without you asking.',
    subtext: 'Name it clearly. For the first time.',
    framework: 'EFT: Mind-reading expectations are relationship killers. Naming needs directly is an act of trust and respect.' },

  { id: 's8', type: 'spicy', depth: 'deep',
    content: 'Say out loud: the dream you\'ve been quietly carrying that you\'ve been afraid to say because you didn\'t want to seem selfish.',
    subtext: 'It\'s not selfish. Say it.',
    framework: 'Gottman: Dreams within conflict — unexpressed dreams don\'t disappear; they become resentments.' },

  { id: 's9', type: 'spicy', depth: 'surface',
    content: 'Say out loud: three specific things your partner does that make you feel most attracted to them.',
    subtext: 'Specific actions — not personality traits.',
    framework: 'Perel: Desire is nurtured by being seen — articulating what you find attractive recreates the gaze of early love.' },

  { id: 's10', type: 'spicy', depth: 'surface',
    content: 'Tell your partner the last time they made you proud. Describe the specific moment.',
    subtext: 'Name the exact moment. Tell the story.',
    framework: 'Gottman: Fondness & Admiration — pride in your partner is one of the strongest protective factors.' },

  { id: 's11', type: 'spicy', depth: 'current',
    content: 'Say out loud: the thing you most want your partner to understand about what your life feels like right now.',
    subtext: 'The interior experience — not the facts of what\'s happening.',
    framework: 'EFT: Partners feel most connected when they understand the felt reality of each other\'s world.' },

  { id: 's12', type: 'spicy', depth: 'current',
    content: 'Tell your partner: the thing you pretend to be fine about that you\'re not actually fine about.',
    subtext: 'Both share. No minimizing.',
    framework: 'Brené Brown: "Being fine" is often a protective strategy that creates distance faster than honest discomfort would.' },

  { id: 's13', type: 'spicy', depth: 'deep',
    content: 'Say out loud: the fear that lives inside you that you have never said to any person — and say it now to this one.',
    subtext: 'You don\'t have to explain it. Just name it.',
    framework: 'Brené Brown: Vulnerability is not weakness — it is the most accurate measure of courage.' },

  { id: 's14', type: 'spicy', depth: 'current',
    content: 'Tell your partner: the one thing about yourself that you hope they never stop seeing clearly — even when you lose sight of it.',
    subtext: 'The thing you need them to hold for you.',
    framework: 'Attachment: Secure base — the partner who holds your sense of self when you\'ve lost it is doing the deepest relational work.' },

  { id: 's15', type: 'spicy', depth: 'surface',
    content: 'Say out loud: what you think your relationship looks like from the outside. Then compare whether you see the same thing.',
    subtext: 'External perception vs. internal reality.',
    framework: 'The gap between how couples perform love and how they experience it is worth examining.' },

  { id: 's16', type: 'spicy', depth: 'deep',
    content: 'Tell your partner: the moment in this relationship when you almost walked away. What made you stay?',
    subtext: 'Only share if it\'s true. The staying matters more than the almost.',
    framework: 'Gottman: Commitment — knowing your partner consciously chose to stay transforms the relationship\'s felt security.' },

  { id: 's17', type: 'spicy', depth: 'current',
    content: 'Say out loud: the way you feel loved that your partner hasn\'t fully figured out yet. Not a complaint — information.',
    subtext: 'Give them the information they need.',
    framework: 'Love Languages: Closing the gap between how love is given and received is one of the most high-leverage relationship moves.' },

  { id: 's18', type: 'spicy', depth: 'deep',
    content: 'Tell your partner: the part of yourself you were most ashamed of when you met them. Is it different now?',
    subtext: 'Both share. Hold space for what they say.',
    framework: 'Brené Brown: Shame loses power when spoken aloud to someone who responds with empathy.' },

  { id: 's19', type: 'spicy', depth: 'current',
    content: 'Say out loud: what you\'re most grateful for about your partner right now — in this exact season of life.',
    subtext: 'Season-specific, not generic.',
    framework: 'Temporal specificity in gratitude — naming what you appreciate right now is more emotionally resonant than generalities.' },

  { id: 's20', type: 'spicy', depth: 'surface',
    content: 'Tell your partner: three things they do that make ordinary life with them remarkable.',
    subtext: 'The mundane, specific things. Not the peak moments.',
    framework: 'Gottman: Positive Sentiment Override — couples who notice ordinary goodness buffer against conflict more effectively.' },

  { id: 's21', type: 'spicy', depth: 'deep',
    content: 'Say out loud: the part of your personality that you think this relationship has made smaller — and whether that bothers you.',
    subtext: 'Honest reflection. No defensiveness from either side.',
    framework: 'Perel: Love must allow for the individual — the self should not disappear in the we.' },

  { id: 's22', type: 'spicy', depth: 'current',
    content: 'Tell your partner: the one thing you need to hear from them more often. Not a demand — information.',
    subtext: 'Say it once, clearly.',
    framework: 'Love Languages: Knowing exactly what words land for your partner lets you love them more precisely.' },

  { id: 's23', type: 'spicy', depth: 'deep',
    content: 'Say out loud: the thing you\'ve been doing — or not doing — in this relationship that you know needs to change.',
    subtext: 'Accountability, not confession. One thing.',
    framework: 'Gottman: Accepting influence — willingness to acknowledge your own role is the strongest predictor of repair success.' },

  { id: 's24', type: 'spicy', depth: 'surface',
    content: 'Tell your partner: what you think they look like from inside — the inner experience of being them — based on what you\'ve observed.',
    subtext: 'Your perception of their inner life.',
    framework: 'Empathic imagination — attempting to inhabit your partner\'s perspective is one of the highest relationship skills.' },

  { id: 's25', type: 'spicy', depth: 'current',
    content: 'Say out loud: what this relationship has given you that you didn\'t know you were missing before you had it.',
    subtext: 'Both share.',
    framework: 'Attachment: The gifts of a secure bond often become visible only in contrast to what we experienced before.' },

  // ══════════════════════════════════════════════════════════════
  // THUNDER — slow, ceremonial, the cards that change something
  // ══════════════════════════════════════════════════════════════

  { id: 'th1', type: 'thunder', depth: 'current',
    content: 'This card doesn\'t ask you to talk. It asks you to listen.\n\nFor the next 3 minutes, one partner speaks. The other does not respond, react, advise, or comfort. They just receive.\n\nTopic: "Something I\'ve been carrying that I haven\'t known how to bring to you."',
    subtext: 'Then switch. Take 30 seconds of silence between turns. Then hold each other.',
    minSessions: 3,
    framework: 'EFT: Non-defensive witnessing is the most powerful thing a partner can offer.' },

  { id: 'th2', type: 'thunder', depth: 'deep',
    content: 'Write your partner a letter. Not a text. An actual letter — handwritten or typed, but intentional.\n\nIt can be short. It should say the thing you most want them to know — not just today, but always.\n\nLeave it somewhere they\'ll find it later.',
    subtext: 'Do this now, in silence. Then go your separate ways for 30 minutes before coming back to each other.',
    minSessions: 5,
    framework: 'The love letter as artifact — written words create an object that can be returned to. Some things need permanence.' },

  { id: 'th3', type: 'thunder', depth: 'current',
    content: 'Create a ritual. Right now. Something small, specific, and yours.\n\nA gesture. A word. A moment. Something that belongs only to you two and has no equivalent anywhere else.\n\nName it. Decide when you\'ll use it. Promise to keep it.',
    subtext: 'Rituals are the architecture of intimacy. The simpler, the more durable.',
    minSessions: 4,
    framework: 'Gottman: Shared meaning — rituals of connection are among the most powerful predictors of relationship longevity.' },

  { id: 'th4', type: 'thunder', depth: 'deep',
    content: 'Ask your partner this question. Then sit in silence for 30 full seconds before they answer. Don\'t fill the silence:\n\n"What is the most important thing I could do for you right now — this week, in this season of your life?"\n\nThen listen without responding for 2 full minutes. Just hold what they say.',
    subtext: 'Then do it. The card is a commitment, not just a question.',
    minSessions: 6,
    framework: 'EFT: Responsiveness — asking and truly receiving what your partner needs is the foundation of a felt secure bond.' },

  { id: 'th5', type: 'thunder', depth: 'deep',
    content: 'Sit facing each other. Take turns completing this sentence, three times each:\n\n"The thing I\'ve been afraid to need from you is..."\n\nNo explaining. No apologizing. Just the sentence. The other person says: "Thank you for telling me."',
    subtext: '"Thank you for telling me" is not agreement. It is acknowledgment.',
    minSessions: 5,
    framework: 'EFT: Emotional accessibility — naming what we\'re afraid to need is often the breakthrough moment in couples therapy.' },

  { id: 'th6', type: 'thunder', depth: 'current',
    content: 'Without speaking, each of you writes down the answer to this question:\n\n"What do I most want our relationship to feel like — not look like, but feel like — in one year?"\n\nRead what you wrote to each other. Then talk about one thing you could each do differently to move toward that feeling.',
    subtext: 'The feeling, not the plan.',
    minSessions: 3,
    framework: 'Emotional tone as intention — couples who share emotional visions align more naturally than couples who share logistical plans.' },

  { id: 'th7', type: 'thunder', depth: 'deep',
    content: 'One partner speaks for 4 minutes without interruption:\n\n"The story of how I fell in love with you — the real version, with all the parts I\'ve never said out loud."\n\nThe other listens with full attention. No response for 2 minutes after. Then switch.',
    subtext: 'Take your time. The telling is the gift.',
    minSessions: 7,
    framework: 'Gottman: Love Maps — the couple who regularly revisits and deepens their origin story maintains a living sense of its own meaning.' },

  { id: 'th8', type: 'thunder', depth: 'current',
    content: 'Name, together, one pattern in your relationship that you both know exists but have been managing around rather than addressing.\n\nDon\'t try to solve it tonight. Just agree to name it honestly, together, for the first time.\n\nThen decide: do you want to work on it together, and how?',
    subtext: 'Naming without solving is sometimes the bravest first step.',
    minSessions: 4,
    framework: 'Gottman: Perpetual problems — 69% of issues are never fully resolved, but naming and accepting them breaks the gridlock.' },

  { id: 'th9', type: 'thunder', depth: 'deep',
    content: 'Tonight you are going to make a promise — not a vow, not a contract, but a promise.\n\nEach of you finishes this: "The thing I promise you — not forever, but for now, with everything I have — is..."\n\nSay it looking at your partner. Mean it.',
    subtext: 'The best promises are specific and present, not abstract and eternal.',
    minSessions: 6,
    framework: 'Gottman: Commitment — active, chosen, specific commitment is more sustaining than assumed, permanent commitment.' },

  { id: 'th10', type: 'thunder', depth: 'deep',
    content: 'Tell your partner about the hardest period of your life — before them, or during — the version you\'ve never told anyone completely.\n\nNot for advice. Not for comfort. Just to finally be fully known.\n\nThe other listens without fixing, without minimizing, without making it about themselves.',
    subtext: 'Being fully witnessed by the person you love is one of the most healing experiences available to humans.',
    minSessions: 8,
    framework: 'EFT: Safe haven — your partner becomes a true secure base when they can hold your pain without trying to fix it.' },

  { id: 'th11', type: 'thunder', depth: 'current',
    content: 'Each of you writes: "Three things I\'ve never thanked you for that I should have thanked you for a long time ago."\n\nThen read them aloud. Then actually say "thank you" — with eye contact — for each one.',
    subtext: 'Belated gratitude lands differently. It says: I\'ve been carrying this. I want to give it back to you.',
    minSessions: 3,
    framework: 'Gottman: Fondness system — delayed acknowledgment is still powerful; the brain doesn\'t timestamp appreciation.' },

  { id: 'th12', type: 'thunder', depth: 'deep',
    content: 'One partner leads. They take the other\'s hands and say:\n\n"If I could give you one thing — anything, from me, not the world — it would be ___. Because I know you need it. And I\'m the one who can give it."\n\nThen switch.',
    subtext: 'The gift should be real and deliverable, not metaphorical.',
    minSessions: 5,
    framework: 'Love Languages: The most powerful act of love is giving the gift your partner actually needs, not the one easiest for you to give.' },

  { id: 'th13', type: 'thunder', depth: 'current',
    content: 'Sit in silence together for 5 minutes. No phones. Just present.\n\nNo pressure to connect or communicate. Just share space with the person you love and let that be enough.',
    subtext: 'Companionate silence is its own form of intimacy. Allow it.',
    minSessions: 2,
    framework: 'Perel: Being comfortable in shared silence is a marker of deep intimacy.' },

  { id: 'th14', type: 'thunder', depth: 'deep',
    content: 'Ask your partner: "What do you need forgiveness for that you\'ve never asked for?"\n\nThen give it — not as absolution, but as release. Say: "I release you from carrying this."\n\nThen switch.',
    subtext: 'Forgiveness is not condoning. It is putting down what you\'ve both been carrying.',
    minSessions: 10,
    framework: 'Repair in depth — genuine forgiveness requires that the wound was real and the release is chosen.' },

  { id: 'th15', type: 'thunder', depth: 'deep',
    content: 'Tonight, one of you names a dream — something big, something you want for your life — that you haven\'t told this person yet because you were afraid of how they\'d respond.\n\nThe other listens. Then asks only: "What would it mean for you if that happened?"\n\nThen switch.',
    subtext: '"What would it mean?" opens dreams. "Is that realistic?" closes them.',
    minSessions: 6,
    framework: 'Gottman: Dreams within conflict — the antidote to gridlock is understanding the meaning behind the position.' },

  // ══════════════════════════════════════════════════════════════
  // LEGACY — honoring your shared history
  // ══════════════════════════════════════════════════════════════

  { id: 'l1', type: 'legacy', depth: 'current',
    content: 'What\'s a moment from the early years that you still talk about? Retell it — each from your own memory. Notice what each of you remembers differently.',
    subtext: 'Memory is interpretive. The differences are interesting, not wrong.',
    framework: 'Gottman: Love Maps — couples who stay together have rich, detailed, evolving knowledge of their shared history.' },

  { id: 'l2', type: 'legacy', depth: 'current',
    content: 'What\'s the hardest season your relationship has been through? What does the fact that you\'re sitting here together say about who you both are?',
    subtext: 'Honor what you\'ve survived. Don\'t minimize it.',
    framework: 'Adversarial growth in relationship — couples who survive difficulty and make meaning from it often emerge more bonded.' },

  { id: 'l3', type: 'legacy', depth: 'deep',
    content: 'If you could bottle one era of this relationship and return to it whenever you needed to feel something — which would it be? What made that time golden?',
    subtext: 'Then: how do you bring even a small piece of it into now?',
    framework: 'Perel: Nostalgia as navigation — revisiting what worked before can illuminate what\'s possible again.' },

  { id: 'l4', type: 'legacy', depth: 'deep',
    content: 'What do you want the story of this relationship to say in 30 years? Not what you think it will say — what you want it to say. Then talk about the gap.',
    subtext: 'The gap is where the work is.',
    framework: 'Narrative identity — the story we tell about our relationship shapes how we experience and maintain it.' },

  { id: 'l5', type: 'legacy', depth: 'current',
    content: 'Tell your partner something they did — years ago, maybe — that they may not know you still think about. Something that stayed.',
    subtext: 'The lasting things are rarely the grand gestures.',
    framework: 'Gottman: Small things often matter more than big ones — a forgotten kindness is still doing its work.' },

  { id: 'l6', type: 'legacy', depth: 'deep',
    content: 'If someone who loved you both were to write the story of your relationship from the outside, what would the title be? What would the theme be?',
    subtext: 'Agree or disagree — both are interesting.',
    framework: 'Shared narrative — couples who co-author their story feel more united; divergent narratives are worth examining.' },

  { id: 'l7', type: 'legacy', depth: 'current',
    content: 'What\'s a version of yourself that this person knew and loved that doesn\'t exist anymore? Do you miss that version? Do you think they do?',
    subtext: 'Growth and loss are often the same thing.',
    framework: 'Perel: Loving someone across time means loving multiple versions of them — and being loved through your own transformations.' },

  { id: 'l8', type: 'legacy', depth: 'current',
    content: 'Tell your partner: the moment in your history together you think of when things are hard — the one that reminds you why this is worth it.',
    subtext: 'The anchor memory.',
    framework: 'Gottman: Sentiment override — couples in strong relationships instinctively recall positive history during conflict.' },

  { id: 'l9', type: 'legacy', depth: 'deep',
    content: 'What has this relationship permanently changed about you — not just while you\'re together, but who you are regardless of what happens?',
    subtext: 'The irreversible gifts.',
    framework: 'Secure attachment creates lasting neurobiological change — being truly loved rewires the nervous system.' },

  { id: 'l10', type: 'legacy', depth: 'current',
    content: 'What\'s a chapter of your relationship that you haven\'t fully grieved yet — something that ended or changed that you haven\'t acknowledged out loud?',
    subtext: 'Not every transition gets a proper goodbye.',
    framework: 'Ambiguous loss in relationship — unmourned transitions create unexplained sadness that accumulates over time.' },

  { id: 'l11', type: 'legacy', depth: 'surface',
    content: 'What\'s the funniest thing that\'s ever happened to you two together? Tell the full story — don\'t summarize it.',
    subtext: 'Joy is also a legacy.',
    framework: 'Gottman: Humor and shared laughter are among the strongest predictors of long-term relationship satisfaction.' },

  { id: 'l12', type: 'legacy', depth: 'deep',
    content: 'Describe this relationship to me as if you were telling a stranger about it for the very first time — no context, just the essence of what it is.',
    subtext: 'The words you choose are revealing.',
    framework: 'How we narrate our relationship to others tells us what we actually believe about it at depth.' },

  { id: 'l13', type: 'legacy', depth: 'current',
    content: 'What have you learned from this person — not about relationships, but about life — that you carry with you independently of them?',
    subtext: 'The things they\'ve permanently taught you.',
    framework: 'Partners as teachers — one of the least-acknowledged gifts of long partnership is the wisdom that transfers between people.' },

  { id: 'l14', type: 'legacy', depth: 'deep',
    content: 'If this relationship ended — for any reason — what would you grieve most? What would you be most grateful for?',
    subtext: 'Not a prediction. A perspective exercise.',
    framework: 'Mortality salience applied to relationship — imagining an ending creates clarity about what\'s most valued.' },

  { id: 'l15', type: 'legacy', depth: 'current',
    content: 'Tell your partner: the moment when you first realized they were a safe person — someone you could trust with your realness. What happened?',
    subtext: 'Safety is built in specific moments, not in general.',
    framework: 'Attachment: Secure base — safety is not assumed, it\'s accumulated through specific moments of being received well.' },

  // ══════════════════════════════════════════════════════════════
  // REPAIR — coming back to each other after distance or conflict
  // ══════════════════════════════════════════════════════════════

  { id: 'r1', type: 'repair', depth: 'surface',
    content: 'Something has been sitting between us. Neither of you has to name it directly right now. Instead, just say: what would help you feel closer tonight?',
    subtext: 'Not what the other person should do. What would help you.',
    framework: 'Gottman: Soft startup — beginning repair from personal need rather than partner criticism doubles the chance of success.' },

  { id: 'r2', type: 'repair', depth: 'current',
    content: '"The thing I want you to know that I haven\'t known how to say is..."\n\nBoth finish this sentence. No interrupting. No defending. Just receive.',
    subtext: 'The receiving is as important as the saying.',
    framework: 'EFT: The most healing exchanges begin with "I" statements about inner experience, not "you" statements about behavior.' },

  { id: 'r3', type: 'repair', depth: 'current',
    content: 'What does it feel like in your body when there\'s distance between us? Describe it physically — not emotionally, physically.',
    subtext: 'Then: what makes that feeling start to soften? What does your partner do that helps?',
    framework: 'Somatic awareness in attachment — the body registers relationship threat before the mind names it.' },

  { id: 'r4', type: 'repair', depth: 'surface',
    content: 'Let\'s create a repair signal — a single word, gesture, or phrase that either of us can use to say "I want to come back to you. I\'m ready." Name it together.',
    subtext: 'Then use it. Starting tonight if needed.',
    framework: 'Gottman: Repair attempt — a mutually agreed repair signal short-circuits escalation and prevents flooding.' },

  { id: 'r5', type: 'repair', depth: 'deep',
    content: '"The pattern I notice us falling into when things get hard is..."  Both name it. Then: "What I\'d like to try instead is..." One concrete thing each.',
    subtext: 'Speak to the pattern, not the last incident.',
    framework: 'Gottman: Negative sentiment override — naming the negative cycle is the first step to breaking it.' },

  { id: 'r6', type: 'repair', depth: 'current',
    content: 'Tell your partner one thing they did recently — maybe small, maybe they didn\'t know it helped — that made a difference. Thank them specifically.',
    subtext: 'Be specific. Let them receive it fully.',
    framework: 'Gottman: Bid recognition — noticing when your partner turns toward you, even imperfectly, reinforces the behavior.' },

  { id: 'r7', type: 'repair', depth: 'surface',
    content: 'What do you need from your partner right now — in this exact moment — to feel a little more connected?\n\nSay it simply. Ask for it directly.',
    subtext: 'One specific thing. Not a list.',
    framework: 'EFT: The direct bid — making clear bids for connection, rather than indirect ones, is the single most effective relationship skill.' },

  { id: 'r8', type: 'repair', depth: 'current',
    content: 'Tell your partner: the way they tried to repair something recently — even if it didn\'t fully work — that you actually noticed and appreciated.',
    subtext: 'The attempt matters. Acknowledge it.',
    framework: 'Gottman: Repair attempts — noticing and acknowledging a partner\'s attempt creates safety for future attempts.' },

  { id: 'r9', type: 'repair', depth: 'deep',
    content: '"What I was actually trying to say when I said that last week was..."\n\nBoth fill in the blank — about something that came out wrong.',
    subtext: 'The intended message and the landed message are often very different.',
    framework: 'Gottman: Attunement — understanding the emotion beneath the behavior requires curiosity, not certainty.' },

  { id: 'r10', type: 'repair', depth: 'surface',
    content: 'Let\'s agree on one thing we both want more of — right now, going forward. Name it together.',
    subtext: 'One thing. Specific. Both want it.',
    framework: 'Gottman: Shared goals create forward momentum — naming what you want together is as important as addressing what went wrong.' },

  { id: 'r11', type: 'repair', depth: 'current',
    content: 'The thing I\'ve been doing lately that I think isn\'t serving us is... (finish it, for yourself). Then ask your partner: "Was I right? Is there something else?"',
    subtext: 'Self-reflection first, then openness.',
    framework: 'Gottman: Accepting influence — couples where both partners acknowledge their own contribution have significantly better outcomes.' },

  { id: 'r12', type: 'repair', depth: 'deep',
    content: 'There\'s something I\'ve been afraid to bring up because I didn\'t want to make things worse. I\'m going to say it now, as gently as I can.\n\n[Each person takes a turn. The other just listens. No response for 2 minutes.]',
    subtext: 'The response can come later. First, just receive it.',
    framework: 'EFT: Accessibility — being willing to hear something hard without shutting down is one of the most profound gifts in a relationship.' },

  { id: 'r13', type: 'repair', depth: 'current',
    content: 'If our relationship was a house, what room would need the most attention right now? What would you do to it?',
    subtext: 'Both answer. Then compare.',
    framework: 'Metaphorical thinking about relationship health reveals patterns that direct conversation sometimes obscures.' },

  { id: 'r14', type: 'repair', depth: 'surface',
    content: 'What\'s one thing you could do differently this week — just this week — to make your partner feel more valued?',
    subtext: 'Small. Specific. Deliverable by Sunday.',
    framework: 'Gottman: Small things often — sustained attention in small doses matters more than occasional grand gestures.' },

  { id: 'r15', type: 'repair', depth: 'current',
    content: 'Ask your partner: "What do I do when I\'m hurt that makes it hardest for you to reach me?" Then just listen. Don\'t defend.',
    subtext: 'The listening is harder than the asking.',
    framework: 'EFT: Accessibility — understanding how you close down allows you to begin opening back up on purpose.' },

  { id: 'r16', type: 'repair', depth: 'deep',
    content: '"When things are hard between us, what I most need you to know — but rarely say — is..."  Both complete this.\n\nThen decide: what changes if this is simply known — all the time?',
    subtext: 'What changes if this is simply known?',
    framework: 'EFT: Attachment needs — making hidden needs explicit removes the guesswork that creates distance.' },

  { id: 'r17', type: 'repair', depth: 'surface',
    content: 'Name one thing that\'s been really hard for you lately that has nothing to do with this relationship. Then just be with each other in it for a minute.',
    subtext: 'Sometimes repair isn\'t about us. It\'s about remembering the full person.',
    framework: 'Gottman: Supporting each other\'s external lives prevents spillover — stress comes in, but togetherness can absorb it.' },

  { id: 'r18', type: 'repair', depth: 'current',
    content: 'When was the last time you felt truly heard by your partner in this relationship? Describe what they did.',
    subtext: 'Then: what made that moment different?',
    framework: 'EFT: Responsiveness — identifying the specific behaviors that create felt understanding lets you recreate them.' },

  { id: 'r19', type: 'repair', depth: 'deep',
    content: '"I\'m sorry for..." — one specific thing, one real apology, no explaining and no but.\n\n"I forgive you for..." — one specific thing, said as a gift, not a transaction.\n\nSwitch. Take turns. Mean it.',
    subtext: 'The apology and the forgiveness are both gifts. Give them freely.',
    framework: 'Gottman: Effective apology includes expression of regret, responsibility, and genuine repair intention.' },

  { id: 'r20', type: 'repair', depth: 'current',
    content: 'What\'s one thing about how we argue that you wish were different — not in what we argue about, but in how it feels?',
    subtext: 'The process, not the content.',
    framework: 'Gottman: It\'s not what you argue about but how you argue that determines relationship health.' },

];

// ──────────────────────────────────────────────────────────────────────────────
// SEASONS
// ──────────────────────────────────────────────────────────────────────────────

export type SeasonId = 'rediscovery' | 'after-hard' | 'year-one' | 'long-game' | 'spark' | 'foundation' | 'transition';

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
      'What\'s something they do that you\'ve never told them you love?',
      'Name a belief your partner holds that you\'ve come to respect more over time.',
      'What\'s one way they\'ve changed that you haven\'t fully acknowledged?',
      'What do you still want to learn about them?',
      'What\'s a habit of theirs that you find secretly endearing?',
      'When do you feel most proud of your partner?',
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
      'What\'s one small thing you could do today to begin closing the distance?',
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
      'What does a good apology look like to you?',
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
      'What would you do differently if you were starting this relationship today?',
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
      'What does desire feel like in a long relationship versus a new one?',
      'What\'s something physical — non-sexual — that makes you feel deeply connected?',
      'What\'s a memory that still makes your heart beat a little differently?',
      'What do you need more of from your partner right now?',
      'What would a perfect evening together look like right now?',
    ],
  },
  {
    id: 'foundation',
    name: 'The Foundation',
    tagline: 'Values, money, family, and the big things.',
    description: 'The conversations most couples avoid are the ones that determine whether they last. This season goes there directly.',
    icon: '🏛️',
    color: '#8b5cf6',
    durationDays: 21,
    cardTypeFocus: ['what-if', 'spicy', 'this-or-that'],
    dailyPrompts: [
      'What are you teaching each other about what love means?',
      'What do you believe about money that your family gave you?',
      'What role does family-of-origin play in who you are as a partner?',
      'What values do you share that you\'ve never explicitly named?',
      'What does commitment mean to you — not the word, the lived reality?',
      'What spiritual or philosophical framework guides how you make hard decisions?',
      'What do you want your life to be in service of?',
    ],
  },
  {
    id: 'transition',
    name: 'Through the Change',
    tagline: 'When something is shifting. For couples in motion.',
    description: 'A career change. A move. A loss. A new child. Transitions are when relationships are most at risk — and most available for growth.',
    icon: '🌀',
    color: '#06b6d4',
    durationDays: 21,
    cardTypeFocus: ['repair', 'spicy', 'what-if'],
    dailyPrompts: [
      'What are you grieving that you haven\'t named yet?',
      'What are you excited about that you\'ve been afraid to admit?',
      'How are you each handling this differently — and how do you honor both ways?',
      'What do you need from your partner right now that you haven\'t asked for?',
      'What does this change mean for who you are individually and together?',
      'What do you want to protect during this period?',
      'What does success look like on the other side of this?',
    ],
  },


  // ══════════════════════════════════════════════════════════════
  // NOSTALGIA — era-specific cards tagged by decade
  // ══════════════════════════════════════════════════════════════

  // 1980s
  { id: 'nos-80-01', type: 'nostalgia' as const, era: '80s', yearRange: [1980, 1989] as [number,number], category: 'tech' as const, depth: 'surface' as const, content: 'What was your first video game console — or the one you remember most?', subtext: "Atari, Commodore 64, NES... Take your pick. Did your parents hate it as much as everyone's did?" },
  { id: 'nos-80-02', type: 'nostalgia' as const, era: '80s', yearRange: [1980, 1989] as [number,number], category: 'music' as const, depth: 'surface' as const, content: 'If your relationship had an 80s power ballad as its theme song, which would it be?', subtext: '"Total Eclipse of the Heart"? "Here I Go Again"? Perform 10 seconds of it.' },
  { id: 'nos-80-03', type: 'nostalgia' as const, era: '80s', yearRange: [1980, 1989] as [number,number], category: 'culture' as const, depth: 'surface' as const, content: 'Would you two have survived high school in the 80s together? Which clique would each of you have been in?', subtext: 'The jocks, nerds, preps, burnouts, or nobodies. Be honest.' },
  { id: 'nos-80-04', type: 'nostalgia' as const, era: '80s', yearRange: [1980, 1989] as [number,number], category: 'film' as const, depth: 'surface' as const, content: 'Which 80s movie couple best describes where you two started?', subtext: 'Think Dirty Dancing, Pretty in Pink, Say Anything... or something darker.' },
  { id: 'nos-80-05', type: 'nostalgia' as const, era: '80s', yearRange: [1980, 1989] as [number,number], category: 'daily' as const, depth: 'surface' as const, content: 'If you had to reach your partner with 1980s technology only, how would you do it?', subtext: 'No texts, no email. A pager? A note slipped under a door? Show up at their house?' },

  // 1990s
  { id: 'nos-90-01', type: 'nostalgia' as const, era: '90s', yearRange: [1990, 1999] as [number,number], category: 'tech' as const, depth: 'surface' as const, content: 'What would you have put on a mixtape for your partner in 1995?', subtext: 'Think cassette tape, 90 minutes, Side A and Side B. Name at least three tracks.' },
  { id: 'nos-90-02', type: 'nostalgia' as const, era: '90s', yearRange: [1990, 1999] as [number,number], category: 'culture' as const, depth: 'surface' as const, content: 'Tamagotchi, Furby, or Skip-It — which were you, and which is your partner?', subtext: 'Explain your reasoning. This reveals character.' },
  { id: 'nos-90-03', type: 'nostalgia' as const, era: '90s', yearRange: [1990, 1999] as [number,number], category: 'film' as const, depth: 'surface' as const, content: '"I\'ll never let go." Titanic 1997. Would you have let go?', subtext: 'There was clearly room on that door. Who's getting on the door and who's in the water? Be honest.' },
  { id: 'nos-90-04', type: 'nostalgia' as const, era: '90s', yearRange: [1990, 1999] as [number,number], category: 'music' as const, depth: 'surface' as const, content: 'NSYNC vs Backstreet Boys — and what does your answer say about you?', subtext: "Everyone had an opinion. Don't try to dodge it in 2026." },
  { id: 'nos-90-05', type: 'nostalgia' as const, era: '90s', yearRange: [1990, 1999] as [number,number], category: 'daily' as const, depth: 'surface' as const, content: 'Before GPS, how would you two have found a new restaurant together?', subtext: 'Mapquest printout? Calling directory assistance? Getting hopelessly lost and pretending it was intentional?' },
  { id: 'nos-90-06', type: 'nostalgia' as const, era: '90s', yearRange: [1990, 1999] as [number,number], category: 'tech' as const, depth: 'surface' as const, content: 'AIM screen name era. What would each of your screen names have been?', subtext: "xoBeautifulDreamer99 or DarkStarGamer? Bonus: write each other's away message." },

  // 2000s
  { id: 'nos-00-01', type: 'nostalgia' as const, era: '2000s', yearRange: [2000, 2009] as [number,number], category: 'tech' as const, depth: 'surface' as const, content: 'What song was your MySpace profile playing, and what does your partner think that says about you?', subtext: 'Your "Top 8" and your profile song were the original personality test.' },
  { id: 'nos-00-02', type: 'nostalgia' as const, era: '2000s', yearRange: [2000, 2009] as [number,number], category: 'culture' as const, depth: 'surface' as const, content: "If your relationship had started on MSN Messenger, write your partner one message using only that era's slang.", subtext: 'ASL? BRB. WYD l8r? The pressure is on.' },
  { id: 'nos-00-03', type: 'nostalgia' as const, era: '2000s', yearRange: [2000, 2009] as [number,number], category: 'daily' as const, depth: 'surface' as const, content: 'iPod classic. You can only put 1,000 songs on it. What percentage would be songs about your partner?', subtext: "And are those songs they'd be touched by — or embarrassed by?" },
  { id: 'nos-00-04', type: 'nostalgia' as const, era: '2000s', yearRange: [2000, 2009] as [number,number], category: 'film' as const, depth: 'surface' as const, content: 'The rom-com formula: meet cute, conflict, airport run, grand gesture. Walk through ours using that format.', subtext: "Even if your actual story was nothing like that. Make it work." },
  { id: 'nos-00-05', type: 'nostalgia' as const, era: '2000s', yearRange: [2000, 2009] as [number,number], category: 'tech' as const, depth: 'surface' as const, content: "Y2K never happened. But what relationship fear from your early years also never materialized?", subtext: "Something you were sure would destroy things — but didn't." },
  { id: 'nos-00-06', type: 'nostalgia' as const, era: '2000s', yearRange: [2000, 2009] as [number,number], category: 'music' as const, depth: 'surface' as const, content: "Auto-Tune era. Which overly-produced, embarrassingly sincere 2000s song actually perfectly captures a moment in your relationship?", subtext: "Don't reach for the cool answer. Find the real one." },

  // 2010s
  { id: 'nos-10-01', type: 'nostalgia' as const, era: '2010s', yearRange: [2010, 2019] as [number,number], category: 'tech' as const, depth: 'surface' as const, content: 'Show your partner the oldest Instagram photo of you that still exists. What does it say about who you were then?', subtext: "And does your partner think that person is better or worse than who you are now?" },
  { id: 'nos-10-02', type: 'nostalgia' as const, era: '2010s', yearRange: [2010, 2019] as [number,number], category: 'culture' as const, depth: 'surface' as const, content: "Netflix and chill — but actually. What was the first thing you watched together that you knew was real?", subtext: "Not the euphemism. The actual moment sitting on the couch, when comfort set in." },
  { id: 'nos-10-03', type: 'nostalgia' as const, era: '2010s', yearRange: [2010, 2019] as [number,number], category: 'tech' as const, depth: 'surface' as const, content: "Read your partner your first ever text to them. Or the text you almost sent but deleted.", subtext: "We know you scrolled back there at some point." },
  { id: 'nos-10-04', type: 'nostalgia' as const, era: '2010s', yearRange: [2010, 2019] as [number,number], category: 'music' as const, depth: 'surface' as const, content: "What was the song Shazam identified the night something shifted between you two?", subtext: "Every couple has one. What was playing?" },
  { id: 'nos-10-05', type: 'nostalgia' as const, era: '2010s', yearRange: [2010, 2019] as [number,number], category: 'daily' as const, depth: 'surface' as const, content: "Snapchat streaks were serious in 2014. What thing in your relationship do you protect with that same energy right now?", subtext: "Not a physical thing. A ritual, a habit, a moment." },
  { id: 'nos-10-06', type: 'nostalgia' as const, era: '2010s', yearRange: [2010, 2019] as [number,number], category: 'culture' as const, depth: 'current' as const, content: '"We need to talk." — When in your relationship did that text send a different level of fear than it does now?', subtext: "How has your relationship's baseline security changed since the beginning?" },

  // 2020s
  { id: 'nos-20-01', type: 'nostalgia' as const, era: '2020s', yearRange: [2020, 2029] as [number,number], category: 'daily' as const, depth: 'surface' as const, content: "Lockdown 2020. If you were locked down together — what habit from that time do you still secretly miss?", subtext: "If you weren't together yet — where were you, and did you know this person existed yet?" },
  { id: 'nos-20-02', type: 'nostalgia' as const, era: '2020s', yearRange: [2020, 2029] as [number,number], category: 'tech' as const, depth: 'surface' as const, content: "Wordle, BeReal, TikTok spirals at midnight. Which digital thing of the early 2020s best describes a phase your relationship went through?", subtext: "A Wordle streak of success? Or a 3am doom scroll phase where you both kind of checked out?" },
  { id: 'nos-20-03', type: 'nostalgia' as const, era: '2020s', yearRange: [2020, 2029] as [number,number], category: 'culture' as const, depth: 'surface' as const, content: '"That girl / that guy era." Were you in your main character era when you met your partner — or were they the reason you entered it?' },

  // Anniversary-era
  { id: 'nos-ann-01', type: 'nostalgia' as const, era: 'anniversary', yearRange: [1970, 2030] as [number,number], category: 'culture' as const, depth: 'surface' as const, content: "What was #1 on the charts the week you got together?", subtext: "Look it up right now. Play 10 seconds. Does it fit, or is it embarrassingly wrong?" },
  { id: 'nos-ann-02', type: 'nostalgia' as const, era: 'anniversary', yearRange: [1970, 2030] as [number,number], category: 'film' as const, depth: 'surface' as const, content: "What was the biggest movie of the year you first met? Did you see it together?", subtext: "If not, is it on your watchlist now?" },
  { id: 'nos-ann-03', type: 'nostalgia' as const, era: 'anniversary', yearRange: [1970, 2030] as [number,number], category: 'daily' as const, depth: 'surface' as const, content: "Describe the world the year you fell in love — in one sentence each. Then compare.", subtext: "What were people obsessed with? What felt scary? What felt possible?" },

  // ══════════════════════════════════════════════════════════════
  // MODERN ERA — 2024-2026 current-era cards
  // ══════════════════════════════════════════════════════════════

  { id: 'mod-01', type: 'this-or-that', depth: 'surface',
    content: 'ChatGPT, Spotify Wrapped, or your partner — which one actually knows you best right now?',
    options: ['The algorithm', 'My partner, no contest'] as [string, string] },

  { id: 'mod-02', type: 'what-if', depth: 'surface',
    content: "If your relationship was a Netflix series, what genre would it be — and has it been renewed for another season?",
    subtext: 'Be honest about where you are in the story arc right now.' },

  { id: 'mod-03', type: 'what-if', depth: 'current',
    content: "Post-pandemic, what did you lose as a couple that you've never gotten back? What did you gain that you didn't expect?",
    subtext: 'Name one of each. The loss first, then the unexpected gain.',
    framework: 'Brené Brown: Named losses are grievable. Unnamed losses become resentment.' },

  { id: 'mod-04', type: 'this-or-that', depth: 'surface',
    content: "Which is actually more damaging to us right now?",
    options: ['Doomscrolling alone at 11pm', 'Watching something mindless together'] as [string, string] },

  { id: 'mod-05', type: 'what-if', depth: 'current',
    content: "If an AI could tell you one true thing about your relationship that neither of you has been willing to say — what do you think it would be?",
    subtext: "Don't dodge this. What's the thing you both already sense?",
    framework: 'Gottman: The things couples avoid saying are usually the things that matter most.' },

  { id: 'mod-06', type: 'this-or-that', depth: 'surface',
    content: "Phone in another room during dinner together — where do we actually stand?",
    options: ['Honestly, a real issue for us', 'Not actually a big deal'] as [string, string] },

  { id: 'mod-07', type: 'what-if', depth: 'current',
    content: "You both took a full week off all screens. What do you think you'd discover about each other in that silence?",
    subtext: 'Would it feel like relief or discomfort? Who would adjust faster?' },

  { id: 'mod-08', type: 'what-if', depth: 'surface',
    content: "If your relationship had a Spotify Wrapped, what would be the most-played emotion of this past year?",
    subtext: "One word for each of you. Then ask: is that the emotion you wanted, or the one that just happened?" },

  { id: 'mod-09', type: 'this-or-that', depth: 'current',
    content: "In the context of our life together, which AI-era fear is more real to you?",
    options: ['Being replaced at work', 'Losing our ability to be present with each other'] as [string, string] },

  { id: 'mod-10', type: 'what-if', depth: 'current',
    content: "If your relationship had a comment section, what would the most upvoted comment say — and what would you actually want it to say?",
    subtext: "The gap between those two answers is a conversation worth having.",
    framework: 'Esther Perel: How others perceive your relationship shapes how you perceive it yourselves.' },

  { id: 'mod-11', type: 'what-if', depth: 'surface',
    content: "If you two started a podcast together, what would it actually be about? Not the polished version — the real one.",
    subtext: 'The thing you actually talk about at 1am.' },

  { id: 'mod-12', type: 'this-or-that', depth: 'surface',
    content: "Remote work / WFH has made us:",
    options: ['Closer — more time, more connection', 'More separate — less intentional about us time'] as [string, string] },

  { id: 'mod-13', type: 'what-if', depth: 'current',
    content: "The streaming wars are exhausting. If your relationship could only subscribe to one platform forever — which survives and what does that reveal about your shared values?",
    subtext: 'Justify it. The answer is actually about priorities.' },

];


// ──────────────────────────────────────────────────────────────────────────────
// SESSION BUILDER — with type diversity guarantee
// ──────────────────────────────────────────────────────────────────────────────

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
    const driftCount = driftMap.get(card.id) ?? 0;
    return driftCount < 3;
  });

  let pool = available;
  if (seasonFocus && seasonFocus.length > 0 && totalSessions > 0) {
    const focused = available.filter(c => seasonFocus.includes(c.type));
    if (focused.length >= 3) {
      const other = available.filter(c => !seasonFocus.includes(c.type));
      pool = [...focused, ...other];
    }
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  // Guarantee at least one card of each available type in sessions of 5+
  if (count >= 5) {
    const selected: Card[] = [];
    const usedTypes = new Set<Card['type']>();
    for (const card of shuffled) {
      if (!usedTypes.has(card.type) && selected.length < Math.min(count - 1, 6)) {
        selected.push(card);
        usedTypes.add(card.type);
      }
    }
    for (const card of shuffled) {
      if (!selected.includes(card) && selected.length < count) {
        selected.push(card);
      }
    }
    return selected.sort(() => Math.random() - 0.5);
  }

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
  nostalgia: '🕰️ Nostalgia',
};

export const CARD_TYPE_COLORS: Record<Card['type'], string> = {
  dare: '#e879a0',
  'this-or-that': '#8b5cf6',
  'what-if': '#0ea5e9',
  challenge: '#f59e0b',
  spicy: '#ef4444',
  thunder: '#334155',
  legacy: '#7ec8a4',
  repair: '#a78bfa',
  nostalgia: '#b45309',
};

export const CARD_TYPE_DESCRIPTIONS: Record<Card['type'], string> = {
  dare: 'Do it together',
  'this-or-that': 'Choose privately, reveal together',
  'what-if': 'Discuss out loud',
  challenge: 'Beat the clock',
  spicy: 'Say it out loud',
  thunder: 'The card that changes something',
  legacy: "Honor what you've built",
  repair: 'Come back to each other',
  nostalgia: 'A moment from the era you shared',
};

/**
 * Get nostalgia cards relevant to a couple's anniversary year.
 * Prioritizes: anniversary-era cards first, then the era matching their year, then all others.
 */
export function getNostalgiaCardsForYear(anniversaryYear?: number): Card[] {
  const year = anniversaryYear ?? new Date().getFullYear();
  const nostalgiaCards = CARDS.filter(c => c.type === 'nostalgia');
  const anniversaryCards = nostalgiaCards.filter(c => c.era === 'anniversary');
  const eraCards = nostalgiaCards.filter(c =>
    c.era !== 'anniversary' &&
    c.yearRange !== undefined &&
    c.yearRange[0] <= year &&
    c.yearRange[1] >= year
  );
  const otherCards = nostalgiaCards.filter(c =>
    c.era !== 'anniversary' &&
    !(c.yearRange !== undefined && c.yearRange[0] <= year && c.yearRange[1] >= year)
  );
  return [...anniversaryCards, ...eraCards, ...otherCards];
}
