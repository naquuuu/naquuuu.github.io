#!/usr/bin/env python3
"""Blog Reliability QA Gate - 5 gates per AGENTS.md / CI workflow.

Gates:
  1. Zero inline width (style="...width") + copy hygiene (no em-dashes in body copy)
  2. Subpage anchor integrity (every in-page href="#x" resolves to a DOM id)
  3. Responsive baseline (viewport meta everywhere; overflow-x clip; mobile media query)
  4. Valid audio/media (metadata preload, button-driven, ended-loop, no autoplay/loop/mousemove)
  5. Typography & a11y baseline (72ch essay column, 44px touch targets, 16px inputs, charset)

Stdlib only. Cross-platform. Exit 1 on any failure.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSS_PATH = ROOT / "assets" / "css" / "style.css"
JS_PATH = ROOT / "assets" / "js" / "main.js"
CURRENT_ASSET_VERSION = "20260917a"
EXCLUDE_PARTS = {"_revamp", "drafts", ".git", ".github", ".vscode", "node_modules"}

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
    gate_result("5. typography & a11y baseline", not d5, d5 or ["72ch column, 44px targets, 16px inputs, charset + alt everywhere"])

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
