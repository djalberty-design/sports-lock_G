/** Now/pin/ticket use the live Call gate. Idempotent. */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

function insertImport(text, line) {
  if (text.includes(line)) return text;
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
  if (last < 0) throw new Error("no imports");
  lines.splice(last + 1, 0, line);
  return lines.join("\n");
}

function patchNow() {
  const dest = join(ROOT, "src/components/app/now-page.tsx");
  let text = readFileSync(dest, "utf8");
  if (text.includes("pinnedRaw") && text.includes("isLiveDeskPick")) {
    console.log("patch-call-ui now: already wired");
    return;
  }
  text = insertImport(text, 'import { isLiveDeskPick } from "@/lib/market/call-gate";');
  text = text.replace(
    "  const isLive = (p: DeskPick) => Boolean(p.row?.inPlay);",
    "  const isLive = (p: DeskPick) => isLiveDeskPick(p);",
  );
  text = text.replace(
    "  const pinned = pinId ? singles.find((p) => p.id === pinId) ?? popular.find((p) => p.id === pinId) : null;\n  const hero = pinned ?? gated;",
    "  const pinnedRaw = pinId ? singles.find((p) => p.id === pinId) ?? popular.find((p) => p.id === pinId) : null;\n  const pinned = pinnedRaw && !isLive(pinnedRaw) ? pinnedRaw : null;\n  const hero = pinned ?? gated;",
  );
  writeFileSync(dest, text);
  console.log("patch-call-ui now: wired");
}

function patchCard() {
  const dest = join(ROOT, "src/components/app/pick-card.tsx");
  let text = readFileSync(dest, "utf8");
  if (text.includes("Live — never The Call") && text.includes("isLiveDeskPick")) {
    console.log("patch-call-ui card: already wired");
    return;
  }
  text = insertImport(text, 'import { isLiveDeskPick } from "@/lib/market/call-gate";');
  text = text.replace(
    `{pinned ? "Unpin The Call" : "Pin as The Call"}`,
    `{isLiveDeskPick(pick) ? "Live — never The Call" : pinned ? "Unpin The Call" : "Pin as The Call"}`,
  );
  text = text.replace(
    `          <button\n            type="button"\n            onClick={() => {\n              pinPick(pick.id);`,
    `          <button\n            type="button"\n            disabled={isLiveDeskPick(pick)}\n            onClick={() => {\n              if (isLiveDeskPick(pick)) return;\n              pinPick(pick.id);`,
  );
  writeFileSync(dest, text);
  console.log("patch-call-ui card: wired");
}

function patchTicket() {
  const dest = join(ROOT, "src/components/app/ticket-page.tsx");
  let text = readFileSync(dest, "utf8");
  if (text.includes("isLiveDeskPick(pick)") && text.includes("@/lib/market/call-gate")) {
    console.log("patch-call-ui ticket: already wired");
    return;
  }
  text = insertImport(text, 'import { isLiveDeskPick } from "@/lib/market/call-gate";');
  text = text.replace(
    '  if (pick.row?.inPlay) return "Live tickets cannot be The Call. They rank on Live with a quality haircut.";',
    '  if (isLiveDeskPick(pick)) return "Live tickets cannot be The Call. They rank on Live with a quality haircut.";',
  );
  writeFileSync(dest, text);
  console.log("patch-call-ui ticket: wired");
}

patchNow();
patchCard();
patchTicket();
