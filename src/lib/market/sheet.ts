/**
 * Hard Rock-shaped market sheet.
 *
 * Builds every popular line a Florida book posts on a game — alternate
 * spreads/totals, team totals, period markets, and player props — then prices
 * each cell with the same ensemble used on the moneyline. Numbers are a
 * research look until a Hard Rock screenshot locks the live price.
 */
import {
  homeCoverProb,
  invLogit,
  leagueTotal,
  logit,
  normalCdf,
  overProb,
  poissonOver,
} from "./chance.ts";
import { decimalToAmerican } from "./engine.ts";
import type { EventResearch, ResearchPlayer } from "./research.ts";
import { namesHit } from "./research.ts";
import type { ScanRow } from "./types.ts";
import { last10ExpectedTotal, blendRate } from "./form.ts";
import { isCollegeSport } from "./universe.ts";
import type { TeamLooks } from "./looks.ts";

export type SheetKind = "ml" | "spread-grid" | "total-ladder" | "player-yes" | "player-ou";

export type SheetLine = {
  label: string;
  player?: ResearchPlayer;
  left?: ScanRow;
  right?: ScanRow;
  single?: ScanRow;
  alts?: Array<{ left?: ScanRow; right?: ScanRow }>;
};

export type SheetMarket = {
  id: string;
  title: string;
  kind: SheetKind;
  leftHeader?: string;
  rightHeader?: string;
  preview: number;
  lines: SheetLine[];
};

export type SheetTabs = {
  popular: SheetMarket[];
  props: SheetMarket[];
  innings: SheetMarket[];
  half: SheetMarket[];
  quarters: SheetMarket[];
  halves: SheetMarket[];
  periods: SheetMarket[];
};

export function marketsOnTab(tabs: SheetTabs, tab: string): SheetMarket[] {
  switch (tab) {
    case "popular":
      return tabs.popular;
    case "props":
      return tabs.props;
    case "innings":
      return tabs.innings;
    case "half":
      return tabs.half;
    case "quarters":
      return tabs.quarters;
    case "halves":
      return tabs.halves;
    case "periods":
      return tabs.periods;
    default:
      return [];
  }
}

export function cellsInMarket(market: SheetMarket): ScanRow[] {
  const out: ScanRow[] = [];
  const push = (cell?: ScanRow) => {
    if (cell && Number.isFinite(cell.fairProb)) out.push(cell);
  };
  for (const line of market.lines) {
    push(line.left);
    push(line.right);
    push(line.single);
    if (line.alts) {
      for (const alt of line.alts) {
        push(alt.left);
        push(alt.right);
      }
    }
  }
  return out;
}

type Ctx = {
  sport: string;
  home: string;
  away: string;
  homeNick: string;
  awayNick: string;
  homeWin: number;
  total: number;
  homeSpread: number;
  venue?: string;
  weatherTemp?: number;
  weatherWind?: number;
  weatherPrecip?: number;
  injuries: Array<{ player: string; status: string }>;
  players: ResearchPlayer[];
  template: ScanRow;
  homeEra?: number;
  awayEra?: number;
  formTotal?: number | null;
  homeLooks?: TeamLooks;
  awayLooks?: TeamLooks;
  homePitcherHand?: "L" | "R";
  awayPitcherHand?: "L" | "R";
};

function clip(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function halfLine(mu: number): number {
  return Math.floor(mu) + 0.5;
}

function juicePrice(fair: number, hold = 0.048): number {
  const p = clip(fair, 0.02, 0.98);
  const decJuice = 1 + (1 / p - 1) * (1 - hold);
  return decimalToAmerican(Math.max(1.012, decJuice));
}

/**
 * Counting-stat over: Poisson for rare events, extra-Poisson normal once the
 * mean is large (yards, points). Same logit clip family as the game ensemble.
 */
export function countOver(lambda: number, line: number): number {
  const lam = Math.max(0.02, lambda);
  if (lam >= 8) {
    const sigma = Math.max(0.9, Math.sqrt(lam) * 1.18);
    return invLogit(logit(1 - normalCdf((line - lam) / sigma)), 0.06, 0.94);
  }
  return poissonOver(lam, line);
}

export function altLines(line: number, step: number): number[] {
  const out: number[] = [];
  for (const d of [-2, -1, 1, 2]) {
    const v = Math.round((line + d * step) * 2) / 2;
    if (v >= 0.5 && Math.abs(v - line) > 0.04) out.push(v);
  }
  return out;
}

function makeRow(
  ctx: Ctx,
  patch: {
    marketType: ScanRow["marketType"];
    side: string;
    selection: string;
    fairProb: number;
    point?: number;
    player?: string;
    playerId?: string;
    headshot?: string;
    isProp?: boolean;
  },
): ScanRow {
  const t = ctx.template;
  const fair = clip(patch.fairProb, 0.02, 0.98);
  return {
    eventId: t.eventId,
    sport: t.sport,
    start: t.start,
    home: t.home,
    away: t.away,
    marketType: patch.marketType,
    side: patch.side,
    selection: patch.selection,
    price: juicePrice(fair, patch.isProp ? 0.07 : 0.048),
    fairProb: fair,
    evPct: NaN,
    hold: patch.isProp ? 0.07 : 0.048,
    tag: "close_enough",
    action: "enter_ticket",
    reason: "Research look. Photograph Hard Rock to lock the live number.",
    conviction: "medium",
    spark: "research",
    point: patch.point,
    player: patch.player,
    playerId: patch.playerId,
    headshot: patch.headshot,
    isProp: patch.isProp,
    researchOnly: true,
    homeAbbr: t.homeAbbr,
    awayAbbr: t.awayAbbr,
    homeLogo: t.homeLogo,
    awayLogo: t.awayLogo,
    homeSpread: ctx.homeSpread,
    total: ctx.total,
    venueNote: t.venueNote,
  };
}

function listedOut(name: string, injuries: Ctx["injuries"]): boolean {
  const hit = injuries.find((i) => namesHit(i.player, name));
  if (!hit) return false;
  return /out|injured reserve|\bil\b|10-day|15-day|60-day|inactive|doubtful/i.test(hit.status);
}

function pos(p: ResearchPlayer): string {
  return (p.position || "").toUpperCase();
}

function isPitcher(p: ResearchPlayer): boolean {
  return /^(P|SP|RP|LHP|RHP|TWP|G|GK)$/.test(pos(p)) || /pitcher|goalie/i.test(p.position);
}

function isBatter(p: ResearchPlayer): boolean {
  if (isPitcher(p)) return false;
  return /^(C|1B|2B|3B|SS|LF|CF|RF|OF|DH|IF|UT)$/.test(pos(p)) || !p.position || /base|field|hit|catch/i.test(p.position);
}

function isQB(p: ResearchPlayer): boolean {
  return pos(p) === "QB";
}
function isRB(p: ResearchPlayer): boolean {
  return /^(RB|HB|FB)$/.test(pos(p));
}
function isPassCatcher(p: ResearchPlayer): boolean {
  return /^(WR|TE|RB)$/.test(pos(p));
}
function isSkater(p: ResearchPlayer): boolean {
  return /^(C|LW|RW|D|F)$/.test(pos(p)) || /wing|center|defence|defense|forward/i.test(p.position);
}

const PARK_HITS: Record<string, number> = {
  "coors field": 1.15,
  "great american ball park": 1.08,
  "great american ballpark": 1.08,
  "yankee stadium": 1.05,
  "fenway park": 1.04,
  "citizens bank park": 1.04,
  "globe life field": 1.03,
  "wrigley field": 1.02,
  "truist park": 1.02,
  "petco park": 0.91,
  "oracle park": 0.9,
  "t-mobile park": 0.91,
  "dodger stadium": 0.96,
  "comerica park": 0.95,
  "loandepot park": 0.96,
  "kauffman stadium": 0.96,
};

const PARK_HR: Record<string, number> = {
  "coors field": 1.22,
  "great american ball park": 1.14,
  "great american ballpark": 1.14,
  "yankee stadium": 1.12,
  "citizens bank park": 1.08,
  "fenway park": 0.98,
  "petco park": 0.86,
  "oracle park": 0.82,
  "t-mobile park": 0.88,
  "dodger stadium": 0.94,
  "comerica park": 0.9,
  "kauffman stadium": 0.88,
};

function parkLookup(venue: string | undefined, table: Record<string, number>, fallback = 1): number {
  if (!venue) return fallback;
  const key = venue.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  for (const [name, f] of Object.entries(table)) {
    if (key.includes(name)) return f;
  }
  return fallback;
}

function parkHits(venue?: string): number {
  return parkLookup(venue, PARK_HITS, 1);
}

function parkHr(venue?: string): number {
  return parkLookup(venue, PARK_HR, parkHits(venue));
}

function weatherMul(ctx: Ctx, kind: "hits" | "hr" | "total" | "ks"): number {
  if (ctx.sport === "NBA" || ctx.sport === "NHL" || ctx.sport === "NCAAB") return 1;
  const wind = ctx.weatherWind ?? 0;
  const rain = ctx.weatherPrecip ?? 0;
  const temp = ctx.weatherTemp;
  let m = 1;
  if (ctx.sport === "MLB") {
    if (kind === "hr") {
      if (wind >= 15) m *= 0.94;
      if (temp != null && temp >= 85) m *= 1.05;
      if (temp != null && temp <= 50) m *= 0.96;
    } else if (kind === "ks") {
      if (wind >= 18) m *= 1.03;
      if (rain >= 40) m *= 0.97;
    } else {
      if (wind >= 18) m *= 0.97;
      if (rain >= 40) m *= 0.95;
      if (temp != null && temp >= 85) m *= 1.03;
      if (temp != null && temp <= 50) m *= 0.97;
    }
    return m;
  }
  if (wind >= 18) m *= kind === "total" ? 0.96 : 0.97;
  if (rain >= 50) m *= 0.94;
  if (temp != null && temp <= 32) m *= 0.97;
  return m;
}

function pace(ctx: Ctx): number {
  const avg = leagueTotal(ctx.sport);
  return avg > 0 ? ctx.total / avg : 1;
}

function teamWin(ctx: Ctx, homeAway: "home" | "away"): number {
  return homeAway === "home" ? ctx.homeWin : 1 - ctx.homeWin;
}

function rankBy(list: ResearchPlayer[], n: number, score: (p: ResearchPlayer) => number): ResearchPlayer[] {
  return [...list].sort((a, b) => score(b) - score(a)).slice(0, n);
}

function scorePlayer(p: ResearchPlayer): number {
  const posn = pos(p);
  const everyday = /^(C|1B|2B|3B|SS|LF|CF|RF|DH|QB|RB|WR|TE|LW|RW)$/.test(posn)
    ? 6
    : /^(IF|OF|UT|F|D)$/.test(posn)
      ? 3
      : 0;
  return (
    (p.starter ? 10 : 0) +
    everyday +
    (p.stats.avg ?? 0) * 24 +
    (p.stats.hr ?? 0) / 8 +
    (p.stats.pts ?? 0) / 5 +
    (p.stats.passYds ?? p.stats.yds ?? 0) / 40 +
    (p.stats.sog ?? 0) +
    (Object.keys(p.stats).length ? 2 : 0)
  );
}

function perGame(n: number | undefined, games: number, cap: number, fallback: number): number {
  if (n == null || !Number.isFinite(n) || n <= 0) return fallback;
  return n > cap ? n / games : n;
}

function paFor(p: ResearchPlayer): number {
  return p.starter || /^(C|1B|2B|3B|SS|LF|CF|RF|DH)$/.test(pos(p)) ? 4.15 : 3.4;
}

function vsPitchMul(p: ResearchPlayer, ctx: Ctx): number {
  const era = p.homeAway === "away" ? ctx.homeEra : ctx.awayEra;
  const eraMul = era != null ? clip(era / 4.1, 0.82, 1.18) : 1;
  const oppHand = p.homeAway === "away" ? ctx.homePitcherHand : ctx.awayPitcherHand;
  const ownLooks = p.homeAway === "away" ? ctx.awayLooks : ctx.homeLooks;
  const bag = oppHand === "L" ? ownLooks?.vsLeft : oppHand === "R" ? ownLooks?.vsRight : undefined;
  const platoonMul = bag?.ops != null ? clip(bag.ops / 0.72, 0.86, 1.16) : 1;
  return clip(eraMul * platoonMul, 0.78, 1.22);
}

function mix(base: number, recent?: number): number {
  return blendRate(base, recent) ?? base;
}

function expectedMlbHits(p: ResearchPlayer, ctx: Ctx): number {
  const fromHits = p.stats.hits != null && p.stats.hits > 8 && p.stats.hits < 260 ? p.stats.hits / 145 : null;
  const avg = p.stats.avg ?? (p.stats.obp != null ? clip(p.stats.obp - 0.07, 0.18, 0.36) : p.starter ? 0.27 : 0.235);
  const base = fromHits ?? avg * paFor(p);
  return mix(base, p.recentStats?.hits) * pace(ctx) * parkHits(ctx.venue) * vsPitchMul(p, ctx) * weatherMul(ctx, "hits");
}

function expectedMlbHr(p: ResearchPlayer, ctx: Ctx): number {
  const avg = p.stats.avg ?? (p.starter ? 0.27 : 0.235);
  const slg = p.stats.slg ?? avg + 0.12;
  const iso = Math.max(0.03, slg - avg);
  const fromSeason = p.stats.hr != null && p.stats.hr > 0 && p.stats.hr < 80 ? p.stats.hr / 145 : null;
  const base = fromSeason ?? iso * 0.72;
  const blended = mix(base, p.recentStats?.hr);
  const bump = /DH|1B|OF|LF|RF|3B/.test(pos(p)) ? 1.06 : 0.9;
  const known = fromSeason != null || p.recentStats?.hr != null ? 1 : 0.72;
  return clip(blended * bump * known * pace(ctx) * parkHr(ctx.venue) * vsPitchMul(p, ctx) * weatherMul(ctx, "hr"), 0.03, 0.55);
}

function expectedMlbTb(p: ResearchPlayer, ctx: Ctx): number {
  const slg = p.stats.slg ?? (p.stats.avg ?? 0.25) + 0.14;
  const base = slg * paFor(p);
  return mix(base, p.recentStats?.tb) * pace(ctx) * parkHits(ctx.venue) * vsPitchMul(p, ctx) * weatherMul(ctx, "hits");
}

function expectedMlbRuns(p: ResearchPlayer, ctx: Ctx): number {
  const obp = p.stats.obp ?? (p.stats.avg ?? 0.25) + 0.05;
  const win = teamWin(ctx, p.homeAway);
  const base = clip(obp * paFor(p) * 0.28 * (0.85 + 0.3 * win) * pace(ctx) * parkHits(ctx.venue), 0.15, 1.4);
  return mix(base, p.recentStats?.runs);
}

function expectedMlbRbi(p: ResearchPlayer, ctx: Ctx): number {
  const per =
    p.stats.rbi != null && p.stats.rbi > 0 && p.stats.rbi < 160 ? p.stats.rbi / 140 : expectedMlbHits(p, ctx) * 0.65;
  const bump = p.starter ? 1.08 : 0.9;
  const base = clip(per * bump * pace(ctx) * parkHits(ctx.venue) * vsPitchMul(p, ctx), 0.12, 1.6);
  return mix(base, p.recentStats?.rbi);
}

function expectedMlbHrr(p: ResearchPlayer, ctx: Ctx): number {
  return expectedMlbHits(p, ctx) + expectedMlbRuns(p, ctx) + expectedMlbRbi(p, ctx);
}

function expectedMlbWalks(p: ResearchPlayer, ctx: Ctx): number {
  const obp = p.stats.obp ?? (p.stats.avg ?? 0.25) + 0.05;
  const avg = p.stats.avg ?? 0.25;
  const base = clip((obp - avg) * paFor(p) * pace(ctx), 0.12, 1.2);
  return mix(base, p.recentStats?.bb);
}

function expectedPitcherK(p: ResearchPlayer, ctx: Ctx): number {
  const ip = p.stats.ip ?? 90;
  const k = p.stats.k;
  let k9 = 8.8;
  if (ip > 5 && k != null && k > 0) {
    const raw = (k / ip) * 9;
    if (raw > 3 && raw < 16) k9 = raw;
    else if (k > 3 && k < 16) k9 = k;
  }
  const era = p.stats.era ?? 4.1;
  const expIp = clip(5.8 - (era - 4) * 0.28, 4.0, 6.6);
  const seasonLam = (k9 * expIp) / 9;
  return clip(mix(seasonLam, p.recentStats?.k) * weatherMul(ctx, "ks"), 2.5, 11);
}

function expectedNflPassYds(p: ResearchPlayer, ctx: Ctx): number {
  const base = perGame(p.stats.passYds ?? p.stats.yds, 17, 450, p.starter ? 245 : 180);
  const win = teamWin(ctx, p.homeAway);
  const script = win < 0.45 ? 1.06 : win > 0.65 ? 0.96 : 1;
  return mix(base, p.recentStats?.passYds) * (0.55 + 0.45 * pace(ctx)) * script * weatherMul(ctx, "total");
}
function expectedNflRushYds(p: ResearchPlayer, ctx: Ctx): number {
  const base = perGame(p.stats.rushYds, 17, 180, isRB(p) && p.starter ? 72 : 28);
  const win = teamWin(ctx, p.homeAway);
  const script = win > 0.58 ? 1.08 : win < 0.42 ? 0.9 : 1;
  return mix(base, p.recentStats?.rushYds) * (0.6 + 0.4 * pace(ctx)) * script * weatherMul(ctx, "total");
}
function expectedNflRecYds(p: ResearchPlayer, ctx: Ctx): number {
  const base = perGame(p.stats.recYds, 17, 180, pos(p) === "WR" ? 62 : pos(p) === "TE" ? 42 : 22);
  const win = teamWin(ctx, p.homeAway);
  const script = win < 0.45 ? 1.05 : 1;
  return mix(base, p.recentStats?.recYds) * (0.55 + 0.45 * pace(ctx)) * script * weatherMul(ctx, "total");
}
function expectedAtd(p: ResearchPlayer, ctx: Ctx): number {
  const win = teamWin(ctx, p.homeAway);
  if (isRB(p)) return clip(0.42 * (0.7 + 0.6 * win) * pace(ctx), 0.12, 0.72);
  if (pos(p) === "WR") return clip(0.3 * (0.75 + 0.5 * win) * pace(ctx), 0.1, 0.58);
  if (pos(p) === "TE") return clip(0.22 * (0.75 + 0.5 * win) * pace(ctx), 0.08, 0.48);
  if (isQB(p)) return clip(0.18 * win * pace(ctx), 0.06, 0.4);
  return 0.16;
}

function expectedNba(p: ResearchPlayer, ctx: Ctx, stat: "pts" | "reb" | "ast" | "threes" | "pra"): number {
  const pts = mix(perGame(p.stats.pts, 82, 55, p.starter ? 18 : 9), p.recentStats?.pts);
  const reb = mix(perGame(p.stats.reb, 82, 22, p.starter ? 5.5 : 3), p.recentStats?.reb);
  const ast = mix(perGame(p.stats.ast, 82, 18, p.starter ? 3.8 : 1.6), p.recentStats?.ast);
  if (stat === "pts") return pts * pace(ctx);
  if (stat === "reb") return reb;
  if (stat === "ast") return ast;
  if (stat === "threes") return mix(p.stats.threes ?? clip(pts / 12, 0.6, 4.2), p.recentStats?.threes) * pace(ctx);
  return (pts + reb + ast) * pace(ctx);
}

function expectedNhlShots(p: ResearchPlayer): number {
  return mix(perGame(p.stats.sog, 82, 10, p.starter ? 2.9 : 1.6), p.recentStats?.sog);
}
function expectedNhlGoals(p: ResearchPlayer, ctx: Ctx): number {
  const base = perGame(p.stats.goals, 82, 1.4, p.starter ? 0.38 : 0.16);
  return base * (0.7 + 0.6 * teamWin(ctx, p.homeAway)) * pace(ctx);
}
function expectedSaves(p: ResearchPlayer, ctx: Ctx): number {
  const base = perGame(p.stats.saves, 82, 50, 27.5);
  return base * (2 - pace(ctx));
}

function ouMarket(
  ctx: Ctx,
  title: string,
  id: string,
  players: ResearchPlayer[],
  lineFor: (p: ResearchPlayer) => number,
  expected: (p: ResearchPlayer) => number,
  label: (p: ResearchPlayer, line: number, side: "over" | "under") => string,
  preview: number,
  step = 1,
  rare = false,
): SheetMarket {
  const lines: SheetLine[] = [];
  for (const p of players) {
    if (listedOut(p.name, ctx.injuries)) continue;
    const line = lineFor(p);
    const lam = expected(p);
    const over = rare ? clip(1 - Math.exp(-lam), 0.06, 0.88) : countOver(lam, line);
    const left = makeRow(ctx, {
      marketType: "prop",
      side: "over",
      selection: label(p, line, "over"),
      fairProb: over,
      point: line,
      player: p.name,
      playerId: p.id,
      headshot: p.headshot,
      isProp: true,
    });
    const right = makeRow(ctx, {
      marketType: "prop",
      side: "under",
      selection: label(p, line, "under"),
      fairProb: 1 - over,
      point: line,
      player: p.name,
      playerId: p.id,
      headshot: p.headshot,
      isProp: true,
    });
    const alts = rare
      ? []
      : altLines(line, step).map((altLine) => {
          const altOver = countOver(lam, altLine);
          return {
            left: makeRow(ctx, {
              marketType: "prop",
              side: "over",
              selection: label(p, altLine, "over"),
              fairProb: altOver,
              point: altLine,
              player: p.name,
              playerId: p.id,
              headshot: p.headshot,
              isProp: true,
            }),
            right: makeRow(ctx, {
              marketType: "prop",
              side: "under",
              selection: label(p, altLine, "under"),
              fairProb: 1 - altOver,
              point: altLine,
              player: p.name,
              playerId: p.id,
              headshot: p.headshot,
              isProp: true,
            }),
          };
        });
    lines.push({
      label: p.name,
      player: p,
      left,
      right,
      alts: alts.length ? alts : undefined,
    });
  }
  return { id, title, kind: "player-ou", leftHeader: "Over", rightHeader: "Under", preview, lines };
}

function yesMarket(
  ctx: Ctx,
  title: string,
  id: string,
  players: ResearchPlayer[],
  expected: (p: ResearchPlayer) => number,
  label: (p: ResearchPlayer) => string,
  point: number,
  preview: number,
): SheetMarket {
  const lines: SheetLine[] = [];
  for (const p of players) {
    if (listedOut(p.name, ctx.injuries)) continue;
    const hit = clip(1 - Math.exp(-expected(p)), 0.06, 0.78);
    lines.push({
      label: p.name,
      player: p,
      single: makeRow(ctx, {
        marketType: "prop",
        side: "yes",
        selection: label(p),
        fairProb: hit,
        point,
        player: p.name,
        playerId: p.id,
        headshot: p.headshot,
        isProp: true,
      }),
    });
  }
  return { id, title, kind: "player-yes", leftHeader: "Over", preview, lines };
}

function scoredMean(ctx: Ctx, mean: number): number {
  // Posted total is the prior. Last-10 expected combined score is analysis of
  // actual runs/points — blend 28% toward it, keep the book as the majority.
  if (ctx.formTotal != null && ctx.formTotal > 0 && mean > 0) {
    return mean * 0.72 + ctx.formTotal * 0.28;
  }
  return mean;
}

function sortAroundMain(lines: SheetLine[], main: number, get: (line: SheetLine) => number, higherFirst = false): SheetLine[] {
  const tagged = lines.map((l) => ({ l, p: get(l) }));
  const center = tagged.filter((x) => Math.abs(x.p - main) < 0.04);
  const lower = tagged.filter((x) => x.p < main - 0.04).sort((a, b) => b.p - a.p);
  const higher = tagged.filter((x) => x.p > main + 0.04).sort((a, b) => a.p - b.p);
  const rest = higherFirst ? [...higher, ...lower] : [...lower, ...higher];
  return [...center, ...rest].map((x) => x.l);
}

function totalLadder(
  ctx: Ctx,
  title: string,
  id: string,
  mean: number,
  steps: number[],
  sport = ctx.sport,
  pickLabel?: string,
): SheetMarket {
  const mu = scoredMean(ctx, mean);
  const lines: SheetLine[] = steps
    .filter((line) => line >= 0.5)
    .map((line) => {
      const over = overProb(mu, line, sport);
      const overSel = pickLabel ? `${pickLabel} over ${line}` : `Over ${line}`;
      const underSel = pickLabel ? `${pickLabel} under ${line}` : `Under ${line}`;
      return {
        label: String(line),
        left: makeRow(ctx, {
          marketType: "total",
          side: "over",
          selection: overSel,
          fairProb: over,
          point: line,
        }),
        right: makeRow(ctx, {
          marketType: "total",
          side: "under",
          selection: underSel,
          fairProb: 1 - over,
          point: line,
        }),
      };
    });
  return {
    id,
    title,
    kind: "total-ladder",
    leftHeader: "Over",
    rightHeader: "Under",
    preview: 5,
    lines: sortAroundMain(lines, halfLine(mu), (l) => l.left?.point ?? Number(l.label)),
  };
}

function teamTotalLadder(ctx: Ctx, title: string, id: string, homeAway: "home" | "away"): SheetMarket {
  const share = clip(0.5 + (teamWin(ctx, homeAway) - 0.5) * 0.28, 0.38, 0.62);
  const mean = ctx.total * share;
  const center = halfLine(mean);
  const steps: number[] = [];
  for (let i = -3; i <= 3; i++) {
    const v = center + i;
    if (v >= 0.5) steps.push(v);
  }
  const m = totalLadder(ctx, title, id, mean, steps);
  const nick = homeAway === "home" ? ctx.homeNick : ctx.awayNick;
  for (const line of m.lines) {
    if (line.left) line.left.selection = `${nick} over ${line.label}`;
    if (line.right) line.right.selection = `${nick} under ${line.label}`;
  }
  return m;
}

function spreadGrid(ctx: Ctx): SheetMarket {
  const main = ctx.homeSpread;
  const step = ctx.sport === "NBA" || ctx.sport === "NCAAB" ? 1 : 1;
  const offsets: number[] = [];
  for (let i = -4; i <= 4; i++) {
    const homeLine = Math.round((main + i * step) * 2) / 2;
    if (ctx.sport === "MLB" && Math.abs(homeLine) < 0.6) continue;
    if (!offsets.includes(homeLine)) offsets.push(homeLine);
  }
  const mu = -main;
  const lines: SheetLine[] = offsets.map((homeLine) => {
    const awayLine = -homeLine;
    const homeP = homeCoverProb(mu, homeLine, ctx.sport);
    const awaySel = `${ctx.awayNick} ${awayLine > 0 ? "+" : ""}${awayLine}`;
    const homeSel = `${ctx.homeNick} ${homeLine > 0 ? "+" : ""}${homeLine}`;
    return {
      label: String(homeLine),
      left: makeRow(ctx, {
        marketType: "spread",
        side: "away",
        selection: awaySel,
        fairProb: 1 - homeP,
        point: awayLine,
      }),
      right: makeRow(ctx, {
        marketType: "spread",
        side: "home",
        selection: homeSel,
        fairProb: homeP,
        point: homeLine,
      }),
    };
  });
  return {
    id: "spread",
    title: ctx.sport === "NHL" ? "Puck line" : "Spread",
    kind: "spread-grid",
    leftHeader: ctx.awayNick,
    rightHeader: ctx.homeNick,
    preview: 5,
    lines: sortAroundMain(lines, -main, (l) => l.left?.point ?? 0, true),
  };
}

function moneyline(ctx: Ctx, mlHome?: ScanRow, mlAway?: ScanRow): SheetMarket {
  const homeP = ctx.homeWin;
  const away =
    mlAway ??
    makeRow(ctx, {
      marketType: "ml",
      side: "away",
      selection: `${ctx.awayNick} to win`,
      fairProb: 1 - homeP,
    });
  const home =
    mlHome ??
    makeRow(ctx, {
      marketType: "ml",
      side: "home",
      selection: `${ctx.homeNick} to win`,
      fairProb: homeP,
    });
  return {
    id: "ml",
    title: "To Win",
    kind: "ml",
    preview: 2,
    lines: [
      { label: ctx.homeNick, single: { ...home, selection: home.selection } },
      { label: ctx.awayNick, single: { ...away, selection: away.selection } },
    ],
  };
}

function periodWinner(ctx: Ctx, title: string, id: string, shrink: number): SheetMarket {
  const p = 0.5 + (ctx.homeWin - 0.5) * shrink;
  return {
    id,
    title,
    kind: "ml",
    preview: 2,
    lines: [
      {
        label: ctx.homeNick,
        single: makeRow(ctx, {
          marketType: "ml",
          side: "home",
          selection: `${ctx.homeNick} to win the ${title.toLowerCase().replace(/\s+winner$/, "")}`,
          fairProb: p,
        }),
      },
      {
        label: ctx.awayNick,
        single: makeRow(ctx, {
          marketType: "ml",
          side: "away",
          selection: `${ctx.awayNick} to win the ${title.toLowerCase().replace(/\s+winner$/, "")}`,
          fairProb: 1 - p,
        }),
      },
    ],
  };
}

function postedMatches(cell: ScanRow, hit: ScanRow): boolean {
  if (hit.marketType !== cell.marketType || hit.side !== cell.side) return false;
  if (cell.player || hit.player) {
    if (!cell.player || !hit.player) return false;
    if (!namesHit(cell.player, hit.player) && !namesHit(hit.player, cell.player)) return false;
  }
  if (cell.point != null && hit.point != null) return Math.abs(cell.point - hit.point) < 0.05;
  if (cell.point != null && hit.point == null) return false;
  if (cell.point == null && hit.point != null) return false;
  return true;
}

function overlayPosted(market: SheetMarket, posted: ScanRow[]): void {
  if (!posted.length) return;
  const stamp = (cell?: ScanRow) => {
    if (!cell) return cell;
    const hit = posted.find((r) => postedMatches(cell, r));
    if (!hit) return cell;
    return {
      ...cell,
      price: hit.price,
      fairProb: Number.isFinite(hit.fairProb) ? hit.fairProb : cell.fairProb,
      hold: hit.hold,
      tag: hit.tag,
      hardRockPrice: hit.hardRockPrice,
      researchOnly: false,
      evPct: hit.evPct,
      reason: "Delayed ESPN number. Photograph Hard Rock to lock the live fill.",
    };
  };
  for (const line of market.lines) {
    line.left = stamp(line.left);
    line.right = stamp(line.right);
    line.single = stamp(line.single);
    if (line.alts) {
      for (const alt of line.alts) {
        alt.left = stamp(alt.left);
        alt.right = stamp(alt.right);
      }
    }
  }
}

function finish(tabs: SheetTabs, posted: ScanRow[]): SheetTabs {
  const seen = new Set<SheetMarket>();
  for (const list of [tabs.popular, tabs.props, tabs.innings, tabs.half, tabs.quarters, tabs.halves, tabs.periods]) {
    for (const m of list) {
      if (seen.has(m)) continue;
      seen.add(m);
      overlayPosted(m, posted);
    }
  }
  return tabs;
}

export function seedTemplate(opts: {
  eventId?: string;
  sport: string;
  start: string;
  home: string;
  away: string;
  homeAbbr?: string;
  awayAbbr?: string;
  homeLogo?: string;
  awayLogo?: string;
  homeWin?: number;
}): ScanRow {
  const fair = clip(opts.homeWin ?? 0.5, 0.2, 0.8);
  return {
    eventId: opts.eventId ?? "",
    sport: opts.sport,
    start: opts.start,
    home: opts.home,
    away: opts.away,
    marketType: "ml",
    side: "home",
    selection: `${opts.home} to win`,
    price: juicePrice(fair),
    fairProb: fair,
    evPct: NaN,
    hold: 0.048,
    tag: "close_enough",
    action: "enter_ticket",
    reason: "Research look. Photograph Hard Rock to lock the live number.",
    conviction: "medium",
    spark: "research",
    researchOnly: true,
    homeAbbr: opts.homeAbbr,
    awayAbbr: opts.awayAbbr,
    homeLogo: opts.homeLogo,
    awayLogo: opts.awayLogo,
  };
}

export function buildSheet(opts: {
  sport: string;
  home: string;
  away: string;
  homeNick: string;
  awayNick: string;
  rows: ScanRow[];
  research?: EventResearch | null;
  homeWin: number;
}): SheetTabs {
  const empty: SheetTabs = { popular: [], props: [], innings: [], half: [], quarters: [], halves: [], periods: [] };
  const rows = opts.rows;
  const template =
    rows[0] ??
    seedTemplate({
      sport: opts.sport,
      start: opts.research?.start ?? "",
      home: opts.home,
      away: opts.away,
      homeWin: opts.homeWin,
    });
  if (!template) return empty;
  const mlHome = rows.find((r) => r.marketType === "ml" && r.side === "home");
  const tot = rows.find((r) => r.marketType === "total");
  const spHome = rows.find((r) => r.marketType === "spread" && r.side === "home");
  const total = tot?.point ?? tot?.total ?? opts.research?.total ?? leagueTotal(opts.sport);
  const homeSpread =
    spHome?.point ??
    opts.research?.homeSpread ??
    (opts.homeWin > 0.5 ? -spreadFromWin(opts.homeWin, opts.sport) : spreadFromWin(1 - opts.homeWin, opts.sport));

  const ctx: Ctx = {
    sport: opts.sport,
    home: opts.home,
    away: opts.away,
    homeNick: opts.homeNick,
    awayNick: opts.awayNick,
    homeWin: clip(opts.homeWin, 0.2, 0.8),
    total,
    homeSpread,
    venue: opts.research?.venue,
    weatherTemp: opts.research?.weatherTemp,
    weatherWind: opts.research?.weatherWind,
    weatherPrecip: opts.research?.weatherPrecip,
    injuries: opts.research?.injuries ?? [],
    players: opts.research?.players ?? [],
    template,
    homeEra: opts.research?.homeEra,
    awayEra: opts.research?.awayEra,
    formTotal: last10ExpectedTotal(opts.research?.lastFive, opts.home, opts.away),
    homeLooks: opts.research?.homeLooks,
    awayLooks: opts.research?.awayLooks,
    homePitcherHand: opts.research?.homePitcherHand,
    awayPitcherHand: opts.research?.awayPitcherHand,
  };

  const ml = moneyline(ctx, mlHome, rows.find((r) => r.marketType === "ml" && r.side === "away"));
  const totName = opts.sport === "MLB" ? "Total Runs" : opts.sport === "NHL" ? "Total Goals" : "Total Points";
  const totSteps = totalSteps(opts.sport, total);
  const totals = totalLadder(ctx, totName, "total", total, totSteps);
  const spread = spreadGrid(ctx);

  if (isCollegeSport(opts.sport)) {
    const q = periodBundle(ctx, "quarter", 0.28, 0.22);
    const h = periodBundle(ctx, "half", 0.55, 0.48);
    return finish(
      {
        popular: [ml, totals, spread],
        props: [],
        innings: [],
        half: [],
        quarters: q.winners.concat(q.totals),
        halves: h.winners.concat(h.totals),
        periods: [],
      },
      rows,
    );
  }

  if (opts.sport === "MLB") {
    const pool = ctx.players.filter(isBatter);
    const batters = (score: (p: ResearchPlayer) => number) =>
      rankBy(
        pool,
        14,
        (p) =>
          score(p) +
          (p.starter ? 0.1 : 0) +
          (p.stats.hr != null ? 0.4 : 0) +
          (p.stats.avg != null || p.stats.hits != null ? 0.5 : 0) +
          (p.stats.rbi != null ? 0.15 : 0) +
          (Object.keys(p.stats).length ? 0.05 : 0),
      );
    const byHits = batters((p) => expectedMlbHits(p, ctx));
    const byHr = batters((p) => expectedMlbHr(p, ctx) + (p.stats.hr ?? 0) / 90);
    const byHrr = batters((p) => expectedMlbHrr(p, ctx));
    const starters = rankBy(
      ctx.players.filter((p) => p.starter && isPitcher(p)),
      2,
      (p) => expectedPitcherK(p, ctx),
    );
    const sps = starters.length ? starters : rankBy(ctx.players.filter(isPitcher), 2, (p) => expectedPitcherK(p, ctx) + scorePlayer(p));
    const hr = yesMarket(ctx, "Batter Home Runs", "hr", byHr, (p) => expectedMlbHr(p, ctx), (p) => `${p.name} to hit a home run`, 0.5, 5);
    const hits = ouMarket(ctx, "Hits", "hits", byHits, () => 0.5, (p) => expectedMlbHits(p, ctx), (p, line, s) => `${p.name} ${s} ${line} hits`, 5, 1);
    const ks = ouMarket(ctx, "Strikeouts", "ks", sps, (p) => halfLine(expectedPitcherK(p, ctx)), (p) => expectedPitcherK(p, ctx), (p, line, s) => `${p.name} ${s} ${line} strikeouts`, 5, 1);
    const first = totalLadder(ctx, "1st Inning Total Runs", "1st-inn", total * 0.118, [0.5, 1.5], "MLB", "1st inning");
    const second = totalLadder(ctx, "2nd Inning Total Runs", "2nd-inn", total * 0.11, [0.5, 1.5], "MLB", "2nd inning");
    const third = totalLadder(ctx, "3rd Inning Total Runs", "3rd-inn", total * 0.11, [0.5, 1.5], "MLB", "3rd inning");
    const tb = ouMarket(ctx, "Total Bases", "tb", byHr, () => 1.5, (p) => expectedMlbTb(p, ctx), (p, line, s) => `${p.name} ${s} ${line} total bases`, 5, 1);
    const hrr = ouMarket(ctx, "Hits+Runs+RBIs", "hrr", byHrr, () => 1.5, (p) => expectedMlbHrr(p, ctx), (p, line, s) => `${p.name} ${s} ${line} hits + runs + RBIs`, 5, 1);
    const awayTot = teamTotalLadder(ctx, `${ctx.awayNick} Total Runs`, "away-tot", "away");
    const homeTot = teamTotalLadder(ctx, `${ctx.homeNick} Total Runs`, "home-tot", "home");
    const runs = ouMarket(ctx, "Batter Runs", "runs", batters((p) => expectedMlbRuns(p, ctx)), () => 0.5, (p) => expectedMlbRuns(p, ctx), (p, line, s) => `${p.name} ${s} ${line} runs`, 5, 1);
    const rbi = ouMarket(ctx, "RBIs", "rbi", batters((p) => expectedMlbRbi(p, ctx)), () => 0.5, (p) => expectedMlbRbi(p, ctx), (p, line, s) => `${p.name} ${s} ${line} RBIs`, 5, 1);
    const walks = ouMarket(ctx, "Walks", "bb", batters((p) => expectedMlbWalks(p, ctx)), () => 0.5, (p) => expectedMlbWalks(p, ctx), (p, line, s) => `${p.name} ${s} ${line} walks`, 5, 1);
    const sb = yesMarket(
      ctx,
      "Stolen Bases",
      "sb",
      rankBy(pool, 6, (p) => (p.stats.sb ?? 0) + (/SS|CF|2B/.test(pos(p)) ? 1.2 : 0) + (p.starter ? 0.3 : 0) + (Object.keys(p.stats).length ? 0.2 : 0)),
      (p) => clip((p.stats.sb != null && p.stats.sb > 0 && p.stats.sb < 90 ? p.stats.sb / 145 : /SS|CF|2B/.test(pos(p)) ? 0.22 : 0.1), 0.04, 0.55),
      (p) => `${p.name} to steal a base`,
      0.5,
      5,
    );
    const innWin = periodWinner(ctx, "1st Inning Winner", "1st-win", 0.32);
    const f5w = periodWinner(ctx, "1st 5 Innings Winner", "f5-win", 0.72);
    const f5t = totalLadder(ctx, "1st 5 Innings Total", "f5-tot", total * 0.56, [halfLine(total * 0.56) - 1, halfLine(total * 0.56), halfLine(total * 0.56) + 1], "MLB", "first 5 innings");
    const half1 = totalLadder(ctx, "1st Inning First Half Runs", "half-1", total * 0.06, [0.5], "MLB", "1st inning first half");
    const half2 = totalLadder(ctx, "1st Inning Second Half Runs", "half-2", total * 0.055, [0.5], "MLB", "1st inning second half");
    return finish(
      {
        popular: [ml, totals, spread, hr, hits, ks, first, tb, hrr, awayTot, homeTot, runs, rbi],
        props: [hr, hits, ks, tb, hrr, runs, rbi, walks, sb],
        innings: [first, second, third, innWin, f5w, f5t],
        half: [half1, half2],
        quarters: [],
        halves: [],
        periods: [],
      },
      rows,
    );
  }

  if (opts.sport === "NFL") {
    const qbs = rankBy(ctx.players.filter(isQB), 3, (p) => expectedNflPassYds(p, ctx) + scorePlayer(p));
    const rbs = rankBy(ctx.players.filter(isRB), 6, (p) => expectedNflRushYds(p, ctx) + scorePlayer(p));
    const catchers = rankBy(ctx.players.filter(isPassCatcher), 10, (p) => expectedNflRecYds(p, ctx) + scorePlayer(p));
    const pass = ouMarket(ctx, "Passing Yards", "pass", qbs, (p) => halfLine(expectedNflPassYds(p, ctx)), (p) => expectedNflPassYds(p, ctx), (p, line, s) => `${p.name} ${s} ${line} passing yards`, 4, 10);
    const rush = ouMarket(ctx, "Rushing Yards", "rush", rbs, (p) => halfLine(expectedNflRushYds(p, ctx)), (p) => expectedNflRushYds(p, ctx), (p, line, s) => `${p.name} ${s} ${line} rushing yards`, 5, 10);
    const rec = ouMarket(ctx, "Receiving Yards", "rec", catchers.filter((p) => pos(p) !== "RB"), (p) => halfLine(expectedNflRecYds(p, ctx)), (p) => expectedNflRecYds(p, ctx), (p, line, s) => `${p.name} ${s} ${line} receiving yards`, 5, 10);
    const recs = ouMarket(ctx, "Receptions", "recs", catchers, (p) => halfLine(expectedNflRecYds(p, ctx) / 12), (p) => expectedNflRecYds(p, ctx) / 12, (p, line, s) => `${p.name} ${s} ${line} receptions`, 5, 1);
    const ptd = ouMarket(ctx, "Passing Touchdowns", "ptd", qbs, () => 1.5, () => 1.7 * pace(ctx), (p, line, s) => `${p.name} ${s} ${line} passing touchdowns`, 3, 1);
    const atd = yesMarket(ctx, "Anytime Touchdown", "atd", [...rbs, ...catchers].slice(0, 10), (p) => expectedAtd(p, ctx), (p) => `${p.name} anytime touchdown`, 0.5, 6);
    const two = yesMarket(ctx, "2+ Touchdowns", "2td", [...rbs, ...catchers].slice(0, 6), (p) => expectedAtd(p, ctx) * 0.22, (p) => `${p.name} 2+ touchdowns`, 1.5, 5);
    const q = periodBundle(ctx, "quarter", 0.28, 0.22);
    const h = periodBundle(ctx, "half", 0.55, 0.48);
    return finish(
      {
        popular: [ml, totals, spread, pass, rush, rec, atd],
        props: [pass, rush, rec, recs, ptd, atd, two],
        innings: [],
        half: [],
        quarters: q.winners.concat(q.totals),
        halves: h.winners.concat(h.totals),
        periods: [],
      },
      rows,
    );
  }

  if (opts.sport === "NBA") {
    const bats = rankBy(ctx.players, 10, (p) => expectedNba(p, ctx, "pts") + scorePlayer(p));
    const pts = ouMarket(ctx, "Points", "pts", bats, (p) => halfLine(expectedNba(p, ctx, "pts")), (p) => expectedNba(p, ctx, "pts"), (p, line, s) => `${p.name} ${s} ${line} points`, 5, 2);
    const reb = ouMarket(ctx, "Rebounds", "reb", bats, (p) => halfLine(expectedNba(p, ctx, "reb")), (p) => expectedNba(p, ctx, "reb"), (p, line, s) => `${p.name} ${s} ${line} rebounds`, 5, 1);
    const ast = ouMarket(ctx, "Assists", "ast", bats, (p) => halfLine(expectedNba(p, ctx, "ast")), (p) => expectedNba(p, ctx, "ast"), (p, line, s) => `${p.name} ${s} ${line} assists`, 5, 1);
    const threes = ouMarket(ctx, "Threes", "3s", bats, (p) => halfLine(expectedNba(p, ctx, "threes")), (p) => expectedNba(p, ctx, "threes"), (p, line, s) => `${p.name} ${s} ${line} threes`, 5, 1);
    const pra = ouMarket(ctx, "Pts + Reb + Ast", "pra", bats, (p) => halfLine(expectedNba(p, ctx, "pra")), (p) => expectedNba(p, ctx, "pra"), (p, line, s) => `${p.name} ${s} ${line} pts + reb + ast`, 5, 2);
    const q = periodBundle(ctx, "quarter", 0.26, 0.25);
    const h = periodBundle(ctx, "half", 0.52, 0.5);
    return finish(
      {
        popular: [ml, totals, spread, pts, reb, ast, threes, pra],
        props: [pts, reb, ast, threes, pra],
        innings: [],
        half: [],
        quarters: q.winners.concat(q.totals),
        halves: h.winners.concat(h.totals),
        periods: [],
      },
      rows,
    );
  }

  if (opts.sport === "NHL") {
    const skaters = rankBy(ctx.players.filter(isSkater), 10, (p) => expectedNhlShots(p) + scorePlayer(p));
    const goalies = rankBy(ctx.players.filter((p) => /G/.test(pos(p))), 2, (p) => expectedSaves(p, ctx) + scorePlayer(p));
    const sog = ouMarket(ctx, "Shots on Goal", "sog", skaters, (p) => halfLine(expectedNhlShots(p)), expectedNhlShots, (p, line, s) => `${p.name} ${s} ${line} shots on goal`, 5, 1);
    const goals = yesMarket(ctx, "Goals", "goals", skaters, (p) => expectedNhlGoals(p, ctx), (p) => `${p.name} to score a goal`, 0.5, 6);
    const pts = ouMarket(ctx, "Points", "hp", skaters, () => 0.5, (p) => expectedNhlGoals(p, ctx) * 1.7, (p, line, s) => `${p.name} ${s} ${line} points`, 5, 1);
    const saves = ouMarket(ctx, "Saves", "sv", goalies, (p) => halfLine(expectedSaves(p, ctx)), (p) => expectedSaves(p, ctx), (p, line, s) => `${p.name} ${s} ${line} saves`, 3, 2);
    const blk = ouMarket(ctx, "Blocked Shots", "blk", skaters.filter((p) => pos(p) === "D"), () => 1.5, () => 1.7, (p, line, s) => `${p.name} ${s} ${line} blocked shots`, 5, 1);
    const per = periodBundle(ctx, "period", 0.34, 0.33);
    return finish(
      {
        popular: [ml, totals, spread, sog, goals, saves, pts],
        props: [sog, goals, saves, pts, blk],
        innings: [],
        half: [],
        quarters: [],
        halves: [],
        periods: per.winners.concat(per.totals),
      },
      rows,
    );
  }

  return finish({ popular: [ml, totals, spread], props: [], innings: [], half: [], quarters: [], halves: [], periods: [] }, rows);
}

function spreadFromWin(p: number, sport: string): number {
  const gap = (0.5 - p) * (sport === "MLB" ? 6 : sport === "NHL" ? 2.4 : 14);
  const stepped = Math.round(Math.abs(gap) * 2) / 2;
  const mag = Math.max(sport === "MLB" ? 1.5 : 1, stepped || 1.5);
  return mag;
}

function totalSteps(sport: string, total: number): number[] {
  const step = sport === "NBA" || sport === "NCAAB" ? 2 : 1;
  const center = halfLine(total);
  const n = 4;
  const out: number[] = [];
  for (let i = -n; i <= n; i++) {
    const v = center + i * step;
    if (v >= 0.5) out.push(v);
  }
  return out;
}

function ordinal(i: number): string {
  if (i === 1) return "1st";
  if (i === 2) return "2nd";
  if (i === 3) return "3rd";
  return `${i}th`;
}

function periodBundle(
  ctx: Ctx,
  unit: "quarter" | "half" | "period",
  winShrink: number,
  scoreShare: number,
): { winners: SheetMarket[]; totals: SheetMarket[] } {
  const n = unit === "half" ? 2 : unit === "period" ? 3 : 4;
  const winners: SheetMarket[] = [];
  const totals: SheetMarket[] = [];
  const bump = ctx.sport === "MLB" ? 1 : ctx.sport === "NHL" ? 0.5 : 3;
  for (let i = 1; i <= n; i++) {
    const label =
      unit === "half" ? (i === 1 ? "1st Half" : "2nd Half") : unit === "period" ? `${ordinal(i)} Period` : `${ordinal(i)} Quarter`;
    winners.push(periodWinner(ctx, `${label} Winner`, `${unit}-w-${i}`, winShrink));
    const mean = ctx.total * scoreShare;
    const center = halfLine(mean);
    totals.push(
      totalLadder(ctx, `${label} Total`, `${unit}-t-${i}`, mean, [center - bump, center, center + bump], ctx.sport, label),
    );
  }
  return { winners, totals };
}
