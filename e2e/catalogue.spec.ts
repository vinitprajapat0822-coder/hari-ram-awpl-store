import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const browserErrors: string[] = [];
const serverErrors: string[] = [];

test.beforeEach(async ({ page }) => {
  browserErrors.length = 0;
  serverErrors.length = 0;
  page.on("console", (message) => { if (message.type() === "error") browserErrors.push(message.text()); });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 500) serverErrors.push(response.status() + " " + response.url());
  });
});

test.afterEach(async () => {
  expect(browserErrors, "Browser console/page errors").toEqual([]);
  expect(serverErrors, "HTTP 5xx responses").toEqual([]);
});

test("home page shows the category catalogue and resilient product artwork", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "HARI RAM" })).toBeVisible();
  await expect(page.getByText("147 products", { exact: true })).toBeVisible();
  await page.getByTestId("product-grid").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("product-artwork").first()).toBeVisible();
  await expect(page.getByText("Image match pending review").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Agriculture", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Wellroot", exact: true })).toBeVisible();
});


test("independent-store disclosures and information pages are available", async ({ page }) => {
  await page.goto("./");
  const footer = page.getByRole("contentinfo");
  await expect(footer).toContainText("not the official AWPL corporate website");
  await footer.getByRole("link", { name: "About this store" }).click();
  await expect(page.getByRole("heading", { name: "About this store" })).toBeVisible();
  await page.goto("privacy/");
  await expect(page.getByRole("heading", { name: "Privacy and data use" })).toBeVisible();
  await expect(page.getByText(/not a complete legal privacy policy/)).toBeVisible();
  await page.goto("product-disclaimer/");
  await expect(page.getByRole("heading", { name: "Product information notice" })).toBeVisible();
});

test("mobile navigation stays visible and exposes all primary routes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const dock = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(dock).toBeVisible();
  await expect(dock.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(dock.getByRole("link", { name: "Catalogue" })).toBeVisible();
  await expect(dock.getByRole("link", { name: "Cart" })).toBeVisible();
  await expect(dock.getByRole("link", { name: "Profile" })).toBeVisible();

  const firstDockItem = dock.locator(".mobile-dock__item").first();
  const bounds = await firstDockItem.boundingBox();
  expect(bounds).not.toBeNull();
  if (!bounds) throw new Error("The first mobile dock item has no layout box.");

  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await expect.poll(() => firstDockItem.evaluate((element) => element.style.getPropertyValue("--dock-scale"))).toBe("1.180");

  await page.mouse.move(1, 1);
  await expect.poll(() => firstDockItem.evaluate((element) => element.style.getPropertyValue("--dock-scale"))).toBe("1");
});


test("catalogue grid uses two mobile columns and four desktop columns", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const grid = page.getByTestId("product-grid");
  await expect(grid).toBeVisible();
  const mobileColumns = await grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
  expect(mobileColumns).toBe(2);

  await page.setViewportSize({ width: 1280, height: 900 });
  const desktopColumns = await grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
  expect(desktopColumns).toBe(4);
});

test("home hero presents a stable catalogue introduction and clear actions", async ({ page }) => {
  await page.goto("./");
  const intro = page.getByRole("region", { name: "Store introduction" });
  await expect(intro).toBeVisible();
  await expect(intro.getByRole("heading", { name: /HARI RAM/ })).toBeVisible();
  await expect(intro.getByRole("link", { name: /Explore catalogue/ })).toHaveAttribute("href", "#catalogue");
  await expect(intro.getByRole("link", { name: /Browse categories/ })).toHaveAttribute("href", "#catalogue-categories");
  await expect(intro.getByText("147", { exact: true })).toBeVisible();
  await expect(intro.getByText("15", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Next highlight/ })).toHaveCount(0);
});

test("search filters the catalogue and can be cleared", async ({ page }) => {
  await page.goto("./");
  const search = page.getByRole("searchbox", { name: "Search products" });
  await search.fill("JEEVEDA CHHOLE CHANA MASALA");
  await expect(page.getByRole("group", { name: "Product JEEVEDA CHHOLE CHANA MASALA" })).toBeVisible();
  await expect(page.getByText("1 product", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(search).toHaveValue("");
  await expect(page.getByText("147 products", { exact: true })).toBeVisible();
});

test("category filters only show matching products", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Home Care", exact: true }).click();
  await expect(page.getByText("15 products in Home Care", { exact: true })).toBeVisible();
  await expect(page.getByRole("group", { name: "Product TOSHINE DETERGENT POWDER" })).toBeVisible();
  await expect(page.getByRole("group", { name: "Product PREP-IT PRIMER" })).toHaveCount(0);
});

test("withheld categories stay visible but cannot be browsed as orderable product lists", async ({ page }) => {
  await page.goto("./");
  for (const category of ["Wellness", "Wellroot", "Agriculture", "Veterinary"]) {
    await page.getByRole("button", { name: category, exact: true }).click();
    await expect(page.getByText("Category not enabled for ordering")).toBeVisible();
    await expect(page.getByTestId("product-grid")).toHaveCount(0);
  }
});

test("apparel colour and size SKUs are separate product cards", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Apparels", exact: true }).click();
  const olive = page.getByRole("group", { name: "Product ASCLEPIUS T SHIRT -OLIVE- (S)", exact: true });
  const blue = page.getByRole("group", { name: "Product ASCLEPIUS T SHIRT -LIGHT BLUE (S)", exact: true });
  await expect(olive).toBeVisible();
  await expect(blue).toBeVisible();
  await expect(olive.getByLabel("Select size / colour")).toHaveCount(0);
  await olive.getByRole("button", { name: "Add ASCLEPIUS T SHIRT -OLIVE- (S) to cart" }).click();
  await page.goto("cart/");
  await expect(page.getByRole("heading", { name: "Your Cart" })).toBeVisible();
  await expect(page.getByText("ASCLEPIUS T SHIRT -OLIVE- (S)", { exact: true })).toBeVisible();
  await expect(page.getByText("1 NUMBER", { exact: true })).toBeVisible();
  await expect(page.getByText("₹2,559", { exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText("ASCLEPIUS T SHIRT -OLIVE- (S)", { exact: true })).toBeVisible();
});

test("different Hairdoc Oil pack sizes remain separate cart products", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "SNISS Herbal", exact: true }).click();
  const hundredMl = page.getByRole("group", { name: "Product HAIRDOC OIL", exact: true });
  const twoHundredMl = page.getByRole("group", { name: "Product HAIRDOC OIL 200 ML", exact: true });
  await expect(hundredMl).toBeVisible();
  await expect(twoHundredMl).toBeVisible();
  await hundredMl.getByRole("button", { name: "Add HAIRDOC OIL to cart" }).click();
  await twoHundredMl.getByRole("button", { name: "Add HAIRDOC OIL 200 ML to cart" }).click();
  await page.goto("cart/");
  await expect(page.getByText("HAIRDOC OIL", { exact: true })).toBeVisible();
  await expect(page.getByText("100.00 ML", { exact: true })).toBeVisible();
  await expect(page.getByText("HAIRDOC OIL 200 ML", { exact: true })).toBeVisible();
  await expect(page.getByText("200.00 ML", { exact: true })).toBeVisible();
  await expect(page.getByText("₹660", { exact: true }).first()).toBeVisible();
});

test("conflicting MRP product is blocked from cart", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Jeeveda", exact: true }).click();
  const product = page.getByRole("group", { name: "Product JEEVEDA RICE BRAN OIL (2 LTR)" });
  await expect(product.getByText("MRP under review")).toBeVisible();
  await expect(product.getByRole("button", { name: "MRP review" })).toBeDisabled();
});

test("profile route renders and has labelled customer fields", async ({ page }) => {
  await page.goto("profile/?from=checkout");
  await expect(page.getByRole("heading", { name: "Your Details" })).toBeVisible();
  await expect(page.getByLabel("Full Name *")).toBeVisible();
  await expect(page.getByLabel("Mobile Number *")).toBeVisible();
  await expect(page.getByLabel("Delivery Address *")).toBeVisible();
});

test("home, cart, profile and product detail pass WCAG accessibility scan", async ({ page }) => {
  const routes = ["./", "cart/", "profile/", "product/awpl-apparels-asclepius-women-saree-crape/"];
  for (const route of routes) {
    await page.goto(route);
    await page.waitForTimeout(700);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(
      results.violations,
      "Accessibility violations on " + route + ": " + JSON.stringify(results.violations.map((item) => ({
        id: item.id,
        impact: item.impact,
        description: item.description,
        nodes: item.nodes.map((node) => node.target),
      })))
    ).toEqual([]);
  }
});


test("legacy SNISS Elite salicylic sheet mask URL resolves to the canonical product", async ({ page }) => {
  await page.goto("product/awpl-sniss-elite-salicylic-acid-face-sheet-mask/");
  await expect(page.getByRole("heading", { name: "SALICYLIC ACID FACE SHEET MASK", exact: true })).toBeVisible();
  await expect(page.getByText("₹315", { exact: true })).toBeVisible();
});

test("product card opens a dedicated product detail page", async ({ page }) => {
  await page.goto("./");
  const product = page.getByRole("group", { name: "Product ASCLEPIUS WOMEN SAREE CRAPE", exact: true });
  await expect(product).toBeVisible();
  await product.getByRole("link", { name: /ASCLEPIUS WOMEN SAREE CRAPE/ }).click();

  await expect(page.getByRole("heading", { name: "ASCLEPIUS WOMEN SAREE CRAPE", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Product information" })).toBeVisible();
  await expect(page.getByText("Hari Ram AWPL Store", { exact: true })).toBeVisible();
  await expect(page.getByText("Live stock count not synced")).toBeVisible();
  await expect(page.getByText("No verified reviews yet")).toBeVisible();
  await expect(page.getByText("Added date", { exact: true })).toBeVisible();
  await expect(page.getByText("Not recorded").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Add to cart" })).toBeVisible();
});

test("product card image lookup is concurrency limited", async ({ page }) => {
  let activeRequests = 0;
  let peakRequests = 0;

  await page.route("https://api.openverse.org/v1/images/**", async (route) => {
    activeRequests += 1;
    peakRequests = Math.max(peakRequests, activeRequests);
    await new Promise((resolve) => setTimeout(resolve, 60));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ results: [] }),
    });
    activeRequests -= 1;
  });

  await page.goto("./");
  await page.getByTestId("product-grid").scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  expect(peakRequests).toBeLessThanOrEqual(2);
});


test("product feedback form requires a rating and comment", async ({ page }) => {
  await page.goto("./");
  const product = page.getByRole("group", { name: "Product ASCLEPIUS WOMEN SAREE CRAPE", exact: true });
  await product.getByRole("link", { name: /ASCLEPIUS WOMEN SAREE CRAPE/ }).click();

  const sendFeedback = page.getByRole("button", { name: "Send feedback via WhatsApp" });
  await expect(sendFeedback).toBeDisabled();
  await page.getByRole("button", { name: "Rate 5 stars" }).click();
  await page.getByLabel("Your comment").fill("The product details were helpful.");
  await expect(sendFeedback).toBeEnabled();
});

test("every product card links to a working product detail route", async ({ page }) => {
  await page.goto("./");
  const cards = page.locator('[data-testid="product-grid"] article[aria-label^="Product "]');
  const productLinks = await cards.evaluateAll((elements) =>
    elements.map((element) => ({
      name: element.getAttribute("aria-label") || "Unnamed product",
      href: element.querySelector("a[href*='/product/']")?.getAttribute("href") ?? null,
    }))
  );

  expect(productLinks.length, "Catalogue should expose product cards").toBeGreaterThan(0);
  expect(productLinks.every((item) => item.href), "Every product card must have a detail URL").toBe(true);

  const hrefs = productLinks.map((item) => item.href);
  expect(new Set(hrefs).size, "Product detail URLs must be unique").toBe(productLinks.length);

  for (let offset = 0; offset < productLinks.length; offset += 8) {
    const batch = productLinks.slice(offset, offset + 8);
    const responses = await Promise.all(batch.map(async (item) => {
      const response = await page.request.get(new URL(item.href!, page.url()).toString());
      return { item, response };
    }));

    for (const { item, response } of responses) {
      expect(
        response.status(),
        item.name + " detail route " + item.href + " must not return an HTTP error"
      ).toBe(200);
      const html = await response.text();
      expect(
        html,
        item.name + " detail route must render a product page"
      ).toContain("<h1");
    }
  }
});
