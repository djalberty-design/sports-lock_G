import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { DESK_VERSION } from "@/lib/market/rules";
import { useDeskStore, selectUnit } from "@/lib/desk-store";
import { formatBetUsd } from "@/lib/copy";
import { Input } from "@/components/ui/input";
import type { DeskMood } from "@/lib/market/picks";
import { HOW_IT_WORKS, MORE_LINKS, WORDS_WE_USE } from "@/lib/plain-words";
import { BankrollBar } from "./bankroll-bar";
import { useAccess } from "@/lib/use-access";

const MOODS: { id: DeskMood; label: string }[] = [
  { id: "safe", label: "Safest" },
  { id: "value", label: "Best value" },
  { id: "pay", label: "Pays more" },
];

export function MorePage() {
  const hash = useRouterState({ select: (s) => s.location.hash });
  const deskMood = useDeskStore((s) => s.deskMood);
  const setDeskMood = useDeskStore((s) => s.setDeskMood);
  const unitPct = useDeskStore((s) => s.unitPct);
  const setUnitPct = useDeskStore((s) => s.setUnitPct);
  const hideCollege = useDeskStore((s) => s.hideCollege);
  const setHideCollege = useDeskStore((s) => s.setHideCollege);
  const hideLive = useDeskStore((s) => s.hideLive);
  const setHideLive = useDeskStore((s) => s.setHideLive);
  const liveBankroll = useDeskStore((s) => s.liveBankroll);
  const unit = useDeskStore(selectUnit);
  const { isAdmin } = useAccess();

  useEffect(() => {
    const id = String(hash ?? "").replace(/^#/, "");
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  return (
    <div className="space-y-8">
      <header className="max-w-2xl">
        <p className="text-sm text-gold">How this site works</p>
        <h1 className="font-display mt-1 text-3xl text-ink md:text-4xl">More</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/80">
          Set money. Pick a ticket. Photograph Hard Rock. Mark it on Log. This site never places a bet.
        </p>
      </header>

      <nav className="paper-card p-5">
        <p className="stamp text-gold">On this page</p>
        <ul className="mt-3 space-y-1">
          {MORE_LINKS.filter((item) => item.to !== "/admin" || isAdmin).map((item) => (
            <li key={item.label}>
              <Link
                to={item.to}
                hash={item.hash || undefined}
                className="flex min-h-11 items-center justify-between gap-3 rounded-md px-1 py-1 hover:bg-wash"
              >
                <span>
                  <span className="block text-sm font-medium text-ink">{item.label}</span>
                  <span className="block text-xs text-muted">{item.note}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section id="how" className="paper-card scroll-mt-24 p-5">
        <p className="stamp text-gold">Four steps</p>
        <h2 className="font-display mt-2 text-xl text-ink">How this site works</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {HOW_IT_WORKS.map((s) => (
            <li key={s.n} className="rounded-md bg-wash px-3 py-3">
              <p className="stamp text-gold">{s.n}</p>
              <p className="mt-1 font-medium text-ink">{s.title}</p>
              <p className="mt-1 text-sm text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="words" className="paper-card scroll-mt-24 p-5">
        <p className="stamp text-gold">One line each</p>
        <h2 className="font-display mt-2 text-xl text-ink">Words we use</h2>
        <dl className="mt-4 space-y-3">
          {WORDS_WE_USE.map((w) => (
            <div key={w.id}>
              <dt className="text-sm font-medium text-gold">{w.word}</dt>
              <dd className="text-sm text-ink/90">{w.line}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="money" className="scroll-mt-24 space-y-4">
        <BankrollBar />
        <section className="paper-card p-5">
          <p className="stamp text-gold">Settings</p>
          <h2 className="font-display mt-2 text-xl text-ink">What this device remembers</h2>
          <p className="mt-2 text-sm text-muted">Saved here. Same board still ranks the same.</p>

          <fieldset className="mt-4">
            <legend className="text-xs uppercase tracking-[0.14em] text-muted">Default mood</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setDeskMood(m.id)}
                  className={
                    deskMood === m.id
                      ? "min-h-11 rounded-md bg-gold px-4 text-sm font-medium text-navy-deep"
                      : "min-h-11 rounded-md bg-wash px-4 text-sm font-medium text-muted hover:text-ink"
                  }
                >
                  {m.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">Safest is the default. Highest chance that still pays.</p>
          </fieldset>

          <label className="mt-5 block text-xs uppercase tracking-[0.14em] text-muted">
            Percent of my money for one ticket
            <span className="mt-1 flex items-center gap-3">
              <Input
                type="number"
                min={0.1}
                max={10}
                step={0.1}
                value={Math.round(unitPct * 1000) / 10}
                onChange={(e) => setUnitPct(Number(e.target.value) / 100)}
                className="max-w-[8rem]"
              />
              <span className="text-sm normal-case tracking-normal text-ink">
                {formatBetUsd(unit)} on {formatBetUsd(liveBankroll)}
              </span>
            </span>
          </label>

          <label className="mt-5 flex min-h-11 items-center gap-3 text-sm text-ink">
            <input
              type="checkbox"
              checked={hideCollege}
              onChange={(e) => setHideCollege(e.target.checked)}
              className="size-4 accent-[var(--color-gold)]"
            />
            Hide college (NCAAF / NCAAB). College player bets stay blocked either way.
          </label>
          <label className="mt-2 flex min-h-11 items-center gap-3 text-sm text-ink">
            <input
              type="checkbox"
              checked={hideLive}
              onChange={(e) => setHideLive(e.target.checked)}
              className="size-4 accent-[var(--color-gold)]"
            />
            Hide live tickets. Live can never be The Call.
          </label>
        </section>
      </section>

      <p className="text-xs text-muted">Desk {DESK_VERSION}</p>
    </div>
  );
}
