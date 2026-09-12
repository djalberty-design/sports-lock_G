import assert from "node:assert/strict";
import { test } from "node:test";
import { allowedForStat, looksFromFile, parseTeamStatistics, processFromLooks, processSourceName, underlyingOffense, underlyingPitch } from "./looks.ts";

const sample = {
  team: { displayName: "Philadelphia Phillies", abbreviation: "PHI" },
  results: {
    stats: {
      categories: [
        {
          name: "batting",
          stats: [
            { name: "teamGamesPlayed", value: 143 },
            { name: "OPS", value: 0.713 },
            { name: "avg", value: 0.242 },
            { name: "onBasePct", value: 0.312 },
            { name: "slugAvg", value: 0.4 },
            { name: "isolatedPower", value: 0.158 },
            { name: "runs", value: 641 },
          ],
        },
        {
          name: "pitching",
          stats: [
            { name: "ERA", value: 3.99 },
            { name: "WHIP", value: 1.28 },
            { name: "opponentOPS", value: 0.712 },
            { name: "strikeoutsPerNineInnings", value: 9.9 },
          ],
        },
      ],
    },
    splits: [
      {
        abbreviation: "vs. ATL",
        name: "Atlanta Braves",
        categories: [
          { name: "batting", stats: [{ name: "OPS", value: 0.79 }, { name: "teamGamesPlayed", value: 3 }] },
          { name: "pitching", stats: [{ name: "ERA", value: 2.45 }, { name: "winPct", value: 0.667 }] },
        ],
      },
      {
        abbreviation: "Home",
        name: "Home",
        categories: [{ name: "batting", stats: [{ name: "OPS", value: 0.74 }, { name: "teamGamesPlayed", value: 72 }] }],
      },
      {
        abbreviation: "Away",
        name: "Away",
        categories: [{ name: "batting", stats: [{ name: "OPS", value: 0.68 }, { name: "teamGamesPlayed", value: 71 }] }],
      },
      {
        abbreviation: "Last seven days",
        name: "Last 7 Days",
        categories: [
          { name: "batting", stats: [{ name: "OPS", value: 0.81 }, { name: "isolatedPower", value: 0.2 }] },
          { name: "pitching", stats: [{ name: "ERA", value: 3.1 }] },
        ],
      },
      {
        abbreviation: "vs. Left",
        name: "vs. Left",
        categories: [{ name: "batting", stats: [{ name: "OPS", value: 0.69 }] }],
      },
      {
        abbreviation: "vs. Right",
        name: "vs. Right",
        categories: [{ name: "batting", stats: [{ name: "OPS", value: 0.73 }] }],
      },
    ],
  },
};

test("same ESPN statistics JSON always parses the same looks", () => {
  const a = parseTeamStatistics(sample);
  const b = parseTeamStatistics(sample);
  assert.deepEqual(a, b);
  assert.ok(a);
  assert.equal(a!.season.ops, 0.713);
  assert.equal(a!.season.era, 3.99);
  assert.equal(a!.season.iso, 0.158);
});

test("vs-opponent / home / last-7 / vs-hand splits are live looks, not stickers", () => {
  const file = parseTeamStatistics(sample)!;
  const looks = looksFromFile(file, "ATL");
  assert.ok(looks.vsOpp);
  assert.equal(looks.vsOpp!.ops, 0.79);
  assert.equal(looks.vsOpp!.n, 3);
  assert.equal(looks.home?.ops, 0.74);
  assert.equal(looks.away?.ops, 0.68);
  assert.equal(looks.last7?.ops, 0.81);
  assert.equal(looks.vsLeft?.ops, 0.69);
  assert.equal(looks.vsRight?.ops, 0.73);
});

test("underlying offense uses OBP+ISO, not raw run luck", () => {
  const file = parseTeamStatistics(sample)!;
  const u = underlyingOffense(file.season);
  assert.ok(u);
  assert.ok(u! > 0.3 && u! < 0.5);
  const hot = underlyingOffense({ obp: 0.4, iso: 0.25 });
  const cold = underlyingOffense({ obp: 0.28, iso: 0.1 });
  assert.ok(hot! > cold!);
});

test("underlying pitch prefers lower ERA / WHIP / opponent OPS", () => {
  const good = underlyingPitch({ era: 2.8, whip: 1.05, oppOps: 0.62 });
  const bad = underlyingPitch({ era: 5.4, whip: 1.5, oppOps: 0.8 });
  assert.ok(good);
  assert.ok(bad);
  assert.ok(good! > bad!);
});

test("allowedForStat never treats own yards as opponent-allowed", () => {
  const ownOnly = looksFromFile({
    team: "Chiefs",
    abbr: "KC",
    season: { passYdsG: 231, rushYdsG: 106, ptsG: 21.3 },
    splits: {},
  });
  assert.equal(allowedForStat(ownOnly, "pass"), null);
  assert.equal(allowedForStat(ownOnly, "rush"), null);
  assert.equal(allowedForStat(ownOnly, "points"), null);
  const withAllowed = looksFromFile({
    team: "Chiefs",
    abbr: "KC",
    season: { passYdsG: 231, passAllowed: 210, ptsAllowed: 18.4 },
    splits: {},
  });
  assert.equal(allowedForStat(withAllowed, "pass"), 210);
  assert.equal(allowedForStat(withAllowed, "points"), 18.4);
});

test("MLB process is Statcast xwOBA only — ISO/ERA is Looked, never invented", () => {
  assert.equal(processSourceName("MLB"), "Statcast / Baseball Savant");
  const isoOnly = processFromLooks(
    "MLB",
    { team: "Phillies", season: { iso: 0.18, ops: 0.75, era: 3.4 } },
    { team: "Braves", season: { iso: 0.16, ops: 0.71, era: 3.9 } },
  );
  assert.equal(isoOnly.empty, true);
  assert.equal(isoOnly.ran, false);
  assert.equal(isoOnly.home, 0.5);
  assert.match(isoOnly.source, /Statcast|Savant/);
  const withXwoba = processFromLooks(
    "MLB",
    { team: "Phillies", season: { xwoba: 0.34, iso: 0.18 } },
    { team: "Braves", season: { xwoba: 0.3, iso: 0.16 } },
  );
  assert.equal(withXwoba.empty, false);
  assert.equal(withXwoba.ran, true);
  assert.ok(withXwoba.home > 0.5);
  assert.match(withXwoba.source, /Statcast|Savant/);
});

