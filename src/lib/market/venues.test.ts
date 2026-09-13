import assert from "node:assert/strict";
import { test } from "node:test";
import { lookupVenue, venueHr, venueHits, weatherAtVenue } from "./venues.ts";

test("Coors is altitude + hits; Trop is a dome", () => {
  const coors = lookupVenue("Coors Field", "MLB")!;
  const trop = lookupVenue("Tropicana Field", "MLB")!;
  assert.equal(coors.altitudeFt, 5280);
  assert.equal(coors.roof, "open");
  assert.ok((coors.hits ?? 0) > 1.1);
  assert.equal(trop.roof, "dome");
});

test("15 mph at Coors is not 15 mph at Petco", () => {
  const coors = weatherAtVenue(lookupVenue("Coors Field", "MLB"), { windMph: 15 });
  const petco = weatherAtVenue(lookupVenue("Petco Park", "MLB"), { windMph: 15 });
  assert.ok(coors.hrMul > petco.hrMul);
  assert.ok(coors.totalMul > petco.totalMul);
});

test("dome kills incoming wind", () => {
  const trop = weatherAtVenue(lookupVenue("Tropicana Field", "MLB"), { windMph: 22, precip: 80 });
  assert.equal(trop.effectiveWind, 0);
  assert.equal(trop.enclosed, true);
});

test("Allegiant is enclosed for football weather", () => {
  const a = weatherAtVenue(lookupVenue("Allegiant Stadium", "NFL"), { windMph: 18 });
  assert.equal(a.enclosed, true);
  assert.equal(a.effectiveWind, 0);
});

test("park helpers stay on the library", () => {
  assert.ok(venueHits("Fenway Park") > 1);
  assert.ok(venueHr("Oracle Park") < 0.9);
});
