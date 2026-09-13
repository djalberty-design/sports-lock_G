import assert from "node:assert/strict";
import { test } from "node:test";
import { applyRecencyToMeans } from "./recency-g.ts";

test("hot home last-10 raises home mean", () => {
  const games = (results: string[], pf: number) =>
    results.map((result) => ({ result, pf, pa: pf - 7 }));
  const r = applyRecencyToMeans(
    {
      sport: "NBA",
      home: "Celtics",
      away: "Pistons",
      lastFive: [
        { team: "Celtics", results: ["W", "W", "W", "W", "W"], games: games(["W", "W", "W", "W", "W"], 120) },
        { team: "Pistons", results: ["L", "L", "L", "L", "L"], games: games(["L", "L", "L", "L", "L"], 98) },
      ],
    },
    110,
    110,
  );
  assert.equal(r.empty, false);
  assert.ok(r.muH > r.muA);
});

test("missing tape stays empty", () => {
  const r = applyRecencyToMeans({ sport: "MLB", home: "A", away: "B" }, 4.4, 4.4);
  assert.equal(r.empty, true);
  assert.equal(r.muH, 4.4);
});

test("NFL week-1 sample is damped vs a full NBA log", () => {
  const three = ["W", "W", "L"].map((result) => ({ result, pf: 27, pa: 20 }));
  const nfl = applyRecencyToMeans(
    {
      sport: "NFL",
      home: "Chiefs",
      away: "Jets",
      lastFive: [
        { team: "Chiefs", results: ["W", "W", "L"], games: three },
        { team: "Jets", results: ["L", "L", "W"], games: ["L", "L", "W"].map((result) => ({ result, pf: 13, pa: 24 })) },
      ],
    },
    22,
    22,
  );
  const nba = applyRecencyToMeans(
    {
      sport: "NBA",
      home: "Chiefs",
      away: "Jets",
      lastFive: [
        { team: "Chiefs", results: ["W", "W", "L"], games: three },
        { team: "Jets", results: ["L", "L", "W"], games: ["L", "L", "W"].map((result) => ({ result, pf: 13, pa: 24 })) },
      ],
    },
    22,
    22,
  );
  assert.ok(Math.abs(nba.muH - nba.muA) > Math.abs(nfl.muH - nfl.muA));
});
