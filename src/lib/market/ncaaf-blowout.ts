import type { ChanceInput } from "./chance.ts";

export type NcaafBlowoutMeans = {
  muH: number;
  muA: number;
  chaosAdd: number;
  empty: boolean;
  note?: string;
};

function clip(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function applyNcaafBlowoutToMeans(input: ChanceInput): NcaafBlowoutMeans {
  const { sport, homeTalentRating, awayTalentRating } = input;

  // The Empty Look Law (Strict Guardrail)
  if (
    sport !== "NCAAF" ||
    homeTalentRating == null || Number.isNaN(homeTalentRating) ||
    awayTalentRating == null || Number.isNaN(awayTalentRating)
  ) {
    return { muH: 1, muA: 1, chaosAdd: 0, empty: true };
  }

  const delta = Math.abs(homeTalentRating - awayTalentRating);
  const mismatchThreshold = 250;

  let muH = 1.0;
  let muA = 1.0;
  let chaosAdd = 0;

  if (delta > mismatchThreshold) {
    // High-probability blowout detected
    
    // Calculate dampening for 4th quarter prevent-defense/backups (5% to 10% penalty)
    // For a delta of 251, dampening is ~0.95. For a delta of 500+, dampening scales toward 0.90.
    const penaltyScale = clip((delta - mismatchThreshold) / 250, 0, 1);
    const dampenFactor = 0.95 - (0.05 * penaltyScale);

    // Apply garbage-time compression to the heavy favorite
    if (homeTalentRating > awayTalentRating) {
      muH = dampenFactor;
    } else {
      muA = dampenFactor;
    }

    // Inject significant chaos to account for unpredictable garbage-time scoring and backdoor covers
    chaosAdd = 0.02 + (0.03 * penaltyScale);
  }

  return {
    muH,
    muA,
    chaosAdd,
    empty: false,
    note: delta > mismatchThreshold 
      ? `NCAAF Blowout: ${delta.toFixed(0)} talent delta.`
      : undefined
  };
}
