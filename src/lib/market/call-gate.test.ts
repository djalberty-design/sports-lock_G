import assert from "node:assert/strict";
import { test } from "node:test";
import { isLiveDeskPick, isLiveTicket, liveQualityCap } from "./call-gate.ts";

test("explicit in-play is live", () => {
  assert.equal(isLiveTicket({ inPlay: true }), true);
  assert.equal(isLiveTicket({ tag: "in_play" }), true);
});

test("kickoff already passed is live even without the flag", () => {
  assert.equal(isLiveTicket({ start: "2020-01-01T00:00:00.000Z" }), true);
  assert.equal(isLiveTicket({ start: "2099-01-01T00:00:00.000Z" }), false);
});

test("live quality cannot clear The Call floor", () => {
  assert.ok(liveQualityCap(1, true) < 0.72);
  assert.equal(liveQualityCap(1, false), 1);
});

test("desk pick uses row or own start", () => {
  assert.equal(isLiveDeskPick({ start: "2020-01-01T00:00:00.000Z" }), true);
  assert.equal(isLiveDeskPick({ row: { inPlay: true } }), true);
  assert.equal(isLiveDeskPick({ start: "2099-01-01T00:00:00.000Z" }), false);
});
