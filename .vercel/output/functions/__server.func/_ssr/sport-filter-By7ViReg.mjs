import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as ALL_SPORTS } from "./desk-settings-uc_BKqpk.mjs";
import { S as cn, Vt as sportLabel } from "./research-9TMeO2J4.mjs";
import { gt as useDeskStore } from "./router-nrR04juv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sport-filter-By7ViReg.js
var import_jsx_runtime = require_jsx_runtime();
var ORDER = [...ALL_SPORTS];
function SportFilter({ sports }) {
	const value = useDeskStore((s) => s.sportFilter);
	const set = useDeskStore((s) => s.setSportFilter);
	const live = new Set(sports);
	const extras = sports.filter((s) => !ORDER.includes(s));
	const options = [
		"ALL",
		...ORDER,
		...extras
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-2 pb-1",
		role: "tablist",
		"aria-label": "Filter by sport",
		children: options.map((s) => {
			const active = value === s || s === "ALL" && (!value || value === "ALL");
			const soon = s !== "ALL" && !live.has(s);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				role: "tab",
				"aria-selected": active,
				onClick: () => set(s),
				className: cn("min-h-11 rounded-md px-3 text-sm font-medium", active ? "bg-gold text-navy-deep" : "bg-wash text-muted hover:text-ink"),
				children: [
					s === "ALL" ? "All" : s === "NCAAF" ? "College Football" : s === "NCAAB" ? "College Basketball" : s,
					soon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-1 text-xs uppercase tracking-wide opacity-70",
						children: "soon"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						children: s === "ALL" ? "All sports" : sportLabel(s)
					})
				]
			}, s);
		})
	});
}
function applySportFilter(rows, sportFilter) {
	if (!sportFilter || sportFilter === "ALL") return rows;
	return rows.filter((r) => r.sport === sportFilter);
}
function SportSeasonNote({ sport }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "rounded-md bg-wash px-4 py-3 text-sm text-ink/80",
		children: {
			NBA: "NBA preseason typically tips in early October. When ESPN lists the games they show here — even before a number is posted. Photograph a Hard Rock Bet Florida ticket anytime and we grade it the same way as football.",
			NHL: "NHL preseason typically starts mid-September. Games stay on this board once ESPN lists them. Photograph the book when the number drops.",
			NCAAB: "College basketball opens in early November. Team bets (who wins, spread, over/under) are allowed in Florida. College player bets are not. Photograph a ticket anytime.",
			NCAAF: "College football is on the board through the fall. Team bets only for player stats — no college athlete props in Florida.",
			MLB: "MLB posts most days in season. If tonight is empty, the slate may be off or already final.",
			NFL: "NFL Sundays, plus Monday and Thursday nights. Photograph the Hard Rock number before you confirm."
		}[sport] ?? "No games in this filter yet. Photograph a ticket and we will still grade it."
	});
}
//#endregion
export { SportSeasonNote as n, applySportFilter as r, SportFilter as t };
