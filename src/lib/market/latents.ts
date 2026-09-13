/**
 * Latent game state G: mu, pace, variance, style. Sides and totals are not
 * transforms of each other.
 */
import { buildChance, type ChanceInput } from "./chance.ts";
import { leagueTotal } from "./chance.ts";
import { latentFromScores, type GameLatent } from "./sim.ts";
import { applyLiveRemaining } from "./live-state.ts";
import { applyVenueToMeans } from "./venues.ts";
import { applyRestToMeans } from "./rest.ts";

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
  const venueMeans = applyVenueToMeans(
    input.sport,
    input.venue,
    { windMph: input.weatherWind, precip: input.weatherPrecip, tempF: input.weatherTemp },
    1,
    1,
  );
  let chaos = Math.max(0, Math.min(0.22, (total - leagueTotal(input.sport)) / (leagueTotal(input.sport) * 4)));
  if (!venueMeans.enclosed && input.weatherWind != null && input.weatherWind >= 20) chaos += 0.05;
  if (!venueMeans.enclosed && input.weatherPrecip != null && input.weatherPrecip >= 40) chaos += 0.03;
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
  latent.muH *= venueMeans.muH;
  latent.muA *= venueMeans.muA;
  if (venueMeans.note) latent.note = venueMeans.note;
  const restMeans = applyRestToMeans(
    input.sport,
    { start: input.start, homeRestDays: input.homeRestDays, awayRestDays: input.awayRestDays },
    latent.muH,
    latent.muA,
  );
  latent.muH = restMeans.muH;
  latent.muA = restMeans.muA;
  if (restMeans.note) latent.note = [latent.note, restMeans.note].filter(Boolean).join(" ");
  const next = applyLiveRemaining(latent, {
    inPlay: input.inPlay,
    homeScore: input.homeScore,
    awayScore: input.awayScore,
    period: input.period,
    clock: input.clock,
  });
  return { latent: next, poolHome: report?.home, layers: report };
}
