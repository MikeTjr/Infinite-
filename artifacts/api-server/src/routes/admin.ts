import { Router } from "express";
import crypto from "crypto";

const router = Router();

const PASSPHRASE = process.env.ADMIN_PASSPHRASE ?? "";
const ADMIN_TOKEN_STORE = new Set<string>();

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Hidden admin verify — no documentation, no public API spec
router.post("/admin/verify", (req, res) => {
  const { passphrase } = req.body as { passphrase?: string };
  if (!passphrase || typeof passphrase !== "string") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  // Constant-time comparison to prevent timing attacks
  if (
    passphrase.length !== PASSPHRASE.length ||
    !crypto.timingSafeEqual(Buffer.from(passphrase), Buffer.from(PASSPHRASE))
  ) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = generateToken();
  ADMIN_TOKEN_STORE.add(token);
  // Token auto-expires after 2 hours
  setTimeout(() => ADMIN_TOKEN_STORE.delete(token), 2 * 60 * 60 * 1000);
  res.json({ token });
});

// Middleware to protect admin routes
export function requireAdmin(req: any, res: any, next: any) {
  const token = req.headers["x-admin-token"] as string | undefined;
  if (!token || !ADMIN_TOKEN_STORE.has(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

// Admin analytics — drift patterns, engagement, card performance
router.get("/admin/analytics", requireAdmin, (req, res) => {
  res.json({
    status: "ok",
    message: "Admin analytics endpoint ready",
    note: "Connect to persistent DB to serve real analytics",
  });
});

export default router;
