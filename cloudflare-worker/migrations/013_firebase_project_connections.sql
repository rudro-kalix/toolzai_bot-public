CREATE TABLE IF NOT EXISTS firebase_project_connections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL,
  database_id TEXT NOT NULL DEFAULT '(default)',
  client_email TEXT NOT NULL,
  encrypted_credentials TEXT NOT NULL,
  payments_collections TEXT NOT NULL,
  claims_collection TEXT NOT NULL,
  referrals_collection TEXT NOT NULL,
  manager_collections TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('active', 'previous', 'archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  activated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_firebase_project_connections_active
  ON firebase_project_connections (status)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_firebase_project_connections_activated
  ON firebase_project_connections (activated_at DESC, id DESC);
