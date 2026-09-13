import { liveFromRow } from "@/lib/market/live-state";
import { cn } from "@/lib/utils";

export type Liveish = {
  eventId?: string;
  sport?: string;
  inPlay?: boolean;
  homeScore?: number;
  awayScore?: number;
  period?: string;
  clock?: string;
  situation?: string;
  leftover?: boolean;
};

export function isLiveRow(row?: Liveish | null): boolean {
  return Boolean(row?.inPlay);
}

function stateOf(row?: Liveish | null) {
  if (!row?.inPlay || !row.eventId || !row.sport) return null;
  return liveFromRow({
    eventId: row.eventId,
    sport: row.sport,
    inPlay: true,
    homeScore: row.homeScore,
    awayScore: row.awayScore,
    period: row.period,
    clock: row.clock,
    situation: row.situation,
  });
}

function scoreClock(row?: Liveish | null): string {
  if (!row) return "";
  const score =
    row.awayScore != null && row.homeScore != null ? `${row.awayScore}–${row.homeScore}` : "";
  const clock = [row.period ? `P${row.period}` : "", row.clock ?? ""].filter(Boolean).join(" ");
  return [score, clock].filter(Boolean).join(" · ");
}

/** Hard Live mark. Use on any card that can still show an in-play game. */
export function LiveStamp({ row, className }: { row?: Liveish | null; className?: string }) {
  if (!row?.inPlay) return null;
  const s = stateOf(row);
  const extra = scoreClock(row);
  return (
    <span className={cn("stamp text-gold", className)}>
      Live{extra ? ` · ${extra}` : ""}
      {s?.thin ? " · thin" : ""}
      {" · never The Call"}
    </span>
  );
}

export function LiveBanner({ row }: { row?: Liveish | null }) {
  if (!row?.inPlay) return null;
  const s = stateOf(row);
  const extra = scoreClock(row);
  return (
    <p className="rounded-md bg-wash-gold px-3 py-2 text-sm text-gold">
      Live. Remaining-G from the current score and clock. Never The Call.
      {extra ? ` ${extra}.` : " Score not posted yet."}
      {s?.thin ? " Critical field missing (down / outs / strength) — thin look." : ""}
    </p>
  );
}
