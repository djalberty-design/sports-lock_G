import assert from "node:assert/strict";
import { test } from "node:test";
import { combineParlayFair } from "./joint-grade.ts";

test("cross-game is the product", () => {
  const out = combineParlayFair([
    { eventId: "a", marketType: "ml", side: "home", fairProb: 0.6 },
    { eventId: "b", marketType: "ml", side: "away", fairProb: 0.5 },
  ]);
  assert.equal(out.correlation, "near-independent");
  assert.ok(Math.abs(out.combinedFair - 0.3) < 1e-9);
});

test("same-game ML + spread uses Clayton, not the haircut table", () => {
  const out = combineParlayFair([
    { eventId: "g1", marketType: "ml", side: "home", fairProb: 0.6 },
    { eventId: "g1", marketType: "spread", side: "home", fairProb: 0.55 },
  ]);
  assert.equal(out.correlation, "shared-latent");
  assert.ok(out.combinedFair > 0.6 * 0.55);
  assert.ok(out.combinedFair < 0.55);
});

test("missing probabilities fall back to the haircut", () => {
  const out = combineParlayFair([
    { eventId: "g1", marketType: "ml", side: "home" },
    { eventId: "g1", marketType: "total", side: "over" },
  ]);
  assert.equal(out.correlation, "fallback-haircut");
});
