import { chromium } from "playwright";

const BASE = "http://127.0.0.1:8080";

async function main() {
  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(35000);
  const out = [];
  const t0 = Date.now();

  await page.goto(`${BASE}/today`, { waitUntil: "domcontentloaded" });
  out.push(`today first paint ${Date.now() - t0}ms`);

  const clickT0 = Date.now();
  await page.getByRole("button", { name: /more/i }).first().click();
  await page.waitForTimeout(120);
  await page.keyboard.press("Escape");
  out.push(`more menu click ${Date.now() - clickT0}ms`);

  await page.waitForFunction(() => {
    const t = (document.body?.innerText || "").toLowerCase();
    return t.includes("high probability") || t.includes("no top pick") || t.includes("live board missing");
  });
  out.push(`ranked wait ${Date.now() - t0}ms`);

  const text = (await page.locator("main").innerText()).toLowerCase();
  out.push(`has top pick ${text.includes("top pick")}`);
  out.push(`has the call ${text.includes("the call")}`);
  out.push(`has safest ${text.includes("safest")}`);
  out.push(`has best value ${text.includes("best value")}`);
  out.push(`has 65% floor ${text.includes("65%")}`);
  out.push(`safest blurb ${text.includes("three highest-probability")}`);

  await page.goto(`${BASE}/admin`, { waitUntil: "domcontentloaded" });
  const email = page.getByTestId("admin-email");
  await email.waitFor({ state: "visible" });
  await page.waitForFunction(() => {
    const btn = document.querySelector('[data-testid="admin-unlock"]');
    return btn instanceof HTMLButtonElement && !btn.disabled;
  });
  await email.fill("djalberty@gmail.com");
  await email.press("Enter");
  await page.waitForFunction(() => {
    const t = document.body?.innerText || "";
    return t.includes("Admin unlocked") || t.includes("Desk health") || t.includes("Last pass");
  });
  const adminText = await page.locator("main").innerText();
  out.push(`admin unlocked ${/Admin unlocked|Desk health|Last pass/.test(adminText)}`);
  out.push(`admin pin ${adminText.includes("Pinned ticket") || adminText.includes("Pin Top Pick")}`);
  out.push(`admin hide ${adminText.includes("Hidden")}`);
  out.push(`admin ledger ${adminText.includes("Download my bets JSON")}`);

  await page.goto(`${BASE}/desk`, { waitUntil: "domcontentloaded" });
  const logText = await page.locator("main").innerText();
  out.push(`log download ${logText.includes("Download my bets JSON")}`);

  await page.goto(`${BASE}/today`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => {
    const t = (document.body?.innerText || "").toLowerCase();
    return t.includes("confirm with hard rock") || t.includes("high probability");
  });
  const today2 = await page.locator("main").innerText();
  out.push(`admin hide btn ${today2.includes("Hide")}`);
  out.push(`admin pin btn ${today2.includes("Pin as Top Pick") || today2.includes("Unpin Top Pick")}`);

  console.log(out.join("\n"));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
