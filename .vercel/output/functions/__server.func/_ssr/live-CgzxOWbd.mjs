import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as isCollegeSport } from "./desk-settings-uc_BKqpk.mjs";
import { tt as liveFromRow } from "./research-9TMeO2J4.mjs";
import { gt as useDeskStore, j as pickInSport, xt as useDeskDecision, z as sortByMood } from "./router-nrR04juv.mjs";
import { t as SportFilter } from "./sport-filter-By7ViReg.mjs";
import { r as PickCard } from "./pick-card-CgC78swj.mjs";
import { t as PhotoWagerCta } from "./photo-wager-cta-D50QtD9g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live-CgzxOWbd.js
var import_jsx_runtime = require_jsx_runtime();
function LivePage() {
	const { picks, query, snapshot, scan } = useDeskDecision();
	const sportFilter = useDeskStore((s) => s.sportFilter);
	const hideCollege = useDeskStore((s) => s.hideCollege);
	const hideLive = useDeskStore((s) => s.hideLive);
	const hiddenPickIds = useDeskStore((s) => s.hiddenPickIds);
	const sports = [...new Set((scan?.rows ?? []).map((r) => r.sport))];
	const inSport = (p) => {
		if (!pickInSport(p, sportFilter)) return false;
		if (hideCollege && isCollegeSport(p.sport)) return false;
		return true;
	};
	const isLive = (p) => Boolean(p.row?.inPlay);
	const live = sortByMood([
		...picks?.popular ?? [],
		...picks?.props ?? [],
		...picks?.periods ?? []
	].filter(inSport).filter(isLive).filter((p) => !hiddenPickIds.includes(p.id)), "safe").slice(0, 8);
	const leftover = live.filter((p) => p.row?.leftover);
	const microStandDown = (scan?.rows ?? []).filter((r) => {
		if (!r.inPlay) return false;
		if (hideCollege && isCollegeSport(r.sport)) return false;
		if (sportFilter && sportFilter !== "ALL" && r.sport !== sportFilter) return false;
		const s = liveFromRow(r);
		return s.inPlay && !s.complete;
	});
	if (hideLive) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-gold",
				children: "In-play hidden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-1 text-3xl text-ink md:text-4xl",
				children: "Live"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-ink/80",
				children: "Live tickets are hidden in More → settings. Turn that off to see leftover-mean remaining stats. Never The Call."
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/more",
			className: "inline-flex min-h-11 items-center rounded-md bg-gold px-4 text-sm font-medium text-navy-deep",
			children: "Open settings"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-gold",
					children: "Game already started. Never The Call."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-1 text-3xl text-ink md:text-4xl",
					children: "Live"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-ink/80",
					children: "Game already started. These numbers use what is left in the game. Never The Call."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SportFilter, { sports }),
			query.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-md bg-wash-gold px-4 py-3 text-sm text-gold",
				children: "Live board missing. Photograph the Hard Rock Bet Florida screen. We read the live price. Then you confirm it on Log."
			}) : null,
			!picks && !query.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: "Reading in-play tickets…"
			}) : null,
			leftover.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl text-ink",
					children: "Remaining from leftover mean"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 mb-3 text-sm text-muted",
					children: "Score is in. The remaining over/under is leftover mean × clock left, not a shaved pre-game %."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-3 md:grid-cols-2",
					children: leftover.map((pick, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickCard, {
						pick,
						rank: i + 1
					}) }, pick.id))
				})
			] }) : null,
			picks && !live.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "paper-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "stamp text-gold",
						children: "Off the clock"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-2 text-xl text-ink",
						children: "Nothing in-play on this filter."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Live is only games that have started. Pre-tip tickets sit on AI Picks. Clear the sport filter, or wait for first pitch / kickoff / puck drop."
					})
				]
			}) : null,
			live.filter((p) => !p.row?.leftover).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl text-ink",
					children: "In-play board"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 mb-3 text-sm text-muted",
					children: "Quality haircut. Missing critical S stands that micro row down."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-3 md:grid-cols-2",
					children: live.filter((p) => !p.row?.leftover).map((pick, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickCard, {
						pick,
						rank: i + 1
					}) }, pick.id))
				})
			] }) : null,
			microStandDown.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: [
					new Set(microStandDown.map((r) => r.eventId)).size,
					" in-play game",
					new Set(microStandDown.map((r) => r.eventId)).size === 1 ? "" : "s",
					" missing down / outs / strength — those micros stand down."
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoWagerCta, { what: "wager" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: ["This site never places a bet. Live tickets cannot be The Call.", snapshot ? ` · ${snapshot.hours.label}` : ""]
			})
		]
	});
}
var SplitComponent = LivePage;
//#endregion
export { SplitComponent as component };
