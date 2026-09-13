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
  const m = applyOfficialsToMeans({ sport: "MLB", officials: crew }, 4.4, 4.4);
  assert.equal(m.empty, true);
  assert.equal(m.muH, 4.4);
});

test("posted plate run expectancy moves total, not a fake favorite", () => {
  const m = applyOfficialsToMeans(
    { sport: "MLB", officials: [{ name: "Plate", role: "HP", runExp: 0.8 }] },
    4.4,
    4.4,
  );
  assert.equal(m.empty, false);
  assert.ok(m.muH > 4.4 && m.muA > 4.4);
});

test("missing crew is empty", () => {
  const layer = officialLayer({ sport: "NFL" });
  assert.equal(layer.empty, true);
});
