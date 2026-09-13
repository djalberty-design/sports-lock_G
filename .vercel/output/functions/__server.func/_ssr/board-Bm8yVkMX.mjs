import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as isCollegeSport } from "./desk-settings-uc_BKqpk.mjs";
import { Bt as sortByResearchedChance, Gt as uniqueUpcomingGames, H as formatPct, L as formatAmerican, Lt as shortPick, Mt as researchedFavorite, V as formatKickoff, Vt as sportLabel, Z as isTodayEt, a as MARKET_LABEL, et as leanEnglish, s as TAG_LABEL } from "./research-9TMeO2J4.mjs";
import { _ as HitReadout, gt as useDeskStore, rt as espnLogoUrl, v as WagerMeter, xt as useDeskDecision } from "./router-nrR04juv.mjs";
import { n as ScreenshotIngest, t as PhotoFirstNote } from "./screenshot-ingest-BBprGqET.mjs";
import { n as SportSeasonNote, r as applySportFilter, t as SportFilter } from "./sport-filter-By7ViReg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/board-Bm8yVkMX.js
var import_jsx_runtime = require_jsx_runtime();
function BoardPage() {
	const { snapshot, scan, ranking } = useDeskDecision();
	const sportFilter = useDeskStore((s) => s.sportFilter);
	const setSportFilter = useDeskStore((s) => s.setSportFilter);
	const hideCollege = useDeskStore((s) => s.hideCollege);
	const splits = snapshot?.publicSplits ?? [];
	const rows = (scan?.rows ?? []).filter((r) => !(hideCollege && isCollegeSport(r.sport)));
	const sports = [...new Set((scan?.rows ?? []).map((r) => r.sport))];
	const allGames = uniqueUpcomingGames(rows);
	const games = sortByResearchedChance(applySportFilter(allGames, sportFilter), rows, snapshot?.briefs, snapshot?.predict);
	const today = games.filter((g) => isTodayEt(g.start) || g.inPlay);
	const later = games.filter((g) => !isTodayEt(g.start) && !g.inPlay);
	const tableRows = applySportFilter(rows, sportFilter);
	const filteredEmpty = !games.length && sportFilter && sportFilter !== "ALL" && allGames.length > 0;
	const feedLooked = !allGames.length && (!sportFilter || sportFilter === "ALL");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-gold",
						children: "Live ESPN schedule · tap a game to bet that one ticket"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-2 text-3xl text-ink",
						children: "Every game. Who's more likely, and what it pays."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-ink/80",
						children: snapshot?.hours.note ?? snapshot?.sourceNote
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-mono text-xs text-muted",
						children: [
							"as of ",
							snapshot ? new Date(snapshot.asOf).toLocaleString() : "—",
							" · ",
							snapshot?.hours.label
						]
					})
				]
			}),
			ranking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-md bg-wash px-4 py-3 text-sm text-muted",
				children: "Ranking tickets in the background. You can still tap around."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SportFilter, { sports }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoFirstNote, { venue: "Hard Rock Bet Florida" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: ["Ranked by researched chance and payout together. A huge favorite that pays almost nothing sits lower. Today first.", allGames.length ? ` ${allGames.length} games on All.` : ""]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameGrid, {
				title: "Playing today",
				empty: filteredEmpty ? `This filter is ${sportLabel(sportFilter)}. No ${sportLabel(sportFilter)} game is tipping on this slate. ${allGames.length} other game${allGames.length === 1 ? "" : "s"} sit on All — clear the filter.` : feedLooked ? "ESPN feed Looked empty on this pull — not a skip. Photograph a Hard Rock Bet Florida screen." : today.length ? "" : later.length ? `Nothing tipping today${sportFilter && sportFilter !== "ALL" ? ` in ${sportLabel(sportFilter)}` : ""}. Later this week is below.` : sportFilter && sportFilter !== "ALL" ? `This filter is ${sportLabel(sportFilter)}. No game tipping.` : "No game tipping today.",
				games: today,
				rows,
				briefs: snapshot?.briefs,
				quotes: snapshot?.quotes,
				predict: snapshot?.predict,
				onClear: filteredEmpty ? () => setSportFilter("ALL") : void 0,
				allCount: allGames.length
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameGrid, {
				title: "Later this week",
				empty: later.length ? "" : filteredEmpty ? "" : feedLooked ? "ESPN feed Looked empty on this pull — not a skip. Photograph a Hard Rock Bet Florida screen." : sportFilter && sportFilter !== "ALL" ? `This filter is ${sportLabel(sportFilter)}. Nothing else later this week on that filter. Clear it to see All.` : "Nothing else on the board this week. Horizon is this slate — not a skip.",
				games: later,
				rows,
				briefs: snapshot?.briefs,
				quotes: snapshot?.quotes,
				predict: snapshot?.predict
			}),
			!games.length && sportFilter && sportFilter !== "ALL" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SportSeasonNote, { sport: sportFilter }) : null,
			feedLooked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "paper-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "stamp text-gold",
						children: "Empty board"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-2 text-xl text-ink",
						children: "No games on this slate."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Off-slate or the ESPN feed Looked empty — not a skip. Photograph a Hard Rock Bet Florida screen so we still have a live number."
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "paper-card overflow-x-auto p-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
					className: "cursor-pointer bg-wash px-4 py-3 text-sm font-medium text-ink",
					children: "Every delayed number on this board"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[860px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-wash text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Event"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "When" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Public" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Hard Rock FL" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "If it hits" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Edge" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Read" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: tableRows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-line",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/game/$eventId",
									params: { eventId: r.eventId },
									className: "font-medium text-ink underline-offset-4 hover:underline",
									children: shortPick(r.selection, r.marketType)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [
										sportLabel(r.sport),
										" · Away ",
										r.away,
										" · Home ",
										r.home
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "whitespace-nowrap text-xs text-gold",
								children: formatKickoff(r.start, true)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: MARKET_LABEL[r.marketType] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "font-mono tabular-nums",
								children: formatAmerican(r.consensusPrice ?? r.price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "font-mono tabular-nums",
								children: r.hardRockPrice != null ? formatAmerican(r.hardRockPrice) : "confirm on Hard Rock"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HitReadout, {
								chance: r.fairProb,
								price: r.hardRockPrice ?? r.price,
								className: "mt-0",
								align: "left"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular-nums",
								children: Number.isFinite(r.evPct) ? formatPct(r.evPct, 1) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-xs text-muted",
								children: TAG_LABEL[r.tag]
							})
						]
					}, `${r.eventId}-${r.selection}-${i}`)) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "paper-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-ink",
						children: "Bets vs money"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Ticket count (how many wagers) vs handle (how many dollars). When they split, the money is the sharp tell. We use it as a layer — we do not copy the public and we do not auto-fade it. Not Hard Rock's own book."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-3",
						children: splits.map((s) => {
							const tickets = s.ticketPct || s.publicPct;
							const money = s.handlePct ?? s.publicPct;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										s.side.replace(/\s+ML\b/gi, " to win"),
										s.steam ? " · steam" : "",
										s.lean === "sharp" ? " · money lead" : s.lean === "public" ? " · public on tickets" : ""
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono tabular-nums text-gold",
										children: [
											tickets,
											"% bets · ",
											money,
											"% $"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-1.5 overflow-hidden rounded-full bg-navy-deep",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block h-full bg-ink/50",
											style: { width: `${tickets}%` }
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-1.5 overflow-hidden rounded-full bg-navy-deep",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block h-full bg-gold",
											style: { width: `${money}%` }
										})
									})]
								}),
								s.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted",
									children: s.note
								}) : null
							] }, `${s.eventId}-${s.side}`);
						})
					}),
					!splits.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "No ticket/handle split on this pull yet."
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm",
				children: [
					"Build a custom ticket on",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/parlay",
						className: "font-medium text-gold underline-offset-4 hover:underline",
						children: "Your parlay"
					}),
					". Photograph a slip and we grade every leg."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenshotIngest, { heading: "Upload a screenshot of a parlay or a single ticket" })
		]
	});
}
function GameGrid({ title, empty, games, rows, briefs, quotes, predict, onClear, allCount }) {
	if (!games.length) {
		if (!empty) return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mb-2 text-xl text-ink",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: empty
			}),
			onClear ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onClear,
				className: "mt-3 inline-flex min-h-11 items-center rounded-md bg-gold px-4 text-sm font-medium text-navy-deep",
				children: ["Clear filter", allCount ? ` · ${allCount} on All` : ""]
			}) : null
		] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "font-display mb-3 text-xl text-ink",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 md:grid-cols-2",
		children: games.map((g) => {
			const brief = briefs?.find((b) => b.eventId === g.eventId);
			const quote = quotes?.find((q) => q.eventId === g.eventId);
			const awayRec = brief?.awayRecord ?? quote?.awayRecord;
			const homeRec = brief?.homeRecord ?? quote?.homeRecord;
			const pred = predict?.find((p) => p.eventId === g.eventId);
			const fav = researchedFavorite(rows.filter((r) => r.eventId === g.eventId), brief, {
				home: g.home,
				away: g.away,
				kalshiHome: pred?.kalshiHome,
				polyHome: pred?.polyHome
			});
			const lean = leanEnglish({
				home: g.home,
				away: g.away,
				oddsHome: g.side === "home" ? g.fairProb : 1 - g.fairProb,
				espnHome: brief?.espnHomeWin,
				ensembleHome: fav?.homeChance,
				crowdHome: pred?.kalshiHome ?? pred?.polyHome
			});
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/game/$eventId",
				params: { eventId: g.eventId },
				className: "paper-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "stamp text-muted",
						children: [
							sportLabel(g.sport),
							g.phase === "preseason" ? " · Preseason" : g.phase === "playoff" ? " · Playoff" : "",
							g.scheduleOnly ? " · Odds soon" : "",
							isTodayEt(g.start) ? " · Today" : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center gap-3",
						children: [
							g.awayLogo || g.awayAbbr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: g.awayLogo || espnLogoUrl(g.sport, g.awayAbbr) || "",
								alt: "",
								width: 32,
								height: 32,
								className: "size-8 shrink-0 rounded-full bg-wash object-contain"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-medium text-ink",
									children: [g.away, awayRec ? ` (${awayRec})` : ""]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-medium text-ink",
									children: [g.home, homeRec ? ` (${homeRec})` : ""]
								})]
							}),
							g.homeLogo || g.homeAbbr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: g.homeLogo || espnLogoUrl(g.sport, g.homeAbbr) || "",
								alt: "",
								width: 32,
								height: 32,
								className: "size-8 shrink-0 rounded-full bg-wash object-contain"
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-gold",
						children: formatKickoff(g.start, true)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-ink",
						children: lean.title
					}),
					fav ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WagerMeter, {
						className: "mt-3",
						size: "sm",
						chance: fav.chance,
						price: g.price,
						label: `${fav.name} to win`
					}) : Number.isFinite(g.fairProb) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WagerMeter, {
						className: "mt-3",
						size: "sm",
						chance: g.fairProb,
						price: g.price
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-muted",
						children: [brief?.weather ?? "", brief?.injuryCount ? ` · ${brief.injuryCount} injury listings` : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs font-medium text-gold",
						children: "Bet this one game →"
					})
				]
			}, g.eventId);
		})
	})] });
}
var SplitComponent = BoardPage;
//#endregion
export { SplitComponent as component };
