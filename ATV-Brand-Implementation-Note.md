# ATV Brand Guidelines — Web Implementation Note
**App:** atvcompanion.in · Astrology 101 Companion  
**Guidelines ref:** ATV Brand Guidelines 09-2025 (Yash Khataokar)  
**Updated:** May 2026 · v4.74.35

---

## Summary

This document explains how the ATV brand guidelines have been applied to the companion web app, what was implemented as specified, where close matches were used (and why), and what was not implemented.

---

## Typography

### ✅ Switzer — fully implemented
Switzer is loaded via Fontshare and used throughout as the body and UI font, matching the brand spec exactly.

| Role | Brand spec | App implementation |
|---|---|---|
| Body text | Switzer Extralight | Switzer (Fontshare, full family) ✓ |
| Subtitles / H2 | Switzer Medium | Switzer Medium ✓ |
| CTAs / H3 | Switzer Medium, All Caps | Switzer Medium (All Caps applied where relevant) ✓ |

### ⚠️ Libre Caslon Condensed → substituted with Libre Caslon Display
**Brand spec:** Libre Caslon Condensed for all major headings (H1).  
**What we use:** Libre Caslon Display + Libre Caslon Text as fallback.

**Why:** Libre Caslon Condensed is not available on Google Fonts (the free web font service the app uses). Only two Libre Caslon variants are freely available:
- **Libre Caslon Display** — designed for large headline sizes, similar intent to Condensed
- **Libre Caslon Text** — optimised for body/smaller sizes

We are using **Libre Caslon Display** as the primary headline font (`--display` token), with Libre Caslon Text as fallback. This preserves the serif character and headline intent from the guidelines.

**What the designer could provide:** If you have a licensed web font file (WOFF2) for Libre Caslon Condensed, we can self-host it and use it directly — this would make the implementation fully spec-compliant. Please share the font files if available.

**Font stack used:**
```
'Libre Caslon Display', 'Libre Caslon Text', 'Cormorant Garamond', serif
```

---

## Colors

### ✅ Exact matches — already in the app before this update

| Brand name | Brand hex | App token | Status |
|---|---|---|---|
| Charcoal Ash | `#282826` | `--ink` | ✅ Exact match |
| Deep Forest | `#32413B` | `--forest` | ✅ Exact match |
| Stormy Sky | `#6E7D85` | `--indigo` | ✅ Exact match |
| Golden Light tint | `#F8F4E1` | `--surface` | ✅ In palette |

These were arrived at independently before the brand guidelines were shared — good alignment.

### ✅ Updated to exact spec (May 2026)

| Brand name | Brand hex | App token | Old value | New value |
|---|---|---|---|---|
| Sunlit White | `#F8F6EF` | `--bg` | `#F4EEDA` | `#F8F6EF` ✅ |
| Terracotta Ember | `#B46E3B` | `--saffron` | `#BC8146` | `#B46E3B` ✅ |
| Muted Mauve | `#847171` | `--muted` | `#7C7B78` | `#847171` ✅ |
| Sunlit White mid | `#C8C5BF` | `--rule` | `#CAC6BB` | `#C8C5BF` ✅ |

These 4 tokens were updated across all 28 pages of the app in a single automated pass on May 2026.

### ℹ️ App-specific tokens (no direct brand equivalent)

The app uses a few additional tokens for UI needs that go beyond what the brand guidelines cover for print/social. These are derived from the brand palette:

| Token | Value | Derived from |
|---|---|---|
| `--bg-deep` | `#E0DCCD` | Golden Light mid tint |
| `--rule-soft` | `#E0DCCD` | Golden Light mid tint |
| `--ink-soft` | `#4B4B4A` | Charcoal Ash light tint |
| `--saffron-2` | `#d97706` | Terracotta Ember warm variant (used sparingly) |
| `--indigo` | `#6E7D85` | Stormy Sky (exact) |
| `--forest` | `#32413B` | Deep Forest (exact) |
| `--gold` | `#A3986D` | Golden Light deep tint |
| `--teal` | `#1a4d4d` | Deep Forest dark variant |

---

## What was NOT implemented

### Logo / Brandmark
The ATV logo/brandmark is not displayed in the app. The app is a cohort-only learning tool, not a public marketing surface — it uses the "Astrology 101 Companion" product identity rather than the ATV master brand. If you'd like the logo added (e.g. in the header or footer), please provide SVG assets and we can integrate them.

### Color do's and don'ts (misuse rules)
The brand guidelines specify avoiding gradients, pure black/white combinations, and mid-tone pairings. The app follows these principles — no gradients are used, and dark/light tone pairings follow the guidance.

### Typography hierarchy enforcement across all pages
The brand specifies a strict H1 → H2 → Body → H3/CTA hierarchy. The app's pages generally follow this but were built incrementally — not all pages enforce Switzer Medium for subtitles explicitly. This is a future cleanup item.

---

## Questions / decisions needed from designer

1. **Libre Caslon Condensed font files** — can you share WOFF2 files so we can self-host? This would close the one remaining type gap.
2. **Logo integration** — should the ATV brandmark appear anywhere in the app (header, about page, footer)? If yes, please share SVG.
3. **Background tone** — the app now uses Sunlit White (`#F8F6EF`) as the primary background. Does this read correctly against your brand materials? The previous value (`#F4EEDA`) was slightly warmer/more golden.

---

*Generated May 2026 · atvcompanion.in development team*
