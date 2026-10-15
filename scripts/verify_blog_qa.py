#!/usr/bin/env python3
"""Blog Reliability QA Gate - 6 gates per AGENTS.md / CI workflow.

Gates:
  1. Zero inline width (style="...width") + copy hygiene (no em-dashes in body copy)
  2. Subpage anchor integrity (every in-page href="#x" resolves to a DOM id)
  3. Responsive baseline (viewport meta everywhere; overflow-x clip; mobile media query)
  4. Valid audio/media (metadata preload, button-driven, ended-loop, no autoplay/loop/mousemove)
  5. Typography & a11y baseline (72ch essay column, 44px touch targets, 16px inputs, charset)
  6. Sitemap freshness (absolute urls, lastmod == committed date, no shells or utility pages)

Stdlib only. Cross-platform. Exit 1 on any failure.
"""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parent.parent
CSS_PATH = ROOT / "assets" / "css" / "style.css"
JS_PATH = ROOT / "assets" / "js" / "main.js"
SITEMAP_PATH = ROOT / "sitemap.xml"
ROBOTS_PATH = ROOT / "robots.txt"
SITE_URL = "https://naquuuu.github.io/"
CURRENT_ASSET_VERSION = "20261015ide"
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
# pages that must never appear in sitemap.xml: noindex redirect shells and utility pages
NOT_IN_SITEMAP = {
    "about/index.html": "noindex redirect shell",
    "portfolio/index.html": "noindex redirect shell",
    "404.html": "utility page",
    "performance/recovery/session-map.html": "utility page",
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


def git_last_commit_date(rel: str) -> str:
    """Committed (HEAD) date of a repo path as YYYY-MM-DD, or "" when unknown."""
    try:
        out = subprocess.run(
            ["git", "-C", str(ROOT), "log", "-1", "--format=%cs", "--", rel],
            capture_output=True, text=True,
        )
    except (OSError, subprocess.SubprocessError):
        return ""
    return out.stdout.strip() if out.returncode == 0 else ""


def lastmod_mismatch(url: str, found: str | None, expected: str) -> str | None:
    """None when the sitemap lastmod matches the committed date, else a specific message."""
    if found is None:
        return f"sitemap missing <lastmod> for {url} (git date {expected or 'unknown'})"
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", found):
        return f"sitemap lastmod not YYYY-MM-DD for {url}: found '{found}', git date '{expected}'"
    if found != expected:
        return f"sitemap lastmod stale for {url}: found '{found}', git date '{expected}'"
    return None


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

    # ---- Gate 6: sitemap freshness ----
    d6: list[str] = []
    sitemap_locs: dict[str, str | None] = {}
    if not SITEMAP_PATH.exists():
        d6.append("sitemap.xml not found")
    else:
        try:
            sitemap_root = ElementTree.fromstring(SITEMAP_PATH.read_text(encoding="utf-8", errors="replace"))
        except ElementTree.ParseError as exc:
            sitemap_root = None
            d6.append(f"sitemap.xml does not parse as XML: {exc}")
        if sitemap_root is not None:
            if not sitemap_root.tag.endswith("urlset"):
                d6.append(f"sitemap.xml root element is '{sitemap_root.tag}', expected 'urlset'")
            for url_el in sitemap_root:
                loc_el = url_el.find("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")
                if loc_el is None or not (loc_el.text or "").strip():
                    d6.append("sitemap.xml <url> entry without <loc>")
                    continue
                loc = loc_el.text.strip()
                lastmod_el = url_el.find("{http://www.sitemaps.org/schemas/sitemap/0.9}lastmod")
                sitemap_locs[loc] = lastmod_el.text.strip() if lastmod_el is not None and lastmod_el.text else None
                if not loc.startswith(SITE_URL):
                    d6.append(f"sitemap url is not absolute under {SITE_URL}: {loc}")

    listed = set(sitemap_locs)
    content_pages = [
        p for p in htmls
        if not p.name.startswith("_")
        and p.relative_to(ROOT).as_posix() not in NOT_IN_SITEMAP
    ]
    for p in content_pages:
        rel = p.relative_to(ROOT).as_posix()
        url = page_url(rel)
        if url not in sitemap_locs:
            d6.append(f"sitemap missing content page {url} ({rel})")
            continue
        expected = git_last_commit_date(rel)
        if not expected:
            d6.append(f"sitemap lastmod not verifiable for {url}: no committed git date for {rel}")
            continue
        issue = lastmod_mismatch(url, sitemap_locs[url], expected)
        if issue:
            d6.append(issue)

    for rel, kind in NOT_IN_SITEMAP.items():
        url = page_url(rel)
        if url in listed:
            d6.append(f"sitemap must not list {url} ({rel} is a {kind})")
    for p in htmls:
        if p.name.startswith("_"):
            url = page_url(p.relative_to(ROOT).as_posix())
            if url in listed:
                d6.append(f"sitemap must not list {url} (draft page)")

    robots = ROBOTS_PATH.read_text(encoding="utf-8", errors="replace") if ROBOTS_PATH.exists() else ""
    if not re.search(rf"(?im)^\s*sitemap:\s*{re.escape(SITE_URL)}sitemap\.xml\s*$", robots):
        d6.append(f"robots.txt does not point at {SITE_URL}sitemap.xml")

    gate_result("6. sitemap freshness", not d6,
                d6 or [f"{len(content_pages)} content pages listed with lastmod == git date; "
                       f"no shells or utility pages; robots.txt points at the sitemap; all urls absolute"])

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
