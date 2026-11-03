import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const browserErrors: string[] = [];
const serverErrors: string[] = [];

test.beforeEach(async ({ page }) => {
  browserErrors.length = 0;
  serverErrors.length = 0;

  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });

  page.on("pageerror", (error) => browserErrors.push(error.message));

  page.on("response", (response) => {
    if (response.status() >= 500) {
      serverErrors.push(`${response.status()} ${response.url()}`);
    }
  });
});

test.afterEach(async () => {
  expect(browserErrors, "Browser console/page errors").toEqual([]);
  expect(serverErrors, "HTTP 5xx responses").toEqual([]);
});

test("home page shows the category catalogue and image placeholders", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "HARI RAM" })).toBeVisible();
  await expect(page.getByText("135 products", { exact: true })).toBeVisible();
  await expect(page.getByText("Image pending").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Agriculture", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Wellroot", exact: true })).toBeVisible();
});

test("search filters the catalogue and can be cleared", async ({ page }) => {
  await page.goto("./");
  const search = page.getByRole("textbox", { name: "Search products" });

  await search.fill("JEEVEDA CHHOLE CHANA MASALA");
  await expect(
    page.getByRole("group", { name: "Product JEEVEDA CHHOLE CHANA MASALA" })
  ).toBeVisible();
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

  await expect(
    page.getByText("No verified catalogue items are available in this category yet.")
  ).toBeVisible();
});

test("apparel colour and size SKUs are separate product cards", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Apparels", exact: true }).click();

  const olive = page.getByRole("group", {
    name: "Product ASCLEPIUS T SHIRT - OLIVE (S)",
  });
  const blue = page.getByRole("group", {
    name: "Product ASCLEPIUS T SHIRT - LIGHT BLUE (S)",
  });

  await expect(olive).toBeVisible();
  await expect(blue).toBeVisible();
  await expect(olive.getByLabel("Select size / colour")).toHaveCount(0);
  await olive.getByRole("button", {
    name: "Add ASCLEPIUS T SHIRT - OLIVE (S) to cart",
  }).click();

  await page.goto("cart/");
  await expect(page.getByRole("heading", { name: "Your Cart" })).toBeVisible();
  await expect(
    page.getByText("ASCLEPIUS T SHIRT - OLIVE (S)", { exact: true })
  ).toBeVisible();
  await expect(page.getByText("1 NUMBER", { exact: true })).toBeVisible();
  await expect(page.getByText("₹2,559", { exact: true }).first()).toBeVisible();

  await page.reload();
  await expect(
    page.getByText("ASCLEPIUS T SHIRT - OLIVE (S)", { exact: true })
  ).toBeVisible();
});

test("different Hairdoc Oil pack sizes remain separate cart products", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "SNISS Herbal", exact: true }).click();

  const hundredMl = page.getByRole("group", { name: "Product HAIRDOC OIL" });
  const twoHundredMl = page.getByRole("group", { name: "Product HAIRDOC OIL 200 ML" });

  await expect(hundredMl).toBeVisible();
  await expect(twoHundredMl).toBeVisible();
  await hundredMl.getByRole("button", { name: "Add HAIRDOC OIL to cart" }).click();
  await twoHundredMl.getByRole("button", { name: "Add HAIRDOC OIL 200 ML to cart" }).click();

  await page.goto("cart/");
  await expect(page.getByText("HAIRDOC OIL", { exact: true })).toBeVisible();
  await expect(page.getByText("100 ML", { exact: true })).toBeVisible();
  await expect(page.getByText("HAIRDOC OIL 200 ML", { exact: true })).toBeVisible();
  await expect(page.getByText("200 ML", { exact: true })).toBeVisible();
  await expect(page.getByText("₹660", { exact: true }).first()).toBeVisible();
});

test("conflicting MRP product is blocked from cart", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Jeeveda", exact: true }).click();

  const product = page.getByRole("group", {
    name: "Product JEEVEDA RICE BRAN OIL (2 LTR)",
  });
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

test("home, cart and profile pass WCAG accessibility scan", async ({ page }) => {
  const routes = ["./", "cart/", "profile/"];

  for (const route of routes) {
    await page.goto(route);
    await page.waitForTimeout(700); // let Framer Motion entrance transitions settle before axe evaluates contrast
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(
      results.violations,
      `Accessibility violations on ${route}: ${JSON.stringify(
        results.violations.map((item) => ({
          id: item.id,
          impact: item.impact,
          description: item.description,
          nodes: item.nodes.map((node) => node.target),
        }))
      )}`
    ).toEqual([]);
  }
});
