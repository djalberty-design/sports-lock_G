# Sports Lock Blueprint

Living product law for this app. **Read this before changing ranking, copy, or tickets.**
User prompts in chat override this file when they conflict. Append a dated change note
for every shipped product decision so the next turn does not re-litigate it.

**How to use this file**

- **Sections 0–12** are current law for desk pin `2026.09.09-world`.
- **Section 13** is history. Do not treat a superseded pin as current.
- Every-rule formulas, sourced: [`SPORTS_LOCK_ALGORITHM.md`](./SPORTS_LOCK_ALGORITHM.md)
  (copy: [`SPORTS_LOCK_ALGORITHM_v2.md`](./SPORTS_LOCK_ALGORITHM_v2.md)).
- Sandbox / persist / Florida floor: [`AGENTS.project.md`](./AGENTS.project.md).

Edition 1 Build Bible (attachments) is the original floor. Later user prompts already
overrode light-paper UI, the coin-flip lane, “discard public %”, and 3-leg-only parlays.

---

## 0. What this app is

Sports Lock is a **Florida sports desk**. It names tickets the user can take to
**Hard Rock Bet** (or grade on a photographed DraftKings / FanDuel slip). It is
research. It never places a bet. It never calls a lock.

Tagline: *Picking with Intelligence Creates Confidence.*

Persist key: `sports-lock-v1`. Auth off. Database off.

Current desk pin: **`DESK_VERSION` `2026.09.09-world`**. Bump it when a ranking
rule changes so two boards on the same snapshot can never silently disagree.

Hidden object is a **latent game** `G` + **usage vector** `U` + **live state** `S`.
Sides and totals are not transforms of each other. Seeded paths price alts,
first-event, remaining live, SGP, and parlays from the same draw.

Universe: **NFL, NBA, MLB, NHL, NCAAF, NCAAB**. Other sports stand down.
College **player** tickets stand down in Florida; college player looks still
run as **game-context only**.

---

## 1. Honesty that never moves

- Never print “lock”, “guarantee”, or 100%. Clip displayed chance at 99%.
- Delayed public numbers. A quote is not the fill. Photograph Hard Rock to lock.
- This site never places a bet. Paper log is a tracker, not a book.
- Florida: college **player** props are illegal on Hard Rock Bet — block them.
  College player usage still moves the **game** latent. No Florida player ticket.
- DraftKings / FanDuel **sportsbooks** are not licensed live Florida tickets.
  DraftKings **Fantasy** is a different product (placeholder tab).
- 21+ Hard Rock Bet / 18+ fantasy. 1-800-GAMBLER.
- Do not invent Hard Rock’s own order book. Label every tape source:
  **HR-FL tape | photographed | research**.
- Do not invent a missing ESPN split, ERA, minutes, last-10, EPA, xG, or handle %.
  Empty feed = **Looked** (50/50, not a skip and not a guess). Never print **NO LOOK**.
- Unknown Hard Rock market names stand down (`unknown_market`). Do not price a cousin.
- Do not scrape Hard Rock. Photo or Odds API. Process feeds empty = Looked.
- Kalshi and Polymarket are **research**, never a Florida fill.
- ESPN win% is a **model**, not book handle.
- Ticket count vs handle is a layer. Never copy-traded. Never auto-fade/tail the public.

---

## 2. Desks (Hard Rock IA)

Phone bottom nav, five desks. After the pile is set, AI Picks is the working
desk — not a homepage essay.

| Desk | Route | What it is |
|---|---|---|
| **AI Picks** | `/today` | Names tickets. The Call + mood + ribbon + popular / players / periods / catalog parlays. |
| **Games** | `/board` | Every matchup. Never blank: say why (filter, feed Looked, how to clear). |
| **Parlay** | `/parlay` | Ribbon on top. Custom builder with running joint chance and a correlation flag. |
| **Live** | `/live` | In-play only. Remaining mean. Never The Call. Never a ribbon leg. Photograph Hard Rock now. |
| **Log** | `/desk` | Photographed or HR-FL number, fair at lock, Win / Loss. Site never places the bet. |

**Start** (`/`) is first-run + bankroll. Motto stays. After `onboarded`, cut the
five-desk essay. Do **not** auto-redirect `/` — that is where the pile is edited.
**Fantasy** (`/slate`) stays in More as a placeholder: DraftKings Fantasy only,
not a Florida sportsbook fill. DFS engine is next, not this desk.
**More** also shows `DESK_VERSION`.

Mood (Hard Rock For You analog), on AI Picks and Parlay:

- **Safest** — highest chance that still pays (Chill)
- **Best value** — `ticketScore` (Skill, default)
- **Pays more** — bigger payout among tickets with quality ≥ 0.64 and chance ≥ 0.48 (Thrill)

Mood **re-sorts**. It does not rewrite chance.

Cards show chance-to-hit, payout, quality (High / Med / Low), The Call gold badge,
Book / Desk / Edge, tape stamp. American odds are a footnote. Hit / Miss dollars
use the user’s typed stake.

**Look (navy / gold / cream).** Dark default. Tokens in `src/styles.css`
(`paper`, `card`, `gold`, cream `ink`). Do not invent a second visual language.

---

## 3. The call: AI Picks

This tab does the hard work. It does **not** dump a board. It **names tickets**:

| Section | What ranks |
|---|---|
| The Call | Single highest `ticketScore` among high-info tickets that still pay. Never in-play, never a period slice, never a parlay, never exact-score / first-scorer / micro / future / teaser. `infoQuality ≥ 0.72`, process Ran (Looked cannot wear the badge), chance 50–76%, decimal payout ≥ 1.55. Desk % more than 1 pt under the book with no +edge sits down. Empty pool → no Call, not a 0.64 fallback. |
| Popular | Best ML / spread / total (and team totals) playing today |
| Player tickets | Best legal player props (NFL/NBA/MLB/NHL only). Listed-out stands down. College blocked. |
| Periods | Best 1st inning / F5 / quarter / half / period winners and totals. Quality floor so they cannot steal The Call. |
| Ribbon | 2- or 3-leg **mains only**. Each displayed leg ≥ 56% (2) / 60% (3). Combined ≥ 38% / 28%. Decimal ≥ 1.45. Quality ≥ 0.72. No live, no player props, no college, no 4-leg. Sort combinedFair, then `parlayScore`, then id. Cap 1 slip per event, max 6. |
| Same-game / 2 / 3 / 4 | Catalog on AI Picks and Parlay. 4-leg never the gold badge. Custom builder can go to 8. |

Tap a card → `/ticket?id=` — full breakdown: ensemble layers, **Rules the desk
ran** (every rule, stamped **Ran / Thin / Looked** — never NO LOOK), sim vs pool,
bets vs money, injuries/weather/park/rest, last-10 analysis of the live log,
why this beat the alternatives, and a screenshot lock.

One screenshot CTA at the bottom of AI Picks. Camera **and** library.

Horizon: today ET + in-play + next **36 hours**. Late-night ET is not an empty board.

---

## 4. World desk (`2026.09.09-world`)

The hidden object is no longer a single `P(home wins)`.

```
snapshot → looks → G, U, S
G, U, S + seed → N paths
ticket = 1{path satisfies the photographed / posted proposition}
P_fair = mean(ticket)
P_pool = invLogit(pool(looks))
fair   = blend(P_fair, P_pool, P_market)   # 0.5 / 0.3 / 0.2 when all three exist
```

**Seed.** FNV-1a64 mix of `DESK_VERSION` + **quote fingerprint** + eventId into
PCG64. No wall-clock in the seed. No `Math.random` in `src/lib/market`. Same
quotes → same paths → same ranking. `N = 4000` when the latent ran, `800` when thin.

**Latent `G`.** Win, pace, variance, style. NFL/NCAAF discrete 3 and 7 spike
4.5% of paths. Sides and totals are not transforms of each other.

**Usage `U`.** Scratches transmit leftover opportunity (depth-chart kernel).
GTD mixes 55/45 in/out and cannot be The Call. College player usage moves `G`
only. Count-of-bodies is the light backup. Precision 5.8 confirmed / 2.4
projected / 0.9 empty.

**Live `S`.** Pre-tip empty. Missing down / outs / strength → micro stand-down.
Remaining counting props use leftover mean (kneel-down law). `infoQuality × 0.52`.
Never The Call. Never a ribbon leg. Own desk `/live`.

**Pool still runs** as a look (log-odds, precision, overdispersion shrink toward
the book). Last-10 is on **every stat**, not a W-L sticker — EWMA λ=0.82 of the
live ESPN log. Leftover four stay live ESPN, never invented: opponent-adjusted
defense, pitcher-vs-batter, minutes/usage, xG-style underlying.

**Game / period tickets** (`chance.ts` + `sim.ts` + `latents.ts`)

- Sportsbook no-vig close (prior) + open→close steam
- Spread-implied winner; Kalshi + Polymarket (research, not a Florida fill)
- ESPN matchup model; log5 records + home field; Pythagorean scoring
- Starters (MLB ERA/WHIP blended 60% last-7 when posted, 40% season + bullpen)
- Recency-weighted last **10** scores (EWMA λ=0.82 on actual pf/pa from the
  live ESPN schedule — analysis of the log, not ESPN’s canned lastFive card)
  + score-margin + form trend (recent 5 vs older 5, light on purpose)
- Head-to-head: last-10 meetings first, then season vs-opponent split, then
  this series. Always looked up.
- Home vs road: last-10 venue scores, else live ESPN home/away split. Always looked up.
- Opponent-adjusted defense, underlying (xG-style), pitcher vs batter
- Out / IL listings; rest / B2B / bye (MLB B2B is bullpen fatigue)
- **Weather:** NFL/NCAAF wind is a passing-EPA and **total** modifier, not a
  +0.02 ML party trick. Cold ≤ 32°F is a small home logit. Heat ≥ 95°F fades home.
  MLB weather moves totals, not winners. Process looks (EPA / four factors /
  Statcast / xG / tempo-free) empty = Looked.
- Ballpark factors; scoring-margin efficiency
- Ticket count (wagers %) — weak crowd layer, never copied
- Handle (dollars %) — sharper; steam raises precision

**Player tickets** (`props.ts` + `usage.ts`)

- Photographed / delayed book number is the prior when we have it
- Last-10 of **that stat**, EWMA, blended **60% recent / 40% season**
- Yards / points / PRA use a normal; hits / Ks / receptions stay Poisson
- Opponent-adjusted defense, minutes/usage, pitcher vs batter, underlying
- Listed-out player stands down. College player bets blocked (`illegal_fl`)
- Unknown market name stands down (`unknown_market`)
- GTD cannot be The Call

**Parlays**

- Same-game: joint path hit when legs are registered mains; else SGP haircut
  (ML+spread 0.55 / 0.42; 2-leg 0.88; 3 0.75; 4 0.62; 5–8 0.50; 9+ 0.38)
- Cross-game: near-independent (product). Stamp `shared-latent` |
  `near-independent` | `fallback-haircut`.
- `parlayScore = fair^1.6 · ln(1+profit) · 8 + fair · 2.4` so hittable 2-legs
  beat lottery posters.
- Typical juice 12% / 25% / 32% / 40% (2 / 3 / 4 / 5+).
- Ribbon law above. 4-legs catalog only. Custom builder 2–8.
- Catalog floors: 2-leg 0.48, 3-leg 0.50, 4-leg 0.48 (weaker than ribbon).

**Ranking**

- `deskScore(chance, price, tapeLean)` — chance² × √payout, penalize huge favorites,
  ±tape (sharp +0.055, public −0.035). Still: 58% at −110 beats 80% at −400.
- `infoQuality` haircuts noisy markets (ML 1.0, spread 0.94 ± key-number tilt,
  game total 0.86, counting prop 0.80, F5 0.64, inning 0.46, 1st-inning 0.5 → 0.36,
  first-scorer 0.58, exact score 0.40). In-play × 0.52.
- `ticketScore` = deskScore × quality + clipped edge vs the juice.
- `calibratedChance` pulls the **displayed** % toward the book when quality is low.
- High confidence also needs sim and pool within 4 pts when both exist.
- Same inputs → same ranking. Tie-break `score`, then chance, then id.
  `DESK_VERSION` `2026.09.09-world`. Bump when a rule changes.
- Do **not** auto-copy 80% public. Do **not** title cards fade/tail the public.

---

## 5. Rules the desk runs

`ALGORITHM_RULES` in `rules.ts`. Every ticket type walks this list. Every rule
looks up live data every time. Stamp **Ran / Thin / Looked**. Never **NO LOOK**.

| id | Applies | Law |
|---|---|---|
| `market` | all | Hard Rock Florida is the fill. Photo or Ran `hardrockbet_fl`. Delayed is not a fill. |
| `latent` | all | Latent game, not one number. Seeded paths price alts, first-event, SGP, live remaining. |
| `last10` | all | Last-10 of **that stat**, EWMA λ=0.82. Not a W-L sticker. |
| `h2h` | all | Last-10 meetings → season vs-opp → this series. Always looked up. |
| `venue-split` | all | Last-10 home/road → ESPN split. Always looked up. |
| `defense` | all | Opponent-adjusted. Props use the opponent’s allowed rate for that stat. |
| `underlying` | game, period, parlay | xG-style process (OBP+ISO / ERA/WHIP/opp OPS). |
| `platoon` | game, prop, period | Pitcher vs batter. Live vs-LHP / vs-RHP. |
| `usage` | prop | Scratches transmit opportunity. College player usage moves `G` only. |
| `process` | all | EPA / four factors / Statcast / xG / tempo-free. Empty = Looked. |
| `steam` | all | Open → close. Steam with handle is informed money, still not a lock. |
| `predict` | all | Kalshi + Polymarket. Research only. |
| `espn` | all | ESPN matchup model. Ratings, not tonight’s ticket. |
| `pitcher` | game, prop, period | ERA/WHIP 60% last-7 / 40% season. Bullpen fatigue on MLB B2B. |
| `injuries` | all | Listed-out omitted. A listed backup is not a listed ace. |
| `rest` | all | NBA/NHL B2B. NFL bye vs short week. MLB extra rest is small except bullpen B2B. |
| `weather-park` | all | Wind/rain/heat move totals more than moneylines. Coors is not Petco. |
| `tape` | all | Tickets % vs handle %. Never copied. Never auto-faded. |
| `period-shrink` | period | Slice is noisier. Quality floor so it cannot be The Call. |
| `live` | all | In-play ranks on Live. Never The Call. Delayed live is not a fill. |
| `sgp` | parlay | Joint paths. Ribbon maximizes hit chance, not poster odds. 4-legs catalog only. |
| `live-state` | all | Score, clock, downs, outs, strength. Remaining mean. Never a ribbon leg. |
| `calibrate` | all | Displayed chance pulled toward the book on thin markets. |
| `edge` | all | Desk minus implied. 58% at −110 beats 80% at −400. |
| `florida` | all | College player blocked. No scrape. Photo when tape is missing. Site never bets. |

Bump `DESK_VERSION` when a ranking rule changes.

---

## 6. Live data — every rule, every time

User law (2026-09-08, still in force): leftover looks must have **live current
data**; last-10 must apply to **every stat**; **every rule must run every time**.
The ticket page must never print **NO LOOK**.

**Stamps on “Rules the desk ran”** (`ruleStamp` in `rules.ts`)

| Stamp | Meaning |
|---|---|
| **Ran** | Live lookup returned a real number. Full weight. |
| **Thin** | Live lookup returned a small sample (n small, last-7 missing, season-only). Light weight. |
| **Looked** | We fetched. Feed empty. Layer is 50/50 with tiny precision. Not a skip. Not a guess. |

Never skip. Never invent. Never print NO LOOK.

**Where the live numbers come from** (host is `site.web.api.espn.com` —
`site.api.espn.com` **403s** team schedule and statistics)

| Look | Live source | Code |
|---|---|---|
| Last-10 scores (games, totals, periods) | ESPN team `/schedule` — full season log, take 10, EWMA λ=0.82. Scores may be `{ value, displayValue }` — always `parseEspnScore`, never `Number(object)`. | `form.ts`, `research.ts` `fetchTeamLastTen` |
| Last-10 of a player stat | ESPN athlete `/gamelog`, sort by date, EWMA of that column, 60/40 with season. | `research.ts` `fetchPlayerRecent` |
| Minutes / usage | Same gamelog: drop games under half this player’s median minutes. Depth-chart kernel on scratches. | `usage.ts` / `usageMin` on `PlayerBrief` |
| Opponent-adjusted defense | ESPN team `/statistics` — opponent ERA / OPS / pts allowed; last-7 when posted. NFL/NBA fallback: last-10 PA from the schedule log. | `looks.ts` `defenseAllowed` / `allowedForStat` |
| Pitcher vs batter | Probable `athlete.throws.abbreviation` × team vs-LHP / vs-RHP split. Player tickets also get opposing starter ERA. | `looks.ts` vsLeft/vsRight + `propContextFromBrief` |
| Underlying (xG-style) | Same statistics file: OBP+ISO (hitters), ERA/WHIP/opp OPS (pitchers). Last-7 when posted. | `looks.ts` `underlyingOffense` / `underlyingPitch` |
| H2H | Last-10 meetings → season vs-opp split → this series. Always a layer. | `form.ts` `vsOpponent` + `chance.ts` |
| Home vs road | Last-10 venue scores → ESPN home/away split. Always a layer. | `form.ts` `splitByVenue` + `chance.ts` |
| Process (EPA / four factors / Statcast / xG / tempo-free) | Looked this snapshot (no keys). Never invented. | `rules.ts` process |
| Book / tape / Kalshi / Poly | Delayed scoreboard + Action Network + prediction markets. Empty = Looked. HR-FL tape via photo or Odds API, not scrape. | `chance.ts` `pushEmpty`, `registry.ts` |
| Latent + paths | Seeded PCG64 from quote fingerprint. | `seed.ts`, `sim.ts`, `latents.ts` |
| Live state | Clock, score, downs, outs, strength. Missing critical field → micro stand-down. | `live-state.ts` |

Cache team statistics ~8 minutes so the board does not hammer ESPN. Same JSON
in → same bags out. Pure ranking functions. No dice.

**Last-10 on every stat — not just the 10-game W-L card**

| Ticket | What last-10 actually is |
|---|---|
| Games / totals / periods | EWMA λ=0.82 of actual pf/pa from the live ESPN schedule (latest = index 0), plus margin and trend. Periods inherit then shrink. |
| Player props | EWMA of **that stat** (hits, Ks, yards, points…) from the athlete gamelog, 60/40 with season. Not a hit-rate sticker. |
| Sheet expected | 28% last-10 combined score mixed into the total; player cells blend last-10 of the cell’s stat. |
| Live / in-game | Same analysis, leftover mean, then `infoQuality × 0.52`. Never The Call. Own desk `/live`. |

---

## 7. Tape (colleague review)

Sportsbooks publish two different percentages:

- **Ticket count** — how many *wagers* (the public)
- **Handle** — how many *dollars* (where sharp money usually is)

When they split (≥7 points), money > tickets = sharp tell; tickets > money = public.
Steam (line moving with money) tilts sharp. Analyzed on every ticket. Never the
sole reason to bet.

Sources, in order: Action Network `ml_home_public` / `ml_home_money` (when posted);
reconstruct handle from open→close; otherwise leave blank. ESPN win% is a **model**,
not book handle — do not show it as bets-vs-money.

Card stamp: **HR-FL tape** if we have a Hard Rock Florida number, **photographed**
if the user uploaded the slip, else **research**.

---

## 8. Photo / lock / Log

Photograph Hard Rock to lock. The site never places the bet.

- Camera **and** photo library. Two separate inputs.
- Parsed OCR is **always editable** before Log. The user may correct any field.
- Confirm requires a photo. That is how we get the live number.
- Log stores the photographed (or HR-FL) number and the desk fair at lock.
- After the game, the user taps Win or Loss. Start money moves with it.
- A delayed live number is not a fill — photograph Hard Rock now.

---

## 9. Florida / venues / size

- Live sportsbook: Hard Rock Bet
- Fantasy: DraftKings classic salary-cap (placeholder tab — not this ranking desk)
- Prediction markets: Kalshi / Polymarket — research only
- $50 seed still **names** a ticket; `liveFits` is false until bankroll ≥ $100 and unit ≥ $1
- Suggest 1% unit. User types real dollars. No hidden minimum that hides tickets.
- 21+ Hard Rock Bet / 18+ fantasy. 1-800-GAMBLER.

---

## 10. Desk constants (pin)

| Constant | Value |
|---|---|
| `DESK_VERSION` | `2026.09.09-world` |
| Persist | `sports-lock-v1` |
| Paths `N` | 4000 ran / 800 thin |
| Fair blend | 0.5 sim / 0.3 pool / 0.2 market |
| Last-10 | EWMA λ=0.82; player 60/40 with season |
| NFL/NCAAF spike | 4.5% of paths on ±3 and ±7 |
| Ribbon floors | 2-leg 0.56 / 3-leg 0.60 displayed; combined 0.38 / 0.28; decimal ≥ 1.45; quality ≥ 0.72 |
| Catalog floors | 2-leg 0.48 / 3-leg 0.50 / 4-leg 0.48 |
| The Call | quality ≥ 0.72, process Ran, chance 0.50–0.76, decimal ≥ 1.55, not live, not period, not parlay, not desk% >1 pt under book with no +edge |
| In-play quality | × 0.52 |
| `parlayScore` | `fair^1.6 · ln(1+profit) · 8 + fair · 2.4` |
| GTD mix | 55/45 in/out |
| Displayed chance | clip 99% |
| Custom parlay cap | 8 |
| Horizon | today ET + in-play + next 36h |

---

## 11. Stack (sandbox)

TanStack Start/Router/Query, React 19, Tailwind v4, zustand persist `sports-lock-v1`.
Server functions for ESPN + Kalshi + Polymarket + Action Network + screenshot parse.
No `.env`. No Neon. No auth. Serve `0.0.0.0:8080` via `npm run dev` / `startup.sh`.

Pinned files for this desk:

- `src/lib/market/rules.ts` — `ALGORITHM_RULES` / `DESK_VERSION` `2026.09.09-world` / `ruleStamp`
- `src/lib/market/seed.ts` — FNV-1a64 + PCG64. No wall-clock. No `Math.random`.
- `src/lib/market/sim.ts` — seeded paths, blendFair 0.5/0.3/0.2, jointHit
- `src/lib/market/latents.ts` — `G` from ensemble + weather chaos
- `src/lib/market/usage.ts` — `U` depth-chart kernel, college stand-down
- `src/lib/market/live-state.ts` — `S` remaining mean, liveQuality ×0.52
- `src/lib/market/registry.ts` — known Hard Rock markets; unknown stands down
- `src/lib/market/chance.ts` — game/period ensemble, always-push layers
- `src/lib/market/props.ts` — player ensemble + `propContextFromBrief`
- `src/lib/market/looks.ts` — live ESPN team statistics parser
- `src/lib/market/form.ts` — last-10 score analysis (`parseEspnScore`, EWMA)
- `src/lib/market/sheet.ts` — Hard Rock sheet expected values
- `src/lib/market/picks.ts` — AI Picks ranking, ribbon, The Call
- `src/lib/market/parlays.ts` — haircut, juice, correlation stamp
- `src/lib/market/engine.ts` — sim blend, unknown_market, joint SGP
- `src/lib/market/tape.ts` — `parlayScore` `fair^1.6`
- `src/lib/market/live-board.ts` / `research.ts` — fetchers
- `src/routes/live.tsx` — Live desk
- `src/components/app/shell.tsx` — five-desk nav
- `src/components/app/screenshot-ingest.tsx` — camera + library + editable OCR

---

## 12. Out of scope this pin / next

Do not silently ship these as if they ran:

- **Fantasy / DFS engine** — `/slate` is a placeholder. DraftKings Fantasy only.
  Not a Florida sportsbook fill. Next desk, not this ranking.
- **Process feeds** — nflverse / Statcast / KenPom / MoneyPuck. Empty = Looked.
  Do not invent EPA, xG, or four factors.
- **Odds API** — Looked without a key. Photograph Hard Rock is the fill.
- **Scraping Hard Rock** — never. No fake login. No replayed sessions.
- **Auto-bet / auto-stop** — the site never places a bet and never auto-halts.
- Auth and database — off.

**Acceptance (must stay true)**

- Same snapshot → same ranking.
- No 100% chance. No “lock” as certainty.
- College player cannot be added to a Florida ticket.
- Live cannot be The Call and cannot be a ribbon leg.
- Fantasy does not emit Hard Rock sportsbook tickets.
- Photo confirm can correct OCR.
- Games is never a blank screen with no reason.

---

## 13. Change log

### 2026-09-08 — Ticket URL + Popular lane (pin stays `2026.09.09-world`)

User: `/ticket?id=p|2|spread|…` said “not on today’s board.” Popular on AI Picks was empty while Games had MLB. Do not bump the pin.

- Parlay ids are URL-safe: `p2.event.market.side.event.market.side`. No `|`, `~`, spaces, or `+`. Old `p|` and `p2-…~…--…` ids still parse. Lookup reconstructs from the raw query if the router ate the id. Builder is filled so Back shows Your ticket.
- Combined block + a full algorithm block for every leg + Open this leg. Custom mixes with ≥2 legs get the same Open ticket control. One ribbon tap shows two per-leg breakdowns and one combined block.
- Popular is ML / spread / total and does not need The Call. Pre-game mains fill the lane before live leftovers. Chance-floor on Safest cannot empty Popular.

Honesty that still never moves: not a lock, site never places a bet, delayed
numbers, photograph Hard Rock, 1-800-GAMBLER, college player props blocked.

### 2026-09-09 — Parlay ticket page (pin stays `2026.09.09-world`)

User: “Load this ticket” was dead. Do not bump the pin.

- Ranked catalog, AI ribbon, custom builder, and photographed slips: one gesture fills **Your ticket** and opens `/ticket?id=p|…`. No silent stay on the list.
- Parlay ticket page is the same shape as a single ticket: header (legs, sport, start, combined chance, Hit $/Miss $, Book/Desk/Edge, correlation flag, quality, tape), combined block (joint-path vs closed-form vs Thin fallback-haircut, ribbon why), per-leg full stack with Open this leg / Remove.
- Missing or `unknown_market` legs stand down. Page still opens. Quality cap 0.64. No fake sim %.
- College player legs cannot load. Live cannot load onto the ribbon; a forced live leg haircuts combined quality and is never The Call.
- Custom builder **Open ticket** uses the same page when there are 2+ legs. Back to `/parlay` keeps those legs in the builder.

Honesty that still never moves: not a lock, site never places a bet, delayed
numbers, photograph Hard Rock, 1-800-GAMBLER, college player props blocked.

### 2026-09-09 — Tiny delta (pin stays `2026.09.09-world`)

User: TINY DELTA. Do not bump the pin.

- Home desks are AI Picks, Games, Parlay, Live, Log. No “four desks.” Fantasy is a placeholder — see More.
- The Call sits down when quality < 0.72, process is Looked (missing stamp = Looked), the ticket is live / a parlay / a period slice, or desk % is more than 1 pt under the book with no positive edge. Alvarez over 2.5 (Looked, quality 0.64, edge −2) cannot wear the badge. Empty pool → no Call, not a fallback.
- MLB process row is Statcast / Baseball Savant. File posted (xwOBA) = Ran + source name. Else Looked. ISO/ERA is not Statcast. Never invent xwOBA.
- Same-game 2-leg mains print **joint-path** or **Thin · fallback-haircut** on the ticket (card stamp, catalog, builder), not only in the blurb.
- 4-leg chip sits under Catalog / fun money, off the ranked filter row that sits on the ribbon.
- Games empty state names the filter. Never DraftKings sportsbook.

Honesty that still never moves: not a lock, site never places a bet, delayed
numbers, photograph Hard Rock, 1-800-GAMBLER, college player props blocked.

### 2026-09-09 — Delta pass (pin stays `2026.09.09-world`)

User: finish holes. Do not rewrite the desk. Do not bump the pin unless ranking changes.

Shipped this pass:

- Copy: Home / Games / Log photo banners are Hard Rock Bet Florida only. DK is Fantasy or a photographed slip to grade — not a Florida sportsbook fill. Home lists five desks. No “four desks.”
- `/more` About + settings. Header More is a real route (no 404). Persist default mood (Safest), unit %, hide college, hide live.
- Games empty states say why (this filter / off-slate / feed Looked) and how to clear. `uniqueUpcomingGames` keeps schedule-only and non-ML. All-count on the clear button.
- Process is a dedicated layer (`layerIds: ["process"]`). Named source (Statcast / EPA / KenPom / xG). Empty = Looked. ISO/ERA is not Statcast — never invented to avoid Looked.
- Generative sim omitted unless `latent.ran`. Closed form + quality cap 0.64. Ticket page does not print a fake sim %.
- Same-game mains: joint paths when registered. Haircut is fallback only and stamps Thin + fallback-haircut. 4-leg is Catalog only. Ribbon always sorts Safest.
- Live remaining-stat tickets use leftover mean from score + clock. Missing critical S → micro stand-down. Never The Call.
- Hit / Miss: gold Hit + slate Miss + labels, not green/red alone.

Honesty that still never moves: not a lock, site never places a bet, delayed
numbers, photograph Hard Rock, 1-800-GAMBLER, college player props blocked.

### 2026-09-09 — Blueprint living-law catch-up (this note)

User: “Update the blueprint.”

Sections 0–12 are now the current law for `2026.09.09-world`. Added the rules
table, desk constants, photo/lock, out-of-scope, and acceptance so the next
turn does not re-litigate the Hard Rock pass against leftover `2026.09.08-live`
copy. Historical notes below stay as history. Pin in `AGENTS.project.md` already
matches.

Honesty that still never moves: not a lock, site never places a bet, delayed
numbers, photograph Hard Rock, 1-800-GAMBLER, college player props blocked.

### 2026-09-09 — World desk + Hard Rock IA (`2026.09.09-world`)

User: HARD ROCK APP PASS — implement official algorithm spec DESK_VERSION
`2026.09.09-world` and Hard Rock-like IA.

**What the desk became**

- Hidden object: latent game `G` + usage `U` + live state `S`. Fair = blend
  0.5 sim / 0.3 pool / 0.2 market. Seeded PCG64 (FNV-1a64 mix of version +
  quote fingerprint + eventId). No wall-clock in the seed. No `Math.random`.
- NFL/NCAAF 3 and 7 discrete spike 4.5% of paths. Weather is a passing-EPA
  and total modifier, not a +0.02 ML party trick.
- `parlayScore = fair^1.6 · ln(1+profit) · 8 + fair · 2.4`. Same-game joint
  paths when registered; haircut 5–8 / 9+ fallback. Correlation stamp.
- Ribbon: 2- or 3-leg mains, 56%/60% floors, quality ≥ 0.72, combined 38%/28%,
  decimal ≥ 1.45. No live, no player props, no college, no 4-leg on the gold badge.
- The Call: single, not live, not period, not exact-score / first-scorer /
  micro / future / teaser. Quality ≥ 0.72, chance 50–76%, decimal ≥ 1.55.
- Unknown Hard Rock market → `unknown_market` stand-down. College player →
  `illegal_fl`. Listed-out omitted. Displayed chance clipped at 99%.
- Empty feed = Looked. Process feeds (EPA / Statcast / xG / tempo-free) Looked
  this snapshot. Never invented. Never NO LOOK.

**IA that shipped**

- Bottom nav: **AI Picks / Games / Parlay / Live / Log**. Fantasy is a
  placeholder in More (DraftKings Fantasy only).
- Start (`/`) is first-run + bankroll. After onboarded, cut the five-desk
  essay. Do **not** auto-redirect `/` — that is where the pile is edited.
  AI Picks is the working desk (left tab, featured).
- Cards: chance, payout, quality, The Call, Book/Desk/Edge, tape stamp
  (HR-FL | photographed | research).
- Photo: camera **and** library. OCR always editable before Log.
- Live is its own desk. Never The Call. Never a ribbon leg.
- `DESK_VERSION` in More. 21+ / 1-800-GAMBLER / never places a bet.

Official spec: [`SPORTS_LOCK_ALGORITHM.md`](./SPORTS_LOCK_ALGORITHM.md).
Supersedes `2026.09.08-live`.

Honesty that still never moves: not a lock, site never places a bet, delayed
numbers, photograph Hard Rock, 1-800-GAMBLER, college player props blocked.

### 2026-09-08 — Official algorithm specification (this note)

User: create a document that lays out **every rule** that goes into **every
algorithm** for **any prediction** for **every ticket**. Bullet grouped, fully
informative, sourced, so a reader can believe it is genuine.

Shipped: [`SPORTS_LOCK_ALGORITHM.md`](./SPORTS_LOCK_ALGORITHM.md). Originally
copied from the running desk (`chance.ts`, `props.ts`, `sheet.ts`, `picks.ts`,
`tape.ts`, `form.ts`, `looks.ts`, `rules.ts`, `parlays.ts`, `engine.ts`). Desk
constants are labeled desk. Published methods are named (James log5, Oliver
Pythagorean, A&S Φ, Dimers, CLV, Olympus, DMP Learn, StatPair). Pin was
`2026.09.08-live` *(superseded 2026-09-09 by `2026.09.09-world`)*. The file
now holds the world-desk spec.

Honesty that still never moves: not a lock, site never places a bet, delayed
numbers, photograph Hard Rock, 1-800-GAMBLER, college player props blocked.

### 2026-09-08 — Blueprint living-law catch-up (this note)

User: “Update the blueprint.” Section 3 was still the last-10-only list.
Pinned here so the next turn does not re-litigate:

- Last-10 applies to **every stat** (games pf/pa, player that-stat EWMA, sheet
  cells, periods inherit, live walks the same list).
- Leftover four are live ESPN, never invented: opponent-adjusted defense,
  pitcher-vs-batter, minutes/usage, xG-style underlying.
- Every rule looks up live data every time. Stamps **Ran / Thin / Looked**.
  Never **NO LOOK**. Empty feed is 50/50, not a skip.
- ESPN host is `site.web.api.espn.com`. Scores are `{ value, displayValue }` —
  `parseEspnScore`, never `Number(object)`.
- `DESK_VERSION` `2026.09.08-live` *(superseded 2026-09-09)*.

Honesty that still never moves: not a lock, site never places a bet, delayed
numbers, photograph Hard Rock, 1-800-GAMBLER, college player props blocked.

### 2026-09-08 — Live looks every time, last-10 on every stat, never NO LOOK

User: leftover looks (opponent-adjusted defense, pitcher-vs-batter, minutes/usage, xG-style) must have **live data**, last-10 must apply to **every stat** not just W-L, and **every rule must run every time**. Screenshot showed H2H and home/road as **NO LOOK**.

**Why those two printed NO LOOK:** team last-10 (`/schedule`) and team statistics (`/statistics`) were fetched from `site.api.espn.com`, which **403s**. The desk skipped the layer. Host is now `site.web.api.espn.com` (same JSON, live). A second bug: ESPN schedule scores are `{ value, displayValue }` objects — `Number(object)` is NaN, so last-10 collapsed to a W-L sticker. We parse `value`. Empty feed is **Looked** (50/50, not a skip, not a guess). Thin sample is **Thin**. Never **NO LOOK**.

**Last-10 on every stat — not just the 10-game W-L card**

| Ticket | What last-10 actually is |
|---|---|
| Games / totals / periods | EWMA λ=0.82 of actual pf/pa from the live ESPN schedule log (latest counts most), plus margin and trend. Periods inherit then shrink. |
| Player props | EWMA of **that stat** (hits, Ks, yards, points…) from the athlete gamelog, 60/40 with season. Not a hit-rate sticker. |
| Sheet expected | 28% last-10 combined score mixed into the total; player cells blend last-10 of the cell's stat. |

**Leftover four — live ESPN, never invented**

1. **Opponent-adjusted defense** — MLB: opponent ERA / opponent OPS (last-7 when posted). NFL/NBA: last-10 points/runs **allowed** (own pts/G is not defense; we do not pretend it is).
2. **Pitcher vs batter** — probable `athlete.throws.abbreviation` (L/R) × team vs-LHP / vs-RHP split. Player tickets also get opposing starter ERA.
3. **Minutes / usage** — last-10 gamelog drops games under half this player's median minutes so a DNP cannot fake a hot streak.
4. **Underlying (xG-style)** — OBP + ISO for hitters, ERA/WHIP/opp OPS for pitchers. Process, not just runs that already scored.

**Same inputs → same ranking.** `DESK_VERSION` `2026.09.08-live` *(then)*. No dice.

Honesty that still never moves: not a lock, site never places a bet, delayed numbers, photograph Hard Rock, 1-800-GAMBLER, college player props blocked.

### 2026-09-08 — Last-10 analysis, rule list, determinism (this turn)

Colleague chat (screenshot): the computer should run a **list of rules**; last-10 scores must be an **analysis**, not an artifact; odds change in real time; more rules can be added. The algorithm is everything — games, player stats/props, and in-game tickets.

**Answers**

1. **Did the app already do this?** Partially. Last-five was a recency-weighted *win%* layer, often from ESPN’s canned `lastFiveGames` card (the “artifact”). There was no pinned rule list, no last-10 expected total, player last-10 was a flat average after tap, and in-game rows were dropped from ranking. **Now:** last **10** completed scores from the live ESPN team schedule, EWMA λ=0.82 on actual runs/points, trend (recent 5 vs older 5), H2H inside that window, home/road split. Player last-10 is EWMA of the athlete gamelog, 60/40 with season, fetched for today’s starters on the board (not only after tap). `ALGORITHM_RULES` + `DESK_VERSION` (`2026.09.08-live`) is the list. The board still refreshes ~once a minute — delayed, never a fill.

2. **What else improves prediction?** (experts this turn: StatPair 10-match rule 72% vs season 54%; last-3 too noisy, last-15 diluted. Betmana: don’t overweight last 2–3; books already shade recency. AgentBets: EWMA > flat SMA. StatsBet: H2H + home/away splits. DMP Learn: Poisson for rare counts, **normal** for yards/points. StatsBench: last-10 *hit rate* is a trap — blend, don’t treat 8/10 as a lock. nfl-bet-engine: top-3% edge overfits; calibrate thin markets.) We incorporated: EWMA last-10, light trend, H2H, venue split, player EWMA 60/40, yards via normal not Poisson, live quality haircut, calibrate already in. **Live now (not leftover):** opponent-adjusted defense, pitcher-vs-batter, minutes/usage filter, xG-style underlying — ESPN team statistics + gamelog, never invented.

3. **Does this belong in the algorithm?** Yes. Last-10 analysis is a layer, never the whole desk. Market close stays the prior. Recency is light (form precision ~2.1–2.8, trend 1.5) because books already shade hot streaks.

4. **Does this app have Claude “Artifacts”?** **No.** This is a real TanStack Start app with pure ranking functions. The colleague’s “artifact” meant a canned W-L sticker / generated card, which ESPN `lastFiveGames` was. We replaced it with analysis of the live log. No Claude Artifact iframe, no random demo widgets.

5. **Same way EVERY SINGLE TIME?** Pure functions. No `Math.random` in `src/lib/market`. Sort is `score`, then chance, then `id`. Every rule looks up live data every time: **Ran / Thin / Looked** — never **NO LOOK**, never skip, never invent. Ticket page lists **Rules the desk ran** with that stamp and `DESK_VERSION`. Bump the version when a ranking rule changes. Tests: same 10 scores → identical `FormRead`; same board → identical hero id.

**Code**

- `form.ts` — `analyzeScores`, `ewmaMean`, `vsOpponent`, `splitByVenue`, `last10ExpectedTotal`, `parseEspnScore`
- `rules.ts` — `ALGORITHM_RULES` / `DESK_VERSION` `2026.09.08-live` / `ruleStamp`
- `chance.ts` — form + margin + trend + h2h + venue-split + defense + underlying + platoon; `pushEmpty` so every layer id exists
- `looks.ts` — live ESPN team statistics (season, vs opp, home/away, last-7, vs L/R)
- `sheet.ts` — totals blend 28% last-10 expected combined score; player expected mixes last-10
- `props.ts` — 60/40 last-10 of that stat, normal for yards/points, Poisson for counts, defense/usage/pitcher/underlying/platoon always pushed
- `picks.ts` — in-play quality ×0.52, never The Call; skip period sheet for live games; rank today ET + in-play + next 36 hours
- `live-board.ts` / `research.ts` — team last-10 + team looks + starter gamelogs on today’s briefs
- AI Picks Live tab (hidden when empty). Ticket: “Last 10 scores — analysis” + Rules the desk ran (Ran / Thin / Looked)

Honesty that still never moves: not a lock, site never places a bet, delayed numbers, photograph Hard Rock, 1-800-GAMBLER, college player props blocked.

### 2026-09-08 — Hard Rock desk audit (this turn)

User: audit every angle — visual, ease, layout, algorithm. Resemble Hard Rock Bet. Ultimate algorithm so the user picks tickets with confidence. Document in this blueprint.

**What was wrong**

- AI Picks stacked seven sections × three cards × seven screenshot CTAs. Hard Rock is a sport ribbon + market tabs + one slip.
- The Call was a 2nd-inning under because `deskScore` loved ~57% at −110 on a noisy slice. Experts (Dimers, CLV desks, Olympus, FanGraphs MLB ranks) do **not** treat a 1st-inning 0.5 like a moneyline.
- Highest-confidence tail on thin markets is where models overfit (Olympus: historically the worst bucket).

**Algorithm (experts we used)**

- Dimers 2026 NFL model: form, power, efficiency, pace, venue, rest. We already had most; added a **scoring-margin / efficiency** layer (offense vs opponent defense) next to Pythagorean.
- CLV / +EV desks: edge vs the juice is first-class. `ticketScore` adds clipped `fair − implied`. Ticket page shows Book / Desk / Edge.
- Olympus / algobetting: calibrate — pull displayed chance toward the book when `infoQuality` is low (`calibratedChance`). Quality 1.0 keeps the ensemble.
- NFL key numbers 3 and 7: dog +3.5 / favorite −2.5 get a quality bump; laying −3.5 / +2.5 get a haircut.
- MLB: bullpen fatigue on a B2B now actually fires (was below the rest threshold). Expanded park list (Coors through Oracle).
- `infoQuality` floor **0.72** for The Call. Period rank cap 1 per event. 58% at −110 still beats 80% at −400.

**UI (Hard Rock)**

- Sport chips. One hero. Market tabs: Popular | Players | Periods | Parlays (with 2-leg / Same-game / 3-leg / 4-leg).
- Mood chips analog to Hard Rock For You *Chill / Skill / Thrill*: **Safest / Best value / Pays more**.
- Tickets are tappable slips (logos, chance, Hit $, confidence, edge vs the book). One screenshot CTA at the bottom, not seven.
- Games table collapsed behind `<details>`. Start: bankroll first, giant Open AI Picks.
- Compact header; tagline hidden on mobile.

Honesty that still never moves: not a lock, site never places a bet, delayed numbers, photograph Hard Rock, 1-800-GAMBLER, college player props blocked.

### 2026-09-07 — AI Picks completion (this turn)

User restated: Today → **AI Picks**; highlight the *best* tickets across popular / props / half-inning-quarter / parlays; literally tell the user what to wager; hit% + payout on every card; click → full algorithm + colleague tape; screenshot CTA on every section; living Bible; pull all info for games **and** players.

Shipped this pass:

- Start / Learn / Bet types / Alerts copy now say **AI Picks** (route stays `/today`)
- `buildDeskPicks` ranks popular, player, period, SGP (including player+period mixes), 2/3/4-leg
- Ticket IDs encode the bucket so `/ticket?id=` keeps period vs popular
- Game-level wagers-vs-dollars stamped onto sheet cells (labeled as game tape, not a fill)
- Event briefs carry rest / ERA / park / scoring / series so the ensemble does not wait on a second tap
- Ticket page: What to wager, each leg, algorithm layers, injuries/weather/park/player stats, photo lock, “don’t see your wager”
- Hero is a **single** (never a 4-leg). College player bets stay blocked.
- Tests: `src/lib/market/picks.test.ts`

Honesty that still never moves: not a lock, site never places a bet, delayed numbers, photograph Hard Rock, 1-800-GAMBLER.

### 2026-09-07 — AI Picks (first pass)

User: rename Today → **AI Picks**; algorithm must highlight the *best* tickets
across popular / props / half-inning-quarter / parlays; click → full breakdown
including colleague tape; screenshot CTA on every section; living Bible/blueprint;
pull all available info for games **and** players; hit% + payout on every ticket.

Shipped:

- Tab label **AI Picks** (route `/today`)
- Desk catalog `src/lib/market/picks.ts` ranks popular, props, periods, SGP, 2/3/4
- Ticket detail `/ticket?id=`
- Event briefs now carry players / injuries / venue so props can rank without a
  second tap
- Photo CTA on every AI Picks section
- This blueprint + `AGENTS.project.md`

### 2026-09-07 — Tape + 3+3+3 + 4-leg catalog

Colleague: analyze number of wagers **and** $% of all bets. Today became
3 easiest singles + top 3 two-legs + top 3 three-legs. Parlay catalog 2/3/4-leg,
same-game and cross-sport. Board check `noted` not `discarded`. 4-leg illegal on
the ribbon, legal on the catalog.

### 2026-09-07 — Percent desk language

Hero number is chance-to-hit %, plus Hit/Miss dollars. Never stack `+105` and
`57%` as co-equal. Never print 100%. Hide 1-leg parlay tray.

### Earlier — Edition 1 + Hard Rock dark UI

User overrode the bible’s light paper: dark Hard Rock-like UI (`#0b0b0c` / gold
`#ffb81c`). $50 seed still gets a named one-game ticket. Ensemble of market /
Kalshi / Poly / ESPN / form / injuries / weather / park / rest.
