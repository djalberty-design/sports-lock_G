/** Server-only vision key. Bracket access so Vite cannot inline `undefined` at build. */

const KEY_NAMES = ["XAI_API_KEY", "GROK_API_KEY", "XAI_KEY"] as const;

export function resolveVisionKey(env: NodeJS.ProcessEnv = process.env): string | undefined {
  for (const name of KEY_NAMES) {
    const raw = env[name];
    const value = typeof raw === "string" ? raw.trim() : "";
    if (value) return value;
  }
  return undefined;
}

export const VISION_UNAVAILABLE =
  "Vision parse is unavailable. On Vercel open Settings → Environment Variables and add XAI_API_KEY for Production + Preview, then Redeploy. Until that key is live, type the slip by hand and lock it.";

export const VISION_MODELS = ["grok-4.5", "grok-4", "grok-2-vision-1212"] as const;
