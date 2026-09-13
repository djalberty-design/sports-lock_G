import { a as DEFAULTS, f as isCollegeSport, m as isPlayCore, p as isMainMarket } from "./desk-settings-uc_BKqpk.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/research-9TMeO2J4.js
var BRAND = {
	name: "Sports Lock",
	tagline: "Picking with Intelligence Creates Confidence",
	purpose: "Type how much money you have. Sports Lock names the best tickets playing today — popular, player props, periods, and parlays — with chance-to-hit and payout on every card. Photograph the Hard Rock Bet Florida screen before you confirm. It never places a bet for you.",
	kicker: "Live ESPN schedule · public odds · photo the live Hard Rock number · not a prediction",
	ogDescription: "Picking with Intelligence Creates Confidence",
	persist: "sports-lock-v1",
	venueLive: "Hard Rock Bet",
	venueDfs: "DraftKings Fantasy",
	venuePredict: "Kalshi / FanDuel Predicts / DraftKings Predictions",
	cashSit: "Don't bet",
	helpline: "1-800-GAMBLER",
	userAgent: "SportsLock/1.0 (personal paper research)"
};
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function floorToCent(n) {
	return Math.floor(n * 100 + Number.EPSILON) / 100;
}
function formatUsd(n, digits = 2) {
	return `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString("en-US", {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	})}`;
}
function formatPct(n, digits = 1) {
	const pct = n * 100;
	return `${pct > 0 ? "+" : ""}${pct.toFixed(digits)}%`;
}
function formatAmerican(odds) {
	if (!Number.isFinite(odds)) return "—";
	return odds >= 0 ? `+${Math.round(odds)}` : `${Math.round(odds)}`;
}
function etParts(date = /* @__PURE__ */ new Date()) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: "America/New_York",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		weekday: "short",
		hour12: false
	}).formatToParts(date);
	const get = (type) => parts.find((p) => p.type === type)?.value ?? "";
	return {
		year: get("year"),
		month: get("month"),
		day: get("day"),
		hour: get("hour"),
		minute: get("minute"),
		weekday: get("weekday"),
		etDate: `${get("year")}-${get("month")}-${get("day")}`,
		etStamp: `${get("hour")}:${get("minute")}`
	};
}
function isTodayEt(iso, now = /* @__PURE__ */ new Date()) {
	if (!iso) return false;
	const t = new Date(iso);
	if (!Number.isFinite(t.getTime())) return false;
	return etParts(t).etDate === etParts(now).etDate;
}
function startOfEtWeekMonday(etDate) {
	const [y, m, d] = etDate.split("-").map(Number);
	const utc = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
	const dow = utc.getUTCDay();
	const offset = dow === 0 ? 6 : dow - 1;
	utc.setUTCDate(utc.getUTCDate() - offset);
	return `${utc.getUTCFullYear()}-${String(utc.getUTCMonth() + 1).padStart(2, "0")}-${String(utc.getUTCDate()).padStart(2, "0")}`;
}
/** "Monday, Sep 8 · 8:20 p.m. ET" — Florida/Eastern. Compact: "Mon 8:20 p.m. ET". */
function formatKickoff(iso, compact = false) {
	if (!iso) return "";
	const d = new Date(iso);
	if (!Number.isFinite(d.getTime())) return "";
	const weekday = d.toLocaleString("en-US", {
		timeZone: "America/New_York",
		weekday: compact ? "short" : "long"
	});
	const date = d.toLocaleString("en-US", {
		timeZone: "America/New_York",
		month: "short",
		day: "numeric"
	});
	const time = d.toLocaleString("en-US", {
		timeZone: "America/New_York",
		hour: "numeric",
		minute: "2-digit",
		hour12: true
	}).replace("AM", "a.m.").replace("PM", "p.m.");
	return compact ? `${weekday} ${date} · ${time} ET` : `${weekday}, ${date} · ${time} ET`;
}
function matchupLine(away, home) {
	if (!away && !home) return "";
	return `${away} (away) at ${home} (home)`;
}
function clip01$1(n) {
	return Math.min(.97, Math.max(.03, n));
}
function analyzeTape(ticketPct, handlePct, steam = false) {
	const t = clip01$1(ticketPct);
	const h = clip01$1(handlePct);
	const divergence = h - t;
	if (Math.abs(divergence) < .07 && !steam) return {
		lean: "neutral",
		divergence,
		note: `Bets ${Math.round(t * 100)}% · money ${Math.round(h * 100)}%. Tickets and dollars agree — no sharp/public split.`
	};
	if (divergence >= .07) return {
		lean: "sharp",
		divergence,
		note: `Bets ${Math.round(t * 100)}% · money ${Math.round(h * 100)}%. More dollars than tickets on this side — that's the sharp tell${steam ? ", and the line is moving with the money" : ""}.`
	};
	if (divergence <= -.07) return {
		lean: "public",
		divergence,
		note: `Bets ${Math.round(t * 100)}% · money ${Math.round(h * 100)}%. The public is on the tickets; the money is not. We do not copy the crowd.`
	};
	return {
		lean: steam ? "sharp" : "neutral",
		divergence,
		note: steam ? `Bets ${Math.round(t * 100)}% · money ${Math.round(h * 100)}%. Line is steaming — treat as informed money, not a lock.` : `Bets ${Math.round(t * 100)}% · money ${Math.round(h * 100)}%.`
	};
}
/**
* When a feed only publishes ticket % , reconstruct handle from the open→close move.
* Public tickets on a side + the line moving the other way = money on the opposite side.
*/
function reconstructHandle(ticketHome, openHome, closeHome) {
	const t = clip01$1(ticketHome);
	if (openHome == null || closeHome == null || !Number.isFinite(openHome) || !Number.isFinite(closeHome)) return t;
	const move = closeHome - openHome;
	if (t >= .62 && move < -.012) return clip01$1(.5 - (t - .5) * .55);
	if (t <= .38 && move > .012) return clip01$1(.5 + (.5 - t) * .55);
	if (Math.abs(move) >= .015) return clip01$1(t + move * 2.4);
	return t;
}
function deskScore(chance, price, lean) {
	if (!Number.isFinite(chance) || chance <= 0 || !Number.isFinite(price)) return -99;
	const pay = price >= 0 ? price / 100 : 100 / Math.abs(price);
	if (!(pay > 0)) return -99;
	const ev = chance * (1 + pay) - 1;
	const blend = chance * chance * Math.sqrt(pay);
	let s = pay < .65 ? blend * .35 + ev * .15 : blend * .55 + Math.max(ev, -.08) * .45 + chance * .12;
	if (lean === "sharp") s += .055;
	else if (lean === "public") s -= .035;
	return s;
}
function parlayScore(combinedFair, decimalPayout) {
	if (!(combinedFair > 0) || !(decimalPayout > 1)) return -99;
	const profit = decimalPayout - 1;
	return Math.pow(combinedFair, 1.6) * Math.log(1 + profit) * 8 + combinedFair * 2.4;
}
function stampRows(rows, splits) {
	if (!splits.length) return rows;
	return rows.map((r) => {
		const hit = splits.find((s) => s.eventId === r.eventId && (!s.marketType || s.marketType === r.marketType) && (s.side === r.side || s.side.toLowerCase().includes(r.side) || namesOverlap(s.side, r.selection) || r.side === "home" && /home/i.test(s.side))) ?? splits.find((s) => s.eventId === r.eventId && (!s.marketType || s.marketType === "ml"));
		if (!hit) return r;
		const ticketsOnRow = pctOnSide(hit, r);
		const handleOnRow = handleOnSide(hit, r);
		const read = analyzeTape(ticketsOnRow, handleOnRow, Boolean(hit.steam));
		return {
			...r,
			ticketPct: ticketsOnRow,
			handlePct: handleOnRow,
			tapeLean: hit.lean ?? read.lean,
			tapeNote: hit.note ?? read.note
		};
	});
}
function pctOnSide(split, row) {
	const homeish = row.side === "home" || namesOverlap(split.side, row.home) || namesOverlap(split.side, row.selection);
	const t = (split.ticketPct || split.publicPct) / (split.ticketPct > 1 || split.publicPct > 1 ? 100 : 1);
	const unit = t > 1 ? t / 100 : t;
	if (row.side === "over") return unit;
	if (row.side === "under") return 1 - unit;
	return homeish && row.side !== "away" ? unit : 1 - unit;
}
function handleOnSide(split, row) {
	const h = split.handlePct / (split.handlePct > 1 ? 100 : 1);
	const unit = h > 1 ? h / 100 : h;
	if (row.side === "over") return unit;
	if (row.side === "under") return 1 - unit;
	return (row.side === "home" || namesOverlap(split.side, row.home)) && row.side !== "away" ? unit : 1 - unit;
}
function namesOverlap(a, b) {
	if (!b) return false;
	const na = a.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
	const nb = b.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
	if (!na || !nb) return false;
	return na.includes(nb) || nb.includes(na);
}
function asPct(n) {
	if (typeof n !== "number" || !Number.isFinite(n)) return null;
	const p = n > 1 ? n / 100 : n;
	if (p <= 0 || p >= 1) return null;
	return p;
}
function walkPercents(node, depth = 0) {
	if (!node || typeof node !== "object" || depth > 6) return {};
	const o = node;
	const tickets = asPct(o.tickets) ?? asPct(o.ticket_percent) ?? asPct(o.bets) ?? asPct(o.bet_percent) ?? asPct(o.public) ?? asPct(o.public_percentage);
	const money = asPct(o.money) ?? asPct(o.handle) ?? asPct(o.money_percent) ?? asPct(o.handle_percent) ?? asPct(o.dollars);
	if (tickets != null || money != null) return {
		tickets: tickets ?? void 0,
		money: money ?? void 0
	};
	for (const v of Object.values(o)) if (v && typeof v === "object") {
		const inner = walkPercents(v, depth + 1);
		if (inner.tickets != null || inner.money != null) return inner;
	}
	return {};
}
function parseActionNetworkScoreboard(json, sport) {
	if (!json || typeof json !== "object") return [];
	const root = json;
	const games = Array.isArray(root.games) ? root.games : Array.isArray(json) ? json : [];
	const out = [];
	for (const g of games) {
		if (!g || typeof g !== "object") continue;
		const game = g;
		const teams = Array.isArray(game.teams) ? game.teams : [];
		const homeId = game.home_team_id;
		const awayId = game.away_team_id;
		const homeT = teams.find((t) => homeId != null && t.id === homeId) ?? teams.find((t) => t.is_home === true || t.home === true) ?? teams.find((t) => String(t.is_away) === "false");
		const awayT = teams.find((t) => awayId != null && t.id === awayId) ?? teams.find((t) => t !== homeT);
		const home = String(homeT?.full_name ?? homeT?.display_name ?? homeT?.name ?? "");
		const away = String(awayT?.full_name ?? awayT?.display_name ?? awayT?.name ?? "");
		if (!home || !away) continue;
		const odds = Array.isArray(game.odds) ? game.odds : [
			game.odds,
			game.markets,
			game.public_betting
		];
		let ticketHome = null;
		let handleHome = null;
		for (const block of odds) {
			if (!block || typeof block !== "object") continue;
			const o = block;
			const t = asPct(o.ml_home_public) ?? asPct(o.spread_home_public) ?? asPct(o.tickets) ?? asPct(o.ticket_percent) ?? asPct(o.public);
			const h = asPct(o.ml_home_money) ?? asPct(o.spread_home_money) ?? asPct(o.money) ?? asPct(o.handle) ?? asPct(o.money_percent);
			if (t != null) ticketHome = t;
			if (h != null) handleHome = h;
			if (t == null && h == null) {
				const p = walkPercents(block);
				if (p.tickets != null) ticketHome = p.tickets;
				if (p.money != null) handleHome = p.money;
			}
		}
		const ml = game.ml_public ?? game.public_ml;
		if (ticketHome == null && typeof ml === "number") ticketHome = asPct(ml);
		if (ticketHome == null) continue;
		const handle = handleHome ?? ticketHome;
		const steam = Boolean(game.steam || game.steam_move);
		out.push({
			sport,
			home,
			away,
			homeAbbr: homeT?.abbr ? String(homeT.abbr) : homeT?.abbreviation ? String(homeT.abbreviation) : void 0,
			awayAbbr: awayT?.abbr ? String(awayT.abbr) : awayT?.abbreviation ? String(awayT.abbreviation) : void 0,
			marketType: "ml",
			ticketHome,
			handleHome: handle,
			steam,
			source: "action-network"
		});
	}
	return out;
}
function rawToSplit(raw, eventId, openHome, closeHome) {
	const handle = reconstructHandle(raw.ticketHome, openHome, closeHome);
	const handleUse = raw.handleHome !== raw.ticketHome ? raw.handleHome : handle;
	const read = analyzeTape(raw.ticketHome, handleUse, Boolean(raw.steam));
	return {
		eventId,
		side: "home",
		marketType: raw.marketType,
		publicPct: Math.round(raw.ticketHome * 100),
		ticketPct: Math.round(raw.ticketHome * 100),
		handlePct: Math.round(handleUse * 100),
		steam: raw.steam,
		lean: read.lean,
		source: raw.source,
		note: read.note
	};
}
function matchRawTape(raw, game) {
	const nh = game.home.toLowerCase();
	const na = game.away.toLowerCase();
	return raw.find((r) => {
		if (r.sport && r.sport !== game.sport) return false;
		const rh = r.home.toLowerCase();
		const ra = r.away.toLowerCase();
		const homeHit = rh.includes(nh) || nh.includes(rh) || game.homeAbbr && r.homeAbbr === game.homeAbbr;
		const awayHit = ra.includes(na) || na.includes(ra) || game.awayAbbr && r.awayAbbr === game.awayAbbr;
		return Boolean(homeHit && awayHit);
	});
}
var AN_SPORT = {
	NFL: "nfl",
	NBA: "nba",
	MLB: "mlb",
	NHL: "nhl",
	NCAAF: "ncaaf",
	NCAAB: "ncaab"
};
function filterCatalog(items, opts) {
	return items.filter((p) => {
		if (opts.legs && opts.legs !== "all" && p.legs.length !== opts.legs) return false;
		if (opts.mix && opts.mix !== "all" && (p.mix ?? mixOf(p)) !== opts.mix) return false;
		if (opts.sport && opts.sport !== "ALL") {
			if (!(p.sports ?? [...new Set(p.legs.map((l) => l.sport))]).includes(opts.sport)) return false;
		}
		return true;
	});
}
function mixOf(p) {
	if (p.sameGame) return "same-game";
	return new Set(p.legs.map((l) => l.sport)).size > 1 ? "cross-sport" : "same-sport";
}
function sgpHaircut(n, includesMlAndSpread) {
	if (includesMlAndSpread) return n === 2 ? .55 : .42;
	if (n <= 2) return .88;
	if (n === 3) return .75;
	if (n === 4) return .62;
	if (n <= 8) return .5;
	return .38;
}
function typicalParlayJuice(n) {
	if (n >= 5) return .4;
	if (n >= 4) return .32;
	if (n === 3) return .25;
	return .12;
}
function correlationOf(legs, usedSim) {
	if (new Set(legs.map((l) => l.eventId)).size < legs.length) return usedSim ? "shared-latent" : "fallback-haircut";
	return "near-independent";
}
/**
* Same-game joint chance. Fréchet bounds + a signed correlation.
* Cross-game legs stay a clean product. Sim joint-path still wins when it Ran.
*/
function frechetBounds(pA, pB) {
	const a = clip01(pA);
	const b = clip01(pB);
	return {
		lo: Math.max(0, a + b - 1),
		hi: Math.min(a, b),
		indep: a * b
	};
}
function frechetJoint(pA, pB, rho) {
	const { lo, hi, indep } = frechetBounds(pA, pB);
	const r = Math.max(-1, Math.min(1, rho));
	if (r >= 0) return Math.min(hi, indep + r * (hi - indep));
	return Math.max(lo, indep + r * (indep - lo));
}
function jointFromLegs(probs, rho) {
	if (probs.length === 0) return 0;
	if (probs.length === 1) return clip01(probs[0]);
	let p = clip01(probs[0]);
	for (let i = 1; i < probs.length; i++) p = frechetJoint(p, probs[i], rho);
	return p;
}
/** Same-game correlation. Positive = they move together. */
function sameGameRho(legs) {
	if (legs.length < 2) return 0;
	const types = new Set(legs.map((l) => l.marketType));
	const sides = new Set(legs.map((l) => l.side));
	const mlSpread = types.has("ml") && types.has("spread");
	if (mlSpread && sides.size === 1) return .42;
	if (mlSpread && sides.size > 1) return -.28;
	if (types.has("total") && (types.has("ml") || types.has("spread"))) {
		if (legs.find((l) => l.marketType === "total")?.side === "under") return -.22;
		return .18;
	}
	if (types.has("prop")) {
		const overs = legs.filter((l) => /over/i.test(l.side)).length;
		if (overs === legs.length) return .32;
		if (overs === 0) return .28;
		return -.3;
	}
	return .28;
}
/** Fractional Kelly growth. b = net decimal payout (decimal − 1). */
function growthScore(pJoint, decimalPayout, infoQuality, kellyMultiplier = 1) {
	const p = clip01(pJoint);
	const b = Math.max(.01, decimalPayout - 1);
	const kelly = Math.max(0, (p * b - (1 - p)) / b);
	const q = Number.isFinite(infoQuality) ? Math.max(0, Math.min(1, infoQuality)) : .5;
	const frac = Number.isFinite(kellyMultiplier) ? Math.max(0, Math.min(2, kellyMultiplier)) : 1;
	return q * kelly * frac;
}
function clip01(p) {
	if (!Number.isFinite(p)) return .5;
	return Math.min(.985, Math.max(.015, p));
}
/** ESPN posts scores as a number, a string, or `{ value, displayValue }`. Never Number(object). */
function parseEspnScore(raw) {
	if (raw == null) return void 0;
	if (typeof raw === "number" && Number.isFinite(raw)) return raw;
	if (typeof raw === "string") {
		const n = Number(raw.replace(/[^0-9.+-]/g, ""));
		return Number.isFinite(n) ? n : void 0;
	}
	if (typeof raw === "object") {
		const o = raw;
		return parseEspnScore(o.value ?? o.displayValue ?? o.display);
	}
}
function ewmaWeights(n, lambda = .82) {
	const raw = Array.from({ length: Math.max(0, n) }, (_, i) => lambda ** i);
	const den = raw.reduce((s, w) => s + w, 0) || 1;
	return raw.map((w) => w / den);
}
/** Recency-weighted mean. Index 0 = latest. Same numbers in → same mean out. */
function ewmaMean(values, lambda = .82) {
	const xs = values.filter((n) => Number.isFinite(n));
	if (!xs.length) return null;
	const w = ewmaWeights(xs.length, lambda);
	return xs.reduce((s, n, i) => s + n * (w[i] ?? 0), 0);
}
/** NFL recency weight: w = 0.60 × min(1, n_games / 6). Other sports: 1. */
function earlySeasonDamp(nGames, sport) {
	if (sport !== "NFL") return 1;
	return .6 * Math.min(1, (Number.isFinite(nGames) ? Math.max(0, nGames) : 0) / 6);
}
function analyzeScores(games, take = 10, minN = 2) {
	const scored = games.filter((g) => g.result === "W" || g.result === "L").slice(0, take);
	if (scored.length < minN) return null;
	const w = ewmaWeights(scored.length);
	let wp = 0;
	let pf = 0;
	let pa = 0;
	let hasScore = 0;
	scored.forEach((g, i) => {
		wp += (g.result === "W" ? 1 : 0) * w[i];
		if (g.pf != null && g.pa != null && Number.isFinite(g.pf) && Number.isFinite(g.pa)) {
			pf += g.pf * w[i];
			pa += g.pa * w[i];
			hasScore += w[i];
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
		games: scored
	};
}
/** First half of the window (older) vs the most recent half. */
function formTrend(games) {
	const scored = games.filter((g) => g.result === "W" || g.result === "L");
	if (scored.length < 6) return "flat";
	const recent = scored.slice(0, Math.ceil(scored.length / 2));
	const older = scored.slice(Math.ceil(scored.length / 2));
	const wp = (xs) => xs.filter((g) => g.result === "W").length / xs.length;
	const d = wp(recent) - wp(older);
	if (d >= .2) return "rising";
	if (d <= -.2) return "falling";
	return "flat";
}
function formatScoreLine(games) {
	return games.slice(0, 10).map((g) => {
		const score = g.pf != null && g.pa != null ? ` ${g.pf}-${g.pa}` : "";
		const vs = g.opponent ? ` ${g.opponent}` : "";
		const loc = g.homeAway === "away" ? " @" : g.homeAway === "home" ? " vs" : "";
		return `${g.result}${score}${loc}${vs}`.trim();
	}).join(" · ");
}
function formatFormRead(read, team) {
	const trend = read.trend === "rising" ? "improving" : read.trend === "falling" ? "cooling" : "steady";
	const margin = `${read.avgMargin >= 0 ? "+" : ""}${read.avgMargin.toFixed(1)}`;
	return `${team} last ${read.n}: recency-weighted ${Math.round(read.wp * 100)}% · ${read.avgPf.toFixed(1)}–${read.avgPa.toFixed(1)} (${margin}/g) · ${trend}. Latest counts most.`;
}
/**
* Last-10 expected combined score: each side's recency-weighted offense vs
* the other's recency-weighted defense. Used to nudge totals and periods.
*/
function last10ExpectedTotal(form, home, away) {
	if (!form?.length) return null;
	const block = (name) => form.find((b) => b.team.toLowerCase() === name.toLowerCase()) ?? form.find((b) => name.toLowerCase().includes(b.team.toLowerCase()) || b.team.toLowerCase().includes(name.toLowerCase()));
	const h = analyzeScores(block(home)?.games ?? []);
	const a = analyzeScores(block(away)?.games ?? []);
	if (!h || !a || !(h.avgPf > 0) || !(a.avgPf > 0)) return null;
	const tot = (h.avgPf + a.avgPa) / 2 + (a.avgPf + h.avgPa) / 2;
	return tot > 0 ? tot : null;
}
/** Opponent on a score log is usually an abbreviation. Team on the ticket is a full name. */
function opponentMatches(opponent, team) {
	if (!opponent || !team) return false;
	const o = opponent.toLowerCase().replace(/[^a-z0-9]/g, "");
	const t = team.toLowerCase();
	if (o.length < 2) return false;
	const compact = t.replace(/[^a-z0-9]/g, "");
	if (compact.includes(o) || o.includes(compact)) return true;
	const words = t.split(/\s+/).map((w) => w.replace(/[^a-z]/g, "")).filter(Boolean);
	if (words.some((w) => w === o || w.startsWith(o) || o.length >= 3 && w.startsWith(o.slice(0, 3)))) return true;
	if (o === words.map((w) => w[0]).join("")) return true;
	const last = words[words.length - 1] ?? "";
	if (last.length >= 3 && (o.startsWith(last.slice(0, 3)) || last.startsWith(o))) return true;
	return false;
}
/** Games against this opponent — last-10 first, then the rest of the season log. */
function vsOpponent(games, opponent, seasonGames) {
	if (!opponent) return null;
	const pool = [...games ?? [], ...(seasonGames ?? []).filter((g) => !(games ?? []).some((x) => x.date && x.date === g.date))];
	if (!pool.length) return null;
	return analyzeScores(pool.filter((g) => opponentMatches(g.opponent, opponent)), 20, 1);
}
function splitByVenue(games, seasonGames) {
	const list = (games?.length ? games : seasonGames) ?? [];
	const season = seasonGames ?? [];
	const homeGames = list.filter((g) => g.homeAway === "home");
	const awayGames = list.filter((g) => g.homeAway === "away");
	return {
		home: analyzeScores(homeGames.length >= 2 ? homeGames : season.filter((g) => g.homeAway === "home"), 15, 2),
		away: analyzeScores(awayGames.length >= 2 ? awayGames : season.filter((g) => g.homeAway === "away"), 15, 2)
	};
}
function blendRate(season, recent) {
	if (recent != null && Number.isFinite(recent) && season != null && Number.isFinite(season)) return .6 * recent + .4 * season;
	if (recent != null && Number.isFinite(recent)) return recent;
	if (season != null && Number.isFinite(season)) return season;
}
function mergeForm(primary, extra) {
	const by = /* @__PURE__ */ new Map();
	for (const b of primary) if (b.team) by.set(b.team.toLowerCase(), b);
	for (const b of extra) {
		if (!b?.team) continue;
		const key = b.team.toLowerCase();
		const have = by.get(key);
		if (!have || (b.games?.length ?? 0) > (have.games?.length ?? 0)) by.set(key, {
			...b,
			seasonGames: b.seasonGames?.length ? b.seasonGames : have?.seasonGames
		});
		else if ((b.seasonGames?.length ?? 0) > (have.seasonGames?.length ?? 0)) by.set(key, {
			...have,
			seasonGames: b.seasonGames
		});
	}
	return [...by.values()];
}
var UA = {
	"User-Agent": "Mozilla/5.0 (compatible; SportsLock/1.0)",
	Accept: "application/json"
};
var TTL = 48e4;
var fileCache = /* @__PURE__ */ new Map();
var ESPN_WEB = "https://site.web.api.espn.com/apis/site/v2/sports";
function num$2(raw) {
	if (typeof raw === "number" && Number.isFinite(raw)) return raw;
	if (typeof raw === "string") {
		const n = Number(raw.replace(/[^0-9.+-]/g, ""));
		return Number.isFinite(n) ? n : void 0;
	}
}
function grab(cats, names) {
	if (!cats?.length) return void 0;
	const want = new Set(names.map((n) => n.toLowerCase()));
	for (const c of cats) for (const s of c.stats ?? []) if ([s.name, s.abbreviation].filter(Boolean).map((x) => String(x).toLowerCase()).some((k) => want.has(k))) {
		const v = s.value ?? num$2(s.displayValue);
		if (v != null && Number.isFinite(v)) return v;
	}
}
function bagFrom(cats) {
	const b = {};
	const g = (...names) => grab(cats, names);
	b.n = g("teamgamesplayed", "gamesplayed", "gp");
	b.ops = g("ops");
	b.avg = g("avg");
	b.obp = g("onbasepct", "obp");
	b.slg = g("slugavg", "slg");
	b.iso = g("isolatedpower", "isop", "iso");
	if (b.iso == null && b.slg != null && b.avg != null) b.iso = b.slg - b.avg;
	b.era = g("era");
	b.whip = g("whip");
	b.k9 = g("strikeoutspernineinnings", "k/9", "k9");
	b.runs = g("runs", "r");
	b.hits = g("hits", "h");
	b.hr = g("homeruns", "hr");
	b.oppOps = g("opponentops", "oops");
	if (b.oppOps == null) {
		const oobp = g("opponentonbasepct", "oobp");
		const oslug = g("opponentslugavg", "oslug");
		if (oobp != null && oslug != null) b.oppOps = oobp + oslug;
	}
	b.oppAvg = g("opponentavg", "oba");
	const w = g("winpct", "w%");
	if (w != null) b.wp = w > 1 ? w / 100 : w;
	b.ptsG = g("avgpoints", "pointspergame", "ppg", "pts", "totalpointspergame");
	b.passYdsG = g("netpassingyardspergame", "passingyardspergame", "nyds/g");
	b.rushYdsG = g("rushingyardspergame", "yds/g");
	b.recYdsG = g("receivingyardspergame");
	b.passAllowed = g("passingyardsallowed", "opponentpassingyardspergame", "opponentnetpassingyardspergame");
	b.rushAllowed = g("rushingyardsallowed", "opponentrushingyardspergame");
	b.recAllowed = g("receivingyardsallowed", "opponentreceivingyardspergame");
	b.ptsAllowed = g("opponentpointspergame", "pointsgivenuppergame", "pointsgivenup", "papg");
	b.xwoba = g("xwoba", "expectedwoba", "expectedweightedonbaseaverage");
	b.epa = g("epa", "expectedpointsadded");
	b.success = g("successrate", "success");
	b.cpoe = g("cpoe", "completionpercentageoverexpected");
	b.efg = g("effectivefieldgoalpct", "efg", "efgpct");
	b.tov = g("turnoverpct", "tovpct", "tov");
	b.orb = g("offensivereboundpct", "orbpct", "orb");
	b.ftRate = g("freethrowrate", "ftrate");
	b.kenpom = g("kenpom", "adjem", "adjustedefficiency");
	b.xg = g("xg", "expectedgoals", "xgf");
	b.gsax = g("gsax", "goalssavedaboveexpected");
	return b;
}
function parseTeamStatistics(json) {
	const seasonCats = json.results?.stats?.categories;
	if (!seasonCats?.length) return null;
	const splits = {};
	for (const s of json.results?.splits ?? []) {
		const key = (s.abbreviation || s.name || "").toLowerCase().replace(/\s+/g, " ").trim();
		if (!key) continue;
		splits[key] = bagFrom(s.categories);
	}
	return {
		team: json.team?.displayName ?? "",
		abbr: json.team?.abbreviation,
		season: bagFrom(seasonCats),
		splits
	};
}
function pickSplit(file, aliases) {
	for (const a of aliases) {
		const k = a.toLowerCase();
		if (file.splits[k]) return file.splits[k];
		const hit = Object.entries(file.splits).find(([name]) => name === k || name.includes(k) || k.includes(name));
		if (hit) return hit[1];
	}
}
function looksFromFile(file, opponentAbbr) {
	const vs = opponentAbbr ? pickSplit(file, [
		`vs. ${opponentAbbr}`,
		`vs ${opponentAbbr}`,
		opponentAbbr
	]) : void 0;
	return {
		team: file.team,
		abbr: file.abbr,
		season: file.season,
		vsOpp: vs,
		home: pickSplit(file, ["home"]),
		away: pickSplit(file, ["away"]),
		last7: pickSplit(file, [
			"last seven days",
			"last 7 days",
			"last7"
		]),
		vsLeft: pickSplit(file, [
			"vs. left",
			"vs left",
			"vs. lhp"
		]),
		vsRight: pickSplit(file, [
			"vs. right",
			"vs right",
			"vs. rhp"
		])
	};
}
async function fetchTeamStatFile(path, teamId) {
	if (!path || !teamId) return null;
	const key = `${path}|${teamId}`;
	const hit = fileCache.get(key);
	if (hit && Date.now() - hit.at < TTL) return hit.file;
	try {
		const res = await fetch(`${ESPN_WEB}/${path}/teams/${encodeURIComponent(teamId)}/statistics`, {
			headers: UA,
			signal: AbortSignal.timeout(8e3)
		});
		if (!res.ok) {
			fileCache.set(key, {
				at: Date.now(),
				file: null
			});
			return null;
		}
		const file = parseTeamStatistics(await res.json());
		fileCache.set(key, {
			at: Date.now(),
			file
		});
		return file;
	} catch {
		fileCache.set(key, {
			at: Date.now(),
			file: null
		});
		return null;
	}
}
async function fetchTeamLooks(path, teamId, opponentAbbr) {
	const file = await fetchTeamStatFile(path, teamId);
	return file ? looksFromFile(file, opponentAbbr) : null;
}
/** wOBA-ish from OBP + ISO — more stable than raw runs in a small sample. */
function underlyingOffense(bag) {
	if (!bag) return null;
	const obp = bag.obp ?? (bag.ops != null && bag.slg != null ? bag.ops - bag.slg : bag.avg != null ? bag.avg + .06 : void 0);
	const iso = bag.iso ?? (bag.slg != null && bag.avg != null ? bag.slg - bag.avg : void 0);
	if (obp == null && bag.ops == null) return null;
	if (obp != null && iso != null) return obp * .9 + iso * .7;
	if (bag.ops != null) return bag.ops * .48;
	return obp ?? null;
}
/** Lower ERA / WHIP / opponent OPS is better pitching. Returns a 0–1 "quality" (higher = better). */
function underlyingPitch(bag) {
	if (!bag) return null;
	const era = bag.era;
	const whip = bag.whip;
	const opp = bag.oppOps;
	if (era == null && whip == null && opp == null) return null;
	let z = 0;
	let n = 0;
	if (era != null) {
		z += (4.2 - era) / 2.2;
		n++;
	}
	if (whip != null) {
		z += (1.32 - whip) / .28;
		n++;
	}
	if (opp != null) {
		z += (.72 - opp) / .12;
		n++;
	}
	const t = z / Math.max(1, n);
	return 1 / (1 + Math.exp(-t));
}
function defenseAllowed(looks, sport) {
	if (!looks) return null;
	if (sport === "MLB") {
		const era = looks.last7?.era ?? looks.season.era;
		const opp = looks.last7?.oppOps ?? looks.season.oppOps;
		if (era == null && opp == null) return null;
		if (era != null && opp != null) return era / 4.2 * .5 + opp / .72 * .5;
		if (era != null) return era / 4.2;
		return opp / .72;
	}
	return looks.last7?.ptsAllowed ?? looks.season.ptsAllowed ?? null;
}
function allowedForStat(looks, kind) {
	if (!looks) return null;
	const a = looks.last7;
	const s = looks.season;
	const pick = (k) => a?.[k] ?? s[k];
	switch (kind) {
		case "pass": return pick("passAllowed") ?? null;
		case "rush": return pick("rushAllowed") ?? null;
		case "rec": return pick("recAllowed") ?? pick("passAllowed") ?? null;
		case "points": return pick("ptsAllowed") ?? null;
		case "hits": return pick("oppOps") ?? pick("oppAvg") ?? pick("era") ?? null;
		case "era": return pick("era") ?? null;
		case "k9": return pick("k9") ?? null;
	}
}
/** Named process feed. Empty = Looked. Never invent Statcast/EPA/KenPom/xG from ISO/ERA. */
function processSourceName(sport) {
	if (sport === "MLB") return "Statcast / Baseball Savant";
	if (sport === "NFL" || sport === "NCAAF") return "EPA / success / CPOE (cfbfastR / SP+)";
	if (sport === "NBA" || sport === "NCAAB") return "Four factors / KenPom-family";
	if (sport === "NHL") return "xG / GSAx";
	return "Process look";
}
function bagProcess(bag, sport) {
	if (!bag) return null;
	if (sport === "MLB") return bag.xwoba ?? null;
	if (sport === "NFL" || sport === "NCAAF") {
		if (bag.epa != null) return bag.epa;
		if (bag.success != null) return bag.success;
		if (bag.cpoe != null) return bag.cpoe;
		return null;
	}
	if (sport === "NBA" || sport === "NCAAB") {
		if (bag.kenpom != null) return bag.kenpom;
		if (bag.efg != null && bag.tov != null) return bag.efg - bag.tov * .5;
		return bag.efg ?? null;
	}
	if (sport === "NHL") return bag.xg ?? bag.gsax ?? null;
	return bag.xwoba ?? bag.epa ?? bag.xg ?? bag.kenpom ?? null;
}
function processFromLooks(sport, home, away) {
	const source = processSourceName(sport);
	const h = bagProcess(home?.last7, sport) ?? bagProcess(home?.season, sport);
	const a = bagProcess(away?.last7, sport) ?? bagProcess(away?.season, sport);
	if (h == null || a == null) return {
		home: .5,
		ran: false,
		empty: true,
		source,
		note: `Looked up ${source}. File not posted on this delayed ESPN pull. Empty = Looked, not a skip and not an invented number.`
	};
	const lean = 1 / (1 + Math.exp(-(h - a) * 2.2));
	return {
		home: Math.min(.78, Math.max(.22, lean)),
		ran: true,
		empty: false,
		source,
		note: `${source} posted. Home ${h.toFixed(3)} vs away ${a.toFixed(3)}. Process, not just results that already scored.`
	};
}
var CLIP_LO = .12;
var CLIP_HI = .88;
var FINAL_LO = .14;
var FINAL_HI = .86;
function logit(p) {
	const x = Math.min(.985, Math.max(.015, p));
	return Math.log(x / (1 - x));
}
function invLogit(z, lo = CLIP_LO, hi = CLIP_HI) {
	const p = 1 / (1 + Math.exp(-z));
	return Math.min(hi, Math.max(lo, p));
}
function unit01(n) {
	if (n == null || !Number.isFinite(n)) return null;
	const p = n > 1 ? n / 100 : n;
	if (p <= .02 || p >= .98) return null;
	return p;
}
/** Abramowitz & Stegun 7.1.26 — good to ~1e-5, no extra deps. */
function normalCdf(z) {
	const t = 1 / (1 + .2316419 * Math.abs(z));
	const p = .3989422804 * Math.exp(-z * z / 2) * t * (.319381743 + t * (-.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
	return z >= 0 ? 1 - p : p;
}
function parseRecord(summary) {
	if (!summary) return null;
	const m = /(\d+)\s*-\s*(\d+)(?:\s*-\s*(\d+))?/.exec(summary);
	if (!m) return null;
	const w = Number(m[1]);
	const l = Number(m[2]);
	const t = m[3] ? Number(m[3]) : 0;
	const n = w + l + t;
	if (n < 5) return null;
	return {
		w,
		l,
		t,
		n,
		wp: (w + .5 * t) / n
	};
}
/** Bill James log5: P(A beats B) from two winning percentages. */
function log5(wpA, wpB) {
	const a = Math.min(.85, Math.max(.15, wpA));
	const b = Math.min(.85, Math.max(.15, wpB));
	const num = a * (1 - b);
	return num / (num + b * (1 - a));
}
function homeFieldLogit(sport) {
	switch (sport) {
		case "NFL": return .16;
		case "NCAAF": return .22;
		case "NBA": return .2;
		case "NHL": return .22;
		case "MLB": return .12;
		case "NCAAB": return .22;
		default: return .14;
	}
}
/** Sport-specific score-margin sigma for converting a spread or point diff into P(win). */
function marginSigma(sport) {
	switch (sport) {
		case "NFL": return 13.45;
		case "NCAAF": return 16.2;
		case "NBA": return 12;
		case "NHL": return 1.85;
		case "MLB": return 3.05;
		case "NCAAB": return 11.5;
		default: return 13;
	}
}
function leagueTotal(sport) {
	switch (sport) {
		case "NFL": return 44.5;
		case "NCAAF": return 54;
		case "NBA": return 224;
		case "NHL": return 6.1;
		case "MLB": return 8.6;
		case "NCAAB": return 145;
		default: return 45;
	}
}
function pythagoreanWp(pf, pa, sport) {
	if (!(pf > 0 && pa > 0)) return null;
	const exp = sport === "MLB" ? 1.83 : sport === "NBA" ? 13.91 : sport === "NCAAB" ? 10.25 : sport === "NHL" ? 2.07 : 2.37;
	const num = pf ** exp;
	return num / (num + pa ** exp);
}
function parseEra(line) {
	if (!line) return void 0;
	const m = /ERA\s*(\d+\.\d+)/i.exec(line);
	if (!m) return void 0;
	const n = Number(m[1]);
	return n > 0 && n < 15 ? n : void 0;
}
function parseWhip(line) {
	if (!line) return void 0;
	const m = /WHIP\s*(\d+\.\d+)/i.exec(line);
	if (!m) return void 0;
	const n = Number(m[1]);
	return n > 0 && n < 4 ? n : void 0;
}
function spreadToWinProb(homeSpread, sport) {
	return invLogit(logit(normalCdf(-homeSpread / marginSigma(sport))));
}
/** Typical residual of the game total — used for alternate overs/unders. */
function totalSigma(sport) {
	switch (sport) {
		case "MLB": return 2.85;
		case "NFL": return 10.2;
		case "NCAAF": return 13.5;
		case "NBA": return 11.5;
		case "NCAAB": return 10.8;
		case "NHL": return 1.65;
		default: return 10;
	}
}
/** P(home covers posted homeLine) given expected home margin μ. Half-lines, no push. */
/** NFL / college margins cluster on 3 and 7. Mix discrete mass with the continuous curve. */
var KEY_MARGIN_MASS = [
	{
		k: 3,
		mass: .151
	},
	{
		k: 7,
		mass: .092
	},
	{
		k: 6,
		mass: .066
	},
	{
		k: 10,
		mass: .058
	},
	{
		k: 14,
		mass: .048
	},
	{
		k: 4,
		mass: .046
	}
];
function homeCoverProb(expectedHomeMargin, homeLine, sport) {
	const cont = invLogit(logit(normalCdf((expectedHomeMargin + homeLine) / marginSigma(sport))), .03, .97);
	if (sport !== "NFL" && sport !== "NCAAF") return cont;
	let massCover = 0;
	let massTot = 0;
	for (const row of KEY_MARGIN_MASS) {
		massTot += row.mass;
		const homeWinsBy = expectedHomeMargin >= 0 ? row.k : -row.k;
		if (homeWinsBy + homeLine > 0) massCover += row.mass;
		else if (homeWinsBy + homeLine === 0) massCover += row.mass * .5;
	}
	const disc = massTot > 0 ? massCover / massTot : cont;
	return invLogit(logit(.55 * cont + .45 * disc), .03, .97);
}
/** P(game total > line) with a normal around the posted/ensemble mean. */
function overProb(mean, line, sport) {
	return invLogit(logit(1 - normalCdf((line - mean) / totalSigma(sport))), .02, .98);
}
/** Poisson P(X <= k). Fine for counts under ~40. */
function poissonCdf(k, lambda) {
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
function poissonOver(lambda, line) {
	return invLogit(logit(1 - poissonCdf(Math.floor(line), Math.max(.02, lambda))), .06, .94);
}
var PARK_RUNS = {
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
	"minute maid park": .98,
	"busch stadium": .97,
	"angel stadium": .97,
	"dodger stadium": .96,
	"pnc park": .96,
	"kauffman stadium": .96,
	"loandepot park": .96,
	"citi field": .95,
	"comerica park": .95,
	"tropicana field": .94,
	"petco park": .92,
	"t-mobile park": .92,
	"oracle park": .9
};
function parkFactor(venue) {
	if (!venue) return null;
	const key = venue.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
	for (const [name, f] of Object.entries(PARK_RUNS)) if (key.includes(name)) return f;
	return null;
}
function formBlock(lastFive, team) {
	if (!lastFive?.length) return void 0;
	const n = team.toLowerCase();
	return lastFive.find((b) => b.team.toLowerCase() === n);
}
function recencyWp(block) {
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
function marginWp(block, sport) {
	const games = block?.games?.filter((g) => g.pf != null && g.pa != null) ?? [];
	if (games.length < 3) return null;
	const read = analyzeScores(games, 10);
	if (!read || !(read.avgPf > 0 || read.avgPa > 0)) return null;
	return invLogit(logit(normalCdf(read.avgMargin / (marginSigma(sport) * Math.sqrt(1 + 1 / read.n)))));
}
function restDays(block, start) {
	if (!start) return void 0;
	const dates = (block?.games ?? []).map((g) => g.date).filter((d) => Boolean(d));
	if (!dates.length) return void 0;
	const last = dates.map((d) => new Date(d).getTime()).filter((t) => Number.isFinite(t)).sort((a, b) => b - a)[0];
	if (last == null) return void 0;
	const startMs = new Date(start).getTime();
	if (!Number.isFinite(startMs)) return void 0;
	const days = (startMs - last) / 864e5;
	if (days < .15 || days > 21) return void 0;
	return days;
}
function crowdPrecision(volume, spread, base) {
	let p = base;
	if (volume != null && volume > 0) {
		const scale = Math.min(1.8, Math.max(.45, .35 + .22 * Math.log10(volume + 1)));
		p *= scale;
	} else p *= .55;
	if (spread != null && spread > 0) {
		const widen = Math.min(2.2, 1 + spread / .06);
		p /= widen;
	}
	return p;
}
function samplePrecision(n, full, minN = 20) {
	if (n == null || n <= 0) return full * .45;
	return full * Math.min(1, Math.sqrt(n / minN));
}
function pushLayer(layers, layer) {
	if (!Number.isFinite(layer.home)) return;
	const empty = Boolean(layer.empty) || layer.precision <= 0;
	const precision = empty ? 0 : layer.precision;
	const home = empty ? .5 : invLogit(logit(layer.home));
	layers.push({
		...layer,
		home,
		weight: precision,
		precision,
		thin: layer.thin || empty,
		empty
	});
}
function pushEmpty$1(layers, id, label, note) {
	pushLayer(layers, {
		id,
		label,
		home: .5,
		precision: 0,
		family: "context",
		note: `${note} Status: Looked (Empty). Missing data has zero weight — no 50/50 drag.`,
		thin: true,
		empty: true
	});
}
/** Market precision scales up as kickoff nears and vig tightens. */
function marketPrecision(hoursToKickoff, vigWidth = .045) {
	const T = hoursToKickoff != null && Number.isFinite(hoursToKickoff) ? Math.max(0, hoursToKickoff) : 24;
	const vig = vigWidth > 0 ? vigWidth : .045;
	return 14 * (1 + .6 / Math.sqrt(T + .5)) * (.045 / vig);
}
function hoursToStart(start) {
	if (!start) return void 0;
	const t = new Date(start).getTime();
	if (!Number.isFinite(t)) return void 0;
	return (t - Date.now()) / 36e5;
}
function buildChance(input) {
	const layers = [];
	const sport = input.sport || "NFL";
	if (input.oddsHome != null && Number.isFinite(input.oddsHome)) pushLayer(layers, {
		id: "market",
		label: "Sportsbook no-vig (close)",
		home: input.oddsHome,
		precision: marketPrecision(hoursToStart(input.start)),
		family: "market",
		note: "Two-way price with the house cut stripped. Real money, delayed. This is the prior — liquid books are extremely hard to beat."
	});
	else pushEmpty$1(layers, "market", "Sportsbook no-vig (close)", "Looked up the live two-way close. Not posted on this delayed board yet. Empty look, not a guess.");
	if (input.openHome != null && Number.isFinite(input.openHome) && (input.oddsHome == null || Math.abs(input.openHome - input.oddsHome) > .012)) {
		const moved = input.oddsHome != null ? input.oddsHome - input.openHome : 0;
		pushLayer(layers, {
			id: "open",
			label: "Opening line",
			home: input.openHome,
			precision: 5.5,
			family: "market",
			note: moved > .008 ? `Opened at ${Math.round(input.openHome * 100)} in 100 for ${input.home}; the close moved toward them (often sharper money).` : moved < -.008 ? `Opened at ${Math.round(input.openHome * 100)} in 100 for ${input.home}; the close moved away (public or new info).` : "The first number posted. Useful when it disagrees with the close."
		});
	}
	if (input.bookHome != null && Number.isFinite(input.bookHome) && (input.oddsHome == null || Math.abs(input.bookHome - input.oddsHome) > .012)) pushLayer(layers, {
		id: "book",
		label: "Posted book moneyline",
		home: input.bookHome,
		precision: 4,
		family: "market",
		note: "A second sportsbook print from ESPN's pick center. Same legal bucket as the close, different timestamp."
	});
	if (input.homeSpread != null && Number.isFinite(input.homeSpread) && Math.abs(input.homeSpread) > .05) {
		if (!(sport === "MLB" && Math.abs(input.homeSpread - 0) <= 1.6)) {
			const fromSpread = spreadToWinProb(input.homeSpread, sport);
			const correlated = input.oddsHome != null && Math.abs(fromSpread - input.oddsHome) < .03;
			pushLayer(layers, {
				id: "spread",
				label: "Spread-implied winner",
				home: fromSpread,
				precision: correlated ? 2.2 : 7.5,
				family: "market",
				note: correlated ? `Home spread ${input.homeSpread > 0 ? "+" : ""}${input.homeSpread} converts to about the same chance as the moneyline — not a second opinion.` : `Converts the point spread to a win chance with a ${sport} scoring curve (σ ${marginSigma(sport)}). When this fights the moneyline, one of the numbers is off.`
			});
		}
	}
	if (input.kalshiHome != null && Number.isFinite(input.kalshiHome)) pushLayer(layers, {
		id: "kalshi",
		label: "Kalshi prediction market",
		home: input.kalshiHome,
		precision: crowdPrecision(input.kalshiVolume, input.kalshiSpread, 8.5),
		family: "crowd",
		note: `Event-contract mid-price${input.kalshiVolume != null ? ` · ~$${Math.round(input.kalshiVolume)} traded` : ""}${input.kalshiSpread != null ? ` · ${Math.round(input.kalshiSpread * 100)}¢ wide` : ""}. A different crowd from the sportsbook. Research only — not a Hard Rock ticket.`
	});
	else pushEmpty$1(layers, "kalshi", "Kalshi prediction market", "Looked up a live Kalshi contract for this matchup. None posted. Empty book, not a guess.");
	if (input.polyHome != null && Number.isFinite(input.polyHome)) pushLayer(layers, {
		id: "polymarket",
		label: "Polymarket prediction market",
		home: input.polyHome,
		precision: crowdPrecision(input.polyVolume, void 0, 7.5),
		family: "crowd",
		note: `On-chain moneyline share price${input.polyVolume != null ? ` · ~$${Math.round(input.polyVolume)} volume` : ""}. Second prediction venue, independent of Kalshi. Research only — not a Florida sportsbook fill.`
	});
	else pushEmpty$1(layers, "polymarket", "Polymarket prediction market", "Looked up a live Polymarket moneyline. None posted. Empty book, not a guess.");
	if (input.espnHome != null && Number.isFinite(input.espnHome)) pushLayer(layers, {
		id: "espn",
		label: "ESPN matchup model",
		home: input.espnHome,
		precision: 6.2,
		family: "model",
		note: "ESPN's published game projection (FPI / SPI style). Built from ratings, not from tonight's ticket."
	});
	else pushEmpty$1(layers, "espn", "ESPN matchup model", "Looked up ESPN's matchup model. Not posted on this event. Empty look, not a guess.");
	const homeSplit = parseRecord(input.homeSplit);
	const awaySplit = parseRecord(input.awaySplit);
	const homeRec = parseRecord(input.homeRecord);
	const awayRec = parseRecord(input.awayRecord);
	const homeWp = homeSplit?.wp ?? homeRec?.wp;
	const awayWp = awaySplit?.wp ?? awayRec?.wp;
	if (homeWp != null && awayWp != null) {
		const raw = log5(homeWp, awayWp);
		const usingSplits = Boolean(homeSplit && awaySplit);
		const withHome = usingSplits ? raw : invLogit(logit(raw) + homeFieldLogit(sport));
		const n = Math.min(homeSplit?.n ?? homeRec?.n ?? 20, awaySplit?.n ?? awayRec?.n ?? 20);
		pushLayer(layers, {
			id: "log5",
			label: usingSplits ? "Home/road log5" : "Record model (log5 + home field)",
			home: withHome,
			precision: samplePrecision(n, 3.6, sport === "MLB" ? 40 : 8),
			family: "model",
			note: usingSplits ? `Home split ${input.homeSplit} vs road split ${input.awaySplit}. Splits already include home-field, so we do not add it twice.` : `Season ${input.homeRecord} vs ${input.awayRecord}, plus a ${sport} home-field bump.`
		});
	}
	const homePy = pythagoreanWp(input.homePf ?? 0, input.homePa ?? 0, sport);
	const awayPy = pythagoreanWp(input.awayPf ?? 0, input.awayPa ?? 0, sport);
	if (homePy != null && awayPy != null) pushLayer(layers, {
		id: "pythag",
		label: "Pythagorean (points / runs)",
		home: invLogit(logit(log5(homePy, awayPy)) + homeFieldLogit(sport) * .5),
		precision: 4.1,
		family: "model",
		note: "Win rate implied by scoring and allowing, not the W-L record. Catches lucky / unlucky teams."
	});
	const homeFormEarly = formBlock(input.lastFive, input.home);
	const awayFormEarly = formBlock(input.lastFive, input.away);
	const homeL10 = homeFormEarly?.games ? analyzeScores(homeFormEarly.games, 10) : null;
	const awayL10 = awayFormEarly?.games ? analyzeScores(awayFormEarly.games, 10) : null;
	const homeRate = scoringRate(input.homePf, homeRec?.n, sport);
	const homeAllow = scoringRate(input.homePa, homeRec?.n, sport);
	const awayRate = scoringRate(input.awayPf, awayRec?.n, sport);
	const awayAllow = scoringRate(input.awayPa, awayRec?.n, sport);
	const mixRate = (season, recent) => {
		if (season != null && recent != null && recent > 0) return .4 * season + .6 * recent;
		return season ?? (recent != null && recent > 0 ? recent : null);
	};
	const hOff = mixRate(homeRate, homeL10?.avgPf);
	const hDef = mixRate(homeAllow, homeL10?.avgPa);
	const aOff = mixRate(awayRate, awayL10?.avgPf);
	const aDef = mixRate(awayAllow, awayL10?.avgPa);
	if (hOff != null && hDef != null && aOff != null && aDef != null) {
		const homeScore = (hOff + aDef) / 2;
		const awayScore = (aOff + hDef) / 2;
		const p = invLogit(logit(spreadToWinProb(-(homeScore - awayScore), sport)) + homeFieldLogit(sport) * .35);
		const usedL10 = Boolean(homeL10?.avgPf && awayL10?.avgPf);
		pushLayer(layers, {
			id: "efficiency",
			label: "Scoring margin (efficiency)",
			home: p,
			precision: usedL10 ? 4 : 3.6,
			family: "model",
			note: usedL10 ? `Expected ${homeScore.toFixed(1)}–${awayScore.toFixed(1)} — 60% last-10 scoring, 40% season offense vs opponent defense. Last-10 on this stat, not only W-L.` : `Expected ${homeScore.toFixed(1)}–${awayScore.toFixed(1)} from season offense vs opponent defense. Margin model — same idea Dimers uses next to the moneyline. Not a lock.`
		});
	} else pushEmpty$1(layers, "efficiency", "Scoring margin (efficiency)", "Looked up season and last-10 scoring. Not posted yet. Empty look, not a guess.");
	if (sport === "MLB" && input.homeEra != null && input.awayEra != null) {
		const mixEra = (season, recent) => recent != null && recent > 0 ? .4 * season + .6 * recent : season;
		const homeEra = mixEra(input.homeEra, input.homeLooks?.last7?.era);
		const awayEra = mixEra(input.awayEra, input.awayLooks?.last7?.era);
		const homeBull = input.homePa != null && input.homePa > 0 ? input.homePa / Math.max(1, homeRec?.n ?? 80) : homeEra;
		const awayBull = input.awayPa != null && input.awayPa > 0 ? input.awayPa / Math.max(1, awayRec?.n ?? 80) : awayEra;
		const homeRuns = homeEra * .61 + homeBull * .39;
		let p = pythagoreanWp(awayEra * .61 + awayBull * .39, homeRuns, "MLB") ?? .5;
		p = invLogit(logit(p) + homeFieldLogit("MLB") * .7);
		const homeWhip = input.homeLooks?.last7?.whip ?? input.homeWhip;
		const awayWhip = input.awayLooks?.last7?.whip ?? input.awayWhip;
		if (homeWhip != null && awayWhip != null) p = invLogit(logit(p) + (awayWhip - homeWhip) * .22);
		pushLayer(layers, {
			id: "pitcher",
			label: "Starting pitchers",
			home: p,
			precision: 7.4,
			family: "model",
			note: `ERA ${homeEra.toFixed(2)} vs ${awayEra.toFixed(2)} (60% last-7 when posted, 40% season)${homeWhip != null && awayWhip != null ? ` · WHIP ${homeWhip.toFixed(2)} vs ${awayWhip.toFixed(2)}` : ""}. Starter blended with bullpen. Last-10/7 on this stat, not a card.`
		});
	} else pushEmpty$1(layers, "pitcher", "Starting pitchers", "Looked up tonight's probable ERA/WHIP (or this is not a baseball ticket). Empty look, not a guess.");
	const homeForm = formBlock(input.lastFive, input.home);
	const awayForm = formBlock(input.lastFive, input.away);
	const hf = recencyWp(homeForm);
	const af = recencyWp(awayForm);
	const homeRead = homeForm?.games ? analyzeScores(homeForm.games, 10) : null;
	const awayRead = awayForm?.games ? analyzeScores(awayForm.games, 10) : null;
	if (hf != null && af != null) {
		const homeBit = homeRead ? `${input.home} last ${homeRead.n}: ${Math.round(homeRead.wp * 100)}% recency WP, ${homeRead.avgPf.toFixed(1)}–${homeRead.avgPa.toFixed(1)}` : `${input.home} recency WP ${Math.round(hf * 100)}%`;
		const awayBit = awayRead ? `${input.away} last ${awayRead.n}: ${Math.round(awayRead.wp * 100)}% recency WP, ${awayRead.avgPf.toFixed(1)}–${awayRead.avgPa.toFixed(1)}` : `${input.away} recency WP ${Math.round(af * 100)}%`;
		const nForm = Math.max(homeForm?.games?.length ?? 0, awayForm?.games?.length ?? 0);
		const damp = earlySeasonDamp(nForm, sport);
		pushLayer(layers, {
			id: "form",
			label: "Last 10 scores (recency-weighted)",
			home: invLogit(logit(log5(Math.min(.82, Math.max(.18, hf)), Math.min(.82, Math.max(.18, af)))) + homeFieldLogit(sport) * .25),
			precision: (nForm >= 8 ? 2.8 : 2.1) * damp || 0,
			family: "context",
			note: `${homeBit}. ${awayBit}. Latest game counts most. Live ESPN log — not a generated card.${sport === "NFL" && damp < 1 ? ` Early-season damping ${damp.toFixed(2)}.` : ""} A 10-game streak is still mean-reverting.`
		});
	} else pushEmpty$1(layers, "form", "Last 10 scores (recency-weighted)", "Looked up the live ESPN last-10 log. Not enough completed games yet. Empty look, not a guess.");
	const hm = marginWp(homeForm, sport);
	const am = marginWp(awayForm, sport);
	if (hm != null && am != null) {
		const raw = log5(hm, am);
		const nMargin = Math.max(homeForm?.games?.length ?? 0, awayForm?.games?.length ?? 0);
		pushLayer(layers, {
			id: "margin",
			label: "Score-margin (last 10)",
			home: invLogit(logit(raw) + homeFieldLogit(sport) * .3),
			precision: (nMargin >= 8 ? 3 : 2.4) * earlySeasonDamp(nMargin, sport) || 0,
			family: "model",
			note: "How much they won or lost by in the last 10, recency-weighted. One-run baseball luck and 3-score football blowouts both get a truer read than W-L."
		});
	} else pushEmpty$1(layers, "margin", "Score-margin (last 10)", "Looked up last-10 scores for a margin read. Not enough box scores yet.");
	const ht = homeRead?.trend ?? (homeForm?.games ? formTrend(homeForm.games) : "flat");
	const at = awayRead?.trend ?? (awayForm?.games ? formTrend(awayForm.games) : "flat");
	{
		let z = 0;
		if (ht === "rising") z += .045;
		if (ht === "falling") z -= .045;
		if (at === "rising") z -= .045;
		if (at === "falling") z += .045;
		pushLayer(layers, {
			id: "trend",
			label: "Form trend (last 10 split)",
			home: invLogit(z),
			precision: Math.abs(z) >= .02 ? 1.5 : .6,
			family: "context",
			note: `${input.home} is ${ht} · ${input.away} is ${at} (recent 5 vs older 5). Always ran. Light on purpose — books already shade recency.`,
			thin: Math.abs(z) < .02
		});
	}
	const homeH2h = vsOpponent(homeForm?.games, input.away, homeForm?.seasonGames);
	const vsOpsHome = input.homeLooks?.vsOpp?.ops;
	const vsOpsAway = input.awayLooks?.vsOpp?.ops;
	if (homeH2h && homeH2h.n >= 1) {
		const wp = (homeH2h.wp * homeH2h.n + 1) / (homeH2h.n + 2);
		pushLayer(layers, {
			id: "h2h",
			label: "Head-to-head (live log + season)",
			home: Math.min(.72, Math.max(.28, wp)),
			precision: homeH2h.n >= 6 ? 1.8 : homeH2h.n >= 3 ? 1.3 : .9,
			family: "context",
			note: `${input.home} vs ${input.away}: ${homeH2h.n} meetings in the live log (${homeH2h.avgPf.toFixed(1)}–${homeH2h.avgPa.toFixed(1)}). Laplace-shrunk. Small sample — never a series story.`,
			thin: homeH2h.n < 3
		});
	} else if (vsOpsHome != null && vsOpsAway != null) pushLayer(layers, {
		id: "h2h",
		label: "Head-to-head (season split)",
		home: log5(Math.min(.78, Math.max(.22, vsOpsHome / (vsOpsHome + vsOpsAway))), Math.min(.78, Math.max(.22, vsOpsAway / (vsOpsHome + vsOpsAway)))),
		precision: 1.4,
		family: "context",
		note: `Live ESPN vs-opponent split: ${input.home} OPS ${vsOpsHome.toFixed(3)} vs ${input.away} OPS ${vsOpsAway.toFixed(3)}. Season H2H, not a last-10 sticker.`
	});
	else if (input.seriesHomeWins != null && input.seriesAwayWins != null && input.seriesHomeWins + input.seriesAwayWins >= 1) {
		const n = input.seriesHomeWins + input.seriesAwayWins;
		pushLayer(layers, {
			id: "h2h",
			label: "Head-to-head (this series)",
			home: (input.seriesHomeWins + 1) / (n + 2),
			precision: Math.min(1.6, .5 * n),
			family: "context",
			note: `This series ${input.home} ${input.seriesHomeWins}–${input.seriesAwayWins}. Looked up live meetings — using the series because the last-10 log has no extra games.`,
			thin: true
		});
	} else pushEmpty$1(layers, "h2h", "Head-to-head", `Looked up last-10, season vs-opponent split, and this series. ${input.home} and ${input.away} have no posted meetings yet.`);
	const homeAtHome = splitByVenue(homeForm?.games, homeForm?.seasonGames).home;
	const awayOnRoad = splitByVenue(awayForm?.games, awayForm?.seasonGames).away;
	const homeSplitOps = input.homeLooks?.home?.ops;
	const awaySplitOps = input.awayLooks?.away?.ops;
	if (homeAtHome && awayOnRoad) pushLayer(layers, {
		id: "venue-split",
		label: "Last-10 home vs road",
		home: invLogit(logit(log5(Math.min(.8, Math.max(.2, homeAtHome.wp)), Math.min(.8, Math.max(.2, awayOnRoad.wp)))) + homeFieldLogit(sport) * .15),
		precision: homeAtHome.n >= 3 && awayOnRoad.n >= 3 ? 1.6 : 1,
		family: "context",
		note: `${input.home} at home last ${homeAtHome.n}: ${Math.round(homeAtHome.wp * 100)}% · ${input.away} on the road last ${awayOnRoad.n}: ${Math.round(awayOnRoad.wp * 100)}%. Always ran from the live log.`,
		thin: homeAtHome.n < 3 || awayOnRoad.n < 3
	});
	else if (homeSplitOps != null && awaySplitOps != null) pushLayer(layers, {
		id: "venue-split",
		label: "Home vs road (season split)",
		home: log5(Math.min(.78, Math.max(.22, homeSplitOps / (homeSplitOps + awaySplitOps))), Math.min(.78, Math.max(.22, awaySplitOps / (homeSplitOps + awaySplitOps)))),
		precision: 1.3,
		family: "context",
		note: `Live ESPN home/away splits: ${input.home} home OPS ${homeSplitOps.toFixed(3)} · ${input.away} road OPS ${awaySplitOps.toFixed(3)}.`
	});
	else if (homeSplit && awaySplit) pushLayer(layers, {
		id: "venue-split",
		label: "Home vs road (record split)",
		home: log5(homeSplit.wp, awaySplit.wp),
		precision: 1.1,
		family: "context",
		note: `Home split ${input.homeSplit} vs road split ${input.awaySplit}. Live record split — last-10 home/away boxes were thin.`,
		thin: true
	});
	else pushEmpty$1(layers, "venue-split", "Last-10 home vs road", "Looked up last-10 home/away, ESPN home/away splits, and record splits. Not posted yet.");
	const homeOuts = input.homeOuts ?? 0;
	const awayOuts = input.awayOuts ?? 0;
	const homeQ = input.homeQuestionable ?? 0;
	const awayQ = input.awayQuestionable ?? 0;
	{
		const diff = (awayOuts - homeOuts) * 1 + (awayQ - homeQ) * .35;
		pushLayer(layers, {
			id: "injuries",
			label: "Out / IL listings",
			home: invLogit(0 + Math.max(-.22, Math.min(.22, diff * .038))),
			precision: homeOuts + awayOuts + homeQ + awayQ > 0 ? Math.min(3.4, 1.1 + .35 * (homeOuts + awayOuts)) : .9,
			family: "context",
			note: homeOuts + awayOuts + homeQ + awayQ > 0 ? `${input.away} ${awayOuts} out${awayQ ? ` · ${awayQ} questionable` : ""} · ${input.home} ${homeOuts} out${homeQ ? ` · ${homeQ} questionable` : ""}. Count, not star-value.` : "ESPN injury report: nobody listed out. That is a look — not a missing card.",
			thin: homeOuts + awayOuts + homeQ + awayQ === 0
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
			precision: Math.abs(restLogit) >= .015 ? sport === "NBA" || sport === "NHL" || sport === "NCAAB" ? 3.2 : sport === "NFL" ? 2.4 : 1.3 : .7,
			family: "context",
			note: `${input.home} ${homeRest.toFixed(1)} days since last game · ${input.away} ${awayRest.toFixed(1)} days. Always ran from the live log.`,
			thin: Math.abs(restLogit) < .015
		});
	} else pushEmpty$1(layers, "rest", "Rest / schedule", "Looked up rest from the live log. Last-game dates not posted yet.");
	if (input.seriesHomeWins != null && input.seriesAwayWins != null) {
		const n = input.seriesHomeWins + input.seriesAwayWins;
		if (n >= 2) pushLayer(layers, {
			id: "series",
			label: "This series",
			home: (input.seriesHomeWins + .5) / (n + 1),
			precision: Math.min(2.2, .7 * n),
			family: "context",
			note: `Head-to-head this series: ${input.home} ${input.seriesHomeWins}–${input.seriesAwayWins}. Small sample, shrunk toward 50/50.`
		});
	}
	const weatherShift = weatherLogit(sport, input.weatherTemp, input.weatherWind, input.weatherPrecip);
	if (weatherShift != null) pushLayer(layers, {
		id: "weather",
		label: "Weather",
		home: invLogit(weatherShift),
		precision: 1.4,
		family: "context",
		note: weatherNote(sport, input.weatherTemp, input.weatherWind, input.weatherPrecip)
	});
	else {
		const bits = [
			input.weatherTemp != null ? `${input.weatherTemp}°F` : null,
			input.weatherWind != null ? `wind ${input.weatherWind}` : null,
			input.weatherPrecip != null ? `rain ${input.weatherPrecip}%` : null
		].filter(Boolean);
		pushLayer(layers, {
			id: "weather",
			label: "Weather",
			home: .5,
			precision: bits.length ? .7 : 0,
			family: "context",
			note: bits.length ? `${bits.join(" · ")}. Weather on this sport moves totals more than winners — looked up, no ML lean.` : "Looked up live weather. Not posted (dome, or ESPN has no reading). Empty look, not a guess.",
			thin: true,
			empty: bits.length === 0
		});
	}
	if (sport === "MLB") {
		const park = parkFactor(input.venue);
		if (park != null) pushLayer(layers, {
			id: "park",
			label: "Ballpark",
			home: invLogit(((input.homeEra != null && input.awayEra != null ? input.homeEra < input.awayEra : (homeWp ?? .5) > (awayWp ?? .5)) ? 1 : -1) * (park < 1 ? .035 : park > 1 ? -.02 : 0)),
			precision: Math.abs(park - 1) >= .04 ? 1.15 : .5,
			family: "context",
			note: `${input.venue ?? "This park"} factor ${park.toFixed(2)}. Always ran. Extreme parks add chaos; pitcher parks slightly help the better starter.`,
			thin: Math.abs(park - 1) < .04
		});
		else pushEmpty$1(layers, "park", "Ballpark", "Looked up the venue factor. Park not posted on this event.");
	}
	const ticketHome = unit01(input.ticketHome);
	const handleHome = unit01(input.handleHome);
	if (ticketHome != null) pushLayer(layers, {
		id: "tickets",
		label: "Ticket count (bets %)",
		home: ticketHome,
		precision: 1.6,
		family: "crowd",
		note: `${Math.round(ticketHome * 100)}% of wagers (ticket count) on ${input.home}. This is the public. We never copy 80% of bets just because the crowd is loud.`
	});
	if (handleHome != null) {
		const diverge = ticketHome != null ? Math.abs(handleHome - ticketHome) : 0;
		const steam = Boolean(input.steam);
		pushLayer(layers, {
			id: "handle",
			label: "Handle (money %)",
			home: handleHome,
			precision: (steam ? 4.8 : 3.2) + Math.min(2.2, diverge * 8),
			family: "crowd",
			note: `${Math.round(handleHome * 100)}% of the dollars (handle) on ${input.home}` + (ticketHome != null ? `, vs ${Math.round(ticketHome * 100)}% of tickets.` : ".") + (diverge >= .07 ? handleHome > (ticketHome ?? .5) ? " More money than tickets — the sharp tell. We use it; we do not auto-follow it." : " More tickets than money — the public is on this side. We do not fade just to fade." : " Tickets and dollars roughly agree.") + (steam ? " Line is steaming with the money." : "")
		});
	}
	if (input.steam && handleHome != null && ticketHome != null && Math.abs(handleHome - ticketHome) >= .04) pushLayer(layers, {
		id: "steam",
		label: "Steam / line move",
		home: handleHome,
		precision: 2.6,
		family: "market",
		note: "The number moved with the handle, not with the ticket count. Informed money, still not a lock."
	});
	else pushEmpty$1(layers, "steam", "Steam / line move", input.steam ? "Line moved, but ticket/handle split is not posted. Looked; no second confirmation." : "Looked up open→close and handle. No steam on this delayed print.");
	if (ticketHome == null) pushEmpty$1(layers, "tickets", "Ticket count (bets %)", "Looked up live ticket-count %. Not posted on this delayed board.");
	if (handleHome == null) pushEmpty$1(layers, "handle", "Handle (money %)", "Looked up live handle %. Not posted on this delayed board.");
	const homeOff = underlyingOffense(input.homeLooks?.last7) ?? underlyingOffense(input.homeLooks?.season);
	const awayOff = underlyingOffense(input.awayLooks?.last7) ?? underlyingOffense(input.awayLooks?.season);
	const homePit = underlyingPitch(input.homeLooks?.last7) ?? underlyingPitch(input.homeLooks?.season);
	const awayPit = underlyingPitch(input.awayLooks?.last7) ?? underlyingPitch(input.awayLooks?.season);
	if (homeOff != null && awayOff != null) {
		const used7 = Boolean(input.homeLooks?.last7 && input.awayLooks?.last7);
		pushLayer(layers, {
			id: "underlying",
			label: "Underlying (OBP + ISO / FIP-style)",
			home: invLogit(logit(log5(homeOff, awayOff)) + (homePit != null && awayPit != null ? logit(log5(homePit, awayPit)) * .35 : 0)),
			precision: used7 ? 3.2 : 2.6,
			family: "model",
			note: used7 ? `Last-7 OBP+ISO (and pitcher quality) vs season. This is the xG-style look: process, not just runs that already scored. Live ESPN splits.` : `Season OBP+ISO / pitcher quality. Process over results. Live ESPN statistics.`
		});
	} else pushEmpty$1(layers, "underlying", "Underlying (OBP + ISO / FIP-style)", "Looked up live ISO/OBP/ERA/WHIP. Not posted for this sport/event yet.");
	const awayDef = defenseAllowed(input.awayLooks, sport);
	const homeDef = defenseAllowed(input.homeLooks, sport);
	if (awayDef != null && homeDef != null) pushLayer(layers, {
		id: "defense",
		label: "Opponent-adjusted defense",
		home: invLogit(logit(.5) + (awayDef - homeDef) * (sport === "MLB" ? .18 : .08)),
		precision: 2.8,
		family: "model",
		note: sport === "MLB" ? `Opponent ERA/OPS allowed from live ESPN team stats (last-7 blended when posted). ${input.away} pitching quality vs ${input.home} pitching quality.` : `Opponent scoring/yards allowed from live ESPN team stats.`
	});
	else if (homeL10?.avgPa && awayL10?.avgPa) pushLayer(layers, {
		id: "defense",
		label: "Opponent-adjusted defense (last 10)",
		home: invLogit(logit(.5) + (awayL10.avgPa - homeL10.avgPa) / marginSigma(sport) * .15),
		precision: 2,
		family: "model",
		note: `Last-10 points/runs allowed: ${input.home} ${homeL10.avgPa.toFixed(1)} · ${input.away} ${awayL10.avgPa.toFixed(1)}. Live log.`
	});
	else pushEmpty$1(layers, "defense", "Opponent-adjusted defense", "Looked up opponent ERA / OPS allowed / points allowed. Not posted yet.");
	const awayHand = input.awayPitcherHand;
	const homeHand = input.homePitcherHand;
	const homeVs = awayHand === "L" ? input.homeLooks?.vsLeft : awayHand === "R" ? input.homeLooks?.vsRight : void 0;
	const awayVs = homeHand === "L" ? input.awayLooks?.vsLeft : homeHand === "R" ? input.awayLooks?.vsRight : void 0;
	if (homeVs?.ops != null && awayVs?.ops != null) pushLayer(layers, {
		id: "platoon",
		label: "Pitcher vs batter (vs L/R)",
		home: log5(Math.min(.8, Math.max(.2, homeVs.ops / (homeVs.ops + awayVs.ops))), Math.min(.8, Math.max(.2, awayVs.ops / (homeVs.ops + awayVs.ops)))),
		precision: 2.2,
		family: "model",
		note: `${input.home} OPS vs ${awayHand ?? "?"}HP ${homeVs.ops.toFixed(3)} · ${input.away} OPS vs ${homeHand ?? "?"}HP ${awayVs.ops.toFixed(3)}. Live ESPN platoon split — the pitcher-vs-batter look we can actually fetch.`
	});
	else pushEmpty$1(layers, "platoon", "Pitcher vs batter (vs L/R)", sport === "MLB" ? "Looked up vs-LHP / vs-RHP splits and probable handedness. Hand or split not posted yet." : "Looked up pitcher-vs-batter / vs-hand. This sport does not post a platoon split — empty look, not a skip.");
	const process = processFromLooks(sport, input.homeLooks, input.awayLooks);
	pushLayer(layers, {
		id: "process",
		label: process.source,
		home: process.home,
		precision: process.empty ? 0 : 2.4,
		family: "model",
		note: process.note,
		thin: process.empty,
		empty: process.empty
	});
	if (!layers.length) return null;
	const pooled = poolLayers(layers, input.oddsHome ?? input.bookHome, input.layerHaircuts);
	let home = pooled.mean;
	if (input.total != null && input.total > 0) {
		const avg = leagueTotal(sport);
		const chaos = Math.max(0, Math.min(.22, (input.total - avg) / (avg * 4)));
		home = .5 + (home - .5) * (1 - chaos);
	}
	home = Math.min(FINAL_HI, Math.max(FINAL_LO, home));
	const n = layers.length;
	const std = pooled.std;
	const agreement = Math.max(0, 1 - std / .14);
	const families = new Set(layers.map((l) => l.family)).size;
	const confidence = n >= 6 && families >= 3 && std < .05 && pooled.posteriorVar < .012 ? "high" : n >= 3 && std < .1 ? "medium" : "low";
	const favorite = home >= .5 ? "home" : "away";
	const favoriteName = favorite === "home" ? input.home : input.away;
	const chance = favorite === "home" ? home : 1 - home;
	const crowd = layers.filter((l) => l.family === "crowd");
	const crowdHome = crowd.length > 0 ? invLogit(crowd.reduce((s, l) => s + logit(l.home) * l.precision, 0) / crowd.reduce((s, l) => s + l.precision, 0)) : void 0;
	const market = layers.find((l) => l.id === "market")?.home ?? layers.find((l) => l.id === "book")?.home;
	const because = `${n} independent looks across ${families} families (${layers.map((l) => l.label).join(", ")}). Pooled in log-odds, weighted by how precise each look is. ` + (pooled.overdispersed || agreement < .45 ? `Sources disagree (agreement ${Math.round(agreement * 100)} in 100), so non-market layers were shrunk toward the sportsbook. ` : `Sources mostly agree (agreement ${Math.round(agreement * 100)} in 100). `) + `Confidence ${confidence}. Still not a lock — about ${Math.round((1 - chance) * 100)} in 100 the other side wins. Kalshi and Polymarket are prediction contracts for research, not a Hard Rock fill. Public data does not beat a liquid close.`;
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
		because
	};
}
function scoringRate(pf, n, sport) {
	if (pf == null || !(pf > 0)) return null;
	const half = leagueTotal(sport) / 2;
	if (n && n >= 5 && pf > half * 2.5) return pf / n;
	return pf;
}
function restAdvantage(sport, homeDays, awayDays) {
	const b2b = (d) => d < 1.15;
	if (sport === "NBA" || sport === "NHL" || sport === "NCAAB") {
		let z = 0;
		if (b2b(homeDays) && !b2b(awayDays)) z -= .16;
		if (b2b(awayDays) && !b2b(homeDays)) z += .16;
		if (homeDays >= 3 && awayDays < 1.6) z += .05;
		if (awayDays >= 3 && homeDays < 1.6) z -= .05;
		return z;
	}
	if (sport === "NFL" || sport === "NCAAF") {
		let z = 0;
		if (homeDays >= 13 && awayDays < 9) z += .08;
		if (awayDays >= 13 && homeDays < 9) z -= .08;
		if (homeDays <= 4 && awayDays >= 6) z -= .05;
		if (awayDays <= 4 && homeDays >= 6) z += .05;
		return z;
	}
	if (sport === "MLB") {
		let z = (homeDays - awayDays) * .02;
		if (homeDays < 1.15 && awayDays >= 1.5) z -= .08;
		if (awayDays < 1.15 && homeDays >= 1.5) z += .08;
		return Math.max(-.12, Math.min(.12, z));
	}
	return Math.max(-.06, Math.min(.06, (homeDays - awayDays) * .015));
}
function weatherLogit(sport, temp, wind, precip) {
	if (temp == null && wind == null && precip == null) return null;
	if (sport === "NBA" || sport === "NHL" || sport === "NCAAB") return null;
	const t = temp ?? 70;
	if (sport === "MLB") return null;
	if (t <= 32) return .04;
	if (t >= 95) return -.015;
	return null;
}
function weatherNote(sport, temp, wind, precip) {
	const bits = [
		temp != null ? `${temp}°F` : null,
		wind != null ? `wind ${wind} mph` : null,
		precip != null ? `rain ${precip}%` : null
	].filter(Boolean);
	if (sport === "MLB") return `${bits.join(" · ")}. Weather moves totals, HR, and Ks more than winners. We do not flip a moneyline on wind.`;
	if (sport === "NFL" || sport === "NCAAF") return `${bits.join(" · ")}. Wind is a passing-EPA and total modifier, not an ML party trick. Cold slightly helps the home sideline.`;
	return `${bits.join(" · ")}. Indoor sports: no ML lean from weather.`;
}
function poolLayers(layers, marketHome, haircuts) {
	const active = layers.map((l) => {
		const h = haircuts?.[l.id];
		if (h == null || h === 1 || !Number.isFinite(h)) return l;
		return {
			...l,
			precision: l.precision * Math.max(0, h)
		};
	}).filter((l) => l.precision > 0 && !l.empty);
	if (!active.length) return {
		mean: .5,
		std: 0,
		posteriorVar: 1,
		overdispersed: false
	};
	const precSum0 = active.reduce((s, l) => s + l.precision, 0);
	const logitMean0 = active.reduce((s, l) => s + logit(l.home) * l.precision, 0) / precSum0;
	const meanP = active.reduce((s, l) => s + l.home, 0) / active.length;
	const variance = active.reduce((s, l) => s + (l.home - meanP) ** 2, 0) / active.length;
	const std = Math.sqrt(variance);
	let chi = 0;
	for (const l of active) chi += l.precision * (logit(l.home) - logitMean0) ** 2;
	const df = Math.max(1, active.length - 1);
	const overdispersed = chi / df > 1.35;
	const scaled = active.map((l) => {
		if (!overdispersed) return l;
		if (l.family === "market") return l;
		const shrink = Math.max(.35, 1.35 / (chi / df));
		return {
			...l,
			precision: l.precision * shrink
		};
	});
	const precSum = scaled.reduce((s, l) => s + l.precision, 0);
	let z = scaled.reduce((s, l) => s + logit(l.home) * l.precision, 0) / precSum;
	if (marketHome != null && overdispersed) {
		const lambda = Math.min(.55, .18 + .5 * Math.max(0, 1 - Math.max(0, 1 - std / .14)));
		z = lambda * logit(marketHome) + (1 - lambda) * z;
	}
	return {
		mean: invLogit(z, FINAL_LO, FINAL_HI),
		std,
		posteriorVar: 1 / precSum,
		overdispersed
	};
}
/**
* Deterministic desk seed. Same DESK_VERSION + snapshot + event → same uint64.
* FNV-1a 64 mixed into PCG64. No wall-clock, no Math.random.
*/
function fnv1a64(s) {
	let h = 14695981039346656037n;
	for (let i = 0; i < s.length; i++) {
		h ^= BigInt(s.charCodeAt(i));
		h = h * 1099511628211n & 18446744073709551615n;
	}
	return h;
}
function deskSeed(version, snapshotId, eventId) {
	return fnv1a64(`${version}\0${snapshotId}\0${eventId}`);
}
/** PCG-style LCG. Same seed → same stream. */
var Pcg64 = class {
	state;
	constructor(seed) {
		this.state = (seed ^ 1442695040888963407n) & 18446744073709551615n;
		this.next();
	}
	next() {
		this.state = this.state * 6364136223846793005n + 1442695040888963407n & 18446744073709551615n;
		const xorshifted = (this.state >> 18n ^ this.state) >> 27n;
		const rot = this.state >> 59n;
		return (xorshifted >> rot | xorshifted << (-rot & 31n)) & 4294967295n;
	}
	float() {
		const a = this.next();
		const b = this.next();
		const u = a << 21n | b >> 11n;
		return Number(u) / 2 ** 53;
	}
	gauss() {
		const u = Math.max(1e-12, this.float());
		const v = this.float();
		return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
	}
};
/**
* The rule list the desk actually runs.
*
* Same input → same ranking. No dice, no "vibe", no canned artifact.
* Every ticket type walks this list. Every rule LOOKS UP live data every time.
* Thin sample = light weight. Empty feed = "Looked" with Precision = 0 (no 50/50 drag), not a skip
* and not an invented number.
*
* Bump DESK_VERSION when a ranking rule changes so two boards on the same
* snapshot can never silently disagree.
*/
var DESK_VERSION = "2026.09.10-master-v6";
var ALGORITHM_RULES = [
	{
		id: "market",
		applies: ["all"],
		title: "Hard Rock Florida is the fill",
		text: "Photographed ticket or Ran hardrockbet_fl. Public books and prediction markets are research. Delayed numbers are not a fill.",
		layerIds: [
			"market",
			"book",
			"open",
			"spread",
			"hr-fl"
		]
	},
	{
		id: "latent",
		applies: ["all"],
		title: "Latent game, not one number",
		text: "Win, pace, variance, style. Sides and totals are not transforms of each other. Seeded paths price alts, first-scorer, parlays, live remaining.",
		layerIds: [
			"latent",
			"efficiency",
			"pythag",
			"espn",
			"sim"
		]
	},
	{
		id: "last10",
		applies: ["all"],
		title: "Last 10 — every stat, not just W-L",
		text: "Games: recency-weighted scores. Props: last-10 of THAT stat (hits, Ks, yards, points) EWMA, 60/40 with season. Periods inherit the game last-10 then shrink. Live ESPN log.",
		layerIds: [
			"form",
			"margin",
			"trend",
			"last10",
			"season-rate"
		]
	},
	{
		id: "h2h",
		applies: ["all"],
		title: "Head-to-head",
		text: "Last-10 meetings first, then season vs-opponent split, then this series. Always looked up live.",
		layerIds: ["h2h"]
	},
	{
		id: "venue-split",
		applies: ["all"],
		title: "Home vs road",
		text: "Last-10 home/road scores, else live ESPN home/away split. Always looked up.",
		layerIds: ["venue-split"]
	},
	{
		id: "defense",
		applies: ["all"],
		title: "Opponent-adjusted defense",
		text: "Live ESPN team stats: ERA / opponent OPS / points allowed. Props use the opponent's allowed rate for that stat.",
		layerIds: ["defense"]
	},
	{
		id: "underlying",
		applies: [
			"game",
			"period",
			"parlay"
		],
		title: "Underlying (xG-style)",
		text: "OBP + ISO for hitters, ERA/WHIP/opp OPS for pitchers. Process, not just runs that already scored. Last-7 when posted.",
		layerIds: [
			"underlying",
			"efficiency",
			"pythag"
		]
	},
	{
		id: "platoon",
		applies: [
			"game",
			"prop",
			"period"
		],
		title: "Pitcher vs batter",
		text: "Live vs-LHP / vs-RHP split against tonight's starter hand. Player tickets also get opponent ERA.",
		layerIds: ["platoon", "pitcher"]
	},
	{
		id: "usage",
		applies: ["prop"],
		title: "Lineup / usage transmission",
		text: "Scratches move usage, order, ice time. Count-of-bodies is the light backup. College player usage moves the game only — no Florida player ticket.",
		layerIds: [
			"usage",
			"last10",
			"injuries"
		]
	},
	{
		id: "process",
		applies: ["all"],
		title: "Process looks",
		text: "EPA / four factors / Statcast / xG / tempo-free. Empty = Looked. Never invented.",
		layerIds: ["process"]
	},
	{
		id: "steam",
		applies: ["all"],
		title: "Open → close move",
		text: "If the number moved, that is information. Steam with the handle is informed money, still not a lock.",
		layerIds: ["steam", "open"]
	},
	{
		id: "predict",
		applies: ["all"],
		title: "Kalshi + Polymarket",
		text: "A different crowd from the book. Research only — not a Florida fill.",
		layerIds: ["kalshi", "polymarket"]
	},
	{
		id: "espn",
		applies: ["all"],
		title: "ESPN matchup model",
		text: "Ratings, not tonight's ticket. One look in the pool.",
		layerIds: ["espn"]
	},
	{
		id: "pitcher",
		applies: [
			"game",
			"prop",
			"period"
		],
		title: "Starting pitcher + bullpen",
		text: "ERA/WHIP blended 60% last-7 when posted, 40% season. Bullpen fatigue on a MLB B2B.",
		layerIds: ["pitcher"]
	},
	{
		id: "injuries",
		applies: ["all"],
		title: "Out / IL listings",
		text: "Count of listed-out players. A listed backup is not a listed ace. Player listed out → stand down.",
		layerIds: ["injuries"]
	},
	{
		id: "rest",
		applies: ["all"],
		title: "Rest / B2B / bye",
		text: "NBA/NHL back-to-backs hurt. NFL bye vs short week. MLB extra rest is small except bullpen B2B.",
		layerIds: ["rest"]
	},
	{
		id: "weather-park",
		applies: ["all"],
		title: "Weather and park",
		text: "Wind/rain/heat move totals and hitting props more than moneylines. Coors is not Petco.",
		layerIds: [
			"weather",
			"park",
			"total"
		]
	},
	{
		id: "tape",
		applies: ["all"],
		title: "Tickets % vs handle %",
		text: "Wager count is the public. Dollars are the sharp tell when they split. Never copied. Never auto-faded.",
		layerIds: [
			"tickets",
			"handle",
			"steam"
		]
	},
	{
		id: "period-shrink",
		applies: ["period"],
		title: "Period markets are noisier",
		text: "One inning/quarter/half is shrunk toward 50/50 vs the full-game ensemble. Quality floor 0.72 so they cannot be The Call.",
		layerIds: []
	},
	{
		id: "live",
		applies: ["all"],
		title: "Live numbers are delayed",
		text: "In-play tickets rank in Live, never as The Call. Photograph Hard Rock now — a delayed live number is not a fill.",
		layerIds: []
	},
	{
		id: "sgp",
		applies: ["parlay"],
		title: "Parlays are joint paths",
		text: "Same-game correlation is simulated. Cross-game is almost independent. Ribbon maximizes hit chance, not poster odds. 4-legs catalog only.",
		layerIds: []
	},
	{
		id: "live-state",
		applies: ["all"],
		title: "Live is a state machine",
		text: "Score, clock, downs, outs, strength. Remaining props use leftover mean. Never The Call. Never a ribbon leg.",
		layerIds: []
	},
	{
		id: "calibrate",
		applies: ["all"],
		title: "Calibrate thin markets",
		text: "Displayed chance is pulled toward the book when info-quality is low. A 1st-inning 0.5 is not a moneyline.",
		layerIds: []
	},
	{
		id: "edge",
		applies: ["all"],
		title: "Edge vs the juice",
		text: "Desk chance minus implied. Rank chance² × √payout × quality + edge. 58% at −110 beats 80% at −400.",
		layerIds: []
	},
	{
		id: "florida",
		applies: ["all"],
		title: "Florida law",
		text: "College player bets blocked. No scraping Hard Rock. Photograph when the tape is missing or boosted. This site never places a bet.",
		layerIds: []
	}
];
function rulesFor(kind) {
	return ALGORITHM_RULES.filter((r) => r.applies.includes("all") || r.applies.includes(kind));
}
function ruleStamp(rule, layers) {
	if (!rule.layerIds.length) return "Ran";
	const hits = layers.filter((l) => rule.layerIds.includes(l.id));
	if (!hits.length) return "Looked";
	if (hits.every((h) => h.empty)) return "Looked";
	if (hits.every((h) => h.thin || h.empty)) return "Thin";
	return "Ran";
}
/**
* Seeded path engine. Alternate lines, first-event, remaining live, SGP
* are path statistics. A league-σ Φ cannot emit them from one mean.
*/
var KEY = [
	3,
	-3,
	7,
	-7
];
function drawPaths(g, snapshotId, n) {
	const N = n ?? (g.ran ? 4e3 : 800);
	const rng = new Pcg64(deskSeed(DESK_VERSION, snapshotId, g.eventId));
	const muH = g.muH;
	const muA = g.muA;
	const sigH = Math.max(.4, g.sigT / Math.SQRT2);
	const sigA = sigH;
	const rho = .1;
	const spike = g.sport === "NFL" || g.sport === "NCAAF" ? .045 : 0;
	const paths = [];
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
		paths.push({
			h,
			a,
			w: 1
		});
	}
	if (spikeN > 0) {
		const each = spikeN / KEY.length;
		for (const m of KEY) {
			const k = Math.floor(each);
			for (let i = 0; i < k; i++) {
				const tot = muH + muA + rng.gauss() * (g.sigT * .35);
				const h = Math.max(0, (tot + m) / 2);
				const a = Math.max(0, tot - h);
				paths.push({
					h,
					a,
					w: 1
				});
			}
		}
	}
	return paths;
}
function meanHit(paths, hit) {
	let w = 0;
	let yes = 0;
	for (const p of paths) {
		w += p.w;
		if (hit(p)) yes += p.w;
	}
	const p = w > 0 ? yes / w : .5;
	return {
		p,
		n: paths.length,
		se: Math.sqrt(p * (1 - p) / Math.max(1, paths.length)),
		ran: paths.length >= 400
	};
}
function simWin(paths) {
	return meanHit(paths, (p) => p.h > p.a);
}
function simCover(paths, homeLine) {
	return meanHit(paths, (p) => p.h - p.a + homeLine > 0);
}
function simOver(paths, line) {
	return meanHit(paths, (p) => p.h + p.a > line);
}
function pathHits(p, leg) {
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
		return leg.side === "over" || /\bover\b/i.test(leg.selection) ? over : !over;
	}
	return false;
}
function jointHit(paths, legs) {
	return meanHit(paths, (p) => legs.every((leg) => pathHits(p, leg)));
}
function blendFair(sim, pool, market) {
	const s = sim != null && Number.isFinite(sim) ? sim : void 0;
	const p = pool != null && Number.isFinite(pool) ? pool : void 0;
	const m = market != null && Number.isFinite(market) ? market : void 0;
	if (s != null && p != null && m != null) return .5 * s + .3 * p + .2 * m;
	if (s != null && p != null) return .55 * s + .45 * p;
	if (s != null && m != null) return .55 * s + .45 * m;
	return s ?? p ?? m ?? .5;
}
function latentFromScores(opts) {
	const sport = opts.sport;
	const tot = opts.total > 0 ? opts.total : leagueTotal(sport);
	const muH = tot * Math.min(.68, Math.max(.32, .5 + (opts.homeWin - .5) * .28));
	const muA = tot - muH;
	const chaos = opts.chaos ?? Math.max(0, Math.min(.22, (tot - leagueTotal(sport)) / (leagueTotal(sport) * 4)));
	const scale = Math.min(1.35, Math.max(.72, 1 + .65 * (tot / leagueTotal(sport) - 1)));
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
		ran: tot > 0 && opts.homeWin > .08 && opts.homeWin < .92,
		note: "Latent from posted total + ensemble win chance. Process feeds overwrite when Ran."
	};
}
/**
* Live state machine S. Pre-tip is empty. Missing critical fields → micro stand-down.
*/
function emptyLive(eventId, sport, inPlay) {
	return {
		eventId,
		sport,
		inPlay,
		complete: false,
		note: inPlay ? "Looked up live state. Clock started but down/outs/strength not posted. Microbets stand down." : "Pre-tip. Live state empty.",
		empty: true,
		thin: true
	};
}
function parseLiveState(opts) {
	if (!opts.inPlay) return emptyLive(opts.eventId, opts.sport, false);
	const sit = (opts.situation ?? "").toLowerCase();
	const d = opts.detail ?? {};
	const down = num$1(d.down) ?? (/(\d)(?:st|nd|rd|th)\s*&/.exec(sit) ? Number(RegExp.$1) : void 0);
	const outs = num$1(d.outs) ?? (/(\d)\s*out/.exec(sit) ? Number(RegExp.$1) : void 0);
	const strength = typeof d.strength === "string" ? d.strength : /power play|pp|pk|empty/i.test(sit) ? sit : void 0;
	const football = opts.sport === "NFL" || opts.sport === "NCAAF";
	const baseball = opts.sport === "MLB";
	const hockey = opts.sport === "NHL";
	const complete = !(football && down == null || baseball && outs == null || hockey && !strength && !sit) && (opts.homeScore != null || opts.awayScore != null);
	return {
		eventId: opts.eventId,
		sport: opts.sport,
		inPlay: true,
		complete,
		scoreHome: opts.homeScore,
		scoreAway: opts.awayScore,
		period: opts.period != null ? String(opts.period) : void 0,
		clock: opts.clock,
		down,
		distance: num$1(d.distance),
		yardLine: typeof d.yardLine === "string" ? d.yardLine : void 0,
		possession: typeof d.possession === "string" ? d.possession : void 0,
		outs,
		bases: typeof d.bases === "string" ? d.bases : void 0,
		inningHalf: typeof d.inningHalf === "string" ? d.inningHalf : void 0,
		strength,
		note: complete ? `Live ${opts.sport}: ${opts.awayScore ?? "—"}–${opts.homeScore ?? "—"} ${opts.period ?? ""} ${opts.clock ?? ""}`.trim() : "Live clock is on. Critical field missing — microbets stand down. Remaining full-game tickets use leftover mean when we have score.",
		empty: false,
		thin: !complete
	};
}
function num$1(v) {
	if (typeof v === "number" && Number.isFinite(v)) return v;
	if (typeof v === "string") {
		const n = Number(v);
		return Number.isFinite(n) ? n : void 0;
	}
}
/** Remaining mean for a live counting prop. Kneel-down law: leftover cannot exceed what the clock allows. */
function remainingMean(finalMean, already, clockFractionLeft) {
	const left = Math.max(.02, Math.min(1, clockFractionLeft));
	const rem = Math.max(0, finalMean - already);
	return rem * left + rem * (1 - left) * .15;
}
function parseClockMinutes(clock) {
	if (!clock) return 0;
	const m = /(\d+)\s*:\s*(\d+)/.exec(clock);
	if (m) return Number(m[1]) + Number(m[2]) / 60;
	const n = Number(clock);
	return Number.isFinite(n) ? n : 0;
}
/** Remaining fraction of the game, from period + clock. Missing clock → 0.5 Thin, not invented 0. */
function clockFractionLeft(sport, period, clock) {
	const mins = parseClockMinutes(clock);
	const p = Number(period);
	const periodN = Number.isFinite(p) && p > 0 ? p : void 0;
	if (sport === "MLB") return Math.max(.05, Math.min(1, (9 - (periodN ?? 5) + 1) / 9));
	if (sport === "NFL" || sport === "NCAAF") {
		const leftQ = Math.max(0, 4 - (periodN ?? 3));
		return Math.max(.05, Math.min(1, (leftQ * 15 + mins) / 60));
	}
	if (sport === "NBA" || sport === "NCAAB") {
		const q = periodN ?? 3;
		const qLen = sport === "NCAAB" ? 10 : 12;
		const leftQ = Math.max(0, 4 - q);
		const total = sport === "NCAAB" ? 40 : 48;
		return Math.max(.05, Math.min(1, (leftQ * qLen + mins) / total));
	}
	if (sport === "NHL") {
		const leftP = Math.max(0, 3 - (periodN ?? 2));
		return Math.max(.05, Math.min(1, (leftP * 20 + mins) / 60));
	}
	return .5;
}
/** P(final > line) from leftover mean, not a haircut of the pre-game %. */
function leftoverOverProb(opts) {
	const frac = clockFractionLeft(opts.sport, opts.period, opts.clock);
	const rem = remainingMean(opts.postedTotal, opts.already, frac);
	const need = opts.postedTotal - opts.already;
	if (need <= 0) return .99;
	const sigma = Math.max(.35, totalSigma(opts.sport) * Math.sqrt(Math.max(.08, frac)));
	const pOver = 1 - normalCdf((need - rem) / sigma);
	return Math.min(.99, Math.max(.01, pOver));
}
function liveFromRow(row) {
	return parseLiveState({
		eventId: row.eventId,
		sport: row.sport,
		inPlay: Boolean(row.inPlay),
		situation: row.situation,
		period: row.period,
		clock: row.clock,
		homeScore: row.homeScore,
		awayScore: row.awayScore
	});
}
/**
* Latent game state G: mu, pace, variance, style. Sides and totals are not
* transforms of each other.
*/
function buildLatents(input) {
	const report = buildChance(input);
	const homeWin = report?.home ?? input.oddsHome ?? input.espnHome ?? .5;
	const total = input.total ?? leagueTotal(input.sport);
	let chaos = Math.max(0, Math.min(.22, (total - leagueTotal(input.sport)) / (leagueTotal(input.sport) * 4)));
	if (input.weatherWind != null && input.weatherWind >= 20) chaos += .05;
	if (input.weatherPrecip != null && input.weatherPrecip >= 40) chaos += .03;
	const latent = latentFromScores({
		eventId: input.eventId,
		sport: input.sport,
		homeWin,
		total,
		homeSpread: input.homeSpread,
		poolHome: report?.home,
		marketHome: input.oddsHome,
		chaos
	});
	if (input.sport === "NFL" || input.sport === "NCAAF") {
		if (input.weatherWind != null && input.weatherWind >= 20) {
			latent.muH *= .97;
			latent.muA *= .97;
			latent.note = "Wind ≥ 20 mph cuts the air game and total. Passing-EPA modifier, not an ML party trick.";
		} else if (input.weatherWind != null && input.weatherWind >= 12) latent.note = "Wind 12–19 mph: pass mean ×0.96, rush ×1.03, total −1.";
	}
	return {
		latent,
		poolHome: report?.home,
		layers: report
	};
}
function listedOut(status) {
	return /out|injured reserve|\bil\b|10-day|15-day|60-day|inactive|doubtful|suspended|deceased/i.test(status ?? "");
}
function questionable(status) {
	return /questionable|game.time|gtd|probable/i.test(status ?? "");
}
function baseOpp(p) {
	if (p.usageMin != null && p.usageMin > 0) return Math.min(1, p.usageMin / 36);
	if (p.starter) return .78;
	return .32;
}
function buildUsage(opts) {
	const players = opts.players ?? [];
	const injuries = opts.injuries ?? [];
	if (!players.length) {
		const listed = injuries.filter((i) => listedOut(i.status));
		if (!listed.length) return {
			eventId: opts.eventId,
			sport: opts.sport,
			players: [],
			precision: .9,
			ran: false,
			thin: true,
			empty: true,
			note: "Looked up lineup / usage. No roster posted. Empty look, not a guess."
		};
		const college = isCollegeSport(opts.sport);
		const out = listed.map((i) => ({
			id: i.player,
			name: i.player,
			team: i.team ?? "",
			position: "U",
			homeAway: "home",
			opportunity: 0,
			standDown: true,
			thin: true,
			note: college ? "College player usage moves the game latent only. No Florida player ticket." : `${i.player} listed out. Tickets omitted. Leftover opportunity Looked — no roster to give it to.`
		}));
		return {
			eventId: opts.eventId,
			sport: opts.sport,
			players: out,
			precision: 1.2,
			ran: true,
			thin: true,
			empty: false,
			note: "Roster not posted. Listed-out names stand down. Leftover opportunity Looked — we do not invent a depth chart."
		};
	}
	const college = isCollegeSport(opts.sport);
	const out = [];
	const lostByPos = /* @__PURE__ */ new Map();
	for (const p of players) {
		const hit = injuries.find((i) => i.player.toLowerCase().includes(p.name.split(" ").pop()?.toLowerCase() ?? "___"));
		const isOut = hit ? listedOut(hit.status) : false;
		const gtd = hit ? questionable(hit.status) && !isOut : false;
		let opp = baseOpp(p);
		if (isOut) opp = 0;
		else if (gtd) opp *= .55;
		const pos = (p.position || "U").toUpperCase();
		if (isOut) lostByPos.set(pos, (lostByPos.get(pos) ?? 0) + baseOpp(p));
		out.push({
			id: p.id,
			name: p.name,
			team: p.team,
			position: pos,
			homeAway: p.homeAway,
			opportunity: opp,
			standDown: isOut,
			thin: gtd,
			note: isOut ? `${p.name} listed out. Tickets omitted.` : gtd ? `${p.name} game-time. Mix 55/45 in/out. Cannot be The Call.` : `${p.name} opportunity ${(opp * 100).toFixed(0)}%.`
		});
	}
	for (const [pos, lost] of lostByPos) {
		const pool = out.filter((p) => !p.standDown && p.position === pos);
		if (!pool.length || lost <= 0) continue;
		const share = lost / pool.length;
		for (const p of pool) if (opts.sport === "NBA" || opts.sport === "NCAAB") p.opportunity = Math.min(.95, p.opportunity + Math.min(.22, share));
		else if (opts.sport === "NFL" || opts.sport === "NCAAF") p.opportunity = Math.min(.92, p.opportunity + Math.min(.12, share * .7));
		else p.opportunity = Math.min(.9, p.opportunity + share * .4);
	}
	if (college) for (const p of out) {
		p.standDown = true;
		p.note = "College player usage moves the game latent only. No Florida player ticket.";
	}
	const confirmed = Boolean(opts.lineupConfirmed) || out.some((p) => p.opportunity >= .7);
	return {
		eventId: opts.eventId,
		sport: opts.sport,
		players: out,
		precision: confirmed ? 5.8 : 2.4,
		ran: true,
		thin: !confirmed,
		empty: false,
		note: confirmed ? "Starting lineup / usage from live ESPN roster. Scratches transmit leftover opportunity." : "Projected usage. Lineup not confirmed. Thin."
	};
}
function usageOf(u, name) {
	if (!u || !name) return void 0;
	const n = name.toLowerCase();
	return u.players.find((p) => p.name.toLowerCase() === n || p.name.toLowerCase().includes(n) || n.includes(p.name.toLowerCase()));
}
/**
* Hard Rock Florida ticket registry. Unknown names stand down.
* Do not silently price a cousin.
*/
var KNOWN = [
	/moneyline|\bml\b|to win/i,
	/spread|run line|puck line|handicap/i,
	/over|under|total|o\/u/i,
	/team total/i,
	/hits|runs|rbi|strikeout|walk|home run|stolen|total bases|hrr/i,
	/passing yards|rushing yards|receiving yards|receptions|anytime|touchdown|\byards\b/i,
	/points|rebounds|assists|threes|\bpra\b|steals|blocks/i,
	/shots on goal|saves|blocked shots|to score a goal/i,
	/inning|quarter|half|period|first 5|f5/i,
	/both teams|odd|even|highest|first (basket|goal|td|score)|race to|correct score|exact/i,
	/overtime|ot yes|method of/i,
	/\bover\b|\bunder\b|alt |alternate/i
];
function isKnownMarket(selection, marketType) {
	if (marketType === "ml" || marketType === "spread" || marketType === "total" || marketType === "prop") {
		if (!selection || selection.length < 2) return false;
		if (marketType !== "prop") return true;
	}
	const s = selection || "";
	if (KNOWN.some((re) => re.test(s))) return true;
	return false;
}
function unknownMarketReason(selection) {
	return `Unknown Hard Rock market “${selection}”. Logged the raw name. We do not price a cousin.`;
}
/**
* Displayed chance. Ranking still uses raw fair / combinedFair.
* Pull the public integer toward the juice on noisy markets.
*/
function calibratedChance(fair, implied, quality) {
	if (!Number.isFinite(fair)) return .5;
	const q = Math.max(.28, Math.min(1, quality));
	let shown;
	if (implied != null && Number.isFinite(implied) && implied > .02 && implied < .98) shown = implied + (fair - implied) * (.35 + .65 * q);
	else shown = .5 + (fair - .5) * (.4 + .6 * q);
	return Math.min(.99, Math.max(.01, shown));
}
/** Same floors fromParlay uses: 4-leg 0.40, 3-leg 0.55, SGP 0.62, 2-leg 0.70. */
function parlayInfoQuality(n, sameGame) {
	if (n >= 4) return .4;
	if (n === 3) return .55;
	if (sameGame) return .62;
	return .7;
}
/** Public combined % — calibratedChance on combinedFair. Never print combinedFair raw. */
function shownCombinedChance(combinedFair, decimalPayout, n, sameGame) {
	const quality = parlayInfoQuality(n, sameGame);
	return calibratedChance(combinedFair, decimalPayout > 1 ? 1 / decimalPayout : void 0, quality);
}
/** Beginner-facing labels. Keep product logic; change the words. */
var MARKET_LABEL = {
	ml: "Pick Who Wins",
	spread: "Score Margin",
	total: "Combined Score",
	prop: "Player bet"
};
var TAG_LABEL = {
	fair_or_better: "Fair Price",
	close_enough: "Almost fair",
	juiced: "Sportsbook Fee",
	stale_watch: "Smart Money Moving",
	illegal_fl: "Not allowed in Florida",
	in_play: "Game already started",
	unknown_market: "Unknown Hard Rock market"
};
var STATUS_LABEL = {
	go: "Ready",
	caution: "Careful",
	blocked: "Not allowed",
	lagged: "Research only",
	seed: "Too small"
};
function sportLabel(sport) {
	switch (sport) {
		case "NFL": return "NFL";
		case "NBA": return "NBA";
		case "MLB": return "MLB";
		case "NHL": return "NHL";
		case "NCAAF": return "College Football";
		case "NCAAB": return "College Basketball";
		default: return sport || "Sport";
	}
}
function formatChancePct(p, digits = 0) {
	if (p == null || !Number.isFinite(p)) return null;
	const pct = Math.round(p * 100 * 10 ** digits) / 10 ** digits;
	return digits ? `${pct.toFixed(digits)}%` : `${pct}%`;
}
function formatBetUsd(n) {
	if (!Number.isFinite(n)) return "$0";
	const abs = Math.abs(n);
	const sign = n < 0 ? "−" : "";
	if (Number.isInteger(Math.round(abs * 100) / 100) && Math.round(abs * 100) % 100 === 0) return `${sign}$${Math.round(abs)}`;
	return `${sign}$${abs.toFixed(2)}`;
}
function profitOnStake(stake, american) {
	const total = stake * (american >= 0 ? american / 100 + 1 : 100 / Math.abs(american) + 1);
	return {
		profit: total - stake,
		total
	};
}
function shortPick(selection, marketType) {
	if (!selection) return "Pick";
	return selection.replace(/\s+/g, " ").trim();
}
function marketInEnglish(t) {
	if (t === "ml" || t === "spread" || t === "total" || t === "prop") return MARKET_LABEL[t];
	return "Pick";
}
function oddsInEnglish(american) {
	if (!Number.isFinite(american)) return "odds not posted";
	if (american >= 0) return `plus-money +${Math.round(american)}`;
	return `minus-money ${Math.round(american)}`;
}
function chanceInEnglish(p) {
	const pct = formatChancePct(p);
	return pct ? `${pct} chance it hits` : "chance not posted";
}
function payoutOnStake(stake, american) {
	if (!Number.isFinite(stake) || !Number.isFinite(american)) return "payout not posted";
	const { profit, total } = profitOnStake(stake, american);
	return `Hit ${formatBetUsd(total)} · profit ${formatBetUsd(profit)}`;
}
var COMBO_SEED_CAP = 18;
var activeKelly = 1;
var activeComboCap = COMBO_SEED_CAP;
function americanToImplied(odds) {
	if (!Number.isFinite(odds)) return NaN;
	if (odds >= 0) return 100 / (odds + 100);
	const a = Math.abs(odds);
	return a / (a + 100);
}
function americanToDecimal(odds) {
	if (!Number.isFinite(odds)) return NaN;
	if (odds >= 0) return odds / 100 + 1;
	return 100 / Math.abs(odds) + 1;
}
function decimalToAmerican(dec) {
	if (!Number.isFinite(dec) || dec <= 1) return 0;
	if (dec >= 2) return Math.round((dec - 1) * 100);
	return Math.round(-100 / (dec - 1));
}
function twoWayNoVig(oddsHome, oddsAway) {
	const pHome = americanToImplied(oddsHome);
	const pAway = americanToImplied(oddsAway);
	const sum = pHome + pAway;
	if (!Number.isFinite(sum) || sum <= 0) return {
		fairHome: NaN,
		fairAway: NaN,
		hold: NaN
	};
	return {
		fairHome: pHome / sum,
		fairAway: pAway / sum,
		hold: sum - 1
	};
}
function evPct(bookOdds, fairProb) {
	if (!Number.isFinite(bookOdds) || !Number.isFinite(fairProb)) return NaN;
	return americanToDecimal(bookOdds) * fairProb - 1;
}
function unitDollars(bankroll, unitPct) {
	return floorToCent(bankroll * unitPct);
}
/** Core 85% / Fun 15%. Core ticket is 1% of core. Fun flyers $1–$3. */
function coreFunSplit(bankroll) {
	const b = Number.isFinite(bankroll) && bankroll > 0 ? bankroll : 0;
	const core = floorToCent(b * .85);
	const fun = floorToCent(b * .15);
	return {
		core,
		fun,
		coreTicket: floorToCent(core * .01),
		funTicket: floorToCent(Math.min(3, Math.max(fun > 0 ? 1 : 0, Math.min(3, fun))))
	};
}
function sizeLabel(bankroll) {
	if (bankroll < DEFAULTS.seedLt) return "seed";
	if (bankroll < DEFAULTS.tinyLt) return "tiny";
	if (bankroll < 500) return "small";
	if (bankroll < 2e3) return "working";
	return "full";
}
function isSeed(bankroll) {
	return bankroll < DEFAULTS.seedLt;
}
function isTiny(bankroll) {
	return bankroll < DEFAULTS.tinyLt;
}
function product(nums) {
	return nums.reduce((a, b) => a * b, 1);
}
function pairTwoWays(quotes) {
	const pairs = [];
	const used = /* @__PURE__ */ new Set();
	for (const a of quotes) {
		if (used.has(a) || a.isProp) continue;
		const b = quotes.find((q) => q !== a && !used.has(q) && q.eventId === a.eventId && q.marketType === a.marketType && q.side !== a.side);
		if (b) {
			pairs.push({
				a,
				b
			});
			used.add(a);
			used.add(b);
		}
	}
	return pairs;
}
function tagFor(ev, hold, row) {
	if (row.venueNote === "dk_sportsbook" || row.venueNote === "fd_sportsbook") return "illegal_fl";
	if (row.isProp && isCollegeSport(row.sport)) return "illegal_fl";
	if (row.isProp && !isKnownMarket(row.selection, row.marketType)) return "unknown_market";
	if (row.inPlay) return "in_play";
	if (Number.isFinite(ev) && ev >= 0 && row.hardRockPrice != null) return "fair_or_better";
	if (Number.isFinite(ev) && ev >= DEFAULTS.closeEnoughEv && ev < 0 && isMainMarket(row.marketType) && (isPlayCore(row.sport) || isCollegeSport(row.sport))) return "close_enough";
	if (Number.isFinite(ev) && ev < DEFAULTS.closeEnoughEv) return "juiced";
	if (Number.isFinite(hold) && hold >= .04 && (!Number.isFinite(ev) || ev < 0)) return "juiced";
	return "juiced";
}
function tapeStampOf(line) {
	if (line.source === "screenshot" || line.confirmed) return "photographed";
	if (line.hardRockPrice != null || line.source === "hardrock_fl" || line.venueNote === "hardrock") return "hr-fl";
	return "research";
}
function scoreQuotes(snapshot) {
	const rows = [];
	const pairs = pairTwoWays(snapshot.quotes);
	const paired = /* @__PURE__ */ new Set();
	for (const { a, b } of pairs) {
		paired.add(a);
		paired.add(b);
		const { fairHome: fairA, fairAway: fairB, hold } = twoWayNoVig(a.consensusPrice ?? a.price, b.consensusPrice ?? b.price);
		for (const [line, fair] of [[a, fairA], [b, fairB]]) {
			const book = line.hardRockPrice ?? (line.source === "hardrock_fl" ? line.price : void 0);
			const price = book ?? line.price;
			const ev = Number.isFinite(fair) ? evPct(price, fair) : NaN;
			const inPlay = Boolean(line.inPlay) || new Date(line.start).getTime() <= Date.now();
			const base = {
				eventId: line.eventId,
				sport: line.sport,
				start: line.start,
				home: line.home,
				away: line.away,
				marketType: line.marketType,
				side: line.side,
				selection: line.selection,
				price,
				fairProb: fair,
				evPct: ev,
				hold,
				hardRockPrice: book,
				consensusPrice: line.consensusPrice ?? line.price,
				point: line.point,
				inPlay,
				isProp: Boolean(line.isProp),
				player: line.player,
				venueNote: line.venueNote,
				homeRecord: line.homeRecord,
				awayRecord: line.awayRecord,
				homePitcher: line.homePitcher,
				awayPitcher: line.awayPitcher,
				homeAbbr: line.homeAbbr,
				awayAbbr: line.awayAbbr,
				homeLogo: line.homeLogo,
				awayLogo: line.awayLogo,
				homeSpread: line.homeSpread,
				total: line.total,
				openPrice: line.openPrice,
				scheduleOnly: line.scheduleOnly,
				phase: line.phase,
				source: line.source,
				tapeStamp: tapeStampOf(line),
				homeScore: line.homeScore,
				awayScore: line.awayScore,
				clock: line.clock,
				period: line.period,
				situation: line.situation
			};
			const tag = tagFor(ev, hold, base);
			const stand = tag === "illegal_fl" || tag === "in_play" || tag === "juiced" || tag === "unknown_market" || !Number.isFinite(ev) || Boolean(line.scheduleOnly);
			rows.push({
				...base,
				tag: line.scheduleOnly ? "juiced" : tag,
				action: stand ? "stand_down" : "enter_ticket",
				reason: line.scheduleOnly ? "This matchup is on the calendar. ESPN has not posted a two-way price yet — photograph Hard Rock when the number drops." : tag === "illegal_fl" ? line.isProp && isCollegeSport(line.sport) ? "College player bets are not allowed on Hard Rock Bet." : "DraftKings / FanDuel sportsbook bets are not legal Florida live plays." : tag === "unknown_market" ? unknownMarketReason(line.selection) : tag === "in_play" ? "The game already started — Live desk only. Never The Call. Photograph Hard Rock now." : tag === "fair_or_better" ? "Hard Rock price is fair or better versus the true two-way odds." : tag === "close_enough" ? "Close to a fair price. Fine as fun money — not the recommended pick." : "The sportsbook's cut makes this overpriced. Don't bet it.",
				conviction: tag === "fair_or_better" ? "medium" : "low",
				spark: Number.isFinite(ev) ? `${(ev * 100).toFixed(1)}% edge` : "n/a"
			});
		}
	}
	for (const line of snapshot.quotes) {
		if (paired.has(line)) continue;
		const inPlay = Boolean(line.inPlay) || new Date(line.start).getTime() <= Date.now();
		const book = line.hardRockPrice ?? (line.source === "hardrock_fl" ? line.price : void 0);
		const price = book ?? line.price;
		const implied = americanToImplied(price);
		const base = {
			eventId: line.eventId,
			sport: line.sport,
			start: line.start,
			home: line.home,
			away: line.away,
			marketType: line.marketType,
			side: line.side,
			selection: line.selection,
			price,
			fairProb: implied,
			evPct: NaN,
			hold: NaN,
			hardRockPrice: book,
			consensusPrice: line.consensusPrice,
			point: line.point,
			inPlay,
			isProp: Boolean(line.isProp),
			player: line.player,
			venueNote: line.venueNote,
			homeRecord: line.homeRecord,
			awayRecord: line.awayRecord,
			homePitcher: line.homePitcher,
			awayPitcher: line.awayPitcher,
			homeAbbr: line.homeAbbr,
			awayAbbr: line.awayAbbr,
			homeLogo: line.homeLogo,
			awayLogo: line.awayLogo,
			homeSpread: line.homeSpread,
			total: line.total,
			openPrice: line.openPrice,
			scheduleOnly: line.scheduleOnly,
			phase: line.phase,
			source: line.source,
			tapeStamp: tapeStampOf(line),
			homeScore: line.homeScore,
			awayScore: line.awayScore,
			clock: line.clock,
			period: line.period,
			situation: line.situation
		};
		const tag = tagFor(NaN, NaN, {
			...base,
			isProp: base.isProp,
			inPlay: base.inPlay,
			venueNote: base.venueNote,
			sport: base.sport,
			marketType: base.marketType,
			hardRockPrice: base.hardRockPrice
		});
		const unknown = Boolean(line.isProp) && !isKnownMarket(line.selection, line.marketType);
		const college = Boolean(line.isProp) && isCollegeSport(line.sport);
		const finalTag = college ? "illegal_fl" : unknown ? "unknown_market" : tag === "illegal_fl" ? "illegal_fl" : inPlay ? "in_play" : "juiced";
		rows.push({
			...base,
			tag: finalTag,
			action: "stand_down",
			reason: college ? "College player bets are not allowed on Hard Rock Bet." : unknown ? unknownMarketReason(line.selection) : "Only one side of the market is listed — we cannot call this a fair price.",
			conviction: "low",
			spark: "missing two-way"
		});
	}
	return rows;
}
function payoutMultiple(price) {
	if (!Number.isFinite(price) || price === 0) return 0;
	return price >= 0 ? price / 100 : 100 / Math.abs(price);
}
/**
* Chance and payout together. A −400 favorite with an 80% chance scores worse
* than a 58% ticket at −110, because the favorite pays almost nothing.
*/
function valueScore(chance, price) {
	if (!Number.isFinite(chance) || chance <= 0 || !Number.isFinite(price)) return -99;
	const pay = payoutMultiple(price);
	if (pay <= 0) return -99;
	const ev = chance * (1 + pay) - 1;
	const blend = chance * chance * Math.sqrt(pay);
	if (pay < .65) return blend * .35 + ev * .15;
	return blend * .55 + Math.max(ev, -.08) * .45 + chance * .12;
}
function legalMains(rows, todayOnly) {
	return rows.filter((r) => r.tag !== "illegal_fl" && r.tag !== "unknown_market" && r.tag !== "in_play" && !r.inPlay && isMainMarket(r.marketType) && !r.isProp && !r.scheduleOnly && (isPlayCore(r.sport) || isCollegeSport(r.sport)) && (!todayOnly || isTodayEt(r.start)));
}
function byValue(a, b) {
	const vb = deskScore(b.fairProb, b.price, b.tapeLean);
	const va = deskScore(a.fairProb, a.price, a.tapeLean);
	if (Math.abs(vb - va) > .002) return vb - va;
	return (Number.isFinite(b.fairProb) ? b.fairProb : 0) - (Number.isFinite(a.fairProb) ? a.fairProb : 0);
}
function pickBestMain(rows) {
	const pool = legalMains(rows, true);
	if (!pool.length) return null;
	const pays = pool.filter((r) => payoutMultiple(r.price) >= .65 && Number.isFinite(r.fairProb));
	const easy = pays.filter((r) => r.fairProb >= .5);
	const likely = pays.filter((r) => r.fairProb >= .45);
	return [...easy.length ? easy : likely.length ? likely : pays.length ? pays : pool].sort(byValue)[0] ?? null;
}
/** Always name a one-game ticket when today has anything legal. Never a later-week game. */
function pickAnyMain(rows) {
	const best = pickBestMain(rows);
	if (best) return best;
	const pool = legalMains(rows, true);
	if (!pool.length) return null;
	return [...pool].sort(byValue)[0] ?? null;
}
/** Plus-money toss-up playing today: about 50/50, still pays more than even money. */
function pickCoinFlip(rows, excludeEventIds = []) {
	const legal = rows.filter((r) => !r.inPlay && r.tag !== "in_play" && r.tag !== "illegal_fl" && r.tag !== "unknown_market" && isMainMarket(r.marketType) && !r.isProp && !r.scheduleOnly && onDeskHorizon(r.start) && !excludeEventIds.includes(r.eventId) && Number.isFinite(r.fairProb));
	const plus = legal.filter((r) => r.price >= 100);
	const tight = plus.filter((r) => Math.abs(r.fairProb - .5) <= .05);
	const mid = plus.filter((r) => Math.abs(r.fairProb - .5) <= .08);
	const loose = plus.filter((r) => Math.abs(r.fairProb - .5) <= .12);
	const pool = tight.length ? tight : mid.length ? mid : loose.length ? loose : plus.length ? plus : legal;
	return [...pool.length ? pool : legal].sort((a, b) => {
		const pay = (r) => r.price >= 0 ? r.price : 0;
		return pay(b) - pay(a) || Math.abs(a.fairProb - .5) - Math.abs(b.fairProb - .5);
	})[0] ?? null;
}
function sameGameJoint(legs) {
	if (legs.length < 2) return void 0;
	if (new Set(legs.map((l) => l.eventId)).size !== 1) return void 0;
	if (legs.some((l) => l.isProp || l.marketType === "prop")) return void 0;
	if (!legs.every((l) => l.marketType === "ml" || l.marketType === "spread" || l.marketType === "total")) return;
	const row = legs[0];
	const homeWin = legs.find((l) => l.marketType === "ml" && l.side === "home")?.fairProb ?? (row.side === "home" ? row.fairProb : 1 - row.fairProb);
	const latent = latentFromScores({
		eventId: row.eventId,
		sport: row.sport,
		homeWin: Number.isFinite(homeWin) ? homeWin : .5,
		total: row.total ?? 0,
		homeSpread: row.homeSpread
	});
	if (!latent.ran) return void 0;
	return jointHit(drawPaths(latent, row.eventId), legs).p;
}
function parlayLegal(legs, mode = "ribbon") {
	if (legs.some((l) => l.inPlay || l.tag === "in_play")) return {
		ok: false,
		reason: "Before the game only. No in-progress legs."
	};
	const max = mode === "catalog" ? 8 : 3;
	if (legs.length < 2 || legs.length > max) return {
		ok: false,
		reason: mode === "catalog" ? "2 to 8 legs on the Parlay desk. 4+ is catalog / fun money, never the gold badge." : "2 or 3 games only on the AI Picks badge. 4-game tickets live on Parlay."
	};
	if (mode === "ribbon" && legs.length > 3) return {
		ok: false,
		reason: "4-game parlays are not the AI Picks badge. Open Parlay."
	};
	for (const l of legs) {
		if (l.tag === "illegal_fl") return {
			ok: false,
			reason: "Not a legal Florida ticket."
		};
		if (l.tag === "unknown_market") return {
			ok: false,
			reason: unknownMarketReason(l.selection)
		};
		if (l.isProp || l.marketType === "prop") {
			if (mode === "ribbon" || isCollegeSport(l.sport)) return {
				ok: false,
				reason: isCollegeSport(l.sport) ? "No college player bets ever." : "Player bets are not on the AI Picks badge parlay. They rank on AI Picks as singles and on Parlay as custom legs."
			};
		} else if (mode === "ribbon" && !isMainMarket(l.marketType)) return {
			ok: false,
			reason: "Game bets only (winner / spread / over-under / team total / F5)."
		};
	}
	const games = new Set(legs.map((l) => l.eventId));
	if (mode === "ribbon" && games.size < legs.length) return {
		ok: false,
		reason: "Ribbon is one ticket per game. Same-game lives as SGP catalog, not the gold badge."
	};
	const floor = mode === "catalog" ? legs.length === 2 ? DEFAULTS.catalogMinLeg2 : legs.length === 3 ? DEFAULTS.catalogMinLeg3 : DEFAULTS.catalogMinLeg4 : legs.length === 2 ? DEFAULTS.minLegFairProb2 : DEFAULTS.minLegFairProb3;
	for (const l of legs) if (!Number.isFinite(l.fairProb) || l.fairProb < floor) return {
		ok: false,
		reason: `Each game needs a true chance of at least ${Math.round(floor * 100)}% for a ${legs.length}-game parlay.`
	};
	return { ok: true };
}
function evaluateParlay(legs, combinedEv, mode = "ribbon") {
	const gate = parlayLegal(legs, mode);
	if (!gate.ok) return gate;
	const sameGame = new Set(legs.map((l) => l.eventId)).size < legs.length;
	const mlAndSpread = sameGame && legs.some((l) => l.marketType === "ml") && legs.some((l) => l.marketType === "spread");
	const joint = sameGameJoint(legs);
	const usedSim = joint != null;
	const rho = sameGame ? sameGameRho(legs) : 0;
	const hair = usedSim ? 1 : sameGame ? sgpHaircut(legs.length, mlAndSpread) : 1;
	const rawFair = usedSim ? joint : sameGame ? jointFromLegs(legs.map((l) => l.fairProb), rho) : product(legs.map((l) => l.fairProb));
	const combinedFair = Math.min(.97, usedSim || sameGame ? rawFair : rawFair * hair);
	const juice = typicalParlayJuice(legs.length);
	const ev = combinedEv ?? (() => {
		return 1 / (1 / Math.max(.02, combinedFair) * (1 + juice)) / combinedFair - 1 + (1 - 1 / (1 + juice));
	})();
	const pricedAsEntertainment = ev < DEFAULTS.entertainmentEvLt;
	const mapped = legs.map((l) => ({
		eventId: l.eventId,
		sport: l.sport,
		selection: l.selection,
		marketType: l.marketType,
		side: l.side,
		price: l.price,
		fairProb: l.fairProb,
		start: l.start,
		home: l.home,
		away: l.away
	}));
	const decimalPayout = product(legs.map((l) => americanToDecimal(l.price)));
	const sports = [...new Set(legs.map((l) => l.sport))];
	const corr = correlationOf(legs, usedSim);
	const shownPct = formatChancePct(shownCombinedChance(combinedFair, decimalPayout, legs.length, sameGame)) ?? `${Math.round(combinedFair * 100)}%`;
	return {
		legs: mapped,
		combinedFair,
		combinedEv: ev,
		pricedAsEntertainment,
		researchOnly: legs.some((l) => l.hardRockPrice == null),
		sameGame,
		title: pricedAsEntertainment ? `${legs.length}-game${sameGame ? " same-game" : ""} parlay — fun money` : `${legs.length}-game${sameGame ? " same-game" : ""} parlay`,
		reason: corr === "shared-latent" ? `Same-game joint paths. Combined chance ≈ ${shownPct}.` : corr === "fallback-haircut" ? `Same-game combo. Joint from Fréchet bounds (they move together). Combined chance ≈ ${shownPct}.` : `Near-independent games (tiny shared residual). Combined chance ≈ ${shownPct}.`,
		score: Math.max(parlayScore(combinedFair, decimalPayout), growthScore(combinedFair, decimalPayout, parlayInfoQuality(legs.length, sameGame), activeKelly) * 12),
		mix: sameGame ? "same-game" : sports.length > 1 ? "cross-sport" : "same-sport",
		decimalPayout,
		sports,
		correlation: corr
	};
}
function pickBestSpicy(rows) {
	return tryParlay(rows, 3) ?? tryParlay(rows, 2);
}
function onDeskHorizon(iso, now = /* @__PURE__ */ new Date()) {
	if (!iso) return false;
	if (isTodayEt(iso, now)) return true;
	const t = new Date(iso).getTime();
	if (!Number.isFinite(t)) return false;
	return t >= now.getTime() - 144e5 && t <= now.getTime() + 1296e5;
}
function pickBestTwo(rows) {
	return tryParlay(rows, 2);
}
function tryParlay(rows, n) {
	const bestPerGame = bestRowPerGame(rows.filter((r) => !r.inPlay && r.tag !== "in_play" && r.tag !== "illegal_fl" && r.tag !== "unknown_market" && isMainMarket(r.marketType) && !r.isProp && !r.scheduleOnly && onDeskHorizon(r.start) && Number.isFinite(r.fairProb)));
	bestPerGame.sort(byValue);
	const floor = n === 2 ? DEFAULTS.minLegFairProb2 : DEFAULTS.minLegFairProb3;
	const cands = bestPerGame.filter((r) => r.fairProb >= floor);
	if (cands.length < n) return null;
	const pick = cands.slice(0, n);
	const evEstimate = product(pick.map((l) => l.fairProb));
	const typicalParlayJuice = n === 3 ? .25 : .12;
	const built = evaluateParlay(pick, 1 / evEstimate * (1 - typicalParlayJuice) * evEstimate - 1, "ribbon");
	if ("ok" in built && built.ok === false) return null;
	return built;
}
function bestRowPerGame(pool) {
	const byGame = /* @__PURE__ */ new Map();
	for (const r of pool) {
		const arr = byGame.get(r.eventId) ?? [];
		arr.push(r);
		byGame.set(r.eventId, arr);
	}
	const best = [];
	for (const arr of byGame.values()) {
		const sorted = [...arr].sort(byValue);
		if (sorted[0]) best.push(sorted[0]);
	}
	return best;
}
function catalogPool(rows) {
	return rows.filter((r) => !r.inPlay && r.tag !== "in_play" && r.tag !== "illegal_fl" && r.tag !== "unknown_market" && isMainMarket(r.marketType) && !r.isProp && !r.scheduleOnly && onDeskHorizon(r.start) && Number.isFinite(r.fairProb) && r.fairProb >= .45 && (isPlayCore(r.sport) || isCollegeSport(r.sport)));
}
function pickTopSingles(rows, n = 3) {
	const pool = legalMains(rows, true).filter((r) => payoutMultiple(r.price) >= .65 && Number.isFinite(r.fairProb));
	const ranked = [...pool.length ? pool : legalMains(rows, true)].sort(byValue);
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const r of ranked) {
		if (seen.has(r.eventId)) continue;
		seen.add(r.eventId);
		out.push(r);
		if (out.length >= n) break;
	}
	return out;
}
function combinations(arr, k) {
	const out = [];
	const rec = (start, acc) => {
		if (acc.length === k) {
			out.push(acc);
			return;
		}
		for (let i = start; i <= arr.length - (k - acc.length); i++) rec(i + 1, [...acc, arr[i]]);
	};
	rec(0, []);
	return out;
}
function rankParlays(cands, limit) {
	return [...cands].sort((a, b) => (b.score ?? -99) - (a.score ?? -99) || b.combinedFair - a.combinedFair).slice(0, limit);
}
function buildFromLegs(legs) {
	const built = evaluateParlay(legs, void 0, "catalog");
	if ("ok" in built && built.ok === false) return null;
	return built;
}
function pruneComboSeeds(rows, cap = activeComboCap) {
	const scored = [...catalogPool(rows)].sort((a, b) => {
		const ea = Number.isFinite(a.price) && Number.isFinite(a.fairProb) ? evPct(a.price, a.fairProb) : -99;
		const eb = Number.isFinite(b.price) && Number.isFinite(b.fairProb) ? evPct(b.price, b.fairProb) : -99;
		if (Math.abs(eb - ea) > 1e-6) return eb - ea;
		return (Number.isFinite(b.fairProb) ? b.fairProb : 0) - (Number.isFinite(a.fairProb) ? a.fairProb : 0);
	});
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const r of scored) {
		if (seen.has(r.eventId)) continue;
		seen.add(r.eventId);
		out.push(r);
		if (out.length >= cap) return out;
	}
	for (const r of scored) {
		if (out.includes(r)) continue;
		out.push(r);
		if (out.length >= cap) break;
	}
	return out;
}
function enumerateCrossParlays(rows, n, limit = 12) {
	const seeds = pruneComboSeeds(rows, activeComboCap);
	if (seeds.length < n) return [];
	const out = [];
	for (const combo of combinations(seeds, n)) {
		if (new Set(combo.map((l) => l.eventId)).size !== n) continue;
		const built = buildFromLegs(combo);
		if (built) out.push(built);
	}
	return rankParlays(out, limit);
}
function enumerateSgp(rows, limit = 8) {
	const pool = catalogPool(rows);
	const byGame = /* @__PURE__ */ new Map();
	for (const r of pool) {
		const arr = byGame.get(r.eventId) ?? [];
		arr.push(r);
		byGame.set(r.eventId, arr);
	}
	const out = [];
	for (const arr of byGame.values()) {
		const bestOf = (type) => [...arr.filter((r) => r.marketType === type)].sort(byValue)[0];
		const ml = bestOf("ml");
		const spread = bestOf("spread");
		const total = bestOf("total");
		const pairs = [];
		if (spread && total) pairs.push([spread, total]);
		if (ml && total) pairs.push([ml, total]);
		if (ml && spread) pairs.push([ml, spread]);
		for (const pair of pairs) {
			const built = buildFromLegs(pair);
			if (built) out.push(built);
		}
		if (ml && spread && total) {
			const three = buildFromLegs([
				ml,
				spread,
				total
			]);
			if (three) out.push(three);
		}
	}
	return rankParlays(out, limit);
}
function unitPct(n) {
	if (n == null || !Number.isFinite(n)) return void 0;
	return n > 1 ? n / 100 : n;
}
function eventSeed(snapshot, eventId, pWinH) {
	const quotes = snapshot.quotes.filter((q) => q.eventId === eventId).map((q) => `${q.marketType}:${q.side}:${q.price}:${q.point ?? ""}`).join("|");
	return `${eventId}|${pWinH.toFixed(5)}|${quotes}`;
}
function applyEnsemble(rows, snapshot) {
	const byEvent = /* @__PURE__ */ new Map();
	for (const r of rows) {
		const arr = byEvent.get(r.eventId) ?? [];
		arr.push(r);
		byEvent.set(r.eventId, arr);
	}
	const out = [];
	for (const [eventId, group] of byEvent) {
		const homeMl = group.find((r) => r.marketType === "ml" && r.side === "home");
		const awayMl = group.find((r) => r.marketType === "ml" && r.side === "away");
		const brief = snapshot.briefs?.find((b) => b.eventId === eventId);
		const pred = snapshot.predict?.find((p) => p.eventId === eventId);
		const split = snapshot.publicSplits.find((s) => s.eventId === eventId && (!s.marketType || s.marketType === "ml"));
		const row = homeMl ?? awayMl ?? group[0];
		let openHome = brief?.openHomeWin;
		if (openHome == null && homeMl?.openPrice != null && awayMl?.openPrice != null) {
			const nv = twoWayNoVig(homeMl.openPrice, awayMl.openPrice);
			if (Number.isFinite(nv.fairHome)) openHome = nv.fairHome;
		}
		const chanceInput = {
			home: row.home,
			away: row.away,
			sport: row.sport,
			start: row.start,
			oddsHome: homeMl && !homeMl.scheduleOnly ? homeMl.fairProb : void 0,
			bookHome: brief?.bookHomeWin,
			openHome,
			espnHome: brief?.espnHomeWin,
			kalshiHome: pred?.kalshiHome ?? brief?.kalshiHomeWin,
			kalshiVolume: pred?.kalshiVolume ?? brief?.kalshiVolume,
			kalshiSpread: pred?.kalshiSpread ?? brief?.kalshiSpread,
			polyHome: pred?.polyHome ?? brief?.polyHomeWin,
			polyVolume: pred?.polyVolume ?? brief?.polyVolume,
			homeSpread: brief?.homeSpread ?? row.homeSpread,
			total: brief?.total ?? row.total,
			homeRecord: brief?.homeRecord ?? row.homeRecord,
			awayRecord: brief?.awayRecord ?? row.awayRecord,
			ticketHome: brief?.ticketHome ?? unitPct(split?.ticketPct ?? split?.publicPct) ?? homeMl?.ticketPct,
			handleHome: brief?.handleHome ?? unitPct(split?.handlePct) ?? homeMl?.handlePct,
			steam: brief?.steam ?? split?.steam ?? homeMl?.tapeLean === "sharp",
			lastFive: brief?.form,
			weatherTemp: brief?.weatherTemp,
			weatherWind: brief?.weatherWind,
			weatherPrecip: brief?.weatherPrecip,
			venue: brief?.venue,
			homeSplit: brief?.homeSplit,
			awaySplit: brief?.awaySplit,
			homeEra: brief?.homeEra,
			awayEra: brief?.awayEra,
			homeWhip: brief?.homeWhip,
			awayWhip: brief?.awayWhip,
			homeOuts: brief?.homeOuts,
			awayOuts: brief?.awayOuts,
			homeQuestionable: brief?.homeQuestionable,
			awayQuestionable: brief?.awayQuestionable,
			homePf: brief?.homePf,
			homePa: brief?.homePa,
			awayPf: brief?.awayPf,
			awayPa: brief?.awayPa,
			seriesHomeWins: brief?.seriesHomeWins,
			seriesAwayWins: brief?.seriesAwayWins,
			homeRestDays: brief?.homeRestDays,
			awayRestDays: brief?.awayRestDays,
			homeLooks: brief?.homeLooks,
			awayLooks: brief?.awayLooks,
			homePitcherHand: brief?.homePitcherHand,
			awayPitcherHand: brief?.awayPitcherHand
		};
		const built = buildLatents({
			...chanceInput,
			eventId
		});
		const report = built.layers;
		const process = processFromLooks(row.sport, chanceInput.homeLooks, chanceInput.awayLooks);
		const simOk = Boolean(built.latent.ran);
		const paths = simOk ? drawPaths(built.latent, eventSeed(snapshot, eventId, built.latent.pWinH)) : [];
		const simHome = simOk ? simWin(paths) : {
			p: void 0,
			ran: false
		};
		const usage = buildUsage({
			eventId,
			sport: row.sport,
			players: brief?.players,
			injuries: brief?.injuries
		});
		for (const r of group) {
			let poolFair = r.fairProb;
			let simFair;
			const marketFair = Number.isFinite(r.fairProb) ? r.fairProb : void 0;
			if (simOk && r.marketType === "ml" && report) {
				poolFair = r.side === "home" ? report.home : report.away;
				simFair = r.side === "home" ? simHome.p : simHome.p != null ? 1 - simHome.p : void 0;
			} else if (simOk && r.marketType === "spread" && r.point != null) {
				const homeCover = simCover(paths, r.side === "home" ? r.point : -r.point);
				simFair = r.side === "home" ? homeCover.p : 1 - simCover(paths, -r.point).p;
			} else if (simOk && r.marketType === "total") {
				const overP = simOver(paths, r.point ?? r.total ?? 0).p;
				simFair = r.side === "over" || /\bover\b/i.test(r.selection) ? overP : 1 - overP;
			} else if (r.marketType === "ml" && report) poolFair = r.side === "home" ? report.home : report.away;
			let leftover = false;
			const already = r.inPlay && r.homeScore != null && r.awayScore != null ? r.homeScore + r.awayScore : void 0;
			if (r.inPlay && r.marketType === "total" && already != null) {
				const line = r.point ?? r.total ?? 0;
				if (liveFromRow(r).scoreHome != null || already != null) {
					const pOver = leftoverOverProb({
						sport: r.sport,
						postedTotal: line,
						already,
						period: r.period,
						clock: r.clock
					});
					poolFair = r.side === "over" || /\bover\b/i.test(r.selection) ? pOver : 1 - pOver;
					simFair = void 0;
					leftover = true;
				}
			}
			const fairProb = leftover ? poolFair : blendFair(simFair, poolFair, marketFair);
			const playerUse = r.player ? usageOf(usage, r.player) : void 0;
			const listedOut = Boolean(playerUse?.standDown);
			const unknown = Boolean(r.isProp) && !isKnownMarket(r.selection, r.marketType);
			let tag = r.tag;
			let action = r.action;
			let reason = r.reason;
			if (listedOut) {
				tag = r.tag === "illegal_fl" ? r.tag : r.tag;
				action = "stand_down";
				reason = playerUse?.note ?? `${r.player} listed out. Tickets omitted.`;
			}
			if (unknown && tag !== "illegal_fl") {
				tag = "unknown_market";
				action = "stand_down";
				reason = unknownMarketReason(r.selection);
			}
			if (leftover) reason = "Live remaining-stat from leftover mean (score + clock), not a haircut of the pre-game %. Photograph Hard Rock now. Not The Call.";
			out.push({
				...r,
				fairProb,
				poolFair,
				simFair,
				leftover,
				processLooked: process.empty,
				processSource: process.source,
				tag,
				action,
				reason
			});
		}
	}
	return out;
}
function buildScan(snapshot, _halt, settings) {
	activeKelly = settings?.kellyMultiplier ?? 1;
	activeComboCap = Math.min(20, Math.max(8, settings?.comboLegCap ?? COMBO_SEED_CAP));
	let rows = applyEnsemble(stampRows(scoreQuotes(snapshot), snapshot.publicSplits ?? []), snapshot);
	if (settings?.sportFeeds) rows = rows.filter((r) => settings.sportFeeds[r.sport] !== false);
	const missingBoard = snapshot.quotes.length === 0;
	const bestMain = missingBoard ? null : pickAnyMain(rows);
	const bestTwo = missingBoard ? null : pickBestTwo(rows);
	const bestSpicy = missingBoard ? null : pickBestSpicy(rows);
	const bestFlip = missingBoard ? null : pickCoinFlip(rows, bestMain ? [bestMain.eventId] : []);
	const topSingles = missingBoard ? [] : pickTopSingles(rows, 3);
	const topTwos = missingBoard ? [] : enumerateCrossParlays(rows, 2, 16);
	const topThrees = missingBoard ? [] : enumerateCrossParlays(rows, 3, 12);
	const topFours = missingBoard ? [] : enumerateCrossParlays(rows, 4, 8);
	const topSgp = missingBoard ? [] : enumerateSgp(rows, 10);
	if (missingBoard) {
		for (const r of rows) if (r.action === "enter_ticket") r.action = "stand_down";
	}
	return {
		asOf: snapshot.asOf,
		delayed: true,
		halt: false,
		rows,
		bestMain,
		bestSpicy,
		bestTwo,
		bestFlip,
		missingBoard,
		topSingles,
		topTwos,
		topThrees,
		topFours,
		topSgp
	};
}
function canPlacePaper(opts) {
	const dust = opts.dustUsd ?? DEFAULTS.dustUsd;
	opts.halted;
	opts.maxTicketPct;
	if (opts.stake < dust) return {
		ok: false,
		error: `That bet is under $${dust}. Too small to bother.`
	};
	if (opts.stake > opts.paperCash) return {
		ok: false,
		error: "That bet is bigger than your tracker cash."
	};
	return { ok: true };
}
/**
* Player-bet (prop) ensemble.
*
* Same idea as the game-chance stack: the photographed sportsbook number is the
* prior, then game total, script, weather, park, rest, and injuries nudge it.
* Last-10 per-game rate is recency-weighted analysis of the live log, blended
* 60/40 with season — not a hit-rate sticker.
* Florida: college player bets are illegal. Never a lock.
*/
var STATS = {
	pass_yds: {
		label: "passing yards",
		counting: true,
		patterns: [/pass(ing)?\s*(yds|yards)/i, /passing/i]
	},
	rush_yds: {
		label: "rushing yards",
		counting: true,
		patterns: [/rush(ing)?\s*(yds|yards)/i]
	},
	rec_yds: {
		label: "receiving yards",
		counting: true,
		patterns: [/receiv(ing|ed)?\s*(yds|yards)/i]
	},
	receptions: {
		label: "catches",
		counting: true,
		patterns: [/receptions|\brecs?\b/i, /catches/i]
	},
	pass_td: {
		label: "passing touchdowns",
		counting: true,
		patterns: [/pass(ing)?\s*(td|touchdowns?)/i]
	},
	rush_att: {
		label: "rushing attempts",
		counting: true,
		patterns: [/rush(ing)?\s*(att|attempts|carries)/i]
	},
	anytime_td: {
		label: "to score a touchdown",
		counting: false,
		patterns: [
			/anytime\s*(td|touchdown)/i,
			/to score (a )?(td|touchdown)/i,
			/touchdown scorer/i
		]
	},
	two_plus_td: {
		label: "2+ touchdowns",
		counting: false,
		patterns: [/2\+?\s*(td|touchdowns)/i, /two or more (td|touchdowns)/i]
	},
	points: {
		label: "points",
		counting: true,
		patterns: [/\bpoints\b|\bpts\b/i]
	},
	rebounds: {
		label: "rebounds",
		counting: true,
		patterns: [/rebounds|\brebs?\b/i]
	},
	assists: {
		label: "assists",
		counting: true,
		patterns: [/assists|\bast\b/i]
	},
	threes: {
		label: "threes made",
		counting: true,
		patterns: [/3(-| )pointers?|threes|\b3pm\b/i]
	},
	pra: {
		label: "points + rebounds + assists",
		counting: true,
		patterns: [/\bpra\b|pts\+reb\+ast|points\s*\+\s*reb/i]
	},
	steals: {
		label: "steals",
		counting: true,
		patterns: [/steals|\bstl\b/i]
	},
	blocks: {
		label: "blocks",
		counting: true,
		patterns: [/blocks|\bblk\b/i]
	},
	hrr: {
		label: "hits + runs + RBIs",
		counting: true,
		patterns: [/hits\s*\+\s*runs\s*\+\s*rbis?|\bhrr\b/i]
	},
	total_bases: {
		label: "total bases",
		counting: true,
		patterns: [/total bases|\btb\b/i]
	},
	stolen_bases: {
		label: "stolen bases",
		counting: true,
		patterns: [/stolen bases?|\bsb\b/i]
	},
	hr: {
		label: "to hit a home run",
		counting: false,
		patterns: [/home runs?|\bhrs?\b|to homer/i]
	},
	rbi: {
		label: "RBI",
		counting: true,
		patterns: [/\brbis?\b|runs batted in/i]
	},
	runs: {
		label: "runs",
		counting: true,
		patterns: [/\bbatter runs\b|\bruns scored\b|(?:over|under)\s+\d+(?:\.\d+)?\s+runs\b/i]
	},
	ks: {
		label: "strikeouts",
		counting: true,
		patterns: [/strikeouts|\bk's\b|\bks\b|pitcher k/i]
	},
	walks: {
		label: "walks",
		counting: true,
		patterns: [/walks|\bbb\b/i]
	},
	hits: {
		label: "hits",
		counting: true,
		patterns: [/\bhits\b|\bh\b(?!\w)/i]
	},
	shots: {
		label: "shots on goal",
		counting: true,
		patterns: [/shots( on goal)?|\bsog\b/i]
	},
	goals: {
		label: "to score a goal",
		counting: false,
		patterns: [/\bgoals?\b|to score/i]
	},
	hockey_points: {
		label: "points",
		counting: true,
		patterns: [/\bpoints\b|\bpts\b/i]
	},
	saves: {
		label: "saves",
		counting: true,
		patterns: [/saves/i]
	},
	blocked_shots: {
		label: "blocked shots",
		counting: true,
		patterns: [/blocked shots/i]
	}
};
var PARK_HITS = {
	"coors field": 1.18,
	"great american ball park": 1.1,
	"yankee stadium": 1.06,
	"fenway park": 1.05,
	"citizens bank park": 1.05,
	"petco park": .9,
	"oracle park": .88,
	"t-mobile park": .91
};
function parkHits(venue) {
	if (!venue) return null;
	const key = venue.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
	for (const [name, f] of Object.entries(PARK_HITS)) if (key.includes(name)) return f;
	return null;
}
function norm(s) {
	return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function namesHit$1(a, b) {
	const na = norm(a);
	const nb = norm(b);
	if (!na || !nb) return false;
	if (na === nb || na.includes(nb) || nb.includes(na)) return true;
	const lastA = na.split(" ").pop() ?? na;
	const lastB = nb.split(" ").pop() ?? nb;
	return lastA.length >= 4 && lastA === lastB;
}
function detectStat(text, sport) {
	const entries = Object.entries(STATS);
	const allowed = sport === "NBA" ? /* @__PURE__ */ new Set([
		"points",
		"rebounds",
		"assists",
		"threes",
		"pra",
		"steals",
		"blocks"
	]) : sport === "MLB" ? /* @__PURE__ */ new Set([
		"hits",
		"total_bases",
		"rbi",
		"hr",
		"ks",
		"walks",
		"stolen_bases",
		"runs",
		"hrr"
	]) : sport === "NHL" ? /* @__PURE__ */ new Set([
		"shots",
		"goals",
		"hockey_points",
		"saves",
		"blocked_shots"
	]) : /* @__PURE__ */ new Set([
		"pass_yds",
		"rush_yds",
		"rec_yds",
		"receptions",
		"pass_td",
		"rush_att",
		"anytime_td",
		"two_plus_td"
	]);
	for (const [stat, meta] of entries) {
		if (!allowed.has(stat)) continue;
		if (meta.patterns.some((re) => re.test(text))) return {
			stat,
			meta
		};
	}
	return null;
}
function parsePropSelection(selection, sport, fallback) {
	const raw = selection.trim();
	const hit = detectStat(raw, sport);
	const fb = fallback?.side?.toLowerCase();
	let side = "over";
	if (fb === "under" || fb === "over" || fb === "yes" || fb === "no") side = fb;
	if (/\bunder\b/i.test(raw) || /\bu\s+\d/.test(raw)) side = "under";
	if (/\bover\b/i.test(raw) || /\bo\s+\d/.test(raw)) side = "over";
	if (/\b(not to)\b/i.test(raw)) side = "no";
	if (/\b(anytime|to score|to hit|to record)\b/i.test(raw) && !/\bover\b|\bunder\b/i.test(raw)) side = "yes";
	const lineMatch = /(?:over|under|o|u)?\s*(\d+(?:\.\d+)?)\s*(?:\+)?/i.exec(raw.replace(/^\s*[+-]?\d+\s*/, ""));
	const plusMatch = /(\d+(?:\.\d+)?)\s*\+/i.exec(raw);
	const line = fallback?.point ?? (plusMatch ? Number(plusMatch[1]) : lineMatch ? Number(lineMatch[1]) : void 0);
	const lineOk = line != null && Number.isFinite(line) && line < 5e3 ? line : void 0;
	let player = (fallback?.player ?? "").trim();
	if (!player) player = (raw.split(/\b(?:over|under|o\/u|anytime|to score|to hit|to record|\d)/i)[0] ?? raw).replace(/[-–—]/g, " ").replace(/\s+/g, " ").trim();
	if (!player || player.length < 2) player = fallback?.player?.trim() || "Player";
	if (hit) {
		const counting = hit.meta.counting;
		if (!counting && side === "over") side = "yes";
		if (!counting && side === "under") side = "no";
		return {
			player,
			stat: hit.stat,
			statLabel: hit.meta.label,
			side,
			line: lineOk,
			counting
		};
	}
	return {
		player,
		stat: "unknown",
		statLabel: "this player bet",
		side: side === "yes" || side === "no" ? side : side,
		line: lineOk,
		counting: true
	};
}
function marketFair(price, oppositePrice) {
	if (oppositePrice != null && Number.isFinite(oppositePrice)) {
		const nv = twoWayNoVig(price, oppositePrice);
		if (Number.isFinite(nv.fairHome)) return {
			p: nv.fairHome,
			hold: nv.hold
		};
	}
	if (price < 0) {
		const nv = twoWayNoVig(price, price);
		if (Number.isFinite(nv.fairHome)) return {
			p: nv.fairHome,
			hold: nv.hold
		};
	}
	const implied = americanToImplied(price);
	const p = Number.isFinite(implied) ? Math.min(.88, Math.max(.12, implied * .97)) : .5;
	return {
		p,
		hold: Number.isFinite(implied) ? implied - p : .05
	};
}
function clip(n, lo, hi) {
	return Math.min(hi, Math.max(lo, n));
}
function push(layers, layer) {
	if (!Number.isFinite(layer.p)) return;
	if (layer.empty || layer.precision <= 0) {
		layers.push({
			...layer,
			p: .5,
			precision: 0,
			empty: true,
			thin: true
		});
		return;
	}
	layers.push({
		...layer,
		p: clip(layer.p, .08, .92)
	});
}
function pushEmpty(layers, id, label, note, family = "context") {
	push(layers, {
		id,
		label,
		p: .5,
		precision: 0,
		family,
		note: `${note} Status: Looked (Empty). Missing data has zero weight.`,
		thin: true,
		empty: true
	});
}
function rateOver(stat, rate, line) {
	const s = {
		pass_yds: 68,
		rush_yds: 32,
		rec_yds: 28,
		points: 7.4,
		rebounds: 3.4,
		assists: 2.6,
		pra: 9.2,
		hockey_points: .95
	}[stat];
	if (s && s > 0) return invLogit(logit(1 - normalCdf((line - rate) / s)), .06, .94);
	return poissonOver(rate, line);
}
var STAT_KEYS = {
	pass_yds: ["passYds", "yds"],
	rush_yds: ["rushYds"],
	rec_yds: ["recYds"],
	receptions: ["rec"],
	pass_td: ["passTd"],
	rush_att: ["rushAtt", "att"],
	points: ["pts", "points"],
	rebounds: ["reb", "rebounds"],
	assists: ["ast", "assists"],
	threes: ["threes", "fg3m"],
	pra: ["pra"],
	steals: ["stl", "steals"],
	blocks: ["blk", "blocks"],
	hits: ["hits", "h"],
	total_bases: ["tb"],
	rbi: ["rbi"],
	hr: ["hr"],
	ks: ["k"],
	walks: ["bb", "walks"],
	stolen_bases: ["sb"],
	runs: ["runs", "r"],
	hrr: ["hrr"],
	shots: ["sog", "shots"],
	goals: ["goals", "g"],
	hockey_points: ["pts", "points"],
	saves: ["saves"],
	blocked_shots: ["blocked"]
};
function rateFromStats(stat, stats) {
	if (!stats) return void 0;
	for (const k of STAT_KEYS[stat] ?? []) {
		const v = stats[k];
		if (v != null && Number.isFinite(v)) return v;
	}
}
function teamWinForPlayer(home, away, playerTeam, homeWin) {
	if (homeWin == null || !Number.isFinite(homeWin)) return void 0;
	if (!playerTeam) return homeWin;
	if (namesHit$1(playerTeam, home)) return homeWin;
	if (namesHit$1(playerTeam, away)) return 1 - homeWin;
	return homeWin;
}
function propStakeHaircut(unit) {
	if (!(unit > 0)) return 1;
	return Math.max(1, Math.round(unit * .5));
}
function poolOver(layers) {
	if (!layers.length) return .5;
	let num = 0;
	let den = 0;
	for (const l of layers) {
		num += logit(l.p) * l.precision;
		den += l.precision;
	}
	return invLogit(num / (den || 1), .1, .9);
}
function buildPropChance(input) {
	const parsed = parsePropSelection(input.selection, input.sport, {
		player: input.player,
		point: input.point,
		side: input.side
	});
	if (isCollegeSport(input.sport)) return {
		player: parsed.player,
		stat: parsed.stat,
		statLabel: parsed.statLabel,
		side: parsed.side,
		line: parsed.line,
		hit: .5,
		over: .5,
		lean: "pass",
		confidence: "low",
		layers: [],
		because: "College player bets are not allowed on Hard Rock Bet in Florida.",
		customize: "Stand down. Florida compact blocks college athlete props.",
		illegal: true,
		standDown: true,
		standDownWhy: "College player bets are not allowed on Hard Rock Bet."
	};
	const listedOut = (input.injuries ?? []).find((i) => {
		const st = (i.status ?? "").toLowerCase();
		return namesHit$1(i.player, parsed.player) && /out|il|doubtful|deceased|suspended/.test(st);
	});
	if (listedOut) return {
		player: parsed.player,
		stat: parsed.stat,
		statLabel: parsed.statLabel,
		side: parsed.side,
		line: parsed.line,
		hit: .5,
		over: .5,
		lean: "pass",
		confidence: "low",
		layers: [],
		because: `${parsed.player} is listed ${listedOut.status}.`,
		customize: "Stand down. If they are ruled out the ticket often voids, and if they sneak in they are not themselves.",
		illegal: false,
		standDown: true,
		standDownWhy: `${parsed.player} is listed out.`
	};
	const layers = [];
	const mkt = marketFair(input.price, input.oppositePrice);
	const photographedIsOver = parsed.side === "over" || parsed.side === "yes";
	push(layers, {
		id: "market",
		label: "Photographed book (no-vig)",
		p: photographedIsOver ? mkt.p : 1 - mkt.p,
		precision: 14,
		family: "market",
		note: "The live Hard Rock Bet Florida number, with the extra juice player bets usually carry stripped off. This is the prior — liquid prop markets are hard to beat."
	});
	if (parsed.counting && parsed.line != null && Number.isFinite(parsed.line)) {
		const rate = blendRate(input.seasonRate, input.recentRate);
		if (rate != null && rate > 0) {
			const overFromRate = rateOver(parsed.stat, rate, parsed.line);
			const usedRecent = input.recentRate != null && Number.isFinite(input.recentRate);
			push(layers, {
				id: "last10",
				label: usedRecent ? "Last 10 of this stat" : "Season rate vs the line (last-10 pending)",
				p: overFromRate,
				precision: usedRecent ? 6.4 : 4.4,
				family: "game",
				note: usedRecent ? `${parsed.player} recency-weighted last ${input.recentN ?? 10}: ${input.recentRate.toFixed(2)} ${parsed.statLabel} (60%) blended with season ${input.seasonRate != null ? input.seasonRate.toFixed(2) : "n/a"} (40%). Last-10 of THIS stat, not a W-L sticker — books already shade hot streaks.` : `Looked up the live last-10 of ${parsed.statLabel}. Gamelog not posted yet, so season rate ${rate.toFixed(2)} vs the ${parsed.line} line. Thin, not a skip.`,
				thin: !usedRecent
			});
		} else pushEmpty(layers, "last10", "Last 10 of this stat", `Looked up last-10 ${parsed.statLabel} on the live ESPN gamelog. Not posted yet. Empty look, not a guess.`, "game");
	} else pushEmpty(layers, "last10", "Last 10 of this stat", `Looked up last-10 of ${parsed.statLabel}. Yes/no tickets do not take a counting line — empty counting look, not a skip.`, "game");
	const total = input.gameTotal;
	const avg = leagueTotal(input.sport);
	if (parsed.counting && total != null && total > 0 && avg > 0) {
		const z = clip((total / avg - 1) * 1.35, -.18, .18);
		push(layers, {
			id: "total",
			label: "Game total / pace",
			p: invLogit(parsed.stat === "pass_yds" || parsed.stat === "rec_yds" || parsed.stat === "points" || parsed.stat === "pra" ? z : z * .7),
			precision: 4.2,
			family: "game",
			note: `Posted total ${total} vs a typical ${avg.toFixed(1)}. Higher totals mean more volume for counting stats.`
		});
	}
	const win = input.teamWinChance;
	if (win != null && Number.isFinite(win)) {
		let z = 0;
		if (parsed.stat === "pass_yds" || parsed.stat === "rec_yds") z = (.5 - win) * .22;
		else if (parsed.stat === "rush_yds" || parsed.stat === "rush_att") z = (win - .5) * .28;
		else if (parsed.stat === "anytime_td" || parsed.stat === "two_plus_td") z = (win - .5) * .35;
		else if (parsed.stat === "points" || parsed.stat === "pra") z = (win - .45) * .12;
		if (Math.abs(z) >= .02) push(layers, {
			id: "script",
			label: "Game script",
			p: invLogit(z),
			precision: 3.1,
			family: "game",
			note: `Team win chance ${Math.round(win * 100)}%. Favorites run; dogs throw. Script is a nudge, not a rewrite.`
		});
	}
	const wind = input.weatherWind;
	const precip = input.weatherPrecip;
	const temp = input.weatherTemp;
	if (parsed.stat === "pass_yds" || parsed.stat === "rec_yds" || parsed.stat === "ks" || parsed.stat === "hr" || parsed.stat === "hits") {
		let z = 0;
		const bits = [];
		if (wind != null && wind >= 12) {
			if (parsed.stat === "pass_yds" || parsed.stat === "rec_yds") {
				z -= clip((wind - 10) * .012, 0, .16);
				bits.push(`wind ${wind} mph cuts the air game`);
			} else if (parsed.stat === "hr") {
				z += clip((wind - 10) * .006, 0, .08);
				bits.push(`wind ${wind} mph`);
			}
		}
		if (precip != null && precip >= 40 && (parsed.stat === "pass_yds" || parsed.stat === "rec_yds" || parsed.stat === "hits")) {
			z -= .05;
			bits.push(`rain ${precip}%`);
		}
		if (temp != null && temp >= 85 && (parsed.stat === "hr" || parsed.stat === "hits")) {
			z += .04;
			bits.push(`${temp}°F`);
		}
		if (bits.length) push(layers, {
			id: "weather",
			label: "Weather",
			p: invLogit(z),
			precision: 3.4,
			family: "context",
			note: bits.join(" · ") + ". Weather moves totals and hitting more than moneylines."
		});
	}
	const park = parkHits(input.venue);
	if (park != null && (parsed.stat === "hits" || parsed.stat === "hr" || parsed.stat === "total_bases" || parsed.stat === "hrr" || parsed.stat === "runs" || parsed.stat === "rbi")) push(layers, {
		id: "park",
		label: "Ballpark",
		p: invLogit(clip((park - 1) * 1.1, -.14, .16)),
		precision: 3.6,
		family: "context",
		note: `${input.venue} hitting factor ${park.toFixed(2)}. Coors is not Petco.`
	});
	if (input.restDays != null && Number.isFinite(input.restDays) && input.restDays <= 1) push(layers, {
		id: "rest",
		label: "Rest / B2B",
		p: invLogit(-.04),
		precision: 1.6,
		family: "context",
		note: "Back-to-back. Counting stats usually shrink a little."
	});
	else pushEmpty(layers, "rest", "Rest / B2B", "Looked up rest from the live log. No B2B posted on this player ticket.");
	const hitting = parsed.stat === "hits" || parsed.stat === "hr" || parsed.stat === "rbi" || parsed.stat === "runs" || parsed.stat === "total_bases" || parsed.stat === "hrr" || parsed.stat === "walks";
	const leagueOpp = hitting || parsed.stat === "ks" ? 4.2 : input.sport === "NBA" ? 112 : input.sport === "NFL" ? 22 : 1;
	if (input.oppAllowed != null && Number.isFinite(input.oppAllowed) && input.oppAllowed > 0) {
		const z = clip((input.oppAllowed / leagueOpp - 1) * .85, -.16, .16);
		push(layers, {
			id: "defense",
			label: "Opponent-adjusted defense",
			p: invLogit(hitting || parsed.stat === "points" || parsed.stat === "pra" || parsed.stat === "pass_yds" || parsed.stat === "rush_yds" || parsed.stat === "rec_yds" ? z : z * .6),
			precision: 3.2,
			family: "game",
			note: hitting ? `Opposing staff ERA/OPS allowed ${input.oppAllowed.toFixed(2)} vs a ${leagueOpp} league mark. Live ESPN team stats, last-7 when posted.` : `Opponent environment ${input.oppAllowed.toFixed(1)} vs typical ${leagueOpp}. Last-10 allowed / live team stats — not a made-up rank.`
		});
	} else pushEmpty(layers, "defense", "Opponent-adjusted defense", "Looked up opponent ERA / OPS allowed / last-10 points allowed. Not posted on this delayed board.", "game");
	if (input.usageMin != null && Number.isFinite(input.usageMin) && input.usageMin > 0) {
		let z = 0;
		if (input.sport === "NBA" || input.sport === "NCAAB") {
			if (input.usageMin < 18) z = -.1;
			else if (input.usageMin < 24) z = -.04;
			else if (input.usageMin >= 34) z = .03;
		}
		push(layers, {
			id: "usage",
			label: "Minutes / usage filter",
			p: invLogit(z),
			precision: Math.abs(z) >= .03 ? 2.4 : 1.2,
			family: "game",
			note: `Last-10 gamelog kept games at ~${input.usageMin.toFixed(1)} minutes (dropped DNPs / blowout benched games under half usual). Live ESPN log.`,
			thin: Math.abs(z) < .03
		});
	} else pushEmpty(layers, "usage", "Minutes / usage filter", "Looked up minutes on the live ESPN gamelog. This sport/player does not post minutes (or the log is empty). Empty look, not a guess.", "game");
	if (input.pitcherEra != null && Number.isFinite(input.pitcherEra) && input.pitcherEra > 0) {
		const z = hitting ? clip((input.pitcherEra - 4.2) * .045, -.14, .14) : parsed.stat === "ks" ? clip((4.2 - input.pitcherEra) * .04, -.12, .12) : 0;
		push(layers, {
			id: "pitcher",
			label: hitting ? "Opposing starter ERA" : "Starting pitcher",
			p: invLogit(z),
			precision: 3.4,
			family: "game",
			note: hitting ? `Opposing starter ERA ${input.pitcherEra.toFixed(2)}. Live probable from ESPN — the pitcher-vs-batter number we can actually fetch tonight.` : `Starter ERA ${input.pitcherEra.toFixed(2)} from the live ESPN probable.`,
			thin: Math.abs(z) < .02
		});
	} else pushEmpty(layers, "pitcher", "Starting pitcher", "Looked up tonight's probable ERA. Not posted yet (or this is not a baseball ticket).", "game");
	if (input.ownUnderlying != null && Number.isFinite(input.ownUnderlying)) push(layers, {
		id: "underlying",
		label: "Underlying (OBP + ISO / process)",
		p: invLogit(clip((input.ownUnderlying - .38) * .55, -.12, .12)),
		precision: 2.6,
		family: "game",
		note: `Process look ${input.ownUnderlying.toFixed(3)} (OBP+ISO or last-7). xG-style: how they reached base and hit for extra bases, not just runs that already scored. Live ESPN splits.`
	});
	else if (input.seasonRate != null && input.recentRate != null && input.seasonRate > 0) push(layers, {
		id: "underlying",
		label: "Underlying (season vs last-10)",
		p: invLogit(clip((input.seasonRate - input.recentRate) / (input.seasonRate + .05) * .12, -.08, .08)),
		precision: 1.8,
		family: "game",
		note: `Season ${input.seasonRate.toFixed(2)} vs last-10 ${input.recentRate.toFixed(2)} ${parsed.statLabel}. Process vs a hot/cold streak — we do not treat 8/10 as a lock.`,
		thin: true
	});
	else pushEmpty(layers, "underlying", "Underlying (OBP + ISO / process)", "Looked up live ISO/OBP/ERA. Not posted for this sport/player yet.", "game");
	if (input.vsHandOps != null && Number.isFinite(input.vsHandOps) && input.pitcherHand) {
		const z = clip((input.vsHandOps - .72) * .7, -.12, .12);
		push(layers, {
			id: "platoon",
			label: `Pitcher vs batter (vs ${input.pitcherHand}HP)`,
			p: invLogit(hitting ? z : 0),
			precision: 2.2,
			family: "game",
			note: `Team OPS ${input.vsHandOps.toFixed(3)} vs ${input.pitcherHand}HP tonight. Live ESPN vs-L/R split against the probable's throwing hand.`
		});
	} else pushEmpty(layers, "platoon", "Pitcher vs batter (vs L/R)", "Looked up vs-LHP / vs-RHP and the probable's throwing hand. Hand or split not posted yet.", "game");
	const processLook = processFromLooks(input.sport, input.homeLooks, input.awayLooks);
	if (processLook.empty) pushEmpty(layers, "process", processLook.source, processLook.note, "game");
	else push(layers, {
		id: "process",
		label: processLook.source,
		p: .5,
		precision: .4,
		family: "game",
		note: processLook.note
	});
	const over = poolOver(layers);
	const hit = photographedIsOver ? over : 1 - over;
	const yesNo = parsed.side === "yes" || parsed.side === "no";
	let lean = "pass";
	if (yesNo) lean = hit >= .52 ? parsed.side : hit <= .46 ? parsed.side === "yes" ? "no" : "yes" : "pass";
	else if (over >= .53) lean = "over";
	else if (over <= .47) lean = "under";
	const confidence = layers.length >= 4 && Math.abs(hit - .5) >= .06 ? "high" : layers.length >= 2 ? "medium" : "low";
	const because = `${parsed.player} — ${parsed.statLabel}. ${layers.length} live looks. Last-10 is EWMA of THIS stat (60/40 with season), plus opponent defense, usage, pitcher, and underlying. Not a generated card. Desk chance-to-hit ${Math.round(hit * 100)}%. Not a lock. Photograph Hard Rock to lock the live number.`;
	const customize = photographedIsOver ? hit >= .52 ? `The model agrees with the photographed over. Still confirm the live Hard Rock number — delayed print is not a fill.` : `The photographed over is the side on the slip. The desk is cooler than the juice. Confirm at Hard Rock or sit.` : hit >= .52 ? `The model agrees with the photographed under / no. Confirm the live number.` : `Photographed side is the slip. Desk is cooler. Confirm at Hard Rock or sit.`;
	return {
		player: parsed.player,
		stat: parsed.stat,
		statLabel: parsed.statLabel,
		side: parsed.side,
		line: parsed.line,
		hit,
		over,
		lean,
		confidence,
		layers,
		because,
		customize,
		illegal: false,
		standDown: false
	};
}
var HIT_STATS = /* @__PURE__ */ new Set([
	"hits",
	"hr",
	"rbi",
	"runs",
	"total_bases",
	"hrr",
	"walks",
	"stolen_bases"
]);
function playerIsAway(player, home, away, playerTeam) {
	if (player?.homeAway === "away") return true;
	if (player?.homeAway === "home") return false;
	const team = playerTeam || player?.team;
	if (team && namesHit$1(team, away) && !namesHit$1(team, home)) return true;
	return false;
}
/** Live ESPN looks for a player ticket — defense, usage, pitcher, underlying, platoon. */
function propContextFromBrief(brief, opts) {
	const player = (brief?.players ?? []).find((p) => opts.player && namesHit$1(p.name, opts.player));
	const awaySide = playerIsAway(player, opts.home, opts.away, opts.playerTeam);
	const ownLooks = awaySide ? brief?.awayLooks : brief?.homeLooks;
	const oppLooks = awaySide ? brief?.homeLooks : brief?.awayLooks;
	const oppHand = awaySide ? brief?.homePitcherHand : brief?.awayPitcherHand;
	const ownEra = awaySide ? brief?.awayEra : brief?.homeEra;
	const oppEra = awaySide ? brief?.homeEra : brief?.awayEra;
	const stat = opts.stat;
	const hitting = stat != null && HIT_STATS.has(stat);
	const pitching = stat === "ks";
	let oppAllowed;
	if (hitting) {
		const era = allowedForStat(oppLooks, "era");
		const ops = allowedForStat(oppLooks, "hits");
		oppAllowed = era ?? ops ?? void 0;
	} else if (pitching) oppAllowed = allowedForStat(oppLooks, "k9") ?? allowedForStat(oppLooks, "era") ?? void 0;
	else if (stat === "pass_yds") oppAllowed = allowedForStat(oppLooks, "pass") ?? void 0;
	else if (stat === "rush_yds" || stat === "rush_att") oppAllowed = allowedForStat(oppLooks, "rush") ?? void 0;
	else if (stat === "rec_yds" || stat === "receptions") oppAllowed = allowedForStat(oppLooks, "rec") ?? void 0;
	if (oppAllowed == null) {
		const oppName = awaySide ? opts.home : opts.away;
		const read = analyzeScores((brief?.form ?? []).find((b) => b.team.toLowerCase() === oppName.toLowerCase())?.games ?? [], 10);
		if (read && read.avgPa > 0) oppAllowed = read.avgPa;
	}
	const vsHand = oppHand === "L" ? ownLooks?.vsLeft : oppHand === "R" ? ownLooks?.vsRight : void 0;
	return {
		usageMin: player?.usageMin,
		oppAllowed,
		pitcherEra: pitching ? ownEra : hitting ? oppEra : oppEra ?? ownEra,
		ownUnderlying: underlyingOffense(ownLooks?.last7) ?? underlyingOffense(ownLooks?.season) ?? void 0,
		pitcherHand: oppHand,
		vsHandOps: vsHand?.ops,
		seasonRate: stat && player?.stats ? rateFromStats(stat, player.stats) : void 0,
		recentRate: stat && player?.recentStats ? rateFromStats(stat, player.recentStats) : void 0,
		recentN: player?.recentN,
		homeLooks: brief?.homeLooks,
		awayLooks: brief?.awayLooks
	};
}
/**
* ESPN research + ticket matching. Live looks, not generated cards.
*/
var ESPN_PATH = {
	NFL: "football/nfl",
	NCAAF: "football/college-football",
	MLB: "baseball/mlb",
	NBA: "basketball/nba",
	NHL: "hockey/nhl",
	NCAAB: "basketball/mens-college-basketball"
};
function parseInternalEventId(eventId) {
	const m = /^espn-([A-Z0-9]+)-(.+)$/.exec(eventId);
	if (!m) return null;
	return {
		sport: m[1],
		espnId: m[2]
	};
}
function normName(s) {
	return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
/** Distinctive team tokens. Never city-only ("Los Angeles") so Dodgers cannot match Angels. */
function teamTokens(displayName, abbreviation) {
	const n = normName(displayName);
	const parts = n.split(" ").filter(Boolean);
	const out = /* @__PURE__ */ new Set();
	if (n) out.add(n);
	if (abbreviation) out.add(normName(abbreviation));
	const lastTwo = parts.slice(-2).join(" ");
	if (lastTwo && parts.length >= 2) out.add(lastTwo);
	const last = parts[parts.length - 1];
	if (last && last.length >= 4 && last !== "city") out.add(last);
	return [...out];
}
function headlineBelongsToGame(article, home, away, espnId, homeAbbr, awayAbbr) {
	const title = article.headline?.trim();
	if (!title) return false;
	const cats = article.categories ?? [];
	const teamCats = cats.filter((c) => c.type === "team");
	const eventCats = cats.filter((c) => c.type === "event");
	if (espnId && eventCats.some((c) => String(c.eventId) === String(espnId))) return true;
	const ours = /* @__PURE__ */ new Set([...teamTokens(home, homeAbbr), ...teamTokens(away, awayAbbr)]);
	const tagged = teamCats.map((c) => normName(c.team?.description || c.description || "")).filter(Boolean);
	const uniqueTeams = [...new Set(tagged)];
	if (uniqueTeams.length >= 6) return false;
	if (uniqueTeams.length) return uniqueTeams.some((t) => ours.has(t) || [...ours].some((o) => t === o || t.endsWith(" " + o) || o.endsWith(" " + t)));
	const hay = ` ${normName(title)} `;
	if (![...ours].some((tok) => tok.length >= 4 && hay.includes(` ${tok} `))) return false;
	return true;
}
function chanceFromGame(rows, brief, extra) {
	return buildChance(assembleChanceInput({
		rows,
		brief,
		extra,
		home: extra?.home,
		away: extra?.away
	}));
}
function assembleChanceInput(opts) {
	const rows = opts.rows ?? [];
	const mls = rows.filter((r) => r.marketType === "ml");
	const homeRow = mls.find((r) => r.side === "home");
	const awayRow = mls.find((r) => r.side === "away");
	const spreadHome = rows.find((r) => r.marketType === "spread" && r.side === "home");
	const totalRow = rows.find((r) => r.marketType === "total");
	const r = opts.research;
	const b = opts.brief;
	const p = opts.predict;
	const x = opts.extra ?? {};
	const home = x.home || opts.home || r?.home || homeRow?.home || awayRow?.home || "";
	const away = x.away || opts.away || r?.away || homeRow?.away || awayRow?.away || "";
	const oddsHome = homeRow?.scheduleOnly ? void 0 : homeRow?.fairProb ?? (awayRow ? 1 - awayRow.fairProb : void 0);
	let openHome = x.openHome ?? b?.openHomeWin ?? r?.openHomeWin;
	if (openHome == null && homeRow?.openPrice != null && awayRow?.openPrice != null) {
		const nv = twoWayNoVig(homeRow.openPrice, awayRow.openPrice);
		if (Number.isFinite(nv.fairHome)) openHome = nv.fairHome;
	}
	const pitcherLineHome = homeRow?.homePitcher ?? awayRow?.homePitcher;
	const pitcherLineAway = homeRow?.awayPitcher ?? awayRow?.awayPitcher;
	return {
		home,
		away,
		sport: homeRow?.sport ?? awayRow?.sport ?? r?.sport ?? "NFL",
		start: homeRow?.start ?? awayRow?.start ?? r?.start,
		oddsHome: x.oddsHome ?? oddsHome,
		bookHome: x.bookHome ?? r?.bookHomeWin ?? b?.bookHomeWin,
		openHome,
		espnHome: x.espnHome ?? r?.espnHomeWin ?? b?.espnHomeWin,
		kalshiHome: x.kalshiHome ?? p?.kalshiHome ?? r?.kalshiHomeWin ?? b?.kalshiHomeWin,
		kalshiVolume: x.kalshiVolume ?? p?.kalshiVolume ?? b?.kalshiVolume,
		kalshiSpread: x.kalshiSpread ?? p?.kalshiSpread ?? b?.kalshiSpread,
		polyHome: x.polyHome ?? p?.polyHome ?? r?.polyHomeWin ?? b?.polyHomeWin,
		polyVolume: x.polyVolume ?? p?.polyVolume ?? b?.polyVolume,
		homeSpread: x.homeSpread ?? r?.homeSpread ?? b?.homeSpread ?? spreadHome?.point ?? homeRow?.homeSpread ?? awayRow?.homeSpread,
		total: x.total ?? r?.total ?? b?.total ?? totalRow?.point ?? homeRow?.total ?? awayRow?.total,
		homeRecord: x.homeRecord ?? r?.homeRecord ?? b?.homeRecord ?? homeRow?.homeRecord ?? awayRow?.homeRecord,
		awayRecord: x.awayRecord ?? r?.awayRecord ?? b?.awayRecord ?? homeRow?.awayRecord ?? awayRow?.awayRecord,
		homeSplit: x.homeSplit ?? r?.homeSplit ?? b?.homeSplit,
		awaySplit: x.awaySplit ?? r?.awaySplit ?? b?.awaySplit,
		homeEra: x.homeEra ?? r?.homeEra ?? b?.homeEra ?? parseEra(pitcherLineHome),
		awayEra: x.awayEra ?? r?.awayEra ?? b?.awayEra ?? parseEra(pitcherLineAway),
		homeWhip: x.homeWhip ?? r?.homeWhip ?? b?.homeWhip ?? parseWhip(pitcherLineHome),
		awayWhip: x.awayWhip ?? r?.awayWhip ?? b?.awayWhip ?? parseWhip(pitcherLineAway),
		homeOuts: x.homeOuts ?? r?.homeOuts ?? b?.homeOuts,
		awayOuts: x.awayOuts ?? r?.awayOuts ?? b?.awayOuts,
		homeQuestionable: x.homeQuestionable ?? r?.homeQuestionable ?? b?.homeQuestionable,
		awayQuestionable: x.awayQuestionable ?? r?.awayQuestionable ?? b?.awayQuestionable,
		homePf: x.homePf ?? r?.homePf ?? b?.homePf,
		homePa: x.homePa ?? r?.homePa ?? b?.homePa,
		awayPf: x.awayPf ?? r?.awayPf ?? b?.awayPf,
		awayPa: x.awayPa ?? r?.awayPa ?? b?.awayPa,
		weatherTemp: x.weatherTemp ?? r?.weatherTemp ?? b?.weatherTemp,
		weatherWind: x.weatherWind ?? r?.weatherWind ?? b?.weatherWind,
		weatherPrecip: x.weatherPrecip ?? r?.weatherPrecip ?? b?.weatherPrecip,
		venue: x.venue ?? r?.venue ?? b?.venue,
		seriesHomeWins: x.seriesHomeWins ?? r?.seriesHomeWins ?? b?.seriesHomeWins,
		seriesAwayWins: x.seriesAwayWins ?? r?.seriesAwayWins ?? b?.seriesAwayWins,
		homeRestDays: x.homeRestDays ?? r?.homeRestDays ?? b?.homeRestDays,
		awayRestDays: x.awayRestDays ?? r?.awayRestDays ?? b?.awayRestDays,
		ticketHome: x.ticketHome ?? b?.ticketHome ?? homeRow?.ticketPct,
		handleHome: x.handleHome ?? b?.handleHome ?? homeRow?.handlePct,
		lastFive: x.lastFive ?? r?.lastFive ?? b?.form,
		homeLooks: x.homeLooks ?? r?.homeLooks ?? b?.homeLooks,
		awayLooks: x.awayLooks ?? r?.awayLooks ?? b?.awayLooks,
		homePitcherHand: x.homePitcherHand ?? r?.homePitcherHand ?? b?.homePitcherHand,
		awayPitcherHand: x.awayPitcherHand ?? r?.awayPitcherHand ?? b?.awayPitcherHand,
		steam: x.steam ?? b?.steam ?? homeRow?.tapeLean === "sharp"
	};
}
function researchedFavorite(rows, brief, extra) {
	const report = chanceFromGame(rows, brief, extra);
	if (!report) return null;
	return {
		side: report.favorite,
		name: report.favoriteName,
		chance: report.chance,
		homeChance: report.home,
		report
	};
}
function predictFor(predict, eventId) {
	return predict?.find((p) => p.eventId === eventId);
}
function uniqueUpcomingGames(rows) {
	const now = Date.now();
	const horizon = now + 1296e5;
	const recentlyStarted = now - 216e5;
	const rank = (r) => r.marketType === "ml" ? 3 : r.marketType === "spread" ? 2 : r.marketType === "total" ? 1 : 0;
	const map = /* @__PURE__ */ new Map();
	for (const r of rows) {
		if (r.tag === "illegal_fl") continue;
		const t = new Date(r.start).getTime();
		if (!(Number.isFinite(t) && t >= recentlyStarted && t <= horizon) && !r.inPlay && !isTodayEt(r.start)) continue;
		const cur = map.get(r.eventId);
		if (!cur || rank(r) > rank(cur) || rank(r) === rank(cur) && (r.fairProb ?? 0) > (cur.fairProb ?? 0)) map.set(r.eventId, r);
	}
	return [...map.values()];
}
function sortByResearchedChance(games, allRows, briefs, kalshiByEvent) {
	const predictList = Array.isArray(kalshiByEvent) ? kalshiByEvent : void 0;
	const kalshiOnly = kalshiByEvent instanceof Map ? kalshiByEvent : void 0;
	const scoreOf = (g) => {
		const rows = allRows.filter((r) => r.eventId === g.eventId);
		const brief = briefs?.find((x) => x.eventId === g.eventId);
		const pred = predictList ? predictFor(predictList, g.eventId) : void 0;
		const fav = researchedFavorite(rows, brief, {
			home: g.home,
			away: g.away,
			kalshiHome: pred?.kalshiHome ?? kalshiOnly?.get(g.eventId) ?? brief?.kalshiHomeWin,
			polyHome: pred?.polyHome ?? brief?.polyHomeWin,
			kalshiVolume: pred?.kalshiVolume ?? brief?.kalshiVolume,
			polyVolume: pred?.polyVolume ?? brief?.polyVolume,
			kalshiSpread: pred?.kalshiSpread ?? brief?.kalshiSpread,
			homeSpread: g.homeSpread ?? brief?.homeSpread,
			total: g.total ?? brief?.total,
			openHome: brief?.openHomeWin
		});
		return valueScore(fav?.chance ?? Math.max(g.fairProb, 1 - g.fairProb), ((fav ? rows.find((r) => r.marketType === "ml" && r.side === fav.side) : void 0) ?? rows.find((r) => r.marketType === "ml" && r.side === g.side) ?? g).price);
	};
	return [...games].sort((a, b) => {
		const d = scoreOf(b) - scoreOf(a);
		if (Math.abs(d) > .002) return d;
		const todayA = isTodayEt(a.start) ? 1 : 0;
		const todayB = isTodayEt(b.start) ? 1 : 0;
		if (todayB !== todayA) return todayB - todayA;
		return +new Date(a.start) - +new Date(b.start);
	});
}
function parseAmericanLoose(raw) {
	if (raw == null || raw === "") return void 0;
	const n = typeof raw === "number" ? raw : Number(String(raw).replace(/[^0-9.+-]/g, ""));
	return Number.isFinite(n) && n !== 0 ? n : void 0;
}
function pickcenterHomeWin(raw) {
	if (!Array.isArray(raw) || !raw[0] || typeof raw[0] !== "object") return void 0;
	const pc = raw[0];
	const home = pc.homeTeamOdds?.moneyLine ?? parseAmericanLoose(pc.moneyline?.home?.close?.odds);
	const away = pc.awayTeamOdds?.moneyLine ?? parseAmericanLoose(pc.moneyline?.away?.close?.odds);
	if (home == null || away == null) return void 0;
	return twoWayNoVig(home, away).fairHome;
}
function pickKey(p) {
	return `${p.eventId}:${p.marketType}:${p.side}:${p.player ?? ""}:${p.point ?? ""}:${p.selection ?? ""}`;
}
function num(raw) {
	const n = typeof raw === "number" ? raw : Number(raw);
	return Number.isFinite(n) ? n : void 0;
}
function recSummary(records, type) {
	if (!Array.isArray(records)) return void 0;
	const hit = records.find((r) => {
		if (!r || typeof r !== "object") return false;
		const row = r;
		return row.type === type || row.name?.toLowerCase() === type;
	});
	return hit?.summary || hit?.displayValue;
}
function pitcherLine(probables, team) {
	if (!Array.isArray(probables) || !probables[0] || typeof probables[0] !== "object") return null;
	const p = probables[0];
	const name = p.athlete?.displayName || p.athlete?.fullName;
	if (!name) return null;
	const cats = Array.isArray(p.statistics) ? p.statistics : p.statistics?.splits?.categories ?? [];
	const grab = (abbr, nameKey) => cats.find((c) => c.abbreviation === abbr || c.name === nameKey)?.displayValue;
	const bits = [
		grab("W", "wins") && grab("L", "losses") ? `${grab("W")}-${grab("L")}` : null,
		grab("ERA") ? `ERA ${grab("ERA")}` : null,
		grab("WHIP") ? `WHIP ${grab("WHIP")}` : null
	].filter(Boolean);
	return {
		team,
		name,
		line: bits.length ? `${name} · ${bits.join(" · ")}` : name,
		hand: pitcherHandOf(probables),
		athleteId: p.athlete?.id || p.playerId
	};
}
function pitcherHandOf(probables) {
	if (!Array.isArray(probables) || !probables[0] || typeof probables[0] !== "object") return void 0;
	const a = probables[0].athlete || {};
	const throws = a.throws;
	const raw = (throws && typeof throws === "object" ? throws.abbreviation || throws.type : throws) || a.hand?.abbreviation || a.hand || a.bats;
	const s = String(raw || "").toUpperCase();
	if (s.startsWith("L")) return "L";
	if (s.startsWith("R")) return "R";
}
function pitcherStats(probables) {
	if (!Array.isArray(probables) || !probables[0] || typeof probables[0] !== "object") return {};
	const p = probables[0];
	const cats = Array.isArray(p.statistics) ? p.statistics : p.statistics?.splits?.categories ?? [];
	const grab = (abbr) => {
		const hit = cats.find((c) => c.abbreviation === abbr || c.name === abbr);
		const n = hit?.value ?? (hit?.displayValue ? Number(hit.displayValue) : NaN);
		return Number.isFinite(n) ? n : void 0;
	};
	return {
		era: grab("ERA"),
		whip: grab("WHIP")
	};
}
function headshotOf(raw) {
	if (!raw) return void 0;
	if (typeof raw === "string") return raw;
	if (typeof raw === "object" && raw && "href" in raw && typeof raw.href === "string") return raw.href;
}
function statsFromCats(cats) {
	const out = {};
	if (!cats?.length) return out;
	for (const c of cats) {
		const n = c.value ?? (c.displayValue ? Number(String(c.displayValue).replace(/[^0-9.+-]/g, "")) : NaN);
		if (!Number.isFinite(n)) continue;
		const key = (c.abbreviation || c.name || "").toLowerCase();
		if (!key) continue;
		out[key] = n;
		const name = (c.name || "").toLowerCase();
		if (key === "avg" || name === "avg" || name === "batting average") out.avg = n;
		if (name.includes("slug") || key === "slg" || key === "slugavg") out.slg = n;
		if (name.includes("on base") || key === "obp" || key === "onbasepct") out.obp = n;
		if (name === "home runs" || key === "hr" || key === "homeruns") out.hr = n;
		if (key === "rbi" || key === "rbis") out.rbi = n;
		if (key === "k" || key === "strikeouts" || name === "strikeouts") out.k = n;
		if (key === "era") out.era = n;
		if (key === "whip") out.whip = n;
		if (key === "fi" || key === "ip" || name.includes("inning")) out.ip = n;
		if (key === "h" && name === "hits" || key === "hits" || name === "hits") out.hits = n;
		if (key === "sb" || name.includes("stolen")) out.sb = n;
		if (key === "r" && name === "runs" || name === "runs") out.runs = n;
		if (key === "yds" || key === "yards" || name.includes("yards")) {
			if (name.includes("pass")) out.passYds = n;
			else if (name.includes("rush")) out.rushYds = n;
			else if (name.includes("receiv")) out.recYds = n;
			else out.yds = n;
		}
		if (key === "pts" || name === "points" || name === "pointspergame") out.pts = n;
		if (key === "reb" || name.includes("rebound")) out.reb = n;
		if (key === "ast" || name.includes("assist")) out.ast = n;
		if (key === "sog" || name.includes("shots")) out.sog = n;
		if (key === "g" && name.includes("goal") || name === "goals") out.goals = n;
		if (key === "sv" || name.includes("save")) out.saves = n;
		if (name.includes("3point") || name.includes("three")) out.threes = n;
	}
	return out;
}
function playerFromAthlete(ath, team, homeAway, extra) {
	const name = ath.displayName || ath.fullName;
	if (!name) return null;
	const pos = ath.position?.abbreviation || ath.position?.displayName || "";
	return {
		id: String(ath.id || name),
		name,
		team,
		homeAway,
		position: pos,
		headshot: headshotOf(ath.headshot),
		starter: extra?.starter,
		stats: extra?.stats ?? {}
	};
}
function leaderStats(catName, row) {
	const extra = statsFromCats(row.statistics);
	const cname = (catName || "").toLowerCase();
	const val = typeof row.value === "number" && Number.isFinite(row.value) ? row.value : Number(String(row.displayValue ?? "").replace(/[^0-9.+-]/g, ""));
	if (Number.isFinite(val)) {
		if (cname === "avg") extra.avg = val;
		if (cname === "homeruns" || cname === "home runs") extra.hr = val;
		if (cname === "rbis" || cname === "rbi") extra.rbi = val;
		if (cname === "era") extra.era = val;
		if (cname === "strikeouts") extra.k = val;
		if (cname === "points") extra.pts = val;
		if (cname.includes("pass") && cname.includes("yard")) extra.passYds = val;
		if (cname.includes("rush") && cname.includes("yard")) extra.rushYds = val;
		if (cname.includes("receiv") && cname.includes("yard")) extra.recYds = val;
		if (cname.includes("shot")) extra.sog = val;
	}
	return extra;
}
function collectSummaryPlayers(d, home, away, homeC, awayC) {
	const byId = /* @__PURE__ */ new Map();
	const put = (p) => {
		if (!p) return;
		const prev = byId.get(p.id);
		if (!prev) {
			byId.set(p.id, p);
			return;
		}
		byId.set(p.id, {
			...prev,
			...p,
			headshot: p.headshot || prev.headshot,
			starter: p.starter || prev.starter,
			stats: {
				...prev.stats,
				...p.stats
			}
		});
	};
	const leaders = Array.isArray(d.leaders) ? d.leaders : [];
	for (const block of leaders) {
		const teamName = block.team?.displayName ?? "";
		const homeAway = namesHit(teamName, home) ? "home" : "away";
		for (const cat of block.leaders ?? []) for (const row of cat.leaders ?? []) {
			if (!row.athlete) continue;
			put(playerFromAthlete(row.athlete, teamName || (homeAway === "home" ? home : away), homeAway, {
				starter: true,
				stats: leaderStats(cat.name, row)
			}));
		}
	}
	const takeProbables = (c, team, homeAway) => {
		const list = c?.probables;
		if (!Array.isArray(list)) return;
		for (const p of list) {
			if (!p.athlete) continue;
			const cats = p.statistics?.splits?.categories;
			put(playerFromAthlete(p.athlete, team, homeAway, {
				starter: true,
				stats: statsFromCats(cats)
			}));
		}
	};
	takeProbables(homeC, home, "home");
	takeProbables(awayC, away, "away");
	return [...byId.values()];
}
function mergeResearchPlayers(into, extra) {
	const byId = /* @__PURE__ */ new Map();
	for (const p of [...into, ...extra]) {
		const prev = byId.get(p.id);
		if (!prev) {
			byId.set(p.id, p);
			continue;
		}
		byId.set(p.id, {
			...prev,
			...p,
			headshot: p.headshot || prev.headshot,
			starter: Boolean(prev.starter || p.starter),
			stats: {
				...prev.stats,
				...p.stats
			}
		});
	}
	return [...byId.values()];
}
function rosterGroupPos(g) {
	const p = g.position;
	if (!p) return "";
	if (typeof p === "string") return {
		Pitchers: "P",
		Catchers: "C",
		Infielders: "IF",
		Outfielders: "OF",
		"Designated Hitter": "DH",
		Quarterbacks: "QB",
		"Running Backs": "RB",
		"Wide Receivers": "WR",
		"Tight Ends": "TE",
		Goalies: "G",
		Forwards: "F",
		Defensemen: "D",
		Centers: "C",
		Guards: "G"
	}[p] || p.slice(0, 2).toUpperCase();
	return p.abbreviation || p.name || "";
}
async function fetchEspnRoster(path, teamId, teamName, homeAway) {
	if (!teamId) return [];
	try {
		const res = await fetch(`https://site.web.api.espn.com/apis/site/v2/sports/${path}/teams/${encodeURIComponent(teamId)}/roster`, {
			headers: {
				"User-Agent": "Mozilla/5.0 (compatible; SportsLock/1.0)",
				Accept: "application/json"
			},
			signal: AbortSignal.timeout(8e3)
		});
		if (!res.ok) return [];
		const json = await res.json();
		const out = [];
		for (const g of json.athletes ?? []) {
			const groupPos = rosterGroupPos(g);
			for (const item of g.items ?? []) {
				const status = item.status?.type || item.status?.name || "";
				if (/injured|inactive|reserve/i.test(status) && !/active/i.test(status)) continue;
				const pos = item.position?.abbreviation || groupPos || item.position?.parent?.abbreviation || "";
				const p = playerFromAthlete({
					id: item.id,
					displayName: item.displayName,
					fullName: item.fullName,
					headshot: item.headshot,
					position: { abbreviation: pos }
				}, teamName, homeAway);
				if (p) out.push(p);
			}
		}
		return out;
	} catch {
		return [];
	}
}
var CORE_LEAGUE = {
	MLB: {
		sport: "baseball",
		league: "mlb"
	},
	NFL: {
		sport: "football",
		league: "nfl"
	},
	NBA: {
		sport: "basketball",
		league: "nba"
	},
	NHL: {
		sport: "hockey",
		league: "nhl"
	}
};
var LEADER_STAT = {
	avg: "avg",
	homeruns: "hr",
	rbis: "rbi",
	runs: "runs",
	hits: "hits",
	stolenbases: "sb",
	onbasepct: "obp",
	slugavg: "slg",
	ops: "ops",
	strikeouts: "k",
	era: "era",
	whip: "whip",
	innings: "ip",
	passingyards: "passYds",
	rushingyards: "rushYds",
	receivingyards: "recYds",
	receptions: "rec",
	passingtouchdowns: "passTd",
	points: "pts",
	pointspergame: "pts",
	rebounds: "reb",
	reboundspergame: "reb",
	assists: "ast",
	assistspergame: "ast",
	"3pointmadepergame": "threes",
	goals: "goals",
	saves: "saves",
	shots: "sog"
};
function athleteIdFromRef(ref) {
	if (!ref) return void 0;
	return /\/athletes\/(\d+)/.exec(ref)?.[1];
}
/** Pull per-player season stats out of an ESPN core team-leaders payload. */
function leaderStatsFromCore(raw) {
	const out = /* @__PURE__ */ new Map();
	const cats = raw && typeof raw === "object" ? raw.categories : null;
	if (!Array.isArray(cats)) return out;
	for (const cat of cats) {
		if (!cat || typeof cat !== "object") continue;
		const c = cat;
		const key = LEADER_STAT[(c.name || "").toLowerCase()] ?? LEADER_STAT[(c.abbreviation || "").toLowerCase()];
		if (!key || !Array.isArray(c.leaders)) continue;
		for (const row of c.leaders) {
			if (!row || typeof row !== "object") continue;
			const r = row;
			const id = athleteIdFromRef(r.athlete?.$ref);
			const n = typeof r.value === "number" && Number.isFinite(r.value) ? r.value : Number(String(r.displayValue ?? "").replace(/[^0-9.+-]/g, ""));
			if (!id || !Number.isFinite(n)) continue;
			const prev = out.get(id) ?? {};
			prev[key] = n;
			out.set(id, prev);
		}
	}
	return out;
}
async function fetchEspnTeamLeaders(sport, teamId) {
	const spec = CORE_LEAGUE[sport];
	if (!spec || !teamId) return /* @__PURE__ */ new Map();
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	for (const y of [year, year - 1]) try {
		const res = await fetch(`https://sports.core.api.espn.com/v2/sports/${spec.sport}/leagues/${spec.league}/seasons/${y}/types/2/teams/${encodeURIComponent(teamId)}/leaders`, {
			headers: {
				"User-Agent": "Mozilla/5.0 (compatible; SportsLock/1.0)",
				Accept: "application/json"
			},
			signal: AbortSignal.timeout(8e3)
		});
		if (!res.ok) continue;
		const bag = leaderStatsFromCore(await res.json());
		if (bag.size) return bag;
	} catch {}
	return /* @__PURE__ */ new Map();
}
function applyLeaderStats(players, bags) {
	if (!bags.length) return players;
	const all = /* @__PURE__ */ new Map();
	for (const bag of bags) for (const [id, st] of bag) all.set(id, {
		...all.get(id) ?? {},
		...st
	});
	if (!all.size) return players;
	return players.map((p) => {
		const extra = all.get(p.id);
		if (!extra) return p;
		return {
			...p,
			stats: {
				...extra,
				...p.stats
			}
		};
	});
}
function isOutStatus(status) {
	return /out|injured reserve|\bil\b|10-day|15-day|60-day|inactive|doubtful/i.test(status);
}
function isQuestionableStatus(status) {
	return /questionable|game time|gtd/i.test(status) && !isOutStatus(status);
}
function standingsPoints(raw, teamName) {
	const st = raw && typeof raw === "object" ? raw : null;
	if (!st?.groups) return {};
	const needle = teamName.split(" ").pop()?.toLowerCase() ?? "";
	for (const g of st.groups) for (const e of g.standings?.entries ?? []) {
		const t = (e.team ?? "").toLowerCase();
		if (!t || needle && !t.includes(needle) && !teamName.toLowerCase().includes(t)) continue;
		const pf = e.stats?.find((s) => s.abbreviation === "PF")?.value;
		const pa = e.stats?.find((s) => s.abbreviation === "PA")?.value;
		return {
			pf: Number.isFinite(pf) ? pf : void 0,
			pa: Number.isFinite(pa) ? pa : void 0
		};
	}
	return {};
}
function pickcenterExtras(raw) {
	if (!Array.isArray(raw) || !raw[0] || typeof raw[0] !== "object") return {};
	const pc = raw[0];
	const home = pc.homeTeamOdds?.moneyLine ?? parseAmericanLoose(pc.moneyline?.home?.close?.odds);
	const away = pc.awayTeamOdds?.moneyLine ?? parseAmericanLoose(pc.moneyline?.away?.close?.odds);
	const openH = parseAmericanLoose(pc.moneyline?.home?.open?.odds);
	const openA = parseAmericanLoose(pc.moneyline?.away?.open?.odds);
	const bookHome = home != null && away != null ? twoWayNoVig(home, away).fairHome : void 0;
	const openHome = openH != null && openA != null ? twoWayNoVig(openH, openA).fairHome : void 0;
	const spreadLine = pc.pointSpread?.home?.close?.line;
	const parsedSpread = spreadLine != null ? Number(String(spreadLine).replace(/[^0-9.+-]/g, "")) : void 0;
	const homeSpread = parsedSpread != null && Number.isFinite(parsedSpread) ? parsedSpread : pc.spread;
	const totRaw = pc.total?.over?.close?.line ?? pc.overUnder;
	const total = totRaw != null ? Number(String(totRaw).replace(/[ouOU]/g, "")) : void 0;
	return {
		bookHome: bookHome != null && Number.isFinite(bookHome) ? bookHome : void 0,
		openHome: openHome != null && Number.isFinite(openHome) ? openHome : void 0,
		homeSpread: homeSpread != null && Number.isFinite(homeSpread) ? homeSpread : void 0,
		total: total != null && Number.isFinite(total) ? total : void 0
	};
}
function seriesWins(raw, home, away) {
	if (!Array.isArray(raw) || !raw[0] || typeof raw[0] !== "object") return void 0;
	const events = (raw.find((s) => s.type === "current") ?? raw[0]).events;
	if (!Array.isArray(events)) return void 0;
	let h = 0;
	let a = 0;
	for (const ev of events) {
		if (ev.status && ev.status !== "post") continue;
		for (const c of ev.competitors ?? []) {
			if (!c.winner) continue;
			const n = (c.team?.displayName ?? "").toLowerCase();
			if (n && home.toLowerCase().includes(n.split(" ").pop() ?? n)) h += 1;
			else if (n && away.toLowerCase().includes(n.split(" ").pop() ?? n)) a += 1;
		}
	}
	if (h + a === 0) return void 0;
	return {
		home: h,
		away: a
	};
}
function restFrom(block, start) {
	const dates = (block?.games ?? []).map((g) => g.date).filter((d) => Boolean(d));
	if (!dates.length || !start) return void 0;
	const last = dates.map((d) => new Date(d).getTime()).filter((t) => Number.isFinite(t)).sort((a, b) => b - a)[0];
	const startMs = new Date(start).getTime();
	if (last == null || !Number.isFinite(startMs)) return void 0;
	const days = (startMs - last) / 864e5;
	if (days < .15 || days > 21) return void 0;
	return days;
}
function parseEspnSummary(raw, eventId, sport, espnId) {
	const d = raw && typeof raw === "object" ? raw : {};
	const header = d.header && typeof d.header === "object" ? d.header : {};
	const comps = header.competitions?.[0]?.competitors ?? [];
	const homeC = comps.find((c) => c.homeAway === "home");
	const awayC = comps.find((c) => c.homeAway === "away");
	const teamName = (c) => {
		return (c?.team)?.displayName ?? "";
	};
	const teamAbbr = (c) => {
		return (c?.team)?.abbreviation;
	};
	const home = teamName(homeC);
	const away = teamName(awayC);
	const homeAbbr = teamAbbr(homeC);
	const awayAbbr = teamAbbr(awayC);
	const pred = d.predictor;
	const espnHomeWin = num(pred?.homeTeam?.gameProjection) != null ? num(pred?.homeTeam?.gameProjection) / 100 : void 0;
	const espnAwayWin = num(pred?.awayTeam?.gameProjection) != null ? num(pred?.awayTeam?.gameProjection) / 100 : void 0;
	const gameInfo = d.gameInfo && typeof d.gameInfo === "object" ? d.gameInfo : {};
	const wx = gameInfo.weather;
	const weather = wx && wx.temperature != null ? `${wx.temperature}°F${wx.precipitation != null ? ` · rain ${wx.precipitation}%` : ""}${wx.gust != null ? ` · wind ${wx.gust} mph` : ""}` : void 0;
	const seriesRaw = d.seasonseries;
	const series = Array.isArray(seriesRaw) ? seriesRaw[0]?.summary : void 0;
	const seriesWL = seriesWins(seriesRaw, home, away);
	const pc = pickcenterExtras(d.pickcenter);
	const lastFive = [];
	if (Array.isArray(d.lastFiveGames)) for (const block of d.lastFiveGames) {
		const team = block.team?.displayName ?? "";
		const events = (block.events ?? []).slice(0, 10);
		const results = events.map((e) => e.gameResult ?? "?");
		const games = events.map((e) => {
			const hs = parseEspnScore(e.homeTeamScore);
			const as = parseEspnScore(e.awayTeamScore);
			const road = e.atVs === "@";
			const pf = road ? as : hs;
			const pa = road ? hs : as;
			return {
				date: e.gameDate,
				result: e.gameResult ?? "?",
				pf,
				pa,
				opponent: e.opponent?.abbreviation,
				homeAway: e.atVs === "@" ? "away" : "home"
			};
		});
		const line = formatScoreLine(games) || events.map((e) => `${e.gameResult ?? "?"} ${e.score ?? ""} ${e.atVs ?? ""} ${e.opponent?.abbreviation ?? ""}`.trim()).join(" · ");
		lastFive.push({
			team,
			line,
			results,
			games
		});
	}
	const injuries = [];
	if (Array.isArray(d.injuries)) for (const block of d.injuries) {
		const team = block.team?.displayName ?? "";
		for (const inj of (block.injuries ?? []).slice(0, 8)) {
			const det = inj.details;
			const detail = [det?.type, det?.detail].filter((x) => x && x !== "Not Specified").join(" · ");
			injuries.push({
				team,
				player: inj.athlete?.displayName ?? "Player",
				status: inj.status ?? "Listed",
				detail
			});
		}
	}
	const headlines = [];
	const seen = /* @__PURE__ */ new Set();
	const consider = (title, article) => {
		const t = title?.trim();
		if (!t || seen.has(t)) return;
		if (!headlineBelongsToGame(article ?? { headline: t }, home, away, espnId, homeAbbr, awayAbbr)) return;
		seen.add(t);
		headlines.push({ title: t });
	};
	const recap = d.article;
	if (recap?.headline) consider(recap.headline, recap);
	const arts = d.news?.articles ?? [];
	for (const a of arts) consider(a.headline, a);
	const pitchers = [];
	const hp = pitcherLine(homeC?.probables, home);
	const ap = pitcherLine(awayC?.probables, away);
	if (ap) pitchers.push(ap);
	if (hp) pitchers.push(hp);
	const homeP = pitcherStats(homeC?.probables);
	const awayP = pitcherStats(awayC?.probables);
	const homeRec = recSummary(homeC?.record ?? homeC?.records, "total");
	const awayRec = recSummary(awayC?.record ?? awayC?.records, "total");
	const parsedHome = /(\d+)\s*-\s*(\d+)/.exec(homeRec ?? "");
	const parsedAway = /(\d+)\s*-\s*(\d+)/.exec(awayRec ?? "");
	const homePts = standingsPoints(d.standings, home);
	const awayPts = standingsPoints(d.standings, away);
	const start = header.competitions?.[0]?.date;
	return {
		eventId,
		sport,
		espnId,
		home,
		away,
		start,
		venue: gameInfo.venue?.fullName,
		city: [gameInfo.venue?.address?.city, gameInfo.venue?.address?.state].filter(Boolean).join(", "),
		weather,
		weatherTemp: wx?.temperature,
		weatherWind: wx?.gust,
		weatherPrecip: wx?.precipitation,
		homeRecord: homeRec,
		awayRecord: awayRec,
		homeSplit: recSummary(homeC?.record ?? homeC?.records, "home"),
		awaySplit: recSummary(awayC?.record ?? awayC?.records, "road"),
		espnHomeWin,
		espnAwayWin,
		bookHomeWin: pc.bookHome ?? pickcenterHomeWin(d.pickcenter),
		openHomeWin: pc.openHome,
		homeWins: parsedHome ? Number(parsedHome[1]) : void 0,
		homeLosses: parsedHome ? Number(parsedHome[2]) : void 0,
		awayWins: parsedAway ? Number(parsedAway[1]) : void 0,
		awayLosses: parsedAway ? Number(parsedAway[2]) : void 0,
		homeEra: homeP.era,
		awayEra: awayP.era,
		homeWhip: homeP.whip,
		awayWhip: awayP.whip,
		homeOuts: injuries.filter((i) => i.team === home && isOutStatus(i.status)).length,
		awayOuts: injuries.filter((i) => i.team === away && isOutStatus(i.status)).length,
		homeQuestionable: injuries.filter((i) => i.team === home && isQuestionableStatus(i.status)).length,
		awayQuestionable: injuries.filter((i) => i.team === away && isQuestionableStatus(i.status)).length,
		homePf: homePts.pf,
		homePa: homePts.pa,
		awayPf: awayPts.pf,
		awayPa: awayPts.pa,
		homeSpread: pc.homeSpread,
		total: pc.total,
		series,
		seriesHomeWins: seriesWL?.home,
		seriesAwayWins: seriesWL?.away,
		homeRestDays: restFrom(lastFive.find((b) => b.team === home), start),
		awayRestDays: restFrom(lastFive.find((b) => b.team === away), start),
		pitchers,
		lastFive,
		injuries,
		headlines,
		players: collectSummaryPlayers(d, home, away, homeC, awayC),
		homeTeamId: (homeC?.team)?.id,
		awayTeamId: (awayC?.team)?.id,
		homeAbbr,
		awayAbbr,
		homePitcherHand: pitcherHandOf(homeC?.probables),
		awayPitcherHand: pitcherHandOf(awayC?.probables),
		note: "Ensemble of sportsbook, Kalshi/Polymarket, ESPN's model, records, pitchers, form, rest, and injuries. Research, not a promise. Confirm the live Hard Rock Bet number before you bet."
	};
}
function chanceWords(p) {
	if (!Number.isFinite(p)) return "unknown";
	const n = Math.round(p * 100);
	if (n >= 70) return `a clear favorite (~${n} in 100)`;
	if (n >= 57) return `more likely than not (~${n} in 100)`;
	if (n >= 47) return `a coin flip (~${n} in 100)`;
	if (n >= 35) return `the underdog (~${n} in 100)`;
	return `a long shot (~${n} in 100)`;
}
function leanEnglish(opts) {
	const { home, away, oddsHome, espnHome, ensembleHome, crowdHome } = opts;
	const parts = [];
	if (oddsHome != null) parts.push(`the live sportsbook (cut removed) says ${home} is ${chanceWords(oddsHome)}`);
	if (crowdHome != null) parts.push(`prediction markets (Kalshi / Polymarket) give ${home} ${Math.round(crowdHome * 100)} in 100`);
	if (espnHome != null) parts.push(`ESPN's matchup model gives ${home} ${Math.round(espnHome * 100)} in 100`);
	const avg = ensembleHome ?? (oddsHome != null && espnHome != null ? (oddsHome + espnHome) / 2 : oddsHome ?? espnHome);
	if (avg == null) return {
		side: "toss",
		title: "Not enough to lean",
		because: "We need a two-way price or ESPN's model."
	};
	if (avg >= .53) return {
		side: "home",
		title: `${home} is the more likely winner`,
		because: `${parts.join(". ")}. The full ensemble puts ${home} at about ${Math.round(avg * 100)} in 100. That is still not a lock — about ${Math.round((1 - avg) * 100)} in 100 times the other team wins.`
	};
	if (avg <= .47) {
		const awayChance = 1 - avg;
		return {
			side: "away",
			title: `${away} is the more likely winner`,
			because: `${parts.join(". ")}. The full ensemble puts ${away} at about ${Math.round(awayChance * 100)} in 100. That is still not a lock — about ${Math.round((1 - awayChance) * 100)} in 100 times ${home} wins.`
		};
	}
	return {
		side: "toss",
		title: "Too close to call",
		because: `${parts.join(". ")}. When a game sits near 50/50, the sportsbook's cut is the real opponent.`
	};
}
function gradeParlay(legs) {
	const sameGame = new Set(legs.map((l) => l.eventId)).size < legs.length;
	const mlAndSpread = sameGame && legs.some((l) => l.marketType === "ml") && legs.some((l) => l.marketType === "spread");
	const mains = sameGame && legs.every((l) => l.marketType === "ml" || l.marketType === "spread" || l.marketType === "total") && !legs.some((l) => l.marketType === "prop" || l.player);
	let usedSim = false;
	let fair;
	if (mains && legs.length >= 2) {
		const row = legs[0];
		const ml = legs.find((l) => l.marketType === "ml" && l.side === "home");
		const homeWin = Number.isFinite(ml?.fairProb) ? ml.fairProb : row.side === "home" ? row.fairProb : 1 - row.fairProb;
		const latent = latentFromScores({
			eventId: row.eventId,
			sport: row.sport,
			homeWin: Number.isFinite(homeWin) ? homeWin : .5,
			total: row.total ?? row.point ?? 0,
			homeSpread: row.homeSpread
		});
		if (latent.ran) {
			fair = Math.min(.97, jointHit(drawPaths(latent, row.eventId), legs).p);
			usedSim = true;
		}
	}
	if (!usedSim) {
		const raw = product(legs.map((l) => Number.isFinite(l.fairProb) ? l.fairProb : americanToImplied(l.price)));
		fair = Math.min(.97, raw * (sameGame ? sgpHaircut(legs.length, mlAndSpread) : 1));
	}
	const implied = product(legs.map((l) => americanToImplied(l.price)));
	const decimalPayout = product(legs.map((l) => americanToDecimal(l.price)));
	const profitOn100 = (decimalPayout - 1) * 100;
	const longshot = legs.length >= 4 || fair < .2;
	const entertainment = fair < .25 || legs.length >= 4;
	const shownPct = formatChancePct(shownCombinedChance(fair, decimalPayout, legs.length, sameGame)) ?? `${Math.round(fair * 100)}%`;
	return {
		legs,
		combinedFair: fair,
		combinedImplied: implied,
		decimalPayout,
		profitOn100,
		independent: !sameGame,
		longshot,
		entertainment,
		correlation: usedSim ? "shared-latent" : sameGame ? "fallback-haircut" : "near-independent",
		headline: entertainment ? `${legs.length}-game parlay — fun money, not a plan` : `${legs.length}-game parlay`,
		because: [
			usedSim ? `Same-game joint paths. Combined chance ≈ ${shownPct}.` : sameGame ? `Thin fallback-haircut. Combined chance ≈ ${shownPct}.` : `If every game is independent, about ${shownPct.replace("%", "")} in 100 tickets like this hit.`,
			`The sportsbook pays about $${profitOn100.toFixed(0)} profit on a $100 bet if they all win.`,
			longshot ? "Stacking more games makes the payout jump and the win chance collapse. That is the trade." : "Both (or all) must win or the whole ticket loses.",
			"Real parlays hit a bit less often than this math because each price already includes the house cut.",
			legs.some((l) => l.marketType === "prop") ? "Player-bet legs use the photographed number plus game total, script, weather, park, rest, and injuries." : null
		].filter(Boolean).join(" ")
	};
}
function matchParsedToRows(parsed, rows) {
	return parsed.map((p, i) => {
		const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
		const home = norm(p.home);
		const away = norm(p.away);
		const sel = norm(p.selection);
		const hit = rows.find((r) => {
			if (r.marketType !== p.marketType) return false;
			if (!((norm(r.home).includes(home) || home.includes(norm(r.home))) && (norm(r.away).includes(away) || away.includes(norm(r.away))))) return false;
			if (p.side && r.side === p.side) return true;
			return norm(r.selection).includes(sel.split(" ")[0] ?? sel) || sel.includes(norm(r.selection));
		}) ?? rows.find((r) => {
			return (norm(r.home).includes(home) || home.includes(norm(r.home))) && (norm(r.away).includes(away) || away.includes(norm(r.away))) && r.marketType === p.marketType;
		});
		const game = hit ?? rows.find((r) => {
			return (norm(r.home).includes(home) || home.includes(norm(r.home))) && (norm(r.away).includes(away) || away.includes(norm(r.away))) && r.marketType === "ml";
		});
		const fair = hit?.fairProb ?? americanToImplied(p.price);
		const eventId = game?.eventId ?? hit?.eventId ?? `shot-${i}-${sel.slice(0, 12)}`;
		return {
			key: pickKey({
				eventId,
				marketType: p.marketType,
				side: hit?.side ?? p.side
			}),
			eventId,
			sport: hit?.sport ?? game?.sport ?? p.sport,
			start: hit?.start ?? game?.start ?? p.start ?? "",
			home: hit?.home ?? game?.home ?? p.home,
			away: hit?.away ?? game?.away ?? p.away,
			marketType: p.marketType,
			side: hit?.side ?? p.side,
			selection: hit?.selection ?? p.selection,
			price: Number.isFinite(p.price) ? p.price : hit?.price ?? -110,
			fairProb: fair,
			point: p.point ?? hit?.point,
			player: p.player
		};
	});
}
function namesHit(a, b) {
	const na = normName(a);
	const nb = normName(b);
	if (!na || !nb) return false;
	if (na === nb) return true;
	if (na.includes(nb) || nb.includes(na)) return true;
	const lastA = na.split(" ").pop() ?? na;
	const lastB = nb.split(" ").pop() ?? nb;
	return lastA.length >= 4 && lastA === lastB;
}
function ticketMatchesQuote(t, q) {
	if (!(namesHit(t.home, q.home) && namesHit(t.away, q.away))) return false;
	if (t.marketType && t.marketType !== q.marketType) return false;
	if (t.side && t.side !== q.side) {
		const sel = normName(t.selection);
		if (!(sel && (normName(q.selection).includes(sel) || sel.includes(normName(q.selection))))) return false;
	}
	return true;
}
/** Photograph prices replace matching delayed rows so the ensemble uses the live Hard Rock Bet Florida number. */
function overlayQuotesWithTickets(quotes, tickets) {
	const ready = tickets.filter((t) => t.confirmed && t.home && Number.isFinite(t.price));
	if (!ready.length) return quotes;
	const used = /* @__PURE__ */ new Set();
	const next = quotes.map((q) => {
		const idx = ready.findIndex((t, i) => !used.has(i) && ticketMatchesQuote(t, q));
		if (idx < 0) return q;
		used.add(idx);
		const t = ready[idx];
		const venueNote = q.venueNote === "dk_sportsbook" || q.venueNote === "fd_sportsbook" ? q.venueNote : "hardrock";
		return {
			...q,
			price: t.price,
			hardRockPrice: t.price,
			point: t.point ?? q.point,
			source: "screenshot",
			confirmed: true,
			venueNote
		};
	});
	const extras = ready.filter((_, i) => !used.has(i)).map((t, i) => ({
		eventId: `shot-${normName(t.home)}-${normName(t.away)}-${i}`.replace(/\s+/g, "-"),
		sport: t.sport || "NFL",
		start: t.start ?? new Date(Date.now() + 432e5).toISOString(),
		home: t.home,
		away: t.away,
		marketType: t.marketType,
		side: t.side,
		selection: t.selection,
		price: t.price,
		hardRockPrice: t.price,
		point: t.point,
		source: "screenshot",
		delayed: true,
		isProp: t.marketType === "prop",
		player: t.player,
		venueNote: "hardrock",
		confirmed: true
	}));
	return extras.length ? [...extras, ...next] : next;
}
function overlaySnapshot(base, tickets) {
	if (!base) return void 0;
	const ready = tickets.filter((t) => t.confirmed && t.home && Number.isFinite(t.price));
	if (!ready.length) return base;
	return {
		...base,
		quotes: overlayQuotesWithTickets(base.quotes, ready)
	};
}
/** Same ensemble used on the board: ML legs get researched win chance; player bets get the prop stack. */
function enrichParlayPicks(picks, rows, briefs, predict) {
	return picks.map((p) => {
		const gameRows = rows.filter((r) => r.eventId === p.eventId);
		const byName = gameRows.length > 0 ? gameRows : rows.filter((r) => namesHit(r.home, p.home) && namesHit(r.away, p.away));
		const useRows = byName.length ? byName : gameRows;
		const eventId = useRows[0]?.eventId ?? p.eventId;
		const brief = briefs?.find((b) => b.eventId === eventId) ?? briefs?.find((b) => b.eventId === p.eventId);
		const pred = predictFor(predict, eventId) ?? predictFor(predict, p.eventId);
		const fav = researchedFavorite(useRows, brief, {
			home: p.home,
			away: p.away,
			kalshiHome: pred?.kalshiHome,
			polyHome: pred?.polyHome,
			kalshiVolume: pred?.kalshiVolume,
			polyVolume: pred?.polyVolume,
			kalshiSpread: pred?.kalshiSpread
		});
		if (p.marketType === "prop") {
			const parsed = parsePropSelection(p.selection, p.sport, {
				player: p.player,
				point: p.point,
				side: p.side
			});
			const report = buildPropChance({
				sport: p.sport,
				selection: p.selection,
				price: p.price,
				player: p.player,
				side: p.side,
				point: p.point,
				home: p.home,
				away: p.away,
				gameTotal: brief?.total ?? useRows[0]?.total,
				homeSpread: brief?.homeSpread ?? useRows[0]?.homeSpread,
				teamWinChance: teamWinForPlayer(p.home, p.away, void 0, fav?.homeChance),
				injuries: brief?.injuries,
				venue: brief?.venue,
				weatherTemp: brief?.weatherTemp,
				weatherWind: brief?.weatherWind,
				weatherPrecip: brief?.weatherPrecip,
				...propContextFromBrief(brief, {
					home: p.home,
					away: p.away,
					player: p.player,
					stat: parsed.stat
				})
			});
			return {
				...p,
				eventId,
				start: useRows[0]?.start || p.start,
				home: useRows[0]?.home || p.home,
				away: useRows[0]?.away || p.away,
				fairProb: report.hit,
				player: report.player,
				point: report.line ?? p.point,
				propReport: report
			};
		}
		if (p.marketType === "ml") {
			if (fav) {
				const onHome = p.side === "home" || namesHit(p.selection, p.home);
				return {
					...p,
					eventId,
					fairProb: onHome ? fav.homeChance : 1 - fav.homeChance
				};
			}
		}
		const hit = useRows.find((r) => r.marketType === p.marketType && (r.side === p.side || namesHit(r.selection, p.selection)));
		if (hit && Number.isFinite(hit.fairProb)) return {
			...p,
			eventId,
			fairProb: hit.fairProb,
			start: hit.start || p.start,
			home: hit.home || p.home,
			away: hit.away || p.away
		};
		return {
			...p,
			eventId
		};
	});
}
function rowToPick(row) {
	return {
		key: pickKey(row),
		eventId: row.eventId,
		sport: row.sport,
		start: row.start,
		home: row.home,
		away: row.away,
		marketType: row.marketType,
		side: row.side,
		selection: row.selection,
		price: row.price,
		fairProb: row.fairProb,
		point: row.point,
		player: row.player
	};
}
var TEAM_UA = {
	"User-Agent": "Mozilla/5.0 (compatible; SportsLock/1.0)",
	Accept: "application/json"
};
/** Last 10 completed games + full season log from ESPN team schedule. Analysis, not a card. */
async function fetchTeamLastTen(path, teamId, teamName) {
	if (!path || !teamId) return null;
	try {
		const res = await fetch(`https://site.web.api.espn.com/apis/site/v2/sports/${path}/teams/${encodeURIComponent(teamId)}/schedule`, {
			headers: TEAM_UA,
			signal: AbortSignal.timeout(8e3)
		});
		if (!res.ok) return null;
		const json = await res.json();
		const games = [];
		for (const ev of json.events ?? []) {
			const c = ev.competitions?.[0];
			if (!c?.status?.type?.completed) continue;
			const me = c.competitors?.find((x) => String(x.team?.displayName ?? "").toLowerCase() === teamName.toLowerCase()) ?? c.competitors?.find((x) => x.team?.abbreviation && teamName.toLowerCase().includes((x.team.abbreviation || "").toLowerCase()));
			if (!me) continue;
			const opp = c.competitors?.find((x) => x !== me);
			const pf = parseEspnScore(me.score);
			const pa = parseEspnScore(opp?.score);
			const win = me.winner === true || Number.isFinite(pf) && Number.isFinite(pa) && pf > pa;
			const loss = me.winner === false || Number.isFinite(pf) && Number.isFinite(pa) && pf < pa;
			if (!win && !loss) continue;
			games.push({
				date: ev.date,
				result: win ? "W" : "L",
				pf: Number.isFinite(pf) ? pf : void 0,
				pa: Number.isFinite(pa) ? pa : void 0,
				opponent: opp?.team?.abbreviation,
				homeAway: me.homeAway === "away" ? "away" : "home"
			});
		}
		games.sort((a, b) => String(b.date ?? "").localeCompare(String(a.date ?? "")));
		const last = games.slice(0, 10);
		if (last.length < 3) return null;
		return {
			team: teamName,
			line: formatScoreLine(last),
			results: last.map((g) => g.result),
			games: last,
			seasonGames: games
		};
	} catch {
		return null;
	}
}
var STAT_LABEL = {
	hits: "hits",
	h: "hits",
	hr: "hr",
	homeruns: "hr",
	rbi: "rbi",
	rbis: "rbi",
	runs: "runs",
	r: "runs",
	bb: "bb",
	walks: "bb",
	k: "k",
	strikeouts: "k",
	so: "k",
	avg: "avg",
	points: "pts",
	pts: "pts",
	rebounds: "reb",
	reb: "reb",
	assists: "ast",
	ast: "ast",
	threes: "threes",
	"3pm": "threes",
	fg3m: "threes",
	passingyards: "passYds",
	passyds: "passYds",
	rushingyards: "rushYds",
	rushyds: "rushYds",
	receivingyards: "recYds",
	recyds: "recYds",
	receptions: "rec",
	rec: "rec",
	sog: "sog",
	shots: "sog",
	goals: "goals",
	g: "goals",
	saves: "saves",
	tb: "tb",
	totalbases: "tb",
	min: "min",
	minutes: "min",
	mp: "min"
};
/** Last-10 per-game averages from ESPN athlete gamelog. Drops low-minute games when minutes exist. */
async function fetchPlayerRecent(sport, athleteId) {
	const core = CORE_LEAGUE[sport];
	if (!core || !athleteId) return null;
	try {
		const res = await fetch(`https://site.web.api.espn.com/apis/common/v3/sports/${core.sport}/${core.league}/athletes/${encodeURIComponent(athleteId)}/gamelog`, {
			headers: TEAM_UA,
			signal: AbortSignal.timeout(8e3)
		});
		if (!res.ok) return null;
		const json = await res.json();
		const labels = (json.labels ?? json.names ?? json.displayNames ?? []).map((s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, ""));
		const rawEvents = json.events;
		const dated = (Array.isArray(rawEvents) ? rawEvents : rawEvents ? Object.values(rawEvents) : []).map((e) => ({
			stats: e?.stats ?? [],
			date: e?.event?.date ?? ""
		})).filter((e) => e.stats.length).sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 15);
		if (dated.length < 3) return null;
		const minIdx = labels.findIndex((k) => k === "min" || k === "minutes" || k === "mp");
		const minutes = dated.map((row) => {
			if (minIdx < 0) return void 0;
			const v = row.stats[minIdx];
			const n = typeof v === "number" ? v : Number(String(v ?? "").replace(/[^0-9.+-]/g, ""));
			return Number.isFinite(n) ? n : void 0;
		});
		const known = minutes.filter((n) => n != null && n > 0).sort((a, b) => a - b);
		const median = known.length ? known[Math.floor(known.length / 2)] : void 0;
		const keptIdx = dated.map((_, i) => i).filter((i) => {
			const m = minutes[i];
			if (median == null || m == null) return true;
			return m >= median * .5;
		});
		const useIdx = (keptIdx.length >= 3 ? keptIdx : dated.map((_, i) => i)).slice(0, 10);
		const rows = useIdx.map((i) => dated[i]);
		const series = {};
		for (const row of rows) row.stats.forEach((val, i) => {
			const key = STAT_LABEL[labels[i] ?? ""] ?? labels[i];
			if (!key) return;
			const n = typeof val === "number" ? val : Number(String(val).replace(/[^0-9.+-]/g, ""));
			if (!Number.isFinite(n)) return;
			(series[key] ??= []).push(n);
		});
		const recentStats = {};
		for (const k of Object.keys(series)) {
			const m = ewmaMean(series[k]);
			if (m != null) recentStats[k] = m;
		}
		if (!Object.keys(recentStats).length) return null;
		const usageMin = ewmaMean(useIdx.map((i) => minutes[i]).filter((n) => n != null && Number.isFinite(n))) ?? median;
		return {
			recentStats,
			n: rows.length,
			usageMin
		};
	} catch {
		return null;
	}
}
async function enrichResearchForm(research, path) {
	const [homeForm, awayForm, homeLooks, awayLooks] = await Promise.all([
		research.homeTeamId ? fetchTeamLastTen(path, research.homeTeamId, research.home) : Promise.resolve(null),
		research.awayTeamId ? fetchTeamLastTen(path, research.awayTeamId, research.away) : Promise.resolve(null),
		research.homeLooks ? Promise.resolve(research.homeLooks) : research.homeTeamId ? fetchTeamLooks(path, research.homeTeamId, research.awayAbbr) : Promise.resolve(null),
		research.awayLooks ? Promise.resolve(research.awayLooks) : research.awayTeamId ? fetchTeamLooks(path, research.awayTeamId, research.homeAbbr) : Promise.resolve(null)
	]);
	const lastFive = mergeForm((research.lastFive ?? []).map((b) => ({
		team: b.team,
		line: b.line,
		results: b.results,
		games: b.games ?? [],
		seasonGames: b.seasonGames
	})), [homeForm, awayForm]);
	const starters = (research.players ?? []).filter((p) => p.starter && p.id).slice(0, 8);
	const extra = starters.length ? (research.players ?? []).filter((p) => !p.starter && p.id).slice(0, 4) : (research.players ?? []).slice(0, 8);
	const targets = [...starters, ...extra].slice(0, 10);
	const recents = await Promise.all(targets.map((p) => fetchPlayerRecent(research.sport, p.id)));
	const byId = new Map(targets.map((p, i) => [p.id, recents[i]]));
	const players = (research.players ?? []).map((p) => {
		const hit = byId.get(p.id);
		if (!hit) return p;
		return {
			...p,
			recentStats: hit.recentStats,
			recentN: hit.n,
			usageMin: hit.usageMin
		};
	});
	return {
		...research,
		lastFive,
		players,
		homeLooks: homeLooks ?? research.homeLooks,
		awayLooks: awayLooks ?? research.awayLooks
	};
}
//#endregion
export { leagueTotal as $, evaluateParlay as A, rawToSplit as At, formatFormRead as B, sortByResearchedChance as Bt, coreFunSplit as C, poissonOver as Ct, enrichParlayPicks as D, propContextFromBrief as Dt, deskScore as E, profitOnStake as Et, fetchTeamLooks as F, rulesFor as Ft, gradeParlay as G, uniqueUpcomingGames as Gt, formatPct as H, startOfEtWeekMonday as Ht, filterCatalog as I, sgpHaircut as It, isKnownMarket as J, homeCoverProb as K, unitDollars as Kt, formatAmerican as L, shortPick as Lt, fetchEspnTeamLeaders as M, researchedFavorite as Mt, fetchPlayerRecent as N, rowToPick as Nt, enrichResearchForm as O, propStakeHaircut as Ot, fetchTeamLastTen as P, ruleStamp as Pt, last10ExpectedTotal as Q, formatBetUsd as R, shownCombinedChance as Rt, cn as S, pickKey as St, decimalToAmerican as T, product as Tt, formatScoreLine as U, teamWinForPlayer as Ut, formatKickoff as V, sportLabel as Vt, formatUsd as W, twoWayNoVig as Wt, isTiny as X, isSeed as Y, isTodayEt as Z, buildScan as _, parseEra as _t, MARKET_LABEL as a, matchRawTape as at, canPlacePaper as b, parsePropSelection as bt, americanToDecimal as c, mergeResearchPlayers as ct, analyzeTape as d, oddsInEnglish as dt, leanEnglish as et, applyLeaderStats as f, overProb as ft, buildPropChance as g, parseActionNetworkScoreboard as gt, buildChance as h, parlayScore as ht, ESPN_PATH as i, matchParsedToRows as it, fetchEspnRoster as j, reconstructHandle as jt, etParts as k, rateFromStats as kt, americanToImplied as l, namesHit as lt, blendRate as m, parlayInfoQuality as mt, BRAND as n, logit as nt, STATUS_LABEL as o, matchupLine as ot, assembleChanceInput as p, overlaySnapshot as pt, invLogit as q, unknownMarketReason as qt, DESK_VERSION as r, marketInEnglish as rt, TAG_LABEL as s, mergeForm as st, AN_SPORT as t, liveFromRow as tt, analyzeScores as u, normalCdf as ut, buildUsage as v, parseEspnSummary as vt, correlationOf as w, predictFor as wt, chanceInEnglish as x, payoutOnStake as xt, calibratedChance as y, parseInternalEventId as yt, formatChancePct as z, sizeLabel as zt };
