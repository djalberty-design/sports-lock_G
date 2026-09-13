import assert from "node:assert/strict";
import { test } from "node:test";
import { kickHourEt, restEffect } from "./rest.ts";

test("NBA home B2B hurts the home side", () => {
  const r = restEffect({ sport: "NBA", homeRestDays: 1, awayRestDays: 3 });
  assert.equal(r.empty, false);
  assert.ok(r.layerHome < 0.48);
  assert.ok(r.homeMeanMul < 1);
});

test("MLB bullpen B2B hurts the tired home side", () => {
  const r = restEffect({ sport: "MLB", homeRestDays: 0.8, awayRestDays: 2 });
  assert.ok(r.layerHome < 0.49);
});

test("NFL short week vs bye is not a coin flip", () => {
  const r = restEffect({ sport: "NFL", homeRestDays: 5, awayRestDays: 14 });
  assert.ok(r.layerHome < 0.49);
});

test("empty rest stays empty", () => {
  const r = restEffect({ sport: "NBA" });
  assert.equal(r.empty, true);
  assert.equal(r.layerHome, 0.5);
});

test("afternoon ET start extra-cuts a tired away side", () => {
  const start = "2026-01-15T18:00:00.000Z";
  assert.ok((kickHourEt(start) ?? 99) < 17);
  const plain = restEffect({ sport: "NBA", homeRestDays: 3, awayRestDays: 1 });
  const early = restEffect({ sport: "NBA", homeRestDays: 3, awayRestDays: 1, start });
  assert.ok(early.layerHome > plain.layerHome);
});
