import { test } from "node:test";
import * as assert from "node:assert";
import { applyMlbParkToMeans } from "./mlb-park.ts";

test("MLB Park: Coors Field in July drastically inflates scoring and adds chaos", () => {
  const result = applyMlbParkToMeans({
    sport: "MLB",
    parkRunFactor: 1.15, // Coors baseline
    weatherTemp: 95, // Hot
    humidity: 30, // Dry
    barometricPressure: 24.5, // High altitude (low pressure)
  });

  assert.equal(result.empty, false);
  
  // Carry should be > 1.10 from altitude + heat
  // Final multiplier = 1.15 * ~1.13 = ~1.30
  assert.ok(result.muH > 1.25);
  assert.ok(result.muA > 1.25);
  
  // Extreme hitting environment should cap chaosAdd at 0.03
  assert.ok(result.chaosAdd > 0.02);
});

test("MLB Park: Oracle Park in April suppresses scoring", () => {
  const result = applyMlbParkToMeans({
    sport: "MLB",
    parkRunFactor: 0.94, // Pitcher's park
    weatherTemp: 52, // Cold
    humidity: 75, // Humid
    barometricPressure: 30.1, // Sea level, high pressure
  });

  assert.equal(result.empty, false);
  
  // Carry should be < 1.0 from cold + high pressure
  // Final multiplier < 0.94
  assert.ok(result.muH < 0.94);
  assert.ok(result.muA < 0.94);
  
  // No extreme hitting environment, zero chaos
  assert.equal(result.chaosAdd, 0);
});

test("MLB Park: Empty Look Law correctly stands down on missing data", () => {
  const result = applyMlbParkToMeans({
    sport: "MLB",
    parkRunFactor: 1.0,
    weatherTemp: 70,
    // Missing humidity and pressure
  });
  
  assert.equal(result.empty, true);
  assert.equal(result.muH, 1);
  assert.equal(result.muA, 1);
  assert.equal(result.chaosAdd, 0);
});

test("MLB Park: Ignores non-MLB sports", () => {
  const result = applyMlbParkToMeans({
    sport: "NFL",
    parkRunFactor: 1.0,
    weatherTemp: 70,
    humidity: 50,
    barometricPressure: 29.92,
  });
  
  assert.equal(result.empty, true);
});
