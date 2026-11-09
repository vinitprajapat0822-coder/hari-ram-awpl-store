import { expect, test } from "@playwright/test";
import { en } from "../src/i18n/en";
import { hi } from "../src/i18n/hi";

const APP = "/hari-ram-awpl-store";
const PRODUCT_ID = "awpl-apparels-asclepius-women-saree-crape";
const routes = [
  "/",
  "/#catalogue",
  "/cart",
  "/login",
  "/profile",
  "/reset-password",
  "/product/" + PRODUCT_ID + "/",
];

type RouteResult = {
  route: string;
  english: string;
  hindi: string;
  htmlLang: string;
  noReload: string;
  scroll: string;
  cart: string;
  console: string;
};

function removeAllowedBrands(value: string) {
  return value
    .replace(/SNISS|Jeeveda|AWPL|HARI RAM/gi, "")
    // Product IDs are technical catalogue identifiers, not customer-facing copy.
    .replace(/\bawpl-[a-z0-9]+(?:-[a-z0-9]+)*\b/gi, "")
    .replace(/₹/g, "")
    .trim();
}

function visibleEnglishLeaks(bodyText: string) {
  const visibleText = removeAllowedBrands(bodyText).toLocaleLowerCase();
  return Object.entries(en).flatMap(([key, english]) => {
    const hindi = hi[key as keyof typeof hi];
    if (!english || english.length < 4 || english === hindi) return [];
    const candidate = removeAllowedBrands(english).toLocaleLowerCase();
    if (candidate.length < 4) return [];
    const wholeWord = /^[a-z]+$/i.test(candidate)
      ? new RegExp("\\b" + candidate + "\\b", "i").test(visibleText)
      : visibleText.includes(candidate);
    return wholeWord ? [english] : [];
  });
}

async function storedCartCount(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const raw = localStorage.getItem("hari-ram-awpl-store");
    if (!raw) return 0;
    try {
      const state = JSON.parse(raw)?.state;
      return (state?.cart ?? []).reduce((sum: number, item: { quantity?: number }) => sum + Number(item.quantity || 0), 0);
    } catch {
      return -1;
    }
  });
}

test("route × language matrix: Hindi copy, html lang, SPA toggle, scroll, cart and console", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 640 });
  await page.addInitScript(() => {
    try { localStorage.setItem("lang", "en"); } catch { /* The page can still start in English. */ }
  });

  const browserErrors: string[] = [];
  let mainFrameNavigations = 0;
  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame()) mainFrameNavigations += 1;
  });
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.goto(APP + "/product/" + PRODUCT_ID + "/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  const addToCart = page.getByRole("button", { name: "Add to cart", exact: true });
  await expect(addToCart).toBeEnabled();
  await addToCart.click();
  await expect.poll(() => storedCartCount(page)).toBe(1);

  const results: RouteResult[] = [];
  for (const route of routes) {
    browserErrors.length = 0;
    await page.goto(APP + route);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    const languageSwitcher = page.locator(".language-switcher");
    await expect(languageSwitcher).toBeVisible();
    const enButton = languageSwitcher.locator("button").nth(0);
    const hiButton = languageSwitcher.locator("button").nth(1);

    const startingUrl = page.url();
    const startingCartCount = await storedCartCount(page);
    const startY = await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const target = Math.min(500, max);
      window.scrollTo({ left: 0, top: target, behavior: "instant" });
      return Math.round(window.scrollY);
    });
    const navigationsBeforeSwitch = mainFrameNavigations;

    await hiButton.click();
    await expect(page.locator("html")).toHaveAttribute("lang", "hi");
    await page.waitForTimeout(120);
    const hiBody = await page.locator("body").innerText();
    const leaks = visibleEnglishLeaks(hiBody);
    const afterHindiY = await page.evaluate(() => window.scrollY);
    const hindiUrl = page.url();
    const hindiCartCount = await storedCartCount(page);
    const hindiNavCount = mainFrameNavigations;

    await enButton.click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page.waitForTimeout(120);
    const afterEnglishY = await page.evaluate(() => window.scrollY);
    const englishCartCount = await storedCartCount(page);
    const endUrl = page.url();

    const noReload = hindiNavCount === navigationsBeforeSwitch && mainFrameNavigations === navigationsBeforeSwitch;
    const scrollPreserved = Math.abs(afterHindiY - startY) <= 1 && Math.abs(afterEnglishY - startY) <= 1;
    const cartPreserved = startingCartCount === 1 && hindiCartCount === startingCartCount && englishCartCount === startingCartCount;
    const routePreserved = startingUrl === hindiUrl && hindiUrl === endUrl;
    const consoleClear = browserErrors.length === 0;
    const result: RouteResult = {
      route,
      english: leaks.length === 0 ? "PASS" : "FAIL: " + leaks.slice(0, 8).join(" | "),
      hindi: leaks.length === 0 ? "PASS" : "FAIL",
      htmlLang: "PASS",
      noReload: noReload && routePreserved ? "PASS" : "FAIL",
      scroll: scrollPreserved ? "PASS" : "FAIL " + startY + "→" + afterHindiY + "→" + afterEnglishY,
      cart: cartPreserved ? "PASS" : "FAIL " + startingCartCount + "/" + hindiCartCount + "/" + englishCartCount,
      console: consoleClear ? "PASS" : "FAIL: " + browserErrors.join(" | "),
    };
    results.push(result);
    console.log("LANGUAGE_ROUTE_RESULT=" + JSON.stringify(result));
  }

  console.log("LANGUAGE_ROUTE_MATRIX=" + JSON.stringify(results, null, 2));
  const failed = results.filter((row) =>
    row.english !== "PASS" ||
    row.hindi !== "PASS" ||
    row.htmlLang !== "PASS" ||
    row.noReload !== "PASS" ||
    row.scroll !== "PASS" ||
    row.cart !== "PASS" ||
    row.console !== "PASS"
  );
  expect(failed, "Actual route × language verification failures: " + JSON.stringify(failed, null, 2)).toEqual([]);
});
