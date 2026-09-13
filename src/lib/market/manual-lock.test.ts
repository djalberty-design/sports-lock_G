import assert from "node:assert/strict";
import { test } from "node:test";
import { parsedFromDeskPick, readyLegs } from "./manual-lock.ts";
import type { DeskPick } from "./picks.ts";

function pick(over: Partial<DeskPick>): DeskPick {
  return {
    id: "t1",
    bucket: "popular",
    selection: "Chiefs to win",
    chance: 0.58,
    price: -120,
    decimalPayout: 1.83,
    score: 1,
    sport: "NFL",
    home: "Kansas City Chiefs",
    away: "Baltimore Ravens",
    why: "test",
    infoQuality: 0.8,
    confidence: "high",
    ...over,
  };
}

test("a named single becomes one manual row, not a parlay", () => {
  const legs = parsedFromDeskPick(pick({}));
  assert.equal(legs.length, 1);
  assert.equal(legs[0].selection, "Chiefs to win");
  assert.equal(legs[0].price, -120);
  assert.equal(readyLegs(legs).length, 1);
});

test("a desk parlay seeds every leg", () => {
  const legs = parsedFromDeskPick(
    pick({
      parlay: {
        legs: [
          {
            eventId: "a",
            sport: "NFL",
            selection: "Chiefs to win",
            marketType: "ml",
            side: "home",
            price: -120,
            fairProb: 0.58,
            start: "",
            home: "Chiefs",
            away: "Ravens",
          },
          {
            eventId: "b",
            sport: "NFL",
            selection: "Bills to win",
            marketType: "ml",
            side: "away",
            price: -110,
            fairProb: 0.55,
            start: "",
            home: "Dolphins",
            away: "Bills",
          },
        ],
        combinedFair: 0.3,
        combinedEv: 0,
        pricedAsEntertainment: false,
        researchOnly: false,
        sameGame: false,
        title: "2-leg",
        reason: "test",
      },
    }),
  );
  assert.equal(legs.length, 2);
  assert.equal(legs[1].selection, "Bills to win");
});
