import assert from "node:assert/strict";
import { test } from "node:test";
import { buildUsage, usageOf } from "./usage.ts";

test("listed-out names stand down even when the roster is empty", () => {
  const u = buildUsage({
    eventId: "espn-NFL-1",
    sport: "NFL",
    injuries: [
      { player: "Zach Charbonnet", status: "Out", team: "Seattle Seahawks" },
      { player: "Ty Okada", status: "Questionable", team: "Seattle Seahawks" },
    ],
  });
  assert.equal(u.empty, false);
  assert.equal(u.thin, true);
  const z = usageOf(u, "Zach Charbonnet");
  assert.ok(z);
  assert.equal(z!.standDown, true);
  assert.equal(z!.opportunity, 0);
  assert.match(z!.note, /listed out/i);
  assert.match(u.note, /Looked/i);
  assert.equal(usageOf(u, "Ty Okada"), undefined);
});

test("a scratch moves leftover opportunity to the same position", () => {
  const u = buildUsage({
    eventId: "espn-NFL-1",
    sport: "NFL",
    lineupConfirmed: true,
    players: [
      { id: "1", name: "Zach Charbonnet", team: "SEA", homeAway: "home", position: "RB", starter: true, stats: {} },
      { id: "2", name: "Kenneth Walker III", team: "SEA", homeAway: "home", position: "RB", starter: false, stats: {} },
    ],
    injuries: [{ player: "Zach Charbonnet", status: "Out", team: "SEA" }],
  });
  const z = usageOf(u, "Zach Charbonnet");
  const k = usageOf(u, "Kenneth Walker III");
  assert.equal(z!.standDown, true);
  assert.equal(z!.opportunity, 0);
  assert.ok(k!.opportunity > 0.32);
  assert.equal(k!.standDown, false);
});

test("college player usage stands down Florida tickets", () => {
  const u = buildUsage({
    eventId: "espn-NCAAF-1",
    sport: "NCAAF",
    players: [{ id: "1", name: "Cam Ward", team: "MIA", homeAway: "home", position: "QB", starter: true, stats: {} }],
  });
  const p = usageOf(u, "Cam Ward");
  assert.equal(p!.standDown, true);
  assert.match(p!.note, /No Florida player ticket/);
});
