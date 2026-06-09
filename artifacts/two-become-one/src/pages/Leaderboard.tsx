import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Minus, Users, Crown } from 'lucide-react';
import { NavBar } from '../components/layout/NavBar';
import { AppState } from '../lib/types';
import { AvatarDisplay } from '../components/avatar/AvatarDisplay';
import { getLeaderboardEntries } from '../lib/gameLogic';

interface LeaderboardProps {
  state: AppState;
}

type Tab = 'monthly' | 'alltime' | 'bonds';

const MOCK_BONDS = [
  { rank: 1, name: 'The Storm Chasers', members: 5, score: 89400 },
  { rank: 2, name: 'Golden Hours', members: 4, score: 72100 },
  { rank: 3, name: 'Midnight & Maple', members: 6, score: 68800 },
  { rank: 4, name: 'Two Moons', members: 3, score: 44200 },
  { rank: 5, name: 'Wildfire & Rain', members: 7, score: 38600 },
];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <span className="text-slate-400 font-bold text-sm">2</span>;
  if (rank === 3) return <span className="text-amber-600 font-bold text-sm">3</span>;
  return <span className="text-muted-foreground text-sm font-medium">{rank}</span>;
}

export default function Leaderboard({ state }: LeaderboardProps) {
  const [tab, setTab] = useState<Tab>('monthly');
  const { couple, growthScore, bonds } = state;

  const entries = getLeaderboardEntries(growthScore.total, couple?.name || 'Your Couple');
  const myRank = entries.find(e => e.isYou)?.rank;
  const myPct = myRank ? Math.round(((entries.length - myRank) / entries.length) * 100) : 0;

  const currentBond = bonds.find(b => b.id === state.currentBondId);

  return (
    <div className="min-h-[100dvh] pb-28 px-4 pt-6 max-w-md mx-auto">
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-amber-500/6 to-transparent pointer-events-none" />

      <div className="flex items-center gap-2 mb-5">
        <Trophy className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-serif font-bold">Leaderboard</h1>
      </div>

      {myRank && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-primary/8 border border-primary/20 rounded-2xl p-4 flex items-center gap-4 mb-5">
          {couple && <AvatarDisplay avatar={couple.avatar} size={48} showAnimation />}
          <div className="flex-1">
            <p className="font-serif font-semibold text-foreground">{couple?.name}</p>
            <p className="text-sm text-muted-foreground">Rank #{myRank} · Top {100 - myPct}%</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold font-serif text-primary">{growthScore.total.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">points</p>
          </div>
        </motion.div>
      )}

      <div className="flex bg-muted rounded-xl p-1 mb-5">
        {(['monthly', 'alltime', 'bonds'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>
            {t === 'alltime' ? 'All Time' : t === 'bonds' ? 'Bonds' : 'Monthly'}
          </button>
        ))}
      </div>

      {(tab === 'monthly' || tab === 'alltime') && (
        <div className="space-y-2">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all ${entry.isYou ? 'bg-primary/8 border-primary/30' : 'bg-card border-border/40'}`}
            >
              <div className="w-8 flex items-center justify-center">
                <RankBadge rank={entry.rank} />
              </div>

              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate text-sm ${entry.isYou ? 'text-primary' : 'text-foreground'}`}>
                  {entry.name}
                  {entry.isYou && <span className="ml-1.5 text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-full">You</span>}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className={`font-bold text-sm ${entry.isYou ? 'text-primary' : 'text-foreground'}`}>
                  {entry.score.toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'bonds' && (
        <div className="space-y-2">
          {currentBond && (
            <div className="mb-3 text-xs text-muted-foreground uppercase tracking-wider">Your bond</div>
          )}
          {currentBond && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border bg-primary/8 border-primary/30 mb-4">
              <div className="w-8 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-primary text-sm">{currentBond.name}</p>
                <p className="text-xs text-muted-foreground">{currentBond.memberNames.length} couples</p>
              </div>
              <p className="font-bold text-primary">{currentBond.collectiveScore.toLocaleString()}</p>
            </motion.div>
          )}

          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Global bonds</div>
          {MOCK_BONDS.map((bond, i) => (
            <motion.div key={bond.name}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border bg-card border-border/40">
              <div className="w-8 flex items-center justify-center">
                <RankBadge rank={bond.rank} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{bond.name}</p>
                <p className="text-xs text-muted-foreground">{bond.members} couples</p>
              </div>
              <p className="font-bold text-foreground text-sm">{bond.score.toLocaleString()}</p>
            </motion.div>
          ))}

          {!currentBond && (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">Join or create a Bond to compete here.</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 bg-card border border-border/40 rounded-2xl p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">The stakes</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Top couples on the monthly leaderboard are featured on the public Wall of Bonds.
          Phase 2 brings real-world rewards from experience partners — travel, dining, events.
          The leaderboard is meant to mean something outside the screen.
        </p>
      </div>

      <NavBar />
    </div>
  );
}
