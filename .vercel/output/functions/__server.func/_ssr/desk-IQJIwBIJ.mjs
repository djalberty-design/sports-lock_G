import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Et as profitOnStake, L as formatAmerican, R as formatBetUsd, S as cn, n as BRAND, z as formatChancePct } from "./research-9TMeO2J4.mjs";
import { a as downloadLedger, dt as selectTicketPulse, gt as useDeskStore, o as paperToLedger, vt as Button } from "./router-nrR04juv.mjs";
import { n as ScreenshotIngest, t as PhotoFirstNote } from "./screenshot-ingest-BBprGqET.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/desk-IQJIwBIJ.js
var import_jsx_runtime = require_jsx_runtime();
/** One-sentence luck vs strategy after a ticket settles. Never invent a box score. */
function postMortem(opts) {
	const pct = opts.chance != null && Number.isFinite(opts.chance) ? Math.round(opts.chance * 100) : null;
	const name = opts.selection;
	if (opts.status === "void") return `${name} pushed. You get the original dollars back. Tie / refund — not a hit, not a miss.`;
	if (opts.status === "win") {
		if (pct != null && pct < 48) return `Fluky win. ${name} was the longer side${pct ? ` (${pct}% desk chance)` : ""}. Lucky finish on a low-edge play.`;
		return `Hit. ${name}${pct ? ` had a ${pct}% desk chance` : ""}. Marked Hit on Log. This site never placed the bet.`;
	}
	if (opts.status === "loss") {
		if (pct != null && pct >= 58) return `Unlucky loss. Model gave ${name} a ${pct}% true chance. Strategy was sound; the bounce went the other way.`;
		return `Miss. ${name}${pct ? ` had a ${pct}% desk chance` : ""}. Marked Miss on Log. This site never placed the bet.`;
	}
	return `${name} is still waiting. After the game, tap Hit or Miss.`;
}
/** Rolling Brier + layer discount. Local only — does not invent a closing book. */
function brierScore(forecasts) {
	const xs = forecasts.filter((f) => Number.isFinite(f.p) && f.p > 0 && f.p < 1);
	if (xs.length < 8) return null;
	return xs.reduce((sum, f) => sum + (f.p - (f.hit ? 1 : 0)) ** 2, 0) / xs.length;
}
function DeskPage() {
	const paperTickets = useDeskStore((s) => s.paperTickets);
	const liveBankroll = useDeskStore((s) => s.liveBankroll);
	const weekAnchor = useDeskStore((s) => s.weekAnchorBankroll);
	const selfExcluded = useDeskStore((s) => s.selfExcluded);
	const grade = useDeskStore((s) => s.gradeTicket);
	const resetPaper = useDeskStore((s) => s.resetPaper);
	const setSelfExcluded = useDeskStore((s) => s.setSelfExcluded);
	const pulse = selectTicketPulse({ paperTickets });
	const open = paperTickets.filter((t) => t.status === "open");
	const settled = paperTickets.filter((t) => t.status === "win" || t.status === "loss" || t.status === "void");
	const weekPnl = liveBankroll - weekAnchor;
	const brier = brierScore(settled.filter((t) => t.status === "win" || t.status === "loss").map((t) => ({
		p: t.chance ?? .5,
		hit: t.status === "win"
	})));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-gold",
						children: "Photographed tickets wait here"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-2 text-3xl text-ink",
						children: "Log"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-ink/80",
						children: "Photograph a Hard Rock ticket. Confirm the line. After the game, tap Hit or Miss. This site never places the bet."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Open",
						value: open.length ? formatBetUsd(pulse.atRisk) : "$0",
						note: open.length ? `${open.length} waiting on a game` : "Nothing waiting",
						gold: open.length > 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "This week",
						value: formatBetUsd(weekPnl),
						note: "Profit or loss",
						up: weekPnl > 0,
						down: weekPnl < 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Hit / Miss",
						value: `${pulse.wonCount} hit · ${pulse.lostCount} miss`,
						note: pulse.net ? `Logged ${formatBetUsd(pulse.net)}` : "Record after you tap",
						up: pulse.net > 0,
						down: pulse.net < 0
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoFirstNote, { venue: "Hard Rock Bet Florida" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl text-ink",
				children: "Waiting"
			}), open.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 grid gap-3",
				children: open.map((t) => {
					const pay = t.price != null ? profitOnStake(t.stake, t.price) : null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "paper-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "stamp text-gold",
								children: "Waiting"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display mt-2 text-xl text-ink",
								children: t.description
							}),
							t.home && t.away ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted",
								children: [
									t.away,
									" at ",
									t.home
								]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-ink",
								children: [formatChancePct(t.chance) ? `${formatChancePct(t.chance)} chance it hits` : "Chance not posted", t.livePrice != null || t.price != null ? ` · Hard Rock ${formatAmerican(t.livePrice ?? t.price)}` : ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-base text-ink",
								children: [
									"If it hits you get ",
									pay ? formatBetUsd(pay.total) : "the payout",
									". If it misses you lose",
									" ",
									formatBetUsd(t.stake),
									"."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid gap-2 sm:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "min-h-14 text-base",
										onClick: () => grade(t.id, "win", t.livePrice ?? t.price),
										children: "Hit"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "min-h-14 text-base",
										variant: "outline",
										onClick: () => grade(t.id, "loss", t.livePrice ?? t.price),
										children: "Miss"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "min-h-14 text-base",
										variant: "ghost",
										onClick: () => grade(t.id, "void"),
										children: "Push"
									})
								]
							})
						]
					}, t.id);
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "paper-card mt-3 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-base text-ink",
					children: "Nothing waiting. Photograph a Hard Rock ticket to start a log."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenshotIngest, {
						kind: "ticket",
						heading: "Photograph a Hard Rock ticket"
					})
				})]
			})] }),
			open.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "paper-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
					className: "cursor-pointer text-sm font-medium text-gold",
					children: "Add another photo"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenshotIngest, {
						kind: "ticket",
						heading: "Photograph another Hard Rock ticket",
						embedded: true
					})
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl text-ink",
				children: "Done"
			}), settled.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Hit and Miss land here after you tap."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 divide-y divide-line rounded-md bg-card shadow-[var(--shadow-paper)]",
				children: settled.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-start justify-between gap-3 px-5 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium text-ink",
								children: t.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-[0.12em] text-gold",
								children: t.status === "win" ? "Hit" : t.status === "loss" ? "Miss" : "Push"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: postMortem({
									selection: t.description,
									chance: t.chance,
									status: t.status
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("font-mono tabular-nums", (t.pnl ?? 0) >= 0 ? "text-up" : "text-down"),
						children: formatBetUsd(t.pnl ?? 0)
					})]
				}, t.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/more",
					hash: "words",
					className: "font-medium text-gold underline-offset-4 hover:underline",
					children: "Words we use"
				})
			}),
			brier != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Rolling Brier on settled tickets: ",
					brier.toFixed(3),
					". After 20+ tickets a weak layer gets a 10% haircut. This site never places a bet."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Brier score shows after eight settled Hit/Miss tickets."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => downloadLedger(paperTickets.map(paperToLedger)),
						children: "Download my bets JSON"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: resetPaper,
						children: "Clear the log"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						onClick: () => setSelfExcluded(!selfExcluded),
						children: selfExcluded ? "Turn advice back on (this device)" : "Pause all advice on this device"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							"Clearing the log does not place or cancel anything at ",
							BRAND.venueLive,
							"."
						]
					})
				]
			})
		]
	});
}
function Stat({ label, value, note, gold, up, down }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "paper-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "stamp text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("font-display mt-2 text-2xl tabular-nums", gold && "text-gold", up && "text-up", down && "text-down", !gold && !up && !down && "text-ink"),
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: note
			})
		]
	});
}
var SplitComponent = DeskPage;
//#endregion
export { SplitComponent as component };
