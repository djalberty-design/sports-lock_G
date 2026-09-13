import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as STATUS_LABEL } from "./research-9TMeO2J4.mjs";
import { n as Route$1, xt as useDeskDecision } from "./router-nrR04juv.mjs";
import { n as optionByKind } from "./options-Vkqe0eTA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/option._kind-ynFb0r5w.js
var import_jsx_runtime = require_jsx_runtime();
function OptionPage({ kind }) {
	const meta = optionByKind(kind);
	const { options } = useDeskDecision();
	const st = options.find((o) => o.kind === kind);
	if (!meta) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "paper-card p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-ink",
			children: "Unknown bet type."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/options",
			className: "mt-3 inline-flex min-h-11 items-center text-sm font-medium text-gold underline",
			children: "Back to bet types"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-2xl space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "stamp text-gold",
				children: meta.symbol
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl text-ink",
				children: meta.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "rounded-md bg-wash px-4 py-3 text-sm text-ink",
				children: [
					"Live status: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium uppercase text-gold",
						children: st ? STATUS_LABEL[st.status] : "—"
					}),
					st?.note ? ` · ${st.note}` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-lg text-ink/90",
				children: meta.promise
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "paper-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-ink",
					children: "How it works"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 list-disc space-y-2 pl-5 text-sm",
					children: meta.howItWorks.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: x }, x))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "paper-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-ink",
						children: "When it works"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: meta.whenItWins
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "paper-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-ink",
						children: "When it fails"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: meta.whenItFails
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "paper-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-down",
					children: "Never"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 list-disc space-y-2 pl-5 text-sm",
					children: meta.never.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: x }, x))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/options",
				className: "inline-flex min-h-11 items-center text-sm font-medium text-gold underline-offset-4 hover:underline",
				children: "All bet types"
			})
		]
	});
}
function OptionRoute() {
	const { kind } = Route$1.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionPage, { kind });
}
//#endregion
export { OptionRoute as component };
