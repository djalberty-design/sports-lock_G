import type { ChanceInput } from "./chance.ts";
import type { LiveLatentFields } from "./latents.ts";
import type { TeamLooks } from "./looks.ts";
import type { OfficialPosting } from "./officials.ts";

export type WatchdogResult<T> = { data: T | null; healthy: boolean; error?: string };

export type PlayerVolumeBaseline = {
  playerId: string;
  playerName: string;
  targetShare: number;
  routeParticipation: number;
  redZoneSnapPct: number;
  epaPerPlay: number;
};

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
      officials: comp.officials?.map((o: any) => ({ name: o.fullName, role: o.position })) || []
    } as LiveLatentFields;
  }, `ESPN Live (${sport})`);

  return data ?? { inPlay: false };
}

/**
 * NFL Player Volume Parser
 * Extracts target share and expected opportunity from free JSON feeds.
 */
export async function getNflPlayerVolume(eventId: string): Promise<PlayerVolumeBaseline[]> {
  const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${eventId}`;
  
  const { data } = await fetchWithWatchdog(url, (json) => {
    const boxscore = json?.boxscore;
    if (!boxscore || !boxscore.players) throw new Error("Missing player boxscore arrays");
    
    const baselines: PlayerVolumeBaseline[] = [];
    
    for (const team of boxscore.players) {
      const receivingStats = team.statistics?.find((s: any) => s.name === "receiving");
      if (!receivingStats) continue;
      
      const teamTargets = receivingStats.totals[1] ? Number(receivingStats.totals[1]) : 1; 

      for (const athlete of receivingStats.athletes) {
        const stats = athlete.stats;
        if (!stats) continue;
        
        const targets = Number(stats[1] || 0); 
        const targetShare = targets / Math.max(1, teamTargets);
        
        baselines.push({
          playerId: athlete.athlete.id,
          playerName: athlete.athlete.displayName,
          targetShare: targetShare,
          routeParticipation: 0, 
          redZoneSnapPct: 0,
          epaPerPlay: 0 
        });
      }
    }
    return baselines;
  }, "ESPN NFL Summary");

  return data ?? [];
}

/**
 * MLB Player Volume Parser
 * Extracts expected plate appearances and pitcher strikeout rates from the free MLB Stats API.
 */
export async function getMlbPlayerVolume(eventId: string): Promise<PlayerVolumeBaseline[]> {
  const url = `https://statsapi.mlb.com/api/v1.1/game/${eventId}/feed/live`;
  
  const { data } = await fetchWithWatchdog(url, (json) => {
    const boxscore = json?.liveData?.boxscore?.teams;
    if (!boxscore) throw new Error("Missing MLB boxscore data");
    
    const baselines: PlayerVolumeBaseline[] = [];
    
    for (const side of ["away", "home"]) {
      const players = boxscore[side as keyof typeof boxscore]?.players;
      if (!players) continue;
      
      for (const key in players) {
        const player = players[key];
        const stats = player.seasonStats;
        if (!stats) continue;
        
        if (player.position.code === "1") {
          // Pitcher: targetShare = Expected Innings, epaPerPlay = Strikeouts per Inning
          baselines.push({
            playerId: String(player.person.id),
            playerName: player.person.fullName,
            targetShare: 5.5, 
            routeParticipation: 0,
            redZoneSnapPct: 0,
            epaPerPlay: stats.pitching?.strikeOutsPer9Inn ? Number(stats.pitching.strikeOutsPer9Inn) / 9 : 1.0
          });
        } else {
          // Batter: targetShare = Expected Plate Appearances, epaPerPlay = OBP proxy for xwOBA
          baselines.push({
            playerId: String(player.person.id),
            playerName: player.person.fullName,
            targetShare: 4.2, 
            routeParticipation: 0,
            redZoneSnapPct: 0,
            epaPerPlay: stats.batting?.obp ? Number(stats.batting.obp) : 0.320 
          });
        }
      }
    }
    return baselines;
  }, "MLB Stats API");

  return data ?? [];
}

/**
 * NHL Player Volume Parser
 * Extracts expected Time on Ice (TOI) and Power Play share from the free NHL Public API.
 */
export async function getNhlPlayerVolume(eventId: string): Promise<PlayerVolumeBaseline[]> {
  const url = `https://api-web.nhle.com/v1/game/${eventId}/boxscore`;
  
  const { data } = await fetchWithWatchdog(url, (json) => {
    const playerByGame = json?.playerByGameStats;
    if (!playerByGame) throw new Error("Missing NHL player boxscore data");
    
    const baselines: PlayerVolumeBaseline[] = [];
    const sides = [playerByGame.awayTeam?.forwards, playerByGame.awayTeam?.defense, playerByGame.homeTeam?.forwards, playerByGame.homeTeam?.defense];
    
    for (const group of sides) {
      if (!group) continue;
      for (const player of group) {
        const toi = player.toi || "00:00";
        const [minutes, seconds] = toi.split(":").map(Number);
        const totalMinutes = (minutes || 0) + (seconds || 0) / 60;
        
        // Convert TOI into a proportional share of a standard 60-minute game (normalized to ~18 mins for skaters)
        const toiShare = totalMinutes / 20.0;
        
        baselines.push({
          playerId: String(player.playerId),
          playerName: `${player.name?.default || "Unknown"}`,
          targetShare: Math.max(0.2, Math.min(1.5, toiShare)), // targetShare hijacked for TOI scaling
          routeParticipation: 0,
          redZoneSnapPct: 0,
          epaPerPlay: player.powerPlayTimeOnIce ? 1.25 : 1.0 // PP boost factor
        });
      }
    }
    return baselines;
  }, "NHL Web API");

  return data ?? [];
}

/**
 * NBA Player Volume Parser
 * Extracts minutes played, shot attempts, and usage rate proxies from the free ESPN NBA summary.
 */
export async function getNbaPlayerVolume(eventId: string): Promise<PlayerVolumeBaseline[]> {
  const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${eventId}`;
  
  const { data } = await fetchWithWatchdog(url, (json) => {
    const boxscore = json?.boxscore;
    if (!boxscore || !boxscore.players) throw new Error("Missing NBA boxscore player data");

    const baselines: PlayerVolumeBaseline[] = [];

    for (const team of boxscore.players) {
      const statsBlock = team.statistics?.[0];
      if (!statsBlock) continue;

      // Find indices for MIN and FGA in ESPN's stats table structure
      const names: string[] = statsBlock.names || [];
      const minIdx = names.indexOf("MIN");
      const fgaIdx = names.indexOf("FGA") !== -1 ? names.indexOf("FGA") : names.indexOf("FG");

      for (const athlete of statsBlock.athletes || []) {
        const stats = athlete.stats;
        if (!stats) continue;

        const minutes = Number(stats[minIdx] || 0);
        // Skip bench warmers playing negligible time
        if (minutes < 5) continue;

        const fgRaw = String(stats[fgaIdx] || "0-0");
        const attempts = Number(fgRaw.includes("-") ? fgRaw.split("-")[1] : fgRaw) || 0;

        // Minutes share of 48-min game (~32 min starter = 0.66)
        const minuteShare = minutes / 48.0;
        // Shot rate per minute as a proxy for offensive usage
        const shotRate = minutes > 0 ? attempts / minutes : 0.3;

        baselines.push({
          playerId: athlete.athlete.id,
          playerName: athlete.athlete.displayName,
          targetShare: minuteShare, // targetShare hijacked for projected minutes share
          routeParticipation: 0,
          redZoneSnapPct: 0,
          epaPerPlay: shotRate // epaPerPlay hijacked for offensive usage rate
        });
      }
    }
    return baselines;
  }, "ESPN NBA Summary");

  return data ?? [];
}

/**
 * Advanced Process Metrics (EPA / xwOBA) Stub
 */
export async function getAdvancedProcess(sport: string, teamId: string): Promise<TeamLooks | undefined> {
  return undefined; 
}

/**
 * Umpire / Referee ATS Tendency Stub
 */
export async function getCrewTendencies(crewNames: string[]): Promise<OfficialPosting[]> {
  return [];
}
