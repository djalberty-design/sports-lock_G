//#region node_modules/.nitro/vite/services/ssr/assets/desk-settings-uc_BKqpk.js
var PLAY_CORE = [
	"NFL",
	"NBA",
	"MLB",
	"NHL"
];
var TEAM_EXTRA = ["NCAAF", "NCAAB"];
var ALL_SPORTS = [
	"NFL",
	"NBA",
	"MLB",
	"NHL",
	"NCAAF",
	"NCAAB"
];
var MAIN_MARKETS = [
	"ml",
	"spread",
	"total"
];
var DEFAULTS = {
	liveBankroll: 200,
	unitPct: .01,
	weeklyLossCapPct: .1,
	goalTarget: 20,
	paperStartingCash: 2500,
	dailyHaltPct: .03,
	maxParlayLegs: 4,
	minLegFairProb2: .56,
	minLegFairProb3: .6,
	catalogMinLeg2: .48,
	catalogMinLeg3: .5,
	catalogMinLeg4: .48,
	maxTicketPct: .02,
	dustUsd: 1,
	autoExecute: false,
	dfsSite: "draftkings_classic",
	seedLt: 100,
	tinyLt: 200,
	entertainmentEvLt: -.08,
	closeEnoughEv: -.03,
	staleSpreadPts: 1.5,
	staleAmericanCents: 20
};
var SLEEVE_RATES = {
	sit: {
		id: "sit",
		label: "Don't bet / keep the money",
		symbol: "SIT",
		annual: 0
	},
	grind: {
		id: "grind",
		label: "One-game bets at a losing price",
		symbol: "MAIN",
		annual: -.04
	},
	fair: {
		id: "fair",
		label: "One-game bets only at a fair price",
		symbol: "FAIR",
		annual: .01
	},
	spicy: {
		id: "spicy",
		label: "3-game parlays for fun",
		symbol: "3LEG",
		annual: -.2
	},
	hero: {
		id: "hero",
		label: "Hindsight parlay (not a plan)",
		symbol: "HERO",
		annual: 1
	}
};
var CHECK_ORDER = [
	"size",
	"juice",
	"market",
	"clock",
	"halt",
	"board",
	"props",
	"news",
	"delay",
	"venue",
	"stack"
];
var CHECK_LABELS = {
	size: "Your money",
	juice: "Is the price fair?",
	market: "Type of bet",
	clock: "Has the game started?",
	halt: "No auto-stop",
	board: "What the public is doing",
	props: "Player bets",
	news: "Headlines",
	delay: "Odds delay",
	venue: "Where to place it",
	stack: "Long-term math"
};
var ALERTS_ET = [
	{
		id: "midday",
		when: "Weekdays at noon Eastern",
		job: "A short note if a fair one-game bet is already marked. Not 'locks of the day.' This site never auto-stops you."
	},
	{
		id: "tape",
		when: "Weekdays at 4:10 p.m. Eastern",
		job: "AI Picks: delayed odds, the named tickets, and what not to chase into night games."
	},
	{
		id: "preload",
		when: "Weekdays at 6:30 p.m. Eastern",
		job: "What to set up at Hard Rock Bet for tomorrow: the one-game ticket, a 2-game parlay, or a 3-game parlay. Not a live order."
	}
];
function isPlayCore(sport) {
	return PLAY_CORE.includes(sport);
}
function isTeamExtra(sport) {
	return TEAM_EXTRA.includes(sport);
}
function isCollegeSport(sport) {
	return isTeamExtra(sport);
}
function isMainMarket(marketType) {
	return MAIN_MARKETS.includes(marketType);
}
var DEFAULT_SAFEST_FLOOR = .65;
var DEFAULT_SPORT_FEEDS = {
	NFL: true,
	NBA: true,
	MLB: true,
	NHL: true,
	NCAAF: true,
	NCAAB: true
};
var DEFAULT_DESK_SETTINGS = {
	safestFloor: DEFAULT_SAFEST_FLOOR,
	kellyMultiplier: 1,
	comboLegCap: 18,
	sportFeeds: { ...DEFAULT_SPORT_FEEDS },
	pinnedPickId: null
};
function rankSettingsOf(s) {
	return {
		kellyMultiplier: s.kellyMultiplier,
		comboLegCap: s.comboLegCap,
		sportFeeds: s.sportFeeds
	};
}
function clampSafestFloor(n) {
	if (!Number.isFinite(n)) return DEFAULT_SAFEST_FLOOR;
	return Math.min(.9, Math.max(.4, n));
}
function clampKelly(n) {
	if (!Number.isFinite(n)) return 1;
	return Math.min(2, Math.max(0, n));
}
function clampComboCap(n) {
	if (!Number.isFinite(n)) return 18;
	return Math.min(20, Math.max(8, Math.round(n)));
}
function parseSportFeeds(raw) {
	const out = { ...DEFAULT_SPORT_FEEDS };
	if (!raw || typeof raw !== "object") return out;
	const rec = raw;
	for (const sport of ALL_SPORTS) if (typeof rec[sport] === "boolean") out[sport] = rec[sport];
	return out;
}
//#endregion
export { DEFAULTS as a, SLEEVE_RATES as c, clampSafestFloor as d, isCollegeSport as f, rankSettingsOf as g, parseSportFeeds as h, CHECK_ORDER as i, clampComboCap as l, isPlayCore as m, ALL_SPORTS as n, DEFAULT_DESK_SETTINGS as o, isMainMarket as p, CHECK_LABELS as r, DEFAULT_SAFEST_FLOOR as s, ALERTS_ET as t, clampKelly as u };
