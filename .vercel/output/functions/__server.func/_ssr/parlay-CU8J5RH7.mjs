import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as isCollegeSport } from "./desk-settings-uc_BKqpk.mjs";
import { Bt as sortByResearchedChance, D as enrichParlayPicks, Dt as propContextFromBrief, G as gradeParlay, Gt as uniqueUpcomingGames, I as filterCatalog, J as isKnownMarket, Lt as shortPick, Mt as researchedFavorite, Nt as rowToPick, Ot as propStakeHaircut, R as formatBetUsd, St as pickKey, Ut as teamWinForPlayer, V as formatKickoff, Vt as sportLabel, bt as parsePropSelection, g as buildPropChance, it as matchParsedToRows, mt as parlayInfoQuality, qt as unknownMarketReason } from "./research-9TMeO2J4.mjs";
import { D as parlayTicketIdFromLegs, E as parlayTicketId, L as shownParlayChance, R as shownParlayFromStoreLegs, S as deskPickFromLegRefs, b as candidateToPicks, ft as selectUnit, gt as useDeskStore, v as WagerMeter, vt as Button, w as lookupPick, xt as useDeskDecision, yt as getEventResearch } from "./router-nrR04juv.mjs";
import { t as Input } from "./input-BAVbE0tC.mjs";
import { n as ScreenshotIngest, t as PhotoFirstNote } from "./screenshot-ingest-BBprGqET.mjs";
import { n as SportSeasonNote, r as applySportFilter, t as SportFilter } from "./sport-filter-By7ViReg.mjs";
import { r as PickCard, t as ConfidenceChips } from "./pick-card-CgC78swj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/parlay-CU8J5RH7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ParlayPage() {
	const legs = useDeskStore((s) => s.parlayLegs);
	const remove = useDeskStore((s) => s.removeParlayLeg);
	const clear = useDeskStore((s) => s.clearParlay);
	const add = useDeskStore((s) => s.addParlayLeg);
	const setParlayLegs = useDeskStore((s) => s.setParlayLegs);
	const unit = useDeskStore(selectUnit);
	const { scan, snapshot, picks, ranking } = useDeskDecision();
	const navigate = useNavigate();
	const sportFilter = useDeskStore((s) => s.sportFilter);
	const hideCollege = useDeskStore((s) => s.hideCollege);
	const hiddenPickIds = useDeskStore((s) => s.hiddenPickIds);
	const confirmed = useDeskStore((s) => s.confirmedTickets);
	const grade = legs.length ? gradeParlay(legs) : null;
	const rows = (scan?.rows ?? []).filter((r) => !(hideCollege && isCollegeSport(r.sport)));
	const sports = [...new Set(rows.map((r) => r.sport))];
	const games = sortByResearchedChance(applySportFilter(uniqueUpcomingGames(rows), sportFilter), rows, snapshot?.briefs, snapshot?.predict);
	const ticketRef = (0, import_react.useRef)(null);
	const [scrollNonce, setScrollNonce] = (0, import_react.useState)(0);
	const loadedStamp = ticketStamp(legs);
	(0, import_react.useEffect)(() => {
		if (!scrollNonce) return;
		(document.getElementById("your-ticket") ?? ticketRef.current)?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}, [scrollNonce, legs.length]);
	function applyTicket(next) {
		const incoming = (next ?? []).filter(Boolean).filter((l) => !(l.marketType === "prop" && isCollegeSport(l.sport)));
		if (!incoming.length) return incoming;
		let ready = incoming;
		try {
			const enriched = enrichParlayPicks(incoming, rows, snapshot?.briefs, snapshot?.predict);
			if (Array.isArray(enriched) && enriched.length) ready = enriched;
		} catch {
			ready = incoming;
		}
		setParlayLegs(ready);
		setScrollNonce((n) => n + 1);
		return ready;
	}
	function loadFromPhotos() {
		if (!confirmed.length || !scan) return;
		const next = applyTicket(matchParsedToRows(confirmed, scan.rows));
		if (next && next.length >= 2) navigate({
			to: "/ticket",
			search: { id: parlayTicketIdFromLegs(next) }
		});
	}
	function loadCatalog(p) {
		applyTicket(candidateToPicks(p, rows));
	}
	const ribbon = (picks?.ribbon ?? []).filter((p) => !hiddenPickIds.includes(p.id) && !(hideCollege && (isCollegeSport(p.sport) || p.parlay?.sports?.some(isCollegeSport))));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-gold",
						children: "Two or more picks. They all have to hit."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-2 text-3xl text-ink md:text-5xl",
						children: "Parlay"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-base text-ink/80",
						children: "We list 2- and 3-leg tickets with the best chance they all hit. You can also build your own. Photograph the slip."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoFirstNote, { venue: "Hard Rock Bet Florida" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SportFilter, { sports }),
			ranking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-md bg-wash px-4 py-3 text-sm text-muted",
				children: "Ranking tickets in the background. You can still tap around."
			}) : null,
			ribbon.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl text-ink",
					children: "AI ribbon"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 mb-3 text-sm text-muted",
					children: "Highest honest hit chance. Always sorted Safest. 2- or 3-leg mains only. No player props, no live, no college players, no 4-leg on the gold badge."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-3 md:grid-cols-2",
					children: ribbon.slice(0, 6).map((pick, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickCard, {
						pick,
						rank: i + 1
					}) }, pick.id))
				})
			] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParlayCatalog, {
				scanTwos: scan?.topTwos ?? [],
				scanThrees: scan?.topThrees ?? [],
				scanFours: scan?.topFours ?? [],
				scanSgp: scan?.topSgp ?? [],
				sportFilter,
				loadedStamp,
				onLoad: loadCatalog,
				ticket: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuiltTicket, {
					refEl: ticketRef,
					grade,
					legs,
					scan,
					snapshot,
					onClear: clear,
					onRemove: remove
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenshotIngest, {
				kind: "ticket",
				heading: "Upload a screenshot of the parlay you're considering"
			}),
			confirmed.length >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "outline",
				onClick: loadFromPhotos,
				children: [
					"Run the ",
					confirmed.length,
					" confirmed legs through research"
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl text-ink",
					children: "Add a game"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 mb-3 text-sm text-muted",
					children: "Same sport filter as AI Picks and Games. Ranked by chance and payout together — not just the biggest favorite."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-2 md:grid-cols-2",
					children: games.slice(0, 12).map((g) => {
						const on = legs.some((l) => l.eventId === g.eventId && l.marketType === "ml" && l.side === g.side);
						const fav = researchedFavorite(rows.filter((r) => r.eventId === g.eventId), snapshot?.briefs?.find((b) => b.eventId === g.eventId), {
							home: g.home,
							away: g.away
						});
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "paper-card flex items-start justify-between gap-3 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "stamp text-gold",
									children: sportLabel(g.sport)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-medium text-ink",
									children: shortPick(g.selection, g.marketType)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-ink",
									children: [
										"Away: ",
										g.away,
										" · Home: ",
										g.home
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-gold",
									children: formatKickoff(g.start, true)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WagerMeter, {
									className: "mt-2",
									size: "sm",
									chance: fav?.chance ?? g.fairProb,
									price: g.price,
									label: fav ? `${fav.name} to win` : "Chance it hits"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: on ? "outline" : "primary",
									onClick: () => on ? remove(pickKey(g)) : add(enrichParlayPicks([rowToPick(g)], rows, snapshot?.briefs, snapshot?.predict)[0]),
									children: on ? "Remove" : "Add"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/game/$eventId",
									params: { eventId: g.eventId },
									className: "text-center text-xs text-gold underline-offset-4 hover:underline",
									children: "Research"
								})]
							})]
						}, g.eventId + g.side);
					})
				}),
				!games.length && sportFilter && sportFilter !== "ALL" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SportSeasonNote, { sport: sportFilter }) : null
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerPropForm, {
				onAdd: add,
				rows,
				briefs: snapshot?.briefs,
				unit
			})
		]
	});
}
function ParlayCatalog({ scanTwos, scanThrees, scanFours, scanSgp, sportFilter, loadedStamp, onLoad, ticket }) {
	const [legs, setLegs] = (0, import_react.useState)("all");
	const [mix, setMix] = (0, import_react.useState)("all");
	const [funMoney, setFunMoney] = (0, import_react.useState)(false);
	const bag = funMoney ? scanFours : [
		...scanTwos,
		...scanThrees,
		...scanSgp
	];
	const unfilteredMains = [
		...scanTwos,
		...scanThrees,
		...scanSgp
	];
	const filtered = filterCatalog(bag, {
		legs: funMoney ? 4 : legs,
		mix,
		sport: sportFilter && sportFilter !== "ALL" ? sportFilter : "ALL"
	}).slice(0, 18);
	const filterBits = [
		funMoney ? "4-leg Catalog / fun money" : legs !== "all" ? `${legs}-leg` : null,
		mix !== "all" ? mix === "same-game" ? "same game" : mix === "cross-sport" ? "cross sport" : "same sport" : null,
		sportFilter && sportFilter !== "ALL" ? sportLabel(sportFilter) : null
	].filter(Boolean);
	const emptyWhy = !unfilteredMains.length ? "Ranked 2-leg mains are still filling from the board. Wait a beat, or photograph a slip below." : filterBits.length ? `This filter is ${filterBits.join(" · ")}. ${unfilteredMains.length} ranked slip${unfilteredMains.length === 1 ? "" : "s"} sit on All legs / Any mix. Clear the filter.` : "No ranked parlays on All / Any mix. Photograph a slip or add legs below.";
	function clearCatalogFilter() {
		setFunMoney(false);
		setLegs("all");
		setMix("all");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl text-ink",
				children: "Ranked tickets"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "2- and 3-leg. Same-game mains print joint-path or Thin · fallback-haircut on the ticket."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [[
					"all",
					2,
					3
				].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: !funMoney && legs === n ? "primary" : "outline",
					onClick: () => {
						setFunMoney(false);
						setLegs(n);
					},
					children: n === "all" ? "All legs" : `${n}-leg`
				}, String(n))), [
					"all",
					"same-game",
					"same-sport",
					"cross-sport"
				].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: !funMoney && mix === m ? "primary" : "outline",
					onClick: () => {
						setFunMoney(false);
						setMix(m);
					},
					children: m === "all" ? "Any mix" : m === "same-game" ? "Same game" : m === "same-sport" ? "Same sport" : "Cross sport"
				}, m))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.14em] text-muted",
					children: "Catalog / fun money"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: funMoney ? "primary" : "outline",
					onClick: () => setFunMoney(true),
					children: "4-leg"
				})]
			}),
			ticket,
			!filtered.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: emptyWhy
				}), unfilteredMains.length > 0 && filterBits.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "sm",
					variant: "outline",
					onClick: clearCatalogFilter,
					children: [
						"Clear this filter · ",
						unfilteredMains.length,
						" on All / Any mix"
					]
				}) : null]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3 md:grid-cols-2",
				children: filtered.map((p, i) => {
					const names = p.legs.map((l) => shortPick(l.selection, l.marketType)).join(" + ");
					const stamp = p.legs.map((l) => `${l.eventId}:${l.marketType}:${l.side}`).sort().join("|");
					const on = Boolean(loadedStamp) && stamp === loadedStamp;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "paper-card flex flex-col p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "stamp text-gold",
								children: [
									p.legs.length,
									"-leg · ",
									p.mix === "same-game" ? "same game" : p.mix === "cross-sport" ? "cross sport" : "same sport",
									p.sports?.length ? ` · ${p.sports.map(sportLabel).join(" / ")}` : ""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-medium text-ink",
								children: names
							}),
							p.sameGame ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs uppercase tracking-wide text-gold",
								children: p.correlation === "shared-latent" ? "Same-game joint-path" : p.correlation === "fallback-haircut" ? "Same-game Thin · fallback-haircut" : "Same-game"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WagerMeter, {
								className: "mt-3",
								size: "sm",
								chance: shownParlayChance(p),
								decimalPayout: p.decimalPayout,
								label: "Chance they all hit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceChips, {
								className: "mt-2",
								pick: {
									id: parlayTicketId(p),
									selection: names,
									chance: shownParlayChance(p),
									infoQuality: parlayInfoQuality(p.legs.length, Boolean(p.sameGame)),
									tapeStamp: p.researchOnly ? "research" : "hr-fl",
									researchOnly: p.researchOnly,
									parlay: p
								}
							}),
							p.sameGame ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-gold",
								children: "Same-game. They move together."
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted",
								children: p.reason
							}),
							p.pricedAsEntertainment ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-gold",
								children: "Fun money — not a plan."
							}) : null,
							on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: "In your builder"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/ticket",
								search: { id: parlayTicketId(p) },
								onClick: () => onLoad(p),
								className: "mt-3 inline-flex min-h-11 items-center justify-center rounded-md bg-gold px-3 text-sm font-medium text-navy-deep",
								children: on ? "Loaded" : "Load this ticket"
							})
						]
					}, `${p.title}-${names}-${i}`);
				})
			})
		]
	});
}
function LegResearchCard({ leg, index, onRemove }) {
	const q = useQuery({
		queryKey: ["research", leg.eventId],
		queryFn: () => getEventResearch({ data: { eventId: leg.eventId } }),
		enabled: leg.eventId.startsWith("espn-"),
		staleTime: 12e4
	});
	const research = q.data && q.data.ok ? q.data.research : null;
	const injuries = (research?.injuries ?? []).slice(0, 3);
	const last = research?.lastFive.find((b) => b.team === (leg.side === "home" ? leg.home : leg.away));
	const prop = (leg.marketType === "prop" ? buildPropChance({
		sport: leg.sport,
		selection: leg.selection,
		price: leg.price,
		player: leg.player,
		side: leg.side,
		point: leg.point,
		home: leg.home,
		away: leg.away,
		gameTotal: research?.total ?? void 0,
		homeSpread: research?.homeSpread,
		venue: research?.venue,
		weatherTemp: research?.weatherTemp,
		weatherWind: research?.weatherWind,
		weatherPrecip: research?.weatherPrecip,
		injuries: research?.injuries,
		...propContextFromBrief(research ? {
			...research,
			form: research.lastFive
		} : void 0, {
			home: leg.home,
			away: leg.away,
			player: leg.player
		})
	}) : null) ?? leg.propReport;
	const why = leg.marketType === "prop" ? prop?.because ?? "Player-bet model runs as soon as the screenshot is confirmed." : research ? [
		research.espnHomeWin != null ? `ESPN model: ${leg.home} ${Math.round(research.espnHomeWin * 100)} in 100, ${leg.away} ${Math.round((research.espnAwayWin ?? 1 - research.espnHomeWin) * 100)} in 100.` : null,
		research.homeRecord || research.awayRecord ? `Records: ${leg.away} ${research.awayRecord ?? "—"} · ${leg.home} ${research.homeRecord ?? "—"}.` : null,
		research.pitchers[0] ? `Pitching: ${research.pitchers.map((p) => p.line).join(" vs ")}.` : null,
		last ? `Recent form (${last.team}): ${last.results.join(" ")}.` : null,
		research.weather ? `Weather: ${research.weather}.` : null
	].filter(Boolean).join(" ") : "Live matchup research loads next to this leg when the game is on the ESPN board.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "paper-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "stamp text-gold",
				children: [
					sportLabel(leg.sport),
					" · Leg ",
					index + 1,
					leg.marketType === "prop" ? " · Player bet" : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-medium text-ink",
				children: shortPick(leg.selection, leg.marketType)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-ink",
				children: [
					"Away: ",
					leg.away || "—",
					" · Home: ",
					leg.home || "—"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-gold",
				children: leg.start ? formatKickoff(leg.start) : "Time TBA"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WagerMeter, {
				className: "mt-3",
				size: "sm",
				chance: leg.fairProb,
				price: leg.price,
				label: "This leg"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-ink/90",
				children: why
			}),
			prop?.customize ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-gold",
				children: prop.customize
			}) : null,
			injuries.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-1 text-xs text-muted",
				children: injuries.map((inj, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					inj.status,
					" · ",
					inj.player,
					" (",
					inj.team,
					")",
					inj.detail ? ` · ${inj.detail}` : ""
				] }, `${inj.player}-${i}`))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [leg.eventId.startsWith("espn-") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/game/$eventId",
					params: { eventId: leg.eventId },
					className: "inline-flex min-h-11 items-center text-sm font-medium text-gold underline-offset-4 hover:underline",
					children: "Full game research"
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: "ghost",
					onClick: onRemove,
					children: "Remove"
				})]
			})
		]
	});
}
function PlayerPropForm({ onAdd, rows, briefs, unit }) {
	const [sport, setSport] = (0, import_react.useState)("NFL");
	const [player, setPlayer] = (0, import_react.useState)("");
	const [team, setTeam] = (0, import_react.useState)("");
	const [opp, setOpp] = (0, import_react.useState)("");
	const [pick, setPick] = (0, import_react.useState)("");
	const [price, setPrice] = (0, import_react.useState)(-110);
	const [note, setNote] = (0, import_react.useState)("NFL, NBA, MLB, NHL only. Photograph the Hard Rock Bet Florida screen — we run the player-bet model on the live number. College player bets are blocked in Florida.");
	function submit() {
		if (isCollegeSport(sport)) {
			setNote("College player bets are not allowed on Hard Rock Bet Florida.");
			return;
		}
		if (!player.trim() || !pick.trim()) {
			setNote("Need the player and the bet (example: over 249.5 passing yards).");
			return;
		}
		const selection = `${player.trim()} ${pick.trim()}`;
		if (!isKnownMarket(selection, "prop")) {
			setNote(unknownMarketReason(selection));
			return;
		}
		const parsed = parsePropSelection(selection, sport, { player: player.trim() });
		const game = rows.find((r) => {
			const a = (s) => s.toLowerCase();
			const t = a(team);
			const o = a(opp);
			return t && (a(r.home).includes(t) || a(r.away).includes(t)) || o && (a(r.home).includes(o) || a(r.away).includes(o));
		});
		const eventId = game?.eventId ?? `prop-${player.trim().replace(/\s+/g, "-")}`;
		const homeName = game?.home || opp.trim() || "Home";
		const awayName = game?.away || team.trim() || "Away";
		const gameRows = rows.filter((r) => r.eventId === eventId);
		const brief = briefs?.find((b) => b.eventId === eventId);
		const fav = researchedFavorite(gameRows, brief, {
			home: homeName,
			away: awayName
		});
		const report = buildPropChance({
			sport,
			selection,
			price,
			player: parsed.player,
			side: parsed.side,
			point: parsed.line,
			home: homeName,
			away: awayName,
			playerTeam: team.trim() || void 0,
			gameTotal: brief?.total ?? game?.total,
			homeSpread: brief?.homeSpread ?? game?.homeSpread,
			teamWinChance: teamWinForPlayer(homeName, awayName, team.trim() || void 0, fav?.homeChance),
			...propContextFromBrief(brief, {
				home: homeName,
				away: awayName,
				player: parsed.player,
				playerTeam: team.trim() || void 0,
				stat: parsed.stat
			})
		});
		onAdd({
			key: pickKey({
				eventId,
				marketType: "prop",
				side: parsed.side
			}),
			eventId,
			sport,
			start: game?.start ?? "",
			home: homeName,
			away: awayName,
			marketType: "prop",
			side: parsed.side,
			selection,
			price,
			fairProb: report.hit,
			point: parsed.line,
			player: parsed.player,
			propReport: report
		});
		const size = unit > 0 ? ` Suggested stake about ${formatBetUsd(propStakeHaircut(unit))} (half a usual game bet).` : "";
		setNote(`${report.customize}${size}`);
		setPick("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "paper-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl text-ink",
				children: "Add a player bet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: note
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs uppercase tracking-[0.12em] text-muted",
						children: ["League", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "mt-1 block h-11 w-full rounded-md bg-wash px-3 text-sm text-ink",
							value: sport,
							onChange: (e) => setSport(e.target.value),
							children: [
								"NFL",
								"NBA",
								"MLB",
								"NHL",
								"NCAAF",
								"NCAAB"
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs uppercase tracking-[0.12em] text-muted",
						children: ["Player", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							value: player,
							onChange: (e) => setPlayer(e.target.value),
							placeholder: "Patrick Mahomes"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs uppercase tracking-[0.12em] text-muted",
						children: ["His team", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							value: team,
							onChange: (e) => setTeam(e.target.value),
							placeholder: "Kansas City"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs uppercase tracking-[0.12em] text-muted",
						children: ["Opponent", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							value: opp,
							onChange: (e) => setOpp(e.target.value),
							placeholder: "Denver"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs uppercase tracking-[0.12em] text-muted md:col-span-2",
						children: ["The bet", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							value: pick,
							onChange: (e) => setPick(e.target.value),
							placeholder: "over 249.5 passing yards"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs uppercase tracking-[0.12em] text-muted",
						children: ["Odds", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							inputMode: "numeric",
							value: price,
							onChange: (e) => setPrice(Number(e.target.value))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				type: "button",
				onClick: submit,
				children: "Run player-bet model"
			})
		]
	});
}
function ticketStamp(legs) {
	return legs.map((l) => `${l.eventId}:${l.marketType}:${l.side}`).sort().join("|");
}
function BuiltTicket({ refEl, grade, legs, scan, snapshot, onClear, onRemove }) {
	if (!legs.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "your-ticket",
		ref: refEl,
		className: "paper-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "stamp text-gold",
				children: "Builder"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-2 text-xl text-ink",
				children: "Your ticket"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Load a ranked slip or add games below. Ribbon is 2- or 3-leg. 4-leg is Catalog / fun money."
			})
		]
	});
	const legal = legs.filter((l) => !(l.marketType === "prop" && isCollegeSport(l.sport)));
	const ticketId = legal.length >= 2 ? parlayTicketIdFromLegs(legal) : "";
	const opened = legal.length >= 2 && scan && snapshot ? lookupPick(ticketId, scan, snapshot) ?? deskPickFromLegRefs(legal, scan) : null;
	const combined = opened?.chance ?? shownParlayFromStoreLegs(legal);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "your-ticket",
		ref: refEl,
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "paper-card p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stamp text-gold",
					children: "Builder"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display mt-2 text-xl text-ink",
					children: opened?.selection ?? grade?.headline ?? `${legs.length}-leg ticket`
				}),
				combined != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WagerMeter, {
					className: "mt-3",
					size: "md",
					chance: combined,
					decimalPayout: opened?.decimalPayout ?? grade?.decimalPayout,
					label: "Chance every leg hits"
				}) : null,
				opened?.parlay?.correlation || grade?.correlation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs uppercase tracking-wide text-gold",
					children: (opened?.parlay?.correlation ?? grade?.correlation) === "shared-latent" ? "Same-game joint-path" : (opened?.parlay?.correlation ?? grade?.correlation) === "fallback-haircut" ? "Same-game Thin · fallback-haircut" : "Near-independent"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-ink/90",
					children: opened?.why ?? grade?.because
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [legal.length >= 2 && ticketId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/ticket",
						search: { id: ticketId },
						className: "inline-flex min-h-11 items-center justify-center rounded-md bg-gold px-4 text-sm font-medium text-navy-deep",
						children: "Open ticket"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Add one more legal leg to open a ticket page."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "sm",
						variant: "outline",
						onClick: onClear,
						children: "Clear ticket"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "grid gap-3",
			children: legs.map((leg, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegResearchCard, {
				leg,
				index: i,
				onRemove: () => onRemove(leg.key)
			}, leg.key))
		})]
	});
}
var SplitComponent = ParlayPage;
//#endregion
export { SplitComponent as component };
