/**
 * Venue library. Park factor, roof, altitude, surface, typical wind.
 * Weather is applied at the venue — 15 mph at Coors is not 15 mph at Petco,
 * and wind inside a dome is zero.
 */
export type Roof = "open" | "retractable" | "dome";
export type Surface = "grass" | "turf";
export type VenueSport = "MLB" | "NFL" | "NCAAF" | "NBA" | "NHL" | "NCAAB";

export type VenueProfile = {
  id: string;
  aliases: string[];
  sport: VenueSport;
  roof: Roof;
  surface: Surface;
  altitudeFt: number;
  typicalWindMph: number;
  runs?: number;
  hits?: number;
  hr?: number;
  totalTilt?: number;
};

export type WeatherSnap = {
  windMph?: number;
  precip?: number;
  tempF?: number;
};

const MLB: VenueProfile[] = [
  mlb("coors", ["coors field", "coors", "denver"], "open", "grass", 5280, 8, 1.15, 1.15, 1.22),
  mlb("gabp", ["great american ball park", "great american ballpark", "cincinnati"], "open", "grass", 482, 7, 1.08, 1.08, 1.14),
  mlb("yankee", ["yankee stadium"], "open", "grass", 55, 8, 1.05, 1.05, 1.12),
  mlb("fenway", ["fenway park", "fenway"], "open", "grass", 20, 10, 1.04, 1.04, 0.98),
  mlb("citizens", ["citizens bank park", "citizens bank"], "open", "grass", 30, 8, 1.04, 1.04, 1.08),
  mlb("globe", ["globe life field", "globe life"], "retractable", "grass", 550, 8, 1.03, 1.03, 1.04),
  mlb("rate", ["guaranteed rate field", "rate field", "comiskey"], "open", "grass", 595, 10, 1.03, 1.03, 1.05),
  mlb("camden", ["camden yards", "oriole park"], "open", "grass", 20, 8, 1.02, 1.02, 1.06),
  mlb("wrigley", ["wrigley field", "wrigley"], "open", "grass", 595, 12, 1.02, 1.02, 1.03),
  mlb("truist", ["truist park", "truist"], "open", "grass", 1050, 7, 1.02, 1.02, 1.04),
  mlb("rogers", ["rogers centre", "skydome"], "retractable", "turf", 250, 8, 1.02, 1.02, 1.03),
  mlb("chase", ["chase field"], "retractable", "grass", 1086, 6, 1.01, 1.01, 1.02),
  mlb("progressive", ["progressive field"], "open", "grass", 653, 8, 1.01, 1.01, 1.02),
  mlb("minute", ["minute maid park", "minute maid"], "retractable", "grass", 43, 7, 0.98, 0.98, 1.04),
  mlb("busch", ["busch stadium", "busch"], "open", "grass", 466, 7, 0.97, 0.97, 0.94),
  mlb("angel", ["angel stadium"], "open", "grass", 150, 6, 0.97, 0.97, 0.95),
  mlb("dodger", ["dodger stadium"], "open", "grass", 267, 5, 0.96, 0.96, 0.94),
  mlb("pnc", ["pnc park"], "open", "grass", 730, 7, 0.96, 0.96, 0.9),
  mlb("kauffman", ["kauffman stadium", "kauffman"], "open", "grass", 910, 9, 0.96, 0.96, 0.88),
  mlb("loan", ["loandepot park", "loanDepot", "marlins park"], "retractable", "grass", 7, 8, 0.96, 0.96, 0.92),
  mlb("citi", ["citi field"], "open", "grass", 20, 9, 0.95, 0.95, 0.94),
  mlb("comerica", ["comerica park", "comerica"], "open", "grass", 600, 8, 0.95, 0.95, 0.9),
  mlb("trop", ["tropicana field", "tropicana", "trop"], "dome", "turf", 15, 0, 0.94, 0.94, 0.9),
  mlb("petco", ["petco park", "petco"], "open", "grass", 20, 9, 0.92, 0.91, 0.86),
  mlb("tmobile", ["t-mobile park", "t mobile park", "safeco"], "retractable", "grass", 20, 6, 0.92, 0.91, 0.88),
  mlb("oracle", ["oracle park", "oracle"], "open", "grass", 10, 12, 0.9, 0.9, 0.82),
  mlb("nationals", ["nationals park"], "open", "grass", 25, 7, 1.01, 1.01, 1.03),
  mlb("target", ["target field"], "open", "grass", 840, 9, 1.0, 1.0, 0.98),
  mlb("american-family", ["american family field", "miller park"], "retractable", "grass", 633, 8, 1.02, 1.02, 1.06),
];

const NFL: VenueProfile[] = [
  nfl("empower", ["empower field", "mile high", "empower field at mile high"], "open", "grass", 5280, 8, 1.03),
  nfl("lambeau", ["lambeau field", "lambeau"], "open", "grass", 640, 12, 0.98),
  nfl("soldier", ["soldier field"], "open", "grass", 595, 12, 0.98),
  nfl("highmark", ["highmark stadium", "highmark"], "open", "turf", 580, 14, 0.97),
  nfl("gilette", ["gillette stadium", "gillette"], "open", "turf", 250, 12, 0.99),
  nfl("metlife", ["metlife stadium", "metlife"], "open", "turf", 20, 11, 0.99),
  nfl("allegiant", ["allegiant stadium", "allegiant"], "dome", "turf", 2001, 0, 1.02),
  nfl("sofi", ["sofi stadium", "sofi"], "dome", "turf", 100, 0, 1.01),
  nfl("att", ["at&t stadium", "att stadium", "jerry world"], "retractable", "turf", 560, 8, 1.02),
  nfl("mercedes", ["mercedes-benz stadium", "mercedes benz stadium"], "retractable", "turf", 1050, 6, 1.01),
  nfl("superdome", ["caesars superdome", "superdome"], "dome", "turf", 3, 0, 1.01),
  nfl("ford", ["ford field"], "dome", "turf", 600, 0, 1.0),
  nfl("lucas", ["lucas oil stadium", "lucas oil"], "retractable", "turf", 715, 7, 1.0),
  nfl("state-farm", ["state farm stadium", "state farm"], "retractable", "grass", 1100, 6, 1.01),
  nfl("hard-rock", ["hard rock stadium", "hard rock"], "open", "grass", 8, 9, 1.0),
  nfl("arrowhead", ["arrowhead stadium", "geha field", "arrowhead"], "open", "grass", 910, 10, 1.0),
  nfl("nrg", ["nrg stadium", "nrg"], "retractable", "turf", 43, 8, 1.0),
  nfl("lumen", ["lumen field", "lumen"], "open", "turf", 20, 8, 0.99),
  nfl("paycor", ["paycor stadium", "paycor"], "open", "turf", 482, 8, 1.0),
  nfl("firstenergy", ["huntington bank field", "firstenergy", "cleveland browns"], "open", "grass", 650, 12, 0.98),
];

const CFP: VenueProfile[] = [
  nfl("cfp-mb", ["mercedes-benz"], "retractable", "turf", 1050, 6, 1.01),
  nfl("cfp-att", ["at&t stadium"], "retractable", "turf", 560, 8, 1.02),
  nfl("cfp-hr", ["hard rock stadium"], "open", "grass", 8, 9, 1.0),
  nfl("cfp-sf", ["state farm stadium"], "retractable", "grass", 1100, 6, 1.01),
].map((v) => ({ ...v, sport: "NCAAF" as const }));

function mlb(
  id: string,
  aliases: string[],
  roof: Roof,
  surface: Surface,
  altitudeFt: number,
  typicalWindMph: number,
  runs: number,
  hits: number,
  hr: number,
): VenueProfile {
  return { id, aliases, sport: "MLB", roof, surface, altitudeFt, typicalWindMph, runs, hits, hr };
}

function nfl(
  id: string,
  aliases: string[],
  roof: Roof,
  surface: Surface,
  altitudeFt: number,
  typicalWindMph: number,
  totalTilt: number,
): VenueProfile {
  return { id, aliases, sport: "NFL", roof, surface, altitudeFt, typicalWindMph, totalTilt };
}

const ALL: VenueProfile[] = [...MLB, ...NFL, ...CFP];

function keyOf(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function lookupVenue(name?: string, sport?: string): VenueProfile | undefined {
  if (!name) return undefined;
  const key = keyOf(name);
  const pool = sport ? ALL.filter((v) => v.sport === sport || (sport === "NCAAF" && v.sport === "NFL")) : ALL;
  for (const v of pool) {
    if (v.aliases.some((a) => key.includes(keyOf(a)) || keyOf(a).includes(key))) return v;
  }
  for (const v of ALL) {
    if (v.aliases.some((a) => key.includes(keyOf(a)))) return v;
  }
  return undefined;
}

export function venueHits(name?: string): number {
  return lookupVenue(name, "MLB")?.hits ?? 1;
}

export function venueHr(name?: string): number {
  const v = lookupVenue(name, "MLB");
  return v?.hr ?? v?.hits ?? 1;
}

export function weatherAtVenue(
  venue: VenueProfile | undefined,
  snap: WeatherSnap,
): {
  effectiveWind: number;
  totalMul: number;
  hitsMul: number;
  hrMul: number;
  passMul: number;
  enclosed: boolean;
  note?: string;
} {
  const enclosed = venue?.roof === "dome" || (venue?.roof === "retractable" && (snap.precip ?? 0) >= 55);
  const wind = enclosed ? 0 : snap.windMph ?? venue?.typicalWindMph ?? 0;
  const precip = enclosed ? 0 : snap.precip ?? 0;
  const temp = snap.tempF;
  const alt = venue?.altitudeFt ?? 0;
  const altAmp = 1 + alt / 9000;

  if (!venue || venue.sport === "NBA" || venue.sport === "NHL" || venue.sport === "NCAAB") {
    return { effectiveWind: 0, totalMul: 1, hitsMul: 1, hrMul: 1, passMul: 1, enclosed: true };
  }

  if (venue.sport === "MLB") {
    let hitsMul = venue.hits ?? venue.runs ?? 1;
    let hrMul = venue.hr ?? hitsMul;
    let totalMul = venue.runs ?? hitsMul;
    if (wind >= 12) {
      const cut = (0.004 * (wind - 8)) * altAmp;
      hitsMul *= 1 - cut;
      hrMul *= 1 - cut * 1.4;
      totalMul *= 1 - cut;
    }
    if (temp != null && temp >= 85) {
      hrMul *= 1.04;
      totalMul *= 1.02;
    }
    if (temp != null && temp <= 50) {
      hrMul *= 0.96;
      totalMul *= 0.98;
    }
    if (precip >= 40) {
      hitsMul *= 0.97;
      totalMul *= 0.97;
    }
    const note = enclosed
      ? `${venue.id} enclosed — wind and rain off.`
      : wind >= 15
        ? `${venue.id}: ${Math.round(wind)} mph at ${alt} ft. Wind here is not generic.`
        : undefined;
    return { effectiveWind: wind, totalMul, hitsMul, hrMul, passMul: 1, enclosed, note };
  }

  let totalMul = venue.totalTilt ?? 1;
  let passMul = 1;
  if (wind >= 20) {
    passMul = 0.94;
    totalMul *= 0.97;
  } else if (wind >= 12) {
    passMul = 0.97;
    totalMul *= 0.99;
  }
  if (temp != null && temp <= 20) totalMul *= 0.98;
  if (precip >= 50) totalMul *= 0.97;
  if (alt >= 4000) totalMul *= 1.02;
  const note = enclosed
    ? `${venue.id} enclosed — weather off the total.`
    : wind >= 15
      ? `${venue.id}: ${Math.round(wind)} mph. Pass mean \u00d7${passMul.toFixed(2)}.`
      : undefined;
  return { effectiveWind: wind, totalMul, hitsMul: 1, hrMul: 1, passMul, enclosed, note };
}

function venueOrOpen(name: string | undefined, sport: string | undefined): VenueProfile | undefined {
  const found = lookupVenue(name, sport);
  if (found) return found;
  if (sport === "NBA" || sport === "NHL" || sport === "NCAAB") return undefined;
  if (sport === "MLB" || sport === "NFL" || sport === "NCAAF") {
    return {
      id: "open-unknown",
      aliases: [],
      sport: sport as VenueSport,
      roof: "open",
      surface: "grass",
      altitudeFt: 0,
      typicalWindMph: 8,
      runs: 1,
      hits: 1,
      hr: 1,
      totalTilt: 1,
    };
  }
  return undefined;
}

export function venueWeatherMul(
  name: string | undefined,
  sport: string | undefined,
  snap: WeatherSnap,
  kind: "hits" | "hr" | "total" | "ks",
): number {
  const wx = weatherAtVenue(venueOrOpen(name, sport), snap);
  if (kind === "hr") return wx.hrMul;
  if (kind === "hits") return wx.hitsMul;
  if (kind === "ks") return wx.effectiveWind >= 18 ? 1.03 : 1;
  return wx.totalMul;
}

export function applyVenueToMeans(
  sport: string,
  venueName: string | undefined,
  snap: WeatherSnap,
  muH: number,
  muA: number,
): { muH: number; muA: number; note?: string; enclosed: boolean } {
  const wx = weatherAtVenue(venueOrOpen(venueName, sport), snap);
  return { muH: muH * wx.totalMul, muA: muA * wx.totalMul, note: wx.note, enclosed: wx.enclosed };
}
