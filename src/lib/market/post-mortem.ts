/** One-sentence luck vs strategy after a ticket settles. Never invent a box score. */

export function postMortem(opts: {
  selection: string;
  chance?: number;
  status: "win" | "loss" | "void" | "open" | "dismissed";
  edge?: number | null;
}): string {
  const pct = opts.chance != null && Number.isFinite(opts.chance) ? Math.round(opts.chance * 100) : null;
  const name = opts.selection;
  if (opts.status === "void") {
    return `${name} pushed. You get the original dollars back. Tie / refund — not a hit, not a miss.`;
  }
  if (opts.status === "win") {
    if (pct != null && pct < 48) {
      return `Fluky win. ${name} was the longer side${pct ? ` (${pct}% desk chance)` : ""}. Lucky finish on a low-edge play.`;
    }
    return `Hit. ${name}${pct ? ` had a ${pct}% desk chance` : ""}. Marked Hit on Log. This site never placed the bet.`;
  }
  if (opts.status === "loss") {
    if (pct != null && pct >= 58) {
      return `Unlucky loss. Model gave ${name} a ${pct}% true chance. Strategy was sound; the bounce went the other way.`;
    }
    return `Miss. ${name}${pct ? ` had a ${pct}% desk chance` : ""}. Marked Miss on Log. This site never placed the bet.`;
  }
  return `${name} is still waiting. After the game, tap Hit or Miss.`;
}
