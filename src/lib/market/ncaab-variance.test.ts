import { test } from "node:test";
import * as assert from "node:assert";
import { applyNcaabVarianceToMeans } from "./ncaab-variance.ts";

test("NCAAB Var: Low roster continuity and weak SOS regresses scoring efficiency", () => {
  const result = applyNcaabVarianceToMeans({
    sport: "NCAAB",
    homeTransferPortalIndex: 0.1, // 90% roster turnover
    awayTransferPortalIndex: 0.8, // Good continuity
    sosAdjustment: 0.6, // Weak non-conference schedule
    isLateGameFoulRisk: false,
  });

  assert.equal(result.empty, false);
  
  // Home team is a paper tiger. Should be penalized up to ~4% (multiplier around 0.96)
  assert.ok(result.muH <= 0.97);
  
  // Away team has good continuity (0.8), ignores penalty
  assert.equal(result.muA, 1.0);
  
  // No late game foul risk
  assert.equal(result.chaosAdd, 0);
});

test("NCAAB Var: Tight spread game with late foul risk spikes variance", () => {
  const result = applyNcaabVarianceToMeans({
    sport: "NCAAB",
    homeTransferPortalIndex: 0.8,
    awayTransferPortalIndex: 0.8,
    sosAdjustment: 1.2, // Elite schedule
    isLateGameFoulRisk: true, // Margin within 5 points down the stretch
  });

  assert.equal(result.empty, false);
  
  // No continuity penalty
  assert.equal(result.muH, 1.0);
  assert.equal(result.muA, 1.0);
  
  // High variance injected for late game fouling
  assert.equal(result.chaosAdd, 0.04);
});

test("NCAAB Var: Empty Look Law explicitly stands down if missing metrics", () => {
  const result = applyNcaabVarianceToMeans({
    sport: "NCAAB",
    homeTransferPortalIndex: 0.8,
    // awayTransferPortalIndex missing
    sosAdjustment: 1.0,
    isLateGameFoulRisk: true,
  });

  assert.equal(result.empty, true);
  assert.equal(result.muH, 1.0);
  assert.equal(result.chaosAdd, 0);
});

test("NCAAB Var: Ignores non-NCAAB sports", () => {
  const result = applyNcaabVarianceToMeans({
    sport: "NBA",
    homeTransferPortalIndex: 0.1,
    awayTransferPortalIndex: 0.1,
    sosAdjustment: 0.5,
  });

  assert.equal(result.empty, true);
});
