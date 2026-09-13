import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { R as formatBetUsd, W as formatUsd, n as BRAND } from "./research-9TMeO2J4.mjs";
import { d as Copy, i as ShieldAlert, y as Camera } from "../_libs/lucide-react.mjs";
import { at as applyGameLean, ct as isChalk, gt as useDeskStore, ht as teamLeansFromBoard, lt as lineupExport, mt as showdownSalary, ot as cashFloor, pt as showdownPoints, st as gppCeiling, ut as optimizeSlate, xt as useDeskDecision } from "./router-nrR04juv.mjs";
import { n as ScreenshotIngest, t as PhotoFirstNote } from "./screenshot-ingest-BBprGqET.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/slate-D397G4U4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SAMPLE_CONTESTS = [
	{
		name: "NFL $1 Double-Up",
		buyIn: 1,
		fieldSize: 2,
		prize: 1.8,
		kind: "cash",
		confirmed: false
	},
	{
		name: "NFL $3 50/50",
		buyIn: 3,
		fieldSize: 20,
		prize: 5.4,
		kind: "cash",
		confirmed: false
	},
	{
		name: "NFL $5 Double-Up",
		buyIn: 5,
		fieldSize: 20,
		prize: 9,
		kind: "cash",
		confirmed: false
	},
	{
		name: "NFL $5 Single-Entry tournament",
		buyIn: 5,
		fieldSize: 2e4,
		prize: 2e4,
		kind: "gpp",
		confirmed: false
	},
	{
		name: "NFL $12 Single-Entry tournament",
		buyIn: 12,
		fieldSize: 5e4,
		prize: 1e5,
		kind: "gpp",
		confirmed: false
	},
	{
		name: "NFL $25 tournament",
		buyIn: 25,
		fieldSize: 2e4,
		prize: 75e3,
		kind: "gpp",
		confirmed: false
	}
];
function targetDfsFee(bankroll) {
	if (!Number.isFinite(bankroll) || bankroll <= 0) return 1;
	return Math.max(1, Math.round(bankroll * .01 * 100) / 100);
}
function suggestContests(bankroll, offers) {
	const target = targetDfsFee(bankroll);
	const photographed = offers.filter((c) => c.confirmed);
	const pool = photographed.length ? photographed : offers.length ? offers : SAMPLE_CONTESTS;
	const closest = (kind) => [...pool].filter((c) => c.kind === kind).sort((a, b) => Math.abs(a.buyIn - target) - Math.abs(b.buyIn - target))[0];
	const cash = closest("cash") ?? [...pool].sort((a, b) => Math.abs(a.buyIn - target) - Math.abs(b.buyIn - target))[0];
	const gpp = closest("gpp");
	const over = (c) => Boolean(c && c.buyIn > Math.max(2, bankroll * .02));
	const source = photographed.length ? "from the contest list you photographed" : "from typical DraftKings rungs — photograph today's lobby to replace these";
	return {
		target,
		cash,
		gpp,
		photographed: photographed.length > 0,
		note: `Treat a fantasy entry like a 1% sports bet. On ${formatUsd(bankroll)} that is about ${formatBetUsd(target)} ${source}.`,
		cashWarning: over(cash) ? "That buy-in is more than 2% of your money. Size down." : void 0,
		gppWarning: over(gpp) ? "That tournament buy-in is more than 2% of your money. Size down or skip." : void 0
	};
}
function DfsDesk({ variant = "full" }) {
	const slate = useDeskStore((s) => s.slate);
	const contests = useDeskStore((s) => s.contests ?? []);
	const liveBankroll = useDeskStore((s) => s.liveBankroll);
	const loadSampleSlate = useDeskStore((s) => s.loadSampleSlate);
	const rec = suggestContests(liveBankroll, contests);
	const { scan, snapshot } = useDeskDecision();
	const leans = (0, import_react.useMemo)(() => teamLeansFromBoard(scan?.rows ?? [], snapshot?.briefs, snapshot?.predict), [scan, snapshot]);
	const scored = (0, import_react.useMemo)(() => {
		if (!slate?.confirmed) return slate;
		const players = applyGameLean(slate.players, leans, slate.sport);
		return optimizeSlate({
			site: slate.site,
			sport: slate.sport,
			slateDate: slate.slateDate,
			cap: slate.cap,
			players,
			source: slate.source,
			confirmed: true,
			salaryShifts: slate.salaryShifts
		});
	}, [slate, leans]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "max-w-3xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "stamp text-gold",
						children: "Daily fantasy — NFL, NBA, MLB, NHL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-2 text-2xl text-ink md:text-3xl",
						children: "Photograph the contest. We name a roster and a buy-in."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-ink/80",
						children: [
							"This is DraftKings Fantasy — a salary-cap roster, not a Hard Rock bet on one team. 18+. We never submit the lineup. Take a picture of the player salaries and the contest list. We pick a safer lineup, a high-ceiling tournament lineup, a single-game Showdown captain, and the buy-in that matches 1% of your money (",
							formatBetUsd(rec.target),
							" on",
							" ",
							formatUsd(liveBankroll),
							")."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "rounded-md bg-wash px-4 py-3 text-sm text-ink/80",
				children: [
					"18+ Florida daily fantasy. DraftKings Fantasy salary-cap only — not a Hard Rock Bet ticket and not DraftKings or FanDuel sportsbook. We never submit the lineup. Call ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-gold",
						children: BRAND.helpline
					}),
					" if play is no longer fun."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoFirstNote, { venue: "DraftKings Fantasy" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: "#lock-in",
				className: "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-gold px-4 text-base font-medium text-navy-deep transition-transform duration-150 ease-out active:scale-[0.96] sm:w-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
					className: "size-4",
					strokeWidth: 1.75
				}), "Confirm with DraftKings Photo"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SalaryShiftBanner, { shifts: scored?.salaryShifts ?? slate?.salaryShifts }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InactiveBanner, { alerts: scored?.inactiveAlerts }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "paper-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "stamp text-gold",
							children: "Buy-in"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display mt-2 text-xl text-ink",
							children: "What to enter"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-ink/80",
							children: rec.note
						}),
						rec.cash ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-base font-medium text-ink",
							children: [
								"Safer contest: ",
								rec.cash.name,
								" · ",
								formatBetUsd(rec.cash.buyIn),
								" to enter"
							]
						}) : null,
						rec.cashWarning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-down",
							children: rec.cashWarning
						}) : null,
						rec.gpp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-ink",
							children: [
								"High-ceiling tournament: ",
								rec.gpp.name,
								" · ",
								formatBetUsd(rec.gpp.buyIn),
								" to enter"
							]
						}) : null,
						rec.gppWarning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-down",
							children: rec.gppWarning
						}) : null,
						!rec.photographed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted",
							children: "Photograph today's lobby to replace typical rungs with what's actually up. We will not lock a buy-in without that photo."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-gold",
							children: "Using the contest list you confirmed."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "paper-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "stamp text-gold",
							children: "How to shoot it"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "mt-3 list-decimal space-y-2 pl-5 text-sm text-ink/90",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Open DraftKings Fantasy (not Sportsbook — Sportsbook is not legal in Florida)." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Screenshot the contest lobby so we can read the buy-ins." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Screenshot the player list with salaries. We flag live salary shifts of $200 or more." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Confirm the numbers. Safer = cash floor. High-ceiling = GPP double-stack + bring-back. Showdown captain is 1.5×." })
							]
						}),
						variant === "today" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/slate",
								className: "inline-flex min-h-11 items-center px-3 text-sm font-medium text-gold underline-offset-4 hover:underline",
								children: "Open the full roster builder"
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => loadSampleSlate(),
							className: "mt-4 inline-flex min-h-11 items-center rounded-md bg-wash px-3 text-sm font-medium text-gold hover:text-ink",
							children: "Load practice NFL slate"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenshotIngest, {
				kind: "auto",
				heading: "Confirm with DraftKings Photo — contest list or player salaries"
			}),
			scored?.confirmed && (scored.cash || scored.gpp || scored.showdown) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: variant === "today" ? "grid gap-4 md:grid-cols-2" : "grid gap-4 lg:grid-cols-3",
				children: [
					scored.cash ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineupCard, {
						title: "Safer lineup",
						kicker: "Cash / 50-50 · high-touch floor",
						lineup: scored.cash
					}) : null,
					scored.gpp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineupCard, {
						title: "High-ceiling lineup",
						kicker: "Tournament / GPP · double-stack + bring-back",
						lineup: scored.gpp
					}) : null,
					variant === "full" && scored.showdown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineupCard, {
						title: "Showdown captain",
						kicker: "Single-game · 1.5× salary and 1.5× points",
						lineup: scored.showdown
					}) : null
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "paper-card p-5 text-sm text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
					className: "mr-2 inline size-4",
					strokeWidth: 1.75
				}), "Empty slate. Photograph the player list, then confirm. We will not invent a roster without that photo."]
			})
		]
	});
}
function SalaryShiftBanner({ shifts }) {
	if (!shifts?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-wash-gold px-4 py-3 text-sm text-gold",
		role: "status",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-medium",
			children: "Salary shift on DraftKings"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-1 space-y-1",
			children: shifts.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
				s.name,
				": was ",
				formatUsd(s.was, 0),
				", now ",
				formatUsd(s.now, 0),
				". Photograph DraftKings before you lock the salary."
			] }, s.name))
		})]
	});
}
function InactiveBanner({ alerts }) {
	if (!alerts?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-wash px-4 py-3 text-sm text-ink",
		role: "status",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "flex items-center gap-2 font-medium text-gold",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
				className: "size-4",
				strokeWidth: 1.75
			}), "Injury ripple & 90-minute inactive radar"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 space-y-1 text-ink/80",
			children: alerts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: a.line }, `${a.playerId}-${a.kind}`))
		})]
	});
}
function LineupCard({ title, kicker, lineup }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const floor = lineup.players.reduce((s, p) => {
		const f = cashFloor(p);
		return s + (lineup.captainId === p.id ? showdownPoints(f, true) : f);
	}, 0);
	const ceil = lineup.players.reduce((s, p) => {
		const c = gppCeiling(p);
		return s + (lineup.captainId === p.id ? showdownPoints(c, true) : c);
	}, 0);
	function copy() {
		const text = lineupExport(lineup);
		navigator.clipboard?.writeText(text).then(() => {
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1600);
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "paper-card flex flex-col p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "stamp text-gold",
				children: kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display mt-2 text-xl text-ink",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 font-mono text-xs text-muted",
				children: [
					"Cap ",
					formatUsd(lineup.capUsed, 0),
					" / ",
					formatUsd(lineup.cap, 0),
					" · floor ",
					floor.toFixed(1),
					" · median ",
					lineup.projP50.toFixed(1),
					" · ceiling ",
					ceil.toFixed(1)
				]
			}),
			lineup.stackNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-ink/80",
				children: lineup.stackNote
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 divide-y divide-line text-sm",
				children: lineup.players.map((p) => {
					const captain = lineup.captainId === p.id;
					const salary = captain ? showdownSalary(p.salary, true) : p.salary;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between gap-3 py-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "stamp mr-2 text-muted",
								children: captain ? "CPT" : p.pos
							}),
							p.name,
							isChalk(p.ownershipEst) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 text-xs text-gold",
								children: "chalk"
							}) : null,
							p.researchNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block text-xs text-muted",
								children: p.researchNote
							}) : null
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono tabular-nums",
							children: ["$", salary.toLocaleString()]
						})]
					}, p.id);
				})
			}),
			lineup.warnings.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-1 text-xs text-muted",
				children: lineup.warnings.filter((w) => w !== lineup.stackNote).map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: w }, w))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: copy,
					className: "inline-flex min-h-11 items-center gap-2 rounded-md bg-wash px-3 text-sm font-medium text-ink hover:text-gold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
						className: "size-4",
						strokeWidth: 1.75
					}), copied ? "Copied" : "Copy roster"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "#lock-in",
					className: "inline-flex min-h-11 items-center gap-2 rounded-md bg-gold px-3 text-sm font-medium text-navy-deep",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
						className: "size-4",
						strokeWidth: 1.75
					}), "Confirm with DraftKings Photo"]
				})]
			})
		]
	});
}
function SlatePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-gold",
						children: "DraftKings Fantasy · not a Florida sportsbook fill"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-2 text-3xl text-ink md:text-5xl",
						children: "Fantasy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-base text-ink/80",
						children: "Salary-cap roster on DraftKings Fantasy. 18+. Not Hard Rock Bet. Not DraftKings or FanDuel sportsbook tickets. Photograph the player list and the contest lobby. We name a Safer cash lineup, a High-Ceiling tournament stack, and a Showdown captain. We never submit it."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DfsDesk, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Use AI Picks, Games, Combos, Live, and Log for Hard Rock Florida research. ",
					BRAND.helpline,
					". This site never places a bet. 18+ Florida DFS."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/today",
				className: "inline-flex min-h-12 items-center justify-center rounded-md bg-gold px-5 text-base font-medium text-navy-deep",
				children: "Open AI Picks"
			})
		]
	});
}
var SplitComponent = SlatePage;
//#endregion
export { SplitComponent as component };
