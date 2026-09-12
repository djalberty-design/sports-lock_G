export const PLAY_CORE = ["NFL", "NBA", "MLB", "NHL"] as const;
export const TEAM_EXTRA = ["NCAAF", "NCAAB"] as const;
export const ALL_SPORTS = ["NFL", "NBA", "MLB", "NHL", "NCAAF", "NCAAB"] as const;
export const PROP_UNIVERSE = ["NFL", "NBA", "MLB", "NHL"] as const;
export const DFS_CLASSIC = ["NFL", "NBA", "MLB", "NHL"] as const;

export type PlayCoreSport = (typeof PLAY_CORE)[number];
export type TeamExtraSport = (typeof TEAM_EXTRA)[number];
export type SportKey = PlayCoreSport | TeamExtraSport;

export const MAIN_MARKETS = ["ml", "spread", "total"] as const;
export type MainMarket = (typeof MAIN_MARKETS)[number];

export const DEFAULTS = {
  liveBankroll: 200,
  unitPct: 0.01,
  weeklyLossCapPct: 0.1,
  goalTarget: 20,
  paperStartingCash: 2_500,
  dailyHaltPct: 0.03,
  maxParlayLegs: 4,
  minLegFairProb2: 0.56,
  minLegFairProb3: 0.6,
  catalogMinLeg2: 0.48,
  catalogMinLeg3: 0.5,
  catalogMinLeg4: 0.48,
  maxTicketPct: 0.02,
  dustUsd: 1,
  autoExecute: false,
  dfsSite: "draftkings_classic" as const,
  seedLt: 100,
  tinyLt: 200,
  entertainmentEvLt: -0.08,
  closeEnoughEv: -0.03,
  staleSpreadPts: 1.5,
  staleAmericanCents: 20,
} as const;

export const SLEEVE_RATES = {
  sit: { id: "sit" as const, label: "Don't bet / keep the money", symbol: "SIT", annual: 0 },
  grind: { id: "grind" as const, label: "One-game bets at a losing price", symbol: "MAIN", annual: -0.04 },
  fair: { id: "fair" as const, label: "One-game bets only at a fair price", symbol: "FAIR", annual: 0.01 },
  spicy: { id: "spicy" as const, label: "3-game parlays for fun", symbol: "3LEG", annual: -0.2 },
  hero: { id: "hero" as const, label: "Hindsight parlay (not a plan)", symbol: "HERO", annual: 1 },
};

export const CHECK_ORDER = [
  "size",
  "juice",
  "market",
  "clock",
  "halt",
  "board",
  "props",
  "news",
  "delay",
  "venue",
  "stack",
] as const;

export type CheckId = (typeof CHECK_ORDER)[number];

export const CHECK_LABELS: Record<CheckId, string> = {
  size: "Your money",
  juice: "Is the price fair?",
  market: "Type of bet",
  clock: "Has the game started?",
  halt: "No auto-stop",
  board: "What the public is doing",
  props: "Player bets",
  news: "Headlines",
  delay: "Odds delay",
  venue: "Where to place it",
  stack: "Long-term math",
};

export const ALERTS_ET = [
  {
    id: "midday",
    when: "Weekdays at noon Eastern",
    job: "A short note if a fair one-game bet is already marked. Not 'locks of the day.' This site never auto-stops you.",
  },
  {
    id: "tape",
    when: "Weekdays at 4:10 p.m. Eastern",
    job: "AI Picks: delayed odds, the named tickets, and what not to chase into night games.",
  },
  {
    id: "preload",
    when: "Weekdays at 6:30 p.m. Eastern",
    job: "What to set up at Hard Rock Bet for tomorrow: the one-game ticket, a 2-game parlay, or a 3-game parlay. Not a live order.",
  },
] as const;

export function isPlayCore(sport: string): sport is PlayCoreSport {
  return (PLAY_CORE as readonly string[]).includes(sport);
}

export function isTeamExtra(sport: string): sport is TeamExtraSport {
  return (TEAM_EXTRA as readonly string[]).includes(sport);
}

export function isCollegeSport(sport: string): boolean {
  return isTeamExtra(sport);
}

export function isMainMarket(marketType: string): boolean {
  return (MAIN_MARKETS as readonly string[]).includes(marketType);
}
