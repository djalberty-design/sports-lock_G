import type { ChanceInput } from "./chance.ts";

export type NbaVarianceMeans = {
  muH: number;
  muA: number;
  chaosAdd: number;
  empty: boolean;
  note?: string;
};

function clip(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function applyNbaVarianceToMeans(input: ChanceInput): NbaVarianceMeans {
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
    homeLoadManagementOut,
    awayLoadManagementOut
  } = input;

  // The Empty Look Law (Strict Guardrail)
  if (sport !== "NBA") {
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

  // 1. NBA Load Management & Rest Decay
  // Back-to-backs (0 days rest) apply a 3.5% decay due to tired legs.
  // Star rest/Load Management deducts an additional 4% to 6% (centering on 5%).
  let homeRestPenalty = 1.0;
  if (homeRestDays === 0 || homeIsB2B) {
    homeRestPenalty -= 0.035;
  }
  if (homeLoadManagementOut) {
    homeRestPenalty -= 0.05;
  }

  let awayRestPenalty = 1.0;
  if (awayRestDays === 0 || awayIsB2B) {
    awayRestPenalty -= 0.035;
  }
  if (awayLoadManagementOut) {
    awayRestPenalty -= 0.05;
  }

  // 2. Professional Perimeter & Spacing Geometry (23.9 ft arc)
  // Elite NBA perimeter defense vs High-volume catch-and-shoot/pull-up teams.
  // Standard elite NBA defense holds opponents < 35% from deep. High volume teams shoot > 40%.
  let homePerimeterPenalty = 1.0;
  if (homeThreePointRate > 0.40 && awayOppThreePtAllowed < 0.35) {
    const scale = clip((homeThreePointRate - 0.40) * 10 + (0.35 - awayOppThreePtAllowed) * 10, 0, 1);
    homePerimeterPenalty = 1.0 - (0.02 * scale);
    chaosAdd += 0.0125 + (0.0125 * scale); // up to +0.025
  }

  let awayPerimeterPenalty = 1.0;
  if (awayThreePointRate > 0.40 && homeOppThreePtAllowed < 0.35) {
    const scale = clip((awayThreePointRate - 0.40) * 10 + (0.35 - homeOppThreePtAllowed) * 10, 0, 1);
    awayPerimeterPenalty = 1.0 - (0.02 * scale);
    chaosAdd += 0.0125 + (0.0125 * scale); // up to +0.025
  }

  return {
    muH: homeRestPenalty * homePerimeterPenalty,
    muA: awayRestPenalty * awayPerimeterPenalty,
    chaosAdd: clip(chaosAdd, 0, 0.025), // bounded up to +0.025 per requirements
    empty: false,
    note: `NBA Var: LoadMgmt / Perimeter geometry applied.`
  };
}
