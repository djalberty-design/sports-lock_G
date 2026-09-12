import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function floorToCent(n: number): number {
  return Math.floor(n * 100 + Number.EPSILON) / 100;
}

export function formatUsd(n: number, digits = 2): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

export function formatPct(n: number, digits = 1): string {
  const pct = n * 100;
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(digits)}%`;
}

export function formatAmerican(odds: number): string {
  if (!Number.isFinite(odds)) return "—";
  return odds >= 0 ? `+${Math.round(odds)}` : `${Math.round(odds)}`;
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function etParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    weekday: get("weekday"),
    etDate: `${get("year")}-${get("month")}-${get("day")}`,
    etStamp: `${get("hour")}:${get("minute")}`,
  };
}

export function isTodayEt(iso: string, now = new Date()): boolean {
  if (!iso) return false;
  const t = new Date(iso);
  if (!Number.isFinite(t.getTime())) return false;
  return etParts(t).etDate === etParts(now).etDate;
}

export function startOfEtWeekMonday(etDate: string): string {
  const [y, m, d] = etDate.split("-").map(Number);
  const utc = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  const dow = utc.getUTCDay(); // 0 Sun
  const offset = dow === 0 ? 6 : dow - 1;
  utc.setUTCDate(utc.getUTCDate() - offset);
  const yy = utc.getUTCFullYear();
  const mm = String(utc.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(utc.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

/** "Monday, Sep 8 · 8:20 p.m. ET" — Florida/Eastern. Compact: "Mon 8:20 p.m. ET". */
export function formatKickoff(iso: string, compact = false): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "";
  const weekday = d.toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: compact ? "short" : "long",
  });
  const date = d.toLocaleString("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
  });
  const time = d
    .toLocaleString("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace("AM", "a.m.")
    .replace("PM", "p.m.");
  return compact ? `${weekday} ${date} · ${time} ET` : `${weekday}, ${date} · ${time} ET`;
}

export function matchupLine(away: string, home: string): string {
  if (!away && !home) return "";
  return `${away} (away) at ${home} (home)`;
}

