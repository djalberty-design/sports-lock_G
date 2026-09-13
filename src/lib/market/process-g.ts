/** Process / efficiency on G. EPA, xwOBA, KenPom, xG move means when posted. Missing files stay empty. */
import { leagueTotal } from "./chance.ts";
import { processFromLooks, type TeamLooks } from "./looks.ts";

export type ProcessSnap = {
  sport: string;
  homeLooks?: TeamLooks;
  awayLooks?: TeamLooks;
  homePf?: number;
  homePa?: number;
  awayPf?: number;
  awayPa?: number;
};

export type ProcessMeans = {
  muH: number;
  muA: number;
  empty: boolean;
  note?: string;
};

function clip(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function applyProcessToMeans(snap: ProcessSnap, muH: number, muA: number): ProcessMeans {
  const process = processFromLooks(snap.sport, snap.homeLooks, snap.awayLooks);
  if (!process.empty) {
    const tilt = clip((process.home - 0.5) * 0.22, -0.08, 0.08);
    return {
      muH: muH * (1 + tilt),
      muA: muA * (1 - tilt),
      empty: false,
      note: process.note,
    };
  }

  const hp = snap.homePf;
  const ha = snap.homePa;
  const ap = snap.awayPf;
  const aa = snap.awayPa;
  if (hp != null && ha != null && ap != null && aa != null && hp > 0 && ap > 0) {
    const homeExp = (hp + aa) / 2;
    const awayExp = (ap + ha) / 2;
    const league = leagueTotal(snap.sport) / 2;
    const tilt = clip((homeExp - awayExp) / Math.max(8, league * 2) * 0.35, -0.07, 0.07);
    const pace = clip((homeExp + awayExp) / Math.max(1, league * 2), 0.92, 1.08);
    return {
      muH: muH * pace * (1 + tilt),
      muA: muA * pace * (1 - tilt),
      empty: false,
      note: "Scoring-margin efficiency from points for/against. Process file was empty.",
    };
  }

  return {
    muH,
    muA,
    empty: true,
    note: process.note,
  };
}
