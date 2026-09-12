import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateBookFee, earlyMover, feeFromHold, lineShiftAlert, timingKind } from "./edge.ts";

test("−110 / −110 is about a 4.8% sportsbook fee", () => {
  const f = calculateBookFee(-110, -110);
  assert.ok(f.holdPct > 4.4 && f.holdPct < 5.2);
  assert.equal(f.verdict, "Fair Price");
});

test("hold over 9% is Overpriced (Avoid)", () => {
  const f = feeFromHold(0.095);
  assert.equal(f.verdict, "Overpriced (Avoid)");
});

test("steam stamps Lock This Now", () => {
  assert.equal(timingKind({ steam: true }), "lock-now");
  assert.equal(timingKind({ tapeLean: "public", favorite: true }), "wait");
  assert.equal(timingKind({ tapeLean: "neutral" }), null);
});

test("early mover is > 5 pts vs Hard Rock", () => {
  assert.equal(earlyMover(0.52, 0.6), true);
  assert.equal(earlyMover(0.52, 0.54), false);
});

test("line shift names both prices and the new edge", () => {
  const line = lineShiftAlert(-110, -125, 0.55);
  assert.ok(line);
  assert.match(line!, /Line Shift Detected/);
  assert.match(line!, /-125/);
  assert.match(line!, /-110/);
  assert.match(line!, /Smart Value|Fair Price|Overpriced/);
});
