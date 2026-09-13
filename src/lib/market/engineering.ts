/**
 * v7 §10 engineering checklist. v2 Step 1 is void.
 * Do not strip Better Auth. Do not put a login wall back.
 */
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
  "Pin — DESK_VERSION 2026.09.12-master-v7 after the fair-blend ranking rule.",
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
