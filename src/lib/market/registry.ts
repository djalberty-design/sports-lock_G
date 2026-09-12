/**
 * Hard Rock Florida ticket registry. Unknown names stand down.
 * Do not silently price a cousin.
 */

const KNOWN = [
  /moneyline|\bml\b|to win/i,
  /spread|run line|puck line|handicap/i,
  /over|under|total|o\/u/i,
  /team total/i,
  /hits|runs|rbi|strikeout|walk|home run|stolen|total bases|hrr/i,
  /passing yards|rushing yards|receiving yards|receptions|anytime|touchdown|\byards\b/i,
  /points|rebounds|assists|threes|\bpra\b|steals|blocks/i,
  /shots on goal|saves|blocked shots|to score a goal/i,
  /inning|quarter|half|period|first 5|f5/i,
  /both teams|odd|even|highest|first (basket|goal|td|score)|race to|correct score|exact/i,
  /overtime|ot yes|method of/i,
  /\bover\b|\bunder\b|alt |alternate/i,
];

export function isKnownMarket(selection: string, marketType?: string): boolean {
  if (marketType === "ml" || marketType === "spread" || marketType === "total" || marketType === "prop") {
    if (!selection || selection.length < 2) return false;
    if (marketType !== "prop") return true;
  }
  const s = selection || "";
  if (KNOWN.some((re) => re.test(s))) return true;
  return false;
}

export function unknownMarketReason(selection: string): string {
  return `Unknown Hard Rock market “${selection}”. Logged the raw name. We do not price a cousin.`;
}
