import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, RefreshCw, Heart, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { NavBar } from '../components/layout/NavBar';

type Style = 'cartoon' | 'watercolor' | 'anime' | 'painterly';

const STYLE_LABELS: Record<Style, { label: string; desc: string }> = {
  cartoon: { label: 'Cartoon', desc: 'Bold, colorful, expressive' },
  watercolor: { label: 'Watercolor', desc: 'Soft, romantic, dreamy' },
  anime: { label: 'Anime', desc: 'Dynamic, expressive lines' },
  painterly: { label: 'Painterly', desc: 'Impressionist oil painting' },
};

const API_BASE = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';

interface BlendResult {
  imageUrl: string;
  message: string;
  style: string;
}

export default function TwoBecomOne() {
  const [, navigate] = useLocation();
  const [coupleName, setCoupleName] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState<Style>('cartoon');
  const [result, setResult] = useState<BlendResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleGenerate = async () => {
    if (!coupleName.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setImgLoaded(false);

    try {
      const res = await fetch(`${API_BASE}/api/blend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coupleName: coupleName.trim(), style, description: description.trim() || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as any).error ?? 'Generation failed');
      }
      const data = await res.json() as BlendResult;
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setImgLoaded(false);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center pt-10 pb-28 px-4 overflow-x-hidden relative">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />

      <button onClick={() => navigate('/dashboard')} className="absolute top-6 left-4 flex items-center gap-1 text-muted-foreground text-sm">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto flex flex-col items-center">
        <div className="text-center mb-8 space-y-3">
          <Heart className="w-7 h-7 text-primary mx-auto opacity-80" fill="currentColor" />
          <h1 className="text-4xl font-serif font-bold text-foreground">Two Become One</h1>
          <p className="text-muted-foreground font-light italic text-sm">AI generates a portrait of your couple — free, instant, no photos needed.</p>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center py-16 space-y-6">
              <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 1.8 }}>
                <Heart className="w-20 h-20 text-primary drop-shadow-xl" fill="currentColor" />
              </motion.div>
              <h2 className="text-xl font-serif text-primary">Weaving your souls together...</h2>
              <p className="text-muted-foreground text-sm">Your portrait is being painted. This takes a moment.</p>
            </motion.div>

          ) : result ? (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col items-center gap-6">
              <div className="bg-card p-4 rounded-2xl shadow-xl border border-card-border/50 max-w-sm w-full relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur -z-10" />
                <div className="aspect-square rounded-xl overflow-hidden bg-muted mb-5 flex items-center justify-center relative">
                  {!imgLoaded && (
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <Heart className="w-8 h-8 animate-pulse text-primary" fill="currentColor" />
                      <p className="text-xs">Loading portrait...</p>
                    </div>
                  )}
                  <img
                    src={result.imageUrl}
                    alt="Your couple portrait"
                    className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setError('Portrait generation failed. Try again.')}
                  />
                </div>
                <p className="font-serif text-lg text-center text-foreground mb-4">{result.message}</p>
                <p className="text-xs text-center text-muted-foreground mb-4 italic">
                  Powered by Pollinations.ai — generated fresh just for you.
                </p>
                <div className="flex gap-3">
                  <Button className="flex-1 bg-primary hover:bg-primary/90 text-white"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = result.imageUrl;
                      a.download = 'two-become-one.jpg';
                      a.target = '_blank';
                      a.click();
                    }}>
                    <Download className="w-4 h-4 mr-2" /> Save
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleReset}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Again
                  </Button>
                </div>
              </div>
            </motion.div>

          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center space-y-6">

              <div className="w-full space-y-2">
                <label className="text-sm font-medium text-foreground">Your couple name *</label>
                <input
                  type="text"
                  value={coupleName}
                  onChange={e => setCoupleName(e.target.value.slice(0, 60))}
                  placeholder="e.g. Mia & Jordan, The Nguyens..."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="w-full space-y-2">
                <label className="text-sm font-medium text-foreground">Describe your vibe <span className="text-muted-foreground font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value.slice(0, 200))}
                  placeholder="e.g. adventurous, sunset lovers, indie aesthetic..."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="w-full space-y-3">
                <p className="text-sm font-medium text-foreground">Art style</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {(Object.entries(STYLE_LABELS) as [Style, { label: string; desc: string }][]).map(([s, info]) => (
                    <button key={s} onClick={() => setStyle(s)}
                      className={`py-3 px-4 rounded-xl border-2 transition-all text-left ${style === s ? 'border-primary bg-primary/10' : 'border-border/50 bg-card hover:border-primary/30'}`}>
                      <p className={`font-medium text-sm ${style === s ? 'text-primary' : 'text-foreground'}`}>{info.label}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{info.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="text-destructive bg-destructive/10 px-4 py-3 rounded-lg text-sm text-center w-full">
                  {error}
                </div>
              )}

              <Button
                size="lg"
                disabled={!coupleName.trim()}
                onClick={handleGenerate}
                className={`w-full py-6 text-lg font-serif rounded-full transition-all ${coupleName.trim() ? 'bg-primary text-white shadow-xl shadow-primary/25 hover:-translate-y-0.5' : 'bg-muted text-muted-foreground opacity-60 cursor-not-allowed'}`}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Our Portrait
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Free, no account needed. Powered by{' '}
                <a href="https://pollinations.ai" target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-2 hover:underline">Pollinations.ai</a>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <NavBar />
    </div>
  );
}
