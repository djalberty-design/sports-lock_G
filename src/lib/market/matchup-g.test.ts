import assert from "node:assert/strict";
import { test } from "node:test";
import { applyMatchupToMeans, matchupLayers } from "./matchup-g.ts";

test("empty looks stay empty", () => {
  const layers = matchupLayers({ sport: "NFL" });
  assert.ok(layers.every((l) => l.empty));
});

test("Phillies/Braves posted looks fire defense, underlying, platoon, pitcher", () => {
  const homeLooks = {
    team: "Phillies",
    season: { ops: 0.71, obp: 0.31, iso: 0.16, era: 3.99, whip: 1.28, oppOps: 0.71 },
    vsOpp: { ops: 0.79, n: 6, era: 2.45 },
    home: { ops: 0.74 },
    last7: { ops: 0.81, iso: 0.2, obp: 0.34, era: 3.1 },
    vsLeft: { ops: 0.69 },
    vsRight: { ops: 0.73 },
  };
  const awayLooks = {
    team: "Braves",
    season: { ops: 0.74, obp: 0.32, iso: 0.18, era: 3.5, whip: 1.2, oppOps: 0.68 },
    vsOpp: { ops: 0.7, n: 6, era: 4.1 },
    away: { ops: 0.68 },
    last7: { ops: 0.7, iso: 0.14, obp: 0.3, era: 4.4 },
    vsLeft: { ops: 0.72 },
    vsRight: { ops: 0.75 },
  };
  const layers = matchupLayers({
    sport: "MLB",
    homeLooks,
    awayLooks,
    homePitcherHand: "L",
    awayPitcherHand: "R",
    homeEra: 3.2,
    awayEra: 4.1,
  });
  for (const id of ["defense", "underlying", "platoon", "pitcher"]) {
    assert.equal(layers.find((l) => l.id === id)?.empty, false, id);
  }
  const m = applyMatchupToMeans(
    { sport: "MLB", homeLooks, awayLooks, homePitcherHand: "L", awayPitcherHand: "R", homeEra: 3.2, awayEra: 4.1, homeWhip: 1.1, awayWhip: 1.3 },
    4.4,
    4.4,
  );
  assert.equal(m.empty, false);
  assert.ok(m.muH !== 4.4 || m.muA !== 4.4);
});

test("bullpen exhaustion inflates opponent means and chaos", () => {
  const base = applyMatchupToMeans(
    { 
      sport: "MLB", 
      homePitcherHand: "L", 
      awayPitcherHand: "R", 
      homeEra: 3.2, 
      awayEra: 4.1, 
      homeWhip: 1.1, 
      awayWhip: 1.3,
      homeBullpenXfip: 4.2,
      awayBullpenXfip: 4.2,
      homeBullpenRest: 0.8,
      awayBullpenRest: 0.8
    },
    4.4,
    4.4,
  );

  const exhausted = applyMatchupToMeans(
    { 
      sport: "MLB", 
      homePitcherHand: "L", 
      awayPitcherHand: "R", 
      homeEra: 3.2, 
      awayEra: 4.1, 
      homeWhip: 1.1, 
      awayWhip: 1.3,
      homeBullpenXfip: 4.2, // normal bullpen
      awayBullpenXfip: 5.5, // terrible bullpen
      homeBullpenRest: 0.8,
      awayBullpenRest: 0.1 // critically exhausted
    },
    4.4,
    4.4,
  );

  // Exhausted away bullpen -> Home scoring mean should drastically increase
  assert.ok(exhausted.muH > base.muH);
  assert.ok(exhausted.chaosAdd > base.chaosAdd);
});

test("missing bullpen data decays smoothly back to starter logic", () => {
  const missing = applyMatchupToMeans(
    { 
      sport: "MLB", 
      homePitcherHand: "L", 
      awayPitcherHand: "R", 
      homeEra: 3.2, 
      awayEra: 4.1, 
      homeWhip: 1.1, 
      awayWhip: 1.3
      // No bullpen data
    },
    4.4,
    4.4,
  );
  
  assert.equal(missing.empty, false);
  assert.ok(missing.muH > 0);
  assert.ok(missing.muA > 0);
});
