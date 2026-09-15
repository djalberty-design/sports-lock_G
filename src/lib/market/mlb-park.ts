import { clip } from "./math.ts";
import type { ChanceInput } from "./chance.ts";

export type MlbParkMeans = {
  muH: number;
  muA: number;
  chaosAdd: number;
  empty: boolean;
  note?: string;
};



export function applyMlbParkToMeans(input: ChanceInput): MlbParkMeans {
  const {
    sport,
    parkRunFactor,
    weatherTemp,
    humidity,
    barometricPressure,
  } = input;

  // The Empty Look Law (Strict Guardrail)
  if (
    sport !== "MLB" ||
    parkRunFactor == null || Number.isNaN(parkRunFactor) ||
    weatherTemp == null || Number.isNaN(weatherTemp) ||
    humidity == null || Number.isNaN(humidity) ||
    barometricPressure == null || Number.isNaN(barometricPressure)
  ) {
    return { muH: 1, muA: 1, chaosAdd: 0, empty: true };
  }

  // Density Altitude & Carry Factor (CDF)
  // Baseline Standard Day: 70F, 50% Humidity, 29.92 inHg
  
  // Heat increases carry (air is less dense) -> ~1% per 10 degrees above 70
  const tempDelta = (weatherTemp - 70) / 10;
  const tempCarry = tempDelta * 0.01;

  // Pressure decreases carry (high pressure = denser air) -> ~2% per 1 inHg drop
  // Example: Station pressure at Coors is ~24.5 inHg. (29.92 - 24.5) * 0.02 = ~ +10.8% carry
  const pressureDelta = 29.92 - barometricPressure;
  const pressureCarry = pressureDelta * 0.02;

  // Humidity slightly increases carry (H2O vapor is lighter than N2/O2)
  const humidityDelta = (humidity - 50) / 10;
  const humidityCarry = humidityDelta * 0.001;

  // Base physics carry factor bounded between 0.85 (cold, heavy air) and 1.25 (hot, thin air)
  const carryFactor = clip(1.0 + tempCarry + pressureCarry + humidityCarry, 0.85, 1.25);

  // Apply park structural run factor (e.g., fence distance, foul territory)
  // Multiply the base team scoring means (muH and muA) by the stadium's specific parkRunFactor
  const finalMultiplier = parkRunFactor * carryFactor;

  let chaosAdd = 0;
  
  // Extreme hitting environments inject variance (bounded to +0.03)
  if (finalMultiplier > 1.05) {
    chaosAdd = Math.min(0.03, (finalMultiplier - 1.05) * 0.15);
  }

  return {
    muH: finalMultiplier,
    muA: finalMultiplier,
    chaosAdd,
    empty: false,
    note: `MLB Park: f=${parkRunFactor.toFixed(2)} c=${carryFactor.toFixed(3)}`,
  };
}

