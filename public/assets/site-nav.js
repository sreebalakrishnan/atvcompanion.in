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
  // primary: always-visible row. Everything else: the grouped "More" menu.
  // group: 'start' | 'tracks' | 'reference' | 'tools' | 'meta' | 'admin'
  // role: 'admin' → item shown only when html[data-role="admin"] (set by gating.js).
  // hrefs are root-relative so the nav works from any subdirectory.
  const PAGES = [
    { href: '/index.html',              label: 'Home',               primary: true },
    { href: '/learning-companion.html', label: 'Learning Companion', primary: true },
    { href: '/reflect.html',            label: 'Reflect',            primary: true },
    // ----- Start -----
    { href: '/where-am-i.html',         label: 'Where am I',                 group: 'start' },
    { href: '/catch-up.html',           label: 'Catch up · missed a class?', group: 'start' },
    // ----- Tracks -----
    { href: '/planets/moon.html',       label: 'The Moon · pilot',           group: 'tracks' },
    { href: '/journey.html',            label: 'Journey · beta',             group: 'tracks' },
    // ----- Reference -----
    { href: '/astronomy.html',          label: 'Astronomy',                  group: 'reference' },
    { href: '/elements.html',           label: 'Elements',                   group: 'reference' },
    { href: '/ether.html',              label: 'Ether',                      group: 'reference' },
    { href: '/bhavas.html',             label: 'Twelve Bhavas · matchbox',   group: 'reference' },
    { href: '/aspects.html',            label: 'Aspects · drishti',          group: 'reference' },
    { href: '/kaalapurusha.html',       label: 'Kaalapurusha',               group: 'reference' },
    { href: '/layers.html',             label: 'Layers',                     group: 'reference' },
    { href: '/sripati.html',            label: 'Sripati Paddhati',           group: 'reference' },
    { href: '/mercury-spectrum.html',   label: 'Mercury Spectrum',           group: 'reference' },
    { href: '/jupiter-tracker.html',    label: 'Jupiter Tracker',            group: 'reference' },
    // ----- Tools -----
    { href: '/interpret.html',          label: 'Interpret · beta',           group: 'tools' },
    { href: '/read.html',               label: 'Guided Reading',             group: 'tools' },
    { href: '/signature.html',          label: 'Signature · for one',        group: 'tools' },
    { href: '/interactive.html',        label: 'Interactive · beta',         group: 'tools' },
    // ----- Meta -----
    { href: '/about.html',              label: 'About',                      group: 'meta' },
    { href: '/collaborate.html',        label: 'Collaborate',                group: 'meta' },
    { href: '/pricing.html',            label: 'Pricing',                    group: 'meta' },
    { href: '/feedback.html',           label: 'Feedback',                   group: 'meta' },
    { href: '/stats.html',              label: 'Stats',                      group: 'meta' },
    { href: '/release-notes.html',      label: 'Release Notes',              group: 'meta' },
    // ----- Admin (shown only to admins) -----
    { href: '/admin.html',              label: 'Admin dashboard',            group: 'admin', role: 'admin' }
  ];

  // More-menu group order + headings.
  const GROUPS = [
    { id: 'start',     label: 'Start' },
    { id: 'tracks',    label: 'Tracks' },
    { id: 'reference', label: 'Reference' },
    { id: 'tools',     label: 'Tools' },
    { id: 'meta',      label: 'Meta' },
    { id: 'admin',     label: 'Admin' }
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
      '.site-nav .more-group-label { font-style: normal; font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); padding: 10px 10px 3px; }',
      '.site-nav .more-menu > .more-group-label:first-child { padding-top: 2px; }',
      '.site-nav [data-navrole="admin"] { display: none; }',
      'html[data-role="admin"] .site-nav [data-navrole="admin"] { display: block; }',
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
    // Grouped: each group gets an uppercase heading; the Admin group is
    // role-gated via data-navrole (revealed by gating.js's html[data-role]).
    GROUPS.forEach(function(g){
      var items = more.filter(function(p){ return (p.group || 'meta') === g.id; });
      if (!items.length) return;
      var roleAttr = (g.id === 'admin') ? ' data-navrole="admin"' : '';
      html += '<div class="more-group-label"' + roleAttr + '>' + escHtml(g.label) + '</div>';
      items.forEach(function(p){
        var attrs = (p.href === active ? ' aria-current="page"' : '') +
                    (p.role === 'admin' ? ' data-navrole="admin"' : '');
        html += '<a href="' + escHtml(p.href) + '" role="menuitem"' + attrs + '>' + escHtml(p.label) + '</a>';
      });
    });
    html += '</div></div>';
    // Account chip (auth.js fills this) — carries the email, role, Admin link
    // and Sign out, so they're reachable from every page.
    html += '<span class="sep">·</span>';
    html += '<span id="atvAuthMount" class="nav-auth"></span>';
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
