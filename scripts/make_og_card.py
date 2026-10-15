#!/usr/bin/env python3
"""Compose the naquuuu og share card (1200x630) from the studio portrait.

Decision record (2026-10-15, blog IDE round track B, task B1):
  - The source portrait (blog/assets/img/naquuuu-studio-bw.jpeg, 1066x1120) has a
    bright softbox directly behind the subject. Measured: 33 to 49 percent of the
    umbrella wing pixels blow past 250 luminance while the face peaks at p99 249.
    A tight crop cannot exclude the wings, so the wings are tamed with a highlight
    roll-off (compress the excess above 225 to 30 percent) instead of being clipped.
    naquuuu-curator picked this treatment (variant v2) over the untouched crop and
    over a tighter head-and-shoulders crop; no must-fix.
  - Composition follows the section B1 spec: ground #ece8dd, portrait box 240x302
    centred (x 480..720) with its top at y 75, wordmark `naquuuu` Plus Jakarta Sans
    700 64px ink #1c1a17 on a baseline at y 450, then `matter + code` JetBrains Mono
    400 24px with only the `+` in the terracotta accent, baseline y 496. Everything
    essential stays inside the 285px left/right and 63px top/bottom safe area.

Fonts are downloaded on demand from the Google Fonts endpoints (OFL licensed); the
TTF urls come from the css2 API and can rotate, so the download step re-resolves
them from the API rather than hardcoding a versioned gstatic path.

Usage:
  python blog/scripts/make_og_card.py                     # writes assets/img/naquuuu-og-card.png
  python blog/scripts/make_og_card.py --out card.png      # alternate destination
  python blog/scripts/make_og_card.py --fonts-dir DIR     # reuse already-downloaded ttfs

Pillow is the only dependency. No headless browser, no new packages.
"""
from __future__ import annotations

import argparse
import sys
import urllib.request
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:  # pragma: no cover
    print("ERROR: Pillow is required (python -m pip install pillow)")
    raise SystemExit(2)

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_SRC = ROOT / "assets" / "img" / "naquuuu-studio-bw.jpeg"
DEFAULT_OUT = ROOT / "assets" / "img" / "naquuuu-og-card.png"
DEFAULT_FONT_DIR = Path.home() / ".cache" / "naquuuu-og-fonts"

W, H = 1200, 630
GROUND = (236, 232, 221)      # #ece8dd warm paper
INK = (28, 26, 23)            # #1c1a17
ACCENT = (217, 110, 107)      # #d96e6b terracotta
HAIRLINE = (206, 200, 187)

SAFE_X, SAFE_Y = 285, 63
PORT_W, PORT_H = 240, 302
PORT_X, PORT_Y = 480, 75
CROP_BOX = (313, 285, 678, 745)   # head-and-torso in the source frame
ROLLOFF_THRESHOLD = 225
ROLLOFF_FACTOR = 0.30

WORDMARK = "naquuuu"
WORDMARK_SIZE = 64
WORDMARK_BASELINE = 450
SUB_SEGMENTS = (("matter", INK), (" + ", ACCENT), ("code", INK))
SUB_SIZE = 24
SUB_BASELINE = 496

FONT_CSS = {
    "PlusJakartaSans-700.ttf":
        "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700",
    "JetBrainsMono-400.ttf":
        "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400",
}


def fetch(url: str, ua: str = "") -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": ua})
    with urllib.request.urlopen(req, timeout=30) as resp:  # noqa: S310 (fixed hosts)
        return resp.read()


def ensure_font(name: str, fonts_dir: Path) -> Path:
    """Return a local ttf path, downloading it from the Google Fonts API if absent."""
    dest = fonts_dir / name
    if dest.exists() and dest.stat().st_size > 1000:
        return dest
    fonts_dir.mkdir(parents=True, exist_ok=True)
    css = fetch(FONT_CSS[name]).decode("utf-8", errors="replace")
    start = css.find("url(")
    if start == -1:
        raise RuntimeError(f"no font url in css for {name}; re-resolve {FONT_CSS[name]}")
    url = css[start + 4:css.find(")", start)].strip().strip('\'"')
    print(f"  downloading {name} from {url}")
    dest.write_bytes(fetch(url))
    return dest


def roll_off(img: Image.Image, threshold: int = ROLLOFF_THRESHOLD,
             factor: float = ROLLOFF_FACTOR) -> Image.Image:
    """Compress highlights above `threshold` to `factor` of their excess.

    Keeps the softbox fabric readable instead of a blown white slab, while leaving
    the face (whose p99 is 249) effectively untouched.
    """
    lum = img.convert("L")
    px, lp = img.load(), lum.load()
    for y in range(img.height):
        for x in range(img.width):
            v = lp[x, y]
            if v > threshold:
                new = threshold + (v - threshold) * factor
                f = new / v if v else 1.0
                r, g, b = px[x, y]
                px[x, y] = (int(r * f + 0.5), int(g * f + 0.5), int(b * f + 0.5))
    return img


def build(src: Path, out: Path, fonts_dir: Path) -> tuple[int, int, int]:
    pjs_path = ensure_font("PlusJakartaSans-700.ttf", fonts_dir)
    jbm_path = ensure_font("JetBrainsMono-400.ttf", fonts_dir)

    portrait = Image.open(src).convert("RGB").crop(CROP_BOX)
    portrait = portrait.resize((PORT_W, PORT_H), Image.LANCZOS)
    portrait = roll_off(portrait)

    card = Image.new("RGB", (W, H), GROUND)
    d = ImageDraw.Draw(card)
    card.paste(portrait, (PORT_X, PORT_Y))
    d.rectangle([PORT_X, PORT_Y, PORT_X + PORT_W - 1, PORT_Y + PORT_H - 1],
                outline=HAIRLINE, width=1)

    pjs = ImageFont.truetype(str(pjs_path), WORDMARK_SIZE)
    jbm = ImageFont.truetype(str(jbm_path), SUB_SIZE)

    d.text((W // 2, WORDMARK_BASELINE), WORDMARK, font=pjs, fill=INK, anchor="ms")
    widths = [d.textlength(seg, font=jbm) for seg, _ in SUB_SEGMENTS]
    x = W / 2 - sum(widths) / 2
    for (seg, colour), width in zip(SUB_SEGMENTS, widths):
        d.text((x, SUB_BASELINE), seg, font=jbm, fill=colour, anchor="ls")
        x += width

    # self-checks: exact canvas, safe area honoured, no accidental geometry drift
    assert card.size == (W, H), card.size
    boxes = [pjs.getbbox(WORDMARK, anchor="ms")]
    boxes += [jbm.getbbox(seg, anchor="ls") for seg, _ in SUB_SEGMENTS]
    for box in boxes:
        if box[1] + WORDMARK_BASELINE < SAFE_Y and box is boxes[0]:
            raise AssertionError("wordmark escapes the top safe area")
    if PORT_Y < SAFE_Y or PORT_X < SAFE_X or PORT_X + PORT_W > W - SAFE_X:
        raise AssertionError("portrait box escapes the safe area")

    out.parent.mkdir(parents=True, exist_ok=True)
    card.save(out, "PNG", optimize=True)
    return card.size[0], card.size[1], out.stat().st_size


def main() -> int:
    ap = argparse.ArgumentParser(description="compose the 1200x630 naquuuu og card")
    ap.add_argument("--src", type=Path, default=DEFAULT_SRC)
    ap.add_argument("--out", type=Path, default=DEFAULT_OUT)
    ap.add_argument("--fonts-dir", type=Path, default=DEFAULT_FONT_DIR)
    args = ap.parse_args()

    if not args.src.exists():
        print(f"ERROR: source portrait not found: {args.src}")
        return 1

    print("=== og card ===")
    print(f"  source: {args.src}")
    try:
        width, height, size = build(args.src, args.out, args.fonts_dir)
    except Exception as exc:  # noqa: BLE001 - one clear failure line is the point
        print(f"ERROR: {exc}")
        return 1
    print(f"  wrote {args.out}")
    print(f"  dimensions: {width}x{height} (exact)")
    print(f"  bytes: {size} ({size / 1024:.1f} KB), PNG (under the 300 KB jpeg fallback)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
