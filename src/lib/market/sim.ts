/**
 * Seeded path engine. Alternate lines, first-event, remaining live, SGP
 * are path statistics. A league-σ Φ cannot emit them from one mean.
 */
import { leagueTotal, marginSigma, totalSigma } from "./chance.ts";
import { Pcg64, deskSeed } from "./seed.ts";
import { DESK_VERSION } from "./rules.ts";

export type GameLatent = {
  eventId: string;
  sport: string;
  muH: number;
  muA: number;
  sigM: number;
  sigT: number;
  pace: number;
  pWinH: number;
  chaos: number;
  poolHome?: number;
  marketHome?: number;
  ran: boolean;
  note: string;
};

export type Path = { h: number; a: number; w: number };

export type SimPrice = {
  p: number;
  n: number;
  se: number;
  ran: boolean;
};

const KEY = [3, -3, 7, -7];

export function drawPaths(g: GameLatent, snapshotId: string, n?: number): Path[] {
  const N = n ?? (g.ran ? 4000 : 800);
  const rng = new Pcg64(deskSeed(DESK_VERSION, snapshotId, g.eventId));
  const muH = g.muH;
  const muA = g.muA;
  const sigH = Math.max(0.4, g.sigT / Math.SQRT2);
  const sigA = sigH;
  const rho = 0.1;
  const football = g.sport === "NFL" || g.sport === "NCAAF";
  const spike = football ? 0.045 : 0;
  const paths: Path[] = [];
  const spikeN = Math.round(N * spike);
  const rest = N - spikeN;
  for (let i = 0; i < rest; i++) {
    const z1 = rng.gauss();
    const z2 = rho * z1 + Math.sqrt(1 - rho * rho) * rng.gauss();
    let h = Math.max(0, muH + sigH * z1);
    let a = Math.max(0, muA + sigA * z2);
    if (g.sport === "MLB" || g.sport === "NHL") {
      h = Math.round(h * 2) / 2;
      a = Math.round(a * 2) / 2;
    }
    paths.push({ h, a, w: 1 });
  }
  if (spikeN > 0) {
    const each = spikeN / KEY.length;
    for (const m of KEY) {
      const k = Math.floor(each);
      for (let i = 0; i < k; i++) {
        const tot = muH + muA + rng.gauss() * (g.sigT * 0.35);
        const h = Math.max(0, (tot + m) / 2);
        const a = Math.max(0, tot - h);
        paths.push({ h, a, w: 1 });
      }
    }
  }
  return paths;
}

export function meanHit(paths: Path[], hit: (p: Path) => boolean): SimPrice {
  let w = 0;
  let yes = 0;
  for (const p of paths) {
    w += p.w;
    if (hit(p)) yes += p.w;
  }
  const p = w > 0 ? yes / w : 0.5;
  return { p, n: paths.length, se: Math.sqrt(p * (1 - p) / Math.max(1, paths.length)), ran: paths.length >= 400 };
}

export function simWin(paths: Path[]): SimPrice {
  return meanHit(paths, (p) => p.h > p.a);
}

export function simCover(paths: Path[], homeLine: number): SimPrice {
  return meanHit(paths, (p) => p.h - p.a + homeLine > 0);
}

export function simOver(paths: Path[], line: number): SimPrice {
  return meanHit(paths, (p) => p.h + p.a > line);
}

export function simTeamOver(paths: Path[], line: number, home: boolean): SimPrice {
  return meanHit(paths, (p) => (home ? p.h : p.a) > line);
}

export function simPeriodOver(paths: Path[], line: number, share: number, rng: Pcg64): SimPrice {
  return meanHit(paths, (p) => {
    const slice = (p.h + p.a) * share * (0.85 + 0.3 * rng.float());
    return slice > line;
  });
}

export function pathHits(p: Path, leg: { marketType: string; side: string; selection: string; point?: number }): boolean {
  if (leg.marketType === "ml") {
    const homeWins = p.h > p.a;
    if (leg.side === "home") return homeWins;
    if (leg.side === "away") return !homeWins;
    return /home/i.test(leg.selection) ? homeWins : !homeWins;
  }
  if (leg.marketType === "spread") {
    const line = leg.point ?? 0;
    const homeCovers = p.h - p.a + (leg.side === "away" ? -line : line) > 0;
    return leg.side === "away" ? !homeCovers && p.h - p.a + -line !== 0 : homeCovers;
  }
  if (leg.marketType === "total") {
    const over = p.h + p.a > (leg.point ?? 0);
    const isOver = leg.side === "over" || /\bover\b/i.test(leg.selection);
    return isOver ? over : !over;
  }
  return false;
}

export function jointHit(paths: Path[], legs: Array<{ marketType: string; side: string; selection: string; point?: number }>): SimPrice {
  return meanHit(paths, (p) => legs.every((leg) => pathHits(p, leg)));
}

export function blendFair(sim: number | undefined, pool: number | undefined, market: number | undefined): number {
  const s = sim != null && Number.isFinite(sim) ? sim : undefined;
  const p = pool != null && Number.isFinite(pool) ? pool : undefined;
  const m = market != null && Number.isFinite(market) ? market : undefined;
  if (s != null && p != null && m != null) return 0.5 * s + 0.3 * p + 0.2 * m;
  if (s != null && p != null) return 0.55 * s + 0.45 * p;
  if (s != null && m != null) return 0.55 * s + 0.45 * m;
  return s ?? p ?? m ?? 0.5;
}

export function latentFromScores(opts: {
  eventId: string;
  sport: string;
  homeWin: number;
  total: number;
  homeSpread?: number;
  poolHome?: number;
  marketHome?: number;
  chaos?: number;
}): GameLatent {
  const sport = opts.sport;
  const tot = opts.total > 0 ? opts.total : leagueTotal(sport);
  const share = Math.min(0.68, Math.max(0.32, 0.5 + (opts.homeWin - 0.5) * 0.28));
  const muH = tot * share;
  const muA = tot - muH;
  const chaos = opts.chaos ?? Math.max(0, Math.min(0.22, (tot - leagueTotal(sport)) / (leagueTotal(sport) * 4)));
  const scale = Math.min(1.35, Math.max(0.72, 1 + 0.65 * (tot / leagueTotal(sport) - 1)));
  return {
    eventId: opts.eventId,
    sport,
    muH,
    muA,
    sigM: marginSigma(sport) * scale * (1 + chaos),
    sigT: totalSigma(sport) * scale * (1 + chaos),
    pace: tot / Math.max(1, leagueTotal(sport)),
    pWinH: opts.homeWin,
    chaos,
    poolHome: opts.poolHome,
    marketHome: opts.marketHome,
    ran: tot > 0 && opts.homeWin > 0.08 && opts.homeWin < 0.92,
    note: "Latent from posted total + ensemble win chance. Process feeds overwrite when Ran.",
  };
}
