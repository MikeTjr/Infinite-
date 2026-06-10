import React, { useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Shield, BarChart2, BookOpen, Users, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { AppState } from '../lib/types';

interface LandingProps {
  state: AppState;
}

const features = [
  { icon: Heart, title: 'The Card Game', desc: '8 card types. 3 depth levels. A deck that learns you over time.' },
  { icon: BarChart2, title: 'Growth Score', desc: 'A living measure of relational intentionality. Not points — presence.' },
  { icon: Shield, title: 'The Mirror', desc: 'Love Language & Conflict Style assessments. Know each other better.' },
  { icon: BookOpen, title: 'The Archive', desc: 'Your relationship\'s story, built automatically. Irreplaceable.' },
  { icon: Sparkles, title: 'The Journey', desc: 'Seasonal programs designed for exactly where you are right now.' },
  { icon: Users, title: 'Bonds', desc: 'Small groups of couples who grow and compete together.' },
];

const API_BASE = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';

export default function Landing({ state }: LandingProps) {
  const [, navigate] = useLocation();
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [adminStatus, setAdminStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [adminToken, setAdminToken] = useState<string | null>(null);

  const handleTitleTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 3000);
    if (tapCount.current >= 7) {
      tapCount.current = 0;
      if (tapTimer.current) clearTimeout(tapTimer.current);
      setShowAdmin(true);
      setPassphrase('');
      setAdminStatus('idle');
    }
  };

  const handleAdminVerify = async () => {
    if (!passphrase.trim()) return;
    setAdminStatus('loading');
    try {
      const res = await fetch(`${API_BASE}/api/admin/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase }),
      });
      if (!res.ok) throw new Error('Unauthorized');
      const data = await res.json() as { token: string };
      setAdminToken(data.token);
      setAdminStatus('success');
    } catch {
      setAdminStatus('error');
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-60 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

      <main className="flex-1 flex flex-col items-center px-6 pt-20 pb-32 max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center space-y-6 mb-16"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            <Heart className="w-12 h-12 text-primary mx-auto" fill="currentColor" />
          </motion.div>

          <div>
            <h1
              onClick={handleTitleTap}
              className="text-5xl md:text-6xl font-serif font-bold text-foreground tracking-tight leading-tight select-none cursor-default"
            >
              Infinite Us
            </h1>
            <p className="mt-3 text-lg text-muted-foreground font-light italic">
              The thunder didn't make her love him more.<br />
              It just made the moment possible.
            </p>
          </div>

          <p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
            A living relationship platform that creates the conditions for moments couples didn't know they needed.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              size="lg"
              className="px-10 py-6 text-lg font-serif rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 hover:-translate-y-0.5 transition-all"
              onClick={() => navigate(state.setupComplete ? '/dashboard' : '/setup')}
            >
              {state.setupComplete ? 'Continue Your Journey' : 'Begin Your Journey'}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full"
        >
          <p className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-8 font-medium">What awaits you</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-2xl p-5 flex gap-4 items-start"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-foreground text-sm">{title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center space-y-2"
        >
          <p className="text-sm text-muted-foreground italic font-serif">
            "Infinite Us is the thunder."
          </p>
          <p className="text-xs text-muted-foreground/60">No ads. No data selling. Built for the long haul.</p>
        </motion.div>
      </main>

      {/* Hidden admin modal — triggered by 7 taps on title */}
      <AnimatePresence>
        {showAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={(e) => { if (e.target === e.currentTarget) setShowAdmin(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl border border-border shadow-2xl p-6 w-full max-w-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg text-foreground">Admin Access</h2>
                <button onClick={() => setShowAdmin(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {adminStatus === 'success' ? (
                <div className="space-y-3">
                  <p className="text-sm text-green-600 dark:text-green-400">Access granted.</p>
                  <p className="text-xs text-muted-foreground font-mono break-all">{adminToken}</p>
                  <Button className="w-full" onClick={() => setShowAdmin(false)}>Done</Button>
                </div>
              ) : (
                <>
                  <input
                    type="password"
                    value={passphrase}
                    onChange={e => setPassphrase(e.target.value)}
                    placeholder="Passphrase"
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    onKeyDown={e => e.key === 'Enter' && handleAdminVerify()}
                  />
                  {adminStatus === 'error' && (
                    <p className="text-xs text-destructive">Incorrect passphrase.</p>
                  )}
                  <Button
                    className="w-full"
                    disabled={!passphrase.trim() || adminStatus === 'loading'}
                    onClick={handleAdminVerify}
                  >
                    {adminStatus === 'loading' ? 'Verifying...' : 'Verify'}
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
