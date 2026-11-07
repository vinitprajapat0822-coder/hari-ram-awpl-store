#!/usr/bin/env python3
"""Find exact-title AWPL product image candidates from official category HTML.

This script only discovers image URLs. It never edits product data or promotes
an image status. Every candidate must have an exact product-name match in an
official product-category image alt/title attribute.
"""
from __future__ import annotations

import json
import re
import time
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

OUT = Path("artifacts")
PAGES = {
    "sniss-cosmetic": "https://www.asclepiuswellness.com/product/sniss-cosmetic/",
    "apparels": "https://www.asclepiuswellness.com/product/apparels/",
}
TARGETS = [
    {"id": "awpl-cosmetic-blurr-loose-powder-white-touch", "name": "BLURR LOOSE POWDER-WHITE TOUCH", "category": "sniss-cosmetic"},
    {"id": "awpl-cosmetic-lumitouch-compact-soft-sand", "name": "LUMITOUCH COMPACT POWDER-SOFT SAND", "category": "sniss-cosmetic"},
    {"id": "awpl-cosmetic-diamond-bomb-highlighter-champagne", "name": "DIAMOND BOMB HIGHLIGHTER-SPARKLING CHAMPAGNE", "category": "sniss-cosmetic"},
    {"id": "awpl-cosmetic-eyeliner-holographic-peacock", "name": "EYELINER HOLOGRAPHIC-PEACOCK GREEN HALO", "category": "sniss-cosmetic"},
    {"id": "awpl-cosmetic-matte-eye-liner-black", "name": "MATTE EYE LINER BLACK", "category": "sniss-cosmetic"},
    {"id": "awpl-cosmetic-cream-lipstick-dusky-rose", "name": "ALL DAY LUXE CREAM LIPSTICK-DUSKY ROSE", "category": "sniss-cosmetic"},
    {"id": "awpl-cosmetic-liquid-lipstick-fine-wine", "name": "LUXE MATTE LIQUID LIPSTICK-FINE WINE", "category": "sniss-cosmetic"},
    {"id": "awpl-apparels-asclepius-women-suits", "name": "ASCLEPIUS WOMEN SUITS", "category": "apparels"},
    {"id": "awpl-apparels-asclepius-tie-black", "name": "ASCLEPIUS TIE -BLACK", "category": "apparels"},
]
IMAGE_HOST = "awpl-kycdocs.s3.ap-south-1.amazonaws.com"


def normalise(value: str) -> str:
    return re.sub(r"[^A-Z0-9]+", "", value.upper())


class ImageParser(HTMLParser):
    def __init__(self, page_url: str) -> None:
        super().__init__(convert_charrefs=True)
        self.page_url = page_url
        self.images: list[dict[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() != "img":
            return
        values = {key.lower(): (value or "").strip() for key, value in attrs}
        labels = [values.get("alt", ""), values.get("title", "")]
        raw_urls = [
            values.get("src", ""),
            values.get("data-src", ""),
            values.get("data-original", ""),
            values.get("data-lazy-src", ""),
            values.get("data-zoom-image", ""),
        ]
        srcset = values.get("srcset", "") or values.get("data-srcset", "")
        if srcset:
            raw_urls.extend(part.strip().split()[0] for part in srcset.split(",") if part.strip())

        for label in labels:
            if not label:
                continue
            for raw in raw_urls:
                if not raw or raw.startswith("data:"):
                    continue
                absolute = urljoin(self.page_url, raw)
                parsed = urlparse(absolute)
                if parsed.scheme != "https" or parsed.hostname != IMAGE_HOST:
                    continue
                if parsed.path.lower().endswith("/image.jpg") or parsed.path.lower().endswith("/no-image.jpg"):
                    continue
                self.images.append({
                    "label": label,
                    "url": absolute,
                    "page_url": self.page_url,
                })


def fetch_page(url: str) -> tuple[str | None, str]:
    request = Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; HariRamAWPLCatalogueAudit/1.0)",
            "Accept": "text/html,application/xhtml+xml",
        },
    )
    for attempt in range(3):
        try:
            with urlopen(request, timeout=25) as response:
                content_type = response.headers.get("Content-Type", "")
                if response.status != 200:
                    return None, f"HTTP_{response.status}"
                if "html" not in content_type.lower():
                    return None, f"UNEXPECTED_CONTENT_TYPE:{content_type}"
                return response.read().decode("utf-8", errors="replace"), "OK"
        except HTTPError as exc:
            status = f"HTTP_{exc.code}"
        except (URLError, TimeoutError, OSError) as exc:
            status = f"{type(exc).__name__}:{exc}"
        if attempt < 2:
            time.sleep(attempt + 1)
    return None, status


def verify_candidate(url: str) -> dict[str, object]:
    request = Request(url, headers={"User-Agent": "HariRamAWPLStore-ImageAudit/1.0"}, method="GET")
    try:
        with urlopen(request, timeout=20) as response:
            content_type = response.headers.get("Content-Type", "").split(";")[0].strip().lower()
            sample = response.read(64)
            return {
                "http_status": response.status,
                "content_type": content_type,
                "image_content_type": content_type.startswith("image/"),
                "bytes_read": len(sample),
                "transport_status": "HTTP_200" if response.status == 200 else f"HTTP_{response.status}",
            }
    except HTTPError as exc:
        return {"http_status": exc.code, "content_type": "", "image_content_type": False, "bytes_read": 0, "transport_status": f"HTTP_{exc.code}"}
    except (URLError, TimeoutError, OSError) as exc:
        return {"http_status": None, "content_type": "", "image_content_type": False, "bytes_read": 0, "transport_status": f"{type(exc).__name__}:{exc}"}


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    page_images: list[dict[str, str]] = []
    page_status: dict[str, str] = {}

    for category, url in PAGES.items():
        html, status = fetch_page(url)
        page_status[category] = status
        if html is None:
            continue
        parser = ImageParser(url)
        parser.feed(html)
        page_images.extend(parser.images)

    results = []
    for target in TARGETS:
        exact = [
            item for item in page_images
            if normalise(item["label"]) == normalise(target["name"])
        ]
        # Keep stable unique URLs, retaining all matching alt text and official source page.
        unique: dict[str, dict[str, str]] = {}
        for item in exact:
            unique[item["url"]] = item

        candidates = []
        for candidate in unique.values():
            transport = verify_candidate(candidate["url"])
            candidates.append({**candidate, **transport})

        results.append({
            **target,
            "match_status": "EXACT_ALT_MATCH" if candidates else "NO_EXACT_ALT_MATCH",
            "candidate_count": len(candidates),
            "candidates": candidates,
        })

    payload = {
        "source_pages": PAGES,
        "page_fetch_status": page_status,
        "note": "Exact image alt/title match plus HTTP/MIME checks are discovery evidence only. Human visual SKU/pack review and use-permission review remain separate.",
        "results": results,
    }

    (OUT / "missing-awpl-image-candidates.json").write_text(
        json.dumps(payload, indent=2), encoding="utf-8"
    )

    lines = [
        "# Missing AWPL product image candidate audit",
        "",
        "| Product ID | Product | Match status | Candidates |",
        "|---|---|---|---:|",
    ]
    for item in results:
        lines.append(
            f"| {item['id']} | {item['name']} | {item['match_status']} | {item['candidate_count']} |"
        )
    lines.extend(["", "## Candidate details", ""])
    for item in results:
        lines.append(f"### {item['name']} ({item['id']})")
        if not item["candidates"]:
            lines.append("- No exact official image alt/title match extracted.")
        for candidate in item["candidates"]:
            lines.append(f"- URL: {candidate['url']}")
            lines.append(f"  - Alt/title: {candidate['label']}")
            lines.append(f"  - Transport: {candidate['transport_status']}")
            lines.append(f"  - Content-Type: {candidate['content_type'] or 'not detected'}")
            lines.append(f"  - Source page: {candidate['page_url']}")
        lines.append("")
    lines.extend([
        "## Important limitations",
        "",
        "- This report does not edit the catalogue.",
        "- Do not promote an image to VERIFIED solely from URL or MIME checks.",
        "- Confirm exact product name, shade/colour and pack details visually.",
        "- Confirm image-use permission separately.",
        "",
    ])
    (OUT / "missing-awpl-image-candidates.md").write_text("\n".join(lines), encoding="utf-8")

    exact_total = sum(item["candidate_count"] for item in results)
    print(f"Target products: {len(results)}")
    print(f"Products with exact image alt/title candidates: {sum(bool(item['candidate_count']) for item in results)}")
    print(f"Total unique candidate URLs: {exact_total}")
    for category, status in page_status.items():
        print(f"Source page {category}: {status}")
    for item in results:
        print(f"{item['id']} | {item['match_status']} | {item['candidate_count']}")
    print("Reports: artifacts/missing-awpl-image-candidates.json and .md")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
