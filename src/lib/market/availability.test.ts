import assert from "node:assert/strict";
import { test } from "node:test";
import { availabilityEffect } from "./availability.ts";

test("NBA home outs cut home mean and the win layer", () => {
  const a = availabilityEffect({ sport: "NBA", homeOuts: 2, awayOuts: 0 });
  assert.equal(a.empty, false);
  assert.ok(a.homeMeanMul < 0.95);
  assert.ok(a.layerHome < 0.48);
});

test("questionable is weaker than listed out", () => {
  const out = availabilityEffect({ sport: "NFL", homeOuts: 2, awayOuts: 0 });
  const q = availabilityEffect({ sport: "NFL", homeOuts: 0, awayOuts: 0, homeQuestionable: 2 });
  assert.ok(out.homeMeanMul < q.homeMeanMul);
  assert.ok(q.chaosAdd > 0);
});

test("empty report stays empty", () => {
  const a = availabilityEffect({ sport: "MLB" });
  assert.equal(a.empty, true);
  assert.equal(a.layerHome, 0.5);
});

test("0-0 is a healthy look, not empty", () => {
  const a = availabilityEffect({ sport: "NHL", homeOuts: 0, awayOuts: 0 });
  assert.equal(a.empty, false);
  assert.ok(Math.abs(a.layerHome - 0.5) < 0.01);
});
