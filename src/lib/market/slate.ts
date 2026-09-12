import type { EventBrief, PredictQuote, ScanRow, SlateBundle, SlateLineup, SlatePlayer, SalaryShift } from "./types.ts";
import { leagueTotal } from "./chance.ts";
import { researchedFavorite, uniqueUpcomingGames } from "./research.ts";
import {
  DK_CAP,
  RB_DST_FAVORITE,
  SHOOTOUT_TOTAL,
  HIGH_WIND_MPH,
  adjustVolumeForScript,
  cashFloor,
  gppCeiling,
  isChalk,
  ownershipFrac,
  projectDkPoints,
  showdownPoints,
  showdownSalary,
} from "./dfs-scoring.ts";
import { applyInjuryRipple, inactiveRadar } from "./injury-ripple.ts";

export { DK_CAP };

export const SLOT_MAP: Record<string, string[]> = {
  NFL: ["QB", "RB", "RB", "WR", "WR", "WR", "TE", "FLEX", "DST"],
  NBA: ["PG", "SG", "SF", "PF", "C", "G", "F", "UTIL"],
  MLB: ["P", "P", "C", "1B", "2B", "3B", "SS", "OF", "OF", "OF"],
  NHL: ["C", "C", "W", "W", "W", "D", "D", "G", "UTIL"],
};

const FLEX_ELIGIBLE: Record<string, string[]> = {
  NFL: ["RB", "WR", "TE"],
  NBA: [],
  MLB: [],
  NHL: [],
};

const NBA_G = ["PG", "SG"];
const NBA_F = ["SF", "PF"];
const NBA_UTIL = ["PG", "SG", "SF", "PF", "C"];
const NHL_UTIL = ["C", "W", "D"];
const NHL_W = ["W", "LW", "RW"];

export function ePts(p: Pick<SlatePlayer, "p20" | "p50" | "p80">): number {
  return 0.25 * p.p20 + 0.5 * p.p50 + 0.25 * p.p80;
}

export function playerValue(p: Pick<SlatePlayer, "p20" | "p50" | "p80" | "salary">): number {
  const e = ePts(p);
  return p.salary > 0 ? e / (p.salary / 1000) : 0;
}

export function hydratePlayer(raw: Omit<SlatePlayer, "ePts" | "value">): SlatePlayer {
  let p20 = raw.p20;
  let p50 = raw.p50;
  let p80 = raw.p80;
  if (raw.volume && (raw.volume.passYds || raw.volume.rushYds || raw.volume.recYds || raw.volume.recs)) {
    const scripted = adjustVolumeForScript(raw.volume, { favoredBy: raw.favoredBy, windMph: raw.windMph });
    const mean = projectDkPoints(scripted);
    if (mean > 0) {
      p50 = raw.p50 > 0 ? raw.p50 : mean;
      p20 = raw.p20 > 0 ? raw.p20 : Math.round(mean * 0.75 * 10) / 10;
      p80 = raw.p80 > 0 ? raw.p80 : Math.round(mean * 1.28 * 10) / 10;
    }
  }
  const e = ePts({ p20, p50, p80 });
  return {
    ...raw,
    p20,
    p50,
    p80,
    ePts: e,
    value: raw.salary > 0 ? e / (raw.salary / 1000) : 0,
  };
}

function eligibleFor(slot: string, pos: string, sport: string): boolean {
  const p = pos.toUpperCase();
  const s = slot.toUpperCase();
  if (s === p) return true;
  if (sport === "NFL" && s === "FLEX") return FLEX_ELIGIBLE.NFL.includes(p);
  if (sport === "NFL" && s === "DST") return p === "DST" || p === "DEF";
  if (sport === "NBA" && s === "G") return NBA_G.includes(p);
  if (sport === "NBA" && s === "F") return NBA_F.includes(p);
  if (sport === "NBA" && s === "UTIL") return NBA_UTIL.includes(p);
  if (sport === "NHL" && (s === "W" || s === "LW" || s === "RW")) return NHL_W.includes(p) || p === "W";
  if (sport === "NHL" && s === "UTIL") return NHL_UTIL.includes(p) || NHL_W.includes(p);
  if (sport === "MLB" && s === "OF") return p === "OF" || p === "LF" || p === "CF" || p === "RF";
  if (sport === "MLB" && s === "P") return p === "P" || p === "SP" || p === "RP";
  return false;
}

function legalPool(players: SlatePlayer[]): SlatePlayer[] {
  return players.filter(
    (p) => p.confirmed && p.status !== "out" && p.status !== "ir" && p.status !== "locked" && p.salary > 0,
  );
}

type Scored = SlatePlayer & { score: number };

function isDst(p: { pos: string }): boolean {
  const pos = p.pos.toUpperCase();
  return pos === "DST" || pos === "DEF";
}

function isSkill(p: { pos: string }): boolean {
  return ["RB", "WR", "TE"].includes(p.pos.toUpperCase());
}

/** Never pair a starting QB with the opposing DST. */
export function forbidsOppDst(picked: SlatePlayer[], cand: SlatePlayer): boolean {
  if (isDst(cand)) {
    return picked.some((p) => p.pos === "QB" && p.opp === cand.team);
  }
  if (cand.pos === "QB") {
    return picked.some((p) => isDst(p) && p.team === cand.opp);
  }
  return false;
}

function greedyFill(opts: {
  sport: string;
  slots: string[];
  pool: SlatePlayer[];
  scoreOf: (p: SlatePlayer) => number;
  cap: number;
  requireStack?: boolean;
  seed?: SlatePlayer[];
  salaryOf?: (p: SlatePlayer, slot: string) => number;
}): { players: SlatePlayer[]; warnings: string[] } {
  const warnings: string[] = [];
  const slots = opts.slots;
  const salaryOf = opts.salaryOf ?? ((p) => p.salary);
  const remaining = [...opts.pool].map((p) => ({ ...p, score: opts.scoreOf(p) })) as Scored[];
  remaining.sort((a, b) => b.score - a.score || a.salary - b.salary);
  const used = new Set<string>();
  const picked: SlatePlayer[] = [];
  let spent = 0;

  for (const s of opts.seed ?? []) {
    if (used.has(s.id)) continue;
    used.add(s.id);
    picked.push(s);
    spent += s.salary;
  }

  const taken = new Set<number>();
  for (const p of picked) {
    const idx = slots.findIndex((s, i) => !taken.has(i) && eligibleFor(s, p.pos, opts.sport));
    if (idx >= 0) taken.add(idx);
  }
  const restSlots = slots.filter((_, i) => !taken.has(i));

  const minLeft = (from: number) => {
    const reserved = new Set<string>(used);
    let sum = 0;
    for (let i = from; i < restSlots.length; i++) {
      const slot = restSlots[i];
      const cand = remaining
        .filter((p) => !reserved.has(p.id) && eligibleFor(slot, p.pos, opts.sport) && !forbidsOppDst(picked, p))
        .sort((a, b) => salaryOf(a, slot) - salaryOf(b, slot))[0];
      if (cand) {
        reserved.add(cand.id);
        sum += salaryOf(cand, slot);
      }
    }
    return sum;
  };

  const seedCount = picked.length;
  for (let i = 0; i < restSlots.length; i++) {
    const slot = restSlots[i];
    const minRest = minLeft(i + 1);
    const room = opts.cap - spent - minRest;
    const cand = remaining
      .filter(
        (p) =>
          !used.has(p.id) &&
          eligibleFor(slot, p.pos, opts.sport) &&
          salaryOf(p, slot) <= room &&
          !forbidsOppDst(picked, p),
      )
      .sort((a, b) => b.score - a.score)[0];
    if (!cand) {
      warnings.push(`Empty slot: ${slot}`);
      continue;
    }
    used.add(cand.id);
    picked.push(cand);
    spent += salaryOf(cand, slot);
  }

  if (opts.requireStack && opts.sport === "NFL") {
    const qb = picked.find((p) => p.pos === "QB");
    const catchers = picked.filter(
      (p) => qb && (p.pos === "WR" || p.pos === "TE") && p.stackKey === qb.stackKey && p.id !== qb.id,
    );
    if (qb && catchers.length < 2) {
      const partner = remaining.find(
        (p) =>
          !used.has(p.id) &&
          (p.pos === "WR" || p.pos === "TE") &&
          p.stackKey === qb.stackKey &&
          !forbidsOppDst(picked, p),
      );
      const flexIdx = picked.findIndex((p, idx) => idx >= seedCount && (p.pos === "WR" || p.pos === "TE" || p.pos === "RB") && p.team !== qb.team);
      if (partner && flexIdx >= 0) {
        const victim = picked[flexIdx];
        const nextSpent = spent - victim.salary + partner.salary;
        if (nextSpent <= opts.cap) {
          used.delete(victim.id);
          used.add(partner.id);
          picked[flexIdx] = partner;
          spent = nextSpent;
        } else {
          warnings.push("Could not fit a second pass-catcher under cap.");
        }
      }
    }
  }

  if (spent > opts.cap) warnings.push("Over cap.");
  return { players: picked, warnings };
}

export function generateGPPStack(pool: SlatePlayer[]): { seed: SlatePlayer[]; note: string } {
  const qbs = [...pool.filter((p) => p.pos === "QB")].sort((a, b) => gppCeiling(b) - gppCeiling(a));
  for (const qb of qbs) {
    const shootout = qb.total == null || qb.total >= SHOOTOUT_TOTAL;
    if (!shootout) continue;
    const catchers = pool
      .filter((p) => (p.pos === "WR" || p.pos === "TE") && p.team === qb.team && p.id !== qb.id)
      .sort((a, b) => gppCeiling(b) - gppCeiling(a))
      .slice(0, 2);
    if (catchers.length < 2) continue;
    const bringBack = pool
      .filter((p) => isSkill(p) && p.team === qb.opp)
      .sort((a, b) => gppCeiling(b) - gppCeiling(a))[0];
    if (!bringBack) continue;
    return {
      seed: [qb, ...catchers, bringBack],
      note: `Double-stack ${qb.name} + ${catchers.map((c) => c.name).join(" + ")} with ${bringBack.name} bring-back.`,
    };
  }
  const qb = qbs[0];
  if (!qb) return { seed: [], note: "" };
  const one = pool.find((p) => (p.pos === "WR" || p.pos === "TE") && p.team === qb.team);
  return { seed: one ? [qb, one] : [qb], note: "GPP wants a QB stack. Shootout total was under 47, so the double-stack sat down." };
}

export function buildCashLineup(sport: string, players: SlatePlayer[], cap = DK_CAP): SlateLineup {
  const slots = SLOT_MAP[sport] ?? SLOT_MAP.NFL;
  const pool = legalPool(players);
  const { players: picked, warnings } = greedyFill({
    sport,
    slots,
    pool,
    scoreOf: (p) => cashFloor(p) + 0.18 * p.p20,
    cap,
  });
  const extra: string[] = [];
  const qb = picked.find((p) => p.pos === "QB");
  const dst = picked.find(isDst);
  if (qb && dst && dst.team === qb.opp) extra.push("Cash sat down a QB + opposing DST pairing.");
  const rb = picked.find((p) => p.pos === "RB");
  if (rb && dst && rb.team === dst.team && (rb.favoredBy ?? 0) >= RB_DST_FAVORITE) {
    extra.push(`${rb.name} + ${dst.name} DST — favorite by ${rb.favoredBy}. Clock-draining script.`);
  }
  return summarize("cash", picked, cap, [...warnings, ...extra], slots.length);
}

export function buildGppLineup(sport: string, players: SlatePlayer[], cap = DK_CAP): SlateLineup {
  const slots = SLOT_MAP[sport] ?? SLOT_MAP.NFL;
  const pool = legalPool(players);
  const stack = sport === "NFL" ? generateGPPStack(pool) : { seed: [] as SlatePlayer[], note: "" };
  const { players: picked, warnings } = greedyFill({
    sport,
    slots,
    pool,
    scoreOf: (p) => {
      const ceil = gppCeiling(p);
      const own = ownershipFrac(p.ownershipEst);
      const lever = isChalk(p.ownershipEst) ? 0.72 - Math.min(0.2, (own - 0.25) * 0.5) : 1;
      return ceil * lever;
    },
    cap,
    requireStack: sport === "NFL",
    seed: stack.seed,
  });
  const notes = [...warnings];
  if (stack.note) notes.push(stack.note);
  const chalk = picked.filter((p) => isChalk(p.ownershipEst));
  if (chalk.length) notes.push(`Chalk on the roster: ${chalk.map((c) => c.name).join(", ")}. Pivot if a teammate is cheaper and lower-owned.`);
  return summarize("gpp", picked, cap, notes, slots.length, { stackNote: stack.note });
}

const SHOWDOWN_SLOTS = ["CPT", "FLEX", "FLEX", "FLEX", "FLEX", "FLEX"];

export function buildShowdownLineup(players: SlatePlayer[], cap = DK_CAP): SlateLineup | null {
  const pool = legalPool(players);
  const byGame = new Map<string, SlatePlayer[]>();
  for (const p of pool) {
    const key = p.stackKey || [p.team, p.opp].sort().join("-");
    const arr = byGame.get(key) ?? [];
    arr.push(p);
    byGame.set(key, arr);
  }
  const game = [...byGame.values()].sort((a, b) => b.length - a.length)[0];
  if (!game || game.length < 6) return null;

  const cheapest = [...game].sort((a, b) => a.salary - b.salary);
  let bestCaptain: SlatePlayer | null = null;
  let bestScore = -Infinity;
  for (const c of game) {
    const restMin = cheapest.filter((x) => x.id !== c.id).slice(0, 5).reduce((s, p) => s + p.salary, 0);
    const cost = showdownSalary(c.salary, true);
    if (cost + restMin > cap) continue;
    const score = showdownPoints(gppCeiling(c), true);
    if (score > bestScore) {
      bestScore = score;
      bestCaptain = c;
    }
  }
  if (!bestCaptain) return null;

  const used = new Set([bestCaptain.id]);
  const picked: SlatePlayer[] = [bestCaptain];
  let spent = showdownSalary(bestCaptain.salary, true);
  const warnings: string[] = [];

  const captainIsCatcher = bestCaptain.pos === "WR" || bestCaptain.pos === "TE";
  if (captainIsCatcher) {
    const qb = game.find((p) => p.pos === "QB" && p.team === bestCaptain!.team && !used.has(p.id));
    if (qb && spent + qb.salary <= cap) {
      used.add(qb.id);
      picked.push(qb);
      spent += qb.salary;
    } else {
      warnings.push("Captain is a pass-catcher — their QB should be in FLEX. Could not fit the QB under cap.");
    }
  }

  const ranked = [...game]
    .filter((p) => !used.has(p.id))
    .sort((a, b) => gppCeiling(b) - gppCeiling(a) || a.salary - b.salary);
  while (picked.length < 6) {
    const need = 6 - picked.length - 1;
    const room = cap - spent;
    const cand = ranked.find((p) => {
      if (used.has(p.id)) return false;
      const minRest = [...game]
        .filter((x) => !used.has(x.id) && x.id !== p.id)
        .sort((a, b) => a.salary - b.salary)
        .slice(0, Math.max(0, need))
        .reduce((s, x) => s + x.salary, 0);
      return p.salary <= room - minRest;
    });
    if (!cand) {
      warnings.push("Empty FLEX.");
      break;
    }
    used.add(cand.id);
    picked.push(cand);
    spent += cand.salary;
  }

  const note = `${bestCaptain.name} Captain at 1.5× salary (${showdownSalary(bestCaptain.salary, true).toLocaleString()}) and 1.5× points.`;
  const lineup = summarize("showdown", picked, cap, [...warnings, note], SHOWDOWN_SLOTS.length, {
    captainId: bestCaptain.id,
    stackNote: note,
    salaryOf: (p) => (p.id === bestCaptain!.id ? showdownSalary(p.salary, true) : p.salary),
    pointsOf: (p, key) => showdownPoints(p[key], p.id === bestCaptain!.id),
  });
  return lineup;
}

function summarize(
  kind: SlateLineup["kind"],
  players: SlatePlayer[],
  cap: number,
  warnings: string[],
  slotCount: number,
  extra?: {
    captainId?: string | null;
    stackNote?: string;
    salaryOf?: (p: SlatePlayer) => number;
    pointsOf?: (p: SlatePlayer, key: "p20" | "p50" | "p80") => number;
  },
): SlateLineup {
  void slotCount;
  if (players.some((p) => p.status === "out" || p.status === "ir")) {
    warnings.push("Out / IR player in lineup.");
  }
  const salaryOf = extra?.salaryOf ?? ((p: SlatePlayer) => p.salary);
  const pointsOf = extra?.pointsOf ?? ((p: SlatePlayer, key: "p20" | "p50" | "p80") => p[key]);
  const capUsed = players.reduce((s, p) => s + salaryOf(p), 0);
  return {
    kind,
    players,
    capUsed,
    cap,
    projP20: players.reduce((s, p) => s + pointsOf(p, "p20"), 0),
    projP50: players.reduce((s, p) => s + pointsOf(p, "p50"), 0),
    projP80: players.reduce((s, p) => s + pointsOf(p, "p80"), 0),
    warnings: [...new Set(warnings)],
    captainId: extra?.captainId ?? null,
    stackNote: extra?.stackNote,
  };
}

export function detectSalaryShifts(prev: SlatePlayer[], next: SlatePlayer[]): SalaryShift[] {
  if (!prev.length) return [];
  const byName = new Map(prev.map((p) => [p.name.toLowerCase(), p]));
  const out: SalaryShift[] = [];
  for (const p of next) {
    const old = byName.get(p.name.toLowerCase());
    if (!old) continue;
    if (Math.abs(old.salary - p.salary) >= 200) {
      out.push({ name: p.name, was: old.salary, now: p.salary });
    }
  }
  return out;
}

export function optimizeSlate(bundle: Omit<SlateBundle, "cash" | "gpp" | "showdown">): SlateBundle {
  if (!bundle.confirmed) {
    return { ...bundle, cash: null, gpp: null, showdown: null, inactiveAlerts: [] };
  }
  const rippled = applyInjuryRipple(bundle.players).map((p) => hydratePlayer(p));
  const alerts = inactiveRadar(rippled);
  return {
    ...bundle,
    players: rippled,
    cash: buildCashLineup(bundle.sport, rippled, bundle.cap),
    gpp: buildGppLineup(bundle.sport, rippled, bundle.cap),
    showdown: bundle.sport === "NFL" ? buildShowdownLineup(rippled, bundle.cap) : null,
    inactiveAlerts: alerts,
  };
}

export function parseSlateTable(text: string, sport: string): SlatePlayer[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const rows = lines.filter((l) => !/^name|player|pos/i.test(l));
  const out: SlatePlayer[] = [];
  rows.forEach((line, i) => {
    const parts = line.split(/[,\t|]+/).map((p) => p.trim());
    if (parts.length < 3) return;
    const name = parts[0];
    const pos = parts[1].toUpperCase();
    const team = parts[2].toUpperCase();
    const salary = Number(String(parts[3] ?? "0").replace(/[^0-9.]/g, ""));
    const p50 = Number(parts[4] ?? "0") || salary / 1000 * 4;
    const p20 = Number(parts[5] ?? "") || p50 * 0.75;
    const p80 = Number(parts[6] ?? "") || p50 * 1.25;
    const opp = (parts[7] ?? "").toUpperCase();
    const statusRaw = (parts[8] ?? "ok").toLowerCase();
    const status: SlatePlayer["status"] =
      statusRaw === "out" || statusRaw === "ir" || statusRaw === "locked" || statusRaw === "questionable"
        ? statusRaw
        : "ok";
    const raw = {
      id: `${sport}-${name}-${i}`,
      name,
      pos,
      team,
      opp,
      status,
      salary,
      p20,
      p50,
      p80,
      ownershipEst: Number(parts[9] ?? 10),
      stackKey: `${team}-game`,
      confidence: "med" as const,
      confirmed: true,
    };
    out.push(hydratePlayer(raw));
  });
  return out;
}

export function sampleNflSlate(): SlatePlayer[] {
  const kcBal = { total: 52.5, kickoff: lateSundayIso(), windMph: 8 };
  const phiDal = { total: 48.5, kickoff: earlySundayIso() };
  const rows: Array<Omit<SlatePlayer, "ePts" | "value">> = [
    { id: "kc-mahomes", name: "P. Mahomes", pos: "QB", team: "KC", opp: "BAL", status: "ok", salary: 7800, p20: 18, p50: 24, p80: 32, ownershipEst: 18, stackKey: "KC-BAL", confidence: "high", confirmed: true, total: kcBal.total, favoredBy: 3, kickoff: kcBal.kickoff, windMph: kcBal.windMph, targetShare: 0, usageRate: 1, opportunityWeight: 1, volume: { passYds: 285, passTd: 2.2, ints: 0.7, rushYds: 22, rushTd: 0.2 } },
    { id: "bal-jackson", name: "L. Jackson", pos: "QB", team: "BAL", opp: "KC", status: "ok", salary: 7600, p20: 17, p50: 23, p80: 31, ownershipEst: 16, stackKey: "KC-BAL", confidence: "high", confirmed: true, total: kcBal.total, favoredBy: -3, kickoff: kcBal.kickoff, volume: { passYds: 230, passTd: 1.6, ints: 0.6, rushYds: 55, rushTd: 0.4 } },
    { id: "phi-hurts", name: "J. Hurts", pos: "QB", team: "PHI", opp: "DAL", status: "ok", salary: 7400, p20: 16, p50: 22, p80: 30, ownershipEst: 14, stackKey: "PHI-DAL", confidence: "high", confirmed: true, total: phiDal.total, favoredBy: 6, kickoff: phiDal.kickoff },
    { id: "kc-kelce", name: "T. Kelce", pos: "TE", team: "KC", opp: "BAL", status: "ok", salary: 6200, p20: 9, p50: 14, p80: 20, ownershipEst: 20, stackKey: "KC-BAL", confidence: "high", confirmed: true, total: kcBal.total, kickoff: kcBal.kickoff, targetShare: 0.24, usageRate: 0.22, opportunityWeight: 0.55, volume: { recYds: 72, recs: 6.4, recTd: 0.6 } },
    { id: "kc-worthy", name: "X. Worthy", pos: "WR", team: "KC", opp: "BAL", status: "ok", salary: 5400, p20: 8, p50: 13, p80: 21, ownershipEst: 12, stackKey: "KC-BAL", confidence: "med", confirmed: true, total: kcBal.total, kickoff: kcBal.kickoff, targetShare: 0.2, usageRate: 0.18, opportunityWeight: 0.35, volume: { recYds: 68, recs: 4.8, recTd: 0.5 } },
    { id: "kc-rice", name: "R. Rice", pos: "WR", team: "KC", opp: "BAL", status: "ok", salary: 6100, p20: 9, p50: 14, p80: 20, ownershipEst: 15, stackKey: "KC-BAL", confidence: "med", confirmed: true, total: kcBal.total, kickoff: kcBal.kickoff, targetShare: 0.22, usageRate: 0.2, opportunityWeight: 0.4 },
    { id: "bal-flowers", name: "Z. Flowers", pos: "WR", team: "BAL", opp: "KC", status: "ok", salary: 5900, p20: 8, p50: 13, p80: 19, ownershipEst: 11, stackKey: "KC-BAL", confidence: "med", confirmed: true, total: kcBal.total, kickoff: kcBal.kickoff, targetShare: 0.21, opportunityWeight: 0.4 },
    { id: "bal-andrews", name: "M. Andrews", pos: "TE", team: "BAL", opp: "KC", status: "ok", salary: 4800, p20: 6, p50: 10, p80: 16, ownershipEst: 9, stackKey: "KC-BAL", confidence: "med", confirmed: true, total: kcBal.total, kickoff: kcBal.kickoff, targetShare: 0.16, opportunityWeight: 0.3 },
    { id: "phi-brown", name: "A. J. Brown", pos: "WR", team: "PHI", opp: "DAL", status: "ok", salary: 7200, p20: 10, p50: 16, p80: 24, ownershipEst: 17, stackKey: "PHI-DAL", confidence: "high", confirmed: true, total: phiDal.total, kickoff: phiDal.kickoff },
    { id: "phi-smith", name: "D. Smith", pos: "WR", team: "PHI", opp: "DAL", status: "ok", salary: 6400, p20: 8, p50: 13, p80: 20, ownershipEst: 13, stackKey: "PHI-DAL", confidence: "med", confirmed: true, total: phiDal.total, kickoff: phiDal.kickoff },
    { id: "dal-lamb", name: "C. Lamb", pos: "WR", team: "DAL", opp: "PHI", status: "ok", salary: 7600, p20: 11, p50: 17, p80: 25, ownershipEst: 22, stackKey: "PHI-DAL", confidence: "high", confirmed: true, total: phiDal.total, kickoff: phiDal.kickoff },
    { id: "dal-prescott", name: "D. Prescott", pos: "QB", team: "DAL", opp: "PHI", status: "ok", salary: 6800, p20: 15, p50: 21, p80: 28, ownershipEst: 12, stackKey: "PHI-DAL", confidence: "med", confirmed: true, total: phiDal.total, kickoff: phiDal.kickoff },
    { id: "dal-ferguson", name: "J. Ferguson", pos: "TE", team: "DAL", opp: "PHI", status: "ok", salary: 3900, p20: 5, p50: 8, p80: 13, ownershipEst: 6, stackKey: "PHI-DAL", confidence: "med", confirmed: true, total: phiDal.total, kickoff: phiDal.kickoff },
    { id: "kc-pacheco", name: "I. Pacheco", pos: "RB", team: "KC", opp: "BAL", status: "ok", salary: 5800, p20: 8, p50: 13, p80: 19, ownershipEst: 14, stackKey: "KC-BAL", confidence: "med", confirmed: true, total: kcBal.total, kickoff: kcBal.kickoff, usageRate: 0.55, opportunityWeight: 0.65, volume: { rushYds: 68, rushTd: 0.5, recs: 2.1, recYds: 14 } },
    { id: "kc-hunt", name: "K. Hunt", pos: "RB", team: "KC", opp: "BAL", status: "ok", salary: 4200, p20: 4, p50: 7, p80: 12, ownershipEst: 4, stackKey: "KC-BAL", confidence: "med", confirmed: true, total: kcBal.total, kickoff: kcBal.kickoff, usageRate: 0.2, opportunityWeight: 0.35 },
    { id: "bal-henry", name: "D. Henry", pos: "RB", team: "BAL", opp: "KC", status: "ok", salary: 8000, p20: 12, p50: 18, p80: 26, ownershipEst: 24, stackKey: "KC-BAL", confidence: "high", confirmed: true, total: kcBal.total, kickoff: kcBal.kickoff, usageRate: 0.62, opportunityWeight: 0.7, volume: { rushYds: 95, rushTd: 0.8, recs: 1.2, recYds: 8 } },
    { id: "bal-hill", name: "J. Hill", pos: "RB", team: "BAL", opp: "KC", status: "ok", salary: 4000, p20: 3.5, p50: 6, p80: 11, ownershipEst: 3, stackKey: "KC-BAL", confidence: "med", confirmed: true, total: kcBal.total, kickoff: kcBal.kickoff, usageRate: 0.18, opportunityWeight: 0.3 },
    { id: "phi-saquon", name: "S. Barkley", pos: "RB", team: "PHI", opp: "DAL", status: "ok", salary: 8200, p20: 13, p50: 19, p80: 27, ownershipEst: 26, stackKey: "PHI-DAL", confidence: "high", confirmed: true, total: phiDal.total, favoredBy: 6, kickoff: phiDal.kickoff, usageRate: 0.6 },
    { id: "dal-williams", name: "J. Williams", pos: "RB", team: "DAL", opp: "PHI", status: "ok", salary: 5600, p20: 8, p50: 12, p80: 18, ownershipEst: 10, stackKey: "PHI-DAL", confidence: "med", confirmed: true, total: phiDal.total, kickoff: phiDal.kickoff },
    { id: "rb-mixon", name: "J. Mixon", pos: "RB", team: "HOU", opp: "IND", status: "ok", salary: 6100, p20: 9, p50: 14, p80: 20, ownershipEst: 11, stackKey: "HOU-IND", confidence: "med", confirmed: true },
    { id: "rb-cook", name: "J. Cook", pos: "RB", team: "BUF", opp: "MIA", status: "ok", salary: 6400, p20: 9, p50: 14, p80: 21, ownershipEst: 12, stackKey: "BUF-MIA", confidence: "med", confirmed: true },
    { id: "wr-hill", name: "T. Hill", pos: "WR", team: "MIA", opp: "BUF", status: "ok", salary: 7000, p20: 9, p50: 15, p80: 23, ownershipEst: 16, stackKey: "BUF-MIA", confidence: "med", confirmed: true },
    { id: "te-kittle", name: "G. Kittle", pos: "TE", team: "SF", opp: "NYJ", status: "ok", salary: 5300, p20: 7, p50: 11, p80: 17, ownershipEst: 10, stackKey: "SF-NYJ", confidence: "med", confirmed: true },
    { id: "dst-bal", name: "Ravens", pos: "DST", team: "BAL", opp: "KC", status: "ok", salary: 3200, p20: 4, p50: 7, p80: 13, ownershipEst: 8, stackKey: "KC-BAL", confidence: "med", confirmed: true, kickoff: kcBal.kickoff },
    { id: "dst-phi", name: "Eagles", pos: "DST", team: "PHI", opp: "DAL", status: "ok", salary: 3000, p20: 4, p50: 7, p80: 12, ownershipEst: 9, stackKey: "PHI-DAL", confidence: "med", confirmed: true, favoredBy: 6, kickoff: phiDal.kickoff },
    { id: "dst-sf", name: "49ers", pos: "DST", team: "SF", opp: "NYJ", status: "ok", salary: 3400, p20: 5, p50: 8, p80: 14, ownershipEst: 11, stackKey: "SF-NYJ", confidence: "med", confirmed: true },
    { id: "dst-kc", name: "Chiefs", pos: "DST", team: "KC", opp: "BAL", status: "ok", salary: 2800, p20: 3.5, p50: 6, p80: 11, ownershipEst: 6, stackKey: "KC-BAL", confidence: "med", confirmed: true, kickoff: kcBal.kickoff },
    { id: "wr-adams", name: "D. Adams", pos: "WR", team: "NYJ", opp: "SF", status: "ok", salary: 6000, p20: 7, p50: 12, p80: 19, ownershipEst: 9, stackKey: "SF-NYJ", confidence: "med", confirmed: true },
    { id: "rb-out", name: "Injured Back", pos: "RB", team: "NE", opp: "CIN", status: "out", salary: 5500, p20: 11, p50: 16, p80: 22, ownershipEst: 1, stackKey: "NE-CIN", confidence: "low", confirmed: true, usageRate: 0.58, targetShare: 0.08 },
    { id: "rb-stevenson", name: "R. Stevenson", pos: "RB", team: "NE", opp: "CIN", status: "ok", salary: 4800, p20: 6, p50: 9, p80: 14, ownershipEst: 5, stackKey: "NE-CIN", confidence: "med", confirmed: true, usageRate: 0.22, opportunityWeight: 0.7 },
    { id: "te-njoku", name: "D. Njoku", pos: "TE", team: "CLE", opp: "PIT", status: "ok", salary: 4100, p20: 5, p50: 9, p80: 14, ownershipEst: 5, stackKey: "CLE-PIT", confidence: "med", confirmed: true },
    { id: "wr-cheap", name: "G. Wilson", pos: "WR", team: "NYJ", opp: "SF", status: "ok", salary: 5200, p20: 7, p50: 11, p80: 18, ownershipEst: 8, stackKey: "SF-NYJ", confidence: "med", confirmed: true },
    { id: "rb-pittman", name: "J. Taylor", pos: "RB", team: "IND", opp: "HOU", status: "ok", salary: 6700, p20: 10, p50: 15, p80: 22, ownershipEst: 13, stackKey: "HOU-IND", confidence: "med", confirmed: true },
  ];
  return rows.map(hydratePlayer);
}

function nextSundayEt(hour: number, minute: number): string {
  const now = new Date();
  const et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const day = et.getDay();
  const add = (7 - day) % 7 || 7;
  const d = new Date(et);
  d.setDate(et.getDate() + add);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function earlySundayIso(): string {
  return nextSundayEt(13, 0);
}

function lateSundayIso(): string {
  return nextSundayEt(16, 25);
}

export function lineupExport(lineup: SlateLineup): string {
  return lineup.players
    .map((p) => {
      const captain = lineup.captainId === p.id;
      const tag = captain ? "CPT" : p.pos;
      const salary = captain ? showdownSalary(p.salary, true) : p.salary;
      return `${tag} ${p.name} $${salary}`;
    })
    .join("\n");
}

export type TeamGameLean = {
  team: string;
  also?: string;
  winChance: number;
  total?: number;
  sport: string;
  favoriteName: string;
};

export function teamLeansFromBoard(rows: ScanRow[], briefs?: EventBrief[], predict?: PredictQuote[]): TeamGameLean[] {
  const games = uniqueUpcomingGames(rows);
  const out: TeamGameLean[] = [];
  for (const g of games) {
    const fav = researchedFavorite(
      rows.filter((r) => r.eventId === g.eventId),
      briefs?.find((b) => b.eventId === g.eventId),
      {
        home: g.home,
        away: g.away,
        kalshiHome: predict?.find((p) => p.eventId === g.eventId)?.kalshiHome,
        polyHome: predict?.find((p) => p.eventId === g.eventId)?.polyHome,
      },
    );
    const homeChance = fav?.homeChance ?? (g.side === "home" ? g.fairProb : 1 - g.fairProb);
    out.push({
      team: g.homeAbbr || g.home,
      also: g.home,
      winChance: homeChance,
      total: g.total,
      sport: g.sport,
      favoriteName: fav?.name ?? (homeChance >= 0.5 ? g.home : g.away),
    });
    out.push({
      team: g.awayAbbr || g.away,
      also: g.away,
      winChance: 1 - homeChance,
      total: g.total,
      sport: g.sport,
      favoriteName: fav?.name ?? (homeChance >= 0.5 ? g.home : g.away),
    });
  }
  return out;
}

function leanFor(playerTeam: string, leans: TeamGameLean[], sport?: string): TeamGameLean | undefined {
  const t = playerTeam.toLowerCase();
  return leans.find((l) => {
    if (sport && l.sport && l.sport !== sport) return false;
    const a = l.team.toLowerCase();
    const b = (l.also ?? "").toLowerCase();
    return a === t || b === t || b.split(" ").some((p) => p === t) || (t.length >= 3 && (a.includes(t) || b.includes(t)));
  });
}

/** Same game ensemble as the board: nudge fantasy points with researched win chance and game total. */
export function applyGameLean(players: SlatePlayer[], leans: TeamGameLean[], sport?: string): SlatePlayer[] {
  if (!leans.length) return players;
  return players.map((p) => {
    const lean = leanFor(p.team, leans, sport);
    if (!lean || !(lean.winChance > 0)) return p;
    const defense = p.pos === "DST" || p.pos === "DEF" || (lean.sport === "NHL" && p.pos === "G");
    let mult = 1;
    if (defense) {
      mult = 0.82 + 0.45 * lean.winChance;
    } else {
      const lg = leagueTotal(lean.sport);
      const totalMult = lean.total != null && lg > 0 ? Math.min(1.12, Math.max(0.9, lean.total / lg)) : 1;
      mult = 0.88 + 0.14 * lean.winChance + 0.1 * (totalMult - 1);
    }
    if ((p.windMph ?? 0) >= HIGH_WIND_MPH) {
      if (p.pos === "WR" || p.pos === "TE" || p.pos === "QB") mult *= 0.92;
      if (p.pos === "RB") mult *= 1.05;
    }
    return hydratePlayer({
      ...p,
      p20: p.p20 * (0.94 + 0.08 * lean.winChance),
      p50: p.p50 * mult,
      p80: p.p80 * (mult + 0.04),
      researchNote: `${lean.favoriteName} lean · ${p.team} win chance ~${Math.round(lean.winChance * 100)} in 100`,
    });
  });
}

