/**
 * Hierarchical chance ensemble.
 *
 * Every look is a noisy observation of the same hidden number: P(home wins).
 * We work in log-odds, weight by precision (1 / estimated error variance),
 * and when the looks fight we treat that as overdispersion — which automatically
 * shrinks non-market layers toward the sportsbook.
 *
 * Sportsbooks and prediction markets are different crowds. Kalshi / Polymarket
 * are research, never a Florida fill. Public ESPN data cannot beat a liquid
 * close; the market is the prior, not a suggestion.
 */

export type LayerFamily = "market" | "crowd" | "model" | "context";

export type ChanceLayer = {
  id: string;
  label: string;
  home: number;
  weight: number;
  precision: number;
  family: LayerFamily;
  note: string;
  /** Live look with a small sample — still ran, light weight. */
  thin?: boolean;
  /** Live lookup ran; the feed was empty. Stamp = Looked, not a skip. */
  empty?: boolean;
};

import { analyzeScores, earlySeasonDamp, ewmaWeights, formTrend, splitByVenue, vsOpponent } from "./form.ts";
import { defenseAllowed, processFromLooks, underlyingOffense, underlyingPitch, type TeamLooks } from "./looks.ts";

export type FormGame = {
  date?: string;
  result: string;
  pf?: number;
  pa?: number;
  opponent?: string;
  homeAway?: "home" | "away";
};

export type FormBlock = {
  team: string;
  results: string[];
  games?: FormGame[];
  seasonGames?: FormGame[];
};

export type ChanceInput = {
  home: string;
  away: string;
  sport: string;
  start?: string;
  oddsHome?: number;
  bookHome?: number;
  openHome?: number;
  espnHome?: number;
  kalshiHome?: number;
  kalshiVolume?: number;
  kalshiSpread?: number;
  polyHome?: number;
  polyVolume?: number;
  homeSpread?: number;
  total?: number;
  homeRecord?: string;
  awayRecord?: string;
  homeSplit?: string;
  awaySplit?: string;
  homeEra?: number;
  awayEra?: number;
  homeWhip?: number;
  awayWhip?: number;
  lastFive?: FormBlock[];
  homeOuts?: number;
  awayOuts?: number;
  homeQuestionable?: number;
  awayQuestionable?: number;
  homePf?: number;
  homePa?: number;
  awayPf?: number;
  awayPa?: number;
  weatherTemp?: number;
  weatherWind?: number;
  weatherPrecip?: number;
  venue?: string;
  seriesHomeWins?: number;
  seriesAwayWins?: number;
  homeRestDays?: number;
  awayRestDays?: number;
  ticketHome?: number;
  handleHome?: number;
  steam?: boolean;
  homeLooks?: TeamLooks;
  awayLooks?: TeamLooks;
  homePitcherHand?: "L" | "R";
  awayPitcherHand?: "L" | "R";
  /** After 20+ settled tickets a layer can be haircut 10%. Empty = 1. */
  layerHaircuts?: Record<string, number>;
};

export type ChanceReport = {
  home: number;
  away: number;
  favorite: "home" | "away";
  favoriteName: string;
  chance: number;
  confidence: "high" | "medium" | "low";
  agreement: number;
  layers: ChanceLayer[];
  marketHome?: number;
  crowdHome?: number;
  posteriorVar: number;
  because: string;
};

const CLIP_LO = 0.12;
const CLIP_HI = 0.88;
const FINAL_LO = 0.14;
const FINAL_HI = 0.86;

export function logit(p: number): number {
  const x = Math.min(0.985, Math.max(0.015, p));
  return Math.log(x / (1 - x));
}

export function invLogit(z: number, lo = CLIP_LO, hi = CLIP_HI): number {
  const p = 1 / (1 + Math.exp(-z));
  return Math.min(hi, Math.max(lo, p));
}

function unit01(n?: number): number | null {
  if (n == null || !Number.isFinite(n)) return null;
  const p = n > 1 ? n / 100 : n;
  if (p <= 0.02 || p >= 0.98) return null;
  return p;
}

/** Abramowitz & Stegun 7.1.26 — good to ~1e-5, no extra deps. */
export function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804 * Math.exp((-z * z) / 2);
  const p =
    d * t * (0.319381743 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return z >= 0 ? 1 - p : p;
}

export function parseRecord(summary?: string): { w: number; l: number; t: number; n: number; wp: number } | null {
  if (!summary) return null;
  const m = /(\d+)\s*-\s*(\d+)(?:\s*-\s*(\d+))?/.exec(summary);
  if (!m) return null;
  const w = Number(m[1]);
  const l = Number(m[2]);
  const t = m[3] ? Number(m[3]) : 0;
  const n = w + l + t;
  if (n < 5) return null;
  return { w, l, t, n, wp: (w + 0.5 * t) / n };
}

/** Bill James log5: P(A beats B) from two winning percentages. */
export function log5(wpA: number, wpB: number): number {
  const a = Math.min(0.85, Math.max(0.15, wpA));
  const b = Math.min(0.85, Math.max(0.15, wpB));
  const num = a * (1 - b);
  return num / (num + b * (1 - a));
}

export function homeFieldLogit(sport: string): number {
  switch (sport) {
    case "NFL":
      return 0.16;
    case "NCAAF":
      return 0.22;
    case "NBA":
      return 0.2;
    case "NHL":
      return 0.22;
    case "MLB":
      return 0.12;
    case "NCAAB":
      return 0.22;
    default:
      return 0.14;
  }
}

/** Sport-specific score-margin sigma for converting a spread or point diff into P(win). */
export function marginSigma(sport: string): number {
  switch (sport) {
    case "NFL":
      return 13.45;
    case "NCAAF":
      return 16.2;
    case "NBA":
      return 12.0;
    case "NHL":
      return 1.85;
    case "MLB":
      return 3.05;
    case "NCAAB":
      return 11.5;
    default:
      return 13.0;
  }
}

export function leagueTotal(sport: string): number {
  switch (sport) {
    case "NFL":
      return 44.5;
    case "NCAAF":
      return 54;
    case "NBA":
      return 224;
    case "NHL":
      return 6.1;
    case "MLB":
      return 8.6;
    case "NCAAB":
      return 145;
    default:
      return 45;
  }
}

export function pythagoreanWp(pf: number, pa: number, sport: string): number | null {
  if (!(pf > 0 && pa > 0)) return null;
  const exp = sport === "MLB" ? 1.83 : sport === "NBA" ? 13.91 : sport === "NCAAB" ? 10.25 : sport === "NHL" ? 2.07 : 2.37;
  const num = pf ** exp;
  return num / (num + pa ** exp);
}

export function parseEra(line?: string): number | undefined {
  if (!line) return undefined;
  const m = /ERA\s*(\d+\.\d+)/i.exec(line);
  if (!m) return undefined;
  const n = Number(m[1]);
  return n > 0 && n < 15 ? n : undefined;
}

export function parseWhip(line?: string): number | undefined {
  if (!line) return undefined;
  const m = /WHIP\s*(\d+\.\d+)/i.exec(line);
  if (!m) return undefined;
  const n = Number(m[1]);
  return n > 0 && n < 4 ? n : undefined;
}

export function spreadToWinProb(homeSpread: number, sport: string): number {
  // homeSpread is the posted line on the home team (negative = favorite).
  // P(home wins) = P(margin > 0) = Φ(μ / σ) with μ = −spread.
  const mu = -homeSpread;
  const z = mu / marginSigma(sport);
  return invLogit(logit(normalCdf(z)));
}

/** Typical residual of the game total — used for alternate overs/unders. */
export function totalSigma(sport: string): number {
  switch (sport) {
    case "MLB":
      return 2.85;
    case "NFL":
      return 10.2;
    case "NCAAF":
      return 13.5;
    case "NBA":
      return 11.5;
    case "NCAAB":
      return 10.8;
    case "NHL":
      return 1.65;
    default:
      return 10;
  }
}

/** P(home covers posted homeLine) given expected home margin μ. Half-lines, no push. */
/** NFL / college margins cluster on 3 and 7. Mix discrete mass with the continuous curve. */
const KEY_MARGIN_MASS: { k: number; mass: number }[] = [
  { k: 3, mass: 0.151 },
  { k: 7, mass: 0.092 },
  { k: 6, mass: 0.066 },
  { k: 10, mass: 0.058 },
  { k: 14, mass: 0.048 },
  { k: 4, mass: 0.046 },
];

export function homeCoverProb(expectedHomeMargin: number, homeLine: number, sport: string): number {
  const z = (expectedHomeMargin + homeLine) / marginSigma(sport);
  const cont = invLogit(logit(normalCdf(z)), 0.03, 0.97);
  if (sport !== "NFL" && sport !== "NCAAF") return cont;
  // P(home margin + homeLine > 0). homeLine is the posted home spread (neg = fav).
  let massCover = 0;
  let massTot = 0;
  for (const row of KEY_MARGIN_MASS) {
    massTot += row.mass;
    const homeWinsBy = expectedHomeMargin >= 0 ? row.k : -row.k;
    if (homeWinsBy + homeLine > 0) massCover += row.mass;
    else if (homeWinsBy + homeLine === 0) massCover += row.mass * 0.5; // push split
  }
  const disc = massTot > 0 ? massCover / massTot : cont;
  return invLogit(logit(0.55 * cont + 0.45 * disc), 0.03, 0.97);
}

/** P(game total > line) with a normal around the posted/ensemble mean. */
export function overProb(mean: number, line: number, sport: string): number {
  const z = (line - mean) / totalSigma(sport);
  return invLogit(logit(1 - normalCdf(z)), 0.02, 0.98);
}

/** Poisson P(X <= k). Fine for counts under ~40. */
export function poissonCdf(k: number, lambda: number): number {
  if (lambda <= 0) return 1;
  if (k < 0) return 0;
  const cap = Math.min(Math.floor(k), 80);
  let term = Math.exp(-lambda);
  let sum = term;
  for (let i = 1; i <= cap; i++) {
    term *= lambda / i;
    sum += term;
    if (term < 1e-12) break;
  }
  return Math.min(1, sum);
}

/** P(count > line) for a .5 line (no push). */
export function poissonOver(lambda: number, line: number): number {
  const k = Math.floor(line);
  return invLogit(logit(1 - poissonCdf(k, Math.max(0.02, lambda))), 0.06, 0.94);
}



const PARK_RUNS: Record<string, number> = {
  "coors field": 1.15,
  "great american ball park": 1.08,
  "great american ballpark": 1.08,
  "yankee stadium": 1.05,
  "fenway park": 1.04,
  "citizens bank park": 1.04,
  "globe life field": 1.03,
  "guaranteed rate field": 1.03,
  "rate field": 1.03,
  "camden yards": 1.02,
  "oriole park": 1.02,
  "wrigley field": 1.02,
  "truist park": 1.02,
  "rogers centre": 1.02,
  "chase field": 1.01,
  "progressive field": 1.01,
  "minute maid park": 0.98,
  "busch stadium": 0.97,
  "angel stadium": 0.97,
  "dodger stadium": 0.96,
  "pnc park": 0.96,
  "kauffman stadium": 0.96,
  "loandepot park": 0.96,
  "citi field": 0.95,
  "comerica park": 0.95,
  "tropicana field": 0.94,
  "petco park": 0.92,
  "t-mobile park": 0.92,
  "oracle park": 0.9,
};

function parkFactor(venue?: string): number | null {
  if (!venue) return null;
  const key = venue.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  for (const [name, f] of Object.entries(PARK_RUNS)) {
    if (key.includes(name)) return f;
  }
  return null;
}

function formBlock(lastFive: FormBlock[] | undefined, team: string): FormBlock | undefined {
  if (!lastFive?.length) return undefined;
  const n = team.toLowerCase();
  return lastFive.find((b) => b.team.toLowerCase() === n);
}

function recencyWp(block?: FormBlock): number | null {
  if (!block) return null;
  const games = block.games?.filter((g) => g.result === "W" || g.result === "L");
  if (games && games.length >= 3) {
    const read = analyzeScores(games, 10);
    if (read) return read.wp;
  }
  const results = block.results.filter((r) => r === "W" || r === "L").slice(0, 10);
  if (results.length < 3) return null;
  const w = ewmaWeights(results.length);
  return results.reduce((s, r, i) => s + (r === "W" ? 1 : 0) * (w[i] ?? 0), 0);
}

function marginWp(block: FormBlock | undefined, sport: string): number | null {
  const games = block?.games?.filter((g) => g.pf != null && g.pa != null) ?? [];
  if (games.length < 3) return null;
  const read = analyzeScores(games, 10);
  if (!read || !(read.avgPf > 0 || read.avgPa > 0)) return null;
  const z = read.avgMargin / (marginSigma(sport) * Math.sqrt(1 + 1 / read.n));
  return invLogit(logit(normalCdf(z)));
}

function restDays(block: FormBlock | undefined, start?: string): number | undefined {
  if (!start) return undefined;
  const dates = (block?.games ?? []).map((g) => g.date).filter((d): d is string => Boolean(d));
  if (!dates.length) return undefined;
  const last = dates
    .map((d) => new Date(d).getTime())
    .filter((t) => Number.isFinite(t))
    .sort((a, b) => b - a)[0];
  if (last == null) return undefined;
  const startMs = new Date(start).getTime();
  if (!Number.isFinite(startMs)) return undefined;
  const days = (startMs - last) / 86400_000;
  if (days < 0.15 || days > 21) return undefined;
  return days;
}

function crowdPrecision(volume: number | undefined, spread: number | undefined, base: number): number {
  let p = base;
  if (volume != null && volume > 0) {
    // log10 volume: $10 → ~0.5×, $1k → ~1×, $100k → ~1.5×, cap 1.8×
    const scale = Math.min(1.8, Math.max(0.45, 0.35 + 0.22 * Math.log10(volume + 1)));
    p *= scale;
  } else {
    p *= 0.55;
  }
  if (spread != null && spread > 0) {
    // 1¢ book = tight; 8¢+ book = noisy.
    const widen = Math.min(2.2, 1 + spread / 0.06);
    p /= widen;
  }
  return p;
}

function samplePrecision(n: number | undefined, full: number, minN = 20): number {
  if (n == null || n <= 0) return full * 0.45;
  return full * Math.min(1, Math.sqrt(n / minN));
}

function pushLayer(
  layers: ChanceLayer[],
  layer: Omit<ChanceLayer, "weight"> & { weight?: number },
): void {
  if (!Number.isFinite(layer.home)) return;
  const empty = Boolean(layer.empty) || layer.precision <= 0;
  const precision = empty ? 0 : layer.precision;
  const home = empty ? 0.5 : invLogit(logit(layer.home));
  layers.push({
    ...layer,
    home,
    weight: precision,
    precision,
    thin: layer.thin || empty,
    empty,
  });
}

function pushEmpty(layers: ChanceLayer[], id: string, label: string, note: string): void {
  pushLayer(layers, {
    id,
    label,
    home: 0.5,
    precision: 0,
    family: "context",
    note: `${note} Status: Looked (Empty). Missing data has zero weight — no 50/50 drag.`,
    thin: true,
    empty: true,
  });
}

/** Market precision scales up as kickoff nears and vig tightens. */
export function marketPrecision(hoursToKickoff?: number, vigWidth = 0.045): number {
  const T = hoursToKickoff != null && Number.isFinite(hoursToKickoff) ? Math.max(0, hoursToKickoff) : 24;
  const vig = vigWidth > 0 ? vigWidth : 0.045;
  return 14.0 * (1 + 0.6 / Math.sqrt(T + 0.5)) * (0.045 / vig);
}

function hoursToStart(start?: string): number | undefined {
  if (!start) return undefined;
  const t = new Date(start).getTime();
  if (!Number.isFinite(t)) return undefined;
  return (t - Date.now()) / 3_600_000;
}

export function buildChance(input: ChanceInput): ChanceReport | null {
  const layers: ChanceLayer[] = [];
  const sport = input.sport || "NFL";

  if (input.oddsHome != null && Number.isFinite(input.oddsHome)) {
    pushLayer(layers, {
      id: "market",
      label: "Sportsbook no-vig (close)",
      home: input.oddsHome,
      precision: marketPrecision(hoursToStart(input.start)),
      family: "market",
      note: "Two-way price with the house cut stripped. Real money, delayed. This is the prior — liquid books are extremely hard to beat.",
    });
  } else {
    pushEmpty(layers, "market", "Sportsbook no-vig (close)", "Looked up the live two-way close. Not posted on this delayed board yet. Empty look, not a guess.");
  }

  if (input.openHome != null && Number.isFinite(input.openHome) && (input.oddsHome == null || Math.abs(input.openHome - input.oddsHome) > 0.012)) {
    const moved = input.oddsHome != null ? input.oddsHome - input.openHome : 0;
    pushLayer(layers, {
      id: "open",
      label: "Opening line",
      home: input.openHome,
      precision: 5.5,
      family: "market",
      note:
        moved > 0.008
          ? `Opened at ${Math.round(input.openHome * 100)} in 100 for ${input.home}; the close moved toward them (often sharper money).`
          : moved < -0.008
            ? `Opened at ${Math.round(input.openHome * 100)} in 100 for ${input.home}; the close moved away (public or new info).`
            : "The first number posted. Useful when it disagrees with the close.",
    });
  }

  if (input.bookHome != null && Number.isFinite(input.bookHome) && (input.oddsHome == null || Math.abs(input.bookHome - input.oddsHome) > 0.012)) {
    pushLayer(layers, {
      id: "book",
      label: "Posted book moneyline",
      home: input.bookHome,
      precision: 4,
      family: "market",
      note: "A second sportsbook print from ESPN's pick center. Same legal bucket as the close, different timestamp.",
    });
  }

  if (input.homeSpread != null && Number.isFinite(input.homeSpread) && Math.abs(input.homeSpread) > 0.05) {
    const runline = sport === "MLB" && Math.abs(input.homeSpread - 0) <= 1.6;
    if (!runline) {
      const fromSpread = spreadToWinProb(input.homeSpread, sport);
      const correlated = input.oddsHome != null && Math.abs(fromSpread - input.oddsHome) < 0.03;
      pushLayer(layers, {
        id: "spread",
        label: "Spread-implied winner",
        home: fromSpread,
        precision: correlated ? 2.2 : 7.5,
        family: "market",
        note: correlated
          ? `Home spread ${input.homeSpread > 0 ? "+" : ""}${input.homeSpread} converts to about the same chance as the moneyline — not a second opinion.`
          : `Converts the point spread to a win chance with a ${sport} scoring curve (σ ${marginSigma(sport)}). When this fights the moneyline, one of the numbers is off.`,
      });
    }
  }

  if (input.kalshiHome != null && Number.isFinite(input.kalshiHome)) {
    pushLayer(layers, {
      id: "kalshi",
      label: "Kalshi prediction market",
      home: input.kalshiHome,
      precision: crowdPrecision(input.kalshiVolume, input.kalshiSpread, 8.5),
      family: "crowd",
      note: `Event-contract mid-price${input.kalshiVolume != null ? ` · ~$${Math.round(input.kalshiVolume)} traded` : ""}${
        input.kalshiSpread != null ? ` · ${Math.round(input.kalshiSpread * 100)}¢ wide` : ""
      }. A different crowd from the sportsbook. Research only — not a Hard Rock ticket.`,
    });
  } else {
    pushEmpty(layers, "kalshi", "Kalshi prediction market", "Looked up a live Kalshi contract for this matchup. None posted. Empty book, not a guess.");
  }

  if (input.polyHome != null && Number.isFinite(input.polyHome)) {
    pushLayer(layers, {
      id: "polymarket",
      label: "Polymarket prediction market",
      home: input.polyHome,
      precision: crowdPrecision(input.polyVolume, undefined, 7.5),
      family: "crowd",
      note: `On-chain moneyline share price${input.polyVolume != null ? ` · ~$${Math.round(input.polyVolume)} volume` : ""}. Second prediction venue, independent of Kalshi. Research only — not a Florida sportsbook fill.`,
    });
  } else {
    pushEmpty(layers, "polymarket", "Polymarket prediction market", "Looked up a live Polymarket moneyline. None posted. Empty book, not a guess.");
  }

  if (input.espnHome != null && Number.isFinite(input.espnHome)) {
    pushLayer(layers, {
      id: "espn",
      label: "ESPN matchup model",
      home: input.espnHome,
      precision: 6.2,
      family: "model",
      note: "ESPN's published game projection (FPI / SPI style). Built from ratings, not from tonight's ticket.",
    });
  } else {
    pushEmpty(layers, "espn", "ESPN matchup model", "Looked up ESPN's matchup model. Not posted on this event. Empty look, not a guess.");
  }

  const homeSplit = parseRecord(input.homeSplit);
  const awaySplit = parseRecord(input.awaySplit);
  const homeRec = parseRecord(input.homeRecord);
  const awayRec = parseRecord(input.awayRecord);
  const homeWp = homeSplit?.wp ?? homeRec?.wp;
  const awayWp = awaySplit?.wp ?? awayRec?.wp;
  if (homeWp != null && awayWp != null) {
    const raw = log5(homeWp, awayWp);
    const usingSplits = Boolean(homeSplit && awaySplit);
    // Home/road splits already bake in home-field. Season W-L does not.
    const withHome = usingSplits ? raw : invLogit(logit(raw) + homeFieldLogit(sport));
    const n = Math.min(homeSplit?.n ?? homeRec?.n ?? 20, awaySplit?.n ?? awayRec?.n ?? 20);
    pushLayer(layers, {
      id: "log5",
      label: usingSplits ? "Home/road log5" : "Record model (log5 + home field)",
      home: withHome,
      precision: samplePrecision(n, 3.6, sport === "MLB" ? 40 : 8),
      family: "model",
      note: usingSplits
        ? `Home split ${input.homeSplit} vs road split ${input.awaySplit}. Splits already include home-field, so we do not add it twice.`
        : `Season ${input.homeRecord} vs ${input.awayRecord}, plus a ${sport} home-field bump.`,
    });
  }

  const homePy = pythagoreanWp(input.homePf ?? 0, input.homePa ?? 0, sport);
  const awayPy = pythagoreanWp(input.awayPf ?? 0, input.awayPa ?? 0, sport);
  if (homePy != null && awayPy != null) {
    const raw = log5(homePy, awayPy);
    pushLayer(layers, {
      id: "pythag",
      label: "Pythagorean (points / runs)",
      home: invLogit(logit(raw) + homeFieldLogit(sport) * 0.5),
      precision: 4.1,
      family: "model",
      note: "Win rate implied by scoring and allowing, not the W-L record. Catches lucky / unlucky teams.",
    });
  }

  const homeFormEarly = formBlock(input.lastFive, input.home);
  const awayFormEarly = formBlock(input.lastFive, input.away);
  const homeL10 = homeFormEarly?.games ? analyzeScores(homeFormEarly.games, 10) : null;
  const awayL10 = awayFormEarly?.games ? analyzeScores(awayFormEarly.games, 10) : null;

  const homeRate = scoringRate(input.homePf, homeRec?.n, sport);
  const homeAllow = scoringRate(input.homePa, homeRec?.n, sport);
  const awayRate = scoringRate(input.awayPf, awayRec?.n, sport);
  const awayAllow = scoringRate(input.awayPa, awayRec?.n, sport);
  const mixRate = (season: number | null, recent: number | undefined) => {
    if (season != null && recent != null && recent > 0) return 0.4 * season + 0.6 * recent;
    return season ?? (recent != null && recent > 0 ? recent : null);
  };
  const hOff = mixRate(homeRate, homeL10?.avgPf);
  const hDef = mixRate(homeAllow, homeL10?.avgPa);
  const aOff = mixRate(awayRate, awayL10?.avgPf);
  const aDef = mixRate(awayAllow, awayL10?.avgPa);
  if (hOff != null && hDef != null && aOff != null && aDef != null) {
    const homeScore = (hOff + aDef) / 2;
    const awayScore = (aOff + hDef) / 2;
    const margin = homeScore - awayScore;
    const p = invLogit(logit(spreadToWinProb(-margin, sport)) + homeFieldLogit(sport) * 0.35);
    const usedL10 = Boolean(homeL10?.avgPf && awayL10?.avgPf);
    pushLayer(layers, {
      id: "efficiency",
      label: "Scoring margin (efficiency)",
      home: p,
      precision: usedL10 ? 4.0 : 3.6,
      family: "model",
      note: usedL10
        ? `Expected ${homeScore.toFixed(1)}–${awayScore.toFixed(1)} — 60% last-10 scoring, 40% season offense vs opponent defense. Last-10 on this stat, not only W-L.`
        : `Expected ${homeScore.toFixed(1)}–${awayScore.toFixed(1)} from season offense vs opponent defense. Margin model — same idea Dimers uses next to the moneyline. Not a lock.`,
    });
  } else {
    pushEmpty(layers, "efficiency", "Scoring margin (efficiency)", "Looked up season and last-10 scoring. Not posted yet. Empty look, not a guess.");
  }

  if (sport === "MLB" && input.homeEra != null && input.awayEra != null) {
    const mixEra = (season: number, recent?: number) =>
      recent != null && recent > 0 ? 0.4 * season + 0.6 * recent : season;
    const homeEra = mixEra(input.homeEra, input.homeLooks?.last7?.era);
    const awayEra = mixEra(input.awayEra, input.awayLooks?.last7?.era);
    const homeBull = input.homePa != null && input.homePa > 0 ? input.homePa / Math.max(1, (homeRec?.n ?? 80)) : homeEra;
    const awayBull = input.awayPa != null && input.awayPa > 0 ? input.awayPa / Math.max(1, (awayRec?.n ?? 80)) : awayEra;
    const homeRuns = homeEra * 0.61 + homeBull * 0.39;
    const awayRuns = awayEra * 0.61 + awayBull * 0.39;
    let p = pythagoreanWp(awayRuns, homeRuns, "MLB") ?? 0.5;
    p = invLogit(logit(p) + homeFieldLogit("MLB") * 0.7);
    const homeWhip = input.homeLooks?.last7?.whip ?? input.homeWhip;
    const awayWhip = input.awayLooks?.last7?.whip ?? input.awayWhip;
    if (homeWhip != null && awayWhip != null) {
      p = invLogit(logit(p) + (awayWhip - homeWhip) * 0.22);
    }
    pushLayer(layers, {
      id: "pitcher",
      label: "Starting pitchers",
      home: p,
      precision: 7.4,
      family: "model",
      note: `ERA ${homeEra.toFixed(2)} vs ${awayEra.toFixed(2)} (60% last-7 when posted, 40% season)${
        homeWhip != null && awayWhip != null ? ` · WHIP ${homeWhip.toFixed(2)} vs ${awayWhip.toFixed(2)}` : ""
      }. Starter blended with bullpen. Last-10/7 on this stat, not a card.`,
    });
  } else {
    pushEmpty(layers, "pitcher", "Starting pitchers", "Looked up tonight's probable ERA/WHIP (or this is not a baseball ticket). Empty look, not a guess.");
  }

  const homeForm = formBlock(input.lastFive, input.home);
  const awayForm = formBlock(input.lastFive, input.away);
  const hf = recencyWp(homeForm);
  const af = recencyWp(awayForm);
  const homeRead = homeForm?.games ? analyzeScores(homeForm.games, 10) : null;
  const awayRead = awayForm?.games ? analyzeScores(awayForm.games, 10) : null;
  if (hf != null && af != null) {
    const homeBit = homeRead
      ? `${input.home} last ${homeRead.n}: ${Math.round(homeRead.wp * 100)}% recency WP, ${homeRead.avgPf.toFixed(1)}–${homeRead.avgPa.toFixed(1)}`
      : `${input.home} recency WP ${Math.round(hf * 100)}%`;
    const awayBit = awayRead
      ? `${input.away} last ${awayRead.n}: ${Math.round(awayRead.wp * 100)}% recency WP, ${awayRead.avgPf.toFixed(1)}–${awayRead.avgPa.toFixed(1)}`
      : `${input.away} recency WP ${Math.round(af * 100)}%`;
    const nForm = Math.max(homeForm?.games?.length ?? 0, awayForm?.games?.length ?? 0);
    const damp = earlySeasonDamp(nForm, sport);
    pushLayer(layers, {
      id: "form",
      label: "Last 10 scores (recency-weighted)",
      home: invLogit(logit(log5(Math.min(0.82, Math.max(0.18, hf)), Math.min(0.82, Math.max(0.18, af)))) + homeFieldLogit(sport) * 0.25),
      precision: ((nForm >= 8 ? 2.8 : 2.1) * damp) || 0,
      family: "context",
      note: `${homeBit}. ${awayBit}. Latest game counts most. Live ESPN log — not a generated card.${sport === "NFL" && damp < 1 ? ` Early-season damping ${damp.toFixed(2)}.` : ""} A 10-game streak is still mean-reverting.`,
    });
  } else {
    pushEmpty(layers, "form", "Last 10 scores (recency-weighted)", "Looked up the live ESPN last-10 log. Not enough completed games yet. Empty look, not a guess.");
  }

  const hm = marginWp(homeForm, sport);
  const am = marginWp(awayForm, sport);
  if (hm != null && am != null) {
    const raw = log5(hm, am);
    const nMargin = Math.max(homeForm?.games?.length ?? 0, awayForm?.games?.length ?? 0);
    pushLayer(layers, {
      id: "margin",
      label: "Score-margin (last 10)",
      home: invLogit(logit(raw) + homeFieldLogit(sport) * 0.3),
      precision: ((nMargin >= 8 ? 3.0 : 2.4) * earlySeasonDamp(nMargin, sport)) || 0,
      family: "model",
      note: "How much they won or lost by in the last 10, recency-weighted. One-run baseball luck and 3-score football blowouts both get a truer read than W-L.",
    });
  } else {
    pushEmpty(layers, "margin", "Score-margin (last 10)", "Looked up last-10 scores for a margin read. Not enough box scores yet.");
  }

  const ht = homeRead?.trend ?? (homeForm?.games ? formTrend(homeForm.games) : "flat");
  const at = awayRead?.trend ?? (awayForm?.games ? formTrend(awayForm.games) : "flat");
  {
    let z = 0;
    if (ht === "rising") z += 0.045;
    if (ht === "falling") z -= 0.045;
    if (at === "rising") z -= 0.045;
    if (at === "falling") z += 0.045;
    pushLayer(layers, {
      id: "trend",
      label: "Form trend (last 10 split)",
      home: invLogit(z),
      precision: Math.abs(z) >= 0.02 ? 1.5 : 0.6,
      family: "context",
      note: `${input.home} is ${ht} · ${input.away} is ${at} (recent 5 vs older 5). Always ran. Light on purpose — books already shade recency.`,
      thin: Math.abs(z) < 0.02,
    });
  }

  const homeH2h = vsOpponent(homeForm?.games, input.away, homeForm?.seasonGames);
  const vsOpsHome = input.homeLooks?.vsOpp?.ops;
  const vsOpsAway = input.awayLooks?.vsOpp?.ops;
  if (homeH2h && homeH2h.n >= 1) {
    const wp = (homeH2h.wp * homeH2h.n + 2 * 0.5) / (homeH2h.n + 2);
    pushLayer(layers, {
      id: "h2h",
      label: "Head-to-head (live log + season)",
      home: Math.min(0.72, Math.max(0.28, wp)),
      precision: homeH2h.n >= 6 ? 1.8 : homeH2h.n >= 3 ? 1.3 : 0.9,
      family: "context",
      note: `${input.home} vs ${input.away}: ${homeH2h.n} meetings in the live log (${homeH2h.avgPf.toFixed(1)}–${homeH2h.avgPa.toFixed(1)}). Laplace-shrunk. Small sample — never a series story.`,
      thin: homeH2h.n < 3,
    });
  } else if (vsOpsHome != null && vsOpsAway != null) {
    const p = log5(Math.min(0.78, Math.max(0.22, vsOpsHome / (vsOpsHome + vsOpsAway))), Math.min(0.78, Math.max(0.22, vsOpsAway / (vsOpsHome + vsOpsAway))));
    pushLayer(layers, {
      id: "h2h",
      label: "Head-to-head (season split)",
      home: p,
      precision: 1.4,
      family: "context",
      note: `Live ESPN vs-opponent split: ${input.home} OPS ${vsOpsHome.toFixed(3)} vs ${input.away} OPS ${vsOpsAway.toFixed(3)}. Season H2H, not a last-10 sticker.`,
    });
  } else if (input.seriesHomeWins != null && input.seriesAwayWins != null && input.seriesHomeWins + input.seriesAwayWins >= 1) {
    const n = input.seriesHomeWins + input.seriesAwayWins;
    pushLayer(layers, {
      id: "h2h",
      label: "Head-to-head (this series)",
      home: (input.seriesHomeWins + 1) / (n + 2),
      precision: Math.min(1.6, 0.5 * n),
      family: "context",
      note: `This series ${input.home} ${input.seriesHomeWins}–${input.seriesAwayWins}. Looked up live meetings — using the series because the last-10 log has no extra games.`,
      thin: true,
    });
  } else {
    pushEmpty(layers, "h2h", "Head-to-head", `Looked up last-10, season vs-opponent split, and this series. ${input.home} and ${input.away} have no posted meetings yet.`);
  }

  const homeAtHome = splitByVenue(homeForm?.games, homeForm?.seasonGames).home;
  const awayOnRoad = splitByVenue(awayForm?.games, awayForm?.seasonGames).away;
  const homeSplitOps = input.homeLooks?.home?.ops;
  const awaySplitOps = input.awayLooks?.away?.ops;
  if (homeAtHome && awayOnRoad) {
    pushLayer(layers, {
      id: "venue-split",
      label: "Last-10 home vs road",
      home: invLogit(
        logit(log5(Math.min(0.8, Math.max(0.2, homeAtHome.wp)), Math.min(0.8, Math.max(0.2, awayOnRoad.wp)))) +
          homeFieldLogit(sport) * 0.15,
      ),
      precision: homeAtHome.n >= 3 && awayOnRoad.n >= 3 ? 1.6 : 1.0,
      family: "context",
      note: `${input.home} at home last ${homeAtHome.n}: ${Math.round(homeAtHome.wp * 100)}% · ${input.away} on the road last ${awayOnRoad.n}: ${Math.round(awayOnRoad.wp * 100)}%. Always ran from the live log.`,
      thin: homeAtHome.n < 3 || awayOnRoad.n < 3,
    });
  } else if (homeSplitOps != null && awaySplitOps != null) {
    pushLayer(layers, {
      id: "venue-split",
      label: "Home vs road (season split)",
      home: log5(Math.min(0.78, Math.max(0.22, homeSplitOps / (homeSplitOps + awaySplitOps))), Math.min(0.78, Math.max(0.22, awaySplitOps / (homeSplitOps + awaySplitOps)))),
      precision: 1.3,
      family: "context",
      note: `Live ESPN home/away splits: ${input.home} home OPS ${homeSplitOps.toFixed(3)} · ${input.away} road OPS ${awaySplitOps.toFixed(3)}.`,
    });
  } else if (homeSplit && awaySplit) {
    const raw = log5(homeSplit.wp, awaySplit.wp);
    pushLayer(layers, {
      id: "venue-split",
      label: "Home vs road (record split)",
      home: raw,
      precision: 1.1,
      family: "context",
      note: `Home split ${input.homeSplit} vs road split ${input.awaySplit}. Live record split — last-10 home/away boxes were thin.`,
      thin: true,
    });
  } else {
    pushEmpty(layers, "venue-split", "Last-10 home vs road", "Looked up last-10 home/away, ESPN home/away splits, and record splits. Not posted yet.");
  }

  const homeOuts = input.homeOuts ?? 0;
  const awayOuts = input.awayOuts ?? 0;
  const homeQ = input.homeQuestionable ?? 0;
  const awayQ = input.awayQuestionable ?? 0;
  {
    const diff = (awayOuts - homeOuts) * 1 + (awayQ - homeQ) * 0.35;
    const p = invLogit(0 + Math.max(-0.22, Math.min(0.22, diff * 0.038)));
    pushLayer(layers, {
      id: "injuries",
      label: "Out / IL listings",
      home: p,
      precision: homeOuts + awayOuts + homeQ + awayQ > 0 ? Math.min(3.4, 1.1 + 0.35 * (homeOuts + awayOuts)) : 0.9,
      family: "context",
      note:
        homeOuts + awayOuts + homeQ + awayQ > 0
          ? `${input.away} ${awayOuts} out${awayQ ? ` · ${awayQ} questionable` : ""} · ${input.home} ${homeOuts} out${homeQ ? ` · ${homeQ} questionable` : ""}. Count, not star-value.`
          : "ESPN injury report: nobody listed out. That is a look — not a missing card.",
      thin: homeOuts + awayOuts + homeQ + awayQ === 0,
    });
  }

  const homeRest = input.homeRestDays ?? restDays(homeForm, input.start);
  const awayRest = input.awayRestDays ?? restDays(awayForm, input.start);
  if (homeRest != null && awayRest != null) {
    const restLogit = restAdvantage(sport, homeRest, awayRest);
    pushLayer(layers, {
      id: "rest",
      label: "Rest / schedule",
      home: invLogit(restLogit),
      precision: Math.abs(restLogit) >= 0.015 ? (sport === "NBA" || sport === "NHL" || sport === "NCAAB" ? 3.2 : sport === "NFL" ? 2.4 : 1.3) : 0.7,
      family: "context",
      note: `${input.home} ${homeRest.toFixed(1)} days since last game · ${input.away} ${awayRest.toFixed(1)} days. Always ran from the live log.`,
      thin: Math.abs(restLogit) < 0.015,
    });
  } else {
    pushEmpty(layers, "rest", "Rest / schedule", "Looked up rest from the live log. Last-game dates not posted yet.");
  }

  if (input.seriesHomeWins != null && input.seriesAwayWins != null) {
    const n = input.seriesHomeWins + input.seriesAwayWins;
    if (n >= 2) {
      const raw = (input.seriesHomeWins + 0.5) / (n + 1);
      pushLayer(layers, {
        id: "series",
        label: "This series",
        home: raw,
        precision: Math.min(2.2, 0.7 * n),
        family: "context",
        note: `Head-to-head this series: ${input.home} ${input.seriesHomeWins}–${input.seriesAwayWins}. Small sample, shrunk toward 50/50.`,
      });
    }
  }

  const weatherShift = weatherLogit(sport, input.weatherTemp, input.weatherWind, input.weatherPrecip);
  if (weatherShift != null) {
    pushLayer(layers, {
      id: "weather",
      label: "Weather",
      home: invLogit(weatherShift),
      precision: 1.4,
      family: "context",
      note: weatherNote(sport, input.weatherTemp, input.weatherWind, input.weatherPrecip),
    });
  } else {
    const bits = [input.weatherTemp != null ? `${input.weatherTemp}°F` : null, input.weatherWind != null ? `wind ${input.weatherWind}` : null, input.weatherPrecip != null ? `rain ${input.weatherPrecip}%` : null].filter(Boolean);
    pushLayer(layers, {
      id: "weather",
      label: "Weather",
      home: 0.5,
      precision: bits.length ? 0.7 : 0,
      family: "context",
      note: bits.length
        ? `${bits.join(" · ")}. Weather on this sport moves totals more than winners — looked up, no ML lean.`
        : "Looked up live weather. Not posted (dome, or ESPN has no reading). Empty look, not a guess.",
      thin: true,
      empty: bits.length === 0,
    });
  }

  if (sport === "MLB") {
    const park = parkFactor(input.venue);
    if (park != null) {
      const betterHome = input.homeEra != null && input.awayEra != null ? input.homeEra < input.awayEra : (homeWp ?? 0.5) > (awayWp ?? 0.5);
      const towardBetter = park < 1 ? 0.035 : park > 1 ? -0.02 : 0;
      const p = invLogit((betterHome ? 1 : -1) * towardBetter);
      pushLayer(layers, {
        id: "park",
        label: "Ballpark",
        home: p,
        precision: Math.abs(park - 1) >= 0.04 ? 1.15 : 0.5,
        family: "context",
        note: `${input.venue ?? "This park"} factor ${park.toFixed(2)}. Always ran. Extreme parks add chaos; pitcher parks slightly help the better starter.`,
        thin: Math.abs(park - 1) < 0.04,
      });
    } else {
      pushEmpty(layers, "park", "Ballpark", "Looked up the venue factor. Park not posted on this event.");
    }
  }

  const ticketHome = unit01(input.ticketHome);
  const handleHome = unit01(input.handleHome);
  if (ticketHome != null) {
    pushLayer(layers, {
      id: "tickets",
      label: "Ticket count (bets %)",
      home: ticketHome,
      precision: 1.6,
      family: "crowd",
      note: `${Math.round(ticketHome * 100)}% of wagers (ticket count) on ${input.home}. This is the public. We never copy 80% of bets just because the crowd is loud.`,
    });
  }
  if (handleHome != null) {
    const diverge = ticketHome != null ? Math.abs(handleHome - ticketHome) : 0;
    const steam = Boolean(input.steam);
    pushLayer(layers, {
      id: "handle",
      label: "Handle (money %)",
      home: handleHome,
      precision: (steam ? 4.8 : 3.2) + Math.min(2.2, diverge * 8),
      family: "crowd",
      note:
        `${Math.round(handleHome * 100)}% of the dollars (handle) on ${input.home}` +
        (ticketHome != null
          ? `, vs ${Math.round(ticketHome * 100)}% of tickets.`
          : ".") +
        (diverge >= 0.07
          ? handleHome > (ticketHome ?? 0.5)
            ? " More money than tickets — the sharp tell. We use it; we do not auto-follow it."
            : " More tickets than money — the public is on this side. We do not fade just to fade."
          : " Tickets and dollars roughly agree.") +
        (steam ? " Line is steaming with the money." : ""),
    });
  }
  if (input.steam && handleHome != null && ticketHome != null && Math.abs(handleHome - ticketHome) >= 0.04) {
    pushLayer(layers, {
      id: "steam",
      label: "Steam / line move",
      home: handleHome,
      precision: 2.6,
      family: "market",
      note: "The number moved with the handle, not with the ticket count. Informed money, still not a lock.",
    });
  } else {
    pushEmpty(
      layers,
      "steam",
      "Steam / line move",
      input.steam
        ? "Line moved, but ticket/handle split is not posted. Looked; no second confirmation."
        : "Looked up open→close and handle. No steam on this delayed print.",
    );
  }
  if (ticketHome == null) {
    pushEmpty(layers, "tickets", "Ticket count (bets %)", "Looked up live ticket-count %. Not posted on this delayed board.");
  }
  if (handleHome == null) {
    pushEmpty(layers, "handle", "Handle (money %)", "Looked up live handle %. Not posted on this delayed board.");
  }

  const homeOff = underlyingOffense(input.homeLooks?.last7) ?? underlyingOffense(input.homeLooks?.season);
  const awayOff = underlyingOffense(input.awayLooks?.last7) ?? underlyingOffense(input.awayLooks?.season);
  const homePit = underlyingPitch(input.homeLooks?.last7) ?? underlyingPitch(input.homeLooks?.season);
  const awayPit = underlyingPitch(input.awayLooks?.last7) ?? underlyingPitch(input.awayLooks?.season);
  if (homeOff != null && awayOff != null) {
    const used7 = Boolean(input.homeLooks?.last7 && input.awayLooks?.last7);
    pushLayer(layers, {
      id: "underlying",
      label: "Underlying (OBP + ISO / FIP-style)",
      home: invLogit(logit(log5(homeOff, awayOff)) + (homePit != null && awayPit != null ? logit(log5(homePit, awayPit)) * 0.35 : 0)),
      precision: used7 ? 3.2 : 2.6,
      family: "model",
      note: used7
        ? `Last-7 OBP+ISO (and pitcher quality) vs season. This is the xG-style look: process, not just runs that already scored. Live ESPN splits.`
        : `Season OBP+ISO / pitcher quality. Process over results. Live ESPN statistics.`,
    });
  } else {
    pushEmpty(layers, "underlying", "Underlying (OBP + ISO / FIP-style)", "Looked up live ISO/OBP/ERA/WHIP. Not posted for this sport/event yet.");
  }

  const awayDef = defenseAllowed(input.awayLooks, sport);
  const homeDef = defenseAllowed(input.homeLooks, sport);
  if (awayDef != null && homeDef != null) {
    const p = invLogit(logit(0.5) + (awayDef - homeDef) * (sport === "MLB" ? 0.18 : 0.08));
    pushLayer(layers, {
      id: "defense",
      label: "Opponent-adjusted defense",
      home: p,
      precision: 2.8,
      family: "model",
      note: sport === "MLB"
        ? `Opponent ERA/OPS allowed from live ESPN team stats (last-7 blended when posted). ${input.away} pitching quality vs ${input.home} pitching quality.`
        : `Opponent scoring/yards allowed from live ESPN team stats.`,
    });
  } else if (homeL10?.avgPa && awayL10?.avgPa) {
    const p = invLogit(logit(0.5) + ((awayL10.avgPa - homeL10.avgPa) / marginSigma(sport)) * 0.15);
    pushLayer(layers, {
      id: "defense",
      label: "Opponent-adjusted defense (last 10)",
      home: p,
      precision: 2.0,
      family: "model",
      note: `Last-10 points/runs allowed: ${input.home} ${homeL10.avgPa.toFixed(1)} · ${input.away} ${awayL10.avgPa.toFixed(1)}. Live log.`,
    });
  } else {
    pushEmpty(layers, "defense", "Opponent-adjusted defense", "Looked up opponent ERA / OPS allowed / points allowed. Not posted yet.");
  }

  const awayHand = input.awayPitcherHand;
  const homeHand = input.homePitcherHand;
  const homeVs = awayHand === "L" ? input.homeLooks?.vsLeft : awayHand === "R" ? input.homeLooks?.vsRight : undefined;
  const awayVs = homeHand === "L" ? input.awayLooks?.vsLeft : homeHand === "R" ? input.awayLooks?.vsRight : undefined;
  if (homeVs?.ops != null && awayVs?.ops != null) {
    pushLayer(layers, {
      id: "platoon",
      label: "Pitcher vs batter (vs L/R)",
      home: log5(Math.min(0.8, Math.max(0.2, homeVs.ops / (homeVs.ops + awayVs.ops))), Math.min(0.8, Math.max(0.2, awayVs.ops / (homeVs.ops + awayVs.ops)))),
      precision: 2.2,
      family: "model",
      note: `${input.home} OPS vs ${awayHand ?? "?"}HP ${homeVs.ops.toFixed(3)} · ${input.away} OPS vs ${homeHand ?? "?"}HP ${awayVs.ops.toFixed(3)}. Live ESPN platoon split — the pitcher-vs-batter look we can actually fetch.`,
    });
  } else {
    pushEmpty(
      layers,
      "platoon",
      "Pitcher vs batter (vs L/R)",
      sport === "MLB"
        ? "Looked up vs-LHP / vs-RHP splits and probable handedness. Hand or split not posted yet."
        : "Looked up pitcher-vs-batter / vs-hand. This sport does not post a platoon split — empty look, not a skip.",
    );
  }

  const process = processFromLooks(sport, input.homeLooks, input.awayLooks);
  pushLayer(layers, {
    id: "process",
    label: process.source,
    home: process.home,
    precision: process.empty ? 0 : 2.4,
    family: "model",
    note: process.note,
    thin: process.empty,
    empty: process.empty,
  });

  if (!layers.length) return null;

  const pooled = poolLayers(layers, input.oddsHome ?? input.bookHome, input.layerHaircuts);
  let home = pooled.mean;

  // High totals = more chaos = pull slightly toward a coin flip.
  if (input.total != null && input.total > 0) {
    const avg = leagueTotal(sport);
    const chaos = Math.max(0, Math.min(0.22, (input.total - avg) / (avg * 4)));
    home = 0.5 + (home - 0.5) * (1 - chaos);
  }

  home = Math.min(FINAL_HI, Math.max(FINAL_LO, home));

  const n = layers.length;
  const std = pooled.std;
  const agreement = Math.max(0, 1 - std / 0.14);
  const families = new Set(layers.map((l) => l.family)).size;
  const confidence: ChanceReport["confidence"] =
    n >= 6 && families >= 3 && std < 0.05 && pooled.posteriorVar < 0.012
      ? "high"
      : n >= 3 && std < 0.1
        ? "medium"
        : "low";

  const favorite: "home" | "away" = home >= 0.5 ? "home" : "away";
  const favoriteName = favorite === "home" ? input.home : input.away;
  const chance = favorite === "home" ? home : 1 - home;
  const crowd = layers.filter((l) => l.family === "crowd");
  const crowdHome =
    crowd.length > 0
      ? invLogit(crowd.reduce((s, l) => s + logit(l.home) * l.precision, 0) / crowd.reduce((s, l) => s + l.precision, 0))
      : undefined;
  const market = layers.find((l) => l.id === "market")?.home ?? layers.find((l) => l.id === "book")?.home;
  const names = layers.map((l) => l.label).join(", ");
  const because =
    `${n} independent looks across ${families} families (${names}). ` +
    `Pooled in log-odds, weighted by how precise each look is. ` +
    (pooled.overdispersed || agreement < 0.45
      ? `Sources disagree (agreement ${Math.round(agreement * 100)} in 100), so non-market layers were shrunk toward the sportsbook. `
      : `Sources mostly agree (agreement ${Math.round(agreement * 100)} in 100). `) +
    `Confidence ${confidence}. Still not a lock — about ${Math.round((1 - chance) * 100)} in 100 the other side wins. ` +
    `Kalshi and Polymarket are prediction contracts for research, not a Hard Rock fill. Public data does not beat a liquid close.`;

  return {
    home,
    away: 1 - home,
    favorite,
    favoriteName,
    chance,
    confidence,
    agreement,
    layers,
    marketHome: market,
    crowdHome,
    posteriorVar: pooled.posteriorVar,
    because,
  };
}

function scoringRate(pf: number | undefined, n: number | undefined, sport: string): number | null {
  if (pf == null || !(pf > 0)) return null;
  const half = leagueTotal(sport) / 2;
  if (n && n >= 5 && pf > half * 2.5) return pf / n;
  return pf;
}

function restAdvantage(sport: string, homeDays: number, awayDays: number): number {
  const b2b = (d: number) => d < 1.15;
  if (sport === "NBA" || sport === "NHL" || sport === "NCAAB") {
    let z = 0;
    if (b2b(homeDays) && !b2b(awayDays)) z -= 0.16;
    if (b2b(awayDays) && !b2b(homeDays)) z += 0.16;
    if (homeDays >= 3 && awayDays < 1.6) z += 0.05;
    if (awayDays >= 3 && homeDays < 1.6) z -= 0.05;
    return z;
  }
  if (sport === "NFL" || sport === "NCAAF") {
    let z = 0;
    if (homeDays >= 13 && awayDays < 9) z += 0.08; // bye vs short week
    if (awayDays >= 13 && homeDays < 9) z -= 0.08;
    if (homeDays <= 4 && awayDays >= 6) z -= 0.05;
    if (awayDays <= 4 && homeDays >= 6) z += 0.05;
    return z;
  }
  // MLB: extra rest after a travel day is tiny. A bullpen that just worked last
  // night (B2B) is a real Dimers/FanGraphs-style feature — fatigue index.
  if (sport === "MLB") {
    let z = (homeDays - awayDays) * 0.02;
    if (homeDays < 1.15 && awayDays >= 1.5) z -= 0.08;
    if (awayDays < 1.15 && homeDays >= 1.5) z += 0.08;
    return Math.max(-0.12, Math.min(0.12, z));
  }
  return Math.max(-0.06, Math.min(0.06, (homeDays - awayDays) * 0.015));
}

function weatherLogit(
  sport: string,
  temp?: number,
  wind?: number,
  precip?: number,
): number | null {
  if (temp == null && wind == null && precip == null) return null;
  if (sport === "NBA" || sport === "NHL" || sport === "NCAAB") return null;
  const t = temp ?? 70;
  void wind;
  void precip;
  if (sport === "MLB") {
    // Weather moves totals more than winners. Do not mint a fake ML lean from wind.
    return null;
  }
  // Football: wind/rain move totals and the air game, not the moneyline.
  // Cold is a small home logit (travel + crowd). Heat is a small fade.
  if (t <= 32) return 0.04;
  if (t >= 95) return -0.015;
  return null;
}

function weatherNote(sport: string, temp?: number, wind?: number, precip?: number): string {
  const bits = [
    temp != null ? `${temp}°F` : null,
    wind != null ? `wind ${wind} mph` : null,
    precip != null ? `rain ${precip}%` : null,
  ].filter(Boolean);
  if (sport === "MLB") {
    return `${bits.join(" · ")}. Weather moves totals, HR, and Ks more than winners. We do not flip a moneyline on wind.`;
  }
  if (sport === "NFL" || sport === "NCAAF") {
    return `${bits.join(" · ")}. Wind is a passing-EPA and total modifier, not an ML party trick. Cold slightly helps the home sideline.`;
  }
  return `${bits.join(" · ")}. Indoor sports: no ML lean from weather.`;
}

function poolLayers(
  layers: ChanceLayer[],
  marketHome?: number,
  haircuts?: Record<string, number>,
): { mean: number; std: number; posteriorVar: number; overdispersed: boolean } {
  const active = layers
    .map((l) => {
      const h = haircuts?.[l.id];
      if (h == null || h === 1 || !Number.isFinite(h)) return l;
      return { ...l, precision: l.precision * Math.max(0, h) };
    })
    .filter((l) => l.precision > 0 && !l.empty);
  if (!active.length) {
    return { mean: 0.5, std: 0, posteriorVar: 1, overdispersed: false };
  }
  const precSum0 = active.reduce((s, l) => s + l.precision, 0);
  const logitMean0 = active.reduce((s, l) => s + logit(l.home) * l.precision, 0) / precSum0;

  const meanP = active.reduce((s, l) => s + l.home, 0) / active.length;
  const variance = active.reduce((s, l) => s + (l.home - meanP) ** 2, 0) / active.length;
  const std = Math.sqrt(variance);

  // χ²-style overdispersion: if residual log-odds are fat, scale non-market precision down.
  let chi = 0;
  for (const l of active) chi += l.precision * (logit(l.home) - logitMean0) ** 2;
  const df = Math.max(1, active.length - 1);
  const overdispersed = chi / df > 1.35;

  const scaled = active.map((l) => {
    if (!overdispersed) return l;
    if (l.family === "market") return l;
    const shrink = Math.max(0.35, 1.35 / (chi / df));
    return { ...l, precision: l.precision * shrink };
  });

  // Extra James-Stein pull toward the sportsbook when the crowd/models wander.
  const precSum = scaled.reduce((s, l) => s + l.precision, 0);
  let z = scaled.reduce((s, l) => s + logit(l.home) * l.precision, 0) / precSum;
  if (marketHome != null && overdispersed) {
    const lambda = Math.min(0.55, 0.18 + 0.5 * Math.max(0, 1 - Math.max(0, 1 - std / 0.14)));
    z = lambda * logit(marketHome) + (1 - lambda) * z;
  }

  return {
    mean: invLogit(z, FINAL_LO, FINAL_HI),
    std,
    posteriorVar: 1 / precSum,
    overdispersed,
  };
}
