// Visual QA: node scripts/qa-shots.mjs [baseUrl] [route,...] [width,...]
// Saves full-page and hero-sequence screenshots to ./qa-output and prints console errors.
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3100";
const routes = (process.argv[3] ?? "/").split(",");
const widths = (process.argv[4] ?? "1440").split(",").map(Number);
const heights = { 1440: 900, 1280: 720, 1024: 768, 768: 1024, 390: 844, 360: 740 };
const reduced = process.env.REDUCED === "1";
const fullPage = process.env.FULL !== "0";
const heroSteps = process.env.HERO === "1";

await mkdir("qa-output", { recursive: true });
const browser = await chromium.launch({
  channel: process.env.PW_CHANNEL ?? "chrome",
  args: process.env.NO_WEBGL === "1" ? ["--disable-webgl", "--disable-3d-apis"] : [],
});
let problems = 0;

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: heights[width] ?? 900 },
    deviceScaleFactor: 1,
    reducedMotion: reduced ? "reduce" : "no-preference",
    hasTouch: width < 768,
  });
  for (const route of routes) {
    const page = await context.newPage();
    const errors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" || msg.type() === "warning") errors.push(`${msg.type()}: ${msg.text()}`);
    });
    page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(3200);
    const name = `${route.replace(/[/?=&]/g, "_") || "_home"}-${width}${reduced ? "-reduced" : ""}`;
    await page.screenshot({ path: `qa-output/${name}-top.png` });

    if (heroSteps) {
      const vh = heights[width] ?? 900;
      for (const [i, f] of [0.35, 0.8, 1.15, 1.45].entries()) {
        await page.evaluate((y) => window.scrollTo(0, y), Math.round(vh * f));
        await page.waitForTimeout(1600);
        await page.screenshot({ path: `qa-output/${name}-hero${i + 1}.png` });
      }
      await page.evaluate(() => window.scrollTo(0, 0));
    }

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (process.env.SECTIONS === "1") {
      const sections = await page.$$("main > section, main > article > section, main > div > section, footer");
      for (const [i, el] of sections.entries()) {
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1100);
        const box = await el.boundingBox();
        if (box && box.height > 0) {
          await el.screenshot({ path: `qa-output/${name}-s${String(i).padStart(2, "0")}.png` });
        }
      }
    }
    if (fullPage) {
      // Scroll through to trigger in-view reveals before the full-page capture.
      const total = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < total; y += 500) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(90);
      }
      await page.waitForTimeout(900);
      await page.screenshot({ path: `qa-output/${name}-full.png`, fullPage: true });
    }
    const filtered = errors.filter((e) => !e.includes("Download the React DevTools"));
    if (overflow > 0 || filtered.length) problems++;
    console.log(`${route} @${width}: overflow=${overflow}px, console=${filtered.length}`);
    filtered.slice(0, 12).forEach((e) => console.log("   ", e.slice(0, 400)));
    await page.close();
  }
  await context.close();
}
await browser.close();
process.exit(problems ? 1 : 0);
