# Call Transcripts — Index

The **call-transcript layer** of the knowledge base — actual recorded language from Vikram's weekly Astrology 101 (2025) class. Distinct from `decks/` (the visual class slides) and `extracted/` (raw pdftotext from those slides).

Originals: `../101 call transcripts/*.docx` (41 files).
Extracted on **2026-05-06** from local copies (originals were iCloud-evicted on first pass; user moved them to `~/Downloads/` to materialise the bytes, then `request_cowork_directory` gained access).

## How session numbers were assigned

Three different numbering schemes existed in the source files. We chose **Vikram's body-labelled scheme** as canonical, because that's what learners see in class.

- *Filename suffix* (e.g., `(13).docx`) — assigned by Microsoft Teams when files were exported. Not chronological. Off-by-one in places. Discarded.
- *Handoff doc rows* — the previous Claude session's summary, which had a row-numbering glitch around session 18. Used for cross-reference but not as truth.
- *Body label* (e.g., the first paragraph of each transcript reads "18. Retreat Debrief, Parashuram & Stellarium") — Vikram's own numbering. **This is the canonical scheme used in this folder's filenames.**

Consequences worth knowing:
- **Two sessions are both labelled "18"** in Vikram's scheme — Sept 21 (Retreat) and Sept 28 (Maheshwari). Disambiguated as `18a` and `18b` in filenames, with `a` = the earlier date.
- **There is no session 28** in Vikram's scheme — he skipped from "27. Krishna Avatar" (Dec 14) to "29. Thoughts from Learners & Houses" (Dec 28). The skip is preserved.
- **Two pairs of duplicate exports** exist: the Intro Call .docx files and the unnumbered cover.docx are content-identical to sessions 1 and 38 respectively. The duplicates have been redirected to single canonical files.

## Canonical session map

| Body # | Date | Title | File |
|---|---|---|---|
| 1 | May 4, 2025 | Plan for the year | [`01-plan-for-the-year.md`](01-plan-for-the-year.md) |
| 2 | May 11, 2025 | Hindu Vedic Scriptures, Retreats & Earth | [`02-hindu-vedic-scriptures-retreats-earth.md`](02-hindu-vedic-scriptures-retreats-earth.md) |
| 3 | May 18, 2025 | Vyasa | [`03-vyasa.md`](03-vyasa.md) |
| 4 | May 25, 2025 | Matsya Avatar & Earth | [`04-matsya-avatar-earth.md`](04-matsya-avatar-earth.md) |
| 5 | June 1, 2025 | Speed and Solar System | [`05-speed-and-solar-system.md`](05-speed-and-solar-system.md) |
| 6 | June 8, 2025 | Orange activity | [`06-orange-activity.md`](06-orange-activity.md) |
| 7 | June 15, 2025 | Samudra Manthan & Planet in Sign | [`07-samudra-manthan-planet-in-sign.md`](07-samudra-manthan-planet-in-sign.md) |
| 8 | June 22, 2025 | Temples & Dualities | [`08-temples-dualities.md`](08-temples-dualities.md) |
| 9 | June 29, 2025 | Roadmap, Dualities & Modalities | [`09-roadmap-dualities-modalities.md`](09-roadmap-dualities-modalities.md) |
| 10 | July 13, 2025 | Mentors, Case Study 1 & Varaha | [`10-mentors-case-study-1-varaha.md`](10-mentors-case-study-1-varaha.md) |
| 11 | July 20, 2025 | Azimuth, Altitude & Mahasaraswathi | [`11-azimuth-altitude-mahasaraswathi.md`](11-azimuth-altitude-mahasaraswathi.md) |
| 12 | July 27, 2025 | Sky at Birth & Narasimha | [`12-sky-at-birth-narasimha.md`](12-sky-at-birth-narasimha.md) |
| 13 | August 3, 2025 | Celestial Equator & Mahalakshmi | [`13-celestial-equator-mahalakshmi.md`](13-celestial-equator-mahalakshmi.md) |
| 14 | August 10, 2025 | Dreamwork, RA & Declination, Sun & Moon | [`14-dreamwork-ra-declination-sun-moon.md`](14-dreamwork-ra-declination-sun-moon.md) |
| 15 | August 17, 2025 | Live Lab Session — Stellarium | [`15-live-lab-session-stellarium.md`](15-live-lab-session-stellarium.md) |
| 16 | August 31, 2025 | Vamana Avatar & Signature | [`16-vamana-avatar-signature.md`](16-vamana-avatar-signature.md) |
| 17 | September 7, 2025 | Mahakali & Ayanamsha | [`17-mahakali-ayanamsha.md`](17-mahakali-ayanamsha.md) |
| **18a** | September 21, 2025 | Retreat Debrief, Parashuram & Stellarium | [`18a-retreat-debrief-parashuram-stellarium.md`](18a-retreat-debrief-parashuram-stellarium.md) |
| **18b** | September 28, 2025 | Maheshwari & Joining the Dots | [`18b-maheshwari-joining-the-dots.md`](18b-maheshwari-joining-the-dots.md) |
| 19 | October 5, 2025 | The Moon's orbit | [`19-the-moon-s-orbit.md`](19-the-moon-s-orbit.md) |
| 20 | October 12, 2025 | Rama Avatar | [`20-rama-avatar.md`](20-rama-avatar.md) |
| 21 | October 19, 2025 | Rama Avatar & Elements | [`21-rama-avatar-elements.md`](21-rama-avatar-elements.md) |
| 22 | November 2, 2025 | Elements and Nodes | [`22-elements-and-nodes.md`](22-elements-and-nodes.md) |
| 23 | November 9, 2025 | Planetary Cabinet | [`23-planetary-cabinet.md`](23-planetary-cabinet.md) |
| 24 | November 16, 2025 | Planetary Cabinet & Natural Relationships | [`24-planetary-cabinet-natural-relationships.md`](24-planetary-cabinet-natural-relationships.md) |
| 25 | November 23, 2025 | Relationships & Apparent Motions | [`25-relationships-apparent-motions.md`](25-relationships-apparent-motions.md) |
| 26 | December 7, 2025 | Case Study — Atal Behari Vajpayee | [`26-case-study-atal-behari-vajpayee.md`](26-case-study-atal-behari-vajpayee.md) |
| 27 | December 14, 2025 | Krishna Avatar | [`27-krishna-avatar.md`](27-krishna-avatar.md) |
| *(28 skipped by Vikram)* | — | — | — |
| 29 | December 28, 2025 | Thoughts from Learners & Houses | [`29-thoughts-from-learners-houses.md`](29-thoughts-from-learners-houses.md) |
| 30 | January 4, 2026 | Astronomy of Houses | [`30-astronomy-of-houses.md`](30-astronomy-of-houses.md) |
| 31 | January 18, 2026 | End of Year & Buddha Avatar | [`31-end-of-year-buddha-avatar.md`](31-end-of-year-buddha-avatar.md) |
| 32 | January 25, 2026 | Avatars & my story | [`32-avatars-my-story.md`](32-avatars-my-story.md) |
| 33 | February 1, 2026 | Intro to Houses | [`33-intro-to-houses.md`](33-intro-to-houses.md) |
| 34 | February 8, 2026 | Kinds of Houses & Interpretation | [`34-kinds-of-houses-interpretation.md`](34-kinds-of-houses-interpretation.md) |
| 35 | February 15, 2026 | Interpretation, Kinds of Houses, House Systems | [`35-interpretation-kinds-of-houses-house-systems.md`](35-interpretation-kinds-of-houses-house-systems.md) |
| 36 | February 22, 2026 | Houses & Interpretation | [`36-houses-interpretation.md`](36-houses-interpretation.md) |
| 37 | March 1, 2026 | Sripathi Paddhathi and Houses | [`37-sripathi-paddhathi-and-houses.md`](37-sripathi-paddhathi-and-houses.md) |
| 38 | March 22, 2026 | SP Method, Houses, Starting Interpretations | [`38-sp-method-houses-starting-interpretations.md`](38-sp-method-houses-starting-interpretations.md) |

**Plus:** [`99-assignments-compendium.md`](99-assignments-compendium.md) — non-class document, course-wide assignments collated.

## Two-layer KB

The knowledge base now has two complementary layers:

1. **Decks** (`../decks/`, `../extracted/`) — the visual slides Vikram presented. Best for definitional content: rulerships, exaltations, classical citations, lists.
2. **Transcripts** (this folder) — the actual classroom conversations. Best for: Vikram's exact phrasing, learner questions, lived examples, the *texture* of how concepts unfold across weeks. Use when you need "what did Vikram say in his own words" rather than "what's the rule."

When researching for the quick-reference page or quizzes, prefer transcripts for tone and phrasing, decks for crisp definitions, and **always cross-check** before importing language from outside the KB.

## Cross-references to other KB layers

These point at the obvious concept overlaps. Use them as a starting frame, not a substitute for grep across the actual transcript bodies.

- Avatars: 4 (Matsya), 10 (Varaha), 12 (Narasimha), 16 (Vamana), 18a (Parashuram), 20–21 (Rama), 27 (Krishna), 31 (Buddha), 32 (Avatars & my story) ↔ `../avatars/`.
- Mahāśakti shlokas: 11 (Mahasaraswathi), 13 (Mahalakshmi), 17 (Mahakali), 18b (Maheshwari) ↔ `../shlokas.json`.
- Planetary cabinet & relationships: 23, 24, 25 ↔ `../planets-classical.json`.
- Case studies: 10 (Case Study 1), 26 (Vajpayee) ↔ `../decks/48-case-study-abv.md` and related deck notes.
- House systems & interpretation: 30, 33–38 ↔ `../houses-classical.json` and the SP / Equal House walkthroughs preserved in `HANDOFF.md`.
- Foundations layered through the year: 6 (Orange), 7 (Samudra Manthan), 8 (Temples & Dualities), 9 (Dualities & Modalities), 22 (Elements & Nodes) ↔ `../THEMES.md` and `../decks/42-elements.md` etc.

## Stub files in this folder

A handful of filenames from the first extraction pass remain as **redirect stubs** (the mount blocks deletion). They each say where the canonical file lives:

- `00-intro-call.md`, `00-intro-call-2.md` → redirect to `01-plan-for-the-year.md`
- `01a-...`, `01b-...`, `38a-...`, `38b-...` → redirect to canonical (a/b were duplicate exports of the same recording)
- `18-retreat-debrief-...` (no suffix) → redirect to `18a-...`
- `19-maheshwari-...`, `20-the-moon-s-orbit.md`, `21-rama-avatar.md`, `22-rama-avatar-elements.md`, `23-elements-and-nodes.md`, `24-planetary-cabinet.md`, `25-...`, `26-...`, `27-case-study-...` → redirect to the correctly-numbered canonical (these were misnumbered by an earlier extraction that trusted the buggy handoff numbering).
- `99-astrology-101-cover.md` → redirect to `38-sp-method-...` (the cover .docx was a duplicate of session 38).

## Files in this folder

- `HANDOFF.md` — preserved handoff doc with course metadata, full session list (with the original numbering quirks), and the SP / Equal House calculations.
- `INDEX.md` — this file.
- `_mapping.json` — machine-readable session ↔ file map.
- 38 canonical session `.md` files (with `18a`/`18b` for the duplicate-numbered Sept sessions) + 1 assignments compendium.
- ~16 redirect stubs (described above).
