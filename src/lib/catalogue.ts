import type { Product } from "@/data/products";

export function validateCatalogue(
  items: Product[],
  categoryLabels: string[]
): string[] {
  const validCategories = new Set(
    categoryLabels.filter((category) => category !== "All")
  );
  const seenIds = new Set<string>();
  const issues: string[] = [];

  items.forEach((product, index) => {
    const label = "Product at index " + index;

    if (!product.id.trim()) {
      issues.push(label + " has an empty id.");
    } else if (seenIds.has(product.id)) {
      issues.push("Duplicate product id: " + product.id);
    } else {
      seenIds.add(product.id);
    }

    if (!product.name.trim()) {
      issues.push(label + " has an empty English name.");
    }

    if (!product.nameHi.trim()) {
      issues.push(label + " has an empty Hindi name.");
    }

    if (!validCategories.has(product.category)) {
      issues.push(
        label + " uses an unknown category: " + product.category
      );
    }

    if (!product.qty.trim()) {
      issues.push(label + " has no pack size or quantity.");
    }

    for (const field of ["mrp", "dp", "sp"] as const) {
      const price = product[field];
      if (!Number.isFinite(price) || price < 0) {
        issues.push(label + " has an invalid " + field.toUpperCase() + ".");
      }
    }

    if (product.image !== undefined && product.image.trim().length === 0) {
      issues.push(label + " has an empty image path.");
    }
  });

  return issues;
}
