/** Paper log + Drive-shaped ledger. Runtime store is local; Drive copy is a download. */
import { postMortem } from "./market/post-mortem.ts";

export type LedgerResult = "PENDING" | "HIT" | "MISS" | "PUSH";

export type BetLedgerEntry = {
  id: string;
  timestamp: string;
  sport: string;
  marketType: "MONEYLINE" | "SPREAD" | "TOTAL" | "PROP" | "PARLAY";
  teams: { home: string; away: string };
  ticketName: string;
  hardRockOdds: number;
  deskTrueProbability: number;
  expectedEdgePct: number;
  stakeDollars: number;
  result: LedgerResult;
  postMortemNotes?: string;
  layerSnapshots: Record<string, number>;
};

export const LEDGER_FOLDER = "Sports Lock - Core Workspace";
export const LEDGER_FILE = "sports_lock_ledger.json";

export function paperToLedger(t: {
  id: string;
  createdAt: string;
  description: string;
  sport?: string;
  home?: string;
  away?: string;
  kind?: string;
  price?: number | null;
  chance?: number;
  stake: number;
  status: string;
  pnl?: number | null;
}): BetLedgerEntry {
  const marketType =
    t.kind === "parlay"
      ? "PARLAY"
      : t.kind === "prop"
        ? "PROP"
        : /spread|\\+|\u2212|-\\d/.test(t.description)
          ? "SPREAD"
          : /over|under/i.test(t.description)
            ? "TOTAL"
            : "MONEYLINE";
  const result: LedgerResult =
    t.status === "win" ? "HIT" : t.status === "loss" ? "MISS" : t.status === "void" ? "PUSH" : "PENDING";
  const implied =
    t.price != null && Number.isFinite(t.price)
      ? t.price >= 0
        ? 100 / (t.price + 100)
        : Math.abs(t.price) / (Math.abs(t.price) + 100)
      : undefined;
  const edge =
    t.chance != null && implied != null ? Math.round((t.chance - implied) * 1000) / 10 : 0;
  const status =
    t.status === "win" ? "win" : t.status === "loss" ? "loss" : t.status === "void" ? "void" : "open";
  return {
    id: t.id,
    timestamp: t.createdAt,
    sport: t.sport ?? "",
    marketType,
    teams: { home: t.home ?? "", away: t.away ?? "" },
    ticketName: t.description,
    hardRockOdds: t.price ?? 0,
    deskTrueProbability: t.chance ?? 0,
    expectedEdgePct: edge,
    stakeDollars: t.stake,
    result,
    postMortemNotes: postMortem({
      selection: t.description,
      chance: t.chance,
      status,
      edge: edge / 100,
    }),
    layerSnapshots: {
      ...(t.chance != null && Number.isFinite(t.chance) ? { desk: t.chance } : {}),
      ...(implied != null ? { book: implied } : {}),
    },
  };
}

export function downloadLedger(entries: BetLedgerEntry[]): void {
  if (typeof document === "undefined") return;
  const blob = new Blob([JSON.stringify({ version: 1, file: LEDGER_FILE, folder: LEDGER_FOLDER, entries }, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = LEDGER_FILE;
  a.click();
  URL.revokeObjectURL(url);
}
