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
	const graded = combineParlayFair(legs);
	const fair = graded.combinedFair;
	const sameGame = graded.sameGame;
	const implied = product(legs.map((l) => americanToImplied(l.price)));
	const decimalPayout = product(legs.map((l) => americanToDecimal(l.price)));
	const profitOn100 = (decimalPayout - 1) * 100;
	const longshot = legs.length >= 4 || fair < .2;
	const entertainment = fair < .25 || legs.length >= 4;
	const shownPct = formatChancePct(shownCombinedChance(fair, decimalPayout, legs.length, sameGame)) ?? \`\${Math.round(fair * 100)}%\`;
	return {
		legs,
		combinedFair: fair,
		combinedImplied: implied,
		decimalPayout,
		profitOn100,
		independent: !sameGame,
		longshot,
		entertainment,
		correlation: graded.correlation,
		headline: entertainment ? \`\${legs.length}-game parlay — fun money, not a plan\` : \`\${legs.length}-game parlay\`,
		because: [
			sameGame && graded.correlation === "shared-latent"
				? \`Same-game joint off G (Clayton). Combined chance ≈ \${shownPct}.\`
				: sameGame
					? \`Thin fallback-haircut — G did not run on a leg. Combined chance ≈ \${shownPct}.\`
					: \`If every game is independent, about \${shownPct.replace("%", "")} in 100 tickets like this hit.\`,
			\`The sportsbook pays about $\${profitOn100.toFixed(0)} profit on a $100 bet if they all win.\`,
			longshot ? "Stacking more games makes the payout jump and the win chance collapse. That is the trade." : "Both (or all) must win or the whole ticket loses.",
			"Real parlays hit a bit less often than this math because each price already includes the house cut.",
			legs.some((l) => l.marketType === "prop") ? "Player-bet legs use the photographed number plus game total, script, weather, park, rest, and injuries." : null,
		].filter(Boolean).join(" ")
	};
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

if (!text.includes("combineParlayFair")) {
  text = text.replace(
    'import { sgpHaircut } from "./parlays.ts";',
    'import { sgpHaircut } from "./parlays.ts";\nimport { combineParlayFair } from "./joint-grade.ts";',
  );
}

text = text.replace(/export function gradeParlay\(legs\) \{[\s\S]*?\n\}\n(?=export function matchParsedToRows)/, GRADE_PARLAY + "\n");
if (!text.includes("combineParlayFair")) {
  throw new Error("assemble-research: combineParlayFair missing after gradeParlay patch");
}

if (text.includes("jointHit") || text.includes("from \"./sim.ts\"")) {
  throw new Error("assemble-research: jointHit or sim.ts import still present");
}

writeFileSync(DEST, text);
console.log(`assemble-research: wrote ${DEST} (${text.length} chars)`);
