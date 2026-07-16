export const botContentFields = [
  { key: "welcome_en", group: "Welcome", label: "Welcome message — English", kind: "text", help: "Available: {{user_id}}, {{balance}}", defaultValue: "🎉 Welcome to ToolzAI Bot!\n\n👤 User ID: {{user_id}}\n💵 Your Balance: {{balance}}\n\nUse the buttons below to navigate 👇" },
  { key: "welcome_bn", group: "Welcome", label: "Welcome message — বাংলা", kind: "text", help: "Available: {{user_id}}, {{balance}}", defaultValue: "🎉 ToolzAI Bot-এ স্বাগতম!\n\n👤 User ID: {{user_id}}\n💵 আপনার ব্যালেন্স: {{balance}}\n\nনিচের বাটন ব্যবহার করুন 👇" },
  { key: "join_required_en", group: "Access", label: "Join-channel prompt — English", kind: "text", help: "The Join Channel buttons are added automatically.", defaultValue: "⚠️ You must join our channel to use this bot!\n\nJoin our official channel, then tap I've Joined to continue." },
  { key: "join_required_bn", group: "Access", label: "Join-channel prompt — বাংলা", kind: "text", help: "The Join Channel buttons are added automatically.", defaultValue: "⚠️ এই বট ব্যবহার করতে আমাদের চ্যানেলে জয়েন করতে হবে!\n\nচ্যানেলে জয়েন করে I've Joined চাপুন।" },
  { key: "support_url", group: "Links and accounts", label: "Telegram support link", kind: "telegram_url", help: "Must look like https://t.me/username", defaultValue: "https://t.me/raff_551" },
  { key: "payment_bkash", group: "Links and accounts", label: "bKash number", kind: "phone", help: "Digits only.", defaultValue: "01607656890" },
  { key: "payment_nagad", group: "Links and accounts", label: "Nagad number", kind: "phone", help: "Digits only.", defaultValue: "01607656890" },
  { key: "payment_upay", group: "Links and accounts", label: "Upay number", kind: "phone", help: "Digits only.", defaultValue: "01607656890" },
] as const;
