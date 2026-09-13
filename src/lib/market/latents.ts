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
import { applyAvailabilityToMeans } from "./availability.ts";
import { applyProcessToMeans } from "./process-g.ts";
import { applyRecencyToMeans } from "./recency-g.ts";
import { applySplitsToMeans } from "./splits-g.ts";
import { applyMatchupToMeans } from "./matchup-g.ts";
import { capLatentToClose } from "./g-cap.ts";
import { applyOfficialsToMeans, type OfficialPosting } from "./officials.ts";

export type LiveLatentFields = {
  inPlay?: boolean;
  homeScore?: number;
  awayScore?: number;
  period?: string;
  clock?: string;
  officials?: OfficialPosting[];
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
  const restMeans = applyRestToMeans(
    input.sport,
    { start: input.start, homeRestDays: input.homeRestDays, awayRestDays: input.awayRestDays },
    1,
    1,
  );
  const avail = applyAvailabilityToMeans(
    {
      sport: input.sport,
      homeOuts: input.homeOuts,
      awayOuts: input.awayOuts,
      homeQuestionable: input.homeQuestionable,
      awayQuestionable: input.awayQuestionable,
    },
    1,
    1,
  );
  let chaos = Math.max(0, Math.min(0.22, (total - leagueTotal(input.sport)) / (leagueTotal(input.sport) * 4)));
  if (!venueMeans.enclosed && input.weatherWind != null && input.weatherWind >= 20) chaos += 0.05;
  if (!venueMeans.enclosed && input.weatherPrecip != null && input.weatherPrecip >= 40) chaos += 0.03;
  const officialMeans = applyOfficialsToMeans({ sport: input.sport, officials: input.officials }, 1, 1);
  chaos = Math.min(0.28, chaos + avail.chaosAdd + officialMeans.chaosAdd);
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
  const processMeans = applyProcessToMeans(
    {
      sport: input.sport,
      homeLooks: input.homeLooks,
      awayLooks: input.awayLooks,
      homePf: input.homePf,
      homePa: input.homePa,
      awayPf: input.awayPf,
      awayPa: input.awayPa,
    },
    1,
    1,
  );
  const recencyMeans = applyRecencyToMeans(
    { sport: input.sport, home: input.home, away: input.away, lastFive: input.lastFive },
    1,
    1,
  );
  const splitMeans = applySplitsToMeans(
    { sport: input.sport, home: input.home, away: input.away, lastFive: input.lastFive, homeLooks: input.homeLooks, awayLooks: input.awayLooks },
    1,
    1,
  );
  const matchupMeans = applyMatchupToMeans(
    {
      sport: input.sport,
      homeLooks: input.homeLooks,
      awayLooks: input.awayLooks,
      homeEra: input.homeEra,
      awayEra: input.awayEra,
      homePitcherHand: input.homePitcherHand,
      awayPitcherHand: input.awayPitcherHand,
    },
    1,
    1,
  );
  latent.muH *= venueMeans.muH * restMeans.muH * avail.muH * processMeans.muH * recencyMeans.muH * splitMeans.muH * matchupMeans.muH * officialMeans.muH;
  latent.muA *= venueMeans.muA * restMeans.muA * avail.muA * processMeans.muA * recencyMeans.muA * splitMeans.muA * matchupMeans.muA * officialMeans.muA;
  const note = [venueMeans.note, restMeans.note, avail.note, processMeans.empty ? undefined : processMeans.note, recencyMeans.empty ? undefined : recencyMeans.note, splitMeans.empty ? undefined : splitMeans.note, matchupMeans.empty ? undefined : matchupMeans.note, officialMeans.empty ? undefined : officialMeans.note].filter(Boolean).join(" ");
  if (note) latent.note = note;
  const capped = capLatentToClose(latent);
  const next = applyLiveRemaining(capped, {
    inPlay: input.inPlay,
    homeScore: input.homeScore,
    awayScore: input.awayScore,
    period: input.period,
    clock: input.clock,
  });
  return { latent: next, poolHome: report?.home, layers: report };
}
