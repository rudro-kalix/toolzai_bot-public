CREATE TABLE IF NOT EXISTS bot_menu_drafts (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  revision INTEGER NOT NULL DEFAULT 0,
  menu_json TEXT NOT NULL,
  updated_by TEXT NOT NULL DEFAULT 'manager',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bot_menu_versions (
  id TEXT PRIMARY KEY,
  revision INTEGER NOT NULL,
  menu_json TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  created_by TEXT NOT NULL DEFAULT 'manager',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bot_menu_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  active_version_id TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bot_menu_audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  version_id TEXT,
  revision INTEGER,
  actor TEXT NOT NULL DEFAULT 'manager',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bot_menu_versions_created_at
  ON bot_menu_versions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bot_menu_audit_created_at
  ON bot_menu_audit (created_at DESC);
