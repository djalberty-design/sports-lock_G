import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as isCollegeSport } from "./desk-settings-uc_BKqpk.mjs";
import { C as coreFunSplit, L as formatAmerican, R as formatBetUsd, V as formatKickoff, Vt as sportLabel, z as formatChancePct } from "./research-9TMeO2J4.mjs";
import { y as Camera } from "../_libs/lucide-react.mjs";
import { A as pickHero, ft as selectUnit, gt as useDeskStore, j as pickInSport, xt as useDeskDecision, z as sortByMood } from "./router-nrR04juv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gameday-Bq1Y8YGw.js
var import_jsx_runtime = require_jsx_runtime();
function GamedayPage() {
	const { picks, scan, snapshot } = useDeskDecision();
	const stake = useDeskStore(selectUnit);
	const liveBankroll = useDeskStore((s) => s.liveBankroll);
	const split = coreFunSplit(liveBankroll);
	const sportFilter = useDeskStore((s) => s.sportFilter);
	const hideCollege = useDeskStore((s) => s.hideCollege);
	const hideLive = useDeskStore((s) => s.hideLive);
	const hiddenPickIds = useDeskStore((s) => s.hiddenPickIds);
	const inSport = (p) => {
		if (!pickInSport(p, sportFilter)) return false;
		if (hideCollege && (isCollegeSport(p.sport) || p.parlay?.sports?.some(isCollegeSport))) return false;
		if (hiddenPickIds.includes(p.id)) return false;
		return true;
	};
	const popular = sortByMood((picks?.popular ?? []).filter(inSport).filter((p) => !p.row?.inPlay || !hideLive), "safe");
	const hero = picks ? pickHero([picks.hero, ...popular].filter((p) => Boolean(p)).filter(inSport), popular, "safe") : null;
	const cards = (hero ? [hero, ...popular.filter((p) => p.id !== hero.id)] : popular).slice(0, 8);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-gold",
					children: "One screen. Kickoff, the pick, the dollars."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-1 text-3xl text-ink",
					children: "Game day"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-ink/80",
					children: "Photograph Hard Rock to confirm the live number. This site never places a bet."
				})
			] }),
			snapshot?.hours.label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: snapshot.hours.label
			}) : null,
			!cards.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Nothing named yet. Open AI Picks, or photograph a Hard Rock screen."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3",
				children: cards.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "paper-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "stamp text-gold",
							children: [hero && p.id === hero.id ? "The Call" : sportLabel(p.sport), p.start ? ` · ${formatKickoff(p.start, true)}` : ""]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display mt-2 text-2xl text-ink",
							children: p.selection
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-gold",
							children: [
								"Find it on Hard Rock Bet Florida",
								p.price != null ? ` at ${formatAmerican(p.price)}` : "",
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-display text-3xl tabular-nums text-gold",
							children: formatChancePct(p.chance) ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-ink",
							children: "Chance it hits. Not a guarantee."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-base text-ink",
							children: [
								"Recommended stake ",
								formatBetUsd(p.parlay && p.parlay.legs.length >= 3 || p.price != null && p.price >= 130 ? split.funTicket || stake : stake),
								p.parlay && p.parlay.legs.length >= 3 || p.price != null && p.price >= 130 ? " · Fun / lotto dollars" : " · Core 1%",
								p.price != null && stake > 0 ? ` · if it hits you get about ${formatBetUsd(stake * (p.decimalPayout || 1))} back` : "",
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/ticket",
							search: { id: p.id },
							hash: "lock-in",
							className: "mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-gold px-4 text-sm font-medium text-navy-deep",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
								className: "size-4",
								strokeWidth: 1.75
							}), "Confirm with Hard Rock Photo"]
						})
					]
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: [scan?.rows.length ? `${scan.rows.length} delayed rows on the board.` : "Board still loading.", " 21+ stays in the footer."]
			})
		]
	});
}
var SplitComponent = GamedayPage;
//#endregion
export { SplitComponent as component };
