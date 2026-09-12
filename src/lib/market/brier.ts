/** Rolling Brier + layer discount. Local only — does not invent a closing book. */

export function brierScore(forecasts: { p: number; hit: boolean }[]): number | null {
  const xs = forecasts.filter((f) => Number.isFinite(f.p) && f.p > 0 && f.p < 1);
  if (xs.length < 8) return null;
  const s = xs.reduce((sum, f) => sum + (f.p - (f.hit ? 1 : 0)) ** 2, 0);
  return s / xs.length;
}

/** If a layer's hit rate lags its mean forecast by > 8 pts over ≥ 20, haircut precision 10%. */
export function layerPrecisionHaircut(
  layerId: string,
  rows: { layerP: Record<string, number>; hit: boolean }[],
): number {
  const n = rows.filter((r) => r.layerP[layerId] != null);
  if (n.length < 20) return 1;
  const meanP = n.reduce((s, r) => s + r.layerP[layerId]!, 0) / n.length;
  const hitRate = n.filter((r) => r.hit).length / n.length;
  if (meanP - hitRate > 0.08) return 0.9;
  return 1;
}

export function rollingWindow<T>(xs: T[], n = 50): T[] {
  return xs.slice(0, n);
}
