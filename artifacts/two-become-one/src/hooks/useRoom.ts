import { useState, useEffect, useRef, useCallback } from 'react';
import { GameEvent, RoomState } from '../lib/types';

const API_BASE = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';

function getWsUrl(roomId: string, partnerId: 'p1' | 'p2'): string {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const host = window.location.host;
  return `${protocol}://${host}/ws?roomId=${roomId}&partnerId=${partnerId}`;
}

interface UseRoomOptions {
  onEvent?: (event: GameEvent) => void;
}

export function useRoom(options: UseRoomOptions = {}) {
  const [room, setRoom] = useState<RoomState | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const partnerIdRef = useRef<'p1' | 'p2'>('p1');

  const connect = useCallback((roomId: string, partnerId: 'p1' | 'p2') => {
    partnerIdRef.current = partnerId;
    const ws = new WebSocket(getWsUrl(roomId, partnerId));
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setError(null);
    };

    ws.onmessage = (evt) => {
      try {
        const event: GameEvent = JSON.parse(evt.data);
        options.onEvent?.(event);
      } catch {
        console.warn('Failed to parse WebSocket message', evt.data);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      reconnectTimer.current = setTimeout(() => {
        if (room) connect(room.id, partnerId);
      }, 3000);
    };

    ws.onerror = () => {
      setError('Connection error — check your network');
    };
  }, [room, options]);

  const disconnect = useCallback(() => {
    if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    wsRef.current?.close();
    wsRef.current = null;
    setConnected(false);
  }, []);

  const sendEvent = useCallback((event: GameEvent) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(event));
    }
  }, []);

  const createRoom = useCallback(async (coupleId?: string): Promise<RoomState> => {
    const res = await fetch(`${API_BASE}/api/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coupleId }),
    });
    if (!res.ok) throw new Error('Failed to create room');
    const data = await res.json() as { room: RoomState };
    setRoom(data.room);
    return data.room;
  }, []);

  const joinRoom = useCallback(async (code: string): Promise<RoomState> => {
    const res = await fetch(`${API_BASE}/api/rooms/join/${code}`);
    if (!res.ok) throw new Error('Room not found or expired');
    const data = await res.json() as { room: RoomState };
    setRoom(data.room);
    return data.room;
  }, []);

  const updateRoom = useCallback(async (
    roomId: string,
    updates: { phase?: string; currentCardId?: string; stateJson?: Record<string, unknown> }
  ): Promise<void> => {
    await fetch(`${API_BASE}/api/rooms/${roomId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  }, []);

  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return {
    room,
    connected,
    error,
    createRoom,
    joinRoom,
    connect,
    disconnect,
    sendEvent,
    updateRoom,
  };
}
