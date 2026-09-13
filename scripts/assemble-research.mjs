/**
 * Restore src/lib/market/research.ts from the last complete commit,
 * then drop the leftover jointHit import/call. Does not touch sim.ts.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DEST = join(ROOT, "src/lib/market/research.ts");
const SOURCE =
  "https://raw.githubusercontent.com/djalberty-design/sports-lock_G/f247376fb0b16398a2e64b7204bf3210828626c0/src/lib/market/research.ts";

const GRADE_PARLAY = `export function gradeParlay(legs) {
\tconst sameGame = new Set(legs.map((l) => l.eventId)).size < legs.length;
\tconst mlAndSpread = sameGame && legs.some((l) => l.marketType === "ml") && legs.some((l) => l.marketType === "spread");
\tconst raw = product(legs.map((l) => Number.isFinite(l.fairProb) ? l.fairProb : americanToImplied(l.price)));
\tconst fair = Math.min(.97, raw * (sameGame ? sgpHaircut(legs.length, mlAndSpread) : 1));
\tconst implied = product(legs.map((l) => americanToImplied(l.price)));
\tconst decimalPayout = product(legs.map((l) => americanToDecimal(l.price)));
\tconst profitOn100 = (decimalPayout - 1) * 100;
\tconst longshot = legs.length >= 4 || fair < .2;
\tconst entertainment = fair < .25 || legs.length >= 4;
\tconst shownPct = formatChancePct(shownCombinedChance(fair, decimalPayout, legs.length, sameGame)) ?? \`\${Math.round(fair * 100)}%\`;
\treturn {
\t\tlegs,
\t\tcombinedFair: fair,
\t\tcombinedImplied: implied,
\t\tdecimalPayout,
\t\tprofitOn100,
\t\tindependent: !sameGame,
\t\tlongshot,
\t\tentertainment,
\t\tcorrelation: sameGame ? "fallback-haircut" : "near-independent",
\t\theadline: entertainment ? \`\${legs.length}-game parlay — fun money, not a plan\` : \`\${legs.length}-game parlay\`,
\t\tbecause: [
\t\t\tsameGame
\t\t\t\t? \`Thin fallback-haircut. Combined chance ≈ \${shownPct}.\`
\t\t\t\t: \`If every game is independent, about \${shownPct.replace("%", "")} in 100 tickets like this hit.\`,
\t\t\t\`The sportsbook pays about $\${profitOn100.toFixed(0)} profit on a $100 bet if they all win.\`,
\t\t\tlongshot ? "Stacking more games makes the payout jump and the win chance collapse. That is the trade." : "Both (or all) must win or the whole ticket loses.",
\t\t\t"Real parlays hit a bit less often than this math because each price already includes the house cut.",
\t\t\tlegs.some((l) => l.marketType === "prop") ? "Player-bet legs use the photographed number plus game total, script, weather, park, rest, and injuries." : null,
\t\t].filter(Boolean).join(" ")
\t};
}
`;

const res = await fetch(SOURCE);
if (!res.ok) {
  throw new Error(`assemble-research: fetch failed ${res.status} ${SOURCE}`);
}
let text = await res.text();
if (text.length < 20000 || !text.includes("export function gradeParlay")) {
  throw new Error("assemble-research: source file is not the full research.ts");
}

text = text.replace(/^import \{ drawPaths, latentFromScores \} from "\.\/sim\.ts";\n/m, "");
text = text.replace(/^import \{ drawPaths, jointHit, latentFromScores \} from "\.\/sim\.ts";\n/m, "");
text = text.replace(/^import \{ jointHit \} from "\.\/sim\.ts";\n/m, "");

if (text.includes("jointHit")) {
  text = text.replace(/export function gradeParlay\(legs\) \{[\s\S]*?\n\}\n(?=export function matchParsedToRows)/, GRADE_PARLAY + "\n");
}

if (text.includes("jointHit") || text.includes("from \"./sim.ts\"")) {
  throw new Error("assemble-research: jointHit or sim.ts import still present");
}

writeFileSync(DEST, text);
console.log(`assemble-research: wrote ${DEST} (${text.length} chars)`);
