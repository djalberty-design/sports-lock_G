import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime, n as QueryClientProvider, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { S as useRouter, _ as createFileRoute, b as Navigate, d as HeadContent, f as useRouterState, g as lazyRouteComponent, h as Outlet, l as require_react_dom, m as createRouter, u as Scripts, v as createRootRoute, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn, s as __exportAll } from "./ssr.mjs";
import { a as DEFAULTS, f as isCollegeSport, g as rankSettingsOf, i as CHECK_ORDER, o as DEFAULT_DESK_SETTINGS, p as isMainMarket, r as CHECK_LABELS, s as DEFAULT_SAFEST_FLOOR } from "./desk-settings-uc_BKqpk.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { $ as leagueTotal, A as evaluateParlay, Ct as poissonOver, E as deskScore, Et as profitOnStake, Gt as uniqueUpcomingGames, H as formatPct, Ht as startOfEtWeekMonday, It as sgpHaircut, K as homeCoverProb, Kt as unitDollars, L as formatAmerican, Lt as shortPick, Mt as researchedFavorite, Nt as rowToPick, Q as last10ExpectedTotal, R as formatBetUsd, Rt as shownCombinedChance, S as cn, T as decimalToAmerican, Tt as product, V as formatKickoff, W as formatUsd, X as isTiny, Y as isSeed, Z as isTodayEt, _ as buildScan, b as canPlacePaper, c as americanToDecimal, dt as oddsInEnglish, ft as overProb, ht as parlayScore, k as etParts, l as americanToImplied, lt as namesHit, m as blendRate, mt as parlayInfoQuality, n as BRAND, nt as logit, ot as matchupLine, pt as overlaySnapshot, q as invLogit, r as DESK_VERSION, rt as marketInEnglish, ut as normalCdf, w as correlationOf, x as chanceInEnglish, xt as payoutOnStake, y as calibratedChance, z as formatChancePct, zt as sizeLabel } from "./research-9TMeO2J4.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { i as signOut, t as authClient } from "./client-B40BzJxt.mjs";
import { a as hasGateSessionMarker, n as auth } from "./server-BYBKqy1e.mjs";
import { t as authMiddleware } from "./middleware-Bu4qKCQ4.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { a as Radio, c as Menu, f as Combine, n as TriangleAlert, p as ClipboardList, r as Sparkles, s as Newspaper, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-board-Dj16NR51.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getBoardSnapshot = createServerFn({ method: "GET" }).handler(createSsrRpc("3739a4eb3c7006c5c1a47084b5a7256f60fde1cdecdcc400354fa2564e10ee2e"));
var getEventResearch = createServerFn({ method: "GET" }).validator((d) => d).handler(createSsrRpc("e3ab16d50b1797e9c5e0905f1c613a83749a32b68b1be276d6964b689dfcadc9"));
var parseTicketImage = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("19980d07678dfc71cef7b0a925f69be7421e25f27ec9217ed1cb0f764401c647"));
var DeskDecisionContext = (0, import_react.createContext)(null);
function useBoardQuery() {
	return useQuery({
		queryKey: ["board"],
		queryFn: () => getBoardSnapshot(),
		staleTime: 6e4,
		gcTime: 3e5,
		refetchInterval: 6e4,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false
	});
}
function overlayConfirmed(base, tickets) {
	return overlaySnapshot(base, tickets);
}
var EMPTY = {
	query: {
		isError: false,
		isPending: true,
		isFetching: false,
		data: void 0,
		error: null
	},
	snapshot: void 0,
	scan: null,
	picks: null,
	board: null,
	options: [],
	halt: false,
	weeklyHalt: false,
	ranking: false,
	rankMs: null,
	settings: DEFAULT_DESK_SETTINGS,
	remoteHidden: []
};
function useDeskDecision() {
	return (0, import_react.useContext)(DeskDecisionContext) ?? EMPTY;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/button-CEY5xEgp.js
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium transition-[transform,background-color,box-shadow,opacity] duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] min-h-11", {
	variants: {
		variant: {
			primary: "bg-gold text-navy-deep hover:opacity-90",
			gold: "bg-gold text-navy-deep hover:opacity-90",
			ghost: "bg-transparent text-ink hover:bg-wash",
			outline: "bg-card text-ink shadow-[var(--shadow-paper)] hover:shadow-[var(--shadow-paper-hover)]",
			danger: "bg-down text-ink hover:opacity-90"
		},
		size: {
			sm: "rounded-md px-3 text-sm h-10",
			md: "rounded-md px-4 text-sm h-11",
			lg: "rounded-lg px-5 text-base h-12"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/use-current-user-DG6UNzh9.js
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/desk-store-BsxSeLo4.js
/** DraftKings Classic football scoring. Florida DFS is 18+, not a sportsbook fill. */
var DK_SCORING = {
	PASS_TD: 4,
	PASS_YD: .04,
	INT: -1,
	RUSH_TD: 6,
	RUSH_YD: .1,
	REC_TD: 6,
	REC_YD: .1,
	PPR: 1,
	BONUS_300_PASS: 3,
	BONUS_100_RUSH: 3,
	BONUS_100_REC: 3
};
var DK_CAP = 5e4;
var SHOWDOWN_CAPTAIN_MULT = 1.5;
var CHALK_OWNERSHIP = .25;
function bonusPoints(vol) {
	let b = 0;
	if ((vol.passYds ?? 0) >= 300) b += DK_SCORING.BONUS_300_PASS;
	if ((vol.rushYds ?? 0) >= 100) b += DK_SCORING.BONUS_100_RUSH;
	if ((vol.recYds ?? 0) >= 100) b += DK_SCORING.BONUS_100_REC;
	return b;
}
function projectDkPoints(vol) {
	const s = DK_SCORING;
	const pts = (vol.passYds ?? 0) * s.PASS_YD + (vol.passTd ?? 0) * s.PASS_TD + (vol.ints ?? 0) * s.INT + (vol.rushYds ?? 0) * s.RUSH_YD + (vol.rushTd ?? 0) * s.RUSH_TD + (vol.recYds ?? 0) * s.REC_YD + (vol.recTd ?? 0) * s.REC_TD + (vol.recs ?? 0) * s.PPR + bonusPoints(vol);
	return Math.round(pts * 10) / 10;
}
/** Wind ≥ 18 mph cuts deep passing; underdogs throw more, favorites lean run. */
function adjustVolumeForScript(vol, opts) {
	const wind = opts.windMph ?? 0;
	const favoredBy = opts.favoredBy ?? 0;
	let pass = 1;
	let rush = 1;
	let rec = 1;
	if (wind >= 18) {
		pass *= .88;
		rec *= .9;
		rush *= 1.08;
	}
	if (favoredBy >= 5.5) {
		rush *= 1.06;
		pass *= .96;
	} else if (favoredBy <= -5.5) {
		pass *= 1.05;
		rush *= .94;
	}
	return {
		passYds: vol.passYds != null ? vol.passYds * pass : void 0,
		rushYds: vol.rushYds != null ? vol.rushYds * rush : void 0,
		recYds: vol.recYds != null ? vol.recYds * rec : void 0,
		recs: vol.recs != null ? vol.recs * rec : void 0,
		passTd: vol.passTd,
		rushTd: vol.rushTd,
		recTd: vol.recTd,
		ints: vol.ints
	};
}
function sigmaOf(p) {
	const s = (p.p80 - p.p20) / 2.56;
	if (Number.isFinite(s) && s > .4) return s;
	return Math.max(1, (Number.isFinite(p.p50) ? p.p50 : 8) * .22);
}
/** Cash / 50-50: maximize floor (mean − 0.75 σ). */
function cashFloor(p) {
	return p.p50 - .75 * sigmaOf(p);
}
/** Tournament: maximize ceiling (mean + 1.65 σ). */
function gppCeiling(p) {
	return p.p50 + 1.65 * sigmaOf(p);
}
function showdownSalary(salary, captain) {
	return captain ? Math.round(salary * SHOWDOWN_CAPTAIN_MULT) : salary;
}
function showdownPoints(pts, captain) {
	return captain ? pts * SHOWDOWN_CAPTAIN_MULT : pts;
}
function ownershipFrac(ownershipEst) {
	if (!Number.isFinite(ownershipEst) || ownershipEst < 0) return 0;
	return ownershipEst > 1 ? ownershipEst / 100 : ownershipEst;
}
function isChalk(ownershipEst) {
	return ownershipFrac(ownershipEst) > CHALK_OWNERSHIP;
}
/**
* Vacated touches + 90-minute official inactive radar.
* When a starter is ruled out, leftover volume moves to the depth chart — never invented from thin air.
*/
function isOut(status) {
	return status === "out" || status === "ir" || /^(out|ir|inactive)$/i.test(status ?? "");
}
function samePool(a, b) {
	const pa = a.pos.toUpperCase();
	const pb = b.pos.toUpperCase();
	if (pa === "RB") return pb === "RB";
	if (pa === "WR" || pa === "TE") return pb === "WR" || pb === "TE";
	if (pa === "QB") return pb === "QB";
	return pa === pb;
}
function weightOf(p) {
	const w = p.opportunityWeight;
	if (Number.isFinite(w) && (w ?? 0) > 0) return w;
	return .25;
}
function vacatedShare(p) {
	const s = (Number.isFinite(p.targetShare) ? p.targetShare : 0) + (Number.isFinite(p.usageRate) ? p.usageRate : 0);
	if (s > 0) return s;
	if (p.pos === "RB") return .55;
	if (p.pos === "WR") return .28;
	if (p.pos === "TE") return .18;
	if (p.pos === "QB") return 1;
	return .2;
}
/**
* Reallocate the inactive player's target share + usage onto backups
* by opportunityWeight. The inactive projection goes to zero.
*/
function reallocateVacatedVolume(inactive, depthChart) {
	if (!isOut(inactive.status) && inactive.p50 > 0) {}
	const backups = depthChart.filter((p) => p.id !== inactive.id && p.team === inactive.team && !isOut(p.status) && samePool(p, inactive));
	const share = vacatedShare(inactive);
	const wSum = backups.reduce((s, p) => s + weightOf(p), 0);
	return depthChart.map((p) => {
		if (p.id === inactive.id) return {
			...p,
			p20: 0,
			p50: 0,
			p80: 0,
			status: "out"
		};
		if (backups.findIndex((b) => b.id === p.id) < 0 || wSum <= 0) return p;
		const frac = weightOf(p) / wSum;
		const lift = 1 + share * frac;
		return {
			...p,
			p20: Math.round(p.p20 * lift * 10) / 10,
			p50: Math.round(p.p50 * lift * 10) / 10,
			p80: Math.round(p.p80 * (lift + .04) * 10) / 10
		};
	});
}
function applyInjuryRipple(players) {
	let next = players.map((p) => ({ ...p }));
	const outs = next.filter((p) => isOut(p.status));
	for (const dead of outs) next = reallocateVacatedVolume(dead, next);
	return next;
}
function minutesToKickoff(iso, now = /* @__PURE__ */ new Date()) {
	if (!iso) return null;
	const t = new Date(iso);
	if (!Number.isFinite(t.getTime())) return null;
	return (t.getTime() - now.getTime()) / 6e4;
}
function etHourMinute(iso) {
	const t = new Date(iso);
	if (!Number.isFinite(t.getTime())) return null;
	const p = etParts(t);
	return {
		hour: Number(p.hour),
		minute: Number(p.minute),
		weekday: p.weekday,
		etDate: p.etDate
	};
}
/** 4:05 / 4:25 PM ET (and later) windows after the 1:00 PM ET early lock. */
function isLateWindowKickoff(iso) {
	const et = etHourMinute(iso);
	if (!et) return false;
	return et.hour > 16 || et.hour === 16 && et.minute >= 5;
}
function earlyGamesLocked(now = /* @__PURE__ */ new Date()) {
	const p = etParts(now);
	const hour = Number(p.hour);
	const minute = Number(p.minute);
	return hour > 13 || hour === 13 && minute >= 0;
}
function inactiveRadar(players, now = /* @__PURE__ */ new Date()) {
	const alerts = [];
	const earlyLocked = earlyGamesLocked(now);
	for (const p of players) {
		if (isOut(p.status)) {
			alerts.push({
				playerId: p.id,
				name: p.name,
				kind: "out",
				line: `${p.name} is ruled out. Vacated touches moved to the depth chart. Photograph DraftKings before you lock the salary.`
			});
			if (p.kickoff && isLateWindowKickoff(p.kickoff) && earlyLocked) alerts.push({
				playerId: p.id,
				name: p.name,
				kind: "late-swap",
				line: `${p.name} is out in a late window after the 1:00 p.m. ET lock. Swap the late game. We never submit the lineup.`
			});
			continue;
		}
		if (p.status !== "questionable") continue;
		const mins = p.kickoff ? minutesToKickoff(p.kickoff, now) : null;
		if (mins != null && mins <= 90 && mins > -15) alerts.push({
			playerId: p.id,
			name: p.name,
			kind: "window",
			line: `${p.name} is questionable inside the 90-minute official inactive window. Have a backup ready. 18+ Florida DFS.`
		});
		if (p.kickoff && isLateWindowKickoff(p.kickoff) && earlyLocked) alerts.push({
			playerId: p.id,
			name: p.name,
			kind: "late-swap",
			line: `${p.name} is a game-time tag in a late window. Early games already locked. Swap if they sit.`
		});
	}
	const seen = /* @__PURE__ */ new Set();
	return alerts.filter((a) => {
		const k = `${a.playerId}:${a.kind}`;
		if (seen.has(k)) return false;
		seen.add(k);
		return true;
	});
}
var SLOT_MAP = {
	NFL: [
		"QB",
		"RB",
		"RB",
		"WR",
		"WR",
		"WR",
		"TE",
		"FLEX",
		"DST"
	],
	NBA: [
		"PG",
		"SG",
		"SF",
		"PF",
		"C",
		"G",
		"F",
		"UTIL"
	],
	MLB: [
		"P",
		"P",
		"C",
		"1B",
		"2B",
		"3B",
		"SS",
		"OF",
		"OF",
		"OF"
	],
	NHL: [
		"C",
		"C",
		"W",
		"W",
		"W",
		"D",
		"D",
		"G",
		"UTIL"
	]
};
var FLEX_ELIGIBLE = {
	NFL: [
		"RB",
		"WR",
		"TE"
	],
	NBA: [],
	MLB: [],
	NHL: []
};
var NBA_G = ["PG", "SG"];
var NBA_F = ["SF", "PF"];
var NBA_UTIL = [
	"PG",
	"SG",
	"SF",
	"PF",
	"C"
];
var NHL_UTIL = [
	"C",
	"W",
	"D"
];
var NHL_W = [
	"W",
	"LW",
	"RW"
];
function ePts(p) {
	return .25 * p.p20 + .5 * p.p50 + .25 * p.p80;
}
function hydratePlayer(raw) {
	let p20 = raw.p20;
	let p50 = raw.p50;
	let p80 = raw.p80;
	if (raw.volume && (raw.volume.passYds || raw.volume.rushYds || raw.volume.recYds || raw.volume.recs)) {
		const mean = projectDkPoints(adjustVolumeForScript(raw.volume, {
			favoredBy: raw.favoredBy,
			windMph: raw.windMph
		}));
		if (mean > 0) {
			p50 = raw.p50 > 0 ? raw.p50 : mean;
			p20 = raw.p20 > 0 ? raw.p20 : Math.round(mean * .75 * 10) / 10;
			p80 = raw.p80 > 0 ? raw.p80 : Math.round(mean * 1.28 * 10) / 10;
		}
	}
	const e = ePts({
		p20,
		p50,
		p80
	});
	return {
		...raw,
		p20,
		p50,
		p80,
		ePts: e,
		value: raw.salary > 0 ? e / (raw.salary / 1e3) : 0
	};
}
function eligibleFor(slot, pos, sport) {
	const p = pos.toUpperCase();
	const s = slot.toUpperCase();
	if (s === p) return true;
	if (sport === "NFL" && s === "FLEX") return FLEX_ELIGIBLE.NFL.includes(p);
	if (sport === "NFL" && s === "DST") return p === "DST" || p === "DEF";
	if (sport === "NBA" && s === "G") return NBA_G.includes(p);
	if (sport === "NBA" && s === "F") return NBA_F.includes(p);
	if (sport === "NBA" && s === "UTIL") return NBA_UTIL.includes(p);
	if (sport === "NHL" && (s === "W" || s === "LW" || s === "RW")) return NHL_W.includes(p) || p === "W";
	if (sport === "NHL" && s === "UTIL") return NHL_UTIL.includes(p) || NHL_W.includes(p);
	if (sport === "MLB" && s === "OF") return p === "OF" || p === "LF" || p === "CF" || p === "RF";
	if (sport === "MLB" && s === "P") return p === "P" || p === "SP" || p === "RP";
	return false;
}
function legalPool(players) {
	return players.filter((p) => p.confirmed && p.status !== "out" && p.status !== "ir" && p.status !== "locked" && p.salary > 0);
}
function isDst(p) {
	const pos = p.pos.toUpperCase();
	return pos === "DST" || pos === "DEF";
}
function isSkill(p) {
	return [
		"RB",
		"WR",
		"TE"
	].includes(p.pos.toUpperCase());
}
/** Never pair a starting QB with the opposing DST. */
function forbidsOppDst(picked, cand) {
	if (isDst(cand)) return picked.some((p) => p.pos === "QB" && p.opp === cand.team);
	if (cand.pos === "QB") return picked.some((p) => isDst(p) && p.team === cand.opp);
	return false;
}
function greedyFill(opts) {
	const warnings = [];
	const slots = opts.slots;
	const salaryOf = opts.salaryOf ?? ((p) => p.salary);
	const remaining = [...opts.pool].map((p) => ({
		...p,
		score: opts.scoreOf(p)
	}));
	remaining.sort((a, b) => b.score - a.score || a.salary - b.salary);
	const used = /* @__PURE__ */ new Set();
	const picked = [];
	let spent = 0;
	for (const s of opts.seed ?? []) {
		if (used.has(s.id)) continue;
		used.add(s.id);
		picked.push(s);
		spent += s.salary;
	}
	const taken = /* @__PURE__ */ new Set();
	for (const p of picked) {
		const idx = slots.findIndex((s, i) => !taken.has(i) && eligibleFor(s, p.pos, opts.sport));
		if (idx >= 0) taken.add(idx);
	}
	const restSlots = slots.filter((_, i) => !taken.has(i));
	const minLeft = (from) => {
		const reserved = new Set(used);
		let sum = 0;
		for (let i = from; i < restSlots.length; i++) {
			const slot = restSlots[i];
			const cand = remaining.filter((p) => !reserved.has(p.id) && eligibleFor(slot, p.pos, opts.sport) && !forbidsOppDst(picked, p)).sort((a, b) => salaryOf(a, slot) - salaryOf(b, slot))[0];
			if (cand) {
				reserved.add(cand.id);
				sum += salaryOf(cand, slot);
			}
		}
		return sum;
	};
	const seedCount = picked.length;
	for (let i = 0; i < restSlots.length; i++) {
		const slot = restSlots[i];
		const minRest = minLeft(i + 1);
		const room = opts.cap - spent - minRest;
		const cand = remaining.filter((p) => !used.has(p.id) && eligibleFor(slot, p.pos, opts.sport) && salaryOf(p, slot) <= room && !forbidsOppDst(picked, p)).sort((a, b) => b.score - a.score)[0];
		if (!cand) {
			warnings.push(`Empty slot: ${slot}`);
			continue;
		}
		used.add(cand.id);
		picked.push(cand);
		spent += salaryOf(cand, slot);
	}
	if (opts.requireStack && opts.sport === "NFL") {
		const qb = picked.find((p) => p.pos === "QB");
		const catchers = picked.filter((p) => qb && (p.pos === "WR" || p.pos === "TE") && p.stackKey === qb.stackKey && p.id !== qb.id);
		if (qb && catchers.length < 2) {
			const partner = remaining.find((p) => !used.has(p.id) && (p.pos === "WR" || p.pos === "TE") && p.stackKey === qb.stackKey && !forbidsOppDst(picked, p));
			const flexIdx = picked.findIndex((p, idx) => idx >= seedCount && (p.pos === "WR" || p.pos === "TE" || p.pos === "RB") && p.team !== qb.team);
			if (partner && flexIdx >= 0) {
				const victim = picked[flexIdx];
				const nextSpent = spent - victim.salary + partner.salary;
				if (nextSpent <= opts.cap) {
					used.delete(victim.id);
					used.add(partner.id);
					picked[flexIdx] = partner;
					spent = nextSpent;
				} else warnings.push("Could not fit a second pass-catcher under cap.");
			}
		}
	}
	if (spent > opts.cap) warnings.push("Over cap.");
	return {
		players: picked,
		warnings
	};
}
function generateGPPStack(pool) {
	const qbs = [...pool.filter((p) => p.pos === "QB")].sort((a, b) => gppCeiling(b) - gppCeiling(a));
	for (const qb of qbs) {
		if (!(qb.total == null || qb.total >= 47)) continue;
		const catchers = pool.filter((p) => (p.pos === "WR" || p.pos === "TE") && p.team === qb.team && p.id !== qb.id).sort((a, b) => gppCeiling(b) - gppCeiling(a)).slice(0, 2);
		if (catchers.length < 2) continue;
		const bringBack = pool.filter((p) => isSkill(p) && p.team === qb.opp).sort((a, b) => gppCeiling(b) - gppCeiling(a))[0];
		if (!bringBack) continue;
		return {
			seed: [
				qb,
				...catchers,
				bringBack
			],
			note: `Double-stack ${qb.name} + ${catchers.map((c) => c.name).join(" + ")} with ${bringBack.name} bring-back.`
		};
	}
	const qb = qbs[0];
	if (!qb) return {
		seed: [],
		note: ""
	};
	const one = pool.find((p) => (p.pos === "WR" || p.pos === "TE") && p.team === qb.team);
	return {
		seed: one ? [qb, one] : [qb],
		note: "GPP wants a QB stack. Shootout total was under 47, so the double-stack sat down."
	};
}
function buildCashLineup(sport, players, cap = DK_CAP) {
	const slots = SLOT_MAP[sport] ?? SLOT_MAP.NFL;
	const { players: picked, warnings } = greedyFill({
		sport,
		slots,
		pool: legalPool(players),
		scoreOf: (p) => cashFloor(p) + .18 * p.p20,
		cap
	});
	const extra = [];
	const qb = picked.find((p) => p.pos === "QB");
	const dst = picked.find(isDst);
	if (qb && dst && dst.team === qb.opp) extra.push("Cash sat down a QB + opposing DST pairing.");
	const rb = picked.find((p) => p.pos === "RB");
	if (rb && dst && rb.team === dst.team && (rb.favoredBy ?? 0) >= 5.5) extra.push(`${rb.name} + ${dst.name} DST — favorite by ${rb.favoredBy}. Clock-draining script.`);
	return summarize("cash", picked, cap, [...warnings, ...extra], slots.length);
}
function buildGppLineup(sport, players, cap = DK_CAP) {
	const slots = SLOT_MAP[sport] ?? SLOT_MAP.NFL;
	const pool = legalPool(players);
	const stack = sport === "NFL" ? generateGPPStack(pool) : {
		seed: [],
		note: ""
	};
	const { players: picked, warnings } = greedyFill({
		sport,
		slots,
		pool,
		scoreOf: (p) => {
			const ceil = gppCeiling(p);
			const own = ownershipFrac(p.ownershipEst);
			return ceil * (isChalk(p.ownershipEst) ? .72 - Math.min(.2, (own - .25) * .5) : 1);
		},
		cap,
		requireStack: sport === "NFL",
		seed: stack.seed
	});
	const notes = [...warnings];
	if (stack.note) notes.push(stack.note);
	const chalk = picked.filter((p) => isChalk(p.ownershipEst));
	if (chalk.length) notes.push(`Chalk on the roster: ${chalk.map((c) => c.name).join(", ")}. Pivot if a teammate is cheaper and lower-owned.`);
	return summarize("gpp", picked, cap, notes, slots.length, { stackNote: stack.note });
}
var SHOWDOWN_SLOTS = [
	"CPT",
	"FLEX",
	"FLEX",
	"FLEX",
	"FLEX",
	"FLEX"
];
function buildShowdownLineup(players, cap = DK_CAP) {
	const pool = legalPool(players);
	const byGame = /* @__PURE__ */ new Map();
	for (const p of pool) {
		const key = p.stackKey || [p.team, p.opp].sort().join("-");
		const arr = byGame.get(key) ?? [];
		arr.push(p);
		byGame.set(key, arr);
	}
	const game = [...byGame.values()].sort((a, b) => b.length - a.length)[0];
	if (!game || game.length < 6) return null;
	const cheapest = [...game].sort((a, b) => a.salary - b.salary);
	let bestCaptain = null;
	let bestScore = -Infinity;
	for (const c of game) {
		const restMin = cheapest.filter((x) => x.id !== c.id).slice(0, 5).reduce((s, p) => s + p.salary, 0);
		if (showdownSalary(c.salary, true) + restMin > cap) continue;
		const score = showdownPoints(gppCeiling(c), true);
		if (score > bestScore) {
			bestScore = score;
			bestCaptain = c;
		}
	}
	if (!bestCaptain) return null;
	const used = /* @__PURE__ */ new Set([bestCaptain.id]);
	const picked = [bestCaptain];
	let spent = showdownSalary(bestCaptain.salary, true);
	const warnings = [];
	if (bestCaptain.pos === "WR" || bestCaptain.pos === "TE") {
		const qb = game.find((p) => p.pos === "QB" && p.team === bestCaptain.team && !used.has(p.id));
		if (qb && spent + qb.salary <= cap) {
			used.add(qb.id);
			picked.push(qb);
			spent += qb.salary;
		} else warnings.push("Captain is a pass-catcher — their QB should be in FLEX. Could not fit the QB under cap.");
	}
	const ranked = [...game].filter((p) => !used.has(p.id)).sort((a, b) => gppCeiling(b) - gppCeiling(a) || a.salary - b.salary);
	while (picked.length < 6) {
		const need = 6 - picked.length - 1;
		const room = cap - spent;
		const cand = ranked.find((p) => {
			if (used.has(p.id)) return false;
			const minRest = [...game].filter((x) => !used.has(x.id) && x.id !== p.id).sort((a, b) => a.salary - b.salary).slice(0, Math.max(0, need)).reduce((s, x) => s + x.salary, 0);
			return p.salary <= room - minRest;
		});
		if (!cand) {
			warnings.push("Empty FLEX.");
			break;
		}
		used.add(cand.id);
		picked.push(cand);
		spent += cand.salary;
	}
	const note = `${bestCaptain.name} Captain at 1.5× salary (${showdownSalary(bestCaptain.salary, true).toLocaleString()}) and 1.5× points.`;
	return summarize("showdown", picked, cap, [...warnings, note], SHOWDOWN_SLOTS.length, {
		captainId: bestCaptain.id,
		stackNote: note,
		salaryOf: (p) => p.id === bestCaptain.id ? showdownSalary(p.salary, true) : p.salary,
		pointsOf: (p, key) => showdownPoints(p[key], p.id === bestCaptain.id)
	});
}
function summarize(kind, players, cap, warnings, slotCount, extra) {
	if (players.some((p) => p.status === "out" || p.status === "ir")) warnings.push("Out / IR player in lineup.");
	const salaryOf = extra?.salaryOf ?? ((p) => p.salary);
	const pointsOf = extra?.pointsOf ?? ((p, key) => p[key]);
	return {
		kind,
		players,
		capUsed: players.reduce((s, p) => s + salaryOf(p), 0),
		cap,
		projP20: players.reduce((s, p) => s + pointsOf(p, "p20"), 0),
		projP50: players.reduce((s, p) => s + pointsOf(p, "p50"), 0),
		projP80: players.reduce((s, p) => s + pointsOf(p, "p80"), 0),
		warnings: [...new Set(warnings)],
		captainId: extra?.captainId ?? null,
		stackNote: extra?.stackNote
	};
}
function detectSalaryShifts(prev, next) {
	if (!prev.length) return [];
	const byName = new Map(prev.map((p) => [p.name.toLowerCase(), p]));
	const out = [];
	for (const p of next) {
		const old = byName.get(p.name.toLowerCase());
		if (!old) continue;
		if (Math.abs(old.salary - p.salary) >= 200) out.push({
			name: p.name,
			was: old.salary,
			now: p.salary
		});
	}
	return out;
}
function optimizeSlate(bundle) {
	if (!bundle.confirmed) return {
		...bundle,
		cash: null,
		gpp: null,
		showdown: null,
		inactiveAlerts: []
	};
	const rippled = applyInjuryRipple(bundle.players).map((p) => hydratePlayer(p));
	const alerts = inactiveRadar(rippled);
	return {
		...bundle,
		players: rippled,
		cash: buildCashLineup(bundle.sport, rippled, bundle.cap),
		gpp: buildGppLineup(bundle.sport, rippled, bundle.cap),
		showdown: bundle.sport === "NFL" ? buildShowdownLineup(rippled, bundle.cap) : null,
		inactiveAlerts: alerts
	};
}
function parseSlateTable(text, sport) {
	const rows = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).filter((l) => !/^name|player|pos/i.test(l));
	const out = [];
	rows.forEach((line, i) => {
		const parts = line.split(/[,\t|]+/).map((p) => p.trim());
		if (parts.length < 3) return;
		const name = parts[0];
		const pos = parts[1].toUpperCase();
		const team = parts[2].toUpperCase();
		const salary = Number(String(parts[3] ?? "0").replace(/[^0-9.]/g, ""));
		const p50 = Number(parts[4] ?? "0") || salary / 1e3 * 4;
		const p20 = Number(parts[5] ?? "") || p50 * .75;
		const p80 = Number(parts[6] ?? "") || p50 * 1.25;
		const opp = (parts[7] ?? "").toUpperCase();
		const statusRaw = (parts[8] ?? "ok").toLowerCase();
		const status = statusRaw === "out" || statusRaw === "ir" || statusRaw === "locked" || statusRaw === "questionable" ? statusRaw : "ok";
		const raw = {
			id: `${sport}-${name}-${i}`,
			name,
			pos,
			team,
			opp,
			status,
			salary,
			p20,
			p50,
			p80,
			ownershipEst: Number(parts[9] ?? 10),
			stackKey: `${team}-game`,
			confidence: "med",
			confirmed: true
		};
		out.push(hydratePlayer(raw));
	});
	return out;
}
function sampleNflSlate() {
	const kcBal = {
		total: 52.5,
		kickoff: lateSundayIso(),
		windMph: 8
	};
	const phiDal = {
		total: 48.5,
		kickoff: earlySundayIso()
	};
	return [
		{
			id: "kc-mahomes",
			name: "P. Mahomes",
			pos: "QB",
			team: "KC",
			opp: "BAL",
			status: "ok",
			salary: 7800,
			p20: 18,
			p50: 24,
			p80: 32,
			ownershipEst: 18,
			stackKey: "KC-BAL",
			confidence: "high",
			confirmed: true,
			total: kcBal.total,
			favoredBy: 3,
			kickoff: kcBal.kickoff,
			windMph: kcBal.windMph,
			targetShare: 0,
			usageRate: 1,
			opportunityWeight: 1,
			volume: {
				passYds: 285,
				passTd: 2.2,
				ints: .7,
				rushYds: 22,
				rushTd: .2
			}
		},
		{
			id: "bal-jackson",
			name: "L. Jackson",
			pos: "QB",
			team: "BAL",
			opp: "KC",
			status: "ok",
			salary: 7600,
			p20: 17,
			p50: 23,
			p80: 31,
			ownershipEst: 16,
			stackKey: "KC-BAL",
			confidence: "high",
			confirmed: true,
			total: kcBal.total,
			favoredBy: -3,
			kickoff: kcBal.kickoff,
			volume: {
				passYds: 230,
				passTd: 1.6,
				ints: .6,
				rushYds: 55,
				rushTd: .4
			}
		},
		{
			id: "phi-hurts",
			name: "J. Hurts",
			pos: "QB",
			team: "PHI",
			opp: "DAL",
			status: "ok",
			salary: 7400,
			p20: 16,
			p50: 22,
			p80: 30,
			ownershipEst: 14,
			stackKey: "PHI-DAL",
			confidence: "high",
			confirmed: true,
			total: phiDal.total,
			favoredBy: 6,
			kickoff: phiDal.kickoff
		},
		{
			id: "kc-kelce",
			name: "T. Kelce",
			pos: "TE",
			team: "KC",
			opp: "BAL",
			status: "ok",
			salary: 6200,
			p20: 9,
			p50: 14,
			p80: 20,
			ownershipEst: 20,
			stackKey: "KC-BAL",
			confidence: "high",
			confirmed: true,
			total: kcBal.total,
			kickoff: kcBal.kickoff,
			targetShare: .24,
			usageRate: .22,
			opportunityWeight: .55,
			volume: {
				recYds: 72,
				recs: 6.4,
				recTd: .6
			}
		},
		{
			id: "kc-worthy",
			name: "X. Worthy",
			pos: "WR",
			team: "KC",
			opp: "BAL",
			status: "ok",
			salary: 5400,
			p20: 8,
			p50: 13,
			p80: 21,
			ownershipEst: 12,
			stackKey: "KC-BAL",
			confidence: "med",
			confirmed: true,
			total: kcBal.total,
			kickoff: kcBal.kickoff,
			targetShare: .2,
			usageRate: .18,
			opportunityWeight: .35,
			volume: {
				recYds: 68,
				recs: 4.8,
				recTd: .5
			}
		},
		{
			id: "kc-rice",
			name: "R. Rice",
			pos: "WR",
			team: "KC",
			opp: "BAL",
			status: "ok",
			salary: 6100,
			p20: 9,
			p50: 14,
			p80: 20,
			ownershipEst: 15,
			stackKey: "KC-BAL",
			confidence: "med",
			confirmed: true,
			total: kcBal.total,
			kickoff: kcBal.kickoff,
			targetShare: .22,
			usageRate: .2,
			opportunityWeight: .4
		},
		{
			id: "bal-flowers",
			name: "Z. Flowers",
			pos: "WR",
			team: "BAL",
			opp: "KC",
			status: "ok",
			salary: 5900,
			p20: 8,
			p50: 13,
			p80: 19,
			ownershipEst: 11,
			stackKey: "KC-BAL",
			confidence: "med",
			confirmed: true,
			total: kcBal.total,
			kickoff: kcBal.kickoff,
			targetShare: .21,
			opportunityWeight: .4
		},
		{
			id: "bal-andrews",
			name: "M. Andrews",
			pos: "TE",
			team: "BAL",
			opp: "KC",
			status: "ok",
			salary: 4800,
			p20: 6,
			p50: 10,
			p80: 16,
			ownershipEst: 9,
			stackKey: "KC-BAL",
			confidence: "med",
			confirmed: true,
			total: kcBal.total,
			kickoff: kcBal.kickoff,
			targetShare: .16,
			opportunityWeight: .3
		},
		{
			id: "phi-brown",
			name: "A. J. Brown",
			pos: "WR",
			team: "PHI",
			opp: "DAL",
			status: "ok",
			salary: 7200,
			p20: 10,
			p50: 16,
			p80: 24,
			ownershipEst: 17,
			stackKey: "PHI-DAL",
			confidence: "high",
			confirmed: true,
			total: phiDal.total,
			kickoff: phiDal.kickoff
		},
		{
			id: "phi-smith",
			name: "D. Smith",
			pos: "WR",
			team: "PHI",
			opp: "DAL",
			status: "ok",
			salary: 6400,
			p20: 8,
			p50: 13,
			p80: 20,
			ownershipEst: 13,
			stackKey: "PHI-DAL",
			confidence: "med",
			confirmed: true,
			total: phiDal.total,
			kickoff: phiDal.kickoff
		},
		{
			id: "dal-lamb",
			name: "C. Lamb",
			pos: "WR",
			team: "DAL",
			opp: "PHI",
			status: "ok",
			salary: 7600,
			p20: 11,
			p50: 17,
			p80: 25,
			ownershipEst: 22,
			stackKey: "PHI-DAL",
			confidence: "high",
			confirmed: true,
			total: phiDal.total,
			kickoff: phiDal.kickoff
		},
		{
			id: "dal-prescott",
			name: "D. Prescott",
			pos: "QB",
			team: "DAL",
			opp: "PHI",
			status: "ok",
			salary: 6800,
			p20: 15,
			p50: 21,
			p80: 28,
			ownershipEst: 12,
			stackKey: "PHI-DAL",
			confidence: "med",
			confirmed: true,
			total: phiDal.total,
			kickoff: phiDal.kickoff
		},
		{
			id: "dal-ferguson",
			name: "J. Ferguson",
			pos: "TE",
			team: "DAL",
			opp: "PHI",
			status: "ok",
			salary: 3900,
			p20: 5,
			p50: 8,
			p80: 13,
			ownershipEst: 6,
			stackKey: "PHI-DAL",
			confidence: "med",
			confirmed: true,
			total: phiDal.total,
			kickoff: phiDal.kickoff
		},
		{
			id: "kc-pacheco",
			name: "I. Pacheco",
			pos: "RB",
			team: "KC",
			opp: "BAL",
			status: "ok",
			salary: 5800,
			p20: 8,
			p50: 13,
			p80: 19,
			ownershipEst: 14,
			stackKey: "KC-BAL",
			confidence: "med",
			confirmed: true,
			total: kcBal.total,
			kickoff: kcBal.kickoff,
			usageRate: .55,
			opportunityWeight: .65,
			volume: {
				rushYds: 68,
				rushTd: .5,
				recs: 2.1,
				recYds: 14
			}
		},
		{
			id: "kc-hunt",
			name: "K. Hunt",
			pos: "RB",
			team: "KC",
			opp: "BAL",
			status: "ok",
			salary: 4200,
			p20: 4,
			p50: 7,
			p80: 12,
			ownershipEst: 4,
			stackKey: "KC-BAL",
			confidence: "med",
			confirmed: true,
			total: kcBal.total,
			kickoff: kcBal.kickoff,
			usageRate: .2,
			opportunityWeight: .35
		},
		{
			id: "bal-henry",
			name: "D. Henry",
			pos: "RB",
			team: "BAL",
			opp: "KC",
			status: "ok",
			salary: 8e3,
			p20: 12,
			p50: 18,
			p80: 26,
			ownershipEst: 24,
			stackKey: "KC-BAL",
			confidence: "high",
			confirmed: true,
			total: kcBal.total,
			kickoff: kcBal.kickoff,
			usageRate: .62,
			opportunityWeight: .7,
			volume: {
				rushYds: 95,
				rushTd: .8,
				recs: 1.2,
				recYds: 8
			}
		},
		{
			id: "bal-hill",
			name: "J. Hill",
			pos: "RB",
			team: "BAL",
			opp: "KC",
			status: "ok",
			salary: 4e3,
			p20: 3.5,
			p50: 6,
			p80: 11,
			ownershipEst: 3,
			stackKey: "KC-BAL",
			confidence: "med",
			confirmed: true,
			total: kcBal.total,
			kickoff: kcBal.kickoff,
			usageRate: .18,
			opportunityWeight: .3
		},
		{
			id: "phi-saquon",
			name: "S. Barkley",
			pos: "RB",
			team: "PHI",
			opp: "DAL",
			status: "ok",
			salary: 8200,
			p20: 13,
			p50: 19,
			p80: 27,
			ownershipEst: 26,
			stackKey: "PHI-DAL",
			confidence: "high",
			confirmed: true,
			total: phiDal.total,
			favoredBy: 6,
			kickoff: phiDal.kickoff,
			usageRate: .6
		},
		{
			id: "dal-williams",
			name: "J. Williams",
			pos: "RB",
			team: "DAL",
			opp: "PHI",
			status: "ok",
			salary: 5600,
			p20: 8,
			p50: 12,
			p80: 18,
			ownershipEst: 10,
			stackKey: "PHI-DAL",
			confidence: "med",
			confirmed: true,
			total: phiDal.total,
			kickoff: phiDal.kickoff
		},
		{
			id: "rb-mixon",
			name: "J. Mixon",
			pos: "RB",
			team: "HOU",
			opp: "IND",
			status: "ok",
			salary: 6100,
			p20: 9,
			p50: 14,
			p80: 20,
			ownershipEst: 11,
			stackKey: "HOU-IND",
			confidence: "med",
			confirmed: true
		},
		{
			id: "rb-cook",
			name: "J. Cook",
			pos: "RB",
			team: "BUF",
			opp: "MIA",
			status: "ok",
			salary: 6400,
			p20: 9,
			p50: 14,
			p80: 21,
			ownershipEst: 12,
			stackKey: "BUF-MIA",
			confidence: "med",
			confirmed: true
		},
		{
			id: "wr-hill",
			name: "T. Hill",
			pos: "WR",
			team: "MIA",
			opp: "BUF",
			status: "ok",
			salary: 7e3,
			p20: 9,
			p50: 15,
			p80: 23,
			ownershipEst: 16,
			stackKey: "BUF-MIA",
			confidence: "med",
			confirmed: true
		},
		{
			id: "te-kittle",
			name: "G. Kittle",
			pos: "TE",
			team: "SF",
			opp: "NYJ",
			status: "ok",
			salary: 5300,
			p20: 7,
			p50: 11,
			p80: 17,
			ownershipEst: 10,
			stackKey: "SF-NYJ",
			confidence: "med",
			confirmed: true
		},
		{
			id: "dst-bal",
			name: "Ravens",
			pos: "DST",
			team: "BAL",
			opp: "KC",
			status: "ok",
			salary: 3200,
			p20: 4,
			p50: 7,
			p80: 13,
			ownershipEst: 8,
			stackKey: "KC-BAL",
			confidence: "med",
			confirmed: true,
			kickoff: kcBal.kickoff
		},
		{
			id: "dst-phi",
			name: "Eagles",
			pos: "DST",
			team: "PHI",
			opp: "DAL",
			status: "ok",
			salary: 3e3,
			p20: 4,
			p50: 7,
			p80: 12,
			ownershipEst: 9,
			stackKey: "PHI-DAL",
			confidence: "med",
			confirmed: true,
			favoredBy: 6,
			kickoff: phiDal.kickoff
		},
		{
			id: "dst-sf",
			name: "49ers",
			pos: "DST",
			team: "SF",
			opp: "NYJ",
			status: "ok",
			salary: 3400,
			p20: 5,
			p50: 8,
			p80: 14,
			ownershipEst: 11,
			stackKey: "SF-NYJ",
			confidence: "med",
			confirmed: true
		},
		{
			id: "dst-kc",
			name: "Chiefs",
			pos: "DST",
			team: "KC",
			opp: "BAL",
			status: "ok",
			salary: 2800,
			p20: 3.5,
			p50: 6,
			p80: 11,
			ownershipEst: 6,
			stackKey: "KC-BAL",
			confidence: "med",
			confirmed: true,
			kickoff: kcBal.kickoff
		},
		{
			id: "wr-adams",
			name: "D. Adams",
			pos: "WR",
			team: "NYJ",
			opp: "SF",
			status: "ok",
			salary: 6e3,
			p20: 7,
			p50: 12,
			p80: 19,
			ownershipEst: 9,
			stackKey: "SF-NYJ",
			confidence: "med",
			confirmed: true
		},
		{
			id: "rb-out",
			name: "Injured Back",
			pos: "RB",
			team: "NE",
			opp: "CIN",
			status: "out",
			salary: 5500,
			p20: 11,
			p50: 16,
			p80: 22,
			ownershipEst: 1,
			stackKey: "NE-CIN",
			confidence: "low",
			confirmed: true,
			usageRate: .58,
			targetShare: .08
		},
		{
			id: "rb-stevenson",
			name: "R. Stevenson",
			pos: "RB",
			team: "NE",
			opp: "CIN",
			status: "ok",
			salary: 4800,
			p20: 6,
			p50: 9,
			p80: 14,
			ownershipEst: 5,
			stackKey: "NE-CIN",
			confidence: "med",
			confirmed: true,
			usageRate: .22,
			opportunityWeight: .7
		},
		{
			id: "te-njoku",
			name: "D. Njoku",
			pos: "TE",
			team: "CLE",
			opp: "PIT",
			status: "ok",
			salary: 4100,
			p20: 5,
			p50: 9,
			p80: 14,
			ownershipEst: 5,
			stackKey: "CLE-PIT",
			confidence: "med",
			confirmed: true
		},
		{
			id: "wr-cheap",
			name: "G. Wilson",
			pos: "WR",
			team: "NYJ",
			opp: "SF",
			status: "ok",
			salary: 5200,
			p20: 7,
			p50: 11,
			p80: 18,
			ownershipEst: 8,
			stackKey: "SF-NYJ",
			confidence: "med",
			confirmed: true
		},
		{
			id: "rb-pittman",
			name: "J. Taylor",
			pos: "RB",
			team: "IND",
			opp: "HOU",
			status: "ok",
			salary: 6700,
			p20: 10,
			p50: 15,
			p80: 22,
			ownershipEst: 13,
			stackKey: "HOU-IND",
			confidence: "med",
			confirmed: true
		}
	].map(hydratePlayer);
}
function nextSundayEt(hour, minute) {
	const et = new Date((/* @__PURE__ */ new Date()).toLocaleString("en-US", { timeZone: "America/New_York" }));
	const add = (7 - et.getDay()) % 7 || 7;
	const d = new Date(et);
	d.setDate(et.getDate() + add);
	d.setHours(hour, minute, 0, 0);
	return d.toISOString();
}
function earlySundayIso() {
	return nextSundayEt(13, 0);
}
function lateSundayIso() {
	return nextSundayEt(16, 25);
}
function lineupExport(lineup) {
	return lineup.players.map((p) => {
		const captain = lineup.captainId === p.id;
		const tag = captain ? "CPT" : p.pos;
		const salary = captain ? showdownSalary(p.salary, true) : p.salary;
		return `${tag} ${p.name} $${salary}`;
	}).join("\n");
}
function teamLeansFromBoard(rows, briefs, predict) {
	const games = uniqueUpcomingGames(rows);
	const out = [];
	for (const g of games) {
		const fav = researchedFavorite(rows.filter((r) => r.eventId === g.eventId), briefs?.find((b) => b.eventId === g.eventId), {
			home: g.home,
			away: g.away,
			kalshiHome: predict?.find((p) => p.eventId === g.eventId)?.kalshiHome,
			polyHome: predict?.find((p) => p.eventId === g.eventId)?.polyHome
		});
		const homeChance = fav?.homeChance ?? (g.side === "home" ? g.fairProb : 1 - g.fairProb);
		out.push({
			team: g.homeAbbr || g.home,
			also: g.home,
			winChance: homeChance,
			total: g.total,
			sport: g.sport,
			favoriteName: fav?.name ?? (homeChance >= .5 ? g.home : g.away)
		});
		out.push({
			team: g.awayAbbr || g.away,
			also: g.away,
			winChance: 1 - homeChance,
			total: g.total,
			sport: g.sport,
			favoriteName: fav?.name ?? (homeChance >= .5 ? g.home : g.away)
		});
	}
	return out;
}
function leanFor(playerTeam, leans, sport) {
	const t = playerTeam.toLowerCase();
	return leans.find((l) => {
		if (sport && l.sport && l.sport !== sport) return false;
		const a = l.team.toLowerCase();
		const b = (l.also ?? "").toLowerCase();
		return a === t || b === t || b.split(" ").some((p) => p === t) || t.length >= 3 && (a.includes(t) || b.includes(t));
	});
}
/** Same game ensemble as the board: nudge fantasy points with researched win chance and game total. */
function applyGameLean(players, leans, sport) {
	if (!leans.length) return players;
	return players.map((p) => {
		const lean = leanFor(p.team, leans, sport);
		if (!lean || !(lean.winChance > 0)) return p;
		const defense = p.pos === "DST" || p.pos === "DEF" || lean.sport === "NHL" && p.pos === "G";
		let mult = 1;
		if (defense) mult = .82 + .45 * lean.winChance;
		else {
			const lg = leagueTotal(lean.sport);
			const totalMult = lean.total != null && lg > 0 ? Math.min(1.12, Math.max(.9, lean.total / lg)) : 1;
			mult = .88 + .14 * lean.winChance + .1 * (totalMult - 1);
		}
		if ((p.windMph ?? 0) >= 18) {
			if (p.pos === "WR" || p.pos === "TE" || p.pos === "QB") mult *= .92;
			if (p.pos === "RB") mult *= 1.05;
		}
		return hydratePlayer({
			...p,
			p20: p.p20 * (.94 + .08 * lean.winChance),
			p50: p.p50 * mult,
			p80: p.p80 * (mult + .04),
			researchNote: `${lean.favoriteName} lean · ${p.team} win chance ~${Math.round(lean.winChance * 100)} in 100`
		});
	});
}
var initialAnchors = () => {
	const et = etParts();
	return {
		dayAnchorDate: et.etDate,
		dayAnchorBankroll: DEFAULTS.liveBankroll,
		weekAnchorDate: startOfEtWeekMonday(et.etDate),
		weekAnchorBankroll: DEFAULTS.liveBankroll
	};
};
var anchors = initialAnchors();
var useDeskStore = create()(persist((set, get) => ({
	liveBankroll: DEFAULTS.liveBankroll,
	unitPct: DEFAULTS.unitPct,
	weeklyLossCapPct: DEFAULTS.weeklyLossCapPct,
	stakeDollars: DEFAULTS.liveBankroll * DEFAULTS.unitPct,
	weekLossDollars: DEFAULTS.liveBankroll * DEFAULTS.weeklyLossCapPct,
	goalTarget: DEFAULTS.goalTarget,
	paperStartingCash: DEFAULTS.paperStartingCash,
	paperCash: DEFAULTS.paperStartingCash,
	dailyHaltPct: DEFAULTS.dailyHaltPct,
	maxParlayLegs: DEFAULTS.maxParlayLegs,
	dustUsd: DEFAULTS.dustUsd,
	autoExecute: DEFAULTS.autoExecute,
	dfsSite: DEFAULTS.dfsSite,
	learnIndex: 0,
	ignoreRibbon: false,
	entertainmentBudgeted: false,
	selfExcluded: false,
	dayAnchorDate: anchors.dayAnchorDate,
	dayAnchorBankroll: anchors.dayAnchorBankroll,
	weekAnchorDate: anchors.weekAnchorDate,
	weekAnchorBankroll: anchors.weekAnchorBankroll,
	paperTickets: [],
	confirmedTickets: [],
	slate: null,
	contests: [],
	parlayLegs: [],
	sportFilter: "ALL",
	notifyBrowser: false,
	hydrated: false,
	deskMood: "safe",
	hideCollege: false,
	hideLive: false,
	onboarded: false,
	adminEmail: "",
	hiddenPickIds: [],
	pinnedPickId: null,
	markHydrated: () => set({ hydrated: true }),
	setLiveBankroll: (n) => {
		const v = Math.max(0, n);
		const s = get();
		set({
			liveBankroll: v,
			unitPct: v > 0 ? s.stakeDollars / v : s.unitPct
		});
	},
	setStakeDollars: (n) => {
		const v = Math.max(0, Math.round(n * 100) / 100);
		const pile = get().liveBankroll;
		set({
			stakeDollars: v,
			unitPct: pile > 0 ? v / pile : get().unitPct
		});
	},
	setWeekLossDollars: (n) => {
		const v = Math.max(0, Math.round(n * 100) / 100);
		set({
			weekLossDollars: v,
			weeklyLossCapPct: v / (get().weekAnchorBankroll || get().liveBankroll || 1)
		});
	},
	setGoalTarget: (n) => set({ goalTarget: Math.max(0, n) }),
	setUnitPct: (n) => {
		const v = Math.max(.001, Math.min(.1, n));
		const pile = get().liveBankroll;
		set({
			unitPct: v,
			stakeDollars: pile > 0 ? Math.round(pile * v * 100) / 100 : get().stakeDollars
		});
	},
	setLearnIndex: (n) => set({ learnIndex: n }),
	setIgnoreRibbon: (v) => set({ ignoreRibbon: v }),
	setEntertainmentBudgeted: (v) => set({ entertainmentBudgeted: v }),
	setSelfExcluded: (v) => set({ selfExcluded: v }),
	setAutoExecute: (v) => set({ autoExecute: v }),
	setNotifyBrowser: (v) => set({ notifyBrowser: v }),
	setDeskMood: (m) => set({ deskMood: m }),
	setHideCollege: (v) => set({ hideCollege: v }),
	setHideLive: (v) => set({ hideLive: v }),
	setOnboarded: (v) => set({ onboarded: v }),
	setAdminEmail: (email) => set({ adminEmail: email.trim().toLowerCase() }),
	hidePick: (id) => {
		if (!id) return;
		const hidden = get().hiddenPickIds;
		if (hidden.includes(id)) return;
		const pinned = get().pinnedPickId === id ? null : get().pinnedPickId;
		set({
			hiddenPickIds: [...hidden, id],
			pinnedPickId: pinned
		});
	},
	unhidePick: (id) => set({ hiddenPickIds: get().hiddenPickIds.filter((x) => x !== id) }),
	clearHiddenPicks: () => set({ hiddenPickIds: [] }),
	pinPick: (id) => {
		if (!id) {
			set({ pinnedPickId: null });
			return;
		}
		set({
			pinnedPickId: get().pinnedPickId === id ? null : id,
			hiddenPickIds: get().hiddenPickIds.filter((x) => x !== id)
		});
	},
	resetPaper: () => set({
		paperCash: get().paperStartingCash,
		paperTickets: []
	}),
	rollAnchorsIfNeeded: () => {
		const et = etParts();
		const week = startOfEtWeekMonday(et.etDate);
		const patch = {};
		if (get().dayAnchorDate !== et.etDate) {
			patch.dayAnchorDate = et.etDate;
			patch.dayAnchorBankroll = get().liveBankroll;
		}
		if (get().weekAnchorDate !== week) {
			patch.weekAnchorDate = week;
			patch.weekAnchorBankroll = get().liveBankroll;
		}
		if (Object.keys(patch).length) set(patch);
	},
	placePaperTicket: (t) => {
		const s = get();
		if (!s.confirmedTickets.some((x) => x.confirmed)) return {
			ok: false,
			error: "Upload a Hard Rock or DraftKings screenshot first. We need the live number before we lock it in."
		};
		const stake = t.stake;
		if (s.liveBankroll < stake) return {
			ok: false,
			error: "This bet is bigger than the money on Start. Lower This bet, or add to the pile."
		};
		const check = canPlacePaper({
			stake,
			paperCash: s.paperCash,
			halted: false,
			dustUsd: s.dustUsd
		});
		if (!check.ok) return check;
		const ticket = {
			...t,
			id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			venue: "paper",
			status: t.status ?? "open"
		};
		set({
			paperTickets: [ticket, ...s.paperTickets],
			paperCash: s.paperCash - stake,
			liveBankroll: Math.max(0, Math.round((s.liveBankroll - stake) * 100) / 100)
		});
		return {
			ok: true,
			ticket
		};
	},
	gradeTicket: (id, result, closePrice) => {
		const s = get();
		const ticket = s.paperTickets.find((x) => x.id === id);
		if (!ticket || ticket.status !== "open") return;
		let pnl = 0;
		if (result === "void") pnl = ticket.stake;
		else if (result === "loss") pnl = 0;
		else if (result === "win") {
			const dec = ticket.price != null ? ticket.price >= 0 ? ticket.price / 100 + 1 : 100 / Math.abs(ticket.price) + 1 : 2;
			pnl = ticket.stake * dec;
		}
		const clv = closePrice != null && ticket.postedPrice != null ? closePrice - ticket.postedPrice : void 0;
		set({
			paperTickets: s.paperTickets.map((x) => x.id === id ? {
				...x,
				status: result,
				closePrice,
				clv,
				pnl: result === "loss" ? -ticket.stake : pnl - ticket.stake
			} : x),
			paperCash: s.paperCash + pnl,
			liveBankroll: Math.max(0, Math.round((s.liveBankroll + pnl) * 100) / 100)
		});
	},
	dismissTicket: (id) => set({ paperTickets: get().paperTickets.map((x) => x.id === id ? {
		...x,
		status: "dismissed"
	} : x) }),
	confirmParsed: (ticket) => set({ confirmedTickets: [{
		...ticket,
		confirmed: true
	}, ...get().confirmedTickets.filter((t) => t.selection !== ticket.selection)] }),
	removeConfirmed: (selection) => set({ confirmedTickets: get().confirmedTickets.filter((t) => t.selection !== selection) }),
	setSlate: (slate) => set({ slate }),
	setContests: (contests) => set({ contests }),
	addParlayLeg: (leg) => {
		set({ parlayLegs: [leg, ...get().parlayLegs.filter((x) => x.key !== leg.key)].slice(0, 8) });
	},
	removeParlayLeg: (key) => set({ parlayLegs: get().parlayLegs.filter((x) => x.key !== key) }),
	clearParlay: () => set({ parlayLegs: [] }),
	setParlayLegs: (parlayLegs) => set({ parlayLegs: parlayLegs.slice(0, 8) }),
	setSportFilter: (sport) => set({ sportFilter: sport || "ALL" }),
	confirmSlateFromTable: (table, sport) => {
		const players = parseSlateTable(table, sport).map((p) => ({
			...p,
			confirmed: true
		}));
		if (!players.length) return 0;
		const salaryShifts = detectSalaryShifts(get().slate?.players ?? [], players);
		set({ slate: optimizeSlate({
			site: "draftkings_classic",
			sport,
			slateDate: etParts().etDate,
			cap: DK_CAP,
			players,
			source: "screenshot",
			confirmed: true,
			salaryShifts
		}) });
		return players.length;
	},
	loadSampleSlate: () => {
		const players = sampleNflSlate();
		set({ slate: optimizeSlate({
			site: "draftkings_classic",
			sport: "NFL",
			slateDate: etParts().etDate,
			cap: DK_CAP,
			players,
			source: "sample",
			confirmed: true
		}) });
	}
}), {
	name: BRAND.persist,
	storage: createJSONStorage(() => localStorage),
	skipHydration: true,
	version: 5,
	migrate: (persisted, version) => {
		const p = persisted ?? {};
		if (version < 2) {
			const pile = Number(p.liveBankroll) || DEFAULTS.liveBankroll;
			p.stakeDollars = unitDollars(pile, Number(p.unitPct) || DEFAULTS.unitPct);
			p.weekLossDollars = Math.round(pile * (Number(p.weeklyLossCapPct) || DEFAULTS.weeklyLossCapPct) * 100) / 100;
		}
		if (version < 3) {
			if (p.deskMood == null) p.deskMood = "safe";
			if (p.hideCollege == null) p.hideCollege = false;
			if (p.hideLive == null) p.hideLive = false;
			if (p.onboarded == null) p.onboarded = false;
		}
		if (version < 5) {
			if (typeof p.adminEmail !== "string") p.adminEmail = "";
			if (!Array.isArray(p.hiddenPickIds)) p.hiddenPickIds = [];
			if (p.pinnedPickId === void 0) p.pinnedPickId = null;
		}
		return p;
	},
	partialize: (s) => ({
		liveBankroll: s.liveBankroll,
		unitPct: s.unitPct,
		weeklyLossCapPct: s.weeklyLossCapPct,
		stakeDollars: s.stakeDollars,
		weekLossDollars: s.weekLossDollars,
		goalTarget: s.goalTarget,
		paperStartingCash: s.paperStartingCash,
		paperCash: s.paperCash,
		dailyHaltPct: s.dailyHaltPct,
		maxParlayLegs: s.maxParlayLegs,
		dustUsd: s.dustUsd,
		autoExecute: s.autoExecute,
		dfsSite: s.dfsSite,
		learnIndex: s.learnIndex,
		ignoreRibbon: s.ignoreRibbon,
		entertainmentBudgeted: s.entertainmentBudgeted,
		selfExcluded: s.selfExcluded,
		dayAnchorDate: s.dayAnchorDate,
		dayAnchorBankroll: s.dayAnchorBankroll,
		weekAnchorDate: s.weekAnchorDate,
		weekAnchorBankroll: s.weekAnchorBankroll,
		paperTickets: s.paperTickets,
		confirmedTickets: s.confirmedTickets,
		slate: s.slate,
		contests: s.contests,
		parlayLegs: s.parlayLegs,
		sportFilter: s.sportFilter,
		notifyBrowser: s.notifyBrowser,
		deskMood: s.deskMood,
		hideCollege: s.hideCollege,
		hideLive: s.hideLive,
		onboarded: s.onboarded,
		adminEmail: s.adminEmail,
		hiddenPickIds: s.hiddenPickIds,
		pinnedPickId: s.pinnedPickId
	})
}));
function selectDailyHalt(_s) {
	return false;
}
function selectWeeklyHalt(_s) {
	return false;
}
function selectUnit(s) {
	if (Number.isFinite(s.stakeDollars) && s.stakeDollars > 0) return s.stakeDollars;
	return unitDollars(s.liveBankroll, s.unitPct);
}
function selectTicketPulse(s) {
	const open = s.paperTickets.filter((t) => t.status === "open");
	const won = s.paperTickets.filter((t) => t.status === "win");
	const lost = s.paperTickets.filter((t) => t.status === "loss");
	const net = s.paperTickets.reduce((n, t) => n + (t.pnl ?? 0), 0);
	const atRisk = open.reduce((n, t) => n + t.stake, 0);
	return {
		openCount: open.length,
		wonCount: won.length,
		lostCount: lost.length,
		net,
		atRisk,
		open
	};
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/logos-nmTBySFz.js
/** ESPN public team marks — same art Hard Rock shows next to the matchup. */
var LEAGUE_LOGO = {
	NFL: "nfl",
	NBA: "nba",
	MLB: "mlb",
	NHL: "nhl",
	NCAAF: "ncaa",
	NCAAB: "ncaa"
};
function espnLogoUrl(sport, abbr, espnTeamId) {
	const league = LEAGUE_LOGO[sport];
	if (!league) return null;
	if ((sport === "NCAAF" || sport === "NCAAB") && espnTeamId) {
		const id = espnTeamId.replace(/[^0-9]/g, "");
		if (id) return `https://a.espncdn.com/i/teamlogos/ncaa/500/${id}.png`;
	}
	if (!abbr) return null;
	const a = abbr.toLowerCase().replace(/[^a-z0-9]/g, "");
	if (!a) return null;
	return `https://a.espncdn.com/i/teamlogos/${league}/500/${a}.png`;
}
function teamNick(full, abbr, short) {
	const s = (short || "").trim();
	if (s && s.length <= 18 && !/\bat\b/i.test(s)) return s;
	if (abbr && abbr.length <= 4) {
		const parts = full.trim().split(/\s+/);
		if (parts.length >= 2) return parts.slice(-1)[0] ?? full;
	}
	const parts = full.trim().split(/\s+/);
	if (parts.length >= 2) return parts.slice(-1)[0] ?? full;
	return full;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/sheet-Bdm35_69.js
/**
* Hard Rock-shaped market sheet.
*
* Builds every popular line a Florida book posts on a game — alternate
* spreads/totals, team totals, period markets, and player props — then prices
* each cell with the same ensemble used on the moneyline. Numbers are a
* research look until a Hard Rock screenshot locks the live price.
*/
function marketsOnTab(tabs, tab) {
	switch (tab) {
		case "popular": return tabs.popular;
		case "props": return tabs.props;
		case "innings": return tabs.innings;
		case "half": return tabs.half;
		case "quarters": return tabs.quarters;
		case "halves": return tabs.halves;
		case "periods": return tabs.periods;
		default: return [];
	}
}
function cellsInMarket(market) {
	const out = [];
	const push = (cell) => {
		if (cell && Number.isFinite(cell.fairProb)) out.push(cell);
	};
	for (const line of market.lines) {
		push(line.left);
		push(line.right);
		push(line.single);
		if (line.alts) for (const alt of line.alts) {
			push(alt.left);
			push(alt.right);
		}
	}
	return out;
}
function clip(n, lo, hi) {
	return Math.min(hi, Math.max(lo, n));
}
function halfLine(mu) {
	return Math.floor(mu) + .5;
}
function juicePrice(fair, hold = .048) {
	const decJuice = 1 + (1 / clip(fair, .02, .98) - 1) * (1 - hold);
	return decimalToAmerican(Math.max(1.012, decJuice));
}
/**
* Counting-stat over: Poisson for rare events, extra-Poisson normal once the
* mean is large (yards, points). Same logit clip family as the game ensemble.
*/
function countOver(lambda, line) {
	const lam = Math.max(.02, lambda);
	if (lam >= 8) {
		const sigma = Math.max(.9, Math.sqrt(lam) * 1.18);
		return invLogit(logit(1 - normalCdf((line - lam) / sigma)), .06, .94);
	}
	return poissonOver(lam, line);
}
function altLines(line, step) {
	const out = [];
	for (const d of [
		-2,
		-1,
		1,
		2
	]) {
		const v = Math.round((line + d * step) * 2) / 2;
		if (v >= .5 && Math.abs(v - line) > .04) out.push(v);
	}
	return out;
}
function makeRow(ctx, patch) {
	const t = ctx.template;
	const fair = clip(patch.fairProb, .02, .98);
	return {
		eventId: t.eventId,
		sport: t.sport,
		start: t.start,
		home: t.home,
		away: t.away,
		marketType: patch.marketType,
		side: patch.side,
		selection: patch.selection,
		price: juicePrice(fair, patch.isProp ? .07 : .048),
		fairProb: fair,
		evPct: NaN,
		hold: patch.isProp ? .07 : .048,
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
		venueNote: t.venueNote
	};
}
function listedOut(name, injuries) {
	const hit = injuries.find((i) => namesHit(i.player, name));
	if (!hit) return false;
	return /out|injured reserve|\bil\b|10-day|15-day|60-day|inactive|doubtful/i.test(hit.status);
}
function pos(p) {
	return (p.position || "").toUpperCase();
}
function isPitcher(p) {
	return /^(P|SP|RP|LHP|RHP|TWP|G|GK)$/.test(pos(p)) || /pitcher|goalie/i.test(p.position);
}
function isBatter(p) {
	if (isPitcher(p)) return false;
	return /^(C|1B|2B|3B|SS|LF|CF|RF|OF|DH|IF|UT)$/.test(pos(p)) || !p.position || /base|field|hit|catch/i.test(p.position);
}
function isQB(p) {
	return pos(p) === "QB";
}
function isRB(p) {
	return /^(RB|HB|FB)$/.test(pos(p));
}
function isPassCatcher(p) {
	return /^(WR|TE|RB)$/.test(pos(p));
}
function isSkater(p) {
	return /^(C|LW|RW|D|F)$/.test(pos(p)) || /wing|center|defence|defense|forward/i.test(p.position);
}
var PARK_HITS = {
	"coors field": 1.15,
	"great american ball park": 1.08,
	"great american ballpark": 1.08,
	"yankee stadium": 1.05,
	"fenway park": 1.04,
	"citizens bank park": 1.04,
	"globe life field": 1.03,
	"wrigley field": 1.02,
	"truist park": 1.02,
	"petco park": .91,
	"oracle park": .9,
	"t-mobile park": .91,
	"dodger stadium": .96,
	"comerica park": .95,
	"loandepot park": .96,
	"kauffman stadium": .96
};
var PARK_HR = {
	"coors field": 1.22,
	"great american ball park": 1.14,
	"great american ballpark": 1.14,
	"yankee stadium": 1.12,
	"citizens bank park": 1.08,
	"fenway park": .98,
	"petco park": .86,
	"oracle park": .82,
	"t-mobile park": .88,
	"dodger stadium": .94,
	"comerica park": .9,
	"kauffman stadium": .88
};
function parkLookup(venue, table, fallback = 1) {
	if (!venue) return fallback;
	const key = venue.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
	for (const [name, f] of Object.entries(table)) if (key.includes(name)) return f;
	return fallback;
}
function parkHits(venue) {
	return parkLookup(venue, PARK_HITS, 1);
}
function parkHr(venue) {
	return parkLookup(venue, PARK_HR, parkHits(venue));
}
function weatherMul(ctx, kind) {
	if (ctx.sport === "NBA" || ctx.sport === "NHL" || ctx.sport === "NCAAB") return 1;
	const wind = ctx.weatherWind ?? 0;
	const rain = ctx.weatherPrecip ?? 0;
	const temp = ctx.weatherTemp;
	let m = 1;
	if (ctx.sport === "MLB") {
		if (kind === "hr") {
			if (wind >= 15) m *= .94;
			if (temp != null && temp >= 85) m *= 1.05;
			if (temp != null && temp <= 50) m *= .96;
		} else if (kind === "ks") {
			if (wind >= 18) m *= 1.03;
			if (rain >= 40) m *= .97;
		} else {
			if (wind >= 18) m *= .97;
			if (rain >= 40) m *= .95;
			if (temp != null && temp >= 85) m *= 1.03;
			if (temp != null && temp <= 50) m *= .97;
		}
		return m;
	}
	if (wind >= 18) m *= kind === "total" ? .96 : .97;
	if (rain >= 50) m *= .94;
	if (temp != null && temp <= 32) m *= .97;
	return m;
}
function pace(ctx) {
	const avg = leagueTotal(ctx.sport);
	return avg > 0 ? ctx.total / avg : 1;
}
function teamWin(ctx, homeAway) {
	return homeAway === "home" ? ctx.homeWin : 1 - ctx.homeWin;
}
function rankBy(list, n, score) {
	return [...list].sort((a, b) => score(b) - score(a)).slice(0, n);
}
function scorePlayer(p) {
	const posn = pos(p);
	const everyday = /^(C|1B|2B|3B|SS|LF|CF|RF|DH|QB|RB|WR|TE|LW|RW)$/.test(posn) ? 6 : /^(IF|OF|UT|F|D)$/.test(posn) ? 3 : 0;
	return (p.starter ? 10 : 0) + everyday + (p.stats.avg ?? 0) * 24 + (p.stats.hr ?? 0) / 8 + (p.stats.pts ?? 0) / 5 + (p.stats.passYds ?? p.stats.yds ?? 0) / 40 + (p.stats.sog ?? 0) + (Object.keys(p.stats).length ? 2 : 0);
}
function perGame(n, games, cap, fallback) {
	if (n == null || !Number.isFinite(n) || n <= 0) return fallback;
	return n > cap ? n / games : n;
}
function paFor(p) {
	return p.starter || /^(C|1B|2B|3B|SS|LF|CF|RF|DH)$/.test(pos(p)) ? 4.15 : 3.4;
}
function vsPitchMul(p, ctx) {
	const era = p.homeAway === "away" ? ctx.homeEra : ctx.awayEra;
	const eraMul = era != null ? clip(era / 4.1, .82, 1.18) : 1;
	const oppHand = p.homeAway === "away" ? ctx.homePitcherHand : ctx.awayPitcherHand;
	const ownLooks = p.homeAway === "away" ? ctx.awayLooks : ctx.homeLooks;
	const bag = oppHand === "L" ? ownLooks?.vsLeft : oppHand === "R" ? ownLooks?.vsRight : void 0;
	return clip(eraMul * (bag?.ops != null ? clip(bag.ops / .72, .86, 1.16) : 1), .78, 1.22);
}
function mix(base, recent) {
	return blendRate(base, recent) ?? base;
}
function expectedMlbHits(p, ctx) {
	const fromHits = p.stats.hits != null && p.stats.hits > 8 && p.stats.hits < 260 ? p.stats.hits / 145 : null;
	const avg = p.stats.avg ?? (p.stats.obp != null ? clip(p.stats.obp - .07, .18, .36) : p.starter ? .27 : .235);
	return mix(fromHits ?? avg * paFor(p), p.recentStats?.hits) * pace(ctx) * parkHits(ctx.venue) * vsPitchMul(p, ctx) * weatherMul(ctx, "hits");
}
function expectedMlbHr(p, ctx) {
	const avg = p.stats.avg ?? (p.starter ? .27 : .235);
	const slg = p.stats.slg ?? avg + .12;
	const iso = Math.max(.03, slg - avg);
	const fromSeason = p.stats.hr != null && p.stats.hr > 0 && p.stats.hr < 80 ? p.stats.hr / 145 : null;
	const blended = mix(fromSeason ?? iso * .72, p.recentStats?.hr);
	const bump = /DH|1B|OF|LF|RF|3B/.test(pos(p)) ? 1.06 : .9;
	const known = fromSeason != null || p.recentStats?.hr != null ? 1 : .72;
	return clip(blended * bump * known * pace(ctx) * parkHr(ctx.venue) * vsPitchMul(p, ctx) * weatherMul(ctx, "hr"), .03, .55);
}
function expectedMlbTb(p, ctx) {
	return mix((p.stats.slg ?? (p.stats.avg ?? .25) + .14) * paFor(p), p.recentStats?.tb) * pace(ctx) * parkHits(ctx.venue) * vsPitchMul(p, ctx) * weatherMul(ctx, "hits");
}
function expectedMlbRuns(p, ctx) {
	const obp = p.stats.obp ?? (p.stats.avg ?? .25) + .05;
	const win = teamWin(ctx, p.homeAway);
	return mix(clip(obp * paFor(p) * .28 * (.85 + .3 * win) * pace(ctx) * parkHits(ctx.venue), .15, 1.4), p.recentStats?.runs);
}
function expectedMlbRbi(p, ctx) {
	return mix(clip((p.stats.rbi != null && p.stats.rbi > 0 && p.stats.rbi < 160 ? p.stats.rbi / 140 : expectedMlbHits(p, ctx) * .65) * (p.starter ? 1.08 : .9) * pace(ctx) * parkHits(ctx.venue) * vsPitchMul(p, ctx), .12, 1.6), p.recentStats?.rbi);
}
function expectedMlbHrr(p, ctx) {
	return expectedMlbHits(p, ctx) + expectedMlbRuns(p, ctx) + expectedMlbRbi(p, ctx);
}
function expectedMlbWalks(p, ctx) {
	return mix(clip(((p.stats.obp ?? (p.stats.avg ?? .25) + .05) - (p.stats.avg ?? .25)) * paFor(p) * pace(ctx), .12, 1.2), p.recentStats?.bb);
}
function expectedPitcherK(p, ctx) {
	const ip = p.stats.ip ?? 90;
	const k = p.stats.k;
	let k9 = 8.8;
	if (ip > 5 && k != null && k > 0) {
		const raw = k / ip * 9;
		if (raw > 3 && raw < 16) k9 = raw;
		else if (k > 3 && k < 16) k9 = k;
	}
	const expIp = clip(5.8 - ((p.stats.era ?? 4.1) - 4) * .28, 4, 6.6);
	return clip(mix(k9 * expIp / 9, p.recentStats?.k) * weatherMul(ctx, "ks"), 2.5, 11);
}
function expectedNflPassYds(p, ctx) {
	const base = perGame(p.stats.passYds ?? p.stats.yds, 17, 450, p.starter ? 245 : 180);
	const win = teamWin(ctx, p.homeAway);
	const script = win < .45 ? 1.06 : win > .65 ? .96 : 1;
	return mix(base, p.recentStats?.passYds) * (.55 + .45 * pace(ctx)) * script * weatherMul(ctx, "total");
}
function expectedNflRushYds(p, ctx) {
	const base = perGame(p.stats.rushYds, 17, 180, isRB(p) && p.starter ? 72 : 28);
	const win = teamWin(ctx, p.homeAway);
	const script = win > .58 ? 1.08 : win < .42 ? .9 : 1;
	return mix(base, p.recentStats?.rushYds) * (.6 + .4 * pace(ctx)) * script * weatherMul(ctx, "total");
}
function expectedNflRecYds(p, ctx) {
	const base = perGame(p.stats.recYds, 17, 180, pos(p) === "WR" ? 62 : pos(p) === "TE" ? 42 : 22);
	const script = teamWin(ctx, p.homeAway) < .45 ? 1.05 : 1;
	return mix(base, p.recentStats?.recYds) * (.55 + .45 * pace(ctx)) * script * weatherMul(ctx, "total");
}
function expectedAtd(p, ctx) {
	const win = teamWin(ctx, p.homeAway);
	if (isRB(p)) return clip(.42 * (.7 + .6 * win) * pace(ctx), .12, .72);
	if (pos(p) === "WR") return clip(.3 * (.75 + .5 * win) * pace(ctx), .1, .58);
	if (pos(p) === "TE") return clip(.22 * (.75 + .5 * win) * pace(ctx), .08, .48);
	if (isQB(p)) return clip(.18 * win * pace(ctx), .06, .4);
	return .16;
}
function expectedNba(p, ctx, stat) {
	const pts = mix(perGame(p.stats.pts, 82, 55, p.starter ? 18 : 9), p.recentStats?.pts);
	const reb = mix(perGame(p.stats.reb, 82, 22, p.starter ? 5.5 : 3), p.recentStats?.reb);
	const ast = mix(perGame(p.stats.ast, 82, 18, p.starter ? 3.8 : 1.6), p.recentStats?.ast);
	if (stat === "pts") return pts * pace(ctx);
	if (stat === "reb") return reb;
	if (stat === "ast") return ast;
	if (stat === "threes") return mix(p.stats.threes ?? clip(pts / 12, .6, 4.2), p.recentStats?.threes) * pace(ctx);
	return (pts + reb + ast) * pace(ctx);
}
function expectedNhlShots(p) {
	return mix(perGame(p.stats.sog, 82, 10, p.starter ? 2.9 : 1.6), p.recentStats?.sog);
}
function expectedNhlGoals(p, ctx) {
	return perGame(p.stats.goals, 82, 1.4, p.starter ? .38 : .16) * (.7 + .6 * teamWin(ctx, p.homeAway)) * pace(ctx);
}
function expectedSaves(p, ctx) {
	return perGame(p.stats.saves, 82, 50, 27.5) * (2 - pace(ctx));
}
function ouMarket(ctx, title, id, players, lineFor, expected, label, preview, step = 1, rare = false) {
	const lines = [];
	for (const p of players) {
		if (listedOut(p.name, ctx.injuries)) continue;
		const line = lineFor(p);
		const lam = expected(p);
		const over = rare ? clip(1 - Math.exp(-lam), .06, .88) : countOver(lam, line);
		const left = makeRow(ctx, {
			marketType: "prop",
			side: "over",
			selection: label(p, line, "over"),
			fairProb: over,
			point: line,
			player: p.name,
			playerId: p.id,
			headshot: p.headshot,
			isProp: true
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
			isProp: true
		});
		const alts = rare ? [] : altLines(line, step).map((altLine) => {
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
					isProp: true
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
					isProp: true
				})
			};
		});
		lines.push({
			label: p.name,
			player: p,
			left,
			right,
			alts: alts.length ? alts : void 0
		});
	}
	return {
		id,
		title,
		kind: "player-ou",
		leftHeader: "Over",
		rightHeader: "Under",
		preview,
		lines
	};
}
function yesMarket(ctx, title, id, players, expected, label, point, preview) {
	const lines = [];
	for (const p of players) {
		if (listedOut(p.name, ctx.injuries)) continue;
		const hit = clip(1 - Math.exp(-expected(p)), .06, .78);
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
				isProp: true
			})
		});
	}
	return {
		id,
		title,
		kind: "player-yes",
		leftHeader: "Over",
		preview,
		lines
	};
}
function scoredMean(ctx, mean) {
	if (ctx.formTotal != null && ctx.formTotal > 0 && mean > 0) return mean * .72 + ctx.formTotal * .28;
	return mean;
}
function sortAroundMain(lines, main, get, higherFirst = false) {
	const tagged = lines.map((l) => ({
		l,
		p: get(l)
	}));
	const center = tagged.filter((x) => Math.abs(x.p - main) < .04);
	const lower = tagged.filter((x) => x.p < main - .04).sort((a, b) => b.p - a.p);
	const higher = tagged.filter((x) => x.p > main + .04).sort((a, b) => a.p - b.p);
	const rest = higherFirst ? [...higher, ...lower] : [...lower, ...higher];
	return [...center, ...rest].map((x) => x.l);
}
function totalLadder(ctx, title, id, mean, steps, sport = ctx.sport, pickLabel) {
	const mu = scoredMean(ctx, mean);
	return {
		id,
		title,
		kind: "total-ladder",
		leftHeader: "Over",
		rightHeader: "Under",
		preview: 5,
		lines: sortAroundMain(steps.filter((line) => line >= .5).map((line) => {
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
					point: line
				}),
				right: makeRow(ctx, {
					marketType: "total",
					side: "under",
					selection: underSel,
					fairProb: 1 - over,
					point: line
				})
			};
		}), halfLine(mu), (l) => l.left?.point ?? Number(l.label))
	};
}
function teamTotalLadder(ctx, title, id, homeAway) {
	const share = clip(.5 + (teamWin(ctx, homeAway) - .5) * .28, .38, .62);
	const mean = ctx.total * share;
	const center = halfLine(mean);
	const steps = [];
	for (let i = -3; i <= 3; i++) {
		const v = center + i;
		if (v >= .5) steps.push(v);
	}
	const m = totalLadder(ctx, title, id, mean, steps);
	const nick = homeAway === "home" ? ctx.homeNick : ctx.awayNick;
	for (const line of m.lines) {
		if (line.left) line.left.selection = `${nick} over ${line.label}`;
		if (line.right) line.right.selection = `${nick} under ${line.label}`;
	}
	return m;
}
function spreadGrid(ctx) {
	const main = ctx.homeSpread;
	const step = ctx.sport === "NBA" || ctx.sport === "NCAAB" ? 1 : 1;
	const offsets = [];
	for (let i = -4; i <= 4; i++) {
		const homeLine = Math.round((main + i * step) * 2) / 2;
		if (ctx.sport === "MLB" && Math.abs(homeLine) < .6) continue;
		if (!offsets.includes(homeLine)) offsets.push(homeLine);
	}
	const mu = -main;
	const lines = offsets.map((homeLine) => {
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
				point: awayLine
			}),
			right: makeRow(ctx, {
				marketType: "spread",
				side: "home",
				selection: homeSel,
				fairProb: homeP,
				point: homeLine
			})
		};
	});
	return {
		id: "spread",
		title: ctx.sport === "NHL" ? "Puck line" : "Spread",
		kind: "spread-grid",
		leftHeader: ctx.awayNick,
		rightHeader: ctx.homeNick,
		preview: 5,
		lines: sortAroundMain(lines, -main, (l) => l.left?.point ?? 0, true)
	};
}
function moneyline(ctx, mlHome, mlAway) {
	const homeP = ctx.homeWin;
	const away = mlAway ?? makeRow(ctx, {
		marketType: "ml",
		side: "away",
		selection: `${ctx.awayNick} to win`,
		fairProb: 1 - homeP
	});
	const home = mlHome ?? makeRow(ctx, {
		marketType: "ml",
		side: "home",
		selection: `${ctx.homeNick} to win`,
		fairProb: homeP
	});
	return {
		id: "ml",
		title: "To Win",
		kind: "ml",
		preview: 2,
		lines: [{
			label: ctx.homeNick,
			single: {
				...home,
				selection: home.selection
			}
		}, {
			label: ctx.awayNick,
			single: {
				...away,
				selection: away.selection
			}
		}]
	};
}
function periodWinner(ctx, title, id, shrink) {
	const p = .5 + (ctx.homeWin - .5) * shrink;
	return {
		id,
		title,
		kind: "ml",
		preview: 2,
		lines: [{
			label: ctx.homeNick,
			single: makeRow(ctx, {
				marketType: "ml",
				side: "home",
				selection: `${ctx.homeNick} to win the ${title.toLowerCase().replace(/\s+winner$/, "")}`,
				fairProb: p
			})
		}, {
			label: ctx.awayNick,
			single: makeRow(ctx, {
				marketType: "ml",
				side: "away",
				selection: `${ctx.awayNick} to win the ${title.toLowerCase().replace(/\s+winner$/, "")}`,
				fairProb: 1 - p
			})
		}]
	};
}
function postedMatches(cell, hit) {
	if (hit.marketType !== cell.marketType || hit.side !== cell.side) return false;
	if (cell.player || hit.player) {
		if (!cell.player || !hit.player) return false;
		if (!namesHit(cell.player, hit.player) && !namesHit(hit.player, cell.player)) return false;
	}
	if (cell.point != null && hit.point != null) return Math.abs(cell.point - hit.point) < .05;
	if (cell.point != null && hit.point == null) return false;
	if (cell.point == null && hit.point != null) return false;
	return true;
}
function overlayPosted(market, posted) {
	if (!posted.length) return;
	const stamp = (cell) => {
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
			reason: "Delayed ESPN number. Photograph Hard Rock to lock the live fill."
		};
	};
	for (const line of market.lines) {
		line.left = stamp(line.left);
		line.right = stamp(line.right);
		line.single = stamp(line.single);
		if (line.alts) for (const alt of line.alts) {
			alt.left = stamp(alt.left);
			alt.right = stamp(alt.right);
		}
	}
}
function finish(tabs, posted) {
	const seen = /* @__PURE__ */ new Set();
	for (const list of [
		tabs.popular,
		tabs.props,
		tabs.innings,
		tabs.half,
		tabs.quarters,
		tabs.halves,
		tabs.periods
	]) for (const m of list) {
		if (seen.has(m)) continue;
		seen.add(m);
		overlayPosted(m, posted);
	}
	return tabs;
}
function seedTemplate(opts) {
	const fair = clip(opts.homeWin ?? .5, .2, .8);
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
		hold: .048,
		tag: "close_enough",
		action: "enter_ticket",
		reason: "Research look. Photograph Hard Rock to lock the live number.",
		conviction: "medium",
		spark: "research",
		researchOnly: true,
		homeAbbr: opts.homeAbbr,
		awayAbbr: opts.awayAbbr,
		homeLogo: opts.homeLogo,
		awayLogo: opts.awayLogo
	};
}
function buildSheet(opts) {
	const empty = {
		popular: [],
		props: [],
		innings: [],
		half: [],
		quarters: [],
		halves: [],
		periods: []
	};
	const rows = opts.rows;
	const template = rows[0] ?? seedTemplate({
		sport: opts.sport,
		start: opts.research?.start ?? "",
		home: opts.home,
		away: opts.away,
		homeWin: opts.homeWin
	});
	if (!template) return empty;
	const mlHome = rows.find((r) => r.marketType === "ml" && r.side === "home");
	const tot = rows.find((r) => r.marketType === "total");
	const spHome = rows.find((r) => r.marketType === "spread" && r.side === "home");
	const total = tot?.point ?? tot?.total ?? opts.research?.total ?? leagueTotal(opts.sport);
	const homeSpread = spHome?.point ?? opts.research?.homeSpread ?? (opts.homeWin > .5 ? -spreadFromWin(opts.homeWin, opts.sport) : spreadFromWin(1 - opts.homeWin, opts.sport));
	const ctx = {
		sport: opts.sport,
		home: opts.home,
		away: opts.away,
		homeNick: opts.homeNick,
		awayNick: opts.awayNick,
		homeWin: clip(opts.homeWin, .2, .8),
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
		awayPitcherHand: opts.research?.awayPitcherHand
	};
	const ml = moneyline(ctx, mlHome, rows.find((r) => r.marketType === "ml" && r.side === "away"));
	const totals = totalLadder(ctx, opts.sport === "MLB" ? "Total Runs" : opts.sport === "NHL" ? "Total Goals" : "Total Points", "total", total, totalSteps(opts.sport, total));
	const spread = spreadGrid(ctx);
	if (isCollegeSport(opts.sport)) {
		const q = periodBundle(ctx, "quarter", .28, .22);
		const h = periodBundle(ctx, "half", .55, .48);
		return finish({
			popular: [
				ml,
				totals,
				spread
			],
			props: [],
			innings: [],
			half: [],
			quarters: q.winners.concat(q.totals),
			halves: h.winners.concat(h.totals),
			periods: []
		}, rows);
	}
	if (opts.sport === "MLB") {
		const pool = ctx.players.filter(isBatter);
		const batters = (score) => rankBy(pool, 14, (p) => score(p) + (p.starter ? .1 : 0) + (p.stats.hr != null ? .4 : 0) + (p.stats.avg != null || p.stats.hits != null ? .5 : 0) + (p.stats.rbi != null ? .15 : 0) + (Object.keys(p.stats).length ? .05 : 0));
		const byHits = batters((p) => expectedMlbHits(p, ctx));
		const byHr = batters((p) => expectedMlbHr(p, ctx) + (p.stats.hr ?? 0) / 90);
		const byHrr = batters((p) => expectedMlbHrr(p, ctx));
		const starters = rankBy(ctx.players.filter((p) => p.starter && isPitcher(p)), 2, (p) => expectedPitcherK(p, ctx));
		const sps = starters.length ? starters : rankBy(ctx.players.filter(isPitcher), 2, (p) => expectedPitcherK(p, ctx) + scorePlayer(p));
		const hr = yesMarket(ctx, "Batter Home Runs", "hr", byHr, (p) => expectedMlbHr(p, ctx), (p) => `${p.name} to hit a home run`, .5, 5);
		const hits = ouMarket(ctx, "Hits", "hits", byHits, () => .5, (p) => expectedMlbHits(p, ctx), (p, line, s) => `${p.name} ${s} ${line} hits`, 5, 1);
		const ks = ouMarket(ctx, "Strikeouts", "ks", sps, (p) => halfLine(expectedPitcherK(p, ctx)), (p) => expectedPitcherK(p, ctx), (p, line, s) => `${p.name} ${s} ${line} strikeouts`, 5, 1);
		const first = totalLadder(ctx, "1st Inning Total Runs", "1st-inn", total * .118, [.5, 1.5], "MLB", "1st inning");
		const second = totalLadder(ctx, "2nd Inning Total Runs", "2nd-inn", total * .11, [.5, 1.5], "MLB", "2nd inning");
		const third = totalLadder(ctx, "3rd Inning Total Runs", "3rd-inn", total * .11, [.5, 1.5], "MLB", "3rd inning");
		const tb = ouMarket(ctx, "Total Bases", "tb", byHr, () => 1.5, (p) => expectedMlbTb(p, ctx), (p, line, s) => `${p.name} ${s} ${line} total bases`, 5, 1);
		const hrr = ouMarket(ctx, "Hits+Runs+RBIs", "hrr", byHrr, () => 1.5, (p) => expectedMlbHrr(p, ctx), (p, line, s) => `${p.name} ${s} ${line} hits + runs + RBIs`, 5, 1);
		const awayTot = teamTotalLadder(ctx, `${ctx.awayNick} Total Runs`, "away-tot", "away");
		const homeTot = teamTotalLadder(ctx, `${ctx.homeNick} Total Runs`, "home-tot", "home");
		const runs = ouMarket(ctx, "Batter Runs", "runs", batters((p) => expectedMlbRuns(p, ctx)), () => .5, (p) => expectedMlbRuns(p, ctx), (p, line, s) => `${p.name} ${s} ${line} runs`, 5, 1);
		const rbi = ouMarket(ctx, "RBIs", "rbi", batters((p) => expectedMlbRbi(p, ctx)), () => .5, (p) => expectedMlbRbi(p, ctx), (p, line, s) => `${p.name} ${s} ${line} RBIs`, 5, 1);
		const walks = ouMarket(ctx, "Walks", "bb", batters((p) => expectedMlbWalks(p, ctx)), () => .5, (p) => expectedMlbWalks(p, ctx), (p, line, s) => `${p.name} ${s} ${line} walks`, 5, 1);
		const sb = yesMarket(ctx, "Stolen Bases", "sb", rankBy(pool, 6, (p) => (p.stats.sb ?? 0) + (/SS|CF|2B/.test(pos(p)) ? 1.2 : 0) + (p.starter ? .3 : 0) + (Object.keys(p.stats).length ? .2 : 0)), (p) => clip(p.stats.sb != null && p.stats.sb > 0 && p.stats.sb < 90 ? p.stats.sb / 145 : /SS|CF|2B/.test(pos(p)) ? .22 : .1, .04, .55), (p) => `${p.name} to steal a base`, .5, 5);
		const innWin = periodWinner(ctx, "1st Inning Winner", "1st-win", .32);
		const f5w = periodWinner(ctx, "1st 5 Innings Winner", "f5-win", .72);
		const f5t = totalLadder(ctx, "1st 5 Innings Total", "f5-tot", total * .56, [
			halfLine(total * .56) - 1,
			halfLine(total * .56),
			halfLine(total * .56) + 1
		], "MLB", "first 5 innings");
		const half1 = totalLadder(ctx, "1st Inning First Half Runs", "half-1", total * .06, [.5], "MLB", "1st inning first half");
		const half2 = totalLadder(ctx, "1st Inning Second Half Runs", "half-2", total * .055, [.5], "MLB", "1st inning second half");
		return finish({
			popular: [
				ml,
				totals,
				spread,
				hr,
				hits,
				ks,
				first,
				tb,
				hrr,
				awayTot,
				homeTot,
				runs,
				rbi
			],
			props: [
				hr,
				hits,
				ks,
				tb,
				hrr,
				runs,
				rbi,
				walks,
				sb
			],
			innings: [
				first,
				second,
				third,
				innWin,
				f5w,
				f5t
			],
			half: [half1, half2],
			quarters: [],
			halves: [],
			periods: []
		}, rows);
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
		const atd = yesMarket(ctx, "Anytime Touchdown", "atd", [...rbs, ...catchers].slice(0, 10), (p) => expectedAtd(p, ctx), (p) => `${p.name} anytime touchdown`, .5, 6);
		const two = yesMarket(ctx, "2+ Touchdowns", "2td", [...rbs, ...catchers].slice(0, 6), (p) => expectedAtd(p, ctx) * .22, (p) => `${p.name} 2+ touchdowns`, 1.5, 5);
		const q = periodBundle(ctx, "quarter", .28, .22);
		const h = periodBundle(ctx, "half", .55, .48);
		return finish({
			popular: [
				ml,
				totals,
				spread,
				pass,
				rush,
				rec,
				atd
			],
			props: [
				pass,
				rush,
				rec,
				recs,
				ptd,
				atd,
				two
			],
			innings: [],
			half: [],
			quarters: q.winners.concat(q.totals),
			halves: h.winners.concat(h.totals),
			periods: []
		}, rows);
	}
	if (opts.sport === "NBA") {
		const bats = rankBy(ctx.players, 10, (p) => expectedNba(p, ctx, "pts") + scorePlayer(p));
		const pts = ouMarket(ctx, "Points", "pts", bats, (p) => halfLine(expectedNba(p, ctx, "pts")), (p) => expectedNba(p, ctx, "pts"), (p, line, s) => `${p.name} ${s} ${line} points`, 5, 2);
		const reb = ouMarket(ctx, "Rebounds", "reb", bats, (p) => halfLine(expectedNba(p, ctx, "reb")), (p) => expectedNba(p, ctx, "reb"), (p, line, s) => `${p.name} ${s} ${line} rebounds`, 5, 1);
		const ast = ouMarket(ctx, "Assists", "ast", bats, (p) => halfLine(expectedNba(p, ctx, "ast")), (p) => expectedNba(p, ctx, "ast"), (p, line, s) => `${p.name} ${s} ${line} assists`, 5, 1);
		const threes = ouMarket(ctx, "Threes", "3s", bats, (p) => halfLine(expectedNba(p, ctx, "threes")), (p) => expectedNba(p, ctx, "threes"), (p, line, s) => `${p.name} ${s} ${line} threes`, 5, 1);
		const pra = ouMarket(ctx, "Pts + Reb + Ast", "pra", bats, (p) => halfLine(expectedNba(p, ctx, "pra")), (p) => expectedNba(p, ctx, "pra"), (p, line, s) => `${p.name} ${s} ${line} pts + reb + ast`, 5, 2);
		const q = periodBundle(ctx, "quarter", .26, .25);
		const h = periodBundle(ctx, "half", .52, .5);
		return finish({
			popular: [
				ml,
				totals,
				spread,
				pts,
				reb,
				ast,
				threes,
				pra
			],
			props: [
				pts,
				reb,
				ast,
				threes,
				pra
			],
			innings: [],
			half: [],
			quarters: q.winners.concat(q.totals),
			halves: h.winners.concat(h.totals),
			periods: []
		}, rows);
	}
	if (opts.sport === "NHL") {
		const skaters = rankBy(ctx.players.filter(isSkater), 10, (p) => expectedNhlShots(p) + scorePlayer(p));
		const goalies = rankBy(ctx.players.filter((p) => /G/.test(pos(p))), 2, (p) => expectedSaves(p, ctx) + scorePlayer(p));
		const sog = ouMarket(ctx, "Shots on Goal", "sog", skaters, (p) => halfLine(expectedNhlShots(p)), expectedNhlShots, (p, line, s) => `${p.name} ${s} ${line} shots on goal`, 5, 1);
		const goals = yesMarket(ctx, "Goals", "goals", skaters, (p) => expectedNhlGoals(p, ctx), (p) => `${p.name} to score a goal`, .5, 6);
		const pts = ouMarket(ctx, "Points", "hp", skaters, () => .5, (p) => expectedNhlGoals(p, ctx) * 1.7, (p, line, s) => `${p.name} ${s} ${line} points`, 5, 1);
		const saves = ouMarket(ctx, "Saves", "sv", goalies, (p) => halfLine(expectedSaves(p, ctx)), (p) => expectedSaves(p, ctx), (p, line, s) => `${p.name} ${s} ${line} saves`, 3, 2);
		const blk = ouMarket(ctx, "Blocked Shots", "blk", skaters.filter((p) => pos(p) === "D"), () => 1.5, () => 1.7, (p, line, s) => `${p.name} ${s} ${line} blocked shots`, 5, 1);
		const per = periodBundle(ctx, "period", .34, .33);
		return finish({
			popular: [
				ml,
				totals,
				spread,
				sog,
				goals,
				saves,
				pts
			],
			props: [
				sog,
				goals,
				saves,
				pts,
				blk
			],
			innings: [],
			half: [],
			quarters: [],
			halves: [],
			periods: per.winners.concat(per.totals)
		}, rows);
	}
	return finish({
		popular: [
			ml,
			totals,
			spread
		],
		props: [],
		innings: [],
		half: [],
		quarters: [],
		halves: [],
		periods: []
	}, rows);
}
function spreadFromWin(p, sport) {
	const gap = (.5 - p) * (sport === "MLB" ? 6 : sport === "NHL" ? 2.4 : 14);
	const stepped = Math.round(Math.abs(gap) * 2) / 2;
	return Math.max(sport === "MLB" ? 1.5 : 1, stepped || 1.5);
}
function totalSteps(sport, total) {
	const step = sport === "NBA" || sport === "NCAAB" ? 2 : 1;
	const center = halfLine(total);
	const n = 4;
	const out = [];
	for (let i = -4; i <= n; i++) {
		const v = center + i * step;
		if (v >= .5) out.push(v);
	}
	return out;
}
function ordinal(i) {
	if (i === 1) return "1st";
	if (i === 2) return "2nd";
	if (i === 3) return "3rd";
	return `${i}th`;
}
function periodBundle(ctx, unit, winShrink, scoreShare) {
	const n = unit === "half" ? 2 : unit === "period" ? 3 : 4;
	const winners = [];
	const totals = [];
	const bump = ctx.sport === "MLB" ? 1 : ctx.sport === "NHL" ? .5 : 3;
	for (let i = 1; i <= n; i++) {
		const label = unit === "half" ? i === 1 ? "1st Half" : "2nd Half" : unit === "period" ? `${ordinal(i)} Period` : `${ordinal(i)} Quarter`;
		winners.push(periodWinner(ctx, `${label} Winner`, `${unit}-w-${i}`, winShrink));
		const mean = ctx.total * scoreShare;
		const center = halfLine(mean);
		totals.push(totalLadder(ctx, `${label} Total`, `${unit}-t-${i}`, mean, [
			center - bump,
			center,
			center + bump
		], ctx.sport, label));
	}
	return {
		winners,
		totals
	};
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/edge-BKT4wHN7.js
function feeFromHold(hold) {
	const holdPct = Number((hold > 1 ? hold : hold * 100).toFixed(1));
	let verdict = "Fair Price";
	if (holdPct > 7) verdict = "High Fee (Hard Rock Monopoly Tax)";
	if (holdPct > 9) verdict = "Overpriced (Avoid)";
	return {
		holdPct,
		verdict
	};
}
function feeBadge(hold) {
	if (hold == null || !Number.isFinite(hold)) return null;
	const { holdPct, verdict } = feeFromHold(hold);
	if (verdict.startsWith("Overpriced")) return {
		text: `Fee: ${holdPct}% (High Cut)`,
		tone: "avoid"
	};
	if (verdict.startsWith("High")) return {
		text: `Fee: ${holdPct}% (High Cut)`,
		tone: "high"
	};
	return {
		text: `Fee: ${holdPct}% (Fair)`,
		tone: "fair"
	};
}
function timingKind(opts) {
	if (opts.steam || opts.tapeLean === "sharp") return "lock-now";
	if (opts.tapeLean === "public" && opts.favorite) return "wait";
	return null;
}
var TIMING_COPY = {
	"lock-now": {
		title: "Lock This Now",
		line: "Smart money is moving this number. Photograph Hard Rock before the key number disappears. Not a guarantee it hits."
	},
	wait: {
		title: "Wait for Better Price",
		line: "Heavy public betting is inflating the favorite. Waiting can yield a better underdog payout near game time."
	}
};
/** Kalshi / Polymarket leading Hard Rock by more than 5 pts. Research, never a Florida fill. */
function earlyMover(desk, predict) {
	if (desk == null || predict == null || !Number.isFinite(desk) || !Number.isFinite(predict)) return false;
	return Math.abs(predict - desk) > .05;
}
function impliedFromAmerican(odds) {
	if (!Number.isFinite(odds)) return NaN;
	return odds < 0 ? Math.abs(odds) / (Math.abs(odds) + 100) : 100 / (odds + 100);
}
function fmtAmerican(n) {
	const r = Math.round(n);
	return r > 0 ? `+${r}` : `${r}`;
}
/** Plain-English alert when Hard Rock moved off the delayed board number. */
function lineShiftAlert(boardPrice, livePrice, chance) {
	if (!Number.isFinite(boardPrice) || !Number.isFinite(livePrice)) return null;
	if (Math.round(boardPrice) === Math.round(livePrice)) return null;
	const oldImp = impliedFromAmerican(boardPrice);
	const newImp = impliedFromAmerican(livePrice);
	const oldEdge = chance != null && Number.isFinite(chance) ? (chance - oldImp) * 100 : null;
	const newEdge = chance != null && Number.isFinite(chance) ? (chance - newImp) * 100 : null;
	let verdict = "";
	if (newEdge != null) verdict = newEdge > 1 ? " Still Smart Value." : newEdge > 0 ? " Fair Price." : " Overpriced (Avoid).";
	const edgeBit = oldEdge != null && newEdge != null ? ` Your edge is now ${newEdge >= 0 ? "+" : ""}${newEdge.toFixed(1)}% (was ${oldEdge >= 0 ? "+" : ""}${oldEdge.toFixed(1)}%).${verdict}` : "";
	return `Line Shift Detected: Hard Rock is now offering ${fmtAmerican(livePrice)} instead of ${fmtAmerican(boardPrice)}.${edgeBit}`;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-nrR04juv.js
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var getAccess = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("7099ec5094b68ad01f823abf93d97d6eb5782d2f6c2c9d8d06823d9f0747354f"));
var requestAccess = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("acf189225e84f1a5c58fb4f9417ce9ea84369dedbcf0a4d718c30356385e5c50"));
var getDeskSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("2c86fd0b5e7a7853b6196fb4eef60d98c7eeedd824957e1342ef254433b234b6"));
var saveDeskSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("19df154c96a70f0c9eee9836c01d165fc6433881cbc95e6f04424cd5b8642317"));
var listAllowlist = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("b22c66378dd9b68fbb5ffb619b1ccf1b6259c34cd0ad11422cdeaa86777958d4"));
var addAllowlistEmail = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("dab0374772f13fc6cabe9dba3183a4ba2a0fdd950a36f3ab878ea36b411de88a"));
var revokeAllowlistEmail = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("534ff3919488a4852b87c5e5b1088bc0b18337ac081a5cac43343e0ad9f3eb31"));
var listAccessRequests = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ddb42dc08dfc302e76a37b61b851079489575105f70fee89b09136b8c6633b93"));
var decideAccessRequest = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("da9a9d1894c81e38088d93ff27594f30ca8df9732cdc2d857f2d6436813d8e1d"));
var listHiddenPicks = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d37b496b91b58c492e6361476f960fb6925a5a500db7fcbc923e73e68f292408"));
var hidePickRemote = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("780d7a8d5e8e77f1ee3937a81d581a776cf8dbcd7f25e383b956b4f9180cf224"));
var pullMyLedger = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("8a46ddcd7cee6f4406600d3ee8a713466de7e8394668ce49d166027b95717b16"));
var pushMyLedger = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("7cc4e6dea4c8d7ae541771e4e10423bdf2e1f8f6eb50dcbc8a0b4bbef43fc482"));
var listMasterLedger = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("373b530b0d42d06d8cce436d88ccdfa52717caa9b7a01336aa3150563bc90ca9"));
var updateLedgerBet = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("c7b14d0f96eafef742e04e25567566fec78063d50febe6ef4749e637bd5d7535"));
var getFeedHealth = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("4dd9aabc643f707db4ccc6bfbecf1af2b07665dc1368f6ab22b8c974507230fe"));
function useAccess() {
	const { user, isPending } = useCurrentUserState();
	const q = useQuery({
		queryKey: ["access", user?.id],
		queryFn: () => getAccess(),
		enabled: Boolean(user),
		staleTime: 3e4,
		retry: 1,
		refetchOnWindowFocus: false
	});
	const unauthorized = Boolean(q.error && /unauthorized/i.test(String(q.error.message ?? q.error)));
	const access = q.data ?? null;
	return {
		user: unauthorized ? null : user,
		sessionPending: isPending,
		accessPending: Boolean(user) && !unauthorized && q.isPending,
		access,
		isAdmin: access?.status === "approved" && access.role === "admin",
		isApproved: access?.status === "approved",
		refetch: q.refetch
	};
}
/**
* AI Picks desk — rank every ticket the book posts, not just game winners.
*
* Popular (ML / spread / total), player props, period markets, same-game
* parlays, and cross-game 2/3/4-legs all go through ticketScore:
* chance × payout × market-quality × edge vs the juice.
* Tape is a layer. Never a lock.
*/
var BUCKETS = [
	"popular",
	"prop",
	"period",
	"sgp",
	"parlay2",
	"parlay3",
	"parlay4"
];
function pickId(row, bucket) {
	return [
		"r",
		bucket,
		row.eventId,
		row.marketType,
		row.side,
		row.point ?? "",
		row.player ?? "",
		row.selection
	].join("|");
}
function parlayTicketId(p) {
	return parlayTicketIdFromLegs(p.legs);
}
/**
* URL-safe parlay id. `|`, `.`, `~`, spaces, and `+` get eaten by query parsers
* and then `/ticket` rebuilds the wrong legs (moneyline TBA at ~25%).
* Shape: `p2__eventId__market__side__eventId__market__side`
*/
function parlayTicketIdFromLegs(legs) {
	const blob = legs.map((l) => `${safeIdToken(l.eventId || "x")}__${safeIdToken(l.marketType || "ml")}__${safeIdToken(l.side || "home")}`).join("__");
	return `p${legs.length}__${blob}`;
}
function safeIdToken(s) {
	return String(s).replace(/[^A-Za-z0-9_-]/g, "_");
}
function decodeTicketId(id) {
	let s = String(id ?? "").trim();
	for (let i = 0; i < 2; i++) try {
		const next = decodeURIComponent(s);
		if (next === s) break;
		s = next;
	} catch {
		break;
	}
	return s.replace(/%7E/gi, "~").replace(/%7C/gi, "|");
}
/** Same id TicketPage and ParlayTray read so the slip cannot print two integers. */
function resolveTicketId(routerId) {
	const fromRouter = decodeTicketId(routerId);
	if (typeof window === "undefined") return fromRouter;
	try {
		const decoded = decodeTicketId(new URLSearchParams(window.location.search).get("id") ?? "");
		if (decoded.length > fromRouter.length) return decoded;
		if (fromRouter.length <= 2 && decoded.length > fromRouter.length) return decoded;
		return decoded || fromRouter;
	} catch {
		return fromRouter;
	}
}
function chunkLegs(parts, group) {
	if (group < 3 || parts.length < group * 2 || parts.length % group !== 0) return null;
	const out = [];
	for (let i = 0; i < parts.length; i += group) out.push({
		eventId: parts[i] ?? "",
		marketType: parts[i + 1] || "ml",
		side: parts[i + 2] ?? "",
		selection: ""
	});
	return out.length >= 2 ? out : null;
}
function parseParlayTicketId(id) {
	const raw = decodeTicketId(id);
	if (!raw) return null;
	const under = /^p(\d+)__(.+)$/.exec(raw);
	if (under) {
		const n = Number(under[1]);
		const parts = under[2].split("__").filter(Boolean);
		if (n >= 2 && parts.length === n * 3) return chunkLegs(parts, 3);
	}
	const dotted = /^p(\d+)\.(.+)$/.exec(raw);
	if (dotted && !raw.includes("|") && !raw.includes("~") && !raw.includes("__")) {
		const n = Number(dotted[1]);
		const parts = dotted[2].split(".").filter(Boolean);
		if (n >= 2 && parts.length === n * 3) return chunkLegs(parts, 3);
	}
	const compact = /^p(\d+)-(.+)$/.exec(raw);
	if (compact) {
		const chunks = compact[2].split("--").filter(Boolean);
		if (!chunks.length) return null;
		return chunks.map((chunk) => {
			const [eventId, marketType, side] = chunk.split("~");
			return {
				eventId: eventId ?? "",
				marketType: marketType || "ml",
				side: side ?? "",
				selection: ""
			};
		});
	}
	if (raw.startsWith("p|")) {
		const rest = raw.slice(2);
		const bar = rest.indexOf("|");
		if (bar < 0) return null;
		const chunks = rest.slice(bar + 1).split("||").filter(Boolean);
		if (!chunks.length) return null;
		return chunks.map((chunk) => {
			const [eventId, marketType, side, ...sel] = chunk.split("~");
			return {
				eventId: eventId ?? "",
				marketType: marketType || "ml",
				side: side ?? "",
				selection: sel.join("~")
			};
		});
	}
	return null;
}
function matchLegRow(rows, leg) {
	if (!leg.eventId) return void 0;
	return rows.find((r) => r.eventId === leg.eventId && r.marketType === leg.marketType && r.side === leg.side && (!leg.selection || r.selection === leg.selection)) ?? rows.find((r) => r.eventId === leg.eventId && r.marketType === leg.marketType && r.side === leg.side) ?? (leg.selection ? rows.find((r) => r.eventId === leg.eventId && r.selection === leg.selection) : void 0);
}
function sameLegSet(a, b) {
	if (a.length !== b.length) return false;
	const key = (l) => `${l.eventId}|${l.marketType}|${l.side}`;
	return a.map(key).sort().join(";") === b.map(key).sort().join(";");
}
/**
* How much information this market actually carries.
* Sharps do not treat a 1st-inning 0.5 the same as a full-game moneyline.
* Period slices are shrunk in the sheet; this stops them from stealing The Call.
* NFL/CFB spreads get a key-number tilt (3 and 7) — Dimers / CLV desks treat those as physics.
*/
function infoQuality(opts) {
	const sel = (opts.selection || "").toLowerCase();
	const bucket = opts.bucket;
	let q = .75;
	if (bucket === "period" || /inning|quarter|1st half|2nd half|\bperiod\b/.test(sel)) {
		if (/1st inning|first inning|1st inn/.test(sel) && (opts.point === .5 || /0\.5/.test(sel))) q = .36;
		else if (/inning/.test(sel)) q = .46;
		else if (/f5|first 5|1st 5/.test(sel)) q = .64;
		else if (/quarter|\bperiod\b/.test(sel)) q = .5;
		else if (/half/.test(sel)) q = .58;
		else q = .48;
	} else if (bucket === "prop" || opts.isProp || opts.marketType === "prop") {
		q = /anytime|home run|to steal|to score|2\+/.test(sel) ? .68 : .8;
		if (/first (basket|goal|td|score)|next scorer/.test(sel)) q = .58;
	} else if (/exact|correct score/.test(sel)) q = .4;
	else if (/odd|even|highest/.test(sel)) q = .48;
	else if (opts.marketType === "ml") q = 1;
	else if (opts.marketType === "spread") q = .94 + keyNumberTilt(opts.sport, opts.point);
	else if (opts.marketType === "total") {
		const trimmed = sel.trim();
		q = /\b(over|under)\s+\d/.test(trimmed) && !/^(over|under)\s/.test(trimmed) ? .7 : .86;
	} else if (bucket === "sgp") q = .62;
	else if (bucket === "parlay2") q = .7;
	else if (bucket === "parlay3") q = .55;
	else if (bucket === "parlay4") q = .4;
	if (opts.inPlay) q *= .52;
	return Math.max(.28, Math.min(1, q));
}
/** NFL/CFB: 3 and 7 are the most common margins. Sitting on the right side is extra information. */
function keyNumberTilt(sport, point) {
	if (!sport || point == null || !Number.isFinite(point)) return 0;
	if (sport !== "NFL" && sport !== "NCAAF") return 0;
	const favorite = point < 0;
	const abs = Math.abs(point);
	const near3 = Math.abs(abs - 3) <= .51;
	const near7 = Math.abs(abs - 7) <= .51;
	if (!near3 && !near7) return 0;
	const justInside = abs === 2.5 || abs === 6.5;
	const justPast = abs === 3.5 || abs === 7.5;
	if (favorite) {
		if (justInside) return .04;
		if (justPast) return -.05;
		return 0;
	}
	if (justPast) return .04;
	if (justInside) return -.04;
	return 0;
}
/**
* Ranking score. deskScore (chance² × √payout, tape nudge) is the core.
* Quality haircuts noisy slices. Edge vs the juice is the sharp overlay.
*/
function ticketScore(chance, price, lean, quality, edge) {
	const base = deskScore(chance, price, lean);
	if (base <= -90) return base;
	let s = base * Math.max(.28, Math.min(1, quality));
	s += Math.max(-.07, Math.min(.14, edge * 1.15));
	return s;
}
/** Quality badge is one scale. High ≥0.72, Med 0.55–0.71, Low <0.55. Chance does not rewrite the label. */
function qualityBand(quality) {
	const q = Number(quality);
	if (!Number.isFinite(q)) return "low";
	if (q >= .72) return "high";
	if (q >= .55) return "medium";
	return "low";
}
function fromRow(row, bucket, why) {
	const pay = americanToDecimal(row.price);
	const selection = totalWithUnit(shortPick(row.selection, row.marketType), row.sport, row.marketType);
	const quality0 = infoQuality({
		bucket,
		selection: row.selection,
		marketType: row.marketType,
		isProp: row.isProp,
		point: row.point,
		sport: row.sport,
		inPlay: row.inPlay
	});
	const quality = !row.isProp && (row.marketType === "ml" || row.marketType === "spread" || row.marketType === "total") && row.simFair == null ? Math.min(quality0, .64) : quality0;
	const implied = Number.isFinite(row.price) ? americanToImplied(row.price) : void 0;
	const edge = implied != null && Number.isFinite(implied) ? row.fairProb - implied : 0;
	const shown = calibratedChance(row.fairProb, implied, quality);
	row.simFair != null && row.poolFair != null && Math.abs(row.simFair - row.poolFair);
	return {
		id: pickId(row, bucket),
		bucket,
		selection,
		chance: shown,
		price: row.price,
		decimalPayout: Number.isFinite(pay) ? pay : 1,
		score: ticketScore(row.fairProb, row.price, row.tapeLean, quality, edge),
		row,
		sport: row.sport,
		eventId: row.eventId,
		home: row.home,
		away: row.away,
		start: row.start,
		why,
		ticketPct: row.ticketPct,
		handlePct: row.handlePct,
		tapeLean: row.tapeLean,
		tapeNote: row.tapeNote,
		player: row.player,
		researchOnly: row.researchOnly,
		implied: implied != null && Number.isFinite(implied) ? implied : void 0,
		edge,
		infoQuality: quality,
		confidence: qualityBand(quality),
		homeAbbr: row.homeAbbr,
		awayAbbr: row.awayAbbr,
		homeLogo: row.homeLogo,
		awayLogo: row.awayLogo,
		tapeStamp: row.tapeStamp ?? (row.hardRockPrice != null ? "hr-fl" : "research"),
		simFair: row.simFair,
		poolFair: row.poolFair,
		processLooked: row.processLooked !== false,
		processSource: row.processSource,
		earlyMover: false
	};
}
function fromParlay(p, bucket) {
	const dec = p.decimalPayout ?? 1;
	const names = p.legs.map((l) => shortPick(l.selection, l.marketType)).join(" + ");
	const quality = parlayInfoQuality(p.legs.length, Boolean(p.sameGame));
	const implied = dec > 1 ? 1 / dec : void 0;
	const edge = implied != null ? p.combinedFair - implied : 0;
	const price = p.legs[0]?.price;
	const shown = calibratedChance(p.combinedFair, implied, quality);
	return {
		id: parlayTicketId(p),
		bucket,
		selection: names,
		chance: shown,
		price,
		decimalPayout: Number.isFinite(dec) && dec > 1 ? dec : 1,
		score: (p.score ?? parlayScore(p.combinedFair, dec > 1 ? dec : 1.01)) * quality,
		parlay: p,
		sport: p.sports?.[0] ?? p.legs[0]?.sport ?? "",
		eventId: p.sameGame ? p.legs[0]?.eventId : void 0,
		home: p.sameGame ? p.legs[0]?.home : void 0,
		away: p.sameGame ? p.legs[0]?.away : void 0,
		start: p.legs.map((l) => l.start).sort()[0],
		why: stampDisplayedChance(p.reason, shown),
		researchOnly: p.researchOnly,
		implied,
		edge,
		infoQuality: quality,
		confidence: qualityBand(quality),
		tapeStamp: p.researchOnly ? "research" : "hr-fl",
		earlyMover: false
	};
}
function shownParlayChance(p) {
	const n = p.legs.length;
	return fromParlay(p, n >= 4 ? "parlay4" : n === 3 ? "parlay3" : p.sameGame ? "sgp" : "parlay2").chance;
}
function stampDisplayedChance(reason, shown) {
	const pct = formatChancePct(shown);
	if (!reason || !pct) return reason;
	return reason.replace(/Combined chance[^.]*≈\s*[\d.]+(?:\s*in 100)?%?\.?/gi, `Combined chance ≈ ${pct}.`).replace(/about [\d.]+ in 100 tickets/gi, `about ${pct.replace("%", "")} in 100 tickets`);
}
/** Displayed combined % from builder legs — same fromParlay calibration the catalog and /ticket use. */
function shownParlayFromStoreLegs(legs) {
	if (legs.length < 2) return Number.isFinite(legs[0]?.fairProb) ? legs[0].fairProb : .5;
	const sameGame = new Set(legs.map((l) => l.eventId)).size < legs.length;
	const mlAndSpread = sameGame && legs.some((l) => l.marketType === "ml") && legs.some((l) => l.marketType === "spread");
	const raw = product(legs.map((l) => Number.isFinite(l.fairProb) ? l.fairProb : .5));
	const combinedFair = Math.min(.97, raw * (sameGame ? sgpHaircut(legs.length, mlAndSpread) : 1));
	const decimalPayout = product(legs.map((l) => americanToDecimal(Number.isFinite(l.price) ? l.price : -110)));
	return shownParlayChance({
		legs: legs.map((l) => ({
			eventId: l.eventId,
			sport: l.sport ?? "",
			selection: l.selection ?? "",
			marketType: l.marketType || "ml",
			side: l.side,
			price: l.price ?? -110,
			fairProb: l.fairProb ?? .5,
			start: l.start ?? "",
			home: l.home ?? "",
			away: l.away ?? ""
		})),
		combinedFair,
		combinedEv: 0,
		pricedAsEntertainment: legs.length >= 4 || combinedFair < .25,
		researchOnly: false,
		sameGame,
		title: `${legs.length}-leg`,
		reason: "",
		score: 0,
		decimalPayout
	});
}
function totalWithUnit(selection, sport, marketType) {
	if (marketType !== "total") return selection;
	if (/\b(runs?|points?|goals?)\b/i.test(selection)) return selection;
	const unit = sport === "MLB" ? " runs" : sport === "NHL" ? " goals" : " points";
	if (/^(over|under)\s/i.test(selection)) return `${selection}${unit}`;
	return selection;
}
function rowKey(row) {
	return [
		row.eventId,
		row.marketType,
		row.side,
		row.point ?? "",
		row.player ?? "",
		row.selection
	].join("|");
}
function legalRow(row) {
	if (row.tag === "illegal_fl" || row.tag === "unknown_market") return false;
	if (row.scheduleOnly) return false;
	if ((row.isProp || row.marketType === "prop") && isCollegeSport(row.sport)) return false;
	return true;
}
/** Popular is ML / spread / total. Schedule-only still names a research main so the lane cannot go empty. */
function legalPopular(row) {
	if (row.tag === "illegal_fl") return false;
	if (row.isProp || row.marketType === "prop") return false;
	if (!isMainMarket(row.marketType)) return false;
	if (isPeriodSel(row.selection, row.marketType)) return false;
	return true;
}
function isPeriodSel(sel, marketType) {
	if (marketType === "prop") return false;
	return /inning|quarter|1st half|2nd half|\bperiod\b|f5|first 5/i.test(sel);
}
function onHorizon(row, now = /* @__PURE__ */ new Date()) {
	if (row.inPlay) return true;
	if (!row.start) return false;
	if (isTodayEt(row.start, now)) return true;
	const t = new Date(row.start).getTime();
	if (!Number.isFinite(t)) return false;
	return t >= now.getTime() - 144e5 && t <= now.getTime() + 1296e5;
}
function uniqueTodayGames(rows) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const r of rows) {
		if (!onHorizon(r)) continue;
		if (seen.has(r.eventId)) continue;
		seen.add(r.eventId);
		out.push(r);
	}
	return out;
}
function briefAsResearch(brief, row) {
	if (!brief && !row) return void 0;
	return {
		eventId: brief?.eventId ?? row?.eventId ?? "",
		sport: row?.sport ?? "",
		espnId: "",
		home: row?.home ?? "",
		away: row?.away ?? "",
		start: row?.start,
		venue: brief?.venue,
		weather: brief?.weather,
		weatherTemp: brief?.weatherTemp,
		weatherWind: brief?.weatherWind,
		weatherPrecip: brief?.weatherPrecip,
		homeRecord: brief?.homeRecord,
		awayRecord: brief?.awayRecord,
		espnHomeWin: brief?.espnHomeWin,
		espnAwayWin: brief?.espnAwayWin,
		bookHomeWin: brief?.bookHomeWin,
		openHomeWin: brief?.openHomeWin,
		kalshiHomeWin: brief?.kalshiHomeWin,
		polyHomeWin: brief?.polyHomeWin,
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
		homeSpread: brief?.homeSpread,
		total: brief?.total,
		series: brief?.series,
		seriesHomeWins: brief?.seriesHomeWins,
		seriesAwayWins: brief?.seriesAwayWins,
		homeRestDays: brief?.homeRestDays,
		awayRestDays: brief?.awayRestDays,
		pitchers: [],
		lastFive: [],
		injuries: [],
		headlines: [],
		players: (brief?.players ?? []).map((p) => ({
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
		homeLooks: brief?.homeLooks,
		awayLooks: brief?.awayLooks,
		homePitcherHand: brief?.homePitcherHand,
		awayPitcherHand: brief?.awayPitcherHand,
		note: ""
	};
}
function expandSheet(scan, snapshot) {
	const extra = [];
	for (const g of uniqueTodayGames(scan.rows)) {
		if (g.inPlay) continue;
		const gameRows = scan.rows.filter((r) => r.eventId === g.eventId);
		const brief = snapshot.briefs?.find((b) => b.eventId === g.eventId);
		const homeWin = gameRows.find((r) => r.marketType === "ml" && r.side === "home")?.fairProb ?? brief?.chanceHome ?? .5;
		const tabs = buildSheet({
			sport: g.sport,
			home: g.home,
			away: g.away,
			homeNick: teamNick(g.home),
			awayNick: teamNick(g.away),
			rows: gameRows,
			research: briefAsResearch(brief, g),
			homeWin: Number.isFinite(homeWin) ? homeWin : .5
		});
		const markets = [
			...tabs.popular,
			...tabs.props,
			...tabs.innings,
			...tabs.half,
			...tabs.quarters,
			...tabs.halves,
			...tabs.periods
		];
		for (const m of markets) extra.push(...cellsInMarket(m));
	}
	return stampGameTape(extra, scan.rows);
}
function mergeRows(posted, sheet) {
	const seen = new Set(posted.map(rowKey));
	const out = [...posted];
	for (const r of sheet) {
		const k = rowKey(r);
		if (seen.has(k)) continue;
		seen.add(k);
		out.push(r);
	}
	return out;
}
function popularWhy(r) {
	const tape = r.tapeNote ? ` ${r.tapeNote}` : "";
	if (r.inPlay) {
		if (r.leftover) return `Live remaining-stat. Leftover mean from score + clock, not a haircut of the pre-game %. Photograph Hard Rock now. Last-10 still ran. Not The Call.${tape}`;
		return `Live ticket. The public number is delayed — photograph Hard Rock now. Last-10 scores and the full ensemble still run; quality is haircut because a delayed live fill is not a prior. Not The Call.${tape}`;
	}
	return `${r.marketType === "ml" ? "Who wins the game — moneyline. Highest-info market on the board." : r.marketType === "spread" ? "Spread. The favorite must cover the number. NFL/college: 3 and 7 are the key numbers." : "Over/under on the combined score. Last-10 combined scoring nudges the mean. Weather and pace move this more than a moneyline."} Ranked on chance-to-hit, payout, market quality, and edge vs the juice.${tape} Not a lock. Photograph Hard Rock to lock the live number.`;
}
function propWhy(r) {
	return `${r.player ?? "This player"} — ${shortPick(r.selection, r.marketType)}. Last-10 games (when we have them) blended with season rate, today's total, script, park, weather, and who is listed out. College player bets are blocked in Florida. Photograph the live Hard Rock number — analysis, not a fill.`;
}
function periodWhy(r) {
	return `${shortPick(r.selection, r.marketType)} is a slice of the game. Last-10 scores still feed the full-game ensemble, then this period is shrunk toward 50/50 because one inning/quarter is noisier than the whole game. Not The Call. Not a lock.`;
}
/** The Call must be a high-info ticket that still pays — not a noisy 0.5 inning. */
function heroEligible(p) {
	if (p.parlay) return false;
	if (p.row?.inPlay) return false;
	if (p.bucket === "period") return false;
	if (!(p.decimalPayout >= 1.55)) return false;
	if (p.chance < .5 || p.chance > .76) return false;
	if (p.infoQuality < .72) return false;
	if (p.processLooked !== false) return false;
	if (p.implied != null && Number.isFinite(p.implied) && p.chance < p.implied - .01 && (p.edge ?? 0) <= 0) return false;
	const sel = (p.selection || "").toLowerCase();
	if (/exact|correct score|first (basket|goal|td|score)|next (play|pitch|score)|teaser|future|championship|micro/.test(sel)) return false;
	return p.score > -90;
}
function sortByMood(list, mood) {
	const copy = [...list];
	const tapeFirst = (a, b) => tapePriority(b) - tapePriority(a);
	if (mood === "safe") return copy.sort((a, b) => tapeFirst(a, b) || b.chance - a.chance || b.score - a.score || a.id.localeCompare(b.id));
	if (mood === "pay") {
		const trusted = copy.filter((p) => p.infoQuality >= .64 && p.chance >= .48 && tapePriority(p) > 0);
		return (trusted.length ? trusted : copy).sort((a, b) => tapeFirst(a, b) || b.decimalPayout - a.decimalPayout || b.chance - a.chance || a.id.localeCompare(b.id));
	}
	return copy.sort((a, b) => tapeFirst(a, b) || b.score - a.score || b.chance - a.chance || a.id.localeCompare(b.id));
}
/** 65% preferred. If nobody clears it, show the single highest-probability ticket so Safest is never empty. */
function safestColumn(pool, n = 3, floor = DEFAULT_SAFEST_FLOOR) {
	const ranked = [...pool].sort((a, b) => b.chance - a.chance || b.score - a.score || a.id.localeCompare(b.id));
	const above = ranked.filter((p) => p.chance >= floor);
	if (above.length) return above.slice(0, n).map((p) => ({
		...p,
		safestFallback: false
	}));
	const top = ranked[0];
	if (!top) return [];
	return [{
		...top,
		safestFallback: true
	}];
}
function belowSixty(p) {
	return Number.isFinite(p.chance) && p.chance < .6;
}
function highestTodayLabel(p) {
	return `Highest Probability Today (${Math.round(p.chance * 100)}%)`;
}
/** Photographed / HR-FL mains outrank low-quality research so a 94% sheet alt cannot steal Safest. */
function tapePriority(p) {
	const research = p.researchOnly || p.tapeStamp === "research";
	if (p.tapeStamp === "photographed") return 4;
	if (p.tapeStamp === "hr-fl") return 3;
	if (research && (p.infoQuality < .55 || p.confidence === "low")) return 0;
	if (research) return 1;
	return 2;
}
function pickHero(singles, popular, mood = "value") {
	return sortByMood(singles.filter(heroEligible), mood)[0] ?? null;
}
/** Copy game-level wagers-vs-dollars onto sheet cells that have no market tape of their own. */
function stampGameTape(cells, gameRows) {
	const donor = gameRows.find((r) => r.ticketPct != null && r.marketType === "ml") ?? gameRows.find((r) => r.ticketPct != null);
	if (!donor || donor.ticketPct == null) return cells;
	return cells.map((c) => {
		if (c.ticketPct != null) return c;
		return {
			...c,
			ticketPct: donor.ticketPct,
			handlePct: donor.handlePct,
			tapeLean: donor.tapeLean,
			tapeNote: donor.tapeNote ? `Colleague tape on this game (wagers vs dollars), not this specific market. ${donor.tapeNote}` : "Colleague tape on this game (wagers vs dollars). Analyzed, not copied.",
			homeAbbr: c.homeAbbr ?? donor.homeAbbr,
			awayAbbr: c.awayAbbr ?? donor.awayAbbr,
			homeLogo: c.homeLogo ?? donor.homeLogo,
			awayLogo: c.awayLogo ?? donor.awayLogo,
			processLooked: c.processLooked ?? donor.processLooked,
			processSource: c.processSource ?? donor.processSource
		};
	});
}
function rankRows(rows, bucket, why, n) {
	const allow = bucket === "popular" ? legalPopular : legalRow;
	const scored = rows.filter(allow).filter((r) => onHorizon(r)).map((r) => fromRow(r, bucket, why(r))).sort((a, b) => {
		if (bucket === "popular") {
			const d = tapePriority(b) - tapePriority(a);
			if (d) return d;
		}
		return b.score - a.score || b.chance - a.chance || a.id.localeCompare(b.id);
	});
	const picks = bucket === "popular" ? (() => {
		const pre = scored.filter((p) => !p.row?.inPlay);
		return pre.length ? pre : scored;
	})() : scored;
	const perEvent = bucket === "period" ? 1 : bucket === "popular" ? 3 : 2;
	const count = /* @__PURE__ */ new Map();
	const out = [];
	for (const p of picks) {
		const id = p.eventId ?? p.id;
		const used = count.get(id) ?? 0;
		if (used >= perEvent) continue;
		count.set(id, used + 1);
		out.push(p);
		if (out.length >= n) break;
	}
	if (bucket === "popular") {
		const byEvent = /* @__PURE__ */ new Map();
		for (const p of picks) {
			const id = p.eventId ?? p.id;
			const list = byEvent.get(id) ?? [];
			list.push(p);
			byEvent.set(id, list);
		}
		for (const [eventId, list] of byEvent) {
			const fav = [...list].filter((p) => p.chance >= .5).sort((a, b) => b.chance - a.chance || b.score - a.score)[0];
			if (!fav) continue;
			if (out.some((p) => p.id === fav.id)) continue;
			const have = out.filter((p) => (p.eventId ?? p.id) === eventId);
			if (have.length >= perEvent) {
				const worst = [...have].sort((a, b) => a.chance - b.chance)[0];
				const idx = worst ? out.findIndex((p) => p.id === worst.id) : -1;
				if (idx >= 0) out[idx] = fav;
			} else if (out.length < n) out.push(fav);
		}
	}
	return out.slice(0, n);
}
function mixSameGame(propRows, popularRows, _periodRows) {
	const byEvent = /* @__PURE__ */ new Map();
	for (const r of [...popularRows, ...propRows]) {
		if (!legalRow(r) || r.inPlay) continue;
		const list = byEvent.get(r.eventId) ?? [];
		list.push(r);
		byEvent.set(r.eventId, list);
	}
	const out = [];
	for (const group of byEvent.values()) {
		const ml = group.find((r) => r.marketType === "ml");
		const tot = group.find((r) => r.marketType === "total");
		if (!ml || !tot) continue;
		const ev = evaluateParlay([ml, tot], void 0, "catalog");
		if ("ok" in ev && ev.ok === false) continue;
		out.push(fromParlay(ev, "sgp"));
	}
	return out;
}
function pickFromScanRow(row) {
	const bucket = row.isProp || row.marketType === "prop" ? "prop" : isPeriodSel(row.selection, row.marketType) ? "period" : "popular";
	return fromRow(row, bucket, bucket === "prop" ? propWhy(row) : bucket === "period" ? periodWhy(row) : popularWhy(row));
}
function candidateToPicks(p, rows) {
	return p.legs.map((leg) => {
		const row = matchLegRow(rows, leg);
		return row ? rowToPick(row) : {
			key: `${leg.eventId}:${leg.marketType}:${leg.side}`,
			eventId: leg.eventId,
			sport: leg.sport,
			start: leg.start,
			home: leg.home,
			away: leg.away,
			marketType: leg.marketType,
			side: leg.side,
			selection: leg.selection,
			price: leg.price,
			fairProb: leg.fairProb
		};
	});
}
function syntheticRow(leg) {
	return {
		eventId: leg.eventId || `unknown-${leg.selection}`,
		sport: leg.sport || "",
		start: leg.start || "",
		home: leg.home || "",
		away: leg.away || "",
		marketType: leg.marketType || "ml",
		side: leg.side,
		selection: leg.selection,
		price: Number.isFinite(leg.price) ? leg.price : -110,
		fairProb: Number.isFinite(leg.fairProb) ? leg.fairProb : .5,
		evPct: 0,
		hold: 0,
		tag: "unknown_market",
		action: "stand_down",
		reason: "This leg could not be priced on the delayed board.",
		conviction: "low",
		spark: ""
	};
}
function fallbackParlay(rows, reason) {
	const sameGame = new Set(rows.map((r) => r.eventId)).size < rows.length;
	const mlAndSpread = sameGame && rows.some((l) => l.marketType === "ml") && rows.some((l) => l.marketType === "spread");
	const usedSim = false;
	const raw = product(rows.map((l) => Number.isFinite(l.fairProb) ? l.fairProb : .5));
	const combinedFair = Math.min(.97, raw * (sameGame ? sgpHaircut(rows.length, mlAndSpread) : 1));
	const decimalPayout = product(rows.map((l) => americanToDecimal(l.price)));
	const sports = [...new Set(rows.map((l) => l.sport))];
	const corr = correlationOf(rows, usedSim);
	return {
		legs: rows.map((l) => ({
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
		})),
		combinedFair,
		combinedEv: combinedFair * (decimalPayout > 1 ? decimalPayout : 1) - 1,
		pricedAsEntertainment: rows.length >= 4 || combinedFair < .25,
		researchOnly: rows.some((l) => l.hardRockPrice == null),
		sameGame,
		title: `${rows.length}-game${sameGame ? " same-game" : ""} parlay`,
		reason: `${reason} Combined chance ≈ ${formatChancePct(calibratedChance(combinedFair, decimalPayout > 1 ? 1 / decimalPayout : void 0, parlayInfoQuality(rows.length, sameGame))) ?? "—"}. Combined is closed form. Quality capped at 0.64. No fake sim %.`,
		score: parlayScore(combinedFair, decimalPayout > 1 ? decimalPayout : 1.01),
		mix: sameGame ? "same-game" : sports.length > 1 ? "cross-sport" : "same-sport",
		decimalPayout,
		sports,
		correlation: corr
	};
}
function deskPickFromLegRefs(refs, scan) {
	const stood = [];
	const rows = refs.map((leg) => {
		const hit = matchLegRow(scan.rows, leg);
		if (!hit) {
			stood.push(leg.selection || `${leg.marketType} ${leg.side}`);
			return syntheticRow(leg);
		}
		if (hit.tag === "unknown_market" || hit.tag === "illegal_fl") stood.push(hit.selection);
		return hit;
	});
	if (rows.length === 1) return pickFromScanRow(rows[0]);
	const n = rows.length;
	const sameGame = new Set(rows.map((r) => r.eventId)).size < n;
	const bucket = n >= 4 ? "parlay4" : n === 3 ? "parlay3" : sameGame ? "sgp" : "parlay2";
	const ev = evaluateParlay(rows, void 0, "catalog");
	const cand = "ok" in ev && ev.ok === false ? fallbackParlay(rows, ev.reason) : ev;
	const pick = fromParlay(cand, bucket);
	const closed = rows.some((r) => !r.isProp && (r.marketType === "ml" || r.marketType === "spread" || r.marketType === "total") && r.simFair == null);
	const usedSim = cand.correlation === "shared-latent";
	const live = rows.some((r) => r.inPlay || r.tag === "in_play");
	if (closed || cand.sameGame && !usedSim || stood.length || live) {
		pick.infoQuality = Math.min(pick.infoQuality, .64);
		pick.confidence = qualityBand(pick.infoQuality);
	}
	if (live) pick.why = `${pick.why} Live leg on the slip — combined quality haircut. Never The Call. Never the gold ribbon.`;
	if (stood.length) pick.why = `${pick.why} Stood down: ${stood.join("; ")}. Still opened the slip.`;
	return pick;
}
function correlationFlag(corr, sameGame) {
	if (corr === "shared-latent") return "joint-path · shared-latent";
	if (corr === "fallback-haircut") return "Thin fallback-haircut";
	if (sameGame) return "Same-game";
	return "near-independent";
}
function ribbonSitWhy(p, rows) {
	const parlay = p.parlay;
	if (!parlay) return "A parlay cannot be The Call. Ribbon parlays live on Parlay as the high-hit badge.";
	const n = parlay.legs.length;
	if (n !== 2 && n !== 3) return `Not on the gold ribbon. Ribbon is 2- or 3-leg mains. ${n}-leg is Catalog / fun money.`;
	if (parlay.legs.some((l) => matchLegRow(rows ?? [], l)?.inPlay)) return "Not on the gold ribbon — live legs cannot load onto the ribbon. Combined quality is haircut. Never The Call.";
	if (parlay.legs.some((l) => isCollegeSport(l.sport) && l.marketType === "prop")) return "College player legs cannot load. Florida compact blocks them. Stood that leg down.";
	if (parlay.legs.some((l) => l.marketType === "prop")) return "Not on the gold ribbon — player props are custom builder, never the gold badge.";
	if (parlay.sameGame) return "Not on the gold ribbon — same-game lives as SGP catalog, not the gold badge. Joint-path or Thin fallback-haircut still prints on the ticket.";
	if (parlay.legs.some((l) => /1st inning|first inning/i.test(l.selection) && /0\.5/.test(l.selection))) return "Not on the gold ribbon — a period 0.5 cannot be a ribbon leg.";
	if (!ribbonEligible(p)) return "Not on the gold ribbon — a leg missed the 56%/60% displayed floor, the combined floor, payout 1.45, or quality 0.72.";
	return "On the gold ribbon: 2- or 3-leg mains, floors cleared, no live, no college player, no period 0.5.";
}
function buildDeskPicks(scan, snapshot) {
	const merged = mergeRows(scan.rows.filter((r) => onHorizon(r)), expandSheet(scan, snapshot));
	const popularRows = merged.filter(legalPopular);
	const propRows = merged.filter((r) => r.isProp || r.marketType === "prop");
	const periodRows = merged.filter((r) => isPeriodSel(r.selection, r.marketType) && r.marketType !== "prop" && !r.isProp);
	const popular = rankRows(popularRows, "popular", popularWhy, 24);
	const props = rankRows(propRows, "prop", propWhy, 8);
	const periods = rankRows(periodRows, "period", periodWhy, 6);
	const sgpGame = (scan.topSgp ?? []).slice(0, 4).map((p) => fromParlay(p, "sgp"));
	const sgpMixed = mixSameGame(propRows, popularRows, periodRows);
	const sgp = rankPicks([...sgpGame, ...sgpMixed], 6);
	const two = (scan.topTwos ?? []).slice(0, 6).map((p) => fromParlay(p, p.sameGame ? "sgp" : "parlay2"));
	const three = (scan.topThrees ?? []).slice(0, 6).map((p) => fromParlay(p, "parlay3"));
	const four = (scan.topFours ?? []).slice(0, 4).map((p) => fromParlay(p, "parlay4"));
	const ribbon = buildRibbon([...two, ...three]);
	const singles = [
		...popular,
		...props,
		...periods
	];
	const hero = pickHero(singles, popular, "value");
	const dropHero = (list) => hero ? list.filter((p) => p.id !== hero.id) : list;
	const stamp = (p) => stampEarlyMover(p, snapshot);
	const all = [
		hero,
		...singles,
		...ribbon,
		...sgp,
		...two,
		...three,
		...four
	].filter((p) => Boolean(p)).map(stamp);
	return {
		hero: hero ? stamp(hero) : null,
		popular: dropHero(popular).map(stamp),
		props: dropHero(props).map(stamp),
		periods: dropHero(periods).map(stamp),
		sgp: sgp.map(stamp),
		two: two.map(stamp),
		three: three.map(stamp),
		four: four.map(stamp),
		ribbon: ribbon.map(stamp),
		all
	};
}
function stampEarlyMover(p, snapshot) {
	if (p.row?.marketType !== "ml") return p.earlyMover ? {
		...p,
		earlyMover: false
	} : p;
	const brief = snapshot.briefs?.find((b) => b.eventId === p.eventId);
	const predict = brief?.kalshiHomeWin ?? brief?.polyHomeWin;
	const sidePredict = predict == null ? void 0 : p.row.side === "away" ? 1 - predict : predict;
	const flag = earlyMover(p.implied, sidePredict);
	return flag === p.earlyMover ? p : {
		...p,
		earlyMover: flag
	};
}
/** Same-game ids look in SGP first so joint-path combinedFair wins over a 2-leg duplicate. */
function catalogParlays(scan, id) {
	const twos = scan.topTwos ?? [];
	const threes = scan.topThrees ?? [];
	const fours = scan.topFours ?? [];
	const sgp = scan.topSgp ?? [];
	const refs = parseParlayTicketId(id);
	return Boolean(refs && new Set(refs.map((r) => r.eventId)).size < refs.length) ? [
		...sgp,
		...twos,
		...threes,
		...fours
	] : [
		...twos,
		...threes,
		...fours,
		...sgp
	];
}
function lookupPick(id, scan, snapshot) {
	if (!id) return null;
	const decoded = decodeTicketId(id);
	const fromRowId = (raw) => {
		if (!raw.startsWith("r|") && !raw.startsWith("r%7C") && !raw.startsWith("r%7c")) return null;
		const bits = decodeTicketId(raw).split("|");
		let i = 1;
		let bucket = "popular";
		if (BUCKETS.includes(bits[1])) {
			bucket = bits[1];
			i = 2;
		}
		const eventId = bits[i];
		const marketType = bits[i + 1];
		const side = bits[i + 2];
		const selection = bits.slice(i + 5).join("|");
		const row = scan.rows.find((r) => r.eventId === eventId && r.marketType === marketType && r.side === side && r.selection === selection) ?? scan.rows.find((r) => r.eventId === eventId && r.marketType === marketType && r.side === side);
		if (!row) return null;
		const why = bucket === "prop" ? propWhy(row) : bucket === "period" ? periodWhy(row) : popularWhy(row);
		return fromRow(row, bucket === "sgp" ? "popular" : bucket, why);
	};
	const rowHit = fromRowId(decoded) ?? fromRowId(id);
	if (rowHit) return rowHit;
	const lists = catalogParlays(scan, decoded);
	const named = lists.find((p) => parlayTicketId(p) === decoded || parlayTicketId(p) === id);
	if (named) {
		const n = named.legs.length;
		return fromParlay(named, n >= 4 ? "parlay4" : n === 3 ? "parlay3" : named.sameGame ? "sgp" : "parlay2");
	}
	const refs = parseParlayTicketId(decoded) ?? parseParlayTicketId(id);
	if (refs && refs.length >= 2) {
		const byLegs = lists.find((p) => sameLegSet(p.legs, refs));
		if (byLegs) {
			const n = byLegs.legs.length;
			return fromParlay(byLegs, n >= 4 ? "parlay4" : n === 3 ? "parlay3" : byLegs.sameGame ? "sgp" : "parlay2");
		}
		return deskPickFromLegRefs(refs, scan);
	}
	return buildDeskPicks(scan, snapshot).all.find((p) => p.id === decoded || p.id === id) ?? null;
}
function pickMatchup(p) {
	if (p.away && p.home) return matchupLine(p.away, p.home);
	if (p.parlay) return p.parlay.legs.map((l) => `${l.away} at ${l.home}`).join(" · ");
	return p.sport || "Ticket";
}
function pickInSport(p, sport) {
	if (!sport || sport === "ALL") return true;
	if (p.parlay?.sports?.includes(sport)) return true;
	return p.sport === sport;
}
function rankPicks(list, n) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const p of [...list].sort((a, b) => b.score - a.score || b.chance - a.chance || a.id.localeCompare(b.id))) {
		if (seen.has(p.id)) continue;
		seen.add(p.id);
		out.push(p);
		if (out.length >= n) break;
	}
	return out;
}
function ribbonEligible(p) {
	const parlay = p.parlay;
	if (!parlay) return false;
	const n = parlay.legs.length;
	if (n !== 2 && n !== 3) return false;
	if (p.row?.inPlay) return false;
	if (p.score <= -90) return false;
	if (p.decimalPayout < 1.45) return false;
	const floor = n === 2 ? .56 : .6;
	const combinedFloor = n === 2 ? .38 : .28;
	if (p.chance < combinedFloor) return false;
	for (const l of parlay.legs) {
		if (l.marketType === "prop") return false;
		const q = infoQuality({
			bucket: "popular",
			selection: l.selection,
			marketType: l.marketType
		});
		if (q < .72) return false;
		const implied = Number.isFinite(l.price) ? americanToImplied(l.price) : void 0;
		if (calibratedChance(l.fairProb, implied, q) < floor) return false;
	}
	return true;
}
/** High-hit 2/3-leg mains. Always sorted Safest. Cap 1 slip per event. */
function buildRibbon(list) {
	const ok = list.filter(ribbonEligible).sort((a, b) => (b.parlay?.combinedFair ?? 0) - (a.parlay?.combinedFair ?? 0) || b.score - a.score || a.id.localeCompare(b.id));
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const p of ok) {
		const events = p.parlay?.legs.map((l) => l.eventId) ?? [];
		if (events.some((id) => seen.has(id))) continue;
		for (const id of events) seen.add(id);
		out.push(p);
		if (out.length >= 6) break;
	}
	return out;
}
/**
* Scroll-aware floating combo badge. Hides on scroll-down so it never
* covers Photograph / Confirm buttons. Shows again on scroll-up.
*/
function CollapsibleParlayPill() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const searchId = useRouterState({ select: (s) => String(s.location.search?.id ?? "") });
	const legs = useDeskStore((s) => s.parlayLegs);
	const stake = useDeskStore(selectUnit);
	const { scan, snapshot } = useDeskDecision();
	const [hidden, setHidden] = (0, import_react.useState)(false);
	const lastY = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		lastY.current = typeof window === "undefined" ? 0 : window.scrollY;
		let ticking = false;
		function onScroll() {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				const y = window.scrollY;
				const prev = lastY.current;
				if (y > prev + 8 && y > 48) setHidden(true);
				else if (y < prev - 8 || y < 24) setHidden(false);
				lastY.current = y;
				ticking = false;
			});
		}
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	if (!legs.length || pathname.startsWith("/parlay") || pathname.startsWith("/game")) return null;
	const legal = legs.filter((l) => !(l.marketType === "prop" && isCollegeSport(l.sport)));
	if (legal.length < 2) return null;
	const onTicket = pathname.startsWith("/ticket");
	const urlId = onTicket ? resolveTicketId(searchId) : "";
	const storeId = parlayTicketIdFromLegs(legal);
	const id = urlId || storeId;
	const pick = scan && snapshot ? onTicket ? lookupPick(id, scan, snapshot) ?? (searchId && searchId !== id ? lookupPick(searchId, scan, snapshot) : null) : lookupPick(id, scan, snapshot) ?? deskPickFromLegRefs(legal, scan) : null;
	const chance = pick?.chance;
	const pct = chance != null && Number.isFinite(chance) ? formatChancePct(chance) : null;
	const payout = pick?.decimalPayout ?? 0;
	const hit = stake > 0 && payout > 1 ? stake * payout : null;
	const profit = hit != null ? hit - stake : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("pointer-events-none fixed inset-x-0 bottom-16 z-30 px-3 pb-[env(safe-area-inset-bottom)] transition-[transform,opacity] duration-200 ease-[var(--ease-out-soft)]", hidden ? "translate-y-24 opacity-0" : "translate-y-0 opacity-100"),
		"aria-hidden": hidden,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/ticket",
			search: { id },
			hash: onTicket ? "lock-in" : void 0,
			tabIndex: hidden ? -1 : 0,
			className: cn("pointer-events-auto mx-auto flex max-w-xl items-center justify-between gap-3 rounded-lg bg-gold px-4 py-2.5 text-navy-deep shadow-[var(--shadow-stamp)]", hidden && "pointer-events-none"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "block text-sm font-medium",
					children: [
						"Combo · ",
						legal.length,
						" picks",
						pct ? ` · ${pct} they all hit` : ""
					]
				}), hit != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "block text-xs",
					children: [
						"Hit ",
						formatBetUsd(hit),
						profit != null && profit > 0 ? ` · +${formatBetUsd(profit)}` : "",
						" on ",
						formatBetUsd(stake)
					]
				}) : null]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 text-sm font-semibold underline-offset-4",
				children: onTicket ? "Photograph to lock this price" : "Open ticket"
			})]
		})
	});
}
function ticketMath(chance, price, stake = 0) {
	const pctLabel = formatChancePct(chance);
	const decimal = price != null && Number.isFinite(price) && price !== 0 ? americanToDecimal(price) : null;
	const hit = decimal != null && decimal > 1 && stake > 0 ? stake * decimal : null;
	const profit = hit != null ? hit - stake : null;
	return {
		hasChance: pctLabel != null,
		pctLabel,
		decimal,
		hit,
		profit
	};
}
/** Compact always-on readout for Hard Rock cells and dense lists. Percent is the number. */
function HitReadout({ chance, price, className, hero = false, align = "center" }) {
	const { pctLabel, hit } = ticketMath(chance, price, useDeskStore(selectUnit));
	if (!pctLabel && hit == null) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("w-full min-w-0", align === "left" ? "text-left" : "text-center", className),
		children: [pctLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("font-display leading-none tabular-nums text-gold", hero ? "text-2xl" : "text-xl"),
			children: pctLabel
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: "—"
		}), hit != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-0.5 truncate text-xs leading-tight text-gold",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: "Hit"
				}),
				" ",
				formatBetUsd(hit)
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-xs leading-tight text-muted",
			children: "Set This bet"
		})]
	});
}
function WagerMeter({ chance, price, decimalPayout, size = "md", label = "Chance it hits", className }) {
	const stake = useDeskStore(selectUnit);
	const pctLabel = formatChancePct(chance);
	const hasChance = pctLabel != null;
	const decimal = decimalPayout != null && Number.isFinite(decimalPayout) && decimalPayout > 1 ? decimalPayout : price != null && Number.isFinite(price) ? americanToDecimal(price) : null;
	if (!hasChance && decimal == null) return null;
	const pct = hasChance && chance != null ? Math.max(0, Math.min(100, chance * 100)) : 0;
	const total = decimal != null && stake > 0 ? stake * decimal : null;
	const profit = total != null ? total - stake : null;
	const pctClass = size === "lg" ? "text-5xl md:text-6xl" : size === "sm" ? "text-3xl" : "text-4xl";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-md bg-wash px-3 py-3", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("font-display leading-none tabular-nums text-gold", pctClass),
						children: pctLabel ?? "—"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 truncate text-xs uppercase tracking-[0.14em] text-muted",
						children: label
					})]
				}), total != null && profit != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "shrink-0 text-right",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-medium text-gold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "stamp mr-1",
								children: "Hit"
							}), formatBetUsd(total)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "stamp mr-1 text-faint",
									children: "Miss"
								}),
								"−",
								formatBetUsd(stake)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 text-xs text-muted",
							children: [
								"On your ",
								formatBetUsd(stake),
								profit > 0 ? ` · +${formatBetUsd(profit)}` : ""
							]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Set This bet on Start to see dollars."
				})]
			}),
			hasChance ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-1.5 overflow-hidden rounded-full bg-line",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full bg-gold",
					style: { width: `${pct}%` }
				})
			}) : null,
			price != null && Number.isFinite(price) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 font-mono text-xs text-muted",
				children: ["Hard Rock would show ", formatAmerican(price)]
			}) : null
		]
	});
}
function delayedMatch(rows, ticket) {
	return rows.find((r) => namesHit(r.home, ticket.home) && namesHit(r.away, ticket.away) && r.marketType === ticket.marketType && (r.side === ticket.side || namesHit(r.selection, ticket.selection)));
}
function TicketReview({ draft, legs, rows, onLock, error }) {
	const multi = (legs?.filter((l) => l.selection && Number.isFinite(l.price)) ?? []).length >= 2;
	const items = multi ? (legs ?? []).filter((l) => l.selection && Number.isFinite(l.price)) : draft ? [draft] : [];
	if (!items.length) return null;
	const delayed = items.map((t) => delayedMatch(rows, t));
	const livePrices = items.map((t) => t.price);
	const delayedPrices = delayed.map((r, i) => r?.price ?? livePrices[i]);
	const chance = multi ? product(items.map((t, i) => delayed[i]?.fairProb || .5)) : delayed[0]?.fairProb;
	const decimal = product(livePrices.map((p) => americanToDecimal(p)));
	const delayedDecimal = product(delayedPrices.map((p) => americanToDecimal(p)));
	const liveAmerican = items.length === 1 ? livePrices[0] : decimalToAmerican(decimal);
	const delayedAmerican = items.length === 1 ? delayedPrices[0] : decimalToAmerican(delayedDecimal);
	const moved = delayedAmerican !== liveAmerican;
	const title = items.length === 1 ? shortPick(items[0].selection, items[0].marketType) : `${items.length}-game parlay`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5 space-y-4 rounded-md bg-wash p-4 ring-1 ring-gold/40",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stamp text-gold",
					children: "Not on Log yet · check the live number"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display mt-2 text-2xl text-ink",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-ink",
					children: items.length === 1 ? `${items[0].away} at ${items[0].home}` : items.map((t) => shortPick(t.selection, t.marketType)).join(" + ")
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: items.map((t, i) => {
					const board = delayedPrices[i];
					const live = livePrices[i];
					const shifted = board !== live;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md bg-card px-3 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium text-ink",
								children: shortPick(t.selection, t.marketType)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									t.away,
									" at ",
									t.home
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HitReadout, {
								className: "mt-2",
								align: "left",
								chance: delayed[i]?.fairProb,
								price: live
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 grid grid-cols-2 gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted",
									children: ["Board had ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-ink",
										children: formatAmerican(board)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: shifted ? "text-gold" : "text-ink",
									children: ["Screenshot now ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: formatAmerican(live)
									})]
								})]
							})
						]
					}, `${t.selection}-${i}`);
				})
			}),
			moved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OddsBox, {
					label: "Board had",
					price: delayedAmerican,
					chance
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OddsBox, {
					label: "Screenshot now",
					price: liveAmerican,
					chance,
					live: true
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OddsBox, {
				label: "Live number from screenshot",
				price: liveAmerican,
				chance,
				live: true
			}),
			moved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-md bg-wash-gold px-3 py-2 text-sm text-gold",
				children: lineShiftAlert(delayedAmerican, liveAmerican, chance ?? void 0)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WagerMeter, {
				size: "lg",
				chance,
				price: items.length === 1 ? liveAmerican : void 0,
				decimalPayout: items.length > 1 ? decimal : void 0,
				label: multi ? "Chance they all hit — at the live number" : "Chance it hits — at the live number"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "These dollars use This ticket from Start. Saving to Log does not place the bet — you still tap Bet at Hard Rock Bet."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				size: "lg",
				onClick: onLock,
				children: "Lock live number and save to Log"
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-down",
				children: error
			}) : null
		]
	});
}
function OddsBox({ label, price, chance, live }) {
	const math = ticketMath(chance, price, useDeskStore(selectUnit));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-md px-3 py-3", live ? "bg-wash-gold" : "bg-card"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "stamp text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("font-display mt-1 text-2xl tabular-nums", live ? "text-gold" : "text-ink"),
				children: math.pctLabel ?? formatAmerican(price)
			}),
			math.hit != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-0.5 text-sm text-up",
				children: ["Hit ", formatBetUsd(math.hit)]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 font-mono text-xs text-muted",
				children: ["Book ", formatAmerican(price)]
			})
		]
	});
}
function LockedStamp({ ticket }) {
	const payout = ticket.price != null ? profitOnStake(ticket.stake, ticket.price) : null;
	const pulse = selectTicketPulse({ paperTickets: useDeskStore((s) => s.paperTickets) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "paper-card overflow-hidden p-5 text-center ring-2 ring-gold",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/lock-stamp.jpg",
				alt: "Locked in",
				className: "lock-stamp mx-auto size-40 object-contain"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "stamp mt-2 text-gold",
				children: "On Log · waiting"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-2 text-2xl text-ink",
				children: ticket.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-ink",
				children: [formatBetUsd(ticket.stake), ticket.chance != null && formatChancePct(ticket.chance) ? ` · ${formatChancePct(ticket.chance)} to hit` : ""]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 font-mono text-xs text-muted",
				children: [
					"Book",
					" ",
					ticket.livePrice != null ? formatAmerican(ticket.livePrice) : ticket.price != null ? formatAmerican(ticket.price) : "live odds"
				]
			}),
			payout ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-gold",
				children: [
					"Hit ",
					formatBetUsd(payout.total),
					" · miss −",
					formatBetUsd(ticket.stake)
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WagerMeter, {
				className: "mt-3 text-left",
				size: "sm",
				chance: ticket.chance,
				price: ticket.livePrice ?? ticket.price,
				label: "Chance it hits — locked number"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 rounded-md bg-wash-gold px-3 py-2 text-sm text-gold",
				children: [
					"This ticket is now one of ",
					pulse.openCount,
					" open ",
					pulse.openCount === 1 ? "ticket" : "tickets",
					" on Log — top right of every page. When the game ends, tap Hit or Miss. Money on Start moves the same way the book would."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/desk",
				className: "mt-4 inline-flex min-h-12 items-center justify-center rounded-md bg-gold px-5 text-base font-medium text-navy-deep",
				children: "See it on Log"
			})
		]
	});
}
function TicketChip() {
	const pulse = selectTicketPulse({ paperTickets: useDeskStore((s) => s.paperTickets) });
	const pathnameOpen = pulse.openCount > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/desk",
		className: cn("inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium", pathnameOpen ? "ticket-pulse bg-wash-gold text-gold" : "text-muted hover:bg-wash hover:text-ink"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-6 place-items-center rounded-sm bg-gold font-mono text-xs text-navy-deep",
				children: pulse.openCount
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden sm:inline",
				children: pulse.openCount === 1 ? "open ticket" : "open tickets"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sm:hidden",
				children: "open"
			})
		]
	});
}
function buildLockPayload(items, rows, stake) {
	const delayed = items.map((t) => delayedMatch(rows, t));
	const livePrices = items.map((t) => t.price);
	const decimal = product(livePrices.map((p) => americanToDecimal(p)));
	const price = items.length === 1 ? items[0].price : decimalToAmerican(decimal);
	const delayedPrice = delayed[0]?.price;
	const chance = items.length > 1 ? product(items.map((_, i) => delayed[i]?.fairProb || .5)) : delayed[0]?.fairProb;
	const desc = items.length === 1 ? `${shortPick(items[0].selection, items[0].marketType)} · ${items[0].away} at ${items[0].home}` : items.map((t) => shortPick(t.selection, t.marketType)).join(" + ");
	return {
		kind: items.length > 1 ? "parlay" : items[0].marketType === "prop" ? "prop" : "main",
		description: desc,
		stake,
		price,
		postedPrice: delayedPrice ?? price,
		delayedPrice,
		livePrice: price,
		chance,
		gameIds: delayed.filter(Boolean).map((r) => r.eventId),
		home: items[0].home,
		away: items[0].away
	};
}
var LOOK_LABEL = {
	high: "Strong look",
	medium: "Fair look",
	low: "Thin look"
};
var CHIP_LINE = {
	"look-strong": {
		title: "Strong look",
		line: "We have a full enough picture to show this number. Not a promise it hits."
	},
	"look-fair": {
		title: "Fair look",
		line: "Usable, some pieces missing."
	},
	"look-thin": {
		title: "Thin look",
		line: "Thin data. Treat as research."
	},
	"photo-from": {
		title: "Price from your photo",
		line: "The odds came from the Hard Rock screenshot you uploaded."
	},
	"photo-needed": {
		title: "Photo to lock this price",
		line: "The % is research on a delayed number until you photograph Hard Rock."
	},
	"tape-hr": {
		title: "Hard Rock number",
		line: "A Hard Rock price we already have — not from your photo on this ticket."
	},
	research: {
		title: "Research only — photo still needed for the live price",
		line: "This number is research. Photograph Hard Rock before you treat the dollars as live."
	},
	"edge-up": {
		title: "Better than the book",
		line: "Our chance is higher than the chance baked into Hard Rock’s price."
	},
	"edge-down": {
		title: "Worse than the book",
		line: "Our chance is lower than the chance baked into Hard Rock’s price."
	},
	"the-call": {
		title: "The Call",
		line: "The gold-ribbon single — highest-conviction gated play of the day. Still not a guarantee. This site never places the bet."
	},
	"top-pick": {
		title: "The Call",
		line: "The gold-ribbon single. Same gates as The Call. Still not a guarantee."
	},
	"under-60": {
		title: "Under 60%",
		line: "Chance is under 60%. Not a hide, not a lock."
	},
	"highest-today": {
		title: "Highest Probability Today",
		line: "Nobody on this delayed board cleared the 65% Safest floor, so the desk shows the highest-probability ticket instead of a blank column."
	},
	"early-mover": {
		title: "Early Mover Advantage",
		line: "Kalshi or Polymarket moved more than 5 points ahead of Hard Rock. Research, never a Florida fill. Photograph Hard Rock before the book reprices."
	},
	fee: {
		title: "Sportsbook Fee",
		line: "The cut the sportsbook takes. Higher fee = worse deal for you."
	},
	"lock-now": {
		title: "Lock This Now",
		line: "Smart money is moving this number. Photograph Hard Rock before the key number disappears. Not a guarantee it hits."
	},
	wait: {
		title: "Wait for Better Price",
		line: "Heavy public betting is inflating the favorite. Waiting can yield a better underdog payout near game time."
	}
};
var HOW_IT_WORKS = [
	{
		n: "01",
		title: "Set money",
		body: "Type what you can spend on Start."
	},
	{
		n: "02",
		title: "Pick a ticket",
		body: "AI Picks names one. Tap the card."
	},
	{
		n: "03",
		title: "Photograph Hard Rock",
		body: "We read the live price from your screenshot."
	},
	{
		n: "04",
		title: "Mark it on Log",
		body: "After the game, tap Hit or Miss."
	}
];
var WORDS_WE_USE = [
	{
		id: "chance",
		word: "Chance it hits",
		line: "How often we think this ticket wins."
	},
	{
		id: "book",
		word: "Book",
		line: "Chance baked into Hard Rock’s price."
	},
	{
		id: "edge",
		word: "Edge",
		line: "Our chance minus the book’s chance."
	},
	{
		id: "look",
		word: "Strong / Fair / Thin look",
		line: "How complete the information is. Not the chance it hits."
	},
	{
		id: "photo",
		word: "Photo to lock this price",
		line: "Until you photograph Hard Rock, the dollars may be off."
	},
	{
		id: "call",
		word: "The Call",
		line: "The gold-ribbon single of the day. Highest-conviction gated play. Not a guarantee."
	},
	{
		id: "best-value",
		word: "Best Value",
		line: "The column of smart extra vs the sportsbook fee. Not the gold ribbon."
	},
	{
		id: "parlay",
		word: "Combo Bet",
		line: "Multiple picks tied together. All must win to get paid, but it pays much higher."
	},
	{
		id: "same-game",
		word: "Same-Game Combo",
		line: "Multiple picks from the exact same game tied together."
	},
	{
		id: "who-wins",
		word: "Pick Who Wins",
		line: "Simply pick which team wins the game. No point spread."
	},
	{
		id: "margin",
		word: "Score Margin",
		line: "Your team must win by more than this number of points (or lose by less)."
	},
	{
		id: "combined",
		word: "Combined Score",
		line: "The total points or runs scored by both teams combined."
	},
	{
		id: "fee",
		word: "Sportsbook Fee",
		line: "The cut the sportsbook takes. Higher fee = worse deal for you."
	},
	{
		id: "smart-value",
		word: "Smart Value (+Edge)",
		line: "You are getting paid more than the true statistical chance of it happening."
	},
	{
		id: "beat-market",
		word: "Beating the Market",
		line: "Getting a better number early before the rest of the public moves the line."
	},
	{
		id: "smart-money",
		word: "Smart Money Moving",
		line: "Large amounts of money just moved this number. Act now before it gets worse."
	},
	{
		id: "push",
		word: "Tie / Refund",
		line: "The game landed on the exact number. You get your original money back."
	},
	{
		id: "luck",
		word: "Game Luck vs. Strategy",
		line: "Normal good or bad bounces (fumbles, referee calls) that happen in sports."
	},
	{
		id: "live",
		word: "Live",
		line: "The game already started."
	},
	{
		id: "log",
		word: "Log",
		line: "Where photographed tickets wait, then you tap Hit or Miss."
	},
	{
		id: "never-bet",
		word: "This site never places a bet",
		line: "You place it at Hard Rock Bet Florida if you want."
	}
];
var MORE_LINKS = [
	{
		to: "/more",
		hash: "how",
		label: "How this site works",
		note: "Four steps. Then you photograph Hard Rock."
	},
	{
		to: "/more",
		hash: "words",
		label: "Words we use",
		note: "Chance, look, photo, The Call, Best Value."
	},
	{
		to: "/more",
		hash: "money",
		label: "My money",
		note: "Core 85% and Fun 15%. What you typed on Start."
	},
	{
		to: "/gameday",
		hash: "",
		label: "Game day",
		note: "Kickoff, the pick, the dollars. One screen."
	},
	{
		to: "/parlay",
		hash: "",
		label: "Combos",
		note: "2-, 3-, and 4-pick tickets. Same-game included."
	},
	{
		to: "/learn",
		hash: "",
		label: "Learn",
		note: "Short lessons."
	},
	{
		to: "/guide",
		hash: "",
		label: "Guide",
		note: "The full walkthrough."
	},
	{
		to: "/slate",
		hash: "",
		label: "Fantasy",
		note: "DraftKings Fantasy — salary cap, not a Hard Rock ticket."
	},
	{
		to: "/alerts",
		hash: "",
		label: "Reminders / honesty",
		note: "Delays. No auto-bet. This site never places a bet."
	},
	{
		to: "/admin",
		hash: "",
		label: "Admin",
		note: "Allowlist, algorithm knobs, master ledger, feed health."
	}
];
function lookChipId(band) {
	if (band === "high") return "look-strong";
	if (band === "medium") return "look-fair";
	return "look-thin";
}
function tapeChip(stamp, researchOnly, fromUserPhoto) {
	if (fromUserPhoto) return {
		id: "photo-from",
		label: "Price from your photo"
	};
	if (researchOnly || stamp === "research") return {
		id: "research",
		label: "Research only — photo still needed for the live price"
	};
	if (stamp === "hr-fl" || stamp === "photographed") return {
		id: "tape-hr",
		label: "Hard Rock number (not from your photo)"
	};
	return {
		id: "photo-needed",
		label: "Photo to lock this price"
	};
}
/**
* Full-screen slide-down More drawer on mobile (large tap targets).
* Desktop keeps a compact panel under the header button.
* Portaled to document.body so header backdrop-filter cannot trap `fixed`.
*/
function MobileMoreDrawer() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { isAdmin } = useAccess();
	(0, import_react.useEffect)(() => {
		setOpen(false);
	}, [pathname]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		function onKey(e) {
			if (e.key === "Escape") setOpen(false);
		}
		window.addEventListener("keydown", onKey);
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = prev;
		};
	}, [open]);
	const overlay = open && typeof document !== "undefined" ? (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0 bg-navy-deep/70",
			"aria-label": "Close More",
			onClick: () => setOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			id: "more-panel",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "more-panel-title",
			className: "drawer-down fixed inset-0 flex h-dvh w-full flex-col overflow-y-auto bg-card p-5 shadow-[var(--shadow-stamp)] md:inset-auto md:right-4 md:top-16 md:h-auto md:max-h-[85dvh] md:w-[26rem] md:rounded-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "more-panel-title",
						className: "font-display text-2xl text-ink",
						children: "More"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted",
						children: ["Desk ", DESK_VERSION]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setOpen(false),
						className: "grid size-11 shrink-0 place-items-center rounded-md text-muted transition-transform duration-150 ease-out hover:bg-wash hover:text-ink active:scale-[0.96]",
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
							className: "size-4",
							strokeWidth: 1.75
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 sm:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-4 grid gap-2",
					children: HOW_IT_WORKS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md bg-wash px-3 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "stamp text-gold",
								children: s.n
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-medium text-ink",
								children: s.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: s.body
							})
						]
					}, s.n))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-1 pb-8",
					children: MORE_LINKS.filter((item) => item.to !== "/admin" || isAdmin).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						hash: item.hash || void 0,
						onClick: () => setOpen(false),
						className: "flex min-h-12 items-center justify-between gap-3 rounded-md px-3 py-3 hover:bg-wash",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm font-medium text-ink",
							children: item.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs text-muted",
							children: item.note
						})] })
					}) }, item.label))
				})
			]
		})]
	}), document.body) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen(true),
			className: cn("inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-transform duration-150 ease-out active:scale-[0.96]", open || pathname === "/more" ? "bg-gold text-navy-deep" : "text-muted hover:bg-wash hover:text-ink"),
			"aria-haspopup": "dialog",
			"aria-expanded": open,
			"aria-controls": "more-panel",
			"aria-label": "More",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
				className: "size-4",
				strokeWidth: 1.75
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden sm:inline",
				children: "More"
			})]
		}), overlay]
	});
}
var PRIMARY = [
	{
		to: "/today",
		label: "AI Picks",
		icon: Sparkles,
		featured: true
	},
	{
		to: "/board",
		label: "Games",
		icon: Newspaper
	},
	{
		to: "/parlay",
		label: "Combos",
		icon: Combine
	},
	{
		to: "/live",
		label: "Live",
		icon: Radio
	},
	{
		to: "/desk",
		label: "Log",
		icon: ClipboardList
	}
];
function isActive(pathname, to) {
	if (to === "/") return pathname === "/";
	return pathname === to || pathname.startsWith(`${to}/`);
}
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { isAdmin } = useAccess();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-gold focus:px-3 focus:py-2 focus:text-navy-deep",
				children: "Skip to main"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-40 border-b border-line/80 bg-paper/92 backdrop-blur-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex min-h-11 items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-9 place-items-center rounded-md bg-gold text-navy-deep shadow-[var(--shadow-stamp)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockMark, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "leading-tight",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display block text-lg font-semibold tracking-wide text-ink",
								children: BRAND.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-xs uppercase tracking-[0.16em] text-gold sm:block",
								children: BRAND.tagline
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin",
								className: cn("hidden min-h-11 items-center rounded-md px-3 text-sm font-medium sm:inline-flex", pathname === "/admin" ? "bg-gold text-navy-deep" : "text-muted hover:bg-wash hover:text-ink"),
								children: "Admin"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketChip, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden sm:block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileMoreDrawer, {})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rink-rule",
					"aria-hidden": "true"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				id: "main",
				className: "mx-auto max-w-6xl px-4 pb-32 pt-6",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleParlayPill, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mx-auto hidden max-w-6xl px-4 pb-32 text-xs text-muted lg:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"21+ for Hard Rock Bet. 18+ for classic daily fantasy / prediction markets. Call",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-gold",
						children: BRAND.helpline
					}),
					" if play is no longer fun. This site never places a bet. Delayed public odds. Not a prediction. Florida."
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm",
				"aria-label": "Main",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mx-auto grid max-w-6xl grid-cols-5",
					children: PRIMARY.map((item) => {
						const active = isActive(pathname, item.to);
						const featured = "featured" in item && item.featured;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-xs font-medium uppercase tracking-wide", active ? "text-gold" : "text-faint hover:text-ink"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("grid place-items-center rounded-md", featured && "size-8", featured && active && "bg-gold text-navy-deep", featured && !active && "bg-wash text-gold"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
									className: "size-4",
									strokeWidth: active || featured ? 2 : 1.6
								})
							}), item.label]
						}) }, item.to);
					})
				})
			})
		]
	});
}
function LockMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className: "size-5",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "5",
				y: "11",
				width: "14",
				height: "10",
				rx: "1.5",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M8 11V8a4 4 0 0 1 8 0v3",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "12",
				cy: "16",
				r: "1.25",
				fill: "currentColor"
			})
		]
	});
}
function waitingPlay(lane, because) {
	return {
		lane,
		title: "Photograph today's board",
		action: "Take a picture of Hard Rock Bet Florida so we can name a ticket playing today.",
		because,
		symbol: "PHOTO",
		optionKind: "main",
		venue: BRAND.venueLive,
		conviction: "medium",
		liveFits: false,
		unitCount: 0
	};
}
function decorateMain(opts) {
	const pick = shortPick(opts.row.selection, opts.row.marketType);
	const stake = Math.max(opts.stake, DEFAULTS.dustUsd);
	const kickoffEnglish = formatKickoff(opts.row.start);
	const matchupEnglish = matchupLine(opts.row.away, opts.row.home);
	return {
		lane: opts.lane,
		title: `${formatBetUsd(stake)} on ${pick}`,
		action: opts.action,
		because: opts.because,
		symbol: opts.symbol,
		optionKind: opts.optionKind,
		venue: BRAND.venueLive,
		conviction: opts.conviction,
		liveFits: opts.liveFits,
		unitCount: 1,
		details: `${opts.row.sport} · ${matchupEnglish} · ${kickoffEnglish}`,
		price: opts.row.price,
		fairProb: opts.row.fairProb,
		plainPick: pick,
		oddsEnglish: oddsInEnglish(opts.row.price),
		payoutEnglish: payoutOnStake(stake, opts.row.price),
		fairEnglish: chanceInEnglish(opts.row.fairProb),
		marketExplain: marketInEnglish(opts.row.marketType),
		home: opts.row.home,
		away: opts.row.away,
		start: opts.row.start,
		kickoffEnglish,
		matchupEnglish,
		sport: opts.row.sport,
		eventId: opts.row.eventId,
		ticketPct: opts.row.ticketPct,
		handlePct: opts.row.handlePct,
		tapeLean: opts.row.tapeLean,
		tapeNote: opts.row.tapeNote
	};
}
function decorateParlay(opts) {
	const n = opts.spicy.legs.length;
	const decimalPayout = product(opts.spicy.legs.map((l) => americanToDecimal(l.price)));
	const shown = shownCombinedChance(opts.spicy.combinedFair, decimalPayout, n, Boolean(opts.spicy.sameGame));
	const fairPct = formatChancePct(shown) ?? `${Math.round(shown * 100)}%`;
	const names = opts.spicy.legs.map((l) => shortPick(l.selection, l.marketType)).join(" + ");
	const stake = Math.max(opts.stake, DEFAULTS.dustUsd);
	const legs = opts.spicy.legs.map((l) => ({
		selection: shortPick(l.selection, l.marketType),
		home: l.home,
		away: l.away,
		start: l.start,
		kickoffEnglish: formatKickoff(l.start),
		matchupEnglish: matchupLine(l.away, l.home),
		sport: l.sport
	}));
	return {
		lane: opts.lane,
		title: opts.spicy.pricedAsEntertainment ? `${n}-game parlay — fun money` : `${n}-game parlay`,
		action: `Bet ${formatBetUsd(stake)} on ${n} games together at Hard Rock Bet. ${n === 2 ? "Both" : n === 3 ? "All three" : "All four"} must win.`,
		because: `${opts.becausePrefix ?? ""}${opts.spicy.reason} Combined true chance ${fairPct}. A parlay pays more because it is harder — this is not ${n} games you already won.`,
		symbol: n === 4 ? "4LEG" : n === 3 ? "3LEG" : "2LEG",
		optionKind: "parlay",
		venue: opts.spicy.researchOnly ? "Research only" : BRAND.venueLive,
		conviction: opts.spicy.combinedEv >= 0 ? "medium" : "low",
		liveFits: opts.liveFits,
		unitCount: 1,
		details: names,
		pricedAsEntertainment: opts.spicy.pricedAsEntertainment,
		combinedFair: opts.spicy.combinedFair,
		decimalPayout,
		fairEnglish: `Combined true chance ${fairPct} — that is the real ticket, not each game on its own.`,
		marketExplain: "A parlay is two, three, or four games on one ticket. Every game must win or the whole bet loses. Pays more because it is harder.",
		legs,
		kickoffEnglish: legs.map((l) => l.kickoffEnglish).filter(Boolean).join(" · "),
		matchupEnglish: legs.map((l) => l.matchupEnglish).filter(Boolean).join(" · ")
	};
}
function buildChecks(input, recommended, bestMain) {
	const { bankroll, scan, snapshot } = input;
	const seed = isSeed(bankroll);
	const tiny = isTiny(bankroll);
	const unit = unitDollars(bankroll, input.unitPct);
	const publicHot = snapshot.publicSplits.find((s) => (s.ticketPct || s.publicPct) >= 70);
	const tapeSplit = snapshot.publicSplits.find((s) => s.ticketPct != null && s.handlePct != null && s.ticketPct !== s.handlePct) ?? publicHot;
	const sizeUsed = seed || tiny ? "blocks" : "supports";
	const sizeFinding = seed ? `Bankroll is ${formatUsd(bankroll)}. A 1% bet cannot even clear $1. Size up to $100+ before placing a live ticket — we still name the three tickets.` : tiny ? `Small bankroll (${formatUsd(bankroll)}). Suggested bet ${formatBetUsd(unit)}. Keep parlays as research until you size up.` : `Ready size. Suggested bet ${formatBetUsd(unit)} (${(input.unitPct * 100).toFixed(0)}% of your money).`;
	const hasFair = Boolean(bestMain && bestMain.tag === "fair_or_better");
	let juiceUsed = "noted";
	let juiceFinding = "No two-sided Hard Rock price to grade.";
	if (scan.missingBoard) {
		juiceUsed = "noted";
		juiceFinding = "Delayed odds are missing. Photograph a Hard Rock price so we can grade it.";
	} else if (hasFair && bestMain) {
		juiceUsed = "supports";
		juiceFinding = `Hard Rock ${shortPick(bestMain.selection, bestMain.marketType)} edge ${formatPct(bestMain.evPct, 1)} versus true odds. Fair or better.`;
	} else if (bestMain && bestMain.tag === "close_enough") {
		juiceUsed = "noted";
		juiceFinding = `Almost-fair one-game bet ${formatPct(bestMain.evPct, 1)} edge. Still the safest ticket — size it as fun money if the number is against you.`;
	} else if (bestMain) {
		juiceUsed = "noted";
		juiceFinding = `Best one-game on the board is ${shortPick(bestMain.selection, bestMain.marketType)} at a taxed price. We still name it instead of leaving the card blank.`;
	} else {
		juiceUsed = "blocks";
		juiceFinding = "No Hard Rock one-game bet to grade. Photograph a price.";
	}
	const illegal = scan.rows.find((r) => r.tag === "illegal_fl");
	const inPlayOnly = scan.rows.length > 0 && scan.rows.every((r) => r.tag === "in_play");
	const marketUsed = illegal || inPlayOnly ? "blocks" : "noted";
	const marketFinding = illegal ? illegal.isProp && isCollegeSport(illegal.sport) ? "A college player bet is on the board — blocked as a Florida live card." : "A DraftKings / FanDuel sportsbook ticket was offered as live — we block it." : inPlayOnly ? "Every game has already started. We only cover bets placed before the game." : "Before-the-game winner, spread, or over/under is the only live sports bet we will recommend.";
	const clockFinding = snapshot.hours.preGameOpen ? `Before-the-game window. ${snapshot.hours.label}` : `Session note: ${snapshot.hours.label}`;
	const haltUsed = "discarded";
	const haltFinding = "This site never places a bet, so there is no daily or weekly stop. Lock paper tickets whenever you want. You still decide at Hard Rock Bet.";
	const boardUsed = tapeSplit ? "noted" : "noted";
	const boardFinding = tapeSplit ? `Bets ${tapeSplit.ticketPct || tapeSplit.publicPct}% · money ${tapeSplit.handlePct ?? tapeSplit.publicPct}% on ${tapeSplit.side.replace(/\s+ML\b/gi, " to win")}${tapeSplit.steam ? " · steam" : ""}. ${tapeSplit.note ?? "Tickets and dollars are a layer in the ensemble — we do not copy the crowd and we do not auto-fade it."}` : "No public ticket/handle split on this board yet. When it lands, bets % vs money % is a layer — never a copy-trade.";
	const collegeProp = scan.rows.find((r) => r.isProp && isCollegeSport(r.sport));
	const propsUsed = collegeProp ? "blocks" : "discarded";
	const propsFinding = collegeProp ? "College player bets are not allowed on Hard Rock Bet. Blocked." : "Pro player bets are research only. They never become today's pick.";
	const newsFinding = snapshot.news[0] ? `Headline “${snapshot.news[0].title}” — ignored. Not a reason to bet.` : "Headlines and touts are ignored. This app does not copy a 'lock' thread.";
	const venueIllegal = scan.rows.find((r) => r.venueNote === "dk_sportsbook" || r.venueNote === "fd_sportsbook");
	const venueUsed = venueIllegal ? "blocks" : "noted";
	const venueFinding = venueIllegal ? "DraftKings / FanDuel sportsbooks are not licensed in Florida. Hard Rock Bet is the live sportsbook. DraftKings Fantasy is a different app." : `Live sports go on ${BRAND.venueLive}. This site never places the bet. DraftKings Fantasy is the roster builder.`;
	const used = {
		size: {
			used: sizeUsed,
			finding: sizeFinding
		},
		juice: {
			used: juiceUsed,
			finding: juiceFinding
		},
		market: {
			used: marketUsed,
			finding: marketFinding
		},
		clock: {
			used: "noted",
			finding: clockFinding
		},
		halt: {
			used: haltUsed,
			finding: haltFinding
		},
		board: {
			used: boardUsed,
			finding: boardFinding
		},
		props: {
			used: propsUsed,
			finding: propsFinding
		},
		news: {
			used: "discarded",
			finding: newsFinding
		},
		delay: {
			used: "blocks",
			finding: "Odds are delayed public numbers. Delay always blocks auto-betting. A quote is not the price you will get."
		},
		venue: {
			used: venueUsed,
			finding: venueFinding
		},
		stack: {
			used: "supports",
			finding: "A $200 bankroll betting 3-game parlays is not a path to $1M on a human timetable. The one-game ticket is the grown-up play. Real long-term growth lives in saving and investing, not here."
		}
	};
	return CHECK_ORDER.map((id) => ({
		id,
		label: CHECK_LABELS[id],
		used: used[id].used,
		finding: used[id].finding
	}));
}
function buildPlays(input) {
	const { bankroll, unitPct, scan, snapshot } = input;
	const seed = isSeed(bankroll);
	const tiny = isTiny(bankroll);
	const unit = unitDollars(bankroll, unitPct);
	const size = sizeLabel(bankroll);
	const missing = scan.missingBoard;
	const bestMain = scan.bestMain ?? scan.topSingles?.[0] ?? null;
	const two = (scan.bestTwo && scan.bestTwo.legs.length === 2 ? scan.bestTwo : null) ?? scan.topTwos?.[0] ?? null;
	const three = scan.topThrees?.[0] ?? (scan.bestSpicy && scan.bestSpicy.legs.length >= 3 ? scan.bestSpicy : null) ?? null;
	const flip = scan.bestFlip;
	const stake = Math.max(unit, DEFAULTS.dustUsd);
	const liveOk = !seed && unit >= DEFAULTS.dustUsd;
	const sizeNote = seed ? `Your ${formatUsd(bankroll)} is under the $100 floor, so don't place this live yet. The ticket itself is still real.` : tiny ? `Small bankroll (${formatUsd(bankroll)}). Suggested bet ${formatBetUsd(unit)}.` : `Bankroll looks ${size === "full" || size === "working" ? "ready" : size}.`;
	let safe;
	if (missing && !bestMain) safe = waitingPlay("safe", "Delayed odds are missing. Photograph a Hard Rock price and we will name the one-game ticket playing today.");
	else if (bestMain) {
		const pick = shortPick(bestMain.selection, bestMain.marketType);
		safe = decorateMain({
			lane: "safe",
			row: bestMain,
			stake,
			liveFits: liveOk,
			symbol: "MAIN",
			optionKind: "main",
			conviction: bestMain.tag === "fair_or_better" ? "medium" : "low",
			action: `Bet ${formatBetUsd(stake)} on ${pick} at Hard Rock Bet. That's who wins / a spread / over-under — one game.`,
			because: `${sizeNote} Confirm the live price at Hard Rock Bet, then place it yourself.`
		});
	} else safe = waitingPlay("safe", "No game playing today on this delayed board. Photograph a Hard Rock price, or check Games for later this week.");
	let middle;
	if (two) middle = decorateParlay({
		lane: "middle",
		spicy: two,
		stake,
		liveFits: liveOk && !tiny,
		becausePrefix: `${sizeNote} `
	});
	else if (bestMain) {
		const second = scan.rows.find((r) => r.eventId !== bestMain.eventId && r.tag !== "illegal_fl" && r.tag !== "in_play" && !r.isProp);
		if (second) {
			const pick = shortPick(second.selection, second.marketType);
			middle = decorateMain({
				lane: "middle",
				row: second,
				stake,
				liveFits: liveOk && !tiny,
				symbol: "MAIN",
				optionKind: "main",
				conviction: "low",
				action: `No 2-game parlay cleared the floor. Next one-game: ${formatBetUsd(stake)} on ${pick}.`,
				because: `${sizeNote} We still name a ticket instead of leaving this card blank.`
			});
		} else middle = {
			...safe,
			lane: "middle",
			symbol: "MAIN"
		};
	} else middle = waitingPlay("middle", "Need two games playing today before we can name a parlay.");
	let risky;
	if (three) risky = decorateParlay({
		lane: "risky",
		spicy: three,
		stake,
		liveFits: liveOk && !tiny,
		becausePrefix: `${sizeNote} Highest-chance 3-game parlay among games playing today. All three must hit. `
	});
	else if (flip) {
		const pick = shortPick(flip.selection, flip.marketType);
		risky = decorateMain({
			lane: "risky",
			row: flip,
			stake,
			liveFits: liveOk && !tiny,
			symbol: "FLIP",
			optionKind: "main",
			conviction: "low",
			action: `Bet ${formatBetUsd(stake)} on ${pick} at Hard Rock Bet. No 3-game parlay cleared — this is the ~50/50 that pays plus money.`,
			because: `${sizeNote} Confirm the live price at Hard Rock Bet.`
		});
	} else if (scan.bestSpicy && scan.bestSpicy !== two) risky = decorateParlay({
		lane: "risky",
		spicy: scan.bestSpicy,
		stake,
		liveFits: false,
		becausePrefix: `${sizeNote} Longer parlay as a last resort. `
	});
	else if (input.dfsReady) risky = {
		lane: "risky",
		title: "Build a fantasy lineup",
		action: "Build one safer DraftKings classic lineup and one long-shot lineup. Not a Hard Rock Bet ticket.",
		because: "No 3-game parlay cleared. Fantasy is a separate app (DraftKings Fantasy).",
		symbol: "DFS",
		optionKind: "dfs_gpp",
		venue: BRAND.venueDfs,
		conviction: "low",
		liveFits: false,
		unitCount: 0,
		marketExplain: "Daily fantasy — you build a roster under a salary cap. Not a bet on one team."
	};
	else risky = waitingPlay("risky", "Need three games playing today before we can name a 3-game parlay. Photograph a Hard Rock board.");
	const recommended = "safe";
	const recPlay = safe;
	const checks = buildChecks(input, recommended, bestMain);
	const learnMore = [
		`Your money: ${formatUsd(bankroll)}. Suggested bet ${formatBetUsd(unit)} (no units — that dollar amount is the bet).`,
		bestMain ? `Safest ticket: ${shortPick(bestMain.selection, bestMain.marketType)}. ${oddsInEnglish(bestMain.price)} ${chanceInEnglish(bestMain.fairProb)}` : "Photograph a Hard Rock price to name the one-game ticket.",
		flip && flip.eventId ? `Toss-up still on the board: ${shortPick(flip.selection, flip.marketType)} — ${chanceInEnglish(flip.fairProb)} ${oddsInEnglish(flip.price)}` : "",
		"No auto-stop. This site never places a bet, so a down day does not lock you out of the paper log.",
		snapshot.sample ? "This board includes delayed research-sample numbers — not fills. Confirm any live number at Hard Rock Bet." : "Delayed public numbers. Confirm at Hard Rock Bet before acting.",
		"Moneyline (ML) means who wins the game. Plus money (+160) means the underdog — you get paid more than you bet. Photograph a DraftKings contest if you want a fantasy roster and a buy-in instead.",
		"Ignore the recommended badge if you want. The app will not nag."
	].filter(Boolean).join(" ");
	const verdict = {
		doThis: recPlay.action,
		because: recPlay.because,
		venue: recPlay.venue,
		symbol: recPlay.symbol,
		lane: recommended,
		conviction: recPlay.conviction,
		checks,
		learnMore
	};
	const singles = (scan.topSingles?.length ? scan.topSingles : bestMain ? [bestMain] : []).slice(0, 3).map((row, i) => decorateMain({
		lane: "safe",
		row,
		stake,
		liveFits: liveOk,
		symbol: i === 0 ? "MAIN" : `S${i + 1}`,
		optionKind: "main",
		conviction: row.tag === "fair_or_better" ? "medium" : "low",
		action: `Bet ${formatBetUsd(stake)} on ${shortPick(row.selection, row.marketType)} at Hard Rock Bet. One game.`,
		because: `${sizeNote} Ranked by chance × payout. Confirm the live price at Hard Rock Bet.`
	}));
	const twoLegs = (scan.topTwos?.length ? scan.topTwos : two ? [two] : []).slice(0, 3).map((p) => decorateParlay({
		lane: "middle",
		spicy: p,
		stake,
		liveFits: liveOk && !tiny,
		becausePrefix: `${sizeNote} `
	}));
	const threeLegs = (scan.topThrees?.length ? scan.topThrees : three ? [three] : []).slice(0, 3).map((p) => decorateParlay({
		lane: "risky",
		spicy: p,
		stake,
		liveFits: liveOk && !tiny,
		becausePrefix: `${sizeNote} `
	}));
	return {
		safe,
		middle,
		risky,
		recommended,
		verdict,
		singles,
		twoLegs,
		threeLegs
	};
}
function scoreOptions(board, input) {
	const seed = isSeed(input.bankroll);
	const tiny = isTiny(input.bankroll);
	const fair = Boolean(input.scan.bestMain && input.scan.bestMain.tag === "fair_or_better");
	const inPlayOnly = input.scan.rows.length > 0 && input.scan.rows.every((r) => r.tag === "in_play");
	const collegeProp = input.scan.rows.some((r) => r.isProp && isCollegeSport(r.sport));
	const parlay = input.scan.bestTwo ?? input.scan.bestSpicy;
	const unit = unitDollars(input.bankroll, input.unitPct);
	return [
		{
			kind: "sit",
			status: "caution",
			note: "Sitting is allowed. The three cards still name real tickets so you always have a next step."
		},
		{
			kind: "main",
			status: inPlayOnly ? "blocked" : board.recommended === "safe" && fair && !seed ? "go" : "caution",
			note: inPlayOnly ? "Games already started — dropped." : `One-game ticket at ${formatBetUsd(Math.max(unit, DEFAULTS.dustUsd))}. Moneyline = who wins.`
		},
		{
			kind: "parlay",
			status: tiny || seed ? "seed" : parlay ? "caution" : "blocked",
			note: tiny || seed ? "Research only at this size." : parlay ? "This is the balanced card — two games, both must hit." : "No 2-game parlay cleared the chance floor."
		},
		{
			kind: "prop",
			status: collegeProp ? "blocked" : "lagged",
			note: collegeProp ? "College player bets blocked on Hard Rock Bet." : "Pro player bets are research. Never today's pick."
		},
		{
			kind: "dfs_cash",
			status: !input.dfsReady ? "caution" : tiny ? "seed" : "go",
			note: !input.dfsReady ? "Photograph a DraftKings player list and a contest buy-in." : tiny ? "Do not confuse a small sports bankroll with a fantasy entry fee." : "Confirmed slate — one safer lineup."
		},
		{
			kind: "dfs_gpp",
			status: !input.dfsReady ? "caution" : tiny ? "seed" : "caution",
			note: "Never the sports pick. DraftKings Fantasy, not Sportsbook."
		},
		{
			kind: "predict",
			status: "lagged",
			note: "Event contracts on a different platform. Catalog + Learn only. Ignored as today's pick."
		},
		{
			kind: "path",
			status: "go",
			note: "Long-term math versus the goal you typed. Not a forecast."
		}
	];
}
function rankDesk(snapshot, halt, settings) {
	const scan = buildScan(snapshot, halt, settings);
	return {
		scan,
		picks: buildDeskPicks(scan, snapshot)
	};
}
/** Fingerprint of posted prices so ranking ignores clock-only refreshes. */
function oddsFingerprint(snapshot) {
	return snapshot.quotes.map((q) => `${q.eventId}:${q.marketType}:${q.side}:${q.price}:${q.point ?? ""}:${q.inPlay ? 1 : 0}`).sort().join("|");
}
function DeskDecisionProvider({ children }) {
	const q = useBoardQuery();
	const liveBankroll = useDeskStore((s) => s.liveBankroll);
	const unitPct = useDeskStore((s) => s.unitPct);
	const stake = selectUnit({
		liveBankroll,
		unitPct,
		stakeDollars: useDeskStore((s) => s.stakeDollars)
	});
	const stakePct = liveBankroll > 0 ? stake / liveBankroll : unitPct;
	const entertainmentBudgeted = useDeskStore((s) => s.entertainmentBudgeted);
	const ignoreRibbon = useDeskStore((s) => s.ignoreRibbon);
	const slate = useDeskStore((s) => s.slate);
	const confirmedTickets = useDeskStore((s) => s.confirmedTickets);
	const halt = useDeskStore(selectDailyHalt);
	const weeklyHalt = useDeskStore(selectWeeklyHalt);
	const settingsQuery = useQuery({
		queryKey: ["desk-settings"],
		queryFn: () => getDeskSettings(),
		staleTime: 6e4,
		refetchOnWindowFocus: false,
		retry: 1
	});
	const hiddenQuery = useQuery({
		queryKey: ["desk-hidden"],
		queryFn: () => listHiddenPicks(),
		staleTime: 6e4,
		refetchOnWindowFocus: false,
		retry: 1
	});
	const settings = settingsQuery.data ?? DEFAULT_DESK_SETTINGS;
	const remoteHidden = hiddenQuery.data ?? [];
	const snapshot = (0, import_react.useMemo)(() => overlayConfirmed(q.data, confirmedTickets), [q.data, confirmedTickets]);
	const rankSource = q.data;
	const fingerprint = rankSource ? oddsFingerprint(rankSource) : "";
	const settingsKey = JSON.stringify(rankSettingsOf(settings));
	const [scan, setScan] = (0, import_react.useState)(null);
	const [picks, setPicks] = (0, import_react.useState)(null);
	const [ranking, setRanking] = (0, import_react.useState)(false);
	const [rankMs, setRankMs] = (0, import_react.useState)(null);
	const job = (0, import_react.useRef)(0);
	const workerRef = (0, import_react.useRef)(null);
	const lastKey = (0, import_react.useRef)("");
	const rankSourceRef = (0, import_react.useRef)(rankSource);
	const settingsRef = (0, import_react.useRef)(settings);
	rankSourceRef.current = rankSource;
	settingsRef.current = settings;
	(0, import_react.useEffect)(() => {
		return () => {
			workerRef.current?.terminate();
			workerRef.current = null;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const snap = rankSourceRef.current;
		if (!snap || !fingerprint) return;
		const key = `${fingerprint}|${halt}|${settingsKey}`;
		if (key === lastKey.current) return;
		lastKey.current = key;
		const id = ++job.current;
		setRanking(true);
		let fallbackTimer = null;
		let cancelled = false;
		const rankSettings = rankSettingsOf(settingsRef.current);
		const apply = (nextScan, nextPicks, ms) => {
			if (cancelled || id !== job.current) return;
			setScan(nextScan);
			setPicks(nextPicks);
			setRankMs(ms);
			setRanking(false);
		};
		const runFallback = () => {
			if (cancelled || id !== job.current) return;
			fallbackTimer = setTimeout(() => {
				if (cancelled || id !== job.current) return;
				const t0 = Date.now();
				const ranked = rankDesk(snap, halt, rankSettings);
				apply(ranked.scan, ranked.picks, Date.now() - t0);
			}, 0);
		};
		(async () => {
			try {
				if (typeof Worker === "undefined") {
					runFallback();
					return;
				}
				let worker = workerRef.current;
				if (!worker) {
					const mod = await import("./rank.worker-C91o6Hls.mjs");
					if (cancelled || id !== job.current) return;
					worker = new mod.default();
					workerRef.current = worker;
				}
				worker.onmessage = (e) => {
					if (e.data?.id != null && e.data.id !== id) return;
					if (e.data?.error) {
						runFallback();
						return;
					}
					apply(e.data.scan, e.data.picks, e.data.ms);
				};
				worker.onerror = () => {
					workerRef.current?.terminate();
					workerRef.current = null;
					runFallback();
				};
				worker.postMessage({
					id,
					snapshot: snap,
					halt,
					settings: rankSettings
				});
			} catch {
				runFallback();
			}
		})();
		return () => {
			cancelled = true;
			if (fallbackTimer) clearTimeout(fallbackTimer);
		};
	}, [
		fingerprint,
		halt,
		settingsKey
	]);
	const board = (0, import_react.useMemo)(() => {
		if (!snapshot || !scan) return null;
		return buildPlays({
			bankroll: liveBankroll,
			unitPct: stakePct,
			halt,
			weeklyHalt,
			scan,
			snapshot,
			entertainmentBudgeted,
			dfsReady: Boolean(slate?.confirmed && slate.cash),
			ignoreRibbon
		});
	}, [
		snapshot,
		scan,
		liveBankroll,
		stakePct,
		halt,
		weeklyHalt,
		entertainmentBudgeted,
		slate,
		ignoreRibbon
	]);
	const value = {
		query: q,
		snapshot,
		scan,
		picks,
		board,
		options: (0, import_react.useMemo)(() => {
			if (!board || !scan || !snapshot) return [];
			return scoreOptions(board, {
				bankroll: liveBankroll,
				unitPct: stakePct,
				halt,
				weeklyHalt,
				scan,
				snapshot,
				dfsReady: Boolean(slate?.confirmed && slate.cash)
			});
		}, [
			board,
			scan,
			snapshot,
			liveBankroll,
			stakePct,
			halt,
			weeklyHalt,
			slate
		]),
		halt,
		weeklyHalt,
		ranking,
		rankMs,
		settings,
		remoteHidden
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskDecisionContext.Provider, {
		value,
		children
	});
}
var LEDGER_FILE = "sports_lock_ledger.json";
function paperToLedger(t) {
	const marketType = t.kind === "parlay" ? "PARLAY" : t.kind === "prop" ? "PROP" : /spread|\\+|−|-\\d/.test(t.description) ? "SPREAD" : /over|under/i.test(t.description) ? "TOTAL" : "MONEYLINE";
	const result = t.status === "win" ? "HIT" : t.status === "loss" ? "MISS" : t.status === "void" ? "PUSH" : "PENDING";
	const implied = t.price != null && Number.isFinite(t.price) ? t.price >= 0 ? 100 / (t.price + 100) : Math.abs(t.price) / (Math.abs(t.price) + 100) : void 0;
	const edge = t.chance != null && implied != null ? Math.round((t.chance - implied) * 1e3) / 10 : 0;
	return {
		id: t.id,
		timestamp: t.createdAt,
		sport: t.sport ?? "",
		marketType,
		teams: {
			home: t.home ?? "",
			away: t.away ?? ""
		},
		ticketName: t.description,
		hardRockOdds: t.price ?? 0,
		deskTrueProbability: t.chance ?? 0,
		expectedEdgePct: edge,
		stakeDollars: t.stake,
		result,
		layerSnapshots: {}
	};
}
function downloadLedger(entries) {
	if (typeof document === "undefined") return;
	const blob = new Blob([JSON.stringify({
		version: 1,
		entries
	}, null, 2)], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = LEDGER_FILE;
	a.click();
	URL.revokeObjectURL(url);
}
/** Authenticated sessions persist the log so clearing the browser does not wipe Hit / Miss. */
function LedgerSync() {
	const user = useCurrentUser();
	const hydrated = useDeskStore((s) => s.hydrated);
	const paperTickets = useDeskStore((s) => s.paperTickets);
	const pulled = (0, import_react.useRef)(false);
	const lastSent = (0, import_react.useRef)("");
	(0, import_react.useEffect)(() => {
		if (!user || !hydrated || pulled.current) return;
		pulled.current = true;
		pullMyLedger().then((entries) => {
			if (!entries.length) return;
			const store = useDeskStore.getState();
			const have = new Set(store.paperTickets.map((t) => t.id));
			const extras = [];
			for (const e of entries) {
				if (have.has(e.id)) continue;
				extras.push({
					id: e.id,
					createdAt: e.timestamp,
					description: e.ticketName,
					home: e.teams.home,
					away: e.teams.away,
					kind: e.marketType === "PARLAY" ? "parlay" : e.marketType === "PROP" ? "prop" : "main",
					price: e.hardRockOdds || void 0,
					chance: e.deskTrueProbability || void 0,
					stake: e.stakeDollars,
					status: e.result === "HIT" ? "win" : e.result === "MISS" ? "loss" : e.result === "PUSH" ? "void" : "open",
					venue: "paper",
					gameIds: []
				});
			}
			if (extras.length) useDeskStore.setState({ paperTickets: [...extras, ...store.paperTickets] });
		}).catch(() => {});
	}, [user, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!user || !hydrated) return;
		const payload = JSON.stringify(paperTickets.map((t) => t.id + t.status + t.stake));
		if (payload === lastSent.current) return;
		const timer = window.setTimeout(() => {
			lastSent.current = payload;
			pushMyLedger({ data: { entries: paperTickets.map(paperToLedger) } }).catch(() => {});
		}, 900);
		return () => window.clearTimeout(timer);
	}, [
		paperTickets,
		user,
		hydrated
	]);
	return null;
}
function AccessGate({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { user, sessionPending, accessPending, access, isApproved, refetch } = useAccess();
	if (sessionPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionSplash, {});
	if (!user) {
		if (pathname === "/login") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	}
	if (accessPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionSplash, {});
	if (!isApproved) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PendingAccess, {
		email: access?.email || user.primaryEmail,
		requestStatus: access?.requestStatus ?? "none",
		onRequested: () => void refetch()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DeskDecisionProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LedgerSync, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children })] });
}
function SessionSplash() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-paper px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stamp text-gold",
					children: BRAND.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-4 h-10 w-48 animate-pulse rounded-md bg-wash" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "Checking your desk access…"
				})
			]
		})
	});
}
function PendingAccess({ email, requestStatus, onRequested }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)("");
	const denied = requestStatus === "denied";
	const sent = requestStatus === "pending";
	async function submit() {
		setBusy(true);
		setNote("");
		try {
			await requestAccess();
			setNote("Request sent. The admin will review it.");
			onRequested();
		} catch (err) {
			setNote(err instanceof Error ? err.message : "Could not send the request.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-paper px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "w-full max-w-md paper-card p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stamp text-gold",
					children: "Private desk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-3 text-3xl text-ink",
					children: "Access Pending Approval by Admin"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-ink/80",
					children: [
						email ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							"Signed in as ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-ink",
								children: email
							}),
							". This desk is allowlist-only."
						] }) : "This desk is allowlist-only.",
						" ",
						"The owner reviews requests. This site never places a bet."
					]
				}),
				denied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 rounded-md bg-wash px-3 py-2 text-sm text-muted",
					children: "That email was not approved. You can send another request."
				}) : null,
				sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-gold",
					children: "Your request is in the queue. You will get in once the admin approves it."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-5 w-full",
					type: "button",
					disabled: busy,
					onClick: () => void submit(),
					children: busy ? "Sending…" : "Submit a request"
				}),
				note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: note
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4 w-full",
					type: "button",
					variant: "outline",
					onClick: () => void signOut("/login"),
					children: "Sign out"
				})
			]
		})
	});
}
var styles_default = "/assets/styles-p3t9lDQr.css";
var fetchSessionUser = createServerFn({ method: "GET" }).handler(createSsrRpc("2c4985e96c199268f7f639534cb5e8e31d6b19d43286bf77416413db60ffde26"));
var Route$20 = createRootRoute({
	beforeLoad: async () => ({ sessionUser: await fetchSessionUser() }),
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: BRAND.name },
			{
				name: "description",
				content: BRAND.ogDescription
			},
			{
				name: "theme-color",
				content: "#0B0B0C"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Oswald:wght@500;600;700&display=swap"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	const [queryClient] = (0, import_react.useState)(() => new QueryClient({ defaultOptions: { queries: {
		refetchOnWindowFocus: false,
		retry: 1,
		staleTime: 6e4
	} } }));
	(0, import_react.useEffect)(() => {
		Promise.resolve(useDeskStore.persist.rehydrate()).then(() => {
			useDeskStore.getState().markHydrated();
			useDeskStore.getState().rollAnchorsIfNeeded();
		});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-paper text-ink",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
					client: queryClient,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$18 = () => import("./routes-BDeM56pw.mjs");
var Route$19 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./admin-BWK3y5sq.mjs");
var Route$18 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./alerts-DEvKjVRE.mjs");
var Route$17 = createFileRoute("/alerts")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./board-Bm8yVkMX.mjs");
var Route$16 = createFileRoute("/board")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./desk-IQJIwBIJ.mjs");
var Route$15 = createFileRoute("/desk")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./gameday-Bq1Y8YGw.mjs");
var Route$14 = createFileRoute("/gameday")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./guide-DQCVLOVk.mjs");
var Route$13 = createFileRoute("/guide")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./learn-Dh6PW_PK.mjs");
var Route$12 = createFileRoute("/learn")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./live-CgzxOWbd.mjs");
var Route$11 = createFileRoute("/live")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./login-DvJzPmRY.mjs");
var Route$10 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./more-CgKykSGI.mjs");
var Route$9 = createFileRoute("/more")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./options-PlBik_TA.mjs");
var Route$8 = createFileRoute("/options")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./parlay-CU8J5RH7.mjs");
var Route$7 = createFileRoute("/parlay")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./path-RKHRaW_A.mjs");
var Route$6 = createFileRoute("/path")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./slate-D397G4U4.mjs");
var Route$5 = createFileRoute("/slate")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./ticket-rcobcQ8i.mjs");
var Route$4 = createFileRoute("/ticket")({
	validateSearch: (s) => ({ id: ticketSearchId(s) }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
function ticketSearchId(s) {
	const raw = s.id;
	if (typeof raw === "string" && raw) return raw;
	if (Array.isArray(raw)) return raw.map(String).join("|");
	if (raw != null && raw !== "") return String(raw);
	return "";
}
var $$splitComponentImporter$2 = () => import("./today-DGKcgeQz.mjs");
var Route$3 = createFileRoute("/today")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./game._eventId-DfkUtHjl.mjs");
var Route$2 = createFileRoute("/game/$eventId")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./option._kind-ynFb0r5w.mjs");
var Route$1 = createFileRoute("/option/$kind")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var rootRouteChildren = {
	IndexRoute: Route$19.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$20
	}),
	AdminRoute: Route$18.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$20
	}),
	AlertsRoute: Route$17.update({
		id: "/alerts",
		path: "/alerts",
		getParentRoute: () => Route$20
	}),
	BoardRoute: Route$16.update({
		id: "/board",
		path: "/board",
		getParentRoute: () => Route$20
	}),
	DeskRoute: Route$15.update({
		id: "/desk",
		path: "/desk",
		getParentRoute: () => Route$20
	}),
	GamedayRoute: Route$14.update({
		id: "/gameday",
		path: "/gameday",
		getParentRoute: () => Route$20
	}),
	GuideRoute: Route$13.update({
		id: "/guide",
		path: "/guide",
		getParentRoute: () => Route$20
	}),
	LearnRoute: Route$12.update({
		id: "/learn",
		path: "/learn",
		getParentRoute: () => Route$20
	}),
	LiveRoute: Route$11.update({
		id: "/live",
		path: "/live",
		getParentRoute: () => Route$20
	}),
	LoginRoute: Route$10.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$20
	}),
	MoreRoute: Route$9.update({
		id: "/more",
		path: "/more",
		getParentRoute: () => Route$20
	}),
	OptionsRoute: Route$8.update({
		id: "/options",
		path: "/options",
		getParentRoute: () => Route$20
	}),
	ParlayRoute: Route$7.update({
		id: "/parlay",
		path: "/parlay",
		getParentRoute: () => Route$20
	}),
	PathRoute: Route$6.update({
		id: "/path",
		path: "/path",
		getParentRoute: () => Route$20
	}),
	SlateRoute: Route$5.update({
		id: "/slate",
		path: "/slate",
		getParentRoute: () => Route$20
	}),
	TicketRoute: Route$4.update({
		id: "/ticket",
		path: "/ticket",
		getParentRoute: () => Route$20
	}),
	TodayRoute: Route$3.update({
		id: "/today",
		path: "/today",
		getParentRoute: () => Route$20
	}),
	GameEventIdRoute: Route$2.update({
		id: "/game/$eventId",
		path: "/game/$eventId",
		getParentRoute: () => Route$20
	}),
	OptionKindRoute: Route$1.update({
		id: "/option/$kind",
		path: "/option/$kind",
		getParentRoute: () => Route$20
	}),
	ApiAuthSplatRoute: Route.update({
		id: "/api/auth/$",
		path: "/api/auth/$",
		getParentRoute: () => Route$20
	})
};
var routeTree = Route$20._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { timingKind as $, pickHero as A, useAccess as B, highestTodayLabel as C, parlayTicketIdFromLegs as D, parlayTicketId as E, ribbonSitWhy as F, listAccessRequests as G, decideAccessRequest as H, safestColumn as I, revokeAllowlistEmail as J, listAllowlist as K, shownParlayChance as L, pickMatchup as M, qualityBand as N, parseParlayTicketId as O, resolveTicketId as P, feeBadge as Q, shownParlayFromStoreLegs as R, deskPickFromLegRefs as S, matchLegRow as T, getFeedHealth as U, addAllowlistEmail as V, hidePickRemote as W, updateLedgerBet as X, saveDeskSettings as Y, TIMING_COPY as Z, HitReadout as _, useCurrentUserState as _t, downloadLedger as a, applyGameLean as at, candidateToPicks as b, parseTicketImage as bt, HOW_IT_WORKS as c, isChalk as ct, WORDS_WE_USE as d, selectTicketPulse as dt, buildSheet as et, lookChipId as f, selectUnit as ft, buildLockPayload as g, useDeskStore as gt, TicketReview as h, teamLeansFromBoard as ht, Route$4 as i, teamNick as it, pickInSport as j, pickFromScanRow as k, LOOK_LABEL as l, lineupExport as lt, LockedStamp as m, showdownSalary as mt, Route$1 as n, seedTemplate as nt, paperToLedger as o, cashFloor as ot, tapeChip as p, showdownPoints as pt, listMasterLedger as q, Route$2 as r, espnLogoUrl as rt, CHIP_LINE as s, gppCeiling as st, router_exports as t, marketsOnTab as tt, MORE_LINKS as u, optimizeSlate as ut, WagerMeter as v, Button as vt, lookupPick as w, correlationFlag as x, useDeskDecision as xt, belowSixty as y, getEventResearch as yt, sortByMood as z };
