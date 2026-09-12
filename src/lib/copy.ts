import type { CheckUsed, Lane, MarketType, OptionStatusKind, ScanTag } from "@/lib/market/types";

/** Beginner-facing labels. Keep product logic; change the words. */

export const MARKET_LABEL: Record<MarketType, string> = {
  ml: "Pick Who Wins",
  spread: "Score Margin",
  total: "Combined Score",
  prop: "Player bet",
};

export const TAG_LABEL: Record<ScanTag, string> = {
  fair_or_better: "Fair Price",
  close_enough: "Almost fair",
  juiced: "Sportsbook Fee",
  stale_watch: "Smart Money Moving",
  illegal_fl: "Not allowed in Florida",
  in_play: "Game already started",
  unknown_market: "Unknown Hard Rock market",
};

export const STATUS_LABEL: Record<OptionStatusKind, string> = {
  go: "Ready",
  caution: "Careful",
  blocked: "Not allowed",
  lagged: "Research only",
  seed: "Too small",
};

export const USED_LABEL: Record<CheckUsed, string> = {
  blocks: "Stop",
  supports: "OK",
  noted: "Noted",
  discarded: "Skipped",
};

export const LANE_COPY: Record<Lane, { kicker: string; name: string; blurb: string }> = {
  safe: {
    kicker: "Safest",
    name: "High probability",
    blurb: "65% is the preferred floor. If nobody clears it, the highest-probability ticket still shows so the column is never empty.",
  },
  middle: {
    kicker: "Best Value",
    name: "Smart extra vs the fee",
    blurb: "Smart +EV plays. The gold ribbon is The Call — a different ticket. Still not a guarantee.",
  },
  risky: {
    kicker: "Pays More",
    name: "Longer prices",
    blurb: "Plus-money underdogs and high-multiplier combos (+130 to +600) that still have an edge.",
  },
};

export const SIZE_LABEL: Record<"seed" | "tiny" | "small" | "working" | "full", string> = {
  seed: "Too small",
  tiny: "Small",
  small: "Building",
  working: "Ready",
  full: "Full size",
};

export const HOW_TO_STEPS = [
  "Type how much money you have. Core bankroll is 85% of that — 1% of core is the next single. Fun / lotto is the other 15%.",
  "Open AI Picks. Three columns: Safest, Best Value, Pays More. The gold ribbon is The Call. Photograph Hard Rock to confirm the live number.",
  "Tap a ticket for the full breakdown. Confirm with a Hard Rock photo. Check Hit / Miss dollars — then save it to Log.",
  "Saved tickets wait on Log. When the game ends, tap Hit or Miss. Money on Start moves the same way the book would.",
] as const;

export const PLAIN_ENGLISH: { term: string; label: string; line: string }[] = [
  { term: "Moneyline (ML)", label: "Pick Who Wins", line: "Simply pick which team wins the game. No point spread." },
  { term: "Point Spread", label: "Score Margin", line: "Your team must win by more than this number of points (or lose by less)." },
  { term: "Over / Under (Total)", label: "Combined Score", line: "The total points or runs scored by both teams combined." },
  { term: "Vig / Juice / Hold", label: "Sportsbook Fee", line: "The cut the sportsbook takes. Higher fee = worse deal for you." },
  { term: "+EV (Expected Value)", label: "Smart Value (+Edge)", line: "You are getting paid more than the true statistical chance of it happening." },
  { term: "Parlay", label: "Combo Bet", line: "Multiple picks tied together. All must win to get paid, but it pays much higher." },
  { term: "SGP (Same-Game Parlay)", label: "Same-Game Combo", line: "Multiple picks from the exact same game tied together." },
  { term: "CLV (Closing Line Value)", label: "Beating the Market", line: "Getting a better number early before the rest of the public moves the line." },
  { term: "Steam / Line Move", label: "Smart Money Moving", line: "Large amounts of money just moved this number. Act now before it gets worse." },
  { term: "Push", label: "Tie / Refund", line: "The game landed on the exact number. You get your original money back." },
  { term: "Variance", label: "Game Luck vs. Strategy", line: "Normal good or bad bounces (fumbles, referee calls) that happen in sports." },
];

export function sportLabel(sport: string): string {
  switch (sport) {
    case "NFL":
      return "NFL";
    case "NBA":
      return "NBA";
    case "MLB":
      return "MLB";
    case "NHL":
      return "NHL";
    case "NCAAF":
      return "College Football";
    case "NCAAB":
      return "College Basketball";
    default:
      return sport || "Sport";
  }
}

export function formatChancePct(p?: number | null, digits = 0): string | null {
  if (p == null || !Number.isFinite(p)) return null;
  const pct = Math.round(p * 100 * 10 ** digits) / 10 ** digits;
  return digits ? `${pct.toFixed(digits)}%` : `${pct}%`;
}

export function formatBetUsd(n: number): string {
  if (!Number.isFinite(n)) return "$0";
  const abs = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  if (Number.isInteger(Math.round(abs * 100) / 100) && Math.round(abs * 100) % 100 === 0) {
    return `${sign}$${Math.round(abs)}`;
  }
  return `${sign}$${abs.toFixed(2)}`;
}

export function profitOnStake(stake: number, american: number): { profit: number; total: number } {
  const dec = american >= 0 ? american / 100 + 1 : 100 / Math.abs(american) + 1;
  const total = stake * dec;
  return { profit: total - stake, total };
}

export function shortPick(selection: string, marketType?: MarketType | string): string {
  if (!selection) return "Pick";
  return selection.replace(/\s+/g, " ").trim();
}


export function marketInEnglish(t?: MarketType | string): string {
  if (t === "ml" || t === "spread" || t === "total" || t === "prop") return MARKET_LABEL[t];
  return "Pick";
}

export function oddsInEnglish(american: number): string {
  if (!Number.isFinite(american)) return "odds not posted";
  if (american >= 0) return `plus-money +${Math.round(american)}`;
  return `minus-money ${Math.round(american)}`;
}

export function chanceInEnglish(p?: number | null): string {
  const pct = formatChancePct(p);
  return pct ? `${pct} chance it hits` : "chance not posted";
}

export function payoutOnStake(stake: number, american: number): string {
  if (!Number.isFinite(stake) || !Number.isFinite(american)) return "payout not posted";
  const { profit, total } = profitOnStake(stake, american);
  return `Hit ${formatBetUsd(total)} · profit ${formatBetUsd(profit)}`;
}
