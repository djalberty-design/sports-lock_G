/**
 * Vacated touches + 90-minute official inactive radar.
 * When a starter is ruled out, leftover volume moves to the depth chart — never invented from thin air.
 */
import { etParts } from "../utils.ts";
import { INACTIVE_WINDOW_MIN } from "./dfs-scoring.ts";
import type { InactiveAlert, SlatePlayer } from "./types.ts";

export type RipplePlayer = Pick<
  SlatePlayer,
  "id" | "name" | "pos" | "team" | "status" | "p20" | "p50" | "p80"
> & {
  targetShare?: number;
  usageRate?: number;
  opportunityWeight?: number;
};

function isOut(status?: string): boolean {
  return status === "out" || status === "ir" || /^(out|ir|inactive)$/i.test(status ?? "");
}

function samePool(a: RipplePlayer, b: RipplePlayer): boolean {
  const pa = a.pos.toUpperCase();
  const pb = b.pos.toUpperCase();
  if (pa === "RB") return pb === "RB";
  if (pa === "WR" || pa === "TE") return pb === "WR" || pb === "TE";
  if (pa === "QB") return pb === "QB";
  return pa === pb;
}

function weightOf(p: RipplePlayer): number {
  const w = p.opportunityWeight;
  if (Number.isFinite(w) && (w ?? 0) > 0) return w as number;
  return 0.25;
}

function vacatedShare(p: RipplePlayer): number {
  const t = Number.isFinite(p.targetShare) ? (p.targetShare as number) : 0;
  const u = Number.isFinite(p.usageRate) ? (p.usageRate as number) : 0;
  const s = t + u;
  if (s > 0) return s;
  if (p.pos === "RB") return 0.55;
  if (p.pos === "WR") return 0.28;
  if (p.pos === "TE") return 0.18;
  if (p.pos === "QB") return 1;
  return 0.2;
}

/**
 * Reallocate the inactive player's target share + usage onto backups
 * by opportunityWeight. The inactive projection goes to zero.
 */
export function reallocateVacatedVolume<T extends RipplePlayer>(inactive: T, depthChart: T[]): T[] {
  if (!isOut(inactive.status) && inactive.p50 > 0) {
    /* still run if caller marked them out via status */
  }
  const backups = depthChart.filter(
    (p) => p.id !== inactive.id && p.team === inactive.team && !isOut(p.status) && samePool(p, inactive),
  );
  const share = vacatedShare(inactive);
  const wSum = backups.reduce((s, p) => s + weightOf(p), 0);
  return depthChart.map((p) => {
    if (p.id === inactive.id) {
      return { ...p, p20: 0, p50: 0, p80: 0, status: "out" as T["status"] };
    }
    const idx = backups.findIndex((b) => b.id === p.id);
    if (idx < 0 || wSum <= 0) return p;
    const frac = weightOf(p) / wSum;
    const lift = 1 + share * frac;
    return {
      ...p,
      p20: Math.round(p.p20 * lift * 10) / 10,
      p50: Math.round(p.p50 * lift * 10) / 10,
      p80: Math.round(p.p80 * (lift + 0.04) * 10) / 10,
    };
  });
}

export function applyInjuryRipple<T extends RipplePlayer>(players: T[]): T[] {
  let next = players.map((p) => ({ ...p }));
  const outs = next.filter((p) => isOut(p.status));
  for (const dead of outs) {
    next = reallocateVacatedVolume(dead, next);
  }
  return next;
}

export function minutesToKickoff(iso: string, now = new Date()): number | null {
  if (!iso) return null;
  const t = new Date(iso);
  if (!Number.isFinite(t.getTime())) return null;
  return (t.getTime() - now.getTime()) / 60_000;
}

function etHourMinute(iso: string): { hour: number; minute: number; weekday: string; etDate: string } | null {
  const t = new Date(iso);
  if (!Number.isFinite(t.getTime())) return null;
  const p = etParts(t);
  return { hour: Number(p.hour), minute: Number(p.minute), weekday: p.weekday, etDate: p.etDate };
}

/** 4:05 / 4:25 PM ET (and later) windows after the 1:00 PM ET early lock. */
export function isLateWindowKickoff(iso: string): boolean {
  const et = etHourMinute(iso);
  if (!et) return false;
  return et.hour > 16 || (et.hour === 16 && et.minute >= 5);
}

export function earlyGamesLocked(now = new Date()): boolean {
  const p = etParts(now);
  const hour = Number(p.hour);
  const minute = Number(p.minute);
  return hour > 13 || (hour === 13 && minute >= 0);
}

export function inactiveRadar(players: SlatePlayer[], now = new Date()): InactiveAlert[] {
  const alerts: InactiveAlert[] = [];
  const earlyLocked = earlyGamesLocked(now);
  for (const p of players) {
    if (isOut(p.status)) {
      alerts.push({
        playerId: p.id,
        name: p.name,
        kind: "out",
        line: `${p.name} is ruled out. Vacated touches moved to the depth chart. Photograph DraftKings before you lock the salary.`,
      });
      if (p.kickoff && isLateWindowKickoff(p.kickoff) && earlyLocked) {
        alerts.push({
          playerId: p.id,
          name: p.name,
          kind: "late-swap",
          line: `${p.name} is out in a late window after the 1:00 p.m. ET lock. Swap the late game. We never submit the lineup.`,
        });
      }
      continue;
    }
    if (p.status !== "questionable") continue;
    const mins = p.kickoff ? minutesToKickoff(p.kickoff, now) : null;
    if (mins != null && mins <= INACTIVE_WINDOW_MIN && mins > -15) {
      alerts.push({
        playerId: p.id,
        name: p.name,
        kind: "window",
        line: `${p.name} is questionable inside the 90-minute official inactive window. Have a backup ready. 18+ Florida DFS.`,
      });
    }
    if (p.kickoff && isLateWindowKickoff(p.kickoff) && earlyLocked) {
      alerts.push({
        playerId: p.id,
        name: p.name,
        kind: "late-swap",
        line: `${p.name} is a game-time tag in a late window. Early games already locked. Swap if they sit.`,
      });
    }
  }
  const seen = new Set<string>();
  return alerts.filter((a) => {
    const k = `${a.playerId}:${a.kind}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
