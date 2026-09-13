import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as coreFunSplit, Et as profitOnStake, L as formatAmerican, R as formatBetUsd } from "./research-9TMeO2J4.mjs";
import { ft as selectUnit, gt as useDeskStore, xt as useDeskDecision } from "./router-nrR04juv.mjs";
import { t as Input } from "./input-BAVbE0tC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bankroll-bar-_2w8trl6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BankrollBar() {
	const liveBankroll = useDeskStore((s) => s.liveBankroll);
	const stakeDollars = useDeskStore((s) => s.stakeDollars);
	const weekLossDollars = useDeskStore((s) => s.weekLossDollars);
	const goalTarget = useDeskStore((s) => s.goalTarget);
	const weekAnchor = useDeskStore((s) => s.weekAnchorBankroll);
	const paperTickets = useDeskStore((s) => s.paperTickets);
	const setLiveBankroll = useDeskStore((s) => s.setLiveBankroll);
	const setStakeDollars = useDeskStore((s) => s.setStakeDollars);
	const setWeekLossDollars = useDeskStore((s) => s.setWeekLossDollars);
	const setGoalTarget = useDeskStore((s) => s.setGoalTarget);
	const unitPct = useDeskStore((s) => s.unitPct);
	const bet = selectUnit({
		liveBankroll,
		unitPct,
		stakeDollars
	});
	const split = coreFunSplit(liveBankroll);
	const { board } = useDeskDecision();
	const rec = board ? board[board.recommended] : null;
	const payout = rec?.price != null ? profitOnStake(bet, rec.price) : null;
	const weekPnl = liveBankroll - weekAnchor;
	const paperPnl = paperTickets.reduce((sum, t) => sum + (t.pnl ?? 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "paper-card p-5 md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl text-ink",
				children: "Your money"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Type real dollars. Nothing here is hidden."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md bg-wash-gold/70 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "stamp text-gold",
							children: "Core · 85%"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display mt-1 text-2xl tabular-nums text-ink",
							children: formatBetUsd(split.core)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [
								"1% of core is ",
								formatBetUsd(split.coreTicket),
								" on a single or 2-pick combo. Steady bankroll building."
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md bg-wash px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "stamp text-gold",
							children: "Fun / lotto · 15%"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display mt-1 text-2xl tabular-nums text-ink",
							children: formatBetUsd(split.fun)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [formatBetUsd(split.funTicket), " flyers on 3-pick and 4-pick combos. Recreational dollars stay in this bucket."]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarField, {
						label: "Money I can play with",
						hint: "How much you have set aside to bet. Not rent. Not groceries.",
						value: liveBankroll,
						onCommit: setLiveBankroll
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarField, {
						label: "This ticket",
						hint: "How much you put on the next ticket. $2 on $200 is a quiet start. You can type $10.",
						value: bet,
						onCommit: setStakeDollars
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarField, {
						label: "Most I can lose this week",
						hint: "A note to yourself. This app never auto-stops you.",
						value: weekLossDollars || Math.round(liveBankroll * .1 * 100) / 100,
						onCommit: setWeekLossDollars
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarField, {
						label: "Profit I hope for this week",
						hint: "Extra dollars you hope to finish the week with.",
						value: goalTarget,
						onCommit: setGoalTarget
					})
				]
			}),
			payout && rec?.price != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-md bg-wash-gold/70 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stamp text-gold",
					children: "If this ticket hits"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-ink",
					children: [
						"If this ticket is ",
						formatBetUsd(bet),
						" at ",
						formatAmerican(rec.price),
						" and it hits, you get about",
						" ",
						formatBetUsd(payout.total),
						" back (",
						formatBetUsd(payout.profit),
						" profit). If it misses, you are out",
						" ",
						formatBetUsd(bet),
						"."
					]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 rounded-md bg-wash px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ink",
					children: "If this ticket is $2 at +124 and it hits, you get about $4.48 back ($2.48 profit). If it misses, you are out $2."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-ink",
				children: [
					"This week so far:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: weekPnl >= 0 ? "text-up" : "text-down",
						children: formatBetUsd(weekPnl)
					}),
					paperTickets.length ? ` · logged tickets ${formatBetUsd(paperPnl)}` : "",
					". Goal is ",
					formatBetUsd(goalTarget),
					" ",
					"profit."
				]
			})
		]
	});
}
function DollarField({ label, hint, value, onCommit }) {
	const [text, setText] = (0, import_react.useState)(formatInput(value));
	(0, import_react.useEffect)(() => {
		setText(formatInput(value));
	}, [value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium text-ink",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mt-1.5 flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-gold",
					children: "$"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					inputMode: "decimal",
					className: "font-mono",
					value: text,
					onChange: (e) => setText(e.target.value.replace(/[^0-9.]/g, "")),
					onBlur: () => {
						const n = Number(text);
						if (Number.isFinite(n) && n >= 0) onCommit(n);
						else setText(formatInput(value));
					},
					"aria-label": label
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1.5 block text-xs text-muted",
				children: hint
			})
		]
	});
}
function formatInput(n) {
	if (!Number.isFinite(n)) return "0";
	const rounded = Math.round(n * 100) / 100;
	return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}
function ConnectAppsNote() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "paper-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "stamp text-gold",
				children: "Hard Rock Bet Florida"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-2 text-xl text-ink",
				children: "Can we plug into the book?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-ink/90",
				children: "No. Hard Rock Bet does not let another site log into your account or read your bets live. There is no official hookup, and we will not fake one."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Photograph a Hard Rock Bet Florida ticket to lock the live price. Fantasy lives in More — not a Florida sportsbook fill."
			})
		]
	});
}
//#endregion
export { ConnectAppsNote as n, BankrollBar as t };
