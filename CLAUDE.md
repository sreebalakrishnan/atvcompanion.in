# ATV Companion App — CLAUDE.md

## What this is
A companion app for Vikram Devatha's Astrology 101 class (allthingsvedic.in). Hosted at `atvcompanion.in`. Built by Sree Balakrishnan (gnuyoga@gmail.com).

**Mid-migration ("new flavour"):** moving from a zero-backend static site to an Express + Supabase app — auth, roles, and localStorage→Postgres migration. Phases 0–1 (backend + auth) are done; Phases 2–6 are pending. See "Active work threads".

## Architecture
- **Frontend.** Vanilla HTML + CSS + JS, one file per page. No build step, no framework. CSS tokens inline per page.
- **Backend (`server.js`).** Express 5. Serves the static site and a JSON API under `/api`. Boots fine without env vars — the static site still works; API routes just return errors.
- **Database.** Supabase Postgres via the `pg` Pool (`DATABASE_URL`). Schema in `db/schema.sql`, applied idempotently on every boot.
- **Auth.** Supabase email + password. Browser signs in client-side via `assets/auth.js`; `server.js` verifies the bearer token and resolves a role. See "Auth & roles".
- **Auth gate.** The old soft passcode gate is gone (`assets/gate.js` is dead code). Every page now requires a signed-in account (`gating.js`); within a page, role decides content depth. See "Auth & roles".
- **Nav:** `assets/site-nav.js` — single source of truth. Add pages to the `PAGES` array. Mount with `<div id="siteNavMount"></div>`. Also injects Plausible analytics and the shared script stack: `auth.js` → `storage.js` → `gating.js` → `scaffold.js` (skips any a page already includes explicitly).
- **Pedagogy scaffold** (`assets/scaffold.js`): drop `<div class="atv-video" data-title data-note>` for a captioned video placeholder, or `<div class="atv-reflect" data-key data-prompt>` for a reflect prompt that saves to `atvStore`. The full light scaffold per content page is orientation → video → sourced sections → reflect → next step.
- **Persistence:** currently `localStorage`; migrating to Postgres (Phase 2) via the `apiFetch` wrapper in `auth.js`.
- **Debug panel:** append `?debug=1` to any URL.
- **Deployment:** Vercel (the Express backend needs Node hosting). `vercel.json` routes all requests to `server.js`; `.vercelignore` excludes the KB, `_root/`, and `node_modules`. Env vars are set in Vercel project settings. Local dev: `npm install && npm start` → `http://localhost:8000`. (Was Hostinger static — no longer viable with a backend.)

## Auth & roles
- Three roles in the `profiles` table: **guest** (default — sees the public-safe site), **student** (approved cohort member — sees Vikram's teaching in full), **admin** (manages roles).
- Open signup: anyone can create an email+password account; everyone starts as guest. Admins promote students via `admin.html`.
- `ADMIN_EMAILS` env var auto-promotes listed emails to admin on first sign-in (bootstraps the first admin).
- Browser API: `window.atvAuth` (`.ready`, `.user`, `.signIn`, `.signOut`, `.apiFetch`, `.onChange`) and `window.atvUser`. Add `<script src="/assets/auth.js"></script>`; optionally `<div id="atvAuthMount"></div>` for the account chip.
- Server: `requireAuth` guards all `/api/*` except `/api/config`; `requireRole('admin')` guards admin routes.
- `auth.js` and `server.js` use modern JS (the ES5 constraint applies only to the legacy per-page scripts).
- **Auth gate** (`assets/gating.js`, site-wide): every page requires a signed-in account. Signed-out visitors on any page except the login pages (`index.html`, `account.html`) are redirected to `index.html?next=…`. `index.html` is the login — signed-out it shows only a sign-in panel (`html[data-home="out"]` hides the homepage content); signed-in it shows the dashboard + homepage.
- **Content gating** (also `gating.js`): tag blocks `data-audience="cohort"` (students/admins) or `data-audience="public"` (signed-in guests). Cohort blocks hidden by default CSS, revealed only for a confirmed student/admin role. Soft gate — markup stays in source; the real protection is the API requiring auth.

## Design system (CSS tokens — defined in every page's `<style>`)
Tokens map to the official **ATV Brand Guide** (`ATV Brand 20250828.pdf`) named colours.
```
--bg: #F8F6EF          --bg-deep: #DFDDD7     --surface: #F8F4E1
--cream: #F8F4E1       --ink: #282826         --ink-soft: #4B4B4A
--muted: #847171       --rule: #C8C5BF        --rule-soft: #DFDDD7
--saffron: #B46E3B     --gold: #D2C38C        --indigo: #6E7D85
--forest: #32413B      --umber: #453529
--display: 'Libre Caslon Text', 'Cormorant Garamond', serif
--body: 'Switzer', 'Spectral', system-ui, sans-serif
```
Brand colour names: `--bg` Sunlit White · `--surface` Golden Light tint · `--ink` Charcoal Ash · `--muted` Muted Mauve · `--saffron` Terracotta Ember · `--gold` Golden Light · `--indigo` Stormy Sky · `--forest` Deep Forest · `--umber` Earth Umber.
Fonts loaded via Google Fonts + Fontshare (Switzer). Max page width: `760px` (some pages use `820px`).
**Brand gaps (Phase 6):** headings should use Libre Caslon *Condensed* (brand spec), not Caslon Text + Cormorant fallback; `kaalapurusha.html` still on an old off-brand palette; the official logo/brandmark is unused.

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
| `demo.html` | Demo walkthrough for Vikram |
| `pricing.html` | Pricing page |
| `v0.html` | Vedic Astrology Explorer — earlier version, kept standalone |
| `quick-reference.html` | Redirect stub → `learning-companion.html` (meta-refresh) |
| `account.html` | Sign in / account — magic-link auth, shows role |
| `admin.html` | Admin dashboard — list members, set roles (admin-only) |

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

## Active work threads — "new flavour" build
- **Phase 0 (done):** Node/Express scaffold, `db/schema.sql`, Vercel config.
- **Phase 1 (done):** Supabase magic-link auth, roles, `auth.js`, `account.html`, `admin.html`.
- **Phase 2 (next):** localStorage → Postgres migration. `storage.js` shim; `/api/progress`, `/api/journal`, `/api/prefs`, `/api/chart` endpoints; one-time sync prompt.
- **Phase 3:** Content gating — tag "Vikram said…" / cohort blocks `data-audience="cohort"`, public-safe alternatives, `gating.js` role-aware swap.
- **Phase 4:** Light pedagogy scaffold on every content page (orientation → video placeholder → sourced sections → reflect prompt → next step). Tracks keep the full Moon-style 12-stop journey.
- **Phase 5:** Nav & IA re-look — regroup `site-nav.js` (Start · Tracks · Reference · Tools · Meta · Admin), role-aware.
- **Phase 6:** Fresh design pass — logged-in dashboard homepage, consistency review.

### Earlier (pre-migration) threads
- `planets/moon.html` — "The Moon" pilot, the template for all future tracks under `planets/`.
- Additional tracks (Sun, Mars, etc.) following `planets/moon.html` as the reference.

## Code conventions
- CSS tokens defined inline per page (no shared stylesheet — deliberate for zero-build simplicity)
- JS: ES5-compatible (no arrow functions, no `const`/`let` in critical paths, explicit null checks over optional chaining) for broad browser compat
- `site-nav.js` loaded before `</body>`; new pages added to the `PAGES` array in it
- No external JS libraries. No CDN dependencies for functionality (fonts only).

## Important constraints
1. All content must come from the KB (`astrology-101-knowledge-base/`). If in doubt, ask Sree before adding.
2. Source every content block with a citation (deck number, file name).
3. Do not predict, do not make up significations or interpretations not present in the KB.
4. Vikram's pedagogical principle: "Just don't let the computer take away the human." The app scaffolds the learner's own interpretation — it never generates it for them.
