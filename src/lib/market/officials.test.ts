import assert from "node:assert/strict";
import { test } from "node:test";
import { applyOfficialsToMeans, officialLayer, parseEspnOfficials } from "./officials.ts";

test("ESPN crew names parse, tendency stays empty", () => {
  const crew = parseEspnOfficials({
    gameInfo: {
      officials: [
        { fullName: "Angel Hernandez", position: { displayName: "Home Plate" } },
        { displayName: "Joe West", position: "First Base" },
      ],
    },
  });
  assert.equal(crew.length, 2);
  assert.equal(crew[0]?.name, "Angel Hernandez");
  const layer = officialLayer({ sport: "MLB", officials: crew });
  assert.equal(layer.empty, true);
  // Latents pipeline passes 1, 1 for multipliers
  const m = applyOfficialsToMeans({ sport: "MLB", officials: crew }, 1, 1);
  assert.equal(m.empty, true);
  assert.equal(m.muH, 1);
});

test("posted plate totalOverBias moves total, not a fake favorite", () => {
  const m = applyOfficialsToMeans(
    { sport: "MLB", officials: [{ name: "Plate", role: "HP", totalOverBias: 0.03 }] },
    1,
    1,
  );
  assert.equal(m.empty, false);
  assert.ok(m.muH > 1 && m.muA > 1);
});

test("missing crew is empty", () => {
  const layer = officialLayer({ sport: "NFL" });
  assert.equal(layer.empty, true);
});
