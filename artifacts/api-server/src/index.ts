import { createServer } from "http";
import app from "./app";
import { attachSocketServer } from "./lib/socketServer";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const httpServer = createServer(app);
attachSocketServer(httpServer);

httpServer.listen(port, () => {
  logger.info({ port }, "Infinite Us API + WebSocket listening");
});

httpServer.on("error", (err) => {
  logger.error({ err }, "Server error");
  process.exit(1);
});
