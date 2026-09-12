import assert from "node:assert/strict";
import { test } from "node:test";
import { DESK_VERSION } from "./rules.ts";
import { deskSeed, Pcg64 } from "./seed.ts";
import { blendFair, drawPaths, latentFromScores, simCover, simOver, simWin } from "./sim.ts";
import { isKnownMarket, unknownMarketReason } from "./registry.ts";

test("same seed yields the same path stream", () => {
  const g = latentFromScores({
    eventId: "nfl-kc-bal",
    sport: "NFL",
    homeWin: 0.57,
    total: 47.5,
    homeSpread: -3.5,
  });
  const a = drawPaths(g, "snap-1", 400);
  const b = drawPaths(g, "snap-1", 400);
  assert.equal(a.length, b.length);
  assert.equal(a[0]!.h, b[0]!.h);
  assert.equal(a[0]!.a, b[0]!.a);
  const wa = simWin(a).p;
  const wb = simWin(b).p;
  assert.equal(wa, wb);
});

test("desk seed is a pure function of version + snapshot + event", () => {
  const x = deskSeed(DESK_VERSION, "s", "e1");
  const y = deskSeed(DESK_VERSION, "s", "e1");
  const z = deskSeed(DESK_VERSION, "s", "e2");
  assert.equal(x, y);
  assert.notEqual(x, z);
});

test("PCG64 has no wall-clock entropy", () => {
  const a = new Pcg64(1n);
  const b = new Pcg64(1n);
  assert.equal(a.float(), b.float());
});

test("NFL paths put extra mass on 3 and 7", () => {
  const g = latentFromScores({ eventId: "nfl-x", sport: "NFL", homeWin: 0.5, total: 44.5 });
  const paths = drawPaths(g, "snap", 4000);
  const key = paths.filter((p) => {
    const m = Math.round(p.h - p.a);
    return m === 3 || m === -3 || m === 7 || m === -7;
  }).length;
  assert.ok(key > 100, `expected 3/7 spike, got ${key}`);
});

test("blendFair without sim is closed form — never a fake sim %", () => {
  assert.equal(blendFair(undefined, 0.6, 0.55), 0.6);
  assert.ok(Math.abs(blendFair(undefined, 0.6, 0.55) - 0.6) < 1e-9);
});


test("sim cover and over are path statistics", () => {
  const g = latentFromScores({ eventId: "mlb-1", sport: "MLB", homeWin: 0.55, total: 8.5 });
  const paths = drawPaths(g, "s", 800);
  const cover = simCover(paths, -1.5);
  const over = simOver(paths, 8.5);
  assert.ok(cover.p > 0.15 && cover.p < 0.85);
  assert.ok(over.p > 0.15 && over.p < 0.85);
});

test("unknown Hard Rock markets stand down", () => {
  assert.equal(isKnownMarket("Kansas City to win", "ml"), true);
  assert.equal(isKnownMarket("Player A anytime TD", "prop"), true);
  assert.equal(isKnownMarket("quantum spin prop xyz", "prop"), false);
  assert.match(unknownMarketReason("quantum spin prop xyz"), /Unknown Hard Rock market/);
});
