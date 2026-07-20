CREATE TABLE IF NOT EXISTS payment_verification_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id INTEGER NOT NULL,
  transaction_id TEXT NOT NULL DEFAULT '',
  provider TEXT NOT NULL,
  expected_amount_bdt REAL,
  actual_amount_bdt REAL,
  actual_provider TEXT,
  status TEXT NOT NULL CHECK (status IN ('verified', 'rejected', 'unavailable', 'rate_limited', 'invalid_input')),
  reason TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (telegram_id) REFERENCES users(telegram_id)
);

CREATE INDEX IF NOT EXISTS idx_payment_attempts_status_created
  ON payment_verification_attempts (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payment_attempts_user_created
  ON payment_verification_attempts (telegram_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payment_attempts_transaction
  ON payment_verification_attempts (transaction_id, created_at DESC);
