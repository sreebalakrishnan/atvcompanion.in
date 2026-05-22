-- ====================================================================
-- ATV Companion — database schema
-- ====================================================================
-- Applied idempotently on every server boot (initDb in server.js).
-- Postgres (Supabase). All user data keyed by the Supabase auth user id.
-- ====================================================================

-- User profiles. One row per Supabase auth user. `role` drives content
-- gating: guest (default) sees the public-safe site; student is an
-- approved cohort member; admin manages roles.
CREATE TABLE IF NOT EXISTS profiles (
  id           UUID PRIMARY KEY,
  email        TEXT UNIQUE NOT NULL,
  role         TEXT NOT NULL DEFAULT 'guest'
                 CHECK (role IN ('guest', 'student', 'admin')),
  display_name TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at  TIMESTAMPTZ,
  approved_by  TEXT
);

-- Per-track journey progress. Replaces the atv-moon-track-v1 localStorage key.
CREATE TABLE IF NOT EXISTS track_progress (
  user_id         UUID NOT NULL,
  track           TEXT NOT NULL,           -- 'moon', 'sun', 'mars', ...
  completed_stops INTEGER[] NOT NULL DEFAULT '{}',
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, track)
);

-- Journalling / reflection entries. Replaces atv-moon-journal-v1 and the
-- various per-page journal localStorage keys. Keyed by a stable element id.
CREATE TABLE IF NOT EXISTS journal_entries (
  user_id    UUID NOT NULL,
  entry_key  TEXT NOT NULL,                -- DOM element id / prompt id
  page       TEXT,                         -- originating page path
  content    TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, entry_key)
);

-- Lightweight key/value preferences. Replaces atv-lc-level-v1,
-- atv-lc-mode-v1, theme/view/speed keys, elements-active-tab-v1, etc.
CREATE TABLE IF NOT EXISTS preferences (
  user_id    UUID NOT NULL,
  pref_key   TEXT NOT NULL,
  pref_value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, pref_key)
);

-- The learner's own chart data (birth location, etc.). Replaces the
-- astro-mychart-* localStorage keys. One row per user.
CREATE TABLE IF NOT EXISTS chart_data (
  user_id    UUID PRIMARY KEY,
  data       JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_journal_user ON journal_entries (user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON track_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_prefs_user ON preferences (user_id);

-- Lock every table to the server only. The Express API connects as the
-- `postgres` role, which bypasses RLS. Enabling RLS with NO policies blocks
-- Supabase's public PostgREST endpoint, so the (public) anon key cannot
-- read or write these tables directly — all access goes through /api.
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferences     ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_data      ENABLE ROW LEVEL SECURITY;
