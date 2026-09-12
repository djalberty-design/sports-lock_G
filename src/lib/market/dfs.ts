import { formatBetUsd } from "../copy.ts";
import { formatUsd } from "../utils.ts";
import type { ContestOffer } from "./types.ts";

export const SAMPLE_CONTESTS: ContestOffer[] = [
  { name: "NFL $1 Double-Up", buyIn: 1, fieldSize: 2, prize: 1.8, kind: "cash", confirmed: false },
  { name: "NFL $3 50/50", buyIn: 3, fieldSize: 20, prize: 5.4, kind: "cash", confirmed: false },
  { name: "NFL $5 Double-Up", buyIn: 5, fieldSize: 20, prize: 9, kind: "cash", confirmed: false },
  { name: "NFL $5 Single-Entry tournament", buyIn: 5, fieldSize: 20_000, prize: 20_000, kind: "gpp", confirmed: false },
  { name: "NFL $12 Single-Entry tournament", buyIn: 12, fieldSize: 50_000, prize: 100_000, kind: "gpp", confirmed: false },
  { name: "NFL $25 tournament", buyIn: 25, fieldSize: 20_000, prize: 75_000, kind: "gpp", confirmed: false },
];

export function targetDfsFee(bankroll: number): number {
  if (!Number.isFinite(bankroll) || bankroll <= 0) return 1;
  return Math.max(1, Math.round(bankroll * 0.01 * 100) / 100);
}

export function suggestContests(bankroll: number, offers: ContestOffer[]) {
  const target = targetDfsFee(bankroll);
  const photographed = offers.filter((c) => c.confirmed);
  const pool = photographed.length ? photographed : offers.length ? offers : SAMPLE_CONTESTS;
  const closest = (kind: ContestOffer["kind"]) =>
    [...pool]
      .filter((c) => c.kind === kind)
      .sort((a, b) => Math.abs(a.buyIn - target) - Math.abs(b.buyIn - target))[0];
  const cash = closest("cash") ?? [...pool].sort((a, b) => Math.abs(a.buyIn - target) - Math.abs(b.buyIn - target))[0];
  const gpp = closest("gpp");
  const over = (c?: ContestOffer) => Boolean(c && c.buyIn > Math.max(2, bankroll * 0.02));
  const source = photographed.length
    ? "from the contest list you photographed"
    : "from typical DraftKings rungs — photograph today's lobby to replace these";
  return {
    target,
    cash,
    gpp,
    photographed: photographed.length > 0,
    note: `Treat a fantasy entry like a 1% sports bet. On ${formatUsd(bankroll)} that is about ${formatBetUsd(target)} ${source}.`,
    cashWarning: over(cash) ? "That buy-in is more than 2% of your money. Size down." : undefined,
    gppWarning: over(gpp) ? "That tournament buy-in is more than 2% of your money. Size down or skip." : undefined,
  };
}
