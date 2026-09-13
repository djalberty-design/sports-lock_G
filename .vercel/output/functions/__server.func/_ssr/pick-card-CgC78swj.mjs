import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Et as profitOnStake, R as formatBetUsd, S as cn, V as formatKickoff, Vt as sportLabel, z as formatChancePct } from "./research-9TMeO2J4.mjs";
import { o as Pin, t as X, u as EyeOff, y as Camera } from "../_libs/lucide-react.mjs";
import { $ as timingKind, B as useAccess, C as highestTodayLabel, M as pickMatchup, N as qualityBand, Q as feeBadge, W as hidePickRemote, Y as saveDeskSettings, Z as TIMING_COPY, _ as HitReadout, b as candidateToPicks, f as lookChipId, ft as selectUnit, gt as useDeskStore, l as LOOK_LABEL, p as tapeChip, rt as espnLogoUrl, s as CHIP_LINE, v as WagerMeter, xt as useDeskDecision, y as belowSixty } from "./router-nrR04juv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pick-card-CgC78swj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WordSheet({ id, onClose }) {
	if (!id) return null;
	const row = CHIP_LINE[id];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50",
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "word-sheet-title",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0 bg-navy-deep/70",
			"aria-label": "Close",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-x-0 bottom-0 rounded-t-lg bg-card p-5 shadow-[var(--shadow-stamp)] md:inset-auto md:bottom-auto md:left-1/2 md:top-1/3 md:w-[28rem] md:-translate-x-1/2 md:rounded-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "word-sheet-title",
						className: "font-display text-xl text-ink",
						children: row.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "grid size-11 shrink-0 place-items-center rounded-md text-muted hover:bg-wash hover:text-ink",
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
							className: "size-4",
							strokeWidth: 1.75
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-base text-ink/90",
					children: row.line
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/more",
					hash: "words",
					onClick: onClose,
					className: "mt-4 inline-flex min-h-11 items-center text-sm font-medium text-gold underline-offset-4 hover:underline",
					children: "More words"
				})
			]
		})]
	});
}
function PickCard({ pick, featured = false, rank }) {
	const unit = useDeskStore(selectUnit);
	const bankroll = useDeskStore((s) => s.liveBankroll);
	const setParlayLegs = useDeskStore((s) => s.setParlayLegs);
	const { isAdmin } = useAccess();
	const { settings } = useDeskDecision();
	const qc = useQueryClient();
	const hidePick = useDeskStore((s) => s.hidePick);
	const pinPick = useDeskStore((s) => s.pinPick);
	const liveFits = bankroll >= 100 && unit >= 1;
	const profit = pick.price != null ? profitOnStake(unit, pick.price) : null;
	const pinned = settings.pinnedPickId === pick.id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("paper-card relative p-4", featured && "p-5 ring-2 ring-gold md:p-6"),
		children: [
			featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallRibbon, {}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/ticket",
				search: { id: pick.id },
				onClick: () => {
					if (pick.parlay) setParlayLegs(candidateToPicks(pick.parlay, []));
				},
				className: "block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "stamp text-gold",
							children: [
								featured ? "The Call" : rank ? `${rank}` : sportLabel(pick.sport),
								pick.parlay ? ` · ${pick.parlay.legs.length}-pick combo` : "",
								pick.parlay?.sameGame ? " · same-game combo" : ""
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamMarks, { pick })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: cn("font-display mt-2 text-ink", featured ? "text-2xl md:text-3xl" : "text-lg"),
						children: pick.selection
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-gold",
						children: [pick.start ? formatKickoff(pick.start, true) : "", pick.away && pick.home ? ` · ${pickMatchup(pick)}` : ""]
					}),
					featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WagerMeter, {
							className: "mt-3",
							size: "lg",
							chance: pick.chance,
							price: pick.price,
							decimalPayout: pick.decimalPayout,
							label: pick.parlay ? "Chance they all hit" : "Chance it hits"
						}),
						pick.implied != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EdgeRow, {
							pick,
							className: "mt-3"
						}) : null,
						profit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-ink",
							children: [
								formatBetUsd(unit),
								" to win ",
								formatBetUsd(profit.profit),
								!liveFits ? " · names the ticket — This ticket is under $1 or money on Start is under $100" : ""
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-ink/85",
							children: pick.why
						})
					] }) : pick.parlay ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WagerMeter, {
						className: "mt-3",
						size: "sm",
						chance: pick.chance,
						decimalPayout: pick.decimalPayout,
						label: "Chance they all hit"
					}), pick.parlay?.sameGame ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-gold",
						children: "Same-game combo. They move together."
					}) : null] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 rounded-md bg-wash px-3 py-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HitReadout, {
							chance: pick.chance,
							price: pick.price,
							hero: true,
							align: "left"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs font-medium text-gold",
						children: "Full breakdown →"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceChips, {
				pick,
				showCall: featured,
				className: "mt-3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeeTimingRow, { pick }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/ticket",
				search: { id: pick.id },
				hash: "lock-in",
				onClick: () => {
					if (pick.parlay) setParlayLegs(candidateToPicks(pick.parlay, []));
				},
				className: "mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-gold px-3 text-sm font-medium text-navy-deep",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
					className: "size-4",
					strokeWidth: 1.75
				}), "Confirm with Hard Rock Photo"]
			}),
			isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						pinPick(pick.id);
						saveDeskSettings({ data: { pinnedPickId: pinned ? null : pick.id } }).then((s) => {
							qc.setQueryData(["desk-settings"], s);
						});
					},
					className: cn("inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-wash px-3 text-sm font-medium text-muted hover:text-gold", pinned && "text-gold"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, {
						className: "size-4",
						strokeWidth: 1.75
					}), pinned ? "Unpin The Call" : "Pin as The Call"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						hidePick(pick.id);
						hidePickRemote({ data: {
							pickId: pick.id,
							hide: true
						} }).then((ids) => {
							qc.setQueryData(["desk-hidden"], ids);
						});
					},
					className: "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-wash px-3 text-sm font-medium text-muted hover:text-gold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, {
						className: "size-4",
						strokeWidth: 1.75
					}), "Hide"]
				})]
			}) : null
		]
	});
}
function CallRibbon() {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: (e) => {
			e.preventDefault();
			e.stopPropagation();
			setOpen(true);
		},
		className: "ticket-ribbon absolute -top-2 right-4 rounded-sm px-2 py-1 stamp",
		children: "The Call"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WordSheet, {
		id: open ? "the-call" : null,
		onClose: () => setOpen(false)
	})] });
}
function ConfidenceChips({ pick, className, showCall = false }) {
	const [open, setOpen] = (0, import_react.useState)(null);
	const fromUserPhoto = photoLocksThisPick(pick, useDeskStore((s) => s.confirmedTickets), useDeskStore((s) => s.paperTickets));
	const edge = pick.edge;
	const q = Number(pick.infoQuality);
	const qualityForBand = Number.isFinite(q) && q > 0 ? q : pick.parlay ? pick.parlay.sameGame ? .62 : pick.parlay.legs.length >= 4 ? .4 : pick.parlay.legs.length === 3 ? .55 : .7 : 0;
	const band = qualityBand(qualityForBand);
	const tape = tapeChip(pick.tapeStamp, pick.researchOnly, fromUserPhoto);
	const chips = [];
	if (showCall) chips.push({
		id: "the-call",
		label: "The Call",
		tone: "gold"
	});
	if (pick.safestFallback) chips.push({
		id: "highest-today",
		label: highestTodayLabel(pick),
		tone: "gold"
	});
	else if (belowSixty(pick)) chips.push({
		id: "under-60",
		label: "Under 60%",
		tone: "muted"
	});
	chips.push({
		id: lookChipId(band),
		label: LOOK_LABEL[band],
		tone: "gold"
	});
	chips.push({
		id: tape.id,
		label: tape.label,
		tone: "muted"
	});
	if (!fromUserPhoto && tape.id !== "research") chips.push({
		id: "photo-needed",
		label: "Photo to lock this price",
		tone: "muted"
	});
	if (edge != null && Math.abs(edge) >= .008) {
		const pts = Math.round(edge * 100);
		chips.push({
			id: edge > 0 ? "edge-up" : "edge-down",
			label: edge > 0 ? `+${pts} pts better than the book’s chance` : `${pts} pts worse than the book’s chance`,
			tone: edge > 0 ? "up" : "muted"
		});
	}
	if (pick.row?.marketType === "ml" && pick.earlyMover) chips.push({
		id: "early-mover",
		label: "Early Mover Advantage",
		tone: "gold"
	});
	const seen = /* @__PURE__ */ new Set();
	const unique = chips.filter((c) => {
		if (seen.has(c.id)) return false;
		seen.add(c.id);
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-wrap gap-1.5", className),
		children: unique.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: (e) => {
				e.preventDefault();
				e.stopPropagation();
				setOpen(c.id);
			},
			className: cn("rounded-sm bg-wash px-2 py-1 text-left text-xs tracking-wide", c.tone === "gold" ? "text-gold" : c.tone === "up" ? "text-up" : "text-muted"),
			children: c.label
		}, c.id))
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WordSheet, {
		id: open,
		onClose: () => setOpen(null)
	})] });
}
function EdgeRow({ pick, className }) {
	if (pick.implied == null) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-3 gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					label: "Book",
					value: formatChancePct(pick.implied) ?? "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					label: "Desk",
					value: formatChancePct(pick.chance) ?? "—",
					gold: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					label: "Edge",
					value: pick.edge == null ? "—" : `${pick.edge > 0 ? "+" : ""}${Math.round(pick.edge * 100)} pts`
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-xs text-muted",
			children: "Book = what the price implies. Desk = our chance. Edge = the gap."
		})]
	});
}
function MiniStat({ label, value, gold = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-wash px-2 py-2 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "stamp text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("font-display mt-1 text-lg tabular-nums", gold ? "text-gold" : "text-ink"),
			children: value
		})]
	});
}
function TeamMarks({ pick }) {
	if (pick.parlay) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "stamp text-muted",
		children: [pick.parlay.legs.length, " legs"]
	});
	const home = pick.homeLogo || (pick.homeAbbr ? espnLogoUrl(pick.sport, pick.homeAbbr) : void 0);
	const away = pick.awayLogo || (pick.awayAbbr ? espnLogoUrl(pick.sport, pick.awayAbbr) : void 0);
	if (!home && !away) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex -space-x-2",
		children: [away ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: away,
			alt: "",
			className: "size-8 rounded-full bg-wash object-contain"
		}) : null, home ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: home,
			alt: "",
			className: "size-8 rounded-full bg-wash object-contain"
		}) : null]
	});
}
function photoLocksThisPick(pick, confirmed, paper) {
	const sel = (pick.selection || "").toLowerCase();
	if (paper.some((t) => {
		if (pick.eventId && t.gameIds?.includes(pick.eventId)) return true;
		const d = (t.description || "").toLowerCase();
		return Boolean(sel && d && d.includes(sel.slice(0, 18)));
	})) return true;
	if (confirmed.some((t) => {
		if (pick.home && pick.away && t.home === pick.home && t.away === pick.away) return true;
		const s = (t.selection || "").toLowerCase();
		return Boolean(sel && s && sel.includes(s));
	})) return true;
	return false;
}
function FeeTimingRow({ pick }) {
	const [open, setOpen] = (0, import_react.useState)(null);
	const fee = feeBadge(pick.row?.hold);
	const kind = timingKind({
		steam: pick.tapeLean === "sharp",
		tapeLean: pick.tapeLean,
		favorite: (pick.price ?? 0) < 0
	});
	if (!fee && !kind) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 flex flex-wrap gap-1.5",
		children: [
			fee ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: (e) => {
					e.preventDefault();
					e.stopPropagation();
					setOpen("fee");
				},
				className: cn("rounded-sm bg-wash px-2 py-1 text-xs", fee.tone === "avoid" ? "text-down" : fee.tone === "high" ? "text-gold" : "text-muted"),
				children: fee.text
			}) : null,
			kind ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: (e) => {
					e.preventDefault();
					e.stopPropagation();
					setOpen(kind);
				},
				className: "rounded-sm bg-wash-gold px-2 py-1 text-xs text-gold",
				children: TIMING_COPY[kind].title
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WordSheet, {
				id: open,
				onClose: () => setOpen(null)
			})
		]
	});
}
//#endregion
export { EdgeRow as n, PickCard as r, ConfidenceChips as t };
