/** H2H and home/road on G. Season log first, then posted looks. Missing both = empty. */
import { splitByVenue, vsOpponent, type ScoreGame } from "./form.ts";
import type { FormBlock } from "./chance.ts";
import type { SplitBag, TeamLooks } from "./looks.ts";

export type SplitSnap = {
  sport: string;
  home: string;
  away: string;
  lastFive?: FormBlock[];
  homeLooks?: TeamLooks;
  awayLooks?: TeamLooks;
};

export type SplitLayer = {
  id: "h2h" | "venue-split";
  label: string;
  home: number;
  precision: number;
  empty: boolean;
  note: string;
};

export type SplitMeans = {
  muH: number;
  muA: number;
  empty: boolean;
  note?: string;
  layers: SplitLayer[];
};

function clip(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function invLogit(z: number): number {
  return clip(1 / (1 + Math.exp(-z)), 0.08, 0.92);
}

function blockFor(tape: FormBlock[] | undefined, team: string): FormBlock | undefined {
  if (!tape?.length) return undefined;
  const n = team.toLowerCase();
  return tape.find((b) => b.team.toLowerCase() === n);
}

function gamesOf(block?: FormBlock): ScoreGame[] {
  return block?.games ?? [];
}

function seasonOf(block?: FormBlock): ScoreGame[] {
  return block?.seasonGames ?? [];
}

function leanFromBags(h?: SplitBag, a?: SplitBag): number | null {
  if (!h || !a) return null;
  if (h.wp != null && a.wp != null && Number.isFinite(h.wp) && Number.isFinite(a.wp)) {
    const hw = clip(h.wp, 0.08, 0.92);
    const aw = clip(a.wp, 0.08, 0.92);
    return invLogit(Math.log(hw / (1 - hw)) - Math.log(aw / (1 - aw)));
  }
  if (h.ops != null && a.ops != null) return invLogit((h.ops - a.ops) * 2.4);
  if (h.ptsG != null && a.ptsG != null) return invLogit(((h.ptsG - a.ptsG) / 12) * 0.9);
  return null;
}

export function splitLayers(snap: SplitSnap): SplitLayer[] {
  const hb = blockFor(snap.lastFive, snap.home);
  const ab = blockFor(snap.lastFive, snap.away);
  const h2hHome = vsOpponent(gamesOf(hb), snap.away, seasonOf(hb));
  const h2hAway = vsOpponent(gamesOf(ab), snap.home, seasonOf(ab));
  const layers: SplitLayer[] = [];

  if (h2hHome && h2hAway && h2hHome.n + h2hAway.n >= 2) {
    const p = invLogit((h2hHome.wp - h2hAway.wp) * 1.6 + (h2hHome.avgMargin - h2hAway.avgMargin) / 18);
    layers.push({
      id: "h2h",
      label: "Head-to-head",
      home: p,
      precision: Math.min(2.8, 0.9 + 0.25 * (h2hHome.n + h2hAway.n)),
      empty: false,
      note: `H2H from the season log. ${h2hHome.n + h2hAway.n} games.`,
    });
  } else {
    const fromLooks = leanFromBags(snap.homeLooks?.vsOpp, snap.awayLooks?.vsOpp);
    if (fromLooks != null) {
      layers.push({
        id: "h2h",
        label: "Head-to-head",
        home: fromLooks,
        precision: 1.8,
        empty: false,
        note: "H2H from the posted vs-opponent look. Not a full series log.",
      });
    } else {
      layers.push({
        id: "h2h",
        label: "Head-to-head",
        home: 0.5,
        precision: 0,
        empty: true,
        note: "Looked up H2H. Empty look.",
      });
    }
  }

  const homeVenue = splitByVenue(gamesOf(hb), seasonOf(hb)).home;
  const awayVenue = splitByVenue(gamesOf(ab), seasonOf(ab)).away;
  if (homeVenue && awayVenue) {
    const p = invLogit((homeVenue.wp - awayVenue.wp) * 1.4 + (homeVenue.avgMargin - awayVenue.avgMargin) / 20);
    layers.push({
      id: "venue-split",
      label: "Home / road split",
      home: p,
      precision: Math.min(2.6, 0.8 + 0.2 * (homeVenue.n + awayVenue.n)),
      empty: false,
      note: `Home ${homeVenue.n} games vs away ${awayVenue.n} on the road.`,
    });
  } else {
    const fromLooks = leanFromBags(snap.homeLooks?.home, snap.awayLooks?.away);
    if (fromLooks != null) {
      layers.push({
        id: "venue-split",
        label: "Home / road split",
        home: fromLooks,
        precision: 1.7,
        empty: false,
        note: "Home/road from posted split bags.",
      });
    } else {
      layers.push({
        id: "venue-split",
        label: "Home / road split",
        home: 0.5,
        precision: 0,
        empty: true,
        note: "Looked up home/road. Empty look.",
      });
    }
  }
  return layers;
}

export function applySplitsToMeans(snap: SplitSnap, muH: number, muA: number): SplitMeans {
  const layers = splitLayers(snap);
  const live = layers.filter((l) => !l.empty);
  if (!live.length) {
    return { muH, muA, empty: true, layers, note: "H2H and home/road empty." };
  }
  const lean = live.reduce((s, l) => s + (l.home - 0.5) * Math.min(1, l.precision / 2), 0) / live.length;
  const tilt = clip(lean * 0.28, -0.06, 0.06);
  return {
    muH: muH * (1 + tilt),
    muA: muA * (1 - tilt),
    empty: false,
    layers,
    note: live.map((l) => l.note).join(" "),
  };
}
