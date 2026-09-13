/** Wire tape layers + thinner open into buildChance. Idempotent. */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const dest = join(ROOT, "src/lib/market/chance.ts");
let text = readFileSync(dest, "utf8");
if (text.includes('from "./market-opponent.ts"') && text.includes('id: "tickets"')) {
  console.log("patch-market-opponent: already wired");
  process.exit(0);
}

if (!text.includes('from "./market-opponent.ts"')) {
  const lines = text.split("\n");
  let last = -1;
  let pending = false;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (/^import\s/.test(l)) {
      pending = !/;/.test(l);
      last = i;
    } else if (pending) {
      last = i;
      if (/;/.test(l)) pending = false;
    }
  }
  if (last < 0) throw new Error("patch-market-opponent: no imports");
  lines.splice(last + 1, 0, 'import { openMoveNote, openPrecision, tapeLayers, thinClose } from "./market-opponent.ts";');
  text = lines.join("\n");
}

const oldMarket = `  if (input.oddsHome != null && Number.isFinite(input.oddsHome)) {
    pushLayer(layers, {
      id: "market",
      label: "Sportsbook no-vig (close)",
      home: input.oddsHome,
      precision: marketPrecision(hoursToStart(input.start)),
      family: "market",
      note: "Two-way price with the house cut stripped. Real money, delayed.",
    });
  } else {
    pushEmpty(layers, "market", "Sportsbook no-vig (close)", "Looked up the live two-way close. Empty look.");
  }`;

const newMarket = `  if (input.oddsHome != null && Number.isFinite(input.oddsHome) && !thinClose(input.oddsHome)) {
    pushLayer(layers, {
      id: "market",
      label: "Sportsbook no-vig (close)",
      home: input.oddsHome,
      precision: marketPrecision(hoursToStart(input.start)),
      family: "market",
      note: "Two-way price with the house cut stripped. Real money, delayed. The close is the opponent.",
    });
  } else {
    pushEmpty(layers, "market", "Sportsbook no-vig (close)", "Looked up the live two-way close. Empty or too thin to be a close.");
  }`;

if (text.includes(oldMarket)) text = text.replace(oldMarket, newMarket);

const oldOpen = `  if (input.openHome != null && Number.isFinite(input.openHome) && (input.oddsHome == null || Math.abs(input.openHome - input.oddsHome) > 0.012)) {
    const moved = input.oddsHome != null ? input.oddsHome - input.openHome : 0;
    pushLayer(layers, {
      id: "open",
      label: "Opening line",
      home: input.openHome,
      precision: 5.5,
      family: "market",
      note: moved > 0.008 ? \`Close moved toward \${input.home}.\` : \`Close moved away from \${input.home}.\`,
    });
  }`;

const newOpen = `  if (input.openHome != null && Number.isFinite(input.openHome) && (input.oddsHome == null || Math.abs(input.openHome - input.oddsHome) > 0.012)) {
    pushLayer(layers, {
      id: "open",
      label: "Opening line",
      home: input.openHome,
      precision: openPrecision(input.oddsHome != null),
      family: "market",
      note: openMoveNote(input.openHome, input.oddsHome, input.home),
    });
  }`;

if (text.includes(oldOpen)) text = text.replace(oldOpen, newOpen);

if (!text.includes('id: "tickets"')) {
  const needle = `  if (input.homeSpread != null && Number.isFinite(input.homeSpread) && Math.abs(input.homeSpread) > 0.05) {`;
  if (!text.includes(needle)) throw new Error("patch-market-opponent: tape insert point missing");
  const block = `  for (const layer of tapeLayers({
    home: input.home,
    oddsHome: input.oddsHome,
    openHome: input.openHome,
    ticketHome: input.ticketHome,
    handleHome: input.handleHome,
    steam: input.steam,
  })) {
    if (layer.empty) pushEmpty(layers, layer.id, layer.label, layer.note);
    else pushLayer(layers, layer);
  }

`;
  text = text.replace(needle, block + needle);
}

writeFileSync(dest, text);
console.log("patch-market-opponent: wired");
