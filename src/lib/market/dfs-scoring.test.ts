import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DK_SCORING,
  adjustVolumeForScript,
  bonusPoints,
  cashFloor,
  getImpliedTeamPoints,
  gppCeiling,
  isChalk,
  projectDkPoints,
  showdownPoints,
  showdownSalary,
  sigmaOf,
} from "./dfs-scoring.ts";

test("Full PPR plus 300-pass and 100-yard bonuses", () => {
  assert.equal(DK_SCORING.PPR, 1);
  assert.equal(DK_SCORING.PASS_TD, 4);
  assert.equal(DK_SCORING.PASS_YD, 0.04);
  assert.equal(bonusPoints({ passYds: 299, rushYds: 99, recYds: 99 }), 0);
  assert.equal(bonusPoints({ passYds: 300, rushYds: 100, recYds: 100 }), 9);
  const pts = projectDkPoints({
    passYds: 300,
    passTd: 2,
    ints: 1,
    rushYds: 20,
    recYds: 0,
    recs: 0,
  });
  // 300*0.04=12 + 2*4=8 -1 + 20*0.1=2 + 3 bonus = 24
  assert.equal(pts, 24);
  const ppr = projectDkPoints({ recYds: 80, recs: 7, recTd: 1 });
  // 8 + 7 PPR + 6 TD = 21
  assert.equal(ppr, 21);
});

test("implied team points use the spread magnitude", () => {
  assert.equal(getImpliedTeamPoints(47, 7, true), 27);
  assert.equal(getImpliedTeamPoints(47, 7, false), 20);
  assert.equal(getImpliedTeamPoints(47, -7, true), 27);
  assert.equal(getImpliedTeamPoints(47, -7, false), 20);
});

test("cash floor is mean minus 0.75 sigma; GPP ceiling is mean plus 1.65 sigma", () => {
  const p = { p20: 10, p50: 20, p80: 30 };
  const s = sigmaOf(p);
  assert.ok(Math.abs(s - 20 / 2.56) < 1e-9);
  assert.ok(Math.abs(cashFloor(p) - (20 - 0.75 * s)) < 1e-9);
  assert.ok(Math.abs(gppCeiling(p) - (20 + 1.65 * s)) < 1e-9);
});

test("Showdown captain is 1.5x salary and 1.5x points", () => {
  assert.equal(showdownSalary(8000, true), 12000);
  assert.equal(showdownSalary(8000, false), 8000);
  assert.equal(showdownPoints(20, true), 30);
  assert.equal(showdownPoints(20, false), 20);
});

test("chalk is ownership over 25 percent", () => {
  assert.equal(isChalk(26), true);
  assert.equal(isChalk(0.26), true);
  assert.equal(isChalk(25), false);
  assert.equal(isChalk(0.2), false);
});

test("wind of 18 mph cuts passing and lifts rushing", () => {
  const calm = adjustVolumeForScript({ passYds: 100, rushYds: 100, recYds: 100, recs: 10 }, { windMph: 10 });
  assert.equal(calm.passYds, 100);
  const wind = adjustVolumeForScript({ passYds: 100, rushYds: 100, recYds: 100, recs: 10 }, { windMph: 18 });
  assert.ok((wind.passYds ?? 0) < 100);
  assert.ok((wind.rushYds ?? 0) > 100);
  const fav = adjustVolumeForScript({ passYds: 100, rushYds: 100 }, { favoredBy: 6 });
  assert.ok((fav.rushYds ?? 0) > 100);
});
