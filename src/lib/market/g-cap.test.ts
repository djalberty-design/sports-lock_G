import assert from "node:assert/strict";
import { test } from "node:test";
import { capLatentToClose, shareFromWin, SPLIT_CAP } from "./g-cap.ts";
import type { GameLatent } from "./sim.ts";

function g(over: Partial<GameLatent> = {}): GameLatent {
  return {
    eventId: "e",
    sport: "NFL",
    muH: 24,
    muA: 20,
    sigM: 10,
    sigT: 10,
    pace: 1,
    pWinH: 0.57,
    chaos: 0,
    marketHome: 0.57,
    ran: true,
    note: "",
    ...over,
  };
}

test("wild stacked split is pulled back toward the close", () => {
  const raw = g({ muH: 38, muA: 6, pWinH: 0.88 });
  const cap = capLatentToClose(raw);
  const share = cap.muH / (cap.muH + cap.muA);
  const mid = shareFromWin(0.57);
  assert.ok(share <= mid + SPLIT_CAP + 1e-9);
  assert.ok(cap.pWinH <= 0.67 + 1e-9);
  assert.match(cap.note, /capped to the close/i);
  assert.ok(Math.abs(cap.muH + cap.muA - 44) < 1e-6);
});

test("a split already near the close is left alone", () => {
  const mid = shareFromWin(0.57);
  const raw = g({ muH: 44 * mid, muA: 44 * (1 - mid), pWinH: 0.57 });
  const cap = capLatentToClose(raw);
  assert.doesNotMatch(cap.note ?? "", /capped to the close/i);
  assert.ok(Math.abs(cap.muH - raw.muH) < 1e-6);
});

test("no close stays uncapped", () => {
  const raw = g({ marketHome: undefined, poolHome: undefined, pWinH: Number.NaN, muH: 30, muA: 10 });
  const loose = capLatentToClose(raw);
  assert.equal(loose.muH, 30);
});
