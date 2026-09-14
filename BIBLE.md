# Sports Lock — Official Bible

**Document version:** 2026.09.13-official-v9

**Status:** THE official law. Give this file to any person or any model.

**Supersedes:** Google Doc v2 · sheet 2026.09.12-master-v8 · Pipeline Change Log 2026.09.13.

**Desk ranking pin (live code):** `DESK_VERSION = 2026.09.13-master-v9`

**Product:** Sports Lock — public decision desk for Florida

**Owner:** DJ Alberty · super admin djalberty@gmail.com

**Live site:** https://sportslock.vercel.app

**Source:** https://github.com/djalberty-design/sports-lock_G (main)

**Audience:** Humans, contractors, and autonomous agents who must understand the product and rebuild it from scratch.

If a later chat prompt conflicts with this file, the prompt wins for that session. If a later commit changes a ranking rule, bump `DESK_VERSION` and issue a new bible. Copy-only and public-desk changes do not bump the pin.

**This site never places a bet**.

---

## Part 0 — Product definition

Sports Lock is an intelligent decision desk and bankroll companion. It is not a sportsbook, not a tote, not a bot that fires tickets.

**Tagline:** Picking with Intelligence Creates Confidence.

**Who it is for**
A Florida adult who wants named tickets in dollars, not jargon. They type what they can spend. The desk names a ticket. They photograph Hard Rock Bet Florida. They place the bet themselves, or they walk away. After the game they tap Hit or Miss.

**What it is**
A public research desk for NFL, NBA, MLB, NHL, NCAAF, NCAAB. Other sports stand down.

Two products, two ages:
* Hard Rock Bet Florida sportsbook research — 21+
* DraftKings Fantasy salary-cap (not sportsbook) — 18+
* Helpline on every chrome: 1-800-GAMBLER

Delayed public odds are research. A photographed Hard Rock screen is the live sportsbook price. Kalshi / Polymarket / DK-FD sportsbook quotes are never a Florida fill.

### 0.1 What this site will never do
* Place, cancel, or route a bet.
* Invent a Hard Rock fill or scrape the Hard Rock app.
* Call a lock (guaranteed winner) or print 100%.
* Price Florida college athlete props on Hard Rock.
* Treat DraftKings / FanDuel sportsbook quotes as live Florida tickets.
* Submit a DraftKings Fantasy lineup.
* Inject dummy 50/50 drag for a missing feed.
* Re-rank on a timer when posted odds did not change.
* Auto-redirect Start /.
* Require login to view or use the desk.
* Rename Best Value to The Call, or The Call to Best Value.

### 0.2 Roles
* **Guest:** Anyone, unsigned. Full desk. Local bankroll and paper log on this device.
* **Signed-in user:** Google / X / email-password. Same desk + ledger sync to `desk_ledger_bets`. Magic link is not supported.
* **Super admin:** djalberty@gmail.com. Admin: knobs, hidden picks, master ledger, feed health. Cannot be revoked.

`isApproved` is true for every visitor. Admin UI is the only gated surface. Do not turn `VITE_AUTH_ENABLED` off on deploy.

---

## Part 1 — Guest walkthrough

1. **Open** https://sportslock.vercel.app — no login.
2. **Start /** — type Money I can play with / This ticket / Most I can lose this week / Profit I hope for this week. Do not auto-redirect.
3. **Open AI Picks /today** — three columns: Safest, Best Value, Pays more. Gold ribbon is The Call (one gated single). Not Best Value.
4. **Tap a card.** Ticket page shows chance, Hit $ / Miss $, look stamp, tape stamp, rules the desk ran.
5. **Photograph Hard Rock** (camera or library). Confirm the live number. That is “lock this price,” not “this will hit”.
6. **Log /desk** — after the game tap Hit, Miss, or Push. One post-mortem sentence. The desk did not “know”.

**Bottom nav:** AI Picks · Games · Combos · Live · Log. More is the header drawer, portaled to `document.body`.

---

## Part 2 — The Complete Quantitative Algorithmic Engine (v9)

### 1. The Core Engine: One Latent State ($G$)
The engine prices moneyline, spread, and totals from a single, unified latent game state ($G$). We do not maintain separate, contradictory percentage models.
* **The Math:** $G$ consists of expected points ($\mu_H$, $\mu_A$), variance ($\sigma_M$, $\sigma_T$), pace, and a chaos multiplier. Final pricing is calculated continuously using a Normal Cumulative Distribution Function (CDF).
* **Zero Monte Carlo:** Full-path Monte Carlo simulations were purged from production. They are reserved exclusively for offline lab diagnostics. The Vercel pipeline relies entirely on the continuous CDF to calculate $P(win)$ instantly without sampling noise.
* **The Context Stack:** Modifiers (venue weather, injury outs, short-week rest, EPA/xwOBA process, and crew tendencies) act as *multipliers on the means* ($\mu$), not arbitrary percentage haircuts.
* **The Market Cap:** To prevent the context stack from inventing a delusionally high favorite, $G$ is hard-capped to within $\pm6\%$ of the sportsbook close. The liquid market is the ultimate prior; context may tilt it, but cannot replace it.

### 2. Live Pricing & Non-Linear Variance
Live tickets are never flagged as "The Call". The opening $G$ is a prior; once the clock starts, the engine calculates the *remaining* $G$ based on the current score and time left.
* **Decoupled Variance Curves:** Late-game variance does not decay uniformly.
* **NBA/NCAAB:** Variance flattens and stays elevated late (scaled by $frac^{0.60}$) due to intentional fouling and desperation threes.
* **NHL:** Variance hits a hard floor at the 12% time mark to account for empty-net goal scenarios.
* **MLB:** Decays linearly by discrete outs rather than a running clock.
* **NFL/NCAAF:** Follows standard sub-linear decay ($frac^{0.85}$).

### 3. Copula Dependence (Same Game Parlays)
Cross-game parlays are treated as independent products. Same Game Parlays (SGPs) are evaluated using a Clayton Archimedean Copula to account for tail dependence.
* **No Magic Joints:** The legacy `jointHit` modifier was destroyed.
* **Dynamic Marginal Distance:** The correlation parameter ($\rho$) scales dynamically based on the exact probability distance between legs. A moneyline favorite at 85% has a tighter structural correlation to its own spread than a coin-flip team.
* **Ledger Calibration:** Copula estimates (e.g., baseline $0.65$ for ML/Spread) are routed through a dynamic calibration cache designed to be continuously overwritten by historical hit/miss rates.

### 4. The "Empty Look" Law & Data Ingestion
Missing data equals an empty state with zero weight. If a file is missing, the layer says Looked / empty and does not invent Statcast, strike zones, or umpire ATS.
* **The Watchdog Adapter:** All external API feeds (ESPN Live Scoreboards, Action Network EPA, RefMetrics umpires) pass through `feed-adapter.ts`. If an external vendor alters their JSON schema, the Watchdog catches the error and enforces the "Empty Look" rather than compiling a broken board.
* **Florida College Constraints:** Player prop markets for NCAA athletes remain strictly blocked. College *team* data may only inform game lines.

### 5. Risk Management & Bankroll Segmentation
Bankrolls are strictly isolated by risk profile within the Zustand state manager (v6+).
* **Sportsbook vs. DFS:** `liveBankroll` (Hard Rock straight bets) and `dfsBankroll` (DraftKings tournaments) are mathematically walled off. High-variance downswings in daily fantasy will not artificially restrict the Fractional Kelly sizing calculations for high-value sportsbook edges.
* **Core 85% vs Fun 15%:** Core tickets use ~1% of bankroll. Recreational 3-leg / 4-leg and underdog flyers use Fun dollars.

### 6. The Call Gates
A ticket may wear The Call only if all of these hold:
* Single (not a parlay, not a combo)
* Not live
* Not a period slice, exact-score, first-scorer, micro, future, or teaser
* `infoQuality` $\ge 0.72$
* Process Ran (Looked cannot wear the badge)
* Desk % not more than 1 point under the book with no +edge

### 7. Complete DraftKings Daily Fantasy Engine
Florida DFS, 18+. Route `/slate`. Not Hard Rock.
* Full PPR. Bonuses at 300 pass / 100 rush / 100 rec.
* Safer / cash: maximize cashFloor = $p50 - 0.75\sigma$.
* High-Ceiling / GPP: maximize gppCeiling = $p50 + 1.65\sigma$.
* Showdown Captain (1.5x pts/salary).
* Injury ripple & inactive radar (90-minute window).
* Salary-shift alert ($\ge \$200$).

---

## Part 3 — Addendum law (shipped after v7)

* **College player stats still move game lines:** Florida blocks college athlete proposition bets on Hard Rock. College player usage, injuries, and box scores still feed the game latent. They may not produce a college player ticket, a college player combo leg, or a college player photo lock.
* **Photo honesty:** Compress client-side. If a photographed leg has no desk fair, show No desk line. Verdict: Smart Value / Fair Price / Overpriced. Unknown Hard Rock market names stand down. Do not scrape Hard Rock.
* **Ledger honesty:** JSON download + DB for signed-in users + local zustand.
* **Edge surfaces:** Fee badge on pick cards. Timing: Lock This Now / Wait for Better Price. Early Mover Advantage. Post-mortem: Unlucky loss vs Fluky win. Never “the desk knew”.

---

## Part 4 — Rebuild from scratch (Infrastructure)

* **Stack:** TanStack Start + Vite + Nitro. Vercel host. Better Auth. Neon DB. Zustand persist.
* **Native Dependency Tree:** The 14+ brittle `.mjs` string-replacement scripts (e.g., `patch-engine-live`) were burned. The orchestration files (`latents.ts`, `chance.ts`, `engine.ts`) execute the contextual stack natively via standard TypeScript imports.
* **No Build Scripts:** `package.json` build command is strictly `"node scripts/assemble-research.mjs && node scripts/with-app-env.mjs vite build && npm run db:migrate"`. Do not re-introduce `.mjs` patches.
* **Determinism:** Seed = mix(`DESK_VERSION`, quote fingerprint, eventId). No `Math.random` inside `src/lib/market`.
* **Acceptance:** Unsigned visitor lands on Start. AI Picks shows three named columns. Missing feed does not pull fair toward 50%. College player prop cannot load. Mobile More drawer is portaled.
