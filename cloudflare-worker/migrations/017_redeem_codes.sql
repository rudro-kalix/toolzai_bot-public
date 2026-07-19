CREATE TABLE IF NOT EXISTS redeem_codes (
  id TEXT PRIMARY KEY,
  code_hash TEXT NOT NULL UNIQUE,
  code_hint TEXT NOT NULL,
  amount_bdt INTEGER NOT NULL CHECK (amount_bdt > 0),
  max_redemptions INTEGER NOT NULL DEFAULT 1 CHECK (max_redemptions > 0),
  used_count INTEGER NOT NULL DEFAULT 0 CHECK (used_count >= 0),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  expires_at TEXT,
  created_by TEXT NOT NULL DEFAULT 'manager',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS redeem_code_redemptions (
  id TEXT PRIMARY KEY,
  code_id TEXT NOT NULL,
  telegram_id INTEGER NOT NULL,
  amount_bdt INTEGER NOT NULL CHECK (amount_bdt > 0),
  redeemed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (code_id, telegram_id),
  FOREIGN KEY (code_id) REFERENCES redeem_codes(id),
  FOREIGN KEY (telegram_id) REFERENCES users(telegram_id)
);

CREATE INDEX IF NOT EXISTS idx_redeem_codes_created_at ON redeem_codes (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_redeem_redemptions_user ON redeem_code_redemptions (telegram_id, redeemed_at DESC);

CREATE TABLE IF NOT EXISTS redeem_attempt_windows (
  telegram_id INTEGER PRIMARY KEY,
  window_start INTEGER NOT NULL,
  attempt_count INTEGER NOT NULL
);
