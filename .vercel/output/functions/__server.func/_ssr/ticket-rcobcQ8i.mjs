import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as isCollegeSport } from "./desk-settings-uc_BKqpk.mjs";
import { B as formatFormRead, Dt as propContextFromBrief, Ft as rulesFor, L as formatAmerican, Lt as shortPick, Nt as rowToPick, Pt as ruleStamp, U as formatScoreLine, Ut as teamWinForPlayer, V as formatKickoff, Vt as sportLabel, bt as parsePropSelection, g as buildPropChance, h as buildChance, kt as rateFromStats, p as assembleChanceInput, r as DESK_VERSION, u as analyzeScores, v as buildUsage, z as formatChancePct } from "./research-9TMeO2J4.mjs";
import { g as ChevronLeft } from "../_libs/lucide-react.mjs";
import { D as parlayTicketIdFromLegs, F as ribbonSitWhy, M as pickMatchup, N as qualityBand, O as parseParlayTicketId, P as resolveTicketId, S as deskPickFromLegRefs, T as matchLegRow, b as candidateToPicks, ft as selectUnit, g as buildLockPayload, gt as useDeskStore, i as Route$4, k as pickFromScanRow, l as LOOK_LABEL, m as LockedStamp, v as WagerMeter, vt as Button, w as lookupPick, x as correlationFlag, xt as useDeskDecision, yt as getEventResearch } from "./router-nrR04juv.mjs";
import { n as ScreenshotIngest, t as PhotoFirstNote } from "./screenshot-ingest-BBprGqET.mjs";
import { t as TapeStrip } from "./play-card-BX4r_v-J.mjs";
import { n as EdgeRow, t as ConfidenceChips } from "./pick-card-CgC78swj.mjs";
import { t as PhotoWagerCta } from "./photo-wager-cta-D50QtD9g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ticket-rcobcQ8i.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TicketPage({ ticketId }) {
	const { scan, snapshot, query } = useDeskDecision();
	useDeskStore(selectUnit);
	const add = useDeskStore((s) => s.addParlayLeg);
	const resolvedId = resolveTicketId(ticketId);
	const pick = (() => {
		if (scan && snapshot) {
			const hit = lookupPick(resolvedId, scan, snapshot) ?? (ticketId !== resolvedId ? lookupPick(ticketId, scan, snapshot) : null);
			if (hit) return hit;
			const refs = parseParlayTicketId(resolvedId) ?? parseParlayTicketId(ticketId);
			if (refs && refs.length >= 2) return deskPickFromLegRefs(refs, scan);
		}
		return null;
	})();
	const eventId = pick?.eventId ?? pick?.parlay?.legs[0]?.eventId;
	const researchQ = useQuery({
		queryKey: ["research", eventId],
		queryFn: () => getEventResearch({ data: { eventId } }),
		enabled: Boolean(eventId?.startsWith("espn-")) && !pick?.parlay,
		staleTime: 12e4
	});
	const research = researchQ.data && researchQ.data.ok ? researchQ.data.research : null;
	if ((query.isLoading || !scan) && !pick) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Reading the desk…"
	});
	if (!pick) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackLink, { parlay: resolvedId.startsWith("p") || ticketId.startsWith("p") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-ink",
				children: "That ticket is not on today’s board."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoWagerCta, { what: "wager" })
		]
	});
	if (pick.parlay && scan && snapshot) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParlayTicketView, {
		pick,
		scan,
		snapshot
	});
	const rows = (scan?.rows ?? []).filter((r) => r.eventId === pick.eventId);
	const brief = snapshot?.briefs?.find((b) => b.eventId === pick.eventId);
	const predict = snapshot?.predict?.find((p) => p.eventId === pick.eventId);
	const player = pick.player ? (brief?.players ?? research?.players ?? []).find((p) => p.name === pick.player) : void 0;
	const parsedProp = pick.row ? parsePropSelection(pick.row.selection, pick.sport, {
		player: pick.row.player,
		point: pick.row.point,
		side: pick.row.side
	}) : null;
	const report = pick.eventId ? buildChance(assembleChanceInput({
		rows,
		brief,
		research: research ?? void 0,
		predict,
		extra: {
			ticketHome: brief?.ticketHome,
			handleHome: brief?.handleHome,
			steam: brief?.steam
		},
		home: pick.home,
		away: pick.away
	})) : null;
	const prop = pick.row && (pick.row.isProp || pick.row.marketType === "prop") ? buildPropChance({
		sport: pick.sport,
		selection: pick.row.selection,
		price: pick.row.price,
		player: pick.row.player,
		side: pick.row.side,
		point: pick.row.point,
		home: pick.home ?? "",
		away: pick.away ?? "",
		playerTeam: player?.team,
		gameTotal: brief?.total ?? pick.row.total,
		homeSpread: brief?.homeSpread ?? pick.row.homeSpread,
		venue: brief?.venue ?? research?.venue,
		weatherTemp: brief?.weatherTemp ?? research?.weatherTemp,
		weatherWind: brief?.weatherWind ?? research?.weatherWind,
		weatherPrecip: brief?.weatherPrecip ?? research?.weatherPrecip,
		injuries: brief?.injuries ?? research?.injuries,
		teamWinChance: teamWinForPlayer(pick.home ?? "", pick.away ?? "", player?.team, brief?.chanceHome ?? report?.home),
		seasonRate: parsedProp ? rateFromStats(parsedProp.stat, player?.stats) : void 0,
		recentRate: parsedProp && player?.recentStats ? rateFromStats(parsedProp.stat, player.recentStats) : void 0,
		recentN: player?.recentN,
		...propContextFromBrief(brief ?? (research ? {
			...research,
			form: research.lastFive
		} : void 0), {
			home: pick.home ?? "",
			away: pick.away ?? "",
			player: pick.row.player ?? parsedProp?.player,
			playerTeam: player?.team,
			stat: parsedProp?.stat
		})
	}) : null;
	const layers = mergeLayers(report, prop);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackLink, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-gold",
						children: [
							bucketLabel(pick),
							" · ",
							sportLabel(pick.sport)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-2 text-3xl text-ink md:text-4xl",
						children: pick.selection
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-gold",
						children: [pick.start ? formatKickoff(pick.start) : "", pick.away && pick.home ? ` · ${pickMatchup(pick)}` : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-ink/80",
						children: "Chance it hits, at your This ticket amount. Not a guarantee. Photograph Hard Rock to lock the live price."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "paper-card p-5 md:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "stamp text-gold",
						children: "The ticket"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WagerMeter, {
						className: "mt-4",
						size: "lg",
						chance: pick.chance,
						price: pick.price,
						decimalPayout: pick.decimalPayout,
						label: pick.parlay ? "Chance every leg hits" : "Chance it hits"
					}),
					pick.implied != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EdgeRow, {
						pick,
						className: "mt-4"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceChips, {
						pick,
						className: "mt-3"
					}),
					pick.row?.inPlay ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs uppercase tracking-wide text-gold",
						children: "in-play · never The Call"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimLine, { pick }),
					pick.processSource ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: pick.processLooked ? `On-field file not in yet (Looked). ${pick.processSource}.` : `On-field file is in (Ran). ${pick.processSource}.`
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: callWhy(pick)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-ink/90",
						children: pick.why
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TapeStrip, {
						ticketPct: pick.ticketPct,
						handlePct: pick.handlePct,
						lean: pick.tapeLean,
						note: pick.tapeNote
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "paper-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-ink",
						children: "Why the algorithm named this"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-ink/90",
						children: algorithmBecause(pick, report?.because, prop?.because)
					}),
					layers.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayerList, { layers }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "Open the game sheet for the full layer stack on this matchup. Period and player tickets inherit the same game ensemble, then apply the period shrink or the player model."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-xs text-gold",
						children: [
							LOOK_LABEL[qualityBand(pick.infoQuality)],
							report ? ` · ${report.layers.length} looks · agreement ${Math.round(report.agreement * 100)} in 100` : "",
							pick.chance ? ` · ticket ${formatChancePct(pick.chance)}` : ""
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContextPanel, {
				brief,
				researchInjuries: research?.injuries,
				player,
				pick,
				form: brief?.form ?? research?.lastFive
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulesRan, {
				kind: pick.bucket === "prop" ? "prop" : pick.parlay ? "parlay" : pick.bucket === "period" ? "period" : "game",
				layers
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoFirstNote, { venue: "Hard Rock Bet Florida" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenshotIngest, {
				kind: "ticket",
				heading: `Upload a screenshot of ${pick.selection}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-3",
				children: [pick.row ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "inline-flex min-h-11 items-center rounded-md bg-gold px-4 text-sm font-medium text-navy-deep",
					onClick: () => add(rowToPick(pick.row)),
					children: "Add to parlay"
				}) : null, pick.eventId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/game/$eventId",
					params: { eventId: pick.eventId },
					className: "inline-flex min-h-11 items-center text-sm font-medium text-gold underline-offset-4 hover:underline",
					children: "Hard Rock sheet"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/parlay",
					className: "inline-flex min-h-11 items-center text-sm font-medium text-gold underline-offset-4 hover:underline",
					children: "Open Parlay"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoWagerCta, { what: "other number on this game" })
		]
	});
}
function ParlayTicketView({ pick, scan, snapshot }) {
	const parlay = pick.parlay;
	const unit = useDeskStore(selectUnit);
	const setParlayLegs = useDeskStore((s) => s.setParlayLegs);
	const place = useDeskStore((s) => s.placePaperTicket);
	const navigate = useNavigate();
	const [locked, setLocked] = (0, import_react.useState)(null);
	const [lockError, setLockError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const next = candidateToPicks(parlay, scan.rows).filter((l) => !(l.marketType === "prop" && isCollegeSport(l.sport)));
		setParlayLegs(next);
	}, [pick.id, setParlayLegs]);
	const usedSim = parlay.correlation === "shared-latent";
	const closed = parlay.legs.some((l) => {
		const row = matchLegRow(scan.rows, l);
		return row && !row.isProp && (row.marketType === "ml" || row.marketType === "spread" || row.marketType === "total") && row.simFair == null;
	});
	function removeLeg(index) {
		const next = parlay.legs.filter((_, i) => i !== index);
		setParlayLegs(candidateToPicks({
			...parlay,
			legs: next
		}, scan.rows));
		if (next.length < 2) {
			navigate({ to: "/parlay" });
			return;
		}
		navigate({
			to: "/ticket",
			search: { id: parlayTicketIdFromLegs(next) }
		});
	}
	function lockToLog() {
		const items = parlay.legs.map((l) => ({
			sport: l.sport,
			home: l.home,
			away: l.away,
			marketType: l.marketType,
			side: l.side,
			selection: l.selection,
			price: l.price,
			start: l.start,
			confidence: 1,
			confirmed: true
		}));
		const payload = buildLockPayload(items, scan.rows, unit);
		const res = place({
			...payload,
			fairAtLock: pick.chance,
			tapeSource: pick.tapeStamp
		});
		if (res.ok) {
			setLocked(res.ticket);
			setLockError(null);
		} else setLockError(res.error);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackLink, { parlay: true }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-gold",
						children: [
							bucketLabel(pick),
							" · ",
							parlay.legs.length,
							"-leg",
							parlay.sports?.length ? ` · ${parlay.sports.map(sportLabel).join(" / ")}` : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-2 text-3xl text-ink md:text-4xl",
						children: pick.selection
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-3 space-y-1 text-sm text-ink/90",
						children: parlay.legs.map((leg, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "stamp text-gold",
								children: ["Leg ", i + 1]
							}),
							" ",
							shortPick(leg.selection, leg.marketType),
							" · ",
							sportLabel(leg.sport),
							" · ",
							formatKickoff(leg.start),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [
									" ",
									"· ",
									leg.away,
									" at ",
									leg.home
								]
							})
						] }, `${leg.eventId}-${leg.selection}-${i}`))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-ink/80",
						children: "Chance they all hit. Not a guarantee. Photograph Hard Rock to lock the live price. This site never places a bet."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "paper-card p-5 md:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "stamp text-gold",
						children: "The slip"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WagerMeter, {
						className: "mt-4",
						size: "lg",
						chance: pick.chance,
						decimalPayout: pick.decimalPayout,
						label: "Chance every leg hits"
					}),
					pick.implied != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EdgeRow, {
						pick,
						className: "mt-4"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceChips, {
						pick,
						className: "mt-3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs uppercase tracking-wide text-gold",
						children: correlationFlag(parlay.correlation, parlay.sameGame)
					}),
					usedSim ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: "Joint chance from seeded paths on registered mains. Displayed capped at 99%. Never 100%."
					}) : closed || parlay.correlation === "fallback-haircut" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-muted",
						children: ["A leg could not sim. Closed form on the slip, quality capped at 0.64. No fake sim %.", parlay.correlation === "fallback-haircut" ? " Haircut table is fallback only — stamped Thin + fallback-haircut." : ""]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: "Near-independent games. Combined chance is the product of each leg. Displayed capped at 99%."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: ribbonSitWhy(pick, scan.rows)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-ink/90",
						children: pick.why
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulesRan, {
				kind: "parlay",
				layers: [
					{ id: "sgp" },
					{
						id: "latent",
						empty: !usedSim,
						thin: parlay.correlation === "fallback-haircut"
					},
					{
						id: "sim",
						empty: !usedSim,
						thin: parlay.correlation === "fallback-haircut"
					}
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl text-ink",
						children: "Each leg"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Same breakdown a single ticket gets. Open this leg for the dedicated page."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "grid gap-3",
						children: parlay.legs.map((leg, i) => {
							const row = matchLegRow(scan.rows, leg);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegBlock, {
								index: i,
								row,
								fallback: leg,
								snapshot,
								scan,
								onRemove: () => removeLeg(i)
							}) }, `${leg.eventId}-${leg.selection}-${i}`);
						})
					})
				]
			}),
			locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockedStamp, { ticket: locked }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						onClick: lockToLog,
						children: "Save to Log"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/parlay",
						className: "inline-flex min-h-11 items-center rounded-md bg-wash px-4 text-sm font-medium text-ink",
						children: "Add a leg"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/parlay",
						className: "inline-flex min-h-11 items-center text-sm font-medium text-gold underline-offset-4 hover:underline",
						children: "Back to Parlay"
					})
				]
			}),
			lockError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-gold",
				children: lockError
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoFirstNote, { venue: "Hard Rock Bet Florida" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenshotIngest, {
				kind: "ticket",
				heading: "Photograph the Hard Rock Bet Florida slip to lock this price"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoWagerCta, { what: "parlay slip" })
		]
	});
}
function LegBlock({ index, row, fallback, snapshot, scan, onRemove }) {
	const standDown = !row || row.tag === "unknown_market" || row.tag === "illegal_fl";
	const pick = row ? pickFromScanRow(row) : null;
	const eventId = row?.eventId ?? fallback.eventId;
	const researchQ = useQuery({
		queryKey: ["research", eventId],
		queryFn: () => getEventResearch({ data: { eventId } }),
		enabled: Boolean(eventId?.startsWith("espn-")),
		staleTime: 12e4
	});
	const research = researchQ.data && researchQ.data.ok ? researchQ.data.research : null;
	const brief = snapshot.briefs?.find((b) => b.eventId === eventId);
	const predict = snapshot.predict?.find((p) => p.eventId === eventId);
	const gameRows = scan.rows.filter((r) => r.eventId === eventId);
	const player = pick?.player ? (brief?.players ?? research?.players ?? []).find((p) => p.name === pick.player) : void 0;
	const parsedProp = row ? parsePropSelection(row.selection, row.sport, {
		player: row.player,
		point: row.point,
		side: row.side
	}) : null;
	const report = eventId ? buildChance(assembleChanceInput({
		rows: gameRows,
		brief,
		research: research ?? void 0,
		predict,
		extra: {
			ticketHome: brief?.ticketHome,
			handleHome: brief?.handleHome,
			steam: brief?.steam
		},
		home: row?.home ?? fallback.home,
		away: row?.away ?? fallback.away
	})) : null;
	const layers = mergeLayers(report, row && (row.isProp || row.marketType === "prop") ? buildPropChance({
		sport: row.sport,
		selection: row.selection,
		price: row.price,
		player: row.player,
		side: row.side,
		point: row.point,
		home: row.home,
		away: row.away,
		playerTeam: player?.team,
		gameTotal: brief?.total ?? row.total,
		homeSpread: brief?.homeSpread ?? row.homeSpread,
		venue: brief?.venue ?? research?.venue,
		weatherTemp: brief?.weatherTemp ?? research?.weatherTemp,
		weatherWind: brief?.weatherWind ?? research?.weatherWind,
		weatherPrecip: brief?.weatherPrecip ?? research?.weatherPrecip,
		injuries: brief?.injuries ?? research?.injuries,
		teamWinChance: teamWinForPlayer(row.home, row.away, player?.team, brief?.chanceHome ?? report?.home),
		seasonRate: parsedProp ? rateFromStats(parsedProp.stat, player?.stats) : void 0,
		recentRate: parsedProp && player?.recentStats ? rateFromStats(parsedProp.stat, player.recentStats) : void 0,
		recentN: player?.recentN,
		...propContextFromBrief(brief ?? (research ? {
			...research,
			form: research.lastFive
		} : void 0), {
			home: row.home,
			away: row.away,
			player: row.player ?? parsedProp?.player,
			playerTeam: player?.team,
			stat: parsedProp?.stat
		})
	}) : null);
	const kind = row?.isProp || row?.marketType === "prop" ? "prop" : isPeriodSel(row?.selection ?? fallback.selection) ? "period" : "game";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "paper-card space-y-4 p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "stamp text-gold",
					children: [
						"Leg ",
						index + 1,
						" · ",
						sportLabel(row?.sport ?? fallback.sport),
						standDown ? " · stood down" : ""
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display mt-2 text-xl text-ink",
					children: shortPick(row?.selection ?? fallback.selection, row?.marketType ?? fallback.marketType)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-gold",
					children: [
						formatKickoff(row?.start ?? fallback.start),
						" · ",
						row?.away ?? fallback.away,
						" at ",
						row?.home ?? fallback.home
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 font-mono text-xs text-muted",
					children: [
						formatAmerican(row?.price ?? fallback.price),
						" · ",
						row?.marketType ?? fallback.marketType
					]
				})
			] }),
			standDown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-gold",
				children: row?.tag === "illegal_fl" ? "This leg is not a legal Florida ticket (college player). Stood down. Combined still opened." : "This leg could not be priced on the delayed board (unknown market or missing row). Stood down. Combined still opened."
			}) : null,
			pick ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WagerMeter, {
					className: "mt-1",
					size: "sm",
					chance: pick.chance,
					price: pick.price,
					label: "This leg"
				}),
				pick.implied != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EdgeRow, { pick }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimLine, { pick }),
				pick.processSource ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						"Process ",
						pick.processLooked ? "Looked" : "Ran",
						" · ",
						pick.processSource
					]
				}) : null
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WagerMeter, {
				className: "mt-1",
				size: "sm",
				chance: fallback.fairProb,
				price: fallback.price,
				label: "This leg"
			}),
			layers.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayerList, { layers }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulesRan, {
				kind,
				layers
			}),
			pick ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContextPanel, {
				brief,
				researchInjuries: research?.injuries,
				player,
				pick,
				form: brief?.form ?? research?.lastFive
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-3",
				children: [
					pick ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/ticket",
						search: { id: pick.id },
						className: "inline-flex min-h-11 items-center text-sm font-medium text-gold underline-offset-4 hover:underline",
						children: "Open this leg"
					}) : null,
					eventId.startsWith("espn-") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/game/$eventId",
						params: { eventId },
						className: "inline-flex min-h-11 items-center text-sm font-medium text-gold underline-offset-4 hover:underline",
						children: "Hard Rock sheet"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "sm",
						variant: "outline",
						onClick: onRemove,
						children: "Remove this leg"
					})
				]
			})
		]
	});
}
function isPeriodSel(sel) {
	return /inning|quarter|1st half|2nd half|\bperiod\b|f5|first 5/i.test(sel);
}
function SimLine({ pick }) {
	if (pick.simFair != null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mt-2 text-xs text-muted",
		children: [
			"Our sim vs the market pool. Sim ",
			Math.round(pick.simFair * 100),
			"% · pool ",
			pick.poolFair != null ? `${Math.round(pick.poolFair * 100)}%` : "—",
			". Displayed capped at 99%."
		]
	});
	if (pick.poolFair != null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mt-2 text-xs text-muted",
		children: [
			"Closed form (sim did not emit) · pool ",
			Math.round(pick.poolFair * 100),
			"% · quality capped at 0.64. No fake sim %."
		]
	});
	return null;
}
function mergeLayers(report, prop) {
	const gameLayers = report?.layers.map((l) => ({
		id: l.id,
		label: l.label,
		note: l.note,
		value: `${Math.round(l.home * 100)}% home`,
		thin: l.thin,
		empty: l.empty
	})) ?? [];
	const propLayers = prop?.layers.map((l) => ({
		id: l.id,
		label: l.label,
		note: l.note,
		value: `${Math.round(l.p * 100)}%`,
		thin: l.thin,
		empty: l.empty
	})) ?? [];
	if (prop?.illegal || prop?.standDown) return propLayers;
	if (!propLayers.length) return gameLayers;
	const map = /* @__PURE__ */ new Map();
	for (const l of gameLayers) map.set(l.id, l);
	for (const l of propLayers) map.set(l.id, l);
	return [...map.values()];
}
function LayerList({ layers }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-4 space-y-3",
		children: layers.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "rounded-md bg-wash px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex justify-between gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium text-ink",
					children: l.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums text-gold",
					children: l.value
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: l.note
			})]
		}, l.id))
	});
}
function algorithmBecause(pick, gameBecause, propBecause) {
	if (pick.bucket === "prop") return propBecause ?? "Player model on top of the game ensemble: last-10 of THIS stat (EWMA, 60/40 with season), opponent-adjusted defense, minutes/usage, pitcher-vs-batter, and underlying process. The photographed book number is the prior when we have it. Not a lock.";
	if (pick.bucket === "period") return `One inning / quarter / half is noisier than the full game, so this chance is shrunk toward 50/50 versus the full-game ensemble. ${gameBecause ?? "Looks are pooled in log-odds. The sportsbook close is the prior."} Not a lock.`;
	if (pick.parlay) return pick.why;
	return gameBecause ?? "Looks are pooled in log-odds. The sportsbook close is the prior. Prediction markets, ESPN, form, injuries, weather, park, rest, and bets-vs-money (ticket count vs handle) are layers. Public tickets are never copied. Not a lock.";
}
function ContextPanel({ brief, researchInjuries, player, pick, form }) {
	const injuries = brief?.injuries ?? researchInjuries ?? [];
	const usage = pick.eventId ? buildUsage({
		eventId: pick.eventId,
		sport: pick.sport,
		players: brief?.players,
		injuries
	}) : void 0;
	const usageOut = usage?.players.filter((p) => p.standDown).slice(0, 6) ?? [];
	const usageLeft = usage?.players.filter((p) => !p.standDown && p.opportunity > .5).slice(0, 4) ?? [];
	const weatherBits = [
		brief?.weather,
		brief?.weatherTemp != null ? `${Math.round(brief.weatherTemp)}°` : null,
		brief?.weatherWind != null && brief.weatherWind >= 8 ? `wind ${Math.round(brief.weatherWind)} mph` : null,
		brief?.weatherPrecip != null && brief.weatherPrecip >= 20 ? `rain ${Math.round(brief.weatherPrecip)}%` : null
	].filter(Boolean);
	const rest = brief?.homeRestDays != null || brief?.awayRestDays != null ? `Rest: home ${brief?.homeRestDays ?? "—"}d · away ${brief?.awayRestDays ?? "—"}d` : null;
	const records = brief?.homeRecord || brief?.awayRecord ? `Records: ${pick.away ?? "away"} ${brief?.awayRecord ?? "—"} at ${pick.home ?? "home"} ${brief?.homeRecord ?? "—"}` : null;
	const outs = (brief?.homeOuts ?? 0) + (brief?.awayOuts ?? 0) > 0 ? `Listed out: home ${brief?.homeOuts ?? 0} · away ${brief?.awayOuts ?? 0}` : null;
	const stats = player ? Object.entries(player.stats).filter(([, v]) => Number.isFinite(v)).slice(0, 8) : [];
	const recent = player?.recentStats ? Object.entries(player.recentStats).filter(([, v]) => Number.isFinite(v)).slice(0, 8) : [];
	if (!weatherBits.length && !brief?.venue && !records && !rest && !outs && !injuries.length && !stats.length && !brief?.series && !form?.length && !usage) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "paper-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl text-ink",
				children: "Everything on this ticket"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Games and players. Live ESPN log — analysis, not a generated card. Still photograph the live number."
			}),
			form?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stamp text-gold",
					children: "Last 10 scores — analysis"
				}), form.map((block) => {
					const read = analyzeScores(block.games ?? [], 10);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md bg-wash px-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-ink",
								children: block.team
							}),
							read ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-ink/90",
								children: formatFormRead(read, block.team)
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: block.games?.length ? formatScoreLine(block.games) : block.line
							})
						]
					}, block.team);
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 space-y-2 text-sm text-ink/90",
				children: [
					brief?.venue ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["Park / venue: ", brief.venue] }) : null,
					weatherBits.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["Weather: ", weatherBits.join(" · ")] }) : null,
					records ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: records }) : null,
					brief?.series ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["Series: ", brief.series] }) : null,
					rest ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: rest }) : null,
					outs ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: outs }) : null,
					brief?.homeEra != null || brief?.awayEra != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"ERA: home ",
						brief?.homeEra?.toFixed?.(2) ?? "—",
						" · away ",
						brief?.awayEra?.toFixed?.(2) ?? "—"
					] }) : null
				]
			}),
			player ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-md bg-wash px-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "stamp text-gold",
						children: "Player"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-medium text-ink",
						children: [
							player.name,
							player.position ? ` · ${player.position}` : "",
							player.starter ? " · starter" : "",
							player.team ? ` · ${player.team}` : ""
						]
					}),
					stats.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted",
						children: ["Season · ", stats.map(([k, v]) => `${k} ${typeof v === "number" && v < 10 ? v.toFixed(3).replace(/0+$/, "").replace(/\.$/, "") : v}`).join(" · ")]
					}) : null,
					recent.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-gold",
						children: [
							"Last ",
							player.recentN ?? 10,
							" · ",
							recent.map(([k, v]) => `${k} ${typeof v === "number" ? v.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") : v}`).join(" · ")
						]
					}) : null
				]
			}) : null,
			injuries.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-1 text-sm",
				children: injuries.slice(0, 8).map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "text-ink/90",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gold",
							children: i.status
						}),
						" · ",
						i.player,
						i.team ? ` (${i.team})` : "",
						i.detail ? ` — ${i.detail}` : ""
					]
				}, `${i.team}-${i.player}`))
			}) : null,
			usage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-md bg-wash px-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "stamp text-gold",
						children: [
							"Usage ",
							usage.empty || !(brief?.players && brief.players.length) ? "Looked" : usage.thin ? "Thin" : "Ran",
							usage.empty || !(brief?.players && brief.players.length) ? " · leftover opportunity Looked" : " / leftover opportunity"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: usage.note
					}),
					usage.empty || !(brief?.players && brief.players.length) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-ink/90",
						children: "No depth chart on this pull. Count-of-outs is a game look, not usage. We do not invent a backup."
					}) : null,
					usageOut.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-ink/90",
						children: p.note
					}, p.id)),
					usageLeft.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-ink/90",
						children: [
							p.name,
							" leftover opportunity ",
							(p.opportunity * 100).toFixed(0),
							"%",
							p.position ? ` · ${p.position}` : ""
						]
					}, p.id))
				]
			}) : null
		]
	});
}
function bucketLabel(pick) {
	switch (pick.bucket) {
		case "prop": return "Player ticket";
		case "period": return "Period ticket";
		case "sgp": return "Same-game parlay";
		case "parlay2": return "2-game parlay";
		case "parlay3": return "3-game parlay";
		case "parlay4": return "4-game parlay";
		default: return "Popular";
	}
}
function BackLink({ parlay = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: parlay ? "/parlay" : "/today",
		className: "inline-flex min-h-11 items-center gap-1 text-sm text-gold",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
			className: "size-4",
			strokeWidth: 1.75
		}), parlay ? "Parlay" : "AI Picks"]
	});
}
function callWhy(pick) {
	if (pick.parlay) return "A parlay cannot be The Call. Ribbon parlays live on Parlay as the high-hit badge.";
	if (pick.row?.inPlay) return "Live tickets cannot be The Call. They rank on Live with a quality haircut.";
	if (pick.bucket === "period") return "Period slices cannot be The Call. Quality floor keeps them off the gold badge.";
	if (pick.decimalPayout < 1.55) return "Pays less than decimal 1.55 — not The Call.";
	if (pick.chance < .5 || pick.chance > .76) return "Displayed chance outside 50–76% — not The Call.";
	if (pick.infoQuality < .72) return "Not a strong look — not The Call.";
	if (pick.processLooked !== false) return `Process ${pick.processSource ?? "look"} is Looked — not The Call. ${pick.processSource ?? "The process file"} only stamps Ran when that file is posted.`;
	if (pick.implied != null && pick.chance < pick.implied - .01 && (pick.edge ?? 0) <= 0) return "Desk % is more than 1 pt under the book with no positive edge — not The Call.";
	return "Eligible for The Call when it ranks first among singles that still pay.";
}
function RulesRan({ kind, layers }) {
	const rules = rulesFor(kind);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "paper-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl text-ink",
				children: "Rules the desk ran"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					"Every rule looks up live data every time. Thin = live lookup, small sample. Looked = feed empty, not a skip and not a guess. Desk ",
					DESK_VERSION,
					". No dice."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-3 space-y-2",
				children: rules.map((r) => {
					const stamp = ruleStamp(r, layers);
					const source = r.id === "process" ? layers.find((l) => l.id === "process")?.label : void 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md bg-wash px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-baseline justify-between gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-medium text-ink",
								children: [r.title, source ? ` · ${source}` : ""]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "stamp text-gold",
								children: stamp
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: r.text
						})]
					}, r.id);
				})
			})
		]
	});
}
function TicketRoute() {
	const { id } = Route$4.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketPage, { ticketId: id });
}
//#endregion
export { TicketRoute as component };
