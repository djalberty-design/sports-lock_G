import { test } from "node:test";
import * as assert from "node:assert";
import { applyNbaVarianceToMeans } from "./nba-variance.ts";

test("NBA Var: Star rest and B2B triggers massive scoring suppression", () => {
  const result = applyNbaVarianceToMeans({
    sport: "NBA",
    homeThreePointRate: 0.35,
    awayThreePointRate: 0.35,
    homeOppThreePtAllowed: 0.36,
    awayOppThreePtAllowed: 0.36,
    homeRestDays: 0, // B2B
    homeLoadManagementOut: true, // Star is resting
    awayRestDays: 2,
    awayLoadManagementOut: false,
  });

  assert.equal(result.empty, false);
  
  // Home team should face -3.5% (B2B) and -5.0% (Load Mgmt) = ~0.915 multiplier
  assert.ok(result.muH <= 0.92);
  assert.equal(result.muA, 1.0); // Away team unchanged
});

test("NBA Var: Professional spacing mismatch inflates variance", () => {
  const result = applyNbaVarianceToMeans({
    sport: "NBA",
    homeThreePointRate: 0.35,
    awayThreePointRate: 0.46, // Extremely high volume
    homeOppThreePtAllowed: 0.31, // Elite perimeter defense
    awayOppThreePtAllowed: 0.36,
    homeRestDays: 2,
    awayRestDays: 2,
  });

  assert.equal(result.empty, false);
  
  // Away team facing elite defense drops efficiency
  assert.ok(result.muA < 0.99);
  
  // Chaos injection should max out near +0.025 due to variance swings
  assert.ok(result.chaosAdd > 0.02);
});

test("NBA Var: Empty Look Law strictly enforces non-NBA sports", () => {
  const result = applyNbaVarianceToMeans({
    sport: "NCAAB",
    homeThreePointRate: 0.42,
    awayThreePointRate: 0.33,
    homeOppThreePtAllowed: 0.38,
    awayOppThreePtAllowed: 0.38,
  });

  assert.equal(result.empty, true);
  assert.equal(result.muH, 1.0);
  assert.equal(result.chaosAdd, 0);
});
