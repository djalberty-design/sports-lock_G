import type { ChanceInput } from "./chance.ts";

export type NflMatchupMeans = {
  muH: number;
  muA: number;
  chaosAdd: number;
  empty: boolean;
  note?: string;
};

export function applyNflToMeans(input: ChanceInput, baseMuH: number, baseMuA: number): NflMatchupMeans {
  const {
    sport,
    homeQbEpa,
    awayQbEpa,
    homeBackupQbEpa,
    awayBackupQbEpa,
    homeQbIsBackup,
    awayQbIsBackup,
    homePassBlockWinRate,
    awayPassBlockWinRate,
    homePassRushWinRate,
    awayPassRushWinRate,
  } = input;
  
  const windSpeed = input.windSpeed ?? input.weatherWind;

  // The Empty Look Law (Strict Guardrail)
  if (
    sport !== "NFL" ||
    homeQbEpa == null || Number.isNaN(homeQbEpa) ||
    awayQbEpa == null || Number.isNaN(awayQbEpa) ||
    homePassBlockWinRate == null || Number.isNaN(homePassBlockWinRate) ||
    awayPassBlockWinRate == null || Number.isNaN(awayPassBlockWinRate) ||
    homePassRushWinRate == null || Number.isNaN(homePassRushWinRate) ||
    awayPassRushWinRate == null || Number.isNaN(awayPassRushWinRate)
  ) {
    return { muH: 1, muA: 1, chaosAdd: 0, empty: true };
  }

  let chaosAdd = 0;
  
  // 1. Quarterback EPA Delta
  const expectedSnaps = 65;
  let homeDeduction = 0;
  let awayDeduction = 0;

  if (homeQbIsBackup && homeBackupQbEpa != null) {
    const delta = Math.max(0, homeQbEpa - homeBackupQbEpa);
    homeDeduction = delta * expectedSnaps;
  }
  
  if (awayQbIsBackup && awayBackupQbEpa != null) {
    const delta = Math.max(0, awayQbEpa - awayBackupQbEpa);
    awayDeduction = delta * expectedSnaps;
  }

  // 2. Wind Speed Decay (Pass vs. Rush)
  let homeWindMul = 1.0;
  let awayWindMul = 1.0;

  if (windSpeed != null && windSpeed > 15) {
    const excessWind = windSpeed - 15;
    const passingDecay = Math.max(0.75, 1 - (excessWind * 0.02)); // Compounding penalty
    const rushingBoost = Math.min(1.15, 1 + (excessWind * 0.005));
    
    // Weight passing vs rushing
    const netWindMul = (0.65 * passingDecay) + (0.35 * rushingBoost);
    
    homeWindMul = netWindMul;
    awayWindMul = netWindMul;
    
    chaosAdd += 0.01 + Math.min(0.04, excessWind * 0.003);
  }

  // 3. Trench Mismatch (PBWR vs. PRWR)
  let homeTrenchMul = 1.0;
  let awayTrenchMul = 1.0;

  // Average PBWR is ~60%, Average PRWR is ~40%.
  // Mismatch = Defense PRWR - Offense PBWR. 
  // If mismatch > -5 (e.g. PRWR 50% vs PBWR 55%), that's a severe outlier trench mismatch.
  const homeMismatch = awayPassRushWinRate - homePassBlockWinRate;
  if (homeMismatch > -5) {
    homeTrenchMul = Math.max(0.80, 1 - ((homeMismatch + 5) * 0.015));
    chaosAdd += 0.03;
  }

  const awayMismatch = homePassRushWinRate - awayPassBlockWinRate;
  if (awayMismatch > -5) {
    awayTrenchMul = Math.max(0.80, 1 - ((awayMismatch + 5) * 0.015));
    chaosAdd += 0.03;
  }

  // Combine adjustments mathematically
  const trueMuH = Math.max(1, (baseMuH - homeDeduction)) * homeWindMul * homeTrenchMul;
  const trueMuA = Math.max(1, (baseMuA - awayDeduction)) * awayWindMul * awayTrenchMul;

  const muH = baseMuH > 0 ? trueMuH / baseMuH : 1;
  const muA = baseMuA > 0 ? trueMuA / baseMuA : 1;

  return {
    muH,
    muA,
    chaosAdd,
    empty: false,
    note: "NFL Iso applied."
  };
}
