const [baseUrl, secret] = process.argv.slice(2);

if (!baseUrl || !secret) {
  console.error('Usage: node scripts/set-webhook.mjs "https://your-worker.workers.dev" "WEBHOOK_SECRET"');
  process.exit(1);
}

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("Set TELEGRAM_BOT_TOKEN in your shell before running this script.");
  process.exit(1);
}

const webhookUrl = `${baseUrl.replace(/\/+$/, "")}/webhook/${encodeURIComponent(secret)}`;
const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    url: webhookUrl,
    secret_token: secret,
    allowed_updates: ["message", "callback_query"],
  }),
});

const data = await response.json();
console.log(JSON.stringify(data, null, 2));
