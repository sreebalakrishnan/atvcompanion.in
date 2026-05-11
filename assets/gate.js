/* ====================================================================
   gate.js — soft passcode gate for cohort-only pages.
   ====================================================================

   Shipped in v4.74.6 in response to two threads:
     • Vikram's concern about content being consumed out of context
       (a second-year student building a predictive engine surfaced this)
     • The need to be honest with cohort members about who this is for —
       it's a companion app, not a public resource.

   What this IS:
     • A soft gate. Bots can't pass it (they don't fill forms). Casual
       link-sharing is blocked (forwarded URLs still need the passcode).
     • A "please don't" sign that defeats ~95% of the realistic threats
       to Vikram's content sequencing.

   What this IS NOT:
     • Real security. Anyone with browser dev tools can bypass it in
       seconds — the HTML is still served, the passcode is in the source.
       Real auth requires server-side (planned for Firebase phase).

   How to add to a page:
     1. In <head>, immediately after </title>, add the inline pre-paint
        hider so the page never flashes before the gate appears:
          <script>(function(){try{if(localStorage.getItem('atv-gate-v1')!=='1')
          document.documentElement.style.visibility='hidden';}catch(e){}})();</script>
     2. Before </body>:
          <script src="assets/gate.js"></script>

   Open pages (no gate): index.html, feedback.html, collaborate.html,
   about.html — so prospective cohort members can read the manifesto
   and reach out.
==================================================================== */

(function(){
  'use strict';

  var STORAGE_KEY = 'atv-gate-v1';
  var PASSCODE = 'groundfirst';   // case-insensitive compare

  // ---- Already unlocked? Make sure the page is visible and exit. ----
  var unlocked = false;
  try {
    unlocked = (localStorage.getItem(STORAGE_KEY) === '1');
  } catch (e) {
    // localStorage blocked (private browsing, embedded, etc.) — fail-open
    // so accessibility / kiosk scenarios aren't locked out by browser config.
    unlocked = true;
  }
  if (unlocked) {
    document.documentElement.style.visibility = '';
    return;
  }

  // ---- Inject styles (idempotent) ----
  function injectStyles(){
    if (document.getElementById('atvGateStyles')) return;
    var s = document.createElement('style');
    s.id = 'atvGateStyles';
    s.textContent = [
      '#atvGate { position: fixed; inset: 0; visibility: visible !important; background: #F4EEDA; z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px; font-family: "Libre Caslon Text", "Cormorant Garamond", serif; }',
      '#atvGate .gate-card { max-width: 440px; width: 100%; background: #F8F4E1; border: 1px solid #CAC6BB; border-radius: 14px; padding: 36px 32px; text-align: center; box-shadow: 0 30px 60px -20px rgba(40,40,38,.25); }',
      '#atvGate .gate-ornament { color: #BC8146; opacity: .65; width: 18px; height: 18px; margin: 0 auto 14px; display: block; }',
      '#atvGate .gate-eyebrow { font-style: italic; font-size: 12px; letter-spacing: .16em; color: #BC8146; text-transform: uppercase; margin-bottom: 8px; }',
      '#atvGate h1 { font-family: "Libre Caslon Text", "Cormorant Garamond", serif; font-weight: 500; font-size: 32px; margin: 0 0 8px; color: #282826; letter-spacing: -.005em; }',
      '#atvGate h1 em { color: #BC8146; font-style: italic; }',
      '#atvGate .gate-sub { font-style: italic; font-size: 14.5px; color: #4B4B4A; margin: 0 0 22px; line-height: 1.55; }',
      '#atvGate input[type="password"] { width: 100%; padding: 11px 14px; background: #F4EEDA; border: 1px solid #CAC6BB; border-radius: 8px; font-family: "Switzer", "Spectral", system-ui, sans-serif; font-size: 15px; color: #282826; text-align: center; letter-spacing: .04em; outline: none; transition: border-color .15s; box-sizing: border-box; }',
      '#atvGate input[type="password"]:focus { border-color: #BC8146; }',
      '#atvGate input.is-error { border-color: #a63636; animation: atvGateShake .32s; }',
      '@keyframes atvGateShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }',
      '#atvGate .gate-btn { margin-top: 14px; padding: 10px 28px; background: #282826; color: #F8F4E1; border: 0; border-radius: 999px; font-family: "Libre Caslon Text", serif; font-style: italic; font-size: 14.5px; font-weight: 500; cursor: pointer; transition: background .15s, transform .12s; }',
      '#atvGate .gate-btn:hover { background: #BC8146; transform: translateY(-1px); }',
      '#atvGate .gate-err { font-style: italic; font-size: 13px; color: #a63636; margin: 10px 0 0; min-height: 18px; line-height: 1.4; }',
      '#atvGate .gate-note { margin: 22px 0 0; padding: 12px 14px; background: rgba(188,129,70,.06); border: 1px solid rgba(188,129,70,.35); border-radius: 8px; font-family: "Libre Caslon Text", "Cormorant Garamond", serif; font-style: italic; font-size: 13.5px; color: #4B4B4A; line-height: 1.55; text-align: left; }',
      '#atvGate .gate-note em { color: #BC8146; font-style: italic; }',
      '#atvGate .gate-note strong { color: #282826; font-weight: 500; font-style: normal; }',
      '#atvGate .gate-footnote { margin-top: 16px; padding-top: 14px; border-top: 1px solid #E0DCCD; font-style: italic; font-size: 12.5px; color: #7C7B78; line-height: 1.55; }',
      '#atvGate .gate-footnote a { color: #BC8146; text-decoration: underline; text-decoration-color: #CAC6BB; text-underline-offset: 3px; }',
      '#atvGate .gate-footnote a:hover { text-decoration-color: #BC8146; }'
    ].join('\n');
    document.head.appendChild(s);
  }

  // ---- Build the overlay ----
  function build(){
    injectStyles();
    var d = document.createElement('div');
    d.id = 'atvGate';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-modal', 'true');
    d.setAttribute('aria-labelledby', 'atvGateTitle');
    d.innerHTML =
      '<div class="gate-card">' +
        '<svg class="gate-ornament" viewBox="0 0 24 24" aria-hidden="true">' +
          '<path fill="currentColor" d="M12 2 13.5 10.5 22 12 13.5 13.5 12 22 10.5 13.5 2 12 10.5 10.5z"/>' +
        '</svg>' +
        '<div class="gate-eyebrow">cohort access</div>' +
        '<h1 id="atvGateTitle">Astrology <em>101</em></h1>' +
        '<p class="gate-sub">Currently shared with Vikram\'s cohort. Enter the passcode you were given.</p>' +
        '<form id="atvGateForm" autocomplete="off" novalidate>' +
          '<input type="password" id="atvGateInput" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="passcode" aria-label="Passcode" name="atv-passcode-' + Date.now() + '">' +
          '<div class="gate-err" id="atvGateErr" aria-live="polite"></div>' +
          '<button class="gate-btn" type="submit">Enter</button>' +
        '</form>' +
        '<p class="gate-note">We\'re in <em>early beta</em> — still experimenting, and access is restricted while we figure out what works. If you\'d like the passcode, reach out to <strong>Vikram</strong>, <strong>Sree</strong>, or the <strong>workbook team</strong>.</p>' +
        '<p class="gate-footnote">Curious from the outside? Read the <a href="collaborate.html">manifesto</a> or <a href="feedback.html">send us a note</a>.</p>' +
      '</div>';
    document.body.appendChild(d);

    var input = document.getElementById('atvGateInput');
    var err = document.getElementById('atvGateErr');
    var form = document.getElementById('atvGateForm');

    // Focus the input
    setTimeout(function(){ if (input) input.focus(); }, 60);

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var val = (input.value || '').trim().toLowerCase();
      if (val === PASSCODE) {
        try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
        var gate = document.getElementById('atvGate');
        if (gate) gate.remove();
        document.documentElement.style.visibility = '';
      } else {
        input.classList.add('is-error');
        err.textContent = "That's not it. Try again, or send us a note via Feedback.";
        setTimeout(function(){ input.classList.remove('is-error'); }, 360);
        input.select();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }

  // Expose for testing / future Firebase migration
  window.AtvGate = {
    isUnlocked: function(){ try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch(e) { return false; } },
    forget:     function(){ try { localStorage.removeItem(STORAGE_KEY); } catch(e) {} location.reload(); }
  };
})();
