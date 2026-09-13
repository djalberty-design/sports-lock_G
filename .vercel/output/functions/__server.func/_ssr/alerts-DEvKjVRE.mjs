import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as ALERTS_ET } from "./desk-settings-uc_BKqpk.mjs";
import { n as BRAND } from "./research-9TMeO2J4.mjs";
import { gt as useDeskStore, vt as Button } from "./router-nrR04juv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alerts-DEvKjVRE.js
var import_jsx_runtime = require_jsx_runtime();
function AlertsPage() {
	const notifyBrowser = useDeskStore((s) => s.notifyBrowser);
	const setNotifyBrowser = useDeskStore((s) => s.setNotifyBrowser);
	async function enableBrowser() {
		if (!("Notification" in window)) return;
		const perm = await Notification.requestPermission();
		setNotifyBrowser(perm === "granted");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-gold",
					children: "Plan notes · not a live odds ping"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-2 text-3xl text-ink",
					children: "Three weekday windows. No texts."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-ink/80",
					children: "Optional reminders at noon, 4:10 p.m., and 6:30 p.m. Eastern. Browser notes only fire while this tab is open. The site cannot see Hard Rock Bet."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: ALERTS_ET.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "paper-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "stamp text-gold",
							children: a.id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display mt-2 text-xl text-ink",
							children: a.when
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-ink/90",
							children: a.job
						})
					]
				}, a.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "paper-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-ink",
						children: "Browser permission"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Optional. Only fires while the tab is open. Never a live odds ping."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						variant: "outline",
						onClick: () => void enableBrowser(),
						children: notifyBrowser ? "Browser notes allowed" : "Allow browser notes"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "paper-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-ink",
						children: "Where bets actually go"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 list-disc space-y-2 pl-5 text-sm text-ink/90",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"Live sports: ",
								BRAND.venueLive,
								", 21+, geofenced Florida. This site never logs into it and never files a ticket."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"Fantasy: ",
								BRAND.venueDfs,
								" classic. DraftKings Sportsbook is not a Florida live play."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"Prediction markets: ",
								BRAND.venuePredict,
								" — a different legal bucket. Ignored as today's pick."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "No texts. No cash-out log. No promo tokens on AI Picks." })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted",
						children: [
							"If play is no longer fun, ",
							BRAND.helpline,
							". Pause-all-advice is on Log."
						]
					})
				]
			})
		]
	});
}
var SplitComponent = AlertsPage;
//#endregion
export { SplitComponent as component };
