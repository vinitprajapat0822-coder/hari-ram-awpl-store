#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");

function loadCatalogue() {
  const sourcePath = path.join(root, "src/data/awpl-products.ts");
  const source = fs.readFileSync(sourcePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  });
  const errors = (transpiled.diagnostics || []).filter(
    (item) => item.category === ts.DiagnosticCategory.Error
  );
  if (errors.length) {
    throw new Error(errors.map((item) =>
      ts.flattenDiagnosticMessageText(item.messageText, "\n")
    ).join("\n"));
  }
  const transpiledModule = { exports: {} };
  vm.runInNewContext(transpiled.outputText, {
    module: transpiledModule,
    exports: transpiledModule.exports,
    require: (specifier) => {
      throw new Error("Unexpected runtime import: " + specifier);
    },
  }, { timeout: 5000, filename: sourcePath });
  return transpiledModule.exports.awplProducts;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function requestImage(url) {
  let lastError = "Unknown network error";
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const head = await fetch(url, {
        method: "HEAD",
        signal: AbortSignal.timeout(15000),
        headers: { "User-Agent": "HariRamAWPLStore-ImageAudit/1.0" },
      });
      const headType = (head.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
      if (head.status === 200 && headType.startsWith("image/")) {
        return { ok: true, status: head.status, contentType: headType, method: "HEAD" };
      }

      // Some object hosts reject HEAD while allowing a normal image GET.
      const get = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "HariRamAWPLStore-ImageAudit/1.0",
          Range: "bytes=0-31",
        },
        signal: AbortSignal.timeout(15000),
      });
      const getType = (get.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
      const ok = (get.status === 200 || get.status === 206) && getType.startsWith("image/");
      if (get.body) {
        const reader = get.body.getReader();
        await reader.read();
        await reader.cancel().catch(() => {});
      }
      if (ok) {
        return { ok: true, status: get.status, contentType: getType, method: "GET" };
      }
      lastError = "HEAD " + head.status + " (" + headType + "); GET " + get.status + " (" + getType + ")";
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    if (attempt < 3) await sleep(attempt * 500);
  }
  return { ok: false, status: null, contentType: "", method: "HEAD/GET", error: lastError };
}

async function main() {
  const records = loadCatalogue();
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error("Catalogue data is missing or empty.");
  }

  const byUrl = new Map();
  const missing = [];
  for (const record of records) {
    const url = record.image && typeof record.image.url === "string"
      ? record.image.url.trim()
      : "";
    if (!url) {
      missing.push({ id: record.id, name: record.name, reason: "MISSING_URL" });
    } else if (!byUrl.has(url)) {
      byUrl.set(url, []);
    }
    if (url) byUrl.get(url).push({ id: record.id, name: record.name });
  }

  const entries = [...byUrl.entries()];
  const checks = new Map();
  let next = 0;
  const worker = async () => {
    while (true) {
      const index = next++;
      if (index >= entries.length) return;
      const [url] = entries[index];
      checks.set(url, await requestImage(url));
    }
  };
  await Promise.all(Array.from({ length: Math.min(8, entries.length) }, worker));

  const results = entries.map(([url, products]) => ({
    url,
    products,
    ...(checks.get(url) || { ok: false, error: "No check result" }),
  }));
  const failed = results.filter((item) => !item.ok);
  const payload = {
    generatedAt: new Date().toISOString(),
    recordCount: records.length,
    recordsWithImageUrl: records.length - missing.length,
    uniqueImageUrls: entries.length,
    missing,
    failed,
    results,
    note: "HTTP and image MIME verification only. This does not prove exact visual SKU/pack match or image-use permission.",
  };

  const artifactDir = path.join(root, "artifacts");
  const docsDir = path.join(root, "docs");
  fs.mkdirSync(artifactDir, { recursive: true });
  fs.mkdirSync(docsDir, { recursive: true });
  fs.writeFileSync(path.join(artifactDir, "product-image-url-audit.json"), JSON.stringify(payload, null, 2));
  const report = [
    "# Product image URL audit",
    "",
    "- Generated: " + payload.generatedAt,
    "- Product records: " + payload.recordCount,
    "- Records with image URLs: " + payload.recordsWithImageUrl,
    "- Unique image URLs checked: " + payload.uniqueImageUrls,
    "- Missing image URLs: " + missing.length,
    "- Failed HTTP/MIME checks: " + failed.length,
    "",
    "| Product ID | Product | HTTP | MIME | Result |",
    "|---|---|---:|---|---|",
    ...records.map((record) => {
      const url = record.image && typeof record.image.url === "string" ? record.image.url.trim() : "";
      const check = url ? checks.get(url) : null;
      return "| " + record.id + " | " + record.name.replace(/\|/g, "\\|") + " | " +
        (check?.status ?? "—") + " | " + (check?.contentType || "—") + " | " +
        (!url ? "MISSING" : check?.ok ? "PASS" : "FAIL") + " |";
    }),
    "",
    "## Limitations",
    "",
    "- HTTP 200/206 and image MIME confirm transport only.",
    "- Exact product, variant, colour/shade and pack-size matching requires visual review.",
    "- Image-use permission must be confirmed separately.",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(docsDir, "product-image-url-audit.md"), report);

  console.log("Product records: " + records.length);
  console.log("Records with image URLs: " + payload.recordsWithImageUrl);
  console.log("Unique image URLs checked: " + payload.uniqueImageUrls);
  console.log("Missing image URLs: " + missing.length);
  console.log("Failed HTTP/MIME checks: " + failed.length);
  if (missing.length || failed.length) {
    for (const item of missing) console.error("MISSING | " + item.id + " | " + item.name);
    for (const item of failed) console.error("FAILED | " + item.url + " | " + (item.error || item.status));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
