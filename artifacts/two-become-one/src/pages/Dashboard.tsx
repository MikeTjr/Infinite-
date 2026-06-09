import React from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, TrendingDown, Minus, Flame, Calendar, ArrowRight, Star, Compass, BookOpen, Trophy, Camera } from 'lucide-react';
import { Button } from '../components/ui/button';
import { AvatarDisplay } from '../components/avatar/AvatarDisplay';
import { NavBar } from '../components/layout/NavBar';
import { AppState } from '../lib/types';
import { SEASONS } from '../lib/cards';

interface DashboardProps {
  state: AppState;
}

export default function Dashboard({ state }: DashboardProps) {
  const [, navigate] = useLocation();
  const { couple, growthScore, sessions, journey } = state;

  const lastSession = sessions[sessions.length - 1];
  const currentSeason = journey ? SEASONS.find(s => s.id === journey.currentSeason) : null;

  const MomentumIcon = growthScore.momentum === 'rising' ? TrendingUp : growthScore.momentum === 'cooling' ? TrendingDown : Minus;
  const momentumColor = growthScore.momentum === 'rising' ? 'text-green-500' : growthScore.momentum === 'cooling' ? 'text-amber-500' : 'text-muted-foreground';

  const quickActions = [
    { icon: Star, label: 'Mirror', path: '/mirror', desc: 'Know yourselves' },
    { icon: Compass, label: 'Journey', path: '/journey', desc: 'Seasonal path' },
    { icon: BookOpen, label: 'Archive', path: '/archive', desc: 'Your story' },
    { icon: Trophy, label: 'Ranks', path: '/leaderboard', desc: 'Leaderboard' },
  ];

  return (
    <div className="min-h-[100dvh] pb-28 px-4 pt-6 max-w-md mx-auto">
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-primary/6 to-transparent pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Welcome back</p>
            <h1 className="text-2xl font-serif font-bold text-foreground">{couple?.name}</h1>
          </div>
          {couple && (
            <button onClick={() => navigate('/setup')} className="relative">
              <AvatarDisplay avatar={couple.avatar} size={52} showAnimation />
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border/40 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold font-serif text-primary">{growthScore.total.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Growth Score</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <MomentumIcon className={`w-3 h-3 ${momentumColor}`} />
              <span className={`text-[10px] capitalize ${momentumColor}`}>{growthScore.momentum}</span>
            </div>
          </div>
          <div className="bg-card border border-border/40 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <p className="text-2xl font-bold font-serif text-foreground">{growthScore.streak}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Day Streak</p>
          </div>
          <div className="bg-card border border-border/40 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold font-serif text-foreground">{sessions.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Sessions</p>
          </div>
        </div>

        {growthScore.history.length > 1 && (
          <div className="bg-card border border-border/40 rounded-2xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Score — Last 30 days</p>
            <div className="flex items-end gap-1 h-16">
              {growthScore.history.slice(-30).map((point, i) => {
                const maxScore = Math.max(...growthScore.history.slice(-30).map(p => p.score));
                const pct = maxScore > 0 ? (point.score / maxScore) * 100 : 10;
                return (
                  <div key={i} className="flex-1 flex items-end">
                    <div className="w-full rounded-sm bg-primary/60 transition-all" style={{ height: `${Math.max(pct, 8)}%` }} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/play')}
          className="w-full bg-primary rounded-2xl p-5 flex items-center justify-between text-white shadow-lg shadow-primary/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Heart className="w-5 h-5" fill="white" />
            </div>
            <div className="text-left">
              <p className="font-serif font-semibold text-lg">Play Together</p>
              <p className="text-white/70 text-sm">
                {sessions.length === 0 ? 'Your first session awaits' : `Session ${sessions.length + 1} · Keep the streak alive`}
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-white/80" />
        </motion.button>

        {currentSeason && (
          <div className="bg-card border border-border/40 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${currentSeason.color}20` }}>
              {currentSeason.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Journey</p>
              <p className="font-serif font-semibold text-foreground">{currentSeason.name}</p>
              <div className="mt-1.5 h-1.5 bg-border rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min((journey!.completedDays / currentSeason.durationDays) * 100, 100)}%`, backgroundColor: currentSeason.color }} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{journey?.completedDays} / {currentSeason.durationDays} days</p>
            </div>
            <button onClick={() => navigate('/journey')} className="text-muted-foreground">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-4 gap-3">
          {quickActions.map(({ icon: Icon, label, path, desc }) => (
            <button key={path} onClick={() => navigate(path)} className="bg-card border border-border/40 rounded-2xl p-3 flex flex-col items-center gap-1.5 hover:border-primary/30 transition-all">
              <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[10px] font-medium text-foreground">{label}</span>
            </button>
          ))}
        </div>

        {lastSession && (
          <div className="bg-card border border-border/40 rounded-2xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Last Session</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {lastSession.moodEmoji && <span className="text-2xl">{lastSession.moodEmoji}</span>}
                <div>
                  <p className="text-sm font-medium text-foreground">{lastSession.momentTag || `${lastSession.cardsPlayed} cards played`}</p>
                  <p className="text-xs text-muted-foreground">{new Date(lastSession.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · +{lastSession.scoreEarned} points</p>
                </div>
              </div>
              <button onClick={() => navigate('/archive')} className="text-xs text-primary flex items-center gap-1">
                View <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <div className="bg-card border border-border/40 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Two Become One</p>
              <p className="text-xs text-muted-foreground">Blend your photos into art</p>
            </div>
          </div>
          <button onClick={() => navigate('/blend')} className="text-xs text-primary flex items-center gap-1">
            Open <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </motion.div>

      <NavBar />
    </div>
  );
}
