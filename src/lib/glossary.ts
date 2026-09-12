/** Beginner glossary. Never show "ML" without saying moneyline / who wins. */

export type GlossaryTerm = {
  id: string;
  word: string;
  also?: string;
  meaning: string;
  example: string;
};

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: "ml",
    word: "Moneyline",
    also: "ML",
    meaning:
      "Pick Who Wins. Simply pick which team wins the game. No point spread. If you take Baltimore on the moneyline, Baltimore has to win — that's it.",
    example: "Baltimore to win at +160. You are betting Baltimore wins the game, not that they cover a number.",
  },
  {
    id: "plus",
    word: "Plus money (+160)",
    meaning:
      "The underdog price. Bet $100, and if they win you profit $160 (you also get your $100 back, so $260 total).",
    example: "+160 on a $20 bet → about $32 profit if it hits.",
  },
  {
    id: "minus",
    word: "Minus money (−150)",
    meaning:
      "The favorite price. You have to bet $150 to profit $100. You pay extra because they're more likely to win.",
    example: "−150 on a $15 bet → about $10 profit if it hits.",
  },
  {
    id: "spread",
    word: "Score Margin",
    also: "Spread",
    meaning:
      "Your team must win by more than this number of points (or lose by less). A head start for the underdog.",
    example: "Baltimore +3.5: they can lose 24–21 and you still win.",
  },
  {
    id: "total",
    word: "Combined Score",
    also: "Over / Under",
    meaning: "The total points or runs scored by both teams combined. You pick over or under a number.",
    example: "Over 47.5 means 48 or more combined points.",
  },
  {
    id: "parlay",
    word: "Combo Bet",
    also: "Parlay",
    meaning:
      "Multiple picks tied together. All must win to get paid, but it pays much higher.",
    example: "Two games at about 55% each is only about a 30% ticket, not a coin flip.",
  },
  {
    id: "juice",
    word: "Sportsbook Fee",
    also: "Vig / juice",
    meaning:
      "The cut the sportsbook takes. Higher fee = worse deal for you. −110 vs −110 is not a fair coin flip.",
    example: "Two sides at −110 add up to about 104.8%. The extra is the house take.",
  },
  {
    id: "bankroll",
    word: "Bankroll",
    meaning: "The money you set aside for this. Not rent, not groceries. We suggest betting 1% of it per play.",
    example: "On $200, a 1% bet is $2. $2 means $2.",
  },
  {
    id: "underdog",
    word: "Underdog",
    meaning: "The team the sportsbook thinks is less likely to win. Their moneyline has a plus sign and pays more.",
    example: "A +130 underdog pays $130 profit on a $100 bet.",
  },
  {
    id: "favorite",
    word: "Favorite",
    meaning: "The team the sportsbook thinks is more likely to win. Their moneyline has a minus sign. You risk more to win less.",
    example: "A −150 favorite: bet $150 to profit $100.",
  },
  {
    id: "dfs",
    word: "Daily fantasy (DFS)",
    meaning:
      "Not a bet on one team. You build a roster under a salary cap on DraftKings Fantasy, then enter a contest for a listed buy-in.",
    example: "Photograph the player list and the contest lobby. We name a lineup and a buy-in. We do not submit it.",
  },
  {
    id: "cash",
    word: "Cash game / Double-up",
    meaning: "A daily-fantasy contest that pays about half the field. Safer. Smaller payout.",
    example: "A $3 50/50: roughly half the lineups get paid. Not a million-dollar tournament.",
  },
  {
    id: "gpp",
    word: "Tournament (GPP)",
    meaning: "A daily-fantasy contest with a big top prize and a lot of people. Most lineups win nothing. Long shot.",
    example: "A $5 tournament with 20,000 lineups. One safer cash game + one tournament is the whole plan.",
  },
  {
    id: "coin",
    word: "Coin-flip underdog",
    meaning:
      "A game that is about 50/50 in our math, but the book still lists one side as an underdog. You get paid more than even money on a toss-up.",
    example: "Detroit to win at +130 when we think it's about a coin flip. That's the riskiest card on purpose.",
  },
];

export function glossaryById(id: string): GlossaryTerm | undefined {
  return GLOSSARY.find((t) => t.id === id);
}
