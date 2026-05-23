# atvcompanion.in — CLAUDE.md

## What this is
A single-page static origin-story site for `atvcompanion.in` (the bare
domain). One HTML file that tells how the companion came to be — Vikram
Devatha's Astrology 101 class, the "blue file" photo, and a CTA to the
actual app. Built by Sree Balakrishnan (gnuyoga@gmail.com).

**Not the app.** The full Express + Supabase companion app lives in a
separate repo: https://github.com/sreebalakrishnan/app.atvcompanion.in
(private), deployed at `app.atvcompanion.in`. That repo has its own
CLAUDE.md and is the reference for anything app-side.

## Repo contents
- `index.html` — the whole site
- `assets/blue-file.jpg` — the "blue file" photo
- `README.md`, `LICENSE`, `.gitignore`

That's it. No `public/`, no `server.js`, no `node_modules/`, no build.

## Deploy
- **Hostinger Git-sync.** Hostinger pulls `main` into `public_html/` on
  push. A push to `main` *is* a deploy.
- No build step. No dependencies. No server.
- Local preview: open `index.html` in a browser, or
  `python3 -m http.server 8000`.

## Design system — match the app
Brand tokens are defined inline in `index.html`'s `<style>`. Keep them
in sync with the app repo's CLAUDE.md:

Brand names (from ATV Brand Guide): Sunlit White · Golden Light ·
Charcoal Ash · Muted Mauve · Terracotta Ember (saffron) · Stormy Sky ·
Deep Forest. Fonts via Google Fonts + Fontshare (Switzer). Max page
width ~820px. The two sites should feel like one place.

## What this page is for
- The origin story ("how it came to be · the blue file")
- A clear CTA card linking to `https://app.atvcompanion.in`
- Sree's voice. Vikram is referenced, not quoted — no class content
  lives here.

## What does NOT belong here
- Auth, accounts, dashboards, knowledge-base content. All of that is in
  the app repo and is gated behind sign-in for a reason.
- Any framework, build tool, or Node dependency. Keep it one HTML file.
- A second page or templating system. If you want one, push that work
  into the app repo instead.

## Code conventions
- One HTML file. CSS in a single `<style>` block; JS (if any) in a
  single inline `<script>`.
- Vanilla HTML/CSS/JS. No external functional JS — fonts only.
- ES5-compatible JS if you do add any (matches the app's per-page
  convention).

## Sibling repo
- App: https://github.com/sreebalakrishnan/app.atvcompanion.in
  (private) — Express + Supabase + Postgres, Hostinger Node deploy at
  `app.atvcompanion.in`. Has its own CLAUDE.md.
