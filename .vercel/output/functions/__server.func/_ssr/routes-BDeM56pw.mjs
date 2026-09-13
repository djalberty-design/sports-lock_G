import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as BRAND } from "./research-9TMeO2J4.mjs";
import { a as Radio, f as Combine, p as ClipboardList, r as Sparkles, s as Newspaper } from "../_libs/lucide-react.mjs";
import { gt as useDeskStore } from "./router-nrR04juv.mjs";
import { n as ConnectAppsNote, t as BankrollBar } from "./bankroll-bar-_2w8trl6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BDeM56pw.js
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		to: "/today",
		icon: Sparkles,
		stamp: "01",
		title: "AI Picks",
		body: "Tonight’s named tickets. Photograph Hard Rock to lock the live price."
	},
	{
		to: "/board",
		icon: Newspaper,
		stamp: "02",
		title: "Games",
		body: "Every matchup. Add a leg or photograph the number."
	},
	{
		to: "/parlay",
		icon: Combine,
		stamp: "03",
		title: "Combos",
		body: "2-, 3-, and 4-pick tickets with the best chance they all hit. Or build your own."
	},
	{
		to: "/live",
		icon: Radio,
		stamp: "04",
		title: "Live",
		body: "Game already started. These numbers use what is left. Never The Call."
	},
	{
		to: "/desk",
		icon: ClipboardList,
		stamp: "05",
		title: "Log",
		body: "Photographed tickets wait here. Tap Hit or Miss after the game."
	}
];
function StartPage() {
	const onboarded = useDeskStore((s) => s.onboarded);
	const setOnboarded = useDeskStore((s) => s.setOnboarded);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-gold",
						children: BRAND.kicker
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-2 text-3xl text-ink md:text-5xl",
						children: "Set the stake. Then take the ticket."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-base text-ink/80",
						children: "Type what you can spend. AI Picks names a ticket. You place it at Hard Rock Bet Florida if you want. This site never places a bet."
					})
				]
			}),
			onboarded ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Type what you can spend. Then open AI Picks."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BankrollBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/today",
				onClick: () => setOnboarded(true),
				className: "inline-flex min-h-12 w-full items-center justify-center rounded-md bg-gold px-5 text-base font-medium text-navy-deep sm:w-auto",
				children: "Open AI Picks"
			}),
			onboarded ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl text-ink",
					children: "Five desks"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 mb-3 text-sm text-muted",
					children: "Five desks. Fantasy lives in More. This site never places a bet."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-3 md:grid-cols-2",
					children: TABS.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: tab.to,
						onClick: () => setOnboarded(true),
						className: "paper-card block p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "stamp text-gold",
								children: tab.stamp
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-display mt-2 flex items-center gap-2 text-xl text-ink",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(tab.icon, {
									className: "size-4 text-gold",
									strokeWidth: 1.75
								}), tab.title]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: tab.body
							})
						]
					}) }, tab.to))
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConnectAppsNote, {})
		]
	});
}
var SplitComponent = StartPage;
//#endregion
export { SplitComponent as component };
