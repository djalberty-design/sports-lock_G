/**
 * Wire live score/clock into buildLatents. Idempotent.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DEST = join(ROOT, "src/lib/market/engine.ts");
let text = readFileSync(DEST, "utf8");
if (text.includes("inPlay: Boolean(row.inPlay)")) {
  console.log("patch-engine-live: already wired");
  process.exit(0);
}

const a = "    const built = buildLatents({ ...chanceInput, eventId });";
const a2 = `    const built = buildLatents({
      ...chanceInput,
      eventId,
      inPlay: Boolean(row.inPlay),
      homeScore: row.homeScore,
      awayScore: row.awayScore,
      period: row.period,
      clock: row.clock,
    });`;
if (!text.includes(a)) throw new Error("patch-engine-live: buildLatents call not found");
text = text.replace(a, a2);

const b = `      let leftover = false;
      const already =
        r.inPlay && r.homeScore != null && r.awayScore != null ? r.homeScore + r.awayScore : undefined;
      if (r.inPlay && r.marketType === "total" && already != null) {
        const line = r.point ?? r.total ?? 0;
        const live = liveFromRow(r);
        if (live.scoreHome != null || already != null) {
          const pOver = leftoverOverProb({
            sport: r.sport,
            postedTotal: line,
            already,
            period: r.period,
            clock: r.clock,
          });
          const isOver = r.side === "over" || /\\bover\\b/i.test(r.selection);
          poolFair = isOver ? pOver : 1 - pOver;
          simFair = undefined;
          leftover = true;
        }
      }`;
const b2 = `      const leftover = Boolean(r.inPlay && r.homeScore != null && r.awayScore != null);
      if (leftover && r.marketType === "total") {
        const line = r.point ?? r.total ?? 0;
        const pOver = leftoverOverProb({
          sport: r.sport,
          postedTotal: line,
          already: r.homeScore + r.awayScore,
          period: r.period,
          clock: r.clock,
        });
        const isOver = r.side === "over" || /\\bover\\b/i.test(r.selection);
        poolFair = isOver ? pOver : 1 - pOver;
      }`;
if (!text.includes(b)) throw new Error("patch-engine-live: leftover block not found");
text = text.replace(b, b2);

const c = "      const fairProb = leftover ? poolFair : dynamicBlend(simFair, poolFair, marketFair, r.start, tPct, hPct);";
const c2 = "      const fairProb = dynamicBlend(simFair, poolFair, marketFair, r.start, tPct, hPct);";
if (!text.includes(c)) throw new Error("patch-engine-live: fairProb line not found");
text = text.replace(c, c2);

text = text.replace(
  'import { leftoverOverProb, liveFromRow } from "./live-state.ts";',
  'import { leftoverOverProb } from "./live-state.ts";',
);

writeFileSync(DEST, text);
console.log("patch-engine-live: wired remaining G into engine.ts");
