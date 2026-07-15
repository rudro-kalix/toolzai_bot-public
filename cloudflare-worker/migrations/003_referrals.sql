CREATE TABLE IF NOT EXISTS referrals (
  referred_id INTEGER PRIMARY KEY,
  referrer_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals (referrer_id);
