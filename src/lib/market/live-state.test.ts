import assert from "node:assert/strict";
import { test } from "node:test";
import { applyLiveRemaining, clockFractionLeft, leftoverOverProb, remainingMean } from "./live-state.ts";
import { latentFromScores } from "./sim.ts";

test("remainingMean is leftover × clock, not a haircut of the pre-game mean", () => {
  const rem = remainingMean(8.5, 4, 0.5);
  assert.ok(rem > 0);
  assert.ok(rem < 8.5 - 4);
});

test("clockFractionLeft shrinks as the period advances", () => {
  const early = clockFractionLeft("NFL", 1, "14:00");
  const late = clockFractionLeft("NFL", 4, "2:00");
  assert.ok(early > late);
  assert.ok(late > 0.04);
});

test("leftover over is near-locked when already exceeds the line", () => {
  const p = leftoverOverProb({ sport: "MLB", postedTotal: 8.5, already: 12, period: "8" });
  assert.equal(p, 0.99);
});

test("live remaining G moves with the scoreboard, not the opening total", () => {
  const pre = latentFromScores({ eventId: "nfl-live", sport: "NFL", homeWin: 0.5, total: 44.5 });
  const live = applyLiveRemaining(pre, { inPlay: true, homeScore: 28, awayScore: 7, period: "4", clock: "2:00" });
  assert.ok(live.pWinH > pre.pWinH);
  assert.ok(live.muH > live.muA);
  assert.ok(live.sigT < pre.sigT);
  assert.match(live.note, /Live remaining G/);
});

test("live without a score keeps pregame G and marks thin", () => {
  const pre = latentFromScores({ eventId: "nba-live", sport: "NBA", homeWin: 0.58, total: 224 });
  const live = applyLiveRemaining(pre, { inPlay: true, period: "2", clock: "8:00" });
  assert.equal(live.muH, pre.muH);
  assert.match(live.note, /Score missing/);
});

test("kickoff already passed rebuilds remaining G even without the inPlay flag", () => {
  const pre = latentFromScores({ eventId: "nfl-started", sport: "NFL", homeWin: 0.5, total: 44.5 });
  const live = applyLiveRemaining(pre, {
    start: "2020-01-01T00:00:00.000Z",
    homeScore: 21,
    awayScore: 10,
    period: "3",
    clock: "8:00",
  });
  assert.match(live.note, /Live remaining G/);
  assert.ok(live.muH !== pre.muH || live.muA !== pre.muA);
});
