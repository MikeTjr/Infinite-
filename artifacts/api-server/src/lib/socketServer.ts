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
}

const rooms = new Map<string, RoomState>();
const socketToRoom = new Map<string, string>();

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
    if (room.createdAt < cutoff || room.finished) rooms.delete(code);
  }
}

export function attachSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket: Socket) => {
    // Create a new room
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
      socket.join(code);
      socket.emit("room-created", { code, role: "host" });
    });

    // Partner joins a room
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
    });

    // Player makes a choice on the current card
    socket.on("make-choice", ({ option }: { option: "A" | "B" | "drift" }) => {
      const code = socketToRoom.get(socket.id);
      if (!code) return;
      const room = rooms.get(code);
      if (!room || room.finished) return;
      const role = socket.id === room.hostId ? "host" : "partner";
      room.choices[role] = option;
      socket.emit("choice-recorded", { role, option });

      // If both have chosen, reveal
      if (room.choices.host !== null && room.choices.partner !== null) {
        room.revealed = true;
        const bothDrifted = room.choices.host === "drift" && room.choices.partner === "drift";
        io.to(code).emit("choices-revealed", {
          hostChoice: room.choices.host,
          partnerChoice: room.choices.partner,
          bothDrifted,
        });
      } else {
        // Notify the other player that their partner chose
        const otherRole = role === "host" ? "partner" : "host";
        const otherId = otherRole === "host" ? room.hostId : room.partnerId;
        if (otherId) io.to(otherId).emit("partner-chose");
      }
    });

    // Host advances to next card
    socket.on("advance-card", () => {
      const code = socketToRoom.get(socket.id);
      if (!code) return;
      const room = rooms.get(code);
      if (!room || room.finished || socket.id !== room.hostId) return;

      // Score from last card
      if (room.choices.host && room.choices.host !== "drift") room.hostScore += 10;
      if (room.choices.partner && room.choices.partner !== "drift") room.partnerScore += 10;

      room.currentCardIndex += 1;
      room.choices = { host: null, partner: null };
      room.revealed = false;

      if (room.currentCardIndex >= room.totalCards) {
        room.finished = true;
        io.to(code).emit("session-finished", { hostScore: room.hostScore, partnerScore: room.partnerScore });
      } else {
        io.to(code).emit("card-advanced", { cardIndex: room.currentCardIndex });
      }
    });

    // Heartbeat
    socket.on("ping-room", () => {
      const code = socketToRoom.get(socket.id);
      if (code) socket.emit("pong-room", { code });
    });

    // Disconnect cleanup
    socket.on("disconnect", () => {
      const code = socketToRoom.get(socket.id);
      if (code) {
        socketToRoom.delete(socket.id);
        const room = rooms.get(code);
        if (room && !room.finished) {
          const role = socket.id === room.hostId ? "host" : "partner";
          io.to(code).emit("partner-disconnected", { role });
        }
      }
    });
  });

  return io;
}
