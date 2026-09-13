import assert from "node:assert/strict";
import { test } from "node:test";
import { FAIR_BLEND, blendFair } from "./sim.ts";

test("v7 fair blend is 0.5 sim / 0.3 pool / 0.2 market", () => {
  assert.equal(FAIR_BLEND.sim, 0.5);
  assert.equal(FAIR_BLEND.pool, 0.3);
  assert.equal(FAIR_BLEND.market, 0.2);
  const mixed = blendFair(0.6, 0.5, 0.4);
  assert.ok(Math.abs(mixed - (0.5 * 0.6 + 0.3 * 0.5 + 0.2 * 0.4)) < 1e-12);
});

test("missing layer drops out and renormalizes — no dummy 50/50", () => {
  const onlySim = blendFair(0.7, undefined, undefined);
  assert.equal(onlySim, 0.7);
  const simMarket = blendFair(0.7, undefined, 0.4);
  assert.ok(Math.abs(simMarket - (0.5 * 0.7 + 0.2 * 0.4) / 0.7) < 1e-12);
});
