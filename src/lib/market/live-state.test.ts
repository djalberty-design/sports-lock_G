import assert from "node:assert/strict";
import { test } from "node:test";
import { clockFractionLeft, leftoverOverProb, remainingMean } from "./live-state.ts";

test("remainingMean is leftover × clock, not a haircut of the pre-game mean", () => {
  const rem = remainingMean(8.5, 4, 0.5);
  assert.ok(rem > 0);
  assert.ok(rem < 8.5 - 4);
});

test("clockFractionLeft shrinks as the period advances", () => {
  const early = clockFractionLeft("NFL", 1, "14:00");
  const late = clockFractionLeft("NFL", 4, "2:00");
  assert.ok(early > late);
  assert.ok(late > 0.04);
});

test("leftover over is near-locked when already exceeds the line", () => {
  const p = leftoverOverProb({ sport: "MLB", postedTotal: 8.5, already: 12, period: "8" });
  assert.equal(p, 0.99);
});
