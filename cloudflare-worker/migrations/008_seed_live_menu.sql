INSERT INTO bot_menu_drafts (id, revision, menu_json, updated_by, updated_at)
SELECT
  1,
  1,
  '{"schemaVersion":1,"screens":[{"id":"main","title_en":"Use the menu buttons below 👇","title_bn":"নিচের মেনু ব্যবহার করুন 👇","buttons":[{"id":"builtin-products","label_en":"🛍️⭐ PRODUCTS ⭐","label_bn":"🛍️⭐ পণ্য ⭐","action":"products","value":"","width":"half","enabled":true},{"id":"builtin-proxy","label_en":"🛒⭐ BUY PROXY ⭐","label_bn":"🛒⭐ প্রক্সি কিনুন ⭐","action":"proxy","value":"","width":"half","enabled":true},{"id":"builtin-balance","label_en":"💰 Balance","label_bn":"💰 ব্যালেন্স","action":"balance","value":"","width":"half","enabled":true},{"id":"builtin-history","label_en":"📜 History","label_bn":"📜 হিস্ট্রি","action":"history","value":"","width":"half","enabled":true},{"id":"builtin-refer","label_en":"🎁 Refer & Earn","label_bn":"🎁 রেফার করুন","action":"refer","value":"","width":"half","enabled":true},{"id":"builtin-support","label_en":"📞 Contact Support","label_bn":"📞 সাপোর্ট","action":"support","value":"","width":"half","enabled":true}]}]}',
  'migration',
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM bot_menu_drafts WHERE id = 1);

INSERT INTO bot_menu_versions (id, revision, menu_json, note, created_by, created_at)
SELECT
  '00000000-0000-4000-8000-000000000001',
  revision,
  menu_json,
  'Initial live menu',
  'migration',
  CURRENT_TIMESTAMP
FROM bot_menu_drafts
WHERE id = 1
  AND NOT EXISTS (SELECT 1 FROM bot_menu_versions);

INSERT INTO bot_menu_state (id, active_version_id, updated_at)
SELECT
  1,
  id,
  CURRENT_TIMESTAMP
FROM bot_menu_versions
WHERE NOT EXISTS (
  SELECT 1 FROM bot_menu_state WHERE id = 1 AND active_version_id IS NOT NULL
)
ORDER BY created_at ASC
LIMIT 1
ON CONFLICT(id) DO UPDATE SET
  active_version_id = excluded.active_version_id,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO bot_menu_audit (event_type, version_id, revision, actor, created_at)
SELECT
  'publish',
  id,
  revision,
  'migration',
  CURRENT_TIMESTAMP
FROM bot_menu_versions
WHERE id = '00000000-0000-4000-8000-000000000001'
  AND NOT EXISTS (
    SELECT 1 FROM bot_menu_audit
    WHERE event_type = 'publish'
      AND version_id = '00000000-0000-4000-8000-000000000001'
  );
