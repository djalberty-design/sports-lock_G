import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { D as enrichParlayPicks, R as formatBetUsd, S as cn, it as matchParsedToRows } from "./research-9TMeO2J4.mjs";
import { l as ImageUp, y as Camera } from "../_libs/lucide-react.mjs";
import { bt as parseTicketImage, ft as selectUnit, g as buildLockPayload, gt as useDeskStore, h as TicketReview, m as LockedStamp, vt as Button, xt as useDeskDecision } from "./router-nrR04juv.mjs";
import { t as Input } from "./input-BAVbE0tC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/screenshot-ingest-BBprGqET.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Downscale a ticket photo before OCR so the browser does not freeze. */
async function compressScreenshot(file, maxDim = 1200, quality = .82) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read the photo."));
		reader.onload = () => {
			const img = new Image();
			img.onerror = () => reject(/* @__PURE__ */ new Error("Could not decode the photo."));
			img.onload = () => {
				const canvas = document.createElement("canvas");
				let { width, height } = img;
				if (width > maxDim || height > maxDim) {
					if (width > height) {
						height = Math.round(height * maxDim / width);
						width = maxDim;
					} else {
						width = Math.round(width * maxDim / height);
						height = maxDim;
					}
				}
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					resolve(String(reader.result ?? ""));
					return;
				}
				ctx.drawImage(img, 0, 0, width, height);
				resolve(canvas.toDataURL("image/jpeg", quality));
			};
			img.src = String(reader.result ?? "");
		};
		reader.readAsDataURL(file);
	});
}
function dataUrlToBytes(dataUrl) {
	const m = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
	if (!m) return {
		b64: dataUrl,
		mime: "image/jpeg"
	};
	return {
		mime: m[1] || "image/jpeg",
		b64: m[2] || ""
	};
}
var EMPTY = {
	sport: "NFL",
	home: "",
	away: "",
	marketType: "ml",
	side: "home",
	selection: "",
	price: -110,
	confidence: 0,
	confirmed: false
};
function ScreenshotIngest({ kind = "ticket", heading, embedded = false }) {
	const confirmParsed = useDeskStore((s) => s.confirmParsed);
	const place = useDeskStore((s) => s.placePaperTicket);
	const setParlayLegs = useDeskStore((s) => s.setParlayLegs);
	const confirmSlateFromTable = useDeskStore((s) => s.confirmSlateFromTable);
	const setContests = useDeskStore((s) => s.setContests);
	const liveBankroll = useDeskStore((s) => s.liveBankroll);
	const unitPct = useDeskStore((s) => s.unitPct);
	const stakeDollars = useDeskStore((s) => s.stakeDollars);
	const unit = selectUnit({
		liveBankroll,
		unitPct,
		stakeDollars
	});
	const { scan, snapshot } = useDeskDecision();
	const [draft, setDraft] = (0, import_react.useState)(EMPTY);
	const [legs, setLegs] = (0, import_react.useState)([]);
	const [note, setNote] = (0, import_react.useState)(kind === "slate" || kind === "contest" || kind === "auto" ? "Photograph the DraftKings Fantasy screen. We read salaries and buy-ins. Fantasy is 18+ — not a Hard Rock ticket." : "Photograph the Hard Rock Bet Florida screen. We read the live price. Then you confirm it on Log.");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [slateTable, setSlateTable] = (0, import_react.useState)("");
	const [sport, setSport] = (0, import_react.useState)("NFL");
	const [contests, setLocalContests] = (0, import_react.useState)([]);
	const [mode, setMode] = (0, import_react.useState)(kind === "slate" || kind === "contest" ? kind : "ticket");
	const [locked, setLocked] = (0, import_react.useState)(null);
	const [lockError, setLockError] = (0, import_react.useState)(null);
	const [editFields, setEditFields] = (0, import_react.useState)(false);
	async function onFile(file) {
		if (!file) return;
		setBusy(true);
		setLocked(null);
		setLockError(null);
		try {
			let b64;
			let mime = file.type || "image/jpeg";
			try {
				const dataUrl = await compressScreenshot(file);
				setPreview(dataUrl);
				const conv = dataUrlToBytes(dataUrl);
				b64 = conv.b64;
				mime = conv.mime || "image/jpeg";
			} catch {
				const url = URL.createObjectURL(file);
				setPreview(url);
				const buf = await file.arrayBuffer();
				b64 = bytesToB64(new Uint8Array(buf));
			}
			const res = await parseTicketImage({ data: {
				image: b64,
				mime,
				kind
			} });
			if (!res.ok) {
				setNote(res.error);
				setEditFields(true);
				return;
			}
			if (res.kind === "slate") {
				setMode("slate");
				setSlateTable(res.table);
				setNote(res.note);
				return;
			}
			if (res.kind === "contest") {
				setMode("contest");
				setLocalContests(res.contests);
				setNote(res.note);
				return;
			}
			setMode("ticket");
			const first = res.fields[0];
			if (res.fields.length > 1) {
				setLegs(res.fields.map((f) => ({
					...f,
					confirmed: false
				})));
				setDraft(EMPTY);
				setEditFields(true);
				setNote(`${res.fields.length} games on this slip. Fix any field, then confirm the live price.`);
			} else if (first && first.confidence >= .4) {
				setLegs([]);
				setDraft({
					...first,
					confirmed: false
				});
				setEditFields(true);
				setNote("Check the line and the side. Fix anything the photo missed, then save it to Log.");
			} else if (first) {
				setLegs([]);
				setDraft({
					...first,
					confirmed: false
				});
				setEditFields(true);
				setNote("Low confidence. Fix any field, then check the live payout below.");
			} else {
				setEditFields(true);
				setNote(res.note);
			}
		} catch {
			setEditFields(true);
			setNote("Could not read the photo. Enter the fields by hand, then check the live payout.");
		} finally {
			setBusy(false);
		}
	}
	function confirmTicket() {
		lockItems([draft]);
	}
	function confirmParlayPhoto() {
		const ready = legs.filter((l) => l.selection && l.home && Number.isFinite(l.price));
		if (ready.length < 2) {
			setNote("Need at least two complete games to grade a parlay.");
			return;
		}
		if (scan?.rows.length) {
			const matched = matchParsedToRows(ready, scan.rows);
			setParlayLegs(enrichParlayPicks(matched, scan.rows, snapshot?.briefs, snapshot?.predict));
		}
		lockItems(ready);
	}
	function lockItems(items) {
		if (!preview) {
			setLockError("Upload the screenshot first. That's how we get the live number.");
			return;
		}
		const ready = items.filter((l) => l.selection && l.home && Number.isFinite(l.price));
		if (!ready.length) {
			setLockError("Need the pick, the teams, and the live odds before we lock it.");
			return;
		}
		ready.forEach((l) => confirmParsed({
			...l,
			confirmed: true,
			confidence: Math.max(l.confidence, 1)
		}));
		const payload = buildLockPayload(ready, scan?.rows ?? [], unit);
		const r = place(payload);
		if (!r.ok) {
			setLockError(r.error);
			return;
		}
		setLocked(r.ticket);
		setLockError(null);
		setNote("Locked in. This ticket is open on Log until you mark win or loss.");
		setDraft(EMPTY);
		setLegs([]);
		setEditFields(false);
	}
	function confirmSlate() {
		if (!slateTable.trim()) {
			setNote("No player list yet. Upload a screenshot of the DraftKings salary screen.");
			return;
		}
		const n = confirmSlateFromTable(slateTable, sport);
		setNote(n > 0 ? `Confirmed ${n} players. Built Safer, High-Ceiling, and Showdown lineups. Check salary-shift alerts above.` : "Nothing parsed. Need name, position, team, salary.");
	}
	function confirmContests() {
		if (!contests.length) {
			setNote("No contests yet. Upload a screenshot of the DraftKings lobby so we can read the buy-ins.");
			return;
		}
		setContests(contests.map((c) => ({
			...c,
			confirmed: true
		})));
		setNote(`Confirmed ${contests.length} contests. Buy-in recommendation now uses this list.`);
	}
	function resetLock() {
		setLocked(null);
		setPreview(null);
		setDraft(EMPTY);
		setLegs([]);
		setLockError(null);
		setEditFields(false);
		setNote("Photograph the Hard Rock Bet Florida screen. We read the live price. Then you confirm it on Log.");
	}
	const title = heading ?? (kind === "slate" ? "Confirm with DraftKings Photo — salary list" : kind === "contest" ? "Confirm with DraftKings Photo — contest lobby" : kind === "auto" ? "Confirm with DraftKings Photo — salary list or contest lobby" : "Upload a Hard Rock Bet Florida screenshot — required before we confirm");
	const showReview = mode === "ticket" && !locked && Boolean(preview) && (Boolean(draft.selection) || legs.length > 1);
	const dkFlow = kind === "slate" || kind === "contest" || kind === "auto";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "lock-in",
		className: cn(embedded ? "mt-5 space-y-4" : "paper-card p-5 md:p-6"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-start justify-between gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "stamp text-gold",
						children: "Photo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-1 text-xl text-ink",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: note
					})
				] })
			}),
			!preview && !locked && mode === "ticket" && !dkFlow ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "mt-4 grid gap-2 text-sm text-ink sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "stamp text-gold",
						children: "01"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1",
						children: "Take a photo or pick from your library. Confirm the line before Log."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "stamp text-gold",
						children: "02"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1",
						children: "We show the live price and Hit / Miss dollars. Not on Log yet."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "stamp text-gold",
						children: "03"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1",
						children: "Save it. It waits on Log."
					})] })
				]
			}) : null,
			!locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-2 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-lg bg-gold px-4 text-navy-deep",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
							className: "size-5",
							strokeWidth: 1.75
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-base font-medium",
							children: busy ? "Reading…" : dkFlow ? "Confirm with DraftKings Photo" : "Take photo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*",
							capture: "environment",
							className: "sr-only",
							onChange: (e) => {
								const file = e.target.files?.[0];
								e.target.value = "";
								onFile(file);
							}
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-lg bg-wash px-4 text-gold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUp, {
							className: "size-5",
							strokeWidth: 1.75
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-base font-medium",
							children: preview ? "Different photo" : "Photo library"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/png,image/jpeg,image/jpg,image/webp,image/heic,image/heif",
							className: "sr-only",
							onChange: (e) => {
								const file = e.target.files?.[0];
								e.target.value = "";
								onFile(file);
							}
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted",
				children: "Camera and library. Confirm the line before Log. You can edit what we read."
			})] }) : null,
			preview && !locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: preview,
				alt: "Uploaded ticket, contest, or slate",
				className: "mt-3 max-h-48 w-full rounded-md object-contain outline outline-1 -outline-offset-1 outline-gold/20"
			}) : null,
			locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockedStamp, { ticket: locked }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "w-full",
					onClick: resetLock,
					children: "Lock another ticket"
				})]
			}) : null,
			mode === "slate" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm",
						children: [
							"Sport",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "ml-2 h-11 rounded-md bg-wash px-3 text-ink shadow-[var(--shadow-paper)]",
								value: sport,
								onChange: (e) => setSport(e.target.value),
								children: [
									"NFL",
									"NBA",
									"MLB",
									"NHL",
									"NCAAF",
									"NCAAB"
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: slateTable,
						onChange: (e) => setSlateTable(e.target.value),
						rows: 7,
						className: "w-full rounded-md bg-wash p-3 font-mono text-sm text-ink shadow-[var(--shadow-paper)]",
						placeholder: "Mahomes,QB,KC,7800,24"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: confirmSlate,
						children: "Confirm lineup from this list"
					})
				]
			}) : null,
			mode === "contest" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-3",
				children: [contests.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-line text-sm",
					children: contests.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [c.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-xs uppercase text-muted",
							children: c.kind
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: formatBetUsd(c.buyIn)
						})]
					}, `${c.name}-${i}`))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No buy-ins read yet."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: confirmContests,
					disabled: !contests.length,
					children: "Use these buy-ins"
				})]
			}) : null,
			mode === "ticket" && !locked && legs.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-3",
				children: [
					editFields ? legs.map((leg, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 rounded-md bg-wash p-3 md:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Labeled, {
								label: `Game ${i + 1} pick`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: leg.selection,
									onChange: (e) => setLegs(editLeg(legs, i, { selection: e.target.value }))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Labeled, {
								label: "Away",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: leg.away,
									onChange: (e) => setLegs(editLeg(legs, i, { away: e.target.value }))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Labeled, {
								label: "Home",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: leg.home,
									onChange: (e) => setLegs(editLeg(legs, i, { home: e.target.value }))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Labeled, {
								label: "Odds",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									inputMode: "numeric",
									value: leg.price,
									onChange: (e) => setLegs(editLeg(legs, i, { price: Number(e.target.value) }))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Labeled, {
								label: "Player (if a player bet)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: leg.player ?? "",
									onChange: (e) => setLegs(editLeg(legs, i, { player: e.target.value }))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Labeled, {
								label: "Line",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									inputMode: "decimal",
									value: leg.point ?? "",
									onChange: (e) => setLegs(editLeg(legs, i, { point: e.target.value === "" ? void 0 : Number(e.target.value) }))
								})
							})
						]
					}, i)) : null,
					preview && !editFields ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setEditFields(true),
						children: "Fix a field"
					}) : null,
					editFields && preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setEditFields(false),
						children: "Hide fields"
					}) : null,
					showReview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketReview, {
						legs,
						rows: scan?.rows ?? [],
						onLock: confirmParlayPhoto,
						error: lockError
					}) : null
				]
			}) : null,
			mode === "ticket" && !locked && legs.length <= 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				editFields ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-2 gap-3 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Labeled, {
							label: "Sport",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.sport,
								onChange: (e) => setDraft({
									...draft,
									sport: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Labeled, {
							label: "Home",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.home,
								onChange: (e) => setDraft({
									...draft,
									home: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Labeled, {
							label: "Away",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.away,
								onChange: (e) => setDraft({
									...draft,
									away: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Labeled, {
							label: "Type (who wins / spread / over-under)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.marketType,
								onChange: (e) => setDraft({
									...draft,
									marketType: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Labeled, {
							label: "Side",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.side,
								onChange: (e) => setDraft({
									...draft,
									side: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Labeled, {
							label: "Odds (example −110 or +160)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "numeric",
								value: draft.price,
								onChange: (e) => setDraft({
									...draft,
									price: Number(e.target.value)
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Labeled, {
							label: "The pick (example: Baltimore to win, or Mahomes over 249.5 passing yards)",
							className: "col-span-2 md:col-span-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.selection,
								onChange: (e) => setDraft({
									...draft,
									selection: e.target.value
								}),
								placeholder: "Mahomes over 249.5 passing yards"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Labeled, {
							label: "Player (if this is a player bet)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.player ?? "",
								onChange: (e) => setDraft({
									...draft,
									player: e.target.value
								}),
								placeholder: "Patrick Mahomes"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Labeled, {
							label: "Line (example 249.5)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "decimal",
								value: draft.point ?? "",
								onChange: (e) => setDraft({
									...draft,
									point: e.target.value === "" ? void 0 : Number(e.target.value)
								}),
								placeholder: "249.5"
							})
						})
					]
				}) : null,
				preview && !editFields ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setEditFields(true),
						children: "Fix a field"
					})
				}) : null,
				editFields && preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setEditFields(false),
						children: "Hide fields"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setDraft(EMPTY),
						children: "Clear"
					})]
				}) : null,
				showReview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketReview, {
					draft: draft.selection ? draft : void 0,
					rows: scan?.rows ?? [],
					onLock: confirmTicket,
					error: lockError
				}) : preview && !draft.selection && !busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-gold",
					children: "We could not read a pick. Tap Fix a field and type it, then lock."
				}) : null
			] }) : null
		]
	});
}
function Labeled({ label, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: `block text-xs uppercase tracking-[0.12em] text-muted ${className ?? ""}`,
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-1 block",
			children
		})]
	});
}
function PhotoFirstNote({ venue }) {
	const target = venue ?? "Hard Rock Bet Florida";
	const fantasy = /draftkings|fantasy/i.test(target);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "rounded-md bg-wash-gold px-4 py-3 text-sm text-gold",
		children: fantasy ? `Confirm with a DraftKings Fantasy photo. We read live salaries and flag $200+ shifts. 18+ Florida DFS — not a Hard Rock Bet Florida ticket.` : `Photograph the Hard Rock Bet Florida screen. We read the live price. Then you confirm it on Log.`
	});
}
function editLeg(legs, i, patch) {
	return legs.map((l, idx) => idx === i ? {
		...l,
		...patch
	} : l);
}
function bytesToB64(bytes) {
	let binary = "";
	const chunk = 32768;
	for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	return btoa(binary);
}
//#endregion
export { ScreenshotIngest as n, PhotoFirstNote as t };
