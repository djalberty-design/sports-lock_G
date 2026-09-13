# Sports Lock — Official Algorithm Specification

**Desk pin:** `DESK_VERSION` `2026.09.08-live`  
**Status:** living law. Same inputs → same ranking. No dice.  
**This is research.** The site never places a bet. It never calls a lock. Photograph Hard Rock to lock a live number. 21+ / 1-800-GAMBLER.

This document is the official list of **every rule** that goes into **every prediction** for **every ticket type**. Numbers, weights, and formulas below are copied from the running desk (`src/lib/market/*`). Where a constant is a **desk choice**, it is labeled that. Where a method is **published**, the source is named. Nothing here is invented at prediction time.

---

## How to read this

- **Look** = one noisy observation of the same hidden number (chance the ticket hits).
- **Precision** = how much that look is trusted in the pool (higher = louder). Desk constants, not a published variance.
- **Ran / Thin / Looked** = what the ticket page stamps. Every rule looks up live data every time.
  - **Ran** — live lookup returned a real number.
  - **Thin** — live lookup, small sample. Light weight.
  - **Looked** — we fetched; feed empty. Layer is 50/50 with tiny precision. Not a skip. Not a guess. Never **NO LOOK**.
- **Prior** = the sportsbook two-way no-vig close. Everything else is a reason to move off it, or not.
- Displayed chance is clipped at **99%**. Never 100%. Never “lock.” Never “guarantee.”

---

## 0. What a prediction is

For any ticket, the desk estimates **P(this ticket hits)** then ranks by chance × payout × market quality × edge vs the juice.

Ticket types that walk this spec:

- **Popular** — moneyline, spread (incl. run line / puck line), game total, team total.
- **Player tickets** — legal NFL / NBA / MLB / NHL player props. College athlete props are blocked (Florida).
- **Period tickets** — 1st inning, F5, inning halves, quarter, half, NHL period. Inherit the game ensemble, then shrink.
- **Live / in-play** — same looks, then quality × 0.52. Never The Call.
- **Same-game parlays** — product of legs × correlation haircut.
- **Cross-game 2 / 3 / 4-leg parlays** — independent product. 4-legs are catalog only — never the gold badge.

Pipeline, in order:

1. Pull live delayed numbers (ESPN + Action Network + Kalshi + Polymarket).
2. Build **game chance** `P(home wins)` from the ensemble (§4).
3. Price **spreads / totals / periods / props** from that chance plus last-10 of the relevant stat (§5–7).
4. **Calibrate** displayed % toward the book when the market is noisy (§8).
5. **Rank** with `ticketScore` (§8). Mood can re-sort, not rewrite the math.
6. Stamp **Rules the desk ran**. Same board in → same ranking out.

---

## 1. Honesty that never moves

- Never print “lock”, “guarantee”, or 100%. Clip displayed chance at 99%.
- Delayed public numbers. A quote is not the fill. Photograph Hard Rock to lock.
- This site never places a bet. Paper log is a tracker, not a book.
- Florida: college **player** props illegal on Hard Rock Bet — blocked.
- DraftKings / FanDuel **sportsbooks** are not licensed live Florida tickets. DK **Fantasy** is a different product.
- Do not invent Hard Rock’s order book. Label every tape source.
- Do not invent a missing ESPN split, ERA, minutes, or last-10 score. Empty = Looked (50/50).
- Kalshi and Polymarket are **research**, never a Florida fill.
- ESPN win% is a **model**, not book handle. Never shown as bets-vs-money.
- Ticket count vs handle is a layer. Never copy-traded. Never auto-fade/tail the public.
- 21+ Hard Rock Bet / 18+ fantasy. 1-800-GAMBLER.

---

## 2. Math the whole desk shares

These are the primitives. Every later rule uses them.

### 2.1 Log-odds pool

- Work in **logit**: `logit(p) = ln(p / (1 − p))`, with `p` clipped to `[0.015, 0.985]`.
- Inverse: `invLogit(z) = 1 / (1 + e^(−z))`, then clip.
- Layer clips: `[0.12, 0.88]`. Final game chance clips: `[0.14, 0.86]`.
- Pool: precision-weighted mean of logits.

```
z = Σ logit(p_i) · precision_i  /  Σ precision_i
P = invLogit(z)
```

**Source:** standard Bayesian / precision-weighted pooling of Bernoulli observations. Desk implementation: `chance.ts` `poolLayers`.

### 2.2 Overdispersion shrink (when looks fight)

- Residual χ²: `chi = Σ precision_i · (logit(p_i) − z)²`
- `df = n − 1`. Overdispersed if `chi / df > 1.35`.
- If overdispersed: **keep market-family precision**. Scale every non-market precision by `max(0.35, 1.35 / (chi/df))`.
- Extra James–Stein pull toward the sportsbook:

```
λ = min(0.55, 0.18 + 0.5 · max(0, 1 − max(0, 1 − std/0.14)))
z ← λ · logit(market) + (1 − λ) · z
```

**Source:** χ² overdispersion is textbook; James–Stein shrinkage toward a strong prior (the liquid close). Thresholds **1.35 / 0.35 / 0.55** are desk constants. Experts in-file: liquid books are hard to beat (desk law); Olympus / CLV desks — do not trust the model tail when sources fight.

### 2.3 Normal CDF

- `Φ(z)` via **Abramowitz & Stegun 7.1.26** (error ~1e-5). No extra library.
- Spread → win: `P(home wins) = Φ(−spread / σ_margin)`.
- Cover: `P(home covers line) = Φ((expectedHomeMargin + homeLine) / σ_margin)`.
- Over: `P(total > line) = 1 − Φ((line − mean) / σ_total)`.

### 2.4 Poisson for rare counts

- `P(count > line)` on a .5 line = `1 − F_Poisson(floor(line); λ)`.
- Used for hits, Ks, receptions, walks, and other low-mean counting stats.
- **Yards / points / PRA** use a **normal**, not Poisson (Poisson understates the tails).

**Source:** DMP Learn 2026 — Poisson for rare counts, normal for yards/points. Desk sigmas in §6.

### 2.5 Bill James log5

```
P(A beats B) = a(1−b) / [a(1−b) + b(1−a)]
```

WP clipped to `[0.15, 0.85]` before log5.

**Source:** Bill James, *1981 Baseball Abstract* (log5). Used on records, Pythagorean WPs, last-10 WPs, H2H OPS, venue OPS.

### 2.6 Pythagorean expectation

```
WP = PF^exp / (PF^exp + PA^exp)
```

| Sport | Exponent | Lineage |
|---|---|---|
| MLB | 1.83 | James / Davenport “Pythagenpat” baseball |
| NBA | 13.91 | Dean Oliver, *Basketball on Paper* |
| NCAAB | 10.25 | college basketball Pythagorean (KenPom-family scale) |
| NHL | 2.07 | hockey Pythagorean |
| NFL / other | 2.37 | Football Outsiders / James football default |

### 2.7 Recency EWMA (last 10, every stat)

- Window: last **10** completed games (index 0 = latest).
- Weights: `w_i ∝ λ^i`, `λ = 0.82`, then normalize so `Σ w = 1`.
- Latest game ≈ 18.7% of the mean; 10th game ≈ 2.8%.
- Blend with season when both exist: **60% last-10 EWMA / 40% season**.

**Why last-10, not last-3 or last-15**

- StatPair: 10-match rule ~72% vs season ~54%; last-3 too noisy, last-15 diluted.
- Betmana: do not overweight last 2–3; books already shade recency.
- AgentBets: EWMA > flat SMA.
- StatsBench: last-10 **hit rate** (8/10 cashed) is a trap — blend, don’t treat it as a lock.
- Desk: form precision is **light** (2.1–2.8) because books already price hot streaks.

### 2.8 Home-field logits (added when the split is season W-L, not already a home/road split)

| Sport | logit bump | ≈ extra win% at 50/50 |
|---|---|---|
| MLB | 0.12 | ~3.0 pts |
| NFL | 0.16 | ~4.0 pts |
| NBA | 0.20 | ~5.0 pts |
| NHL / NCAAF / NCAAB | 0.22 | ~5.5 pts |
| other | 0.14 | ~3.5 pts |

Desk constants, in the published HFA range (MLB ~54%, NFL ~57%, NBA ~60%). **Home/road record splits already include HFA — we do not add it twice.**

### 2.9 Sport scoring constants

| Sport | League total | Margin σ | Total σ |
|---|---|---|---|
| NFL | 44.5 | 13.45 | 10.2 |
| NCAAF | 54 | 16.2 | 13.5 |
| NBA | 224 | 12.0 | 11.5 |
| NCAAB | 145 | 11.5 | 10.8 |
| MLB | 8.6 | 3.05 | 2.85 |
| NHL | 6.1 | 1.85 | 1.65 |
| default | 45 | 13.0 | 10 |

**Source:** NFL margin σ ~13–14 is the Harville/Stern / spread-to-moneyline literature. League totals are typical season means, used as a **pace prior**, not a made-up score.

---

## 3. Live data — every rule, every time

Host is **`site.web.api.espn.com`**. `site.api.espn.com` **403s** team schedule and statistics — that 403 is why H2H / home-road used to print **NO LOOK**. We do not invent the missing file.

ESPN scores may arrive as a number, a string, or `{ value, displayValue }`. Always `parseEspnScore`. `Number(object)` is NaN and collapses last-10 to a W-L sticker. That bug is closed.

| Look | Live source | Cache |
|---|---|---|
| Last-10 team scores | ESPN `/teams/{id}/schedule` — full season log, take 10 | per fetch |
| Team statistics (OPS, ERA, vs L/R, home/away, last-7, opp OPS, pts allowed) | ESPN `/teams/{id}/statistics` | ~8 min |
| Probable pitcher + throwing hand | ESPN event `/summary` → `athlete.throws.abbreviation` | with summary |
| Player last-10 of a stat + minutes | ESPN athlete `/gamelog` (common v3) | per athlete |
| Injuries / IL / out | ESPN summary injury report | with summary |
| Weather / venue | ESPN summary | with summary |
| ESPN matchup model | ESPN pick center / FPI-style `espnHomeWin` | with summary |
| Two-way close / open | Delayed ESPN scoreboard (labeled delayed) | board refresh ~1 min |
| Ticket % / handle % | Action Network `ml_home_public` / `ml_home_money` | when posted |
| Handle fallback | Reconstruct from open→close if only ticket % exists | — |
| Kalshi | event-contract mid, volume, spread | research |
| Polymarket | on-chain moneyline share, volume | research |

**Empty feed rule:** push a layer at `p = 0.5`, `precision = 0.08`, `empty: true`, `thin: true`. Stamp = **Looked**. Never skip. Never invent.

---

## 4. Game ensemble — every layer

Function: `buildChance` in `chance.ts`. Hidden number: **P(home wins)**. Away = 1 − home. Every layer below is **always attempted**.

After pooling: if posted total is high vs league average, pull slightly toward a coin flip (`chaos = clip((total − avg) / (avg · 4), 0, 0.22)`). High-scoring games are noisier. Desk constant.

### 4.1 Market family (the prior)

- **Sportsbook no-vig close** (`market`)
  - Two-way American odds → implied → `p_home / (p_home + p_away)`. Hold stripped.
  - Precision **18**. Loudest look. “Liquid books are extremely hard to beat.”
  - Empty → Looked.
- **Opening line** (`open`)
  - Fires when `|open − close| > 0.012`.
  - Precision **5.5**.
  - Close toward home = often sharper money; close away = public or new info.
- **Posted book moneyline** (`book`)
  - Second sportsbook print from ESPN pick center, different timestamp.
  - Precision **4**. Only if it disagrees with the close by > 1.2 pts.
- **Spread-implied winner** (`spread`)
  - `Φ(−homeSpread / σ_margin)`.
  - Precision **7.5**, or **2.2** if it is within 3 pts of the moneyline (not a second opinion).
  - MLB run line (`|spread| ≤ 1.6`) is skipped — it is a different market, not a win proxy.
- **Steam / line move** (`steam`)
  - Fires when the number moved **with the handle**, not with ticket count.
  - Precision **2.6**. Informed money, still not a lock.
  - Else Looked.

### 4.2 Crowd family (research, not a Florida fill)

- **Kalshi** (`kalshi`)
  - Event-contract mid-price.
  - Base precision **8.5**, scaled by `log10(volume)` (cap 1.8×) and widened by bid-ask (`/ (1 + spread/0.06)`).
  - No volume → ×0.55.
- **Polymarket** (`polymarket`)
  - On-chain moneyline share. Base precision **7.5**, same volume scale.
- **Ticket count** (`tickets`)
  - % of **wagers** on home. This is the public.
  - Precision **1.6**. We never copy 80% of bets because the crowd is loud.
- **Handle** (`handle`)
  - % of **dollars** on home.
  - Precision `(steam ? 4.8 : 3.2) + min(2.2, |handle − tickets| · 8)`.
  - Split ≥ **7 points**: more money than tickets = **sharp tell**; more tickets than money = **public**. Use it. Do not auto-follow. Do not fade just to fade.

**Tape source order:** Action Network `ml_home_public` / `ml_home_money` → reconstruct handle from open→close → leave blank (Looked). ESPN win% is **not** handle.

Handle reconstruction (`tape.ts` `reconstructHandle`):

- Public tickets on a side + line moving the other way → money on the opposite side.
- `ticket ≥ 62%` and close dropped > 1.2 pts → handle pulled toward the other side.
- Else if `|move| ≥ 1.5 pts` → `handle = clip(ticket + move · 2.4)`.

### 4.3 Model family

- **ESPN matchup model** (`espn`)
  - Published FPI / SPI-style projection. Ratings, not tonight’s ticket.
  - Precision **6.2**.
- **Record model / home-road log5** (`log5`)
  - Parse `W-L(-T)`. Need `n ≥ 5`.
  - Prefer **home split vs road split**. Those already include HFA — do not add HFA twice.
  - Else season W-L + home-field logit.
  - Precision `3.6 · √(n / minN)`, `minN = 40` MLB / `8` others. Sample-size scaled.
- **Pythagorean** (`pythag`)
  - Season PF/PA → WP → log5 + **half** a home-field bump.
  - Precision **4.1**. Catches lucky / unlucky W-L.
- **Scoring margin / efficiency** (`efficiency`)
  - Expected home score = (home offense + away defense) / 2. Same for away.
  - Offense/defense = **60% last-10 scoring + 40% season** when last-10 exists.
  - Convert margin to P(win) via the sport scoring curve + 0.35 × HFA.
  - Precision **4.0** with last-10, **3.6** season-only.
  - **Source:** Dimers 2026 NFL model (form, power, efficiency, pace, venue, rest) — margin next to the moneyline, not instead of it.
- **Starting pitchers** (`pitcher`) — MLB only as a real look; other sports Looked.
  - ERA mix: **60% last-7** (ESPN statistics split) / **40% season**.
  - Blend starter 61% + bullpen 39% (bullpen ≈ season RA / games).
  - Pythagorean on those run rates + 0.7 × MLB HFA.
  - WHIP nudge: `+ (awayWhip − homeWhip) · 0.22` in logit.
  - Precision **7.4**.
- **Underlying, xG-style** (`underlying`)
  - Hitters: `OBP × 0.9 + ISO × 0.7` (wOBA-ish). Fallback `OPS × 0.48`.
  - Pitchers: logistic of z-scored ERA (center 4.20, sd 2.2), WHIP (1.32 / 0.28), opp OPS (0.72 / 0.12).
  - Prefer **last-7** splits, else season.
  - log5 on offense, plus 0.35 × log5 on pitcher quality.
  - Precision **3.2** last-7 / **2.6** season.
  - Process, not just runs that already scored.
- **Opponent-adjusted defense** (`defense`)
  - MLB: `(ERA/4.2)·0.5 + (oppOPS/0.72)·0.5`, last-7 when posted.
  - NFL/NBA: ESPN **points allowed** (last-7 / season). Own pts/G is **not** defense.
  - Fallback: last-10 points/runs **allowed** from the live score log.
  - Logit: `(awayDef − homeDef) · (MLB 0.18 else 0.08)`.
  - Precision **2.8** stats / **2.0** last-10 PA.
- **Pitcher vs batter / platoon** (`platoon`)
  - Tonight’s probable throwing hand (`L` / `R`) × team OPS vs LHP / vs RHP.
  - log5 on those OPS values (clipped).
  - Precision **2.2**.

### 4.4 Context family

- **Last 10 scores** (`form`) — recency-weighted WP via EWMA on actual W/L, plus printed `avgPf–avgPa`.
  - log5 of the two recency WPs (clipped 0.18–0.82) + 0.25 × HFA.
  - Precision **2.8** if either side has ≥ 8 games, else **2.1**.
  - Live ESPN log. Not ESPN’s canned `lastFiveGames` card. A 10-game streak is still mean-reverting.
- **Score-margin last 10** (`margin`)
  - EWMA of `pf − pa`. Convert to WP: `Φ(avgMargin / (σ_margin · √(1 + 1/n)))`.
  - Then log5 + 0.3 × HFA.
  - Precision **3.0** / **2.4**. One-run baseball luck and 3-score football blowouts both get a truer read than W-L.
- **Form trend** (`trend`) — **always ran**.
  - Split last-10 in half (recent 5 vs older 5). Need 6 games.
  - Rising if WP gap ≥ 0.20; falling if ≤ −0.20; else flat.
  - `±0.045` logit per side.
  - Precision **1.5** if a side actually moved, else **0.6** (thin).
  - Light on purpose — books already shade recency.
- **Head-to-head** (`h2h`) — always looked up, in this order:
  1. Live log meetings (last-10 first, then rest of season). Laplace: `(wp·n + 1) / (n + 2)`. Clip `[0.28, 0.72]`. Precision 1.8 / 1.3 / 0.9 by n ≥ 6 / 3 / 1. Thin if n < 3.
  2. Else season vs-opponent **OPS** split (live ESPN statistics). Precision 1.4.
  3. Else this series, Laplace `(wins + 1) / (n + 2)`. Thin. Precision `min(1.6, 0.5 n)`.
  4. Else Looked.
- **Home vs road** (`venue-split`) — always looked up, in this order:
  1. Last-10 (else season) home games vs opponent’s road games. log5 + 0.15 × HFA. Precision 1.6 / 1.0. Thin if n < 3.
  2. Else ESPN home OPS vs road OPS. Precision 1.3.
  3. Else record split. Precision 1.1. Thin.
  4. Else Looked.
- **This series** (`series`) — extra layer if series n ≥ 2. `(wins + 0.5) / (n + 1)`. Precision `min(2.2, 0.7 n)`.
- **Out / IL listings** (`injuries`) — **always ran**.
  - Count, not star-value. `diff = (awayOuts − homeOuts) + 0.35 · (awayQ − homeQ)`.
  - Logit clip `diff · 0.038` to ±0.22.
  - Precision `min(3.4, 1.1 + 0.35 · outs)` if anyone is listed, else **0.9** (thin: nobody listed is still a look).
  - A listed backup is not a listed ace.
- **Rest / B2B / bye** (`rest`)
  - Days since last game from the live log (0.15–21 days).
  - **NBA / NHL / NCAAB:** B2B (`< 1.15 d`) vs a team that rested: **±0.16 logit**. Extra rest (≥ 3 d vs < 1.6): **±0.05**.
  - **NFL / NCAAF:** bye (`≥ 13 d`) vs short week (`< 9`): **±0.08**. Short week (`≤ 4`) vs normal (`≥ 6`): **±0.05**.
  - **MLB:** `(homeDays − awayDays) · 0.02`, plus **bullpen B2B** ±0.08. Clip ±0.12. Extra rest after travel is tiny; a bullpen that worked last night is real (Dimers / FanGraphs-style fatigue).
  - Precision 3.2 (NBA/NHL/NCAAB) / 2.4 (NFL) / 1.3 (MLB) if the gap matters; else 0.7 thin.
- **Weather** (`weather`)
  - Indoor sports (NBA / NHL / NCAAB): no ML lean.
  - **MLB:** weather moves **totals**, not moneylines. We **do not flip an ML on wind**. Layer is Looked/thin with the reading printed.
  - **Football:** ≤ 32°F → +0.04 home logit (travel + crowd). Wind ≥ 20 or rain ≥ 55% → +0.02. ≥ 95°F → −0.015.
  - Precision **1.4** if a lean exists, else 0.7 / 0.08.
- **Ballpark** (`park`) — MLB.
  - Park factor from the table below. Extreme parks add chaos; pitcher parks slightly help the better starter.
  - `towardBetter = park < 1 ? +0.035 : park > 1 ? −0.02 : 0`.
  - Precision **1.15** if `|factor − 1| ≥ 0.04`, else 0.5 thin.

**MLB park run factors** (desk table, Coors-through-Oracle — published park-factor shape, not a made-up rank):

- Coors 1.15 · GABP 1.08 · Yankee Stadium 1.05 · Fenway 1.04 · Citizens Bank 1.04 · Globe Life 1.03 · Rate Field 1.03 · Camden / Wrigley / Truist / Rogers 1.02 · Chase / Progressive 1.01 · Minute Maid 0.98 · Busch / Angel 0.97 · Dodger / PNC / Kauffman / loanDepot 0.96 · Citi / Comerica 0.95 · Tropicana 0.94 · Petco / T-Mobile 0.92 · Oracle 0.90.

### 4.5 Confidence on the game report

- **High:** ≥ 6 layers, ≥ 3 families, std < 0.05, posterior variance < 0.012.
- **Medium:** ≥ 3 layers and std < 0.10.
- **Low:** otherwise.
- Agreement = `max(0, 1 − std / 0.14)`.
- Still not a lock: about `(1 − chance) × 100` in 100 the other side wins.

---

## 5. Last-10 on EVERY stat (not a W-L sticker)

| Ticket | What last-10 actually is |
|---|---|
| Games / totals | EWMA λ=0.82 of actual **pf / pa** from the live ESPN schedule. Plus margin and trend. |
| Periods | Inherit that game last-10 (totals blend 28% last-10 combined score), then shrink the period toward 50/50. |
| Player props | EWMA of **that stat** (hits, Ks, yards, points, …) from the athlete gamelog. **60% recent / 40% season**. |
| Sheet expected values | Same 60/40 mix inside every player cell. Game total mean = `0.72 · posted + 0.28 · last-10 combined`. |
| Live / in-play | Same analysis, then quality × 0.52. Never The Call. |

**Minutes / usage filter (player last-10):** take up to 15 dated games, drop any under **half this player’s median minutes**, keep 10. A DNP or blowout benching cannot fake a hot streak. If that would leave < 3 games, keep the raw 10.

**Trend:** recent half vs older half of the window. Light ±0.045 logit. Always ran.

---

## 6. Player tickets — every layer

Function: `buildPropChance` in `props.ts`. Hidden number: **P(over)** (or P(yes)). Photographed side is then mapped to chance-to-hit.

Florida: **college player bets return stand-down immediately.** Listed-out / IL / doubtful / suspended → stand-down.

### 6.1 Layers (always pushed)

- **Photographed book, no-vig** (`market`) — prior. Precision **14**. Player juice is heavier than sides; we strip what we can.
- **Last 10 of this stat** (`last10`)
  - Blend 60/40. Yards/points/PRA: normal CDF with desk σ. Else Poisson.
  - Precision **6.4** with a live gamelog, **4.4** season-only (thin), empty → Looked.
- **Game total / pace** (`total`) — `z = clip((postedTotal / leagueAvg − 1) · 1.35, ±0.18)`. Passing/points get full z; others ×0.7. Precision **4.2**.
- **Game script** (`script`) — team win chance.
  - Pass/rec yards: dogs throw, `(0.5 − win) · 0.22`.
  - Rush yards/attempts: favorites run, `(win − 0.5) · 0.28`.
  - Anytime / 2+ TD: `(win − 0.5) · 0.35`.
  - Points / PRA: `(win − 0.45) · 0.12`.
  - Precision **3.1**. Nudge, not a rewrite.
- **Weather** (`weather`) — wind ≥ 12 cuts the air game; rain ≥ 40% cuts pass/hits; heat ≥ 85°F helps HR/hits. Precision **3.4**.
- **Ballpark** (`park`) — hitting props only. Same park table. Precision **3.6**.
- **Rest / B2B** (`rest`) — restDays ≤ 1 → logit −0.04, precision **1.6**. Else Looked.
- **Opponent-adjusted defense** (`defense`)
  - Hitting: opposing ERA / OPS allowed.
  - Ks: opposing K/9 or ERA.
  - Pass / rush / rec yards: ESPN allowed yards.
  - Fallback: last-10 points allowed.
  - `z = clip((oppAllowed / leagueMark − 1) · 0.85, ±0.16)`. League mark: MLB 4.2, NBA 112, NFL 22.
  - Precision **3.2**. Else Looked.
- **Minutes / usage** (`usage`)
  - NBA / NCAAB: < 18 min → −0.10; < 24 → −0.04; ≥ 34 → +0.03.
  - Precision **2.4** if it moved, else **1.2** thin. Else Looked (sport has no minutes).
- **Starting pitcher / opposing ERA** (`pitcher`)
  - Hitting: `(ERA − 4.2) · 0.045`. Ks: `(4.2 − ERA) · 0.04`. Clip ±0.14 / ±0.12.
  - Precision **3.4**. Else Looked.
- **Underlying / process** (`underlying`)
  - OBP+ISO vs 0.38: `z = clip((u − 0.38) · 0.55, ±0.12)`. Precision **2.6**.
  - Else season vs last-10 of the stat (thin, precision 1.8) — do not treat 8/10 as a lock.
  - Else Looked.
- **Pitcher vs batter** (`platoon`)
  - Team OPS vs tonight’s L/R hand, center 0.720. `z = clip((ops − 0.72) · 0.7, ±0.12)`.
  - Precision **2.2**. Else Looked.

### 6.2 Counting vs yes/no

| Family | Model | Desk σ (normal) |
|---|---|---|
| Passing yards | Normal | 68 |
| Rushing yards | Normal | 32 |
| Receiving yards | Normal | 28 |
| Points | Normal | 7.4 |
| Rebounds | Normal | 3.4 |
| Assists | Normal | 2.6 |
| PRA | Normal | 9.2 |
| Hockey points | Normal | 0.95 |
| Hits, Ks, receptions, walks, RBI, runs, TB, HRR, shots, saves | Poisson | — |
| Anytime TD, 2+ TD, HR, stolen base, NHL goal | `1 − e^(−λ)` (rare-event yes) | — |

Sheet cells use the same idea: Poisson under mean 8, extra-Poisson normal (`σ = √λ · 1.18`) once the mean is large (`sheet.ts` `countOver`).

### 6.3 Sheet expected-value models (player cells)

Posted/photographed number is the prior when we have it. Otherwise the sheet builds a research λ, then prices over/under. College sports: **no player sheet**.

**MLB batter**

- PA: 4.15 starter / everyday, 3.4 otherwise.
- Hits: `avg · PA`, mix last-10 hits, × pace × park-hits × vs-pitcher × weather.
- HR: season HR/145 or `ISO · 0.72`, mix last-10, × park-HR × vs-pitcher × weather. Clip 0.03–0.55.
- Total bases: `SLG · PA`, mix last-10.
- Runs: `OBP · PA · 0.28 · (0.85 + 0.3 · teamWin) · pace · park`. Mix last-10.
- RBI: season / 140 or `hits · 0.65`, mix last-10.
- HRR = hits + runs + RBI.
- Walks: `(OBP − AVG) · PA · pace`.
- SB yes: season SB/145 (SS/CF/2B default 0.22 else 0.10).
- **Vs pitcher multiplier:** opposing ERA / 4.1 (clip 0.82–1.18) × platoon OPS / 0.72 (clip 0.86–1.16). Combined clip 0.78–1.22.

**MLB pitcher Ks:** K/9 from IP + K, expected IP `clip(5.8 − (ERA − 4)·0.28, 4.0, 6.6)`, λ = K/9 × IP / 9, mix last-10, × weather. Clip 2.5–11.

**NFL**

- Pass yards: per-game (17-game, cap 450, fallback 245 starter / 180). Script: trailing teams throw (`win < 0.45 → ×1.06`, `> 0.65 → ×0.96`). Mix last-10. Pace `0.55 + 0.45 · (total/44.5)`. Weather.
- Rush yards: fallback 72 starter RB / 28. Favorites run (`win > 0.58 → ×1.08`).
- Rec yards: WR 62 / TE 42 / 22. Dogs throw (`win < 0.45 → ×1.05`).
- Receptions ≈ rec yards / 12.
- Passing TDs: `1.7 · pace`.
- Anytime TD: RB `0.42 · (0.7 + 0.6 win) · pace` (clip 0.12–0.72); WR 0.30; TE 0.22; QB 0.18 · win.
- 2+ TD: anytime × 0.22.

**NBA** — mix last-10 of pts / reb / ast / threes; pts and PRA × pace (`total / 224`). Fallbacks: starter 18/5.5/3.8, bench 9/3/1.6.

**NHL** — SOG mix last-10 (fallback 2.9 / 1.6). Goals `per-game · (0.7 + 0.6 win) · pace`. Points ≈ goals × 1.7. Saves `base · (2 − pace)`. Blocked shots D ≈ 1.7.

**Listed out** on the ESPN report → that player’s cells are omitted (stand down).

---

## 7. Spreads, totals, periods (the sheet)

Function: `buildSheet` in `sheet.ts`. Full-game `P(home)` and posted total/spread are the prior. Last-10 combined score nudges totals.

### 7.1 Totals

```
mean = 0.72 · postedTotal + 0.28 · last10ExpectedCombined
P(over) = 1 − Φ((line − mean) / σ_total)
```

Last-10 expected combined: each side’s EWMA offense vs the other’s EWMA defense, then add.

Research juice on a sheet cell: hold **4.8%** (sides/totals), **7%** (props). Overwritten when a delayed ESPN number is posted. Photograph Hard Rock to lock.

### 7.2 Spreads

```
μ = −postedHomeSpread
P(home covers line) = Φ((μ + homeLine) / σ_margin)
```

NFL/CFB **key numbers 3 and 7** (Dimers / CLV desks treat those as physics) — applied at **ranking quality**, not by faking cover%:

- Favorite laying 2.5 / 6.5 (just inside): quality **+0.04**.
- Favorite laying 3.5 / 7.5 (just past): quality **−0.05**.
- Dog getting 3.5 / 7.5: quality **+0.04**.
- Dog getting 2.5 / 6.5: quality **−0.04**.

### 7.3 Team totals

Share of game total: `clip(0.5 + (teamWin − 0.5) · 0.28, 0.38, 0.62)`. Then the same over ladder.

### 7.4 Period shrink (one slice is not a moneyline)

Period winner: `P = 0.5 + (P_home − 0.5) · shrink`.

| Slice | Score share of game total | Winner shrink | Ranking `infoQuality` |
|---|---|---|---|
| 1st-inning 0.5 | 11.8% | 0.32 | **0.36** |
| Other inning total | 11.0% | — | 0.46 |
| 1st-inning winner | — | 0.32 | 0.46 |
| F5 winner | — | **0.72** | 0.64 |
| F5 total | 56% | — | 0.64 |
| 1st-inning half | 6.0% / 5.5% | — | 0.46 |
| NFL/CFB quarter | 22% | 0.28 | 0.50 |
| NFL/CFB half | 48% | 0.55 | 0.58 |
| NBA quarter | 25% | 0.26 | 0.50 |
| NBA half | 50% | 0.52 | 0.58 |
| NHL period | 33% | 0.34 | 0.50 |

**The Call cannot be a period.** Quality floor for The Call is **0.72**. Period rank cap: **1 ticket per event**.

Live / in-play: **no generated 1st-inning sheet cells** for a game already in play. Posted live rows still rank on Live, quality × **0.52**.

---

## 8. Ranking, calibration, The Call, mood

### 8.1 Market quality (`infoQuality`)

| Market | Quality |
|---|---|
| Full-game moneyline | **1.00** |
| Spread | 0.94 ± key-number tilt |
| Game total | 0.86 |
| Team total | 0.70 |
| Counting prop | 0.80 |
| Anytime / HR / to-score / 2+ | 0.68 |
| F5 | 0.64 |
| Same-game parlay | 0.62 |
| Half | 0.58 |
| 3-leg parlay | 0.55 |
| Quarter / period | 0.50 |
| Inning | 0.46 |
| 4-leg parlay | 0.40 |
| 1st-inning 0.5 | **0.36** |
| Floor | 0.28 |
| In-play multiplier | × **0.52** |

**Source:** Olympus / algobetting — highest-confidence tail on thin markets is historically the worst bucket. Dimers / CLV — a 1st-inning 0.5 is not a moneyline.

### 8.2 Calibrated (displayed) chance

```
displayed = implied + (fair − implied) · (0.35 + 0.65 · quality)
```

Quality 1.0 keeps the ensemble. A 1st-inning 0.5 keeps ~58% of the disagreement with the juice. If there is no implied price: `0.5 + (fair − 0.5) · (0.4 + 0.6 q)`.

Clip displayed at **99%**. Never 100%.

### 8.3 Edge vs the juice

```
edge = fair − implied(American price)
```

CLV / +EV desks: edge is first-class, not a footnote. Ticket page shows Book / Desk / Edge.

### 8.4 `deskScore` (core)

```
pay = American profit multiple          # −110 → 0.909; +150 → 1.50
ev  = chance · (1 + pay) − 1
blend = chance² · √pay
```

- If `pay < 0.65` (big favorite): `0.35 · blend + 0.15 · ev` — heavy haircut so −400 at 80% loses to −110 at 58%.
- Else: `0.55 · blend + 0.45 · max(ev, −0.08) + 0.12 · chance`.
- Tape: sharp **+0.055**, public **−0.035**, else 0.

### 8.5 `ticketScore` (what actually ranks)

```
ticketScore = deskScore · quality + clip(edge · 1.15, −0.07, +0.14)
```

Tie-break: **score, then chance, then id**. No `Math.random`. Same board → same order.

### 8.6 Confidence badge

- **High:** quality ≥ 0.88, chance ≥ 0.52, edge ≥ −2.5 pts.
- **Medium:** quality ≥ 0.68, chance ≥ 0.48.
- **Low:** otherwise.

### 8.7 The Call (gold badge)

Must be **all** of:

- A **single** (never a parlay).
- **Not in-play**.
- Decimal payout ≥ **1.55**.
- Displayed chance in **[50%, 76%]**.
- `infoQuality ≥ 0.72` (period slices cannot qualify).
- Score > −90.

Fallback (still never live, never a parlay): payout ≥ 1.55, chance ≥ 48%, quality ≥ 0.64. **Never promotes a live ticket.**

### 8.8 Mood (Hard Rock For You analog)

Does **not** rewrite chance. Re-sorts the same list:

- **Safest** (Chill) — highest chance, then score, then id.
- **Best value** (Skill, default) — `ticketScore`.
- **Pays more** (Thrill) — biggest payout among tickets we still trust, then chance.

### 8.9 Catalog caps

- Popular 8 · Player 8 · Periods 6 · SGP 6 · 2-leg 6 · 3-leg 6 · 4-leg 4.
- Per-event cap: **1 period**, **2** otherwise, then fill remaining slots.
- Horizon: today ET **or** in-play **or** next **36 hours** (and games that started in the last 4 hours still count). Late-night ET does not empty the desk.

### 8.10 Legal / stand-down gates (`engine.ts` `scoreQuotes`)

- In-play (clock started) → tag `in_play`. Ranks on Live only.
- DK/FD sportsbook venue → `illegal_fl`.
- College player prop → `illegal_fl`.
- Fair or better vs two-way (Hard Rock price, EV ≥ 0) → `fair_or_better`.
- Main market, EV ≥ −3% → `close_enough` (fun money, not the recommended pick).
- Else juiced / missing two-way → stand down on the **scan** tag. AI Picks still ranks research looks; the ticket page says photograph Hard Rock.
- One-sided market (no opposite price) → cannot call a fair two-way. Stand down on that scan row.

Seed bankroll (`< $100`): still **names** a ticket. `liveFits` is false until bankroll ≥ $100 and unit ≥ $1. Naming is not placing.

---

## 9. Parlays

### 9.1 Independence, then a haircut

```
raw = Π leg.fair
combined = min(0.97, raw · haircut)
```

**Same-game haircut** (`parlays.ts` `sgpHaircut`):

| Legs | Includes ML+spread | Haircut |
|---|---|---|
| 2 | yes | **0.55** |
| 3+ | yes | **0.42** |
| 2 | no | 0.88 |
| 3 | no | 0.75 |
| 4 | no | 0.62 |

Cross-game / cross-sport: haircut **1** (independent).

### 9.2 Parlay score

```
parlayScore = combinedFair^1.2 · ln(1 + profit) · 12 + combinedFair · 1.8
```

Hittable 2-legs beat lottery 4-legs on purpose.

Then × `infoQuality` (0.70 / 0.55 / 0.40 / 0.62 for 2 / 3 / 4 / SGP).

### 9.3 Leg floors

| Mode | 2-leg | 3-leg | 4-leg |
|---|---|---|---|
| AI Picks ribbon | 52% | 58% | not allowed |
| Catalog / Parlay tab | 48% | 50% | 48% |

### 9.4 Hard gates

- No in-play legs.
- Ribbon: 2 or 3 games only. **4-legs live on Parlay, never the gold badge.**
- Ribbon: no player props on the badge (they rank as singles and as custom Parlay legs).
- **No college player bets ever.**
- Ribbon: no 3-leg same-game.
- Catalog: a **4-leg same-game** is blocked (legs are not independent).
- Typical parlay juice used only for an entertainment-EV flag: 12% (2) / 25% (3) / 32% (4). EV < −8% → titled “fun money.”
- SGP mixes also built from best player + best main, two different players, period + main, player + period.

---

## 10. Official rule list (what the ticket page prints)

Same list every time. `rules.ts` `ALGORITHM_RULES`. Stamp via `ruleStamp`.

Applies: **all** tickets unless noted.

1. **Sportsbook close is the prior** — two-way no-vig. We do not fight a liquid close without a reason. Layers: market, book, open, spread.
2. **Last 10 — every stat, not just W-L** — games: recency-weighted scores. Props: last-10 of **that** stat. Periods inherit then shrink. Layers: form, margin, trend, last10, season-rate.
3. **Head-to-head** — last-10 meetings → season vs-opp → this series. Always looked up. Layer: h2h.
4. **Home vs road** — last-10 venue scores, else ESPN home/away split. Always looked up. Layer: venue-split.
5. **Opponent-adjusted defense** — ERA / opp OPS / points allowed. Props use the opponent’s allowed rate for that stat. Layer: defense.
6. **Underlying (xG-style)** — OBP+ISO / ERA/WHIP/opp OPS. Process, not just runs that already scored. Last-7 when posted. Games / periods / parlays. Layers: underlying, efficiency, pythag.
7. **Pitcher vs batter** — vs-LHP / vs-RHP against tonight’s starter hand. Player tickets also get opponent ERA. Games / props / periods. Layers: platoon, pitcher.
8. **Minutes / usage filter** — player tickets. Drop games under half usual minutes. Layers: usage, last10.
9. **Open → close move** — if the number moved, that is information. Steam with the handle is informed money, still not a lock. Layers: steam, open.
10. **Kalshi + Polymarket** — a different crowd from the book. Research only. Layers: kalshi, polymarket.
11. **ESPN matchup model** — ratings, not tonight’s ticket. Layer: espn.
12. **Starting pitcher + bullpen** — ERA/WHIP 60% last-7 / 40% season. Bullpen fatigue on a MLB B2B. Layers: pitcher.
13. **Out / IL listings** — count, not star-value. Player listed out → stand down. Layer: injuries.
14. **Rest / B2B / bye** — NBA/NHL B2B hurts. NFL bye vs short week. MLB extra rest is small except bullpen B2B. Layer: rest.
15. **Weather and park** — wind/rain/heat move totals and hitting more than moneylines. Coors is not Petco. Layers: weather, park, total.
16. **Tickets % vs handle %** — wager count is the public. Dollars are the sharp tell when they split. Never copied. Never auto-faded. Layers: tickets, handle, steam.
17. **Period markets are noisier** — shrunk toward 50/50. Quality floor 0.72 so they cannot be The Call. Always Ran for period tickets.
18. **Live numbers are delayed** — in-play ranks in Live, never as The Call. Photograph Hard Rock now.
19. **Same-game correlation haircut** — ML+spread is the most correlated. Independent games multiply. 4-legs catalog only.
20. **Calibrate thin markets** — displayed chance is pulled toward the book when info-quality is low.
21. **Edge vs the juice** — rank `chance² × √payout × quality + edge`. 58% at −110 beats 80% at −400.
22. **Florida law** — college player bets blocked. Delayed numbers. Photograph Hard Rock to lock. This site never places a bet.

Rules with no layer id (17–22) stamp **Ran** whenever that ticket type is shown — they always run.

---

## 11. Determinism

- No `Math.random` in `src/lib/market`.
- Pure functions: same JSON in → same layers, same chance, same `ticketScore`, same hero id.
- Sort: score, then chance, then `id`.
- `DESK_VERSION` `2026.09.08-live`. Bump when a ranking rule changes so two boards on the same snapshot can never silently disagree.
- Fingerprint: `id | chance(6 dp) | score(6 dp) | bucket`.
- Tests pin: same 10 scores → identical `FormRead`; empty feed → Looked not skip; desk version string; leftover four layers exist on game and prop reports.

---

## 12. What is never done

- Never invent a missing split, ERA, minutes, last-10 score, or handle %.
- Never print NO LOOK. Empty = Looked.
- Never treat ESPN `lastFiveGames` as analysis (that was the canned artifact). We read the live schedule log.
- Never treat last-10 **hit rate** (8/10 cashed) as a lock.
- Never auto-copy 80% public. Never title cards fade/tail the public.
- Never flip a baseball moneyline on wind.
- Never add home-field twice on top of a home/road split.
- Never use own points-per-game as “defense.”
- Never let a period 0.5, a live ticket, or a 4-leg be The Call.
- Never place a bet. Never call a lock. Never print 100%.

---

## 13. Source map (audit)

| Claim | Where it runs | Published / desk |
|---|---|---|
| Logit pool + overdispersion shrink | `chance.ts` `poolLayers` | Published method; 1.35 / λ desk |
| Abramowitz Φ | `chance.ts` `normalCdf` | A&S 7.1.26 |
| log5 | `chance.ts` `log5` | Bill James 1981 |
| Pythagorean exponents | `chance.ts` `pythagoreanWp` | James / Oliver / FO |
| EWMA λ=0.82, last-10, 60/40 | `form.ts`, `props.ts`, `sheet.ts` | StatPair / AgentBets / Betmana; λ desk |
| Parse ESPN `{value,displayValue}` | `form.ts` `parseEspnScore` | ESPN live JSON |
| Team stats / vs L-R / last-7 | `looks.ts` | ESPN statistics API |
| Defense = ERA/OPS allowed or PA | `looks.ts` `defenseAllowed` | Desk: own pts/G is not defense |
| Underlying OBP+ISO | `looks.ts` `underlyingOffense` | wOBA-family; coefficients desk |
| Minutes filter half-median | `research.ts` `fetchPlayerRecent` | Desk |
| Tape 7-pt split, reconstruct handle | `tape.ts` | Colleague rule; Action Network fields |
| Key numbers 3 and 7 | `picks.ts` `keyNumberTilt` | Dimers / CLV / NFL physics |
| Calibrate toward the book | `picks.ts` `calibratedChance` | Olympus / CLV thin-market |
| `ticketScore` / 58% @ −110 | `picks.ts` + `tape.ts` `deskScore` | Desk ranking law |
| Period shrink table | `sheet.ts` `periodBundle` / MLB innings | Desk, quality floor 0.72 |
| SGP haircut 0.55 / 0.42 | `parlays.ts` `sgpHaircut` | Desk correlation |
| Poisson vs normal | `props.ts` `rateOver`, `sheet.ts` `countOver` | DMP Learn 2026 |
| Florida college-prop block | `props.ts`, `engine.ts`, `universe.ts` | Florida compact / Hard Rock Bet |
| Always-push empty layers | `chance.ts` / `props.ts` `pushEmpty` | User law 2026-09-08 |
| Rule stamps Ran / Thin / Looked | `rules.ts` `ruleStamp` | User law 2026-09-08 |

Companion living-law file: [`SPORTS_LOCK_BLUEPRINT.md`](./SPORTS_LOCK_BLUEPRINT.md). User prompts in chat override both when they conflict. Append a dated note when a ranking rule changes, and bump `DESK_VERSION`.

---

*Picking with Intelligence Creates Confidence.*  
Not a lock. Photograph Hard Rock to lock the live number. This site never places a bet. 1-800-GAMBLER.
