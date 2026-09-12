import assert from "node:assert/strict";
import { test } from "node:test";
import {
  analyzeScores,
  blendRate,
  ewmaMean,
  earlySeasonDamp,
  ewmaWeights,
  formTrend,
  last10ExpectedTotal,
  opponentMatches,
  parseEspnScore,
  vsOpponent,
  type ScoreGame,
} from "./form.ts";

test("NFL early-season damping is 0.60 × min(1, n/6)", () => {
  assert.equal(earlySeasonDamp(3, "NFL"), 0.6 * 0.5);
  assert.equal(earlySeasonDamp(6, "NFL"), 0.6);
  assert.equal(earlySeasonDamp(10, "NFL"), 0.6);
  assert.equal(earlySeasonDamp(3, "MLB"), 1);
});

test("ewma weights sum to 1 and latest game is heaviest", () => {
  const w = ewmaWeights(10);
  assert.equal(w.length, 10);
  assert.ok(Math.abs(w.reduce((s, x) => s + x, 0) - 1) < 1e-9);
  assert.ok(w[0]! > w[1]!);
  assert.ok(w[0]! > w[9]! * 2);
});

test("ewmaMean of a hot last game beats a flat average", () => {
  const xs = [8, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const m = ewmaMean(xs)!;
  const flat = xs.reduce((s, n) => s + n, 0) / xs.length;
  assert.ok(m > flat);
  assert.equal(ewmaMean(xs), ewmaMean(xs));
});

test("same 10 scores always produce the same read", () => {
  const games: ScoreGame[] = [
    { result: "W", pf: 6, pa: 2, opponent: "BOS" },
    { result: "W", pf: 5, pa: 4, opponent: "NYY" },
    { result: "L", pf: 1, pa: 3, opponent: "TB" },
    { result: "W", pf: 8, pa: 3, opponent: "BAL" },
    { result: "L", pf: 2, pa: 5, opponent: "TOR" },
    { result: "W", pf: 4, pa: 3, opponent: "CLE" },
    { result: "W", pf: 7, pa: 1, opponent: "DET" },
    { result: "L", pf: 0, pa: 4, opponent: "CWS" },
    { result: "W", pf: 3, pa: 2, opponent: "MIN" },
    { result: "W", pf: 5, pa: 5, opponent: "KC" },
  ];
  const a = analyzeScores(games, 10);
  const b = analyzeScores(games, 10);
  assert.ok(a);
  assert.deepEqual(a, b);
  assert.equal(a!.n, 10);
  assert.ok(a!.wp > 0.5);
  assert.ok(a!.avgPf > a!.avgPa);
});

test("form trend is rising when the last 5 are hot vs the prior 5", () => {
  const games: ScoreGame[] = [
    { result: "W", pf: 5, pa: 1 },
    { result: "W", pf: 4, pa: 2 },
    { result: "W", pf: 6, pa: 1 },
    { result: "W", pf: 3, pa: 2 },
    { result: "W", pf: 4, pa: 3 },
    { result: "L", pf: 1, pa: 5 },
    { result: "L", pf: 0, pa: 4 },
    { result: "L", pf: 2, pa: 6 },
    { result: "W", pf: 3, pa: 2 },
    { result: "L", pf: 1, pa: 3 },
  ];
  assert.equal(formTrend(games), "rising");
  const read = analyzeScores(games, 10)!;
  assert.equal(read.trend, "rising");
});

test("last-10 expected total uses offense vs opponent defense", () => {
  const form = [
    {
      team: "Jays",
      games: Array.from({ length: 10 }, () => ({ result: "W" as const, pf: 6, pa: 3 })),
    },
    {
      team: "Athletics",
      games: Array.from({ length: 10 }, () => ({ result: "L" as const, pf: 3, pa: 6 })),
    },
  ];
  const tot = last10ExpectedTotal(form, "Jays", "Athletics");
  assert.ok(tot);
  // Jays 6 scored / 3 allowed; A's 3 scored / 6 allowed → ~9 combined
  assert.ok(tot! > 8 && tot! < 10);
});

test("blendRate is 60% recent / 40% season", () => {
  assert.equal(blendRate(2, 5), 0.6 * 5 + 0.4 * 2);
  assert.equal(blendRate(2, undefined), 2);
  assert.equal(blendRate(undefined, 5), 5);
});

test("head-to-head in the last 10 is analysis of those scores, not a sticker", () => {
  assert.equal(opponentMatches("BOS", "Boston Red Sox"), true);
  assert.equal(opponentMatches("NYY", "New York Yankees"), true);
  assert.equal(opponentMatches("LAD", "Los Angeles Dodgers"), true);
  const games: ScoreGame[] = [
    { result: "W", pf: 7, pa: 1, opponent: "BOS" },
    { result: "W", pf: 4, pa: 3, opponent: "BOS" },
    { result: "L", pf: 2, pa: 5, opponent: "BOS" },
    { result: "L", pf: 1, pa: 8, opponent: "NYY" },
  ];
  const vs = vsOpponent(games, "Boston Red Sox");
  assert.ok(vs);
  assert.equal(vs!.n, 3);
  assert.ok(vs!.avgPf > 0);
});

test("ESPN score objects parse to the actual runs, not NaN", () => {
  assert.equal(parseEspnScore(7), 7);
  assert.equal(parseEspnScore("5"), 5);
  assert.equal(parseEspnScore({ value: 5.0, displayValue: "5" }), 5);
  assert.equal(parseEspnScore({ displayValue: "12" }), 12);
  assert.equal(parseEspnScore({}), undefined);
  assert.equal(parseEspnScore(null), undefined);
  const games: ScoreGame[] = [
    { result: "W", pf: parseEspnScore({ value: 8, displayValue: "8" }), pa: parseEspnScore({ value: 2, displayValue: "2" }) },
    { result: "L", pf: parseEspnScore({ value: 1, displayValue: "1" }), pa: parseEspnScore({ value: 4, displayValue: "4" }) },
  ];
  const read = analyzeScores(games, 10, 2)!;
  assert.ok(read.avgPf > 0);
  assert.ok(read.avgPa > 0);
});
