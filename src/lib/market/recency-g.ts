import { clip } from "./math.ts";
/** Last-10 scores on G. Recency-weighted, early-season damped for NFL. Empty log does not invent a streak. */
import { analyzeScores, earlySeasonDamp, type ScoreGame } from "./form.ts";
import type { FormBlock } from "./chance.ts";

export type RecencySnap = {
  sport: string;
  home: string;
  away: string;
  lastFive?: FormBlock[];
};

export type RecencyMeans = {
  muH: number;
  muA: number;
  empty: boolean;
  note?: string;
};



function blockFor(tape: FormBlock[] | undefined, team: string): FormBlock | undefined {
  if (!tape?.length) return undefined;
  const n = team.toLowerCase();
  return tape.find((b) => b.team.toLowerCase() === n);
}

function gamesOf(block?: FormBlock): ScoreGame[] {
  if (!block) return [];
  if (block.games?.length) return block.games;
  return (block.results ?? []).map((result) => ({ result }));
}

export function applyRecencyToMeans(snap: RecencySnap, muH: number, muA: number): RecencyMeans {
  const home = analyzeScores(gamesOf(blockFor(snap.lastFive, snap.home)), 10, 3);
  const away = analyzeScores(gamesOf(blockFor(snap.lastFive, snap.away)), 10, 3);
  if (!home || !away) {
    return {
      muH,
      muA,
      empty: true,
      note: "Looked up last-10 scores. Empty look.",
    };
  }
  const n = Math.min(home.n, away.n);
  const damp = earlySeasonDamp(n, snap.sport);
  const hasScores = home.avgPf + home.avgPa + away.avgPf + away.avgPa > 0;
  const wpTilt = clip((home.wp - away.wp) * 0.1 * damp, -0.05, 0.05);
  const marginTilt = hasScores
    ? clip(((home.avgMargin - away.avgMargin) / 14) * 0.08 * damp, -0.05, 0.05)
    : 0;
  const tilt = clip(wpTilt + marginTilt, -0.07, 0.07);
  if (Math.abs(tilt) < 1e-6 || damp <= 0) {
    return {
      muH,
      muA,
      empty: true,
      note: "Last-10 posted but damped to empty (early NFL slate).",
    };
  }
  return {
    muH: muH * (1 + tilt),
    muA: muA * (1 - tilt),
    empty: false,
    note: `Last-10 recency home WP ${home.wp.toFixed(2)} vs ${away.wp.toFixed(2)}. Damp ${damp.toFixed(2)}.`,
  };
}

