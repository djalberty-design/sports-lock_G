/**
 * assemble-research.mjs — post-purge version.
 *
 * The old version fetched research.ts from a pinned GitHub commit and
 * string-patched out jointHit. That is no longer necessary: research.ts
 * in the working tree is authoritative, clean, and has no jointHit or
 * sim.ts import.
 *
 * This script now just validates that the invariants hold and exits.
 * If they fail, the build stops before Vite runs.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DEST = join(ROOT, "src/lib/market/research.ts");

const text = readFileSync(DEST, "utf8");

if (text.includes("jointHit")) {
  throw new Error("assemble-research: research.ts still contains jointHit — remove it.");
}

if (/from ["']\.\/sim\.ts["']/.test(text) && !text.includes("drawPaths")) {
  // sim.ts import is fine only if drawPaths or another valid export is used
  throw new Error("assemble-research: unexpected sim.ts import in research.ts.");
}

if (!text.includes("combineParlayFair")) {
  throw new Error("assemble-research: research.ts is missing combineParlayFair — math integrity check failed.");
}

if (!text.includes("gradeParlay")) {
  throw new Error("assemble-research: research.ts is missing gradeParlay.");
}

console.log(`assemble-research: research.ts OK (${text.length} chars, invariants pass).`);
