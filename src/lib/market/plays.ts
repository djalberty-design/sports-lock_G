import { formatBetUsd, formatChancePct, shortPick, marketInEnglish, oddsInEnglish, payoutOnStake, chanceInEnglish } from "../copy.ts";
import { formatPct, formatUsd, formatKickoff, matchupLine } from "../utils.ts";
import { BRAND } from "../brand.ts";
import {
  CHECK_LABELS,
  CHECK_ORDER,
  DEFAULTS,
  isCollegeSport,
} from "./universe.ts";
import type { CheckId } from "./universe.ts";
import {
  isSeed,
  isTiny,
  sizeLabel,
  unitDollars,
  americanToDecimal,
  product,
} from "./engine.ts";
import { shownCombinedChance } from "./calibrate.ts";
import type {
  CheckUsed,
  CrossCheck,
  DeskSnapshot,
  OptionStatus,
  Play,
  PlayBoard,
  ScanBundle,
  ScanRow,
  Verdict,
} from "./types.ts";

export type BuildPlaysInput = {
  bankroll: number;
  unitPct: number;
  halt: boolean;
  weeklyHalt: boolean;
  scan: ScanBundle;
  snapshot: DeskSnapshot;
  entertainmentBudgeted?: boolean;
  dfsReady?: boolean;
  ignoreRibbon?: boolean;
};

function waitingPlay(lane: Play["lane"], because: string): Play {
  return {
    lane,
    title: "Photograph today's board",
    action: "Take a picture of Hard Rock Bet Florida so we can name a ticket playing today.",
    because,
    symbol: "PHOTO",
    optionKind: "main",
    venue: BRAND.venueLive,
    conviction: "medium",
    liveFits: false,
    unitCount: 0,
  };
}

function decorateMain(opts: {
  lane: Play["lane"];
  row: ScanRow;
  stake: number;
  liveFits: boolean;
  because: string;
  action: string;
  conviction: Play["conviction"];
  symbol: string;
  optionKind: Play["optionKind"];
}): Play {
  const pick = shortPick(opts.row.selection, opts.row.marketType);
  const stake = Math.max(opts.stake, DEFAULTS.dustUsd);
  const kickoffEnglish = formatKickoff(opts.row.start);
  const matchupEnglish = matchupLine(opts.row.away, opts.row.home);
  return {
    lane: opts.lane,
    title: `${formatBetUsd(stake)} on ${pick}`,
    action: opts.action,
    because: opts.because,
    symbol: opts.symbol,
    optionKind: opts.optionKind,
    venue: BRAND.venueLive,
    conviction: opts.conviction,
    liveFits: opts.liveFits,
    unitCount: 1,
    details: `${opts.row.sport} · ${matchupEnglish} · ${kickoffEnglish}`,
    price: opts.row.price,
    fairProb: opts.row.fairProb,
    plainPick: pick,
    oddsEnglish: oddsInEnglish(opts.row.price),
    payoutEnglish: payoutOnStake(stake, opts.row.price),
    fairEnglish: chanceInEnglish(opts.row.fairProb),
    marketExplain: marketInEnglish(opts.row.marketType),
    home: opts.row.home,
    away: opts.row.away,
    start: opts.row.start,
    kickoffEnglish,
    matchupEnglish,
    sport: opts.row.sport,
    eventId: opts.row.eventId,
    ticketPct: opts.row.ticketPct,
    handlePct: opts.row.handlePct,
    tapeLean: opts.row.tapeLean,
    tapeNote: opts.row.tapeNote,
  };
}

function decorateParlay(opts: {
  lane: Play["lane"];
  spicy: NonNullable<ScanBundle["bestTwo"]>;
  stake: number;
  liveFits: boolean;
  becausePrefix?: string;
}): Play {
  const n = opts.spicy.legs.length;
  const decimalPayout = product(opts.spicy.legs.map((l) => americanToDecimal(l.price)));
  const shown = shownCombinedChance(opts.spicy.combinedFair, decimalPayout, n, Boolean(opts.spicy.sameGame));
  const fairPct = formatChancePct(shown) ?? `${Math.round(shown * 100)}%`;
  const names = opts.spicy.legs.map((l) => shortPick(l.selection, l.marketType)).join(" + ");
  const stake = Math.max(opts.stake, DEFAULTS.dustUsd);
  const legs = opts.spicy.legs.map((l) => ({
    selection: shortPick(l.selection, l.marketType),
    home: l.home,
    away: l.away,
    start: l.start,
    kickoffEnglish: formatKickoff(l.start),
    matchupEnglish: matchupLine(l.away, l.home),
    sport: l.sport,
  }));
  return {
    lane: opts.lane,
    title: opts.spicy.pricedAsEntertainment
      ? `${n}-game parlay — fun money`
      : `${n}-game parlay`,
    action: `Bet ${formatBetUsd(stake)} on ${n} games together at Hard Rock Bet. ${n === 2 ? "Both" : n === 3 ? "All three" : "All four"} must win.`,
    because: `${opts.becausePrefix ?? ""}${opts.spicy.reason} Combined true chance ${fairPct}. A parlay pays more because it is harder — this is not ${n} games you already won.`,
    symbol: n === 4 ? "4LEG" : n === 3 ? "3LEG" : "2LEG",
    optionKind: "parlay",
    venue: opts.spicy.researchOnly ? "Research only" : BRAND.venueLive,
    conviction: opts.spicy.combinedEv >= 0 ? "medium" : "low",
    liveFits: opts.liveFits,
    unitCount: 1,
    details: names,
    pricedAsEntertainment: opts.spicy.pricedAsEntertainment,
    combinedFair: opts.spicy.combinedFair,
    decimalPayout,
    fairEnglish: `Combined true chance ${fairPct} — that is the real ticket, not each game on its own.`,
    marketExplain: "A parlay is two, three, or four games on one ticket. Every game must win or the whole bet loses. Pays more because it is harder.",
    legs,
    kickoffEnglish: legs.map((l) => l.kickoffEnglish).filter(Boolean).join(" · "),
    matchupEnglish: legs.map((l) => l.matchupEnglish).filter(Boolean).join(" · "),
  };
}

function buildChecks(input: BuildPlaysInput, recommended: Play["lane"], bestMain: ScanRow | null): CrossCheck[] {
  const { bankroll, scan, snapshot } = input;
  const seed = isSeed(bankroll);
  const tiny = isTiny(bankroll);
  const unit = unitDollars(bankroll, input.unitPct);
  const publicHot = snapshot.publicSplits.find((s) => (s.ticketPct || s.publicPct) >= 70);
  const tapeSplit = snapshot.publicSplits.find((s) => s.ticketPct != null && s.handlePct != null && s.ticketPct !== s.handlePct) ?? publicHot;

  const sizeUsed: CheckUsed = seed || tiny ? "blocks" : "supports";
  const sizeFinding = seed
    ? `Bankroll is ${formatUsd(bankroll)}. A 1% bet cannot even clear $1. Size up to $100+ before placing a live ticket — we still name the three tickets.`
    : tiny
      ? `Small bankroll (${formatUsd(bankroll)}). Suggested bet ${formatBetUsd(unit)}. Keep parlays as research until you size up.`
      : `Ready size. Suggested bet ${formatBetUsd(unit)} (${(input.unitPct * 100).toFixed(0)}% of your money).`;

  const hasFair = Boolean(bestMain && bestMain.tag === "fair_or_better");
  let juiceUsed: CheckUsed = "noted";
  let juiceFinding = "No two-sided Hard Rock price to grade.";
  if (scan.missingBoard) {
    juiceUsed = "noted";
    juiceFinding = "Delayed odds are missing. Photograph a Hard Rock price so we can grade it.";
  } else if (hasFair && bestMain) {
    juiceUsed = "supports";
    juiceFinding = `Hard Rock ${shortPick(bestMain.selection, bestMain.marketType)} edge ${formatPct(bestMain.evPct, 1)} versus true odds. Fair or better.`;
  } else if (bestMain && bestMain.tag === "close_enough") {
    juiceUsed = "noted";
    juiceFinding = `Almost-fair one-game bet ${formatPct(bestMain.evPct, 1)} edge. Still the safest ticket — size it as fun money if the number is against you.`;
  } else if (bestMain) {
    juiceUsed = "noted";
    juiceFinding = `Best one-game on the board is ${shortPick(bestMain.selection, bestMain.marketType)} at a taxed price. We still name it instead of leaving the card blank.`;
  } else {
    juiceUsed = "blocks";
    juiceFinding = "No Hard Rock one-game bet to grade. Photograph a price.";
  }

  const illegal = scan.rows.find((r) => r.tag === "illegal_fl");
  const inPlayOnly = scan.rows.length > 0 && scan.rows.every((r) => r.tag === "in_play");
  const marketUsed: CheckUsed = illegal || inPlayOnly ? "blocks" : "noted";
  const marketFinding = illegal
    ? illegal.isProp && isCollegeSport(illegal.sport)
      ? "A college player bet is on the board — blocked as a Florida live card."
      : "A DraftKings / FanDuel sportsbook ticket was offered as live — we block it."
    : inPlayOnly
      ? "Every game has already started. We only cover bets placed before the game."
      : "Before-the-game winner, spread, or over/under is the only live sports bet we will recommend.";

  const clockFinding = snapshot.hours.preGameOpen
    ? `Before-the-game window. ${snapshot.hours.label}`
    : `Session note: ${snapshot.hours.label}`;

  const haltUsed: CheckUsed = "discarded";
  const haltFinding =
    "This site never places a bet, so there is no daily or weekly stop. Lock paper tickets whenever you want. You still decide at Hard Rock Bet.";

  const boardUsed: CheckUsed = tapeSplit ? "noted" : "noted";
  const boardFinding = tapeSplit
    ? `Bets ${tapeSplit.ticketPct || tapeSplit.publicPct}% · money ${tapeSplit.handlePct ?? tapeSplit.publicPct}% on ${tapeSplit.side.replace(/\s+ML\b/gi, " to win")}${tapeSplit.steam ? " · steam" : ""}. ${tapeSplit.note ?? "Tickets and dollars are a layer in the ensemble — we do not copy the crowd and we do not auto-fade it."}`
    : "No public ticket/handle split on this board yet. When it lands, bets % vs money % is a layer — never a copy-trade.";

  const collegeProp = scan.rows.find((r) => r.isProp && isCollegeSport(r.sport));
  const propsUsed: CheckUsed = collegeProp ? "blocks" : "discarded";
  const propsFinding = collegeProp
    ? "College player bets are not allowed on Hard Rock Bet. Blocked."
    : "Pro player bets are research only. They never become today's pick.";

  const newsFinding = snapshot.news[0]
    ? `Headline “${snapshot.news[0].title}” — ignored. Not a reason to bet.`
    : "Headlines and touts are ignored. This app does not copy a 'lock' thread.";

  const venueIllegal = scan.rows.find(
    (r) => r.venueNote === "dk_sportsbook" || r.venueNote === "fd_sportsbook",
  );
  const venueUsed: CheckUsed = venueIllegal ? "blocks" : "noted";
  const venueFinding = venueIllegal
    ? "DraftKings / FanDuel sportsbooks are not licensed in Florida. Hard Rock Bet is the live sportsbook. DraftKings Fantasy is a different app."
    : `Live sports go on ${BRAND.venueLive}. This site never places the bet. DraftKings Fantasy is the roster builder.`;

  const used: Record<CheckId, { used: CheckUsed; finding: string }> = {
    size: { used: sizeUsed, finding: sizeFinding },
    juice: { used: juiceUsed, finding: juiceFinding },
    market: { used: marketUsed, finding: marketFinding },
    clock: { used: "noted", finding: clockFinding },
    halt: { used: haltUsed, finding: haltFinding },
    board: { used: boardUsed, finding: boardFinding },
    props: { used: propsUsed, finding: propsFinding },
    news: { used: "discarded", finding: newsFinding },
    delay: {
      used: "blocks",
      finding: "Odds are delayed public numbers. Delay always blocks auto-betting. A quote is not the price you will get.",
    },
    venue: { used: venueUsed, finding: venueFinding },
    stack: {
      used: "supports",
      finding:
        "A $200 bankroll betting 3-game parlays is not a path to $1M on a human timetable. The one-game ticket is the grown-up play. Real long-term growth lives in saving and investing, not here.",
    },
  };

  return CHECK_ORDER.map((id) => ({
    id,
    label: CHECK_LABELS[id],
    used: used[id].used,
    finding: used[id].finding,
  }));
}

export function buildPlays(input: BuildPlaysInput): PlayBoard {
  const { bankroll, unitPct, scan, snapshot } = input;
  const seed = isSeed(bankroll);
  const tiny = isTiny(bankroll);
  const unit = unitDollars(bankroll, unitPct);
  const size = sizeLabel(bankroll);
  const missing = scan.missingBoard;
  const bestMain = scan.bestMain ?? scan.topSingles?.[0] ?? null;
  const two = (scan.bestTwo && scan.bestTwo.legs.length === 2 ? scan.bestTwo : null) ?? scan.topTwos?.[0] ?? null;
  const three = (scan.topThrees?.[0] ?? (scan.bestSpicy && scan.bestSpicy.legs.length >= 3 ? scan.bestSpicy : null)) ?? null;
  const flip = scan.bestFlip;
  const stake = Math.max(unit, DEFAULTS.dustUsd);
  const liveOk = !seed && unit >= DEFAULTS.dustUsd;

  const sizeNote = seed
    ? `Your ${formatUsd(bankroll)} is under the $100 floor, so don't place this live yet. The ticket itself is still real.`
    : tiny
      ? `Small bankroll (${formatUsd(bankroll)}). Suggested bet ${formatBetUsd(unit)}.`
      : `Bankroll looks ${size === "full" || size === "working" ? "ready" : size}.`;

  let safe: Play;
  if (missing && !bestMain) {
    safe = waitingPlay(
      "safe",
      "Delayed odds are missing. Photograph a Hard Rock price and we will name the one-game ticket playing today.",
    );
  } else if (bestMain) {
    const pick = shortPick(bestMain.selection, bestMain.marketType);
    safe = decorateMain({
      lane: "safe",
      row: bestMain,
      stake,
      liveFits: liveOk,
      symbol: "MAIN",
      optionKind: "main",
      conviction: bestMain.tag === "fair_or_better" ? "medium" : "low",
      action: `Bet ${formatBetUsd(stake)} on ${pick} at Hard Rock Bet. That's who wins / a spread / over-under — one game.`,
      because: `${sizeNote} Confirm the live price at Hard Rock Bet, then place it yourself.`,
    });
  } else {
    safe = waitingPlay("safe", "No game playing today on this delayed board. Photograph a Hard Rock price, or check Games for later this week.");
  }

  let middle: Play;
  if (two) {
    middle = decorateParlay({
      lane: "middle",
      spicy: two,
      stake,
      liveFits: liveOk && !tiny,
      becausePrefix: `${sizeNote} `,
    });
  } else if (bestMain) {
    const second = scan.rows.find(
      (r) =>
        r.eventId !== bestMain.eventId &&
        r.tag !== "illegal_fl" &&
        r.tag !== "in_play" &&
        !r.isProp,
    );
    if (second) {
      const pick = shortPick(second.selection, second.marketType);
      middle = decorateMain({
        lane: "middle",
        row: second,
        stake,
        liveFits: liveOk && !tiny,
        symbol: "MAIN",
        optionKind: "main",
        conviction: "low",
        action: `No 2-game parlay cleared the floor. Next one-game: ${formatBetUsd(stake)} on ${pick}.`,
        because: `${sizeNote} We still name a ticket instead of leaving this card blank.`,
      });
    } else {
      middle = { ...safe, lane: "middle", symbol: "MAIN" };
    }
  } else {
    middle = waitingPlay("middle", "Need two games playing today before we can name a parlay.");
  }

  let risky: Play;
  if (three) {
    risky = decorateParlay({
      lane: "risky",
      spicy: three,
      stake,
      liveFits: liveOk && !tiny,
      becausePrefix: `${sizeNote} Highest-chance 3-game parlay among games playing today. All three must hit. `,
    });
  } else if (flip) {
    const pick = shortPick(flip.selection, flip.marketType);
    risky = decorateMain({
      lane: "risky",
      row: flip,
      stake,
      liveFits: liveOk && !tiny,
      symbol: "FLIP",
      optionKind: "main",
      conviction: "low",
      action: `Bet ${formatBetUsd(stake)} on ${pick} at Hard Rock Bet. No 3-game parlay cleared — this is the ~50/50 that pays plus money.`,
      because: `${sizeNote} Confirm the live price at Hard Rock Bet.`,
    });
  } else if (scan.bestSpicy && scan.bestSpicy !== two) {
    risky = decorateParlay({
      lane: "risky",
      spicy: scan.bestSpicy,
      stake,
      liveFits: false,
      becausePrefix: `${sizeNote} Longer parlay as a last resort. `,
    });
  } else if (input.dfsReady) {
    risky = {
      lane: "risky",
      title: "Build a fantasy lineup",
      action: "Build one safer DraftKings classic lineup and one long-shot lineup. Not a Hard Rock Bet ticket.",
      because: "No 3-game parlay cleared. Fantasy is a separate app (DraftKings Fantasy).",
      symbol: "DFS",
      optionKind: "dfs_gpp",
      venue: BRAND.venueDfs,
      conviction: "low",
      liveFits: false,
      unitCount: 0,
      marketExplain: "Daily fantasy — you build a roster under a salary cap. Not a bet on one team.",
    };
  } else {
    risky = waitingPlay(
      "risky",
      "Need three games playing today before we can name a 3-game parlay. Photograph a Hard Rock board.",
    );
  }

  const recommended: Play["lane"] = "safe";
  const recPlay = safe;
  const checks = buildChecks(input, recommended, bestMain);

  const learnMore = [
    `Your money: ${formatUsd(bankroll)}. Suggested bet ${formatBetUsd(unit)} (no units — that dollar amount is the bet).`,
    bestMain
      ? `Safest ticket: ${shortPick(bestMain.selection, bestMain.marketType)}. ${oddsInEnglish(bestMain.price)} ${chanceInEnglish(bestMain.fairProb)}`
      : "Photograph a Hard Rock price to name the one-game ticket.",
    flip && flip.eventId
      ? `Toss-up still on the board: ${shortPick(flip.selection, flip.marketType)} — ${chanceInEnglish(flip.fairProb)} ${oddsInEnglish(flip.price)}`
      : "",
    "No auto-stop. This site never places a bet, so a down day does not lock you out of the paper log.",
    snapshot.sample
      ? "This board includes delayed research-sample numbers — not fills. Confirm any live number at Hard Rock Bet."
      : "Delayed public numbers. Confirm at Hard Rock Bet before acting.",
    "Moneyline (ML) means who wins the game. Plus money (+160) means the underdog — you get paid more than you bet. Photograph a DraftKings contest if you want a fantasy roster and a buy-in instead.",
    "Ignore the recommended badge if you want. The app will not nag.",
  ]
    .filter(Boolean)
    .join(" ");

  const verdict: Verdict = {
    doThis: recPlay.action,
    because: recPlay.because,
    venue: recPlay.venue,
    symbol: recPlay.symbol,
    lane: recommended,
    conviction: recPlay.conviction,
    checks,
    learnMore,
  };

  const singles = (scan.topSingles?.length ? scan.topSingles : bestMain ? [bestMain] : [])
    .slice(0, 3)
    .map((row, i) =>
      decorateMain({
        lane: "safe",
        row,
        stake,
        liveFits: liveOk,
        symbol: i === 0 ? "MAIN" : `S${i + 1}`,
        optionKind: "main",
        conviction: row.tag === "fair_or_better" ? "medium" : "low",
        action: `Bet ${formatBetUsd(stake)} on ${shortPick(row.selection, row.marketType)} at Hard Rock Bet. One game.`,
        because: `${sizeNote} Ranked by chance × payout. Confirm the live price at Hard Rock Bet.`,
      }),
    );

  const twoLegs = (scan.topTwos?.length ? scan.topTwos : two ? [two] : [])
    .slice(0, 3)
    .map((p) =>
      decorateParlay({
        lane: "middle",
        spicy: p,
        stake,
        liveFits: liveOk && !tiny,
        becausePrefix: `${sizeNote} `,
      }),
    );

  const threeLegs = (scan.topThrees?.length ? scan.topThrees : three ? [three] : [])
    .slice(0, 3)
    .map((p) =>
      decorateParlay({
        lane: "risky",
        spicy: p,
        stake,
        liveFits: liveOk && !tiny,
        becausePrefix: `${sizeNote} `,
      }),
    );

  return {
    safe,
    middle,
    risky,
    recommended,
    verdict,
    singles,
    twoLegs,
    threeLegs,
  };
}

export function scoreOptions(board: PlayBoard, input: BuildPlaysInput): OptionStatus[] {
  const seed = isSeed(input.bankroll);
  const tiny = isTiny(input.bankroll);
  const fair = Boolean(input.scan.bestMain && input.scan.bestMain.tag === "fair_or_better");
  const inPlayOnly = input.scan.rows.length > 0 && input.scan.rows.every((r) => r.tag === "in_play");
  const collegeProp = input.scan.rows.some((r) => r.isProp && isCollegeSport(r.sport));
  const parlay = input.scan.bestTwo ?? input.scan.bestSpicy;
  const unit = unitDollars(input.bankroll, input.unitPct);

  const sit: OptionStatus = {
    kind: "sit",
    status: "caution",
    note: "Sitting is allowed. The three cards still name real tickets so you always have a next step.",
  };
  const main: OptionStatus = {
    kind: "main",
    status: inPlayOnly ? "blocked" : board.recommended === "safe" && fair && !seed ? "go" : "caution",
    note: inPlayOnly
      ? "Games already started — dropped."
      : `One-game ticket at ${formatBetUsd(Math.max(unit, DEFAULTS.dustUsd))}. Moneyline = who wins.`,
  };
  const parlayStatus: OptionStatus = {
    kind: "parlay",
    status: tiny || seed ? "seed" : parlay ? "caution" : "blocked",
    note: tiny || seed
      ? "Research only at this size."
      : parlay
        ? "This is the balanced card — two games, both must hit."
        : "No 2-game parlay cleared the chance floor.",
  };
  const prop: OptionStatus = {
    kind: "prop",
    status: collegeProp ? "blocked" : "lagged",
    note: collegeProp
      ? "College player bets blocked on Hard Rock Bet."
      : "Pro player bets are research. Never today's pick.",
  };
  const dfsCash: OptionStatus = {
    kind: "dfs_cash",
    status: !input.dfsReady ? "caution" : tiny ? "seed" : "go",
    note: !input.dfsReady
      ? "Photograph a DraftKings player list and a contest buy-in."
      : tiny
        ? "Do not confuse a small sports bankroll with a fantasy entry fee."
        : "Confirmed slate — one safer lineup.",
  };
  const dfsGpp: OptionStatus = {
    kind: "dfs_gpp",
    status: !input.dfsReady ? "caution" : tiny ? "seed" : "caution",
    note: "Never the sports pick. DraftKings Fantasy, not Sportsbook.",
  };
  const predict: OptionStatus = {
    kind: "predict",
    status: "lagged",
    note: "Event contracts on a different platform. Catalog + Learn only. Ignored as today's pick.",
  };
  const path: OptionStatus = {
    kind: "path",
    status: "go",
    note: "Long-term math versus the goal you typed. Not a forecast.",
  };
  return [sit, main, parlayStatus, prop, dfsCash, dfsGpp, predict, path];
}

export function recommendedWhy(board: PlayBoard): string {
  return board.verdict.because;
}

export type { CheckUsed };
