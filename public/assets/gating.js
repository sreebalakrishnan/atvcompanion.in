/* ====================================================================
   gating.js — site-wide auth gate + role-aware content gating.
   ====================================================================

   AUTH GATE — every page requires a signed-in account.
   Signed-out visitors on any page except the login pages (index.html,
   account.html) are redirected to index.html (the login). index.html
   itself shows a sign-in panel when signed out; account.html is the
   secondary sign-in/account page.

   CONTENT GATING — tag blocks within a page:
     <div data-audience="cohort"> … "Vikram said …" / cohort depth … </div>
     <div data-audience="public"> … public-safe alternative … </div>
   cohort → signed-in students + admins only; public → guests only.
   Cohort blocks are hidden by default and revealed only once a
   student/admin role is confirmed.

   This is a SOFT gate (markup is still in the page source; the gate is a
   client-side redirect). The real protection is the API requiring auth.
   Loaded site-wide by site-nav.js; depends on auth.js (window.atvAuth).
==================================================================== */

(function () {
  'use strict';
  if (window.atvGating) return; // idempotent
  window.atvGating = true;

  var path = window.location.pathname || '/';
  var isLoginPage = (path === '/' || path === '/index.html' || path === '/account.html');

  // ---- CSS: content gating + (on gated pages) hide body until resolved ----
  if (!document.getElementById('atvGatingStyles')) {
    var st = document.createElement('style');
    st.id = 'atvGatingStyles';
    st.textContent = [
      '[data-audience="cohort"]{display:none}',
      'html[data-role="student"] [data-audience="cohort"],',
      'html[data-role="admin"] [data-audience="cohort"]{display:revert}',
      'html[data-role="student"] [data-audience="public"],',
      'html[data-role="admin"] [data-audience="public"]{display:none}',
      'html.atv-gate-pending body{visibility:hidden}'
    ].join('');
    (document.head || document.documentElement).appendChild(st);
  }

  // On gated pages, hide the body until auth resolves (avoids showing a
  // page to a signed-out visitor for more than a frame before redirect).
  if (!isLoginPage) {
    document.documentElement.classList.add('atv-gate-pending');
  }

  function reveal() {
    document.documentElement.classList.remove('atv-gate-pending');
  }

  function setRole(role) {
    document.documentElement.setAttribute('data-role', role || 'guest');
  }

  function gotoLogin() {
    var next = encodeURIComponent(path + window.location.search);
    window.location.replace('/index.html?next=' + next);
  }

  // ---- decide ----
  function decide(state) {
    // Auth not configured on the server → don't lock everyone out.
    if (state && state.configured === false) { setRole('guest'); reveal(); return; }
    var user = state && state.user;
    if (user) {
      setRole(user.role);
      reveal();
    } else {
      setRole('guest');
      if (isLoginPage) { reveal(); }
      else { gotoLogin(); }   // body stays hidden through the redirect
    }
  }

  setRole('guest'); // safe default

  if (window.atvAuth && window.atvAuth.ready) {
    window.atvAuth.ready.then(decide);
    window.atvAuth.onChange(function (user) {
      // React to sign-out mid-session too.
      decide({ configured: true, user: user });
    });
  } else {
    // No auth module at all — fail open so the site stays usable.
    reveal();
  }
})();
