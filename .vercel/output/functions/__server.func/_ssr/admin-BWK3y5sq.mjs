import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as OWNER_ADMIN_EMAIL, t as ADMIN_POWERS } from "./admin-845hXR6e.mjs";
import { n as ALL_SPORTS } from "./desk-settings-uc_BKqpk.mjs";
import { R as formatBetUsd, Vt as sportLabel, z as formatChancePct } from "./research-9TMeO2J4.mjs";
import { B as useAccess, G as listAccessRequests, H as decideAccessRequest, J as revokeAllowlistEmail, K as listAllowlist, U as getFeedHealth, V as addAllowlistEmail, X as updateLedgerBet, Y as saveDeskSettings, a as downloadLedger, q as listMasterLedger, vt as Button, xt as useDeskDecision } from "./router-nrR04juv.mjs";
import { t as Input } from "./input-BAVbE0tC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BWK3y5sq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		id: "allowlist",
		label: "Allowlist"
	},
	{
		id: "tune",
		label: "Tuning"
	},
	{
		id: "ledger",
		label: "Ledger"
	},
	{
		id: "status",
		label: "Status"
	}
];
function AdminPage() {
	const { isAdmin, access } = useAccess();
	const [tab, setTab] = (0, import_react.useState)("allowlist");
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl text-ink",
				children: "Admin"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Signed in as ",
					access?.email || "a user",
					". Admin settings are only for the owner. View AI Picks, photograph Hard Rock, and keep your own log."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/today",
				className: "font-medium text-gold underline-offset-4 hover:underline",
				children: "Back to AI Picks"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-gold",
						children: ["Owner desk · ", OWNER_ADMIN_EMAIL]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-1 text-3xl text-ink md:text-4xl",
						children: "Admin settings"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-ink/80",
						children: "Allowlist, algorithm knobs, master ledger, and feed health. Regular users cannot see this. This site never places a bet."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-2 sm:grid-cols-2",
				children: ADMIN_POWERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-md bg-wash px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-ink",
						children: p.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: p.line
					})]
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto",
				role: "tablist",
				"aria-label": "Admin sections",
				children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					role: "tab",
					"aria-selected": tab === t.id,
					onClick: () => setTab(t.id),
					className: tab === t.id ? "min-h-11 rounded-md bg-gold px-4 text-sm font-medium text-navy-deep" : "min-h-11 rounded-md bg-wash px-4 text-sm font-medium text-muted hover:text-ink",
					children: t.label
				}, t.id))
			}),
			tab === "allowlist" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AllowlistPanel, {}) : null,
			tab === "tune" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TuningPanel, {}) : null,
			tab === "ledger" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LedgerPanel, {}) : null,
			tab === "status" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPanel, {}) : null
		]
	});
}
function AllowlistPanel() {
	const qc = useQueryClient();
	const list = useQuery({
		queryKey: ["allowlist"],
		queryFn: () => listAllowlist(),
		staleTime: 1e4
	});
	const reqs = useQuery({
		queryKey: ["access-requests"],
		queryFn: () => listAccessRequests(),
		staleTime: 1e4
	});
	const [draft, setDraft] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	async function add() {
		setNote("");
		try {
			const rows = await addAllowlistEmail({ data: {
				email: draft,
				role: "user"
			} });
			qc.setQueryData(["allowlist"], rows);
			setDraft("");
			setNote("Approved.");
			qc.invalidateQueries({ queryKey: ["access-requests"] });
		} catch (err) {
			setNote(err instanceof Error ? err.message : "Could not add that email.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "paper-card p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stamp text-gold",
					children: "Approved emails"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display mt-2 text-xl text-ink",
					children: "Allowlist"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 flex flex-col gap-2 sm:flex-row",
					onSubmit: (e) => {
						e.preventDefault();
						add();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						value: draft,
						onChange: (e) => setDraft(e.target.value),
						placeholder: "friend@email.com",
						className: "max-w-md normal-case tracking-normal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Add user"
					})]
				}),
				note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: note
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 divide-y divide-line",
					children: (list.data ?? []).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex min-h-11 items-center justify-between gap-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm text-ink",
							children: row.email
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs uppercase tracking-[0.14em] text-gold",
							children: row.role
						})] }), row.email === "djalberty@gmail.com" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: "Super admin"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							onClick: () => {
								revokeAllowlistEmail({ data: { email: row.email } }).then((rows) => {
									qc.setQueryData(["allowlist"], rows);
									qc.invalidateQueries({ queryKey: ["access-requests"] });
								});
							},
							children: "Revoke"
						})]
					}, row.email))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "paper-card p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "stamp text-gold",
					children: "Queue"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display mt-2 text-xl text-ink",
					children: "Access requests"
				}),
				(reqs.data ?? []).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-3",
					children: reqs.data.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md bg-wash px-3 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-ink",
								children: r.email
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									r.name || "No name",
									" · ",
									r.status
								]
							}),
							r.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									onClick: () => {
										decideAccessRequest({ data: {
											email: r.email,
											approve: true
										} }).then((rows) => {
											qc.setQueryData(["access-requests"], rows);
											qc.invalidateQueries({ queryKey: ["allowlist"] });
										});
									},
									children: "Approve"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: "outline",
									onClick: () => {
										decideAccessRequest({ data: {
											email: r.email,
											approve: false
										} }).then((rows) => {
											qc.setQueryData(["access-requests"], rows);
										});
									},
									children: "Deny"
								})]
							}) : null
						]
					}, r.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "No requests yet."
				})
			]
		})]
	});
}
function TuningPanel() {
	const { settings, rankMs, ranking, scan, picks } = useDeskDecision();
	const qc = useQueryClient();
	const [floor, setFloor] = (0, import_react.useState)(String(Math.round(settings.safestFloor * 100)));
	const [kelly, setKelly] = (0, import_react.useState)(String(settings.kellyMultiplier));
	const [cap, setCap] = (0, import_react.useState)(String(settings.comboLegCap));
	const [feeds, setFeeds] = (0, import_react.useState)(settings.sportFeeds);
	const [note, setNote] = (0, import_react.useState)("");
	const games = new Set((scan?.rows ?? []).map((r) => r.eventId)).size;
	async function save() {
		setNote("");
		try {
			const next = {
				safestFloor: Number(floor) / 100,
				kellyMultiplier: Number(kelly),
				comboLegCap: Number(cap),
				sportFeeds: feeds
			};
			const saved = await saveDeskSettings({ data: next });
			qc.setQueryData(["desk-settings"], saved);
			setNote("Saved. Ranking will refresh on the next odds snapshot.");
		} catch (err) {
			setNote(err instanceof Error ? err.message : "Could not save.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "paper-card space-y-4 p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "stamp text-gold",
				children: "Model knobs"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl text-ink",
				children: "Algorithm & thresholds"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					ranking ? "Ranking in the background." : rankMs != null ? `Last pass ${rankMs} ms.` : "Waiting on the delayed board.",
					" ",
					games ? `${games} games.` : "",
					" ",
					picks?.all.length ?? 0,
					" named tickets."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-xs uppercase tracking-[0.14em] text-muted",
				children: ["Safest floor % (preferred 65)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: floor,
					onChange: (e) => setFloor(e.target.value),
					className: "mt-1 max-w-xs"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-xs uppercase tracking-[0.14em] text-muted",
				children: ["Kelly multiplier (1 = full)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: kelly,
					onChange: (e) => setKelly(e.target.value),
					className: "mt-1 max-w-xs"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-xs uppercase tracking-[0.14em] text-muted",
				children: ["Combo leg cap (8–20)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: cap,
					onChange: (e) => setCap(e.target.value),
					className: "mt-1 max-w-xs"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.14em] text-muted",
				children: "Sport feeds"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3",
				children: ALL_SPORTS.map((sport) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-11 items-center gap-2 rounded-md bg-wash px-3 text-sm text-ink",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: feeds[sport],
						onChange: (e) => setFeeds({
							...feeds,
							[sport]: e.target.checked
						})
					}), sportLabel(sport)]
				}) }, sport))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				onClick: () => void save(),
				children: "Save tuning"
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: note
			}) : null
		]
	});
}
function LedgerPanel() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["master-ledger"],
		queryFn: () => listMasterLedger(),
		staleTime: 15e3
	});
	const rows = q.data?.rows ?? [];
	const a = q.data?.analytics;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
						label: "Tickets",
						value: String(a?.tickets ?? 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
						label: "Hit rate",
						value: a?.hitRate != null ? `${Math.round(a.hitRate * 100)}%` : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
						label: "Hits / misses",
						value: `${a?.hits ?? 0} / ${a?.misses ?? 0}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
						label: "Stake logged",
						value: formatBetUsd(a?.stake ?? 0)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: () => downloadLedger(rows),
					children: "Download my bets JSON"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "paper-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "stamp text-gold",
							children: row.result
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display mt-1 text-lg text-ink",
							children: row.ticketName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								row.userEmail || row.userId,
								" · ",
								formatBetUsd(row.stakeDollars),
								" · ",
								formatChancePct(row.deskTrueProbability) ?? "—"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [[
								"HIT",
								"MISS",
								"PUSH",
								"PENDING"
							].map((result) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: row.result === result ? "primary" : "outline",
								onClick: () => {
									updateLedgerBet({ data: {
										id: row.id,
										result
									} }).then((next) => {
										qc.setQueryData(["master-ledger"], next);
									});
								},
								children: result === "HIT" ? "Hit" : result === "MISS" ? "Miss" : result === "PUSH" ? "Void" : "Open"
							}, result)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: "danger",
								onClick: () => {
									updateLedgerBet({ data: {
										id: row.id,
										delete: true
									} }).then((next) => {
										qc.setQueryData(["master-ledger"], next);
									});
								},
								children: "Delete"
							})]
						})
					]
				}, row.id))
			}),
			!rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No tickets in the master ledger yet."
			}) : null
		]
	});
}
function StatusPanel() {
	const q = useQuery({
		queryKey: ["feed-health"],
		queryFn: () => getFeedHealth(),
		staleTime: 3e4
	});
	const h = q.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "paper-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "stamp text-gold",
				children: "Feeds"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-2 text-xl text-ink",
				children: "System status"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "ESPN, Kalshi, and Polymarket. Delayed public numbers. Not a fill."
			}),
			h ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HealthRow, {
						name: "ESPN",
						ping: h.espn
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HealthRow, {
						name: "Kalshi",
						ping: h.kalshi
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HealthRow, {
						name: "Polymarket",
						ping: h.polymarket
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: q.isPending ? "Pinging feeds…" : "Could not load health."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				className: "mt-4",
				onClick: () => void q.refetch(),
				children: "Ping again"
			})
		]
	});
}
function HealthRow({ name, ping }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center justify-between rounded-md bg-wash px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-medium text-ink",
			children: name
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: ping.ok ? "text-sm text-up" : "text-sm text-down",
			children: [
				ping.ok ? "Up" : "Down",
				" · ",
				ping.ms,
				" ms",
				ping.status ? ` · ${ping.status}` : ""
			]
		})]
	});
}
function MiniStat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "paper-card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs uppercase tracking-[0.14em] text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display mt-1 text-2xl text-ink",
			children: value
		})]
	});
}
var SplitComponent = AdminPage;
//#endregion
export { SplitComponent as component };
