import assert from "node:assert/strict";
import { test } from "node:test";
import { buildPropChance, parsePropSelection, propStakeHaircut } from "./props.ts";

test("parses NFL passing-yards over", () => {
  const p = parsePropSelection("Patrick Mahomes over 249.5 passing yards", "NFL");
  assert.equal(p.player, "Patrick Mahomes");
  assert.equal(p.stat, "pass_yds");
  assert.equal(p.side, "over");
  assert.equal(p.line, 249.5);
  assert.equal(p.counting, true);
});

test("parses anytime touchdown as yes", () => {
  const p = parsePropSelection("Tyreek Hill anytime touchdown", "NFL");
  assert.equal(p.stat, "anytime_td");
  assert.equal(p.side, "yes");
  assert.equal(p.counting, false);
});

test("parses NBA points and MLB strikeouts", () => {
  const nba = parsePropSelection("Jayson Tatum under 27.5 points", "NBA");
  assert.equal(nba.stat, "points");
  assert.equal(nba.side, "under");
  assert.equal(nba.line, 27.5);
  const mlb = parsePropSelection("Tarik Skubal over 6.5 strikeouts", "MLB");
  assert.equal(mlb.stat, "ks");
  assert.equal(mlb.line, 6.5);
});

test("parses NHL shots on goal", () => {
  const p = parsePropSelection("Auston Matthews over 3.5 shots on goal", "NHL");
  assert.equal(p.stat, "shots");
  assert.equal(p.line, 3.5);
});

test("college player bets are blocked", () => {
  const r = buildPropChance({
    sport: "NCAAB",
    selection: "Cooper Flagg over 18.5 points",
    price: -115,
    home: "Duke",
    away: "Kansas",
  });
  assert.equal(r.illegal, true);
  assert.equal(r.standDown, true);
  assert.match(r.because, /not allowed/i);
});

test("listed-out player stands down", () => {
  const r = buildPropChance({
    sport: "NFL",
    selection: "Saquon Barkley over 80.5 rushing yards",
    price: -115,
    player: "Saquon Barkley",
    home: "Eagles",
    away: "Cowboys",
    injuries: [{ player: "Saquon Barkley", status: "Out" }],
  });
  assert.equal(r.standDown, true);
  assert.match(r.customize, /Stand down/i);
});

test("high game total leans over on counting stats vs a low total", () => {
  const high = buildPropChance({
    sport: "NFL",
    selection: "Patrick Mahomes over 249.5 passing yards",
    price: -115,
    home: "Chiefs",
    away: "Raiders",
    gameTotal: 54.5,
  });
  const low = buildPropChance({
    sport: "NFL",
    selection: "Patrick Mahomes over 249.5 passing yards",
    price: -115,
    home: "Chiefs",
    away: "Raiders",
    gameTotal: 36.5,
  });
  assert.ok(high.layers.some((l) => l.id === "total"));
  assert.ok(high.over > low.over);
});

test("wind cuts a passing-yards over", () => {
  const calm = buildPropChance({
    sport: "NFL",
    selection: "Patrick Mahomes over 249.5 passing yards",
    price: -110,
    home: "Chiefs",
    away: "Bears",
    weatherWind: 4,
  });
  const windy = buildPropChance({
    sport: "NFL",
    selection: "Patrick Mahomes over 249.5 passing yards",
    price: -110,
    home: "Chiefs",
    away: "Bears",
    weatherWind: 24,
  });
  assert.ok(windy.layers.some((l) => l.id === "weather"));
  assert.ok(windy.over < calm.over);
});

test("Coors Field boosts a hits over", () => {
  const coors = buildPropChance({
    sport: "MLB",
    selection: "Shohei Ohtani over 1.5 hits",
    price: -120,
    home: "Rockies",
    away: "Dodgers",
    venue: "Coors Field",
  });
  const petco = buildPropChance({
    sport: "MLB",
    selection: "Shohei Ohtani over 1.5 hits",
    price: -120,
    home: "Padres",
    away: "Dodgers",
    venue: "Petco Park",
  });
  assert.ok(coors.over > petco.over);
});

test("photographed over is the customized side when the model agrees", () => {
  const r = buildPropChance({
    sport: "NBA",
    selection: "Nikola Jokic over 24.5 points",
    price: -130,
    home: "Nuggets",
    away: "Lakers",
    gameTotal: 238,
  });
  assert.ok(r.hit > 0.4);
  assert.ok(r.customize.length > 20);
  assert.equal(r.illegal, false);
});

test("player-bet stake is half a usual unit, floor $1", () => {
  assert.equal(propStakeHaircut(2), 1);
  assert.equal(propStakeHaircut(10), 5);
});

test("every leftover look always runs — last-10, defense, usage, pitcher, underlying, platoon", () => {
  const r = buildPropChance({
    sport: "MLB",
    selection: "Kyle Schwarber over 1.5 hits",
    price: -115,
    home: "Phillies",
    away: "Braves",
    seasonRate: 1.8,
    recentRate: 2.2,
    recentN: 10,
    oppAllowed: 5.1,
    pitcherEra: 5.4,
    usageMin: undefined,
    ownUnderlying: 0.44,
    pitcherHand: "R",
    vsHandOps: 0.79,
  });
  const ids = r.layers.map((l) => l.id);
  for (const id of ["last10", "defense", "usage", "pitcher", "underlying", "platoon", "process"]) {
    assert.ok(ids.includes(id), `missing ${id}`);
  }
  assert.equal(r.layers.find((l) => l.id === "last10")?.empty, undefined);
  assert.equal(r.layers.find((l) => l.id === "usage")?.empty, true);
  assert.equal(r.layers.find((l) => l.id === "process")?.empty, true);
  assert.match(r.layers.find((l) => l.id === "process")!.label, /Statcast|Savant/);
  assert.ok(r.over > 0.5);
});

test("empty live feed still stamps last-10 / defense, never skips", () => {
  const r = buildPropChance({
    sport: "NFL",
    selection: "Patrick Mahomes over 249.5 passing yards",
    price: -115,
    home: "Chiefs",
    away: "Raiders",
  });
  const ids = r.layers.map((l) => l.id);
  assert.ok(ids.includes("last10"));
  assert.ok(ids.includes("defense"));
  assert.ok(ids.includes("usage"));
  assert.ok(ids.includes("pitcher"));
  assert.ok(ids.includes("underlying"));
  assert.ok(ids.includes("process"));
  assert.ok(r.layers.find((l) => l.id === "last10")?.empty);
  assert.ok(r.layers.find((l) => l.id === "process")?.empty);
});

test("MLB process Ran only when xwOBA is posted — ISO is not Statcast", () => {
  const looked = buildPropChance({
    sport: "MLB",
    selection: "Yordan Alvarez over 2.5",
    price: -115,
    home: "Astros",
    away: "Mariners",
    homeLooks: { team: "Astros", season: { iso: 0.2, era: 3.5 } },
    awayLooks: { team: "Mariners", season: { iso: 0.16, era: 3.8 } },
  });
  const process = looked.layers.find((l) => l.id === "process")!;
  assert.equal(process.empty, true);
  assert.match(process.label, /Statcast|Savant/);
  const ran = buildPropChance({
    sport: "MLB",
    selection: "Yordan Alvarez over 2.5",
    price: -115,
    home: "Astros",
    away: "Mariners",
    homeLooks: { team: "Astros", season: { xwoba: 0.36 } },
    awayLooks: { team: "Mariners", season: { xwoba: 0.31 } },
  });
  const p2 = ran.layers.find((l) => l.id === "process")!;
  assert.equal(p2.empty, undefined);
  assert.match(p2.label, /Statcast|Savant/);
  assert.match(p2.note, /posted/i);
});
