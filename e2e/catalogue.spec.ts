import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const browserErrors: string[] = [];
const responseErrors: string[] = [];
const APP_ORIGIN = "http://127.0.0.1:3000";

test.beforeEach(async ({ page }) => {
  browserErrors.length = 0;
  responseErrors.length = 0;
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("response", (response) => {
    if (response.status() < 400) return;
    console.log("NETWORK_HTTP_ERROR=" + response.status() + " " + response.url());
    try {
      if (new URL(response.url()).origin === APP_ORIGIN) {
        responseErrors.push(response.status() + " " + response.url());
      }
    } catch {
      responseErrors.push(response.status() + " " + response.url());
    }
  });
});

test.afterEach(async () => {
  console.log("BROWSER_ERRORS=" + JSON.stringify(browserErrors));
  console.log("HTTP_RESPONSE_ERRORS=" + JSON.stringify(responseErrors));
  expect(browserErrors, "Browser console/page errors").toEqual([]);
  expect(responseErrors, "Same-origin HTTP 4xx/5xx responses").toEqual([]);
});

test("homepage renders the current hero, catalogue summary and product grid", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("region", { name: "Store introduction" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Everyday essentials, one clear catalogue.");
  await expect(page.getByText("HARI RAM", { exact: false }).first()).toBeVisible();
  const grid = page.getByTestId("product-grid");
  await expect(grid).toBeVisible();
  await expect(grid.locator("article").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Agriculture", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Wellroot", exact: true })).toBeVisible();
});

test("mobile navigation remains visible and exposes every primary route", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const dock = page.locator("nav.mobile-dock");
  await expect(dock).toBeVisible();
  for (const label of ["Home", "Catalogue", "Cart", "Account", "Profile"]) {
    await expect(dock.getByRole("link", { name: new RegExp(label) })).toBeVisible();
  }
});

test("search filters the paginated catalogue and can be cleared", async ({ page }) => {
  await page.goto("./");
  const search = page.getByRole("combobox", { name: "Search products" });
  await search.fill("TOSHINE DETERGENT POWDER");
  await expect(page.getByRole("group", { name: /TOSHINE DETERGENT POWDER/ })).toBeVisible();
  await expect(page.getByTestId("product-grid").locator("article")).toHaveCount(1);
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(search).toHaveValue("");
  await expect(page.getByTestId("product-grid").locator("article").first()).toBeVisible();
});

test("search handles a spelling typo and keyboard autocomplete opens the matching SKU", async ({ page }) => {
  await page.goto("./");
  const search = page.getByRole("combobox", { name: "Search products" });
  await search.fill("TOSHINE DETRGENT POWDER");
  await expect(page.getByRole("group", { name: /TOSHINE DETERGENT POWDER/ })).toBeVisible();
  await expect(page.getByTestId("product-grid").locator("article")).toHaveCount(1);

  await search.press("ArrowDown");
  await search.press("Enter");
  await expect(page).toHaveURL(/\/product\/[^/]+\/?$/);
  await expect(page.getByRole("heading", { name: "TOSHINE DETERGENT POWDER", exact: true })).toBeVisible();
});

test("wishlist saves products across reloads and supports removal", async ({ page }) => {
  await page.goto("./");
  const search = page.getByRole("combobox", { name: "Search products" });
  await search.fill("TOSHINE DETERGENT POWDER");
  const product = page.getByRole("group", { name: /TOSHINE DETERGENT POWDER/ });
  await expect(product).toBeVisible();
  const save = product.locator("button[aria-pressed]");
  await save.click();
  await expect(save).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("link", { name: /Wishlist \(1\)/ }).click();
  await expect(page.getByRole("heading", { name: "Wishlist" })).toBeVisible();
  await expect(page.getByTestId("wishlist-grid").getByRole("group", { name: /TOSHINE DETERGENT POWDER/ })).toBeVisible();

  await page.reload();
  const savedProduct = page.getByTestId("wishlist-grid").getByRole("group", { name: /TOSHINE DETERGENT POWDER/ });
  const remove = savedProduct.getByRole("button", { name: /Remove from wishlist/ });
  await expect(remove).toHaveAttribute("aria-pressed", "true");
  await remove.click();
  await expect(page.getByText("Your wishlist is empty")).toBeVisible();
});

test("category filters preserve matching products and held categories stay non-orderable", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Home Care", exact: true }).click();
  await expect(page.getByRole("group", { name: /TOSHINE DETERGENT POWDER/ })).toBeVisible();
  await expect(page.getByTestId("product-grid").locator("article")).toHaveCount(15);

  await page.getByRole("button", { name: "Agriculture", exact: true }).click();
  await expect(page.getByText("Category not enabled for ordering")).toBeVisible();
  await expect(page.getByTestId("product-grid")).toHaveCount(0);
});

test("product detail and cart retain the selected verified SKU", async ({ page }) => {
  await page.goto("product/awpl-apparels-asclepius-women-saree-crape/");
  await expect(page.getByRole("heading", { name: "ASCLEPIUS WOMEN SAREE CRAPE", exact: true })).toBeVisible();
  const add = page.getByRole("button", { name: "Add to cart", exact: true });
  await expect(add).toBeEnabled();
  await add.click();
  await page.goto("cart/");
  await expect(page.getByRole("heading", { name: "Your Cart" })).toBeVisible();
  await expect(page.getByText("ASCLEPIUS WOMEN SAREE CRAPE", { exact: true })).toBeVisible();
  await expect(page.getByText("1 NUMBER", { exact: true })).toBeVisible();
});

test("profile route renders labelled delivery fields", async ({ page }) => {
  await page.goto("profile/");
  await expect(page.getByRole("heading", { name: "Your Details" })).toBeVisible();
  await expect(page.getByLabel("Full name *")).toBeVisible();
  await expect(page.getByLabel("Mobile Number *")).toBeVisible();
  await expect(page.getByLabel("Delivery Address *")).toBeVisible();
});

test("the navbar GlassCard applies the crystal refraction SVG filter", async ({ page }) => {
  await page.goto("./");
  await expect.poll(() => page.locator("header [data-lg-refract]").count()).toBeGreaterThan(0);
  // The package decorates the glass pseudo-element after it measures the card.
  // Wait for the computed filter instead of racing that asynchronous setup.
  await expect.poll(() => page.evaluate(() => {
    const glassCards = Array.from(document.querySelectorAll("header [data-liquid-glass], header .lg-glass"));
    return glassCards.filter((element) => {
      const beforeFilter = getComputedStyle(element, "::before").filter;
      return beforeFilter.includes("hari-ram-crystal-refraction");
    }).length;
  })).toBeGreaterThan(0);
  const report = await page.evaluate(() => {
    const glassCards = Array.from(document.querySelectorAll("header [data-liquid-glass], header .lg-glass"));
    const filter = document.getElementById("hari-ram-crystal-refraction");
    const appliedBackdrops = glassCards.map((element) => {
      const ownStyle = getComputedStyle(element);
      const beforeStyle = getComputedStyle(element, "::before");
      return {
        own: ownStyle.backdropFilter,
        before: beforeStyle.backdropFilter,
        ownFilter: ownStyle.filter,
        beforeFilter: beforeStyle.filter,
      };
    });
    return {
      glassCardCount: glassCards.length,
      filterOuterHTML: filter?.outerHTML ?? null,
      hasFeTurbulence: Boolean(filter?.querySelector("feTurbulence")),
      hasFeDisplacementMap: Boolean(filter?.querySelector("feDisplacementMap")),
      appliedToGlassCount: appliedBackdrops.filter(({ own, before, ownFilter, beforeFilter }) =>
        (own + " " + before + " " + ownFilter + " " + beforeFilter).includes("hari-ram-crystal-refraction")
      ).length,
      appliedBackdrops,
    };
  });
  console.log("CRYSTAL_REFRACTION_DOM=" + JSON.stringify(report));
  expect(report.glassCardCount, "Navbar glass surface should be present").toBeGreaterThan(0);
  expect(report.filterOuterHTML).toContain("<filter");
  expect(report.hasFeTurbulence, "Crystal filter must contain feTurbulence").toBe(true);
  expect(report.hasFeDisplacementMap, "Crystal filter must contain feDisplacementMap").toBe(true);
  expect(report.appliedToGlassCount, "Crystal filter must be applied to visible glass surfaces").toBeGreaterThan(0);
});

test("home, cart, profile, login, reset-password and product pages pass WCAG 2.1 AA axe scan", async ({ page }) => {
  const routes = [
    "./",
    "cart/",
    "profile/",
    "login/",
    "reset-password/",
    "product/awpl-apparels-asclepius-women-saree-crape/",
  ];
  for (const route of routes) {
    await page.goto(route);
    await page.waitForTimeout(250);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      results.violations,
      "Accessibility violations on " + route + ": " + JSON.stringify(results.violations.map((item) => ({
        id: item.id,
        impact: item.impact,
        nodes: item.nodes.map((node) => node.target),
      })))
    ).toEqual([]);
  }
});
