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

const mobileHandlerStart = source.indexOf("async function handleMobileTransactionId");
const binanceHandlerStart = source.indexOf("async function handleBinanceOrderId");
const binanceHandlerEnd = source.indexOf("async function findBinancePayTransaction", binanceHandlerStart);
assert.ok(mobileHandlerStart > 0 && binanceHandlerStart > mobileHandlerStart, "mobile payment handler must be present");
assert.ok(binanceHandlerEnd > binanceHandlerStart, "Binance payment handler must be present");
const mobileHandler = source.slice(mobileHandlerStart, binanceHandlerStart);
const binanceHandler = source.slice(binanceHandlerStart, binanceHandlerEnd);
const handlers = `${mobileHandler}\n${binanceHandler}`;

for (const leakedResponse of [
  "Amount mismatch. You entered",
  "This transaction is from",
  "Payment not found yet",
  "This transaction ID was already used.</b>",
]) {
  assert.doesNotMatch(handlers, new RegExp(leakedResponse.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
}

assert.match(mobileHandler, /findFirestorePayment\(env, normalized\)/);
assert.match(mobileHandler, /firestoreClaimExists\(env, normalized\)/);
assert.match(mobileHandler, /createFirestoreClaim\(env, payment, userId, actualAmount\)/);
assert.match(mobileHandler, /finally\s*{\s*await deleteMessageSafely/s);
assert.match(binanceHandler, /findBinancePayTransaction\(env, normalized\)/);
assert.match(binanceHandler, /"payment_not_found"/);
assert.match(binanceHandler, /finally\s*{\s*await deleteMessageSafely/s);
assert.doesNotMatch(binanceHandler, /findFirestorePayment|firestoreClaimExists|createFirestoreClaim/);
for (const provider of ["bkash", "nagad", "rocket", "upay", "binance"]) {
  assert.match(source, new RegExp(`pay_provider:${provider}`), `${provider} must remain in Add Balance`);
}
assert.match(source, /Referrals Bonus: <b>\$\{Number\(referralWallet\.available_bdt \|\| 0\)\.toFixed\(2\)\}<\/b>/);
assert.match(source, /\+100 taka<\/b> per Purchase from refferal/);
assert.doesNotMatch(source, /copy_text\s*:/);
assert.match(source, /<code>\$\{escapeHtml\(payId\)\}<\/code>/);
assert.match(source, /<code>\$\{escapeHtml\(account\)\}<\/code>/);
assert.match(source, /codeVariableNames\.has\(name\)/);
assert.match(source, /\.replaceAll\(placeholder, `<code>\$\{escapedValue\}<\/code>`\)/);
assert.match(source, /\["bkash", "nagad", "upay"\]/);
assert.match(source, /\["pay_id"\]/);
assert.match(source, /\["account"\]/);
assert.doesNotMatch(source, /BINANCE_(?:API|SECRET)_KEY\s*=\s*["'][^"']+/);

console.log("Payment verification privacy checks passed.");
