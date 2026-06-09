import React, { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CheckCircle2, Download, RefreshCw, Heart, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useBlendPhotos } from '@workspace/api-client-react';
import { NavBar } from '../components/layout/NavBar';

type BlendInputStyle = 'cartoon' | 'watercolor' | 'anime' | 'painterly';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

function PhotoUploader({ label, photo, onPhotoUpload }: { label: string; photo: string | null; onPhotoUpload: (base64: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      onPhotoUpload(base64);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <h3 className="font-serif text-lg text-primary">{label}</h3>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => inputRef.current?.click()}
        className={`relative w-36 h-36 rounded-full cursor-pointer flex items-center justify-center overflow-hidden border-4 transition-colors ${photo ? 'border-primary shadow-lg shadow-primary/20' : 'border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5'}`}
      >
        <input type="file" accept="image/*" className="hidden" ref={inputRef} onChange={handleFileChange} />
        <AnimatePresence mode="wait">
          {photo ? (
            <motion.div key="image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
              <img src={photo} alt={label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <RefreshCw className="text-white w-7 h-7" />
              </div>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2 text-primary/60">
              <Camera className="w-9 h-9" />
              <span className="text-xs font-medium">Tap to upload</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function TwoBecomOne() {
  const [, navigate] = useLocation();
  const [photo1, setPhoto1] = useState<string | null>(null);
  const [photo2, setPhoto2] = useState<string | null>(null);
  const [style, setStyle] = useState<BlendInputStyle>('cartoon' as BlendInputStyle);
  const blendMutation = useBlendPhotos();

  const handleBlend = () => {
    if (!photo1 || !photo2) return;
    blendMutation.mutate({ data: { photo1, photo2, style } });
  };

  const handleReset = () => {
    setPhoto1(null);
    setPhoto2(null);
    blendMutation.reset();
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center pt-10 pb-28 px-4 overflow-x-hidden relative">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />

      <button onClick={() => navigate('/dashboard')} className="absolute top-6 left-4 flex items-center gap-1 text-muted-foreground text-sm">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto flex flex-col items-center">
        <div className="text-center mb-10 space-y-3">
          <Heart className="w-7 h-7 text-primary mx-auto opacity-80" />
          <h1 className="text-4xl font-serif font-bold text-foreground">Two Become One</h1>
          <p className="text-muted-foreground font-light italic text-sm">Upload two photos — AI blends them into a single portrait.</p>
        </div>

        <AnimatePresence mode="wait">
          {blendMutation.isPending ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-16 space-y-6">
              <Heart className="w-20 h-20 text-primary animate-pulse drop-shadow-xl" fill="currentColor" />
              <h2 className="text-xl font-serif text-primary">Weaving your souls together...</h2>
              <p className="text-muted-foreground text-sm">This takes a moment.</p>
            </motion.div>
          ) : blendMutation.isSuccess ? (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col items-center">
              <div className="bg-card p-4 rounded-2xl shadow-xl border border-card-border/50 max-w-sm w-full relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur -z-10" />
                <div className="aspect-square rounded-xl overflow-hidden bg-muted mb-5">
                  <img src={blendMutation.data.imageUrl} alt="Blended Avatar" className="w-full h-full object-cover" />
                </div>
                <p className="font-serif text-lg text-center text-foreground mb-4">{blendMutation.data.message}</p>
                <div className="flex gap-3">
                  <Button className="flex-1 bg-primary hover:bg-primary/90 text-white"
                    onClick={() => { const a = document.createElement('a'); a.href = blendMutation.data.imageUrl; a.download = 'two-become-one.jpg'; a.click(); }}>
                    <Download className="w-4 h-4 mr-2" /> Save
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleReset}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Again
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex flex-col items-center space-y-10">
              <div className="flex flex-row items-center justify-center gap-10 w-full">
                <PhotoUploader label="Person 1" photo={photo1} onPhotoUpload={setPhoto1} />
                <div className="text-primary/30 font-serif italic text-2xl">+</div>
                <PhotoUploader label="Person 2" photo={photo2} onPhotoUpload={setPhoto2} />
              </div>

              <div className="w-full max-w-xs space-y-3 text-center">
                <h3 className="font-serif text-sm text-foreground uppercase tracking-wider">Art style</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['cartoon', 'watercolor', 'anime', 'painterly'] as BlendInputStyle[]).map(s => (
                    <button key={s} onClick={() => setStyle(s)}
                      className={`py-3 px-4 rounded-xl border-2 transition-all capitalize font-medium text-sm ${style === s ? 'border-primary bg-primary/10 text-primary shadow-sm' : 'border-border/50 bg-card hover:border-primary/30 text-muted-foreground'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {blendMutation.isError && (
                <div className="text-destructive bg-destructive/10 px-4 py-3 rounded-lg text-sm text-center max-w-sm">
                  {(blendMutation.error as any)?.error || 'Please try again with different photos.'}
                </div>
              )}

              <Button size="lg" disabled={!photo1 || !photo2} onClick={handleBlend}
                className={`px-10 py-6 text-lg font-serif rounded-full transition-all ${photo1 && photo2 ? 'bg-primary text-white shadow-xl shadow-primary/25 hover:-translate-y-0.5' : 'bg-muted text-muted-foreground opacity-60 cursor-not-allowed'}`}>
                Blend Us Together
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <NavBar />
    </div>
  );
}
