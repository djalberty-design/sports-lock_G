import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as DEFAULTS, c as SLEEVE_RATES } from "./desk-settings-uc_BKqpk.mjs";
import { H as formatPct, W as formatUsd } from "./research-9TMeO2J4.mjs";
import { gt as useDeskStore } from "./router-nrR04juv.mjs";
import { t as BankrollBar } from "./bankroll-bar-_2w8trl6.mjs";
import { a as ResponsiveContainer, i as Line, n as YAxis, o as Tooltip, r as XAxis, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/path-RKHRaW_A.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function bankrollAfterUnits(start, unitPct, evPerUnit, units) {
	const g = 1 + unitPct * evPerUnit;
	if (g <= 0) return 0;
	return start * Math.pow(g, units);
}
function pathTable(start, unitPct) {
	return [100, 500].map((units) => ({
		units,
		evNeg4: bankrollAfterUnits(start, unitPct, -.04, units),
		ev0: bankrollAfterUnits(start, unitPct, 0, units),
		evPos2: bankrollAfterUnits(start, unitPct, .02, units)
	}));
}
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
/**
* Even-money model of a bet cycle with expected value `ev`.
* p(win) = (1 + ev) / 2 so E[Δ] / bet = ev.
*/
function drawdownOdds(opts) {
	const paths = opts.paths ?? 5e3;
	const rng = mulberry32(opts.seed ?? 20260906);
	const pWin = (1 + opts.ev) / 2;
	let hits = 0;
	for (let i = 0; i < paths; i++) {
		let b = opts.start;
		const floor = opts.start * (1 - opts.drawdown);
		let ruined = false;
		for (let s = 0; s < opts.steps; s++) {
			const stake = b * opts.unitPct;
			if (stake < DEFAULTS.dustUsd) break;
			const win = rng() < pWin;
			b += win ? stake : -stake;
			if (b <= floor) {
				ruined = true;
				break;
			}
		}
		if (ruined) hits += 1;
	}
	return hits / paths;
}
function requiredHitRate(opts) {
	if (opts.start <= 0 || opts.goal <= opts.start || opts.ticketsPerYear <= 0) return 1;
	const n = opts.ticketsPerYear;
	const dec = opts.payoutDecimal;
	const unitPct = DEFAULTS.unitPct;
	let lo = 0;
	let hi = 1;
	for (let i = 0; i < 40; i++) {
		const q = (lo + hi) / 2;
		const ev = q * (dec - 1) - (1 - q);
		if (opts.start * Math.pow(1 + unitPct * ev, n) >= opts.goal) hi = q;
		else lo = q;
	}
	return hi;
}
function lotteryCopy(start, goal) {
	const tickets = 200;
	const payout = 6;
	return {
		toGoal: requiredHitRate({
			start,
			goal,
			ticketsPerYear: tickets,
			payoutDecimal: payout
		}),
		toMillion: requiredHitRate({
			start,
			goal: 1e6,
			ticketsPerYear: tickets,
			payoutDecimal: payout
		}),
		tickets,
		payout
	};
}
var PATH_HONESTY = "A $200 bankroll betting 3-game parlays is not a path to $1M on a human timetable. Sitting is often the right call. Real long-term growth lives in saving and investing — not here.";
function PathPage() {
	const liveBankroll = useDeskStore((s) => s.liveBankroll);
	const unitPct = useDeskStore((s) => s.unitPct);
	const goalTarget = useDeskStore((s) => s.goalTarget);
	const table = pathTable(liveBankroll, unitPct);
	const lottery = lotteryCopy(liveBankroll, goalTarget);
	const dd = (0, import_react.useMemo)(() => [
		.01,
		.02,
		.05
	].map((u) => ({
		u,
		p: drawdownOdds({
			start: liveBankroll,
			unitPct: u,
			ev: -.04,
			steps: 500,
			drawdown: .5,
			paths: 4e3
		})
	})), [liveBankroll]);
	const chart = Array.from({ length: 21 }, (_, i) => {
		const bets = i * 25;
		return {
			bets,
			neg4: bankrollAfterUnits(liveBankroll, unitPct, -.04, bets),
			zero: bankrollAfterUnits(liveBankroll, unitPct, 0, bets),
			pos2: bankrollAfterUnits(liveBankroll, unitPct, .02, bets)
		};
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-gold",
						children: "Long-term math · not a forecast"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-2 text-3xl text-ink",
						children: "A betting bankroll is not an index fund."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 rounded-md bg-wash-gold px-4 py-3 text-sm text-gold",
						children: PATH_HONESTY
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BankrollBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "paper-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-ink",
						children: "Your money after this many bets"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Each bet is the dollar amount you set in Your money (starts at 1%)."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-56",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: chart,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "bets",
										stroke: "var(--color-faint)",
										fontSize: 12
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "var(--color-faint)",
										fontSize: 12
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "neg4",
										stroke: "var(--color-down)",
										dot: false,
										strokeWidth: 2,
										name: "−4% edge"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "zero",
										stroke: "var(--color-gold)",
										dot: false,
										strokeWidth: 2,
										name: "Break even"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "pos2",
										stroke: "var(--color-up)",
										dot: false,
										strokeWidth: 2,
										name: "+2% edge"
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2",
										children: "Bets"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "−4% edge" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Break even" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "+2% edge" })
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "tabular-nums",
								children: table.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-line",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2",
											children: r.units
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: formatUsd(r.evNeg4) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: formatUsd(r.ev0) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: formatUsd(r.evPos2) })
									]
								}, r.units))
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "paper-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-ink",
					children: "Odds of cutting the bankroll in half (500 bets, −4% edge)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 grid gap-3 md:grid-cols-3",
					children: dd.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md bg-wash p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "stamp text-muted",
							children: [(d.u * 100).toFixed(0), "% of your money per bet"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-2xl text-ink tabular-nums",
							children: formatPct(d.p, 0)
						})]
					}, d.u))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "paper-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-ink",
						children: "Lottery row"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"Hit-rate needed on ",
							lottery.tickets,
							" fun-money tickets a year at decimal ",
							lottery.payout,
							" (",
							formatUsd(liveBankroll),
							" bankroll, 1% per bet). No skill assumed."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 grid gap-3 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md bg-wash p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
								className: "text-sm text-muted",
								children: ["Hit-rate to ", formatUsd(goalTarget, 0)]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-display text-2xl text-ink tabular-nums",
								children: formatPct(lottery.toGoal, 1)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md bg-wash p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-sm text-muted",
								children: "Hit-rate to $1,000,000"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-display text-2xl text-ink tabular-nums",
								children: formatPct(lottery.toMillion, 1)
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "paper-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-ink",
					children: "Illustrative styles"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-line",
					children: Object.values(SLEEVE_RATES).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: s.id === "hero" ? "bg-wash-gold/60 py-3 opacity-80" : "py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "stamp mr-2 text-muted",
								children: s.symbol
							}), s.label] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-sm tabular-nums",
								children: s.id === "hero" ? "disclaimer only" : formatPct(s.annual, 0) + " / cycle-ish"
							})]
						}), s.id === "hero" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: "Hindsight exists to disclaim miracle parlays, not as a recommendation."
						}) : null]
					}, s.id))
				})]
			})
		]
	});
}
var SplitComponent = PathPage;
//#endregion
export { SplitComponent as component };
