const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export function validateImagePayload(images: string[]): { valid: boolean; error?: string } {
  for (const image of images) {
    if (!image.startsWith("data:image/")) {
      return { valid: false, error: "Images must be base64 data URIs (data:image/...)" };
    }
    const base64 = image.replace(/^data:image\/\w+;base64,/, "");
    const byteSize = Math.ceil((base64.length * 3) / 4);
    if (byteSize > MAX_IMAGE_SIZE_BYTES) {
      return { valid: false, error: `Image too large. Max size is ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024}MB per image.` };
    }
  }
  return { valid: true };
}
