/**
 * Combo law (v7 §5).
 *
 * Cross-game: near-independent product.
 * Same-game: joint paths when the sim ran; Fréchet + signed rho otherwise.
 * Gold ribbon: 2- or 3-leg mains only. 4-leg is catalog / fun money.
 * College player legs never load. College game legs can.
 */
import { isCollegePlayerBet, isFloridaBlocked } from "./florida.ts";
import type { ParlayCandidate } from "./types.ts";

export function comboHasBlockedLeg(p: ParlayCandidate): boolean {
  return p.legs.some((l) => isFloridaBlocked(l) || isCollegePlayerBet(l));
}

export function keepLegalCombos(items: ParlayCandidate[]): ParlayCandidate[] {
  return items.filter((p) => !comboHasBlockedLeg(p));
}

export function comboHonesty(p: Pick<ParlayCandidate, "sameGame" | "correlation" | "pricedAsEntertainment">): string {
  if (p.pricedAsEntertainment) return "Fun money — not a plan. The price is a bad deal vs the joint chance.";
  if (p.sameGame && p.correlation === "shared-latent") {
    return "Same game. Chance they all hit comes from joint paths, not multiplying the singles.";
  }
  if (p.sameGame) {
    return "Same game. They move together. Chance uses Fréchet bounds, not the raw product.";
  }
  return "Separate games. Combined chance is the product of each leg, with a tiny shared residual.";
}
