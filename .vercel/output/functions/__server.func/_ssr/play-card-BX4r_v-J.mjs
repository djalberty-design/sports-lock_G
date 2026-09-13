import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/play-card-BX4r_v-J.js
var import_jsx_runtime = require_jsx_runtime();
function TapeStrip({ ticketPct, handlePct, lean, note }) {
	if (ticketPct == null && handlePct == null) return null;
	const t = Math.round((ticketPct ?? 0) * 100);
	const h = Math.round((handlePct ?? 0) * 100);
	const label = lean === "sharp" ? "Money disagrees with the tickets" : lean === "public" ? "Public is on the tickets" : "Tickets and dollars agree";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 rounded-md bg-wash px-3 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "stamp text-gold",
				children: "Bets vs money"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 grid grid-cols-2 gap-3 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: "Wagers (ticket count)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-lg tabular-nums text-ink",
						children: [t, "%"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 h-1.5 overflow-hidden rounded-full bg-navy-deep",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block h-full bg-ink/50",
							style: { width: `${t}%` }
						})
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: "Dollars (handle)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-lg tabular-nums text-gold",
						children: [h, "%"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 h-1.5 overflow-hidden rounded-full bg-navy-deep",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block h-full bg-gold",
							style: { width: `${h}%` }
						})
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-ink/80",
				children: [note ? note.replace(/\s+$/, "").replace(/\.+$/, "") + "." : `${label}.`, " Analyzed, not copied."]
			})
		]
	});
}
//#endregion
export { TapeStrip as t };
