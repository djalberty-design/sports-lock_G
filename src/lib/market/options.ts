import type { OptionKind } from "./types.ts";

export type OptionMeta = {
  kind: OptionKind;
  symbol: string;
  title: string;
  promise: string;
  howItWorks: string[];
  whenItWins: string;
  whenItFails: string;
  never: string[];
};

export const OPTION_CATALOG: OptionMeta[] = [
  {
    kind: "sit",
    symbol: "SIT",
    title: "Sit this one out",
    promise: "You can skip a live bet any time — the three cards still name tickets so you always have a next step. This site never auto-stops you.",
    howItWorks: [
      "The safest card is a real one-game ticket, not a blank 'don't bet' card.",
      "There is no daily or weekly stop here. Sitting is your call, not a lockout.",
      "Sitting is allowed. The app will not nag you either way.",
    ],
    whenItWins: "You still have money next week. Most beginners do not.",
    whenItFails: "You treat sitting as cowardice and fire a 3-game parlay to feel busy.",
    never: [
      "Never treat sitting as a failed product.",
      "Never 'win it back' just to feel busy.",
      "Never confuse idle cash in this bankroll with a paycheck.",
    ],
  },
  {
    kind: "main",
    symbol: "MAIN",
    title: "One game",
    promise:
      "The only live sports bet we will recommend: one before-the-game winner, spread, or over/under, in dollars, at Hard Rock Bet, when the price is fair or better.",
    howItWorks: [
      "We estimate each side's true chance from the two-way public price (the sportsbook's cut removed).",
      "Edge versus Hard Rock: if you would expect to break even or better at that price, it can be recommended.",
      "Recommended only if the Hard Rock price is fair or better, the stop is off, the suggested bet is at least $1, and the bankroll is not under $100.",
    ],
    whenItWins: "You got a fair or better number and sized about 1% of your money. Closing price, not last week's profit, is the grade.",
    whenItFails: "The delayed number was not the price you got. The sportsbook's cut ate the number. You bet $10 on a $200 bankroll because it 'felt like a lock.'",
    never: [
      "Never recommend a game because a tout pointed at it. Ticket count vs handle is a layer, not a copy-trade.",
      "Never use a FanDuel or DraftKings Sportsbook number as a Florida live ticket.",
      "Never copy 'this is a lock.'",
    ],
  },
  {
    kind: "parlay",
    symbol: "3LEG",
    title: "Parlay (2, 3, or 4 games)",
    promise: "AI Picks names the highest-chance 2-game and 3-game parlays. The Parlay desk ranks many more, including 4-game and same-game tickets. None of them is the gold badge.",
    howItWorks: [
      "AI Picks 2-game: each true chance at least 52%. 3-game: each at least 58%. Catalog on Parlay is looser so you can see more tickets.",
      "Combined chance = multiply the games together, then haircut same-game legs (they are not independent).",
      "Three games at 58% each → about 19.5% before the sportsbook's cut. That is a one-in-five ticket.",
      "Ranked by chance-to-hit vs payout. A lottery 4-leg sits below a hittable 2-leg.",
      "If the combined edge is worse than −8%, the card is stamped fun money.",
    ],
    whenItWins: "As entertainment, sized in tracker cash, after today's one-game pick.",
    whenItFails: "You read three 'probable' games as a likely ticket. You treat 80% of bets as a reason to copy the public.",
    never: [
      "Never a 4-game ticket on the AI Picks gold badge — those live on Parlay.",
      "Never a 4-leg same-game parlay (those legs are not independent).",
      "Never high confidence on a 3- or 4-game parlay.",
      "Never today's pick. Never the path to the goal.",
      "Never 'fade the public' or 'tail the public' as a title.",
    ],
  },
  {
    kind: "prop",
    symbol: "PROP",
    title: "Player bets",
    promise: "Pro player bets are research. College player bets are not allowed on Hard Rock Bet and are blocked.",
    howItWorks: [
      "Player bets here cover NFL, NBA, MLB, and NHL only.",
      "College player bets are product law, not a preference.",
      "We will not recommend a player bet as today's pick.",
    ],
    whenItWins: "You treated a pro player bet as a research note and still sat the live book.",
    whenItFails: "You bet Gators QB yards on Hard Rock Bet. That ticket should not exist.",
    never: [
      "Never a college player bet as a Florida live card.",
      "Never mix a player bet into a shown parlay.",
      "Never let a player bet steal today's pick.",
    ],
  },
  {
    kind: "dfs_cash",
    symbol: "CASH",
    title: "DraftKings classic — safer lineup",
    promise: "One lineup under the live salary cap. Floor-first. Not a spread bet.",
    howItWorks: [
      "Build the lineup that holds up if the night is messy, under cap and legal slots.",
      "Low ownership is a tie-break, not the score.",
      "The entry fee is not a Hard Rock Bet. Venue is DraftKings Fantasy.",
    ],
    whenItWins: "A confirmed slate, legal slots, under cap, no locked/out players.",
    whenItFails: "You submitted a lineup from an unconfirmed screenshot.",
    never: [
      "Never treat a fantasy lineup as a Hard Rock sports ticket.",
      "Never use FanDuel classic here.",
      "Never install DraftKings Sportsbook expecting it to work in Florida.",
    ],
  },
  {
    kind: "dfs_gpp",
    symbol: "GPP",
    title: "DraftKings classic — long-shot lineup",
    promise: "One ceiling-weighted lineup. Stack when the sport supports it. Still not today's sports pick.",
    howItWorks: [
      "Score leans on the high end of a player's range, not just the average.",
      "NFL: require quarterback + one pass-catcher stack.",
      "We ship one safer lineup + one long-shot lineup, not 150 lineups.",
    ],
    whenItWins: "You wanted variance on purpose, sized as an entry fee, after the live pick sat or fired one game.",
    whenItFails: "You stacked a locked game or an OUT player from a stale screenshot.",
    never: [
      "Never today's Hard Rock pick.",
      "Never single-game Showdown here.",
      "Never house pick'em (PrizePicks-style) as a lane.",
    ],
  },
  {
    kind: "predict",
    symbol: "PRED",
    title: "Prediction markets",
    promise: "Kalshi / FanDuel Predicts / DraftKings Predictions are event contracts. Catalog + Learn only.",
    howItWorks: [
      "Different legal bucket from Hard Rock Bet. Never mixed into today's sports pick.",
      "Lagged research only. Ignored as a reason to bet.",
      "18+. Celebrity / novelty 99% contracts stay ineligible.",
    ],
    whenItWins: "You read the lesson and did not confuse a contract with a spread ticket.",
    whenItFails: "You copied a lagged contract as if it were a Hard Rock fill.",
    never: [
      "Never steal today's pick.",
      "Never describe them as Hard Rock bets.",
      "Never auto-buy a novelty contract.",
    ],
  },
  {
    kind: "path",
    symbol: "PATH",
    title: "Long-term math",
    promise: "Show what a losing price does to a 1% bankroll, and what hit-rate a 10× or $1M goal would require.",
    howItWorks: [
      "Your money after 100 and 500 bets at −4% / 0% / +2% edge.",
      "Simple simulation for a 50% drop at 1% / 2% / 5% of your money per bet.",
      "The miracle-parlay row exists to disclaim hindsight, not as a plan.",
    ],
    whenItWins: "You type a real bankroll and a real goal, then sit more often.",
    whenItFails: "You paste a stock-market return as a betting rate, or treat this page as a promise.",
    never: [
      "Never sell this page as a forecast.",
      "Never auto-raise bet size when a tracker goal is hit.",
      "Never claim $50 → $1M on a human timetable.",
    ],
  },
];

export function optionByKind(kind: string): OptionMeta | undefined {
  return OPTION_CATALOG.find((o) => o.kind === kind);
}
