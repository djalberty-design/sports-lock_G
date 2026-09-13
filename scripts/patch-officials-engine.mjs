/** Pass posted officials into buildLatents. Idempotent. */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const dest = join(ROOT, "src/lib/market/engine.ts");
let text = readFileSync(dest, "utf8");
if (text.includes("officials: brief?.officials")) {
  console.log("patch-officials-engine: already wired");
  process.exit(0);
}
const needle = "      awayPitcherHand: brief?.awayPitcherHand,\n    };";
if (!text.includes(needle)) throw new Error("patch-officials-engine: insert point missing");
text = text.replace(needle, "      awayPitcherHand: brief?.awayPitcherHand,\n      officials: brief?.officials,\n    };");
writeFileSync(dest, text);
console.log("patch-officials-engine: wired");
