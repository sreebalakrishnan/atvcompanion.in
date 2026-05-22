/* ====================================================================
   server.js — ATV Companion (Express + Supabase flavour)
   ====================================================================

   Serves the static site and a small JSON API under /api.

   - Auth: Supabase magic-link. The browser signs in client-side; this
     server only verifies the bearer token (supabase.auth.getUser) and
     resolves a role from the `profiles` table.
   - Roles: guest (default) | student (approved cohort) | admin.
   - DB: Supabase Postgres via the `pg` Pool (DATABASE_URL).

   Env vars: see .env.example. The server still boots without them so the
   static site is viewable locally — API routes just return 500/501.
==================================================================== */

'use strict';

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Load .env for local dev. On a host (Vercel / Hostinger) the env vars come
// from the platform and there is no .env file — dotenv simply finds nothing.
require('dotenv').config();

const PORT = process.env.PORT || 8000;
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(function (s) { return s.trim().toLowerCase(); })
  .filter(Boolean);

const app = express();
app.use(cors());
app.use(express.json());

// -------- SUPABASE (lazy) --------
let supabase;
function getSupabase() {
  if (!supabase && process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  }
  return supabase;
}

// -------- POSTGRES --------
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // required for Supabase
});

// -------- PROFILE RESOLUTION --------
// Resolve (and lazily create) the profile row for an authenticated user.
// First-time users become 'guest'. Emails in ADMIN_EMAILS are promoted to
// 'admin' automatically — this bootstraps the first admin(s).
async function loadProfile(user) {
  const email = String(user.email || '').toLowerCase();
  const isAdmin = ADMIN_EMAILS.indexOf(email) !== -1;

  const found = await pool.query('SELECT * FROM profiles WHERE id = $1', [user.id]);

  if (found.rows.length === 0) {
    const role = isAdmin ? 'admin' : 'guest';
    const inserted = await pool.query(
      `INSERT INTO profiles (id, email, role, approved_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email
       RETURNING *`,
      [user.id, email, role, role === 'guest' ? null : new Date()]
    );
    return inserted.rows[0];
  }

  let profile = found.rows[0];
  if (isAdmin && profile.role !== 'admin') {
    const updated = await pool.query(
      `UPDATE profiles
         SET role = 'admin', approved_at = COALESCE(approved_at, now())
       WHERE id = $1 RETURNING *`,
      [user.id]
    );
    profile = updated.rows[0];
  }
  return profile;
}

// -------- MIDDLEWARE --------
async function requireAuth(req, res, next) {
  if (req.path === '/config') return next(); // public

  const sb = getSupabase();
  if (!sb) return res.status(500).json({ error: 'Supabase is not configured on the server.' });

  const header = req.headers.authorization || '';
  if (header.indexOf('Bearer ') !== 0) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header.' });
  }
  const token = header.slice('Bearer '.length);

  try {
    const result = await sb.auth.getUser(token);
    if (result.error || !result.data || !result.data.user) {
      console.log('[api] token rejected: ' + (result.error ? result.error.message : 'no user'));
      return res.status(401).json({ error: 'Invalid or expired session.' });
    }
    req.user = result.data.user;
    req.profile = await loadProfile(req.user);
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(500).json({ error: 'Authentication check failed.' });
  }
}

function requireRole() {
  const roles = Array.prototype.slice.call(arguments);
  return function (req, res, next) {
    if (!req.profile || roles.indexOf(req.profile.role) === -1) {
      return res.status(403).json({ error: 'You do not have access to this resource.' });
    }
    next();
  };
}

// Request logger (diagnostics) — logs every /api hit.
app.use('/api', function (req, res, next) {
  console.log('[api] ' + req.method + ' ' + req.path +
    (req.headers.authorization ? ' (token present)' : ' (no token)'));
  next();
});

app.use('/api', requireAuth);

// -------- API: PUBLIC --------
app.get('/api/config', function (req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.json({
    SUPABASE_URL: process.env.SUPABASE_URL || null,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || null
  });
});

// -------- API: CURRENT USER --------
app.get('/api/me', function (req, res) {
  res.json({
    id: req.profile.id,
    email: req.profile.email,
    role: req.profile.role,
    displayName: req.profile.display_name,
    approvedAt: req.profile.approved_at
  });
});

// -------- API: ADMIN --------
app.get('/api/admin/users', requireRole('admin'), async function (req, res) {
  try {
    const result = await pool.query(
      `SELECT id, email, role, display_name, created_at, approved_at, approved_by
         FROM profiles ORDER BY created_at DESC`
    );
    res.json({ users: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/users/:id/role', requireRole('admin'), async function (req, res) {
  const role = req.body && req.body.role;
  if (['guest', 'student', 'admin'].indexOf(role) === -1) {
    return res.status(400).json({ error: 'Role must be guest, student, or admin.' });
  }
  if (req.params.id === req.profile.id && role !== 'admin') {
    return res.status(400).json({ error: 'You cannot remove your own admin role.' });
  }
  try {
    const result = await pool.query(
      `UPDATE profiles
         SET role = $1,
             approved_at = CASE WHEN $1 = 'guest' THEN NULL
                                ELSE COALESCE(approved_at, now()) END,
             approved_by = CASE WHEN $1 = 'guest' THEN NULL ELSE $2 END
       WHERE id = $3
       RETURNING id, email, role, approved_at, approved_by`,
      [role, req.profile.email, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found.' });
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------- API: USER DATA --------
// All keyed by the signed-in user. Any role may store its own data.

// Track journey progress -----------------------------------------------
app.get('/api/progress', async function (req, res) {
  try {
    const r = await pool.query(
      'SELECT track, completed_stops FROM track_progress WHERE user_id = $1',
      [req.profile.id]
    );
    const progress = {};
    r.rows.forEach(function (row) { progress[row.track] = row.completed_stops; });
    res.json({ progress: progress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/progress', async function (req, res) {
  const track = req.body && req.body.track;
  const stops = (req.body && req.body.completedStops) || [];
  if (!track || !Array.isArray(stops)) {
    return res.status(400).json({ error: 'track and completedStops are required.' });
  }
  const clean = stops.map(Number).filter(function (n) { return Number.isInteger(n); });
  try {
    const r = await pool.query(
      `INSERT INTO track_progress (user_id, track, completed_stops, updated_at)
       VALUES ($1, $2, $3, now())
       ON CONFLICT (user_id, track)
         DO UPDATE SET completed_stops = EXCLUDED.completed_stops, updated_at = now()
       RETURNING track, completed_stops`,
      [req.profile.id, String(track), clean]
    );
    res.json({ track: r.rows[0].track, completedStops: r.rows[0].completed_stops });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Journal / reflection entries -----------------------------------------
app.get('/api/journal', async function (req, res) {
  try {
    const r = await pool.query(
      'SELECT entry_key, page, content FROM journal_entries WHERE user_id = $1',
      [req.profile.id]
    );
    const entries = {};
    r.rows.forEach(function (row) {
      entries[row.entry_key] = { content: row.content, page: row.page };
    });
    res.json({ entries: entries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/journal', async function (req, res) {
  const entryKey = req.body && req.body.entryKey;
  if (!entryKey) return res.status(400).json({ error: 'entryKey is required.' });
  const content = (req.body && req.body.content) || '';
  const page = (req.body && req.body.page) || null;
  try {
    await pool.query(
      `INSERT INTO journal_entries (user_id, entry_key, page, content, updated_at)
       VALUES ($1, $2, $3, $4, now())
       ON CONFLICT (user_id, entry_key)
         DO UPDATE SET content = EXCLUDED.content, page = EXCLUDED.page, updated_at = now()`,
      [req.profile.id, String(entryKey), page, content]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lightweight preferences ----------------------------------------------
app.get('/api/prefs', async function (req, res) {
  try {
    const r = await pool.query(
      'SELECT pref_key, pref_value FROM preferences WHERE user_id = $1',
      [req.profile.id]
    );
    const prefs = {};
    r.rows.forEach(function (row) { prefs[row.pref_key] = row.pref_value; });
    res.json({ prefs: prefs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/prefs', async function (req, res) {
  const prefKey = req.body && req.body.prefKey;
  if (!prefKey) return res.status(400).json({ error: 'prefKey is required.' });
  const prefValue = req.body && req.body.prefValue != null ? String(req.body.prefValue) : null;
  try {
    await pool.query(
      `INSERT INTO preferences (user_id, pref_key, pref_value, updated_at)
       VALUES ($1, $2, $3, now())
       ON CONFLICT (user_id, pref_key)
         DO UPDATE SET pref_value = EXCLUDED.pref_value, updated_at = now()`,
      [req.profile.id, String(prefKey), prefValue]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// The learner's own chart data -----------------------------------------
app.get('/api/chart', async function (req, res) {
  try {
    const r = await pool.query('SELECT data FROM chart_data WHERE user_id = $1', [req.profile.id]);
    res.json({ data: r.rows.length ? r.rows[0].data : {} });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/chart', async function (req, res) {
  const data = (req.body && req.body.data) || {};
  if (typeof data !== 'object') return res.status(400).json({ error: 'data must be an object.' });
  try {
    await pool.query(
      `INSERT INTO chart_data (user_id, data, updated_at)
       VALUES ($1, $2, now())
       ON CONFLICT (user_id)
         DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
      [req.profile.id, data]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------- STATIC SITE --------
// Only the public/ folder is web-served. server.js, db/, the knowledge
// base and node_modules stay private at the project root.
app.use(express.static(path.join(__dirname, 'public')));

// -------- DB INIT --------
async function initDb() {
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL not set — API routes will fail until it is.');
    return;
  }
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
    await pool.query(sql);
    console.log('✅ Database schema ready.');
  } catch (err) {
    console.error('❌ Schema init failed:', err.message);
  }
}

initDb();

if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, function () {
    console.log('\n🌙 ATV Companion server — http://localhost:' + PORT);
  });
}
