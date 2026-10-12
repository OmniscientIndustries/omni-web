import { expect, test } from "@playwright/test";
import { isPublicArticle, news, publishedNews } from "../content/news";

const isMobile = (name: string) => name === "mobile";

test.describe("homepage", () => {
  test("sections appear in the specified order", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Intelligence for the physical world.");
    const order = await page.evaluate(() =>
      ["industries-title", "news-title"].map((id) => document.getElementById(id)?.getBoundingClientRect().top ?? -1),
    );
    expect(order.every((v) => v > 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    await expect(page.locator("footer")).toBeVisible();
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

const removedTitles = [
  "Why physical operations are data-rich and decision-poor",
  "Designing worker protection around live operational context",
  "Consent, privacy and human review in community hate reporting",
  "From drone flight to digital twin: inspecting infrastructure in context",
  "Edge AI for environments where connectivity cannot be assumed",
];

test.describe("news source", () => {
  test("holds exactly seven supplied articles and keeps the pilot unpublished", () => {
    expect(news).toHaveLength(7);
    expect(new Set(news.map((article) => article.slug)).size).toBe(7);
    expect(new Set(news.map((article) => article.title)).size).toBe(7);

    for (const article of news) {
      expect(article.body).toHaveLength(3);
      expect(article.publicationLabel).toBe("October 2026");
      expect(article.image.width).toBeGreaterThan(0);
      expect(article.image.height).toBeGreaterThan(0);
      expect(article.image.alt.length).toBeGreaterThan(12);
      expect(article.image.caption.length).toBeGreaterThan(12);
      expect(article.image.src.startsWith("/images/news/")).toBe(true);
    }

    const packed = JSON.stringify(news);
    expect(packed).not.toMatch(/lorem ipsum/i);
    expect(packed).not.toContain("Atreides");
    expect(packed).not.toContain("Vector Rail");
    expect(packed).not.toContain("RedZone");
    expect(packed).not.toContain("Before publication");
    expect(packed).not.toMatch(/SafeZone(?! Rail)/);
    expect(packed).toContain("SafeZone Rail");
    expect(packed).toContain("the wider Omniscient product direction");
    expect(packed).toContain("safe work limits");
    expect(packed).toContain("£1,410");
    expect(packed).toContain("£1,175 plus VAT");
    for (const title of removedTitles) expect(packed).not.toContain(title);

    const pilot = news.find((article) => article.slug === "three-rail-pilot-engagements-underway");
    expect(pilot?.status).toBe("draft");
    expect(pilot?.partnerNamingApproved).toBe(false);
    expect(pilot ? isPublicArticle(pilot) : true).toBe(false);
    expect(publishedNews.map((article) => article.slug)).not.toContain(pilot?.slug);

    const trial = news.find((article) => article.slug === "safezone-rail-first-on-track-functional-trial");
    expect(trial?.factualReviewRequired).toBe(true);
    expect(trial?.body[0].text).toContain("Sighthill East Junction");
    expect(trial?.body[0].text).toContain("22 to 23 August 2026");
  });
});

test.describe("news", () => {
  test("published articles are listed and the unapproved pilot is absent", async ({ page }) => {
    await page.goto("/news");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("News and insights.");
    const listing = (await page.locator("main").innerText()).replace(/\s+/g, " ");
    for (const article of publishedNews) expect(listing).toContain(article.title);
    expect(listing.toLowerCase()).toContain("october 2026");
    expect(listing).not.toContain("From Development to Deployment");
    expect(listing).not.toContain("VolkerRail");
    expect(listing).not.toContain("Before publication");
    expect(listing).not.toMatch(/SafeZone(?! Rail)/);

    await page.goto("/");
    const home = await page.locator("#news").innerText();
    expect(home).toContain(publishedNews[0].title);
    expect(home).toContain(publishedNews[1].title);
    expect(home).toContain(publishedNews[2].title);
    expect(home).not.toContain("VolkerRail");
    expect(home).not.toContain("NEOS Networks");
    for (const title of removedTitles) expect(home).not.toContain(title);
  });

  test("the pilot article is not a public route and is omitted from the sitemap", async ({ page }) => {
    const response = await page.goto("/news/three-rail-pilot-engagements-underway");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("This signal could not be found.");

    const sitemap = await page.request.get("/sitemap.xml");
    const xml = await sitemap.text();
    expect(xml).toContain("/news/introducing-omniscient-industries");
    expect(xml).not.toContain("three-rail-pilot-engagements-underway");
    expect(xml).not.toContain("data-rich-decision-poor");
  });

  test("an article page links back and publishes unique article metadata", async ({ page }) => {
    await page.goto("/news/safezone-rail-first-on-track-functional-trial");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("SafeZone Rail Completes Its First On Track Functional Trial");
    await expect(page.getByText("October 2026").first()).toBeVisible();
    await expect(page.getByText("1 October 2026")).toHaveCount(0);
    await expect(page.getByText("factualReviewRequired")).toHaveCount(0);
    const text = await page.locator("main").innerText();
    expect(text).toContain("initial functional proof");
    expect(text).toContain("not a survey-grade accuracy assessment");
    expect(text).toContain("Sighthill West Junction");
    expect(text).not.toMatch(/SafeZone(?! Rail)/);

    const scripts = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
      nodes.map((node) => node.textContent ?? ""),
    );
    const data = scripts.map((script) => JSON.parse(script)).find((item) => item["@type"] === "NewsArticle");
    expect(data).toBeTruthy();
    expect(data.datePublished).toBe("2026-10");
    expect(data.publisher.name).toBe("Omniscient Industries");
    expect(data.author).toBeUndefined();

    const image = page.locator("main img").first();
    await expect(image).toHaveAttribute("alt", /overnight track trial/);
    await expect(image).toBeVisible();
    const box = await image.boundingBox();
    expect(box && box.height).toBeGreaterThan(80);

    await page.getByRole("link", { name: "News and insights" }).click();
    await expect(page).toHaveURL("/news");
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

  test("hero content is immediately visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".ticker")).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const opacity = await page.getByRole("heading", { level: 1 }).evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBeGreaterThan(0.95);
  });
});
