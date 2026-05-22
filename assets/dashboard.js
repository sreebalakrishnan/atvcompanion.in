/* ====================================================================
   dashboard.js — logged-in homepage dashboard.
   ====================================================================

   If a page contains <div id="atvDashboard"></div>, this renders a
   personal panel there for signed-in users: their tracks, progress, and
   the next step. Hidden entirely for guests / signed-out visitors.

   Depends on auth.js + storage.js. ATV-styled.
==================================================================== */

(function () {
  'use strict';
  if (window.atvDashboard) return;
  window.atvDashboard = true;

  // Tracks known to the dashboard. Add Sun/Mars here as they ship.
  var TRACKS = [
    { id: 'moon', name: 'The Moon', stops: 12, href: '/planets/moon.html' }
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }

  function injectStyles() {
    if (document.getElementById('atvDashStyles')) return;
    var s = document.createElement('style');
    s.id = 'atvDashStyles';
    s.textContent = [
      '#atvDashboard[hidden]{display:none}',
      '.atv-dash-inner{margin:22px 0;padding:24px 26px;background:var(--surface,#F8F4E1);',
      'border:1px solid var(--rule,#C8C5BF);border-radius:14px;}',
      '.atv-dash-eyebrow{font-family:var(--display,serif);font-style:italic;font-size:12px;',
      'letter-spacing:.14em;text-transform:uppercase;color:var(--saffron,#B46E3B);}',
      '.atv-dash-greet{font-family:var(--display,serif);font-size:24px;color:var(--ink,#282826);',
      'margin:4px 0 16px;}',
      '.atv-dash-track{display:block;text-decoration:none;padding:14px 0;',
      'border-top:1px dashed var(--rule,#C8C5BF);}',
      '.atv-dash-track:first-child{border-top:0;}',
      '.atv-dash-track-name{font-family:var(--display,serif);font-size:17px;color:var(--ink,#282826);}',
      '.atv-dash-bar{height:6px;border-radius:3px;background:var(--bg-deep,#DFDDD7);',
      'margin:7px 0 5px;overflow:hidden;}',
      '.atv-dash-bar span{display:block;height:100%;background:var(--saffron,#B46E3B);}',
      '.atv-dash-meta{font-family:var(--body,sans-serif);font-size:12.5px;color:var(--muted,#847171);}',
      '.atv-dash-track:hover .atv-dash-meta{color:var(--saffron,#B46E3B);}'
    ].join('');
    (document.head || document.documentElement).appendChild(s);
  }

  function draw(user) {
    var mount = document.getElementById('atvDashboard');
    if (!mount) return;
    mount.hidden = false;
    var name = (user.displayName || user.email || '').split('@')[0];
    var html = '<div class="atv-dash-inner">';
    html += '<div class="atv-dash-eyebrow">your journey</div>';
    html += '<div class="atv-dash-greet">Welcome back, ' + esc(name) + '</div>';
    TRACKS.forEach(function (t) {
      var done = (window.atvStore && window.atvStore.getProgress(t.id)) || [];
      var n = done.length;
      var pct = Math.max(0, Math.min(100, Math.round(n / t.stops * 100)));
      var verb = n >= t.stops ? 'complete' : (n > 0 ? 'continue' : 'start');
      html += '<a class="atv-dash-track" href="' + esc(t.href) + '">' +
        '<div class="atv-dash-track-name">' + esc(t.name) + '</div>' +
        '<div class="atv-dash-bar"><span style="width:' + pct + '%"></span></div>' +
        '<div class="atv-dash-meta">' + n + ' of ' + t.stops + ' stops · ' + verb + ' →</div>' +
        '</a>';
    });
    html += '</div>';
    mount.innerHTML = html;
  }

  function hide() {
    var mount = document.getElementById('atvDashboard');
    if (mount) { mount.hidden = true; mount.innerHTML = ''; }
  }

  function update(user) {
    if (!user) { hide(); return; }
    if (window.atvStore) window.atvStore.onReady(function () { draw(user); });
    else draw(user);
  }

  function init() {
    if (!document.getElementById('atvDashboard')) return;
    injectStyles();
    hide(); // default: hidden for guests
    if (window.atvAuth && window.atvAuth.ready) {
      window.atvAuth.ready.then(function (state) { update(state && state.user); });
      window.atvAuth.onChange(update);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
