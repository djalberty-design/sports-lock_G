import { ALL_SPORTS } from "./market/universe.ts";

export const DEFAULT_SAFEST_FLOOR = 0.65;
export const DEFAULT_KELLY_MULTIPLIER = 1;
export const DEFAULT_COMBO_LEG_CAP = 18;

export type SportFeedKey = (typeof ALL_SPORTS)[number];

export type SportFeeds = Record<SportFeedKey, boolean>;

export type DeskSettings = {
  safestFloor: number;
  kellyMultiplier: number;
  comboLegCap: number;
  sportFeeds: SportFeeds;
  pinnedPickId: string | null;
};

export const DEFAULT_SPORT_FEEDS: SportFeeds = {
  NFL: true,
  NBA: true,
  MLB: true,
  NHL: true,
  NCAAF: true,
  NCAAB: true,
};

export const DEFAULT_DESK_SETTINGS: DeskSettings = {
  safestFloor: DEFAULT_SAFEST_FLOOR,
  kellyMultiplier: DEFAULT_KELLY_MULTIPLIER,
  comboLegCap: DEFAULT_COMBO_LEG_CAP,
  sportFeeds: { ...DEFAULT_SPORT_FEEDS },
  pinnedPickId: null,
};

export type RankSettings = {
  kellyMultiplier: number;
  comboLegCap: number;
  sportFeeds: SportFeeds;
};

export function rankSettingsOf(s: DeskSettings): RankSettings {
  return {
    kellyMultiplier: s.kellyMultiplier,
    comboLegCap: s.comboLegCap,
    sportFeeds: s.sportFeeds,
  };
}

export function clampSafestFloor(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_SAFEST_FLOOR;
  return Math.min(0.9, Math.max(0.4, n));
}

export function clampKelly(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_KELLY_MULTIPLIER;
  return Math.min(2, Math.max(0, n));
}

export function clampComboCap(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_COMBO_LEG_CAP;
  return Math.min(20, Math.max(8, Math.round(n)));
}

export function parseSportFeeds(raw: unknown): SportFeeds {
  const out: SportFeeds = { ...DEFAULT_SPORT_FEEDS };
  if (!raw || typeof raw !== "object") return out;
  const rec = raw as Record<string, unknown>;
  for (const sport of ALL_SPORTS) {
    if (typeof rec[sport] === "boolean") out[sport] = rec[sport];
  }
  return out;
}
