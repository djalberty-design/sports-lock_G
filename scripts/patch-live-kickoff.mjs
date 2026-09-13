/** Kickoff-passed counts as live for remaining G. Idempotent. */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const dest = join(ROOT, "src/lib/market/live-state.ts");
let text = readFileSync(dest, "utf8");
if (!text.includes("isLiveTicket({ inPlay: live.inPlay, start: live.start })")) {
  if (!text.includes('from "./call-gate.ts"')) {
    text = text.replace(
      'import type { GameLatent } from "./sim.ts";\n',
      'import type { GameLatent } from "./sim.ts";\nimport { isLiveTicket } from "./call-gate.ts";\n',
    );
  }
  text = text.replace(
    "    inPlay?: boolean;\n    homeScore?: number;\n    awayScore?: number;\n    period?: string;\n    clock?: string;\n  },\n): GameLatent {\n  if (!live.inPlay) return g;",
    "    inPlay?: boolean;\n    start?: string;\n    homeScore?: number;\n    awayScore?: number;\n    period?: string;\n    clock?: string;\n  },\n): GameLatent {\n  if (!isLiveTicket({ inPlay: live.inPlay, start: live.start })) return g;",
  );
  text = text.replace(
    "  inPlay?: boolean;\n  homeScore?: number;\n  awayScore?: number;\n  period?: string;\n  clock?: string;\n  situation?: string;\n}): LiveState {\n  return parseLiveState({\n    eventId: row.eventId,\n    sport: row.sport,\n    inPlay: Boolean(row.inPlay),",
    "  inPlay?: boolean;\n  start?: string;\n  homeScore?: number;\n  awayScore?: number;\n  period?: string;\n  clock?: string;\n  situation?: string;\n}): LiveState {\n  return parseLiveState({\n    eventId: row.eventId,\n    sport: row.sport,\n    inPlay: Boolean(row.inPlay) || isLiveTicket({ inPlay: row.inPlay, start: row.start }),",
  );
  writeFileSync(dest, text);
}
const lat = join(ROOT, "src/lib/market/latents.ts");
let L = readFileSync(lat, "utf8");
if (!L.includes("start: input.start")) {
  L = L.replace(
    "    inPlay: input.inPlay,\n    homeScore: input.homeScore,",
    "    inPlay: input.inPlay,\n    start: input.start,\n    homeScore: input.homeScore,",
  );
  writeFileSync(lat, L);
}
console.log("patch-live-kickoff: wired");
