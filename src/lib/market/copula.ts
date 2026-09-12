/**
 * Same-game joint chance. Fréchet bounds + a signed correlation.
 * Cross-game legs stay a clean product. Sim joint-path still wins when it Ran.
 */

export function frechetBounds(pA: number, pB: number): { lo: number; hi: number; indep: number } {
  const a = clip01(pA);
  const b = clip01(pB);
  return {
    lo: Math.max(0, a + b - 1),
    hi: Math.min(a, b),
    indep: a * b,
  };
}

export function frechetJoint(pA: number, pB: number, rho: number): number {
  const { lo, hi, indep } = frechetBounds(pA, pB);
  const r = Math.max(-1, Math.min(1, rho));
  if (r >= 0) return Math.min(hi, indep + r * (hi - indep));
  return Math.max(lo, indep + r * (indep - lo));
}

export function jointFromLegs(
  probs: number[],
  rho: number,
): number {
  if (probs.length === 0) return 0;
  if (probs.length === 1) return clip01(probs[0]!);
  let p = clip01(probs[0]!);
  for (let i = 1; i < probs.length; i++) p = frechetJoint(p, probs[i]!, rho);
  return p;
}

/** Same-game correlation. Positive = they move together. */
export function sameGameRho(legs: { marketType: string; side: string }[]): number {
  if (legs.length < 2) return 0;
  const types = new Set(legs.map((l) => l.marketType));
  const sides = new Set(legs.map((l) => l.side));
  const mlSpread = types.has("ml") && types.has("spread");
  if (mlSpread && sides.size === 1) return 0.42;
  if (mlSpread && sides.size > 1) return -0.28;
  if (types.has("total") && (types.has("ml") || types.has("spread"))) {
    const tot = legs.find((l) => l.marketType === "total");
    if (tot?.side === "under") return -0.22;
    return 0.18;
  }
  if (types.has("prop")) {
    const overs = legs.filter((l) => /over/i.test(l.side)).length;
    if (overs === legs.length) return 0.32;
    if (overs === 0) return 0.28;
    return -0.3;
  }
  return 0.28;
}

/** Fractional Kelly growth. b = net decimal payout (decimal − 1). */
export function growthScore(pJoint: number, decimalPayout: number, infoQuality: number, kellyMultiplier = 1): number {
  const p = clip01(pJoint);
  const b = Math.max(0.01, decimalPayout - 1);
  const kelly = Math.max(0, (p * b - (1 - p)) / b);
  const q = Number.isFinite(infoQuality) ? Math.max(0, Math.min(1, infoQuality)) : 0.5;
  const frac = Number.isFinite(kellyMultiplier) ? Math.max(0, Math.min(2, kellyMultiplier)) : 1;
  return q * kelly * frac;
}

function clip01(p: number): number {
  if (!Number.isFinite(p)) return 0.5;
  return Math.min(0.985, Math.max(0.015, p));
}
