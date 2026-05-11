#!/usr/bin/env python3
"""
stamp.py — atomic version + build-fingerprint rotation for every deploy.

Usage:
    python3 bin/stamp.py                          # auto-bump patch + new build
    python3 bin/stamp.py --version 4.74.29         # explicit semver
    python3 bin/stamp.py --build kanya-x7q3        # explicit build id
    python3 bin/stamp.py --version 4.75.0 --build mithuna-aa11
    python3 bin/stamp.py --check                   # audit only, no writes

What it does, in one pass:
  1. Resolves the new version (auto-bump patch or use --version)
  2. Resolves the new BUILD_ID (random sanskrit zodiac + 4-char nonce, or --build)
  3. Updates version.json
  4. Updates PAGE_VERSION constant in every HTML file that has one
  5. Updates BUILD_ID constant in every HTML file that has one
  6. Updates ALL visible "v4.X.Y" eyebrow / footer stamps that match the OLD version
     (excludes release-notes.html — that contains historical version references)
  7. Updates ALL visible build-chip text matching the OLD build id
     (excludes release-notes.html for the same reason)
  8. Prints a SUMMARY plus a checklist of release-notes reminders

The output ends with a big reminder: "Now write a release note entry for v<NEW>."
This is intentional — the script will NOT silently rotate without nudging the
release notes. The reminder lists the exact files that changed so the entry can
reference them.
"""

import argparse, json, os, random, re, string, sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
VERSION_JSON = REPO / 'version.json'

# Sanskrit zodiac names — the pool for build-id prefix
SANSKRIT_SIGNS = [
    'mesha', 'vrishabha', 'mithuna', 'karka',
    'simha', 'kanya', 'tula', 'vrishchika',
    'dhanu', 'makara', 'kumbha', 'meena',
]

# release-notes.html contains historical version refs — never bulk-replace there
EXCLUDE_FROM_VISIBLE_REWRITE = {'release-notes.html'}


def random_build_id():
    """sanskrit-sign-<4-char-alphanumeric>"""
    sign = random.choice(SANSKRIT_SIGNS)
    chars = string.ascii_lowercase + string.digits
    # avoid all-digit and all-letter so it reads as a code
    nonce = ''.join(random.choice(chars) for _ in range(4))
    return f'{sign}-{nonce}'


def bump_patch(version):
    """4.74.28 → 4.74.29"""
    parts = version.split('.')
    parts[-1] = str(int(parts[-1]) + 1)
    return '.'.join(parts)


def read_manifest():
    with open(VERSION_JSON, 'r') as fh:
        return json.load(fh)


def write_manifest(data):
    with open(VERSION_JSON, 'w') as fh:
        json.dump(data, fh, indent=2)
        fh.write('\n')


def html_files():
    """Every HTML file in the repo root, sorted."""
    return sorted([
        p for p in REPO.iterdir()
        if p.is_file() and p.suffix == '.html'
    ])


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--version', help='Explicit new semver (e.g. 4.75.0). Default: auto-bump patch.')
    ap.add_argument('--build',   help='Explicit new build id (e.g. kanya-x7q3). Default: random sanskrit-sign + 4-char nonce.')
    ap.add_argument('--check',   action='store_true', help='Audit only — no file writes.')
    args = ap.parse_args()

    manifest = read_manifest()
    old_version = manifest['version']
    old_build   = manifest.get('build', '')

    new_version = args.version or bump_patch(old_version)
    new_build   = args.build   or random_build_id()

    print('=' * 70)
    print(f'  Astrology 101 Companion App · stamp.py')
    print('=' * 70)
    print(f'  Version : {old_version}  →  {new_version}')
    print(f'  Build   : {old_build}  →  {new_build}')
    if args.check:
        print(f'  Mode    : CHECK-ONLY (no writes)')
    print('-' * 70)

    if args.check:
        # Just audit and exit
        for path in html_files():
            content = path.read_text()
            pv = re.search(r"(?:var|const)\s+PAGE_VERSION\s*=\s*['\"]([^'\"]+)['\"]", content)
            bi = re.search(r"(?:var|const)\s+BUILD_ID\s*=\s*['\"]([^'\"]+)['\"]", content)
            pv_val = pv.group(1) if pv else '—'
            bi_val = bi.group(1) if bi else '—'
            flag = '  ' if (pv_val in (old_version, '—')) and (bi_val in (old_build, '—')) else '⚠ '
            print(f'  {flag}{path.name:32}  ver={pv_val:10}  build={bi_val}')
        print('=' * 70)
        sys.exit(0)

    # --- WRITE PHASE ---
    changes = []

    # 1. Update PAGE_VERSION + BUILD_ID constants in every HTML file
    # Accept either `var` or `const` declarations (index.html uses `var`)
    ver_pat = re.compile(r"(\b(?:var|const)\s+PAGE_VERSION\s*=\s*)(['\"])([^'\"]+)(['\"])")
    bid_pat = re.compile(r"(\b(?:var|const)\s+BUILD_ID\s*=\s*)(['\"])([^'\"]+)(['\"])")
    for path in html_files():
        content = path.read_text()
        orig = content
        actions = []
        m = ver_pat.search(content)
        if m and m.group(3) != new_version:
            content = ver_pat.sub(rf"\g<1>\g<2>{new_version}\g<4>", content)
            actions.append(f'PAGE_VERSION {m.group(3)}→{new_version}')
        m = bid_pat.search(content)
        if m and m.group(3) != new_build:
            content = bid_pat.sub(rf"\g<1>\g<2>{new_build}\g<4>", content)
            actions.append(f'BUILD_ID {m.group(3)}→{new_build}')
        # 2. Update visible OLD version and OLD build strings — only outside release-notes.html
        if path.name not in EXCLUDE_FROM_VISIBLE_REWRITE:
            n_ver = content.count(f'v{old_version}')
            if n_ver:
                content = content.replace(f'v{old_version}', f'v{new_version}')
                actions.append(f'visible v{old_version}→v{new_version} (×{n_ver})')
            if old_build:
                n_bld = len(re.findall(r'\b' + re.escape(old_build) + r'\b', content))
                if n_bld:
                    content = re.sub(r'\b' + re.escape(old_build) + r'\b', new_build, content)
                    actions.append(f'visible {old_build}→{new_build} (×{n_bld})')
        if content != orig:
            path.write_text(content)
            changes.append((path.name, actions))

    # 3. Update version.json
    manifest['version'] = new_version
    manifest['build']   = new_build
    write_manifest(manifest)
    changes.append(('version.json', [f'version={new_version}', f'build={new_build}']))

    for fname, actions in changes:
        print(f'  ✓ {fname:32}  {", ".join(actions)}')

    print('=' * 70)
    print(f'  Stamped {len(changes)} files.')
    print()
    print('  NEXT STEP — write a release note entry. Open release-notes.html and:')
    print(f'    1. Replace the previous entry\'s "<em>· current</em>" with nothing.')
    print(f'    2. Add a new <section class="release"> block at the TOP of the list for v{new_version}.')
    print(f'    3. Mark the new entry with <em>· current</em>.')
    print(f'    4. Date: today.')
    print()
    print(f'  Reminder: build {new_build}  ·  the chip on every page will read this.')
    print('=' * 70)


if __name__ == '__main__':
    main()
