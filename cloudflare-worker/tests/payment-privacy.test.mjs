import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
const exposed = `${source}\nexport { paymentVerificationRejectionText, paymentVerificationUnavailableText };`;
const worker = await import(`data:text/javascript;base64,${Buffer.from(exposed).toString("base64")}`);

for (const language of ["en", "bn"]) {
  const rejected = worker.paymentVerificationRejectionText(language);
  assert.doesNotMatch(rejected, /Tk\s*[\d,]+|actual amount|transaction is|already used|not found/i);
  assert.match(rejected, /যাচাই করা যায়নি|could not be verified/i);

  const unavailable = worker.paymentVerificationUnavailableText(language);
  assert.doesNotMatch(unavailable, /Firebase|Firestore|Quantum Vault|status\s*\d+/i);
}

const handlerStart = source.indexOf("async function handleTransactionId");
const handlerEnd = source.indexOf("async function showHistory", handlerStart);
assert.ok(handlerStart > 0 && handlerEnd > handlerStart, "payment handler must be present");
const handler = source.slice(handlerStart, handlerEnd);

for (const leakedResponse of [
  "Amount mismatch. You entered",
  "This transaction is from",
  "Payment not found yet",
  "This transaction ID was already used.</b>",
]) {
  assert.doesNotMatch(handler, new RegExp(leakedResponse.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
}

assert.match(handler, /findBinancePayTransaction\(env, normalized\)/);
assert.match(handler, /"payment_not_found"/);
assert.match(handler, /finally\s*{\s*await deleteMessageSafely/s);
assert.doesNotMatch(handler, /findFirestorePayment|firestoreClaimExists|createFirestoreClaim/);
assert.doesNotMatch(source, /BINANCE_(?:API|SECRET)_KEY\s*=\s*["'][^"']+/);

console.log("Payment verification privacy checks passed.");
