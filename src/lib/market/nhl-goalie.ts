import { clip } from "./math.ts";
import type { ChanceInput } from "./chance.ts";

export type NhlGoalieMeans = {
  muH: number;
  muA: number;
  chaosAdd: number;
  empty: boolean;
  note?: string;
};



export function applyNhlGoalieToMeans(input: ChanceInput): NhlGoalieMeans {
  const { 
    sport, 
    homeGoalieGsax, 
    awayGoalieGsax,
    homeIsB2B,
    awayIsB2B,
    homeTravelMiles = 0,
    awayTravelMiles = 0
  } = input;

  // The Empty Look Law (Strict Guardrail)
  if (
    sport !== "NHL" ||
    homeGoalieGsax == null || Number.isNaN(homeGoalieGsax) ||
    awayGoalieGsax == null || Number.isNaN(awayGoalieGsax)
  ) {
    return { muH: 1, muA: 1, chaosAdd: 0, empty: true };
  }

  let chaosAdd = 0;

  // 1. Goaltender GSAx Isolation
  // Elite GSAx (positive) dampens opponent scoring. Struggling GSAx (negative) inflates opponent scoring.
  // Assuming GSAx input is a standardized per-60 metric typically bounded between -1.5 and +1.5.
  const homeGoalieMul = clip(1.0 - (homeGoalieGsax * 0.10), 0.80, 1.25);
  const awayGoalieMul = clip(1.0 - (awayGoalieGsax * 0.10), 0.80, 1.25);

  // 2. Back-to-Back & Travel Fatigue Penalty
  let homeFatigueMul = 1.0;
  if (homeIsB2B) {
    // 4% baseline penalty, up to 7% penalty based on severe travel (e.g. >1000 miles)
    const severity = clip(homeTravelMiles / 1000, 0, 1);
    homeFatigueMul = 0.96 - (0.03 * severity);
    chaosAdd += 0.015 + (0.015 * severity);
  }

  let awayFatigueMul = 1.0;
  if (awayIsB2B) {
    const severity = clip(awayTravelMiles / 1000, 0, 1);
    awayFatigueMul = 0.96 - (0.03 * severity);
    chaosAdd += 0.015 + (0.015 * severity);
  }

  // Compounding isolation math:
  // The home team's scoring output is mathematically restricted by the away goalie and the home team's own fatigue.
  const muH = awayGoalieMul * homeFatigueMul;
  
  // The away team's scoring output is restricted by the home goalie and the away team's own fatigue.
  const muA = homeGoalieMul * awayFatigueMul;

  return {
    muH,
    muA,
    chaosAdd: clip(chaosAdd, 0, 0.03), // Cap chaos injection at max +0.03 as explicitly required
    empty: false,
    note: `NHL Iso: Home GSAx ${homeGoalieGsax}, Away GSAx ${awayGoalieGsax}`
  };
}

