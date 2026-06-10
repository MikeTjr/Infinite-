import { Router } from "express";
import crypto from "crypto";

const router = Router();

const PASSPHRASE = process.env.ADMIN_PASSPHRASE ?? "";
const ADMIN_TOKEN_STORE = new Set<string>();

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Hidden admin verify — no public documentation, no visible UI link
router.post("/admin/verify", (req, res) => {
  const { passphrase } = req.body as { passphrase?: string };
  if (!passphrase || typeof passphrase !== "string") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  if (!PASSPHRASE) {
    res.status(503).json({ error: "Admin access not configured" });
    return;
  }
  if (
    passphrase.length !== PASSPHRASE.length ||
    !crypto.timingSafeEqual(Buffer.from(passphrase), Buffer.from(PASSPHRASE))
  ) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = generateToken();
  ADMIN_TOKEN_STORE.add(token);
  setTimeout(() => ADMIN_TOKEN_STORE.delete(token), 2 * 60 * 60 * 1000);
  res.json({ token });
});

export function requireAdmin(req: any, res: any, next: any) {
  const token = req.headers["x-admin-token"] as string | undefined;
  if (!token || !ADMIN_TOKEN_STORE.has(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.get("/admin/analytics", requireAdmin, (req, res) => {
  res.json({
    status: "ok",
    message: "Admin analytics endpoint ready",
    note: "Connect to persistent DB to serve real analytics",
  });
});

export default router;
