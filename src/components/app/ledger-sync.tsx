import { useEffect, useRef } from "react";
import { useDeskStore } from "@/lib/desk-store";
import { pullMyLedger, pushMyLedger } from "@/lib/desk-api";
import { paperToLedger } from "@/lib/ledger";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import type { PaperTicket } from "@/lib/market/types";

/** Authenticated sessions persist the log so clearing the browser does not wipe Hit / Miss. */
export function LedgerSync() {
  const user = useCurrentUser();
  const hydrated = useDeskStore((s) => s.hydrated);
  const paperTickets = useDeskStore((s) => s.paperTickets);
  const pulled = useRef(false);
  const lastSent = useRef("");

  useEffect(() => {
    if (!user || user.isDevFallback || !hydrated || pulled.current) return;
    pulled.current = true;
    void pullMyLedger()
      .then((entries) => {
        if (!entries.length) return;
        const store = useDeskStore.getState();
        const have = new Set(store.paperTickets.map((t) => t.id));
        const extras: PaperTicket[] = [];
        for (const e of entries) {
          if (have.has(e.id)) continue;
          extras.push({
            id: e.id,
            createdAt: e.timestamp,
            description: e.ticketName,
            home: e.teams.home,
            away: e.teams.away,
            kind: e.marketType === "PARLAY" ? "parlay" : e.marketType === "PROP" ? "prop" : "main",
            price: e.hardRockOdds || undefined,
            chance: e.deskTrueProbability || undefined,
            stake: e.stakeDollars,
            status: e.result === "HIT" ? "win" : e.result === "MISS" ? "loss" : e.result === "PUSH" ? "void" : "open",
            venue: "paper",
            gameIds: [],
          });
        }
        if (extras.length) {
          useDeskStore.setState({ paperTickets: [...extras, ...store.paperTickets] });
        }
      })
      .catch(() => {
        /* stay on the local log */
      });
  }, [user, hydrated]);

  useEffect(() => {
    if (!user || user.isDevFallback || !hydrated) return;
    const payload = JSON.stringify(paperTickets.map((t) => t.id + t.status + t.stake));
    if (payload === lastSent.current) return;
    const timer = window.setTimeout(() => {
      lastSent.current = payload;
      void pushMyLedger({ data: { entries: paperTickets.map(paperToLedger) } }).catch(() => {
        /* download JSON remains the offline backup */
      });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [paperTickets, user, hydrated]);

  return null;
}
