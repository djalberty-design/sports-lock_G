import assert from "node:assert/strict";
import { test } from "node:test";
import {
  analyzeTape,
  deskScore,
  parlayScore,
  parseActionNetworkScoreboard,
  reconstructHandle,
  stampRows,
} from "./tape.ts";
import type { ScanRow } from "./types.ts";

test("tickets 80% with handle 54% is public, not a copy-trade", () => {
  const r = analyzeTape(0.8, 0.54);
  assert.equal(r.lean, "public");
  assert.ok(r.divergence < -0.07);
  assert.match(r.note, /public|tickets/i);
  assert.doesNotMatch(r.note, /copy the crowd and bet/i);
});

test("tickets 48% with handle 67% is sharp money", () => {
  const r = analyzeTape(0.48, 0.67, true);
  assert.equal(r.lean, "sharp");
  assert.match(r.note, /sharp|money/i);
});

test("aligned tickets and money is neutral", () => {
  assert.equal(analyzeTape(0.55, 0.53).lean, "neutral");
});

test("reconstruct handle: public favorite + line moving to the dog", () => {
  const h = reconstructHandle(0.78, 0.62, 0.55);
  assert.ok(h < 0.5, `expected money away from public favorite, got ${h}`);
});

test("deskScore still prefers 58% at −110 over 80% at −400", () => {
  assert.ok(deskScore(0.58, -110) > deskScore(0.8, -400));
  assert.ok(deskScore(0.58, -110, "public") > deskScore(0.8, -400, "sharp"));
});

test("parlayScore rewards hittable tickets over lottery 4-legs", () => {
  const two = parlayScore(0.34, 3.48);
  const four = parlayScore(0.11, 14);
  assert.ok(two > four);
});

test("stampRows attaches ticket and handle to the matching side", () => {
  const row = {
    eventId: "nfl-kc-bal",
    sport: "NFL",
    start: new Date().toISOString(),
    home: "Kansas City",
    away: "Baltimore",
    marketType: "ml",
    side: "home",
    selection: "Kansas City to win",
    price: -170,
    fairProb: 0.62,
    evPct: -0.04,
    hold: 0.05,
    tag: "juiced",
    action: "stand_down",
    reason: "x",
    conviction: "low",
    spark: "",
  } as ScanRow;
  const [stamped] = stampRows([row], [
    {
      eventId: "nfl-kc-bal",
      side: "home",
      marketType: "ml",
      publicPct: 80,
      ticketPct: 80,
      handlePct: 54,
      lean: "public",
      note: "public on KC",
    },
  ]);
  assert.ok(stamped.ticketPct && stamped.ticketPct > 0.7);
  assert.ok(stamped.handlePct && stamped.handlePct < 0.6);
  assert.equal(stamped.tapeLean, "public");
});

test("Action Network scoreboard parser reads ticket and money percents", () => {
  const json = {
    games: [
      {
        teams: [
          { full_name: "Kansas City Chiefs", abbreviation: "KC", is_home: true },
          { full_name: "Baltimore Ravens", abbreviation: "BAL", is_away: true },
        ],
        odds: [{ public_betting: { tickets: 0.8, money: 0.54 } }],
      },
    ],
  };
  const rows = parseActionNetworkScoreboard(json, "NFL");
  assert.equal(rows.length, 1);
  assert.equal(rows[0].home, "Kansas City Chiefs");
  assert.ok(Math.abs(rows[0].ticketHome - 0.8) < 0.001);
  assert.ok(Math.abs(rows[0].handleHome - 0.54) < 0.001);
});

test("Action Network live shape uses home_team_id and ml_home_public", () => {
  const json = {
    games: [
      {
        home_team_id: 262,
        away_team_id: 279,
        teams: [
          { id: 279, full_name: "SMU Mustangs", abbr: "SMU" },
          { id: 262, full_name: "Florida State Seminoles", abbr: "FSU" },
        ],
        odds: [{ type: "game", book_id: 15, ml_home_public: 38, ml_away_public: 62, ml_home_money: 51, ml_away_money: 49 }],
      },
    ],
  };
  const rows = parseActionNetworkScoreboard(json, "NCAAF");
  assert.equal(rows.length, 1);
  assert.equal(rows[0].home, "Florida State Seminoles");
  assert.equal(rows[0].homeAbbr, "FSU");
  assert.ok(Math.abs(rows[0].ticketHome - 0.38) < 0.001);
  assert.ok(Math.abs(rows[0].handleHome - 0.51) < 0.001);
});
