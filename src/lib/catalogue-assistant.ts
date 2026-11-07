import type { Product } from "@/data/products";

/**
 * Rule-based catalogue assistant. It only reads the storefront-safe product
 * list passed in. It never calls a network, never stores anything and never
 * invents stock, discounts, ingredients, benefits, delivery or seller details.
 */

export type AssistantReplyKind =
  | "welcome"
  | "products"
  | "no-match"
  | "categories"
  | "order-help"
  | "seller-info"
  | "refusal";

export type AssistantReply = {
  kind: AssistantReplyKind;
  text: string;
  products: Product[];
  /** Matches before the result limit is applied. */
  total: number;
  /** True when the reply should offer the "ask the store" button. */
  offerStore: boolean;
};

export const MAX_RESULTS = 5;
export const MAX_QUERY_LENGTH = 200;

export const suggestedPrompts = [
  "Jeeveda",
  "Products under ₹200",
  "What categories are there?",
  "How do I order?",
] as const;

const STOPWORDS = new Set((
  "show me find list give tell about the a an of for in on with and or please product products item items any " +
  "what is are do you have i want need looking dikhao dikha batao bata chahiye hai hain kya ke ka ki me mein se wala wali wale " +
  "mujhe aur ya price mrp rate cost rs rupees rupee rupaye inr under below above over less than upto up to within between " +
  "neeche niche kam zyada jyada upar tak cheap cheapest sasta sabse expensive mehnga costliest around"
).split(" "));

const SYNONYMS: Record<string, string> = {
  tel: "oil", sabun: "soap", chai: "tea", shahad: "honey", kapde: "apparel", kapda: "apparel",
  daal: "dal", masale: "masala", masalon: "masala", masalas: "masala", mirch: "chilli", haldi: "turmeric", jeera: "cumin", dhaniya: "coriander",
};

const GUARDS: { kind: "medical" | "business" | "logistics" | "ingredients"; pattern: RegExp }[] = [
  {
    kind: "medical",
    pattern: /\b(cure|cures|treat|treats|treatment|heal|heals|disease|diseases|diabetes|diabetic|cancer|thyroid|bp|blood pressure|pregnan\w*|side effects?|allerg\w*|dose|dosage|medicine|medicines|doctor|benefit|benefits|fayda|faida|bimari|ilaj|ilaaj|dawai|dawa|safe for|works for|effective|guaranteed)\b/,
  },
  {
    kind: "business",
    pattern: /\b(income|earn|earning|earnings|kamai|kamao|kamana|commission|business opportunity|join|joining|recruit\w*|distributor|dealer|franchise|referral|dp|sp|bv|pv|member price|wholesale|discount|discounts|offer|offers|cashback|coupon)\b/,
  },
  {
    kind: "logistics",
    pattern: /\b(stock|in stock|availability|delivery|deliver|shipping|courier|return|returns|refund|cancel|cancellation|exchange|payment|pay|cod|cash on delivery|gst|invoice|track|tracking|warranty)\b/,
  },
  { kind: "ingredients", pattern: /\b(ingredient|ingredients|composition|contains)\b/ },
];

const GUARD_TEXT: Record<(typeof GUARDS)[number]["kind"], string> = {
  medical:
    "I can't answer health, treatment, safety or benefit questions. I only share catalogue details: name, category, pack size and listed MRP. For product use or suitability, please read the pack label or ask the store.",
  business:
    "This catalogue lists MRP only. It has no verified discounts, offers, distributor prices or earning information, so I can't answer those. Please ask the store directly.",
  logistics:
    "Stock, delivery, payment, returns and refunds are not confirmed in this catalogue, so I can't answer them. The seller confirms these separately. Please ask the store.",
  ingredients:
    "Ingredients are not published in this catalogue. Please check the product pack label or ask the store.",
};

function normalise(input: string): string {
  return input
    .toLowerCase()
    .replace(/₹/g, " rs ")
    .replace(/(\d),(\d{3})/g, "$1$2")
    .replace(/[^a-z0-9.\u0900-\u097f\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function canonicalSize(value: string): string {
  return value
    .toLowerCase()
    .replace(/(\d+)\.00\b/g, "$1")
    .replace(/(\d)\s+(gm|g|kg|ml|ltr|litre|liter|l)\b/g, "$1$2")
    .replace(/(\d)(ltr|litre|liter)\b/g, "$1l")
    .replace(/(\d)g\b/g, "$1gm");
}

type PriceFilter = { min: number | null; max: number | null; described: string } | null;

function parsePrice(text: string): { filter: PriceFilter; rest: string } {
  let rest = text;
  const num = "(\\d+(?:\\.\\d+)?)";
  const unit = "(?![\\d.])(?!\\s*(?:gm|g|kg|ml|l|ltr|litre|liter)\\b)";

  const between = new RegExp(`(?:between\\s+)?(?:rs\\s*)?${num}${unit}\\s*(?:and|to|se|-)\\s*(?:rs\\s*)?${num}${unit}`).exec(rest);
  if (between && /between|rs|rupee|price|mrp|\bse\b/.test(rest)) {
    const a = Number(between[1]);
    const b = Number(between[2]);
    rest = rest.replace(between[0], " ");
    return { filter: { min: Math.min(a, b), max: Math.max(a, b), described: `MRP between ₹${Math.min(a, b)} and ₹${Math.max(a, b)}` }, rest };
  }
  const max = new RegExp(`(?:under|below|less than|upto|up to|within|max|maximum)\\s*(?:rs\\s*)?${num}${unit}|(?:rs\\s*)?${num}${unit}\\s*(?:se kam|ke neeche|ke niche|tak|or less|and below)`).exec(rest);
  if (max) {
    const value = Number(max[1] ?? max[2]);
    rest = rest.replace(max[0], " ");
    return { filter: { min: null, max: value, described: `MRP up to ₹${value}` }, rest };
  }
  const min = new RegExp(`(?:above|over|more than|minimum|min)\\s*(?:rs\\s*)?${num}${unit}|(?:rs\\s*)?${num}${unit}\\s*(?:se zyada|se jyada|se upar|or more|and above)`).exec(rest);
  if (min) {
    const value = Number(min[1] ?? min[2]);
    rest = rest.replace(min[0], " ");
    return { filter: { min: value, max: null, described: `MRP from ₹${value}` }, rest };
  }
  const bare = new RegExp(`(?:rs\\s*${num}${unit}|${num}${unit}\\s*(?:rs|rupees|rupee|rupaye))`).exec(rest);
  if (bare) {
    const value = Number(bare[1] ?? bare[2]);
    rest = rest.replace(bare[0], " ");
    return { filter: { min: null, max: value, described: `MRP up to ₹${value}` }, rest };
  }
  return { filter: null, rest };
}

function tokensFrom(text: string): string[] {
  return canonicalSize(text)
    .split(" ")
    .map((token) => SYNONYMS[token] ?? token)
    .filter((token) => token && !STOPWORDS.has(token) && !/^\d+(\.\d+)?$/.test(token));
}

function haystackWords(product: Product): string[] {
  const text = canonicalSize(
    [product.name, product.brand, product.category, product.subcategory, product.qty].filter(Boolean).join(" "),
  );
  return normalise(text).split(" ").filter(Boolean);
}

function tokenMatches(token: string, words: string[]): number {
  let best = 0;
  for (const word of words) {
    if (word === token) return 3;
    if (token.length >= 3 && word.startsWith(token)) best = Math.max(best, 2);
    else if (token.length >= 4 && word.includes(token)) best = Math.max(best, 1);
  }
  return best;
}

function isPriced(product: Product): boolean {
  return product.status === "VERIFIED" && Number.isFinite(product.mrp);
}

export function formatMrp(product: Product): string {
  return isPriced(product) ? `MRP ₹${product.mrp.toLocaleString("en-IN")} (as listed)` : "MRP under review";
}

function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

export function welcomeReply(): AssistantReply {
  return {
    kind: "welcome",
    text:
      "Hi! I'm an automated catalogue helper, not an AI and not an AWPL service. I can search by product name, category, pack size and listed MRP. Try: \"Jeeveda\" or \"products under ₹200\".",
    products: [],
    total: 0,
    offerStore: false,
  };
}

export function answerQuery(rawQuery: string, catalogue: Product[]): AssistantReply {
  const query = normalise(rawQuery.slice(0, MAX_QUERY_LENGTH));
  if (!query) return welcomeReply();

  if (/^(hi|hello|hey|namaste|namaskar|hii|helo)\b/.test(query) && query.split(" ").length <= 3) return welcomeReply();

  for (const guard of GUARDS) {
    if (guard.pattern.test(query)) {
      return { kind: "refusal", text: GUARD_TEXT[guard.kind], products: [], total: 0, offerStore: true };
    }
  }

  if (/\b(official|who are you|seller|owner|contact|address|about (?:this )?(?:store|site|website|you))\b/.test(query)) {
    return {
      kind: "seller-info",
      text:
        "This is an independently operated catalogue and order-enquiry storefront. It is not the official AWPL website, and no AWPL authorisation is claimed. Seller details are still being verified, so I can't share them. See the About page, or ask the store.",
      products: [],
      total: 0,
      offerStore: true,
    };
  }

  if (/\b(how|kaise|kese)\b.*\b(order|buy|kharid\w*|cart)\b|\b(checkout|cart|order|buy)\b/.test(query) && !/\b(under|below|above|rs)\b/.test(query)) {
    return {
      kind: "order-help",
      text:
        "Open a product, tap add to cart, then open the Cart and use Continue on WhatsApp. Sending the message is only an enquiry. The seller must confirm the current MRP, availability and delivery before an order is accepted.",
      products: [],
      total: 0,
      offerStore: true,
    };
  }

  if (/\b(categor\w*|kya kya|what do you (have|sell)|all products)\b/.test(query)) {
    const counts = new Map<string, number>();
    catalogue.forEach((product) => counts.set(product.category, (counts.get(product.category) ?? 0) + 1));
    const list = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).map(([name, count]) => `${name} (${count})`).join(", ");
    return {
      kind: "categories",
      text: `Categories with products: ${list}. Ask for any of them by name.`,
      products: [],
      total: 0,
      offerStore: false,
    };
  }

  const wantsCheapest = /\b(cheapest|sasta|sabse sasta|lowest)\b/.test(query);
  const wantsCostliest = /\b(costliest|most expensive|mehnga|sabse mehnga|highest)\b/.test(query);
  const { filter, rest } = parsePrice(query);
  const tokens = tokensFrom(rest);

  if (!filter && tokens.length === 0 && !wantsCheapest && !wantsCostliest) {
    return {
      kind: "no-match",
      text: "I couldn't tell what to search for. Try a product name, a category such as Jeeveda, or a price like \"under ₹300\".",
      products: [],
      total: 0,
      offerStore: true,
    };
  }

  let candidates = catalogue;
  let excludedForReview = 0;
  if (filter || wantsCheapest || wantsCostliest) {
    const priced = candidates.filter(isPriced);
    excludedForReview = candidates.length - priced.length;
    candidates = priced;
  }
  if (filter) {
    candidates = candidates.filter((product) => (filter.min === null || product.mrp >= filter.min) && (filter.max === null || product.mrp <= filter.max));
  }

  let scored = candidates.map((product) => {
    const words = haystackWords(product);
    const scores = tokens.map((token) => tokenMatches(token, words));
    return { product, scores, total: scores.reduce((sum, score) => sum + score, 0) };
  });

  let closest = false;
  if (tokens.length > 0) {
    const allMatch = scored.filter((row) => row.scores.every((score) => score > 0));
    if (allMatch.length > 0) {
      scored = allMatch;
    } else {
      scored = scored.filter((row) => row.total > 0);
      closest = scored.length > 0;
    }
  }

  scored.sort((a, b) => {
    if (wantsCheapest || (filter && !wantsCostliest)) return a.product.mrp - b.product.mrp || a.product.name.localeCompare(b.product.name);
    if (wantsCostliest) return b.product.mrp - a.product.mrp || a.product.name.localeCompare(b.product.name);
    return b.total - a.total || a.product.name.localeCompare(b.product.name);
  });

  const total = scored.length;
  if (total === 0) {
    return {
      kind: "no-match",
      text: `I found no catalogue items for that${filter ? ` (${filter.described})` : ""}. Try a simpler name or another category.`,
      products: [],
      total: 0,
      offerStore: true,
    };
  }

  const shown = scored.slice(0, MAX_RESULTS).map((row) => row.product);
  const parts = [
    closest ? `No exact match, so here are the closest ${plural(total, "item")}.` : `Found ${plural(total, "item")}.`,
    filter ? `${filter.described}.` : "",
    total > shown.length ? `Showing the first ${shown.length}. Add more words to narrow it down.` : "",
    excludedForReview > 0 ? `${plural(excludedForReview, "item")} with MRP under review were left out of the price match.` : "",
  ].filter(Boolean);

  return { kind: "products", text: parts.join(" "), products: shown, total, offerStore: false };
}
