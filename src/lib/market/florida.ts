/**
 * Florida compact for this desk.
 *
 * Hard Rock Bet Florida: college game winners / spreads / totals are legal.
 * College *player* bets are not. DK/FD sportsbook fills are not.
 * This site never places a bet. 21+ sportsbook / 18+ classic DFS.
 */
import { isCollegeSport } from "./universe.ts";

export const FLORIDA_HELPLINE = "1-800-GAMBLER";
export const FLORIDA_SPORTSBOOK = "Hard Rock Bet";
export const FLORIDA_MIN_AGE_SPORTSBOOK = 21;
export const FLORIDA_MIN_AGE_DFS = 18;

const PLAYER_SHAPE =
  /\b(yards|receptions|receiving|rushing|passing|anytime|first td|first touchdown|first score|touchdowns?|\btds?\b|points scored|shots on goal|saves|strikeouts|\bk'?s\b|home runs|\bhrs\b|hits \+|rebounds|assists|threes|3-pointers|three-pointers|steals|blocks|goals|goalie)\b/i;

export type FloridaTicket = {
  sport?: string;
  isProp?: boolean;
  marketType?: string;
  player?: string;
  selection?: string;
  venueNote?: string;
};

export function isOffBookVenue(venueNote?: string): boolean {
  return venueNote === "dk_sportsbook" || venueNote === "fd_sportsbook";
}

/** College player ticket — blocked as a Florida Hard Rock live card. College mains stay legal. */
export function isCollegePlayerBet(t: FloridaTicket): boolean {
  if (!isCollegeSport(t.sport ?? "")) return false;
  if (t.isProp) return true;
  if (t.marketType === "prop") return true;
  if (t.player && t.player.trim()) return true;
  const sel = t.selection ?? "";
  if (PLAYER_SHAPE.test(sel)) return true;
  return false;
}

export function isFloridaBlocked(t: FloridaTicket): boolean {
  if (isOffBookVenue(t.venueNote)) return true;
  return isCollegePlayerBet(t);
}

export function floridaBlockReason(t: FloridaTicket): string | null {
  if (isOffBookVenue(t.venueNote)) {
    return "DraftKings / FanDuel sportsbooks are not licensed in Florida. Hard Rock Bet is the live sportsbook.";
  }
  if (isCollegePlayerBet(t)) {
    return "College player bets are not allowed on Hard Rock Bet.";
  }
  return null;
}
