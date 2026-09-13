/** Point sheet + props park/weather at the venue library. Idempotent. */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

function patchSheet() {
  const dest = join(ROOT, "src/lib/market/sheet.ts");
  let text = readFileSync(dest, "utf8");
  if (text.includes('from "./venues.ts"')) {
    console.log("patch-venues sheet: already wired");
    return;
  }
  const importNeedle = text.match(/^import .*$/m);
  if (!importNeedle) throw new Error("patch-venues: sheet has no import");
  text = text.replace(
    importNeedle[0],
    `${importNeedle[0]}\nimport { venueHits, venueHr, venueWeatherMul } from "./venues.ts";`,
  );
  const hits = `function parkHits(venue?: string): number {
  return parkLookup(venue, PARK_HITS, 1);
}`;
  const hits2 = `function parkHits(venue?: string): number {
  return venueHits(venue);
}`;
  const hr = `function parkHr(venue?: string): number {
  return parkLookup(venue, PARK_HR, parkHits(venue));
}`;
  const hr2 = `function parkHr(venue?: string): number {
  return venueHr(venue);
}`;
  if (!text.includes(hits) || !text.includes(hr)) throw new Error("patch-venues: sheet park helpers missing");
  text = text.replace(hits, hits2).replace(hr, hr2);
  const start = text.indexOf('function weatherMul(ctx: Ctx, kind: "hits" | "hr" | "total" | "ks"): number {');
  const end = text.indexOf("function pace(ctx: Ctx):", start);
  if (start < 0 || end < 0) throw new Error("patch-venues: sheet weatherMul missing");
  text =
    text.slice(0, start) +
    `function weatherMul(ctx: Ctx, kind: "hits" | "hr" | "total" | "ks"): number {
  return venueWeatherMul(
    ctx.venue,
    ctx.sport,
    { windMph: ctx.weatherWind, precip: ctx.weatherPrecip, tempF: ctx.weatherTemp },
    kind,
  );
}

` +
    text.slice(end);
  writeFileSync(dest, text);
  console.log("patch-venues sheet: wired");
}

function patchProps() {
  const dest = join(ROOT, "src/lib/market/props.ts");
  let text = readFileSync(dest, "utf8");
  if (text.includes('from "./venues.ts"')) {
    console.log("patch-venues props: already wired");
    return;
  }
  const importNeedle = text.match(/^import .*$/m);
  if (!importNeedle) throw new Error("patch-venues: props has no import");
  text = text.replace(
    importNeedle[0],
    `${importNeedle[0]}\nimport { lookupVenue, venueHits } from "./venues.ts";`,
  );
  const old = `function parkHits(venue?: string): number | null {
  if (!venue) return null;
  const key = venue.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  for (const [name, f] of Object.entries(PARK_HITS)) {
    if (key.includes(name)) return f;
  }
  return null;
}`;
  const neu = `function parkHits(venue?: string): number | null {
  if (!venue || !lookupVenue(venue, "MLB")) return null;
  return venueHits(venue);
}`;
  if (!text.includes(old)) throw new Error("patch-venues: props parkHits missing");
  text = text.replace(old, neu);
  writeFileSync(dest, text);
  console.log("patch-venues props: wired");
}

patchSheet();
patchProps();
