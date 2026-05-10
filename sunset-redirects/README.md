# sunset-redirects/

One-time set of redirect stubs for the **old** static.app site (`jp3a5h2e8x`),
which used to serve the Astrology 101 Companion at `sreebalakrishnan.in/astrology101/`.

The Companion has moved to its own subdomain at
**https://atv-companion.sreebalakrishnan.in** (static.app site `rujcfa7h6w`).

This folder contains 23 HTML files — one per page that used to live at
`sreebalakrishnan.in/astrology101/` — plus a `_redirects` file for hosts that
support Netlify/Cloudflare-style redirect rules.

## Each HTML stub

- `<link rel="canonical">` to the new URL — for SEO
- `<meta http-equiv="refresh" content="0; ...">` — for browsers without JS
- `window.location.replace(...)` — for everyone else, **preserves query
  string and hash** so deep links keep working
- A friendly visible message in case redirects fail

## How to deploy

1. Open static.app's UI for site `jp3a5h2e8x`.
2. Upload the contents of this folder into the existing `astrology101/` subfolder
   (replacing the full HTML files there). Or upload to root if the path scheme has changed.
3. The `_redirects` file goes at the root of the static.app site, not inside `astrology101/`.

## After upload

Watch Cloudflare Web Analytics. When traffic to the old hostname approaches zero
(typically 4-8 weeks), delete the `astrology101/` folder from `jp3a5h2e8x` entirely.
