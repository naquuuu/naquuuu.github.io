#!/usr/bin/env python3
"""Deterministic essay scaffolder and mechanical checker for naquuuu.github.io.

Two modes. No model calls, no API keys, no prose invention.

  scaffold  render the STYLE_BIBLE 2.1 skeleton, write the page, register the
            archive card as the FIRST child of .essay-grid, and recompute the
            three .filter-count values by counting real data-theme attributes.
            Never increments a number blindly.
  check     re-implement the mechanical subset of the STYLE_BIBLE section 7
            acceptance rubric: checks 1, 2, 3, 7 and 8b.

Every version-shaped value is read from the repo, never hardcoded:
  - CURRENT_ASSET_VERSION is parsed out of scripts/verify_blog_qa.py
  - the favicon version is parsed out of the newest blog/blog/*/index.html
  - the byline opening and the canonical footer address are read out of the
    published pages, so this file carries no personal identifier at all
  - the proper-noun allowlist and the descriptor closed set are parsed out of
    internal-docs/STYLE_BIBLE.md, resolved from NAQUUUU_WORKSPACE

Stdlib only. Python 3.10+. Cross-platform. Exit 1 on any failure.
"""
from __future__ import annotations

import argparse
import bisect
import datetime
import html
import json
import os
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from typing import NamedTuple

TOOL_VERSION = "1.0.0"

ROOT = Path(__file__).resolve().parent.parent
BLOG_DIR = ROOT / "blog"
ARCHIVE_INDEX = BLOG_DIR / "index.html"
QA_SCRIPT = ROOT / "scripts" / "verify_blog_qa.py"

LENSES = ("culture", "systems")
THEME_COLOR = {"culture": "#1B1214", "systems": "#120305"}
DEFAULT_READ_TIME = {"culture": "6 min read", "systems": "8 min read"}
PREFERRED_DESCRIPTOR = {"culture": "notes on style", "systems": "notes on tools"}
READ_TIME_BAND = {"culture": (4, 6), "systems": (7, 9)}
SITE_ORIGIN = "https://naquuuu.github.io/blog/"

BULLET = "\u2022"
LEFT_ARROW = "\u2190"
UP_RIGHT_ARROW = "\u2197"
DASH_CHARS = ("\u2014", "\u2013")

# The one scaffolding token the scaffolder is allowed to write into a body.
# STYLE_BIBLE 8f treats drafting residue as a publish blocker, and this is
# exactly that: a visible reminder for the drafting agent, not prose.
SCAFFOLD_MARKER = "TODO(naquuuu-curator)"

MONTH_FULL = (
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december",
)
MONTH_ABBR = (
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
)

# STYLE_BIBLE 7 check 1. U+2012 (figure dash) is named in the style bible but
# is not in this list; the gate does not catch it either. Known gap.
DASH_PATTERNS: tuple[tuple[str, str], ...] = (
    ("\u2014", "em dash U+2014"),
    ("\u2013", "en dash U+2013"),
    ("&mdash;", "html entity &mdash;"),
    ("&ndash;", "html entity &ndash;"),
    ("&#8212;", "numeric entity &#8212;"),
    ("&#8211;", "numeric entity &#8211;"),
)

# The gate's own regex, ported verbatim so a pass here cannot disagree with
# scripts/verify_blog_qa.py.
INLINE_WIDTH_RE = re.compile(r'style="[^"]*width', re.IGNORECASE)

# STYLE_BIBLE 1.7 and 7 check 8b.
CLAIM_PATTERNS: tuple[tuple[str, str], ...] = (
    (r"\d+(?:\.\d+)?\s?%", "percentage figure"),
    (r"\bpercents?\b", "percentage word"),
    (r"\b\d+(?:\.\d+)?\s?ms\b", "millisecond figure"),
    (r"\bmilliseconds?\b", "millisecond word"),
    (r"\b\d+(?:\.\d+)?\s?fps\b", "frame rate"),
    (r"\b\d+(?:\.\d+)?\s?(?:hz|khz|mhz)\b", "frequency figure"),
    (r"\b\d+(?:\.\d+)?x\b", "multiplier"),
    (r"\b\d[\d,.]*\s?(?:users?|subscribers?|downloads?|visitors?|installs?)\b", "user count"),
)

ALPHABETIC_RUN_RE = re.compile(r"[A-Za-z]+(?:['\u2019][A-Za-z]+)*")


class ToolError(Exception):
    """Fatal, user-facing error. Printed as one line, never a traceback."""


# ---------------------------------------------------------------- io helpers


def read_text(path: Path) -> str:
    """Read a file preserving its exact line endings."""
    with open(path, "r", encoding="utf-8", newline="") as fh:
        return fh.read()


def write_text(path: Path, data: str) -> None:
    """Write a file preserving the line endings already in `data`."""
    with open(path, "w", encoding="utf-8", newline="") as fh:
        fh.write(data)


def utf8_stdout() -> None:
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


def out(line: str = "") -> None:
    print(line)


# --------------------------------------------------------- source resolution


def read_asset_version() -> str:
    """Parse CURRENT_ASSET_VERSION out of the QA gate. Never hardcoded."""
    if not QA_SCRIPT.exists():
        raise ToolError(f"QA gate not found at {QA_SCRIPT}; cannot resolve the asset version")
    match = re.search(
        r'^CURRENT_ASSET_VERSION\s*=\s*"([^"]+)"',
        read_text(QA_SCRIPT),
        re.MULTILINE,
    )
    if not match:
        raise ToolError(
            f"no CURRENT_ASSET_VERSION constant found in {QA_SCRIPT}; refusing to guess an asset version"
        )
    return match.group(1)


def essay_pages() -> list[Path]:
    """blog/blog/*/index.html, newest first, deterministic on mtime then name."""
    pages = [p for p in BLOG_DIR.glob("*/index.html") if p.is_file()]
    return sorted(pages, key=lambda p: (p.stat().st_mtime, p.name), reverse=True)


def read_favicon_version(pages: list[Path]) -> tuple[str, Path]:
    """Parse the newest essay page that carries a favicon.svg?v= reference."""
    for page in pages:
        match = re.search(r"favicon\.svg\?v=([A-Za-z0-9._-]+)", read_text(page))
        if match:
            return match.group(1), page
    raise ToolError(
        "no favicon.svg?v= reference found in any blog/blog/*/index.html; refusing to guess a favicon version"
    )


BYLINE_RE = re.compile(r"by\s+[^<>\n]*?\(\s*krishna\s*/\s*naquuuu\s*\)")


def read_byline_opening(pages: list[Path]) -> str:
    """Read the fixed byline opening (STYLE_BIBLE 2.4) from a published page.

    Parsed rather than hardcoded so this script holds no personal identifier
    and so a byline change on the site propagates on the next scaffold.
    """
    for page in pages:
        match = BYLINE_RE.search(read_text(page))
        if match:
            opening = " ".join(match.group(0).split())
            if any(ch in opening for ch in DASH_CHARS):
                raise ToolError(f"byline opening parsed out of {page.name} contains a dash character")
            return opening
    raise ToolError(
        "could not read the byline opening out of any published essay page; "
        "refusing to invent one (STYLE_BIBLE 2.4 fixes it)"
    )


def read_canonical_email() -> str | None:
    """Read the single canonical footer address already published on the site."""
    for page in [ARCHIVE_INDEX, *essay_pages()]:
        if not page.exists():
            continue
        match = re.search(r'href="mailto:([^"]+)"', read_text(page))
        if match:
            return match.group(1)
    return None


def style_bible_path() -> Path:
    candidates: list[Path] = []
    env_root = os.environ.get("NAQUUUU_WORKSPACE")
    if env_root:
        candidates.append(Path(env_root) / "internal-docs" / "STYLE_BIBLE.md")
    candidates.append(Path(__file__).resolve().parents[2] / "internal-docs" / "STYLE_BIBLE.md")
    candidates.append(Path("C:/personal/naquuuu") / "internal-docs" / "STYLE_BIBLE.md")
    for candidate in candidates:
        if candidate.is_file():
            return candidate
    raise ToolError(
        "STYLE_BIBLE.md not found. Set NAQUUUU_WORKSPACE to the hub root, or keep the "
        "blog repo inside the hub. Refusing to guess the allowlist."
    )


def _slice_section(text: str, start_heading: str, end_heading: str) -> str:
    start = text.find(start_heading)
    end = text.find(end_heading, start + 1) if start >= 0 else -1
    if start < 0 or end < 0:
        raise ToolError(
            f"STYLE_BIBLE.md does not contain the expected section {start_heading!r}"
        )
    return text[start:end]


def parse_allowlist(style_bible: str) -> frozenset[str]:
    """The closed proper-noun allowlist of STYLE_BIBLE 1.1, lowercased."""
    section = _slice_section(style_bible, "### 1.1 lowercase, absolutely", "### 1.2")
    start = section.find("Closed proper-noun allowlist")
    if start < 0:
        raise ToolError("STYLE_BIBLE 1.1 no longer carries the allowlist heading")
    end = section.find("Note:", start)
    tokens = re.findall(r"`([^`]+)`", section[start : end if end > start else len(section)])
    if not tokens:
        raise ToolError("STYLE_BIBLE 1.1 allowlist parsed empty")
    return frozenset(token.lower() for token in tokens)


def parse_descriptors(style_bible: str) -> dict[str, list[str]]:
    """The byline descriptor closed set of STYLE_BIBLE 2.4, keyed by lens."""
    section = _slice_section(style_bible, "### 2.4 the byline", "### 2.5")
    start = section.find("closed set:")
    end = section.find("Nothing else", start)
    if start < 0 or end < 0:
        raise ToolError("STYLE_BIBLE 2.4 no longer carries the descriptor closed set")
    table: dict[str, list[str]] = {"culture": [], "systems": []}
    for line in section[start:end].splitlines():
        item = re.match(r"-\s+`([^`]+)`(.*)$", line.strip())
        if not item:
            continue
        descriptor, annotation = item.group(1), item.group(2)
        if "systems lens" in annotation:
            table["systems"].append(descriptor)
        elif "culture lens" in annotation:
            table["culture"].append(descriptor)
        else:
            raise ToolError(f"STYLE_BIBLE 2.4 descriptor carries no lens annotation: {line.strip()!r}")
    if not table["culture"] or not table["systems"]:
        raise ToolError("STYLE_BIBLE 2.4 descriptor set did not parse for both lenses")
    return table


# ------------------------------------------------------------------ template

PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="color-scheme" content="dark">
  <meta name="theme-color" content="{theme_color}">

  <title>{title} | naquuuu (krishna)</title>
  <meta name="description" content="{description}">
  <link rel="canonical" href="{canonical}">
  <link rel="stylesheet" href="../../assets/css/style.css?v={asset_version}">
  <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg?v={favicon_version}">
  <link rel="alternate icon" href="../../favicon.ico?v={favicon_version}">
</head>
<body{body_mode}>

  <!-- Site Header -->
  <header class="site-header">
    <div class="wrap nav-container">
      <div class="nav-brand-group">
        <a class="nav-brand" href="../../">
          <span class="nav-telemetry-dot" aria-hidden="true"></span>naquuuu
        </a>
      </div>
      <nav class="nav-links">
        <a href="https://naquuuu.github.io/" class="nav-back-link">[ {left_arrow} naquuuu.github.io ]</a>
      </nav>
    </div>
  </header>

  <!-- Article Body -->
  <main class="wrap essay-article">

    <header class="essay-header">
      <div class="essay-meta-row">
        <time datetime="{date}">{date_long}</time>
        <span>{bullet}</span>
        <span>{read_time}</span>
        <span>{bullet}</span>
        <span class="essay-tag-pill">{tag_one}</span>
        <span class="essay-tag-pill">{tag_two}</span>
      </div>
      <h1 class="essay-header-title">{title}</h1>
      <p style="color: var(--text-muted); font-size: 0.95rem; font-style: italic; margin-top: 0.5rem; font-family: var(--font-sans);">
        {byline} {bullet} {descriptor}
      </p>
    </header>

    <article class="essay-content">

      <div class="concept-box" style="border-left: 4px solid var(--accent-crimson);">
        <h3 style="font-size: 1.08rem; color: var(--text-primary); margin-bottom: 0.5rem;">the style thesis</h3>
        <p style="margin: 0; font-size: 0.92rem; color: var(--text-secondary); line-height: 1.7;">
          {marker} state the whole claim here, 35 to 60 words, no hedging.
        </p>
      </div>

      <h2>1. {marker} lowercase section heading</h2>
      <p>
        {marker} two to four sentences. one physical analogy. concrete nouns.
      </p>
      <ul>
        <li><strong>bold lead-in label:</strong> {marker} a clause of real detail after the colon.</li>
        <li><strong>bold lead-in label:</strong> {marker} a second clause, or delete this list item.</li>
      </ul>

      <h2>2. {marker} lowercase section heading</h2>
      <p>
        {marker} two to four sentences. add sections three to five if the argument needs them.
      </p>

      {marker} optional outbound link block, zero or one per essay:
      <div style="margin: 2.5rem 0; padding: 1.5rem; background: var(--bg-surface); border: 1px solid var(--border-active); border-radius: var(--radius-md);">
        <div style="font-family: var(--font-sans); font-size: 0.78rem; color: var(--accent-crimson); font-weight: 700; margin-bottom: 0.4rem;">
          [ outbound link label ]
        </div>
        <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">
          {marker} one sentence on what is behind the link.
        </p>
        <a href="https://example.com/" target="_blank" rel="noopener noreferrer" class="hero-cta-btn hero-cta-primary">
          <span>[ view the thing {up_right} ]</span>
        </a>
      </div>

      <div class="concept-box" style="margin: 1.5rem 0; border-color: var(--accent-crimson);">
        <p style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); line-height: 1.6; margin-bottom: 0.5rem;">
          {marker} the takeaway, stated as a rule you could follow tomorrow.
        </p>
        <p style="color: var(--text-secondary); font-size: 0.94rem; line-height: 1.65; margin: 0;">
          {marker} one or two sentences closing the argument.
        </p>
      </div>

    </article>

  </main>

  <!-- Footer -->
  <footer class="site-footer" style="margin-top: 4rem;">
    <div class="footer-wordmark" aria-hidden="true">naquuuu</div>
    <div class="wrap footer-content">
      <div class="footer-channels">
        <a href="https://naquuuu.github.io/">home</a>
        <a href="https://github.com/naquuuu" target="_blank" rel="noopener noreferrer">github</a>
{email_link}
      </div>
      <div class="footer-live-stamp">
        <span>naquuuu.github.io {bullet} built with matter and code.</span>
      </div>
    </div>
  </footer>

</body>
</html>
"""


# ------------------------------------------------------------- scaffold mode


def validate_slug(raw: str) -> str:
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", raw):
        raise ToolError(
            f"--slug {raw!r} is not lowercase kebab-case. Use letters, digits and single hyphens, no caps."
        )
    return raw


def parse_date(raw: str) -> tuple[int, int, int]:
    match = re.fullmatch(r"(\d{4})-(\d{2})-(\d{2})", raw)
    if not match:
        raise ToolError(f"--date {raw!r} is not YYYY-MM-DD")
    year, month, day = (int(part) for part in match.groups())
    if not 1 <= month <= 12 or not 1 <= day <= 31:
        raise ToolError(f"--date {raw!r} is not a real calendar date")
    try:
        datetime.date(year, month, day)
    except ValueError as exc:
        raise ToolError(f"--date {raw!r} is not a real calendar date: {exc}") from exc
    return year, month, day


def validate_read_time(raw: str, lens: str) -> str:
    match = re.fullmatch(r"(\d+) min read", raw)
    if not match:
        raise ToolError(f"--read-time {raw!r} must look like '6 min read'")
    minutes = int(match.group(1))
    low, high = READ_TIME_BAND[lens]
    if not low <= minutes <= high:
        raise ToolError(
            f"--read-time {raw!r} is outside the {lens} band of {low} to {high} min (STYLE_BIBLE 2.6)"
        )
    return raw


def render_card(
    slug: str,
    lens: str,
    year: int,
    month: int,
    day: int,
    read_time: str,
    tags: list[str],
    title: str,
    excerpt: str,
    post_number: int,
) -> str:
    """Archive card markup, matching the existing culture card exactly."""
    if lens == "culture":
        theme_label, theme_class, dot_class = "culture &amp; taste", "theme-culture", "culture-dot"
        theme_note = "Culture / Red Theme"
    else:
        theme_label, theme_class, dot_class = "systems &amp; matter", "theme-systems", "systems-dot"
        theme_note = "Systems / White Theme"
    date_comment = f"{MONTH_ABBR[month - 1]} {day:02d}, {year}"
    date_label = f"{MONTH_ABBR[month - 1].lower()} {day:02d}, {year}"
    lines = [
        f"      <!-- Post {post_number}: {date_comment} ({theme_note}) -->",
        f'      <article class="essay-card" data-theme="{lens}">',
        f'        <a href="./{slug}/" class="essay-card-link">',
        '          <div class="essay-meta">',
        f'            <span class="essay-theme-pill {theme_class}">',
        f'              <span class="essay-theme-dot {dot_class}" aria-hidden="true"></span>',
        f"              <span>{theme_label}</span>",
        "            </span>",
        f'            <span class="meta-dot">{BULLET}</span>',
        f'            <time datetime="{year:04d}-{month:02d}-{day:02d}">{date_label}</time>',
        f'            <span class="meta-dot">{BULLET}</span>',
        f"            <span>{read_time}</span>",
        f'            <span class="meta-dot">{BULLET}</span>',
        f'            <span class="essay-tag-pill">{tags[0]}</span>',
        f'            <span class="essay-tag-pill">{tags[1]}</span>',
        "          </div>",
        '          <h2 class="essay-title">',
        f"            {title}",
        "          </h2>",
        '          <p class="essay-excerpt">',
        f"            {excerpt}",
        "          </p>",
        "        </a>",
        "      </article>",
    ]
    return "\n".join(lines)


CARD_TAG_RE = re.compile(r'<article\b[^>]*\bclass="[^"]*\bessay-card\b[^"]*"[^>]*>', re.IGNORECASE)
THEME_ATTR_RE = re.compile(r'data-theme="([a-z]+)"', re.IGNORECASE)
GRID_OPEN_RE = re.compile(r'<div class="essay-grid"[^>]*>')
FIRST_CARD_RE = re.compile(r'\n(?P<indent>[ \t]*)(?:<!--\s*Post\b|<article class="essay-card")')
BAR_RE = re.compile(r'(?P<open><div class="essay-filter-bar"[^>]*>)(?P<inner>.*?)(?P<close></div>)', re.DOTALL)
BUTTON_RE = re.compile(r"<button\b.*?</button>", re.DOTALL)
FILTER_ATTR_RE = re.compile(r'data-filter="([a-z]+)"', re.IGNORECASE)
COUNT_SPAN_RE = re.compile(r'(<span class="filter-count">)(\s*\[\s*\d+\s*\])(</span>)')


def count_cards(archive: str) -> dict[str, int]:
    """Count real cards by data-theme. Never trust the printed numbers."""
    counts = {"all": 0, "culture": 0, "systems": 0}
    for tag in CARD_TAG_RE.findall(archive):
        counts["all"] += 1
        theme = THEME_ATTR_RE.search(tag)
        if theme is None:
            raise ToolError(
                f"an .essay-card in {ARCHIVE_INDEX.name} carries no data-theme attribute; refusing to guess its count"
            )
        value = theme.group(1).lower()
        if value not in ("culture", "systems"):
            raise ToolError(f"an .essay-card carries an unknown data-theme {value!r}")
        counts[value] += 1
    return counts


def rewrite_filter_counts(archive: str, counts: dict[str, int]) -> str:
    bar = BAR_RE.search(archive)
    if not bar:
        raise ToolError(f"no .essay-filter-bar found in {ARCHIVE_INDEX}; refusing to write counts blind")
    seen: set[str] = set()
    rebuilt = bar.group("inner")
    for button in BUTTON_RE.findall(bar.group("inner")):
        attr = FILTER_ATTR_RE.search(button)
        if not attr:
            raise ToolError("an .essay-filter-btn carries no data-filter attribute")
        key = attr.group(1).lower()
        if key not in counts:
            raise ToolError(f"unknown data-filter {key!r} in .essay-filter-bar")
        seen.add(key)
        replacement = f"[ {counts[key]:02d} ]"
        updated, hits = COUNT_SPAN_RE.subn(
            lambda m: m.group(1) + replacement + m.group(3), button
        )
        if hits != 1:
            raise ToolError(
                f"the {key!r} filter button has {hits} .filter-count spans, expected exactly 1"
            )
        rebuilt = rebuilt.replace(button, updated)
    if seen != {"all", "systems", "culture"}:
        raise ToolError(
            f".essay-filter-bar exposes {sorted(seen)}, expected all/systems/culture"
        )
    return archive[: bar.start("inner")] + rebuilt + archive[bar.end("inner") :]


def register_card(archive: str, card: str, slug: str) -> tuple[str, str]:
    """Insert the card as the first child of .essay-grid. Returns (text, action)."""
    if re.search(r'href="\./' + re.escape(slug) + r'/"', archive):
        return archive, "kept existing card"
    grid = GRID_OPEN_RE.search(archive)
    if not grid:
        raise ToolError(f"no .essay-grid found in {ARCHIVE_INDEX}; refusing to guess the insertion point")
    first = FIRST_CARD_RE.search(archive, grid.end())
    if not first:
        insert_at = archive.find("\n", grid.end()) + 1
        return archive[:insert_at] + card + "\n\n" + archive[insert_at:], "inserted card"
    # the match begins on the newline that closes the .essay-grid line, so the
    # first existing card starts one character later
    insert_at = first.start() + 1
    return archive[:insert_at] + card + "\n\n" + archive[insert_at:], "inserted card"


def default_excerpt() -> str:
    return f"{SCAFFOLD_MARKER}: write the 15 to 25 word archive excerpt here."


def mode_scaffold(args: argparse.Namespace) -> int:
    for name in ("slug", "lens", "title", "description", "tags"):
        if not getattr(args, name):
            raise ToolError(f"--{name.replace('_', '-')} is required in scaffold mode")

    slug = validate_slug(args.slug)
    lens = args.lens
    if lens not in LENSES:
        raise ToolError(f"--lens must be exactly one of {', '.join(LENSES)}")

    asset_version = read_asset_version()
    pages = essay_pages()
    favicon_version, favicon_source = read_favicon_version(pages)
    byline = read_byline_opening(pages)
    email = read_canonical_email()

    descriptors = parse_descriptors(read_text(style_bible_path()))
    allowed = descriptors[lens]
    if args.descriptor:
        descriptor = args.descriptor
        if descriptor not in allowed:
            raise ToolError(
                f"--descriptor {descriptor!r} is not in the STYLE_BIBLE 2.4 closed set for the {lens} lens: "
                + ", ".join(allowed)
            )
    else:
        preferred = PREFERRED_DESCRIPTOR[lens]
        descriptor = preferred if preferred in allowed else allowed[0]

    if args.date:
        year, month, day = parse_date(args.date)
    else:
        today = datetime.date.today()
        year, month, day = today.year, today.month, today.day

    read_time = validate_read_time(args.read_time, lens) if args.read_time else DEFAULT_READ_TIME[lens]

    tags = [tag.strip() for tag in args.tags.split(",") if tag.strip()]
    if len(tags) != 2:
        raise ToolError(
            f"--tags needs exactly two comma separated values (STYLE_BIBLE 2.6 caps tag pills at two), got {len(tags)}"
        )

    title_raw = args.title
    description_raw = args.description
    excerpt_raw = args.excerpt or default_excerpt()
    notes: list[str] = []

    title_words = len(title_raw.split())
    if not 8 <= title_words <= 13:
        notes.append(f"title is {title_words} words, STYLE_BIBLE 2.6 budgets 8 to 13")
    if len(description_raw) >= 160:
        notes.append(f"description is {len(description_raw)} characters, STYLE_BIBLE 2.6 budgets under 160")
    excerpt_words = len(excerpt_raw.split())
    if not args.excerpt:
        notes.append("no --excerpt given, the archive card carries the scaffolding marker excerpt")
    elif not 15 <= excerpt_words <= 25:
        notes.append(f"excerpt is {excerpt_words} words, STYLE_BIBLE 2.6 budgets 15 to 25")

    title = html.escape(title_raw, quote=False)
    description = html.escape(description_raw, quote=True)
    excerpt = html.escape(excerpt_raw, quote=False)
    for label, raw, cooked in (
        ("--title", title_raw, title),
        ("--description", description_raw, description),
        ("--excerpt", excerpt_raw, excerpt),
    ):
        if raw != cooked:
            notes.append(f"html metacharacters in {label} were escaped")

    if email:
        email_link = f'        <a href="mailto:{email}">email</a>'
    else:
        email_link = ""
        notes.append("no canonical footer address found on the site, the footer omits the email channel")

    page_dir = BLOG_DIR / slug
    page_path = page_dir / "index.html"
    page_existed = page_path.exists()
    if page_existed and not args.force:
        raise ToolError(
            f"{page_path.relative_to(ROOT)} already exists. Refusing to overwrite. Pass --force to rewrite it."
        )

    page = PAGE_TEMPLATE.format(
        theme_color=THEME_COLOR[lens],
        title=title,
        description=description,
        canonical=f"{SITE_ORIGIN}{slug}/",
        asset_version=asset_version,
        favicon_version=favicon_version,
        body_mode=' data-mode="culture"' if lens == "culture" else "",
        left_arrow=LEFT_ARROW,
        up_right=UP_RIGHT_ARROW,
        bullet=BULLET,
        date=f"{year:04d}-{month:02d}-{day:02d}",
        date_long=f"{MONTH_FULL[month - 1]} {year}",
        read_time=read_time,
        tag_one=html.escape(tags[0], quote=False),
        tag_two=html.escape(tags[1], quote=False),
        byline=byline,
        descriptor=descriptor,
        marker=SCAFFOLD_MARKER,
        email_link=email_link,
    )

    archive_before = read_text(ARCHIVE_INDEX)
    card = render_card(
        slug=slug,
        lens=lens,
        year=year,
        month=month,
        day=day,
        read_time=read_time,
        tags=[html.escape(tag, quote=False) for tag in tags],
        title=title,
        excerpt=excerpt,
        post_number=count_cards(archive_before)["all"] + 1,
    )
    archive_after, card_action = register_card(archive_before, card, slug)
    counts = count_cards(archive_after)
    archive_after = rewrite_filter_counts(archive_after, counts)

    page_dir.mkdir(parents=True, exist_ok=True)
    write_text(page_path, page)
    page_action = "rewritten (--force)" if page_existed else "written"
    archive_changed = archive_after != archive_before
    if archive_changed:
        write_text(ARCHIVE_INDEX, archive_after)
    archive_action = "updated" if archive_changed else "already correct"

    out("=== new_essay.py scaffold ===")
    out(f"lens            : {lens}")
    out(f"slug            : {slug}")
    out(f"date            : {year:04d}-{month:02d}-{day:02d} ({MONTH_FULL[month - 1]} {year})")
    out(f"read time       : {read_time}   descriptor: {descriptor}")
    out(f"asset version   : {asset_version}  (parsed from {QA_SCRIPT.name})")
    out(f"favicon version : {favicon_version}  (parsed from {favicon_source.relative_to(ROOT)})")
    out(f"byline          : {byline} {BULLET} {descriptor}")
    out(f"page            : {page_path.relative_to(ROOT)} {page_action}")
    out(f"archive card    : {card_action} as first child of .essay-grid")
    out(
        "filter counts   : all notes [ %02d ]   systems & matter [ %02d ]   culture & taste [ %02d ]"
        % (counts["all"], counts["systems"], counts["culture"])
    )
    out(f"archive index   : {ARCHIVE_INDEX.relative_to(ROOT)} {archive_action}")
    out(f"marker count    : {page.count(SCAFFOLD_MARKER)} x {SCAFFOLD_MARKER} in the body")
    for note in notes:
        out(f"note            : {note}")
    out()
    out("next: the drafting agent replaces every marker, then")
    out(f"  python scripts/new_essay.py --check {page_path.relative_to(ROOT).as_posix()}")
    return 0


# ---------------------------------------------------------------- check mode


class _SourceIndex:
    """Char offset to 1-based line resolution over the page as written on disk.

    The single source of truth for every reported line. HTMLParser only ever
    reports the line of an enclosing start tag: exact for an attribute-driven
    finding, wrong for a text node, where it is the line the text hangs under
    and the error grows with the distance between the two. So a finding is
    only ever emitted from a real char offset in this text.

    Total by construction. Nothing here raises, and line_of never returns a
    number below 1.
    """

    def __init__(self, text: str) -> None:
        self.text = text
        # offset of the first character of every line, line 1 first
        self._line_starts: list[int] = [0]
        for match in re.finditer("\n", text):
            self._line_starts.append(match.end())

    def line_of(self, offset: int, fallback: int = 1) -> int:
        """1-based line for a char offset. A negative offset means 'not located'."""
        try:
            position = int(offset)
        except Exception:
            return self._safe_line(fallback)
        if position < 0:
            return self._safe_line(fallback)
        position = min(position, len(self.text))
        return max(1, bisect.bisect_right(self._line_starts, position))

    def scan(self, value: str, cursor: int = 0) -> tuple[int, int]:
        """Find `value` at or after `cursor`. Returns (offset, next cursor).

        offset is -1 when the value is not in the raw text, and the cursor is
        returned unchanged in that case. The cursor only moves forward, so a
        value that repeats in the document resolves to successive occurrences
        instead of collapsing onto the first one.
        """
        try:
            if not value or not isinstance(cursor, int) or cursor < 0:
                return -1, max(0, cursor if isinstance(cursor, int) else 0)
            found = self.text.find(value, cursor)
        except Exception:
            return -1, cursor
        if found < 0:
            return -1, cursor
        return found, found + max(1, len(value))

    @staticmethod
    def _safe_line(fallback: int) -> int:
        try:
            value = int(fallback)
        except Exception:
            return 1
        return value if value >= 1 else 1


# A text node reaches us with its character references already resolved, so the
# literal text is missing from the raw file wherever the copy carries an entity.
# Re-escaping only the bare ampersands recovers the literal form for a second
# look; named and numeric references are left alone, because those are already
# written the way the parser wanted them.
BARE_AMPERSAND_RE = re.compile(r"&(?![A-Za-z#][A-Za-z0-9]*;)")


def _raw_form(value: str) -> str:
    """Best effort literal spelling of a parser-produced value."""
    try:
        return BARE_AMPERSAND_RE.sub("&amp;", value)
    except Exception:
        return value


class _Surface(NamedTuple):
    """A chunk of reader-visible copy, anchored to the raw page text."""

    value: str
    offset: int  # char offset of the value, or -1 when it is not locatable
    line: int    # fallback: the line of the enclosing construct


class _Document(HTMLParser):
    """Collects the surface STYLE_BIBLE 7 checks 3, 7 and 8b need."""

    def __init__(self, source: _SourceIndex) -> None:
        super().__init__(convert_charrefs=True)
        self.source = source
        self.text: list[_Surface] = []
        self.copy: list[_Surface] = []
        self.tags: list[tuple[int, str, dict[str, str]]] = []
        self.ids: set[str] = set()
        self.anchors: list[tuple[int, str]] = []
        self.blanks: list[tuple[int, str]] = []
        self._suppress = 0
        self._text_cursor = 0
        self._copy_cursor = 0

    def _anchor(self, bucket: list[_Surface], value: str, cursor: int) -> int:
        """Locate `value` in the raw text and record it. Returns the next cursor.

        Two passes, both forward from the same cursor: the literal text the
        parser produced, then the same text with its bare ampersands
        re-escaped, which is how the value is spelled in the file when the copy
        carries a character reference. When neither is found the recorded offset
        stays -1 and the finding falls back to the enclosing construct's line
        rather than aborting the run.
        """
        offset, nxt = self.source.scan(value, cursor)
        if offset < 0:
            offset, nxt = self.source.scan(_raw_form(value), cursor)
        bucket.append(_Surface(value, offset, self.getpos()[0]))
        return nxt

    def _record(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        line = self.getpos()[0]
        lowered = {key.lower(): (value or "") for key, value in attrs}
        self.tags.append((line, tag.lower(), lowered))
        if tag in ("script", "style"):
            self._suppress += 1
        if "id" in lowered and lowered["id"]:
            self.ids.add(lowered["id"])
        href = lowered.get("href", "")
        if href.startswith("#") and len(href) > 1:
            self.anchors.append((line, href[1:]))
        if lowered.get("target", "").lower() == "_blank":
            self.blanks.append((line, lowered.get("rel", "")))
        # the two attribute-carried copy fields that checks 3 and 8b read
        if tag == "meta" and lowered.get("name", "").lower() == "description" and lowered.get("content"):
            self._copy_cursor = self._anchor(self.copy, lowered["content"], self._copy_cursor)
        if lowered.get("alt"):
            self._copy_cursor = self._anchor(self.copy, lowered["alt"], self._copy_cursor)

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self._record(tag.lower(), attrs)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self._record(tag.lower(), attrs)

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() in ("script", "style") and self._suppress:
            self._suppress -= 1

    def handle_data(self, data: str) -> None:
        if self._suppress or not data.strip():
            return
        self._text_cursor = self._anchor(self.text, data, self._text_cursor)

    def first_attr(self, tag: str, **required: str) -> tuple[int, dict[str, str]] | None:
        for line, name, attrs in self.tags:
            if name != tag:
                continue
            if all(attrs.get(key, "").lower() == value.lower() for key, value in required.items()):
                return line, attrs
        return None

    def content_surface(self) -> list[_Surface]:
        """Text nodes plus the two attribute-carried copy fields."""
        return [*self.text, *self.copy]


def _check_one(source: _SourceIndex) -> list[tuple[int, str]]:
    findings: list[tuple[int, str]] = []
    for needle, label in DASH_PATTERNS:
        for match in re.finditer(re.escape(needle), source.text):
            findings.append((source.line_of(match.start()), label))
    return findings


def _check_two(source: _SourceIndex) -> list[tuple[int, str]]:
    findings: list[tuple[int, str]] = []
    for match in INLINE_WIDTH_RE.finditer(source.text):
        findings.append((source.line_of(match.start()), "quoted style attribute contains width"))
    return findings


def _check_three(
    surface: list[_Surface], allowlist: frozenset[str], source: _SourceIndex
) -> list[tuple[int, str]]:
    # DELIBERATE DEVIATION from the literal wording of STYLE_BIBLE 7 check 3.
    # The spec says to tokenize the remainder of the document into alphabetic
    # runs, which sweeps attribute values in with the copy. Attribute values
    # legitimately carry camelCase: svg viewBox, preserveAspectRatio,
    # strokeWidth, pathLength. Scanning them makes this check fail on any page
    # carrying an inline diagram, which is not a finding, it is a false
    # positive. So the surface here is text nodes, title text, the meta
    # description, and alt values: everything a reader actually sees.
    #
    # Second deviation: the three alphabetic runs of SCAFFOLD_MARKER are
    # exempt. The scaffolder writes that marker into every body by design, so
    # without the exemption the checker would reject the scaffolder's own
    # output. The exemption is that one token, not a widening of the allowlist.
    exempt = frozenset(word.lower() for word in ALPHABETIC_RUN_RE.findall(SCAFFOLD_MARKER))
    findings: list[tuple[int, str]] = []
    for item in surface:
        for match in ALPHABETIC_RUN_RE.finditer(item.value):
            word = match.group(0)
            if word.islower() or word.lower() in allowlist or word.lower() in exempt:
                continue
            # the chunk offset is the whole text node, so the run has to be
            # added on: the line wanted is the line the word sits on. An
            # unlocated chunk stays unlocated, never -1 plus an offset.
            offset = item.offset + match.start() if item.offset >= 0 else -1
            findings.append(
                (source.line_of(offset, item.line), f"non-allowlisted uppercase word {word!r}")
            )
    return findings


def _stylesheet_ref(source: _SourceIndex, href: str, cursor: int) -> tuple[int, int]:
    """Char offset of the stylesheet version reference a <link> carries.

    Looks for the version reference first, then the bare file name, then the
    href as written, so a link carrying no version at all still resolves to its
    own line. Returns (-1, cursor) when nothing is locatable.
    """
    for needle in ("style.css?v=", "style.css"):
        offset, nxt = source.scan(needle, cursor)
        if offset >= 0:
            return offset, nxt
    if href:
        return source.scan(href, cursor)
    return -1, cursor


def _check_seven(
    doc: _Document, source: _SourceIndex, lens: str, slug: str, asset_version: str
) -> list[tuple[int, str]]:
    findings: list[tuple[int, str]] = []
    if not re.search(r'charset\s*=\s*["\']?utf-8', source.text, re.IGNORECASE):
        findings.append((1, "no utf-8 charset declaration"))

    viewport = doc.first_attr("meta", name="viewport")
    if viewport is None:
        findings.append((1, "no viewport meta"))
    elif "width=device-width" not in viewport[1].get("content", ""):
        findings.append((viewport[0], "viewport content has no width=device-width"))

    canonical = doc.first_attr("link", rel="canonical")
    if canonical is None:
        findings.append((1, "no canonical link"))
    else:
        href = canonical[1].get("href", "")
        if not href.startswith("https://"):
            findings.append((canonical[0], f"canonical is not absolute: {href!r}"))
        elif not href.startswith(SITE_ORIGIN):
            findings.append((canonical[0], f"canonical is not under {SITE_ORIGIN}: {href!r}"))
        elif not href.endswith("/"):
            findings.append((canonical[0], f"canonical has no trailing slash: {href!r}"))
        elif slug and href != f"{SITE_ORIGIN}{slug}/":
            findings.append((canonical[0], f"canonical {href!r} does not match the page folder"))

    expected_css = f"style.css?v={asset_version}"
    stylesheets = [
        (line, attrs)
        for line, name, attrs in doc.tags
        if name == "link" and "stylesheet" in attrs.get("rel", "").lower()
    ]
    if not stylesheets:
        findings.append((1, "no stylesheet link"))
    cursor = 0
    for tag_line, attrs in stylesheets:
        href = attrs.get("href", "")
        # the cursor advances over every stylesheet link, broken or not, so each
        # one resolves to its own reference rather than to the first one
        offset, cursor = _stylesheet_ref(source, href, cursor)
        if not href.endswith(expected_css):
            findings.append(
                (source.line_of(offset, tag_line), f"stylesheet href {href!r} does not end in {expected_css}")
            )

    for line, anchor in doc.anchors:
        if anchor not in doc.ids:
            findings.append((line, f"in-page anchor #{anchor} resolves to no id in this file"))

    for line, rel in doc.blanks:
        tokens = {token.lower() for token in rel.split()}
        if not {"noopener", "noreferrer"} <= tokens:
            findings.append((line, f'target="_blank" without rel="noopener noreferrer" (found {rel!r})'))

    theme = doc.first_attr("meta", name="theme-color")
    expected_theme = THEME_COLOR[lens]
    if theme is None:
        findings.append((1, "no theme-color meta"))
    elif theme[1].get("content", "").strip().lower() != expected_theme.lower():
        findings.append(
            (theme[0], f"theme-color {theme[1].get('content', '')!r} does not match the {lens} lens ({expected_theme})")
        )
    return findings


def _check_eight_b(surface: list[_Surface], source: _SourceIndex) -> list[tuple[int, str]]:
    findings: list[tuple[int, str]] = []
    for item in surface:
        lowered = item.value.lower()
        # a case fold that changes length would shift every offset taken from
        # it, so drop the anchor rather than report a confident wrong line
        anchored = item.offset if len(lowered) == len(item.value) else -1
        for pattern, label in CLAIM_PATTERNS:
            for match in re.finditer(pattern, lowered):
                offset = anchored + match.start() if anchored >= 0 else -1
                findings.append(
                    (source.line_of(offset, item.line), f"{label}: {match.group(0)!r}")
                )
    return findings


def resolve_lens(doc: _Document, raw: str) -> str:
    body = doc.first_attr("body")
    if body is None:
        raise ToolError("no <body> element found")
    mode = body[1].get("data-mode", "").lower()
    if mode == "culture":
        return "culture"
    if mode == "":
        return "systems"
    raise ToolError(f"body carries data-mode {mode!r}, which is neither culture nor absent")


def mode_check(args: argparse.Namespace) -> int:
    target = Path(args.check)
    if not target.is_file():
        raise ToolError(f"{target} is not a file")
    page = target.resolve()
    raw = read_text(page)
    source = _SourceIndex(raw)

    asset_version = read_asset_version()
    bible = style_bible_path()
    allowlist = parse_allowlist(read_text(bible))

    doc = _Document(source)
    doc.feed(raw)
    doc.close()

    try:
        relative = page.relative_to(ROOT).as_posix()
    except ValueError:
        raise ToolError(
            f"{page} is outside the published blog tree; this checker only knows how to verify essay pages"
        ) from None
    if page == (BLOG_DIR / "index.html").resolve():
        slug = ""
    else:
        slug = page.parent.name

    detected = resolve_lens(doc, raw)
    lens = args.lens if args.lens else detected
    if lens not in LENSES:
        raise ToolError(f"--lens must be exactly one of {', '.join(LENSES)}")
    lens_mismatch: list[tuple[int, str]] = []
    if args.lens and args.lens != detected:
        lens_mismatch = [
            (1, f"--lens {lens} contradicts the page, which reads as {detected}")
        ]

    surface = doc.content_surface()
    checks: list[tuple[str, str, list[tuple[int, str]]]] = [
        ("1", "dash check", _check_one(source)),
        ("2", "inline width check", _check_two(source)),
        ("3", "lowercase check", _check_three(surface, allowlist, source)),
        ("7", "head and asset check", _check_seven(doc, source, lens, slug, asset_version) + lens_mismatch),
        ("8b", "claim discipline", _check_eight_b(surface, source)),
    ]
    passed = sum(1 for _, _, found in checks if not found)
    total = len(checks)

    if args.json:
        payload = {
            "tool": "new_essay.py",
            "file": relative,
            "lens": lens,
            "lens_detected": detected,
            "asset_version": asset_version,
            "allowlist_source": str(bible),
            "allowlist_tokens": len(allowlist),
            "ok": passed == total,
            "passed": passed,
            "total": total,
            "checks": [
                {
                    "id": check_id,
                    "name": name,
                    "ok": not found,
                    "findings": [{"line": line, "message": message} for line, message in found],
                }
                for check_id, name, found in checks
            ],
            "not_implemented": ["4", "5", "6", "8a", "8c", "8d", "8e", "8f"],
        }
        print(json.dumps(payload, indent=2, ensure_ascii=False))
        return 0 if passed == total else 1

    out(f"=== new_essay.py --check {TOOL_VERSION} ===")
    out(f"file            : {relative}")
    out(f"lens            : {lens} (page reads as {detected})")
    out(f"asset version   : {asset_version}  (parsed from {QA_SCRIPT.name})")
    out(f"allowlist       : {len(allowlist)} tokens from {bible.name} section 1.1")
    out()
    for check_id, name, found in checks:
        status = "PASS" if not found else f"FAIL ({len(found)} findings)"
        out(f"[{check_id:>2}] {name:<22} {status}")
        for line, message in found:
            out(f"       {relative}:{line}  [{check_id} {name}]  {message}")
    out()
    out(f"{passed}/{total} mechanical checks passed")
    out("note            : checks 4, 5, 6 and 8a/8c/8d/8e/8f are not re-implemented here.")
    out("note            : run scripts/verify_blog_qa.py and the full STYLE_BIBLE 7 rubric as well.")
    return 0 if passed == total else 1


# -------------------------------------------------------------- skeleton dump


def mode_print_skeleton(args: argparse.Namespace) -> None:
    lens = args.lens or "culture"
    if lens not in LENSES:
        raise ToolError(f"--lens must be exactly one of {', '.join(LENSES)}")
    asset_version = read_asset_version()
    favicon_version, _ = read_favicon_version(essay_pages())
    print(
        PAGE_TEMPLATE.format(
            theme_color=THEME_COLOR[lens],
            title="essay title here: lowercase subtitle",
            description="lowercase one or two sentence summary, under 160 characters.",
            canonical=f"{SITE_ORIGIN}SLUG/",
            asset_version=asset_version,
            favicon_version=favicon_version,
            body_mode=' data-mode="culture"' if lens == "culture" else "",
            left_arrow=LEFT_ARROW,
            up_right=UP_RIGHT_ARROW,
            bullet=BULLET,
            date="YYYY-MM-DD",
            date_long="month year",
            read_time=DEFAULT_READ_TIME[lens],
            tag_one="style essay",
            tag_two="everyday design",
            byline="byline opening is read from the site, not printed here",
            descriptor="notes on style" if lens == "culture" else "notes on tools",
            marker=SCAFFOLD_MARKER,
            email_link='        [ canonical footer email channel is read from the site ]',
        ),
        end="",
    )


# ----------------------------------------------------------------------- cli


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="new_essay.py",
        description=(
            "Deterministic essay scaffolder and mechanical checker for naquuuu.github.io. "
            "No model calls, no prose invention."
        ),
        epilog=(
            "scaffold: --slug SLUG --lens culture|systems --title T --description D --tags \"a,b\"\n"
            "check   : --check PATH [--lens culture|systems] [--json]\n"
            "skeleton: --print-skeleton [--lens culture|systems]"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--print-skeleton", action="store_true", help="dump the STYLE_BIBLE 2.1 skeleton with placeholders")
    mode.add_argument("--check", metavar="PATH", help="run the mechanical STYLE_BIBLE 7 subset against an essay page")
    parser.add_argument("--json", action="store_true", help="machine readable check result")
    parser.add_argument("--slug", help="lowercase kebab-case slug")
    parser.add_argument("--lens", help="culture or systems")
    parser.add_argument("--title", help="h1 and html title text")
    parser.add_argument("--description", help="meta description")
    parser.add_argument("--tags", help="exactly two comma separated tag pills")
    parser.add_argument("--date", help="publish date, YYYY-MM-DD (default: today)")
    parser.add_argument("--read-time", help="declared read time, for example '6 min read'")
    parser.add_argument("--descriptor", help="byline descriptor from the STYLE_BIBLE 2.4 closed set")
    parser.add_argument("--excerpt", help="archive card excerpt, 15 to 25 words")
    parser.add_argument("--force", action="store_true", help="overwrite an existing essay page")
    parser.add_argument("--version", action="version", version=f"new_essay.py {TOOL_VERSION}")
    return parser


def main(argv: list[str] | None = None) -> int:
    utf8_stdout()
    args = build_parser().parse_args(argv)
    try:
        if args.print_skeleton:
            mode_print_skeleton(args)
            return 0
        if args.check:
            return mode_check(args)
        if not (args.slug or args.lens or args.title):
            build_parser().print_help()
            return 0
        return mode_scaffold(args)
    except ToolError as exc:
        if args.json:
            print(json.dumps({"tool": "new_essay.py", "ok": False, "error": str(exc)}, indent=2, ensure_ascii=False))
        else:
            print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
