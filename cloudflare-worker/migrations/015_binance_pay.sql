ALTER TABLE claimed_payments ADD COLUMN amount_usdt TEXT;

INSERT INTO bot_settings (key, value, updated_at) VALUES
  ('payment_intro_en', replace('💰 Add Balance\n\n💵 Current Balance: {{balance}}\n\n⚠️ IMPORTANT — Please Read Before Paying ⚠️\n\n⭐ Use Binance Pay (USDT) only.\n🚫 Do not send another coin; other assets cannot be credited.\n\n👇 Select the payment method:', '\n', char(10)), CURRENT_TIMESTAMP),
  ('payment_intro_bn', replace('💰 ব্যালেন্স যোগ করুন\n\n💵 বর্তমান ব্যালেন্স: {{balance}}\n\n⚠️ পেমেন্টের আগে পড়ুন ⚠️\n\n⭐ শুধুমাত্র Binance Pay (USDT) ব্যবহার করুন।\n🚫 অন্য কোনো কয়েন পাঠাবেন না; অন্য asset credit করা যাবে না।\n\n👇 পেমেন্ট পদ্ধতি বাছুন:', '\n', char(10)), CURRENT_TIMESTAMP),
  ('payment_provider_en', replace('💳 Add Balance via Binance Pay\n\n📱 Binance Pay ID:\n{{pay_id}}\n\n⚠️ Instructions:\n1️⃣ Open Binance App\n2️⃣ Go to Pay → Send\n3️⃣ Enter the Pay ID above\n4️⃣ Enter the USDT amount\n5️⃣ Complete payment\n6️⃣ Copy the Order ID from Binance\n7️⃣ Send the Order ID here (just the ID)\n\n📝 Now reply with your Binance Order ID:', '\n', char(10)), CURRENT_TIMESTAMP),
  ('payment_provider_bn', replace('💳 Binance Pay দিয়ে ব্যালেন্স যোগ করুন\n\n📱 Binance Pay ID:\n{{pay_id}}\n\n⚠️ নির্দেশনা:\n1️⃣ Binance App খুলুন\n2️⃣ Pay → Send এ যান\n3️⃣ উপরের Pay ID দিন\n4️⃣ USDT amount দিন\n5️⃣ পেমেন্ট সম্পন্ন করুন\n6️⃣ Binance থেকে Order ID কপি করুন\n7️⃣ শুধু Order ID এখানে পাঠান\n\n📝 এখন আপনার Binance Order ID পাঠান:', '\n', char(10)), CURRENT_TIMESTAMP)
ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP;
