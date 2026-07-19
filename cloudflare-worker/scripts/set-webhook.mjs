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
const telegram = async (method, body) => {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok || data.ok === false) throw new Error(data.description || `${method} failed`);
  return data;
};

const webhook = await telegram("setWebhook", {
  url: webhookUrl,
  secret_token: secret,
  allowed_updates: ["message", "callback_query"],
});
const commands = await telegram("setMyCommands", {
  commands: [{ command: "start", description: "Start the bot" }],
});

console.log(JSON.stringify({ webhook, commands }, null, 2));
