import assert from "node:assert/strict";
import { test } from "node:test";
import { applyProcessToMeans } from "./process-g.ts";
import type { TeamLooks } from "./looks.ts";

function looks(epa: number): TeamLooks {
  return { season: { epa }, last7: { epa } } as TeamLooks;
}

test("NFL EPA lean raises the better offense mean", () => {
  const r = applyProcessToMeans(
    { sport: "NFL", homeLooks: looks(0.12), awayLooks: looks(-0.08) },
    22,
    22,
  );
  assert.equal(r.empty, false);
  assert.ok(r.muH > r.muA);
});

test("missing process file stays empty and does not invent", () => {
  const r = applyProcessToMeans({ sport: "MLB" }, 4.4, 4.4);
  assert.equal(r.empty, true);
  assert.equal(r.muH, 4.4);
  assert.equal(r.muA, 4.4);
});

test("PF/PA efficiency still moves G when process file is empty", () => {
  const r = applyProcessToMeans(
    { sport: "NBA", homePf: 118, homePa: 108, awayPf: 110, awayPa: 116 },
    110,
    110,
  );
  assert.equal(r.empty, false);
  assert.ok(r.muH > r.muA);
});
