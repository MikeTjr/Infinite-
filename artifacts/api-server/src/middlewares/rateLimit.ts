import { Request, Response, NextFunction } from "express";

const requestCounts = new Map<string, { count: number; resetAt: number }>();

function createRateLimiter(windowMs: number, max: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ??
      req.ip ??
      "unknown";
    const now = Date.now();
    const entry = requestCounts.get(ip);

    if (!entry || now > entry.resetAt) {
      requestCounts.set(ip, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (entry.count >= max) {
      res.status(429).json({ error: "Too many requests — please wait before trying again." });
      return;
    }

    entry.count += 1;
    next();
  };
}

export const blendRateLimiter = createRateLimiter(60 * 1000, 10);
export const apiRateLimiter = createRateLimiter(60 * 1000, 120);
export const defaultRateLimiter = createRateLimiter(60 * 1000, 60);
