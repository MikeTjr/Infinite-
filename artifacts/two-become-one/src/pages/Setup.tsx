import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight, ChevronLeft, Palette, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { AvatarDisplay } from '../components/avatar/AvatarDisplay';
import { AvatarSettings, CoupleProfile, DEFAULT_AVATAR } from '../lib/types';
import {
  AVATAR_SHAPES, AVATAR_PATTERNS, AVATAR_AURAS,
  AVATAR_ICONS, AVATAR_BACKGROUNDS, AVATAR_ANIMATIONS
} from '../lib/gameLogic';

interface SetupProps {
  onComplete: (couple: CoupleProfile) => void;
}

const STEPS = ['names', 'avatar', 'done'] as const;
type Step = typeof STEPS[number];

const PRESET_COLORS = [
  '#e879a0', '#f97316', '#f59e0b', '#84cc16',
  '#14b8a6', '#0ea5e9', '#8b5cf6', '#ec4899',
  '#ef4444', '#1e293b',
];

export default function Setup({ onComplete }: SetupProps) {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>('names');
  const [coupleName, setCoupleName] = useState('');
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');
  const [avatar, setAvatar] = useState<AvatarSettings>(DEFAULT_AVATAR);
  const [anniversaryDate, setAnniversaryDate] = useState('');

  const updateAvatar = (key: keyof AvatarSettings, value: string) => {
    setAvatar(prev => ({ ...prev, [key]: value }));
  };

  const handleFinish = () => {
    const couple: CoupleProfile = {
      id: crypto.randomUUID(),
      name: coupleName || `${partner1} & ${partner2}`,
      partner1,
      partner2,
      avatar,
      createdAt: new Date().toISOString(),
      anniversaryDate: anniversaryDate || undefined,
    };
    onComplete(couple);
    navigate('/dashboard');
  };

  const namesValid = partner1.trim().length > 0 && partner2.trim().length > 0;

  return (
    <div className="min-h-[100dvh] flex flex-col items-center px-4 pt-12 pb-8">
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />

      <div className="w-full max-w-md mx-auto flex flex-col flex-1">
        <div className="flex items-center justify-between mb-8">
          <Heart className="w-6 h-6 text-primary" fill="currentColor" />
          <div className="flex gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className={`h-1.5 rounded-full transition-all ${s === step ? 'w-8 bg-primary' : i < STEPS.indexOf(step) ? 'w-4 bg-primary/60' : 'w-4 bg-border'}`} />
            ))}
          </div>
          <div className="w-6" />
        </div>

        <AnimatePresence mode="wait">
          {step === 'names' && (
            <motion.div key="names" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 flex flex-col">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Who are you?</h2>
              <p className="text-muted-foreground mb-8">The platform never needs your last name. Just your first names — and what you call yourselves together.</p>

              <div className="space-y-4 flex-1">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Partner 1</label>
                  <input
                    type="text"
                    value={partner1}
                    onChange={e => setPartner1(e.target.value)}
                    placeholder="First name"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Partner 2</label>
                  <input
                    type="text"
                    value={partner2}
                    onChange={e => setPartner2(e.target.value)}
                    placeholder="First name"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Your couple name <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <input
                    type="text"
                    value={coupleName}
                    onChange={e => setCoupleName(e.target.value)}
                    placeholder={partner1 && partner2 ? `${partner1} & ${partner2}` : 'e.g. "The Millers" or "Soft Thunder"'}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Anniversary <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <input
                    type="date"
                    value={anniversaryDate}
                    onChange={e => setAnniversaryDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
              </div>

              <Button
                disabled={!namesValid}
                onClick={() => setStep('avatar')}
                className="w-full py-6 rounded-full text-lg font-serif mt-8 bg-primary text-white"
              >
                Choose Your Avatar <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          )}

          {step === 'avatar' && (
            <motion.div key="avatar" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 flex flex-col">
              <button onClick={() => setStep('names')} className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-1">Your avatar</h2>
              <p className="text-muted-foreground mb-6 text-sm">Your public face on the platform. No real photos — just your essence.</p>

              <div className="flex justify-center mb-6">
                <AvatarDisplay avatar={avatar} size={100} showAnimation />
              </div>

              <div className="space-y-5 flex-1 overflow-y-auto pr-1">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Shape</label>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_SHAPES.map(s => (
                      <button key={s} onClick={() => updateAvatar('shape', s)}
                        className={`px-3 py-1.5 rounded-lg text-sm capitalize border transition-all ${avatar.shape === s ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Primary Color</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map(c => (
                      <button key={c} onClick={() => updateAvatar('primaryColor', c)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${avatar.primaryColor === c ? 'border-foreground scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c }} />
                    ))}
                    <input type="color" value={avatar.primaryColor} onChange={e => updateAvatar('primaryColor', e.target.value)}
                      className="w-8 h-8 rounded-full border border-border cursor-pointer" title="Custom color" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_ICONS.map(ic => (
                      <button key={ic} onClick={() => updateAvatar('icon', ic)}
                        className={`w-9 h-9 rounded-lg text-xl border transition-all ${avatar.icon === ic ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'}`}>
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Background</label>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_BACKGROUNDS.map(bg => (
                      <button key={bg} onClick={() => updateAvatar('background', bg)}
                        className={`px-2.5 py-1 rounded-lg text-xs border capitalize transition-all ${avatar.background === bg ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'}`}>
                        {bg.replace(/-/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Aura</label>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_AURAS.map(a => (
                      <button key={a} onClick={() => updateAvatar('aura', a)}
                        className={`px-3 py-1.5 rounded-lg text-sm capitalize border transition-all ${avatar.aura === a ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Pattern</label>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_PATTERNS.map(p => (
                      <button key={p} onClick={() => updateAvatar('pattern', p)}
                        className={`px-3 py-1.5 rounded-lg text-sm capitalize border transition-all ${avatar.pattern === p ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Animation</label>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_ANIMATIONS.map(a => (
                      <button key={a} onClick={() => updateAvatar('animation', a)}
                        className={`px-3 py-1.5 rounded-lg text-sm capitalize border transition-all ${avatar.animation === a ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button onClick={() => setStep('done')} className="w-full py-6 rounded-full text-lg font-serif mt-6 bg-primary text-white">
                Looking Good <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              <AvatarDisplay avatar={avatar} size={120} showAnimation />
              <div>
                <h2 className="text-3xl font-serif font-bold text-foreground">{coupleName || (partner1 && partner2 ? `${partner1} & ${partner2}` : 'Welcome')}</h2>
                <p className="text-muted-foreground mt-2">Your journey begins now. The platform will learn you over time. The cards will meet you where you are.</p>
              </div>
              <div className="w-full bg-card border border-border/40 rounded-2xl p-4 text-sm text-left space-y-2">
                <p className="font-medium text-foreground">What to expect:</p>
                <ul className="text-muted-foreground space-y-1.5">
                  <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> A deck that evolves with every session</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> A score that reflects real presence, not just logins</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> An archive of every moment you build together</li>
                </ul>
              </div>
              <Button onClick={handleFinish} className="w-full py-6 rounded-full text-xl font-serif bg-primary text-white shadow-xl shadow-primary/25">
                Enter Infinite Us
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
