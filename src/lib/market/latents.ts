/**
 * Latent game state G: mu, pace, variance, style. Sides and totals are not
 * transforms of each other.
 */
import { buildChance, type ChanceInput } from "./chance.ts";
import { leagueTotal } from "./chance.ts";
import { latentFromScores, type GameLatent } from "./sim.ts";
import { applyLiveRemaining } from "./live-state.ts";

export type LiveLatentFields = {
  inPlay?: boolean;
  homeScore?: number;
  awayScore?: number;
  period?: string;
  clock?: string;
};

export function buildLatents(input: ChanceInput & { eventId: string; chanceHome?: number } & LiveLatentFields): {
  latent: GameLatent;
  poolHome?: number;
  layers: ReturnType<typeof buildChance> extends infer R ? R : never;
} {
  const report = buildChance(input);
  const homeWin = report?.home ?? input.oddsHome ?? input.espnHome ?? 0.5;
  const total = input.total ?? leagueTotal(input.sport);
  let chaos = Math.max(0, Math.min(0.22, (total - leagueTotal(input.sport)) / (leagueTotal(input.sport) * 4)));
  if (input.weatherWind != null && input.weatherWind >= 20) chaos += 0.05;
  if (input.weatherPrecip != null && input.weatherPrecip >= 40) chaos += 0.03;
  const latent = latentFromScores({
    eventId: input.eventId,
    sport: input.sport,
    homeWin,
    total,
    homeSpread: input.homeSpread,
    poolHome: report?.home,
    marketHome: input.oddsHome,
    chaos,
  });
  if (input.sport === "NFL" || input.sport === "NCAAF") {
    if (input.weatherWind != null && input.weatherWind >= 20) {
      latent.muH *= 0.97;
      latent.muA *= 0.97;
      latent.note = "Wind ≥ 20 mph cuts the air game and total. Passing-EPA modifier, not an ML party trick.";
    } else if (input.weatherWind != null && input.weatherWind >= 12) {
      latent.note = "Wind 12–19 mph: pass mean ×0.96, rush ×1.03, total −1.";
    }
  }
  const next = applyLiveRemaining(latent, {
    inPlay: input.inPlay,
    homeScore: input.homeScore,
    awayScore: input.awayScore,
    period: input.period,
    clock: input.clock,
  });
  return { latent: next, poolHome: report?.home, layers: report };
}
