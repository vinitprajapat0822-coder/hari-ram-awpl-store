import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("catalogue assistant widget", () => {
  test("opens, answers a price question, links to a product and closes with Escape", async ({ page }) => {
    await page.goto("./");
    await page.getByTestId("assistant-open").click();
    const panel = page.getByTestId("assistant-panel");
    await expect(panel).toBeVisible();
    await expect(panel.getByText("Automated catalogue helper, not AI or an AWPL service.")).toBeVisible();

    await page.getByLabel("Ask about a product, category or price").fill("products under 100 rs");
    await page.keyboard.press("Enter");
    const reply = panel.getByTestId("assistant-reply").last();
    await expect(reply).toHaveAttribute("data-kind", "products");
    await expect(reply.getByRole("link").first()).toBeVisible();
    await expect(reply.getByText("MRP is as listed in this catalogue")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(page.getByTestId("assistant-open")).toBeFocused();
  });

  test("refuses health questions without making API requests", async ({ page }) => {
    await page.goto("./");
    await page.getByTestId("assistant-open").click();
    const requests: string[] = [];
    page.on("request", (request) => {
      // Catalogue image requests are expected; the offline assistant must not call APIs.
      if (request.resourceType() === "fetch" || request.resourceType() === "xhr") requests.push(request.url());
    });

    await page.getByLabel("Ask about a product, category or price").fill("does this cure diabetes");
    await page.keyboard.press("Enter");
    const reply = page.getByTestId("assistant-panel").getByTestId("assistant-reply").last();
    await expect(reply).toHaveAttribute("data-kind", "refusal");
    await expect(reply.getByRole("link", { name: /Ask the store on WhatsApp/ })).toBeVisible();
    expect(requests).toEqual([]);
  });

  test("opened assistant panel has no automatically detectable accessibility violations", async ({ page }) => {
    await page.goto("./");
    await page.getByTestId("assistant-open").click();
    const results = await new AxeBuilder({ page }).include('[data-testid="assistant-panel"]').analyze();
    expect(results.violations).toEqual([]);
  });

  test("a result link opens the product page", async ({ page }) => {
    await page.goto("./");
    await page.getByTestId("assistant-open").click();
    await page.getByLabel("Ask about a product, category or price").fill("jeeveda");
    await page.keyboard.press("Enter");
    await page.getByTestId("assistant-panel").getByTestId("assistant-reply").last().getByRole("link").first().click();
    await expect(page).toHaveURL(/\/product\/[^/]+\/?$/);
    await expect(page.getByTestId("assistant-panel")).toBeHidden();
  });
});
