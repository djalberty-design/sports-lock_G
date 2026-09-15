import { type OfficialPosting } from "./officials.ts";

type RegistryMap = Record<string, Omit<OfficialPosting, "name" | "role">>;

// A seed registry with realistic, conservative biases across major sports.
// Boundaries: totalOverBias (-0.04 to +0.04), homeWinBias (-0.03 to +0.03)
const OFFICIALS_REGISTRY: Record<string, RegistryMap> = {
  NFL: {
    "clete blakeman": { homeWinBias: 0.015, totalOverBias: 0.02, penaltyRate: 0.01 },
    "shawn hochuli": { homeWinBias: -0.01, totalOverBias: 0.01, penaltyRate: 0.03 },
    "brad allen": { homeWinBias: 0.02, totalOverBias: -0.01, penaltyRate: -0.01 },
    "carl cheffers": { homeWinBias: -0.015, totalOverBias: -0.02, penaltyRate: 0.02 },
  },
  MLB: {
    "angel hernandez": { homeWinBias: -0.02, totalOverBias: -0.015, strikeZoneWidth: 0.03 },
    "cb bucknor": { homeWinBias: 0.01, totalOverBias: 0.02, strikeZoneWidth: 0.02 },
    "laz diaz": { homeWinBias: 0.015, totalOverBias: -0.01, strikeZoneWidth: 0.015 },
    "pat hoberg": { homeWinBias: 0.0, totalOverBias: 0.0, strikeZoneWidth: -0.02 }, // Highly accurate, low chaos
  },
  NBA: {
    "scott foster": { homeWinBias: -0.025, totalOverBias: -0.02, foulRate: 0.03 },
    "tony brothers": { homeWinBias: -0.015, totalOverBias: 0.01, foulRate: 0.02 },
    "zach zarba": { homeWinBias: 0.01, totalOverBias: 0.02, foulRate: -0.01 },
    "marc davis": { homeWinBias: 0.02, totalOverBias: -0.01, foulRate: 0.01 },
  },
  NHL: {
    "wes mccauley": { homeWinBias: 0.02, totalOverBias: 0.01, penaltyRate: 0.01 },
    "kelly sutherland": { homeWinBias: -0.01, totalOverBias: 0.015, penaltyRate: 0.02 },
  },
  NCAAF: {},
  NCAAB: {},
};

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/ jr\.?$/, "")
    .replace(/ sr\.?$/, "")
    .replace(/ iii$/, "")
    .replace(/ ii$/, "")
    .replace(/[^a-z\s]/g, "") // removes punctuation (e.g., C.B. -> cb)
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Enriches a list of raw ESPN official postings with their historical biases.
 * If unmatched, returns the original posting untouched (empty biases) for Empty Look Law compliance.
 */
export function enrichOfficialsWithTendencies(officials: OfficialPosting[], sport: string): OfficialPosting[] {
  if (!officials || officials.length === 0) return [];
  
  const sportRegistry = OFFICIALS_REGISTRY[sport.toUpperCase()] ?? {};
  
  return officials.map((o) => {
    const norm = normalizeName(o.name);
    const biases = sportRegistry[norm];
    if (biases) {
      return { ...o, ...biases };
    }
    return o; // Unmatched -> remains empty -> Empty Look Law stands down
  });
}
