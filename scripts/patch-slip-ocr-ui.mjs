/** Wire on-device OCR fallback into screenshot-ingest. Idempotent. */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const dest = join(ROOT, "src/components/app/screenshot-ingest.tsx");
let text = readFileSync(dest, "utf8");
if (text.includes("readSlipOnDevice")) {
  console.log("patch-slip-ocr-ui: already wired");
  process.exit(0);
}
if (!text.includes('from "@/lib/market/slip-ocr-browser"')) {
  text = text.replace(
    'import { compressScreenshot, dataUrlToBytes } from "@/lib/screenshot";\n',
    'import { compressScreenshot, dataUrlToBytes } from "@/lib/screenshot";\nimport { readSlipOnDevice } from "@/lib/market/slip-ocr-browser";\n',
  );
}
const old = `  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setLocked(null);
    setLockError(null);
    try {
      let b64: string;
      let mime = file.type || "image/jpeg";
      try {
        const dataUrl = await compressScreenshot(file);
        setPreview(dataUrl);
        const conv = dataUrlToBytes(dataUrl);
        b64 = conv.b64;
        mime = conv.mime || "image/jpeg";
      } catch {
        const url = URL.createObjectURL(file);
        setPreview(url);
        const buf = await file.arrayBuffer();
        b64 = bytesToB64(new Uint8Array(buf));
      }
      const res = await parseTicketImage({ data: { image: b64, mime, kind } });
      if (!res.ok) {
        setNote(res.error);
        setEditFields(true);
        return;
      }`;
const neu = `  function applyTicketFields(fields: ParsedTicket[], note: string) {
    setMode("ticket");
    const first = fields[0];
    if (fields.length > 1) {
      setLegs(fields.map((f) => ({ ...f, confirmed: false })));
      setDraft(EMPTY);
      setEditFields(true);
      setNote(note || \`\${fields.length} games on this slip. Fix any field, then confirm the live price.\`);
      return;
    }
    if (first) {
      setLegs([]);
      setDraft({ ...first, confirmed: false });
      setEditFields(true);
      setNote(note || "Check the line and the side. Fix anything the photo missed, then save it to Log.");
      return;
    }
    setEditFields(true);
    setNote(note);
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setLocked(null);
    setLockError(null);
    try {
      let b64: string;
      let mime = file.type || "image/jpeg";
      let localImage: string | Blob = file;
      try {
        const dataUrl = await compressScreenshot(file);
        setPreview(dataUrl);
        const conv = dataUrlToBytes(dataUrl);
        b64 = conv.b64;
        mime = conv.mime || "image/jpeg";
        localImage = dataUrl;
      } catch {
        const url = URL.createObjectURL(file);
        setPreview(url);
        const buf = await file.arrayBuffer();
        b64 = bytesToB64(new Uint8Array(buf));
        localImage = file;
      }
      const res = await parseTicketImage({ data: { image: b64, mime, kind } });
      if (res.ok && res.kind === "slate") {
        setMode("slate");
        setSlateTable(res.table);
        setNote(res.note);
        return;
      }
      if (res.ok && res.kind === "contest") {
        setMode("contest");
        setLocalContests(res.contests);
        setNote(res.note);
        return;
      }
      if (res.ok && res.kind === "ticket" && res.fields.length) {
        applyTicketFields(res.fields, res.note);
        return;
      }
      try {
        const local = await readSlipOnDevice(localImage);
        if (local.fields.length) {
          applyTicketFields(local.fields, local.note);
          return;
        }
        setNote(local.note);
      } catch {
        setNote("Could not read the photo on this phone. Type the slip, then lock.");
      }
      setEditFields(true);
      return;
      if (!res.ok) {
        setNote(res.error);
        setEditFields(true);
        return;
      }`;
if (!text.includes(old.split("\n")[0])) {
  console.error("patch-slip-ocr-ui: onFile block not found");
  process.exit(1);
}
if (!text.includes(old)) {
  console.error("patch-slip-ocr-ui: exact onFile start not found");
  process.exit(1);
}
writeFileSync(dest, text.replace(old, neu));
console.log("patch-slip-ocr-ui: wired");
