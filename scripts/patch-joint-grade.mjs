/** Wire combineParlayFair into picks.ts and engine.ts. Idempotent. */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

function patchPicks() {
  const dest = join(ROOT, "src/lib/market/picks.ts");
  let text = readFileSync(dest, "utf8");
  if (text.includes("combineParlayFair")) {
    console.log("patch-joint-grade picks: already wired");
    return;
  }
  if (!text.includes('import { correlationOf, sgpHaircut } from "./parlays.ts";')) {
    throw new Error("patch-joint-grade: picks import not found");
  }
  text = text.replace(
    'import { correlationOf, sgpHaircut } from "./parlays.ts";',
    'import { correlationOf, sgpHaircut } from "./parlays.ts";\nimport { combineParlayFair } from "./joint-grade.ts";',
  );
  const a = `  const sameGame = new Set(legs.map((l) => l.eventId)).size < legs.length;
  const mlAndSpread = sameGame && legs.some((l) => l.marketType === "ml") && legs.some((l) => l.marketType === "spread");
  const raw = product(legs.map((l) => (Number.isFinite(l.fairProb) ? (l.fairProb as number) : 0.5)));
  const combinedFair = Math.min(0.97, raw * (sameGame ? sgpHaircut(legs.length, mlAndSpread) : 1));`;
  const a2 = `  const graded = combineParlayFair(legs);
  const sameGame = graded.sameGame;
  const combinedFair = graded.combinedFair;`;
  if (!text.includes(a)) throw new Error("patch-joint-grade: shownParlayFromStoreLegs block missing");
  text = text.replace(a, a2);
  const b = `  const sameGame = new Set(rows.map((r) => r.eventId)).size < rows.length;
  const mlAndSpread = sameGame && rows.some((l) => l.marketType === "ml") && rows.some((l) => l.marketType === "spread");
  const usedSim = false;
  const raw = product(rows.map((l) => (Number.isFinite(l.fairProb) ? l.fairProb : 0.5)));
  const combinedFair = Math.min(0.97, raw * (sameGame ? sgpHaircut(rows.length, mlAndSpread) : 1));`;
  const b2 = `  const graded = combineParlayFair(rows);
  const sameGame = graded.sameGame;
  const usedSim = graded.correlation === "shared-latent";
  const combinedFair = graded.combinedFair;`;
  if (!text.includes(b)) throw new Error("patch-joint-grade: fallbackParlay block missing");
  text = text.replace(b, b2);
  writeFileSync(dest, text);
  console.log("patch-joint-grade picks: wired");
}

function patchEngine() {
  const dest = join(ROOT, "src/lib/market/engine.ts");
  let text = readFileSync(dest, "utf8");
  if (text.includes("combineParlayFair(legs)")) {
    console.log("patch-joint-grade engine: already wired");
    return;
  }
  if (!text.includes('import { growthScore, jointFromLegs, sameGameRho } from "./copula.ts";')) {
    throw new Error("patch-joint-grade: engine copula import missing");
  }
  text = text.replace(
    'import { growthScore, jointFromLegs, sameGameRho } from "./copula.ts";',
    'import { growthScore, jointFromLegs, sameGameRho } from "./copula.ts";\nimport { combineParlayFair } from "./joint-grade.ts";',
  );
  const old = `  const mlAndSpread = sameGame && legs.some((l) => l.marketType === "ml") && legs.some((l) => l.marketType === "spread");
  const joint = sameGameJoint(legs);
  const usedSim = joint != null;
  const rho = sameGame ? sameGameRho(legs) : 0;
  const hair = usedSim ? 1 : sameGame ? sgpHaircut(legs.length, mlAndSpread) : 1;
  const rawFair = usedSim
    ? joint
    : sameGame
      ? jointFromLegs(legs.map((l) => l.fairProb), rho)
      : product(legs.map((l) => l.fairProb));
  const combinedFair = Math.min(0.97, usedSim || sameGame ? rawFair : rawFair * hair);`;
  const neu = `  const graded = combineParlayFair(legs);
  const usedSim = graded.correlation === "shared-latent";
  const combinedFair = graded.combinedFair;`;
  if (!text.includes(old)) throw new Error("patch-joint-grade: evaluateParlay block missing");
  text = text.replace(old, neu);
  writeFileSync(dest, text);
  console.log("patch-joint-grade engine: wired");
}

patchPicks();
patchEngine();
