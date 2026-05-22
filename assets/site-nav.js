/* ====================================================================
   site-nav.js — single source of truth for the site navigation.
   ====================================================================

   Drop this script tag into any HTML page that wants the standard nav:

     <div id="siteNavMount"></div>
     <script src="assets/site-nav.js"></script>

   The script:
     • detects the current page from window.location.pathname
     • injects the full <nav> markup into #siteNavMount
     • flags the active link with aria-current="page"
     • injects matching CSS (so pages don't have to duplicate it)
     • wires the More-menu open/close (with click-outside to close)

   To add / rename / reorder pages, edit the PAGES array below — once,
   here. All 18+ pages pick up the change on next load.

   Shipped in v4.73.0 to replace ~80 lines of duplicated nav HTML in
   each of 18 pages. The old hardcoded nav blocks may still be present
   as dead code in some pages — they don't render because the new
   mount element is what shows. Per-page More-menu wiring uses the
   IDs `moreMenuBtn` / `moreMenu`; this script uses `atvNavMoreBtn` /
   `atvNavMoreMenu` so both sets of wiring can coexist without
   double-firing during the transition.
==================================================================== */

(function(){
  'use strict';

  // -------- CANONICAL NAV DATA --------
  // primary: shows in the always-visible row.
  // Everything else: in the More dropdown.
  // v4.74.2 — More menu is split into two groups by a divider:
  //   group: 'learning'  → technical content pages (the subject matter)
  //   group: 'meta'      → orientation + about-the-project pages
  // Order within a group preserved. To insert a divider, the builder
  // watches for the first 'meta' item after 'learning' items.
  // v4.74.35 — all hrefs are root-relative (leading /) so nav works from any
  // subdirectory (e.g. planets/moon.html) without producing 404s.
  const PAGES = [
    { href: '/index.html',              label: 'Home',                       primary: true },
    { href: '/learning-companion.html', label: 'Learning Companion',         primary: true },
    // v4.74.28 — Journey promoted to top nav, Interpret moved into More (still beta)
    { href: '/journey.html',            label: 'Journey · beta',             primary: true },
    { href: '/planets/moon.html',       label: 'The Moon · pilot',           group: 'learning' },
    { href: '/reflect.html',            label: 'Reflect',                    primary: true },
    // ----- More menu · learning content -----
    { href: '/interpret.html',          label: 'Interpret · beta',           group: 'learning' },
    { href: '/bhavas.html',             label: 'Twelve Bhavas · matchbox',   group: 'learning' },
    { href: '/signature.html',          label: 'Signature · for one',        group: 'learning' },
    { href: '/catch-up.html',           label: 'Catch up · missed a class?', group: 'learning' },
    { href: '/elements.html',           label: 'Elements',                   group: 'learning' },
    { href: '/interactive.html',        label: 'Interactive · beta',         group: 'learning' },
    { href: '/aspects.html',            label: 'Aspects · drishti',          group: 'learning' },
    { href: '/kaalapurusha.html',       label: 'Kaalapurusha',               group: 'learning' },
    { href: '/mercury-spectrum.html',   label: 'Mercury Spectrum',           group: 'learning' },
    { href: '/jupiter-tracker.html',    label: 'Jupiter Tracker',            group: 'learning' },
    { href: '/astronomy.html',          label: 'Astronomy',                  group: 'learning' },
    { href: '/sripati.html',            label: 'Sripati Paddhati',           group: 'learning' },
    { href: '/ether.html',              label: 'Ether',                      group: 'learning' },
    // ----- More menu · orientation + meta -----
    { href: '/where-am-i.html',         label: 'Where am I',                 group: 'meta' },
    { href: '/layers.html',             label: 'Layers',                     group: 'meta' },
    { href: '/stats.html',              label: 'Stats',                      group: 'meta' },
    { href: '/about.html',              label: 'About · how this came to be', group: 'meta' },
    { href: '/feedback.html',           label: 'Feedback · send us a note',  group: 'meta' },
    { href: '/collaborate.html',        label: 'Collaborate',                group: 'meta' },
    { href: '/release-notes.html',      label: 'Release Notes',              group: 'meta' }
  ];

  // -------- HELPERS --------
  function currentPage(){
    var path = window.location.pathname || '/';
    // Normalize bare root to index
    if (path === '/' || path === '') return '/index.html';
    // Return full root-relative path — matches the leading-/ hrefs in PAGES
    return path;
  }

  function escHtml(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  }

  // -------- INJECT CSS (idempotent) --------
  function injectStyles(){
    if (document.getElementById('atvNavStyles')) return;
    var style = document.createElement('style');
    style.id = 'atvNavStyles';
    style.textContent = [
      '.site-nav { padding: 22px 0 14px; display: flex; justify-content: center; gap: 18px; align-items: baseline; flex-wrap: wrap; border-bottom: 1px solid var(--rule-soft); }',
      '.site-nav a, .site-nav span, .site-nav button { font-family: var(--display); font-style: italic; font-size: 14px; letter-spacing: .04em; color: var(--ink-soft); text-decoration: none; transition: color .15s; background: transparent; border: 0; cursor: pointer; padding: 0; }',
      '.site-nav a:hover, .site-nav button:hover { color: var(--saffron); }',
      '.site-nav .here, .site-nav a[aria-current="page"] { color: var(--saffron); }',
      '.site-nav .sep { color: var(--rule); font-style: normal; font-size: 11px; letter-spacing: 0; }',
      '.site-nav .more-wrap { position: relative; }',
      '.site-nav .more-menu { position: absolute; top: calc(100% + 6px); right: 0; background: var(--surface); border: 1px solid var(--rule); border-radius: 8px; padding: 6px; min-width: 240px; box-shadow: 0 14px 32px -12px rgba(40,40,38,.25); z-index: 60; text-align: left; }',
      '.site-nav .more-menu[hidden] { display: none; }',
      '.site-nav .more-menu a { display: block; padding: 7px 10px; border-radius: 5px; font-style: italic; }',
      '.site-nav .more-menu a:hover { background: rgba(188,129,70,.06); }',
      '.site-nav .more-menu-divider { height: 1px; background: var(--rule-soft); margin: 4px 8px; }',
      '.site-nav .more-btn.is-current { color: var(--saffron); }',
      '.site-nav .chev { font-size: 10px; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  // -------- BUILD NAV HTML --------
  function buildNav(active){
    var primary = PAGES.filter(function(p){ return p.primary; });
    var more    = PAGES.filter(function(p){ return !p.primary; });
    var moreActive = more.some(function(p){ return p.href === active; });

    var html = '<nav class="site-nav" aria-label="Site sections">';

    primary.forEach(function(p, i){
      var isActive = p.href === active;
      var attrs = isActive ? ' aria-current="page" class="here"' : (i > 0 ? ' class="primary"' : '');
      html += '<a href="' + escHtml(p.href) + '"' + attrs + '>' + escHtml(p.label) + '</a>';
      html += '<span class="sep">·</span>';
    });

    html += '<div class="more-wrap">';
    html += '<button type="button" class="more-btn' + (moreActive ? ' is-current' : '') + '" id="atvNavMoreBtn"' +
            (moreActive ? ' aria-current="page"' : '') +
            ' aria-expanded="false" aria-haspopup="true">More <span class="chev" aria-hidden="true">▾</span></button>';
    html += '<div class="more-menu" id="atvNavMoreMenu" hidden role="menu">';
    // v4.74.2 — Insert a divider when group flips from 'learning' to 'meta'.
    var lastGroup = null;
    more.forEach(function(p){
      var thisGroup = p.group || 'learning';
      if (lastGroup === 'learning' && thisGroup === 'meta'){
        html += '<div class="more-menu-divider" role="separator" aria-hidden="true"></div>';
      }
      lastGroup = thisGroup;
      var isActive = p.href === active;
      var attrs = isActive ? ' aria-current="page"' : '';
      html += '<a href="' + escHtml(p.href) + '" role="menuitem"' + attrs + '>' + escHtml(p.label) + '</a>';
    });
    html += '</div></div>';
    html += '</nav>';
    return html;
  }

  // -------- WIRE MORE-MENU --------
  function wireMoreMenu(){
    var btn = document.getElementById('atvNavMoreBtn');
    var menu = document.getElementById('atvNavMoreMenu');
    if (!btn || !menu) return;
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      var open = menu.hidden;
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function(e){
      if (menu.hidden) return;
      if (!menu.contains(e.target) && e.target !== btn){
        menu.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
      }
    });
    // Close on Escape
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && !menu.hidden){
        menu.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // -------- PLAUSIBLE ANALYTICS --------
  function injectPlausible(){
    if (document.getElementById('atv-plausible')) return;
    var s = document.createElement('script');
    s.id = 'atv-plausible';
    s.async = true;
    s.src = 'https://plausible.io/js/pa-ZOQqBwVZUolu5ieHiwN2I.js';
    document.head.appendChild(s);
    window.plausible = window.plausible || function(){
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
    window.plausible.init = window.plausible.init || function(i){ window.plausible.o = i || {}; };
    window.plausible.init();
  }

  // -------- AUTH + GATING STACK --------
  // Load auth.js + gating.js site-wide via the one script every page has.
  // Pages that already include a script explicitly (the data pages include
  // auth.js) are skipped by the src check, so nothing double-loads.
  function injectStack(){
    ['/assets/auth.js', '/assets/storage.js', '/assets/gating.js', '/assets/scaffold.js'].forEach(function(src){
      if (document.querySelector('script[src="' + src + '"]')) return;
      var s = document.createElement('script');
      s.src = src;
      s.async = false; // preserve order: auth → storage → gating → scaffold
      document.head.appendChild(s);
    });
  }

  // -------- RENDER --------
  function render(){
    injectStack();
    var mount = document.getElementById('siteNavMount');
    if (!mount) return;
    injectStyles();
    injectPlausible();
    var active = currentPage();
    mount.innerHTML = buildNav(active);
    wireMoreMenu();
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

  // Expose for debugging or future use (e.g., scheduled-task hooks).
  window.AtvSiteNav = { PAGES: PAGES, render: render, currentPage: currentPage };
})();
