import assert from "node:assert/strict";
import { test } from "node:test";
import { quotesFromEspnEvent, quotesFromScoreboard, type EspnEvent } from "./live-board.ts";
import { formatKickoff } from "../utils.ts";

const kickoff: EspnEvent = {
  id: "401872656",
  date: "2026-09-10T00:20Z",
  name: "New England Patriots at Seattle Seahawks",
  competitions: [
    {
      date: "2026-09-10T00:20Z",
      status: {
        type: {
          state: "pre",
          completed: false,
          description: "Scheduled",
          detail: "Wed, September 9th at 8:20 PM EDT",
        },
      },
      competitors: [
        { homeAway: "home", team: { displayName: "Seattle Seahawks", name: "Seahawks", abbreviation: "SEA" } },
        { homeAway: "away", team: { displayName: "New England Patriots", name: "Patriots", abbreviation: "NE" } },
      ],
      odds: [
        {
          provider: { name: "DraftKings" },
          details: "SEA -3.5",
          overUnder: 44.5,
          moneyline: { home: { close: { odds: "-180" } }, away: { close: { odds: "+150" } } },
          pointSpread: {
            home: { close: { line: "-3.5", odds: "-105" } },
            away: { close: { line: "+3.5", odds: "-115" } },
          },
          total: {
            over: { close: { line: "o44.5", odds: "-105" } },
            under: { close: { line: "u44.5", odds: "-115" } },
          },
        },
      ],
    },
  ],
};

test("live ESPN event uses the real kickoff, not a fake Monday", () => {
  const quotes = quotesFromEspnEvent(kickoff, "NFL");
  assert.ok(quotes.length >= 6);
  const ml = quotes.find((q) => q.marketType === "ml" && q.side === "away");
  assert.ok(ml);
  assert.equal(ml!.away, "New England Patriots");
  assert.equal(ml!.home, "Seattle Seahawks");
  assert.equal(ml!.start, "2026-09-10T00:20Z");
  assert.match(formatKickoff(ml!.start), /September|Sep/);
  assert.doesNotMatch(formatKickoff(ml!.start), /Monday, Sep 7/);
  assert.equal(ml!.price, 150);
  const done = quotesFromEspnEvent(
    {
      ...kickoff,
      competitions: [{ ...kickoff.competitions![0], status: { type: { state: "post", completed: true } } }],
    },
    "NFL",
  );
  assert.equal(done.length, 0);
});

test("finished games are dropped from a scoreboard", () => {
  const board = quotesFromScoreboard({ events: [kickoff, { id: "x", date: "2026-09-06T16:00Z", competitions: [{ status: { type: { state: "post", completed: true } }, competitors: [] }] }] }, "NFL");
  assert.ok(board.every((q) => q.eventId.includes("401872656")));
});

test("NBA NHL NCAAB games still appear when ESPN has not posted odds yet", () => {
  const bare: EspnEvent = {
    ...kickoff,
    id: "401770001",
    date: "2026-10-03T23:00Z",
    competitions: [
      {
        ...kickoff.competitions![0],
        date: "2026-10-03T23:00Z",
        odds: undefined,
        competitors: [
          { homeAway: "home", team: { displayName: "Miami Heat", name: "Heat", abbreviation: "MIA" } },
          { homeAway: "away", team: { displayName: "Toronto Raptors", name: "Raptors", abbreviation: "TOR" } },
        ],
      },
    ],
  };
  const quotes = quotesFromEspnEvent(bare, "NBA", "preseason");
  assert.ok(quotes.length >= 2);
  assert.ok(quotes.every((q) => q.scheduleOnly));
  assert.equal(quotes[0]!.phase, "preseason");
  assert.equal(quotes.find((q) => q.side === "home")?.home, "Miami Heat");
  assert.equal(quotesFromScoreboard({ events: [bare], season: { type: 1 } }, "NBA")[0]?.phase, "preseason");
});

