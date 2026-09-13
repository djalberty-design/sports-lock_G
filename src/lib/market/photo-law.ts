/**
 * Photo law (v7 §7).
 * Camera + library. Downscale before OCR. Compare board vs Hard Rock photo.
 * Locking the live number is not placing a bet.
 */
import { evPct } from "./engine.ts";
import { isCollegePlayerBet, isFloridaBlocked } from "./florida.ts";

export type PhotoVerdict = "Smart Value" | "Fair Price" | "Overpriced (Avoid)";

export function photoVerdict(chance?: number, livePrice?: number): PhotoVerdict | null {
  if (chance == null || !Number.isFinite(chance) || livePrice == null || !Number.isFinite(livePrice)) return null;
  const edge = evPct(livePrice, chance);
  if (!Number.isFinite(edge)) return null;
  if (edge > 0.01) return "Smart Value";
  if (edge >= -0.03) return "Fair Price";
  return "Overpriced (Avoid)";
}

export function photoBlockedReason(
  items: Array<{
    sport?: string;
    isProp?: boolean;
    marketType?: string;
    player?: string;
    selection?: string;
    venueNote?: string;
  }>,
): string | null {
  for (const t of items) {
    if (isFloridaBlocked(t) || isCollegePlayerBet(t)) {
      return "College player bets are not a Florida Hard Rock ticket. Player stats still move the game line. This photo will not lock.";
    }
  }
  return null;
}
