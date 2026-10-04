import { expect, test } from "@playwright/test";

const isMobile = (name: string) => name === "mobile";

test.describe("homepage", () => {
  test("sections appear in the specified order", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Intelligence for the physical world.");
    const order = await page.evaluate(() =>
      ["partners-label", "industries-title", "news-title"].map((id) => document.getElementById(id)?.getBoundingClientRect().top ?? -1),
    );
    expect(order.every((v) => v > 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    await expect(page.locator("footer")).toBeVisible();
  });

  test("partner ticker lists each partner once to assistive technology", async ({ page }) => {
    await page.goto("/");
    const ticker = page.locator("section[aria-labelledby='partners-label']");
    for (const name of ["VolkerRail", "NEOS", "SWGR", "University of Glasgow Drone Society"]) {
      await expect(ticker.getByRole("listitem").filter({ hasText: name })).toHaveCount(1);
    }
  });

  test("industries show the launch cards before expansion cards", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("section[aria-labelledby='industries-title']");
    const titles = await section.getByRole("heading", { level: 3 }).allTextContents();
    expect(titles.slice(0, 2).map((t) => t.trim())).toEqual(["Rail", "Public Security"]);
    expect(titles.slice(2).map((t) => t.trim())).toEqual(["Construction", "Airports", "Farming", "Mining"]);
  });
});

test.describe("navigation", () => {
  test("header links reach each page and mark the active route", async ({ page }, info) => {
    test.skip(isMobile(info.project.name), "desktop navigation");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const [label, path] of [
      ["Industries", "/industries"],
      ["Mission", "/mission"],
      ["About", "/about"],
      ["Contact Us", "/contact"],
    ] as const) {
      await nav.getByRole("link", { name: label }).click();
      await expect(page).toHaveURL(path, { timeout: 20_000 });
      await expect(nav.getByRole("link", { name: label })).toHaveAttribute("aria-current", "page");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });

  test("mobile menu traps focus, closes on Escape and restores focus", async ({ page }, info) => {
    test.skip(!isMobile(info.project.name), "mobile navigation");
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    const dialog = page.getByRole("dialog", { name: "Site navigation" });
    await expect(dialog).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    for (let i = 0; i < 20; i++) await page.keyboard.press("Tab");
    expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test("brain labels reveal on first tap and navigate on the second", async ({ page }, info) => {
    test.skip(!isMobile(info.project.name), "touch interaction");
    await page.goto("/");
    const brain = page.getByRole("navigation", { name: "Operating environments in the Company Brain" });
    const rail = brain.getByRole("link", { name: "Rail" });
    await expect(rail).toBeVisible({ timeout: 15_000 });
    await page.waitForTimeout(2500);
    await rail.tap();
    await expect(page.getByText("Tap again to explore")).toBeVisible();
    await expect(page).toHaveURL("/");
    await rail.tap();
    await expect(page).toHaveURL("/industries/rail", { timeout: 20_000 });
  });

  test("unknown routes return the not-found page", async ({ page }) => {
    const response = await page.goto("/news/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("This signal could not be found.");
  });
});

test.describe("public security", () => {
  test("People / Police switch is an accessible tab set", async ({ page }) => {
    await page.goto("/industries/public-security");
    const people = page.getByRole("tab", { name: "For People" });
    const police = page.getByRole("tab", { name: "For Police" });
    await expect(people).toHaveAttribute("aria-selected", "true");
    await people.focus();
    await page.keyboard.press("ArrowRight");
    await expect(police).toBeFocused();
    await expect(police).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel", { name: "For Police" })).toBeVisible();
  });

  test("states consent, AI assistance, human review and privacy", async ({ page }) => {
    await page.goto("/industries/public-security");
    const text = (await page.locator("main").innerText()).toLowerCase();
    for (const term of ["consent", "ai", "human review", "privacy"]) expect(text).toContain(term);
    expect(text).not.toContain("partnership with police scotland");
  });
});

test.describe("news", () => {
  test("draft articles are labelled and not indexed", async ({ page }) => {
    await page.goto("/news/data-rich-decision-poor");
    await expect(page.getByText("Draft perspective").first()).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('script[type="application/ld+json"]', { hasText: '"Article"' })).toHaveCount(0);
  });
});

test.describe("contact", () => {
  test("client validation lists errors and focuses the first field", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.locator("form [role='alert']")).toContainText("problems with your enquiry");
    await expect(page.getByLabel("Name")).toBeFocused();
    await expect(page.getByLabel("Name")).toHaveAttribute("aria-invalid", "true");
  });

  test("interest is preselected from the query string", async ({ page }) => {
    await page.goto("/contact?interest=investment");
    await expect(page.getByRole("radio", { name: /Investment/ })).toBeChecked();
  });

  test("a valid enquiry never claims delivery without a configured backend", async ({ page }) => {
    test.skip(!!process.env.RESEND_API_KEY, "delivery is configured");
    await page.goto("/contact");
    await page.getByLabel("Name").fill("Test Person");
    await page.getByLabel("Organisation").fill("Test Organisation");
    await page.getByLabel("Work email").fill("test@example.com");
    await page.getByRole("radio", { name: /General enquiries/ }).check({ force: true });
    await page.getByLabel("Message").fill("This is an automated test enquiry from the test suite.");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.locator("form [role='status'], form [role='alert']")).toContainText(/not delivered|was not sent/i, {
      timeout: 15_000,
    });
    await expect(page.getByText("Enquiry sent")).toHaveCount(0);
    await expect(page.getByLabel("Message")).toHaveValue(/automated test enquiry/);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("ticker is static and hero content is immediately visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".ticker")).toBeHidden();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const opacity = await page.getByRole("heading", { level: 1 }).evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBeGreaterThan(0.95);
  });
});
