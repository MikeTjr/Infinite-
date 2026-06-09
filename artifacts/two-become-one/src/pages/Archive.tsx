import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Heart, TrendingUp, Flame, Calendar } from 'lucide-react';
import { NavBar } from '../components/layout/NavBar';
import { AppState, SessionRecord } from '../lib/types';
import { CARD_TYPE_LABELS } from '../lib/cards';

interface ArchiveProps {
  state: AppState;
}

function SessionCard({ session, index }: { session: SessionRecord; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(session.date);
  const matchPct = session.thisOrThatTotal > 0
    ? Math.round((session.thisOrThatMatches / session.thisOrThatTotal) * 100)
    : null;
  const mins = Math.round(session.durationSeconds / 60);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border border-border/40 rounded-2xl overflow-hidden"
    >
      <button className="w-full p-4 flex items-center gap-3 text-left" onClick={() => setExpanded(e => !e)}>
        {session.moodEmoji ? (
          <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center text-2xl shrink-0">
            {session.moodEmoji}
          </div>
        ) : (
          <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 text-primary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-serif font-semibold text-foreground truncate">
            {session.momentTag || `Session ${index + 1}`}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} · {mins}m
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-semibold text-primary">+{session.scoreEarned}</p>
          <p className="text-[10px] text-muted-foreground">points</p>
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="border-t border-border/30 px-4 pb-4 pt-3"
        >
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-background/60 rounded-xl p-2.5 text-center">
              <p className="text-lg font-bold text-foreground">{session.cardsPlayed}</p>
              <p className="text-[10px] text-muted-foreground">Cards played</p>
            </div>
            <div className="bg-background/60 rounded-xl p-2.5 text-center">
              <p className="text-lg font-bold text-foreground">{session.cardsDrifted}</p>
              <p className="text-[10px] text-muted-foreground">Drifted</p>
            </div>
            <div className="bg-background/60 rounded-xl p-2.5 text-center">
              <p className="text-lg font-bold text-foreground">{matchPct !== null ? `${matchPct}%` : '—'}</p>
              <p className="text-[10px] text-muted-foreground">ToT match</p>
            </div>
          </div>
          {session.cardTypes.length > 0 && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Card types played</p>
              <div className="flex flex-wrap gap-1.5">
                {session.cardTypes.map(t => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-primary/8 text-primary border border-primary/20">
                    {CARD_TYPE_LABELS[t]}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Archive({ state }: ArchiveProps) {
  const { sessions, growthScore } = state;
  const sorted = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalCards = sessions.reduce((s, r) => s + r.cardsPlayed, 0);
  const totalMinutes = Math.round(sessions.reduce((s, r) => s + r.durationSeconds, 0) / 60);
  const allToTMatches = sessions.reduce((s, r) => s + r.thisOrThatMatches, 0);
  const allToTTotal = sessions.reduce((s, r) => s + r.thisOrThatTotal, 0);
  const matchRate = allToTTotal > 0 ? Math.round((allToTMatches / allToTTotal) * 100) : null;

  const cardTypeCounts: Record<string, number> = {};
  sessions.forEach(s => s.cardTypes.forEach(t => { cardTypeCounts[t] = (cardTypeCounts[t] || 0) + 1; }));
  const topType = Object.entries(cardTypeCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="min-h-[100dvh] pb-28 px-4 pt-6 max-w-md mx-auto">
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-emerald-500/6 to-transparent pointer-events-none" />

      <div className="flex items-center gap-2 mb-5">
        <BookOpen className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-serif font-bold">The Archive</h1>
      </div>

      {sessions.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 space-y-4">
          <div className="text-5xl">📖</div>
          <h2 className="text-xl font-serif font-semibold text-foreground">Your story starts here</h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">Every session is archived automatically. After a year, you'll have something irreplaceable — a record of who you've been building together.</p>
        </motion.div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border/40 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-primary" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Sessions</p>
              </div>
              <p className="text-3xl font-bold font-serif text-foreground">{sessions.length}</p>
            </div>
            <div className="bg-card border border-border/40 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-primary" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total score</p>
              </div>
              <p className="text-3xl font-bold font-serif text-foreground">{growthScore.total.toLocaleString()}</p>
            </div>
            <div className="bg-card border border-border/40 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Best streak</p>
              </div>
              <p className="text-3xl font-bold font-serif text-foreground">{growthScore.streak} <span className="text-sm text-muted-foreground font-normal">days</span></p>
            </div>
            <div className="bg-card border border-border/40 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-primary" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Time together</p>
              </div>
              <p className="text-3xl font-bold font-serif text-foreground">{totalMinutes} <span className="text-sm text-muted-foreground font-normal">min</span></p>
            </div>
          </div>

          <div className="bg-card border border-border/40 rounded-2xl p-4 flex gap-4 flex-wrap">
            {matchRate !== null && (
              <div>
                <p className="text-xs text-muted-foreground">This or That match rate</p>
                <p className="text-xl font-bold font-serif text-primary">{matchRate}%</p>
              </div>
            )}
            {topType && (
              <div>
                <p className="text-xs text-muted-foreground">Favorite card type</p>
                <p className="text-xl font-bold font-serif text-foreground capitalize">{CARD_TYPE_LABELS[topType[0] as keyof typeof CARD_TYPE_LABELS] || topType[0]}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">Cards played</p>
              <p className="text-xl font-bold font-serif text-foreground">{totalCards}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">All Sessions</p>
            <div className="space-y-2">
              {sorted.map((session, i) => (
                <SessionCard key={session.id} session={session} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}

      <NavBar />
    </div>
  );
}
