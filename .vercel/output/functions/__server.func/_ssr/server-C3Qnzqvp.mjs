import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { n as ALL_SPORTS } from "./desk-settings-uc_BKqpk.mjs";
import { At as rawToSplit, F as fetchTeamLooks, M as fetchEspnTeamLeaders, N as fetchPlayerRecent, O as enrichResearchForm, P as fetchTeamLastTen, Wt as twoWayNoVig, Z as isTodayEt, _t as parseEra, at as matchRawTape, ct as mergeResearchPlayers, d as analyzeTape, f as applyLeaderStats, gt as parseActionNetworkScoreboard, h as buildChance, i as ESPN_PATH, j as fetchEspnRoster, jt as reconstructHandle, k as etParts, n as BRAND, st as mergeForm, t as AN_SPORT, vt as parseEspnSummary, yt as parseInternalEventId } from "./research-9TMeO2J4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-C3Qnzqvp.js
var KALSHI = "https://api.elections.kalshi.com/trade-api/v2";
var UA$2 = "Mozilla/5.0 (compatible; SportsLock/1.0; +https://x.ai)";
var SERIES$1 = {
	MLB: "KXMLBGAME",
	NFL: "KXNFLGAME",
	NCAAF: "KXNCAAFGAME",
	NBA: "KXNBAGAME",
	NHL: "KXNHLGAME"
};
function numDollars(raw) {
	if (raw == null || raw === "") return void 0;
	const n = typeof raw === "number" ? raw : Number(raw);
	return Number.isFinite(n) && n > 0 && n < 1 ? n : void 0;
}
function numFp(raw) {
	if (raw == null || raw === "") return 0;
	const n = typeof raw === "number" ? raw : Number(raw);
	return Number.isFinite(n) && n > 0 ? n : 0;
}
function midPrice(m) {
	const bid = numDollars(m.yes_bid_dollars);
	const ask = numDollars(m.yes_ask_dollars);
	const last = numDollars(m.last_price_dollars);
	if (bid != null && ask != null) return {
		mid: (bid + ask) / 2,
		bid,
		ask
	};
	const mid = last ?? bid ?? ask;
	if (mid == null) return void 0;
	return {
		mid,
		bid,
		ask
	};
}
async function fetchJson$2(url) {
	try {
		const res = await fetch(url, {
			headers: {
				"User-Agent": UA$2,
				Accept: "application/json"
			},
			signal: AbortSignal.timeout(8e3)
		});
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	}
}
function codeFromTicker(ticker) {
	const dash = ticker.lastIndexOf("-");
	return dash >= 0 ? ticker.slice(dash + 1).toUpperCase() : "";
}
async function fetchSeriesMarkets(series) {
	const out = [];
	let cursor = "";
	for (let page = 0; page < 3; page++) {
		const q = new URL(`${KALSHI}/markets`);
		q.searchParams.set("limit", "200");
		q.searchParams.set("status", "open");
		q.searchParams.set("series_ticker", series);
		if (cursor) q.searchParams.set("cursor", cursor);
		const data = await fetchJson$2(q.toString());
		const batch = data?.markets ?? [];
		out.push(...batch);
		if (!data?.cursor || batch.length < 50) break;
		cursor = data.cursor;
	}
	return out;
}
async function fetchKalshiContracts() {
	const sports = Object.keys(SERIES$1);
	const pages = await Promise.all(sports.map(async (sport) => ({
		sport,
		markets: await fetchSeriesMarkets(SERIES$1[sport])
	})));
	const byEvent = /* @__PURE__ */ new Map();
	for (const page of pages) for (const m of page.markets) {
		if (!m.ticker || !m.event_ticker) continue;
		const priced = midPrice(m);
		if (!priced) continue;
		const side = {
			ticker: m.ticker,
			eventTicker: m.event_ticker,
			label: m.yes_sub_title || "",
			code: codeFromTicker(m.ticker),
			mid: priced.mid,
			bid: priced.bid,
			ask: priced.ask,
			volume: numFp(m.volume_fp),
			openInterest: numFp(m.open_interest_fp),
			occurrence: m.occurrence_datetime
		};
		const cur = byEvent.get(m.event_ticker) ?? {
			eventTicker: m.event_ticker,
			sport: page.sport,
			sides: [],
			occurrence: m.occurrence_datetime
		};
		cur.sides.push(side);
		if (!cur.occurrence && m.occurrence_datetime) cur.occurrence = m.occurrence_datetime;
		byEvent.set(m.event_ticker, cur);
	}
	const out = [];
	for (const c of byEvent.values()) {
		if (c.sides.length < 2) continue;
		const sum = c.sides.reduce((s, x) => s + x.mid, 0);
		if (sum > 0) for (const s of c.sides) s.mid = s.mid / sum;
		out.push(c);
	}
	return out;
}
function tokens(s) {
	return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter((w) => w.length >= 3);
}
function overlap(a, b) {
	const ta = new Set(tokens(a));
	const tb = new Set(tokens(b));
	if (!ta.size || !tb.size) return 0;
	let n = 0;
	for (const t of ta) if (tb.has(t)) n++;
	return n / Math.max(ta.size, tb.size);
}
function closeInTime(occurrence, start) {
	if (!occurrence || !start) return true;
	const a = new Date(occurrence).getTime();
	const b = new Date(start).getTime();
	if (!Number.isFinite(a) || !Number.isFinite(b)) return true;
	return Math.abs(a - b) < 72e6;
}
function kalshiHomeWin(contracts, opts) {
	const pool = contracts.filter((c) => c.sport === opts.sport);
	let best = null;
	for (const c of pool) {
		if (!closeInTime(c.occurrence, opts.start)) continue;
		const homeSide = c.sides.find((s) => matchSide(s, opts.home, opts.homeAbbr));
		const awaySide = c.sides.find((s) => matchSide(s, opts.away, opts.awayAbbr));
		if (!homeSide || !awaySide || homeSide === awaySide) continue;
		const score = (opts.homeAbbr && homeSide.code === opts.homeAbbr.toUpperCase() ? 2 : overlap(homeSide.label, opts.home) + .4) + (opts.awayAbbr && awaySide.code === opts.awayAbbr.toUpperCase() ? 2 : overlap(awaySide.label, opts.away) + .4);
		if (score < 1.2) continue;
		const bid = homeSide.bid;
		const ask = homeSide.ask;
		const spread = bid != null && ask != null ? Math.max(0, ask - bid) : 0;
		const match = {
			home: homeSide.mid,
			volume: Math.max(homeSide.volume, awaySide.volume, homeSide.openInterest, awaySide.openInterest),
			spread,
			ticker: homeSide.ticker
		};
		if (!best || score > best.score) best = {
			score,
			match
		};
	}
	return best?.match;
}
function matchSide(side, name, abbr) {
	if (abbr && side.code && side.code === abbr.toUpperCase()) return true;
	if (abbr && side.code && (side.code.startsWith(abbr.toUpperCase()) || abbr.toUpperCase().startsWith(side.code))) {
		if (side.code.length >= 2 && abbr.length >= 2) return true;
	}
	const label = side.label.toLowerCase();
	const nm = name.toLowerCase();
	if (label && nm.includes(label.slice(0, Math.min(8, label.length)))) return true;
	return overlap(side.label, name) >= .4;
}
var GAMMA = "https://gamma-api.polymarket.com";
var UA$1 = "Mozilla/5.0 (compatible; SportsLock/1.0; +https://x.ai)";
/** Polymarket sports series ids (Gamma /sports). */
var SERIES = {
	MLB: "3",
	NFL: "10187",
	NCAAF: "12756",
	NBA: "10345",
	NHL: "10346"
};
async function fetchJson$1(url) {
	try {
		const res = await fetch(url, {
			headers: {
				"User-Agent": UA$1,
				Accept: "application/json"
			},
			signal: AbortSignal.timeout(8e3)
		});
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	}
}
function parseList(raw) {
	if (Array.isArray(raw)) return raw.map((x) => String(x));
	if (typeof raw === "string") try {
		const v = JSON.parse(raw);
		if (Array.isArray(v)) return v.map((x) => String(x));
	} catch {
		return [];
	}
	return [];
}
function parsePrice(raw) {
	if (raw == null) return void 0;
	const n = Number(raw);
	return Number.isFinite(n) && n > .02 && n < .98 ? n : void 0;
}
function ymd(d = /* @__PURE__ */ new Date()) {
	return d.toISOString().slice(0, 10);
}
function daysAgo(n) {
	return ymd(/* @__PURE__ */ new Date(Date.now() - n * 864e5));
}
function isMoneyline(m, slug) {
	if (slug && /player-prop|props|total|spread|ou-|o-u/i.test(slug)) return false;
	const kind = (m.sportsMarketType || "").toLowerCase();
	if (kind && kind !== "moneyline" && kind !== "ml") return false;
	if (kind === "moneyline" || kind === "ml") return true;
	const q = (m.question || "").toLowerCase();
	if (/o\/u|over\/under|spread|player|home runs|strikeouts|passing/.test(q)) return false;
	const outcomes = parseList(m.outcomes);
	return outcomes.length === 2 && !outcomes.some((o) => /^(yes|no|over|under)$/i.test(o.trim()));
}
function contractFromEvent(ev, sport) {
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
		start: ev.startDate
	};
}
async function fetchSeries(sport, seriesId) {
	const data = await fetchJson$1(`${GAMMA}/events?series_id=${encodeURIComponent(seriesId)}&closed=false&active=true&limit=50&end_date_min=${daysAgo(1)}`);
	if (Array.isArray(data)) return data;
	return data?.events ?? [];
}
async function fetchPolymarketContracts() {
	const sports = Object.keys(SERIES);
	const pages = await Promise.all(sports.map(async (sport) => {
		return {
			sport,
			events: await fetchSeries(sport, SERIES[sport])
		};
	}));
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const page of pages) for (const ev of page.events) {
		const c = contractFromEvent(ev, page.sport);
		if (!c || seen.has(c.slug)) continue;
		seen.add(c.slug);
		out.push(c);
	}
	return out;
}
function norm(s) {
	return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function teamHit(needle, hay, abbr) {
	const n = norm(needle);
	const h = norm(hay);
	if (!n || !h) return false;
	if (h === n || h.includes(n) || n.includes(h)) return true;
	const last = n.split(" ").pop() ?? "";
	if (last.length >= 4 && h.includes(last)) return true;
	if (abbr && (h === norm(abbr) || h.includes(norm(abbr)))) return true;
	return false;
}
function slugDate(slug) {
	return /(\d{4}-\d{2}-\d{2})/.exec(slug)?.[1];
}
function closeDate(contract, start) {
	if (!start) return true;
	const gameDay = start.slice(0, 10);
	const slugDay = slugDate(contract.slug);
	if (slugDay) {
		const dg = (/* @__PURE__ */ new Date(`${gameDay}T12:00:00Z`)).getTime();
		const ds = (/* @__PURE__ */ new Date(`${slugDay}T12:00:00Z`)).getTime();
		if (Number.isFinite(dg) && Number.isFinite(ds)) return Math.abs(dg - ds) <= 1728e5;
	}
	const end = contract.end ? new Date(contract.end).getTime() : NaN;
	const startMs = new Date(start).getTime();
	if (Number.isFinite(end) && Number.isFinite(startMs)) return startMs >= (contract.start ? new Date(contract.start).getTime() : end - 12096e5) - 432e5 && startMs <= end + 432e5;
	return true;
}
async function fetchPolymarketBySlug(slug, sport) {
	const data = await fetchJson$1(`${GAMMA}/events?slug=${encodeURIComponent(slug)}`);
	const ev = Array.isArray(data) ? data[0] : data;
	if (!ev || typeof ev !== "object") return null;
	return contractFromEvent(ev, sport);
}
function guessPolySlug(sport, awayAbbr, homeAbbr, start) {
	if (!awayAbbr || !homeAbbr || !start) return null;
	const day = start.slice(0, 10);
	if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
	return `${sport === "NCAAF" ? "cfb" : sport.toLowerCase()}-${awayAbbr.toLowerCase()}-${homeAbbr.toLowerCase()}-${day}`;
}
function polymarketHomeWin(contracts, opts) {
	const pool = contracts.filter((c) => c.sport === opts.sport && closeDate(c, opts.start));
	let best = null;
	for (const c of pool) {
		const homeOnHome = teamHit(opts.home, c.homeName, opts.homeAbbr);
		const awayOnAway = teamHit(opts.away, c.awayName, opts.awayAbbr);
		const homeOnAway = teamHit(opts.home, c.awayName, opts.homeAbbr);
		const awayOnHome = teamHit(opts.away, c.homeName, opts.awayAbbr);
		let homeP;
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
		const match = {
			home: homeP,
			volume: c.volume,
			slug: c.slug
		};
		if (!best || score > best.score) best = {
			score,
			match
		};
	}
	return best?.match;
}
var ESPN_WEB = "https://site.web.api.espn.com/apis/site/v2/sports";
var UA = "Mozilla/5.0 (compatible; SportsLock/1.0; +https://x.ai)";
function yyyymmddEt(offsetDays = 0) {
	const ms = Date.now() + offsetDays * 864e5;
	const p = etParts(new Date(ms));
	return `${p.year}${p.month}${p.day}`;
}
function parseAmerican(raw) {
	if (raw == null || raw === "") return null;
	const n = typeof raw === "number" ? raw : Number(String(raw).replace(/[^0-9.+-]/g, ""));
	return Number.isFinite(n) && n !== 0 ? n : null;
}
function parseLine(raw) {
	if (raw == null || raw === "") return void 0;
	const n = typeof raw === "number" ? raw : Number(String(raw).replace(/[ouOU]/g, ""));
	return Number.isFinite(n) ? n : void 0;
}
async function fetchJson(url) {
	try {
		const res = await fetch(url, {
			headers: {
				"User-Agent": UA,
				Accept: "application/json"
			},
			signal: AbortSignal.timeout(1e4)
		});
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	}
}
function sitLine(s) {
	if (!s) return void 0;
	const bits = [
		s.down != null ? `${s.down}` : null,
		s.distance != null ? `& ${s.distance}` : null,
		s.yardLine,
		s.possession
	].filter(Boolean);
	return bits.length ? bits.join(" ") : void 0;
}
function recordOf(c, type = "total") {
	return c?.records?.find((r) => r.type === type || r.name?.toLowerCase() === type)?.summary;
}
function pitcherOf(c) {
	const p = c?.probables?.[0];
	const name = p?.athlete?.displayName;
	if (!name) return void 0;
	const era = p?.statistics?.find((s) => s.abbreviation === "ERA")?.displayValue;
	return era ? `${name} (ERA ${era})` : name;
}
function numScore(raw) {
	if (typeof raw === "number" && Number.isFinite(raw)) return raw;
	if (typeof raw === "string" && raw.trim()) {
		const n = Number(raw.replace(/[^0-9.+-]/g, ""));
		return Number.isFinite(n) ? n : void 0;
	}
}
function quotesFromEspnEvent(event, sport, phase) {
	const comp = event.competitions?.[0];
	if (!comp) return [];
	const state = comp.status?.type?.state ?? "";
	if (comp.status?.type?.completed || state === "post") return [];
	const competitors = comp.competitors ?? [];
	const homeC = competitors.find((c) => c.homeAway === "home");
	const awayC = competitors.find((c) => c.homeAway === "away");
	const home = homeC?.team?.displayName;
	const away = awayC?.team?.displayName;
	const homeShort = homeC?.team?.name || home;
	const awayShort = awayC?.team?.name || away;
	if (!home || !away || !homeShort || !awayShort) return [];
	const start = comp.date || event.date;
	if (!start) return [];
	const inPlay = state === "in";
	const startMs = new Date(start).getTime();
	if (!Number.isFinite(startMs)) return [];
	const odds = comp.odds?.[0];
	const scheduleOnly = !odds;
	const eventId = `espn-${sport}-${event.id ?? `${awayShort}-${homeShort}-${start}`}`;
	const sportPath = ESPN_PATH[sport];
	const homeRecord = recordOf(homeC, "total");
	const awayRecord = recordOf(awayC, "total");
	const homePitcher = pitcherOf(homeC);
	const awayPitcher = pitcherOf(awayC);
	const base = {
		eventId,
		sport,
		start,
		home,
		away,
		source: "espn",
		delayed: true,
		inPlay,
		venueNote: "other",
		confirmed: true,
		espnId: event.id,
		sportPath,
		homeRecord,
		awayRecord,
		homePitcher,
		awayPitcher,
		homeAbbr: homeC?.team?.abbreviation,
		awayAbbr: awayC?.team?.abbreviation,
		homeLogo: homeC?.team?.logo,
		awayLogo: awayC?.team?.logo,
		scheduleOnly,
		phase,
		homeScore: numScore(homeC?.score),
		awayScore: numScore(awayC?.score),
		clock: comp.status?.displayClock || (inPlay ? comp.status?.type?.shortDetail : void 0),
		period: comp.status?.period != null ? String(comp.status.period) : void 0,
		situation: inPlay ? [
			comp.status?.type?.detail,
			comp.status?.type?.shortDetail,
			sitLine(comp.situation)
		].filter(Boolean).join(" · ") : void 0
	};
	const out = [];
	if (scheduleOnly) {
		out.push({
			...base,
			marketType: "ml",
			side: "home",
			selection: homeShort,
			price: -110
		});
		out.push({
			...base,
			marketType: "ml",
			side: "away",
			selection: awayShort,
			price: -110
		});
		return out;
	}
	const mlHome = parseAmerican(odds.moneyline?.home?.close?.odds);
	const mlAway = parseAmerican(odds.moneyline?.away?.close?.odds);
	const mlHomeOpen = parseAmerican(odds.moneyline?.home?.open?.odds);
	const mlAwayOpen = parseAmerican(odds.moneyline?.away?.open?.odds);
	const spHome = parseAmerican(odds.pointSpread?.home?.close?.odds);
	const spAway = parseAmerican(odds.pointSpread?.away?.close?.odds);
	const spHomeLine = parseLine(odds.pointSpread?.home?.close?.line) ?? (odds.spread != null ? odds.spread : void 0);
	const spAwayLine = parseLine(odds.pointSpread?.away?.close?.line);
	const totOver = parseAmerican(odds.total?.over?.close?.odds);
	const totUnder = parseAmerican(odds.total?.under?.close?.odds);
	const totalPts = parseLine(odds.total?.over?.close?.line) ?? odds.overUnder;
	const priced = {
		...base,
		homeSpread: spHomeLine,
		total: totalPts
	};
	if (mlHome != null && mlAway != null) {
		out.push({
			...priced,
			marketType: "ml",
			side: "home",
			selection: homeShort,
			price: mlHome,
			consensusPrice: mlHome,
			hardRockPrice: mlHome,
			openPrice: mlHomeOpen ?? void 0
		});
		out.push({
			...priced,
			marketType: "ml",
			side: "away",
			selection: awayShort,
			price: mlAway,
			consensusPrice: mlAway,
			hardRockPrice: mlAway,
			openPrice: mlAwayOpen ?? void 0
		});
	} else {
		out.push({
			...priced,
			marketType: "ml",
			side: "home",
			selection: homeShort,
			price: -110,
			scheduleOnly: true
		});
		out.push({
			...priced,
			marketType: "ml",
			side: "away",
			selection: awayShort,
			price: -110,
			scheduleOnly: true
		});
	}
	if (spHome != null && spAway != null && spHomeLine != null && spAwayLine != null) {
		const hSign = spHomeLine > 0 ? `+${spHomeLine}` : `${spHomeLine}`;
		const aSign = spAwayLine > 0 ? `+${spAwayLine}` : `${spAwayLine}`;
		out.push({
			...priced,
			marketType: "spread",
			side: "home",
			selection: `${homeShort} ${hSign}`,
			price: spHome,
			consensusPrice: spHome,
			hardRockPrice: spHome,
			point: spHomeLine
		});
		out.push({
			...priced,
			marketType: "spread",
			side: "away",
			selection: `${awayShort} ${aSign}`,
			price: spAway,
			consensusPrice: spAway,
			hardRockPrice: spAway,
			point: spAwayLine
		});
	}
	if (totOver != null && totUnder != null && totalPts != null) {
		out.push({
			...priced,
			marketType: "total",
			side: "over",
			selection: `${awayShort}/${homeShort} O ${totalPts}`,
			price: totOver,
			consensusPrice: totOver,
			hardRockPrice: totOver,
			point: totalPts
		});
		out.push({
			...priced,
			marketType: "total",
			side: "under",
			selection: `${awayShort}/${homeShort} U ${totalPts}`,
			price: totUnder,
			consensusPrice: totUnder,
			hardRockPrice: totUnder,
			point: totalPts
		});
	}
	return out;
}
function quotesFromScoreboard(board, sport) {
	if (!board?.events?.length) return [];
	const type = board.season?.type;
	const phase = type === 1 ? "preseason" : type === 3 ? "playoff" : "regular";
	return board.events.flatMap((e) => quotesFromEspnEvent(e, sport, phase));
}
function withinDays(iso, days) {
	const t = new Date(iso).getTime();
	if (!Number.isFinite(t)) return false;
	const delta = t - Date.now();
	return delta > -108e5 && delta < days * 864e5;
}
function horizonDays(sport) {
	switch (sport) {
		case "NBA": return 40;
		case "NHL": return 24;
		case "NCAAB": return 70;
		case "NFL": return 12;
		case "NCAAF": return 10;
		case "MLB": return 4;
		default: return 10;
	}
}
function capEventIds(quotes, sport, n) {
	const ids = [...new Set(quotes.filter((q) => q.sport === sport).map((q) => q.eventId))].slice(0, n);
	if (!ids.length) return quotes;
	return quotes.filter((q) => q.sport !== sport || ids.includes(q.eventId));
}
async function fetchLiveQuotes() {
	const today = yyyymmddEt(0);
	const plus2 = yyyymmddEt(2);
	const plus24 = yyyymmddEt(24);
	const plus40 = yyyymmddEt(40);
	const year = etParts().year;
	const urls = [
		{
			sport: "NFL",
			url: `${ESPN_WEB}/football/nfl/scoreboard?limit=50`
		},
		{
			sport: "MLB",
			url: `${ESPN_WEB}/baseball/mlb/scoreboard?dates=${today}-${plus2}&limit=50`
		},
		{
			sport: "NCAAF",
			url: `${ESPN_WEB}/football/college-football/scoreboard?limit=80&groups=80`
		},
		{
			sport: "NCAAF",
			url: `${ESPN_WEB}/football/college-football/scoreboard?limit=80&week=2&year=${year}&seasontype=2&groups=80`
		},
		{
			sport: "NHL",
			url: `${ESPN_WEB}/hockey/nhl/scoreboard?limit=40`
		},
		{
			sport: "NHL",
			url: `${ESPN_WEB}/hockey/nhl/scoreboard?dates=${today}-${plus24}&limit=50`
		},
		{
			sport: "NBA",
			url: `${ESPN_WEB}/basketball/nba/scoreboard?limit=30`
		},
		{
			sport: "NBA",
			url: `${ESPN_WEB}/basketball/nba/scoreboard?dates=${today}-${plus40}&limit=50`
		},
		{
			sport: "NCAAB",
			url: `${ESPN_WEB}/basketball/mens-college-basketball/scoreboard?limit=50`
		}
	];
	const results = await Promise.all(urls.map(async (u) => ({
		...u,
		board: await fetchJson(u.url)
	})));
	const notes = [];
	const byId = /* @__PURE__ */ new Map();
	const fetched = /* @__PURE__ */ new Set();
	for (const r of results) {
		if (!r.board) continue;
		fetched.add(r.sport);
		const rows = quotesFromScoreboard(r.board, r.sport);
		const horizon = horizonDays(r.sport);
		for (const q of rows) {
			if (!withinDays(q.start, horizon)) continue;
			if (!byId.has(`${q.eventId}-${q.marketType}-${q.side}`)) byId.set(`${q.eventId}-${q.marketType}-${q.side}`, q);
		}
	}
	let quotes = [...byId.values()].sort((a, b) => +new Date(a.start) - +new Date(b.start));
	quotes = capEventIds(quotes, "NCAAF", 18);
	quotes = capEventIds(quotes, "NCAAB", 16);
	quotes = capEventIds(quotes, "NBA", 16);
	quotes = capEventIds(quotes, "NHL", 16);
	for (const sport of ALL_SPORTS) if (!fetched.has(sport)) notes.push(`${sport} feed missed`);
	return {
		quotes,
		notes
	};
}
async function fetchActionNetworkTape() {
	const jobs = Object.entries(AN_SPORT).map(async ([sport, slug]) => {
		const json = await fetchJson(`https://api.actionnetwork.com/web/v1/scoreboard/${slug}`);
		if (!json) return [];
		return parseActionNetworkScoreboard(json, sport);
	});
	return (await Promise.all(jobs)).flat();
}
function splitsFromTape(quotes, raw) {
	const unique = /* @__PURE__ */ new Map();
	for (const q of quotes) if (!unique.has(q.eventId)) unique.set(q.eventId, q);
	const out = [];
	for (const q of unique.values()) {
		const hit = matchRawTape(raw, {
			eventId: q.eventId,
			sport: q.sport,
			home: q.home,
			away: q.away,
			homeAbbr: q.homeAbbr,
			awayAbbr: q.awayAbbr
		});
		const mlHome = quotes.find((x) => x.eventId === q.eventId && x.marketType === "ml" && x.side === "home");
		const mlAway = quotes.find((x) => x.eventId === q.eventId && x.marketType === "ml" && x.side === "away");
		let openHome;
		let closeHome;
		if (mlHome?.openPrice != null && mlAway?.openPrice != null) {
			const nv = twoWayNoVig(mlHome.openPrice, mlAway.openPrice);
			if (Number.isFinite(nv.fairHome)) openHome = nv.fairHome;
		}
		if (mlHome?.price != null && mlAway?.price != null) {
			const nv = twoWayNoVig(mlHome.price, mlAway.price);
			if (Number.isFinite(nv.fairHome)) closeHome = nv.fairHome;
		}
		if (hit) {
			out.push(rawToSplit(hit, q.eventId, openHome, closeHome));
			continue;
		}
		if (openHome != null && closeHome != null && Math.abs(closeHome - openHome) >= .015) {
			const handle = reconstructHandle(.5, openHome, closeHome);
			const steam = Math.abs(closeHome - openHome) >= .02;
			const read = analyzeTape(.5, handle, steam);
			out.push({
				eventId: q.eventId,
				side: "home",
				marketType: "ml",
				publicPct: 50,
				ticketPct: 50,
				handlePct: Math.round(handle * 100),
				steam,
				lean: read.lean,
				source: "line-move",
				note: `Ticket count not posted. The moneyline moved from ${Math.round(openHome * 100)} to ${Math.round(closeHome * 100)} on ${q.home}. Treated as informed money, not a public copy-trade. Not Hard Rock's book.`
			});
		}
	}
	return out;
}
async function fetchBriefs(quotes, predictByEvent, rawTape = []) {
	const unique = /* @__PURE__ */ new Map();
	for (const q of quotes) if (!unique.has(q.eventId) && q.espnId && ESPN_PATH[q.sport]) unique.set(q.eventId, q);
	const soon = [...unique.values()].filter((q) => {
		const t = new Date(q.start).getTime() - Date.now();
		return t > -108e5 && t < 144e6;
	}).sort((a, b) => {
		const todayA = isTodayEt(a.start) ? 1 : 0;
		const todayB = isTodayEt(b.start) ? 1 : 0;
		if (todayB !== todayA) return todayB - todayA;
		return +new Date(a.start) - +new Date(b.start);
	});
	const bySport = /* @__PURE__ */ new Map();
	for (const q of soon) {
		const list = bySport.get(q.sport) ?? [];
		list.push(q);
		bySport.set(q.sport, list);
	}
	const even = [];
	for (let i = 0; i < 6 && even.length < 16; i++) for (const list of bySport.values()) if (list[i] && even.length < 16) even.push(list[i]);
	return (await Promise.all(even.map(async (q) => {
		const path = ESPN_PATH[q.sport];
		const parsed = parseInternalEventId(q.eventId);
		if (!path || !parsed) return null;
		const raw = await fetchJson(`https://site.web.api.espn.com/apis/site/v2/sports/${path}/summary?event=${parsed.espnId}`);
		if (!raw) return null;
		const research = parseEspnSummary(raw, q.eventId, q.sport, parsed.espnId);
		const [homeForm, awayForm, homeLooks, awayLooks] = await Promise.all([
			research.homeTeamId ? fetchTeamLastTen(path, research.homeTeamId, research.home) : Promise.resolve(null),
			research.awayTeamId ? fetchTeamLastTen(path, research.awayTeamId, research.away) : Promise.resolve(null),
			research.homeTeamId ? fetchTeamLooks(path, research.homeTeamId, q.awayAbbr) : Promise.resolve(null),
			research.awayTeamId ? fetchTeamLooks(path, research.awayTeamId, q.homeAbbr) : Promise.resolve(null)
		]);
		research.lastFive = mergeForm((research.lastFive ?? []).map((b) => ({
			team: b.team,
			line: b.line,
			results: b.results,
			games: b.games ?? [],
			seasonGames: b.seasonGames
		})), [homeForm, awayForm]);
		research.homeLooks = homeLooks ?? research.homeLooks;
		research.awayLooks = awayLooks ?? research.awayLooks;
		{
			const starters = (research.players ?? []).filter((p) => p.starter && p.id).slice(0, 6);
			if (starters.length) {
				const recents = await Promise.all(starters.map((p) => fetchPlayerRecent(q.sport, p.id)));
				const byId = new Map(starters.map((p, i) => [p.id, recents[i]]));
				research.players = (research.players ?? []).map((p) => {
					const hit = byId.get(p.id);
					if (!hit) return p;
					return {
						...p,
						recentStats: hit.recentStats,
						recentN: hit.n,
						usageMin: hit.usageMin
					};
				});
			}
		}
		const pred = predictByEvent.get(q.eventId);
		const tape = matchRawTape(rawTape, {
			eventId: q.eventId,
			sport: q.sport,
			home: q.home,
			away: q.away,
			homeAbbr: q.homeAbbr,
			awayAbbr: q.awayAbbr
		});
		let openHome = research.openHomeWin;
		const mlHome = quotes.find((x) => x.eventId === q.eventId && x.marketType === "ml" && x.side === "home");
		const mlAway = quotes.find((x) => x.eventId === q.eventId && x.marketType === "ml" && x.side === "away");
		if (openHome == null && mlHome?.openPrice != null && mlAway?.openPrice != null) {
			const nv = twoWayNoVig(mlHome.openPrice, mlAway.openPrice);
			if (Number.isFinite(nv.fairHome)) openHome = nv.fairHome;
		}
		const oddsHome = mlHome?.price != null && mlAway?.price != null && Number.isFinite(mlHome.price) && Number.isFinite(mlAway.price) ? twoWayNoVig(mlHome.price, mlAway.price).fairHome : void 0;
		const chance = buildChance({
			home: q.home,
			away: q.away,
			sport: q.sport,
			start: q.start,
			oddsHome,
			espnHome: research.espnHomeWin,
			bookHome: research.bookHomeWin,
			openHome,
			kalshiHome: pred?.kalshiHome,
			kalshiVolume: pred?.kalshiVolume,
			kalshiSpread: pred?.kalshiSpread,
			polyHome: pred?.polyHome,
			polyVolume: pred?.polyVolume,
			homeSpread: research.homeSpread ?? q.homeSpread,
			total: research.total ?? q.total,
			homeRecord: research.homeRecord ?? q.homeRecord,
			awayRecord: research.awayRecord ?? q.awayRecord,
			homeSplit: research.homeSplit,
			awaySplit: research.awaySplit,
			homeEra: research.homeEra ?? parseEra(q.homePitcher),
			awayEra: research.awayEra ?? parseEra(q.awayPitcher),
			homeWhip: research.homeWhip,
			awayWhip: research.awayWhip,
			lastFive: research.lastFive,
			homeOuts: research.homeOuts,
			awayOuts: research.awayOuts,
			homeQuestionable: research.homeQuestionable,
			awayQuestionable: research.awayQuestionable,
			homePf: research.homePf,
			homePa: research.homePa,
			awayPf: research.awayPf,
			awayPa: research.awayPa,
			weatherTemp: research.weatherTemp,
			weatherWind: research.weatherWind,
			weatherPrecip: research.weatherPrecip,
			venue: research.venue,
			seriesHomeWins: research.seriesHomeWins,
			seriesAwayWins: research.seriesAwayWins,
			homeRestDays: research.homeRestDays,
			awayRestDays: research.awayRestDays,
			ticketHome: tape?.ticketHome,
			handleHome: tape?.handleHome,
			steam: tape?.steam,
			homeLooks: research.homeLooks,
			awayLooks: research.awayLooks,
			homePitcherHand: research.homePitcherHand === "L" || research.homePitcherHand === "R" ? research.homePitcherHand : void 0,
			awayPitcherHand: research.awayPitcherHand === "L" || research.awayPitcherHand === "R" ? research.awayPitcherHand : void 0
		});
		return {
			eventId: q.eventId,
			espnHomeWin: research.espnHomeWin,
			espnAwayWin: research.espnAwayWin,
			homeRecord: research.homeRecord ?? q.homeRecord,
			awayRecord: research.awayRecord ?? q.awayRecord,
			weather: research.weather,
			series: research.series,
			injuryCount: research.injuries.length,
			kalshiHomeWin: pred?.kalshiHome,
			polyHomeWin: pred?.polyHome,
			kalshiVolume: pred?.kalshiVolume,
			polyVolume: pred?.polyVolume,
			kalshiSpread: pred?.kalshiSpread,
			bookHomeWin: research.bookHomeWin,
			chanceHome: chance?.home,
			homeSpread: research.homeSpread ?? q.homeSpread,
			total: research.total ?? q.total,
			openHomeWin: openHome,
			ticketHome: tape?.ticketHome,
			handleHome: tape?.handleHome,
			steam: tape?.steam,
			venue: research.venue,
			homeScore: q.homeScore,
			awayScore: q.awayScore,
			clock: q.clock,
			period: q.period,
			situation: q.situation,
			weatherTemp: research.weatherTemp,
			weatherWind: research.weatherWind,
			weatherPrecip: research.weatherPrecip,
			homeEra: research.homeEra,
			awayEra: research.awayEra,
			homeSplit: research.homeSplit,
			awaySplit: research.awaySplit,
			homeOuts: research.homeOuts,
			awayOuts: research.awayOuts,
			homeQuestionable: research.homeQuestionable,
			awayQuestionable: research.awayQuestionable,
			homeWhip: research.homeWhip,
			awayWhip: research.awayWhip,
			homePf: research.homePf,
			homePa: research.homePa,
			awayPf: research.awayPf,
			awayPa: research.awayPa,
			seriesHomeWins: research.seriesHomeWins,
			seriesAwayWins: research.seriesAwayWins,
			homeRestDays: research.homeRestDays,
			awayRestDays: research.awayRestDays,
			players: (research.players ?? []).slice(0, 28).map((p) => ({
				id: p.id,
				name: p.name,
				team: p.team,
				homeAway: p.homeAway,
				position: p.position,
				headshot: p.headshot,
				starter: p.starter,
				stats: p.stats ?? {},
				recentStats: p.recentStats,
				recentN: p.recentN,
				usageMin: p.usageMin
			})),
			injuries: research.injuries.slice(0, 16).map((i) => ({
				team: i.team,
				player: i.player,
				status: i.status,
				detail: i.detail
			})),
			form: research.lastFive,
			homeLooks: research.homeLooks,
			awayLooks: research.awayLooks,
			homePitcherHand: research.homePitcherHand === "L" || research.homePitcherHand === "R" ? research.homePitcherHand : void 0,
			awayPitcherHand: research.awayPitcherHand === "L" || research.awayPitcherHand === "R" ? research.awayPitcherHand : void 0
		};
	}))).filter((b) => b !== null);
}
async function buildLiveSnapshot(asOf = (/* @__PURE__ */ new Date()).toISOString()) {
	const [{ quotes, notes }, kalshiContracts, polyContracts, rawTape] = await Promise.all([
		fetchLiveQuotes(),
		fetchKalshiContracts().catch(() => []),
		fetchPolymarketContracts().catch(() => []),
		fetchActionNetworkTape().catch(() => [])
	]);
	const uniqueQuotes = [];
	const seen = /* @__PURE__ */ new Set();
	for (const q of quotes) {
		if (seen.has(q.eventId)) continue;
		seen.add(q.eventId);
		uniqueQuotes.push(q);
	}
	const polyBag = [...polyContracts];
	const slugLookups = uniqueQuotes.filter((q) => !polymarketHomeWin(polyBag, {
		sport: q.sport,
		home: q.home,
		away: q.away,
		homeAbbr: q.homeAbbr,
		awayAbbr: q.awayAbbr,
		start: q.start
	})).slice(0, 12).map(async (q) => {
		const slug = guessPolySlug(q.sport, q.awayAbbr, q.homeAbbr, q.start);
		if (!slug) return;
		const extra = await fetchPolymarketBySlug(slug, q.sport);
		if (extra) polyBag.push(extra);
	});
	await Promise.all(slugLookups);
	const predictByEvent = /* @__PURE__ */ new Map();
	const predict = [];
	for (const q of uniqueQuotes) {
		const k = kalshiHomeWin(kalshiContracts, {
			sport: q.sport,
			home: q.home,
			away: q.away,
			homeAbbr: q.homeAbbr,
			awayAbbr: q.awayAbbr,
			start: q.start
		});
		const poly = polymarketHomeWin(polyBag, {
			sport: q.sport,
			home: q.home,
			away: q.away,
			homeAbbr: q.homeAbbr,
			awayAbbr: q.awayAbbr,
			start: q.start
		});
		if (!k && !poly) continue;
		const row = {
			eventId: q.eventId,
			sport: q.sport,
			kalshiHome: k?.home,
			kalshiVolume: k?.volume,
			kalshiSpread: k?.spread,
			polyHome: poly?.home,
			polyVolume: poly?.volume,
			source: k && poly ? "both" : poly ? "polymarket" : "kalshi"
		};
		predictByEvent.set(q.eventId, row);
		predict.push(row);
	}
	const briefs = quotes.length ? await fetchBriefs(quotes, predictByEvent, rawTape) : [];
	const publicSplits = splitsFromTape(quotes, rawTape);
	const tapeNote = publicSplits.length ? ` Ticket vs handle tape on ${publicSplits.length} game${publicSplits.length === 1 ? "" : "s"} (Action Network + line-move inference — not Hard Rock's own book).` : " No public ticket/handle tape on this pull.";
	const et = etParts();
	const nextLock = quotes.filter((q) => !q.inPlay && new Date(q.start).getTime() > Date.now()).sort((a, b) => +new Date(a.start) - +new Date(b.start))[0]?.start ?? null;
	const listed = [...new Set(quotes.map((q) => q.sport))];
	const labels = ALL_SPORTS.map((sport) => {
		const q = quotes.find((x) => x.sport === sport);
		if (!q) return sport;
		const when = new Date(q.start).toLocaleString("en-US", {
			timeZone: "America/New_York",
			month: "short",
			day: "numeric"
		});
		if (q.phase === "preseason") return `${sport} preseason ${when}`;
		return `${sport}`;
	});
	const live = quotes.length > 0;
	return {
		asOf,
		delayed: true,
		sample: false,
		hours: {
			preGameOpen: true,
			etStamp: et.etStamp,
			etDate: et.etDate,
			nextLock,
			label: nextLock ? `Next kickoff ${new Date(nextLock).toLocaleString("en-US", {
				timeZone: "America/New_York",
				weekday: "short",
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "2-digit"
			})} ET` : live ? "No upcoming kickoff on the live board" : "Live schedule unavailable",
			note: live ? `Live ESPN schedule for every league we cover: ${labels.join(" · ")}. Odds, ESPN model, Kalshi + Polymarket, records, pitchers, rest, injuries, ticket count vs handle. NBA, NHL, and college basketball stay on the board even before books post a number — photograph Hard Rock Bet Florida when they do. Confirm at ${BRAND.venueLive}.` : "Could not load the live ESPN schedule. Photograph a Hard Rock screen so we still have real games."
		},
		quotes,
		news: [],
		publicSplits,
		briefs,
		predict,
		sourceNote: live ? `Live ESPN games (${listed.join(", ")}) as of ${asOf}.${notes.length ? ` ${notes.join("; ")}.` : ""}${tapeNote} Prediction markets are research, not a Hard Rock fill. Not a lock.` : "Live ESPN schedule failed to load. No invented games."
	};
}
var getBoardSnapshot_createServerFn_handler = createServerRpc({
	id: "3739a4eb3c7006c5c1a47084b5a7256f60fde1cdecdcc400354fa2564e10ee2e",
	name: "getBoardSnapshot",
	filename: "src/lib/market/server.ts"
}, (opts) => getBoardSnapshot.__executeServer(opts));
var getBoardSnapshot = createServerFn({ method: "GET" }).handler(getBoardSnapshot_createServerFn_handler, async () => {
	return buildLiveSnapshot();
});
var getEventResearch_createServerFn_handler = createServerRpc({
	id: "e3ab16d50b1797e9c5e0905f1c613a83749a32b68b1be276d6964b689dfcadc9",
	name: "getEventResearch",
	filename: "src/lib/market/server.ts"
}, (opts) => getEventResearch.__executeServer(opts));
var getEventResearch = createServerFn({ method: "GET" }).validator((d) => d).handler(getEventResearch_createServerFn_handler, async ({ data }) => {
	const parsed = parseInternalEventId(data.eventId);
	if (!parsed) return {
		ok: false,
		error: "That game id is not on the live ESPN board."
	};
	const path = ESPN_PATH[parsed.sport];
	if (!path) return {
		ok: false,
		error: `No research feed for ${parsed.sport}.`
	};
	try {
		const res = await fetch(`https://site.web.api.espn.com/apis/site/v2/sports/${path}/summary?event=${encodeURIComponent(parsed.espnId)}`, {
			headers: {
				"User-Agent": "Mozilla/5.0 (compatible; SportsLock/1.0)",
				Accept: "application/json"
			},
			signal: AbortSignal.timeout(1e4)
		});
		if (!res.ok) return {
			ok: false,
			error: "ESPN research did not load. Try again in a minute."
		};
		const json = await res.json();
		let research = parseEspnSummary(json, data.eventId, parsed.sport, parsed.espnId);
		if (research.homeTeamId || research.awayTeamId) {
			const college = parsed.sport === "NCAAF" || parsed.sport === "NCAAB";
			const [homeR, awayR, homeL, awayL] = await Promise.all([
				research.homeTeamId ? fetchEspnRoster(path, research.homeTeamId, research.home, "home") : Promise.resolve([]),
				research.awayTeamId ? fetchEspnRoster(path, research.awayTeamId, research.away, "away") : Promise.resolve([]),
				!college && research.homeTeamId ? fetchEspnTeamLeaders(parsed.sport, research.homeTeamId) : Promise.resolve(/* @__PURE__ */ new Map()),
				!college && research.awayTeamId ? fetchEspnTeamLeaders(parsed.sport, research.awayTeamId) : Promise.resolve(/* @__PURE__ */ new Map())
			]);
			research.players = applyLeaderStats(mergeResearchPlayers(research.players, [...homeR, ...awayR]), [homeL, awayL]);
		}
		research = await enrichResearchForm(research, path);
		return {
			ok: true,
			research
		};
	} catch {
		return {
			ok: false,
			error: "Could not reach ESPN for this game."
		};
	}
});
var parseTicketImage_createServerFn_handler = createServerRpc({
	id: "19980d07678dfc71cef7b0a925f69be7421e25f27ec9217ed1cb0f764401c647",
	name: "parseTicketImage",
	filename: "src/lib/market/server.ts"
}, (opts) => parseTicketImage.__executeServer(opts));
var parseTicketImage = createServerFn({ method: "POST" }).validator((d) => d).handler(parseTicketImage_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Vision parse is unavailable. Enter the fields by hand and confirm them."
	};
	const mime = data.mime || "image/jpeg";
	const url = data.image.startsWith("data:") ? data.image : `data:${mime};base64,${data.image}`;
	const prompt = data.kind === "slate" ? `You extract a DraftKings classic salary-cap player table. Return ONLY JSON:
{"kind":"slate","table":"Name,Pos,Team,Salary,Proj\\nMahomes,QB,KC,7800,24"}
One player per line. Salary integers. If unreadable, empty table.` : data.kind === "contest" ? `You extract DraftKings daily-fantasy contest offers from a lobby screenshot. Return ONLY JSON:
{"kind":"contest","contests":[{"name":"NFL $5 Double Up","buyIn":5,"fieldSize":20,"prize":9,"kind":"cash"}]}
kind is cash (50/50, double-up, head-to-head) or gpp (tournament, millionaire, satellite). buyIn is dollars. If unreadable, empty contests.` : data.kind === "auto" ? `You are looking at a screenshot from a sportsbook or daily fantasy app. Classify and extract. Return ONLY JSON in one of these shapes:
{"kind":"ticket","fields":[{"sport":"NFL","home":"","away":"","marketType":"ml","side":"home","selection":"Baltimore to win","price":-110,"point":null,"player":null,"confidence":0.8,"start":null}]}
{"kind":"slate","table":"Name,Pos,Team,Salary,Proj\\nMahomes,QB,KC,7800,24"}
{"kind":"contest","contests":[{"name":"NFL $5 Double Up","buyIn":5,"fieldSize":20,"prize":9,"kind":"cash"}]}
Rules: ticket = Hard Rock / DraftKings odds. slate = player salary list. contest = DFS lobby with buy-ins. Never invent numbers or games you cannot read. Never write "ML" — say "to win". Sports: NFL, NBA, MLB, NHL, NCAAF, NCAAB equally.` : `You extract sports betting ticket fields from a screenshot. Return ONLY JSON:
{"kind":"ticket","fields":[{"sport":"NFL|NBA|MLB|NHL|NCAAF|NCAAB","home":"full home team","away":"full away team","marketType":"ml|spread|total|prop","side":"home|away|over|under|yes|no","selection":"short label like Phillies to win or Mahomes over 249.5 passing yards","price":-110,"point":null,"player":null,"confidence":0.0,"start":null}]}
Rules: If the photo is a PARLAY, put EVERY leg in fields (2+ objects). confidence 0-1. Never write "ML" in selection — say "to win". Include home, away, and kickoff if visible. Never invent a team, price, or game that is not in the photo. Empty fields array if nothing is readable. Sports: NFL, NBA, MLB, NHL, NCAAF, NCAAB equally.
PLAYER BETS (personal achievements in a game): marketType="prop". Set player=full athlete name, point=the line (249.5, 27.5, 0.5, 1.5, 6.5), side=over|under|yes|no, selection="Mahomes over 249.5 passing yards" (include the stat in words: passing yards, rushing yards, receiving yards, receptions, anytime touchdown, points, rebounds, assists, threes, hits, strikeouts, home run, total bases, hits + runs + RBIs, batter runs, RBIs, walks, stolen bases, shots on goal, saves, goals). Alternate lines (O 1.5 vs O 0.5, -2.5 vs -1.5) are separate fields. Team totals ("Reds over 3.5") are marketType="total" with the team in selection. These feed a custom player-bet model once the user confirms.`;
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 1600,
			messages: [{
				role: "user",
				content: [{
					type: "image_url",
					image_url: { url }
				}, {
					type: "text",
					text: prompt
				}]
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `Parse failed (${res.status}). Enter fields by hand.`
	};
	const text = (await res.json()).choices?.[0]?.message?.content ?? "";
	const jsonStart = text.indexOf("{");
	const jsonEnd = text.lastIndexOf("}");
	if (jsonStart < 0 || jsonEnd < 0) return {
		ok: false,
		error: "Could not read structured fields. Enter them by hand."
	};
	try {
		const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
		const detected = parsed.kind ?? data.kind ?? "ticket";
		if (detected === "slate" || data.kind === "slate" && parsed.table != null) return {
			ok: true,
			kind: "slate",
			table: parsed.table ?? "",
			note: "Confirm every row before the optimizer runs. Low confidence does not score."
		};
		if (detected === "contest" || parsed.contests) {
			const contests = (parsed.contests ?? []).map((c) => ({
				name: String(c.name ?? "Contest"),
				buyIn: Number(c.buyIn ?? 0),
				fieldSize: c.fieldSize != null ? Number(c.fieldSize) : void 0,
				prize: c.prize != null ? Number(c.prize) : void 0,
				kind: c.kind === "gpp" || c.kind === "cash" ? c.kind : "unknown",
				confirmed: false
			})).filter((c) => Number.isFinite(c.buyIn) && c.buyIn > 0);
			return {
				ok: true,
				kind: "contest",
				contests,
				note: contests.length ? "Check the buy-ins, then tap Use these buy-ins." : "No buy-ins read. Enter a contest photo with dollar amounts visible."
			};
		}
		return {
			ok: true,
			kind: "ticket",
			fields: (parsed.fields ?? []).map((f) => ({
				...f,
				confirmed: false,
				confidence: Number(f.confidence ?? 0)
			})),
			note: "Only confirmed fields enter the scan. Low confidence stays out until you edit and confirm."
		};
	} catch {
		return {
			ok: false,
			error: "Could not parse the model JSON. Enter fields by hand."
		};
	}
});
//#endregion
export { getBoardSnapshot_createServerFn_handler, getEventResearch_createServerFn_handler, parseTicketImage_createServerFn_handler };
