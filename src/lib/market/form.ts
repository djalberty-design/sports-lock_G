/**
 * Last-N game SCORES — live analysis, not a canned card.
 *
 * Colleague rule: "Scores of last 10 games… it needs to be an analysis."
 * Recency-weighted EWMA on actual runs/points, not a W-L sticker.
 * Pure functions. Same games in → same numbers out. Every time.
 */

export type ScoreGame = {
  date?: string;
  result: string;
  pf?: number;
  pa?: number;
  opponent?: string;
  homeAway?: "home" | "away";
};

export type FormTape = {
  team: string;
  line: string;
  results: string[];
  games: ScoreGame[];
  /** Full completed season — H2H and home/road look here, not only the last 10. */
  seasonGames?: ScoreGame[];
};

export type FormTrend = "rising" | "falling" | "flat";

export type FormRead = {
  n: number;
  wp: number;
  avgPf: number;
  avgPa: number;
  avgMargin: number;
  trend: FormTrend;
  line: string;
  games: ScoreGame[];
};

/** ESPN posts scores as a number, a string, or `{ value, displayValue }`. Never Number(object). */
export function parseEspnScore(raw: unknown): number | undefined {
  if (raw == null) return undefined;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string") {
    const n = Number(raw.replace(/[^0-9.+-]/g, ""));
    return Number.isFinite(n) ? n : undefined;
  }
  if (typeof raw === "object") {
    const o = raw as { value?: unknown; displayValue?: unknown; display?: unknown };
    return parseEspnScore(o.value ?? o.displayValue ?? o.display);
  }
  return undefined;
}
export function ewmaWeights(n: number, lambda = 0.82): number[] {
  const raw = Array.from({ length: Math.max(0, n) }, (_, i) => lambda ** i);
  const den = raw.reduce((s, w) => s + w, 0) || 1;
  return raw.map((w) => w / den);
}

/** Recency-weighted mean. Index 0 = latest. Same numbers in → same mean out. */
export function ewmaMean(values: number[], lambda = 0.82): number | null {
  const xs = values.filter((n) => Number.isFinite(n));
  if (!xs.length) return null;
  const w = ewmaWeights(xs.length, lambda);
  return xs.reduce((s, n, i) => s + n * (w[i] ?? 0), 0);
}

/** NFL recency weight: w = 0.60 × min(1, n_games / 6). Other sports: 1. */
export function earlySeasonDamp(nGames: number, sport: string): number {
  if (sport !== "NFL") return 1;
  const n = Number.isFinite(nGames) ? Math.max(0, nGames) : 0;
  return 0.6 * Math.min(1, n / 6);
}

export function analyzeScores(games: ScoreGame[], take = 10, minN = 2): FormRead | null {
  const scored = games.filter((g) => g.result === "W" || g.result === "L").slice(0, take);
  if (scored.length < minN) return null;
  const w = ewmaWeights(scored.length);
  let wp = 0;
  let pf = 0;
  let pa = 0;
  let hasScore = 0;
  scored.forEach((g, i) => {
    wp += (g.result === "W" ? 1 : 0) * w[i]!;
    if (g.pf != null && g.pa != null && Number.isFinite(g.pf) && Number.isFinite(g.pa)) {
      pf += g.pf * w[i]!;
      pa += g.pa * w[i]!;
      hasScore += w[i]!;
    }
  });
  const avgPf = hasScore > 0 ? pf / hasScore : 0;
  const avgPa = hasScore > 0 ? pa / hasScore : 0;
  return {
    n: scored.length,
    wp,
    avgPf,
    avgPa,
    avgMargin: avgPf - avgPa,
    trend: formTrend(scored),
    line: formatScoreLine(scored),
    games: scored,
  };
}

/** First half of the window (older) vs the most recent half. */
export function formTrend(games: ScoreGame[]): FormTrend {
  const scored = games.filter((g) => g.result === "W" || g.result === "L");
  if (scored.length < 6) return "flat";
  const recent = scored.slice(0, Math.ceil(scored.length / 2));
  const older = scored.slice(Math.ceil(scored.length / 2));
  const wp = (xs: ScoreGame[]) => xs.filter((g) => g.result === "W").length / xs.length;
  const d = wp(recent) - wp(older);
  if (d >= 0.2) return "rising";
  if (d <= -0.2) return "falling";
  return "flat";
}

export function formatScoreLine(games: ScoreGame[]): string {
  return games
    .slice(0, 10)
    .map((g) => {
      const score = g.pf != null && g.pa != null ? ` ${g.pf}-${g.pa}` : "";
      const vs = g.opponent ? ` ${g.opponent}` : "";
      const loc = g.homeAway === "away" ? " @" : g.homeAway === "home" ? " vs" : "";
      return `${g.result}${score}${loc}${vs}`.trim();
    })
    .join(" · ");
}

export function formatFormRead(read: FormRead, team: string): string {
  const trend =
    read.trend === "rising" ? "improving" : read.trend === "falling" ? "cooling" : "steady";
  const margin = `${read.avgMargin >= 0 ? "+" : ""}${read.avgMargin.toFixed(1)}`;
  return `${team} last ${read.n}: recency-weighted ${Math.round(read.wp * 100)}% · ${read.avgPf.toFixed(1)}–${read.avgPa.toFixed(1)} (${margin}/g) · ${trend}. Latest counts most.`;
}

/**
 * Last-10 expected combined score: each side's recency-weighted offense vs
 * the other's recency-weighted defense. Used to nudge totals and periods.
 */
export function last10ExpectedTotal(
  form: Array<{ team: string; games?: ScoreGame[] }> | undefined,
  home: string,
  away: string,
): number | null {
  if (!form?.length) return null;
  const block = (name: string) =>
    form.find((b) => b.team.toLowerCase() === name.toLowerCase()) ??
    form.find((b) => name.toLowerCase().includes(b.team.toLowerCase()) || b.team.toLowerCase().includes(name.toLowerCase()));
  const h = analyzeScores(block(home)?.games ?? []);
  const a = analyzeScores(block(away)?.games ?? []);
  if (!h || !a || !(h.avgPf > 0) || !(a.avgPf > 0)) return null;
  const homeScore = (h.avgPf + a.avgPa) / 2;
  const awayScore = (a.avgPf + h.avgPa) / 2;
  const tot = homeScore + awayScore;
  return tot > 0 ? tot : null;
}

/** Opponent on a score log is usually an abbreviation. Team on the ticket is a full name. */
export function opponentMatches(opponent: string | undefined, team: string): boolean {
  if (!opponent || !team) return false;
  const o = opponent.toLowerCase().replace(/[^a-z0-9]/g, "");
  const t = team.toLowerCase();
  if (o.length < 2) return false;
  const compact = t.replace(/[^a-z0-9]/g, "");
  if (compact.includes(o) || o.includes(compact)) return true;
  const words = t.split(/\s+/).map((w) => w.replace(/[^a-z]/g, "")).filter(Boolean);
  if (words.some((w) => w === o || w.startsWith(o) || (o.length >= 3 && w.startsWith(o.slice(0, 3))))) return true;
  const initials = words.map((w) => w[0]).join("");
  if (o === initials) return true;
  const last = words[words.length - 1] ?? "";
  if (last.length >= 3 && (o.startsWith(last.slice(0, 3)) || last.startsWith(o))) return true;
  return false;
}

/** Games against this opponent — last-10 first, then the rest of the season log. */
export function vsOpponent(
  games: ScoreGame[] | undefined,
  opponent: string,
  seasonGames?: ScoreGame[],
): FormRead | null {
  if (!opponent) return null;
  const pool = [...(games ?? []), ...(seasonGames ?? []).filter((g) => !(games ?? []).some((x) => x.date && x.date === g.date))];
  if (!pool.length) return null;
  const hit = pool.filter((g) => opponentMatches(g.opponent, opponent));
  return analyzeScores(hit, 20, 1);
}

export function splitByVenue(
  games: ScoreGame[] | undefined,
  seasonGames?: ScoreGame[],
): { home: FormRead | null; away: FormRead | null } {
  const list = (games?.length ? games : seasonGames) ?? [];
  const season = seasonGames ?? [];
  const homeGames = list.filter((g) => g.homeAway === "home");
  const awayGames = list.filter((g) => g.homeAway === "away");
  return {
    home: analyzeScores(homeGames.length >= 2 ? homeGames : season.filter((g) => g.homeAway === "home"), 15, 2),
    away: analyzeScores(awayGames.length >= 2 ? awayGames : season.filter((g) => g.homeAway === "away"), 15, 2),
  };
}

export function blendRate(season: number | undefined, recent: number | undefined): number | undefined {
  if (recent != null && Number.isFinite(recent) && season != null && Number.isFinite(season)) {
    return 0.6 * recent + 0.4 * season;
  }
  if (recent != null && Number.isFinite(recent)) return recent;
  if (season != null && Number.isFinite(season)) return season;
  return undefined;
}

export function mergeForm(primary: FormTape[], extra: Array<FormTape | null | undefined>): FormTape[] {
  const by = new Map<string, FormTape>();
  for (const b of primary) {
    if (b.team) by.set(b.team.toLowerCase(), b);
  }
  for (const b of extra) {
    if (!b?.team) continue;
    const key = b.team.toLowerCase();
    const have = by.get(key);
    if (!have || (b.games?.length ?? 0) > (have.games?.length ?? 0)) {
      by.set(key, {
        ...b,
        seasonGames: b.seasonGames?.length ? b.seasonGames : have?.seasonGames,
      });
    } else if ((b.seasonGames?.length ?? 0) > (have.seasonGames?.length ?? 0)) {
      by.set(key, { ...have, seasonGames: b.seasonGames });
    }
  }
  return [...by.values()];
}
