import type { ChanceInput } from "./chance.ts";

export type NcaabVarianceMeans = {
  muH: number;
  muA: number;
  chaosAdd: number;
  empty: boolean;
  note?: string;
};

function clip(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function applyNcaabVarianceToMeans(input: ChanceInput): NcaabVarianceMeans {
  const {
    sport,
    homeTransferPortalIndex,
    awayTransferPortalIndex,
    sosAdjustment,
    isLateGameFoulRisk,
  } = input;

  // The Empty Look Law (Strict Guardrail)
  if (sport !== "NCAAB") {
    return { muH: 1, muA: 1, chaosAdd: 0, empty: true };
  }

  if (
    homeTransferPortalIndex == null || Number.isNaN(homeTransferPortalIndex) ||
    awayTransferPortalIndex == null || Number.isNaN(awayTransferPortalIndex) ||
    sosAdjustment == null || Number.isNaN(sosAdjustment)
  ) {
    return { muH: 1, muA: 1, chaosAdd: 0, empty: true };
  }

  let chaosAdd = 0;

  // 1. Roster Continuity & SOS Regression
  // NCAAB relies heavily on early season non-conference data. If a team has low roster continuity
  // (e.g. heavily assembled via transfer portal, < 0.5 index) AND has played a weak SOS (e.g. < 1.0),
  // they are likely a "paper tiger". We regress their efficiency downward.
  
  let homeContinuityPenalty = 1.0;
  if (homeTransferPortalIndex < 0.5 && sosAdjustment < 1.0) {
    // Scales up to a 5% penalty based on how low the continuity is and how weak the schedule is
    const continuityScale = clip((0.5 - homeTransferPortalIndex) * 2.0, 0, 1);
    const sosScale = clip(1.0 - sosAdjustment, 0, 1);
    homeContinuityPenalty = 1.0 - (0.05 * continuityScale * sosScale);
  }

  let awayContinuityPenalty = 1.0;
  if (awayTransferPortalIndex < 0.5 && sosAdjustment < 1.0) {
    const continuityScale = clip((0.5 - awayTransferPortalIndex) * 2.0, 0, 1);
    const sosScale = clip(1.0 - sosAdjustment, 0, 1);
    awayContinuityPenalty = 1.0 - (0.05 * continuityScale * sosScale);
  }

  // 2. Late-Game Intentional Foul Inflation
  // Close college basketball games suffer from aggressive fouling loops under 2 minutes,
  // pushing final scores unnaturally higher and injecting massive variance.
  if (isLateGameFoulRisk) {
    chaosAdd += 0.04;
  }

  return {
    muH: homeContinuityPenalty,
    muA: awayContinuityPenalty,
    chaosAdd: clip(chaosAdd, 0, 0.04), // Bounded up to +0.04 per requirements
    empty: false,
    note: `NCAAB Var: Continuity Regressed / Late Foul Risk applied.`
  };
}
