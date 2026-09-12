/** DraftKings Classic football scoring. Florida DFS is 18+, not a sportsbook fill. */

export const DK_SCORING = {
  PASS_TD: 4,
  PASS_YD: 0.04,
  INT: -1,
  RUSH_TD: 6,
  RUSH_YD: 0.1,
  REC_TD: 6,
  REC_YD: 0.1,
  PPR: 1,
  BONUS_300_PASS: 3,
  BONUS_100_RUSH: 3,
  BONUS_100_REC: 3,
} as const;

export const DK_CAP = 50_000;
export const SHOWDOWN_CAPTAIN_MULT = 1.5;
export const SHOOTOUT_TOTAL = 47;
export const HIGH_WIND_MPH = 18;
export const CHALK_OWNERSHIP = 0.25;
export const RB_DST_FAVORITE = 5.5;
export const INACTIVE_WINDOW_MIN = 90;

export type DkVolume = {
  passYds?: number;
  rushYds?: number;
  recYds?: number;
  recs?: number;
  passTd?: number;
  rushTd?: number;
  recTd?: number;
  ints?: number;
};

export function getImpliedTeamPoints(total: number, spread: number, isFavorite: boolean): number {
  if (!Number.isFinite(total) || !Number.isFinite(spread)) return NaN;
  const mag = Math.abs(spread);
  return isFavorite ? (total + mag) / 2 : (total - mag) / 2;
}

export function bonusPoints(vol: DkVolume): number {
  let b = 0;
  if ((vol.passYds ?? 0) >= 300) b += DK_SCORING.BONUS_300_PASS;
  if ((vol.rushYds ?? 0) >= 100) b += DK_SCORING.BONUS_100_RUSH;
  if ((vol.recYds ?? 0) >= 100) b += DK_SCORING.BONUS_100_REC;
  return b;
}

export function projectDkPoints(vol: DkVolume): number {
  const s = DK_SCORING;
  const pts =
    (vol.passYds ?? 0) * s.PASS_YD +
    (vol.passTd ?? 0) * s.PASS_TD +
    (vol.ints ?? 0) * s.INT +
    (vol.rushYds ?? 0) * s.RUSH_YD +
    (vol.rushTd ?? 0) * s.RUSH_TD +
    (vol.recYds ?? 0) * s.REC_YD +
    (vol.recTd ?? 0) * s.REC_TD +
    (vol.recs ?? 0) * s.PPR +
    bonusPoints(vol);
  return Math.round(pts * 10) / 10;
}

/** Wind ≥ 18 mph cuts deep passing; underdogs throw more, favorites lean run. */
export function adjustVolumeForScript(
  vol: DkVolume,
  opts: { favoredBy?: number; windMph?: number },
): DkVolume {
  const wind = opts.windMph ?? 0;
  const favoredBy = opts.favoredBy ?? 0;
  let pass = 1;
  let rush = 1;
  let rec = 1;
  if (wind >= HIGH_WIND_MPH) {
    pass *= 0.88;
    rec *= 0.9;
    rush *= 1.08;
  }
  if (favoredBy >= RB_DST_FAVORITE) {
    rush *= 1.06;
    pass *= 0.96;
  } else if (favoredBy <= -RB_DST_FAVORITE) {
    pass *= 1.05;
    rush *= 0.94;
  }
  return {
    passYds: vol.passYds != null ? vol.passYds * pass : undefined,
    rushYds: vol.rushYds != null ? vol.rushYds * rush : undefined,
    recYds: vol.recYds != null ? vol.recYds * rec : undefined,
    recs: vol.recs != null ? vol.recs * rec : undefined,
    passTd: vol.passTd,
    rushTd: vol.rushTd,
    recTd: vol.recTd,
    ints: vol.ints,
  };
}

export function sigmaOf(p: { p20: number; p50: number; p80: number }): number {
  const s = (p.p80 - p.p20) / 2.56;
  if (Number.isFinite(s) && s > 0.4) return s;
  return Math.max(1, (Number.isFinite(p.p50) ? p.p50 : 8) * 0.22);
}

/** Cash / 50-50: maximize floor (mean − 0.75 σ). */
export function cashFloor(p: { p20: number; p50: number; p80: number }): number {
  return p.p50 - 0.75 * sigmaOf(p);
}

/** Tournament: maximize ceiling (mean + 1.65 σ). */
export function gppCeiling(p: { p20: number; p50: number; p80: number }): number {
  return p.p50 + 1.65 * sigmaOf(p);
}

export function showdownSalary(salary: number, captain: boolean): number {
  return captain ? Math.round(salary * SHOWDOWN_CAPTAIN_MULT) : salary;
}

export function showdownPoints(pts: number, captain: boolean): number {
  return captain ? pts * SHOWDOWN_CAPTAIN_MULT : pts;
}

export function ownershipFrac(ownershipEst: number): number {
  if (!Number.isFinite(ownershipEst) || ownershipEst < 0) return 0;
  return ownershipEst > 1 ? ownershipEst / 100 : ownershipEst;
}

export function isChalk(ownershipEst: number): boolean {
  return ownershipFrac(ownershipEst) > CHALK_OWNERSHIP;
}
