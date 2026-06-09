import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Hash, Copy, Check, Flame, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { NavBar } from '../components/layout/NavBar';
import { AppState, Bond } from '../lib/types';

interface BondsProps {
  state: AppState;
  onCreateBond: (name: string) => Bond;
  onJoinBond: (code: string) => Bond;
}

const SUGGESTED_NAMES = [
  'The Storm Chasers', 'Midnight & Maple', 'The Long Way Home',
  'Golden Hours', 'Two Moons', 'Wildfire & Rain',
  'Soft Thunder', 'Papercut & Honey', 'Always Already',
];

function BondCard({ bond, isActive, score }: { bond: Bond; isActive: boolean; score: number }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(bond.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-card border rounded-2xl p-5 space-y-4 ${isActive ? 'border-primary/40' : 'border-border/40'}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-serif font-semibold text-foreground">{bond.name}</p>
            {isActive && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full">Your Bond</span>}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{bond.memberNames.length} couples · Created {new Date(bond.createdAt).toLocaleDateString()}</p>
        </div>
        <button onClick={copyCode} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted rounded-lg px-2.5 py-1.5 hover:bg-muted/80 transition-all">
          {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
          <span className="font-mono">{bond.code}</span>
        </button>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 bg-muted/50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold font-serif text-foreground">{bond.collectiveScore.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Collective Score</p>
        </div>
        <div className="flex-1 bg-muted/50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold font-serif text-primary">{score.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Your Contribution</p>
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Members</p>
        <div className="space-y-2">
          {bond.memberNames.map((name, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className={i === 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}>{name}</span>
              {i === 0 && <span className="text-xs text-primary">You</span>}
            </div>
          ))}
          {bond.memberNames.length < 8 && (
            <p className="text-xs text-muted-foreground italic">Share code {bond.code} to invite up to {8 - bond.memberNames.length} more couples</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Bonds({ state, onCreateBond, onJoinBond }: BondsProps) {
  const [view, setView] = useState<'list' | 'create' | 'join'>('list');
  const [bondName, setBondName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [created, setCreated] = useState<Bond | null>(null);

  const { bonds, currentBondId, growthScore } = state;
  const currentBond = bonds.find(b => b.id === currentBondId);

  const handleCreate = () => {
    const bond = onCreateBond(bondName || SUGGESTED_NAMES[Math.floor(Math.random() * SUGGESTED_NAMES.length)]);
    setCreated(bond);
    setView('list');
  };

  const handleJoin = () => {
    if (joinCode.length >= 4) {
      onJoinBond(joinCode.toUpperCase());
      setView('list');
    }
  };

  return (
    <div className="min-h-[100dvh] pb-28 px-4 pt-6 max-w-md mx-auto">
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-violet-500/6 to-transparent pointer-events-none" />

      <AnimatePresence mode="wait">
        {view === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-serif font-bold">Bonds</h1>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed -mt-2">Small groups of couples who compete and grow together. Maximum 8 couples per Bond. One Bond name — globally unique.</p>

            {created && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">Bond created: {created.name}</p>
                  <p className="text-xs text-green-600">Share code <strong>{created.code}</strong> with other couples</p>
                </div>
              </motion.div>
            )}

            {bonds.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="text-5xl">🤝</div>
                <h2 className="text-xl font-serif font-semibold">No bonds yet</h2>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">Create a Bond with couples you know — or join one with an invite code.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bonds.map(bond => (
                  <BondCard key={bond.id} bond={bond} isActive={bond.id === currentBondId} score={growthScore.total} />
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={() => setView('create')} className="flex-1 bg-primary text-white rounded-xl py-5">
                <Plus className="w-4 h-4 mr-2" /> Create Bond
              </Button>
              <Button variant="outline" onClick={() => setView('join')} className="flex-1 rounded-xl py-5 border-border">
                <Hash className="w-4 h-4 mr-2" /> Join Bond
              </Button>
            </div>

            <div className="bg-card border border-border/40 rounded-2xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Why Bonds work</p>
              <div className="space-y-2.5 text-sm text-muted-foreground">
                <div className="flex gap-2">
                  <Flame className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>Watching another couple in your Bond pull ahead is the exact trigger that makes you come back.</span>
                </div>
                <div className="flex gap-2">
                  <TrendingUp className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Your inactivity affects people you've chosen to be accountable to. That accountability is real.</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'create' && (
          <motion.div key="create" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <button onClick={() => setView('list')} className="flex items-center gap-1 text-muted-foreground text-sm">
              ← Back
            </button>
            <h2 className="text-2xl font-serif font-bold">Create a Bond</h2>
            <p className="text-sm text-muted-foreground">Name it something that means something. Bond names are globally unique — yours to own.</p>

            <div>
              <label className="text-sm font-medium block mb-1.5">Bond name</label>
              <input
                type="text"
                value={bondName}
                onChange={e => setBondName(e.target.value)}
                placeholder="e.g. The Storm Chasers"
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Need inspiration?</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_NAMES.slice(0, 6).map(name => (
                  <button key={name} onClick={() => setBondName(name)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all">
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleCreate} className="w-full py-5 rounded-full bg-primary text-white font-serif text-lg">
              Create {bondName || 'Random Bond Name'}
            </Button>
          </motion.div>
        )}

        {view === 'join' && (
          <motion.div key="join" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <button onClick={() => setView('list')} className="flex items-center gap-1 text-muted-foreground text-sm">
              ← Back
            </button>
            <h2 className="text-2xl font-serif font-bold">Join a Bond</h2>
            <p className="text-sm text-muted-foreground">Enter the invite code from another couple in the Bond.</p>

            <div>
              <label className="text-sm font-medium block mb-1.5">Invite code</label>
              <input
                type="text"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase().slice(0, 8))}
                placeholder="e.g. XR7TKP"
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground font-mono text-lg tracking-widest placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <Button onClick={handleJoin} disabled={joinCode.length < 4} className="w-full py-5 rounded-full bg-primary text-white font-serif text-lg">
              Join Bond
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <NavBar />
    </div>
  );
}
