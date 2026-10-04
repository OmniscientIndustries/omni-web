import { defineConfig, devices } from "@playwright/test";

/**
 * Runs against PLAYWRIGHT_BASE_URL when set (e.g. a running dev server),
 * otherwise builds nothing and starts the production server on :3100 —
 * run `npm run build` first.
 */
const externalBase = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = externalBase ?? "http://localhost:3100";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL,
    channel: process.env.PW_CHANNEL ?? "chrome",
    // The hero animates continuously; recording a screencast of it would swamp parallel workers.
    trace: { mode: "retain-on-failure", screenshots: false, snapshots: true },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } } },
  ],
  webServer: externalBase
    ? undefined
    : { command: "npm run start -- -p 3100", url: baseURL, reuseExistingServer: true, timeout: 60_000 },
});
