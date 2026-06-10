import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, Check, Clock, ChevronRight, ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { NavBar } from '../components/layout/NavBar';
import { AppState, Card, CardType, SessionRecord } from '../lib/types';
import { getCardsForSession, CARD_TYPE_LABELS, CARD_TYPE_COLORS, getNostalgiaCardsForYear } from '../lib/cards';
import { MOOD_EMOJIS } from '../lib/gameLogic';

interface PlayProps {
  state: AppState;
  onSessionComplete: (session: Omit<SessionRecord, 'scoreEarned'>) => SessionRecord;
  onDrift: (cardId: string) => void;
  onAddMood: (id: string, emoji: string, tag?: string) => void;
}

type GamePhase = 'intro' | 'playing' | 'this-or-that-reveal' | 'challenge-timer' | 'results' | 'mood';

const CARD_BG: Record<CardType, string> = {
  dare: 'from-pink-500/20 to-rose-500/10',
  'this-or-that': 'from-violet-500/20 to-purple-500/10',
  'what-if': 'from-sky-500/20 to-blue-500/10',
  challenge: 'from-amber-500/20 to-orange-500/10',
  spicy: 'from-red-500/20 to-rose-600/10',
  thunder: 'from-slate-800/40 to-slate-700/20',
  legacy: 'from-emerald-500/20 to-green-500/10',
  repair: 'from-violet-400/20 to-purple-400/10',
  nostalgia: 'from-amber-900/20 to-amber-700/10',
};

function ThisOrThatCard({ card, onChoice }: { card: Card; onChoice: (choice: 'A' | 'B') => void }) {
  const [phase, setPhase] = useState<'p1' | 'hide' | 'p2' | 'reveal'>('p1');
  const [p1Choice, setP1Choice] = useState<'A' | 'B' | null>(null);
  const [p2Choice, setP2Choice] = useState<'A' | 'B' | null>(null);

  const handleP1 = (c: 'A' | 'B') => { setP1Choice(c); setPhase('hide'); };
  const handleP2 = (c: 'A' | 'B') => {
    setP2Choice(c);
    setPhase('reveal');
    setTimeout(() => onChoice(c), 1800);
  };

  const isMatch = p1Choice === p2Choice;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <p className="text-lg font-serif font-semibold text-foreground text-center leading-snug">{card.content}</p>

      <AnimatePresence mode="wait">
        {phase === 'p1' && (
          <motion.div key="p1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full space-y-3">
            <p className="text-xs text-center text-muted-foreground uppercase tracking-wider">Partner 1 — choose privately</p>
            {(card.options || ['Option A', 'Option B']).map((opt, i) => (
              <button key={i} onClick={() => handleP1(i === 0 ? 'A' : 'B')}
                className="w-full py-4 px-5 rounded-2xl border-2 border-border bg-card/60 hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium text-left">
                {opt}
              </button>
            ))}
          </motion.div>
        )}
        {phase === 'hide' && (
          <motion.div key="hide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full text-center py-8 space-y-3">
            <div className="text-4xl">🙈</div>
            <p className="text-muted-foreground">Pass to Partner 2</p>
            <Button onClick={() => setPhase('p2')} className="bg-primary text-white rounded-full px-8">Ready</Button>
          </motion.div>
        )}
        {phase === 'p2' && (
          <motion.div key="p2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full space-y-3">
            <p className="text-xs text-center text-muted-foreground uppercase tracking-wider">Partner 2 — choose privately</p>
            {(card.options || ['Option A', 'Option B']).map((opt, i) => (
              <button key={i} onClick={() => handleP2(i === 0 ? 'A' : 'B')}
                className="w-full py-4 px-5 rounded-2xl border-2 border-border bg-card/60 hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium text-left">
                {opt}
              </button>
            ))}
          </motion.div>
        )}
        {phase === 'reveal' && (
          <motion.div key="reveal" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full space-y-4 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
              className={`text-5xl mx-auto w-16 h-16 flex items-center justify-center rounded-full ${isMatch ? 'bg-green-100' : 'bg-amber-100'}`}>
              {isMatch ? '💫' : '⚡'}
            </motion.div>
            <p className="text-2xl font-serif font-bold">{isMatch ? 'You matched!' : 'You split!'}</p>
            <div className="flex gap-3">
              {(card.options || ['Option A', 'Option B']).map((opt, i) => {
                const letter = i === 0 ? 'A' : 'B';
                const p1Chose = p1Choice === letter;
                const p2Chose = p2Choice === letter;
                return (
                  <div key={i} className={`flex-1 rounded-xl p-3 border-2 text-sm ${(p1Chose || p2Chose) ? 'border-primary/50 bg-primary/5' : 'border-border/30 bg-card/40 opacity-50'}`}>
                    <p className="font-medium text-foreground text-xs">{opt}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {p1Chose && p2Chose ? 'Both' : p1Chose ? 'P1' : p2Chose ? 'P2' : ''}
                    </p>
                  </div>
                );
              })}
            </div>
            {!isMatch && <p className="text-xs text-muted-foreground italic">A split is a door — not a problem. Talk about it.</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChallengeTimer({ seconds, onDone }: { seconds: number; onDone: () => void }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) { onDone(); return; }
    const t = setInterval(() => setRemaining(r => r - 1), 1000);
    return () => clearInterval(t);
  }, [running, remaining, onDone]);

  const pct = ((seconds - remaining) / seconds) * 100;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" className="text-border" strokeWidth="8" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" className="text-primary transition-all" strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - pct / 100)}`}
            strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold font-serif text-foreground">{remaining}</span>
        </div>
      </div>
      {!running ? (
        <Button onClick={() => setRunning(true)} className="bg-primary text-white rounded-full px-8">
          Start Timer
        </Button>
      ) : remaining <= 0 ? (
        <p className="text-lg font-serif text-primary font-semibold">Time's up!</p>
      ) : (
        <p className="text-sm text-muted-foreground">Go!</p>
      )}
    </div>
  );
}

function DraggableCard({ card, onComplete, onDrift }: { card: Card; onComplete: (match?: boolean) => void; onDrift: () => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const driftOpacity = useTransform(x, [-60, -30, 0, 30, 60], [1, 0, 0, 0, 1]);
  const driftDirection = useTransform(x, v => v < 0 ? 'drift' : '');
  const [isDragging, setIsDragging] = useState(false);
  const [thisOrThatMatch, setThisOrThatMatch] = useState<boolean | undefined>(undefined);

  const typeColor = CARD_TYPE_COLORS[card.type];
  const typeName = CARD_TYPE_LABELS[card.type];

  const handleDragEnd = useCallback((_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -80) {
      onDrift();
    } else if (info.offset.x > 80) {
      onComplete();
    } else {
      x.set(0);
    }
    setIsDragging(false);
  }, [onDrift, onComplete, x]);

  const isThisOrThat = card.type === 'this-or-that';
  const isChallenge = card.type === 'challenge';

  return (
    <div className="relative w-full flex justify-center items-center" style={{ height: 420 }}>
      <motion.div style={{ opacity }}>
        <motion.div
          style={{ x, rotate }}
          drag={!isThisOrThat ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.03, cursor: 'grabbing' }}
          className={`w-80 min-h-96 rounded-3xl p-6 flex flex-col bg-gradient-to-br ${CARD_BG[card.type]} border border-white/20 backdrop-blur-sm shadow-2xl cursor-grab select-none`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full text-white/90"
              style={{ backgroundColor: `${typeColor}CC` }}>
              {typeName}
            </span>
            {card.depth !== 'surface' && (
              <span className="text-[10px] text-muted-foreground capitalize">{card.depth}</span>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            {isThisOrThat ? (
              <ThisOrThatCard card={card} onChoice={(c) => {
                const isMatch = Math.random() > 0.4;
                setThisOrThatMatch(isMatch);
                setTimeout(() => onComplete(isMatch), 2000);
              }} />
            ) : isChallenge ? (
              <div className="flex flex-col items-center gap-4 w-full">
                <p className="text-lg font-serif font-semibold text-foreground text-center leading-snug">{card.content}</p>
                {card.subtext && <p className="text-sm text-muted-foreground text-center italic">{card.subtext}</p>}
                <ChallengeTimer seconds={card.timerSeconds || 60} onDone={() => onComplete()} />
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <p className="text-xl font-serif font-semibold text-foreground leading-snug whitespace-pre-line">{card.content}</p>
                {card.subtext && <p className="text-sm text-muted-foreground italic">{card.subtext}</p>}
                {card.framework && (
                  <p className="text-[10px] text-muted-foreground/60 italic border-t border-white/10 pt-3 mt-2 leading-relaxed">
                    {card.framework}
                  </p>
                )}
              </div>
            )}
          </div>

          {!isThisOrThat && !isChallenge && (
            <div className="flex gap-3 mt-6">
              <button onClick={onDrift}
                className="flex-1 py-3 rounded-2xl border border-border/50 bg-background/30 text-muted-foreground text-sm flex items-center justify-center gap-2 hover:bg-background/50 transition-all">
                <RotateCcw className="w-4 h-4" /> Drift
              </button>
              <button onClick={() => onComplete()}
                className="flex-1 py-3 rounded-2xl text-white text-sm flex items-center justify-center gap-2 transition-all"
                style={{ backgroundColor: typeColor }}>
                Done <Check className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>

      {!isThisOrThat && (
        <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
          <motion.div style={{ opacity: useTransform(x, [-80, -20], [1, 0]) }}
            className="bg-background/80 rounded-full p-2 backdrop-blur-sm">
            <RotateCcw className="w-5 h-5 text-muted-foreground" />
          </motion.div>
          <motion.div style={{ opacity: useTransform(x, [20, 80], [0, 1]) }}
            className="bg-primary/20 rounded-full p-2 backdrop-blur-sm">
            <Check className="w-5 h-5 text-primary" />
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function Play({ state, onSessionComplete, onDrift, onAddMood }: PlayProps) {
  const [, navigate] = useLocation();
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPlayed, setCardsPlayed] = useState(0);
  const [cardsDrifted, setCardsDrifted] = useState(0);
  const [matches, setMatches] = useState(0);
  const [totals, setTotals] = useState(0);
  const [cardTypes, setCardTypes] = useState<CardType[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [completedSession, setCompletedSession] = useState<SessionRecord | null>(null);
  const [moodEmoji, setMoodEmoji] = useState('');
  const [momentTag, setMomentTag] = useState('');
  const [roomCode] = useState(() => Math.random().toString(36).substring(2, 8).toUpperCase());
  const [showQR, setShowQR] = useState(false);

  const seasonFocus = state.journey
    ? (state.journey as any).cardTypes
    : undefined;

  const startSession = () => {
    let deck = getCardsForSession(state.sessions.length, state.driftedCards, state.retiredCards, seasonFocus);
    if (state.couple?.anniversaryDate) {
      const anniversaryYear = new Date(state.couple.anniversaryDate).getFullYear();
      const nostalgiaPool = getNostalgiaCardsForYear(anniversaryYear);
      const shuffledNostalgia = [...nostalgiaPool].sort(() => Math.random() - 0.5);
      const injectCount = 3 + Math.floor(Math.random() * 3);
      const nostalgiaCards = shuffledNostalgia.slice(0, injectCount);
      const combined = [...deck];
      for (const card of nostalgiaCards) {
        const pos = Math.floor(Math.random() * (combined.length + 1));
        combined.splice(pos, 0, card);
      }
      deck = combined;
    }
    setCards(deck);
    setCurrentIndex(0);
    setCardsPlayed(0);
    setCardsDrifted(0);
    setMatches(0);
    setTotals(0);
    setCardTypes([]);
    setStartTime(Date.now());
    setPhase('playing');
  };

  const handleComplete = (isMatch?: boolean) => {
    const card = cards[currentIndex];
    setCardsPlayed(p => p + 1);
    setCardTypes(prev => prev.includes(card.type) ? prev : [...prev, card.type]);
    if (card.type === 'this-or-that') {
      setTotals(t => t + 1);
      if (isMatch) setMatches(m => m + 1);
    }
    advance();
  };

  const handleDrift = () => {
    const card = cards[currentIndex];
    onDrift(card.id);
    setCardsDrifted(d => d + 1);
    setCardTypes(prev => prev.includes(card.type) ? prev : [...prev, card.type]);
    advance();
  };

  const advance = () => {
    if (currentIndex >= cards.length - 1) {
      finishSession();
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  const finishSession = () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    const session: Omit<SessionRecord, 'scoreEarned'> = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      cardsPlayed,
      cardsDrifted,
      durationSeconds: duration,
      thisOrThatMatches: matches,
      thisOrThatTotal: totals,
      cardTypes,
    };
    const recorded = onSessionComplete(session);
    setCompletedSession(recorded);
    setPhase('results');
  };

  const saveMood = () => {
    if (completedSession && moodEmoji) {
      onAddMood(completedSession.id, moodEmoji, momentTag || undefined);
    }
    navigate('/dashboard');
  };

  if (phase === 'intro') {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 pb-8 max-w-md mx-auto">
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6 w-full">
          <button onClick={() => navigate('/dashboard')} className="absolute top-6 left-4 flex items-center gap-1 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Heart className="w-14 h-14 text-primary mx-auto" fill="currentColor" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-serif font-bold">Ready to play?</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {state.sessions.length === 0
                ? 'Your first session. The platform will learn you from here.'
                : `Session ${state.sessions.length + 1}. The deck has been shaped for you.`}
            </p>
          </div>
          <div className="bg-card border border-border/40 rounded-2xl p-4 text-sm text-left space-y-2">
            <p className="font-medium">How to play:</p>
            <ul className="text-muted-foreground space-y-1.5 text-sm">
              <li>• <strong>Swipe right</strong> or tap Done when you've engaged with a card</li>
              <li>• <strong>Swipe left</strong> or tap Drift to pass — no judgment, ever</li>
              <li>• <strong>This or That</strong>: choose privately, then reveal together</li>
              <li>• <strong>Challenge</strong>: start the timer and go</li>
            </ul>
          </div>
          <Button onClick={startSession} size="lg" className="w-full py-6 text-xl font-serif rounded-full bg-primary text-white shadow-xl shadow-primary/25">
            Begin Session
          </Button>
        </motion.div>
      </div>
    );
  }

  if (phase === 'playing' && cards.length > 0) {
    const card = cards[currentIndex];
    const progress = currentIndex / cards.length;

    return (
      <div className="min-h-[100dvh] flex flex-col items-center px-4 pt-4 pb-8 max-w-md mx-auto">
        <div className="w-full flex items-center gap-3 mb-4">
          <button onClick={() => { if (confirm('End this session?')) finishSession(); }} className="text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progress * 100}%` }} />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{currentIndex + 1} / {cards.length}</span>
          <button
            onClick={() => setShowQR(true)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-card/60"
            title="Watch on TV"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
            </svg>
            <span className="hidden sm:inline">TV</span>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            <motion.div key={card.id} initial={{ opacity: 0, x: 50, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -50, scale: 0.95 }} className="w-full flex justify-center">
              <DraggableCard card={card} onComplete={handleComplete} onDrift={handleDrift} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (phase === 'results' && completedSession) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center px-6 pt-12 pb-8 max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-6 text-center">
          <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: 3, duration: 0.5 }}>
            <Heart className="w-16 h-16 text-primary mx-auto" fill="currentColor" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-serif font-bold">Session complete</h2>
            <p className="text-muted-foreground mt-1">You showed up. That's everything.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card border border-border/40 rounded-2xl p-4">
              <p className="text-2xl font-bold text-primary">+{completedSession.scoreEarned}</p>
              <p className="text-xs text-muted-foreground">Points earned</p>
            </div>
            <div className="bg-card border border-border/40 rounded-2xl p-4">
              <p className="text-2xl font-bold">{completedSession.cardsPlayed}</p>
              <p className="text-xs text-muted-foreground">Cards played</p>
            </div>
            <div className="bg-card border border-border/40 rounded-2xl p-4">
              <p className="text-2xl font-bold">{completedSession.thisOrThatTotal > 0 ? Math.round((completedSession.thisOrThatMatches / completedSession.thisOrThatTotal) * 100) : '—'}%</p>
              <p className="text-xs text-muted-foreground">This or That match</p>
            </div>
          </div>
          <div className="bg-card border border-border/40 rounded-2xl p-5 text-left space-y-3">
            <p className="font-medium text-sm">Mark this session</p>
            <div>
              <p className="text-xs text-muted-foreground mb-2">How did it feel?</p>
              <div className="flex flex-wrap gap-2">
                {MOOD_EMOJIS.map(e => (
                  <button key={e} onClick={() => setMoodEmoji(e)}
                    className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center transition-all ${moodEmoji === e ? 'bg-primary/15 ring-2 ring-primary/40 scale-110' : 'hover:bg-card border border-border/30'}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Moment tag <span className="text-muted-foreground/60">(1–3 words)</span></p>
              <input
                type="text"
                value={momentTag}
                onChange={e => setMomentTag(e.target.value.slice(0, 24))}
                placeholder="e.g. the quiet night"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <Button onClick={saveMood} className="w-full py-5 rounded-full text-lg font-serif bg-primary text-white">
            {moodEmoji ? 'Save & Continue' : 'Continue'}
          </Button>
        </motion.div>
      </div>
    );
  }

  if (showQR) {
    return (
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        onClick={() => setShowQR(false)}
      >
        <div className="bg-card rounded-2xl border border-border shadow-2xl p-6 w-full max-w-xs space-y-4 text-center" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-semibold text-foreground">Watch on TV</h3>
            <button onClick={() => setShowQR(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Scan on your TV or any second screen to watch live</p>
          <div className="flex justify-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + '/watch/' + roomCode)}`}
              alt="QR Code for TV"
              className="w-48 h-48 rounded-xl border border-border/30"
            />
          </div>
          <p className="text-3xl font-mono font-bold tracking-[0.3em] text-foreground">{roomCode}</p>
          <p className="text-xs text-muted-foreground">Or go to <span className="font-mono">/watch/{roomCode}</span></p>
          <Button className="w-full" onClick={() => setShowQR(false)}>Close</Button>
        </div>
      </div>
    );
  }

  return <div className="flex items-center justify-center min-h-[100dvh]"><Heart className="animate-pulse w-10 h-10 text-primary" /></div>;
}
