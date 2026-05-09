# ATV Style Guide — Companion App

Derived from Vikram's official ATV Brand Guidelines (September 2025, designed by Yash Khataokar). Source PDF: `sources/ATV-Brand-Guidelines-2025-09.pdf`. This document is the working reference for the Astrology 101 Companion App. Update it as Vikram, Sudha, or Sree give feedback.

---

## Mission framing

> "Rather than make predictions about your future, we focus on helping you achieve your goals. Astrology helps in identifying (and dealing) with the blocks on your road to success." — ATV mission, brand book p. 22

This phrasing belongs in the app's framing wherever we explain what we're for. The companion app is the working surface for that mission.

---

## Logo

The brand has 5 logo variants. Reference (do not edit) the construction in the source PDF, p. 6–16.

- **V1 — Vertical logo** (primary). Brandmark above logotype. Use as the masthead on tall surfaces.
- **H1 — Horizontal logo**. Brandmark left, logotype right. Use as a site-nav lockup.
- **H2 — Horizontal compact**. Brandmark left, stacked "ALL / THINGS / VEDIC" right. Use in tight horizontal space.
- **B1 — Brandmark only**. The Niz mark (✻ glyph, reads as "Nāḍī" stylized). Use as favicon, app icon, share tiles.
- **L1 — Logotype only**. "ALL THINGS VEDIC" wordmark. Use when the brandmark would compete with other marks.

### Clearspace + minimum size (per variant)

| Variant | Min size (digital) | Min size (print) | Clearspace rule |
|---------|--------------------|--------------------|-----------------|
| V1      | 100 px             | 25 mm              | 2× the spacing between brandmark and logotype |
| H1      | 138 px             | 39 mm              | 1.5× the spacing between brandmark and logotype |
| H2      | 100 px             | 25 mm              | 2× the spacing between brandmark and logotype |
| B1      | 100 px             | 25 mm              | 2× the row height |
| L1      | 100 px             | 25 mm              | 2× the spacing between words |

### Logo misuse — never do (brand book p. 18)

1. Don't apply gradient.
2. Don't rotate the logo.
3. Don't change logo color outside the ATV palette.
4. Don't distort or warp.
5. Don't outline.
6. Don't change the typeface or manipulate the brandmark.
7. Don't apply drop shadows or effects.
8. Don't change transparency.
9. Don't crop the logo.

---

## Typography

The brand uses two typefaces, in this hierarchy:

### T1 — Libre Caslon Condensed (display)

A modern interpretation of a traditional serif. Used for **all major headlines** (H1, H2). Set in regular and italic across multiple weights. Conveys friendly + optimistic. The deck slide example uses **Libre Caslon Condensed Semibold Italic at 101pt** for slide titles.

### T2 — Switzer (body)

Modern sans for body, captions, sub-headlines. Common weights from the brand book examples:
- Switzer Light (26pt) — body lead-in
- Switzer Light Italic (27pt) — body
- Switzer Medium Italic (31pt) — accent / sub-heading
- Switzer Extralight — long-form body

### Hierarchy (brand book p. 22)

```
H1   Headline           Libre Caslon Condensed
H2   Headline 2         Libre Caslon Condensed
H3   Subheading         Libre Caslon Condensed
Body Body text          Switzer
CTA  "LINK IN BIO"      Switzer (uppercase, letterspaced)
```

### Typography misuse (brand book p. 23)

1. Don't change the font.
2. Don't rotate type.
3. Don't change color outside the ATV palette.
4. Don't distort, warp, or embellish.
5. Don't outline.
6. Don't create challenging layouts or spacing.
7. Don't apply drop shadows or effects.
8. Don't change transparency.
9. Don't change the typographic hierarchy.

---

## Colors

Three tone families. Each has a hero swatch + a tint scale for versatility.

### Bright tones — primary backgrounds + accents

| Name         | Hex         | Notes |
|--------------|-------------|-------|
| Sunlit White | `#F8F4E1`   | Primary cream background. |
| Golden Light | `#E1B650`*  | Hero brand color. (Approximate; confirm against source.) |

Tint scales (lightest → darkest) from p. 25:
- Sunlit White: `#F8F4E1` → `#E0DCCD` → `#CAC6BB` → `#AEABA0` → `#95948F` → `#7C7B78` → `#636260` → `#4B4B4A` → `#323130` → `#1B1B1B`
- Golden Light: `#D2C38C` → `#A3986D` → `#8C825D` → `#756D4E` → `#5D573E` → `#46412E`

### Dark tones — high-contrast typography + backgrounds

| Name         | Hex       | Notes |
|--------------|-----------|-------|
| Deep Forest  | `#32413B` | Primary dark. Reads grounded, contemplative. |
| Charcoal Ash | `#282826` | Near-black for body type on bright bgs. |
| Earth Umber  | `#4F3D2E` | Warm dark, pairs with Sunlit White. |

Each has a 6-step tint scale on p. 26.

### Mid tones — accents, mood, breaks from monotony

| Name              | Hex       | Notes |
|-------------------|-----------|-------|
| Muted Mauve       | `#85706F` | Reflective, moody. |
| Stormy Sky        | `#6E7D85` | Cool reflective. |
| Terracotta Ember  | `#BC8146` | Warm earthy accent — closest to the app's current saffron. |

Each has a 6-step tint scale on p. 27.

### Color misuse (brand book p. 28)

1. Don't apply gradients to surfaces.
2. Avoid pure black + pure white pairings.
3. Don't pick colors outside the ATV palette.
4. Don't pair high-brightness tones together in ways that hurt readability.
5. Don't change typography color outside the ATV palette.
6. Avoid using mid tones with each other as a pairing.

---

## Companion App — current state vs brand book

The app was built before the brand book landed in the project. Existing CSS tokens (read.html, quick-reference.html, etc.):

| Token         | Current value | Maps to brand book? |
|---------------|---------------|---------------------|
| `--bg`        | `#f3e9d2`     | Close to Sunlit White `#F8F4E1` but warmer/yellower |
| `--cream`     | `#faf3e2`     | Closer to Sunlit White |
| `--bg-deep`   | `#ead9b4`     | A Sunlit White tint, off-palette |
| `--surface`   | `#faf3e2`     | Same as `--cream` |
| `--saffron`   | `#b8410e`     | App's hero accent — much more saturated than Terracotta Ember `#BC8146` |
| `--ink`       | `#1f1a2e`     | Off-palette (purple-dark, not Charcoal Ash) |
| `--ink-soft`  | `#4a4055`     | Off-palette |
| `--muted`     | `#7d6f55`     | A Sunlit-White tint, roughly on-palette |
| `--rule`      | `#d4c39a`     | Sunlit White tint, on-palette |
| `--rule-soft` | `#e3d4ad`     | Sunlit White tint, on-palette |
| `--indigo`    | `#2a3270`     | Off-palette (used sparingly) |
| `--display`   | Cormorant Garamond | Off-brand (should be Libre Caslon Condensed) |
| `--body`      | Spectral       | Off-brand (should be Switzer) |

### Gap

- **Saffron** is the app's signature hero color. The brand book uses Terracotta Ember `#BC8146` for the same role — softer, less alarming. A migration would tone down the heat.
- **Ink** is purple-toned in the app; brand wants Charcoal Ash neutral.
- **Display font** is Cormorant Garamond (close-but-not Libre Caslon).
- **Body font** is Spectral (serif), not Switzer (sans). This is the biggest visual mismatch — the brand uses serif headlines + sans body, the app uses serif everywhere.

### Migration plan (when we're ready)

Stage A — colors only, no font changes:
- Swap `--saffron` `#b8410e` → `#BC8146` (Terracotta Ember). Test legibility on cream.
- Swap `--ink` `#1f1a2e` → `#282826` (Charcoal Ash).
- Align `--bg` family to Sunlit White tints.
- Keep everything else.

Stage B — load Switzer for body:
- Add Switzer via Google Fonts or self-host.
- Swap `--body` to Switzer.
- Test reading-density across read.html, quick-reference.html.

Stage C — load Libre Caslon Condensed for display:
- Confirm font availability (it's on Google Fonts).
- Swap `--display`.
- Visually verify masthead, eyebrows, and walk-card titles.

Each stage should ship as its own minor release with before/after screenshots in release notes for Vikram + Sudha to review.

---

## App-specific patterns (not from brand book — derived from how we've built the app)

These are conventions Sree, Vikram, and Sudha have established through iteration. They sit alongside the brand book, not inside it.

### Voice & tone

- **Humility above prediction.** Never use predictive language. Frame as conversation, invitation, or remedy. (Vikram, May 2026.)
- **"From the class."** Source claims with deck number and session date when possible. Never invoke unattributed authority.
- **No public-internet sources.** When learners need reference material, use Vikram's class material (decks, transcripts, KB notes). Don't paraphrase from generic astrology websites.
- **System surfaces references; learner writes the sentence.** Vikram's principle. The app shows facts (placement + sign + ruler + Karaka) but never auto-generates interpretation lines like "Moon in Aries — energized initiating." That's the learner's work.

### Structural patterns

- **Eyebrow + heading + body.** Section pattern: small italic uppercase eyebrow in saffron, then display heading, then body prose. Used everywhere.
- **Walk-through cards.** Per-house and per-planet analysis cards follow a fixed scaffold: subject tag → quick-reference drawer → analysis blocks (sign / planets / pati / karaka) → exercise prompt → self-check → nav.
- **Sticky writing pad.** Bottom-banner fixed pad for the learner's reflection. Not sticky-positioned; `position: fixed`. Collapsible.
- **Path A vs Path B.** House interpretation (Path A, 8 steps) and planet interpretation (Path B, 3 steps) are explicitly separated. They don't combine — that's the rule from Vikram's May 2026 procedure correction.

### Anti-patterns (don't do)

- **No `<script>` linking to MD files inside HTML pages.** Reference material should be inline in the page, not external. (Sree's correction, v4.54.1.)
- **No Karaka × house keyword combinations.** That's the 8-billion-people test failure. (Vikram's class, deck 63 correction.)
- **No system-generated interpretation sentences.** Surface facts and references only. (Vikram's "don't let the computer take away the human" feedback.)

### Component vocabulary

| Pattern | Where used | Notes |
|---------|------------|-------|
| Drawer + chip-row | Quick Reference inside walk cards | One prominent tile per dimension + chip alternates (v4.57.0) |
| South Indian chart | read.html, quick-reference.html, interactive.html | Signs FIXED in canonical positions; only house numbers rotate per Lagna |
| Two-door entry | read.html chart view | "Read a house" / "Read a planet" doors before walk-through |
| Welcome card | All pages | First-visit tip card; dismissible, persists in localStorage |
| Update banner | All pages | Reads version.json on focus; toast when out of date |

---

## How this guide is used

When working on the app, reference this file before:

- Picking or adjusting colors → check the palette table above.
- Changing typography → confirm we're staying within Libre Caslon + Switzer (or document the deviation).
- Adding new copy that frames the app's purpose → align with the mission line.
- Building new pages or components → follow the structural patterns and avoid the anti-patterns.

If a request would require deviating from the brand book, surface that explicitly so Vikram can decide. Don't silently drift.
