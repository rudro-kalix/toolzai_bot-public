ALTER TABLE referrals ADD COLUMN status TEXT NOT NULL DEFAULT 'completed';
ALTER TABLE referrals ADD COLUMN notified_at TEXT;
ALTER TABLE referrals ADD COLUMN completed_at TEXT;
UPDATE referrals SET completed_at = COALESCE(completed_at, created_at, CURRENT_TIMESTAMP);
