import { americanToImplied } from "./engine.ts";
/** Sportsbook fee, timing radar, early-mover. Ranking callers pass hold/tape — this file only labels. */

export function calculateBookFee(odds1: number, odds2: number): { holdPct: number; verdict: string } {
  const p1 = odds1 < 0 ? Math.abs(odds1) / (Math.abs(odds1) + 100) : 100 / (odds1 + 100);
  const p2 = odds2 < 0 ? Math.abs(odds2) / (Math.abs(odds2) + 100) : 100 / (odds2 + 100);
  const holdPct = (p1 + p2 - 1) * 100;
  return feeFromHold(holdPct);
}

export function feeFromHold(hold: number): { holdPct: number; verdict: string } {
  const holdPct = Number((hold > 1 ? hold : hold * 100).toFixed(1));
  let verdict = "Fair Price";
  if (holdPct > 7) verdict = "High Fee (Hard Rock Monopoly Tax)";
  if (holdPct > 9) verdict = "Overpriced (Avoid)";
  return { holdPct, verdict };
}

export function feeBadge(hold?: number | null): { text: string; tone: "fair" | "high" | "avoid" } | null {
  if (hold == null || !Number.isFinite(hold)) return null;
  const { holdPct, verdict } = feeFromHold(hold);
  if (verdict.startsWith("Overpriced")) return { text: `Fee: ${holdPct}% (High Cut)`, tone: "avoid" };
  if (verdict.startsWith("High")) return { text: `Fee: ${holdPct}% (High Cut)`, tone: "high" };
  return { text: `Fee: ${holdPct}% (Fair)`, tone: "fair" };
}

export type TimingKind = "lock-now" | "wait" | null;

export function timingKind(opts: {
  steam?: boolean;
  tapeLean?: "sharp" | "public" | "neutral" | null;
  favorite?: boolean;
}): TimingKind {
  if (opts.steam || opts.tapeLean === "sharp") return "lock-now";
  if (opts.tapeLean === "public" && opts.favorite) return "wait";
  return null;
}

export const TIMING_COPY: Record<Exclude<TimingKind, null>, { title: string; line: string }> = {
  "lock-now": {
    title: "Lock This Now",
    line: "Smart money is moving this number. Photograph Hard Rock before the key number disappears. Not a guarantee it hits.",
  },
  wait: {
    title: "Wait for Better Price",
    line: "Heavy public betting is inflating the favorite. Waiting can yield a better underdog payout near game time.",
  },
};

/** Kalshi / Polymarket leading Hard Rock by more than 5 pts. Research, never a Florida fill. */
export function earlyMover(desk: number | undefined, predict: number | undefined): boolean {
  if (desk == null || predict == null || !Number.isFinite(desk) || !Number.isFinite(predict)) return false;
  return Math.abs(predict - desk) > 0.05;
}



function fmtAmerican(n: number): string {
  const r = Math.round(n);
  return r > 0 ? `+${r}` : `${r}`;
}

/** Plain-English alert when Hard Rock moved off the delayed board number. */
export function lineShiftAlert(boardPrice: number, livePrice: number, chance?: number): string | null {
  if (!Number.isFinite(boardPrice) || !Number.isFinite(livePrice)) return null;
  if (Math.round(boardPrice) === Math.round(livePrice)) return null;
  const oldImp = americanToImplied(boardPrice);
  const newImp = americanToImplied(livePrice);
  const oldEdge = chance != null && Number.isFinite(chance) ? (chance - oldImp) * 100 : null;
  const newEdge = chance != null && Number.isFinite(chance) ? (chance - newImp) * 100 : null;
  let verdict = "";
  if (newEdge != null) {
    verdict = newEdge > 1 ? " Still Smart Value." : newEdge > 0 ? " Fair Price." : " Overpriced (Avoid).";
  }
  const edgeBit =
    oldEdge != null && newEdge != null
      ? ` Your edge is now ${newEdge >= 0 ? "+" : ""}${newEdge.toFixed(1)}% (was ${oldEdge >= 0 ? "+" : ""}${oldEdge.toFixed(1)}%).${verdict}`
      : "";
  return `Line Shift Detected: Hard Rock is now offering ${fmtAmerican(livePrice)} instead of ${fmtAmerican(boardPrice)}.${edgeBit}`;
}


