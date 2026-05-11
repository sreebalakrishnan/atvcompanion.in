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
  const PAGES = [
    { href: 'index.html',              label: 'Home',                       primary: true },
    { href: 'learning-companion.html', label: 'Learning Companion',         primary: true },
    { href: 'interpret.html',          label: 'Interpret · beta',           primary: true },
    { href: 'reflect.html',            label: 'Reflect',                    primary: true },
    // ----- More menu -----
    { href: 'catch-up.html',           label: 'Catch up · missed a class?' },
    { href: 'where-am-i.html',         label: 'Where am I' },
    { href: 'elements.html',           label: 'Elements' },
    { href: 'interactive.html',        label: 'Interactive · beta' },
    { href: 'aspects.html',            label: 'Aspects · drishti' },
    { href: 'kaalapurusha.html',       label: 'Kaalapurusha' },
    { href: 'mercury-spectrum.html',   label: 'Mercury Spectrum' },
    { href: 'jupiter-tracker.html',    label: 'Jupiter Tracker' },
    { href: 'astronomy.html',          label: 'Astronomy' },
    { href: 'sripati.html',            label: 'Sripati Paddhati' },
    { href: 'ether.html',              label: 'Ether' },
    { href: 'layers.html',             label: 'Layers' },
    { href: 'stats.html',              label: 'Stats' },
    { href: 'about.html',              label: 'About · how this came to be' },
    { href: 'collaborate.html',        label: 'Collaborate' },
    { href: 'release-notes.html',      label: 'Release Notes' }
  ];

  // -------- HELPERS --------
  function currentPage(){
    var path = window.location.pathname || '';
    var name = path.split('/').pop() || '';
    if (!name) return 'index.html';
    return name;
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
    more.forEach(function(p){
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

  // -------- RENDER --------
  function render(){
    var mount = document.getElementById('siteNavMount');
    if (!mount) return;
    injectStyles();
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
