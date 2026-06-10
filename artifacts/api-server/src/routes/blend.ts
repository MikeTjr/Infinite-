import { Router } from "express";
import { z } from "zod/v4";
import { blendRateLimiter } from "../middlewares/rateLimit";

const router = Router();

const stylePrompts: Record<string, string> = {
  cartoon: "vibrant cartoon illustration style, bold outlines, bright cel-shaded colors, expressive and playful, couple portrait art",
  watercolor: "soft watercolor painting style, translucent washes of color, gentle edges, romantic and dreamy, couple portrait art",
  anime: "detailed anime illustration style, large expressive eyes, dynamic cel shading, clean linework, couple portrait art",
  painterly: "impressionist oil painting style, visible brushstrokes, rich saturated colors, artistic and timeless, couple portrait art",
};

const styleMessages: Record<string, string> = {
  cartoon: "Two hearts rendered in color and light.",
  watercolor: "Love, painted in watercolor.",
  anime: "Your story, drawn in lines and feeling.",
  painterly: "A portrait built to last.",
};

const BlendBody = z.object({
  coupleName: z.string().min(1).max(80),
  style: z.enum(["cartoon", "watercolor", "anime", "painterly"]).default("cartoon"),
  description: z.string().max(200).optional(),
});

router.post("/blend", blendRateLimiter, (req, res) => {
  const parsed = BlendBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { coupleName, style, description } = parsed.data;
  const styleDesc = stylePrompts[style] ?? stylePrompts.cartoon;

  const basePrompt = description
    ? `${styleDesc}, romantic couple portrait of ${coupleName}, ${description}, two people in love, warm intimate atmosphere, beautiful artistic composition, no text`
    : `${styleDesc}, romantic couple portrait of ${coupleName}, two people deeply in love, warm intimate atmosphere, glowing, beautiful artistic composition, no text`;

  const encodedPrompt = encodeURIComponent(basePrompt);
  const seed = Math.floor(Math.random() * 999999);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&model=flux&nologo=true&seed=${seed}`;

  const message = styleMessages[style] ?? "Two become one.";

  res.json({ imageUrl, message, style });
});

export default router;
