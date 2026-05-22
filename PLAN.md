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
Phases 0–1 complete and **verified live**. Phase 2 backend complete and
verified; page rewiring is the active task. The browser sign-in flow still
needs an in-browser test once the Supabase "Confirm email" setting is off.

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

## Phase 2 — Data model & localStorage migration 🔄
- ✅ Tables: `track_progress`, `journal_entries`, `preferences`, `chart_data`
- ✅ API: `/api/progress`, `/api/journal`, `/api/prefs`, `/api/chart` — all verified
- ✅ `assets/storage.js` — `atvStore` shim + one-time legacy migration banner
- ⏳ **Rewire pages to `atvStore`** — replace raw `localStorage` in `moon.html`,
  `learning-companion.html`, `reflect.html`, `elements.html`, `index.html`, etc.
  (task #9 — the active work item)

## Phase 3 — Content gating (public-safe) ⏳
- ⏳ Audit every page for "Vikram said…" / cohort-specific blocks
- ⏳ Tag them `data-audience="cohort"`; add `data-audience="public"` alternatives
- ⏳ `gating.js` — role-aware show/hide based on `window.atvUser.role`

## Phase 4 — Pedagogy scaffold + video placeholders ⏳
Light scaffold on every content page: orientation → video placeholder →
sourced sections (`.source-line`) → reflect prompt → next step. Tracks keep
the full Moon-style 12-stop journey on top.
- ⏳ Build the reusable scaffold pattern + video-placeholder component
- ⏳ Apply page by page

## Phase 5 — Nav & IA re-look ⏳
- ⏳ Regroup `site-nav.js`: Start · Tracks · Reference · Tools · Meta · Admin
- ⏳ Role-aware nav (admin link for admins, etc.)
- ⏳ Resolve unlisted pages: `read.html`, `demo.html`, `pricing.html`, `v0.html`

## Phase 6 — Fresh design pass ⏳
- ⏳ Logged-in dashboard homepage (your tracks, progress, next step)
- ⏳ Consistency review across all pages, keeping ATV design tokens

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
