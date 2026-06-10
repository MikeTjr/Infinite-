import { Router } from "express";
import OpenAI from "openai";
import { z } from "zod";
import { blendRateLimiter } from "../middlewares/rateLimit";
import { validateImagePayload } from "../middlewares/security";

const router = Router();

// Lazy-initialize so the server starts even without the key configured.
// Requests will fail gracefully if the key is absent.
function getOpenAI(): OpenAI {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not configured on this server.");
  return new OpenAI({ apiKey: key });
}

const BlendBody = z.object({
  photo1: z.string().min(1),
  photo2: z.string().min(1),
  style: z.enum(["cartoon", "watercolor", "anime", "painterly"]).optional().default("cartoon"),
});

const styleDescriptions: Record<string, string> = {
  cartoon: "a vibrant cartoon illustration style, bold outlines, bright colors, expressive and playful",
  watercolor: "a soft watercolor painting style, translucent washes of color, gentle edges, romantic and dreamy",
  anime: "a detailed anime illustration style, large expressive eyes, dynamic shading, clean lines",
  painterly: "an impressionist oil painting style, visible brushstrokes, rich saturated colors, artistic and timeless",
};

router.post("/blend", blendRateLimiter, async (req, res) => {
  const parsed = BlendBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { photo1, photo2, style } = parsed.data;

  const validation = validateImagePayload([photo1, photo2]);
  if (!validation.valid) {
    res.status(413).json({ error: validation.error });
    return;
  }

  try {
    // Step 1: Use GPT-4o Vision to describe both people's appearance.
    // This replaces the slow gpt-image-1 multi-image edit approach.
    const openai = getOpenAI();
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert portrait artist. Describe the two people in these photos in precise visual terms for creating a stylized couple portrait. Include: facial structure, skin tone, hair color and style, eye color, notable features, and general expression. Be concise but vivid. Format as: "Person 1: [description]. Person 2: [description]."`,
            },
            {
              type: "image_url",
              image_url: { url: photo1, detail: "low" },
            },
            {
              type: "image_url",
              image_url: { url: photo2, detail: "low" },
            },
          ],
        },
      ],
      max_tokens: 400,
    });

    const description = visionResponse.choices[0]?.message?.content ?? "";

    if (!description) {
      res.status(500).json({ error: "Could not analyze the provided photos. Please try with clearer images." });
      return;
    }

    // Step 2: Generate the blended couple portrait with DALL-E 3.
    // DALL-E 3 is significantly faster than gpt-image-1 with multi-image edit.
    const styleDesc = styleDescriptions[style] ?? styleDescriptions.cartoon;

    const imagePrompt = `Create a beautiful symbolic couple portrait in ${styleDesc}. 

${description}

Compose a single unified artistic image that lovingly represents both individuals together — their features blended harmoniously, facing each other or side by side in a romantic pose. The image should feel celebratory and intimate, symbolizing two souls united. Use rich, warm colors appropriate to the ${style} art style. Square format, centered composition, no text or labels.`;

    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      size: "1024x1024",
      quality: "standard",
      response_format: "url",
    });

    const imageUrl = imageResponse.data?.[0]?.url;
    if (!imageUrl) {
      res.status(500).json({ error: "No image returned from AI" });
      return;
    }

    const messages = [
      "Two hearts, one beautiful soul.",
      "Where two lives intertwine, something eternal begins.",
      "The portrait of a love story written in light.",
      "Two become one — and the world becomes richer for it.",
      "Love made visible.",
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];

    res.json({ imageUrl, message });
  } catch (err: unknown) {
    console.error("Blend error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: `Failed to generate blended avatar: ${message}` });
  }
});

export default router;
