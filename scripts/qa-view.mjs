// Viewport capture around a selector: node scripts/qa-view.mjs url selector width out [hoverSelector]
import { chromium } from "@playwright/test";

const [url, selector, width = "1440", out = "qa-output/view.png", hover] = process.argv.slice(2);
const heights = { 1440: 900, 1280: 720, 1024: 768, 768: 1024, 390: 844, 360: 740 };
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({
  viewport: { width: Number(width), height: heights[width] ?? 900 },
  reducedMotion: process.env.REDUCED === "1" ? "reduce" : "no-preference",
});
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
if (selector && selector !== "-") {
  await page.locator(selector).first().evaluate((el, block) => el.scrollIntoView({ block }), process.env.BLOCK ?? "start");
  if (process.env.OFFSET) await page.evaluate((o) => window.scrollBy(0, o), Number(process.env.OFFSET));
  await page.waitForTimeout(1400);
}
if (hover) {
  await page.locator(hover).first().hover();
  await page.waitForTimeout(Number(process.env.HOVER_WAIT ?? 2200));
}
await page.screenshot({ path: out });
await browser.close();
