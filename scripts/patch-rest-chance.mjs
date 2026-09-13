/** Insert rest layer into buildChance. Idempotent. */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const dest = join(ROOT, "src/lib/market/chance.ts");
let text = readFileSync(dest, "utf8");
if (text.includes('from "./rest.ts"') && text.includes('id: "rest"')) {
  console.log("patch-rest-chance: already wired");
  process.exit(0);
}
if (!text.includes('from "./rest.ts"')) {
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
  if (last < 0) throw new Error("patch-rest-chance: no imports");
  lines.splice(last + 1, 0, 'import { restEffect } from "./rest.ts";');
  text = lines.join("\n");
}
const needle = "  if (!layers.length) return null;";
if (!text.includes(needle)) throw new Error("patch-rest-chance: insert point missing");
if (!text.includes('id: "rest"')) {
  const block = `  const rest = restEffect({
    sport,
    start: input.start,
    homeRestDays: input.homeRestDays ?? restDays(homeFormEarly, input.start),
    awayRestDays: input.awayRestDays ?? restDays(awayFormEarly, input.start),
  });
  pushLayer(layers, {
    id: "rest",
    label: "Rest / travel",
    home: rest.layerHome,
    precision: rest.empty ? 0 : rest.precision,
    family: "context",
    note: rest.note,
    thin: rest.empty,
    empty: rest.empty,
  });

`;
  text = text.replace(needle, block + needle);
}
writeFileSync(dest, text);
console.log("patch-rest-chance: wired");
