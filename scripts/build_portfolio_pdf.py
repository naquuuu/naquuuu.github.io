#!/usr/bin/env python3
"""Build the portfolio PDF from a manifest: one command, one file.

Renders a generated cover page and every route in the manifest in print media
through headless Chromium (--print-to-pdf), then merges the parts into a single
PDF and reports the page count. This is the export half of the 2026-10-16
portfolio pack (ADR-054): the pages stay canonical on the blog, the print layer in
assets/css/style.css makes them print as warm paper, and this script assembles the
submission artifact.

Runtime: python 3 standard library plus headless Chromium, plus exactly one
non-stdlib import, `pypdf`, which is required because merging N rendered PDFs into
one is not expressible with the standard library (allowed and documented per the
2026-10-16 brief, constraint 4.6: `python -m pip install pypdf`).

Usage
    python scripts/build_portfolio_pdf.py
    python scripts/build_portfolio_pdf.py --out portfolio-draft.pdf
    python scripts/build_portfolio_pdf.py --manifest portfolio-manifest.json --quiet

The manifest is JSON with this shape (see portfolio-manifest.json for the seeded
version):

    {
      "title": "naquuuu, selected work",     # cover heading
      "contact": "email / site",             # cover contact line
      "max_pages": 20,                       # hard cap, exit 2 when exceeded
      "output_default": "portfolio.pdf",     # used when --out is omitted
      "routes": [
        {"path": "/portfolio/3m-bio-mask/", "pages": 2}
      ]
    }

`pages` is the per route page target (ADR-054 aims at one to two PDF pages per
work). The script reports actual against target and warns when a route is over; it
does not fail on that, because only `max_pages` is a submission constraint.

The output file is a build artifact: it is written next to the repository root and
is deliberately not added to git. Delete it or regenerate it, do not commit it.
"""

from __future__ import annotations

import argparse
import functools
import html
import http.server
import json
import os
import re
import socket
import socketserver
import subprocess
import sys
import tempfile
import threading
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GATE = ROOT / "scripts" / "verify_blog_qa.py"
COVER_HOST_PATH = "/__portfolio_cover__/"  # virtual in memory route, never on disk


class BuildError(RuntimeError):
    """A precondition failed and the build stopped."""


# --------------------------------------------------------------------------- #
# manifest
# --------------------------------------------------------------------------- #

def load_manifest(path: Path) -> dict:
    if not path.exists():
        raise BuildError(f"manifest not found: {path}")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise BuildError(f"manifest is not valid JSON: {path} ({exc})") from exc

    for key in ("title", "contact", "routes"):
        if not data.get(key):
            raise BuildError(f"manifest is missing '{key}': {path}")
    routes = data["routes"]
    if not isinstance(routes, list) or not routes:
        raise BuildError("manifest 'routes' must be a non-empty list")
    for i, route in enumerate(routes):
        if not isinstance(route, dict) or not route.get("path"):
            raise BuildError(f"routes[{i}] needs a 'path'")
        if not str(route["path"]).startswith("/"):
            raise BuildError(f"routes[{i}].path must start with '/': {route['path']!r}")
    data.setdefault("max_pages", 20)
    data.setdefault("output_default", "portfolio.pdf")
    return data


def asset_version() -> str:
    """Read CURRENT_ASSET_VERSION from the QA gate instead of hardcoding it.

    Same rule the essay scaffolder follows (STYLE_BIBLE 5.3): the gate constant is
    the single source of the style.css query string.
    """
    if not GATE.exists():
        return ""
    m = re.search(r'CURRENT_ASSET_VERSION\s*=\s*"([^"]+)"', GATE.read_text(encoding="utf-8"))
    return m.group(1) if m else ""


# --------------------------------------------------------------------------- #
# browser discovery
# --------------------------------------------------------------------------- #

def discover_chrome(explicit: str | None) -> str:
    """Find a Chromium build. Nothing is installed by this script."""
    if explicit:
        if Path(explicit).exists():
            return explicit
        raise BuildError(f"--chrome path does not exist: {explicit}")

    candidates: list[str] = []
    env = os.environ.get("CHROME_PATH") or os.environ.get("CHROMIUM_PATH")
    if env:
        candidates.append(env)

    if os.name == "nt":
        for var in ("PROGRAMFILES", "PROGRAMFILES(X86)", "LOCALAPPDATA"):
            base = os.environ.get(var)
            if not base:
                continue
            candidates += [
                rf"{base}\Google\Chrome\Application\chrome.exe",
                rf"{base}\Microsoft\Edge\Application\msedge.exe",
            ]
        # playwright's bundled headless shell, if a previous run left one behind
        pw = os.environ.get("LOCALAPPDATA")
        if pw:
            for shell in sorted(Path(pw, "ms-playwright").glob("chromium_headless_shell-*/*/chrome-headless-shell.exe")):
                candidates.append(str(shell))
    else:
        candidates += [
            "/usr/bin/google-chrome",
            "/usr/bin/chromium",
            "/usr/bin/chromium-browser",
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Chromium.app/Contents/MacOS/Chromium",
        ]

    for candidate in candidates:
        if Path(candidate).exists():
            return candidate
    raise BuildError(
        "no Chromium found. Pass --chrome <path> or set CHROME_PATH. "
        "Chrome, Edge or a chromium headless shell all work."
    )


# --------------------------------------------------------------------------- #
# local server
# --------------------------------------------------------------------------- #

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    """Serves the repository root, plus the generated cover from memory."""

    cover_html = ""

    def do_GET(self) -> None:  # noqa: N802 (stdlib naming)
        if self.path.startswith(COVER_HOST_PATH):
            body = self.cover_html.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def log_message(self, *args) -> None:  # keep the build output readable
        pass


class ThreadedServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def free_port() -> int:
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return int(s.getsockname()[1])


# --------------------------------------------------------------------------- #
# cover page (generated, never a file on disk and never a site page)
# --------------------------------------------------------------------------- #

COVER_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title}</title>
<link rel="stylesheet" href="/assets/css/style.css?v={token}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400..700;1,400..700&amp;family=Open+Sans:ital,wght@0,400..700;1,400..700&amp;family=JetBrains+Mono:wght@400;600;700&amp;display=swap">
<style>
  .cover-sheet {{
    min-height: 245mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2rem;
    /* match the content pages' .wrap inset (1.25rem on top of the 15mm page
       margin), so the cover's type lines up with the body pages instead of
       sitting on the bare margin edge (curator must-fix, 2026-10-16) */
    padding: 0 1.25rem;
  }}
  .cover-kicker {{
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: lowercase;
    color: var(--accent-crimson);
    margin-bottom: 1.5rem;
  }}
  .cover-title {{
    font-family: var(--font-display);
    font-size: 2.9rem;
    font-weight: 700;
    line-height: 1.06;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    margin: 0;
  }}
  .cover-rule {{
    border-top: 1px solid var(--border-active);
    margin-bottom: 1rem;
  }}
  .cover-row {{
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    line-height: 1.7;
    color: var(--text-secondary);
  }}
  .cover-row dt {{
    color: var(--text-muted);
    text-transform: lowercase;
    letter-spacing: 0.06em;
  }}
  .cover-row dd {{ margin: 0 0 0.5rem; color: var(--text-primary); }}
  /* the cover sheet carries the warm surface ground rather than the near white
     page token, so the first sheet of the pack reads as paper like the pages
     behind it (curator must-fix, 2026-10-16) */
  html,
  body {{ background: var(--bg-surface); }}
</style>
</head>
<body data-mode="systems">
  <section class="cover-sheet print-page-break">
    <div>
      <div class="cover-kicker">selected work / portfolio</div>
      <h1 class="cover-title">{title}</h1>
    </div>
    <div>
      <div class="cover-rule"></div>
      <dl class="cover-row">
        <div>
          <dt>compiled</dt>
          <dd>{built}</dd>
        </div>
        <div>
          <dt>contact</dt>
          <dd>{contact}</dd>
        </div>
      </dl>
    </div>
  </section>
</body>
</html>
"""


def build_cover_html(manifest: dict, token: str) -> str:
    return COVER_TEMPLATE.format(
        title=html.escape(str(manifest["title"])),
        contact=html.escape(str(manifest["contact"])),
        token=html.escape(token),
        built=date.today().isoformat(),
    )


# --------------------------------------------------------------------------- #
# rendering
# --------------------------------------------------------------------------- #

def render_pdf(chrome: str, url: str, out: Path, profile: Path, quiet: bool) -> None:
    cmd = [
        chrome,
        "--headless=new",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-extensions",
        f"--user-data-dir={profile}",
        "--virtual-time-budget=10000",
        "--run-all-compositor-stages-before-draw",
        "--no-pdf-header-footer",
        f"--print-to-pdf={out}",
        url,
    ]
    kwargs: dict = {"capture_output": True, "text": True, "encoding": "utf-8", "errors": "replace"}
    if os.name == "nt":
        kwargs["creationflags"] = getattr(subprocess, "CREATE_NO_WINDOW", 0)
    result = subprocess.run(cmd, **kwargs)
    if result.returncode != 0 or not out.exists():
        detail = "\n".join(result.stderr.splitlines()[-6:]).strip()
        raise BuildError(f"chromium failed for {url} (exit {result.returncode})\n{detail}")
    if not quiet:
        # chromium reports the byte count on stderr; everything else it says on a
        # successful render is unrelated chrome-install chatter.
        m = re.search(r"([\d,]+) bytes written to file", result.stderr or "")
        if m:
            print(f"    -> {m.group(1)} bytes", flush=True)


def merge_parts(parts: list[Path], out: Path) -> tuple[int, float, float]:
    try:
        from pypdf import PdfWriter
    except ImportError as exc:  # pragma: no cover - environment guard
        raise BuildError(
            "pypdf is required to merge the rendered parts "
            "(python -m pip install pypdf)"
        ) from exc

    writer = PdfWriter()
    for part in parts:
        writer.append(str(part))
    with open(out, "wb") as fh:
        writer.write(fh)
    writer.close()

    from pypdf import PdfReader

    reader = PdfReader(str(out))
    box = reader.pages[0].mediabox
    return len(reader.pages), float(box.width), float(box.height)


# --------------------------------------------------------------------------- #
# main
# --------------------------------------------------------------------------- #

def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="build_portfolio_pdf.py",
        description="Render the manifest routes to one print-media PDF, with a "
                    "generated cover page.",
        epilog="Requires python 3 and a headless Chromium (chrome, edge or a chromium "
               "headless shell). Merging uses pypdf. The output is a build artifact: "
               "do not commit it.",
    )
    parser.add_argument("--manifest", default=str(ROOT / "portfolio-manifest.json"),
                        help="manifest JSON path (default: portfolio-manifest.json at the repo root)")
    parser.add_argument("--out", default=None,
                        help="output PDF path (default: the manifest's output_default, next to the repo root)")
    parser.add_argument("--chrome", default=None,
                        help="path to a chrome, edge or chromium binary (default: auto-discover, or CHROME_PATH)")
    parser.add_argument("--port", type=int, default=0,
                        help="loopback port for the local static server (default: any free port)")
    parser.add_argument("--keep-temp", action="store_true",
                        help="keep the per document intermediate PDFs and the chromium profile")
    parser.add_argument("--quiet", action="store_true", help="suppress per document chatter")
    args = parser.parse_args(argv)

    try:
        manifest = load_manifest(Path(args.manifest))
        chrome = discover_chrome(args.chrome)
    except BuildError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    out = Path(args.out) if args.out else ROOT / str(manifest["output_default"])
    if not out.is_absolute():
        out = (ROOT / out).resolve()
    out.parent.mkdir(parents=True, exist_ok=True)

    token = asset_version()
    cover_html = build_cover_html(manifest, token)
    QuietHandler.cover_html = cover_html

    handler = functools.partial(QuietHandler, directory=str(ROOT))
    port = args.port or free_port()
    try:
        server = ThreadedServer(("127.0.0.1", port), handler)
    except OSError as exc:
        print(f"error: cannot bind 127.0.0.1:{port} ({exc})", file=sys.stderr)
        return 1

    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    base = f"http://127.0.0.1:{port}"

    documents: list[tuple[str, str, int]] = [
        ("cover (generated)", f"{base}{COVER_HOST_PATH}", 1)
    ]
    for route in manifest["routes"]:
        path = str(route["path"])
        if not path.endswith("/") and "." not in path.rsplit("/", 1)[-1]:
            path += "/"
        documents.append((path, f"{base}{path}", int(route.get("pages") or 0)))

    tmp_root = Path(tempfile.mkdtemp(prefix="portfolio-pdf-"))
    parts: list[Path] = []
    rows: list[tuple[str, int, int, int]] = []
    cumulative = 0
    status = 0

    if not args.quiet:
        print(f"repo      {ROOT}")
        print(f"manifest  {Path(args.manifest)}")
        print(f"browser   {chrome}")
        print(f"server    {base}")
        print()

    try:
        for index, (label, url, target) in enumerate(documents):
            part = tmp_root / f"{index:02d}.pdf"
            profile = tmp_root / f"profile-{index:02d}"
            if not args.quiet:
                print(f"  rendering {label} ...", flush=True)
            render_pdf(chrome, url, part, profile, args.quiet)
            parts.append(part)

            from pypdf import PdfReader

            actual = len(PdfReader(str(part)).pages)
            cumulative += actual
            rows.append((label, target, actual, cumulative))

        total, width, height = merge_parts(parts, out)
    except BuildError as exc:
        print(f"error: {exc}", file=sys.stderr)
        status = 1
    finally:
        server.shutdown()
        server.server_close()
        if not args.keep_temp:
            import shutil

            shutil.rmtree(tmp_root, ignore_errors=True)
        else:
            print(f"intermediates kept in {tmp_root}")

    if status:
        return status

    print()
    print(f"{'document':<34}{'target':>7}{'pages':>7}{'cumulative':>12}")
    print("-" * 60)
    for label, target, actual, cumulative in rows:
        note = ""
        if target and actual > target:
            note = f"  (over target {target})"
        print(f"{label:<34}{target:>7}{actual:>7}{cumulative:>12}{note}")
    print("-" * 60)

    cap = int(manifest["max_pages"])
    print(f"total pages: {total}  (cap {cap})")
    print(f"page box: {width:.0f} x {height:.0f} pt "
          f"({width / 72 * 25.4:.0f} x {height / 72 * 25.4:.0f} mm)")
    print(f"output: {out}  ({out.stat().st_size:,} bytes)")
    print("note: the output PDF is a build artifact. Do not commit it.")

    if total > cap:
        print(f"error: {total} pages exceeds the {cap} page cap", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
