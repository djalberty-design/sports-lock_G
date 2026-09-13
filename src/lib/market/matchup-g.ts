/** Defense allowed, underlying contact/pitch, platoon, starter ERA on G. Empty looks stay empty. */
import { defenseAllowed, underlyingOffense, underlyingPitch, type TeamLooks } from "./looks.ts";

export type MatchupSnap = {
  sport: string;
  homeLooks?: TeamLooks;
  awayLooks?: TeamLooks;
  homeEra?: number;
  awayEra?: number;
  homePitcherHand?: "L" | "R";
  awayPitcherHand?: "L" | "R";
};

export type MatchupLayer = {
  id: "defense" | "underlying" | "platoon" | "pitcher";
  label: string;
  home: number;
  precision: number;
  empty: boolean;
  note: string;
};

export type MatchupMeans = {
  muH: number;
  muA: number;
  empty: boolean;
  note?: string;
  layers: MatchupLayer[];
};

function clip(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function invLogit(z: number): number {
  return clip(1 / (1 + Math.exp(-z)), 0.08, 0.92);
}

function leagueAllow(sport: string): number {
  if (sport === "NBA" || sport === "NCAAB") return 114;
  if (sport === "NFL" || sport === "NCAAF") return 22.5;
  if (sport === "NHL") return 3.05;
  return 4.5;
}

function defMul(sport: string, allowed: number): number {
  if (sport === "MLB") return clip(allowed, 0.86, 1.16);
  return clip(allowed / leagueAllow(sport), 0.88, 1.14);
}

export function matchupLayers(snap: MatchupSnap): MatchupLayer[] {
  const layers: MatchupLayer[] = [];
  const sport = snap.sport;
  const hDef = defenseAllowed(snap.homeLooks, sport);
  const aDef = defenseAllowed(snap.awayLooks, sport);
  if (hDef != null && aDef != null) {
    const z = sport === "MLB" ? (hDef - aDef) * -1.4 : ((aDef - hDef) / leagueAllow(sport)) * 1.6;
    layers.push({
      id: "defense",
      label: "Defense allowed",
      home: invLogit(z),
      precision: 2.2,
      empty: false,
      note: "Opponent-allowed look. Home scores against the away unit.",
    });
  } else {
    layers.push({
      id: "defense",
      label: "Defense allowed",
      home: 0.5,
      precision: 0,
      empty: true,
      note: "Looked up defense allowed. Empty look.",
    });
  }

  const hOff = underlyingOffense(snap.homeLooks?.last7 ?? snap.homeLooks?.season);
  const aOff = underlyingOffense(snap.awayLooks?.last7 ?? snap.awayLooks?.season);
  const hPit = underlyingPitch(snap.homeLooks?.last7 ?? snap.homeLooks?.season);
  const aPit = underlyingPitch(snap.awayLooks?.last7 ?? snap.awayLooks?.season);
  if (hOff != null && aOff != null) {
    const z = (hOff - aOff) * 3.2 + (aPit != null && hPit != null ? (hPit - aPit) * 1.1 : 0);
    layers.push({
      id: "underlying",
      label: "Underlying contact / pitch",
      home: invLogit(z),
      precision: 2.0,
      empty: false,
      note: "OBP/ISO or pitch quality. Not raw wins.",
    });
  } else {
    layers.push({
      id: "underlying",
      label: "Underlying contact / pitch",
      home: 0.5,
      precision: 0,
      empty: true,
      note: "Looked up underlying. Empty look.",
    });
  }

  const homeVs =
    snap.awayPitcherHand === "L" ? snap.homeLooks?.vsLeft : snap.awayPitcherHand === "R" ? snap.homeLooks?.vsRight : undefined;
  const awayVs =
    snap.homePitcherHand === "L" ? snap.awayLooks?.vsLeft : snap.homePitcherHand === "R" ? snap.awayLooks?.vsRight : undefined;
  if (homeVs?.ops != null && awayVs?.ops != null) {
    layers.push({
      id: "platoon",
      label: "Platoon / handedness",
      home: invLogit((homeVs.ops - awayVs.ops) * 2.6),
      precision: 1.9,
      empty: false,
      note: `Home vs ${snap.awayPitcherHand ?? "?"}HP, away vs ${snap.homePitcherHand ?? "?"}HP.`,
    });
  } else {
    layers.push({
      id: "platoon",
      label: "Platoon / handedness",
      home: 0.5,
      precision: 0,
      empty: true,
      note: "Looked up platoon. Empty look — need a posted hand and vs-L/R split.",
    });
  }

  const hEra = snap.homeEra ?? snap.homeLooks?.last7?.era ?? snap.homeLooks?.season.era;
  const aEra = snap.awayEra ?? snap.awayLooks?.last7?.era ?? snap.awayLooks?.season.era;
  if (hEra != null && aEra != null && Number.isFinite(hEra) && Number.isFinite(aEra)) {
    layers.push({
      id: "pitcher",
      label: "Starter / staff ERA",
      home: invLogit((aEra - hEra) / 2.2),
      precision: 2.1,
      empty: false,
      note: `Home ERA ${hEra.toFixed(2)} vs away ${aEra.toFixed(2)}.`,
    });
  } else {
    layers.push({
      id: "pitcher",
      label: "Starter / staff ERA",
      home: 0.5,
      precision: 0,
      empty: true,
      note: "Looked up pitcher ERA. Empty look.",
    });
  }
  return layers;
}

export function applyMatchupToMeans(snap: MatchupSnap, muH: number, muA: number): MatchupMeans {
  const layers = matchupLayers(snap);
  const live = layers.filter((l) => !l.empty);
  let nextH = muH;
  let nextA = muA;
  const sport = snap.sport;
  const hDef = defenseAllowed(snap.homeLooks, sport);
  const aDef = defenseAllowed(snap.awayLooks, sport);
  if (hDef != null && aDef != null) {
    nextH *= defMul(sport, aDef);
    nextA *= defMul(sport, hDef);
  }
  const hEra = snap.homeEra ?? snap.homeLooks?.last7?.era ?? snap.homeLooks?.season.era;
  const aEra = snap.awayEra ?? snap.awayLooks?.last7?.era ?? snap.awayLooks?.season.era;
  if (hEra != null && aEra != null) {
    nextA *= clip(hEra / 4.2, 0.9, 1.12);
    nextH *= clip(aEra / 4.2, 0.9, 1.12);
  }
  const lean = live.length
    ? live.reduce((s, l) => s + (l.home - 0.5) * Math.min(1, l.precision / 2), 0) / live.length
    : 0;
  const tilt = clip(lean * 0.22, -0.05, 0.05);
  nextH *= 1 + tilt;
  nextA *= 1 - tilt;
  return {
    muH: nextH,
    muA: nextA,
    empty: live.length === 0,
    layers,
    note: live.length ? live.map((l) => l.note).join(" ") : undefined,
  };
}
