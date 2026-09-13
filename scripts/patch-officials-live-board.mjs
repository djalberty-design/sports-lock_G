/** Attach ESPN crew names onto research after summary parse. Idempotent. */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const dest = join(ROOT, "src/lib/market/live-board.ts");
let text = readFileSync(dest, "utf8");
if (text.includes("parseEspnOfficials")) {
  console.log("patch-officials-live-board: already wired");
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
  if (last < 0) throw new Error("patch-officials-live-board: no imports");
  lines.splice(last + 1, 0, 'import { parseEspnOfficials } from "./officials.ts";');
  text = lines.join("\n");
}
const needle = "const research = parseEspnSummary(raw, q.eventId, q.sport, parsed.espnId) as EventResearch;";
if (!text.includes(needle)) throw new Error("patch-officials-live-board: insert point missing");
text = text.replace(
  needle,
  needle + "\n      research.officials = parseEspnOfficials(raw);",
);
writeFileSync(dest, text);
console.log("patch-officials-live-board: wired");
