import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ChevronRight, Check, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { NavBar } from '../components/layout/NavBar';
import { AppState, JourneyState } from '../lib/types';
import { SEASONS, Season } from '../lib/cards';

interface JourneyProps {
  state: AppState;
  onSetJourney: (j: JourneyState) => void;
}

function SeasonCard({ season, active, onStart, isStarted, completedDays }: {
  season: Season;
  active: boolean;
  onStart: () => void;
  isStarted: boolean;
  completedDays: number;
}) {
  const [expanded, setExpanded] = useState(active);
  const pct = Math.min((completedDays / season.durationDays) * 100, 100);

  return (
    <div className={`rounded-2xl border transition-all overflow-hidden ${active ? 'border-primary/40 shadow-md shadow-primary/10' : 'border-border/40'} bg-card`}>
      <button className="w-full p-5 flex items-center gap-4 text-left" onClick={() => setExpanded(e => !e)}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ backgroundColor: `${season.color}20` }}>
          {season.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-serif font-semibold text-foreground">{season.name}</p>
            {active && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full">Active</span>}
          </div>
          <p className="text-xs text-muted-foreground truncate">{season.tagline}</p>
          {isStarted && (
            <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: season.color }} />
            </div>
          )}
        </div>
        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {expanded && (
        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="border-t border-border/30 px-5 pb-5 pt-4 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{season.description}</p>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Duration</p>
            <p className="text-sm font-medium text-foreground">{season.durationDays} days {isStarted ? `· ${completedDays} complete` : ''}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Card Focus</p>
            <div className="flex flex-wrap gap-1.5">
              {season.cardTypeFocus.map(t => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full border border-border/50 text-muted-foreground capitalize">
                  {t.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Sample daily prompts</p>
            <div className="space-y-2">
              {season.dailyPrompts.slice(0, 3).map((p, i) => (
                <div key={i} className="flex gap-2 text-sm text-foreground/80">
                  <span className="text-primary shrink-0">·</span>
                  <span className="italic">{p}</span>
                </div>
              ))}
            </div>
          </div>

          {!active ? (
            <Button onClick={onStart} className="w-full rounded-xl text-white" style={{ backgroundColor: season.color }}>
              Begin This Season
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-xl px-4 py-3">
              <Check className="w-4 h-4" />
              <span>You're in this season · {completedDays}/{season.durationDays} days</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function DailyPrompt({ season, day }: { season: Season; day: number }) {
  const prompt = season.dailyPrompts[day % season.dailyPrompts.length];
  return (
    <div className="bg-card border border-primary/20 rounded-2xl p-5 space-y-2" style={{ borderColor: `${season.color}40` }}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{season.icon}</span>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{season.name} · Day {day + 1}</p>
          <p className="text-xs text-muted-foreground">Today's prompt</p>
        </div>
      </div>
      <p className="text-base font-serif font-semibold text-foreground leading-snug italic">"{prompt}"</p>
      <p className="text-xs text-muted-foreground">Discuss this today — before or after your session.</p>
    </div>
  );
}

export default function Journey({ state, onSetJourney }: JourneyProps) {
  const { journey, sessions } = state;
  const currentSeason = journey ? SEASONS.find(s => s.id === journey.currentSeason) : null;

  const handleStart = (season: Season) => {
    onSetJourney({
      currentSeason: season.id,
      startedAt: new Date().toISOString(),
      completedDays: 0,
    });
  };

  const completedDays = journey
    ? Math.min(Math.floor((Date.now() - new Date(journey.startedAt).getTime()) / 86400000), (currentSeason?.durationDays || 30))
    : 0;

  return (
    <div className="min-h-[100dvh] pb-28 px-4 pt-6 max-w-md mx-auto">
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-sky-500/6 to-transparent pointer-events-none" />

      <div className="flex items-center gap-2 mb-2">
        <Compass className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-serif font-bold">The Journey</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-5">Seasonal programs designed for exactly where you are. Enter any season at any time.</p>

      {currentSeason && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <DailyPrompt season={currentSeason} day={completedDays} />
        </motion.div>
      )}

      <div className="space-y-3">
        {SEASONS.map(season => (
          <SeasonCard
            key={season.id}
            season={season}
            active={journey?.currentSeason === season.id}
            isStarted={journey?.currentSeason === season.id}
            completedDays={journey?.currentSeason === season.id ? completedDays : 0}
            onStart={() => handleStart(season)}
          />
        ))}
      </div>

      <NavBar />
    </div>
  );
}
