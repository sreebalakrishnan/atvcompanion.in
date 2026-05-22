/* ====================================================================
   storage.js — unified persistence for ATV Companion.
   ====================================================================

   One interface over two backends:
     • signed in  → Supabase Postgres via /api (with a localStorage mirror
                    for instant reads and offline tolerance)
     • guest      → localStorage only

   Requires auth.js to be loaded first. Add after it:
     <script src="/assets/auth.js"></script>
     <script src="/assets/storage.js"></script>

   window.atvStore:
     .ready                 Promise — resolves once the cache is hydrated
     .signedIn              boolean
     .getProgress(track)    -> number[]              (sync)
     .setProgress(track, stops)
     .getJournal(key)       -> string                (sync)
     .setJournal(key, content, page)
     .getPref(key, fallback)-> string                (sync)
     .setPref(key, value)
     .getChart()            -> object                (sync)
     .setChart(obj)
     .onReady(cb)

   Reads are synchronous off an in-memory cache. Writes update the cache
   immediately and persist in the background (debounced).

   On a user's first sign-in, legacy localStorage keys (atv-moon-track-v1
   etc.) are detected and a banner offers a one-time sync to the account.
==================================================================== */

(function () {
  'use strict';

  var NS = 'atv-store:'; // localStorage mirror namespace
  var cache = { progress: {}, journal: {}, prefs: {}, chart: {} };
  var signedIn = false;
  var resolveReady;
  var readyPromise = new Promise(function (r) { resolveReady = r; });
  var readyDone = false;

  // -------- localStorage mirror --------
  function lsGet(slot) {
    try {
      var raw = localStorage.getItem(NS + slot);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function lsSet(slot, value) {
    try { localStorage.setItem(NS + slot, JSON.stringify(value)); } catch (e) {}
  }
  function mirror() {
    lsSet('progress', cache.progress);
    lsSet('journal', cache.journal);
    lsSet('prefs', cache.prefs);
    lsSet('chart', cache.chart);
  }

  // -------- debounced background POST --------
  var timers = {};
  function debounce(key, fn, ms) {
    if (timers[key]) clearTimeout(timers[key]);
    timers[key] = setTimeout(fn, ms || 600);
  }
  function post(url, body) {
    if (!signedIn) return Promise.resolve();
    return window.atvAuth.apiFetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).catch(function (e) {
      console.warn('[atvStore] save failed for ' + url + ':', e.message);
    });
  }

  // -------- hydrate --------
  function hydrateFromApi() {
    var auth = window.atvAuth;
    return Promise.all([
      auth.apiFetch('/api/progress').then(jsonOf),
      auth.apiFetch('/api/journal').then(jsonOf),
      auth.apiFetch('/api/prefs').then(jsonOf),
      auth.apiFetch('/api/chart').then(jsonOf)
    ]).then(function (parts) {
      cache.progress = (parts[0] && parts[0].progress) || {};
      var entries = (parts[1] && parts[1].entries) || {};
      cache.journal = {};
      Object.keys(entries).forEach(function (k) { cache.journal[k] = entries[k].content || ''; });
      cache.prefs = (parts[2] && parts[2].prefs) || {};
      cache.chart = (parts[3] && parts[3].data) || {};
      mirror();
    });
  }
  function jsonOf(res) { return res && res.ok ? res.json() : null; }

  function hydrateFromLocal() {
    cache.progress = lsGet('progress') || {};
    cache.journal = lsGet('journal') || {};
    cache.prefs = lsGet('prefs') || {};
    cache.chart = lsGet('chart') || {};
  }

  // -------- public read/write --------
  function getProgress(track) {
    var v = cache.progress[track];
    return Array.isArray(v) ? v.slice() : [];
  }
  function setProgress(track, stops) {
    cache.progress[track] = (stops || []).slice();
    lsSet('progress', cache.progress);
    debounce('progress:' + track, function () {
      post('/api/progress', { track: track, completedStops: cache.progress[track] });
    });
  }

  function getJournal(key) {
    return cache.journal[key] != null ? cache.journal[key] : '';
  }
  function setJournal(key, content, page) {
    cache.journal[key] = content || '';
    lsSet('journal', cache.journal);
    debounce('journal:' + key, function () {
      post('/api/journal', { entryKey: key, content: content || '', page: page || location.pathname });
    });
  }

  function getPref(key, fallback) {
    return cache.prefs[key] != null ? cache.prefs[key] : (fallback != null ? fallback : null);
  }
  function setPref(key, value) {
    cache.prefs[key] = value != null ? String(value) : null;
    lsSet('prefs', cache.prefs);
    debounce('pref:' + key, function () {
      post('/api/prefs', { prefKey: key, prefValue: cache.prefs[key] });
    });
  }

  function getChart() {
    return Object.assign({}, cache.chart);
  }
  function setChart(obj) {
    cache.chart = Object.assign({}, obj || {});
    lsSet('chart', cache.chart);
    debounce('chart', function () {
      post('/api/chart', { data: cache.chart });
    });
  }

  // -------- legacy localStorage migration --------
  // Maps old keys to the new store. Run once per account.
  var LEGACY_PROGRESS = { 'atv-moon-track-v1': 'moon' };
  var LEGACY_JOURNAL = ['atv-moon-journal-v1'];
  var LEGACY_PREFS = [
    'atv-lc-level-v1', 'atv-lc-mode-v1', 'elements-active-tab-v1',
    'astro-mychart-theme-v1', 'astro-story-readaloud-v1',
    'astro-story-speed-v1', 'astro-story-view-v1', 'astro-trace-done',
    'atv-mbox-recent'
  ];
  var LEGACY_CHART = ['astro-mychart-loc-v1'];

  function hasLegacyData() {
    var keys = Object.keys(LEGACY_PROGRESS)
      .concat(LEGACY_JOURNAL, LEGACY_PREFS, LEGACY_CHART);
    return keys.some(function (k) { return localStorage.getItem(k) != null; });
  }

  function migrateLegacy() {
    // progress
    Object.keys(LEGACY_PROGRESS).forEach(function (lsKey) {
      var raw = localStorage.getItem(lsKey);
      if (!raw) return;
      try {
        var obj = JSON.parse(raw);
        var stops = (obj && obj.completed) || [];
        if (stops.length) setProgress(LEGACY_PROGRESS[lsKey], stops);
      } catch (e) {}
    });
    // journal — old value is an object of { elementId: text }
    LEGACY_JOURNAL.forEach(function (lsKey) {
      var raw = localStorage.getItem(lsKey);
      if (!raw) return;
      try {
        var obj = JSON.parse(raw);
        Object.keys(obj || {}).forEach(function (id) {
          if (obj[id]) setJournal(id, obj[id], '/planets/moon.html');
        });
      } catch (e) {}
    });
    // prefs
    LEGACY_PREFS.forEach(function (lsKey) {
      var v = localStorage.getItem(lsKey);
      if (v != null) setPref(lsKey, v);
    });
    // chart
    LEGACY_CHART.forEach(function (lsKey) {
      var raw = localStorage.getItem(lsKey);
      if (raw == null) return;
      var parsed;
      try { parsed = JSON.parse(raw); } catch (e) { parsed = raw; }
      var current = getChart();
      current[lsKey] = parsed;
      setChart(current);
    });
    setPref('atv-legacy-migrated', '1');
  }

  function maybeOfferMigration() {
    if (!signedIn) return;
    if (getPref('atv-legacy-migrated') === '1') return;
    if (!hasLegacyData()) { setPref('atv-legacy-migrated', '1'); return; }
    renderMigrationBanner();
  }

  function renderMigrationBanner() {
    if (document.getElementById('atvMigrateBanner')) return;
    var bar = document.createElement('div');
    bar.id = 'atvMigrateBanner';
    bar.setAttribute('role', 'status');
    bar.style.cssText = [
      'position:fixed', 'left:0', 'right:0', 'bottom:0', 'z-index:200',
      'background:var(--surface,#F8F4E1)', 'border-top:1px solid var(--rule,#C8C5BF)',
      'padding:12px 18px', 'display:flex', 'gap:14px', 'align-items:center',
      'justify-content:center', 'flex-wrap:wrap',
      'font-family:var(--body,sans-serif)', 'font-size:14px',
      'box-shadow:0 -8px 24px -14px rgba(40,40,38,.3)'
    ].join(';');
    bar.innerHTML =
      '<span style="color:var(--ink-soft,#4B4B4A)">We found progress saved in this browser. Sync it to your account?</span>' +
      '<button id="atvMigrateYes" style="cursor:pointer;font-family:var(--display,serif);font-style:italic;font-size:14px;padding:7px 16px;border-radius:7px;background:var(--saffron,#B46E3B);color:var(--surface,#F8F4E1);border:1px solid var(--saffron,#B46E3B)">Sync now</button>' +
      '<button id="atvMigrateNo" style="cursor:pointer;font-family:var(--display,serif);font-style:italic;font-size:14px;padding:7px 16px;border-radius:7px;background:transparent;color:var(--ink-soft,#4B4B4A);border:1px solid var(--rule,#C8C5BF)">Not now</button>';
    document.body.appendChild(bar);

    document.getElementById('atvMigrateYes').addEventListener('click', function () {
      migrateLegacy();
      bar.innerHTML = '<span style="color:var(--forest,#32413B)">Synced. Your progress now travels with your account.</span>';
      setTimeout(function () { bar.remove(); }, 2600);
    });
    document.getElementById('atvMigrateNo').addEventListener('click', function () {
      bar.remove(); // offered again next sign-in until synced
    });
  }

  // -------- init --------
  function init() {
    if (!window.atvAuth) {
      console.warn('[atvStore] auth.js must load before storage.js — running local-only.');
      hydrateFromLocal();
      return finish();
    }
    window.atvAuth.ready.then(function (state) {
      signedIn = !!(state && state.user);
      var step;
      if (signedIn) {
        step = hydrateFromApi().catch(function () { hydrateFromLocal(); });
      } else {
        hydrateFromLocal();
        step = Promise.resolve();
      }
      return step;
    }).then(function () {
      finish();
      maybeOfferMigration();
    });

    // Re-hydrate when the user signs in or out mid-session.
    window.atvAuth.onChange(function (user) {
      var nowSignedIn = !!user;
      if (nowSignedIn === signedIn) return;
      signedIn = nowSignedIn;
      var step = signedIn
        ? hydrateFromApi().catch(function () {})
        : Promise.resolve(hydrateFromLocal());
      step.then(maybeOfferMigration);
    });
  }

  var readyListeners = [];
  function finish() {
    readyDone = true;
    resolveReady(cache);
    readyListeners.forEach(function (cb) { try { cb(); } catch (e) {} });
  }
  function onReady(cb) {
    if (typeof cb !== 'function') return;
    if (readyDone) { cb(); } else { readyListeners.push(cb); }
  }

  window.atvStore = {
    ready: readyPromise,
    onReady: onReady,
    get signedIn() { return signedIn; },
    getProgress: getProgress,
    setProgress: setProgress,
    getJournal: getJournal,
    setJournal: setJournal,
    getPref: getPref,
    setPref: setPref,
    getChart: getChart,
    setChart: setChart,
    migrateLegacy: migrateLegacy
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
