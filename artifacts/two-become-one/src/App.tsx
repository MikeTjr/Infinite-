import React, { useState, useRef, useCallback } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useBlendPhotos } from "@workspace/api-client-react";
import { BlendInputStyle } from "@workspace/api-zod";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, CheckCircle2, Download, RefreshCw, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

function PhotoUploader({ 
  label, 
  photo, 
  onPhotoUpload 
}: { 
  label: string; 
  photo: string | null; 
  onPhotoUpload: (base64: string) => void;
}) {
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
        className={`relative w-40 h-40 md:w-48 md:h-48 rounded-full cursor-pointer flex items-center justify-center overflow-hidden border-4 transition-colors ${photo ? 'border-primary shadow-lg shadow-primary/20' : 'border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5'}`}
      >
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={inputRef} 
          onChange={handleFileChange} 
        />
        
        <AnimatePresence mode="wait">
          {photo ? (
            <motion.div 
              key="image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <img src={photo} alt={label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <RefreshCw className="text-white w-8 h-8" />
              </div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute bottom-2 right-2 bg-white rounded-full p-0.5 shadow-sm"
              >
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2 text-primary/60"
            >
              <Camera className="w-10 h-10" />
              <span className="text-sm font-medium">Tap to upload</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function Home() {
  const [photo1, setPhoto1] = useState<string | null>(null);
  const [photo2, setPhoto2] = useState<string | null>(null);
  const [style, setStyle] = useState<BlendInputStyle>("cartoon" as BlendInputStyle);
  
  const blendMutation = useBlendPhotos();

  const handleBlend = () => {
    if (!photo1 || !photo2) return;
    blendMutation.mutate({
      data: {
        photo1,
        photo2,
        style
      }
    });
  };

  const handleReset = () => {
    setPhoto1(null);
    setPhoto2(null);
    blendMutation.reset();
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center pt-12 pb-24 px-4 bg-background overflow-x-hidden relative selection:bg-primary/20">
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-40 -left-40 w-80 h-80 bg-secondary/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto flex flex-col items-center"
      >
        
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <Heart className="w-8 h-8 text-primary mx-auto mb-2 opacity-80" />
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground tracking-tight">
            Two Become One
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light italic">
            "And the two shall become one flesh..." <br className="md:hidden" />
            Weave your stories into a single masterpiece.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {blendMutation.isPending ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-20 space-y-8"
            >
              <div className="relative">
                <Heart className="w-24 h-24 text-primary animate-heartbeat drop-shadow-xl" fill="currentColor" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
              </div>
              <h2 className="text-2xl font-serif text-primary">Weaving your souls together...</h2>
              <p className="text-muted-foreground">This sacred process takes a magical moment.</p>
            </motion.div>
          ) : blendMutation.isSuccess ? (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col items-center"
            >
              <div className="bg-card p-4 md:p-6 rounded-2xl shadow-xl border border-card-border/50 max-w-md w-full relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur -z-10" />
                <div className="aspect-square rounded-xl overflow-hidden bg-muted mb-6">
                  <img 
                    src={blendMutation.data.imageUrl} 
                    alt="Blended Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center space-y-4 px-2">
                  <p className="font-serif text-xl md:text-2xl text-foreground">
                    {blendMutation.data.message}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button 
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = blendMutation.data.imageUrl;
                        link.download = 'two-become-one-portrait.jpg';
                        link.click();
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Save Keepsake
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-primary/20 text-foreground hover:bg-primary/5"
                      onClick={handleReset}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center space-y-12"
            >
              
              {/* Upload Zones */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full">
                <PhotoUploader label="Person 1" photo={photo1} onPhotoUpload={setPhoto1} />
                <div className="hidden md:flex flex-col items-center justify-center text-primary/30">
                  <div className="h-px w-16 bg-primary/20" />
                  <span className="font-serif italic py-2">+</span >
                  <div className="h-px w-16 bg-primary/20" />
                </div>
                <PhotoUploader label="Person 2" photo={photo2} onPhotoUpload={setPhoto2} />
              </div>

              {/* Style Selector */}
              <div className="w-full max-w-sm space-y-4 text-center">
                <h3 className="font-serif text-lg text-foreground">Choose your art style</h3>
                <div className="grid grid-cols-2 gap-3">
                  {["cartoon", "watercolor", "anime", "painterly"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s as BlendInputStyle)}
                      className={`py-3 px-4 rounded-xl border-2 transition-all capitalize font-medium ${
                        style === s 
                          ? 'border-primary bg-primary/10 text-primary shadow-sm' 
                          : 'border-border/50 bg-card hover:border-primary/30 text-muted-foreground'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {blendMutation.isError && (
                <div className="text-destructive bg-destructive/10 px-4 py-3 rounded-lg text-sm text-center max-w-md">
                  We gently encountered an issue: {blendMutation.error?.error || "Please try again with different photos."}
                </div>
              )}

              {/* Blend Button */}
              <div className="pt-4">
                <Button 
                  size="lg"
                  disabled={!photo1 || !photo2 || blendMutation.isPending}
                  onClick={handleBlend}
                  className={`relative px-12 py-8 text-xl font-serif rounded-full transition-all duration-500 overflow-hidden ${
                    photo1 && photo2 
                      ? 'bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1' 
                      : 'bg-muted text-muted-foreground opacity-70 cursor-not-allowed'
                  }`}
                >
                  {photo1 && photo2 && (
                    <div className="absolute inset-0 rounded-full animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] ring-2 ring-primary ring-offset-4 ring-offset-background" />
                  )}
                  <span className="relative z-10">Blend Us Together</span>
                </Button>
              </div>
              
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
