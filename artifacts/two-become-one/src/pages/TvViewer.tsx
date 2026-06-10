import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tv, Heart, Users, Clock, Trophy, Eye, Wifi, WifiOff } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface ObserverState {
  code: string;
  currentCardIndex: number;
  totalCards: number;
  hostScore: number;
  partnerScore: number;
  finished: boolean;
  partnerConnected: boolean;
  phase: 'waiting' | 'playing' | 'revealed' | 'finished';
  hostChose: boolean;
  partnerChose: boolean;
  lastReveal?: { hostChoice: string; partnerChoice: string; bothDrifted: boolean };
  cardTitle?: string;
}

interface TvViewerProps {
  code?: string;
}

export default function TvViewer({ code: initialCode }: TvViewerProps) {
  const [inputCode, setInputCode] = useState(initialCode ?? '');
  const [joined, setJoined] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [obs, setObs] = useState<ObserverState | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [pulseKey, setPulseKey] = useState(0);

  const connect = (code: string) => {
    const upper = code.toUpperCase().trim();
    if (!upper || upper.length < 4) {
      setError('Enter a valid 6-character room code.');
      return;
    }

    const socket: Socket = io({ path: '/api/socket.io', transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      setError(null);
      socket.emit('join-as-observer', { code: upper });
    });

    socket.on('observer-joined', (data: any) => {
      setJoined(true);
      setObs({
        code: upper,
        currentCardIndex: data.currentCardIndex,
        totalCards: data.totalCards,
        hostScore: data.hostScore,
        partnerScore: data.partnerScore,
        finished: data.finished,
        partnerConnected: data.partnerConnected,
        phase: data.finished ? 'finished' : 'playing',
        hostChose: false,
        partnerChose: false,
      });
    });

    socket.on('observer-error', (data: any) => {
      setError(data.message ?? 'Could not join this room.');
      socket.disconnect();
    });

    socket.on('observer-partner-joined', () => {
      setObs(prev => prev ? { ...prev, partnerConnected: true } : prev);
    });

    socket.on('observer-player-chose', (data: any) => {
      setPulseKey(k => k + 1);
      setObs(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          hostChose: data.hostChose,
          partnerChose: data.partnerChose,
          hostScore: data.hostScore,
          partnerScore: data.partnerScore,
          cardTitle: data.cardTitle,
          phase: 'playing',
        };
      });
    });

    socket.on('observer-choices-revealed', (data: any) => {
      setObs(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          lastReveal: { hostChoice: data.hostChoice, partnerChoice: data.partnerChoice, bothDrifted: data.bothDrifted },
          hostScore: data.hostScore,
          partnerScore: data.partnerScore,
          hostChose: true,
          partnerChose: true,
          phase: 'revealed',
        };
      });
    });

    socket.on('observer-card-advanced', (data: any) => {
      setObs(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          currentCardIndex: data.cardIndex,
          hostScore: data.hostScore,
          partnerScore: data.partnerScore,
          hostChose: false,
          partnerChose: false,
          lastReveal: undefined,
          phase: 'playing',
        };
      });
    });

    socket.on('observer-session-finished', (data: any) => {
      setObs(prev => {
        if (!prev) return prev;
        return { ...prev, hostScore: data.hostScore, partnerScore: data.partnerScore, finished: true, phase: 'finished' };
      });
    });

    socket.on('observer-partner-disconnected', () => {
      setObs(prev => prev ? { ...prev, partnerConnected: false } : prev);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('connect_error', () => {
      setError('Could not connect to the game server. Check your network.');
    });
  };

  useEffect(() => {
    if (initialCode) connect(initialCode);
    return () => { socketRef.current?.disconnect(); };
  }, []);

  const progress = obs ? (obs.currentCardIndex / obs.totalCards) * 100 : 0;

  if (!joined) {
    return (
      <div className="min-h-screen bg-[hsl(340,20%,8%)] flex flex-col items-center justify-center px-6 gap-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <Tv className="w-16 h-16 text-[hsl(340,55%,60%)] mx-auto" />
          <h1 className="text-4xl font-serif font-bold text-white">Watch Live</h1>
          <p className="text-[hsl(355,20%,55%)] text-sm">Enter a room code to watch a game in progress</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="w-full max-w-sm space-y-4">
          <input
            value={inputCode}
            onChange={e => setInputCode(e.target.value.toUpperCase().slice(0, 6))}
            placeholder="ROOM CODE"
            className="w-full text-center text-2xl font-mono py-4 px-6 rounded-2xl border-2 border-[hsl(340,15%,25%)] bg-[hsl(340,18%,12%)] text-white tracking-widest placeholder:text-[hsl(355,20%,30%)] focus:outline-none focus:border-[hsl(340,55%,60%)]"
            onKeyDown={e => e.key === 'Enter' && connect(inputCode)}
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            onClick={() => connect(inputCode)}
            disabled={inputCode.length < 4}
            className="w-full py-4 rounded-2xl bg-[hsl(340,55%,60%)] text-white font-serif text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[hsl(340,55%,55%)] transition-colors"
          >
            {connected ? 'Joining...' : 'Join as Viewer'}
          </button>
        </motion.div>

        <div className="flex items-center gap-2 text-[hsl(355,20%,40%)] text-xs">
          <Eye className="w-4 h-4" />
          <span>Read-only observer mode. You see everything. You control nothing.</span>
        </div>
      </div>
    );
  }

  if (!obs) {
    return (
      <div className="min-h-screen bg-[hsl(340,20%,8%)] flex items-center justify-center">
        <Heart className="w-10 h-10 text-[hsl(340,55%,60%)] animate-pulse" fill="currentColor" />
      </div>
    );
  }

  if (obs.finished) {
    const hostWon = obs.hostScore > obs.partnerScore;
    const tied = obs.hostScore === obs.partnerScore;
    return (
      <div className="min-h-screen bg-[hsl(340,20%,8%)] flex flex-col items-center justify-center px-8 text-center gap-8">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}>
          <div className="text-8xl mb-6">{tied ? '🤝' : '🏆'}</div>
          <h1 className="text-5xl font-serif font-bold text-white mb-3">Session Complete</h1>
          <p className="text-[hsl(355,20%,55%)]">The session has ended. What a journey.</p>
        </motion.div>
        <div className="flex gap-8">
          <ScoreCard label="Host" score={obs.hostScore} highlight={!tied && hostWon} />
          <ScoreCard label="Partner" score={obs.partnerScore} highlight={!tied && !hostWon} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(340,20%,8%)] flex flex-col px-8 py-8 gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-[hsl(340,55%,60%)]" fill="currentColor" />
          <div>
            <h1 className="text-2xl font-serif font-bold text-white">Infinite Us</h1>
            <p className="text-[hsl(355,20%,45%)] text-xs">Room {obs.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {connected
            ? <><Wifi className="w-4 h-4 text-green-400" /><span className="text-green-400 text-xs">Live</span></>
            : <><WifiOff className="w-4 h-4 text-red-400" /><span className="text-red-400 text-xs">Reconnecting</span></>}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-[hsl(340,15%,20%)] rounded-full overflow-hidden">
        <motion.div className="h-full bg-[hsl(340,55%,60%)] rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
      </div>
      <div className="flex justify-between text-[hsl(355,20%,40%)] text-xs">
        <span>Card {obs.currentCardIndex + 1} of {obs.totalCards}</span>
        <span>{Math.round(progress)}% complete</span>
      </div>

      {/* Scores */}
      <div className="flex gap-6 justify-center">
        <ScoreCard label="Host" score={obs.hostScore} />
        <ScoreCard label="Partner" score={obs.partnerScore} />
      </div>

      {/* Connection status */}
      <div className="flex gap-4 justify-center">
        <PartnerStatus role="Host" connected={true} chose={obs.hostChose} />
        <PartnerStatus role="Partner" connected={obs.partnerConnected} chose={obs.partnerChose} />
      </div>

      {/* Current state */}
      <AnimatePresence mode="wait">
        {obs.phase === 'revealed' && obs.lastReveal ? (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="text-6xl"
            >
              {obs.lastReveal.bothDrifted ? '🌊' : obs.lastReveal.hostChoice === obs.lastReveal.partnerChoice ? '💫' : '⚡'}
            </motion.div>
            <h2 className="text-4xl font-serif font-bold text-white">
              {obs.lastReveal.bothDrifted ? 'Both drifted' : obs.lastReveal.hostChoice === obs.lastReveal.partnerChoice ? 'They matched!' : 'They split!'}
            </h2>
            <div className="flex gap-4">
              <ChoiceBadge label="Host" choice={obs.lastReveal.hostChoice} />
              <ChoiceBadge label="Partner" choice={obs.lastReveal.partnerChoice} />
            </div>
            {!obs.lastReveal.bothDrifted && obs.lastReveal.hostChoice !== obs.lastReveal.partnerChoice && (
              <p className="text-[hsl(355,20%,45%)] italic text-sm max-w-md">A split is a door — not a problem.</p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-5 text-center"
          >
            {obs.cardTitle && (
              <p className="text-[hsl(355,20%,50%)] text-sm uppercase tracking-widest">{obs.cardTitle}</p>
            )}
            <motion.div
              key={pulseKey}
              initial={{ scale: 1.2, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 rounded-full bg-[hsl(340,18%,14%)] border-2 border-[hsl(340,15%,25%)] flex items-center justify-center"
            >
              <Clock className="w-10 h-10 text-[hsl(340,55%,60%)]" />
            </motion.div>
            <h2 className="text-3xl font-serif font-bold text-white">
              {obs.hostChose && obs.partnerChose ? 'Both chosen — waiting for reveal' :
               obs.hostChose ? 'Host chose — waiting for partner...' :
               obs.partnerChose ? 'Partner chose — waiting for host...' :
               obs.partnerConnected ? 'Waiting for choices...' : 'Waiting for partner to join...'}
            </h2>
            <div className="flex gap-6 mt-2">
              <span className={`text-sm px-4 py-1.5 rounded-full border ${obs.hostChose ? 'border-[hsl(340,55%,60%)] text-[hsl(340,55%,60%)] bg-[hsl(340,55%,60%)]/10' : 'border-[hsl(340,15%,25%)] text-[hsl(355,20%,40%)]'}`}>
                Host {obs.hostChose ? '✓' : '...'}
              </span>
              <span className={`text-sm px-4 py-1.5 rounded-full border ${obs.partnerChose ? 'border-[hsl(15,55%,55%)] text-[hsl(15,55%,55%)] bg-[hsl(15,55%,55%)]/10' : 'border-[hsl(340,15%,25%)] text-[hsl(355,20%,40%)]'}`}>
                Partner {obs.partnerChose ? '✓' : '...'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Observer badge */}
      <div className="flex items-center justify-center gap-2 text-[hsl(355,20%,30%)] text-xs">
        <Eye className="w-3 h-3" />
        <span>Observer mode</span>
      </div>
    </div>
  );
}

function ScoreCard({ label, score, highlight }: { label: string; score: number; highlight?: boolean }) {
  return (
    <div className={`flex flex-col items-center px-8 py-4 rounded-2xl border-2 transition-all ${highlight ? 'border-[hsl(340,55%,60%)] bg-[hsl(340,55%,60%)]/10' : 'border-[hsl(340,15%,22%)] bg-[hsl(340,18%,12%)]'}`}>
      <p className="text-[hsl(355,20%,45%)] text-xs uppercase tracking-widest mb-1">{label}</p>
      <p className="text-4xl font-bold text-white">{score}</p>
      <p className="text-[hsl(355,20%,40%)] text-xs">pts</p>
    </div>
  );
}

function PartnerStatus({ role, connected, chose }: { role: string; connected: boolean; chose: boolean }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[hsl(340,18%,12%)] border border-[hsl(340,15%,20%)]">
      <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
      <span className="text-[hsl(355,20%,55%)] text-sm">{role}</span>
      {chose && <span className="text-[hsl(340,55%,60%)] text-xs">✓ chose</span>}
    </div>
  );
}

function ChoiceBadge({ label, choice }: { label: string; choice: string }) {
  const isDrift = choice === 'drift';
  return (
    <div className={`px-6 py-3 rounded-2xl border-2 text-center ${isDrift ? 'border-[hsl(355,20%,30%)] bg-[hsl(340,18%,12%)]' : 'border-[hsl(340,55%,60%)] bg-[hsl(340,55%,60%)]/15'}`}>
      <p className="text-[hsl(355,20%,45%)] text-xs mb-1">{label}</p>
      <p className={`text-2xl font-bold ${isDrift ? 'text-[hsl(355,20%,40%)]' : 'text-white'}`}>
        {choice === 'drift' ? 'Drift' : choice}
      </p>
    </div>
  );
}
