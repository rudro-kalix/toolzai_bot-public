import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";

const source = fs.readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
const exposed = `${source}\nexport { findBinancePayTransaction, hmacSha256Hex, normalizePositiveUsdt, binanceUsdtToBalance, money };`;
const worker = await import(`data:text/javascript;base64,${Buffer.from(exposed).toString("base64")}`);

assert.equal(worker.normalizePositiveUsdt("0.55000000"), "0.55");
assert.equal(worker.normalizePositiveUsdt("12"), "12");
assert.equal(worker.normalizePositiveUsdt("-1"), "");
assert.equal(worker.normalizePositiveUsdt("1.123456789"), "");
assert.equal(worker.binanceUsdtToBalance({ BINANCE_USDT_TO_BDT_RATE: "132" }, "0.55"), 72.6);
assert.equal(worker.binanceUsdtToBalance({}, "1"), 121);
assert.equal(worker.binanceUsdtToBalance({ BINANCE_USDT_TO_BDT_RATE: "121" }, "0.001"), 0.12);
assert.equal(worker.money(0.12), "Tk 0.12");
assert.equal(worker.money(505), "Tk 505.00");

const expectedHmac = crypto.createHmac("sha256", "secret").update("message").digest("hex");
assert.equal(await worker.hmacSha256Hex("secret", "message"), expectedHmac);

const originalFetch = globalThis.fetch;
try {
  globalThis.fetch = async (url, init) => {
    const requestUrl = new URL(url);
    assert.equal(requestUrl.origin, "https://api-gcp.binance.com");
    assert.equal(requestUrl.pathname, "/sapi/v1/pay/transactions");
    assert.equal(init.headers["X-MBX-APIKEY"], "read-only-key");
    assert.equal(requestUrl.searchParams.get("limit"), "100");
    assert.match(requestUrl.searchParams.get("signature"), /^[a-f0-9]{64}$/);
    return new Response(JSON.stringify({
      code: "000000",
      success: true,
      data: [{
        orderType: "C2C",
        transactionId: "443329294882152448",
        transactionTime: 1784448000000,
        amount: "0.55000000",
        currency: "USDT",
      }],
    }), { status: 200, headers: { "content-type": "application/json" } });
  };

  const payment = await worker.findBinancePayTransaction({
    BINANCE_API_KEY: "read-only-key",
    BINANCE_SECRET_KEY: "secret",
  }, "443329294882152448");
  assert.deepEqual(payment, {
    transaction_id: "443329294882152448",
    transaction_time: 1784448000000,
    amount_usdt: "0.55",
    order_type: "C2C",
  });
  assert.equal(await worker.findBinancePayTransaction({
    BINANCE_API_KEY: "read-only-key",
    BINANCE_SECRET_KEY: "secret",
  }, "999999999999999999"), null);
} finally {
  globalThis.fetch = originalFetch;
}

console.log("Binance Pay verification checks passed.");
