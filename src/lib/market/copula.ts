/**
 * Same-game joint chance using Clayton Archimedean Copula for tail dependence.
 * Cross-game legs stay a clean product.
 */

export function claytonJoint(pA: number, pB: number, theta: number): number {
  const a = clip01(pA);
  const b = clip01(pB);
  if (Math.abs(theta) < 0.01) return a * b; // Independence
  
  if (theta > 0) {
    const sum = Math.pow(a, -theta) + Math.pow(b, -theta) - 1;
    return Math.pow(Math.max(0, sum), -1 / theta);
  } else {
    // Survival copula approach for negative dependence
    const t = -theta;
    const ua = 1 - a;
    const ub = 1 - b;
    const sum = Math.pow(ua, -t) + Math.pow(ub, -t) - 1;
    const surv = Math.pow(Math.max(0, sum), -1 / t);
    return a + b - 1 + surv;
  }
}

export function jointFromLegs(
  probs: number[],
  rho: number,
): number {
  if (probs.length === 0) return 0;
  if (probs.length === 1) return clip01(probs[0]!);
  
  // Map linear correlation rho [-1, 1] to Clayton theta
  const theta = rho >= 0 ? (2 * rho) / (1 - rho + 0.01) : rho * 2;
  
  let p = clip01(probs[0]!);
  for (let i = 1; i < probs.length; i++) {
    p = claytonJoint(p, probs[i]!, theta);
  }
  return p;
}

export function sameGameRho(legs: { marketType: string; side: string }[]): number {
  if (legs.length < 2) return 0;
  const types = new Set(legs.map((l) => l.marketType));
  const sides = new Set(legs.map((l) => l.side));
  const mlSpread = types.has("ml") && types.has("spread");
  
  if (mlSpread && sides.size === 1) return 0.65; 
  if (mlSpread && sides.size > 1) return -0.45;
  
  if (types.has("total") && (types.has("ml") || types.has("spread"))) {
    const tot = legs.find((l) => l.marketType === "total");
    if (tot?.side === "under") return -0.35;
    return 0.25;
  }
  
  if (types.has("prop")) {
    const overs = legs.filter((l) => /over/i.test(l.side)).length;
    if (overs === legs.length) return 0.55; // High tail dependence for correlated overs
    if (overs === 0) return 0.45;
    return -0.40;
  }
  return 0.35;
}

/** 
 * Simultaneous Fractional Kelly growth. 
 * Calculates optimal bankroll fraction accounting for multi-leg covariance.
 */
export function growthScore(pJoint: number, decimalPayout: number, infoQuality: number, kellyMultiplier = 1): number {
  const p = clip01(pJoint);
  const b = Math.max(0.01, decimalPayout - 1);
  const q = Number.isFinite(infoQuality) ? Math.max(0, Math.min(1, infoQuality)) : 0.5;
  
  // Standard Kelly
  let kelly = Math.max(0, (p * b - (1 - p)) / b);
  
  // Simultaneous variance dampening (approximation for overlapping slate exposure)
  const covariancePenalty = 1 + (0.15 * q);
  kelly = kelly / covariancePenalty;

  const frac = Number.isFinite(kellyMultiplier) ? Math.max(0, Math.min(2, kellyMultiplier)) : 1;
  return q * kelly * frac;
}

function clip01(p: number): number {
  if (!Number.isFinite(p)) return 0.5;
  return Math.min(0.985, Math.max(0.015, p));
}
