/**
 * Preview embedder origin detection — determines whether the app is running
 * inside a trusted preview frame (local dev server or Vercel preview).
 * Formerly grok.com-specific; now checks localhost and Vercel preview origins only.
 */
export function isGrokEmbedderOrigin(origin: string): boolean {
  // Legacy name kept for call-site compatibility.
  return isPreviewEmbedderOrigin(origin);
}

export function isPreviewEmbedderOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    const host = url.hostname.toLowerCase();
    // Localhost dev server
    if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
    // Vercel preview deployments
    if (host.endsWith(".vercel.app")) return true;
    return false;
  } catch {
    return false;
  }
}

export function isSandboxPreviewGuestHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host.endsWith(".vercel.app") || host === "sportslock.app";
}

function isRemintPreviewPair(guestHost: string, parentHost: string): boolean {
  const guest = guestHost.toLowerCase();
  const parent = parentHost.toLowerCase();
  const sep = ".preview.";
  const i = guest.indexOf(sep);
  if (i <= 0) return false;
  const label = guest.slice(0, i);
  const rest = guest.slice(i + sep.length);
  if (label.includes(".") || !rest.includes(".")) return false;
  return parent === rest;
}

export function resolveParentEmbedderOrigin(
  parentIsSelf: boolean,
  referrer: string,
  ancestorOrigin?: string | null,
  guestHostname: string = "",
): string | null {
  if (parentIsSelf) return null;
  for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) {
    try {
      const url = new URL(
        candidate.includes("://") ? candidate : `https://${candidate}`,
      );
      if (url.protocol !== "https:" && url.protocol !== "http:") continue;
      if (isPreviewEmbedderOrigin(url.origin)) return url.origin;
      if (
        isSandboxPreviewGuestHost(guestHostname) ||
        isRemintPreviewPair(guestHostname, url.hostname)
      ) {
        return url.origin;
      }
    } catch {
      // try next candidate
    }
  }
  return null;
}
