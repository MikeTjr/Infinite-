import { Request, Response, NextFunction } from "express";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export function corsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const origin = req.headers.origin;

  if (process.env.NODE_ENV === "development" || !origin) {
    res.setHeader("Access-Control-Allow-Origin", origin ?? "*");
  } else if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  next();
}

export function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: blob:; script-src 'self'; style-src 'self' 'unsafe-inline'"
  );
  next();
}

export function validateImagePayload(
  photos: string[]
): { valid: true } | { valid: false; error: string } {
  for (const photo of photos) {
    if (!photo.startsWith("data:image/")) {
      return { valid: false, error: "Invalid image format — must be a data URL" };
    }
    const mimeMatch = photo.match(/^data:(image\/\w+);base64,/);
    if (!mimeMatch) {
      return { valid: false, error: "Missing or malformed image MIME type" };
    }
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(mimeMatch[1])) {
      return { valid: false, error: `Unsupported image type: ${mimeMatch[1]}` };
    }
    const base64Size = Math.ceil((photo.length * 3) / 4);
    if (base64Size > MAX_IMAGE_BYTES) {
      return { valid: false, error: "Image too large — maximum 4 MB per photo" };
    }
  }
  return { valid: true };
}
