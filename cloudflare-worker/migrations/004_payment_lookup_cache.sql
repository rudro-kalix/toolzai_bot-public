CREATE TABLE IF NOT EXISTS payment_lookup_cache (
  transaction_id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  amount_bdt INTEGER,
  provider TEXT,
  source_document TEXT,
  cached_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payment_lookup_cache_expires_at ON payment_lookup_cache (expires_at);

CREATE TABLE IF NOT EXISTS payment_attempt_windows (
  telegram_id INTEGER PRIMARY KEY,
  window_start INTEGER NOT NULL,
  attempt_count INTEGER NOT NULL
);
