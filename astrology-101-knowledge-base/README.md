# Astrology 101 — Knowledge Base

Persistent notes from your Sunday Vedic Astrology classes with Vikram (allthingsvedic.in). Built so I (Claude) can pick up context across sessions and so you can re-find anything quickly.

The KB has **two complementary layers**: the **decks** (visual class slides) and the **transcripts** (actual classroom conversations from Microsoft Teams recordings). Decks for crisp definitions and lists; transcripts for Vikram's exact phrasing, learner questions, and the texture of how concepts unfold across weeks.

## What's here

```
astrology-101-knowledge-base/
├── README.md                    ← you are here
├── INDEX.md                     ← all 73 decks in order, with type + page count
├── THEMES.md                    ← decks grouped by topic (avatars, houses, astronomy, ...)
├── reflective-prompts.md        ← peer-distilled journaling prompts
├── reflective-prompts.json      ← machine-readable sidecar
├── shlokas.json                 ← 7 shlokas (Ganapati, 4 Devi mantras, Kshama, Mukundamala)
├── houses-classical.json        ← per-house BPHS / UK / SC / HS / Brihat Jataka extracts
├── planets-classical.json       ← per-planet Parashara / Phala Deepika / UK extracts
├── anatomical-map.json          ← Kalapurusha body-part ↔ sign mappings
├── avatars/                     ← structured per-avatar profiles (10 markdown + avatars.json)
├── decks/                       ← LAYER 1: one markdown summary per deck (74 files)
├── extracted/                   ← raw pdftotext output, one .txt per deck
├── 101 call transcripts/        ← LAYER 2 (raw): 41 .docx files of weekly class transcripts
├── transcripts/                 ← LAYER 2 (extracted): markdown form of the .docx files
│   ├── HANDOFF.md               ← course metadata, full session list, SP / Equal House math
│   ├── INDEX.md                 ← session-by-session map + extraction status
│   └── NN-slug.md               ← one .md per class session (1–38) once extracted
└── raw_meta/
    └── manifest.psv             ← filename | pages | size_kb | mtime | words
```

## How to use it

- **Browsing chronologically** → open `INDEX.md`.
- **Looking for a topic** → open `THEMES.md` (this is the better entry point most of the time).
- **Reading a specific deck** → open `decks/NN-slug.md`. Each note has Topic, Key concepts, Sanskrit terms, Names/references, and Notes.
- **Need the original PDF** → filenames in `INDEX.md` and at the top of each deck note point back to the source folder in iCloud.

## Curriculum shape (what the 73 decks add up to)

The course interleaves four threads:

1. **Astronomy** — Earth, solar system, coordinate systems (Az/Alt, RA/Dec), apparent motions, precession.
2. **Mythology** — the 10 avatars of Vishnu, the four Mahashaktis (Mahasaraswathi/Mahalakshmi/Mahakali/Maheshwari), Vedic scriptures, Yugas.
3. **Astrology fundamentals** — signs, nakshatras, dualities, modalities, elements, planetary cabinet, dispositors, aspects.
4. **Houses** — Vikram returns to this block at the end, iterating versions 1-4 of both "The Houses" and "House Systems" decks.

Plus: regular case studies (Bar in Heaven, ABV/Vajpayee, Lizard Family), Stellarium labs, retreats, and self-work (dreams, signature exercises).

## Iterated decks — which version is canonical?

Vikram re-cuts decks as the year progresses. When you reach for the latest:

- **House Systems** → #69 (v4)
- **The Houses** → #67 (v2 — first fully complete) or the later #70/#74 if you want refinements
- **Earth** → #8 (extends #4)
- **Dualities** → #15 (full version, supersedes #14)
- **Planetary Cabinet** → #43 (concepts) + #45 (applied)

## Things flagged during ingestion

- **Deck 37 is a video** (`37. Dreamwork.mov`) — not text-extractable. The note in `decks/37-dreamwork-video.md` is a stub.
- **Deck 56 "My story"** is image-only — only the title slide extracted.
- **Deck 29 "Live Lab Session — Stellarium"** is also screenshot-only; stub note.
- **Devanagari Sanskrit shlokas** in some decks (Mahalakshmi 25, Houses 67/70/74) extracted with garbled glyphs; transliterations and English translations are clean.
- A handful of small content quirks (e.g., the cited Bhagavad Gita verses in deck 44) are flagged inside individual deck notes.

## Source

**Decks (PDFs)** — `/Users/sreeb/Library/Mobile Documents/com~apple~CloudDocs/05_Astrology/Decks - Astrology 101/`. Last full ingestion: 2026-05-05 (covers all decks through #74 — Sun, Moon, and Houses v4).

**Transcripts (.docx)** — sourced from `~/Downloads/101 call transcripts/` (41 files, originally exported from Microsoft Teams; processed on 2026-04-04 by a previous Claude session). Bodies fully extracted 2026-05-06 — 38 canonical sessions covering May 4, 2025 → March 22, 2026, plus an Assignments Compendium. Two duplicate-numbered sessions (Vikram labelled both Sept 21 and Sept 28 as "Session 18") are disambiguated as `18a` and `18b`. There is no session 28 (Vikram skipped that number). See `transcripts/INDEX.md` for the full canonical map.

## Working with the two layers

When researching for the quick-reference page or any new content:

- Need a definitional answer (rulership, aspect rules, classical citation)? Start in `decks/` and `*-classical.json`.
- Need Vikram's exact phrasing or learner-question texture? Start in `transcripts/` (once extracted).
- Cross-checking that a quiz question reflects class material rather than generic Vedic-astrology content? Search both layers.
