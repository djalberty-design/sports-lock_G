/** Wire live Call gate into picks.ts. Idempotent. */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const dest = join(ROOT, "src/lib/market/picks.ts");
let text = readFileSync(dest, "utf8");
if (text.includes('from "./call-gate.ts"') && text.includes("isLiveDeskPick(p)")) {
  console.log("patch-call-gate: already wired");
  process.exit(0);
}
if (!text.includes('from "./call-gate.ts"')) {
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
  if (last < 0) throw new Error("patch-call-gate: no imports");
  lines.splice(last + 1, 0, 'import { isLiveDeskPick, isLiveTicket, liveQualityCap } from "./call-gate.ts";');
  text = lines.join("\n");
}
text = text.replace(
  "  inPlay?: boolean;\n}): number {",
  "  inPlay?: boolean;\n  start?: string;\n}): number {",
);
text = text.replace(
  "  if (opts.inPlay) q *= 0.52;\n  return Math.max(0.28, Math.min(1, q));",
  "  q = liveQualityCap(q, isLiveTicket({ inPlay: opts.inPlay, start: opts.start }));\n  return Math.max(0.28, Math.min(1, q));",
);
text = text.replace(
  "    inPlay: row.inPlay,\n  });",
  "    inPlay: row.inPlay,\n    start: row.start,\n  });",
);
text = text.replaceAll("  if (p.row?.inPlay) return false;", "  if (isLiveDeskPick(p)) return false;");
writeFileSync(dest, text);
console.log("patch-call-gate: wired");
