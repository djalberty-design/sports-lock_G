# Sports Lock — Official Algorithm Specification

**Desk pin:** `DESK_VERSION` `2026.09.09-world`  
**Supersedes:** `2026.09.08-live`  
**Status:** living law. Same snapshot + same seed → same ranking. No free dice.  
**This is research.** The site never places a bet. It never calls a lock. Photograph Hard Rock to lock a live number when the Florida tape is missing or a boost is off-feed. 21+ / 1-800-GAMBLER.

This document is the official list of **every rule** that goes into **every prediction** for **every Florida Hard Rock ticket** the desk will price. Numbers, weights, and formulas are desk law unless a published method is named. Nothing is invented at prediction time. Empty feed = **Looked**, never **NO LOOK**.

Universe: **MLB, NFL, NBA, NHL, NCAAF, NCAAB** on **Hard Rock Bet Florida** only. Other sports stand down. College **player** tickets stand down in Florida; college player looks still run as **game-context only**.

---

## How to read this

- **Look** = one noisy observation of a hidden number (chance the ticket hits, or a latent that feeds that chance).
- **Precision** = how loud that look is in the pool. Desk constant until the calibration loop overwrites it.
- **Ran / Thin / Looked** = the ticket-page stamp.
  - **Ran** — live lookup returned a real number.
  - **Thin** — live lookup, small sample. Light weight.
  - **Looked** — we fetched; feed empty. Layer is 50/50 (or the sport prior) with tiny precision. Not a skip. Not a guess. Never **NO LOOK**.
- **Prior** = Hard Rock Florida two-way no-vig, when posted. Else the sharp public two-way. Everything else is a reason to move off it, or not.
- **Snapshot** = the frozen JSON of every look + every posted line at compute time. Rankings are a pure function of snapshot + `DESK_VERSION`.
- **Seed** = `uint64(BLAKE2s(DESK_VERSION || snapshotId || eventId))`. Monte Carlo uses this seed. Same snapshot → same paths → same chance.
- Displayed chance is clipped at **99%**. Never 100%. Never “lock.” Never “guarantee.”

---

## 0. What a prediction is

For any ticket the desk estimates **P(this ticket hits | snapshot)**, then ranks by chance × payout × market quality × edge vs Hard Rock Florida juice.

The hidden object is no longer a single `P(home wins)`. It is a **latent game state** `G` plus a **lineup/usage vector** `U` plus a **live match state** `S` (empty pre-tip). Every ticket — moneyline, alt spread, first basket, live remaining Ks, 8-leg custom parlay — is a function of draws from that object.

```
snapshot → looks → G, U, S
G, U, S + seed → N paths
ticket = 1{path satisfies the photographed / posted proposition}
P_fair = mean(ticket)          # Monte Carlo, seeded
P_pool = invLogit(pool(looks)) # still runs, as a look
fair   = blend(P_fair, P_pool, P_market)
```

Ticket types that walk this spec (Florida Hard Rock):

- Popular: moneyline (2-way; NHL also 3-way regulation), spread / run line / puck line, game total, team total, alternate lines of all of those.
- Player tickets: legal NFL / NBA / MLB / NHL props and alt props. College athlete props = `illegal_fl` stand-down.
- Period tickets: 1st inning, F5 / first 3 / first 7, inning halves, quarter, half, NHL period, period spreads and period totals, period team totals.
- Game props: first / last / next score, first basket / first goal / first TD, race-to-X, odd/even, highest-scoring quarter, method of score, both teams to score (hockey/baseball analog: both teams to score a run/goal), overtime yes/no, exact / correct score when posted.
- Live / in-play: same families plus remaining-stat props and microbets (next play, next pitch result, current drive, next scoring play). Never The Call.
- Same-game parlays and SGP Max (multi-game builder, up to the book’s cap).
- Cross-game 2 / 3 / 4+ parlays, teasers, flex / consolation parlays, round robins (priced as the underlying combo set).
- Futures and season props for the six sports.
- Boosts / enhanced-odds tickets: priced as the underlying ticket plus a juice flag. Boost is not edge.

Pipeline, in order:

1. Pull the snapshot (Hard Rock FL tape + ESPN + process feeds + crowd + weather + injuries).
2. Build **latents** `G` and **usage** `U` from the ensemble (§4–6).
3. If the clock has started, attach **live state** `S` and condition (§7).
4. Draw **seeded paths** and price every registered ticket from the same paths (§8).
5. **Calibrate** displayed % toward the Florida tape when the market is thin (§10).
6. **Rank** singles with `ticketScore`. **Propose** parlays with `parlayScore` under the high-hit ribbon law (§11). Mood re-sorts; it does not rewrite chance.
7. Stamp **Rules the desk ran**. Same snapshot → same ranking.

---

## 1. Honesty that never moves

- Never print “lock”, “guarantee”, or 100%. Clip displayed chance at 99%.
- Delayed or aggregator numbers are not a fill. A **photographed Hard Rock Florida ticket** or a **Ran `hardrockbet_fl` two-way** is the fill.
- This site never places a bet. Paper log is a tracker, not a book.
- Florida: college **player** props illegal on Hard Rock Bet — blocked as tickets. The same looks may still inform the **game** latent.
- DraftKings / FanDuel **sportsbooks** are not licensed live Florida tickets. DK **Fantasy** is a different product.
- Do not invent Hard Rock’s order book. Label every tape source.
- Do not invent a missing split, ERA, EPA, xG, minutes, last-10, or handle %. Empty = Looked.
- Kalshi and Polymarket are **research**, never a Florida fill.
- ESPN win% is a **model**, not book handle.
- Ticket count vs handle is a layer. Never copy-traded. Never auto-fade/tail the public.
- Do not scrape the Hard Rock app. Do not fake a login. Do not replay captured sessions.
- 21+ Hard Rock Bet / 18+ fantasy. 1-800-GAMBLER.

---

## 2. Math the whole desk shares

### 2.1 Log-odds pool

- `logit(p) = ln(p / (1 − p))`, `p` clipped to `[0.015, 0.985]`.
- `invLogit(z) = 1 / (1 + e^(−z))`, then clip.
- Layer clips: `[0.12, 0.88]`. Final game-win clips: `[0.14, 0.86]`.
- Pool: precision-weighted mean of logits.

```
z = Σ logit(p_i) · precision_i  /  Σ precision_i
P = invLogit(z)
```

Overdispersion shrink and James–Stein pull toward the **Florida (or sharp) market** stay as in `2026.09.08-live`:

- Residual χ²: `chi = Σ precision_i · (logit(p_i) − z)²`, `df = n − 1`.
- Overdispersed if `chi / df > 1.35`.
- Keep market-family precision. Scale every non-market precision by `max(0.35, 1.35 / (chi/df))`.
- Extra pull: `λ = min(0.55, 0.18 + 0.5 · max(0, 1 − max(0, 1 − std/0.14)))`, then `z ← λ · logit(market) + (1 − λ) · z`.

### 2.2 Seeded Monte Carlo

- Paths `N = 4_000` default. `N = 12_000` for The Call, ribbon parlays, alt tails beyond 2σ, exact-score, first-scorer, and any live micro.
- Generator: PCG64, seeded by §0.
- No `Math.random`. No wall-clock entropy.
- Ticket fair = `hits / N`. Standard error `√(p(1−p)/N)` is printed on the research sheet, never as the badge.

**Why sim instead of one Φ.** Alternate lines, first-event tickets, remaining live props, period slices, and same-game parlays are path statistics. A league-σ normal cannot emit them from one mean.

### 2.3 Normal CDF and Poisson

- `Φ` via Abramowitz & Stegun 7.1.26 when a closed form is the look (spread-implied winner, sheet cell).
- Rare counts (hits, Ks, receptions, walks, SOG, saves): Poisson or negative binomial. Desk default for overdispersed counts: **NB2** with `φ = 1.18` (DMP Learn 2026 extra-Poisson).
- Yards / points / PRA / rushing / receiving: normal or truncated-normal, sport σ from §5, **scaled by game-variance latent**, not the raw league constant.
- Yes/no rare events (anytime TD, HR, stolen base, NHL goal): `1 − exp(−λ)` as the closed-form look; sim uses the underlying counting process.

### 2.4 Bill James log5 and Pythagorean

Unchanged. WP clipped `[0.15, 0.85]` before log5.

| Sport | Pythagorean exponent | Lineage |
|---|---|---|
| MLB | 1.83 | James / Davenport Pythagenpat |
| NBA | 13.91 | Dean Oliver |
| NCAAB | 10.25 | KenPom-family scale |
| NHL | 2.07 | hockey Pythagorean |
| NFL / NCAAF / other | 2.37 | Football Outsiders / James |

### 2.5 Recency EWMA

- Last **10** completed games (or last 10 player appearances after the minutes filter).
- `w_i ∝ 0.82^i`, index 0 = latest. Blend **60% EWMA / 40% season** when both exist.
- Player minutes filter: drop games under half median minutes; if that leaves < 3, keep raw 10.

### 2.6 Home-field logits

Added only when the split is season W-L, not already a home/road split.

| Sport | logit bump | ≈ extra win% at 50/50 |
|---|---|---|
| MLB | 0.12 | ~3.0 pts |
| NFL | 0.16 | ~4.0 pts |
| NBA | 0.20 | ~5.0 pts |
| NHL / NCAAF / NCAAB | 0.22 | ~5.5 pts |
| other | 0.14 | ~3.5 pts |

### 2.7 Sport scoring priors (pace + variance)

League constants are **priors**, overwritten by the variance latent when process data Ran.

| Sport | League total | Margin σ prior | Total σ prior | Pace unit |
|---|---|---|---|---|
| NFL | 44.5 | 13.45 | 10.2 | plays / EPA |
| NCAAF | 54 | 16.2 | 13.5 | plays / SP+ |
| NBA | 224 | 12.0 | 11.5 | possessions |
| NCAAB | 145 | 11.5 | 10.8 | possessions |
| MLB | 8.6 | 3.05 | 2.85 | PA / inning |
| NHL | 6.1 | 1.85 | 1.65 | 5v5 minutes + xG |

Variance latent: `σ ← σ_prior · clip(1 + 0.65 · (postedTotal / league − 1), 0.72, 1.35)` then further scaled by weather, backup QB / backup goalie, and live chaos.

### 2.8 Ground truth (what “good” means)

Three numbers, in this order. The desk does not get to pick a flattering one after the fact.

1. **Fill edge (user truth).** `fair − implied(Hard Rock FL two-way)` on the photographed ticket, or on `hardrockbet_fl` when Ran and no photo. This is what the ticket page prints as Edge.
2. **CLV (learning truth).** Desk fair vs the last public / HR close before lock. Layers that lose CLV for 60 graded days get precision scaled by `max(0.40, 1 − 2 · max(0, −CLV_pts / 5))`.
3. **Calibration (honesty truth).** Among tickets whose displayed chance was in `[k, k+5)`, the hit rate must land inside a 90% Jeffreys band or the displayed formula’s quality multiplier is pulled toward the book. Brier and log-loss are the stored scores.

Grade clock: result is official league result under Hard Rock house rules (OT inclusion per market). Push = neither hit nor miss; excluded from hit rate, included in CLV as 0.

---

## 3. Live data — every rule, every time

Empty feed rule is unchanged: `p = 0.5` (or sport prior), `precision = 0.08`, `empty: true`, `thin: true`, stamp **Looked**.

### 3.1 Florida tape (the fill)

| Look | Live source | Stamp |
|---|---|---|
| Hard Rock FL two-way | The Odds API `us2 / hardrockbet_fl` (and labeled mirrors that name Florida) | **Ran** when both sides exist |
| Hard Rock FL one-way / boost | same feed if present; else photograph | one-way = cannot call fair two-way without a model hold |
| Photograph | user image of the Hard Rock ticket | **Lock** for the log. Overrides feed when `|photo − feed| ≥ 1¢` American or the market is a boost / custom SGP the feed does not carry |
| Public two-way fallback | delayed ESPN scoreboard, other Odds API books | research prior only, labeled delayed |

**Best path on lines.** Do not scrape Hard Rock. Subscribe to a licensed aggregator that exposes `hardrockbet_fl`. Poll pregame ~30–60s. In-play, prefer the aggregator websocket if it carries Florida; otherwise re-price off live state and wait for a photograph to lock the juice. Boosts, teaser charts, and some SGP prices will **never** be complete on an aggregator — photograph stays in the product for those.

DK/FD sportsbook numbers may sit in the pool as `book` looks. They are not a Florida fill.

### 3.2 Process feeds (world-class looks)

Every feed is attempted every snapshot. License and ToS are the operator’s problem; the desk’s problem is: if the file is missing, Looked.

| Sport | Process look | Source family |
|---|---|---|
| NFL | play-by-play EPA, success rate, CPOE, xpass, series conversion, snap/route/target, pressure | nflverse / nflfastR nightly + in-week; ESPN as fallback box |
| NCAAF | EPA/SP+-style, explosiveness, success, returning production | cfbfastR / sportsdataverse + ESPN + published SP+/FPI when posted |
| NBA | pbp possessions, usage, on/off, four factors, lineup net, tracking shot quality when posted | stats.nba.com / sportsdataverse + ESPN |
| NCAAB | tempo-free (eFG, TO%, ORB%, FT rate), tempo, experience, KenPom/Barttorvik when posted | sportsdataverse + ESPN |
| MLB | Statcast EV/LA/barrel/whiff/chase, pitch mix, Savant BvP, order spot | Baseball Savant + MLB Stats API + ESPN |
| NHL | 5v5 xG, GSAx, Fenwick, shift/line, goalie confirmed | MoneyPuck / NST / NHL API + ESPN |
| All | injuries, probable, goalie, starter, lineup | ESPN summary + league status feeds |
| All | weather / roof / wind / precip / temp | ESPN + forecast grid (NWS / Open-Meteo) labeled |
| All | rest, travel, timezone, altitude | live schedule log |
| All | crowd tape | Action Network tickets/handle, Kalshi, Polymarket |

Host rule for ESPN remains: `site.web.api.espn.com`. `Number(object)` is still banned. Always `parseEspnScore`.

### 3.3 Tape / crowd

Unchanged reconstruction law from `tape.ts`. Handle split ≥ 7 points is a sharp tell, never auto-followed. ESPN win% is not handle.

---

## 4. Latent game state `G`

Function: `buildLatents`. Hidden vector, not a single probability.

| Key | Meaning |
|---|---|
| `muH`, `muA` | expected home / away score (or goals/runs) |
| `pace` | possessions / plays / PA per game |
| `sigM`, `sigT` | margin and total σ |
| `style` | pass rate, ground-ball rate, 3-rate, shot-share, etc. |
| `pWinH` | P(home wins the graded market — 2-way including OT unless 3-way) |
| `pRegH`, `pOT`, `pSO` | NHL / NCAAB-OT split when the ticket needs it |
| `chaos` | extra variance from high total, backup QB/goalie, weather, live |

Construction:

1. Market family still posts a moneyline / spread / total look (§4.1 of the old spec, precision table unchanged).
2. Process family overwrites `mu` and `sig` when Ran (EPA, xG, KenPom, Statcast).
3. Context family (form, rest, weather, park, injuries-as-count) nudges logits and σ.
4. Usage vector `U` (§5) reallocates player means; team `mu` is the sum of player contributions plus noise, not an independent number. If they fight, team latent wins for sides/totals; player latent wins for that player’s tickets after a 30% pull toward the team residual.
5. Chaos: `clip((total − league) / (league · 4), 0, 0.22)` plus backup-QB +0.08, backup-goalie +0.06, wind≥20 mph +0.05, outdoor precip +0.03.

`pWinH` is the **sim share of home wins** when the simulator Ran, else the pooled logit. Both numbers are stored.

### 4.1 Process looks that must always be attempted

**NFL / NCAAF**

- Offensive and defensive EPA/play, success rate, explosive rate (old 10 last games + season 40/60).
- Passing EPA vs rush EPA. Backup QB is a discrete state: if starter out, swap in backup EPA prior (career / this year) and widen σ × 1.18.
- OL vs front as a rush-EPA / pressure residual when posted; else Looked.
- Red-zone TD rate separate from yards. Anytime-TD λ uses RZ + opportunity, not yards × constant.
- College: SP+ / FPI / explosiveness / returning production when posted. November last-3 is Thin.

**NBA / NCAAB**

- Four factors + tempo. Pace is possessions, not `total / 224`.
- Lineup net rating when the starting five is posted.
- Shot quality vs finishing for player points.
- College: KenPom/Barttorvik tempo-free when posted; experience and SOS. Transfer/portal Looked if the file is empty.

**MLB**

- wOBA-ish `OBP×0.9 + ISO×0.7` remains the cheap look.
- Statcast barrel / whiff / chase overwrite when Ran.
- Starter 61% + bullpen 39% run-rate mix; bullpen B2B ±0.08 logit on the game; pitcher K/9 × expected IP for K tickets.
- Order spot → expected PA (leadoff 4.4, middle 4.15, bottom 3.6, bench 1.8) then × platoon and pitcher.

**NHL**

- 5v5 xG for / against. Goalie GSAx. Confirmed starter vs backup is a discrete state (backup ×0.88 team win logit bump to the opponent, σ × 1.12).
- Special-teams xG as a separate slice for first-goal and period tickets.
- Puck line is **not** a win proxy. Same law as MLB run line.

### 4.2 Context family (always attempted)

Keep the old stamps and precisions: form, margin, trend, h2h, venue-split, series, injuries-count, rest, weather, park.

Weather law, sharpened:

- Indoor (NBA / NHL / NCAAB / dome): no ML lean from weather. Totals / air-game props still Looked-thin with the reading printed.
- **MLB:** weather moves totals, HR, and Ks. We still **do not flip an ML on wind**.
- **NFL / NCAAF:** wind is a **passing-EPA and total** modifier, not a +0.02 ML party trick.
  - wind 12–19: pass mean ×0.96, rush ×1.03, total −1.0.
  - wind ≥ 20: pass ×0.88, rush ×1.08, total −2.5, deep-TD λ ×0.70.
  - temp ≤ 32°F: +0.04 home logit (travel + crowd), rush + small.
  - precip ≥ 40%: pass ×0.94, fumble chaos +0.03 σ.
  - ≥ 95°F: −0.015 home logit.

Park law: MLB event-specific factors when the table exists (HR, 1B, K). Fallback remains the run-factor list from `2026.09.08-live`.

Injury **count** layer stays (precision light). The real work is §5.

---

## 5. Lineup / usage vector `U` (every player ticket, and every game ticket)

Function: `buildUsage`.

This is the layer the old desk faked with `outs · 0.038`.

1. Start with each player’s season + last-10 opportunity: snap %, route %, target share, rush share, USG%, ice time, batting order, line/pair.
2. Apply confirmed lineup. Out / IL / doubtful / suspended → opportunity 0, **stand down that player’s tickets**.
3. Transmit leftover opportunity to remaining players with a **depth chart kernel**:
   - NBA: extra USG and minutes go first to the same-position rotation, then to the usage magnet (star). Starter out → bench minutes +6 to +12 prior, clipped by that player’s career minutes ceiling.
   - NFL: WR1 out → WR2/slot target share +0.08 / +0.05 prior; TE/RB dump +0.03. RB1 out → RB2 rush share inherits 0.70 of the lost share, committee the rest. QB out → whole pass-tree rebuilds.
   - MLB: scratch in the order → everyone below moves up one PA slot.
   - NHL: line mate out → that line’s remaining ice time is not 1-for-1; 2nd line bumps.
4. Questionable / game-time decision: run **two** usage vectors (in / out) and mix `0.55 in + 0.45 out` unless the desk has a more specific participation look. Tickets on that player itself stay Thin and cannot be The Call.
5. College player usage runs **only** to move `G` (pace, mu, style). No college player ticket is emitted in Florida.

Precision: **5.8** when the starting lineup / batting order / goalie is confirmed; **2.4** projected; **0.9** Looked.

---

## 6. Player tickets

Function: `buildPropChance`. Hidden number: **P(over)** or **P(yes)**. Photographed side maps to chance-to-hit.

Always-pushed looks (old 6.1) still run: market 14, last10, total/pace, script, weather, park, rest, defense-allowed, usage, pitcher, underlying, platoon.

Additions that always run:

- **Opportunity (`U`)** — §5. Precision 5.8 / 2.4.
- **Matchup process** — Statcast BvP, EPA vs position, 5v5 xG vs line, shot-quality vs defender. Precision 3.6 Ran / 1.4 Thin.
- **Script v2** — from sim win distribution, not a point `P(home)`:
  - pass/rec yards rise when the team’s path-share of trailing states is high;
  - rush yards rise when leading-state share is high;
  - anytime TD uses RZ trip distribution from the same paths.
- **Alt lines** — priced from the sim CDF, not by sliding one σ. Quality haircut `−0.04` per σ of alt distance beyond 1.0.
- **Combos** (PRA, HRR, rush+rec): sum the path-wise components. Do not add independent Poissons.

Florida college player = `illegal_fl` stand-down immediately.

Listed-out / IL / doubtful-and-ruled-out / suspended = omit cells.

Sheet λ models from `2026.09.08-live` §6.3 remain the **closed-form prior** inside each path. Process looks overwrite λ when Ran.

---

## 7. Live state machine `S`

Pre-tip `S` is empty. The moment the league clock / first pitch / puck drop is official, every open ticket on that event is tagged `in_play` and re-priced from `S`.

### 7.1 State vector

| Sport | `S` |
|---|---|
| NFL / NCAAF | score, QTR, clock, down, distance, yard line, possession, timeouts, score phase, injuries since kickoff, weather now |
| NBA / NCAAB | score, QTR/half, clock, possession, bonus, foul trouble (4/5/6), timeouts, on-court lineup if posted |
| MLB | inning, half, outs, bases, score, pitcher pitch count, rest of lineup due up, bullpen already burned |
| NHL | score, period, clock, strength (5v5/PP/PK), goalie in net, empty-net flag |

Source: ESPN summary / league gamefeed. Empty field = Looked and the live ticket **cannot** be ribbon / The Call. Microbets with a missing critical field (down, outs, strength) **stand down**.

### 7.2 Conditioning

```
paths ← paths that are statistically consistent with S
     or, cheaper and default: restart the remaining-game generator from S
P_live = mean(remaining paths hit the proposition)
```

Remaining-stat props (QB passing yards live, pitcher Ks live, points already scored):

```
remaining_mean = E[final | S] − already
P(over line) = P(already + remaining > line | S)
```

A player who has 62 rushing yards at 1:12 Q4 with the team kneeling is not a 72-yard prior.

### 7.3 Live quality

- Base live multiplier **0.52** remains the floor for ranking quality.
- If `S` is complete and process pbp on this game has Ran for ≥ 8 minutes (NBA), 3 drives (NFL), 3 innings (MLB), or 8 minutes (NHL): quality `max(0.52, 0.52 + 0.20 · completeness)`.
- Still never The Call. Still never a ribbon parlay leg.

No generated 1st-inning sheet cells after first pitch. Posted live rows still rank on Live.

---

## 8. Ticket registry — every Hard Rock Florida family

If Hard Rock posts a market the registry does not know: stamp `unknown_market`, **stand down**, log the raw name. Do not silently price it as a cousin.

`infoQuality` is the ranking quality. The Call floor stays **0.72**. Live multiplies after the table.

| Family | How it is priced | Quality |
|---|---|---|
| Full-game moneyline (2-way) | sim win share | **1.00** |
| NHL 3-way regulation | sim regulation share | 0.90 |
| Spread / run line / puck line | sim margin vs line | 0.94 ± key-number tilt |
| Alternate spread | sim margin tail | 0.86 − 0.04 per extra σ |
| Game total | sim total vs line | 0.86 |
| Alternate total | sim total tail | 0.80 − 0.04 per extra σ |
| Team total | sim team score | 0.70 |
| Counting player prop | sim player stat | 0.80 |
| Alt player prop | sim tail | 0.72 − 0.04 per extra σ |
| Anytime / 2+ / HR / SB / goal | sim counting process | 0.68 |
| First / last scorer | order statistic on scoring paths | 0.58 |
| Next scorer (live) | order statistic from `S` | 0.50 × live |
| Race-to-X / first basket | opening-possession model + sim | 0.55 |
| Odd/even, highest quarter | sim path functional | 0.48 |
| Correct / exact score | sim mass on that cell | 0.40 |
| OT yes/no | sim OT flag | 0.62 |
| F5 / first 3 / first 7 | sim truncated innings | 0.64 |
| Quarter / half / period winner | sim slice + shrink | 0.50–0.58 |
| Period total / period team total | sim slice | 0.46–0.58 |
| 1st-inning 0.5 | sim first inning | **0.36** |
| Current drive / next play / next pitch | micro generator from `S` | 0.34 × live |
| Teaser | sim margin vs teaser chart (3 and 7 physics in NFL/NCAAF) | 0.60 |
| Boost | underlying quality, juice flagged | underlying |
| Future / championship / season prop | season-sim or market-only blend | 0.58 |
| Same-game parlay | joint sim of legs | 0.62 |
| SGP Max / cross-game | joint sim; independent across games after shared weather/public residual | 0.55 / 0.40 |
| Flex / consolation / round robin | price each included combo, show the set | combo quality |
| Floor | — | 0.28 |
| In-play multiplier | applied after the row | × **0.52** (see §7.3) |

**NFL/NCAAF key numbers 3 and 7** stay as ranking tilt **and** now sit inside the sim: extra mass on margins of 3 and 7 via a discrete spike of 4.5% of path weight split across {3, −3, 7, −7} when both teams are NFL/FBS. Do not fake cover% another way.

Period shrink from the old table is the **closed-form look** that still goes into the pool. The sim slice is the primary when it Ran.

---

## 9. Parlays

### 9.1 Joint probability

Default: **the legs ride the same paths**.

```
raw = mean( all legs hit on path i )
```

Cross-game: paths are independent **except** a shared residual `ρ` when the events share weather system, same-city back-to-back, or a slate-wide public blowout. Desk `ρ = 0.04` default, `0.10` if the same weather grid cell is Ran for both outdoor games. Else 0.

Fallback if a leg cannot be emitted from the path engine (Looked generative model): old haircut table, labeled Thin.

| Legs | Includes ML+spread | Haircut fallback |
|---|---|---|
| 2 | yes | **0.55** |
| 3+ | yes | **0.42** |
| 2 | no | 0.88 |
| 3 | no | 0.75 |
| 4 | no | 0.62 |
| 5–8 | no | 0.50 |
| 9+ | no | 0.38 |

Same-game ML+spread must use the sim, not the haircut, whenever both legs are registered.

```
combined = min(0.97, raw)
```

### 9.2 Ribbon law (AI-picked, paramount)

Goal: **highest honest hit chance** among tickets the desk still trusts. Not lottery posters.

Must be all of:

- 2 or 3 legs. 4+ live on the Parlay tab only. Never the gold badge.
- No in-play legs.
- No college player legs.
- No player props on the **badge** (they still rank as singles and as custom legs). Ribbon is main-market: ML / spread / total / team total / F5.
- Each leg displayed chance ≥ **56%** (2-leg) or ≥ **60%** (3-leg).
- Each leg `infoQuality ≥ 0.72`.
- Combined displayed ≥ **38%** (2-leg) or ≥ **28%** (3-leg).
- Combined decimal payout ≥ 1.45.
- Score > −90.

Sort ribbon by `combinedFair` desc, then `parlayScore`, then id. This is the high-percentage guide.

Propose up to **6** ribbon slips. Cap 1 slip per event on the badge.

### 9.3 Custom builder (user freedom)

Any legal Florida combination the registry knows. The page prints, live, per added leg:

- leg fair, HR implied, edge
- running joint fair and running decimal
- correlation flag: `shared-latent` / `near-independent` / `fallback-haircut`
- stand-down the whole slip if any leg is `illegal_fl`, `unknown_market`, or live-micro with incomplete `S`

Catalog floors (not badge): 2-leg 48%, 3-leg 50%, 4-leg 48% per leg before haircut.

### 9.4 Score

```
parlayScore = combinedFair^1.6 · ln(1 + profit) · 8 + combinedFair · 2.4
```

The exponent on fair is higher than `2026.09.08-live` on purpose: hittable 2-legs beat 17-leg posters.

Then × `infoQuality` (0.70 / 0.55 / 0.40 / 0.62 for 2 / 3 / 4 / SGP).

Typical parlay juice flag only: 12% (2) / 25% (3) / 32% (4) / 40% (5+). EV < −8% → titled “fun money.”

### 9.5 Teasers / flex / round robins / SGP Max

- Teaser: shift each NFL/NCAAF spread by the chart (6 / 6.5 / 7) and re-score the **same paths**. Key-number crossings are the whole point.
- Flex / consolation: print P(all), P(n−1), P(n−2) from the same paths; do not fake with binomial independence.
- Round robin: expand to the combo set, cap display at 12 combos, link the rest.
- SGP Max: same-game blocks use joint sim; blocks multiply with the tiny cross-game ρ.

---

## 10. Ranking, calibration, The Call, mood

### 10.1 Calibrated displayed chance

```
implied = implied(Hard Rock FL two-way)   # photo or hardrockbet_fl
displayed = implied + (fair − implied) · (0.35 + 0.65 · quality)
```

No Florida implied: `0.5 + (fair − 0.5) · (0.4 + 0.6 · quality)`.

Clip at 99%.

### 10.2 Edge

```
edge = fair − implied(Hard Rock FL)
```

If only a public two-way exists, print **Research edge** and refuse to title it a Florida fill.

### 10.3 `deskScore` / `ticketScore`

Unchanged algebra from `2026.09.08-live`, including the big-favorite haircut so −400 at 80% loses to −110 at 58%, and the tape bump (sharp +0.055, public −0.035).

```
ticketScore = deskScore · quality + clip(edge · 1.15, −0.07, +0.14)
```

Tie-break: score, then chance, then id. No free dice.

### 10.4 Confidence badge

- **High:** quality ≥ 0.88, chance ≥ 0.52, edge ≥ −2.5 pts, sim and pool agree within 4 pts.
- **Medium:** quality ≥ 0.68, chance ≥ 0.48.
- **Low:** otherwise.

### 10.5 The Call (gold badge)

Must be **all** of: a single; not in-play; decimal payout ≥ 1.55; displayed chance in **[50%, 76%]**; `infoQuality ≥ 0.72`; process **Ran** (Looked, including a missing stamp, cannot wear the badge); score > −90; registry family is not a period slice, exact score, first-scorer, micro, future, or teaser; desk displayed % is not more than 1 pt under the book unless edge is positive.

If nothing qualifies, **show no Call**. There is no 0.64 fallback. A Looked process + quality-cap 0.64 + edge −2 ticket (example: Alvarez over 2.5) sits down.

### 10.6 Mood

Does **not** rewrite chance.

- **Safest (Chill)** — highest chance, then score, then id. Default for users who said they want to hit.
- **Best value (Skill)** — `ticketScore`.
- **Pays more (Thrill)** — biggest payout among tickets with quality ≥ 0.64 and chance ≥ 0.48.

Ribbon parlays always sort as Safest on the badge, even if the singles desk is in Skill.

### 10.7 Catalog caps

Popular 8 · Player 8 · Periods 6 · SGP 6 · 2-leg 6 · 3-leg 6 · 4-leg 4 · Live 8.  
Per-event cap: **1 period**, **2** otherwise, then fill.  
Horizon: today ET or in-play or next 36 hours (and games that started in the last 4 hours).

### 10.8 Legal / stand-down gates

- In-play → `in_play`. Ranks on Live only.
- DK/FD sportsbook venue as the fill → `illegal_fl`.
- College player prop → `illegal_fl`.
- Unknown registry name → `unknown_market`.
- Live micro with incomplete `S` → stand down.
- Fair or better vs Hard Rock two-way (EV ≥ 0) → `fair_or_better`.
- Main market, EV ≥ −3% → `close_enough`.
- Else juiced / missing two-way → stand down on the **scan** tag. AI Picks may still rank the research look; the ticket page says photograph Hard Rock (or wait for `hardrockbet_fl`).
- One-sided market with no model hold → cannot call a fair two-way. Stand down on that scan row.
- Seed bankroll `< $100`: still **names** a ticket. `liveFits` is false until bankroll ≥ $100 and unit ≥ $1. Naming is not placing.

**Failure-mode law (the one rule):**

| Situation | Action |
|---|---|
| Illegal in Florida | stand down |
| Unknown market | stand down |
| Live micro, critical `S` missing | stand down |
| Player listed out | omit |
| Optional look empty | Looked, keep going |
| Small sample | Thin, keep going |
| Generative model empty, closed form exists | use closed form, quality cap 0.64 |
| Both generative and closed form empty | Looked 50/50, quality floor 0.28, never badge |

---

## 11. Futures

Season-sim when the slate of remaining games is loadable: replay each remaining game with week-updated `G` (injuries persist, variance widens as week count drops). Else market-only: Hard Rock future no-vig if two-way / field can be rebuilt; else Looked.

Quality 0.58. Never The Call. Never a ribbon leg.

---

## 12. Official rule list (ticket page stamps)

Same list every time. `rules.ts` `ALGORITHM_RULES`. Stamp via `ruleStamp`.

1. **Hard Rock Florida is the fill** — photographed ticket or Ran `hardrockbet_fl`. Public books and prediction markets are research. Layers: market, book, open, spread, hr-fl.
2. **Latent game, not one number** — win, pace, variance, style. Sides and totals are not transforms of each other. Layers: latent, efficiency, pythag, espn.
3. **Seeded paths** — every registered ticket on an event rides the same paths. Alts, first-scorer, parlays, live remaining. Layers: sim.
4. **Last 10 — every stat, not just W-L** — EWMA. Periods inherit then shrink. Layers: form, margin, trend, last10, season-rate.
5. **Lineup transmission** — scratches move usage, order, ice time. Count-of-bodies is the light backup. Layers: usage, injuries.
6. **Process looks** — EPA / four factors / Statcast / xG / tempo-free. Empty = Looked. Layers: process, underlying, defense, platoon, pitcher.
7. **Head-to-head and venue** — last-10 meetings → vs-opp → series; last-10 home vs road. Layers: h2h, venue-split, series.
8. **Open → close and tape** — steam with the handle is informed money, still not a lock. Never copy 80% of tickets. Layers: steam, open, tickets, handle.
9. **Kalshi + Polymarket** — a different crowd. Research only. Layers: kalshi, polymarket.
10. **Rest / B2B / bye / travel** — NBA/NHL B2B hurts. NFL bye vs short week. MLB extra rest is small except bullpen B2B. Layers: rest.
11. **Weather and park** — wind/rain/heat move totals and the air game more than moneylines. We do not flip a baseball ML on wind. Coors is not Petco. Layers: weather, park, total.
12. **Live is a state machine** — score, clock, downs, outs, strength. Remaining props use leftover mean. Quality floor. Never The Call. Layers: live-state.
13. **Period markets are noisier** — sim slice + shrink toward 50/50. Quality floor 0.72 so they cannot be The Call.
14. **Parlays are joint paths** — same-game correlation is simulated. Cross-game is almost independent. Ribbon maximizes hit chance, not poster odds.
15. **Calibrate thin markets** — displayed chance is pulled toward Hard Rock when info-quality is low.
16. **Edge vs Florida juice** — rank `chance² × √payout × quality + edge`. 58% at −110 beats 80% at −400.
17. **CLV + calibration loop** — layers that lose CLV get quieter. Miscalibrated badges get pulled toward the book.
18. **Florida law** — college player bets blocked. No scraping Hard Rock. Photograph when the tape is missing or boosted. This site never places a bet.

Rules with no layer id stamp **Ran** whenever that ticket type is shown.

---

## 13. Determinism

- No unseeded `Math.random` in `src/lib/market`.
- Pure functions: same snapshot + same `DESK_VERSION` → same latents, same paths, same chance, same `ticketScore`, same hero id, same ribbon.
- Sort: score, then chance, then `id`.
- `DESK_VERSION` `2026.09.09-world`. Bump when a ranking rule changes.
- Fingerprint: `id | chance(6 dp) | score(6 dp) | bucket | seed`.
- Tests pin: same 10 scores → identical `FormRead`; empty feed → Looked not skip; same snapshot → identical path hash; leftover four layers exist on game and prop reports; college player ticket → `illegal_fl`; unknown market → stand down; live without downs/outs/strength → micro stand-down.

---

## 14. What is never done

- Never invent a missing split, EPA, xG, Statcast, minutes, last-10, or handle %.
- Never print NO LOOK. Empty = Looked.
- Never scrape Hard Rock or invent its order book.
- Never treat ESPN `lastFiveGames` as analysis.
- Never treat last-10 **hit rate** (8/10 cashed) as a lock.
- Never auto-copy 80% public.
- Never flip a baseball moneyline on wind.
- Never add home-field twice on top of a home/road split.
- Never use own points-per-game as “defense.”
- Never emit a Florida college player ticket.
- Never let a period 0.5, a live ticket, a future, a teaser, an exact score, or a 4-leg be The Call.
- Never treat a boost as edge.
- Never place a bet. Never call a lock. Never print 100%.

---

## 15. Source map (audit)

| Claim | Where it should run | Published / desk |
|---|---|---|
| Logit pool + overdispersion + JS pull | `chance.ts` `poolLayers` | published method; 1.35 / λ desk |
| Seeded PCG64 paths | `sim.ts` `drawPaths` | desk; determinism law |
| Abramowitz Φ | `chance.ts` `normalCdf` | A&S 7.1.26 |
| log5 / Pythagorean | `chance.ts` | James / Oliver / FO |
| EWMA λ=0.82, 60/40 | `form.ts`, `props.ts` | StatPair / AgentBets; λ desk |
| Hard Rock FL tape | `tape.ts` `hrFl` | The Odds API `hardrockbet_fl` |
| Photograph overrides feed | `lock.ts` | user law |
| NFL EPA / CPOE / xpass | `process.nfl.ts` | nflverse / nflfastR |
| College SP+ / tempo-free | `process.cfb.ts`, `process.cbb.ts` | cfbfastR / KenPom-family when posted |
| NBA four factors / usage | `process.nba.ts` | stats.nba / sportsdataverse |
| Statcast / Savant | `process.mlb.ts` | Baseball Savant |
| NHL xG / GSAx | `process.nhl.ts` | MoneyPuck / NST / NHL API |
| Usage transmission | `usage.ts` | desk kernel |
| Live state machine | `live.ts` | desk |
| Key numbers 3 and 7 | `sim.ts` + `picks.ts` | Dimers / CLV / NFL physics |
| Joint parlay paths | `parlays.ts` | desk; haircut is fallback |
| Calibrate toward Florida tape | `picks.ts` `calibratedChance` | Olympus / CLV thin-market |
| CLV precision loop | `calibrate.ts` | desk |
| Florida college-prop block | `props.ts`, `engine.ts`, `universe.ts` | Florida compact / Hard Rock Bet |
| Always-push empty layers | `chance.ts` / `props.ts` `pushEmpty` | user law |
| Rule stamps Ran / Thin / Looked | `rules.ts` `ruleStamp` | user law |

Companion: `SPORTS_LOCK_BLUEPRINT.md`. User prompts in chat override both when they conflict. Append a dated note when a ranking rule changes, and bump `DESK_VERSION`.

---

*Picking with Intelligence Creates Confidence.*  
Not a lock. Photograph Hard Rock to lock the live number when the Florida tape is missing. This site never places a bet. 1-800-GAMBLER.
