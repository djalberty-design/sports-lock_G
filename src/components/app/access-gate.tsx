import { type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AppShell } from "./shell";
import { DeskDecisionProvider } from "@/lib/market/desk-decision";
import { LedgerSync } from "./ledger-sync";

/**
 * v7 public desk. No login wall. No Access Pending.
 * /login stays a clean owner sign-in page (no chrome).
 * Every other route loads the desk unsigned.
 */
export function AccessGate({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/login") return <>{children}</>;
  return (
    <DeskDecisionProvider>
      <LedgerSync />
      <AppShell>{children}</AppShell>
    </DeskDecisionProvider>
  );
}
