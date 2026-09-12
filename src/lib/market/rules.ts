/**
 * The rule list the desk actually runs.
 *
 * Same input → same ranking. No dice, no "vibe", no canned artifact.
 * Every ticket type walks this list. Every rule LOOKS UP live data every time.
 * Thin sample = light weight. Empty feed = "Looked" with Precision = 0 (no 50/50 drag), not a skip
 * and not an invented number.
 *
 * Bump DESK_VERSION when a ranking rule changes so two boards on the same
 * snapshot can never silently disagree.
 */

export const DESK_VERSION = "2026.09.10-master-v6";

export type RuleApplies = "all" | "game" | "prop" | "period" | "parlay";

export type AlgorithmRule = {
  id: string;
  applies: RuleApplies[];
  title: string;
  text: string;
  /** Layer ids from buildChance / buildPropChance that mean this rule fired. */
  layerIds: string[];
};

export const ALGORITHM_RULES: AlgorithmRule[] = [
  {
    id: "market",
    applies: ["all"],
    title: "Hard Rock Florida is the fill",
    text: "Photographed ticket or Ran hardrockbet_fl. Public books and prediction markets are research. Delayed numbers are not a fill.",
    layerIds: ["market", "book", "open", "spread", "hr-fl"],
  },
  {
    id: "latent",
    applies: ["all"],
    title: "Latent game, not one number",
    text: "Win, pace, variance, style. Sides and totals are not transforms of each other. Seeded paths price alts, first-scorer, parlays, live remaining.",
    layerIds: ["latent", "efficiency", "pythag", "espn", "sim"],
  },
  {
    id: "last10",
    applies: ["all"],
    title: "Last 10 — every stat, not just W-L",
    text: "Games: recency-weighted scores. Props: last-10 of THAT stat (hits, Ks, yards, points) EWMA, 60/40 with season. Periods inherit the game last-10 then shrink. Live ESPN log.",
    layerIds: ["form", "margin", "trend", "last10", "season-rate"],
  },
  {
    id: "h2h",
    applies: ["all"],
    title: "Head-to-head",
    text: "Last-10 meetings first, then season vs-opponent split, then this series. Always looked up live.",
    layerIds: ["h2h"],
  },
  {
    id: "venue-split",
    applies: ["all"],
    title: "Home vs road",
    text: "Last-10 home/road scores, else live ESPN home/away split. Always looked up.",
    layerIds: ["venue-split"],
  },
  {
    id: "defense",
    applies: ["all"],
    title: "Opponent-adjusted defense",
    text: "Live ESPN team stats: ERA / opponent OPS / points allowed. Props use the opponent's allowed rate for that stat.",
    layerIds: ["defense"],
  },
  {
    id: "underlying",
    applies: ["game", "period", "parlay"],
    title: "Underlying (xG-style)",
    text: "OBP + ISO for hitters, ERA/WHIP/opp OPS for pitchers. Process, not just runs that already scored. Last-7 when posted.",
    layerIds: ["underlying", "efficiency", "pythag"],
  },
  {
    id: "platoon",
    applies: ["game", "prop", "period"],
    title: "Pitcher vs batter",
    text: "Live vs-LHP / vs-RHP split against tonight's starter hand. Player tickets also get opponent ERA.",
    layerIds: ["platoon", "pitcher"],
  },
  {
    id: "usage",
    applies: ["prop"],
    title: "Lineup / usage transmission",
    text: "Scratches move usage, order, ice time. Count-of-bodies is the light backup. College player usage moves the game only — no Florida player ticket.",
    layerIds: ["usage", "last10", "injuries"],
  },
  {
    id: "process",
    applies: ["all"],
    title: "Process looks",
    text: "EPA / four factors / Statcast / xG / tempo-free. Empty = Looked. Never invented.",
    layerIds: ["process"],
  },
  {
    id: "steam",
    applies: ["all"],
    title: "Open → close move",
    text: "If the number moved, that is information. Steam with the handle is informed money, still not a lock.",
    layerIds: ["steam", "open"],
  },
  {
    id: "predict",
    applies: ["all"],
    title: "Kalshi + Polymarket",
    text: "A different crowd from the book. Research only — not a Florida fill.",
    layerIds: ["kalshi", "polymarket"],
  },
  {
    id: "espn",
    applies: ["all"],
    title: "ESPN matchup model",
    text: "Ratings, not tonight's ticket. One look in the pool.",
    layerIds: ["espn"],
  },
  {
    id: "pitcher",
    applies: ["game", "prop", "period"],
    title: "Starting pitcher + bullpen",
    text: "ERA/WHIP blended 60% last-7 when posted, 40% season. Bullpen fatigue on a MLB B2B.",
    layerIds: ["pitcher"],
  },
  {
    id: "injuries",
    applies: ["all"],
    title: "Out / IL listings",
    text: "Count of listed-out players. A listed backup is not a listed ace. Player listed out → stand down.",
    layerIds: ["injuries"],
  },
  {
    id: "rest",
    applies: ["all"],
    title: "Rest / B2B / bye",
    text: "NBA/NHL back-to-backs hurt. NFL bye vs short week. MLB extra rest is small except bullpen B2B.",
    layerIds: ["rest"],
  },
  {
    id: "weather-park",
    applies: ["all"],
    title: "Weather and park",
    text: "Wind/rain/heat move totals and hitting props more than moneylines. Coors is not Petco.",
    layerIds: ["weather", "park", "total"],
  },
  {
    id: "tape",
    applies: ["all"],
    title: "Tickets % vs handle %",
    text: "Wager count is the public. Dollars are the sharp tell when they split. Never copied. Never auto-faded.",
    layerIds: ["tickets", "handle", "steam"],
  },
  {
    id: "period-shrink",
    applies: ["period"],
    title: "Period markets are noisier",
    text: "One inning/quarter/half is shrunk toward 50/50 vs the full-game ensemble. Quality floor 0.72 so they cannot be The Call.",
    layerIds: [],
  },
  {
    id: "live",
    applies: ["all"],
    title: "Live numbers are delayed",
    text: "In-play tickets rank in Live, never as The Call. Photograph Hard Rock now — a delayed live number is not a fill.",
    layerIds: [],
  },
  {
    id: "sgp",
    applies: ["parlay"],
    title: "Parlays are joint paths",
    text: "Same-game correlation is simulated. Cross-game is almost independent. Ribbon maximizes hit chance, not poster odds. 4-legs catalog only.",
    layerIds: [],
  },
  {
    id: "live-state",
    applies: ["all"],
    title: "Live is a state machine",
    text: "Score, clock, downs, outs, strength. Remaining props use leftover mean. Never The Call. Never a ribbon leg.",
    layerIds: [],
  },
  {
    id: "calibrate",
    applies: ["all"],
    title: "Calibrate thin markets",
    text: "Displayed chance is pulled toward the book when info-quality is low. A 1st-inning 0.5 is not a moneyline.",
    layerIds: [],
  },
  {
    id: "edge",
    applies: ["all"],
    title: "Edge vs the juice",
    text: "Desk chance minus implied. Rank chance² × √payout × quality + edge. 58% at −110 beats 80% at −400.",
    layerIds: [],
  },
  {
    id: "florida",
    applies: ["all"],
    title: "Florida law",
    text: "College player bets blocked. No scraping Hard Rock. Photograph when the tape is missing or boosted. This site never places a bet.",
    layerIds: [],
  },
];

export function rulesFor(kind: RuleApplies): AlgorithmRule[] {
  return ALGORITHM_RULES.filter((r) => r.applies.includes("all") || r.applies.includes(kind));
}

export function ruleFired(rule: AlgorithmRule, layerIds: string[]): boolean {
  if (!rule.layerIds.length) return true;
  return rule.layerIds.some((id) => layerIds.includes(id));
}

export type RuleStamp = "Ran" | "Thin" | "Looked";

export function ruleStamp(
  rule: AlgorithmRule,
  layers: Array<{ id: string; thin?: boolean; empty?: boolean }>,
): RuleStamp {
  if (!rule.layerIds.length) return "Ran";
  const hits = layers.filter((l) => rule.layerIds.includes(l.id));
  if (!hits.length) return "Looked";
  if (hits.every((h) => h.empty)) return "Looked";
  if (hits.every((h) => h.thin || h.empty)) return "Thin";
  return "Ran";
}