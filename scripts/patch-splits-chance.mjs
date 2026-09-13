/** Insert h2h + venue-split layers into buildChance. Idempotent. */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const dest = join(ROOT, "src/lib/market/chance.ts");
let text = readFileSync(dest, "utf8");
if (text.includes('from "./splits-g.ts"') && text.includes('id: "h2h"')) {
  console.log("patch-splits-chance: already wired");
  process.exit(0);
}
if (!text.includes('from "./splits-g.ts"')) {
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
  if (last < 0) throw new Error("patch-splits-chance: no imports");
  lines.splice(last + 1, 0, 'import { splitLayers } from "./splits-g.ts";');
  text = lines.join("\n");
}
const needle = "  if (!layers.length) return null;";
if (!text.includes(needle)) throw new Error("patch-splits-chance: insert point missing");
if (!text.includes('id: "h2h"')) {
  const block = `  for (const layer of splitLayers({
    sport,
    home: input.home,
    away: input.away,
    lastFive: input.lastFive,
    homeLooks: input.homeLooks,
    awayLooks: input.awayLooks,
  })) {
    if (layer.empty) pushEmpty(layers, layer.id, layer.label, layer.note);
    else pushLayer(layers, { ...layer, family: "context" });
  }

`;
  text = text.replace(needle, block + needle);
}
writeFileSync(dest, text);
console.log("patch-splits-chance: wired");
