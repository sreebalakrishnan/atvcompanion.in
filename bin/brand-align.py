#!/usr/bin/env python3
"""
brand-align.py — apply ATV brand guidelines (colors + typography) across all site HTML pages.

Changes made:
  Colors:
    --bg:      #F4EEDA  →  #F8F6EF  (Sunlit White — brand background)
    --saffron: #BC8146  →  #B46E3B  (Terracotta Ember — brand accent)
    --muted:   #7C7B78  →  #847171  (Muted Mauve — brand mid tone)
    --rule:    #CAC6BB  →  #C8C5BF  (Sunlit White mid tint)

  Also replaces hardcoded hex + rgba occurrences of the above.

  Typography:
    Google Fonts URL: adds Libre Caslon Display to any URL that has Libre Caslon Text
    --display font stack: prepends 'Libre Caslon Display'

  Untouched (already brand-correct):
    --ink:     #282826  (Charcoal Ash — exact match)
    --forest:  #32413B  (Deep Forest — exact match)
    --indigo:  #6E7D85  (Stormy Sky — exact match)
    --surface: #F8F4E1  (Golden Light tint — in palette)

Usage:
    python3 bin/brand-align.py           # apply changes
    python3 bin/brand-align.py --check   # dry-run, no writes
"""

import argparse, os, re, sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

# ── Color replacements (CSS token values + hardcoded hex + rgba) ──────────────
COLOR_SWAPS = [
    # (old_hex_upper, new_hex_upper, old_rgb_tuple, new_rgb_tuple, label)
    ('#F4EEDA', '#F8F6EF', (244, 238, 218), (248, 246, 239), '--bg / Sunlit White'),
    ('#BC8146', '#B46E3B', (188, 129,  70), (180, 110,  59), '--saffron / Terracotta Ember'),
    ('#7C7B78', '#847171', (124, 123, 120), (132, 113, 113), '--muted / Muted Mauve'),
    ('#CAC6BB', '#C8C5BF', (202, 198, 187), (200, 197, 191), '--rule / Sunlit White mid'),
]

# ── Typography ────────────────────────────────────────────────────────────────
OLD_DISPLAY_STACK = "'Libre Caslon Text', 'Cormorant Garamond', 'Times New Roman', serif"
NEW_DISPLAY_STACK = "'Libre Caslon Display', 'Libre Caslon Text', 'Cormorant Garamond', serif"

# Also handle double-quote variant
OLD_DISPLAY_STACK_DQ = '"Libre Caslon Text", "Cormorant Garamond", "Times New Roman", serif'
NEW_DISPLAY_STACK_DQ = '"Libre Caslon Display", "Libre Caslon Text", "Cormorant Garamond", serif'

# Google Fonts: insert Libre Caslon Display into the URL
# Matches the family= segment containing Libre+Caslon+Text and adds Display variant
FONT_URL_PATTERN = re.compile(
    r'(https://fonts\.googleapis\.com/css2\?[^"\']+)',
)

def upgrade_font_url(url):
    """Add Libre+Caslon+Display to a Google Fonts URL if Libre+Caslon+Text is present."""
    if 'Libre+Caslon+Display' in url:
        return url  # already there
    if 'Libre+Caslon+Text' not in url and 'Libre%2BCaslon%2BText' not in url:
        return url  # not a relevant URL
    # Insert Display family before Libre+Caslon+Text
    return url.replace(
        'family=Libre+Caslon+Text',
        'family=Libre+Caslon+Display&family=Libre+Caslon+Text'
    )


def make_rgba_pattern(r, g, b):
    """Build a regex that matches rgba(r,g,b,...) with flexible whitespace."""
    return re.compile(
        r'rgba\(\s*' + str(r) + r'\s*,\s*' + str(g) + r'\s*,\s*' + str(b) + r'\s*,([^)]+)\)',
        re.IGNORECASE
    )


def html_files():
    files = sorted([p for p in REPO.iterdir() if p.is_file() and p.suffix == '.html'])
    # Include planets/ subdirectory
    planets = REPO / 'planets'
    if planets.is_dir():
        files += sorted([p for p in planets.iterdir() if p.is_file() and p.suffix == '.html'])
    return files


def apply_to_file(path, dry_run=False):
    content = path.read_text(encoding='utf-8')
    original = content
    actions = []

    # 1. Color hex replacements (case-insensitive)
    for old_hex, new_hex, old_rgb, new_rgb, label in COLOR_SWAPS:
        # Hex — both upper and lower case variants
        for variant in [old_hex, old_hex.lower()]:
            count = content.count(variant)
            if count:
                content = content.replace(variant, new_hex)
                actions.append(f'{variant}→{new_hex} (×{count}) [{label}]')

        # rgba() — replace matching rgb tuple, preserve alpha
        rgba_pat = make_rgba_pattern(*old_rgb)
        new_r, new_g, new_b = new_rgb
        replacement = f'rgba({new_r},{new_g},{new_b},\\1)'
        new_content, n = rgba_pat.subn(replacement, content)
        if n:
            content = new_content
            actions.append(f'rgba({old_rgb[0]},{old_rgb[1]},{old_rgb[2]},…)→rgba({new_r},{new_g},{new_b},…) (×{n}) [{label}]')

    # 2. Display font stack — CSS variable
    if OLD_DISPLAY_STACK in content:
        content = content.replace(OLD_DISPLAY_STACK, NEW_DISPLAY_STACK)
        actions.append('--display font stack updated (single-quote)')
    if OLD_DISPLAY_STACK_DQ in content:
        content = content.replace(OLD_DISPLAY_STACK_DQ, NEW_DISPLAY_STACK_DQ)
        actions.append('--display font stack updated (double-quote)')

    # Also handle the font-family in inline styles referencing just 'Libre Caslon Text,...'
    inline_old = "font-family:'Libre Caslon Text','Cormorant Garamond',serif"
    inline_new = "font-family:'Libre Caslon Display','Libre Caslon Text','Cormorant Garamond',serif"
    if inline_old in content:
        content = content.replace(inline_old, inline_new)
        actions.append('inline font-family updated')

    inline_old2 = 'font-family:Libre Caslon Text,Cormorant Garamond,serif'
    inline_new2 = 'font-family:Libre Caslon Display,Libre Caslon Text,Cormorant Garamond,serif'
    if inline_old2 in content:
        content = content.replace(inline_old2, inline_new2)
        actions.append('inline font-family (unquoted) updated')

    # 3. Google Fonts URL — add Libre Caslon Display
    def replace_font_url(m):
        upgraded = upgrade_font_url(m.group(1))
        if upgraded != m.group(1):
            actions.append('Google Fonts URL: added Libre+Caslon+Display')
        return upgraded
    content = FONT_URL_PATTERN.sub(replace_font_url, content)

    if content != original:
        if not dry_run:
            path.write_text(content, encoding='utf-8')
        return actions
    return []


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--check', action='store_true', help='Dry-run — report changes without writing.')
    args = ap.parse_args()

    mode = 'CHECK' if args.check else 'APPLY'
    print('=' * 70)
    print(f'  ATV Brand Align · {mode} mode')
    print('=' * 70)

    total_files = 0
    for path in html_files():
        actions = apply_to_file(path, dry_run=args.check)
        if actions:
            rel = path.relative_to(REPO)
            print(f'\n  ✓ {rel}')
            for a in actions:
                print(f'      {a}')
            total_files += 1

    print()
    print('=' * 70)
    if args.check:
        print(f'  DRY RUN complete — {total_files} files would change. Run without --check to apply.')
    else:
        print(f'  Done — {total_files} files updated.')
        print()
        print('  NEXT: run  python3 bin/stamp.py  to bump version + build ID.')
    print('=' * 70)


if __name__ == '__main__':
    main()
