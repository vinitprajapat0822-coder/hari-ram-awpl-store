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
  await expect(page.getByText("135 products", { exact: true })).toBeVisible();
  await page.getByTestId("product-grid").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("product-artwork").first()).toBeVisible();
  await expect(page.getByText("Image pending")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Agriculture", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Wellroot", exact: true })).toBeVisible();
});

test("mobile navigation stays visible and exposes all primary routes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const dock = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(dock).toBeVisible();
  await expect(dock.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(dock.getByRole("link", { name: "Catalogue" })).toBeVisible();
  await expect(dock.getByRole("link", { name: "About" })).toBeVisible();
  await expect(dock.getByRole("link", { name: "Cart" })).toBeVisible();
  await expect(dock.getByRole("link", { name: "Profile" })).toBeVisible();

  const firstDockItem = dock.locator(".mobile-dock__item").first();
  const bounds = await firstDockItem.boundingBox();
  expect(bounds).not.toBeNull();
  if (!bounds) throw new Error("The first mobile dock item has no layout box.");

  await page.mouse.move(1, 1);
  await firstDockItem.hover();
  await expect.poll(
    () => firstDockItem.evaluate((element) => Number(element.style.getPropertyValue("--dock-scale"))),
    { timeout: 10_000 }
  ).toBeGreaterThan(1.17);

  await page.mouse.move(1, 1);
  await expect.poll(
    () => firstDockItem.evaluate((element) => element.style.getPropertyValue("--dock-scale")),
    { timeout: 10_000 }
  ).toBe("1");
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

test("promo carousel exposes working highlight controls", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("region", { name: "Store highlights" })).toBeVisible();
  await page.getByRole("button", { name: "Next highlight" }).first().click();
  await expect(page.getByText("Find your range,", { exact: true })).toBeVisible();
});

test("search filters the catalogue and can be cleared", async ({ page }) => {
  await page.goto("./");
  const search = page.getByRole("searchbox", { name: "Search products" });
  await search.fill("JEEVEDA CHHOLE CHANA MASALA");
  await expect(page.getByRole("group", { name: "Product JEEVEDA CHHOLE CHANA MASALA" })).toBeVisible();
  await expect(page.getByText("1 product", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(search).toHaveValue("");
  await expect(page.getByText("135 products", { exact: true })).toBeVisible();
});

test("category filters only show matching products", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Home Care", exact: true }).click();
  await expect(page.getByText("15 products in Home Care", { exact: true })).toBeVisible();
  await expect(page.getByRole("group", { name: "Product TOSHINE DETERGENT POWDER" })).toBeVisible();
  await expect(page.getByRole("group", { name: "Product PREP-IT PRIMER" })).toHaveCount(0);
});

test("held category filters do not show unreviewed items as orderable", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Wellness", exact: true }).click();
  await expect(page.getByText("No matches found")).toBeVisible();
});

test("apparel colour and size SKUs are separate product cards", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Apparels", exact: true }).click();
  const olive = page.getByRole("group", { name: "Product ASCLEPIUS T SHIRT - OLIVE (S)", exact: true });
  const blue = page.getByRole("group", { name: "Product ASCLEPIUS T SHIRT - LIGHT BLUE (S)", exact: true });
  await expect(olive).toBeVisible();
  await expect(blue).toBeVisible();
  await expect(olive.getByLabel("Select size / colour")).toHaveCount(0);
  await olive.getByRole("button", { name: "Add ASCLEPIUS T SHIRT - OLIVE (S) to cart" }).click();
  await page.goto("cart/");
  await expect(page.getByRole("heading", { name: "Your Cart" })).toBeVisible();
  await expect(page.getByText("ASCLEPIUS T SHIRT - OLIVE (S)", { exact: true })).toBeVisible();
  await expect(page.locator("p").getByText("1 NUMBER", { exact: true })).toBeVisible();
  await expect(page.getByText("₹2,559", { exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText("ASCLEPIUS T SHIRT - OLIVE (S)", { exact: true })).toBeVisible();
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
  await expect(page.locator("p").getByText("100 ML", { exact: true })).toBeVisible();
  await expect(page.getByText("HAIRDOC OIL 200 ML", { exact: true })).toBeVisible();
  await expect(page.locator("p").getByText("200 ML", { exact: true })).toBeVisible();
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
  test.setTimeout(60_000);
  const routes = ["./", "about/", "cart/", "profile/", "account/", "orders/", "admin/", "product/awpl-apparels-asclepius-women-saree-crape/"];
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


test("product card opens a dedicated product detail page", async ({ page }) => {
  await page.goto("./");
  const product = page.getByRole("group", { name: "Product ASCLEPIUS WOMEN SAREE CRAPE", exact: true });
  await expect(product).toBeVisible();
  await product.getByRole("link", { name: /ASCLEPIUS WOMEN SAREE CRAPE/ }).click();

  await expect(page.getByRole("heading", { name: "ASCLEPIUS WOMEN SAREE CRAPE", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Product information" })).toBeVisible();
  await expect(page.getByText("Hariram Prajapat", { exact: true })).toBeVisible();
  await expect(page.getByText("Owner · Hari Ram AWPL Store", { exact: true })).toBeVisible();
  await expect(page.getByText("Live stock count not synced")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "You may also like" })).toBeVisible();
  await expect(page.getByText("No verified reviews yet")).toBeVisible();
  await expect(page.getByText("Added date", { exact: true })).toBeVisible();
  await expect(page.getByText("Not recorded").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Add to cart", exact: true })).toBeVisible();
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


test("product reviews show only approved purchase-verified submissions", async ({ page }) => {
  await page.goto("./");
  const product = page.getByRole("group", { name: "Product ASCLEPIUS WOMEN SAREE CRAPE", exact: true });
  await product.getByRole("link", { name: /ASCLEPIUS WOMEN SAREE CRAPE/ }).click();

  await expect(page.getByRole("heading", { name: "Customer ratings & reviews" })).toBeVisible();
  await expect(page.getByText("No verified reviews yet")).toBeVisible();
  await expect(page.getByRole("button", { name: "Send feedback via WhatsApp" })).toHaveCount(0);
});

test("About page presents the store owner and direct contact channels", async ({ page }) => {
  await page.goto("about/");
  await expect(page.getByRole("heading", { name: "AWPL STORE" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Hariram Prajapat" })).toBeVisible();
  await expect(page.getByRole("link", { name: /WhatsApp · 9799133838/ })).toHaveAttribute("href", /wa\.me\/919799133838/);
  await expect(page.getByRole("link", { name: /@hariramprajapat97/ })).toHaveAttribute("href", /instagram\.com\/hariramprajapat97/);
});


test("account, order centre and protected admin routes render without a configured backend", async ({ page }) => {
  await page.goto("account/");
  await expect(page.getByRole("heading", { name: "Sign in or create account" })).toBeVisible();

  await page.goto("orders/");
  await expect(page.getByRole("heading", { name: "My Orders" })).toBeVisible();

  await page.goto("admin/");
  await expect(page.getByRole("heading", { name: "Owner Dashboard" })).toBeVisible();
  await expect(page.getByText("Access denied")).toBeVisible();
});


test("Hindi and English switcher translates catalogue labels and persists the choice", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: /हिन्दी.*Switch language to Hindi/ }).click();
  await expect(page.getByRole("heading", { name: "उत्पाद सूची" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "hi");
  await page.reload();
  await expect(page.getByRole("heading", { name: "उत्पाद सूची" })).toBeVisible();
  await page.getByRole("button", { name: /EN.*भाषा अंग्रेज़ी में बदलें/ }).click();
  await expect(page.getByRole("heading", { name: "Product catalogue" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});


test("cart drawer opens for a selected item and updates quantity", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: /Add to cart — Add .* to cart/ }).first().click();
  await page.getByRole("button", { name: "Open cart" }).click();
  const drawer = page.getByRole("dialog");
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("heading", { name: "Your Cart" })).toBeVisible();
  await drawer.getByRole("button", { name: "Increase quantity" }).click();
  const cartItem = drawer.getByRole("article", { name: /Cart item:/ });
  await expect(cartItem.getByText("2", { exact: true })).toBeVisible();
});
