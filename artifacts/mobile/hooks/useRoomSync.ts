import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000';

export type RoomRole = 'host' | 'partner';
export type ChoiceOption = 'A' | 'B' | 'drift';

export interface RoomSyncState {
  connected: boolean;
  roomCode: string | null;
  role: RoomRole | null;
  partnerConnected: boolean;
  currentCardIndex: number;
  myChoice: ChoiceOption | null;
  partnerChose: boolean;
  revealedChoices: { hostChoice: ChoiceOption; partnerChoice: ChoiceOption } | null;
  finished: boolean;
  scores: { host: number; partner: number };
  error: string | null;
}

const DEFAULT_STATE: RoomSyncState = {
  connected: false,
  roomCode: null,
  role: null,
  partnerConnected: false,
  currentCardIndex: 0,
  myChoice: null,
  partnerChose: false,
  revealedChoices: null,
  finished: false,
  scores: { host: 0, partner: 0 },
  error: null,
};

export function useRoomSync() {
  const [state, setState] = useState<RoomSyncState>(DEFAULT_STATE);
  const socketRef = useRef<Socket | null>(null);

  const updateState = useCallback((patch: Partial<RoomSyncState>) => {
    setState(prev => ({ ...prev, ...patch }));
  }, []);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const socket = io(API_BASE, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      timeout: 10000,
    });
    socketRef.current = socket;

    socket.on('connect', () => updateState({ connected: true, error: null }));
    socket.on('disconnect', () => updateState({ connected: false }));
    socket.on('connect_error', () => updateState({ error: 'Could not connect to game server. Check your connection.' }));

    socket.on('room-created', ({ code, role }: { code: string; role: RoomRole }) => {
      updateState({ roomCode: code, role });
    });

    socket.on('room-joined', ({ code, role, currentCardIndex }: { code: string; role: RoomRole; currentCardIndex: number }) => {
      updateState({ roomCode: code, role, currentCardIndex, partnerConnected: true });
    });

    socket.on('room-error', ({ message }: { message: string }) => {
      updateState({ error: message });
    });

    socket.on('partner-connected', ({ currentCardIndex }: { currentCardIndex: number }) => {
      updateState({ partnerConnected: true, currentCardIndex });
    });

    socket.on('partner-disconnected', () => {
      updateState({ partnerConnected: false, error: 'Your partner disconnected. Waiting for them to reconnect...' });
    });

    socket.on('partner-chose', () => {
      updateState({ partnerChose: true });
    });

    socket.on('choices-revealed', (data: { hostChoice: ChoiceOption; partnerChoice: ChoiceOption }) => {
      updateState({ revealedChoices: data });
    });

    socket.on('card-advanced', ({ cardIndex }: { cardIndex: number }) => {
      updateState({ currentCardIndex: cardIndex, myChoice: null, partnerChose: false, revealedChoices: null });
    });

    socket.on('session-finished', ({ hostScore, partnerScore }: { hostScore: number; partnerScore: number }) => {
      updateState({ finished: true, scores: { host: hostScore, partner: partnerScore } });
    });

    socket.on('pong-room', () => {});
  }, [updateState]);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setState(DEFAULT_STATE);
  }, []);

  const createRoom = useCallback((totalCards: number) => {
    if (!socketRef.current?.connected) { updateState({ error: 'Not connected to server' }); return; }
    socketRef.current.emit('create-room', { totalCards });
  }, [updateState]);

  const joinRoom = useCallback((code: string) => {
    if (!socketRef.current?.connected) { updateState({ error: 'Not connected to server' }); return; }
    socketRef.current.emit('join-room', { code });
  }, [updateState]);

  const makeChoice = useCallback((option: ChoiceOption) => {
    if (!socketRef.current?.connected) return;
    setState(prev => ({ ...prev, myChoice: option }));
    socketRef.current.emit('make-choice', { option });
  }, []);

  const advanceCard = useCallback(() => {
    if (!socketRef.current?.connected || state.role !== 'host') return;
    socketRef.current.emit('advance-card');
  }, [state.role]);

  const clearError = useCallback(() => updateState({ error: null }), [updateState]);

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return {
    state,
    connect,
    disconnect,
    createRoom,
    joinRoom,
    makeChoice,
    advanceCard,
    clearError,
  };
}
