/** After the context stack, do not let G wander off the close. Totals stay. Split is clipped. */
import type { GameLatent } from "./sim.ts";

export const SPLIT_CAP = 0.06;
export const WIN_CAP = 0.06;     // ±6% on pWinH — BIBLE Part 2 §1

function clip(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function shareFromWin(homeWin: number): number {
  return clip(0.5 + (homeWin - 0.5) * 0.28, 0.32, 0.68);
}

export function capLatentToClose(latent: GameLatent): GameLatent {
  const tot = latent.muH + latent.muA;
  if (!(tot > 0)) return latent;
  const anchor =
    latent.marketHome != null && Number.isFinite(latent.marketHome)
      ? latent.marketHome
      : latent.poolHome != null && Number.isFinite(latent.poolHome)
        ? latent.poolHome
        : latent.pWinH;
  if (anchor == null || !Number.isFinite(anchor)) return latent;
  const share = latent.muH / tot;
  const mid = shareFromWin(anchor);
  const cappedShare = clip(share, mid - SPLIT_CAP, mid + SPLIT_CAP);
  const next: GameLatent = {
    ...latent,
    muH: tot * cappedShare,
    muA: tot * (1 - cappedShare),
    pWinH: clip(latent.pWinH, anchor - WIN_CAP, anchor + WIN_CAP),
  };
  if (Math.abs(cappedShare - share) > 1e-6) {
    next.note = [latent.note, "Stacked context capped to the close."].filter(Boolean).join(" ");
  }
  return next;
}
