import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
const schema = fs.readFileSync(new URL("../schema.sql", import.meta.url), "utf8");
const migration = fs.readFileSync(new URL("../migrations/019_direct_messages.sql", import.meta.url), "utf8");
const exposed = `${source}\nexport { runManagerOperation };`;
const worker = await import(`data:text/javascript;base64,${Buffer.from(exposed).toString("base64")}`);

for (const sql of [schema, migration]) {
  assert.match(sql, /CREATE TABLE IF NOT EXISTS direct_messages/);
  assert.match(sql, /status IN \('pending', 'delivered', 'failed'\)/);
  assert.match(sql, /idx_direct_messages_user_created/);
}

const statements = [];
const database = {
  prepare(sql) {
    const statement = {
      sql,
      args: [],
      bind(...args) { statement.args = args; return statement; },
      async first() {
        if (sql.includes("FROM users WHERE telegram_id")) {
          return { telegram_id: 123456789, username: "sample_user", first_name: "Sample", last_name: "User" };
        }
        return null;
      },
      async run() { statements.push({ sql, args: statement.args }); return { meta: { changes: 1 } }; },
    };
    return statement;
  },
};

const originalFetch = globalThis.fetch;
let telegramRequest = null;
globalThis.fetch = async (url, init) => {
  telegramRequest = { url: String(url), payload: JSON.parse(String(init?.body || "{}")) };
  return new Response(JSON.stringify({ ok: true, result: { message_id: 7788 } }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};

try {
  const result = await worker.runManagerOperation({ DB: database, TELEGRAM_BOT_TOKEN: "test-token" }, {
    operation: "sendDirectMessage",
    telegramId: 123456789,
    messageText: "Hello **Sample**",
    buttonLabel: "Open support",
    buttonUrl: "https://t.me/example",
  });
  assert.equal(result.rows[0].status, "delivered");
  assert.equal(result.rows[0].telegram_message_id, 7788);
  assert.equal(telegramRequest.payload.chat_id, 123456789);
  assert.match(telegramRequest.payload.text, /<b>Sample<\/b>/);
  assert.equal(telegramRequest.payload.reply_markup.inline_keyboard[0][0].url, "https://t.me/example");
  assert.ok(statements.some((entry) => entry.sql.includes("INSERT INTO direct_messages")));
  assert.ok(statements.some((entry) => entry.sql.includes("status = 'delivered'")));
} finally {
  globalThis.fetch = originalFetch;
}

assert.match(source, /operation === "sendDirectMessage"/);
assert.match(source, /directMessages:/);
assert.match(source, /direct_message_delivery_failed/);

console.log("Direct message checks passed.");
