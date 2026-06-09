import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  [key: string]: { count: number; resetAt: number };
}

const store: RateLimitStore = {};

function createRateLimiter(options: {
  windowMs: number;
  max: number;
  message?: string;
}) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip ?? "unknown";
    const now = Date.now();
    const entry = store[key];

    if (!entry || now > entry.resetAt) {
      store[key] = { count: 1, resetAt: now + options.windowMs };
      next();
      return;
    }

    if (entry.count >= options.max) {
      res.status(429).json({
        error: options.message ?? "Too many requests — please slow down.",
      });
      return;
    }

    entry.count++;
    next();
  };
}

export const blendRateLimiter = createRateLimiter({
  windowMs: 60_000,
  max: 3,
  message: "Too many blend requests — try again in a minute.",
});

export const apiRateLimiter = createRateLimiter({
  windowMs: 60_000,
  max: 120,
  message: "Too many requests — slow down.",
});

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60_000,
  max: 20,
  message: "Too many authentication attempts.",
});
