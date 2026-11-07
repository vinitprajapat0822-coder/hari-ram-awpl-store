import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("customer login page presents the animated Liquid Glass experience", async ({ page }) => {
  await page.goto("login/");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue with Google" })).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "Remember me" })).toBeChecked();
  await expect(page.getByRole("link", { name: "Continue browsing the catalogue" })).toHaveAttribute("href", "/hari-ram-awpl-store/");
  await expect(page.getByTestId("assistant-open")).toHaveCount(0);
});

test("registration validates matching passwords before authentication", async ({ page }) => {
  await page.goto("login/");
  await page.getByRole("button", { name: "Register now" }).click();
  await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
  await page.getByLabel("Full name").fill("Test Customer");
  await page.getByLabel("Email address").fill("customer@example.com");
  await page.getByLabel("Password", { exact: true }).fill("secure-pass-123");
  await page.getByLabel("Confirm password").fill("different-pass-456");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("alert")).toHaveText("Your passwords do not match.");
});

test("forgot password offers an email reset flow", async ({ page }) => {
  await page.goto("login/");
  await page.getByRole("button", { name: "Forgot password?" }).click();
  await expect(page.getByRole("heading", { name: "Reset your password" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send reset link" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Back to sign in/ })).toBeVisible();
});

test("login page has no detectable serious accessibility violations", async ({ page }) => {
  await page.goto("login/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(item => ["critical", "serious"].includes(item.impact ?? ""))).toEqual([]);
});

test("catalogue remains accessible without signing in", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { name: /HARI RAM/ })).toBeVisible();
  await expect(page.getByTestId("product-grid")).toBeVisible();
});
