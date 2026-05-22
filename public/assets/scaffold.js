/* ====================================================================
   scaffold.js — reusable pedagogy components.
   ====================================================================

   The light learning scaffold for content pages is:
     orientation → video → sourced sections → reflect prompt → next step

   Orientation, sourced sections and "next step" are plain page content.
   This script provides the two reusable widgets:

   Video placeholder — a captioned slot for a teaching video:
     <div class="atv-video" data-title="The Moon — astronomy"
          data-note="A short teaching video will live here."></div>

   Reflect prompt — one journalling question, saved per user via atvStore:
     <div class="atv-reflect" data-key="moon-orientation"
          data-prompt="What do you already sense about the Moon?"></div>

   Loaded site-wide by site-nav.js. The reflect widget depends on
   storage.js (window.atvStore); without it, it still renders read-only.
==================================================================== */

(function () {
  'use strict';
  if (window.atvScaffold) return; // idempotent
  window.atvScaffold = true;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }

  function injectStyles() {
    if (document.getElementById('atvScaffoldStyles')) return;
    var s = document.createElement('style');
    s.id = 'atvScaffoldStyles';
    s.textContent = [
      '.atv-video{margin:24px 0;}',
      '.atv-video-inner{border:1px dashed var(--rule,#C8C5BF);border-radius:12px;',
      'background:var(--surface,#F8F4E1);padding:38px 24px;text-align:center;}',
      '.atv-video-icon{width:46px;height:46px;line-height:46px;margin:0 auto 12px;',
      'border-radius:50%;background:var(--saffron,#B46E3B);color:var(--surface,#F8F4E1);font-size:15px;}',
      '.atv-video-title{font-family:var(--display,serif);font-style:italic;font-size:19px;color:var(--ink,#282826);}',
      '.atv-video-note{font-family:var(--body,sans-serif);font-size:13.5px;color:var(--muted,#847171);margin-top:4px;}',
      '.atv-reflect{margin:24px 0;padding:20px 22px;background:var(--surface,#F8F4E1);',
      'border:1px solid var(--rule,#C8C5BF);border-left:3px solid var(--saffron,#B46E3B);border-radius:0 10px 10px 0;}',
      '.atv-reflect-q{display:block;font-family:var(--display,serif);font-style:italic;',
      'font-size:16px;color:var(--ink,#282826);margin-bottom:10px;}',
      '.atv-reflect-input{width:100%;box-sizing:border-box;font-family:var(--body,sans-serif);',
      'font-size:14.5px;padding:10px 12px;border:1px solid var(--rule,#C8C5BF);border-radius:8px;',
      'background:var(--bg,#F8F6EF);color:var(--ink,#282826);resize:vertical;}',
      '.atv-reflect-input:focus{outline:2px solid var(--saffron,#B46E3B);outline-offset:1px;}',
      '.atv-reflect-saved{font-family:var(--display,serif);font-style:italic;font-size:12px;',
      'color:var(--forest,#32413B);margin-top:6px;}'
    ].join('');
    (document.head || document.documentElement).appendChild(s);
  }

  function renderVideos() {
    document.querySelectorAll('.atv-video:not([data-ready])').forEach(function (el) {
      el.setAttribute('data-ready', '1');
      var title = el.getAttribute('data-title') || 'Teaching video';
      var note = el.getAttribute('data-note') || 'A short teaching video will live here.';
      el.innerHTML =
        '<div class="atv-video-inner">' +
          '<div class="atv-video-icon" aria-hidden="true">▶</div>' +
          '<div class="atv-video-title">' + esc(title) + '</div>' +
          '<div class="atv-video-note">' + esc(note) + '</div>' +
        '</div>';
    });
  }

  function renderReflects() {
    document.querySelectorAll('.atv-reflect:not([data-ready])').forEach(function (el) {
      el.setAttribute('data-ready', '1');
      var key = el.getAttribute('data-key');
      if (!key) return;
      var prompt = el.getAttribute('data-prompt') || 'Take a moment to reflect.';
      var id = 'atv-reflect-' + key;
      el.innerHTML =
        '<label class="atv-reflect-q" for="' + esc(id) + '">' + esc(prompt) + '</label>' +
        '<textarea class="atv-reflect-input" id="' + esc(id) + '" rows="3" ' +
        'placeholder="Your reflection…"></textarea>' +
        '<div class="atv-reflect-saved" hidden>Saved</div>';
      var ta = el.querySelector('textarea');
      var saved = el.querySelector('.atv-reflect-saved');
      if (!window.atvStore) return;
      window.atvStore.onReady(function () {
        ta.value = window.atvStore.getJournal(key) || '';
      });
      var timer;
      ta.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          window.atvStore.setJournal(key, ta.value, location.pathname);
          saved.hidden = false;
          setTimeout(function () { saved.hidden = true; }, 1800);
        }, 700);
      });
    });
  }

  function render() {
    injectStyles();
    renderVideos();
    renderReflects();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
  window.atvScaffoldRender = render; // re-run after dynamic content insertion
})();
