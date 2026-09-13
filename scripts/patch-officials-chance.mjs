/** Officials layer on buildChance. Idempotent. */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const dest = join(ROOT, "src/lib/market/chance.ts");
let text = readFileSync(dest, "utf8");
if (text.includes('from "./officials.ts"') && text.includes('id: "officials"')) {
  console.log("patch-officials-chance: already wired");
  process.exit(0);
}
if (!text.includes('from "./officials.ts"')) {
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
  if (last < 0) throw new Error("patch-officials-chance: no imports");
  lines.splice(last + 1, 0, 'import { officialLayer, type OfficialPosting } from "./officials.ts";');
  text = lines.join("\n");
}
if (!text.includes("officials?: OfficialPosting")) {
  text = text.replace("  layerHaircuts?: Record<string, number>;\n};", "  layerHaircuts?: Record<string, number>;\n  officials?: OfficialPosting[];\n};");
}
const needle = "  if (!layers.length) return null;";
if (!text.includes(needle)) throw new Error("patch-officials-chance: insert point missing");
if (!text.includes('id: "officials"')) {
  const block = `  {
    const layer = officialLayer({ sport, officials: input.officials });
    if (layer.empty) pushEmpty(layers, layer.id, layer.label, layer.note);
    else pushLayer(layers, { ...layer, family: "context" });
  }

`;
  text = text.replace(needle, block + needle);
}
writeFileSync(dest, text);
console.log("patch-officials-chance: wired");
