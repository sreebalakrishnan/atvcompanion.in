# ATV Companion — "New Flavour" Implementation Plan

> Living document. Update the status markers as work lands. Last updated: **2026-05-22**.
> Status legend: ✅ done · 🔄 in progress · ⏳ pending · ⛔ blocked

## The shift
Moving atvcompanion from a zero-backend static site to an **Express + Supabase**
app — auth, roles, a real database, content gating, a consistent learning
scaffold, and a fresh design pass. Reference architecture: the sibling
project `rm.sreeb.dev`.

## Decisions locked in
| Decision | Choice |
|---|---|
| Backend | Express 5 + Supabase Postgres (`pg`) — the `rm.sreeb.dev` pattern |
| Hosting | Vercel (Node). Was Hostinger static — no longer viable with a backend |
| Auth method | Email + password (magic-link was built then dropped at user request) |
| Email confirmation | Recommended OFF (instant accounts, no SMTP dependency) |
| Roles | guest (default) · student (approved) · admin |
| Student access | Open signup → everyone guest → admin promotes in `admin.html` |
| Guest content gating | Public-safe version — classical KB content only, no "Vikram said…" |
| Pedagogy spread | Light scaffold on every content page; full 12-stop journey for tracks |
| First verification | Localhost first, then deploy + cut the domain over |

## Where we are today (2026-05-22)
Phases 0, 1, 2, 5 **complete**. Phases 3, 4, 6 have their **mechanisms built**
(`gating.js`, `scaffold.js`, `dashboard.js`) — what remains in each is the
editorial/design rollout (tagging cohort content, applying the scaffold per
page, the cross-page consistency review). Backend verified live. Still to do:
in-browser sign-in test (after "Confirm email" off) and the Vercel deploy.

---

## Phase 0 — Foundation ✅
- ✅ Node/Express scaffold — `package.json`, `server.js`, `vercel.json`, `.vercelignore`, `.env.example`
- ✅ `db/schema.sql` — all tables
- ✅ Supabase project provisioned (`rnqaevzlaqmdbobmcgja`)
- ✅ Schema applied to Supabase; RLS enabled (server-only access)
- ⏳ Deploy to Vercel + cut `atvcompanion.in` over — deferred (localhost-first)

## Phase 1 — Auth & roles ✅
- ✅ `profiles` table; `requireAuth`, `loadProfile`, `requireRole` middleware
- ✅ `ADMIN_EMAILS` bootstrap (auto-promotes first admin)
- ✅ `assets/auth.js` — email + password sign-in / sign-up / reset
- ✅ `account.html` — sign in / create account / forgot password
- ✅ `admin.html` — member list, role management
- ✅ Verified: token accepted, `/api/me` → admin, admin endpoint role-gated
- ⏳ In-browser sign-in test (needs "Confirm email" OFF in Supabase)
- ⏳ "Change password" screen for signed-in users — small follow-up

## Phase 2 — Data model & localStorage migration ✅
- ✅ Tables: `track_progress`, `journal_entries`, `preferences`, `chart_data`
- ✅ API: `/api/progress`, `/api/journal`, `/api/prefs`, `/api/chart` — all verified
- ✅ `assets/storage.js` — `atvStore` shim + one-time legacy migration banner
- ✅ **All 6 pages rewired to `atvStore`:** `moon` · `elements` · `bhavas` ·
  `reflect` · `index` · `learning-companion`.
- Pattern: pages that read storage *synchronously at boot* (index, learning-
  companion) keep localStorage as the fast path and layer atvStore via dual-write
  + `onReady` reconcile. Pages without boot-critical reads (moon, elements, bhavas,
  reflect) read straight from `atvStore` after `onReady`.
- Follow-up: `storage.js` legacy migration covers fixed keys only — dynamic-key
  data (reflect notes, bhava state) won't auto-migrate from old localStorage.
- ➡️ **Moved to Phase 5:** the shared theme + name personalisation system
  (duplicated across 17 pages, coupled to the nav). Extract it into one shared
  script alongside the nav rework — avoids doing the same work twice.

## Phase 2 note — what migrates
Genuine cross-device **user data** → `atvStore`/Postgres: track progress,
journals, reflections, learning level/mode, chart, the user's name.
**Device-local** stays in `localStorage`: theme choice (pre-paint), first-visit
tip flags.

## Phase 3 — Content gating (public-safe) 🔄 mechanism done
- ✅ `assets/gating.js` — `data-audience="cohort"|"public"` role-aware gating;
  cohort hidden by default CSS, revealed only for confirmed student/admin.
- ✅ Loaded site-wide by `site-nav.js`.
- ⏳ **Editorial rollout:** tag the actual "Vikram said…" / cohort blocks across
  pages and write their public-safe alternatives. Needs Sree + Vikram — it's a
  content-access decision, not a code task.

## Phase 4 — Pedagogy scaffold + video placeholders 🔄 components done
- ✅ `assets/scaffold.js` — reusable `.atv-video` (captioned placeholder) and
  `.atv-reflect` (journal-saving reflect prompt) widgets, ATV-styled.
- ⏳ **Rollout:** apply the full scaffold (orientation → video → sourced
  sections → reflect → next) to each content page — editorial, page by page.

## Phase 5 — Nav & IA re-look ✅
- ✅ `site-nav.js` regrouped: Start · Tracks · Reference · Tools · Meta · Admin.
- ✅ Role-aware: Admin group gated via `data-navrole`, revealed by gating.js.
- ✅ `read.html` + `pricing.html` added; `demo`/`v0`/`quick-reference` left out.
- ➡️ Shared theme + name personalisation extraction (moved here from Phase 2)
  still pending — the duplicated 17-page blocks need consolidating.

## Phase 6 — Fresh design pass 🔄 dashboard done
- ✅ `assets/dashboard.js` — logged-in homepage dashboard (greeting, per-track
  progress, next step); mounted on `index.html`, hidden for guests.
- ⏳ Cross-page consistency review (iterative design pass), Libre Caslon
  Condensed headings, official logo/brandmark, `kaalapurusha.html` palette fix.

---

## Open items / blockers
- ⏳ Supabase: turn **OFF** "Confirm email" (Authentication → Sign In / Providers → Email)
- ⏳ Custom SMTP (Resend) — needed only for "forgot password"; not urgent
- ⏳ Temp password on `gnuyoga@gmail.com` (`AtvVerify2026Temp`) — clear after browser test
- ⏳ Vercel deployment + domain cutover (Phase 0 tail)

## How we track
- **This file (`PLAN.md`)** — the strategic arc; review and update per phase.
- **Task list** — granular execution items for the active phase.
- **`CLAUDE.md`** — architecture reference, kept in sync.
