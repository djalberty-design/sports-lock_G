import assert from "node:assert/strict";
import { test } from "node:test";
import { homeCoverProb, overProb, poissonOver } from "./chance.ts";
import { altLines, buildSheet, countOver, seedTemplate } from "./sheet.ts";
import type { EventResearch, ResearchPlayer } from "./research.ts";
import type { ScanRow } from "./types.ts";

function player(p: Partial<ResearchPlayer> & { name: string; homeAway: "home" | "away" }): ResearchPlayer {
  return {
    id: p.id ?? p.name,
    name: p.name,
    team: p.team ?? (p.homeAway === "home" ? "Dodgers" : "Reds"),
    homeAway: p.homeAway,
    position: p.position ?? "OF",
    starter: p.starter ?? true,
    headshot: p.headshot,
    stats: p.stats ?? {},
  };
}

function mlbRows(): ScanRow[] {
  const t = seedTemplate({
    eventId: "espn-MLB-1",
    sport: "MLB",
    start: "2026-09-07T23:10:00Z",
    home: "Los Angeles Dodgers",
    away: "Cincinnati Reds",
    homeAbbr: "LAD",
    awayAbbr: "CIN",
    homeWin: 0.64,
  });
  return [
    { ...t, marketType: "ml", side: "home", selection: "Dodgers to win", price: -180, fairProb: 0.64, researchOnly: false },
    { ...t, marketType: "ml", side: "away", selection: "Reds to win", price: 150, fairProb: 0.36, researchOnly: false },
    { ...t, marketType: "spread", side: "home", selection: "Dodgers -1.5", price: 125, fairProb: 0.42, point: -1.5, researchOnly: false },
    { ...t, marketType: "spread", side: "away", selection: "Reds +1.5", price: -145, fairProb: 0.58, point: 1.5, researchOnly: false },
    { ...t, marketType: "total", side: "over", selection: "Over 8.5", price: -105, fairProb: 0.51, point: 8.5, total: 8.5, researchOnly: false },
    { ...t, marketType: "total", side: "under", selection: "Under 8.5", price: -115, fairProb: 0.49, point: 8.5, total: 8.5, researchOnly: false },
  ];
}

function research(): EventResearch {
  return {
    eventId: "espn-MLB-1",
    sport: "MLB",
    espnId: "1",
    home: "Los Angeles Dodgers",
    away: "Cincinnati Reds",
    venue: "Dodger Stadium",
    pitchers: [],
    lastFive: [],
    injuries: [],
    headlines: [],
    players: [
      player({ name: "Shohei Ohtani", homeAway: "home", position: "DH", stats: { avg: 0.28, slg: 0.56, hr: 44, rbi: 90, obp: 0.39 } }),
      player({ name: "Freddie Freeman", homeAway: "home", position: "1B", stats: { avg: 0.3, slg: 0.5, hr: 22, rbi: 80 } }),
      player({ name: "Mookie Betts", homeAway: "home", position: "RF", stats: { avg: 0.29, slg: 0.48, hr: 20 } }),
      player({ name: "Elly De La Cruz", homeAway: "away", position: "SS", stats: { avg: 0.26, slg: 0.48, hr: 28 } }),
      player({ name: "Sal Stewart", homeAway: "away", position: "3B", stats: { avg: 0.25 } }),
      player({ name: "Will Smith", homeAway: "home", position: "C", stats: { avg: 0.26, hr: 18 } }),
      player({ name: "Yoshinobu Yamamoto", homeAway: "home", position: "SP", stats: { era: 2.8, ip: 140, k: 170 } }),
      player({ name: "Chase Burns", homeAway: "away", position: "SP", stats: { era: 3.6, ip: 90, k: 110 } }),
    ],
    note: "test",
    homeEra: 2.8,
    awayEra: 3.6,
    total: 8.5,
    homeSpread: -1.5,
  };
}

test("MLB sheet mirrors Hard Rock popular markets", () => {
  const tabs = buildSheet({
    sport: "MLB",
    home: "Los Angeles Dodgers",
    away: "Cincinnati Reds",
    homeNick: "Dodgers",
    awayNick: "Reds",
    rows: mlbRows(),
    research: research(),
    homeWin: 0.64,
  });
  const titles = tabs.popular.map((m) => m.title);
  assert.deepEqual(titles, [
    "To Win",
    "Total Runs",
    "Spread",
    "Batter Home Runs",
    "Hits",
    "Strikeouts",
    "1st Inning Total Runs",
    "Total Bases",
    "Hits+Runs+RBIs",
    "Reds Total Runs",
    "Dodgers Total Runs",
    "Batter Runs",
    "RBIs",
  ]);
  const ml = tabs.popular[0];
  assert.equal(ml.kind, "ml");
  assert.equal(ml.lines[0]?.label, "Dodgers");
  assert.equal(ml.lines[1]?.label, "Reds");
  assert.equal(ml.lines[0]?.single?.price, -180);
  assert.equal(ml.lines[0]?.single?.researchOnly, false);

  const totals = tabs.popular.find((m) => m.id === "total")!;
  assert.equal(totals.kind, "total-ladder");
  const labels = totals.lines.map((l) => l.label);
  assert.equal(labels[0], "8.5");
  assert.equal(labels[1], "7.5");
  assert.ok(labels.includes("4.5"));
  const main = totals.lines.find((l) => l.label === "8.5")!;
  assert.equal(main.left?.researchOnly, false);
  assert.equal(main.left?.price, -105);
  const over45 = totals.lines.find((l) => l.label === "4.5")!;
  assert.ok((over45.left?.price ?? 0) < -200, `over 4.5 should be a favorite, got ${over45.left?.price}`);
  assert.ok((over45.left?.fairProb ?? 0) > (main.left?.fairProb ?? 1));

  const spread = tabs.popular.find((m) => m.id === "spread")!;
  assert.equal(spread.leftHeader, "Reds");
  assert.equal(spread.rightHeader, "Dodgers");
  assert.equal(spread.lines[0]?.left?.point, 1.5);
  const posted = spread.lines.find((l) => l.right?.point === -1.5);
  assert.ok(posted);
  assert.equal(posted!.left?.point, 1.5);
  assert.equal(posted!.right?.researchOnly, false);
  const redsPlus35 = spread.lines.find((l) => l.left?.point === 3.5);
  assert.ok(redsPlus35);
  assert.ok((redsPlus35!.left?.price ?? 0) < -110, `Reds +3.5 should be a favorite, got ${redsPlus35!.left?.price}`);

  const hr = tabs.popular.find((m) => m.id === "hr")!;
  assert.equal(hr.kind, "player-yes");
  assert.equal(hr.lines[0]?.label, "Shohei Ohtani");
  assert.ok((hr.lines[0]?.single?.fairProb ?? 0) > 0.08);
  assert.ok((hr.lines[0]?.single?.fairProb ?? 1) < 0.5);

  const hits = tabs.popular.find((m) => m.id === "hits")!;
  assert.equal(hits.kind, "player-ou");
  const ohtani = hits.lines.find((l) => l.label === "Shohei Ohtani")!;
  assert.ok(ohtani.left && ohtani.right);
  assert.ok(Math.abs((ohtani.left!.fairProb + ohtani.right!.fairProb) - 1) < 0.02);
  assert.equal(ohtani.left?.point, 0.5);

  const ks = tabs.popular.find((m) => m.id === "ks")!;
  assert.ok(ks.lines.length >= 1);
  assert.ok((ks.lines[0]?.left?.point ?? 0) >= 4.5);

  assert.ok(tabs.innings.some((m) => m.title === "1st Inning Total Runs"));
  assert.ok(tabs.props.some((m) => m.title === "Walks"));
  assert.equal(tabs.props.filter((m) => m.lines.length === 0).length, 0);
});

test("college sheets never invent player markets", () => {
  const t = seedTemplate({ sport: "NCAAF", start: "", home: "Florida State", away: "SMU", homeWin: 0.48 });
  const tabs = buildSheet({
    sport: "NCAAF",
    home: "Florida State",
    away: "SMU",
    homeNick: "Seminoles",
    awayNick: "Mustangs",
    rows: [t],
    homeWin: 0.48,
  });
  assert.equal(tabs.props.length, 0);
  assert.deepEqual(
    tabs.popular.map((m) => m.id),
    ["ml", "total", "spread"],
  );
  assert.ok(tabs.quarters.length > 0);
  assert.ok(tabs.halves.length > 0);
});

test("NFL sheet prices passing yards from season totals as a game line", () => {
  const t = seedTemplate({ sport: "NFL", start: "", home: "Chiefs", away: "Raiders", homeWin: 0.62 });
  const tabs = buildSheet({
    sport: "NFL",
    home: "Kansas City Chiefs",
    away: "Las Vegas Raiders",
    homeNick: "Chiefs",
    awayNick: "Raiders",
    rows: [{ ...t, marketType: "total", side: "over", selection: "Over 47.5", price: -110, fairProb: 0.5, point: 47.5 }],
    research: {
      eventId: "e",
      sport: "NFL",
      espnId: "1",
      home: "Kansas City Chiefs",
      away: "Las Vegas Raiders",
      pitchers: [],
      lastFive: [],
      injuries: [],
      headlines: [],
      players: [
        player({
          name: "Patrick Mahomes",
          homeAway: "home",
          position: "QB",
          team: "Chiefs",
          stats: { passYds: 4183 },
        }),
      ],
      note: "t",
    },
    homeWin: 0.62,
  });
  const pass = tabs.props.find((m) => m.id === "pass")!;
  const line = pass.lines[0]?.left?.point ?? 0;
  assert.ok(line > 180 && line < 360, `game passing line should be a game number, got ${line}`);
});

test("alt lines step around the main number", () => {
  assert.deepEqual(altLines(0.5, 1), [1.5, 2.5]);
  assert.ok(altLines(6.5, 1).includes(5.5));
  assert.ok(altLines(6.5, 1).includes(7.5));
});

test("count over and cover models stay in (0,1) and move with the line", () => {
  const easy = poissonOver(1.1, 0.5);
  const hard = poissonOver(1.1, 1.5);
  assert.ok(easy > hard);
  assert.ok(easy > 0.5);
  const cover = homeCoverProb(1.5, -1.5, "MLB");
  assert.ok(Math.abs(cover - 0.5) < 0.08);
  const tot = overProb(8.5, 8.5, "MLB");
  assert.ok(Math.abs(tot - 0.5) < 0.08);
  const far = overProb(8.5, 12.5, "MLB");
  assert.ok(far < 0.2);
  const yards = countOver(245, 249.5);
  assert.ok(yards > 0.3 && yards < 0.7);
});
