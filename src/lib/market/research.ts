/**
 * ESPN research + ticket matching. Live looks, not generated cards.
 */
import { americanToImplied, americanToDecimal, product, twoWayNoVig, valueScore } from "./engine.ts";
import { isTodayEt } from "../utils.ts";
import { buildChance, parseEra, parseWhip, type ChanceInput, type ChanceReport, type FormGame } from "./chance.ts";
import { buildPropChance, parsePropSelection, propContextFromBrief, teamWinForPlayer, type PropReport } from "./props.ts";
import { analyzeScores, ewmaMean, formatScoreLine, mergeForm, parseEspnScore, type FormTape, type ScoreGame } from "./form.ts";
import { fetchTeamLooks, type TeamLooks } from "./looks.ts";
import { sgpHaircut } from "./parlays.ts";
import { shownCombinedChance } from "./calibrate.ts";
import { formatChancePct } from "../copy.ts";
import type { DeskSnapshot, EventBrief, MarketType, ParsedTicket, PredictQuote, QuoteLine, ScanRow } from "./types.ts";
