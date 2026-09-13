/** Market is the opponent. Close is real money. Open is the move. Tickets are not a price. */
export type TapeSnap = {
  home?: string;
  oddsHome?: number;
  openHome?: number;
  ticketHome?: number;
  handleHome?: number;
  steam?: boolean;
};

export type TapeLayer = {
  id: string;
  label: string;
  home: number;
  precision: number;
  family: "market" | "crowd" | "context";
  note: string;
  empty?: boolean;
  thin?: boolean;
};

function finite01(p?: number): number | undefined {
  if (p == null || !Number.isFinite(p) || p <= 0.02 || p >= 0.98) return undefined;
  return p;
}

export function thinClose(oddsHome?: number, vigWidth?: number): boolean {
  if (oddsHome == null || !Number.isFinite(oddsHome)) return true;
  if (oddsHome <= 0.02 || oddsHome >= 0.98) return true;
  if (vigWidth != null && vigWidth >= 0.12) return true;
  return false;
}

export function openMoveNote(openHome: number, closeHome: number | undefined, homeName?: string): string {
  if (closeHome == null) return "Opening print on the board. No close yet.";
  const moved = closeHome - openHome;
  const who = homeName ?? "home";
  if (moved > 0.008) return `Close moved toward ${who}. Open is the move, not a second close.`;
  if (moved < -0.008) return `Close moved away from ${who}. Open is the move, not a second close.`;
  return "Close sits on the open. No steam from the print alone.";
}

export function openPrecision(hasClose: boolean): number {
  return hasClose ? 2.2 : 4.5;
}

export function tapeLayers(input: TapeSnap): TapeLayer[] {
  const out: TapeLayer[] = [];
  const tickets = finite01(input.ticketHome);
  const handle = finite01(input.handleHome);
  const close = finite01(input.oddsHome);

  if (tickets != null) {
    out.push({
      id: "tickets",
      label: "Public tickets",
      home: tickets,
      precision: 1.15,
      family: "crowd",
      note: "Share of tickets. Never copy this number. It is not a price.",
    });
  } else {
    out.push({
      id: "tickets",
      label: "Public tickets",
      home: 0.5,
      precision: 0,
      family: "crowd",
      note: "Looked up ticket split. Empty look.",
      empty: true,
      thin: true,
    });
  }

  if (handle != null) {
    out.push({
      id: "handle",
      label: "Handle",
      home: handle,
      precision: 2.35,
      family: "crowd",
      note: "Share of dollars. Heavier than tickets. Still not the close.",
    });
  } else {
    out.push({
      id: "handle",
      label: "Handle",
      home: 0.5,
      precision: 0,
      family: "crowd",
      note: "Looked up handle split. Empty look.",
      empty: true,
      thin: true,
    });
  }

  const diverge = tickets != null && handle != null && Math.abs(tickets - handle) >= 0.12;
  const steamed = Boolean(input.steam) || diverge;
  if (steamed && (close != null || handle != null)) {
    out.push({
      id: "steam",
      label: "Steam / reverse line",
      home: close ?? handle ?? 0.5,
      precision: 1.8,
      family: "market",
      note: diverge
        ? "Handle disagrees with tickets. Steam is the book, not the public side."
        : "Steam flag on the tape. The close is the opponent.",
    });
  } else {
    out.push({
      id: "steam",
      label: "Steam / reverse line",
      home: 0.5,
      precision: 0,
      family: "market",
      note: "Looked up steam. Empty look.",
      empty: true,
      thin: true,
    });
  }
  return out;
}
