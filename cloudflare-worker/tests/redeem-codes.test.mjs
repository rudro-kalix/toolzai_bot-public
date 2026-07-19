import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
const schema = fs.readFileSync(new URL("../schema.sql", import.meta.url), "utf8");
const migration = fs.readFileSync(new URL("../migrations/017_redeem_codes.sql", import.meta.url), "utf8");
const exposed = `${source}\nexport { generateRedeemCode, hashRedeemCode, normalizeRedeemCode };`;
const worker = await import(`data:text/javascript;base64,${Buffer.from(exposed).toString("base64")}`);

const generated = new Set(Array.from({ length: 50 }, () => worker.generateRedeemCode()));
assert.equal(generated.size, 50);
for (const code of generated) assert.match(code, /^TOOLZ-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/);

const sample = [...generated][0];
assert.equal(worker.normalizeRedeemCode(sample.toLowerCase()), sample);
assert.equal(worker.normalizeRedeemCode(sample.replaceAll("-", "")), sample);
assert.equal(worker.normalizeRedeemCode("not-a-code"), "");
assert.match(await worker.hashRedeemCode(sample), /^[a-f0-9]{64}$/);

for (const sql of [schema, migration]) {
  assert.match(sql, /CREATE TABLE IF NOT EXISTS redeem_codes/);
  assert.match(sql, /code_hash TEXT NOT NULL UNIQUE/);
  assert.match(sql, /UNIQUE \(code_id, telegram_id\)/);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS redeem_attempt_windows/);
}

assert.match(source, /state: "awaiting_redeem_code"/);
assert.match(source, /async function redeemBalanceCode/);
assert.match(source, /INSERT INTO redeem_code_redemptions/);
assert.match(source, /UPDATE users SET balance_bdt = balance_bdt \+/);
assert.match(source, /UPDATE redeem_codes SET used_count = used_count \+ 1/);
assert.match(source, /operation === "createRedeemCode"/);
assert.match(source, /operation === "disableRedeemCode"/);
assert.match(source, /redeemCodes:/);
assert.match(source, /🎟 Redeem Code/);
assert.match(source, /🎟 রিডিম কোড/);

console.log("Redeem code checks passed.");
