/**
 * v7 §10–11 engineering map. v2 Step 1 is void.
 * Do not strip Better Auth. Do not put a login wall back.
 */
import { DESK_VERSION } from "./rules.ts";

export const DOCUMENT_VERSION = "2026.09.13-master-v9";

export const DESK_CONSTANTS: { name: string; value: string }[] = [
  { name: "Document", value: DOCUMENT_VERSION },
  { name: "Desk pin", value: DESK_VERSION },
  { name: "Persist", value: "sports-lock-v1" },
  { name: "Super admin", value: "djalberty@gmail.com" },
  { name: "Safest floor", value: "65% with highest-probability fallback" },
  { name: "The Call quality", value: "0.72 and process Ran" },
  { name: "Fair blend", value: "50% sim / 30% pool / 20% market" },
  { name: "Displayed chance cap", value: "99%" },
  { name: "Core / Fun", value: "85% / 15%" },
  { name: "DK cap", value: "$50,000" },
  { name: "Showdown captain", value: "1.5× points and salary" },
  { name: "Cash floor", value: "mean − 0.75σ" },
  { name: "GPP ceiling", value: "mean + 1.65σ" },
  { name: "Inactive window", value: "90 minutes" },
  { name: "Late lock", value: "1:00 p.m. ET; late kickoffs 4:05 p.m. ET+" },
  { name: "Salary-shift alert", value: "$200" },
  { name: "Helpline", value: "1-800-GAMBLER" },
];

export const DESKS: { route: string; name: string; line: string }[] = [
  { route: "/", name: "Start", line: "Money I can play with. No auto-redirect." },
  { route: "/today", name: "AI Picks", line: "Named tickets. The Call is the gold ribbon." },
  { route: "/board", name: "Games", line: "Every matchup on the delayed board." },
  { route: "/parlay", name: "Combos", line: "2-, 3-, and 4-pick tickets." },
  { route: "/live", name: "Live", line: "Game already started. Never The Call." },
  { route: "/desk", name: "Log", line: "Photograph. Hit or Miss." },
  { route: "/gameday", name: "Game day", line: "Kickoff, the pick, the dollars." },
  { route: "/slate", name: "Fantasy", line: "DraftKings salary cap. 18+. Not Hard Rock." },
  { route: "/more", name: "More", line: "Words, money, this map. Optional Owner sign-in." },
  { route: "/login", name: "Owner", line: "Optional. The desk works without it." },
];

export const KEY_FILES = [
  "src/components/app/access-gate.tsx — public desk",
  "src/lib/use-access.ts — guests approved; admin only when signed in",
  "src/lib/market/rules.ts — DESK_VERSION + ALGORITHM_RULES",
  "src/lib/market/dfs-scoring.ts / injury-ripple.ts / slate.ts",
  "src/components/app/collapsible-parlay-pill.tsx",
  "src/components/app/mobile-more-drawer.tsx",
  "src/components/app/shell.tsx — pb-32",
  "src/lib/ledger.ts — JSON schema + download",
  "src/lib/desk-api.ts — public reads; admin/ledger mutations authenticated",
  "src/routes/login.tsx — optional owner sign-in",
] as const;

export const ENGINEERING_CHECKLIST = [
  "Public desk — AccessGate always loads AppShell. Guests approved. Optional /login for Admin.",
  "Plain-English UI — Strong / Fair / Thin. Photo to lock this price. The Call ≠ Best Value.",
  "Zero-drag engine — Precision 0 on Looked. Fair 0.5 sim / 0.3 pool / 0.2 market. 99% clip.",
  "Florida gate — college player props blocked. DK/FD sportsbooks are not FL fills. 21+ / 18+ / 1-800-GAMBLER.",
  "Combos — props, periods, Fréchet, Kelly growth, prune 15–20, Load this ticket opens the slip.",
  "Edge features — fee, timing, Core 85 / Fun 15, Kalshi/Polymarket research-only.",
  "Photo flow — camera + library, compress, editable OCR, line-shift alert, lock to Log.",
  "Ledger — JSON download + DB for signed-in users + local zustand. Guests skip auth endpoints.",
  "DFS — /slate Full PPR, cash/GPP/Showdown, injury ripple, 90-min radar, late-swap, $200 shift, 18+.",
  "Mobile — pb-32, collapsible parlay pill, portaled More drawer, wrapping filters.",
  "Start / — bankroll. Do not auto-redirect.",
  "Pin — DESK_VERSION 2026.09.13-master-v9 after the fair-blend ranking rule.",
] as const;

export const NEVER_DO = [
  "Place, cancel, or route a bet",
  "Invent a Hard Rock fill or scrape the Hard Rock app",
  "Call a lock (guaranteed winner) or print 100%",
  "Price Florida college athlete props on Hard Rock",
  "Treat DraftKings / FanDuel sportsbook quotes as live Florida tickets",
  "Submit a DraftKings Fantasy lineup",
  "Inject dummy 50/50 drag for a missing feed",
  "Re-rank on a timer when posted odds did not change",
  "Auto-redirect Start /",
  "Require login to view or use the desk",
  "Rename Best Value to The Call, or The Call to Best Value",
] as const;
