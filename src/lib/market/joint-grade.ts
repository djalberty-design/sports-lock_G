/**
 * Same-game P(all) from Clayton on G / fair. Cross-game stays a product.
 * Haircut only when a leg has no usable probability (G did not run).
 */
import { jointFromLegs, sameGameRho } from "./copula.ts";
import { sgpHaircut } from "./parlays.ts";
import type { ParlayCorrelation } from "./types.ts";

export type JointLeg = {
  eventId: string;
  marketType: string;
  side: string;
  fairProb?: number;
  simFair?: number;
  price?: number;
  isProp?: boolean;
};

function product(xs: number[]): number {
  return xs.reduce((a, b) => a * b, 1);
}

function americanToImplied(odds: number): number {
  if (!Number.isFinite(odds) || odds === 0) return NaN;
  if (odds >= 0) return 100 / (odds + 100);
  const a = Math.abs(odds);
  return a / (a + 100);
}

function legProb(l: JointLeg): number | undefined {
  if (l.simFair != null && Number.isFinite(l.simFair) && l.simFair > 0 && l.simFair < 1) return l.simFair;
  if (l.fairProb != null && Number.isFinite(l.fairProb) && l.fairProb > 0 && l.fairProb < 1) return l.fairProb;
  if (l.price != null && Number.isFinite(l.price) && l.price !== 0) {
    const implied = americanToImplied(l.price);
    if (Number.isFinite(implied) && implied > 0.02 && implied < 0.98) return implied;
  }
  return undefined;
}

export function combineParlayFair(legs: JointLeg[]): {
  combinedFair: number;
  correlation: ParlayCorrelation;
  sameGame: boolean;
} {
  if (!legs.length) return { combinedFair: 0.5, correlation: "near-independent", sameGame: false };
  const sameGame = new Set(legs.map((l) => l.eventId)).size < legs.length;
  const probs = legs.map(legProb);
  const complete = probs.every((p) => p != null);
  if (!sameGame) {
    const raw = product(probs.map((p) => p ?? 0.5));
    return { combinedFair: Math.min(0.97, raw), correlation: "near-independent", sameGame: false };
  }
  if (!complete) {
    const mlAndSpread = legs.some((l) => l.marketType === "ml") && legs.some((l) => l.marketType === "spread");
    const raw = product(probs.map((p) => p ?? 0.5));
    return {
      combinedFair: Math.min(0.97, raw * sgpHaircut(legs.length, mlAndSpread)),
      correlation: "fallback-haircut",
      sameGame: true,
    };
  }
  const joint = jointFromLegs(probs as number[], sameGameRho(legs));
  return { combinedFair: Math.min(0.97, joint), correlation: "shared-latent", sameGame: true };
}
