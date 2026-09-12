import { useDeskDecision } from "@/lib/market/use-board";
import { useDeskStore } from "@/lib/desk-store";
import { pickInSport, sortByMood, type DeskPick } from "@/lib/market/picks";
import { isCollegeSport } from "@/lib/market/universe";
import { liveFromRow } from "@/lib/market/live-state";
import { SportFilter } from "./sport-filter";
import { PickCard } from "./pick-card";
import { PhotoWagerCta } from "./photo-wager-cta";
import { Link } from "@tanstack/react-router";

export function LivePage() {
  const { picks, query, snapshot, scan } = useDeskDecision();
  const sportFilter = useDeskStore((s) => s.sportFilter);
  const hideCollege = useDeskStore((s) => s.hideCollege);
  const hideLive = useDeskStore((s) => s.hideLive);
  const hiddenPickIds = useDeskStore((s) => s.hiddenPickIds);
  const sports = [...new Set((scan?.rows ?? []).map((r) => r.sport))];
  const inSport = (p: DeskPick) => {
    if (!pickInSport(p, sportFilter)) return false;
    if (hideCollege && isCollegeSport(p.sport)) return false;
    return true;
  };
  const isLive = (p: DeskPick) => Boolean(p.row?.inPlay);
  const live = sortByMood(
    [...(picks?.popular ?? []), ...(picks?.props ?? []), ...(picks?.periods ?? [])]
      .filter(inSport)
      .filter(isLive)
      .filter((p) => !hiddenPickIds.includes(p.id)),
    "safe",
  ).slice(0, 8);
  const leftover = live.filter((p) => p.row?.leftover);
  const microStandDown = (scan?.rows ?? []).filter((r) => {
    if (!r.inPlay) return false;
    if (hideCollege && isCollegeSport(r.sport)) return false;
    if (sportFilter && sportFilter !== "ALL" && r.sport !== sportFilter) return false;
    const s = liveFromRow(r);
    return s.inPlay && !s.complete;
  });

  if (hideLive) {
    return (
      <div className="space-y-6">
        <header>
          <p className="text-sm text-gold">In-play hidden</p>
          <h1 className="font-display mt-1 text-3xl text-ink md:text-4xl">Live</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink/80">
            Live tickets are hidden in More → settings. Turn that off to see leftover-mean remaining stats. Never The Call.
          </p>
        </header>
        <Link to="/more" className="inline-flex min-h-11 items-center rounded-md bg-gold px-4 text-sm font-medium text-navy-deep">
          Open settings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-gold">Game already started. Never The Call.</p>
        <h1 className="font-display mt-1 text-3xl text-ink md:text-4xl">Live</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/80">
          Game already started. These numbers use what is left in the game. Never The Call.
        </p>
      </header>

      <SportFilter sports={sports} />

      {query.isError ? (
        <p className="rounded-md bg-wash-gold px-4 py-3 text-sm text-gold">
          Live board missing. Photograph the Hard Rock Bet Florida screen. We read the live price. Then you confirm it on Log.
        </p>
      ) : null}

      {!picks && !query.isError ? <p className="text-muted">Reading in-play tickets…</p> : null}

      {leftover.length ? (
        <section>
          <h2 className="font-display text-2xl text-ink">Remaining from leftover mean</h2>
          <p className="mt-1 mb-3 text-sm text-muted">
            Score is in. The remaining over/under is leftover mean × clock left, not a shaved pre-game %.
          </p>
          <ul className="grid gap-3 md:grid-cols-2">
            {leftover.map((pick, i) => (
              <li key={pick.id}>
                <PickCard pick={pick} rank={i + 1} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {picks && !live.length ? (
        <section className="paper-card p-5">
          <p className="stamp text-gold">Off the clock</p>
          <h2 className="font-display mt-2 text-xl text-ink">Nothing in-play on this filter.</h2>
          <p className="mt-2 text-sm text-muted">
            Live is only games that have started. Pre-tip tickets sit on AI Picks. Clear the sport filter, or wait for first pitch / kickoff / puck drop.
          </p>
        </section>
      ) : null}

      {live.filter((p) => !p.row?.leftover).length ? (
        <section>
          <h2 className="font-display text-2xl text-ink">In-play board</h2>
          <p className="mt-1 mb-3 text-sm text-muted">Quality haircut. Missing critical S stands that micro row down.</p>
          <ul className="grid gap-3 md:grid-cols-2">
            {live
              .filter((p) => !p.row?.leftover)
              .map((pick, i) => (
                <li key={pick.id}>
                  <PickCard pick={pick} rank={i + 1} />
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      {microStandDown.length ? (
        <p className="text-xs text-muted">
          {new Set(microStandDown.map((r) => r.eventId)).size} in-play game
          {new Set(microStandDown.map((r) => r.eventId)).size === 1 ? "" : "s"} missing down / outs / strength — those micros stand down.
        </p>
      ) : null}

      <PhotoWagerCta what="wager" />
      <p className="text-xs text-muted">
        This site never places a bet. Live tickets cannot be The Call.
        {snapshot ? ` · ${snapshot.hours.label}` : ""}
      </p>
    </div>
  );
}
