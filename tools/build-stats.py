#!/usr/bin/env python3
"""
build-stats.py — regenerates the numbers used in stats.html.

Run from the project root:
    python3 tools/build-stats.py

It prints a JSON object with all the counts. To refresh stats.html, copy the
relevant numbers into the page (or wire this into ship.sh later if you want
fully automatic regeneration).

Counts as of v4.29.0:
  - source_corpus  — Vikram's class decks + transcripts (the well we drew from)
  - build          — file counts, sizes, lines, words across the HTML pages
  - quick_ref      — counts inside quick-reference.html (sections, quizzes, etc.)
  - cohort         — contributors + release count

Single-file Python; no external deps. Uses regex + os.walk only.
"""

import json
import os
import re
import sys
from pathlib import Path


def project_root():
    """Walk up from this file to find the repo root (folder containing version.json)."""
    here = Path(__file__).resolve().parent
    for parent in [here] + list(here.parents):
        if (parent / "version.json").exists():
            return parent
    return here.parent  # fallback


ROOT = project_root()


def file_size(path):
    try:
        return os.path.getsize(path)
    except OSError:
        return 0


def file_lines(path):
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return sum(1 for _ in f)
    except OSError:
        return 0


def file_words(path):
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return len(f.read().split())
    except OSError:
        return 0


def total_files(root, exclude_paths=(".git",)):
    n = 0
    total_bytes = 0
    for dirpath, dirnames, filenames in os.walk(root):
        # prune excluded dirs in place
        dirnames[:] = [d for d in dirnames if d not in exclude_paths]
        for fn in filenames:
            fp = os.path.join(dirpath, fn)
            n += 1
            total_bytes += file_size(fp)
    return n, total_bytes


def kb_stats(kb_root):
    """Knowledge base counts."""
    if not kb_root.exists():
        return {}
    stats = {}
    for sub, ext in [
        ("transcripts", ".md"),
        ("extracted", ".txt"),
        ("decks", ".md"),
        ("avatars", ".md"),
    ]:
        d = kb_root / sub
        if not d.exists():
            stats[sub] = {"files": 0, "words": 0}
            continue
        files = list(d.glob(f"*{ext}"))
        words = sum(file_words(f) for f in files)
        stats[sub] = {"files": len(files), "words": words}

    # all KB files + size
    n, total = total_files(kb_root, exclude_paths=())
    stats["all"] = {"files": n, "bytes": total}
    return stats


def html_stats(root):
    """Top-level HTML pages (excluding the V0 archive — V0 is its own thing)."""
    pages = [
        "quick-reference.html",
        "kaalapurusha.html",
        "mercury-spectrum.html",
        "astronomy.html",
        "release-notes.html",
        "demo.html",
        "v0.html",
    ]
    out = {}
    sum_bytes = sum_lines = sum_words = 0
    for p in pages:
        fp = root / p
        if not fp.exists():
            continue
        b = file_size(fp)
        l = file_lines(fp)
        w = file_words(fp)
        out[p] = {"bytes": b, "lines": l, "words": w}
        sum_bytes += b
        sum_lines += l
        sum_words += w
    out["__total__"] = {"bytes": sum_bytes, "lines": sum_lines, "words": sum_words}
    return out


def quick_reference_counts(root):
    """Counts of structures inside quick-reference.html."""
    fp = root / "quick-reference.html"
    if not fp.exists():
        return {}
    with open(fp, "r", encoding="utf-8", errors="ignore") as f:
        src = f.read()

    # Sections (those with data-level attribute on <section>)
    sections = len(re.findall(r"<section\s[^>]*data-level=", src))

    # Quiz keys inside QUIZZES const
    quizzes_block = re.search(r"const\s+QUIZZES\s*=\s*\{(.*?)\n\};", src, re.DOTALL)
    quiz_count = 0
    if quizzes_block:
        quiz_count = len(re.findall(
            r"^\s+(signs|qualities|avatars|cabinet|planets|signature|relationships|aspects|yogas|houses|systems|categories|purusharthas|kaalapurusha|practice|workbook)\s*:\s*\{",
            quizzes_block.group(1),
            re.MULTILINE,
        ))

    # VIKRAM_QUOTES top-level keys
    vq_block = re.search(r"const\s+VIKRAM_QUOTES\s*=\s*\{(.*?)\n\};", src, re.DOTALL)
    vq_count = 0
    if vq_block:
        # Match top-level keys (one indent level)
        vq_count = len(re.findall(r"^\s{2}\w+\s*:\s*\{", vq_block.group(1), re.MULTILINE))

    # COURT_CALL question count — count "{ q:" occurrences
    court_count = len(re.findall(r"\{\s*q\s*:", src.split("const COURT_CALL")[1].split("];")[0])) if "const COURT_CALL" in src else 0

    # Cabinet entries (the 9 court roles)
    cab_block = re.search(r"const\s+CABINET\s*=\s*\{(.*?)\n\};", src, re.DOTALL)
    cab_count = 0
    if cab_block:
        cab_count = len(re.findall(
            r"^\s+(sun|moon|mars|mercury|venus|jupiter|saturn|rahu|ketu)\s*:",
            cab_block.group(1),
            re.MULTILINE,
        ))

    # AVATARS entries
    av_block = re.search(r"const\s+AVATARS\s*=\s*\{(.*?)\n\};", src, re.DOTALL)
    av_count = 0
    if av_block:
        av_count = len(re.findall(
            r"^\s+(matsya|kurma|varaha|narasimha|vamana|parashuram|rama|krishna|buddha|kalki)\s*:",
            av_block.group(1),
            re.MULTILINE,
        ))

    return {
        "sections": sections,
        "quizzes": quiz_count,
        "vikram_quotes": vq_count,
        "court_call_questions": court_count,
        "cabinet_planets": cab_count,
        "avatars": av_count,
    }


def cohort_stats(root):
    """Releases + unique contributors from release-notes.html."""
    fp = root / "release-notes.html"
    if not fp.exists():
        return {}
    with open(fp, "r", encoding="utf-8", errors="ignore") as f:
        src = f.read()

    releases = len(re.findall(r'<section class="release"', src))

    # Unique contributors from data-credits attributes.
    # Strip parentheticals so "Sudha (Light/Shadow catch)" → "Sudha".
    raw_credits = re.findall(r'data-credits="([^"]+)"', src)
    # Noise filter: prose-example tokens like "Name" / "context" appear in release-notes
    # body text where I describe the data-credits pattern (e.g., 'data-credits="Name · context"').
    # Real contributors are Capitalised proper nouns; reject anything that's lowercase or in this blocklist.
    noise = {"Name", "context", "name"}
    names = set()
    for c in raw_credits:
        # Split on · or , — but only when outside parentheses
        # (matches the JS regex in release-notes.html v4.22.0)
        parts = re.split(r'[·,](?![^(]*\))', c)
        for p in parts:
            # Strip trailing parenthetical: "Vikram (decks)" → "Vikram"
            p = re.sub(r'\s*\([^)]*\)\s*$', '', p).strip()
            if not p or p in noise:
                continue
            # Reject anything starting with a lowercase letter (likely prose token)
            if p[0].islower():
                continue
            names.add(p)

    return {
        "releases": releases,
        "contributors": sorted(names),
        "contributor_count": len(names),
    }


def version_info(root):
    fp = root / "version.json"
    if not fp.exists():
        return {}
    with open(fp, "r", encoding="utf-8") as f:
        return json.load(f)


def main():
    stats = {
        "version": version_info(ROOT),
        "totals": {},
        "kb": kb_stats(ROOT / "astrology-101-knowledge-base"),
        "html": html_stats(ROOT),
        "quick_reference": quick_reference_counts(ROOT),
        "cohort": cohort_stats(ROOT),
    }
    n_total, b_total = total_files(ROOT)
    stats["totals"]["all_files"] = n_total
    stats["totals"]["all_bytes"] = b_total

    json.dump(stats, sys.stdout, indent=2, ensure_ascii=False, sort_keys=False)
    print()


if __name__ == "__main__":
    main()
