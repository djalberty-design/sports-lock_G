import { etParts } from "../utils.ts";
import type { DeskSnapshot, EventBrief, NewsItem, PublicSplit, QuoteLine } from "./types.ts";

/** Kickoff later today in Eastern — never a mid-week game used as "today's pick". */
function todayKick(hoursAhead: number): string {
  const now = new Date();
  const t = new Date(now.getTime() + Math.min(Math.max(hoursAhead, 1), 8) * 3600_000);
  if (etParts(t).etDate === etParts(now).etDate) return t.toISOString();
  const stillToday = new Date(now.getTime() + 12 * 60_000);
  if (etParts(stillToday).etDate === etParts(now).etDate) return stillToday.toISOString();
  return t.toISOString();
}

function laterKick(days: number): string {
  return new Date(Date.now() + days * 86400_000).toISOString();
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600_000).toISOString();
}

/**
 * Delayed research-sample tape for the tracker.
 * Not a fill. Not a live Hard Rock scrape. User can replace any row
 * with a photographed / typed Hard Rock price.
 */
export function sampleSnapshot(asOf = new Date().toISOString()): DeskSnapshot {
  const kcBal = todayKick(5);
  const phiDal = todayKick(6);
  const lalBos = laterKick(2);
  const nyyBos = todayKick(4);
  const flaTbl = todayKick(7);
  const fsuMia = laterKick(3);
  const uf = laterKick(3);
  const locked = hoursAgo(2);

  const quotes: QuoteLine[] = [
    // NFL KC/BAL — consensus -150/+130; Hard Rock BAL +160 is fair-or-better vs no-vig.
    q("nfl-kc-bal", "NFL", kcBal, "Kansas City", "Baltimore", "ml", "away", "Baltimore ML", 130, 160, undefined, "hardrock_fl"),
    q("nfl-kc-bal", "NFL", kcBal, "Kansas City", "Baltimore", "ml", "home", "Kansas City ML", -150, -170, undefined, "hardrock_fl"),
    q("nfl-kc-bal", "NFL", kcBal, "Kansas City", "Baltimore", "spread", "away", "Baltimore +3.5", -110, -110, 3.5, "hardrock_fl"),
    q("nfl-kc-bal", "NFL", kcBal, "Kansas City", "Baltimore", "spread", "home", "Kansas City -3.5", -110, -110, -3.5, "hardrock_fl"),
    q("nfl-kc-bal", "NFL", kcBal, "Kansas City", "Baltimore", "total", "over", "KC/BAL O 47.5", -110, -115, 47.5, "hardrock_fl"),
    q("nfl-kc-bal", "NFL", kcBal, "Kansas City", "Baltimore", "total", "under", "KC/BAL U 47.5", -110, -105, 47.5, "hardrock_fl"),

    // NFL DET/MIN — true toss-up. Consensus DET +105 / MIN −125 → fair DET ~47%.
    // Hard Rock DET +130 pays well on a coin flip. This is the riskiest card.
    q("nfl-det-min", "NFL", todayKick(6), "Minnesota", "Detroit", "ml", "away", "Detroit ML", 105, 130, undefined, "hardrock_fl"),
    q("nfl-det-min", "NFL", todayKick(6), "Minnesota", "Detroit", "ml", "home", "Minnesota ML", -125, -150, undefined, "hardrock_fl"),

    // NFL PHI/DAL — juiced -110 / -110 both sides on Hard Rock.
    q("nfl-phi-dal", "NFL", phiDal, "Philadelphia", "Dallas", "ml", "home", "Philadelphia ML", -140, -145, undefined, "hardrock_fl"),
    q("nfl-phi-dal", "NFL", phiDal, "Philadelphia", "Dallas", "ml", "away", "Dallas ML", 120, 110, undefined, "hardrock_fl"),
    q("nfl-phi-dal", "NFL", phiDal, "Philadelphia", "Dallas", "spread", "home", "Philadelphia -2.5", -110, -115, -2.5, "hardrock_fl"),
    q("nfl-phi-dal", "NFL", phiDal, "Philadelphia", "Dallas", "spread", "away", "Dallas +2.5", -110, -105, 2.5, "hardrock_fl"),

    // NBA LAL/BOS — juiced.
    q("nba-lal-bos", "NBA", lalBos, "Los Angeles Lakers", "Boston", "ml", "away", "Boston ML", -130, -135, undefined, "hardrock_fl"),
    q("nba-lal-bos", "NBA", lalBos, "Los Angeles Lakers", "Boston", "ml", "home", "Lakers ML", 110, 105, undefined, "hardrock_fl"),
    q("nba-lal-bos", "NBA", lalBos, "Los Angeles Lakers", "Boston", "total", "over", "LAL/BOS O 224.5", -110, -110, 224.5, "hardrock_fl"),
    q("nba-lal-bos", "NBA", lalBos, "Los Angeles Lakers", "Boston", "total", "under", "LAL/BOS U 224.5", -110, -110, 224.5, "hardrock_fl"),

    // MLB NYY/BOS — juiced.
    q("mlb-nyy-bos", "MLB", nyyBos, "New York Yankees", "Boston Red Sox", "ml", "home", "Yankees ML", -155, -160, undefined, "hardrock_fl"),
    q("mlb-nyy-bos", "MLB", nyyBos, "New York Yankees", "Boston Red Sox", "ml", "away", "Red Sox ML", 135, 140, undefined, "hardrock_fl"),

    // NHL FLA/TBL — close, still juiced on favorite.
    q("nhl-fla-tbl", "NHL", flaTbl, "Florida", "Tampa Bay", "ml", "home", "Florida ML", -125, -130, undefined, "hardrock_fl"),
    q("nhl-fla-tbl", "NHL", flaTbl, "Florida", "Tampa Bay", "ml", "away", "Tampa Bay ML", 105, 110, undefined, "hardrock_fl"),

    // NCAAF team markets — allowed.
    q("ncaaf-fsu-mia", "NCAAF", fsuMia, "Florida State", "Miami", "ml", "away", "Miami ML", -140, -145, undefined, "hardrock_fl"),
    q("ncaaf-fsu-mia", "NCAAF", fsuMia, "Florida State", "Miami", "ml", "home", "Florida State ML", 120, 115, undefined, "hardrock_fl"),
    q("ncaaf-fsu-mia", "NCAAF", fsuMia, "Florida State", "Miami", "spread", "away", "Miami -3.5", -110, -110, -3.5, "hardrock_fl"),
    q("ncaaf-fsu-mia", "NCAAF", fsuMia, "Florida State", "Miami", "spread", "home", "Florida State +3.5", -110, -110, 3.5, "hardrock_fl"),

    // Thursday blowout — huge favorite, tiny payout. Must NEVER be today's pick.
    q("nfl-thu-blowout", "NFL", laterKick(4), "Buffalo", "New York Jets", "ml", "home", "Buffalo ML", -450, -450, undefined, "hardrock_fl"),
    q("nfl-thu-blowout", "NFL", laterKick(4), "Buffalo", "New York Jets", "ml", "away", "Jets ML", 340, 340, undefined, "hardrock_fl"),

    // College athlete prop — ILLEGAL on Hard Rock. Must block.
    {
      eventId: "ncaaf-uf-uk",
      sport: "NCAAF",
      start: uf,
      home: "Florida",
      away: "Kentucky",
      marketType: "prop",
      side: "over",
      selection: "Gators QB yards O 245.5",
      price: -115,
      source: "manual",
      delayed: true,
      isProp: true,
      player: "Gators QB",
      venueNote: "hardrock",
      confirmed: true,
    },

    // DK Sportsbook ticket presented as a Florida live play — venue blocks.
    {
      eventId: "nfl-kc-bal-dk",
      sport: "NFL",
      start: kcBal,
      home: "Kansas City",
      away: "Baltimore",
      marketType: "ml",
      side: "away",
      selection: "Baltimore ML (DK Sportsbook)",
      price: 155,
      source: "manual",
      delayed: true,
      venueNote: "dk_sportsbook",
      confirmed: true,
    },

    // In-play print — drop from Edition 1 recommended set.
    q("mlb-locked", "MLB", locked, "Atlanta", "Philadelphia", "ml", "home", "Atlanta ML", -120, -120, undefined, "hardrock_fl", true),
    q("mlb-locked", "MLB", locked, "Atlanta", "Philadelphia", "ml", "away", "Philadelphia ML", 100, 100, undefined, "hardrock_fl", true),
  ];

  const publicSplits: PublicSplit[] = [
    {
      eventId: "nfl-kc-bal",
      side: "Kansas City ML",
      marketType: "ml",
      publicPct: 80,
      ticketPct: 80,
      handlePct: 54,
      steam: true,
      lean: "public",
      source: "sample",
      note: "Bets 80% · money 54%. The public is on Kansas City; the dollars are not. We do not copy the crowd.",
    },
    {
      eventId: "nfl-phi-dal",
      side: "Philadelphia ML",
      marketType: "ml",
      publicPct: 62,
      ticketPct: 62,
      handlePct: 61,
      lean: "neutral",
      source: "sample",
      note: "Bets 62% · money 61%. Tickets and dollars agree.",
    },
    {
      eventId: "nfl-det-min",
      side: "Detroit ML",
      marketType: "ml",
      publicPct: 44,
      ticketPct: 44,
      handlePct: 58,
      lean: "sharp",
      source: "sample",
      note: "Bets 44% · money 58%. More dollars than tickets on Detroit — that's the sharp tell.",
    },
    {
      eventId: "mlb-nyy-bos",
      side: "Yankees ML",
      marketType: "ml",
      publicPct: 71,
      ticketPct: 71,
      handlePct: 63,
      lean: "public",
      source: "sample",
      note: "Bets 71% · money 63%. Public on the Yankees; money is closer to even.",
    },
  ];

  const news: NewsItem[] = [
    {
      id: "n1",
      title: "Lock thread: smash the Ravens overnight",
      source: "tout list",
      discarded: true,
    },
  ];

  const et = etParts();
  const future = quotes
    .filter((x) => new Date(x.start).getTime() > Date.now())
    .sort((a, b) => +new Date(a.start) - +new Date(b.start));
  const nextLock = future[0]?.start ?? null;

  const briefs: EventBrief[] = [
    {
      eventId: "nfl-kc-bal",
      chanceHome: 0.57,
      homeSpread: -3.5,
      total: 47.5,
      ticketHome: 0.8,
      handleHome: 0.54,
      steam: true,
      venue: "Arrowhead Stadium",
      weather: "Clear",
      weatherTemp: 68,
      weatherWind: 9,
      weatherPrecip: 10,
      homeRecord: "11-6",
      awayRecord: "12-5",
      homeRestDays: 7,
      awayRestDays: 7,
      espnHomeWin: 0.58,
      injuries: [
        { team: "Baltimore", player: "Marlon Humphrey", status: "Questionable", detail: "Calf" },
        { team: "Kansas City", player: "Chris Jones", status: "Probable", detail: "Shoulder" },
      ],
      players: [
        {
          id: "mahomes",
          name: "Patrick Mahomes",
          team: "Kansas City",
          homeAway: "home",
          position: "QB",
          starter: true,
          stats: { passYds: 4183, yds: 4183 },
        },
        {
          id: "kelce",
          name: "Travis Kelce",
          team: "Kansas City",
          homeAway: "home",
          position: "TE",
          starter: true,
          stats: { recYds: 823 },
        },
        {
          id: "worthy",
          name: "Xavier Worthy",
          team: "Kansas City",
          homeAway: "home",
          position: "WR",
          starter: true,
          stats: { recYds: 638 },
        },
        {
          id: "henry",
          name: "Derrick Henry",
          team: "Baltimore",
          homeAway: "away",
          position: "RB",
          starter: true,
          stats: { rushYds: 1921 },
        },
        {
          id: "jackson",
          name: "Lamar Jackson",
          team: "Baltimore",
          homeAway: "away",
          position: "QB",
          starter: true,
          stats: { passYds: 4178, rushYds: 915 },
        },
      ],
    },
    {
      eventId: "nfl-det-min",
      chanceHome: 0.53,
      homeSpread: -1.5,
      total: 51.5,
      ticketHome: 0.56,
      handleHome: 0.42,
      steam: false,
      venue: "U.S. Bank Stadium",
      homeRecord: "14-3",
      awayRecord: "15-2",
      homeRestDays: 7,
      awayRestDays: 6,
      players: [
        {
          id: "goff",
          name: "Jared Goff",
          team: "Detroit",
          homeAway: "away",
          position: "QB",
          starter: true,
          stats: { passYds: 4629 },
        },
        {
          id: "gibbs",
          name: "Jahmyr Gibbs",
          team: "Detroit",
          homeAway: "away",
          position: "RB",
          starter: true,
          stats: { rushYds: 1412 },
        },
      ],
    },
    {
      eventId: "nfl-phi-dal",
      chanceHome: 0.56,
      homeSpread: -2.5,
      total: 47.5,
      ticketHome: 0.62,
      handleHome: 0.61,
      venue: "Lincoln Financial Field",
      weatherTemp: 71,
      weatherWind: 7,
      homeRecord: "14-3",
      awayRecord: "7-10",
      players: [
        {
          id: "hurts",
          name: "Jalen Hurts",
          team: "Philadelphia",
          homeAway: "home",
          position: "QB",
          starter: true,
          stats: { passYds: 3188, rushYds: 630 },
        },
        {
          id: "saquon",
          name: "Saquon Barkley",
          team: "Philadelphia",
          homeAway: "home",
          position: "RB",
          starter: true,
          stats: { rushYds: 2005 },
        },
      ],
    },
    {
      eventId: "mlb-nyy-bos",
      chanceHome: 0.61,
      homeSpread: -1.5,
      total: 8.5,
      venue: "Yankee Stadium",
      weather: "Warm",
      weatherTemp: 79,
      weatherWind: 12,
      weatherPrecip: 5,
      ticketHome: 0.71,
      handleHome: 0.63,
      homeRecord: "88-61",
      awayRecord: "74-75",
      homeSplit: "46-28 home",
      awaySplit: "35-39 away",
      homeEra: 3.72,
      awayEra: 4.18,
      homeRestDays: 1,
      awayRestDays: 1,
      series: "Yanks lead 2-1",
      seriesHomeWins: 2,
      seriesAwayWins: 1,
      injuries: [{ team: "Boston Red Sox", player: "Trevor Story", status: "Out", detail: "Shoulder" }],
      players: [
        {
          id: "judge",
          name: "Aaron Judge",
          team: "New York Yankees",
          homeAway: "home",
          position: "RF",
          starter: true,
          stats: { avg: 0.322, hr: 48, hits: 160, rbi: 110, slg: 0.68 },
        },
        {
          id: "soto",
          name: "Juan Soto",
          team: "New York Yankees",
          homeAway: "home",
          position: "RF",
          starter: true,
          stats: { avg: 0.288, hr: 41, hits: 155, rbi: 109, slg: 0.569 },
        },
        {
          id: "devers",
          name: "Rafael Devers",
          team: "Boston Red Sox",
          homeAway: "away",
          position: "3B",
          starter: true,
          stats: { avg: 0.278, hr: 28, hits: 140, rbi: 88, slg: 0.51 },
        },
        {
          id: "cole",
          name: "Gerrit Cole",
          team: "New York Yankees",
          homeAway: "home",
          position: "SP",
          starter: true,
          stats: { era: 3.41, k: 209, ip: 185 },
        },
      ],
    },
    {
      eventId: "nhl-fla-tbl",
      chanceHome: 0.54,
      homeSpread: -1.5,
      total: 6.5,
      venue: "Amerant Bank Arena",
      ticketHome: 0.55,
      handleHome: 0.52,
      homeRecord: "47-31",
      awayRecord: "46-30",
      homeRestDays: 2,
      awayRestDays: 1,
      players: [
        {
          id: "barkov",
          name: "Aleksander Barkov",
          team: "Florida",
          homeAway: "home",
          position: "C",
          starter: true,
          stats: { goals: 33, sog: 214 },
        },
        {
          id: "kucherov",
          name: "Nikita Kucherov",
          team: "Tampa Bay",
          homeAway: "away",
          position: "RW",
          starter: true,
          stats: { goals: 37, sog: 246 },
        },
        {
          id: "bob",
          name: "Sergei Bobrovsky",
          team: "Florida",
          homeAway: "home",
          position: "G",
          starter: true,
          stats: { saves: 1640 },
        },
      ],
    },
  ];

  return {
    asOf,
    delayed: true,
    sample: true,
    hours: {
      preGameOpen: true,
      etStamp: et.etStamp,
      etDate: et.etDate,
      nextLock,
      label: nextLock ? `Next lock ${formatLock(nextLock)}` : "No upcoming lock on the tape",
      note: "Delayed research-sample prints. Not fills. Photograph a Hard Rock price to replace any row.",
    },
    quotes,
    news,
    publicSplits,
    briefs,
    sourceNote:
      "Research sample tape. Delayed demo prints — not Hard Rock fills. Confirm every live number at the book.",
  };
}

function formatLock(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function q(
  eventId: string,
  sport: string,
  start: string,
  home: string,
  away: string,
  marketType: QuoteLine["marketType"],
  side: string,
  selection: string,
  consensus: number,
  hardRock: number,
  point: number | undefined,
  source: QuoteLine["source"],
  inPlay = false,
): QuoteLine {
  return {
    eventId,
    sport,
    start,
    home,
    away,
    marketType,
    side,
    selection,
    price: hardRock,
    consensusPrice: consensus,
    hardRockPrice: hardRock,
    point,
    source,
    delayed: true,
    inPlay,
    venueNote: "hardrock",
    confirmed: true,
  };
}

export const SAMPLE_SOURCE_NOTE =
  "Delayed research-sample prints. Not fills. Photograph a Hard Rock price to replace any row.";
