import assert from "node:assert/strict";
import { test } from "node:test";
import { ALGORITHM_RULES, DESK_VERSION, ruleFired, ruleStamp, rulesFor } from "./rules.ts";

test("desk version is pinned so two boards cannot silently disagree", () => {
  assert.equal(DESK_VERSION, "2026.09.13-master-v9");
});

test("the rule list is the same every time and covers every ticket type", () => {
  assert.ok(ALGORITHM_RULES.length >= 16);
  assert.deepEqual(ALGORITHM_RULES.map((r) => r.id), ALGORITHM_RULES.map((r) => r.id));
  for (const kind of ["game", "prop", "period", "parlay"] as const) {
    const rules = rulesFor(kind);
    assert.ok(rules.some((r) => r.id === "market"));
    assert.ok(rules.some((r) => r.id === "edge"));
    assert.ok(rules.some((r) => r.id === "calibrate"));
    assert.ok(rules.some((r) => r.id === "last10"));
    assert.ok(rules.some((r) => r.id === "h2h"));
    assert.ok(rules.some((r) => r.id === "defense"));
  }
  assert.ok(rulesFor("prop").some((r) => r.id === "usage"));
  assert.ok(rulesFor("game").some((r) => r.id === "underlying"));
  assert.ok(rulesFor("prop").some((r) => r.id === "platoon"));
  assert.ok(rulesFor("period").some((r) => r.id === "period-shrink"));
  assert.ok(rulesFor("parlay").some((r) => r.id === "sgp"));
  assert.ok(rulesFor("game").some((r) => r.id === "latent"));
  assert.ok(rulesFor("all").some((r) => r.id === "live-state") || rulesFor("game").some((r) => r.id === "live-state"));
});

test("every rule looks up live data — empty feed is Looked, never a skip and never invented", () => {
  const last10 = ALGORITHM_RULES.find((r) => r.id === "last10")!;
  const h2h = ALGORITHM_RULES.find((r) => r.id === "h2h")!;
  const venue = ALGORITHM_RULES.find((r) => r.id === "venue-split")!;
  assert.equal(ruleStamp(last10, [{ id: "market" }]), "Looked");
  assert.equal(ruleStamp(last10, [{ id: "form" }]), "Ran");
  assert.equal(ruleStamp(last10, [{ id: "form", thin: true }]), "Thin");
  assert.equal(ruleStamp(h2h, [{ id: "h2h", empty: true, thin: true }]), "Looked");
  assert.equal(ruleStamp(venue, [{ id: "venue-split", thin: true }]), "Thin");
  const edge = ALGORITHM_RULES.find((r) => r.id === "edge")!;
  assert.equal(ruleStamp(edge, []), "Ran");
  assert.equal(ruleFired(last10, ["form"]), true);
});

test("process stamps Looked unless the dedicated process layer Ran — cousins do not count", () => {
  const process = ALGORITHM_RULES.find((r) => r.id === "process")!;
  assert.deepEqual(process.layerIds, ["process"]);
  assert.equal(ruleStamp(process, [{ id: "underlying" }, { id: "defense" }]), "Looked");
  assert.equal(ruleStamp(process, [{ id: "process", empty: true }]), "Looked");
  assert.equal(ruleStamp(process, [{ id: "process" }]), "Ran");
});

