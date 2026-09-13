import type { DeskPick } from "./picks.ts";
import type { MarketType, ParsedTicket, ScanRow } from "./types.ts";

const EMPTY: ParsedTicket = {
  sport: "NFL",
  home: "",
  away: "",
  marketType: "ml",
  side: "home",
  selection: "",
  price: -110,
  confidence: 1,
  confirmed: false,
};

export function emptyLeg(sport = "NFL"): ParsedTicket {
  return { ...EMPTY, sport };
}

export function parsedFromRow(row: ScanRow): ParsedTicket {
  return {
    sport: row.sport,
    home: row.home,
    away: row.away,
    marketType: row.marketType,
    side: row.side,
    selection: row.selection,
    price: row.hardRockPrice ?? row.price,
    point: row.point,
    player: row.player,
    start: row.start,
    confidence: 1,
    confirmed: false,
  };
}

export function parsedFromDeskPick(pick: DeskPick): ParsedTicket[] {
  if (pick.parlay?.legs?.length) {
    return pick.parlay.legs.map((leg) => ({
      sport: leg.sport,
      home: leg.home,
      away: leg.away,
      marketType: leg.marketType,
      side: leg.side,
      selection: leg.selection,
      price: leg.price,
      start: leg.start,
      confidence: 1,
      confirmed: false,
    }));
  }
  if (pick.row) return [parsedFromRow(pick.row)];
  return [
    {
      sport: pick.sport,
      home: pick.home ?? "",
      away: pick.away ?? "",
      marketType: (pick.player ? "prop" : "ml") as MarketType,
      side: "home",
      selection: pick.selection,
      price: pick.price ?? -110,
      player: pick.player,
      start: pick.start,
      confidence: 1,
      confirmed: false,
    },
  ];
}

export function readyLegs(items: ParsedTicket[]): ParsedTicket[] {
  return items.filter((l) => l.selection.trim() && Number.isFinite(l.price));
}
