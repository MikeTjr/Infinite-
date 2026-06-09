import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronRight, ChevronLeft, Check, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { NavBar } from '../components/layout/NavBar';
import { AppState, MirrorResults } from '../lib/types';
import { LOVE_LANGUAGE_QUESTIONS, CONFLICT_STYLE_QUESTIONS } from '../lib/gameLogic';

interface MirrorProps {
  state: AppState;
  onSaveMirror: (results: MirrorResults) => void;
}

type Assessment = 'love-language' | 'conflict-style';
type Phase = 'dashboard' | 'assessment-select' | 'taking-p1' | 'taking-p2' | 'results';

const LOVE_LANGUAGE_DESC: Record<string, string> = {
  'Quality Time': 'You feel most loved when your partner is fully present — phone away, attention undivided. Time is your love.',
  'Words of Affirmation': 'Spoken (or written) words carry enormous weight for you. Hearing why you\'re loved matters as much as being loved.',
  'Physical Touch': 'Presence through touch — a hand, a hug, a small brush — makes you feel safe and connected. Physical closeness is emotional closeness.',
  'Acts of Service': 'When someone does something for you — without being asked — it says "I see you and I care." Action is love.',
  'Receiving Gifts': 'It\'s not the gift. It\'s the thought. A small thing that says "I thought of you" is profound. Thoughtfulness is love.',
};

const CONFLICT_STYLE_DESC: Record<string, string> = {
  'Pursuer': 'Under stress, you move toward — you want to resolve it now, you need engagement. Silence can feel like abandonment. Your strength is directness. Your challenge is learning when to wait.',
  'Withdrawer': 'Under stress, you pull back — not because you don\'t care, but because you need to process before you can connect. Your strength is calm. Your challenge is learning to signal "I\'m still here."',
  'Redirector': 'Under stress, you look for the off-ramp — de-escalation, common ground, a change of scene. Your strength is perspective. Your challenge is ensuring nothing important goes unsaid.',
};

function countVotes(answers: string[]): string {
  const tally: Record<string, number> = {};
  answers.forEach(a => { tally[a] = (tally[a] || 0) + 1; });
  return Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
}

export default function Mirror({ state, onSaveMirror }: MirrorProps) {
  const [view, setView] = useState<Assessment | null>(null);
  const [phase, setPhase] = useState<Phase>('dashboard');
  const [p1Answers, setP1Answers] = useState<string[]>([]);
  const [p2Answers, setP2Answers] = useState<string[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [activePartner, setActivePartner] = useState<1 | 2>(1);
  const [showReveal, setShowReveal] = useState(false);

  const { mirror } = state;

  const questions = view === 'love-language' ? LOVE_LANGUAGE_QUESTIONS : CONFLICT_STYLE_QUESTIONS;

  const startAssessment = (a: Assessment) => {
    setView(a);
    setPhase('taking-p1');
    setP1Answers([]);
    setP2Answers([]);
    setCurrentQ(0);
    setActivePartner(1);
    setShowReveal(false);
  };

  const handleAnswer = (answer: string) => {
    const current = activePartner === 1 ? [...p1Answers, answer] : [...p2Answers, answer];
    if (activePartner === 1) setP1Answers(current);
    else setP2Answers(current);

    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      if (activePartner === 1) {
        setPhase('taking-p2');
        setActivePartner(2);
        setCurrentQ(0);
      } else {
        const p1Result = countVotes(view === 'love-language' ? p1Answers.map((a, i) => LOVE_LANGUAGE_QUESTIONS[i][a === LOVE_LANGUAGE_QUESTIONS[i].optionA ? 'a' : 'b']) : p1Answers);
        const p2Result = countVotes(view === 'love-language' ? p2Answers.map((a, i) => LOVE_LANGUAGE_QUESTIONS[i][a === LOVE_LANGUAGE_QUESTIONS[i].optionA ? 'a' : 'b']) : p2Answers);

        if (view === 'love-language') {
          onSaveMirror({ loveLanguage: { partner1Result: p1Result, partner2Result: p2Result, completedAt: new Date().toISOString() } });
        } else {
          onSaveMirror({ conflictStyle: { partner1Result: p1Result as any, partner2Result: p2Result as any, completedAt: new Date().toISOString() } });
        }
        setPhase('results');
        setShowReveal(true);
      }
    }
  };

  const handleLLAnswer = (opt: 'A' | 'B') => {
    const q = LOVE_LANGUAGE_QUESTIONS[currentQ];
    handleAnswer(opt === 'A' ? q.a : q.b);
  };

  const handleCSAnswer = (style: string) => {
    handleAnswer(style);
  };

  const loveQ = view === 'love-language' && currentQ < LOVE_LANGUAGE_QUESTIONS.length ? LOVE_LANGUAGE_QUESTIONS[currentQ] : null;
  const conflictQ = view === 'conflict-style' && currentQ < CONFLICT_STYLE_QUESTIONS.length ? CONFLICT_STYLE_QUESTIONS[currentQ] : null;

  const p1LL = mirror.loveLanguage?.partner1Result;
  const p2LL = mirror.loveLanguage?.partner2Result;
  const p1CS = mirror.conflictStyle?.partner1Result;
  const p2CS = mirror.conflictStyle?.partner2Result;

  return (
    <div className="min-h-[100dvh] pb-28 px-4 pt-6 max-w-md mx-auto">
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-violet-500/8 to-transparent pointer-events-none" />

      <AnimatePresence mode="wait">
        {phase === 'dashboard' && (
          <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-serif font-bold">The Mirror</h1>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">Self-knowledge is the foundation. These assessments reveal how you each receive love and handle conflict — and what that means together.</p>

            <div className="space-y-3">
              <div className="bg-card border border-border/40 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif font-semibold">Love Language Profile</h3>
                  {mirror.loveLanguage ? <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1"><Check className="w-3 h-3" /> Complete</span> : null}
                </div>
                <p className="text-sm text-muted-foreground mb-4">5 questions each. Reveals how you each give and receive love — and where you may be speaking different languages.</p>
                {mirror.loveLanguage ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{state.couple?.partner1}</span>
                      <span className="font-medium text-foreground">{mirror.loveLanguage.partner1Result}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{state.couple?.partner2}</span>
                      <span className="font-medium text-foreground">{mirror.loveLanguage.partner2Result}</span>
                    </div>
                    {mirror.loveLanguage.partner1Result === mirror.loveLanguage.partner2Result ? (
                      <p className="text-xs text-primary italic mt-1">✦ You share the same love language — rare and worth knowing.</p>
                    ) : (
                      <p className="text-xs text-muted-foreground italic mt-1">You speak different languages. Understanding this is itself a bridge.</p>
                    )}
                    <button onClick={() => startAssessment('love-language')} className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                      <RefreshCw className="w-3 h-3" /> Retake
                    </button>
                  </div>
                ) : (
                  <Button onClick={() => startAssessment('love-language')} className="w-full rounded-xl bg-primary text-white">
                    Begin Assessment
                  </Button>
                )}
              </div>

              <div className="bg-card border border-border/40 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif font-semibold">Conflict Style Map</h3>
                  {mirror.conflictStyle ? <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1"><Check className="w-3 h-3" /> Complete</span> : null}
                </div>
                <p className="text-sm text-muted-foreground mb-4">6 questions each. Reveals each partner's pattern under stress — Pursuer, Withdrawer, or Redirector — and what happens when they interact.</p>
                {mirror.conflictStyle ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{state.couple?.partner1}</span>
                      <span className="font-medium text-foreground">{mirror.conflictStyle.partner1Result}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{state.couple?.partner2}</span>
                      <span className="font-medium text-foreground">{mirror.conflictStyle.partner2Result}</span>
                    </div>
                    <button onClick={() => startAssessment('conflict-style')} className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                      <RefreshCw className="w-3 h-3" /> Retake
                    </button>
                  </div>
                ) : (
                  <Button onClick={() => startAssessment('conflict-style')} className="w-full rounded-xl bg-primary text-white" disabled={!mirror.loveLanguage}>
                    {mirror.loveLanguage ? 'Begin Assessment' : 'Complete Love Language first'}
                  </Button>
                )}
              </div>

              {(p1LL && p2LL && p1CS && p2CS) && (
                <div className="bg-card border border-border/40 rounded-2xl p-5">
                  <h3 className="font-serif font-semibold mb-3">Your Relationship Map</h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                      <p className="font-medium text-primary text-xs uppercase tracking-wider mb-1">Love</p>
                      <p className="text-foreground">{p1LL === p2LL ? `Both: ${p1LL}` : `${p1LL} × ${p2LL}`}</p>
                      <p className="text-muted-foreground text-xs mt-1">{p1LL === p2LL ? 'Aligned' : 'Different languages — bridge-building is the work'}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/20">
                      <p className="font-medium text-violet-600 text-xs uppercase tracking-wider mb-1">Conflict</p>
                      <p className="text-foreground">{p1CS === p2CS ? `Both: ${p1CS}` : `${p1CS} × ${p2CS}`}</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        {p1CS === 'Pursuer' && p2CS === 'Withdrawer' ? 'Classic pursue-withdraw. The most common pattern. Name it and it loses its power.' :
                         p1CS === p2CS ? 'Same style — your unity is also your blind spot.' : 'Different styles can complement each other.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {(phase === 'taking-p1' || phase === 'taking-p2') && (
          <motion.div key={phase} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setPhase('dashboard')} className="text-muted-foreground"><ChevronLeft className="w-5 h-5" /></button>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {view === 'love-language' ? 'Love Language' : 'Conflict Style'} · {phase === 'taking-p1' ? `${state.couple?.partner1 || 'Partner 1'}` : `${state.couple?.partner2 || 'Partner 2'}`}
                </p>
                <div className="h-1.5 bg-border rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(currentQ / questions.length) * 100}%` }} />
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{currentQ + 1}/{questions.length}</span>
            </div>

            {loveQ && (
              <AnimatePresence mode="wait">
                <motion.div key={`ll-${currentQ}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                  <p className="text-xl font-serif font-semibold leading-snug">{loveQ.scenario}</p>
                  <div className="space-y-3">
                    {[loveQ.optionA, loveQ.optionB].map((opt, idx) => (
                      <button key={idx} onClick={() => handleLLAnswer(idx === 0 ? 'A' : 'B')}
                        className="w-full py-4 px-5 rounded-2xl border-2 border-border bg-card/60 hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium text-left">
                        {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {conflictQ && (
              <AnimatePresence mode="wait">
                <motion.div key={`cs-${currentQ}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                  <p className="text-xl font-serif font-semibold leading-snug">{conflictQ.question}</p>
                  <div className="space-y-3">
                    {conflictQ.options.map((opt, i) => (
                      <button key={i} onClick={() => handleCSAnswer(opt.style)}
                        className="w-full py-4 px-5 rounded-2xl border-2 border-border bg-card/60 hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium text-left">
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        )}

        {phase === 'results' && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="text-center space-y-2">
              <div className="text-4xl">🌟</div>
              <h2 className="text-2xl font-serif font-bold">Your results</h2>
              <p className="text-muted-foreground text-sm">Both complete. Here's what the Mirror shows.</p>
            </div>

            {view === 'love-language' && mirror.loveLanguage && (
              <div className="space-y-3">
                {[
                  { name: state.couple?.partner1, result: mirror.loveLanguage.partner1Result },
                  { name: state.couple?.partner2, result: mirror.loveLanguage.partner2Result },
                ].map(({ name, result }) => (
                  <div key={name} className="bg-card border border-border/40 rounded-2xl p-5">
                    <p className="text-xs text-muted-foreground mb-1">{name}</p>
                    <p className="text-lg font-serif font-bold text-primary mb-2">{result}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{LOVE_LANGUAGE_DESC[result || ''] || ''}</p>
                  </div>
                ))}
              </div>
            )}

            {view === 'conflict-style' && mirror.conflictStyle && (
              <div className="space-y-3">
                {[
                  { name: state.couple?.partner1, result: mirror.conflictStyle.partner1Result },
                  { name: state.couple?.partner2, result: mirror.conflictStyle.partner2Result },
                ].map(({ name, result }) => (
                  <div key={name} className="bg-card border border-border/40 rounded-2xl p-5">
                    <p className="text-xs text-muted-foreground mb-1">{name}</p>
                    <p className="text-lg font-serif font-bold text-violet-600 mb-2">{result}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{CONFLICT_STYLE_DESC[result || ''] || ''}</p>
                  </div>
                ))}
              </div>
            )}

            <Button onClick={() => setPhase('dashboard')} className="w-full py-5 rounded-full bg-primary text-white font-serif text-lg">
              Back to Mirror
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <NavBar />
    </div>
  );
}
