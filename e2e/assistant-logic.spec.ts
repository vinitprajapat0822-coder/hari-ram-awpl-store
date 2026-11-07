import { expect, test } from "@playwright/test";
import { products } from "@/data/products";
import { answerQuery, MAX_RESULTS, welcomeReply } from "@/lib/catalogue-assistant";

const reviewRequired = products.filter((product) => product.status !== "VERIFIED");

test.describe("catalogue assistant logic (no browser)", () => {
  test("price filters respect MRP and never use review-required prices", () => {
    const under = answerQuery("products under ₹200", products);
    expect(under.kind).toBe("products");
    expect(under.products.length).toBeGreaterThan(0);
    expect(under.products.length).toBeLessThanOrEqual(MAX_RESULTS);
    for (const product of under.products) {
      expect(product.mrp).toBeLessThanOrEqual(200);
      expect(product.status).toBe("VERIFIED");
    }
    const prices = under.products.map((product) => product.mrp);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));

    const above = answerQuery("above 1000", products);
    for (const product of above.products) expect(product.mrp).toBeGreaterThanOrEqual(1000);

    const between = answerQuery("between 100 and 300 rs", products);
    for (const product of between.products) {
      expect(product.mrp).toBeGreaterThanOrEqual(100);
      expect(product.mrp).toBeLessThanOrEqual(300);
    }

    for (const record of reviewRequired) {
      const result = answerQuery("cheapest", products);
      expect(result.products.map((product) => product.id)).not.toContain(record.id);
    }
  });

  test("pack sizes are not mistaken for prices", () => {
    const result = answerQuery("500 gm", products);
    expect(result.kind).toBe("products");
    for (const product of result.products) expect(product.qty.toLowerCase()).toContain("500");
    expect(result.text).not.toContain("MRP up to");
  });

  test("name and category searches only return real catalogue records", () => {
    const ids = new Set(products.map((product) => product.id));
    const jeeveda = answerQuery("jeeveda", products);
    expect(jeeveda.kind).toBe("products");
    for (const product of jeeveda.products) {
      expect(ids.has(product.id)).toBe(true);
      expect(product.category).toBe("Jeeveda");
    }
    expect(answerQuery("tel", products).kind).toBe("products");

    const masale = answerQuery("Jeeveda ke masale dikhao", products);
    expect(masale.kind).toBe("products");
    expect(masale.products.length).toBeGreaterThan(0);
    for (const product of masale.products) {
      expect(product.category).toBe("Jeeveda");
      expect(product.name.toLowerCase()).toContain("masala");
    }

    expect(answerQuery("zzzz-not-a-product", products).kind).toBe("no-match");
  });

  test("health, business and logistics questions are refused without products", () => {
    const questions = [
      "does this cure diabetes",
      "benefits of turmeric",
      "income kaise kamaye",
      "dp price",
      "any discount",
      "delivery time",
      "is it in stock",
      "refund policy",
    ];
    for (const question of questions) {
      const reply = answerQuery(question, products);
      expect(reply.kind, question).toBe("refusal");
      expect(reply.products, question).toEqual([]);
      expect(reply.offerStore, question).toBe(true);
    }
    expect(answerQuery("ingredients of turmeric", products).text).toContain("not published");
  });

  test("replies never claim stock, delivery, discounts, authorisation or earnings", () => {
    const samples = ["jeeveda", "how do I order", "contact", "categories", "does this cure diabetes", "delivery time", "hello"];
    for (const sample of samples) {
      const text = answerQuery(sample, products).text.toLowerCase();
      expect(text, sample).not.toMatch(/in stock|free delivery|guaranteed|official seller|authorised seller|earn/);
    }
  });

  test("order help explains that an enquiry is not an accepted order", () => {
    const reply = answerQuery("how do I order", products);
    expect(reply.kind).toBe("order-help");
    expect(reply.text).toMatch(/enquiry/i);
    expect(reply.text).toMatch(/seller must confirm/i);
  });

  test("seller question states independence and does not invent seller details", () => {
    const reply = answerQuery("who is the seller", products);
    expect(reply.kind).toBe("seller-info");
    expect(reply.text).toMatch(/not the official AWPL website/i);
    expect(reply.text).toMatch(/seller for this storefront is Hariram/i);
    expect(reply.text).not.toMatch(/\d{10}|@|gstin|fssai/i);
  });

  test("categories reply lists only populated categories", () => {
    const reply = answerQuery("what categories are there?", products);
    expect(reply.kind).toBe("categories");
    for (const withheld of ["Wellness", "Wellroot", "Agriculture", "Veterinary"]) {
      expect(reply.text).not.toContain(withheld);
    }
    expect(reply.text).toContain("Jeeveda");
  });

  test("empty, greeting, long and markup input are handled safely", () => {
    expect(answerQuery("   ", products).kind).toBe("welcome");
    expect(answerQuery("hello", products).kind).toBe("welcome");
    expect(welcomeReply().text).toMatch(/not an AI/i);
    expect(() => answerQuery("a".repeat(5000), products)).not.toThrow();
    const markup = answerQuery("<script>alert(1)</script>", products);
    expect(markup.text).not.toContain("<");
  });
});
