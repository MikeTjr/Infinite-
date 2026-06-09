import { Router } from "express";
import OpenAI from "openai";
import { BlendPhotosBody } from "@workspace/api-zod";
import { blendRateLimiter } from "../middlewares/rateLimit";
import { validateImagePayload } from "../middlewares/security";

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/blend", blendRateLimiter, async (req, res) => {
  const parsed = BlendPhotosBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { photo1, photo2, style = "cartoon" } = parsed.data;

  const validation = validateImagePayload([photo1, photo2]);
  if (!validation.valid) {
    res.status(413).json({ error: validation.error });
    return;
  }

  const styleDescriptions: Record<string, string> = {
    cartoon: "a vibrant cartoon illustration style, bold outlines, bright colors, expressive and playful",
    watercolor: "a soft watercolor painting style, translucent washes of color, gentle edges, romantic and dreamy",
    anime: "a detailed anime illustration style, large expressive eyes, dynamic shading, clean lines",
    painterly: "an impressionist oil painting style, visible brushstrokes, rich saturated colors, artistic and timeless",
  };

  const styleDesc = styleDescriptions[style] ?? styleDescriptions.cartoon;

  try {
    const base64ToBuffer = (dataUrl: string): Buffer => {
      const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
      return Buffer.from(base64, "base64");
    };

    const toFile = async (dataUrl: string, name: string) => {
      const buf = base64ToBuffer(dataUrl);
      const mimeMatch = dataUrl.match(/^data:(image\/\w+);base64,/);
      const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
      return new File([buf], name, { type: mime });
    };

    const file1 = await toFile(photo1, "person1.jpg");
    const file2 = await toFile(photo2, "person2.jpg");

    const prompt = `Create a unified portrait of two people becoming one, depicted in ${styleDesc}. 
Blend the facial features, skin tones, and expressions of both people harmoniously into a single symbolic portrait that represents their union. 
The result should feel like a beautiful, celebratory artwork symbolizing two souls becoming one — romantic, warm, and full of love. 
Use rich colors appropriate to the ${style} style. The image should be square format, centered composition.`;

    const response = await openai.images.edit({
      model: "gpt-image-1",
      image: [file1, file2],
      prompt,
      size: "1024x1024",
    });

    const imageData = response.data?.[0];
    if (!imageData) {
      res.status(500).json({ error: "No image returned from AI" });
      return;
    }

    let imageUrl: string;
    if (imageData.b64_json) {
      imageUrl = `data:image/png;base64,${imageData.b64_json}`;
    } else if (imageData.url) {
      imageUrl = imageData.url;
    } else {
      res.status(500).json({ error: "Unexpected image format from AI" });
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
