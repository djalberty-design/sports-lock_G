/** Insert availability layer into buildChance. Idempotent. */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const dest = join(ROOT, "src/lib/market/chance.ts");
let text = readFileSync(dest, "utf8");
if (text.includes('from "./availability.ts"') && text.includes('id: "availability"')) {
  console.log("patch-availability-chance: already wired");
  process.exit(0);
}
if (!text.includes('from "./availability.ts"')) {
  const lines = text.split("\n");
  let last = -1;
  let pending = false;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (/^import\s/.test(l)) {
      pending = !/;/.test(l);
      last = i;
    } else if (pending) {
      last = i;
      if (/;/.test(l)) pending = false;
    }
  }
  if (last < 0) throw new Error("patch-availability-chance: no imports");
  lines.splice(last + 1, 0, 'import { availabilityEffect } from "./availability.ts";');
  text = lines.join("\n");
}
const needle = "  if (!layers.length) return null;";
if (!text.includes(needle)) throw new Error("patch-availability-chance: insert point missing");
if (!text.includes('id: "availability"')) {
  const block = `  const avail = availabilityEffect({
    sport,
    homeOuts: input.homeOuts,
    awayOuts: input.awayOuts,
    homeQuestionable: input.homeQuestionable,
    awayQuestionable: input.awayQuestionable,
  });
  pushLayer(layers, {
    id: "availability",
    label: "Availability",
    home: avail.layerHome,
    precision: avail.empty ? 0 : avail.precision,
    family: "context",
    note: avail.note,
    thin: avail.empty,
    empty: avail.empty,
  });

`;
  text = text.replace(needle, block + needle);
}
writeFileSync(dest, text);
console.log("patch-availability-chance: wired");
