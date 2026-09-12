import assert from "node:assert/strict";
import { test } from "node:test";
import { kalshiHomeWin, type KalshiContract } from "./kalshi.ts";
import { guessPolySlug, polymarketHomeWin, type PolyContract } from "./polymarket.ts";

test("Kalshi matches ESPN abbreviations on the ticker suffix", () => {
  const contracts: KalshiContract[] = [
    {
      eventTicker: "KXMLBGAME-26SEP071305ATLPHI",
      sport: "MLB",
      occurrence: "2026-09-07T17:05:00Z",
      sides: [
        {
          ticker: "KXMLBGAME-26SEP071305ATLPHI-PHI",
          eventTicker: "KXMLBGAME-26SEP071305ATLPHI",
          label: "Philadelphia P",
          code: "PHI",
          mid: 0.6,
          volume: 400,
          openInterest: 200,
        },
        {
          ticker: "KXMLBGAME-26SEP071305ATLPHI-ATL",
          eventTicker: "KXMLBGAME-26SEP071305ATLPHI",
          label: "Atlanta Brave",
          code: "ATL",
          mid: 0.4,
          volume: 400,
          openInterest: 200,
        },
      ],
    },
  ];
  const hit = kalshiHomeWin(contracts, {
    sport: "MLB",
    home: "Philadelphia Phillies",
    away: "Atlanta Braves",
    homeAbbr: "PHI",
    awayAbbr: "ATL",
    start: "2026-09-07T17:05:00Z",
  });
  assert.ok(hit);
  assert.ok(Math.abs(hit!.home - 0.6) < 1e-9);
});

test("Kalshi refuses a different day's game in the same series", () => {
  const contracts: KalshiContract[] = [
    {
      eventTicker: "KXMLBGAME-26SEP081305ATLPHI",
      sport: "MLB",
      occurrence: "2026-09-08T17:05:00Z",
      sides: [
        {
          ticker: "KXMLBGAME-26SEP081305ATLPHI-PHI",
          eventTicker: "KXMLBGAME-26SEP081305ATLPHI",
          label: "Philadelphia P",
          code: "PHI",
          mid: 0.55,
          volume: 10,
          openInterest: 10,
        },
        {
          ticker: "KXMLBGAME-26SEP081305ATLPHI-ATL",
          eventTicker: "KXMLBGAME-26SEP081305ATLPHI",
          label: "Atlanta Brave",
          code: "ATL",
          mid: 0.45,
          volume: 10,
          openInterest: 10,
        },
      ],
    },
  ];
  const hit = kalshiHomeWin(contracts, {
    sport: "MLB",
    home: "Philadelphia Phillies",
    away: "Atlanta Braves",
    homeAbbr: "PHI",
    awayAbbr: "ATL",
    start: "2026-09-07T17:05:00Z",
  });
  assert.equal(hit, undefined);
});

test("Polymarket matches outcomes even if listed away-first", () => {
  const contracts: PolyContract[] = [
    {
      sport: "MLB",
      title: "Atlanta Braves vs. Philadelphia Phillies",
      slug: "mlb-atl-phi-2026-09-07",
      awayName: "Atlanta Braves",
      homeName: "Philadelphia Phillies",
      away: 0.395,
      home: 0.605,
      volume: 8500,
      end: "2026-09-14T17:05:00Z",
      start: "2026-09-01T13:00:00Z",
    },
  ];
  const hit = polymarketHomeWin(contracts, {
    sport: "MLB",
    home: "Philadelphia Phillies",
    away: "Atlanta Braves",
    homeAbbr: "PHI",
    awayAbbr: "ATL",
    start: "2026-09-07T17:05:00Z",
  });
  assert.ok(hit);
  assert.ok(Math.abs(hit!.home - 0.605) < 1e-9);
});

test("guessPolySlug uses away-home-date", () => {
  assert.equal(guessPolySlug("NFL", "NE", "SEA", "2026-09-10T00:20:00Z"), "nfl-ne-sea-2026-09-10");
  assert.equal(guessPolySlug("MLB", "ATL", "PHI", "2026-09-07T17:05:00Z"), "mlb-atl-phi-2026-09-07");
});
