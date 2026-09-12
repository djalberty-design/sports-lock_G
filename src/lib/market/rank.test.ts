import assert from "node:assert/strict";
import { test } from "node:test";
import { oddsFingerprint } from "./rank.ts";
import type { DeskSnapshot, QuoteLine } from "./types.ts";

function snap(asOf: string, price = -110): DeskSnapshot {
  const quote = {
    eventId: "e1",
    sport: "MLB",
    start: "2026-09-10T23:00:00Z",
    home: "Home",
    away: "Away",
    marketType: "ml",
    side: "home",
    selection: "Home",
    price,
    source: "espn",
    delayed: true,
  } as QuoteLine;
  return {
    asOf,
    hours: { start: asOf, end: asOf, label: "test" },
    quotes: [quote],
  } as unknown as DeskSnapshot;
}

test("odds fingerprint ignores the clock and only changes when posted prices change", () => {
  const a = oddsFingerprint(snap("2026-09-10T20:00:00Z"));
  const b = oddsFingerprint(snap("2026-09-10T20:01:00Z"));
  const c = oddsFingerprint(snap("2026-09-10T20:01:00Z", -105));
  assert.equal(a, b);
  assert.notEqual(a, c);
});
