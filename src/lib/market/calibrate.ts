/**
 * Displayed chance. Ranking still uses raw fair / combinedFair.
 * Pull the public integer toward the juice on noisy markets.
 * No book posted ↔ do not invent a 50/50 and shrink toward it.
 */
export function calibratedChance(fair: number, implied: number | undefined, quality: number): number {
  if (!Number.isFinite(fair)) return 0.5;
  const q = Math.max(0.28, Math.min(1, quality));
  let shown: number;
  if (implied != null && Number.isFinite(implied) && implied > 0.02 && implied < 0.98) {
    shown = implied + (fair - implied) * (0.35 + 0.65 * q);
  } else {
    shown = fair;
  }
  return Math.min(0.99, Math.max(0.01, shown));
}

/** Same floors fromParlay uses: 4-leg 0.40, 3-leg 0.55, SGP 0.62, 2-leg 0.70. */
export function parlayInfoQuality(n: number, sameGame: boolean): number {
  if (n >= 4) return 0.4;
  if (n === 3) return 0.55;
  if (sameGame) return 0.62;
  return 0.7;
}

/** Public combined % — calibratedChance on combinedFair. Never print combinedFair raw. */
export function shownCombinedChance(
  combinedFair: number,
  decimalPayout: number,
  n: number,
  sameGame: boolean,
): number {
  const quality = parlayInfoQuality(n, sameGame);
  const implied = decimalPayout > 1 ? 1 / decimalPayout : undefined;
  return calibratedChance(combinedFair, implied, quality);
}
