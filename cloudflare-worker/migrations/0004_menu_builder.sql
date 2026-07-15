CREATE TABLE IF NOT EXISTS bot_menu_buttons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  parent_id INTEGER,
  label_en TEXT NOT NULL UNIQUE,
  label_bn TEXT NOT NULL UNIQUE,
  action_type TEXT NOT NULL CHECK (action_type IN ('message', 'url', 'submenu')),
  action_value TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
