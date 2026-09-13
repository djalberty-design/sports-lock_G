/** Officials on G. Crew names from ESPN. Tendencies only when posted. A name with no file is empty. */
export type OfficialPosting = {
  name: string;
  role?: string;
  runExp?: number;
  overLean?: number;
  homeLean?: number;
  whistle?: number;
};

export type OfficialSnap = {
  sport: string;
  officials?: OfficialPosting[];
};

export type OfficialLayer = {
  id: "officials";
  label: string;
  home: number;
  precision: number;
  empty: boolean;
  note: string;
};

export type OfficialMeans = {
  muH: number;
  muA: number;
  chaosAdd: number;
  empty: boolean;
  note?: string;
  layer: OfficialLayer;
};

function clip(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function displayName(o: OfficialPosting): string {
  return [o.name, o.role].filter(Boolean).join(" · ");
}

export function parseEspnOfficials(raw: unknown): OfficialPosting[] {
  if (!raw || typeof raw !== "object") return [];
  const root = raw as { gameInfo?: { officials?: unknown }; officials?: unknown };
  const list = root.gameInfo?.officials ?? root.officials;
  if (!Array.isArray(list)) return [];
  const out: OfficialPosting[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const o = item as {
      fullName?: string;
      displayName?: string;
      name?: string;
      position?: { displayName?: string; name?: string } | string;
    };
    const name = o.fullName || o.displayName || o.name;
    if (!name) continue;
    const role = typeof o.position === "string" ? o.position : o.position?.displayName || o.position?.name;
    out.push({ name, role });
  }
  return out;
}

export function officialLayer(snap: OfficialSnap): OfficialLayer {
  const crew = snap.officials ?? [];
  const names = crew.map(displayName).filter(Boolean);
  const posted = crew.filter(
    (o) => o.runExp != null || o.overLean != null || o.homeLean != null || o.whistle != null,
  );
  if (!crew.length) {
    return {
      id: "officials",
      label: "Officials / umpire",
      home: 0.5,
      precision: 0,
      empty: true,
      note: "Looked up crew. ESPN/RefMetrics file not posted. Empty = Looked, not an invented strike zone.",
    };
  }
  if (!posted.length) {
    return {
      id: "officials",
      label: "Officials / umpire",
      home: 0.5,
      precision: 0,
      empty: true,
      note: `Crew posted: ${names.slice(0, 3).join(", ")}. Tendency file empty — no invented ATS or zone.`,
    };
  }
  const home = posted.reduce((s, o) => s + (o.homeLean != null ? o.homeLean : 0.5), 0) / posted.length;
  return {
    id: "officials",
    label: "Officials / umpire",
    home: clip(home, 0.2, 0.8),
    precision: 1.4,
    empty: false,
    note: `Posted crew tendency on ${posted.map(displayName).join(", ")}.`,
  };
}

export function applyOfficialsToMeans(snap: OfficialSnap, muH: number, muA: number): OfficialMeans {
  const layer = officialLayer(snap);
  const crew = snap.officials ?? [];
  const posted = crew.filter(
    (o) => o.runExp != null || o.overLean != null || o.homeLean != null || o.whistle != null,
  );
  if (!posted.length) {
    return { muH, muA, chaosAdd: 0, empty: true, note: layer.note, layer };
  }
  let nextH = muH;
  let nextA = muA;
  let chaosAdd = 0;
  for (const o of posted) {
    if (o.runExp != null && Number.isFinite(o.runExp)) {
      const pace = clip(1 + o.runExp / 12, 0.96, 1.06);
      nextH *= pace;
      nextA *= pace;
    }
    if (o.overLean != null && Number.isFinite(o.overLean)) {
      const pace = clip(1 + (o.overLean - 0.5) * 0.08, 0.96, 1.05);
      nextH *= pace;
      nextA *= pace;
    }
    if (o.homeLean != null && Number.isFinite(o.homeLean)) {
      const tilt = clip((o.homeLean - 0.5) * 0.06, -0.03, 0.03);
      nextH *= 1 + tilt;
      nextA *= 1 - tilt;
    }
    if (o.whistle != null && Number.isFinite(o.whistle)) {
      chaosAdd += clip((o.whistle - 1) * 0.04, -0.02, 0.04);
    }
  }
  return {
    muH: nextH,
    muA: nextA,
    chaosAdd: clip(chaosAdd, 0, 0.06),
    empty: false,
    note: layer.note,
    layer,
  };
}
