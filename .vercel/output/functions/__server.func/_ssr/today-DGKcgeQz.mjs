import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as isCollegeSport } from "./desk-settings-uc_BKqpk.mjs";
import { S as cn, Vt as sportLabel } from "./research-9TMeO2J4.mjs";
import { A as pickHero, B as useAccess, I as safestColumn, gt as useDeskStore, j as pickInSport, k as pickFromScanRow, xt as useDeskDecision, z as sortByMood } from "./router-nrR04juv.mjs";
import { t as SportFilter } from "./sport-filter-By7ViReg.mjs";
import { r as PickCard } from "./pick-card-CgC78swj.mjs";
import { t as PhotoWagerCta } from "./photo-wager-cta-D50QtD9g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/today-DGKcgeQz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BETS = [
	{
		id: "all",
		label: "All Picks"
	},
	{
		id: "single",
		label: "Single Games"
	},
	{
		id: "combo2",
		label: "2-Pick Combos"
	},
	{
		id: "combo3",
		label: "3-Pick Combos"
	},
	{
		id: "combo4",
		label: "4-Pick Combos"
	}
];
function MasterFilter({ betType, onBetType, sameGameOnly, onSameGameOnly, propsIncluded, onPropsIncluded }) {
	const hideCollege = useDeskStore((s) => s.hideCollege);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			role: "tablist",
			"aria-label": "Bet type",
			children: BETS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				role: "tab",
				"aria-selected": betType === b.id,
				onClick: () => onBetType(b.id),
				className: cn("min-h-11 rounded-md px-4 text-sm font-medium", betType === b.id ? "bg-gold text-navy-deep" : "bg-wash text-muted hover:text-ink"),
				children: b.label
			}, b.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onSameGameOnly(!sameGameOnly),
					className: cn("min-h-11 rounded-md px-4 text-sm font-medium", sameGameOnly ? "bg-wash-gold text-gold" : "bg-wash text-muted hover:text-ink"),
					children: "Same-Game Only"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onPropsIncluded(!propsIncluded),
					className: cn("min-h-11 rounded-md px-4 text-sm font-medium", propsIncluded ? "bg-wash-gold text-gold" : "bg-wash text-muted hover:text-ink"),
					children: "Player Props Included"
				}),
				hideCollege ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "self-center text-xs text-muted",
					children: "College player bets stay blocked in Florida."
				}) : null
			]
		})]
	});
}
var LANES = [
	{
		id: "popular",
		label: "Popular"
	},
	{
		id: "prop",
		label: "Players"
	},
	{
		id: "period",
		label: "Periods"
	},
	{
		id: "parlay",
		label: "Combos"
	}
];
var PARLAY_LANES = [
	{
		id: "ribbon",
		label: "Ribbon"
	},
	{
		id: "two",
		label: "2-leg"
	},
	{
		id: "sgp",
		label: "Same-game"
	},
	{
		id: "three",
		label: "3-leg"
	}
];
function NowPage() {
	const { picks, query, snapshot, scan, ranking, rankMs, settings, remoteHidden } = useDeskDecision();
	const sportFilter = useDeskStore((s) => s.sportFilter);
	const mood = useDeskStore((s) => s.deskMood) ?? "safe";
	const hideCollege = useDeskStore((s) => s.hideCollege);
	const hideLive = useDeskStore((s) => s.hideLive);
	const hiddenPickIds = useDeskStore((s) => s.hiddenPickIds);
	const pinnedPickId = useDeskStore((s) => s.pinnedPickId);
	const { isAdmin } = useAccess();
	const [lane, setLane] = (0, import_react.useState)("popular");
	const [parlayLane, setParlayLane] = (0, import_react.useState)("ribbon");
	const [betType, setBetType] = (0, import_react.useState)("all");
	const [sameGameOnly, setSameGameOnly] = (0, import_react.useState)(false);
	const [propsIncluded, setPropsIncluded] = (0, import_react.useState)(false);
	const sports = [...new Set((scan?.rows ?? []).map((r) => r.sport))];
	const inSport = (p) => {
		if (!pickInSport(p, sportFilter)) return false;
		if (hideCollege && (isCollegeSport(p.sport) || p.parlay?.sports?.some(isCollegeSport))) return false;
		return true;
	};
	const isLive = (p) => Boolean(p.row?.inPlay);
	const hideInPlay = (p) => hideLive ? !isLive(p) : true;
	const notHidden = (p) => !hiddenPickIds.includes(p.id) && !remoteHidden.includes(p.id);
	const floor = mood === "safe" ? .52 : mood === "pay" ? .38 : .46;
	const popularPool = (picks?.popular ?? []).filter(inSport).filter(hideInPlay).filter((p) => !isLive(p)).filter(notHidden);
	const popularNamed = sortByMood(popularPool, mood).slice(0, 8);
	const popular = popularNamed.length ? popularNamed : sortByMood((scan?.rows ?? []).filter((r) => (r.marketType === "ml" || r.marketType === "spread" || r.marketType === "total") && !r.isProp && !r.inPlay && r.tag !== "illegal_fl").map(pickFromScanRow).filter(inSport), mood).slice(0, 8);
	const props = sortByMood((picks?.props ?? []).filter(inSport).filter(hideInPlay).filter((p) => !isLive(p)).filter(notHidden).filter((p) => p.chance >= floor || mood === "pay"), mood).slice(0, 6);
	const periods = sortByMood((picks?.periods ?? []).filter(inSport).filter(hideInPlay).filter((p) => !isLive(p)).filter(notHidden), mood).slice(0, 6);
	const sgp = sortByMood((picks?.sgp ?? []).filter(inSport).filter(notHidden), mood).slice(0, 6);
	const two = sortByMood((picks?.two ?? []).filter(inSport).filter(notHidden), mood).slice(0, 6);
	const three = sortByMood((picks?.three ?? []).filter(inSport).filter(notHidden), mood).slice(0, 6);
	const ribbon = (picks?.ribbon ?? []).filter(inSport).filter(notHidden).slice(0, 6);
	const singles = [
		picks?.hero,
		...picks?.popular ?? [],
		...picks?.props ?? [],
		...picks?.periods ?? []
	].filter((p) => Boolean(p)).filter(inSport).filter((p) => !isLive(p)).filter(notHidden);
	const gated = picks ? pickHero(singles, popular, mood) : null;
	const pinId = settings.pinnedPickId || pinnedPickId;
	const pinned = pinId ? singles.find((p) => p.id === pinId) ?? popular.find((p) => p.id === pinId) : null;
	const hero = pinned ?? gated;
	const hideHero = (list) => hero ? list.filter((p) => p.id !== hero.id) : list;
	const laneItems = {
		popular: hideHero(popular),
		prop: hideHero(props),
		period: hideHero(periods),
		parlay: parlayLane === "ribbon" ? ribbon : parlayLane === "sgp" ? sgp : parlayLane === "three" ? three : two
	};
	const laneCount = {
		popular: hideHero(popular).length,
		prop: hideHero(props).length,
		period: hideHero(periods).length,
		parlay: ribbon.length + sgp.length + two.length + three.length
	};
	const laneBlurb = {
		popular: "Winners, spreads, and totals. Popular does not need The Call.",
		prop: "Player last-10 blended with season rate. College player bets are blocked in Florida.",
		period: "Innings, quarters, halves. Last-10 still feeds the game ensemble, then this slice is shrunk. Not The Call.",
		parlay: "Ribbon is 2- or 3-pick mains, always sorted Safest. 4-pick is Catalog / fun money on Combos — not this gold badge."
	};
	const tierPool = tierPoolFrom({
		betType,
		sameGameOnly,
		propsIncluded,
		popular,
		props,
		periods,
		sgp,
		two,
		three,
		four: sortByMood((picks?.four ?? []).filter(inSport).filter(notHidden), mood).slice(0, 8),
		heroId: hero?.id
	});
	const safest = safestColumn(tierPool, 3, settings.safestFloor);
	const value = sortByMood(tierPool.filter((p) => !safest.some((s) => s.id === p.id) && (p.edge ?? 0) >= -.01), "value").slice(0, 4);
	const pay = tierPool.filter((p) => p.price != null && p.price >= 130 && p.price <= 600 && (p.edge ?? 0) > 0).sort((a, b) => b.decimalPayout - a.decimalPayout).slice(0, 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-gold",
					children: "Named tickets. Photograph Hard Rock to lock the live price."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-1 text-3xl text-ink md:text-4xl",
					children: "AI Picks"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-ink/80",
					children: "Three columns. Not a guarantee. This site never places a bet."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SportFilter, { sports }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MasterFilter, {
				betType,
				onBetType: setBetType,
				sameGameOnly,
				onSameGameOnly: setSameGameOnly,
				propsIncluded,
				onPropsIncluded: setPropsIncluded
			}),
			ranking ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "rounded-md bg-wash px-4 py-3 text-sm text-muted",
				children: ["Ranking tickets in the background. You can still tap around.", isAdmin && rankMs != null ? ` Last pass ${rankMs} ms.` : ""]
			}) : isAdmin && rankMs != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: [
					"Desk ranked in ",
					rankMs,
					" ms."
				]
			}) : null,
			query.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-md bg-wash-gold px-4 py-3 text-sm text-gold",
				children: "Live board missing. Open Games after a refresh, or photograph a Hard Rock screen."
			}) : null,
			!picks && !query.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpinionSkeleton, {}) : null,
			hero ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl text-ink",
					children: "The Call"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 mb-3 text-sm text-muted",
					children: pinned ? "Pinned by admin. Still not a guarantee. This site never places a bet." : mood === "safe" ? "Highest-conviction gated single of the day. Still not a guarantee." : mood === "pay" ? "Longer prices. Still not a guarantee." : "Highest-conviction gated play of the day. Still not a guarantee."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickCard, {
					pick: hero,
					featured: true
				})
			] }) : picks ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No Call tonight. Nothing cleared a strong look, a finished process file, and a price that is not worse than the book."
			}) : null,
			picks ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TierColumn, {
							stamp: "Safest",
							title: "High probability",
							blurb: "65% is the preferred floor. If nobody clears it, the highest-probability ticket still shows.",
							empty: "Nothing ranked yet on this filter. Best Value is next to this column.",
							items: safest
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TierColumn, {
							stamp: "Best Value",
							title: "Smart extra vs the fee",
							blurb: "All the smart +EV plays. Still not a guarantee. This site never places a bet.",
							empty: "No Smart Value ticket cleared this filter.",
							items: value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TierColumn, {
							stamp: "Pays More",
							title: "Longer prices",
							blurb: "Plus-money +130 to +600 that still has an edge. Fun / lotto dollars.",
							empty: "No plus-money ticket with an edge on this filter.",
							items: pay
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 overflow-x-auto pb-1",
						role: "tablist",
						"aria-label": "Market type",
						children: LANES.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							role: "tab",
							"aria-selected": lane === tab.id,
							onClick: () => setLane(tab.id),
							className: cn("min-h-11 shrink-0 rounded-md px-4 text-sm font-medium", lane === tab.id ? "bg-gold text-navy-deep" : "bg-wash text-muted hover:text-ink"),
							children: [tab.label, laneCount[tab.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-1.5 tabular-nums opacity-70",
								children: ["· ", laneCount[tab.id]]
							}) : null]
						}, tab.id))
					}),
					lane === "parlay" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex gap-2 overflow-x-auto",
						role: "tablist",
						"aria-label": "Parlay type",
						children: PARLAY_LANES.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": parlayLane === tab.id,
							onClick: () => setParlayLane(tab.id),
							className: cn("min-h-11 shrink-0 rounded-md px-3 text-sm font-medium", parlayLane === tab.id ? "bg-wash-gold text-gold" : "bg-wash text-muted hover:text-ink"),
							children: tab.label
						}, tab.id))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 mb-3 text-sm text-muted",
						children: laneBlurb[lane]
					}),
					laneItems[lane].length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-3 md:grid-cols-3",
						children: laneItems[lane].slice(0, 6).map((pick, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickCard, {
							pick,
							rank: i + 1
						}) }, pick.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: laneEmptyCopy(lane, parlayLane, sportFilter)
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoWagerCta, { what: "wager" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-md bg-wash-gold px-4 py-3 text-sm text-gold",
					children: "Photograph the Hard Rock Bet Florida screen. We read the live price. Then you confirm it on Log."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						"Build your own mix on",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/parlay",
							className: "font-medium text-gold underline-offset-4 hover:underline",
							children: "Combos"
						}),
						". Open a game for the full Hard Rock sheet."
					]
				})
			] }) : null,
			snapshot && !query.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: snapshot.hours.label
			}) : null
		]
	});
}
function OpinionSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "paper-card p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "stamp text-gold",
			children: "The Call"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-muted",
			children: "Reading live odds and every market on the sheet…"
		})]
	});
}
function laneEmptyCopy(lane, parlayLane, sportFilter) {
	return `Nothing in ${lane === "parlay" ? PARLAY_LANES.find((p) => p.id === parlayLane)?.label ?? "Parlays" : LANES.find((l) => l.id === lane)?.label ?? "this lane"} on this delayed board.${sportFilter && sportFilter !== "ALL" ? ` This filter is ${sportLabel(sportFilter)}.` : ""} Clear the sport filter, or wait for the next slate.`;
}
function tierPoolFrom(opts) {
	const singles = [
		...opts.popular,
		...opts.propsIncluded ? opts.props : [],
		...opts.periods
	];
	const combos2 = [...opts.two, ...opts.sgp];
	let pool = opts.betType === "single" ? singles : opts.betType === "combo2" ? combos2 : opts.betType === "combo3" ? opts.three : opts.betType === "combo4" ? opts.four : [
		...singles,
		...combos2,
		...opts.three,
		...opts.four
	];
	if (opts.sameGameOnly) pool = pool.filter((p) => Boolean(p.parlay?.sameGame));
	const seen = /* @__PURE__ */ new Set();
	return pool.filter((p) => {
		if (opts.heroId && p.id === opts.heroId) return false;
		if (seen.has(p.id)) return false;
		seen.add(p.id);
		return true;
	});
}
function TierColumn({ stamp, title, blurb, empty, items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "stamp text-gold",
			children: stamp
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display mt-1 text-xl text-ink",
			children: title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 mb-3 text-sm text-muted",
			children: blurb
		}),
		items.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-3",
			children: items.map((pick, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickCard, {
				pick,
				rank: i + 1
			}) }, pick.id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: empty
		})
	] });
}
var SplitComponent = NowPage;
//#endregion
export { SplitComponent as component };
