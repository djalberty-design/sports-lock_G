/**
 * Florida DFS law (v7 §8). 18+. Fantasy only. Never a Hard Rock fill.
 * This site never submits the lineup.
 */
import { isChalk, ownershipFrac } from "./dfs-scoring.ts";
import type { SlatePlayer } from "./types.ts";

export const DFS_DISCLAIMER =
  "DraftKings Fantasy · salary-cap roster. 18+. Not Hard Rock Bet. Not DraftKings or FanDuel sportsbook tickets. Florida. This site never submits the lineup. Call 1-800-GAMBLER if play is no longer fun.";

/** Cheap, high points-per-dollar names. Research, not a sportsbook ticket. */
export function valueBridgeNotes(players: SlatePlayer[]): string[] {
  const live = players.filter((p) => p.status === "ok" && p.salary > 0 && p.p50 > 0);
  const ranked = [...live].sort((a, b) => b.value - a.value).slice(0, 4);
  return ranked
    .filter((p) => p.value >= 2.2 && p.salary <= 5600)
    .map(
      (p) =>
        `${p.name} at $${p.salary.toLocaleString()} is ${p.value.toFixed(1)} pts per $1k (p50 ${p.p50.toFixed(1)}). Underpriced vs the cap — Fantasy only.`,
    );
}

/** Chalk (>25% owned) → name a cheaper, lower-owned teammate when one exists. */
export function chalkPivots(players: SlatePlayer[]): string[] {
  const live = players.filter((p) => p.status === "ok");
  const notes: string[] = [];
  for (const chalk of live.filter((p) => isChalk(p.ownershipEst))) {
    const pivot = live
      .filter(
        (p) =>
          p.id !== chalk.id &&
          p.team === chalk.team &&
          p.pos === chalk.pos &&
          !isChalk(p.ownershipEst) &&
          p.salary <= chalk.salary + 200,
      )
      .sort((a, b) => ownershipFrac(a.ownershipEst) - ownershipFrac(b.ownershipEst) || b.value - a.value)[0];
    if (pivot) {
      notes.push(
        `${chalk.name} is chalk (${Math.round(ownershipFrac(chalk.ownershipEst) * 100)}%). ${pivot.name} is the same team/position, lower owned, $${pivot.salary.toLocaleString()}. Ownership is not a fill.`,
      );
    }
  }
  return notes.slice(0, 4);
}
