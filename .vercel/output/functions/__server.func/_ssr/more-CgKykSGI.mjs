import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { f as useRouterState, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { R as formatBetUsd, r as DESK_VERSION } from "./research-9TMeO2J4.mjs";
import { B as useAccess, c as HOW_IT_WORKS, d as WORDS_WE_USE, ft as selectUnit, gt as useDeskStore, u as MORE_LINKS } from "./router-nrR04juv.mjs";
import { t as Input } from "./input-BAVbE0tC.mjs";
import { t as BankrollBar } from "./bankroll-bar-_2w8trl6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/more-CgKykSGI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MOODS = [
	{
		id: "safe",
		label: "Safest"
	},
	{
		id: "value",
		label: "Best value"
	},
	{
		id: "pay",
		label: "Pays more"
	}
];
function MorePage() {
	const hash = useRouterState({ select: (s) => s.location.hash });
	const deskMood = useDeskStore((s) => s.deskMood);
	const setDeskMood = useDeskStore((s) => s.setDeskMood);
	const unitPct = useDeskStore((s) => s.unitPct);
	const setUnitPct = useDeskStore((s) => s.setUnitPct);
	const hideCollege = useDeskStore((s) => s.hideCollege);
	const setHideCollege = useDeskStore((s) => s.setHideCollege);
	const hideLive = useDeskStore((s) => s.hideLive);
	const setHideLive = useDeskStore((s) => s.setHideLive);
	const liveBankroll = useDeskStore((s) => s.liveBankroll);
	const unit = useDeskStore(selectUnit);
	const { isAdmin } = useAccess();
	(0, import_react.useEffect)(() => {
		const id = String(hash ?? "").replace(/^#/, "");
		if (!id) return;
		document.getElementById(id)?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}, [hash]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-gold",
						children: "How this site works"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-1 text-3xl text-ink md:text-4xl",
						children: "More"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm text-ink/80",
						children: "Set money. Pick a ticket. Photograph Hard Rock. Mark it on Log. This site never places a bet."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "paper-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stamp text-gold",
					children: "On this page"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-1",
					children: MORE_LINKS.filter((item) => item.to !== "/admin" || isAdmin).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						hash: item.hash || void 0,
						className: "flex min-h-11 items-center justify-between gap-3 rounded-md px-1 py-1 hover:bg-wash",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm font-medium text-ink",
							children: item.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs text-muted",
							children: item.note
						})] })
					}) }, item.label))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "how",
				className: "paper-card scroll-mt-24 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "stamp text-gold",
						children: "Four steps"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-2 text-xl text-ink",
						children: "How this site works"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-4 grid gap-3 sm:grid-cols-2",
						children: HOW_IT_WORKS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-md bg-wash px-3 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "stamp text-gold",
									children: s.n
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-medium text-ink",
									children: s.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: s.body
								})
							]
						}, s.n))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "words",
				className: "paper-card scroll-mt-24 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "stamp text-gold",
						children: "One line each"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-2 text-xl text-ink",
						children: "Words we use"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-4 space-y-3",
						children: WORDS_WE_USE.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-sm font-medium text-gold",
							children: w.word
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-sm text-ink/90",
							children: w.line
						})] }, w.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "money",
				className: "scroll-mt-24 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BankrollBar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "paper-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "stamp text-gold",
							children: "Settings"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display mt-2 text-xl text-ink",
							children: "What this device remembers"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Saved here. Same board still ranks the same."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
							className: "mt-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
									className: "text-xs uppercase tracking-[0.14em] text-muted",
									children: "Default mood"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 flex flex-wrap gap-2",
									children: MOODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setDeskMood(m.id),
										className: deskMood === m.id ? "min-h-11 rounded-md bg-gold px-4 text-sm font-medium text-navy-deep" : "min-h-11 rounded-md bg-wash px-4 text-sm font-medium text-muted hover:text-ink",
										children: m.label
									}, m.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-muted",
									children: "Safest is the default. Highest chance that still pays."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-5 block text-xs uppercase tracking-[0.14em] text-muted",
							children: ["Percent of my money for one ticket", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: .1,
									max: 10,
									step: .1,
									value: Math.round(unitPct * 1e3) / 10,
									onChange: (e) => setUnitPct(Number(e.target.value) / 100),
									className: "max-w-[8rem]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm normal-case tracking-normal text-ink",
									children: [
										formatBetUsd(unit),
										" on ",
										formatBetUsd(liveBankroll)
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-5 flex min-h-11 items-center gap-3 text-sm text-ink",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: hideCollege,
								onChange: (e) => setHideCollege(e.target.checked),
								className: "size-4 accent-[var(--color-gold)]"
							}), "Hide college (NCAAF / NCAAB). College player bets stay blocked either way."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-2 flex min-h-11 items-center gap-3 text-sm text-ink",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: hideLive,
								onChange: (e) => setHideLive(e.target.checked),
								className: "size-4 accent-[var(--color-gold)]"
							}), "Hide live tickets. Live can never be The Call."]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: ["Desk ", DESK_VERSION]
			})
		]
	});
}
var SplitComponent = MorePage;
//#endregion
export { SplitComponent as component };
