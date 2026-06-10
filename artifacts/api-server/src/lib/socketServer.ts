import { Server, Socket } from "socket.io";
import type { Server as HttpServer } from "http";

interface Choice { option: "A" | "B" | "drift" | null }

interface RoomState {
  hostId: string;
  partnerId: string | null;
  roomCode: string;
  currentCardIndex: number;
  totalCards: number;
  choices: { host: Choice["option"]; partner: Choice["option"] };
  revealed: boolean;
  hostScore: number;
  partnerScore: number;
  finished: boolean;
  createdAt: number;
  cardTitle?: string;
}

const rooms = new Map<string, RoomState>();
const socketToRoom = new Map<string, string>();
const observers = new Map<string, Set<string>>();

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function getUniqueCode(): string {
  let code = generateCode();
  while (rooms.has(code)) code = generateCode();
  return code;
}

function cleanStaleRooms(): void {
  const cutoff = Date.now() - 6 * 60 * 60 * 1000;
  for (const [code, room] of rooms.entries()) {
    if (room.createdAt < cutoff || room.finished) {
      rooms.delete(code);
      observers.delete(code);
    }
  }
}

export function attachSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    path: "/api/socket.io",
    cors: { origin: "*", methods: ["GET", "POST"] },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket: Socket) => {

    // ── Host creates a room ───────────────────────────────────────
    socket.on("create-room", ({ totalCards }: { totalCards: number }) => {
      cleanStaleRooms();
      const code = getUniqueCode();
      const room: RoomState = {
        hostId: socket.id,
        partnerId: null,
        roomCode: code,
        currentCardIndex: 0,
        totalCards: totalCards ?? 15,
        choices: { host: null, partner: null },
        revealed: false,
        hostScore: 0,
        partnerScore: 0,
        finished: false,
        createdAt: Date.now(),
      };
      rooms.set(code, room);
      socketToRoom.set(socket.id, code);
      observers.set(code, new Set());
      socket.join(code);
      socket.emit("room-created", { code, role: "host" });
    });

    // ── Partner joins a room ──────────────────────────────────────
    socket.on("join-room", ({ code }: { code: string }) => {
      const upper = code.toUpperCase().trim();
      const room = rooms.get(upper);
      if (!room) { socket.emit("room-error", { message: "Room not found. Check the code and try again." }); return; }
      if (room.partnerId) { socket.emit("room-error", { message: "This room is already full." }); return; }
      if (room.finished) { socket.emit("room-error", { message: "This session has already ended." }); return; }
      room.partnerId = socket.id;
      socketToRoom.set(socket.id, upper);
      socket.join(upper);
      socket.emit("room-joined", { code: upper, role: "partner", currentCardIndex: room.currentCardIndex, totalCards: room.totalCards });
      io.to(upper).emit("partner-connected", { code: upper, currentCardIndex: room.currentCardIndex });

      // Notify observers that partner joined
      const obs = observers.get(upper);
      if (obs && obs.size > 0) {
        socket.to([...obs]).emit("observer-partner-joined", { code: upper });
      }
    });

    // ── TV viewer joins as read-only observer ─────────────────────
    socket.on("join-as-observer", ({ code }: { code: string }) => {
      const upper = code.toUpperCase().trim();
      const room = rooms.get(upper);
      if (!room) {
        socket.emit("observer-error", { message: "Room not found or session has ended." });
        return;
      }
      if (!observers.has(upper)) observers.set(upper, new Set());
      observers.get(upper)!.add(socket.id);
      socket.join(`obs:${upper}`);
      socket.emit("observer-joined", {
        code: upper,
        currentCardIndex: room.currentCardIndex,
        totalCards: room.totalCards,
        hostScore: room.hostScore,
        partnerScore: room.partnerScore,
        finished: room.finished,
        partnerConnected: !!room.partnerId,
      });
    });

    // ── Player makes a choice ─────────────────────────────────────
    socket.on("make-choice", ({ option, cardTitle }: { option: "A" | "B" | "drift"; cardTitle?: string }) => {
      const code = socketToRoom.get(socket.id);
      if (!code) return;
      const room = rooms.get(code);
      if (!room || room.finished) return;
      const role = socket.id === room.hostId ? "host" : "partner";
      room.choices[role] = option;
      if (cardTitle) room.cardTitle = cardTitle;
      socket.emit("choice-recorded", { role, option });

      // Broadcast to observers that a player chose (without revealing the choice)
      io.to(`obs:${code}`).emit("observer-player-chose", {
        role,
        cardIndex: room.currentCardIndex,
        cardTitle: room.cardTitle,
        hostChose: room.choices.host !== null,
        partnerChose: room.choices.partner !== null,
        hostScore: room.hostScore,
        partnerScore: room.partnerScore,
      });

      if (room.choices.host !== null && room.choices.partner !== null) {
        room.revealed = true;
        const bothDrifted = room.choices.host === "drift" && room.choices.partner === "drift";
        const revealPayload = {
          hostChoice: room.choices.host,
          partnerChoice: room.choices.partner,
          bothDrifted,
        };
        // Broadcast reveal to players
        io.to(code).emit("choices-revealed", revealPayload);
        // Observers see the reveal too
        io.to(`obs:${code}`).emit("observer-choices-revealed", {
          ...revealPayload,
          hostScore: room.hostScore,
          partnerScore: room.partnerScore,
        });
      } else {
        const otherRole = role === "host" ? "partner" : "host";
        const otherId = otherRole === "host" ? room.hostId : room.partnerId;
        if (otherId) io.to(otherId).emit("partner-chose");
      }
    });

    // ── Host advances to next card ────────────────────────────────
    socket.on("advance-card", ({ cardTitle }: { cardTitle?: string } = {}) => {
      const code = socketToRoom.get(socket.id);
      if (!code) return;
      const room = rooms.get(code);
      if (!room || room.finished || socket.id !== room.hostId) return;

      if (room.choices.host && room.choices.host !== "drift") room.hostScore += 10;
      if (room.choices.partner && room.choices.partner !== "drift") room.partnerScore += 10;

      room.currentCardIndex += 1;
      room.choices = { host: null, partner: null };
      room.revealed = false;
      if (cardTitle) room.cardTitle = cardTitle;

      if (room.currentCardIndex >= room.totalCards) {
        room.finished = true;
        const finishPayload = { hostScore: room.hostScore, partnerScore: room.partnerScore };
        io.to(code).emit("session-finished", finishPayload);
        io.to(`obs:${code}`).emit("observer-session-finished", finishPayload);
      } else {
        const advancePayload = {
          cardIndex: room.currentCardIndex,
          hostScore: room.hostScore,
          partnerScore: room.partnerScore,
        };
        // Broadcast card advance + scores to players AND observers
        io.to(code).emit("card-advanced", advancePayload);
        io.to(`obs:${code}`).emit("observer-card-advanced", advancePayload);
      }
    });

    // ── Heartbeat ─────────────────────────────────────────────────
    socket.on("ping-room", () => {
      const code = socketToRoom.get(socket.id);
      if (code) socket.emit("pong-room", { code });
    });

    // ── Disconnect cleanup ────────────────────────────────────────
    socket.on("disconnect", () => {
      const code = socketToRoom.get(socket.id);
      if (code) {
        socketToRoom.delete(socket.id);
        const room = rooms.get(code);
        if (room && !room.finished) {
          const role = socket.id === room.hostId ? "host" : "partner";
          io.to(code).emit("partner-disconnected", { role });
          io.to(`obs:${code}`).emit("observer-partner-disconnected", { role });
        }

        // Remove from observers if they were observing
        const obs = observers.get(code);
        if (obs) obs.delete(socket.id);
      }
    });
  });

  return io;
}

export function getRoomSize(roomId: string): number {
  const room = rooms.get(roomId);
  if (!room) return 0;
  return (room.hostId ? 1 : 0) + (room.partnerId ? 1 : 0);
}
