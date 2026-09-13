import type { ParlayCandidate, ParlayCorrelation, ParlayMix, ScanRow } from "./types.ts";
import { comboHasBlockedLeg } from "./combo-law.ts";

export function filterCatalog(
  items: ParlayCandidate[],
  opts: { legs?: number | "all"; mix?: ParlayMix | "all"; sport?: string },
): ParlayCandidate[] {
  return items.filter((p) => {
    if (comboHasBlockedLeg(p)) return false;
    if (opts.legs && opts.legs !== "all" && p.legs.length !== opts.legs) return false;
    if (opts.mix && opts.mix !== "all" && (p.mix ?? mixOf(p)) !== opts.mix) return false;
    if (opts.sport && opts.sport !== "ALL") {
      const sports = p.sports ?? [...new Set(p.legs.map((l) => l.sport))];
      if (!sports.includes(opts.sport)) return false;
    }
    return true;
  });
}

export function mixOf(p: ParlayCandidate): ParlayMix {
  if (p.sameGame) return "same-game";
  const sports = new Set(p.legs.map((l) => l.sport));
  return sports.size > 1 ? "cross-sport" : "same-sport";
}

export function sgpHaircut(n: number, includesMlAndSpread: boolean): number {
  if (includesMlAndSpread) return n === 2 ? 0.55 : 0.42;
  if (n <= 2) return 0.88;
  if (n === 3) return 0.75;
  if (n === 4) return 0.62;
  if (n <= 8) return 0.5;
  return 0.38;
}

export function typicalParlayJuice(n: number): number {
  if (n >= 5) return 0.4;
  if (n >= 4) return 0.32;
  if (n === 3) return 0.25;
  return 0.12;
}

export function correlationOf(legs: ScanRow[], usedSim: boolean): ParlayCorrelation {
  const games = new Set(legs.map((l) => l.eventId));
  if (games.size < legs.length) return usedSim ? "shared-latent" : "fallback-haircut";
  return "near-independent";
}

export function uniqueSports(rows: ScanRow[]): string[] {
  return [...new Set(rows.map((r) => r.sport))].sort();
}
