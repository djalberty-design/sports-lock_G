import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { G as gradeParlay, Lt as shortPick, Mt as researchedFavorite, Nt as rowToPick, Rt as shownCombinedChance, S as cn, St as pickKey, V as formatKickoff, Z as isTodayEt, et as leanEnglish, h as buildChance, p as assembleChanceInput, wt as predictFor } from "./research-9TMeO2J4.mjs";
import { _ as ChevronDown, b as Calendar, g as ChevronLeft, m as ChevronsUpDown, v as Check } from "../_libs/lucide-react.mjs";
import { _ as HitReadout, et as buildSheet, gt as useDeskStore, it as teamNick, nt as seedTemplate, r as Route$2, rt as espnLogoUrl, tt as marketsOnTab, v as WagerMeter, vt as Button, xt as useDeskDecision, yt as getEventResearch } from "./router-nrR04juv.mjs";
import { n as ScreenshotIngest } from "./screenshot-ingest-BBprGqET.mjs";
import { t as TapeStrip } from "./play-card-BX4r_v-J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/game._eventId-DfkUtHjl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = {
	MLB: [
		{
			id: "popular",
			label: "Popular"
		},
		{
			id: "props",
			label: "Player Props"
		},
		{
			id: "innings",
			label: "Innings Props"
		},
		{
			id: "half",
			label: "Half Inning"
		},
		{
			id: "research",
			label: "Research"
		}
	],
	NFL: [
		{
			id: "popular",
			label: "Popular"
		},
		{
			id: "props",
			label: "Player Props"
		},
		{
			id: "quarters",
			label: "Quarters"
		},
		{
			id: "halves",
			label: "Halves"
		},
		{
			id: "research",
			label: "Research"
		}
	],
	NBA: [
		{
			id: "popular",
			label: "Popular"
		},
		{
			id: "props",
			label: "Player Props"
		},
		{
			id: "quarters",
			label: "Quarters"
		},
		{
			id: "halves",
			label: "Halves"
		},
		{
			id: "research",
			label: "Research"
		}
	],
	NHL: [
		{
			id: "popular",
			label: "Popular"
		},
		{
			id: "props",
			label: "Player Props"
		},
		{
			id: "periods",
			label: "Periods"
		},
		{
			id: "research",
			label: "Research"
		}
	],
	NCAAF: [
		{
			id: "popular",
			label: "Popular"
		},
		{
			id: "props",
			label: "Player Props"
		},
		{
			id: "quarters",
			label: "Quarters"
		},
		{
			id: "halves",
			label: "Halves"
		},
		{
			id: "research",
			label: "Research"
		}
	],
	NCAAB: [
		{
			id: "popular",
			label: "Popular"
		},
		{
			id: "props",
			label: "Player Props"
		},
		{
			id: "quarters",
			label: "Quarters"
		},
		{
			id: "halves",
			label: "Halves"
		},
		{
			id: "research",
			label: "Research"
		}
	]
};
var FALLBACK_TABS = [
	{
		id: "popular",
		label: "Popular"
	},
	{
		id: "props",
		label: "Player Props"
	},
	{
		id: "research",
		label: "Research"
	}
];
function HardRockSheet({ sport, home, away, homeAbbr, awayAbbr, homeLogo, awayLogo, start, phase, scheduleOnly, rows, selected, legs, onPick, addLeg, removeLeg, research, eventResearch, homeWin, researchLoading }) {
	const [tab, setTab] = (0, import_react.useState)("popular");
	const [sgp, setSgp] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)("ml");
	const [more, setMore] = (0, import_react.useState)({});
	const [altsOpen, setAltsOpen] = (0, import_react.useState)({});
	const mlHome = rows.find((r) => r.marketType === "ml" && r.side === "home");
	const mlAway = rows.find((r) => r.marketType === "ml" && r.side === "away");
	const awayNick = teamNick(away, awayAbbr, mlAway?.selection);
	const homeNick = teamNick(home, homeAbbr, mlHome?.selection);
	const tabs = TABS[sport] ?? FALLBACK_TABS;
	const college = sport === "NCAAF" || sport === "NCAAB";
	const sheet = (0, import_react.useMemo)(() => {
		const seed = rows.length ? rows : [seedTemplate({
			eventId: eventResearch?.eventId,
			sport,
			start,
			home,
			away,
			homeAbbr,
			awayAbbr,
			homeLogo,
			awayLogo,
			homeWin
		})];
		return buildSheet({
			sport,
			home,
			away,
			homeNick,
			awayNick,
			rows: seed,
			research: eventResearch,
			homeWin
		});
	}, [
		sport,
		home,
		away,
		homeNick,
		awayNick,
		rows,
		eventResearch,
		homeWin,
		start,
		homeAbbr,
		awayAbbr,
		homeLogo,
		awayLogo
	]);
	const markets = tab === "research" ? [] : marketsOnTab(sheet, tab);
	function tap(row) {
		if (!row || row.scheduleOnly) return;
		if (sgp) {
			const key = pickKey(row);
			if (legs.some((l) => l.key === key)) removeLeg(key);
			else addLeg(rowToPick(row));
		}
		onPick(row);
	}
	const mains = mainCells(sheet, rows);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "px-1 pb-5 pt-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[1fr_auto_1fr] items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamMark, {
							sport,
							abbr: awayAbbr,
							name: awayNick,
							logo: awayLogo
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-faint",
							children: "@"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamMark, {
							sport,
							abbr: homeAbbr,
							name: homeNick,
							logo: homeLogo
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 flex items-center justify-center gap-1.5 text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
						className: "size-3.5 shrink-0",
						strokeWidth: 1.75,
						"aria-hidden": true
					}), sheetWhen(start)]
				}),
				mlHome?.ticketPct != null || mlAway?.ticketPct != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mt-3 max-w-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TapeStrip, {
						ticketPct: mlHome?.ticketPct ?? (mlAway?.ticketPct != null ? 1 - mlAway.ticketPct : void 0),
						handlePct: mlHome?.handlePct ?? (mlAway?.handlePct != null ? 1 - mlAway.handlePct : void 0),
						lean: mlHome?.tapeLean ?? mlAway?.tapeLean,
						note: mlHome?.tapeNote ?? mlAway?.tapeNote
					})
				}) : null,
				phase === "preseason" || scheduleOnly ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-center text-xs text-gold",
					children: [
						phase === "preseason" ? "Preseason" : "",
						phase === "preseason" && scheduleOnly ? " · " : "",
						scheduleOnly ? "Odds not posted yet" : ""
					]
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3 rounded-md bg-wash px-3 py-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sgp-badge",
					children: "SGP"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: ["Only show bets for ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold tracking-wide text-ink",
						children: "SAME GAME PARLAY"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				role: "checkbox",
				"aria-checked": sgp,
				onClick: () => setSgp((v) => !v),
				className: cn("grid size-6 shrink-0 place-items-center rounded-sm border-2 transition-colors", sgp ? "border-gold bg-gold text-navy-deep" : "border-muted bg-transparent text-transparent"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					className: "size-3.5",
					strokeWidth: 3,
					"aria-hidden": true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "Same game parlay"
				})]
			})]
		}),
		sgp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 px-1 text-xs text-muted",
			children: "Tap a number to add it. Photograph the Hard Rock slip before you lock."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 flex gap-1 overflow-x-auto border-b border-line",
			children: tabs.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					setTab(t.id);
					const next = t.id === "research" ? null : marketsOnTab(sheet, t.id)[0]?.id ?? null;
					setOpen(next);
				},
				className: cn("min-h-11 shrink-0 px-3 text-sm font-medium", tab === t.id ? "border-b-2 border-gold text-ink" : "text-muted"),
				children: t.label
			}, t.id))
		}),
		tab === "research" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pt-4",
			children: research
		}) : null,
		tab === "popular" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MainGrid, {
					awayNick,
					homeNick,
					spAway: mains.spAway,
					spHome: mains.spHome,
					totOver: mains.totOver,
					totUnder: mains.totUnder,
					mlAway: mains.mlAway,
					mlHome: mains.mlHome,
					selected,
					legs,
					sgp,
					onTap: tap
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 px-1 text-xs text-muted",
					children: "Every cell shows chance it hits and what your Start-tab stake pays if it does. Gold numbers without a photo are a research look — photograph Hard Rock to lock the live price."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketList, {
					markets,
					open,
					setOpen,
					more,
					setMore,
					altsOpen,
					setAltsOpen,
					selected,
					legs,
					sgp,
					onTap: tap,
					researchLoading,
					homeLogo,
					awayLogo
				})
			]
		}) : null,
		tab !== "popular" && tab !== "research" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pt-2",
			children: college && tab === "props" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 rounded-md bg-wash-gold px-4 py-3 text-sm text-gold",
				children: "College player bets are not allowed on Hard Rock Bet in Florida. Use who wins, the spread, or the total."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketList, {
				markets,
				open,
				setOpen,
				more,
				setMore,
				altsOpen,
				setAltsOpen,
				selected,
				legs,
				sgp,
				onTap: tap,
				researchLoading,
				homeLogo,
				awayLogo
			})
		}) : null
	] });
}
function mainCells(sheet, rows) {
	const ml = sheet.popular.find((m) => m.id === "ml");
	const spread = sheet.popular.find((m) => m.id === "spread");
	const total = sheet.popular.find((m) => m.id === "total");
	const postedSpread = rows.find((r) => r.marketType === "spread" && r.side === "home")?.point;
	const postedTotal = rows.find((r) => r.marketType === "total")?.point;
	const spreadLine = spread?.lines.find((l) => l.right && postedSpread != null && Math.abs((l.right.point ?? 0) - postedSpread) < .05) ?? spread?.lines[Math.floor((spread.lines.length || 1) / 2)];
	const totLine = total?.lines.find((l) => postedTotal != null && Math.abs(Number(l.label) - postedTotal) < .05) ?? total?.lines[Math.floor((total.lines.length || 1) / 2)];
	return {
		mlHome: ml?.lines[0]?.single,
		mlAway: ml?.lines[1]?.single,
		spHome: spreadLine?.right,
		spAway: spreadLine?.left,
		totOver: totLine?.left,
		totUnder: totLine?.right
	};
}
function MainGrid({ awayNick, homeNick, spAway, spHome, totOver, totUnder, mlAway, mlHome, selected, legs, sgp, onTap }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-1",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-[minmax(3.25rem,0.85fr)_repeat(3,minmax(0,1fr))] items-end gap-1.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stamp pb-1 text-center text-faint",
					children: "Spread"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stamp pb-1 text-center text-faint",
					children: "Total"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stamp pb-1 text-center text-faint",
					children: "Winner"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "flex min-h-24 items-center pr-1 text-sm font-medium text-ink",
					children: awayNick
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OddsCell, {
					row: spAway,
					selected,
					legs,
					sgp,
					onTap
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OddsCell, {
					row: totOver,
					selected,
					legs,
					sgp,
					onTap
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OddsCell, {
					row: mlAway,
					selected,
					legs,
					sgp,
					onTap
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "flex min-h-24 items-center pr-1 text-sm font-medium text-ink",
					children: homeNick
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OddsCell, {
					row: spHome,
					selected,
					legs,
					sgp,
					onTap
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OddsCell, {
					row: totUnder,
					selected,
					legs,
					sgp,
					onTap
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OddsCell, {
					row: mlHome,
					selected,
					legs,
					sgp,
					onTap
				})
			]
		})
	});
}
function activeRow(row, selected, legs, sgp) {
	const key = pickKey(row);
	if (selected && pickKey(selected) === key) return true;
	if (sgp && legs.some((l) => l.key === key)) return true;
	return false;
}
function OddsCell({ row, selected, legs, sgp, onTap, badge }) {
	if (!row || row.scheduleOnly) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-24 place-items-center rounded-sm bg-wash text-sm text-faint",
		children: "—"
	});
	const on = activeRow(row, selected, legs, sgp);
	const line = badge === void 0 ? lineLabel(row) : badge;
	const pct = Number.isFinite(row.fairProb) && row.fairProb > 0 ? Math.max(0, Math.min(100, row.fairProb * 100)) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => onTap(row),
		className: cn("relative flex min-h-24 w-full min-w-0 flex-col items-center justify-center overflow-hidden rounded-sm bg-wash px-1 py-2", on && "bg-wash-gold ring-2 ring-gold"),
		children: [
			line ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm leading-none text-ink",
				children: line
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HitReadout, {
				className: line ? "mt-1" : void 0,
				chance: row.fairProb,
				price: row.price,
				hero: !line
			}),
			pct != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute inset-x-0 bottom-0 h-0.5 bg-line",
				"aria-hidden": true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block h-full bg-gold",
					style: { width: `${pct}%` }
				})
			}) : null
		]
	});
}
function MarketList({ markets, open, setOpen, more, setMore, altsOpen, setAltsOpen, selected, legs, sgp, onTap, researchLoading, homeLogo, awayLogo }) {
	if (!markets.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-5 divide-y divide-line border-y border-line",
		children: markets.map((m) => {
			const shown = open === m.id;
			const visible = Boolean(more[m.id]) || m.lines.length <= m.preview ? m.lines : m.lines.slice(0, m.preview);
			const hidden = Math.max(0, m.lines.length - visible.length);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex min-h-14 w-full items-center justify-between gap-3 px-1 py-3 text-left",
				onClick: () => setOpen(shown ? null : m.id),
				"aria-expanded": shown,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[15px] font-medium text-ink",
					children: m.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sgp-badge",
						children: "SGP"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
						className: cn("size-4 text-muted transition-transform", shown && "rotate-180"),
						strokeWidth: 1.75
					})]
				})]
			}), shown ? m.lines.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-line bg-card pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketBody, {
					market: m,
					lines: visible,
					selected,
					legs,
					sgp,
					onTap,
					altsOpen,
					setAltsOpen,
					homeLogo,
					awayLogo
				}), hidden > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "mx-auto flex min-h-11 items-center justify-center gap-1 px-3 text-sm font-medium text-ink",
					onClick: () => setMore((prev) => ({
						...prev,
						[m.id]: true
					})),
					children: ["More", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
						className: "size-4 text-muted",
						strokeWidth: 1.75
					})]
				}) : null]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border-t border-line bg-card px-3 py-3 text-sm text-muted",
				children: researchLoading ? "Filling the roster from ESPN…" : "Photograph this market on Hard Rock. We fill the live number from the photo."
			}) : null] }, m.id);
		})
	});
}
function MarketBody({ market, lines, selected, legs, sgp, onTap, altsOpen, setAltsOpen, homeLogo, awayLogo }) {
	if (market.kind === "ml") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center justify-between gap-3 px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "min-w-0 text-sm font-medium text-ink",
			children: line.label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-32 shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OddsCell, {
				row: line.single,
				selected,
				legs,
				sgp,
				onTap,
				badge: null
			})
		})]
	}, line.label)) });
	if (market.kind === "spread-grid") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-3 pb-1 pt-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 grid grid-cols-2 gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "stamp text-center text-faint",
				children: market.leftHeader
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "stamp text-center text-faint",
				children: market.rightHeader
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OddsCell, {
					row: line.left,
					selected,
					legs,
					sgp,
					onTap,
					badge: spreadBadge(line.left)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OddsCell, {
					row: line.right,
					selected,
					legs,
					sgp,
					onTap,
					badge: spreadBadge(line.right)
				})]
			}, line.label))
		})]
	});
	if (market.kind === "total-ladder") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-3 pb-1 pt-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 grid grid-cols-[3rem_1fr_1fr] gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stamp text-center text-faint",
					children: market.leftHeader
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stamp text-center text-faint",
					children: market.rightHeader
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "grid grid-cols-[3rem_1fr_1fr] items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium tabular-nums text-ink",
						children: line.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OddsCell, {
						row: line.left,
						selected,
						legs,
						sgp,
						onTap,
						badge: null
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OddsCell, {
						row: line.right,
						selected,
						legs,
						sgp,
						onTap,
						badge: null
					})
				]
			}, line.label))
		})]
	});
	if (market.kind === "player-yes") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-2 pb-1 pt-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "stamp mb-2 pr-1 text-right text-faint",
			children: market.leftHeader
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3",
			children: lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "grid grid-cols-[minmax(0,1fr)_minmax(6.5rem,8rem)] items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerName, {
					line,
					homeLogo,
					awayLogo
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OddsCell, {
					row: line.single,
					selected,
					legs,
					sgp,
					onTap,
					badge: ouBadge("over", line.single?.point)
				})]
			}, line.label))
		})]
	});
	const anyAlts = lines.some((l) => l.alts && l.alts.length > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-2 pb-1 pt-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("mb-2 grid gap-2", anyAlts ? "grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1fr)]" : "grid-cols-2"),
			children: [
				anyAlts ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stamp text-center text-faint",
					children: market.leftHeader
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stamp text-center text-faint",
					children: market.rightHeader
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3",
			children: lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerOuRow, {
				marketId: market.id,
				line,
				showChevronCol: anyAlts,
				selected,
				legs,
				sgp,
				onTap,
				altsOpen,
				setAltsOpen,
				homeLogo,
				awayLogo
			}, line.label))
		})]
	});
}
function PlayerOuRow({ marketId, line, showChevronCol, selected, legs, sgp, onTap, altsOpen, setAltsOpen, homeLogo, awayLogo }) {
	const key = `${marketId}:${line.label}`;
	const hasAlts = Boolean(line.alts?.length);
	const expanded = Boolean(altsOpen[key]);
	const cols = showChevronCol ? "grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1fr)]" : "grid-cols-2";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "space-y-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("grid items-center gap-2", cols),
				children: [showChevronCol ? hasAlts ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-11 place-items-center text-muted",
					"aria-expanded": expanded,
					"aria-label": `More ${line.label} lines`,
					onClick: () => setAltsOpen((prev) => ({
						...prev,
						[key]: !prev[key]
					})),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsUpDown, {
						className: "size-4",
						strokeWidth: 1.75
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: showChevronCol ? "col-span-2 min-w-0" : "col-span-2 min-w-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerName, {
						line,
						homeLogo,
						awayLogo
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("grid items-stretch gap-2", cols),
				children: [
					showChevronCol ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OddsCell, {
						row: line.left,
						selected,
						legs,
						sgp,
						onTap,
						badge: ouBadge("over", line.left?.point)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OddsCell, {
						row: line.right,
						selected,
						legs,
						sgp,
						onTap,
						badge: ouBadge("under", line.right?.point)
					})
				]
			}),
			expanded && hasAlts ? line.alts.map((alt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("grid items-stretch gap-2", cols),
				children: [
					showChevronCol ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OddsCell, {
						row: alt.left,
						selected,
						legs,
						sgp,
						onTap,
						badge: ouBadge("over", alt.left?.point)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OddsCell, {
						row: alt.right,
						selected,
						legs,
						sgp,
						onTap,
						badge: ouBadge("under", alt.right?.point)
					})
				]
			}, `${key}-alt-${i}`)) : null
		]
	});
}
function PlayerName({ line, homeLogo, awayLogo }) {
	const [broken, setBroken] = (0, import_react.useState)(false);
	const src = line.player?.headshot;
	const letter = line.label.slice(0, 1).toUpperCase();
	const mark = line.player?.homeAway === "away" ? awayLogo : homeLogo;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 items-center gap-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "relative size-10 shrink-0",
			children: [src && !broken ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src,
				alt: "",
				className: "size-10 rounded-full object-cover",
				onError: () => setBroken(true)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-10 place-items-center rounded-full bg-wash text-sm font-medium text-gold",
				children: letter
			}), mark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: mark,
				alt: "",
				className: "absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-card object-contain ring-1 ring-card"
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "min-w-0 text-sm font-medium leading-snug text-ink",
			children: line.label
		})]
	});
}
function TeamMark({ sport, abbr, name, logo }) {
	const [broken, setBroken] = (0, import_react.useState)(false);
	const src = logo || espnLogoUrl(sport, abbr);
	const letter = (abbr || name).slice(0, 3).toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center text-center",
		children: [src && !broken ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt: "",
			className: "size-24 object-contain",
			onError: () => setBroken(true)
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid size-24 place-items-center rounded-full bg-wash font-display text-2xl text-gold",
			children: letter
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-lg font-medium text-ink",
			children: name
		})]
	});
}
function lineLabel(row) {
	if (row.marketType === "spread" && row.point != null) return row.point > 0 ? `+${row.point}` : String(row.point);
	if (row.marketType === "total" && row.point != null) return `${row.side === "under" ? "U" : "O"} ${row.point}`;
	return null;
}
function spreadBadge(row) {
	if (!row || row.point == null) return null;
	return row.point > 0 ? `+${row.point}` : String(row.point);
}
function ouBadge(side, point) {
	const mark = side === "over" ? "O" : "U";
	return point == null ? mark : `${mark} ${point}`;
}
function sheetWhen(iso) {
	if (!iso) return "Time TBA";
	const d = new Date(iso);
	if (!Number.isFinite(d.getTime())) return "Time TBA";
	const time = d.toLocaleString("en-US", {
		timeZone: "America/New_York",
		hour: "numeric",
		minute: "2-digit",
		hour12: true
	}).replace(/\s/g, "").toLowerCase();
	if (isTodayEt(iso)) return `Today, ${time} ET`;
	return formatKickoff(iso, true);
}
function GamePage({ eventId }) {
	const { scan, snapshot } = useDeskDecision();
	const addParlayLeg = useDeskStore((s) => s.addParlayLeg);
	const removeParlayLeg = useDeskStore((s) => s.removeParlayLeg);
	const legs = useDeskStore((s) => s.parlayLegs);
	const [wager, setWager] = (0, import_react.useState)(null);
	const rows = (scan?.rows ?? []).filter((r) => r.eventId === eventId);
	const quote = snapshot?.quotes.find((q) => q.eventId === eventId);
	const first = rows[0] ?? quote;
	const brief = snapshot?.briefs?.find((b) => b.eventId === eventId);
	const q = useQuery({
		queryKey: ["research", eventId],
		queryFn: () => getEventResearch({ data: { eventId } }),
		enabled: Boolean(eventId),
		staleTime: 12e4
	});
	const research = q.data && q.data.ok ? q.data.research : null;
	const home = first?.home ?? research?.home ?? "Home";
	const away = first?.away ?? research?.away ?? "Away";
	const start = first?.start ?? research?.start ?? "";
	const sport = (first && "sport" in first ? first.sport : research?.sport) ?? "";
	const mlHome = rows.find((r) => r.marketType === "ml" && r.side === "home");
	const espnHome = research?.espnHomeWin ?? brief?.espnHomeWin;
	const predict = predictFor(snapshot?.predict, eventId);
	const report = buildChance(assembleChanceInput({
		rows,
		brief,
		research: research ?? void 0,
		predict,
		home,
		away,
		extra: {
			ticketHome: brief?.ticketHome ?? snapshot?.publicSplits.find((s) => s.eventId === eventId)?.ticketPct,
			handleHome: brief?.handleHome ?? snapshot?.publicSplits.find((s) => s.eventId === eventId)?.handlePct,
			steam: brief?.steam ?? snapshot?.publicSplits.find((s) => s.eventId === eventId)?.steam
		}
	}));
	const fav = report ? {
		side: report.favorite,
		name: report.favoriteName,
		chance: report.chance,
		homeChance: report.home,
		report
	} : researchedFavorite(rows, brief, {
		home,
		away
	});
	const lean = leanEnglish({
		home,
		away,
		oddsHome: mlHome?.fairProb,
		espnHome,
		ensembleHome: fav?.homeChance,
		crowdHome: report?.crowdHome ?? predict?.kalshiHome ?? predict?.polyHome
	});
	const liveWager = wager && scan ? scan.rows.find((r) => r.eventId === wager.eventId && r.marketType === wager.marketType && r.side === wager.side) ?? wager : wager;
	function pickOneGame(row) {
		setWager(row);
	}
	if (!first && !q.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/board",
			className: "inline-flex min-h-11 items-center gap-1 text-sm text-gold",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
				className: "size-4",
				strokeWidth: 1.75
			}), "Games"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-ink",
			children: "That game is not on the live board."
		})]
	});
	const researchPanel = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "paper-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "stamp text-gold",
						children: "Who is more likely to win?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-2 text-2xl text-ink",
						children: lean.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-ink/90",
						children: lean.because
					}),
					fav ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WagerMeter, {
						className: "mt-4",
						size: "lg",
						chance: fav.chance,
						price: rows.find((r) => r.marketType === "ml" && r.side === fav.side)?.price ?? mlHome?.price,
						label: `${fav.name} to win`
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChanceBar, {
								label: "Sportsbook (cut removed)",
								home,
								away,
								homeP: mlHome?.fairProb
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChanceBar, {
								label: "Kalshi prediction market",
								home,
								away,
								homeP: predict?.kalshiHome ?? brief?.kalshiHomeWin
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChanceBar, {
								label: "Polymarket",
								home,
								away,
								homeP: predict?.polyHome ?? brief?.polyHomeWin
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChanceBar, {
								label: "ESPN matchup model",
								home,
								away,
								homeP: espnHome
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChanceBar, {
								label: "Full ensemble",
								home,
								away,
								homeP: fav?.homeChance
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChanceBar, {
								label: "Ticket count (bets %)",
								home,
								away,
								homeP: brief?.ticketHome ?? rows.find((r) => r.marketType === "ml" && r.side === "home")?.ticketPct
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChanceBar, {
								label: "Handle (money %)",
								home,
								away,
								homeP: brief?.handleHome ?? rows.find((r) => r.marketType === "ml" && r.side === "home")?.handlePct
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted",
						children: report?.because ?? "Looks are pooled in log-odds. Ticket count vs handle is a layer — we never copy 80% of bets. Kalshi and Polymarket are research, not a Hard Rock ticket. This is not a lock."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-gold",
						children: [
							"Confidence ",
							report?.confidence ?? "low",
							report ? ` · ${report.layers.length} looks · agreement ${Math.round(report.agreement * 100)} in 100` : ""
						]
					})
				]
			}),
			q.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Loading injuries, form, and the ESPN model…"
			}) : null,
			q.data && !q.data.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-down",
				children: q.data.error
			}) : null,
			research?.pitchers.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "paper-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-ink",
					children: "Starting pitchers"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-1 text-sm",
					children: research.pitchers.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [p.team, ": "]
					}), p.line] }, p.team))
				})]
			}) : quote?.homePitcher || quote?.awayPitcher ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "paper-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-ink",
						children: "Starting pitchers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm",
						children: ["Away: ", quote?.awayPitcher ?? "TBA"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: ["Home: ", quote?.homePitcher ?? "TBA"]
					})
				]
			}) : null,
			research?.lastFive.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "paper-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-ink",
					children: "Last five games"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-3 text-sm",
					children: research.lastFive.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: b.team
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-gold",
							children: b.results.join(" ")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: b.line
						})
					] }, b.team))
				})]
			}) : null,
			research?.injuries.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "paper-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-ink",
					children: "Injuries and listings"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2 text-sm",
					children: research.injuries.map((inj, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gold",
							children: inj.status
						}),
						" · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: inj.player
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [
								" (",
								inj.team,
								")"
							]
						}),
						inj.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [" · ", inj.detail]
						}) : null
					] }, `${inj.player}-${i}`))
				})]
			}) : null,
			research?.series ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-ink",
				children: ["Series: ", research.series]
			}) : null,
			research?.headlines.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "paper-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-ink",
					children: "Headlines (context only)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 list-disc space-y-1 pl-5 text-sm text-ink/90",
					children: research.headlines.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: h.title }, h.title))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: research?.note ?? "Research, not a promise. Confirm every live number at Hard Rock Bet."
			})
		]
	});
	const eventLegs = legs.filter((l) => l.eventId === eventId);
	const sgpGrade = eventLegs.length >= 2 ? gradeParlay(eventLegs) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: Boolean(liveWager) || Boolean(sgpGrade) ? "space-y-4 pb-40" : "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/board",
				className: "inline-flex min-h-11 items-center gap-1 text-sm text-muted hover:text-gold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
					className: "size-4",
					strokeWidth: 1.75
				}), "Games"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardRockSheet, {
				sport,
				home,
				away,
				homeAbbr: first && "homeAbbr" in first ? first.homeAbbr : void 0,
				awayAbbr: first && "awayAbbr" in first ? first.awayAbbr : void 0,
				homeLogo: first && "homeLogo" in first ? first.homeLogo : void 0,
				awayLogo: first && "awayLogo" in first ? first.awayLogo : void 0,
				start,
				phase: first && "phase" in first ? first.phase : void 0,
				scheduleOnly: first && "scheduleOnly" in first ? first.scheduleOnly : void 0,
				rows,
				selected: wager,
				legs,
				onPick: pickOneGame,
				addLeg: addParlayLeg,
				removeLeg: removeParlayLeg,
				research: researchPanel,
				eventResearch: research,
				homeWin: report?.home ?? mlHome?.fairProb ?? .5,
				researchLoading: q.isLoading
			}),
			first && "scheduleOnly" in first && first.scheduleOnly ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-md bg-wash-gold px-3 py-2 text-sm text-gold",
				children: "ESPN listed this matchup but has not posted a two-way price. Upload a Hard Rock screenshot when the number drops."
			}) : null,
			sgpGrade ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "one-game-wager",
				className: "fixed inset-x-0 bottom-[4.75rem] z-50 mx-auto max-w-6xl px-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "paper-card p-3 ring-2 ring-gold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "stamp text-gold",
							children: [
								"Same-game parlay · ",
								eventLegs.length,
								" legs"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WagerMeter, {
							className: "mt-2",
							size: "md",
							chance: shownCombinedChance(sgpGrade.combinedFair, sgpGrade.decimalPayout, eventLegs.length, true),
							decimalPayout: sgpGrade.decimalPayout,
							label: "Chance every leg hits"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[11px] text-muted",
							children: "Combined math treats legs as independent — same-game legs hit a bit less often. Photograph the live SGP to lock."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "flex-1",
								onClick: () => document.getElementById("lock-in")?.scrollIntoView({
									behavior: "smooth",
									block: "start"
								}),
								children: "Upload screenshot"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/parlay",
								className: "inline-flex min-h-11 items-center justify-center rounded-md px-4 text-sm font-medium text-ink hover:bg-wash",
								children: "Open parlay"
							})]
						})
					]
				})
			}) : liveWager ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "one-game-wager",
				className: "fixed inset-x-0 bottom-[4.75rem] z-50 mx-auto max-w-6xl px-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BetSlip, {
					row: liveWager,
					onCancel: () => setWager(null)
				})
			}) : null,
			liveWager || sgpGrade ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenshotIngest, {
				kind: "ticket",
				heading: liveWager ? `Upload a screenshot of ${shortPick(liveWager.selection, liveWager.marketType)}` : "Upload a screenshot of this same-game parlay"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-1 text-sm text-muted",
				children: "Tap a number — same layout as Hard Rock. Every cell already shows chance it hits and what you collect. Then photograph it to lock."
			})
		]
	});
}
function BetSlip({ row, onCancel }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "paper-card p-3 ring-2 ring-gold",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WagerMeter, {
				size: "md",
				chance: row.fairProb,
				price: row.price,
				label: shortPick(row.selection, row.marketType)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[11px] text-muted",
				children: row.researchOnly ? "Research look · photograph Hard Rock to lock the live number" : "Photograph Hard Rock to lock the live number"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "flex-1",
					onClick: () => document.getElementById("lock-in")?.scrollIntoView({
						behavior: "smooth",
						block: "start"
					}),
					children: "Upload screenshot"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: onCancel,
					children: "Cancel"
				})]
			})
		]
	});
}
function ChanceBar({ label, home, away, homeP }) {
	if (homeP == null || !Number.isFinite(homeP)) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-wash px-3 py-3 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-ink",
			children: "Not posted yet"
		})]
	});
	const h = Math.round(homeP * 100);
	const a = 100 - h;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-wash px-3 py-3 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 flex justify-between text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					away,
					" ",
					a,
					"%"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					home,
					" ",
					h,
					"%"
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex h-2 overflow-hidden rounded-full bg-navy-deep",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "bg-ink/40",
					style: { width: `${a}%` }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "bg-gold",
					style: { width: `${h}%` }
				})]
			})
		]
	});
}
function GameRoute() {
	const { eventId } = Route$2.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GamePage, { eventId });
}
//#endregion
export { GameRoute as component };
