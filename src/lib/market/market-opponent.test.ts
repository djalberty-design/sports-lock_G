import assert from "node:assert/strict";
import { test } from "node:test";
import { openPrecision, tapeLayers, thinClose } from "./market-opponent.ts";

test("thin close is empty, not a fake 50", () => {
  assert.equal(thinClose(undefined), true);
  assert.equal(thinClose(0.5, 0.2), true);
  assert.equal(thinClose(0.57, 0.045), false);
});

test("open precision loses to the close", () => {
  assert.ok(openPrecision(true) < openPrecision(false));
  assert.ok(openPrecision(true) < 5);
});

test("80/54 tickets-handle is steam, not a copy of 80", () => {
  const layers = tapeLayers({
    oddsHome: 0.57,
    ticketHome: 0.8,
    handleHome: 0.54,
    steam: true,
  });
  const tickets = layers.find((l) => l.id === "tickets")!;
  const handle = layers.find((l) => l.id === "handle")!;
  const steam = layers.find((l) => l.id === "steam")!;
  assert.ok(handle.precision > tickets.precision);
  assert.match(tickets.note, /never copy/i);
  assert.equal(steam.empty, undefined);
  assert.ok(Math.abs(steam.home - 0.57) < 0.001);
});

test("missing tape stays empty", () => {
  const layers = tapeLayers({});
  assert.ok(layers.every((l) => l.empty || l.precision === 0));
});
