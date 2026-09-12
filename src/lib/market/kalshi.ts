const KALSHI = "https://api.elections.kalshi.com/trade-api/v2";
const UA = "Mozilla/5.0 (compatible; SportsLock/1.0; +https://x.ai)";

const SERIES: Record<string, string> = {
  MLB: "KXMLBGAME",
  NFL: "KXNFLGAME",
  NCAAF: "KXNCAAFGAME",
  NBA: "KXNBAGAME",
  NHL: "KXNHLGAME",
};

export type KalshiSide = {
  ticker: string;
  eventTicker: string;
  label: string;
  code: string;
  mid: number;
  bid?: number;
  ask?: number;
  volume: number;
  openInterest: number;
  occurrence?: string;
};

export type KalshiContract = {
  eventTicker: string;
  sport: string;
  sides: KalshiSide[];
  occurrence?: string;
};

export type KalshiMatch = {
  home: number;
  volume: number;
  spread: number;
  ticker: string;
};

function numDollars(raw: unknown): number | undefined {
  if (raw == null || raw === "") return undefined;
  const n = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(n) && n > 0 && n < 1 ? n : undefined;
}

function numFp(raw: unknown): number {
  if (raw == null || raw === "") return 0;
  const n = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function midPrice(m: {
  yes_bid_dollars?: string;
  yes_ask_dollars?: string;
  last_price_dollars?: string;
}): { mid: number; bid?: number; ask?: number } | undefined {
  const bid = numDollars(m.yes_bid_dollars);
  const ask = numDollars(m.yes_ask_dollars);
  const last = numDollars(m.last_price_dollars);
  if (bid != null && ask != null) return { mid: (bid + ask) / 2, bid, ask };
  const mid = last ?? bid ?? ask;
  if (mid == null) return undefined;
  return { mid, bid, ask };
}

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

type KalshiMarketRaw = {
  ticker?: string;
  event_ticker?: string;
  yes_sub_title?: string;
  yes_bid_dollars?: string;
  yes_ask_dollars?: string;
  last_price_dollars?: string;
  status?: string;
  volume_fp?: string | number;
  open_interest_fp?: string | number;
  occurrence_datetime?: string;
};

function codeFromTicker(ticker: string): string {
  const dash = ticker.lastIndexOf("-");
  return dash >= 0 ? ticker.slice(dash + 1).toUpperCase() : "";
}

async function fetchSeriesMarkets(series: string): Promise<KalshiMarketRaw[]> {
  const out: KalshiMarketRaw[] = [];
  let cursor = "";
  for (let page = 0; page < 3; page++) {
    const q = new URL(`${KALSHI}/markets`);
    q.searchParams.set("limit", "200");
    q.searchParams.set("status", "open");
    q.searchParams.set("series_ticker", series);
    if (cursor) q.searchParams.set("cursor", cursor);
    const data = await fetchJson<{ markets?: KalshiMarketRaw[]; cursor?: string }>(q.toString());
    const batch = data?.markets ?? [];
    out.push(...batch);
    if (!data?.cursor || batch.length < 50) break;
    cursor = data.cursor;
  }
  return out;
}

export async function fetchKalshiContracts(): Promise<KalshiContract[]> {
  const sports = Object.keys(SERIES);
  const pages = await Promise.all(sports.map(async (sport) => ({ sport, markets: await fetchSeriesMarkets(SERIES[sport]) })));

  const byEvent = new Map<string, KalshiContract>();
  for (const page of pages) {
    for (const m of page.markets) {
      if (!m.ticker || !m.event_ticker) continue;
      const priced = midPrice(m);
      if (!priced) continue;
      const side: KalshiSide = {
        ticker: m.ticker,
        eventTicker: m.event_ticker,
        label: m.yes_sub_title || "",
        code: codeFromTicker(m.ticker),
        mid: priced.mid,
        bid: priced.bid,
        ask: priced.ask,
        volume: numFp(m.volume_fp),
        openInterest: numFp(m.open_interest_fp),
        occurrence: m.occurrence_datetime,
      };
      const cur =
        byEvent.get(m.event_ticker) ??
        ({ eventTicker: m.event_ticker, sport: page.sport, sides: [], occurrence: m.occurrence_datetime } satisfies KalshiContract);
      cur.sides.push(side);
      if (!cur.occurrence && m.occurrence_datetime) cur.occurrence = m.occurrence_datetime;
      byEvent.set(m.event_ticker, cur);
    }
  }

  const out: KalshiContract[] = [];
  for (const c of byEvent.values()) {
    if (c.sides.length < 2) continue;
    const sum = c.sides.reduce((s, x) => s + x.mid, 0);
    if (sum > 0) {
      for (const s of c.sides) s.mid = s.mid / sum;
    }
    out.push(c);
  }
  return out;
}

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter((w) => w.length >= 3);
}

function overlap(a: string, b: string): number {
  const ta = new Set(tokens(a));
  const tb = new Set(tokens(b));
  if (!ta.size || !tb.size) return 0;
  let n = 0;
  for (const t of ta) if (tb.has(t)) n++;
  return n / Math.max(ta.size, tb.size);
}

function closeInTime(occurrence?: string, start?: string): boolean {
  if (!occurrence || !start) return true;
  const a = new Date(occurrence).getTime();
  const b = new Date(start).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) return true;
  return Math.abs(a - b) < 20 * 3600_000;
}

export function kalshiHomeWin(
  contracts: KalshiContract[],
  opts: { sport: string; home: string; away: string; homeAbbr?: string; awayAbbr?: string; start?: string },
): KalshiMatch | undefined {
  const pool = contracts.filter((c) => c.sport === opts.sport);
  let best: { score: number; match: KalshiMatch } | null = null;
  for (const c of pool) {
    if (!closeInTime(c.occurrence, opts.start)) continue;
    const homeSide = c.sides.find((s) => matchSide(s, opts.home, opts.homeAbbr));
    const awaySide = c.sides.find((s) => matchSide(s, opts.away, opts.awayAbbr));
    if (!homeSide || !awaySide || homeSide === awaySide) continue;
    const score =
      (opts.homeAbbr && homeSide.code === opts.homeAbbr.toUpperCase() ? 2 : overlap(homeSide.label, opts.home) + 0.4) +
      (opts.awayAbbr && awaySide.code === opts.awayAbbr.toUpperCase() ? 2 : overlap(awaySide.label, opts.away) + 0.4);
    if (score < 1.2) continue;
    const bid = homeSide.bid;
    const ask = homeSide.ask;
    const spread = bid != null && ask != null ? Math.max(0, ask - bid) : 0;
    const match: KalshiMatch = {
      home: homeSide.mid,
      volume: Math.max(homeSide.volume, awaySide.volume, homeSide.openInterest, awaySide.openInterest),
      spread,
      ticker: homeSide.ticker,
    };
    if (!best || score > best.score) best = { score, match };
  }
  return best?.match;
}

function matchSide(side: KalshiSide, name: string, abbr?: string): boolean {
  if (abbr && side.code && side.code === abbr.toUpperCase()) return true;
  if (abbr && side.code && (side.code.startsWith(abbr.toUpperCase()) || abbr.toUpperCase().startsWith(side.code))) {
    if (side.code.length >= 2 && abbr.length >= 2) return true;
  }
  const label = side.label.toLowerCase();
  const nm = name.toLowerCase();
  if (label && nm.includes(label.slice(0, Math.min(8, label.length)))) return true;
  return overlap(side.label, name) >= 0.4;
}
