const GAMMA = "https://gamma-api.polymarket.com";
const UA = "Mozilla/5.0 (compatible; SportsLock/1.0; +https://x.ai)";

/** Polymarket sports series ids (Gamma /sports). */
const SERIES: Record<string, string> = {
  MLB: "3",
  NFL: "10187",
  NCAAF: "12756",
  NBA: "10345",
  NHL: "10346",
};

export type PolyContract = {
  sport: string;
  title: string;
  slug: string;
  homeName: string;
  awayName: string;
  home: number;
  away: number;
  volume: number;
  end?: string;
  start?: string;
};

export type PolyMatch = {
  home: number;
  volume: number;
  slug: string;
};

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type GammaMarket = {
  question?: string;
  sportsMarketType?: string;
  outcomes?: string | string[];
  outcomePrices?: string | string[];
  volume?: string | number;
  volumeNum?: number;
  closed?: boolean;
};

type GammaEvent = {
  title?: string;
  slug?: string;
  startDate?: string;
  endDate?: string;
  volume?: string | number;
  markets?: GammaMarket[];
};

function parseList(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((x) => String(x));
  if (typeof raw === "string") {
    try {
      const v = JSON.parse(raw);
      if (Array.isArray(v)) return v.map((x) => String(x));
    } catch {
      return [];
    }
  }
  return [];
}

function parsePrice(raw: string | undefined): number | undefined {
  if (raw == null) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0.02 && n < 0.98 ? n : undefined;
}

function ymd(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function daysAgo(n: number): string {
  return ymd(new Date(Date.now() - n * 86400_000));
}

function isMoneyline(m: GammaMarket, slug?: string): boolean {
  if (slug && /player-prop|props|total|spread|ou-|o-u/i.test(slug)) return false;
  const kind = (m.sportsMarketType || "").toLowerCase();
  if (kind && kind !== "moneyline" && kind !== "ml") return false;
  if (kind === "moneyline" || kind === "ml") return true;
  const q = (m.question || "").toLowerCase();
  if (/o\/u|over\/under|spread|player|home runs|strikeouts|passing/.test(q)) return false;
  const outcomes = parseList(m.outcomes);
  return outcomes.length === 2 && !outcomes.some((o) => /^(yes|no|over|under)$/i.test(o.trim()));
}

function contractFromEvent(ev: GammaEvent, sport: string): PolyContract | null {
  if (!ev.title || !ev.slug) return null;
  if (/player-prop/i.test(ev.slug)) return null;
  const market = (ev.markets ?? []).find((m) => isMoneyline(m, ev.slug));
  if (!market) return null;
  const outcomes = parseList(market.outcomes);
  const prices = parseList(market.outcomePrices);
  if (outcomes.length < 2 || prices.length < 2) return null;
  const p0 = parsePrice(prices[0]);
  const p1 = parsePrice(prices[1]);
  if (p0 == null || p1 == null) return null;
  const sum = p0 + p1;
  if (sum <= 0) return null;
  const volume = Number(market.volumeNum ?? market.volume ?? ev.volume ?? 0);
  return {
    sport,
    title: ev.title,
    slug: ev.slug,
    awayName: outcomes[0],
    homeName: outcomes[1],
    away: p0 / sum,
    home: p1 / sum,
    volume: Number.isFinite(volume) ? volume : 0,
    end: ev.endDate,
    start: ev.startDate,
  };
}

async function fetchSeries(sport: string, seriesId: string): Promise<GammaEvent[]> {
  const url = `${GAMMA}/events?series_id=${encodeURIComponent(seriesId)}&closed=false&active=true&limit=50&end_date_min=${daysAgo(1)}`;
  const data = await fetchJson<GammaEvent[] | { events?: GammaEvent[] }>(url);
  if (Array.isArray(data)) return data;
  return data?.events ?? [];
}

export async function fetchPolymarketContracts(): Promise<PolyContract[]> {
  const sports = Object.keys(SERIES);
  const pages = await Promise.all(
    sports.map(async (sport) => {
      const events = await fetchSeries(sport, SERIES[sport]);
      return { sport, events };
    }),
  );
  const out: PolyContract[] = [];
  const seen = new Set<string>();
  for (const page of pages) {
    for (const ev of page.events) {
      const c = contractFromEvent(ev, page.sport);
      if (!c || seen.has(c.slug)) continue;
      seen.add(c.slug);
      out.push(c);
    }
  }
  return out;
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function teamHit(needle: string, hay: string, abbr?: string): boolean {
  const n = norm(needle);
  const h = norm(hay);
  if (!n || !h) return false;
  if (h === n || h.includes(n) || n.includes(h)) return true;
  const last = n.split(" ").pop() ?? "";
  if (last.length >= 4 && h.includes(last)) return true;
  if (abbr && (h === norm(abbr) || h.includes(norm(abbr)))) return true;
  return false;
}

function slugDate(slug: string): string | undefined {
  const m = /(\d{4}-\d{2}-\d{2})/.exec(slug);
  return m?.[1];
}

function closeDate(contract: PolyContract, start?: string): boolean {
  if (!start) return true;
  const gameDay = start.slice(0, 10);
  const slugDay = slugDate(contract.slug);
  if (slugDay) {
    const dg = new Date(`${gameDay}T12:00:00Z`).getTime();
    const ds = new Date(`${slugDay}T12:00:00Z`).getTime();
    if (Number.isFinite(dg) && Number.isFinite(ds)) return Math.abs(dg - ds) <= 2 * 86400_000;
  }
  const end = contract.end ? new Date(contract.end).getTime() : NaN;
  const startMs = new Date(start).getTime();
  if (Number.isFinite(end) && Number.isFinite(startMs)) {
    // Polymarket series markets often span a whole homestand. Accept if the game sits inside the window.
    const begin = contract.start ? new Date(contract.start).getTime() : end - 14 * 86400_000;
    return startMs >= begin - 12 * 3600_000 && startMs <= end + 12 * 3600_000;
  }
  return true;
}

export async function fetchPolymarketBySlug(slug: string, sport: string): Promise<PolyContract | null> {
  const data = await fetchJson<GammaEvent[] | GammaEvent>(`${GAMMA}/events?slug=${encodeURIComponent(slug)}`);
  const ev = Array.isArray(data) ? data[0] : data;
  if (!ev || typeof ev !== "object") return null;
  return contractFromEvent(ev as GammaEvent, sport);
}

export function guessPolySlug(sport: string, awayAbbr?: string, homeAbbr?: string, start?: string): string | null {
  if (!awayAbbr || !homeAbbr || !start) return null;
  const day = start.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
  const prefix = sport === "NCAAF" ? "cfb" : sport.toLowerCase();
  return `${prefix}-${awayAbbr.toLowerCase()}-${homeAbbr.toLowerCase()}-${day}`;
}

export function polymarketHomeWin(
  contracts: PolyContract[],
  opts: { sport: string; home: string; away: string; homeAbbr?: string; awayAbbr?: string; start?: string },
): PolyMatch | undefined {
  const pool = contracts.filter((c) => c.sport === opts.sport && closeDate(c, opts.start));
  let best: { score: number; match: PolyMatch } | null = null;
  for (const c of pool) {
    const homeOnHome = teamHit(opts.home, c.homeName, opts.homeAbbr);
    const awayOnAway = teamHit(opts.away, c.awayName, opts.awayAbbr);
    const homeOnAway = teamHit(opts.home, c.awayName, opts.homeAbbr);
    const awayOnHome = teamHit(opts.away, c.homeName, opts.awayAbbr);
    let homeP: number | undefined;
    let score = 0;
    if (homeOnHome && awayOnAway) {
      homeP = c.home;
      score = 3;
    } else if (homeOnAway && awayOnHome) {
      homeP = c.away;
      score = 3;
    } else if (homeOnHome && teamHit(opts.away, c.title, opts.awayAbbr)) {
      homeP = c.home;
      score = 2;
    } else if (homeOnAway && teamHit(opts.away, c.title, opts.awayAbbr)) {
      homeP = c.away;
      score = 2;
    }
    if (homeP == null || score < 2) continue;
    if (slugDate(c.slug) && opts.start && slugDate(c.slug) === opts.start.slice(0, 10)) score += 1;
    const match: PolyMatch = { home: homeP, volume: c.volume, slug: c.slug };
    if (!best || score > best.score) best = { score, match };
  }
  return best?.match;
}
