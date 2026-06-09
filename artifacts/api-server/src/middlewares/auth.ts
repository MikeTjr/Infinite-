import { Request, Response, NextFunction } from "express";

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

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "Unauthorized — missing token" });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized — invalid token" });
  }
}

function verifyToken(token: string): AuthUser {
  if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET not configured");
  }
  const [header, payload] = token.split(".");
  if (!header || !payload) throw new Error("Malformed token");

  const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  if (!decoded.id) throw new Error("Token missing user id");
  if (decoded.exp && Date.now() / 1000 > decoded.exp) {
    throw new Error("Token expired");
  }
  return { id: decoded.id, coupleId: decoded.coupleId };
}

export function issueToken(user: AuthUser): string {
  if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET not configured");
  }
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({ ...user, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 86400 * 30 })
  ).toString("base64url");
  return `${header}.${payload}.sig`;
}
