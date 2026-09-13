/** Injuries as availability on G. Listed-out cuts that team's mean. Questionable is half-weight + chaos. */
export type AvailabilitySnap = {
  sport: string;
  homeOuts?: number;
  awayOuts?: number;
  homeQuestionable?: number;
  awayQuestionable?: number;
};

export type AvailabilityEffect = {
  homeLogit: number;
  homeMeanMul: number;
  awayMeanMul: number;
  chaosAdd: number;
  layerHome: number;
  precision: number;
  empty: boolean;
  note: string;
};

function invLogit(z: number): number {
  const x = 1 / (1 + Math.exp(-z));
  return Math.min(0.97, Math.max(0.03, x));
}

function n(v?: number): number | undefined {
  return v != null && Number.isFinite(v) && v >= 0 ? v : undefined;
}

function weights(sport: string): { out: number; q: number; cap: number } {
  if (sport === "NBA" || sport === "NCAAB") return { out: 0.038, q: 0.014, cap: 0.14 };
  if (sport === "NFL" || sport === "NCAAF") return { out: 0.022, q: 0.01, cap: 0.1 };
  if (sport === "NHL") return { out: 0.02, q: 0.008, cap: 0.1 };
  if (sport === "MLB") return { out: 0.016, q: 0.006, cap: 0.08 };
  return { out: 0.02, q: 0.008, cap: 0.1 };
}

function teamCut(sport: string, outs: number, q: number): number {
  const w = weights(sport);
  return Math.min(w.cap, w.out * outs + w.q * q);
}

export function availabilityEffect(input: AvailabilitySnap): AvailabilityEffect {
  const ho = n(input.homeOuts);
  const ao = n(input.awayOuts);
  const hq = n(input.homeQuestionable);
  const aq = n(input.awayQuestionable);
  if (ho == null && ao == null && hq == null && aq == null) {
    return {
      homeLogit: 0,
      homeMeanMul: 1,
      awayMeanMul: 1,
      chaosAdd: 0,
      layerHome: 0.5,
      precision: 0,
      empty: true,
      note: "Looked up the injury report. Empty look.",
    };
  }
  const homeOuts = ho ?? 0;
  const awayOuts = ao ?? 0;
  const homeQ = hq ?? 0;
  const awayQ = aq ?? 0;
  const homeCut = teamCut(input.sport, homeOuts, homeQ);
  const awayCut = teamCut(input.sport, awayOuts, awayQ);
  const z = 1.35 * (awayCut - homeCut);
  const notes: string[] = [];
  if (homeOuts > 0) notes.push(`Home ${homeOuts} listed out.`);
  if (awayOuts > 0) notes.push(`Away ${awayOuts} listed out.`);
  if (homeQ > 0) notes.push(`Home ${homeQ} game-time.`);
  if (awayQ > 0) notes.push(`Away ${awayQ} game-time.`);
  if (!notes.length) notes.push("Both sides available.");
  return {
    homeLogit: z,
    homeMeanMul: 1 - homeCut,
    awayMeanMul: 1 - awayCut,
    chaosAdd: Math.min(0.05, 0.012 * (homeQ + awayQ)),
    layerHome: invLogit(z),
    precision: homeOuts + awayOuts > 0 ? 2.4 : homeQ + awayQ > 0 ? 1.4 : 0.9,
    empty: false,
    note: notes.join(" ") + " Availability moves G. It is not a headline.",
  };
}

export function applyAvailabilityToMeans(
  snap: AvailabilitySnap,
  muH: number,
  muA: number,
): { muH: number; muA: number; chaosAdd: number; note?: string } {
  const a = availabilityEffect(snap);
  return {
    muH: muH * a.homeMeanMul,
    muA: muA * a.awayMeanMul,
    chaosAdd: a.chaosAdd,
    note: a.empty ? undefined : a.note,
  };
}
