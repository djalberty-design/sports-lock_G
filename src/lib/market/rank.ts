/** One ranking pass. Worker and main-thread fallback both call this. */
import type { DeskSnapshot, ScanBundle } from "./types.ts";
import { buildScan } from "./engine.ts";
import { buildDeskPicks, type DeskPicks } from "./picks.ts";
import type { RankSettings } from "../desk-settings.ts";
import { DESK_VERSION } from "./rules.ts";

export type RankRequest = {
  id: number;
  snapshot: DeskSnapshot;
  halt: boolean;
  settings?: RankSettings;
};

export type RankResult = {
  id: number;
  scan: ScanBundle;
  picks: DeskPicks;
  ms: number;
};

export function rankDesk(
  snapshot: DeskSnapshot,
  halt: boolean,
  settings?: RankSettings,
): { scan: ScanBundle; picks: DeskPicks } {
  const scan = buildScan(snapshot, halt, settings);
  const picks = buildDeskPicks(scan, snapshot);
  return { scan, picks };
}

export function runRankJob(req: RankRequest): RankResult {
  const t0 = Date.now();
  const { scan, picks } = rankDesk(req.snapshot, req.halt, req.settings);
  return { id: req.id, scan, picks, ms: Date.now() - t0 };
}

/** Fingerprint of posted prices so ranking ignores clock-only refreshes. Includes desk version so a rule bump reranks. */
export function oddsFingerprint(snapshot: DeskSnapshot): string {
  const quotes = snapshot.quotes
    .map((q) => `${q.eventId}:${q.marketType}:${q.side}:${q.price}:${q.point ?? ""}:${q.inPlay ? 1 : 0}:${q.source ?? ""}`)
    .sort()
    .join("|");
  return `${DESK_VERSION}|${snapshot.quotes.length}#${quotes}`;
}
