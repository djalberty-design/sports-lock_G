import { Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/brand";
import { DfsDesk } from "./dfs-desk";

export function SlatePage() {
  return (
    <div className="space-y-6">
      <header className="max-w-2xl">
        <p className="text-sm text-gold">DraftKings Fantasy · not a Florida sportsbook fill</p>
        <h1 className="font-display mt-2 text-3xl text-ink md:text-5xl">Fantasy</h1>
        <p className="mt-3 text-base text-ink/80">
          Salary-cap roster on DraftKings Fantasy. 18+. Not Hard Rock Bet. Not DraftKings or FanDuel sportsbook tickets.
          Photograph the player list and the contest lobby. We name a Safer cash lineup, a High-Ceiling tournament stack, and a
          Showdown captain. We never submit it.
        </p>
      </header>
      <DfsDesk />
      <p className="text-sm text-muted">
        Use AI Picks, Games, Combos, Live, and Log for Hard Rock Florida research. {BRAND.helpline}. This site never
        places a bet. 18+ Florida DFS.
      </p>
      <Link
        to="/today"
        className="inline-flex min-h-12 items-center justify-center rounded-md bg-gold px-5 text-base font-medium text-navy-deep"
      >
        Open AI Picks
      </Link>
    </div>
  );
}
