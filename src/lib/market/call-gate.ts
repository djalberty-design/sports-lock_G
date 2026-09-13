/** The Call is a pre-game badge. Live, kickoff-passed, and in-play tags never wear it. */
export type LiveHint = {
  inPlay?: boolean;
  tag?: string;
  start?: string;
};

export function isLiveTicket(hint: LiveHint | undefined): boolean {
  if (!hint) return false;
  if (hint.inPlay) return true;
  if (hint.tag === "in_play") return true;
  if (hint.start) {
    const t = new Date(hint.start).getTime();
    if (Number.isFinite(t) && t <= Date.now()) return true;
  }
  return false;
}

export function isLiveDeskPick(pick: { row?: LiveHint; start?: string; tag?: string } | undefined): boolean {
  if (!pick) return false;
  return isLiveTicket({
    inPlay: pick.row?.inPlay,
    tag: pick.row?.tag ?? pick.tag,
    start: pick.row?.start ?? pick.start,
  });
}

/** Live quality never reaches The Call floor (0.72). */
export function liveQualityCap(q: number, live: boolean): number {
  if (!live) return q;
  return Math.min(q * 0.52, 0.64);
}
