/** Browser-only Tesseract. Dynamic import so the desk does not load it until a photo is taken. */
import { parseSlipText, type SlipOcrResult } from "./slip-ocr.ts";

export async function readSlipOnDevice(image: Blob | string): Promise<SlipOcrResult> {
  const { recognize } = await import("tesseract.js");
  const result = await recognize(image, "eng", {
    logger: () => undefined,
  });
  return parseSlipText(result.data.text ?? "");
}
