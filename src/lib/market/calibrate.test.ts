import assert from "node:assert/strict";
import { test } from "node:test";
import {
  calibratedChance,
  reliabilityMap,
  reliabilityTable,
  tailPrior,
} from "./calibrate.ts";

test("tail prior lifts a 6% print and cuts a 94% print", () => {
  assert.ok(tailPrior(0.06) > 0.06);
  assert.ok(tailPrior(0.06) < 0.15);
  assert.ok(tailPrior(0.94) < 0.94);
  assert.ok(tailPrior(0.94) > 0.85);
  assert.equal(tailPrior(0.57), 0.57);
});

test("ledger bucket with enough tickets replaces the prior", () => {
  const rows = Array.from({ length: 20 }, (_, i) => ({ p: 0.22, hit: i < 8 }));
  const table = reliabilityTable(rows);
  const mapped = reliabilityMap(0.22, table);
  assert.ok(mapped > 0.22);
  assert.ok(mapped < 0.5);
});

test("displayed chance is reliability, not a shrink toward the book", () => {
  const fair = 0.57;
  const implied = 0.524;
  const ml = calibratedChance(fair, implied, 1, []);
  const thin = calibratedChance(fair, implied, 0.36, []);
  assert.ok(Math.abs(ml - fair) < 0.01);
  assert.ok(thin < ml);
});
