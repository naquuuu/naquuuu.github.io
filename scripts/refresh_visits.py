#!/usr/bin/env python3
"""Refresh the same-origin visit total snapshot used by the footer.

GoatCounter's public total lives on ``naquuuu.goatcounter.com``. That host is
unreachable from some networks (and blocked by some browsers/adblockers), which
made the footer counter disappear silently because the markup hides itself when
the request fails (ADR-039, amended by ADR-057).

So the page now reads ``assets/data/visits.json`` from its own origin, and this
script keeps that snapshot fresh. ``.github/workflows/visits.yml`` runs it daily;
run it by hand after a big publish:

    python scripts/refresh_visits.py
    python scripts/refresh_visits.py --dry-run

Exit code is 0 when the endpoint cannot be read: a counter refresh must never
turn a scheduled job red or block a publish.
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ENDPOINT = "https://naquuuu.goatcounter.com/counter/TOTAL.json"
USER_AGENT = "naquuuu-visits-refresh/1.0"
ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / "assets" / "data" / "visits.json"
TIMEOUT_SECONDS = 15


def fetch_total(timeout: int = TIMEOUT_SECONDS) -> str:
    """Return the public visit total as a digit string."""
    request = urllib.request.Request(ENDPOINT, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        payload = json.loads(response.read().decode("utf-8"))
    count = str(payload.get("count", "")).strip()
    if not count.isdigit():
        raise ValueError(f"endpoint returned no usable count: {payload!r}")
    return count


def read_snapshot() -> dict[str, str]:
    """Return the current snapshot, or an empty dict when it is missing or broken."""
    if not TARGET.is_file():
        return {}
    try:
        data = json.loads(TARGET.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}
    return data if isinstance(data, dict) else {}


def write_snapshot(count: str) -> None:
    """Write the snapshot with a UTC timestamp, LF endings, trailing newline."""
    stamp = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    payload = {"count": count, "updated": stamp}
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    TARGET.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8", newline="\n")


def main() -> int:
    parser = argparse.ArgumentParser(description="Refresh the public visit total snapshot.")
    parser.add_argument("--dry-run", action="store_true", help="report the change without writing")
    parser.add_argument("--timeout", type=int, default=TIMEOUT_SECONDS, help="request timeout in seconds")
    args = parser.parse_args()

    try:
        count = fetch_total(args.timeout)
    except (urllib.error.URLError, ValueError, OSError) as exc:
        print(f"skip: counter endpoint unreadable ({exc})")
        return 0

    current = read_snapshot()
    previous = current.get("count")
    if previous == count:
        print(f"unchanged: {count} visits")
        return 0

    if args.dry_run:
        print(f"would update: {previous or 'none'} -> {count} visits")
        return 0

    write_snapshot(count)
    print(f"updated: {previous or 'none'} -> {count} visits ({TARGET.relative_to(ROOT).as_posix()})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
