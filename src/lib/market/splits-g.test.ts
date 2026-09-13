import assert from "node:assert/strict";
import { test } from "node:test";
import { applySplitsToMeans, splitLayers } from "./splits-g.ts";

test("empty tape stays empty", () => {
  const layers = splitLayers({ sport: "NFL", home: "A", away: "B" });
  assert.ok(layers.every((l) => l.empty));
  const m = applySplitsToMeans({ sport: "NFL", home: "A", away: "B" }, 22, 22);
  assert.equal(m.empty, true);
  assert.equal(m.muH, 22);
});

test("posted vs-opp looks fire H2H without inventing a series", () => {
  const layers = splitLayers({
    sport: "MLB",
    home: "Phillies",
    away: "Braves",
    homeLooks: { team: "Phillies", season: {}, vsOpp: { ops: 0.79, n: 6 } },
    awayLooks: { team: "Braves", season: {}, vsOpp: { ops: 0.7, n: 6 } },
  });
  const h2h = layers.find((l) => l.id === "h2h")!;
  assert.equal(h2h.empty, false);
  assert.ok(h2h.home > 0.5);
});

test("home/road bags fire venue-split", () => {
  const layers = splitLayers({
    sport: "MLB",
    home: "Phillies",
    away: "Braves",
    homeLooks: { team: "Phillies", season: {}, home: { ops: 0.74 } },
    awayLooks: { team: "Braves", season: {}, away: { ops: 0.68 } },
  });
  const v = layers.find((l) => l.id === "venue-split")!;
  assert.equal(v.empty, false);
  assert.ok(v.home > 0.5);
});
