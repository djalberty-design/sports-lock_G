import { DEFAULTS } from "./universe.ts";

export type PathPoint = { units: number; evNeg4: number; ev0: number; evPos2: number };

export function bankrollAfterUnits(start: number, unitPct: number, evPerUnit: number, units: number): number {
  const g = 1 + unitPct * evPerUnit;
  if (g <= 0) return 0;
  return start * Math.pow(g, units);
}

export function pathTable(start: number, unitPct: number): PathPoint[] {
  return [100, 500].map((units) => ({
    units,
    evNeg4: bankrollAfterUnits(start, unitPct, -0.04, units),
    ev0: bankrollAfterUnits(start, unitPct, 0, units),
    evPos2: bankrollAfterUnits(start, unitPct, 0.02, units),
  }));
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Even-money model of a bet cycle with expected value `ev`.
 * p(win) = (1 + ev) / 2 so E[Δ] / bet = ev.
 */
export function drawdownOdds(opts: {
  start: number;
  unitPct: number;
  ev: number;
  steps: number;
  drawdown: number;
  paths?: number;
  seed?: number;
}): number {
  const paths = opts.paths ?? 5_000;
  const rng = mulberry32(opts.seed ?? 20260906);
  const pWin = (1 + opts.ev) / 2;
  let hits = 0;
  for (let i = 0; i < paths; i++) {
    let b = opts.start;
    const floor = opts.start * (1 - opts.drawdown);
    let ruined = false;
    for (let s = 0; s < opts.steps; s++) {
      const stake = b * opts.unitPct;
      if (stake < DEFAULTS.dustUsd) break;
      const win = rng() < pWin;
      b += win ? stake : -stake;
      if (b <= floor) {
        ruined = true;
        break;
      }
    }
    if (ruined) hits += 1;
  }
  return hits / paths;
}

export function requiredHitRate(opts: {
  start: number;
  goal: number;
  ticketsPerYear: number;
  payoutDecimal: number;
}): number {
  if (opts.start <= 0 || opts.goal <= opts.start || opts.ticketsPerYear <= 0) return 1;
  const n = opts.ticketsPerYear;
  const dec = opts.payoutDecimal;
  const unitPct = DEFAULTS.unitPct;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 40; i++) {
    const q = (lo + hi) / 2;
    const ev = q * (dec - 1) - (1 - q);
    const end = opts.start * Math.pow(1 + unitPct * ev, n);
    if (end >= opts.goal) hi = q;
    else lo = q;
  }
  return hi;
}

export function lotteryCopy(start: number, goal: number): {
  toGoal: number;
  toMillion: number;
  tickets: number;
  payout: number;
} {
  const tickets = 200;
  const payout = 6;
  return {
    toGoal: requiredHitRate({ start, goal, ticketsPerYear: tickets, payoutDecimal: payout }),
    toMillion: requiredHitRate({ start, goal: 1_000_000, ticketsPerYear: tickets, payoutDecimal: payout }),
    tickets,
    payout,
  };
}

export const PATH_HONESTY =
  "A $200 bankroll betting 3-game parlays is not a path to $1M on a human timetable. Sitting is often the right call. Real long-term growth lives in saving and investing — not here.";
