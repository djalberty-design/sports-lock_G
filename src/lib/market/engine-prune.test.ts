import assert from "node:assert/strict";
import { test } from "node:test";
import { pruneComboSeeds } from "./engine.ts";
import type { ScanRow } from "./types.ts";

function row(over: Partial<ScanRow> & { eventId: string; fairProb: number; price: number }): ScanRow {
  return {
    sport: "NFL",
    start: new Date(Date.now() + 3600_000).toISOString(),
    home: "Home",
    away: "Away",
    marketType: "ml",
    side: "home",
    selection: over.eventId,
    evPct: 0,
    hold: 0.05,
    tag: "fair_or_better",
    action: "enter_ticket",
    reason: "test",
    conviction: "medium",
    spark: "",
    ...over,
  };
}

test("combo seeds cap at 18 highest-edge unique games", () => {
  const rows: ScanRow[] = [];
  for (let i = 0; i < 40; i++) {
    rows.push(
      row({
        eventId: `g${i}`,
        fairProb: 0.55,
        price: -110 + i,
        evPct: i / 100,
      }),
    );
  }
  const seeds = pruneComboSeeds(rows, 18);
  assert.equal(seeds.length, 18);
  const ids = new Set(seeds.map((s) => s.eventId));
  assert.equal(ids.size, 18);
});
