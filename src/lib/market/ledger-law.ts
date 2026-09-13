/**
 * Ledger law (v7 §9).
 * Guests stay on-device. Signed-in sessions pull/push desk_ledger_bets.
 * DEV_USER / guests never call auth ledger endpoints.
 * A weak layer's 10% haircut waits for a DESK_VERSION bump — it does not rewrite tonight.
 */
import { brierScore, layerPrecisionHaircut, rollingWindow } from "./brier.ts";
import { reliabilityTable, setReliabilityTable, type ReliabilityBucket } from "./calibrate.ts";
import type { BetLedgerEntry } from "../ledger.ts";

export const LEDGER_WINDOW = 50;

export function settledForecasts(entries: BetLedgerEntry[]) {
  return rollingWindow(
    entries
      .filter((e) => e.result === "HIT" || e.result === "MISS")
      .filter((e) => Number.isFinite(e.deskTrueProbability) && e.deskTrueProbability > 0 && e.deskTrueProbability < 1)
      .map((e) => ({ p: e.deskTrueProbability, hit: e.result === "HIT" })),
    LEDGER_WINDOW,
  );
}

export function ledgerBrier(entries: BetLedgerEntry[]): number | null {
  return brierScore(settledForecasts(entries));
}

export function pendingLayerHaircuts(entries: BetLedgerEntry[]): { layerId: string; haircut: number }[] {
  const settled = rollingWindow(
    entries.filter((e) => e.result === "HIT" || e.result === "MISS"),
    LEDGER_WINDOW,
  );
  const rows = settled.map((e) => ({
    layerP: e.layerSnapshots ?? {},
    hit: e.result === "HIT",
  }));
  const ids = [...new Set(rows.flatMap((r) => Object.keys(r.layerP)))];
  return ids
    .map((layerId) => ({ layerId, haircut: layerPrecisionHaircut(layerId, rows) }))
    .filter((x) => x.haircut < 1);
}

export function reliabilityFromLedger(entries: BetLedgerEntry[]): ReliabilityBucket[] {
  return reliabilityTable(settledForecasts(entries));
}

export function activateLedgerReliability(entries: BetLedgerEntry[]): ReliabilityBucket[] {
  const table = reliabilityFromLedger(entries);
  setReliabilityTable(table);
  return table;
}
