import assert from "node:assert/strict";
import { test } from "node:test";
import { floridaBlockReason, isCollegePlayerBet, isFloridaBlocked } from "./florida.ts";

test("college game winner is legal in Florida", () => {
  assert.equal(
    isCollegePlayerBet({ sport: "NCAAF", marketType: "ml", selection: "Alabama to win" }),
    false,
  );
  assert.equal(isFloridaBlocked({ sport: "NCAAF", marketType: "spread", selection: "Alabama -7.5" }), false);
});

test("college player ticket is blocked even if isProp was forgotten", () => {
  assert.equal(
    isCollegePlayerBet({
      sport: "NCAAF",
      marketType: "total",
      selection: "Hunter over 89.5 receiving yards",
    }),
    true,
  );
  assert.equal(
    isFloridaBlocked({ sport: "NCAAB", player: "Flagg", selection: "Over 18.5 points" }),
    true,
  );
  assert.match(floridaBlockReason({ sport: "NCAAF", isProp: true, selection: "QB yards" }) ?? "", /College player/);
});

test("NFL player ticket is not a Florida college block", () => {
  assert.equal(
    isCollegePlayerBet({ sport: "NFL", isProp: true, selection: "Mahomes over 249.5 passing yards" }),
    false,
  );
});

test("DK sportsbook venue is blocked", () => {
  assert.equal(isFloridaBlocked({ sport: "NFL", marketType: "ml", venueNote: "dk_sportsbook" }), true);
  assert.match(floridaBlockReason({ venueNote: "fd_sportsbook" }) ?? "", /not licensed/);
});
