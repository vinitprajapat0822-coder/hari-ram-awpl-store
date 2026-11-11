import type { Product } from "@/data/products";

function normalize(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9\u0900-\u097f]+/gi, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function editDistance(left: string, right: string): number {
  if (left === right) return 0;
  if (!left) return right.length;
  if (!right) return left.length;
  if (Math.abs(left.length - right.length) > 2) return 3;

  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  let current = new Array<number>(right.length + 1);

  for (let row = 1; row <= left.length; row += 1) {
    current[0] = row;
    let rowMinimum = current[0];
    for (let column = 1; column <= right.length; column += 1) {
      const substitutionCost = left[row - 1] === right[column - 1] ? 0 : 1;
      current[column] = Math.min(
        previous[column] + 1,
        current[column - 1] + 1,
        previous[column - 1] + substitutionCost
      );
      rowMinimum = Math.min(rowMinimum, current[column]);
    }
    if (rowMinimum > 2) return 3;
    [previous, current] = [current, previous];
  }

  return previous[right.length];
}

function searchableFields(product: Product): string[] {
  return [
    product.name,
    product.nameHi,
    product.category,
    product.qty,
    product.brand ?? "",
    product.description ?? "",
    product.descriptionHi,
  ].map(normalize).filter(Boolean);
}

/**
 * Rank direct matches first, then token-level near matches (up to two edits).
 * This stays dependency-free and is designed for the store's compact catalogue.
 */
export function rankProducts(products: Product[], query: string): Product[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return products;

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const ranked = products.flatMap((product, originalIndex) => {
    const fields = searchableFields(product);
    const combined = fields.join(" ");
    let score = Number.POSITIVE_INFINITY;

    if (fields.some((field) => field === normalizedQuery)) {
      score = 0;
    } else if (fields.some((field) => field.startsWith(normalizedQuery))) {
      score = 10;
    } else if (fields.some((field) => field.includes(normalizedQuery))) {
      score = 20;
    } else {
      const tokens = Array.from(new Set(combined.split(" ").filter(Boolean)));
      let tokenScore = 0;

      for (const queryToken of queryTokens) {
        let best = Number.POSITIVE_INFINITY;
        for (const token of tokens) {
          if (token === queryToken) {
            best = 0;
            break;
          }
          if (token.startsWith(queryToken)) {
            best = Math.min(best, 0.5);
            continue;
          }
          if (queryToken.length >= 4 && token.length >= 4) {
            const distance = editDistance(queryToken, token);
            const maxDistance = queryToken.length >= 8 ? 2 : 1;
            if (distance <= maxDistance) best = Math.min(best, distance + 1);
          }
        }
        if (!Number.isFinite(best)) {
          tokenScore = Number.POSITIVE_INFINITY;
          break;
        }
        tokenScore += best;
      }

      if (Number.isFinite(tokenScore)) score = 40 + tokenScore;
    }

    return Number.isFinite(score) ? [{ product, score, originalIndex }] : [];
  });

  return ranked
    .sort((left, right) => left.score - right.score || left.originalIndex - right.originalIndex)
    .map(({ product }) => product);
}
