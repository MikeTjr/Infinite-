import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage, Server } from "http";
import { logger } from "./lib/logger";

export type GameEvent =
  | { type: "CARD_DRAWN"; cardId: string }
  | { type: "PARTNER_1_CHOICE"; choice: "A" | "B" }
  | { type: "PARTNER_2_CHOICE"; choice: "A" | "B" }
  | { type: "REVEAL" }
  | { type: "SESSION_COMPLETE"; scoreEarned: number }
  | { type: "PHASE_CHANGE"; phase: string }
  | { type: "PARTNER_JOINED"; partnerName: string }
  | { type: "PING" }
  | { type: "PONG" };

interface RoomClient {
  ws: WebSocket;
  roomId: string;
  partnerId: "p1" | "p2";
}

const rooms = new Map<string, RoomClient[]>();

export function setupWebSocketServer(server: Server): WebSocketServer {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
    const roomId = url.searchParams.get("roomId");
    const partnerId = url.searchParams.get("partnerId") as "p1" | "p2" | null;

    if (!roomId || !partnerId) {
      ws.close(1008, "Missing roomId or partnerId");
      return;
    }

    const client: RoomClient = { ws, roomId, partnerId };
    if (!rooms.has(roomId)) rooms.set(roomId, []);
    rooms.get(roomId)!.push(client);

    logger.info({ roomId, partnerId }, "WebSocket client connected");

    broadcastToRoom(roomId, { type: "PARTNER_JOINED", partnerName: partnerId }, ws);

    ws.on("message", (data) => {
      try {
        const event: GameEvent = JSON.parse(data.toString());
        if (event.type === "PING") {
          ws.send(JSON.stringify({ type: "PONG" }));
          return;
        }
        broadcastToRoom(roomId, event, ws);
      } catch (err) {
        logger.warn({ err }, "Failed to parse WebSocket message");
      }
    });

    ws.on("close", () => {
      const clients = rooms.get(roomId) ?? [];
      rooms.set(roomId, clients.filter((c) => c.ws !== ws));
      if (rooms.get(roomId)?.length === 0) rooms.delete(roomId);
      logger.info({ roomId, partnerId }, "WebSocket client disconnected");
    });

    ws.on("error", (err) => {
      logger.error({ err, roomId }, "WebSocket error");
    });
  });

  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      }
    });
  }, 30_000);

  return wss;
}

function broadcastToRoom(roomId: string, event: GameEvent, senderWs: WebSocket): void {
  const clients = rooms.get(roomId) ?? [];
  const payload = JSON.stringify(event);
  for (const client of clients) {
    if (client.ws !== senderWs && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(payload);
    }
  }
}

export function getRoomSize(roomId: string): number {
  return rooms.get(roomId)?.length ?? 0;
}
