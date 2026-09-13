import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as STATUS_LABEL } from "./research-9TMeO2J4.mjs";
import { xt as useDeskDecision } from "./router-nrR04juv.mjs";
import { t as OPTION_CATALOG } from "./options-Vkqe0eTA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/options-PlBik_TA.js
var import_jsx_runtime = require_jsx_runtime();
function OptionsPage() {
	const { options } = useDeskDecision();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-gold",
					children: "Eight types · one catalog"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-2 text-3xl text-ink",
					children: "What this app will even consider."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-ink/80",
					children: "Each type has a plain-English deep dive: how it works, when it works, when it fails, and what never to do. Status is scored from today's delayed odds — not a 0–100 game grade."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-4 md:grid-cols-2",
			children: OPTION_CATALOG.map((opt) => {
				const st = options.find((o) => o.kind === opt.kind);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/option/$kind",
					params: { kind: opt.kind },
					className: "paper-card block p-5 transition-shadow hover:shadow-[var(--shadow-paper-hover)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "stamp text-gold",
								children: opt.symbol
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-wider text-gold",
								children: st ? STATUS_LABEL[st.status] : "—"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display mt-2 text-2xl text-ink",
							children: opt.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-ink/80",
							children: opt.promise
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: st?.note
						})
					]
				}) }, opt.kind);
			})
		})]
	});
}
var SplitComponent = OptionsPage;
//#endregion
export { SplitComponent as component };
