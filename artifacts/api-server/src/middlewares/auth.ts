import { Request, Response, NextFunction } from "express";
import { createHmac, timingSafeEqual } from "crypto";

export interface AuthUser {
  id: string;
  coupleId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be set and at least 32 characters long");
  }
  return secret;
}

function signPayload(header: string, payload: string): string {
  return createHmac("sha256", getSecret())
    .update(`${header}.${payload}`)
    .digest("base64url");
}

function verifySignature(header: string, payload: string, sig: string): boolean {
  const expected = signPayload(header, payload);
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
  } catch {
    return false;
  }
}

export function issueToken(user: AuthUser): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      id: user.id,
      coupleId: user.coupleId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 * 30,
    })
  ).toString("base64url");
  const sig = signPayload(header, payload);
  return `${header}.${payload}.${sig}`;
}

function parseToken(token: string): AuthUser {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Malformed token — expected 3 parts");

  const [header, payload, sig] = parts;

  if (!verifySignature(header, payload, sig)) {
    throw new Error("Token signature invalid");
  }

  let decoded: Record<string, unknown>;
  try {
    decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    throw new Error("Token payload is not valid JSON");
  }

  if (typeof decoded.id !== "string") throw new Error("Token missing user id");

  if (typeof decoded.exp === "number" && Date.now() / 1000 > decoded.exp) {
    throw new Error("Token expired");
  }

  return {
    id: decoded.id,
    coupleId: typeof decoded.coupleId === "string" ? decoded.coupleId : undefined,
  };
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: "Unauthorized — missing Bearer token" });
    return;
  }

  try {
    req.user = parseToken(token);
    next();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid token";
    res.status(401).json({ error: `Unauthorized — ${message}` });
  }
}

export function requireAuthOptional(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (token) {
    try {
      req.user = parseToken(token);
    } catch {
      // Optional auth — silently ignore invalid tokens
    }
  }
  next();
}
