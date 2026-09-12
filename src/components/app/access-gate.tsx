import { type ReactNode, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { signOut } from "@/lib/auth/client";
import { requestAccess } from "@/lib/desk-api";
import { useAccess } from "@/lib/use-access";
import { BRAND } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { AppShell } from "./shell";
import { DeskDecisionProvider } from "@/lib/market/desk-decision";
import { LedgerSync } from "./ledger-sync";

export function AccessGate({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, sessionPending, accessPending, access, isApproved, refetch } = useAccess();

  if (sessionPending) return <SessionSplash />;
  if (!user) {
    if (pathname === "/login") return <>{children}</>;
    return <RedirectToSignIn />;
  }
  if (accessPending) return <SessionSplash />;
  if (!isApproved) {
    return <PendingAccess email={access?.email || user.primaryEmail} requestStatus={access?.requestStatus ?? "none"} onRequested={() => void refetch()} />;
  }
  return (
    <DeskDecisionProvider>
      <LedgerSync />
      <AppShell>{children}</AppShell>
    </DeskDecisionProvider>
  );
}

function SessionSplash() {
  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <p className="stamp text-gold">{BRAND.name}</p>
        <div className="mt-4 h-10 w-48 animate-pulse rounded-md bg-wash" />
        <p className="mt-3 text-sm text-muted">Checking your desk access…</p>
      </div>
    </main>
  );
}

function PendingAccess({
  email,
  requestStatus,
  onRequested,
}: {
  email: string | null;
  requestStatus: "none" | "pending" | "approved" | "denied";
  onRequested: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const denied = requestStatus === "denied";
  const sent = requestStatus === "pending";

  async function submit() {
    setBusy(true);
    setNote("");
    try {
      await requestAccess();
      setNote("Request sent. The admin will review it.");
      onRequested();
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Could not send the request.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-4 py-10">
      <section className="w-full max-w-md paper-card p-6">
        <p className="stamp text-gold">Private desk</p>
        <h1 className="font-display mt-3 text-3xl text-ink">Access Pending Approval by Admin</h1>
        <p className="mt-3 text-sm text-ink/80">
          {email ? (
            <>
              Signed in as <span className="font-medium text-ink">{email}</span>. This desk is allowlist-only.
            </>
          ) : (
            "This desk is allowlist-only."
          )}{" "}
          The owner reviews requests. This site never places a bet.
        </p>
        {denied ? (
          <p className="mt-3 rounded-md bg-wash px-3 py-2 text-sm text-muted">That email was not approved. You can send another request.</p>
        ) : null}
        {sent ? (
          <p className="mt-4 text-sm text-gold">Your request is in the queue. You will get in once the admin approves it.</p>
        ) : (
          <Button className="mt-5 w-full" type="button" disabled={busy} onClick={() => void submit()}>
            {busy ? "Sending…" : "Submit a request"}
          </Button>
        )}
        {note ? <p className="mt-3 text-sm text-muted">{note}</p> : null}
        <Button
          className="mt-4 w-full"
          type="button"
          variant="outline"
          onClick={() => void signOut("/login")}
        >
          Sign out
        </Button>
      </section>
    </main>
  );
}
