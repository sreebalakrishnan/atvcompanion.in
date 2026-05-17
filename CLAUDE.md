# ATV Companion App — CLAUDE.md

## What this is
A cohort-only companion app for Vikram Devatha's Astrology 101 class (allthingsvedic.in). Hosted at `atvcompanion.in`. Deployed via Static.app from the `main` branch. Built by Sree Balakrishnan (gnuyoga@gmail.com).

## Architecture
- **Zero backend.** Vanilla HTML + CSS + JS only. No build step, no framework.
- **Gate:** `assets/gate.js` — soft passcode gate (passcode: `groundfirst`). All pages except `index.html`, `feedback.html`, `collaborate.html`, `about.html` are gated. Add gate to any new gated page: pre-paint hider in `<head>` immediately after `</title>`, then `<script src="assets/gate.js"></script>` before `</body>`.
- **Nav:** `assets/site-nav.js` — single source of truth for site navigation. Add new pages to the `PAGES` array here. Mount with `<div id="siteNavMount"></div>`.
- **Persistence:** `localStorage` only. No user accounts.
- **Deployment:** push to `main` → Static.app deploys automatically. The deploy workflow excludes `astrology-101-knowledge-base/`, `_root/`, and internal scripts.

## Design system (CSS tokens — defined in every page's `<style>`)
```
--bg: #F4EEDA          --bg-deep: #E0DCCD     --surface: #F8F4E1
--ink: #282826         --ink-soft: #4B4B4A    --muted: #7C7B78
--rule: #CAC6BB        --rule-soft: #E0DCCD   --saffron: #BC8146
--indigo: #6E7D85      --forest: #32413B
--display: 'Libre Caslon Text', 'Cormorant Garamond', serif
--body: 'Switzer', 'Spectral', system-ui, sans-serif
```
Fonts loaded via Google Fonts + Fontshare (Switzer). Max page width: `760px` (some pages use `820px`).

## Knowledge base (`astrology-101-knowledge-base/`)
All content must come from this KB. Do not synthesise or add content not present here.

### Key files
| File | Contents |
|---|---|
| `decks/73-moon.md` | Moon astronomy, significations, mythology (Krishna), signs one-liners, sleep guidance, Anapha/Sunapha/Kemadruma yogas |
| `decks/72-sun.md` | Sun deck — Parts of Speech framework origin |
| `planets-classical.json` | Classical significations for Sun, Moon, Mars, Mercury (astronomy→meaning pairs, Parashara, Uttara Kalamrita, Phala Deepika) |
| `houses-classical.json` | 12-house classical significations from Deck 67 (BPHS, Uttara Kalamrita, Sarvartha Chintamani, Hora Sara, Brihat Jataka) |
| `avatars/08-krishna.md` | Krishna avatar — Moon association, philosophical reading (Decks 49, 44, 55), self-reflection prompts |
| `interpretation-framework.md` | Vikram's two anchors: Parts of Speech + The Intention (from Deck 72) |
| `house-planet-interpretation-guidance.md` | Vikram's 8-step house analysis + 3-step planet analysis + Golden Rules |
| `reflective-prompts.md` | Peer-distilled reflection prompts (Elements, Dualities, 8 Avatars including Krishna/Moon) |
| `INDEX.md` | Master index of all 74+ decks and 38 transcripts |
| `THEMES.md` | Cross-cutting theme index |

### Source citation rule
**Every stop or content block must cite its KB source.** Use a `.source-line` element at the bottom of each content section. Format: `Source: Deck 73 — Moon · planets-classical.json`. If content is not in the KB, mark it clearly and do not fabricate.

## Pages (as of May 2026)
| Page | Purpose |
|---|---|
| `index.html` | Homepage — Today's Sky (South Indian chart), live planet positions |
| `planets/moon.html` | **The Moon — pilot** — 12-stop learning journey (Planet Path) |
| `journey.html` | Workbook team prototype — 4-layer pedagogy, NOT learner-facing |
| `learning-companion.html` | Planet/sign/house reference |
| `reflect.html` | Reflective journalling |
| `interpret.html` | Chart interpretation (beta) |
| `read.html` | Guided chart reading with Vikram's 8-step procedure |
| `bhavas.html` | 12 Bhavas matchbox brief |
| `aspects.html` | Drishti/aspects tool |
| `elements.html` | Four elements |
| `catch-up.html` | Missed a class? |
| `kaalapurusha.html` | Kaalapurusha |
| `mercury-spectrum.html` | Mercury detail |
| `jupiter-tracker.html` | Jupiter tracker |
| `astronomy.html` | Astronomy reference |
| `signature.html` | Signature for one |
| `interactive.html` | Interactive (beta) |
| `sripati.html` | Sripati Paddhati |
| `ether.html` | Ether |
| `where-am-i.html` | Orientation |
| `layers.html` | Layers |
| `stats.html` | Usage stats |
| `about.html` | About the project |
| `feedback.html` | Feedback form |
| `collaborate.html` | Manifesto (public) |
| `release-notes.html` | Version history |

## Journey architecture (Sanchi's spec — May 2026)
```
Path
 └── Track
      └── Journey
           ├── Resting Spots (reflection, journalling)
           ├── Action Spots (rituals, tasks)
           ├── Traveller Meeting Spots (peer sharing)
           └── Backpack (prerequisites)
```
`planets/moon.html` is the **pilot implementation** — the reference file for all future track pages (Sun, Mars, etc.). All planet tracks live under `planets/`. The `journey.html` file is the workbook team's prototype and should remain separate.

## planets/moon.html — localStorage keys
| Key | Contents |
|---|---|
| `atv-moon-track-v1` | `{ completed: [1,2,...] }` — completed stop numbers |
| `atv-moon-journal-v1` | All journal textarea values, quiz answers, phase journal, keyed by element ID |

## What is NOT in the KB yet (as of May 2026)
- Moon-specific house descriptions (Moon in 1H, Moon in 2H, etc.) — Stop 8 of planets/moon.html uses general house significations + prompts the learner to make the connection
- Buddha and Kalki avatar prompts (missing from reflective-prompts.md)
- Decks beyond 77 (Mars and Mercury are latest extractions)
- Sun, Mars, Mercury track content (not yet structured)

## Active work threads
- **Phase 1 (planned):** App entry redesign — two-door entry (need-based vs. cohort-structured). Not yet built.
- **Phase 2 (pilot complete):** `planets/moon.html` — "The Moon" — first track page, template for all future tracks under `planets/`.
- **Phase 3 (planned):** Additional tracks (Sun, Mars, etc.) following planets/moon.html as the reference.

## Code conventions
- CSS tokens defined inline per page (no shared stylesheet — deliberate for zero-build simplicity)
- JS: ES5-compatible (no arrow functions, no `const`/`let` in critical paths) for broad browser compat
- `gate.js` must come last before `</body>` on gated pages, with the pre-paint hider in `<head>`
- `site-nav.js` always before `gate.js`
- No external JS libraries. No CDN dependencies for functionality (fonts only).

## Important constraints
1. All content must come from the KB (`astrology-101-knowledge-base/`). If in doubt, ask Sree before adding.
2. Source every content block with a citation (deck number, file name).
3. Do not predict, do not make up significations or interpretations not present in the KB.
4. The gate passcode (`groundfirst`) appears in `gate.js` source — this is intentional (soft gate, not real auth).
5. Vikram's pedagogical principle: "Just don't let the computer take away the human." The app scaffolds the learner's own interpretation — it never generates it for them.
