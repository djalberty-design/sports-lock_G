/**
 * Displayed chance. Ranking still uses raw fair / combinedFair.
 *
 * Juice shrink toward the book is not calibration. Tails get a reliability
 * map: ledger buckets when we have enough settled tickets, otherwise a
 * published-style tail prior (extreme %s hit more often than raw models say).
 */
export type ReliabilityBucket = {
  lo: number;
  hi: number;
  n: number;
  meanP: number;
  hitRate: number;
};

export const FORECAST_BANDS: Array<[number, number]> = [
  [0.01, 0.15],
  [0.15, 0.25],
  [0.25, 0.35],
  [0.35, 0.45],
  [0.45, 0.55],
  [0.55, 0.65],
  [0.65, 0.75],
  [0.75, 0.85],
  [0.85, 0.99],
];

const MIN_BUCKET = 8;
const PRIOR_STRENGTH = 12;

let activeTable: ReliabilityBucket[] = [];

export function setReliabilityTable(table: ReliabilityBucket[]): void {
  activeTable = Array.isArray(table) ? table : [];
}

export function getReliabilityTable(): ReliabilityBucket[] {
  return activeTable;
}

export function reliabilityTable(forecasts: { p: number; hit: boolean }[]): ReliabilityBucket[] {
  return FORECAST_BANDS.map(([lo, hi]) => {
    const rows = forecasts.filter((f) => Number.isFinite(f.p) && f.p >= lo && f.p < hi);
    const n = rows.length;
    const meanP = n ? rows.reduce((s, r) => s + r.p, 0) / n : (lo + hi) / 2;
    const hitRate = n ? rows.filter((r) => r.hit).length / n : meanP;
    return { lo, hi, n, meanP, hitRate };
  });
}

/** Mid stays put. Far tails walk toward the middle — 6% is not 6%. */
export function tailPrior(p: number): number {
  const x = Math.min(0.99, Math.max(0.01, p));
  if (x < 0.15) return x + (0.15 - x) * 0.45;
  if (x > 0.85) return x - (x - 0.85) * 0.45;
  return x;
}

export function reliabilityMap(p: number, table: ReliabilityBucket[] = activeTable): number {
  const x = Math.min(0.99, Math.max(0.01, p));
  const prior = tailPrior(x);
  const bucket = table.find((b) => x >= b.lo && x < b.hi) ?? table.find((b) => x >= b.lo && x <= b.hi);
  if (!bucket || bucket.n < MIN_BUCKET) return prior;
  const w = bucket.n / (bucket.n + PRIOR_STRENGTH);
  return Math.min(0.99, Math.max(0.01, (1 - w) * prior + w * bucket.hitRate));
}

export function calibratedChance(
  fair: number,
  implied: number | undefined,
  quality: number,
  table: ReliabilityBucket[] = activeTable,
): number {
  if (!Number.isFinite(fair)) return 0.5;
  const q = Math.max(0.28, Math.min(1, quality));
  const mapped = reliabilityMap(fair, table);
  const shown = 0.5 + (mapped - 0.5) * (0.55 + 0.45 * q);
  void implied;
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
