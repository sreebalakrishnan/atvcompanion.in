/* ====================================================================
   gating.js — role-aware content gating.
   ====================================================================

   Tag content blocks in any page:

     <div data-audience="cohort"> … "Vikram said …" / cohort depth … </div>
     <div data-audience="public"> … public-safe alternative … </div>

   - cohort  → shown only to signed-in students and admins
   - public  → shown only to guests (and signed-out visitors)

   Cohort blocks are hidden by CSS *by default* and revealed only once a
   student/admin role is confirmed — so guests never see cohort-only
   material, even before auth resolves.

   This is a SOFT gate: cohort markup is still present in the page source.
   Hard gating (serving cohort fragments from the authenticated API) is a
   later hardening step — see PLAN.md.

   Loaded site-wide by site-nav.js; depends on auth.js (window.atvAuth).
==================================================================== */

(function () {
  'use strict';
  if (window.atvGating) return; // idempotent
  window.atvGating = true;

  // Inject the gating CSS as early as this script runs.
  if (!document.getElementById('atvGatingStyles')) {
    var st = document.createElement('style');
    st.id = 'atvGatingStyles';
    st.textContent = [
      '[data-audience="cohort"]{display:none}',
      'html[data-role="student"] [data-audience="cohort"],',
      'html[data-role="admin"] [data-audience="cohort"]{display:revert}',
      'html[data-role="student"] [data-audience="public"],',
      'html[data-role="admin"] [data-audience="public"]{display:none}'
    ].join('');
    (document.head || document.documentElement).appendChild(st);
  }

  function apply(role) {
    document.documentElement.setAttribute('data-role', role || 'guest');
  }

  apply('guest'); // safe default until auth resolves

  if (window.atvAuth && window.atvAuth.ready) {
    window.atvAuth.ready.then(function (state) {
      apply(state && state.user ? state.user.role : 'guest');
    });
    window.atvAuth.onChange(function (user) {
      apply(user ? user.role : 'guest');
    });
  }
})();
