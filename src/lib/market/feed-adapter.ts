import type { ChanceInput } from "./chance";
import type { LiveLatentFields } from "./latents";
import type { TeamLooks } from "./looks";
import type { OfficialPosting } from "./officials";

type WatchdogResult<T> = { data: T | null; healthy: boolean; error?: string };

/**
 * The Watchdog Wrapper: Catches silent API changes and triggers the "Empty Look" law gracefully.
 */
async function fetchWithWatchdog<T>(
  url: string,
  parser: (json: any) => T,
  feedName: string
): Promise<WatchdogResult<T>> {
  try {
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();
    const data = parser(raw);
    return { data, healthy: true };
  } catch (err) {
    console.warn(`[Watchdog] ${feedName} feed failed or changed schema. Triggering Empty Look.`, err);
    return { data: null, healthy: false, error: String(err) };
  }
}

/**
 * ESPN Live Scoreboard Parser
 * Safely extracts clock, period, and scores to feed the remaining-G math.
 */
export async function getEspnLiveState(sport: string, eventId: string): Promise<LiveLatentFields> {
  // ESPN undocumented widget API endpoint mapping
  const sportPath = sport === "NFL" ? "football/nfl" :
                    sport === "NBA" ? "basketball/nba" :
                    sport === "MLB" ? "baseball/mlb" :
                    sport === "NHL" ? "hockey/nhl" :
                    sport === "NCAAF" ? "football/college-football" :
                    sport === "NCAAB" ? "basketball/mens-college-basketball" : "";

  if (!sportPath) return { inPlay: false };

  const url = `https://site.api.espn.com/apis/site/v2/sports/${sportPath}/scoreboard/${eventId}`;
  
  const { data } = await fetchWithWatchdog(url, (json) => {
    const comp = json?.competitions?.[0];
    if (!comp) throw new Error("Missing competition object");
    
    const homeNode = comp.competitors?.find((c: any) => c.homeAway === "home");
    const awayNode = comp.competitors?.find((c: any) => c.homeAway === "away");
    const status = comp.status;

    return {
      inPlay: status?.type?.state === "in",
      period: status?.period ? String(status.period) : undefined,
      clock: status?.displayClock,
      homeScore: homeNode?.score ? Number(homeNode.score) : undefined,
      awayScore: awayNode?.score ? Number(awayNode.score) : undefined,
      // Pass raw crew names to trigger the officials.ts contract
      officials: comp.officials?.map((o: any) => ({ name: o.fullName, role: o.position })) || []
    } as LiveLatentFields;
  }, `ESPN Live (${sport})`);

  return data ?? { inPlay: false };
}

/**
 * Advanced Process Metrics (EPA / xwOBA) Stub
 * Ready for your Action Network or RefMetrics API keys.
 */
export async function getAdvancedProcess(sport: string, teamId: string): Promise<TeamLooks | undefined> {
  // TODO: Wire up commercial API endpoints here. 
  // Returning undefined enforces the Empty Look law automatically.
  return undefined; 
}

/**
 * Umpire / Referee ATS Tendency Stub
 */
export async function getCrewTendencies(crewNames: string[]): Promise<OfficialPosting[]> {
  // TODO: Wire RefMetrics parsing here. Map their JSON to OfficialPosting[].
  return [];
}
