import assert from "node:assert/strict";
import { test } from "node:test";
import {
  applyInjuryRipple,
  earlyGamesLocked,
  inactiveRadar,
  isLateWindowKickoff,
  reallocateVacatedVolume,
} from "./injury-ripple.ts";
import type { SlatePlayer } from "./types.ts";

function player(over: Partial<SlatePlayer> & { id: string; name: string }): SlatePlayer {
  return {
    pos: "RB",
    team: "NE",
    opp: "CIN",
    status: "ok",
    salary: 5000,
    p20: 6,
    p50: 9,
    p80: 14,
    ownershipEst: 5,
    stackKey: "NE-CIN",
    confidence: "med",
    confirmed: true,
    ePts: 9,
    value: 1.8,
    ...over,
  };
}

test("vacated touches move to the backup by opportunity weight", () => {
  const out = player({
    id: "out",
    name: "Injured Back",
    status: "out",
    p20: 11,
    p50: 16,
    p80: 22,
    usageRate: 0.58,
    targetShare: 0.08,
  });
  const backup = player({
    id: "stevenson",
    name: "R. Stevenson",
    opportunityWeight: 0.7,
    usageRate: 0.22,
  });
  const other = player({
    id: "wr",
    name: "WR",
    pos: "WR",
    opportunityWeight: 0.9,
  });
  const next = reallocateVacatedVolume(out, [out, backup, other]);
  const dead = next.find((p) => p.id === "out")!;
  const heir = next.find((p) => p.id === "stevenson")!;
  const untouched = next.find((p) => p.id === "wr")!;
  assert.equal(dead.p50, 0);
  assert.equal(dead.status, "out");
  // share = 0.58+0.08 = 0.66, only RB backup, lift = 1.66
  assert.equal(heir.p50, 14.9);
  assert.equal(untouched.p50, 9);
});

test("applyInjuryRipple zeros every out player then lifts the pool", () => {
  const players = applyInjuryRipple([
    player({ id: "a", name: "A", status: "out", usageRate: 0.5, pos: "RB" }),
    player({ id: "b", name: "B", pos: "RB", opportunityWeight: 1, p50: 10 }),
  ]);
  assert.equal(players[0].p50, 0);
  assert.ok(players[1].p50 > 10);
});

test("4:05 and 4:25 ET windows are late-swap after the 1:00 p.m. lock", () => {
  // 2026-09-13 is Sunday. EDT = UTC-4.
  assert.equal(isLateWindowKickoff("2026-09-13T20:05:00.000Z"), true); // 4:05 p.m. ET
  assert.equal(isLateWindowKickoff("2026-09-13T20:25:00.000Z"), true); // 4:25 p.m. ET
  assert.equal(isLateWindowKickoff("2026-09-13T17:00:00.000Z"), false); // 1:00 p.m. ET
  const afterLock = new Date("2026-09-13T17:05:00.000Z"); // 1:05 p.m. ET
  assert.equal(earlyGamesLocked(afterLock), true);
  const morning = new Date("2026-09-13T15:00:00.000Z"); // 11:00 a.m. ET
  assert.equal(earlyGamesLocked(morning), false);
});

test("90-minute official inactive radar flags questionable players and late swaps", () => {
  const q = player({
    id: "q",
    name: "Questionable Back",
    status: "questionable",
    kickoff: "2026-09-13T17:00:00.000Z",
  });
  const outLate = player({
    id: "late",
    name: "Late Out",
    status: "out",
    kickoff: "2026-09-13T20:25:00.000Z",
  });
  const now = new Date("2026-09-13T16:10:00.000Z"); // 12:10 p.m. ET — 50 min to 1:00 kickoff
  const alerts = inactiveRadar([q, outLate], now);
  assert.ok(alerts.some((a) => a.kind === "window" && a.name === "Questionable Back"));
  assert.ok(alerts.some((a) => a.kind === "out" && a.name === "Late Out"));
  const afterOne = inactiveRadar([outLate], new Date("2026-09-13T17:10:00.000Z"));
  assert.ok(afterOne.some((a) => a.kind === "late-swap"));
});
