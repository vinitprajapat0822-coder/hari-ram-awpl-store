#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");

function loadTypeScriptData(relativePath) {
  const filePath = path.join(root, relativePath);
  const source = fs.readFileSync(filePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  });

  const errors = (transpiled.diagnostics || []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error
  );
  if (errors.length) {
    throw new Error(
      "Unable to transpile " + relativePath + ": " +
      errors.map((item) => ts.flattenDiagnosticMessageText(item.messageText, "\n")).join("; ")
    );
  }

  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    require: (specifier) => {
      throw new Error("Unexpected runtime import in audit data module: " + specifier);
    },
  };
  vm.runInNewContext(transpiled.outputText, sandbox, {
    timeout: 3000,
    filename: relativePath,
  });
  return module.exports;
}

function countBy(items, selector) {
  const counts = new Map();
  for (const item of items) {
    const key = selector(item) ?? "(missing)";
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return Object.fromEntries(
    [...counts.entries()].sort(([a], [b]) => String(a).localeCompare(String(b)))
  );
}

function duplicates(items, selector) {
  const counts = countBy(items, selector);
  return Object.fromEntries(Object.entries(counts).filter(([, count]) => count > 1));
}

function markdownTable(record) {
  return Object.entries(record)
    .map(([label, count]) => "| " + label + " | " + count + " |")
    .join("\n");
}

function makeReport() {
  const { awplProducts } = loadTypeScriptData("src/data/awpl-products.ts");
  const { catalogueCategories } = loadTypeScriptData("src/data/catalogue.ts");

  if (!Array.isArray(awplProducts) || !Array.isArray(catalogueCategories)) {
    throw new Error("Expected catalogue exports were not found.");
  }

  const records = awplProducts;
  const categorySlugs = new Set(catalogueCategories.map((item) => item.slug));
  const excludedCategories = new Set(["wellness", "wellroot", "agriculture", "veterinary"]);
  const publicRecords = records.filter((record) =>
    record.mrp !== null &&
    !excludedCategories.has(record.category) &&
    record.id !== "awpl-baby-protein" &&
    categorySlugs.has(record.category)
  );

  const ids = records.map((record) => record.id);
  const duplicateIds = duplicates(records, (record) => record.id);
  const unknownCategoryRecords = records.filter((record) => !categorySlugs.has(record.category));
  const imageRecords = records.filter(
    (record) => typeof record.image?.url === "string" && record.image.url.trim()
  );
  const imageStatuses = countBy(records, (record) => record.image?.status || "MISSING");
  const duplicateImages = duplicates(imageRecords, (record) => record.image.url);
  const categoryDistribution = countBy(records, (record) => record.category);
  const publicCategoryDistribution = countBy(publicRecords, (record) => record.category);
  const populatedPublicCategories = Object.keys(publicCategoryDistribution);
  const emptyPublicCategories = catalogueCategories
    .filter((category) => !populatedPublicCategories.includes(category.slug))
    .map((category) => category.slug);

  const metrics = {
    "Master product records": records.length,
    "Unique product IDs": new Set(ids).size,
    "Duplicate product IDs": Object.keys(duplicateIds).length,
    "Defined categories": catalogueCategories.length,
    "Categories populated in public catalogue": populatedPublicCategories.length,
    "Defined categories empty in public catalogue": emptyPublicCategories.length,
    "Public catalogue records": publicRecords.length,
    "Records with image URL": imageRecords.length,
    "Records with manually verified image match": imageRecords.filter((record) => record.image?.status === "VERIFIED").length,
    "Image URLs not marked visually verified": imageRecords.filter((record) => record.image?.status !== "VERIFIED").length,
    "Records without image URL": records.length - imageRecords.length,
    "Duplicate image URLs": Object.keys(duplicateImages).length,
    "Missing pack sizes": records.filter((record) => !String(record.packSize || "").trim()).length,
    "Missing descriptions": records.filter((record) => !String(record.description || "").trim()).length,
    "Missing product-source URLs": records.filter((record) => !String(record.productSource?.sourceUrl || "").trim()).length,
    "Missing price-evidence URLs": records.filter((record) => !String(record.priceEvidence?.sourceUrl || "").trim()).length,
    "Price-review-required records": records.filter((record) => record.status === "PRICE_REVIEW_REQUIRED").length,
    "Non-verified product records": records.filter((record) => record.status !== "VERIFIED").length,
    "Missing brand values": records.filter((record) => !String(record.brand || "").trim()).length,
    "Missing Hindi names": records.filter((record) => !String(record.nameHi || "").trim()).length,
    "Missing ingredient lists": records.filter((record) => !Array.isArray(record.ingredients) || record.ingredients.length === 0).length,
    "Records with unknown availability": records.filter((record) => record.availability === "UNKNOWN").length,
    "Records with incomplete source evidence": records.filter((record) =>
      !record.priceEvidence?.sourceUrl ||
      !record.priceEvidence?.checkedAt ||
      !record.productSource?.sourceUrl ||
      !record.productSource?.checkedAt ||
      !record.lastVerifiedAt
    ).length,
  };

  const categoryRows = markdownTable(categoryDistribution) || "| (none) | 0 |";
  const publicRows = markdownTable(publicCategoryDistribution) || "| (none) | 0 |";
  const imageRows = markdownTable(imageStatuses) || "| (none) | 0 |";
  const generatedAt = new Date().toISOString();
  const sha = process.env.GITHUB_SHA || "not supplied (local run)";

  const report = [
    "# Automated catalogue audit",
    "",
    "- Generated at: " + generatedAt,
    "- Source commit: " + sha,
    "- Source data: src/data/awpl-products.ts",
    "- Category definitions: src/data/catalogue.ts",
    "",
    "## Summary",
    "",
    "| Metric | Count |",
    "|---|---:|",
    markdownTable(metrics),
    "",
    "## Master catalogue category distribution",
    "",
    "| Category slug | Records |",
    "|---|---:|",
    categoryRows,
    "",
    "## Public catalogue category distribution",
    "",
    "| Category slug | Records |",
    "|---|---:|",
    publicRows,
    "",
    "## Image status distribution",
    "",
    "| Status | Records |",
    "|---|---:|",
    imageRows,
    "",
    "## Duplicate product IDs",
    "",
    Object.keys(duplicateIds).length ? JSON.stringify(duplicateIds, null, 2) : "None detected.",
    "",
    "## Duplicate image URLs",
    "",
    Object.keys(duplicateImages).length ? JSON.stringify(duplicateImages, null, 2) : "None detected.",
    "",
    "## Empty defined categories in public catalogue",
    "",
    emptyPublicCategories.length ? emptyPublicCategories.map((slug) => "- " + slug).join("\n") : "None.",
    "",
    "## Unknown category records",
    "",
    unknownCategoryRecords.length
      ? unknownCategoryRecords.map((record) => "- " + record.id + ": " + record.category).join("\n")
      : "None.",
    "",
    "## Interpretation and limitations",
    "",
    "- Counts are computed from the checked-in TypeScript data at audit time; they are not a live scrape of the AWPL website.",
    "- Image status records the manual product/variant/pack review; URL presence alone is not proof of a visual match.",
    "- This audit does not determine copyright, licensing or other image-use permissions.",
    "- Product verification, image matching, price accuracy, product classification and legal permissions are distinct checks.",
    "- This audit reports missing fields; it does not invent or repair product facts.",
    "- Public-catalogue exclusions mirror the current filtering logic in src/data/products.ts.",
    "",
  ].join("\n");

  return { report, duplicateIds, unknownCategoryCount: unknownCategoryRecords.length };
}

try {
  const result = makeReport();
  console.log(result.report);
  if (process.argv.includes("--write")) {
    const outputPath = path.join(root, "docs", "catalogue-audit-report.md");
    fs.writeFileSync(outputPath, result.report, "utf8");
    console.log("Wrote " + path.relative(root, outputPath));
  }
  if (Object.keys(result.duplicateIds).length || result.unknownCategoryCount) {
    console.error("Catalogue integrity gate failed: duplicate IDs or undefined categories detected.");
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
}
