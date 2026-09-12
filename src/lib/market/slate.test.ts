import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildCashLineup,
  buildGppLineup,
  buildShowdownLineup,
  detectSalaryShifts,
  forbidsOppDst,
  generateGPPStack,
  hydratePlayer,
  optimizeSlate,
  sampleNflSlate,
} from "./slate.ts";
import type { SlatePlayer } from "./types.ts";

function p(over: Partial<SlatePlayer> & { id: string; name: string; pos: string; team: string }): SlatePlayer {
  return hydratePlayer({
    opp: "BAL",
    status: "ok",
    salary: 5000,
    p20: 8,
    p50: 12,
    p80: 18,
    ownershipEst: 10,
    stackKey: `${over.team}-BAL`,
    confidence: "med",
    confirmed: true,
    ...over,
  });
}

test("never pairs a starting QB with the opposing DST", () => {
  const qb = p({ id: "qb", name: "QB", pos: "QB", team: "KC", opp: "BAL" });
  const dst = p({ id: "dst", name: "Ravens", pos: "DST", team: "BAL", opp: "KC" });
  assert.equal(forbidsOppDst([qb], dst), true);
  assert.equal(forbidsOppDst([dst], qb), true);
  const own = p({ id: "own", name: "Chiefs", pos: "DST", team: "KC", opp: "BAL" });
  assert.equal(forbidsOppDst([qb], own), false);
});

test("GPP double-stack is QB + 2 catchers + opposing bring-back on totals of 47+", () => {
  const pool = [
    p({ id: "qb", name: "Mahomes", pos: "QB", team: "KC", opp: "BAL", total: 52.5, p50: 24, p80: 32, salary: 7800 }),
    p({ id: "wr1", name: "Rice", pos: "WR", team: "KC", opp: "BAL", total: 52.5, p50: 14, p80: 20, salary: 6100 }),
    p({ id: "wr2", name: "Worthy", pos: "WR", team: "KC", opp: "BAL", total: 52.5, p50: 13, p80: 21, salary: 5400 }),
    p({ id: "bb", name: "Flowers", pos: "WR", team: "BAL", opp: "KC", total: 52.5, p50: 13, p80: 19, salary: 5900 }),
    p({ id: "other", name: "Adams", pos: "WR", team: "NYJ", opp: "SF", total: 40, p50: 12, p80: 19, salary: 6000 }),
  ];
  const stack = generateGPPStack(pool);
  assert.equal(stack.seed.length, 4);
  assert.ok(stack.seed.some((x) => x.id === "qb"));
  assert.ok(stack.seed.filter((x) => x.team === "KC" && (x.pos === "WR" || x.pos === "TE")).length >= 2);
  assert.ok(stack.seed.some((x) => x.team === "BAL"));
  assert.match(stack.note, /bring-back/i);
});

test("cash lineup fills 9 NFL slots under the $50k cap and sits the opposing DST", () => {
  const players = sampleNflSlate();
  const cash = buildCashLineup("NFL", players);
  assert.equal(cash.players.length, 9);
  assert.ok(cash.capUsed <= 50_000);
  const qb = cash.players.find((x) => x.pos === "QB");
  const dst = cash.players.find((x) => x.pos === "DST");
  if (qb && dst) assert.notEqual(dst.team, qb.opp);
  assert.ok(!cash.players.some((x) => x.status === "out"));
});

test("GPP lineup seeds a stack and haircuts chalk", () => {
  const gpp = buildGppLineup("NFL", sampleNflSlate());
  assert.equal(gpp.players.length, 9);
  assert.ok(gpp.capUsed <= 50_000);
  const qb = gpp.players.find((x) => x.pos === "QB");
  assert.ok(qb);
  const catchers = gpp.players.filter((x) => qb && (x.pos === "WR" || x.pos === "TE") && x.team === qb.team);
  assert.ok(catchers.length >= 1);
});

test("Showdown captain is 1.5x and a WR/TE captain pulls in the QB", () => {
  const game = [
    p({ id: "qb", name: "Mahomes", pos: "QB", team: "KC", opp: "BAL", p20: 18, p50: 24, p80: 32, salary: 7800 }),
    p({ id: "wr", name: "Rice", pos: "WR", team: "KC", opp: "BAL", p20: 12, p50: 22, p80: 40, salary: 6100 }),
    p({ id: "te", name: "Kelce", pos: "TE", team: "KC", opp: "BAL", p20: 9, p50: 14, p80: 20, salary: 6200 }),
    p({ id: "rb", name: "Pacheco", pos: "RB", team: "KC", opp: "BAL", p20: 8, p50: 13, p80: 19, salary: 5800 }),
    p({ id: "wr2", name: "Flowers", pos: "WR", team: "BAL", opp: "KC", p20: 8, p50: 13, p80: 19, salary: 5900 }),
    p({ id: "rb2", name: "Henry", pos: "RB", team: "BAL", opp: "KC", p20: 12, p50: 18, p80: 26, salary: 8000 }),
    p({ id: "te2", name: "Andrews", pos: "TE", team: "BAL", opp: "KC", p20: 6, p50: 10, p80: 16, salary: 4800 }),
  ].map((x) => ({ ...x, stackKey: "KC-BAL" }));
  const sd = buildShowdownLineup(game);
  assert.ok(sd);
  assert.equal(sd!.players.length, 6);
  assert.ok(sd!.captainId);
  const cap = sd!.players.find((x) => x.id === sd!.captainId)!;
  assert.ok(sd!.capUsed > cap.salary); // 1.5x captain salary is in the total
  if (cap.pos === "WR" || cap.pos === "TE") {
    assert.ok(sd!.players.some((x) => x.pos === "QB" && x.team === cap.team));
  }
});

test("optimizeSlate ripples vacated volume and builds three lineups", () => {
  const players = sampleNflSlate();
  const bundle = optimizeSlate({
    site: "draftkings_classic",
    sport: "NFL",
    slateDate: "2026-09-13",
    cap: 50_000,
    players,
    source: "sample",
    confirmed: true,
  });
  const dead = bundle.players.find((x) => x.name === "Injured Back")!;
  const heir = bundle.players.find((x) => x.name === "R. Stevenson")!;
  assert.equal(dead.p50, 0);
  assert.ok(heir.p50 > 9);
  assert.ok(bundle.cash && bundle.cash.players.length === 9);
  assert.ok(bundle.gpp && bundle.gpp.players.length === 9);
  assert.ok(bundle.showdown && bundle.showdown.players.length === 6);
  assert.ok((bundle.inactiveAlerts ?? []).some((a) => a.kind === "out"));
});

test("salary shifts of $200 or more fire an alert", () => {
  const prev = sampleNflSlate();
  const next = prev.map((x) => (x.name === "P. Mahomes" ? { ...x, salary: x.salary + 400 } : x));
  const shifts = detectSalaryShifts(prev, next);
  assert.equal(shifts.length, 1);
  assert.equal(shifts[0].name, "P. Mahomes");
  assert.equal(shifts[0].now - shifts[0].was, 400);
  assert.equal(detectSalaryShifts(prev, prev).length, 0);
});
