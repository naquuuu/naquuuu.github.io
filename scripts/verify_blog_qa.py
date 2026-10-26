#!/usr/bin/env python3
"""Blog Reliability QA Gate - 6 gates per AGENTS.md / CI workflow.

Gates:
  1. Zero inline width (style="...width") + copy hygiene (no em-dashes in body copy)
  2. Subpage anchor integrity (every in-page href="#x" resolves to a DOM id)
  3. Responsive baseline (viewport meta everywhere; overflow-x clip; mobile media query)
  4. Valid audio/media (metadata preload, button-driven, ended-loop, no autoplay/loop/mousemove)
  5. Typography & a11y baseline (72ch essay column, 44px touch targets, 16px inputs, charset)
  6. Noindex (every page carries robots noindex; no sitemap; robots.txt never blocks the crawl)

Stdlib only. Cross-platform. Exit 1 on any failure.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import urljoin, urlparse

ROOT = Path(__file__).resolve().parent.parent
CSS_PATH = ROOT / "assets" / "css" / "style.css"
JS_PATH = ROOT / "assets" / "js" / "main.js"
SITEMAP_PATH = ROOT / "sitemap.xml"
ROBOTS_PATH = ROOT / "robots.txt"
SITE_URL = "https://naquuuu.github.io/"
CURRENT_ASSET_VERSION = "20261022ui"
# non-creative pages must carry a blueprint flowchart (STYLE_BIBLE 2.8); the two creative essays are exempt
FLOWCHART_REQUIRED = {
    "blog/building-an-autonomous-product-operating-system/index.html",
    "blog/reverse-engineering-client-binaries/index.html",
    "performance/recovery/index.html",
    "experience/mapclub/index.html",
    "experience/traveloka/index.html",
    "experience/bcg/index.html",
}
EXCLUDE_PARTS = {"_revamp", "drafts", ".git", ".github", ".vscode", "node_modules"}
# the site is kept out of search results on purpose (2026-10-26): every page must carry this
NOINDEX_RE = re.compile(r'<meta name="robots" content="[^"]*\bnoindex\b[^"]*"', re.IGNORECASE)

PRIVATE_EDITION_PAGES = {
    "for-ai/index.html", "for-ai/booklet/index.html", "for-ai/kitchen/index.html",
}

failures: list[str] = []
passes: list[str] = []


def gate_result(name: str, ok: bool, details: list[str]) -> None:
    label = "PASS" if ok else "FAIL"
    (passes if ok else failures).append(name)
    print(f"\n[GATE {name}] {label}")
    for d in details:
        print(f"  - {d}")


def iter_html():
    for p in sorted(ROOT.rglob("*.html")):
        if any(part in p.parts for part in EXCLUDE_PARTS):
            continue
        yield p


def strip_noncopy(html: str) -> str:
    html = re.sub(r"<!--.*?-->", " ", html, flags=re.DOTALL)
    html = re.sub(r"<script\b.*?</script>", " ", html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r"<style\b.*?</style>", " ", html, flags=re.DOTALL | re.IGNORECASE)
    return html


def page_url(rel: str) -> str:
    """Publish url of a page path relative to the blog root (directory urls)."""
    if rel == "index.html":
        return SITE_URL
    return SITE_URL + rel[: -len("index.html")] if rel.endswith("index.html") else SITE_URL + rel


def main() -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

    print("=== Blog Reliability QA Gate ===")
    print(f"root: {ROOT}")

    htmls = list(iter_html())
    if not htmls:
        print("ERROR: no html files found")
        return 1

    # ---- Gate 1: inline width + em-dash copy hygiene ----
    d1: list[str] = []
    em = "\u2014"
    en = "\u2013"
    for p in htmls:
        text = p.read_text(encoding="utf-8", errors="replace")
        for m in re.finditer(r'style="[^"]*width', text, flags=re.IGNORECASE):
            line = text.count("\n", 0, m.start()) + 1
            d1.append(f"inline width: {p.relative_to(ROOT)}:{line}")
        body = strip_noncopy(text)
        if p.relative_to(ROOT).as_posix() in PRIVATE_EDITION_PAGES:
            # Owner-approved private edition uses these exact date labels.
            # Other punctuation and all inline-width checks remain enforced.
            body = body.replace("24—25 october 2026", "24-25 october 2026")
            body = body.replace("24–25 october 2026", "24-25 october 2026")
        for ch, label in ((em, "em-dash"), (en, "en-dash")):
            if ch in body:
                first_line = body[: body.index(ch)].count("\n") + 1
                d1.append(f"{label} in copy: {p.relative_to(ROOT)}:{first_line}")
    gate_result("1. inline-width + copy hygiene", not d1, d1 or ["0 inline width styles, 0 em/en-dashes in copy"])

    # ---- Gate 2: anchor integrity ----
    d2: list[str] = []
    for p in htmls:
        text = strip_noncopy(p.read_text(encoding="utf-8", errors="replace"))
        ids = set(re.findall(r'id="([^"]+)"', text))
        for href in re.findall(r'href="#([^"]+)"', text):
            if href and href not in ids:
                d2.append(f'unresolved #{href} -> {p.relative_to(ROOT)}')
    gate_result("2. subpage anchor integrity", not d2, d2 or [f"all in-page anchors resolve across {len(htmls)} pages"])

    # ---- Gate 3: responsive baseline ----
    d3: list[str] = []
    for p in htmls:
        text = p.read_text(encoding="utf-8", errors="replace")
        if 'name="viewport"' not in text:
            d3.append(f"missing viewport meta: {p.relative_to(ROOT)}")
    css = CSS_PATH.read_text(encoding="utf-8", errors="replace") if CSS_PATH.exists() else ""
    if "overflow-x: clip" not in css:
        d3.append("style.css missing overflow-x: clip")
    if "@media (max-width: 600px" not in css and "@media (max-width: 768px)" not in css:
        d3.append("style.css missing mobile media query")
    if "min-width: 0" not in css:
        d3.append("style.css missing min-width: 0 flex/grid guard")
    stale_refs: list[str] = []
    for p in htmls:
        text = p.read_text(encoding="utf-8", errors="replace")
        for m in re.finditer(r'(?:href|src)="([^"]*(?:style\.css|main\.js)[^"]*)"', text):
            ref = m.group(1)
            if f"?v={CURRENT_ASSET_VERSION}" not in ref:
                stale_refs.append(f"stale asset ref '{ref}' -> {p.relative_to(ROOT)}")
    d3.extend(stale_refs)
    gate_result("3. responsive baseline + asset cache currency", not d3,
                d3 or [f"viewport meta on all {len(htmls)} pages; CSS mobile guards present; all asset refs ?v={CURRENT_ASSET_VERSION}"])

    # ---- Gate 4: valid audio/media ----
    d4: list[str] = []
    index_text = (ROOT / "index.html").read_text(encoding="utf-8", errors="replace")
    audio_tags = re.findall(r"<audio\b[^>]*>", index_text)
    if audio_tags:
        for tag in audio_tags:
            if "autoplay" in tag:
                d4.append("audio tag has autoplay attribute")
            if 'preload="metadata"' not in tag:
                d4.append("audio tag missing preload=metadata")
            if re.search(r"\bloop\b", tag):
                d4.append("audio tag uses loop attribute (must use ended-loop)")
    js = JS_PATH.read_text(encoding="utf-8", errors="replace") if JS_PATH.exists() else ""
    if audio_tags:
        if "mousemove" in js:
            d4.append("main.js binds audio to mousemove")
        if '"scroll"' in js and re.search(r"scroll['\"]\s*,\s*[^)]*play", js):
            d4.append("main.js appears to play audio on scroll")
        if ".addEventListener('ended'" not in js and '.addEventListener("ended"' not in js:
            d4.append("main.js missing ended-loop handler")
    gate_result("4. valid audio/media", not d4, d4 or ["audio: metadata preload, no autoplay/loop attr, button-driven, ended-loop present"])

    # ---- Gate 5: typography & a11y baseline ----
    d5: list[str] = []
    if CSS_PATH.exists():
        if "max-width: 72ch" not in css:
            d5.append("style.css missing 72ch essay reading column")
        if "min-height: 44px" not in css:
            d5.append("style.css missing 44px touch target floor")
        if "font-size: 16px" not in css:
            d5.append("style.css missing 16px input font floor")
    else:
        d5.append("style.css not found")
    for p in htmls:
        text = p.read_text(encoding="utf-8", errors="replace")
        if not re.search(r"charset\s*=\s*[\"']?utf-8", text, flags=re.IGNORECASE):
            d5.append(f"missing UTF-8 charset: {p.relative_to(ROOT)}")
        for m in re.finditer(r"<img\b(?![^>]*\balt=)[^>]*>", text):
            line = text.count("\n", 0, m.start()) + 1
            d5.append(f"img missing alt: {p.relative_to(ROOT)}:{line}")
        rel = p.relative_to(ROOT).as_posix()
        if rel in FLOWCHART_REQUIRED:
            if "flowchart-whiteboard-box" not in text:
                d5.append(f"missing blueprint flowchart: {rel}")
            elif "principle-strip" not in text:
                d5.append(f"flowchart missing principle strip: {rel}")
        if not p.name.startswith("_") and re.search(r"Space[+ ]Grotesk|Syne", text):
            d5.append(f"retired font referenced (ADR-035): {p.relative_to(ROOT)}")
    gate_result("5. typography & a11y baseline", not d5, d5 or ["72ch column, 44px targets, 16px inputs, charset + alt everywhere"])

    # ---- Gate 6: noindex ----
    d6: list[str] = []
    for p in htmls:
        if p.name.startswith("_"):  # jekyll never publishes underscore files
            continue
        if not NOINDEX_RE.search(p.read_text(encoding="utf-8", errors="replace")):
            d6.append(f"missing robots noindex meta: {p.relative_to(ROOT)}")
    if SITEMAP_PATH.exists():
        d6.append("sitemap.xml exists (a noindex site must not advertise its pages)")
    robots = ROBOTS_PATH.read_text(encoding="utf-8", errors="replace") if ROBOTS_PATH.exists() else ""
    if re.search(r"(?im)^\s*sitemap:", robots):
        d6.append("robots.txt advertises a sitemap")
    # a Disallow would stop crawlers from ever reading the noindex tag, so indexed urls would stay listed
    if re.search(r"(?im)^\s*disallow:\s*/\s*$", robots):
        d6.append("robots.txt disallows the whole site (crawlers could not read the noindex tag)")
    for rel in sorted(PRIVATE_EDITION_PAGES):
        private_page = ROOT / rel
        if not private_page.exists():
            d6.append(f"private edition page missing: {rel}")
            continue
        private_html = private_page.read_text(encoding="utf-8")
        robots_meta = NOINDEX_RE.search(private_html)
        if not robots_meta or "nofollow" not in robots_meta.group(0):
            d6.append(f"private edition missing noindex,nofollow: {rel}")
        front_matter = re.match(r'\A---\n(.*?)\n---(?:\n|$)', private_html, re.DOTALL)
        if not front_matter:
            d6.append(f"private edition missing complete Jekyll front matter: {rel}")
        if not front_matter or not re.search(r'(?m)^sitemap:\s*false\s*$', front_matter.group(1)):
            d6.append(f"private edition missing sitemap exclusion: {rel}")
    for surface in ("index.html", "blog/index.html", "feed.xml", "assets/js/palette.js"):
        if "/for-ai" in (ROOT / surface).read_text(encoding="utf-8"):
            d6.append(f"private edition exposed on public discovery surface: {surface}")
    for public_page in htmls:
        rel = public_page.relative_to(ROOT).as_posix()
        if rel.startswith("for-ai/"):
            continue
        public_html = public_page.read_text(encoding="utf-8")
        for href in re.findall(r'href=["\']([^"\']+)["\']', public_html, re.IGNORECASE):
            destination = urlparse(urljoin(page_url(rel), href))
            if destination.hostname in {"naquuuu.github.io", "naquuuu.xyz", "www.naquuuu.xyz"} and (
                destination.path == "/for-ai" or destination.path.startswith("/for-ai/")
            ):
                d6.append(f"private edition linked from public HTML: {rel}")
    gate_result("6. noindex", not d6,
                d6 or [f"robots noindex on all {len(htmls)} pages; no sitemap; robots.txt allows the crawl"])

    # ---- summary ----
    print("\n=== SUMMARY ===")
    for name in passes:
        print(f"  PASS  {name}")
    for name in failures:
        print(f"  FAIL  {name}")
    total = len(passes) + len(failures)
    print(f"\n{len(passes)}/{total} gates passed")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
