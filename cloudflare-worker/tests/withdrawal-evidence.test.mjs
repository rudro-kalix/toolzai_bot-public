import assert from "node:assert/strict";
import fs from "node:fs";

const worker = fs.readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");

assert.match(worker, /operation === "withdrawalEvidence"/);
assert.match(worker, /JOIN local_orders AS orders ON orders\.id = rewards\.local_order_id/);
assert.match(worker, /FROM claimed_payments AS payments\s+JOIN referrals/);
assert.match(worker, /payments\.transaction_id/);
assert.match(worker, /referrals\.referrer_id = \?/);

console.log("Withdrawal evidence checks passed.");
