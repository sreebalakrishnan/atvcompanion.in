/* ====================================================================
   auth.js — browser-side auth for ATV Companion.
   ====================================================================

   Drop into any page:
     <script src="/assets/auth.js"></script>
   Optionally add an account chip mount:
     <div id="atvAuthMount"></div>

   Exposes window.atvAuth:
     .ready                  Promise resolving once the session is resolved
     .user                   null | { id, email, role, displayName }
     .signIn(email, pw)      sign in with email + password
     .signUp(email, pw)      create an account with email + password
     .resetPassword(email)   send a password-reset email
     .signOut()
     .apiFetch(url, opts)    fetch with the bearer token attached
     .onChange(cb)           subscribe to user changes; called with the user

   window.atvUser mirrors atvAuth.user for quick reads.

   Loads @supabase/supabase-js from jsDelivr (the one functional CDN
   dependency — the site is otherwise self-hosted). Auth is Supabase
   email + password; role is resolved server-side via /api/me.
==================================================================== */

(function () {
  'use strict';

  var SUPABASE_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

  var client = null;
  var token = null;
  var listeners = [];
  var state = { user: null, loading: true, configured: false };

  var resolveReady;
  var readyPromise = new Promise(function (r) { resolveReady = r; });

  // -------- helpers --------
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (window.supabase) return resolve();
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('Could not load the Supabase SDK.')); };
      document.head.appendChild(s);
    });
  }

  function notify() {
    window.atvUser = state.user;
    listeners.forEach(function (cb) {
      try { cb(state.user); } catch (e) { /* listener errors are not fatal */ }
    });
    renderChip();
  }

  function apiFetch(url, options) {
    options = options || {};
    var headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    if (token) headers['Authorization'] = 'Bearer ' + token;
    options.headers = headers;
    return fetch(url, options);
  }

  function fetchMe() {
    return apiFetch('/api/me')
      .then(function (res) { return res.ok ? res.json() : null; })
      .catch(function () { return null; });
  }

  // -------- init --------
  function init() {
    fetch('/api/config')
      .then(function (res) { return res.json(); })
      .then(function (cfg) {
        if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) {
          console.warn('[atvAuth] Supabase not configured — site runs as guest.');
          return finish();
        }
        state.configured = true;
        return loadScript(SUPABASE_CDN).then(function () {
          client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
          return client.auth.getSession();
        }).then(function (result) {
          var session = result && result.data && result.data.session;
          var step = Promise.resolve();
          if (session) {
            token = session.access_token;
            step = fetchMe().then(function (me) { state.user = me; });
          }
          client.auth.onAuthStateChange(function (event, newSession) {
            if (newSession) {
              token = newSession.access_token;
              fetchMe().then(function (me) { state.user = me; notify(); });
            } else {
              token = null;
              state.user = null;
              notify();
            }
          });
          return step;
        });
      })
      .catch(function (err) {
        console.warn('[atvAuth] init failed:', err.message);
      })
      .then(finish);
  }

  function finish() {
    state.loading = false;
    resolveReady(state);
    notify();
  }

  // -------- public actions --------
  // Email + password sign-in.
  function signIn(email, password) {
    if (!client) return Promise.reject(new Error('Sign-in is unavailable right now.'));
    return client.auth.signInWithPassword({ email: email, password: password })
      .then(function (res) {
        if (res.error) throw res.error;
        return true;
      });
  }

  // Create an account with email + password. If email confirmation is OFF
  // in Supabase, this returns a live session immediately (signed in). If it
  // is ON, no session is returned — the caller should prompt to check email.
  function signUp(email, password) {
    if (!client) return Promise.reject(new Error('Sign-up is unavailable right now.'));
    return client.auth.signUp({ email: email, password: password })
      .then(function (res) {
        if (res.error) throw res.error;
        return { needsConfirmation: !(res.data && res.data.session) };
      });
  }

  // Send a password-reset email (the one flow that still needs email).
  function resetPassword(email) {
    if (!client) return Promise.reject(new Error('Password reset is unavailable right now.'));
    return client.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/account.html'
    }).then(function (res) {
      if (res.error) throw res.error;
      return true;
    });
  }

  function signOut() {
    var done = client ? client.auth.signOut() : Promise.resolve();
    return done.then(function () {
      token = null;
      state.user = null;
      notify();
    });
  }

  function onChange(cb) {
    if (typeof cb === 'function') {
      listeners.push(cb);
      if (!state.loading) { try { cb(state.user); } catch (e) {} }
    }
  }

  // -------- account chip --------
  function injectChipStyles() {
    if (document.getElementById('atvAuthStyles')) return;
    var style = document.createElement('style');
    style.id = 'atvAuthStyles';
    style.textContent = [
      '.atv-auth-chip { display: inline-flex; align-items: baseline; gap: 8px; font-family: var(--display, serif); font-style: italic; font-size: 13px; }',
      '.atv-auth-chip a { color: var(--ink-soft, #4B4B4A); text-decoration: none; }',
      '.atv-auth-chip a:hover { color: var(--saffron, #B46E3B); }',
      '.atv-auth-chip .atv-role { font-style: normal; font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted, #847171); border: 1px solid var(--rule, #C8C5BF); border-radius: 999px; padding: 2px 8px; }',
      '.atv-auth-chip .atv-role.student { color: var(--forest, #32413B); border-color: var(--forest, #32413B); }',
      '.atv-auth-chip .atv-role.admin { color: var(--saffron, #B46E3B); border-color: var(--saffron, #B46E3B); }'
    ].join('\n');
    document.head.appendChild(style);
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }

  function renderChip() {
    var mount = document.getElementById('atvAuthMount');
    if (!mount) return;
    injectChipStyles();

    if (state.loading) {
      mount.innerHTML = '<span class="atv-auth-chip"><span class="atv-role">…</span></span>';
      return;
    }
    if (!state.user) {
      mount.innerHTML = '<span class="atv-auth-chip"><a href="/account.html">Sign in</a></span>';
      return;
    }
    var u = state.user;
    var html = '<span class="atv-auth-chip">';
    html += '<a href="/account.html">' + esc(u.email) + '</a>';
    html += '<span class="atv-role ' + esc(u.role) + '">' + esc(u.role) + '</span>';
    if (u.role === 'admin') {
      html += '<a href="/admin.html">Admin</a>';
    }
    html += '</span>';
    mount.innerHTML = html;
  }

  // -------- expose --------
  window.atvAuth = {
    ready: readyPromise,
    get user() { return state.user; },
    signIn: signIn,
    signUp: signUp,
    resetPassword: resetPassword,
    signOut: signOut,
    onChange: onChange,
    apiFetch: apiFetch
  };
  window.atvUser = null;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
