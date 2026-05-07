# Avatars knowledge slice

Structured per-avatar profiles for the ten avatars of Vishnu (Daśāvatāra), built from Vikram's classes (allthingsvedic.in). One file per avatar, plus a consolidated JSON for any feature build that needs to consume them programmatically.

## Files

```
avatars/
├── README.md            ← this file
├── avatars.json         ← machine-readable index of all 10 avatars
├── 01-matsya.md
├── 02-kurma.md
├── 03-varaha.md
├── 04-narasimha.md
├── 05-vamana.md
├── 06-parashurama.md
├── 07-rama.md
├── 08-krishna.md
├── 09-buddha.md
└── 10-kalki.md
```

## Per-avatar markdown schema

Every file follows the same structure so they're directly comparable:

- **Header block** — order, form (English/Sanskrit), planet (Graha), yuga, source decks.
- **At a glance** — 1–2 sentence essence.
- **Story** — narrative as told in the deck.
- **Themes (per Vikram)** — bullets straight from Deck #55's mapping or the individual deck.
- **Keywords** — 6–10 short phrases that capture the avatar's energy.
- **Symbolism — philosophical reading** — what the avatar represents on the inner journey.
- **Astronomical / cosmological reading** — Vikram's cosmic parallels (Big Bang, black holes, sun's journey, etc.) where the deck offers them.
- **Self-reflection prompts** — quoted directly from the deck.
- **Sanskrit / technical terms** — gloss for terms the deck introduces.
- **Classical references** — only sources the deck cites (Mahabharata, Ramayana, Sri Aurobindo, etc.).
- **Cross-references** — planet, element (if any), signs (if any), related decks.
- **Notes** — caveats, deck quirks, gaps in extraction.

## Graha & Yuga mapping (Vikram's canon, Deck #55)

| # | Avatar | Graha | Yuga |
|---|--------|-------|------|
| 1 | Matsya | Ketu | Satya |
| 2 | Kurma | Saturn | Satya |
| 3 | Varaha | Rahu | Satya |
| 4 | Narasimha | Mars | Satya |
| 5 | Vamana | Jupiter | Treta |
| 6 | Parashurama | Venus | Treta |
| 7 | Rama | Sun | Treta |
| 8 | Krishna | Moon | Dwapura |
| 9 | Buddha | Mercury | Kali |
| 10 | Kalki | (not assigned in deck) | Kali (future) |

## Source decks

- Each avatar's individual deck (#7, #11 for Kurma via Samudra Manthan, #19, #23, #32, #38, #41, #49, #54).
- Deck #44 (Cosmology of Time) — the Yuga timeline and Kalki framing (~428,078–428,899 AD).
- Deck #55 (All the Avatars) — the consolidated Graha + Yuga + themes recap.

## What's in `avatars.json`

```jsonc
{
  "avatars": [ /* 10 entries with id, order, names, form, planet, yuga, themes,
                  keywords, primary_deck, source_decks, summary, md_file */ ],
  "yugas":           { "Satya Yuga": [...ids...], "Treta Yuga": [...], ... },
  "graha_to_avatar": { "Ketu": "matsya", "Saturn": "kurma", ... }
}
```

Use this as the canonical input for any feature that renders avatars, runs quizzes, builds a graha-to-avatar widget, or anything similar.

## Known gaps

- **Kalki** — no dedicated deck exists. Story / Symbolism / Self-reflection sections are deliberately marked *(not in deck)* rather than fabricated. Graha left as `null` in JSON.
- **Element / Sign cross-references** — Vikram's avatar decks don't map avatars to elements or signs (only to grahas). Marked *(not specified in deck)* uniformly.
- **Classical citations** — Vikram's avatar decks rarely name specific chapters. Where deck text cites a source (e.g. Matsya Purana in Deck #7, Sri Aurobindo's *Mother India* April 2007 in Deck #44), it's quoted; otherwise the section says *(none cited)*.
- **Astronomical reading** — present for most avatars but absent from Krishna, Buddha, and Matsya decks; marked *(not in deck)*.

## Companion file — peer-distilled prompts

`../reflective-prompts.md` (with JSON sidecar `../reflective-prompts.json`) holds a separate set of journaling prompts extracted by another agent. Voice is friendlier and more accessible than the deck-native prompts already in each avatar file. Buddha and Kalki are absent from that batch — flagged in the file. Treat as a parallel source, not a replacement.

## How to update

If a deck is re-cut or a new avatar deck appears:

1. Replace the source PDF in the iCloud `Decks - Astrology 101/` folder.
2. Re-run extraction (`pdftotext -layout`).
3. Update the relevant `decks/NN-...md` summary.
4. Update the matching `avatars/NN-name.md` profile.
5. Update `avatars.json` to keep the JSON index in sync.
