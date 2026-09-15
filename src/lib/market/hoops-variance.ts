import { clip } from "./math.ts";
import type { ChanceInput } from "./chance.ts";

export type HoopsVarianceMeans = {
  muH: number;
  muA: number;
  chaosAdd: number;
  empty: boolean;
  note?: string;
};



export function applyHoopsVarianceToMeans(input: ChanceInput): HoopsVarianceMeans {
  const {
    sport,
    homeThreePointRate,
    awayThreePointRate,
    homeOppThreePtAllowed,
    awayOppThreePtAllowed,
    homeRestDays,
    awayRestDays,
    homeIsB2B,
    awayIsB2B,
  } = input;

  // The Empty Look Law (Strict Guardrail) - Now strictly NCAAB
  if (sport !== "NCAAB") {
    return { muH: 1, muA: 1, chaosAdd: 0, empty: true };
  }

  if (
    homeThreePointRate == null || Number.isNaN(homeThreePointRate) ||
    awayThreePointRate == null || Number.isNaN(awayThreePointRate) ||
    homeOppThreePtAllowed == null || Number.isNaN(homeOppThreePtAllowed) ||
    awayOppThreePtAllowed == null || Number.isNaN(awayOppThreePtAllowed)
  ) {
    return { muH: 1, muA: 1, chaosAdd: 0, empty: true };
  }

  let chaosAdd = 0;

  // 1. Rest Disadvantage & Depth Decay
  // 0 days rest (or explicitly flagged B2B) triggers a tired legs penalty on shooting efficiency
  // Penalty applies to the tired team (2.5% to 4% suppression, centering around ~3.5%)
  let homeRestPenalty = 1.0;
  if (homeRestDays === 0 || homeIsB2B) {
    homeRestPenalty = 0.965;
  }

  let awayRestPenalty = 1.0;
  if (awayRestDays === 0 || awayIsB2B) {
    awayRestPenalty = 0.965;
  }

  // 2. Perimeter Variance (Shot-Profile Matchup)
  // Compare 3-point volume vs perimeter defense.
  // High-volume 3P rate (> 0.40) vs Elite Perimeter Defense (< 0.35 allowed)
  let homePerimeterPenalty = 1.0;
  if (homeThreePointRate > 0.40 && awayOppThreePtAllowed < 0.35) {
    // Calculate severity of mismatch
    const scale = clip((homeThreePointRate - 0.40) * 10 + (0.35 - awayOppThreePtAllowed) * 10, 0, 1);
    homePerimeterPenalty = 1.0 - (0.02 * scale); // up to 2% suppression
    chaosAdd += 0.01 + (0.01 * scale); // inject positive variance modifier
  }

  let awayPerimeterPenalty = 1.0;
  if (awayThreePointRate > 0.40 && homeOppThreePtAllowed < 0.35) {
    const scale = clip((awayThreePointRate - 0.40) * 10 + (0.35 - homeOppThreePtAllowed) * 10, 0, 1);
    awayPerimeterPenalty = 1.0 - (0.02 * scale);
    chaosAdd += 0.01 + (0.01 * scale);
  }

  return {
    muH: homeRestPenalty * homePerimeterPenalty,
    muA: awayRestPenalty * awayPerimeterPenalty,
    chaosAdd: clip(chaosAdd, 0, 0.02), // bounded up to +0.02 per requirements
    empty: false,
    note: `Hoops Var: perimeter mismatch / rest applied.`
  };
}

