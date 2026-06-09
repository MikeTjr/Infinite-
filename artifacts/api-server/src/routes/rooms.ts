import { Router } from "express";
import { z } from "zod/v4";
import { getRoomSize } from "../websocket";

const router = Router();

interface Room {
  id: string;
  joinCode: string;
  coupleId?: string;
  phase: string;
  currentCardId?: string;
  stateJson: Record<string, unknown>;
  createdAt: string;
  expiresAt: string;
}

const activeRooms = new Map<string, Room>();

function generateJoinCode(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function cleanExpiredRooms(): void {
  const now = new Date();
  for (const [id, room] of activeRooms.entries()) {
    if (new Date(room.expiresAt) < now) {
      activeRooms.delete(id);
    }
  }
}

const CreateRoomBody = z.object({
  coupleId: z.string().uuid().optional(),
});

const UpdateRoomBody = z.object({
  phase: z.string().optional(),
  currentCardId: z.string().optional(),
  stateJson: z.record(z.unknown()).optional(),
});

router.post("/rooms", (req, res) => {
  cleanExpiredRooms();

  const parsed = CreateRoomBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  let joinCode: string;
  let attempts = 0;
  do {
    joinCode = generateJoinCode();
    attempts++;
    if (attempts > 50) {
      res.status(500).json({ error: "Could not generate unique join code" });
      return;
    }
  } while ([...activeRooms.values()].some((r) => r.joinCode === joinCode));

  const id = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 4 * 60 * 60 * 1000);

  const room: Room = {
    id,
    joinCode,
    coupleId: parsed.data.coupleId,
    phase: "waiting",
    stateJson: {},
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  activeRooms.set(id, room);

  res.status(201).json({ room, joinCode });
});

router.get("/rooms/join/:code", (req, res) => {
  cleanExpiredRooms();
  const code = req.params.code.toUpperCase();
  const room = [...activeRooms.values()].find((r) => r.joinCode === code);

  if (!room) {
    res.status(404).json({ error: "Room not found or expired" });
    return;
  }

  const size = getRoomSize(room.id);
  res.json({ room, connectedPartners: size });
});

router.get("/rooms/:id", (req, res) => {
  const room = activeRooms.get(req.params.id);
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  if (new Date(room.expiresAt) < new Date()) {
    activeRooms.delete(req.params.id);
    res.status(404).json({ error: "Room expired" });
    return;
  }

  res.json({ room, connectedPartners: getRoomSize(room.id) });
});

router.patch("/rooms/:id", (req, res) => {
  const room = activeRooms.get(req.params.id);
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  const parsed = UpdateRoomBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  if (parsed.data.phase !== undefined) room.phase = parsed.data.phase;
  if (parsed.data.currentCardId !== undefined) room.currentCardId = parsed.data.currentCardId;
  if (parsed.data.stateJson !== undefined) room.stateJson = { ...room.stateJson, ...parsed.data.stateJson };

  res.json({ room });
});

router.delete("/rooms/:id", (req, res) => {
  activeRooms.delete(req.params.id);
  res.status(204).end();
});

export default router;
