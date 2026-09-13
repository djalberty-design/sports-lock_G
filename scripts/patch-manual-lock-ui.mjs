/** Swap Hard Rock photo ingest for manual confirm. Idempotent. */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

function patch(rel, pairs) {
  const dest = join(ROOT, rel);
  let text = readFileSync(dest, "utf8");
  if (text.includes('from "./hard-rock-confirm"') && text.includes("<HardRockConfirm")) {
    console.log(`patch-manual-lock-ui ${rel}: already wired`);
    return;
  }
  for (const [old, neu] of pairs) {
    if (!text.includes(old)) {
      console.error(`patch-manual-lock-ui ${rel}: missing snippet`);
      process.exit(1);
    }
    text = text.replace(old, neu);
  }
  writeFileSync(dest, text);
  console.log(`patch-manual-lock-ui ${rel}: wired`);
}

patch("src/components/app/ticket-page.tsx", [
  ['import { ScreenshotIngest, PhotoFirstNote } from "./screenshot-ingest";', 'import { PhotoFirstNote } from "./screenshot-ingest";\nimport { HardRockConfirm } from "./hard-rock-confirm";'],
  [
    "<ScreenshotIngest kind=\"ticket\" heading={`Upload a screenshot of ${pick.selection}`} />",
    "<HardRockConfirm pick={pick} heading={`Confirm ${pick.selection} at Hard Rock`} />",
  ],
  [
    '<ScreenshotIngest kind="ticket" heading="Photograph the Hard Rock Bet Florida slip to lock this price" />',
    '<HardRockConfirm pick={pick} heading="Confirm this parlay at Hard Rock" />',
  ],
]);

patch("src/components/app/board-page.tsx", [
  ['import { ScreenshotIngest, PhotoFirstNote } from "./screenshot-ingest";', 'import { PhotoFirstNote } from "./screenshot-ingest";\nimport { HardRockConfirm } from "./hard-rock-confirm";'],
  [
    '<ScreenshotIngest heading="Upload a screenshot of a parlay or a single ticket" />',
    '<HardRockConfirm heading="Enter a Hard Rock single or add legs for a parlay" />',
  ],
]);

patch("src/components/app/parlay-page.tsx", [
  ['import { ScreenshotIngest, PhotoFirstNote } from "./screenshot-ingest";', 'import { PhotoFirstNote } from "./screenshot-ingest";\nimport { HardRockConfirm } from "./hard-rock-confirm";'],
  [
    '<ScreenshotIngest kind="ticket" heading="Upload a screenshot of the parlay you\'re considering" />',
    '<HardRockConfirm heading="Enter the parlay Hard Rock is showing, one leg at a time" />',
  ],
]);

patch("src/components/app/desk-page.tsx", [
  ['import { ScreenshotIngest, PhotoFirstNote } from "./screenshot-ingest";', 'import { PhotoFirstNote } from "./screenshot-ingest";\nimport { HardRockConfirm } from "./hard-rock-confirm";'],
  [
    '<ScreenshotIngest kind="ticket" heading="Photograph a Hard Rock ticket" />',
    '<HardRockConfirm heading="Enter a Hard Rock ticket by hand" />',
  ],
  [
    '<ScreenshotIngest kind="ticket" heading="Photograph another Hard Rock ticket" embedded />',
    '<HardRockConfirm embedded heading="Enter another Hard Rock ticket" />',
  ],
]);

patch("src/components/app/game-page.tsx", [
  ['import { ScreenshotIngest } from "./screenshot-ingest";', 'import { HardRockConfirm } from "./hard-rock-confirm";'],
]);

const game = join(ROOT, "src/components/app/game-page.tsx");
let g = readFileSync(game, "utf8");
if (!g.includes("<HardRockConfirm")) {
  if (!g.includes("Upload a screenshot of this same-game parlay")) {
    console.error("patch-manual-lock-ui game-page: body snippet missing");
    process.exit(1);
  }
  writeFileSync(game, g.replace(
    /<ScreenshotIngest[\s\S]*?same-game parlay"\s*}\s*\/>/,
    `<HardRockConfirm
          row={liveWager ?? undefined}
          heading={
            liveWager
              ? \`Confirm \${shortPick(liveWager.selection, liveWager.marketType)} at Hard Rock\`
              : "Confirm this same-game parlay at Hard Rock"
          }
        />`,
  ));
  console.log("patch-manual-lock-ui game-page: wired body");
}

const cta = join(ROOT, "src/components/app/photo-wager-cta.tsx");
let c = readFileSync(cta, "utf8");
if (!c.includes("HardRockConfirm")) {
  writeFileSync(
    cta,
    `import { HardRockConfirm } from "./hard-rock-confirm";\n\nexport function PhotoWagerCta({ what }: { what: string }) {\n  return (\n    <details className="mt-4 rounded-md bg-wash px-4 py-3">\n      <summary className="cursor-pointer text-sm font-medium text-ink">\n        Don’t see your {what}? Enter the Hard Rock number by hand.\n      </summary>\n      <p className="mt-2 text-xs text-muted">\n        Photo read is off. Type the live Hard Rock price and save it to Log. This site never places the bet.\n      </p>\n      <div className="mt-3">\n        <HardRockConfirm embedded heading="Enter the Hard Rock ticket by hand" />\n      </div>\n    </details>\n  );\n}\n`,
  );
  console.log("patch-manual-lock-ui photo-wager-cta: wired");
} else {
  console.log("patch-manual-lock-ui photo-wager-cta: already wired");
}
