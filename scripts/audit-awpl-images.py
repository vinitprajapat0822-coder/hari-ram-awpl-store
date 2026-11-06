#!/usr/bin/env python3
"""Audit AWPL product image URLs for HTTP 200 and image/* content type.

This checks transport and MIME type only. It cannot prove that an image depicts
the exact product/SKU; that requires a human comparison with the official listing.
"""
from __future__ import annotations

import csv
import json
import re
import sys
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

SOURCE = Path("src/data/awpl-products.ts")
OUT_DIR = Path("artifacts")
URL_RE = re.compile(r'https://awpl-kycdocs[.]s3[.]ap-south-1[.]amazonaws[.]com/[^\"]+')
ID_RE = re.compile(r'id: *"([^"]+)"')
NAME_RE = re.compile(r'name: *"([^"]+)"')
TIMEOUT_SECONDS = 25
RETRIES = 2


def collect_records(text: str) -> list[dict[str, str]]:
    records: list[dict[str, str]] = []
    current_id = ""
    current_name = ""
    seen: set[str] = set()
    for line in text.splitlines():
        id_match = ID_RE.search(line)
        name_match = NAME_RE.search(line)
        if id_match:
            current_id = id_match.group(1)
        if name_match:
            current_name = name_match.group(1)
        for url in URL_RE.findall(line):
            if url in seen:
                continue
            seen.add(url)
            records.append({
                "id": current_id,
                "name": current_name,
                "url": url,
            })
    return records


def audit(record: dict[str, str]) -> dict[str, object]:
    result: dict[str, object] = {
        **record,
        "http_status": None,
        "content_type": "",
        "final_url": "",
        "bytes_read": 0,
        "transport_ok": False,
        "image_content_type": False,
        "result": "FAILED",
        "error": "",
    }
    for attempt in range(RETRIES + 1):
        try:
            request = Request(
                record["url"],
                headers={
                    "User-Agent": "HariRamAWPLStore-ImageAudit/1.0",
                },
                method="GET",
            )
            with urlopen(request, timeout=TIMEOUT_SECONDS) as response:
                status = response.status
                content_type = response.headers.get("Content-Type", "").split(";")[0].strip().lower()
                sample = response.read(64)
                result.update({
                    "http_status": status,
                    "content_type": content_type,
                    "final_url": response.geturl(),
                    "bytes_read": len(sample),
                    "transport_ok": status == 200,
                    "image_content_type": content_type.startswith("image/"),
                    "result": "HTTP_200_IMAGE" if status == 200 and content_type.startswith("image/") else "REVIEW",
                })
                if status != 200:
                    result["error"] = "Expected HTTP 200"
                elif not content_type.startswith("image/"):
                    result["error"] = "Content-Type is not image/*"
                return result
        except HTTPError as exc:
            result["http_status"] = exc.code
            result["error"] = f"HTTPError: {exc.code}"
        except (URLError, TimeoutError, OSError) as exc:
            result["error"] = f"{type(exc).__name__}: {exc}"
        if attempt < RETRIES:
            time.sleep(1.5 * (attempt + 1))
    return result


def main() -> int:
    if not SOURCE.exists():
        print(f"Missing source file: {SOURCE}", file=sys.stderr)
        return 2
    records = collect_records(SOURCE.read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    results = [audit(record) for record in records]

    json_path = OUT_DIR / "awpl-image-audit.json"
    csv_path = OUT_DIR / "awpl-image-audit.csv"
    json_path.write_text(json.dumps(results, indent=2), encoding="utf-8")
    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(results[0].keys()) if results else [
            "id", "name", "url", "http_status", "content_type", "final_url",
            "bytes_read", "transport_ok", "image_content_type", "result", "error"
        ])
        writer.writeheader()
        writer.writerows(results)

    ok = sum(row["result"] == "HTTP_200_IMAGE" for row in results)
    failed = len(results) - ok
    print(f"Unique image URLs: {len(results)}")
    print(f"HTTP 200 + image/*: {ok}")
    print(f"Failed / needs review: {failed}")
    print("NOTE: A successful HTTP/MIME check does NOT verify exact SKU identity.")
    print(f"Reports: {json_path}, {csv_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
