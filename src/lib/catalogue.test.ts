import assert from "node:assert/strict";
import test from "node:test";
import { products, categories } from "@/data/products";
import { validateCatalogue } from "@/lib/catalogue";

test("current catalogue has unique ids and valid required fields", () => {
  assert.deepEqual(validateCatalogue(products, categories), []);
});

test("catalogue validator reports duplicate ids and invalid categories", () => {
  const duplicate = { ...products[0] };
  const invalidProduct = {
    ...products[1],
    id: "temporary-invalid-category-test",
    category: "Unknown Category",
  };

  const issues = validateCatalogue(
    [products[0], duplicate, invalidProduct],
    categories
  );

  assert.ok(issues.some((issue) => issue.includes("Duplicate product id")));
  assert.ok(issues.some((issue) => issue.includes("Unknown Category")));
});
