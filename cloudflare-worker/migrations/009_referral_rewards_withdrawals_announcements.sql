ALTER TABLE user_state ADD COLUMN withdrawal_amount_bdt INTEGER;

ALTER TABLE local_orders ADD COLUMN purchase_key TEXT;
UPDATE local_orders SET purchase_key = 'legacy:' || id WHERE purchase_key IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_local_orders_purchase_key ON local_orders (purchase_key);

CREATE TABLE IF NOT EXISTS referral_rewards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  local_order_id INTEGER NOT NULL UNIQUE,
  referred_id INTEGER NOT NULL,
  referrer_id INTEGER NOT NULL,
  reward_bdt INTEGER NOT NULL DEFAULT 100 CHECK (reward_bdt > 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_referral_rewards_referrer_created
  ON referral_rewards (referrer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referred
  ON referral_rewards (referred_id);

INSERT OR IGNORE INTO referral_rewards (local_order_id, referred_id, referrer_id, reward_bdt, created_at)
SELECT orders.id, referrals.referred_id, referrals.referrer_id, 100, orders.created_at
FROM local_orders AS orders
JOIN referrals ON referrals.referred_id = orders.telegram_id
WHERE referrals.status = 'completed' AND orders.created_at >= referrals.created_at;

CREATE TABLE IF NOT EXISTS referral_withdrawals (
  id TEXT PRIMARY KEY,
  telegram_id INTEGER NOT NULL,
  amount_bdt INTEGER NOT NULL CHECK (amount_bdt > 0),
  bkash_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'rejected')),
  admin_note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT,
  reviewed_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_referral_withdrawals_user_created
  ON referral_withdrawals (telegram_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_referral_withdrawals_status_created
  ON referral_withdrawals (status, created_at DESC);

CREATE TABLE IF NOT EXISTS announcement_campaigns (
  id TEXT PRIMARY KEY,
  message_text TEXT NOT NULL,
  button_label TEXT,
  button_url TEXT,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sending', 'completed')),
  recipient_count INTEGER NOT NULL DEFAULT 0,
  delivered_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  started_at TEXT,
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS announcement_deliveries (
  campaign_id TEXT NOT NULL,
  telegram_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'delivered', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  error_text TEXT,
  started_at TEXT,
  delivered_at TEXT,
  PRIMARY KEY (campaign_id, telegram_id)
);

CREATE INDEX IF NOT EXISTS idx_announcement_deliveries_queue
  ON announcement_deliveries (status, campaign_id, telegram_id);
CREATE INDEX IF NOT EXISTS idx_announcement_campaigns_created
  ON announcement_campaigns (created_at DESC);

INSERT INTO bot_settings (key, value, updated_at) VALUES
  ('refer_en', '🎁 Refer & Earn

Earn Tk 100 every time one of your referred users completes a purchase.

🔗 Your link:
{{referral_link}}

👥 Referred users: {{referral_count}}
🛍️ Their purchases: {{purchase_count}}
💰 Total earned: {{total_earned}}
✅ Available to withdraw: {{available_balance}}
⏳ Pending withdrawal: {{pending_withdrawal}}

Referral activity:
{{referral_lines}}

Recent withdrawals:
{{withdrawal_lines}}', CURRENT_TIMESTAMP),
  ('refer_bn', '🎁 রেফার করে আয় করুন

আপনার রেফার করা user প্রতিবার purchase সম্পন্ন করলে আপনি Tk 100 পাবেন।

🔗 আপনার লিংক:
{{referral_link}}

👥 রেফার করা user: {{referral_count}}
🛍️ তাদের purchase: {{purchase_count}}
💰 মোট আয়: {{total_earned}}
✅ Withdraw করা যাবে: {{available_balance}}
⏳ Pending withdraw: {{pending_withdrawal}}

Referral activity:
{{referral_lines}}

সাম্প্রতিক withdrawal:
{{withdrawal_lines}}', CURRENT_TIMESTAMP)
ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP;

UPDATE bot_menu_drafts
SET menu_json = json_set(
  menu_json,
  '$.responses.refer.text_en', (SELECT value FROM bot_settings WHERE key = 'refer_en'),
  '$.responses.refer.text_bn', (SELECT value FROM bot_settings WHERE key = 'refer_bn')
)
WHERE json_valid(menu_json);
