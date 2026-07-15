const MENU = {
  en: {
    products: "🛍️⭐ PRODUCTS ⭐",
    proxy: "🛒⭐ BUY PROXY ⭐",
    balance: "💰 Balance",
    history: "📜 History",
    refer: "🎁 Refer & Earn",
    support: "📞 Contact Support",
  },
  bn: {
    products: "🛍️⭐ পণ্য ⭐",
    proxy: "🛒⭐ প্রক্সি কিনুন ⭐",
    balance: "💰 ব্যালেন্স",
    history: "📜 হিস্ট্রি",
    refer: "🎁 রেফার করুন",
    support: "📞 সাপোর্ট",
  },
};

const VERIFY_COLORS = {
  yellow: { en: "🟡 Yellow", bn: "🟡 হলুদ" },
  red: { en: "🔴 Red", bn: "🔴 লাল" },
  orange: { en: "🟠 Orange", bn: "🟠 কমলা" },
  purple: { en: "🟣 Purple", bn: "🟣 বেগুনি" },
};

const TRANSACTION_FIELDS = ["transactionId", "trxId", "txId", "txnId", "reference", "trxID"];
const AMOUNT_FIELDS = ["amount", "amountBdt", "moneyReceived", "receivedAmount", "total"];
const PROVIDER_FIELDS = ["provider", "title", "name", "sender", "source", "wallet", "message", "text"];
const ELIGIBLE_PROVIDERS = ["bkash", "nagad", "rocket", "upay"];
const PAYMENT_FOUND_CACHE_TTL_SECONDS = 6 * 60 * 60;
const PAYMENT_NOT_FOUND_CACHE_TTL_SECONDS = 20;
const PAYMENT_INVALID_CACHE_TTL_SECONDS = 6 * 60 * 60;
const PAYMENT_ATTEMPT_WINDOW_SECONDS = 5 * 60;
const PAYMENT_ATTEMPT_LIMIT = 6;
const FIREBASE_TOKEN_EARLY_REFRESH_SECONDS = 5 * 60;
const MANAGER_REQUEST_MAX_BYTES = 128 * 1024;
const MENU_DOCUMENT_MAX_CHARS = 64 * 1024;
const MENU_MAX_SCREENS = 12;
const MENU_MAX_BUTTONS = 50;
const MENU_MAX_RESPONSE_CHARS = 3_800;
const MENU_MAX_PRODUCT_BUTTONS = 50;
const REFERRAL_REWARD_BDT = 100;
const ANNOUNCEMENT_BATCH_SIZE = 20;
const ANNOUNCEMENT_MAX_TEXT_CHARS = 3_500;
const SELLER_API_DEFAULT_BASE_URL = "https://www.quantumvault.me/api/v1";
const SELLER_API_DEFAULT_ENDPOINTS = Object.freeze({
  balance: "/balance",
  products: "/products",
  product: "/products/{productKey}",
  purchase: "/purchase",
  orders: "/orders",
});
const SELLER_API_DEFAULT_MAPPING = Object.freeze({
  products: "products",
  product: "product",
  order: "order",
  productKey: "productKey",
  productName: "name",
  productDescription: "description",
  productWarranty: "warranty",
  productPrice: "price",
  productStock: "stock",
  productInStock: "inStock",
  variants: "variants",
  variantKey: "key",
  variantName: "name",
  variantPrice: "price",
  variantStock: "stock",
  variantInStock: "inStock",
  requestProductKey: "productKey",
  requestVariantKey: "variantKey",
  requestQuantity: "quantity",
  orderId: "orderId,id",
  orderRequested: "requested",
  orderFulfilled: "fulfilled",
  orderItems: "items",
  itemOrderId: "orderId,id",
  itemFields: "fields",
  itemData: "data",
  fieldName: "name",
  fieldLabel: "label",
  fieldValue: "value",
  errorMessage: "message,error",
});

const MENU_RESPONSE_DEFINITIONS = Object.freeze({
  main_menu: {
    label: "Main menu message",
    setting: "menu_hint",
    variables: [],
    en: "🏠 Main Menu\n\nChoose what you want to do below 👇",
    bn: "🏠 মূল মেনু\n\nআপনি কী করতে চান, নিচের বাটন থেকে বেছে নিন 👇",
  },
  products: {
    label: "Products list",
    setting: "products",
    variables: ["balance"],
    en: "🛍️ Products\n━━━━━━━━━━━━━━━━━━━━\n💵 Your Balance: {{balance}}\n\n👇 Tap a product to buy:",
    bn: "🛍️ প্রোডাক্ট\n━━━━━━━━━━━━━━━━━━━━\n💵 আপনার ব্যালেন্স: {{balance}}\n\n👇 কিনতে একটি পণ্য সিলেক্ট করুন:",
  },
  product_detail: {
    label: "Product details",
    setting: "product_detail",
    variables: ["product_name", "description", "warranty", "price", "stock", "balance"],
    en: "✦ {{product_name}}\n\n{{description}}\n\n🧯 Warranty: {{warranty}}\n\n💵 Price: {{price}}\n📦 Available: {{stock}}\n💰 Your balance: {{balance}}",
    bn: "✦ {{product_name}}\n\n{{description}}\n\n🧯 ওয়ারেন্টি: {{warranty}}\n\n💵 মূল্য: {{price}}\n📦 স্টক: {{stock}}\n💰 আপনার ব্যালেন্স: {{balance}}",
  },
  balance: {
    label: "Balance menu",
    setting: "balance_menu",
    variables: ["balance"],
    en: "💰 Balance\n\n💵 Your balance: {{balance}}\n\n👇 Choose an option:",
    bn: "💰 ব্যালেন্স\n\n💵 আপনার ব্যালেন্স: {{balance}}\n\n👇 একটি অপশন বাছুন:",
  },
  balance_value: {
    label: "View balance result",
    setting: "balance_value",
    variables: ["balance"],
    en: "💵 Your balance: {{balance}}",
    bn: "💵 আপনার ব্যালেন্স: {{balance}}",
  },
  payment_intro: {
    label: "Add balance instructions",
    setting: "payment_intro",
    variables: ["bkash", "nagad", "upay"],
    en: "➕ Add Balance\n\nAvailable payment options:\n\n• bKash: {{bkash}} (Send Money)\n• Nagad: {{nagad}} (Send Money)\n• Rocket: temporarily unavailable\n• Upay: {{upay}} (Send Money)\n\nAll are personal accounts.\n\nChoose your payment method:",
    bn: "➕ ব্যালেন্স যোগ করুন\n\nপেমেন্ট অপশন:\n\n• bKash: {{bkash}} (Send Money)\n• Nagad: {{nagad}} (Send Money)\n• Rocket: সাময়িকভাবে বন্ধ\n• Upay: {{upay}} (Send Money)\n\nপেমেন্ট পদ্ধতি বাছুন:",
  },
  payment_provider: {
    label: "Payment provider prompt",
    setting: "payment_provider",
    variables: ["provider", "account"],
    en: "💳 {{provider}}\n\nSend Money to: {{account}}\nAccount type: Personal\n\nSend the payment amount in BDT.\nExample: 500",
    bn: "💳 {{provider}}\n\nSend Money করুন: {{account}}\nAccount type: Personal\n\nBDT-তে পেমেন্ট এমাউন্ট লিখুন।\nউদাহরণ: 500",
  },
  history: {
    label: "Purchase history",
    setting: "history",
    variables: ["total_orders", "total_spent", "history_lines"],
    en: "📜 Your Purchase History\n🧾 Total orders: {{total_orders}}\n💵 Total spent: {{total_spent}}\n\n{{history_lines}}",
    bn: "📜 আপনার ক্রয় ইতিহাস\n🧾 মোট অর্ডার: {{total_orders}}\n💵 মোট খরচ: {{total_spent}}\n\n{{history_lines}}",
  },
  refer: {
    label: "Referral details",
    setting: "refer",
    variables: ["referral_link", "referral_count", "purchase_count", "total_earned", "available_balance", "pending_withdrawal", "referral_lines", "withdrawal_lines"],
    en: "🎁 Refer & Earn\n\nEarn Tk 100 every time one of your referred users completes a purchase.\n\n🔗 Your link:\n{{referral_link}}\n\n👥 Referred users: {{referral_count}}\n🛍️ Their purchases: {{purchase_count}}\n💰 Total earned: {{total_earned}}\n✅ Available to withdraw: {{available_balance}}\n⏳ Pending withdrawal: {{pending_withdrawal}}\n\nReferral activity:\n{{referral_lines}}\n\nRecent withdrawals:\n{{withdrawal_lines}}",
    bn: "🎁 রেফার করে আয় করুন\n\nআপনার রেফার করা user প্রতিবার purchase সম্পন্ন করলে আপনি Tk 100 পাবেন।\n\n🔗 আপনার লিংক:\n{{referral_link}}\n\n👥 রেফার করা user: {{referral_count}}\n🛍️ তাদের purchase: {{purchase_count}}\n💰 মোট আয়: {{total_earned}}\n✅ Withdraw করা যাবে: {{available_balance}}\n⏳ Pending withdraw: {{pending_withdrawal}}\n\nReferral activity:\n{{referral_lines}}\n\nসাম্প্রতিক withdrawal:\n{{withdrawal_lines}}",
  },
  referral_terms: {
    label: "Referral guide and terms",
    setting: "referral_terms",
    variables: [],
    en: "📘 REFERRAL GUIDE AND TERMS\n\nHOW TO EARN\n1. Open 🎁 Refer and Earn and copy your personal link.\n2. Your friend must open the bot for the first time through that exact link.\n3. When that referred user completes a paid purchase, Tk 100 is added to your referral wallet.\n4. Every separate completed order earns Tk 100. Registration, verification, adding balance, cancelled or failed orders do not earn a reward.\n\nTRACKING\n• The first valid referral link used for an account determines its referrer.\n• The dashboard shows referred users, their completed-order count, your reward and withdrawal history.\n• A bulk order recorded as one completed order earns one Tk 100 reward.\n\nWITHDRAWAL\n• You may request any whole-Taka amount from your available referral balance.\n• Enter a valid 11-digit bKash number and check it carefully.\n• A requested amount is reserved while pending. Admin reviews the bot records before marking it paid or rejected.\n• If rejected, the reserved amount becomes available again. Processing time can vary because each request is reviewed.\n\nFAIR USE AND PRIVACY\n• Self-referral, fake or duplicate accounts, purchase manipulation, spam and other abuse are prohibited. A suspicious request may be investigated, rejected or the account may be restricted.\n• Bot order, referral and withdrawal records are used to settle reward calculations.\n• Referrers can see the referred user name or username, completed-purchase count and earned reward. Payment transaction IDs and bKash details are not shown to referrers. Admin receives the information needed to review a withdrawal.\n\nHELP AND ACCEPTANCE\n• For a missing reward or withdrawal issue, contact support with your Telegram ID and withdrawal ID.\n• By using Refer and Earn, you accept these rules. The program or reward rate may change for future activity; important changes will be announced.",
    bn: "📘 রেফারেল নির্দেশিকা ও শর্তাবলি\n\nকীভাবে আয় করবেন\n১. 🎁 Refer & Earn খুলে আপনার ব্যক্তিগত রেফারেল লিংক কপি করুন।\n২. নতুন ব্যবহারকারীকে প্রথমবার ওই লিংক দিয়েই বট চালু করতে হবে।\n৩. রেফার করা ব্যবহারকারী একটি পেইড অর্ডার সফলভাবে সম্পন্ন করলে আপনার রেফারেল ওয়ালেটে ১০০ টাকা যোগ হবে।\n৪. প্রতিটি আলাদা completed order-এর জন্য ১০০ টাকা পাবেন। শুধু রেজিস্ট্রেশন, ভেরিফিকেশন, ব্যালেন্স যোগ করা, বাতিল বা ব্যর্থ অর্ডারে কোনো আয় হবে না।\n\nহিসাব ও ড্যাশবোর্ড\n• একটি অ্যাকাউন্ট প্রথম যে বৈধ রেফারেল লিংকে যুক্ত হবে, সেটিই তার রেফারার হিসেবে থাকবে।\n• ড্যাশবোর্ডে রেফার করা ব্যবহারকারী, তাদের completed order-এর সংখ্যা, আপনার আয় ও withdrawal history দেখা যাবে।\n• একটি bulk order সিস্টেমে একটি completed order হিসেবে রেকর্ড হলে তার reward একবারই ১০০ টাকা হবে।\n\nউইথড্র নিয়ম\n• Available referral balance থেকে যেকোনো পূর্ণ টাকার amount withdraw request করতে পারবেন।\n• সঠিক ১১ সংখ্যার bKash নম্বর দিন এবং সাবমিটের আগে ভালোভাবে মিলিয়ে নিন।\n• Request pending থাকলে ওই টাকা সাময়িকভাবে reserve থাকবে। Admin বটের রেকর্ড যাচাই করে Paid অথবা Rejected করবেন।\n• Rejected হলে reserve করা টাকা আবার available balance-এ ফিরবে। প্রতিটি request যাচাই হয়, তাই processing time ভিন্ন হতে পারে।\n\nসঠিক ব্যবহার ও গোপনীয়তা\n• Self-referral, ভুয়া বা duplicate account, purchase manipulation, spam বা অন্য কোনো অপব্যবহার নিষিদ্ধ। সন্দেহজনক request তদন্ত, reject বা account restriction-এর আওতায় আসতে পারে।\n• Reward হিসাবের ক্ষেত্রে বটের order, referral ও withdrawal record চূড়ান্ত রেকর্ড হিসেবে ধরা হবে।\n• Referrer শুধু referred user-এর নাম/username, completed purchase count ও earned reward দেখবেন। Payment transaction ID বা bKash তথ্য referrer-কে দেখানো হবে না। Withdrawal যাচাইয়ের প্রয়োজনীয় তথ্য শুধু admin পাবেন।\n\nসহায়তা ও সম্মতি\n• Reward না এলে বা withdrawal সমস্যা হলে Telegram ID এবং withdrawal ID দিয়ে Support-এ যোগাযোগ করুন।\n• Refer & Earn ব্যবহার করলে আপনি এই নিয়মগুলো মেনে নিচ্ছেন। ভবিষ্যৎ activity-এর জন্য program বা reward rate পরিবর্তন হতে পারে; গুরুত্বপূর্ণ পরিবর্তন announcement-এ জানানো হবে।",
  },
  support: {
    label: "Support message",
    setting: "support",
    variables: [],
    en: "📞 Need help? Contact support:",
    bn: "📞 সাহায্য প্রয়োজন? সাপোর্টে যোগাযোগ করুন:",
  },
  proxy: {
    label: "Proxy notice",
    setting: "proxy_unavailable",
    variables: [],
    en: "🛒 Proxy buying is currently unavailable. Use Products to buy available stock.",
    bn: "🛒 প্রক্সি কেনা বর্তমানে বন্ধ আছে। উপলব্ধ পণ্য কিনতে Products ব্যবহার করুন।",
  },
});

let firebaseTokenCache = null;

const PAYMENT_ACCOUNTS = {
  bkash: "",
  nagad: "",
  upay: "",
};

const ACTIVE_PAYMENT_PROVIDERS = ["bkash", "nagad", "upay"];

const BOT_SETTING_RULES = Object.freeze({
  welcome_en: "text", welcome_bn: "text",
  join_required_en: "text", join_required_bn: "text",
  support_en: "text", support_bn: "text",
  menu_hint_en: "text", menu_hint_bn: "text",
  proxy_unavailable_en: "text", proxy_unavailable_bn: "text",
  payment_intro_en: "text", payment_intro_bn: "text",
  products_en: "text", products_bn: "text",
  product_detail_en: "text", product_detail_bn: "text",
  balance_menu_en: "text", balance_menu_bn: "text",
  balance_value_en: "text", balance_value_bn: "text",
  payment_provider_en: "text", payment_provider_bn: "text",
  history_en: "text", history_bn: "text",
  refer_en: "text", refer_bn: "text",
  referral_terms_en: "long_text", referral_terms_bn: "long_text",
  support_url: "telegram_url",
  payment_bkash: "phone", payment_nagad: "phone", payment_upay: "phone",
});

const MENU_ACTIONS = new Set([
  "products", "proxy", "balance", "history", "refer", "support",
  "message", "url", "screen", "main_menu",
]);

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  },
  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(processAnnouncementQueue(env));
  },
};

async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/") {
    return json({ ok: true, service: "toolzai-telegram-bot" });
  }

  if (request.method === "GET" && url.pathname === "/health/firestore") {
    try {
      await firestoreHealthCheck(env);
      return json({ ok: true, service: "firestore-private" });
    } catch (error) {
      console.error(JSON.stringify({ event: "firestore_health_failed", error: error?.message || String(error) }));
      return json({ ok: false, service: "firestore-private" }, 503);
    }
  }

  if (request.method === "POST" && url.pathname === "/manager/d1") {
    return handleManagerRequest(request, env, ctx);
  }

  if (request.method === "POST" && url.pathname === webhookPath(env)) {
    const expectedSecret = env.TELEGRAM_SECRET_TOKEN || env.WEBHOOK_SECRET;
    const actualSecret = request.headers.get("x-telegram-bot-api-secret-token");
    if (expectedSecret && actualSecret !== expectedSecret) {
      return json({ ok: false, error: "unauthorized" }, 401);
    }

    const update = await request.json();
    const processing = handleUpdate(update, env).catch((error) => {
      console.error(JSON.stringify({
        event: "telegram_update_failed",
        update_id: update.update_id || null,
        error: error?.message || String(error),
      }));
    });
    if (ctx) ctx.waitUntil(processing);
    else await processing;
    return json({ ok: true });
  }

  return json({ ok: false, error: "not_found" }, 404);
}

async function handleManagerRequest(request, env, ctx) {
  if (!env.MANAGER_API_SECRET) return json({ ok: false, error: "manager_not_configured" }, 503);
  const authorization = request.headers.get("authorization") || "";
  const supplied = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!(await secureEqual(supplied, env.MANAGER_API_SECRET))) {
    return json({ ok: false, error: "unauthorized" }, 401);
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (!Number.isFinite(contentLength) || contentLength < 1 || contentLength > MANAGER_REQUEST_MAX_BYTES) {
    return json({ ok: false, error: "invalid_request_size" }, 413);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  try {
    const result = await runManagerOperation(env, payload, ctx);
    return json({ ok: true, ...result });
  } catch (error) {
    console.error(JSON.stringify({ event: "manager_operation_failed", operation: payload?.operation || null, error: error?.message || String(error) }));
    const safeError = safeManagerError(error);
    const status = safeError === "stale_menu_draft" || safeError === "withdrawal_already_reviewed"
      ? 409
      : safeError === "seller_test_unauthorized"
        ? 401
        : safeError.startsWith("menu_") || safeError.startsWith("invalid_") || safeError.startsWith("seller_") || safeError === "withdrawal_not_found"
        ? 400
        : 500;
    return json({ ok: false, error: safeError }, status);
  }
}

async function runManagerOperation(env, payload, ctx = null) {
  const operation = String(payload?.operation || "");

  if (operation === "sellerApiConfig") {
    return { rows: [publicSellerApiConfig(await loadSellerApiConfig(env))], changes: 0 };
  }

  if (operation === "sellerCatalog") {
    const catalog = await qvRequest(env, "GET", "/products");
    return { rows: catalog.products || [], changes: 0 };
  }

  if (operation === "testSellerApi") {
    const catalog = await qvRequest(env, "GET", "/products");
    return {
      rows: [{
        product_count: (catalog.products || []).length,
        sample_products: (catalog.products || []).slice(0, 3).map((product) => ({
          productKey: product.productKey,
          name: product.name,
        })),
      }],
      changes: 0,
    };
  }

  if (operation === "updateSellerApiConfig") {
    const current = await loadSellerApiConfig(env);
    const suppliedApiKey = String(payload?.apiKey || "").trim();
    const candidate = validateSellerApiConfig(payload?.config, {
      ...current,
      apiKey: suppliedApiKey || current.apiKey,
    });
    if (!candidate.apiKey) throw new Error("seller_api_key_required");

    let catalog;
    try {
      catalog = await qvRequest(env, "GET", "/products", null, candidate);
    } catch (error) {
      console.warn(JSON.stringify({
        event: "seller_config_test_failed",
        status: Number(error?.status || 0),
        reason: error?.code || "request_failed",
      }));
      throw new Error(Number(error?.status) === 401 ? "seller_test_unauthorized" : "seller_test_failed");
    }

    const encryptedApiKey = suppliedApiKey
      ? await encryptSellerApiKey(suppliedApiKey, sellerEncryptionSecret(env))
      : current.encryptedApiKey || null;
    await env.DB.prepare(`INSERT INTO seller_api_config
      (id, provider_name, base_url, auth_header, auth_prefix, endpoints_json, mapping_json, encrypted_api_key, updated_by, updated_at)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, 'manager', CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET provider_name = excluded.provider_name, base_url = excluded.base_url,
        auth_header = excluded.auth_header, auth_prefix = excluded.auth_prefix,
        endpoints_json = excluded.endpoints_json, mapping_json = excluded.mapping_json,
        encrypted_api_key = COALESCE(excluded.encrypted_api_key, seller_api_config.encrypted_api_key),
        updated_by = excluded.updated_by, updated_at = CURRENT_TIMESTAMP`)
      .bind(
        candidate.providerName,
        candidate.baseUrl,
        candidate.authHeader,
        candidate.authPrefix,
        JSON.stringify(candidate.endpoints),
        JSON.stringify(candidate.mapping),
        encryptedApiKey,
      ).run();
    return {
      rows: [{
        ...publicSellerApiConfig({ ...candidate, encryptedApiKey, apiKeySource: encryptedApiKey ? "manager" : current.apiKeySource }),
        product_count: (catalog.products || []).length,
      }],
      changes: 1,
    };
  }

  const reads = {
    overview: `SELECT
      (SELECT COUNT(*) FROM users) AS users,
      (SELECT COALESCE(SUM(balance_bdt), 0) FROM users) AS balances,
      (SELECT COUNT(*) FROM claimed_payments) AS payments,
      (SELECT COALESCE(SUM(amount_bdt), 0) FROM claimed_payments) AS payment_total,
      (SELECT COUNT(*) FROM local_orders) AS orders,
      (SELECT COALESCE(SUM(charged_bdt), 0) FROM local_orders) AS charged,
      (SELECT COUNT(*) FROM referrals WHERE status = 'completed') AS referrals,
      (SELECT COALESCE(SUM(reward_bdt), 0) FROM referral_rewards) AS referral_rewards,
      (SELECT COUNT(*) FROM referral_withdrawals WHERE status = 'pending') AS pending_withdrawals`,
    users: "SELECT telegram_id, username, first_name, last_name, balance_bdt, language, human_verified, created_at FROM users ORDER BY created_at DESC LIMIT 100",
    payments: "SELECT transaction_id, telegram_id, amount_bdt, provider, claimed_at FROM claimed_payments ORDER BY claimed_at DESC LIMIT 100",
    orders: "SELECT id, telegram_id, product_key, variant_key, quantity, charged_bdt, provider_order_id, created_at FROM local_orders ORDER BY id DESC LIMIT 100",
    referrals: `SELECT referrals.referred_id, referrals.referrer_id, referrals.status, referrals.created_at, referrals.completed_at,
      referred.username AS referred_username, referred.first_name AS referred_first_name, referred.last_name AS referred_last_name,
      referrer.username AS referrer_username, referrer.first_name AS referrer_first_name, referrer.last_name AS referrer_last_name,
      COUNT(referral_rewards.id) AS purchase_count, COALESCE(SUM(referral_rewards.reward_bdt), 0) AS earned_bdt
      FROM referrals
      LEFT JOIN users AS referred ON referred.telegram_id = referrals.referred_id
      LEFT JOIN users AS referrer ON referrer.telegram_id = referrals.referrer_id
      LEFT JOIN referral_rewards ON referral_rewards.referred_id = referrals.referred_id
      GROUP BY referrals.referred_id
      ORDER BY referrals.created_at DESC LIMIT 100`,
    referralSummary: `SELECT
      (SELECT COUNT(*) FROM referrals WHERE status = 'completed') AS referred_users,
      (SELECT COUNT(*) FROM referral_rewards) AS rewarded_purchases,
      (SELECT COALESCE(SUM(reward_bdt), 0) FROM referral_rewards) AS rewards_bdt,
      (SELECT COUNT(*) FROM referral_withdrawals WHERE status = 'pending') AS pending_withdrawals,
      (SELECT COALESCE(SUM(amount_bdt), 0) FROM referral_withdrawals WHERE status = 'pending') AS pending_bdt,
      (SELECT COALESCE(SUM(amount_bdt), 0) FROM referral_withdrawals WHERE status = 'paid') AS paid_bdt`,
    withdrawals: `SELECT withdrawals.id, withdrawals.telegram_id, withdrawals.amount_bdt, withdrawals.bkash_number,
      withdrawals.status, withdrawals.admin_note, withdrawals.created_at, withdrawals.reviewed_at, withdrawals.reviewed_by,
      users.username, users.first_name, users.last_name,
      (SELECT COUNT(*) FROM referrals WHERE referrer_id = withdrawals.telegram_id AND status = 'completed') AS referral_count,
      (SELECT COUNT(*) FROM referral_rewards WHERE referrer_id = withdrawals.telegram_id) AS purchase_count,
      (SELECT COALESCE(SUM(reward_bdt), 0) FROM referral_rewards WHERE referrer_id = withdrawals.telegram_id) AS total_earned_bdt
      FROM referral_withdrawals AS withdrawals
      LEFT JOIN users ON users.telegram_id = withdrawals.telegram_id
      ORDER BY CASE withdrawals.status WHEN 'pending' THEN 0 ELSE 1 END, withdrawals.created_at DESC LIMIT 100`,
    announcements: `SELECT id, message_text, button_label, button_url, status, recipient_count, delivered_count,
      failed_count, created_at, started_at, completed_at FROM announcement_campaigns ORDER BY created_at DESC LIMIT 50`,
    prices: "SELECT product_key, variant_key, price_bdt, updated_at FROM product_prices ORDER BY product_key, variant_key",
  };

  if (reads[operation]) {
    const query = await env.DB.prepare(reads[operation]).all();
    return { rows: query.results || [], changes: 0 };
  }

  if (operation === "syncProfiles") {
    if (!env.TELEGRAM_BOT_TOKEN) throw new Error("telegram_not_configured");
    const users = await env.DB.prepare("SELECT telegram_id FROM users ORDER BY updated_at DESC LIMIT 100").all();
    let changes = 0;
    for (const user of users.results || []) {
      const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/getChat?chat_id=${encodeURIComponent(user.telegram_id)}`);
      if (!response.ok) continue;
      const telegram = await response.json();
      if (!telegram?.ok || !telegram.result) continue;
      const profile = telegram.result;
      const result = await env.DB.prepare("UPDATE users SET username = ?, first_name = ?, last_name = ?, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = ?")
        .bind(cleanProfileField(profile.username), cleanProfileField(profile.first_name), cleanProfileField(profile.last_name), user.telegram_id)
        .run();
      changes += Number(result.meta?.changes || 0);
    }
    return { rows: [], changes };
  }

  if (operation === "createAnnouncement") {
    const messageText = String(payload?.messageText || "").trim();
    const buttonLabel = String(payload?.buttonLabel || "").trim();
    const buttonUrl = String(payload?.buttonUrl || "").trim();
    if (!messageText || messageText.length > ANNOUNCEMENT_MAX_TEXT_CHARS) throw new Error("invalid_announcement_text");
    if ((buttonLabel && !buttonUrl) || (!buttonLabel && buttonUrl) || buttonLabel.length > 64) throw new Error("invalid_announcement_button");
    if (buttonUrl && !/^https:\/\/[A-Za-z0-9.-]+(?:\/[^\s]*)?$/.test(buttonUrl)) throw new Error("invalid_announcement_url");
    const campaignId = crypto.randomUUID();
    const count = await env.DB.prepare("SELECT COUNT(*) AS n FROM users").first();
    const recipientCount = Number(count?.n || 0);
    await env.DB.batch([
      env.DB.prepare(`INSERT INTO announcement_campaigns
        (id, message_text, button_label, button_url, status, recipient_count)
        VALUES (?, ?, ?, ?, 'queued', ?)`)
        .bind(campaignId, messageText, buttonLabel || null, buttonUrl || null, recipientCount),
      env.DB.prepare(`INSERT INTO announcement_deliveries (campaign_id, telegram_id)
        SELECT ?, telegram_id FROM users`).bind(campaignId),
    ]);
    const processing = processAnnouncementQueue(env);
    if (ctx) ctx.waitUntil(processing);
    else await processing;
    return { rows: [{ id: campaignId, status: "queued", recipient_count: recipientCount }], changes: recipientCount + 1 };
  }

  if (operation === "updateWithdrawalStatus") {
    const withdrawalId = String(payload?.withdrawalId || "");
    const status = String(payload?.status || "");
    const note = String(payload?.note || "").trim().slice(0, 300);
    if (!/^[0-9a-f-]{36}$/i.test(withdrawalId) || !["paid", "rejected"].includes(status)) throw new Error("invalid_withdrawal_update");
    const withdrawal = await env.DB.prepare("SELECT id, telegram_id, amount_bdt, bkash_number, status FROM referral_withdrawals WHERE id = ?")
      .bind(withdrawalId).first();
    if (!withdrawal) throw new Error("withdrawal_not_found");
    if (withdrawal.status !== "pending") throw new Error("withdrawal_already_reviewed");
    const result = await env.DB.prepare(`UPDATE referral_withdrawals SET status = ?, admin_note = ?, reviewed_at = CURRENT_TIMESTAMP,
      reviewed_by = 'manager' WHERE id = ? AND status = 'pending'`).bind(status, note, withdrawalId).run();
    if (Number(result.meta?.changes || 0) !== 1) throw new Error("withdrawal_already_reviewed");
    const notification = status === "paid"
      ? `✅ <b>Referral withdrawal paid</b>\n\nAmount: <b>${money(withdrawal.amount_bdt)}</b>\nbKash: <code>${escapeHtml(withdrawal.bkash_number)}</code>\nRequest: <code>${escapeHtml(withdrawalId)}</code>${note ? `\nNote: ${escapeHtml(note)}` : ""}`
      : `❌ <b>Referral withdrawal rejected</b>\n\nAmount: <b>${money(withdrawal.amount_bdt)}</b>\nRequest: <code>${escapeHtml(withdrawalId)}</code>${note ? `\nReason: ${escapeHtml(note)}` : ""}\n\nThe amount is available to request again.`;
    const notifying = sendMessage(env, withdrawal.telegram_id, notification).catch((error) => {
      console.warn(JSON.stringify({ event: "withdrawal_status_notification_failed", withdrawal_id: withdrawalId, error: error?.message || String(error) }));
    });
    if (ctx) ctx.waitUntil(notifying);
    else await notifying;
    return { rows: [{ id: withdrawalId, status }], changes: 1 };
  }

  if (operation === "botSettings") {
    const query = await env.DB.prepare("SELECT key, value, updated_at FROM bot_settings ORDER BY key").all();
    return { rows: query.results || [], changes: 0 };
  }

  if (operation === "updateBotSettings") {
    const settings = payload?.settings;
    if (!settings || typeof settings !== "object" || Array.isArray(settings)) throw new Error("invalid_settings");
    const entries = Object.entries(settings);
    if (!entries.length || entries.length > Object.keys(BOT_SETTING_RULES).length) throw new Error("invalid_settings_count");
    const statements = [];
    for (const [key, rawValue] of entries) {
      const rule = BOT_SETTING_RULES[key];
      const value = String(rawValue ?? "").trim();
      if (!rule || !validBotSetting(rule, value)) throw new Error(`invalid_setting_${key}`);
      statements.push(env.DB.prepare(`INSERT INTO bot_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`).bind(key, value));
    }
    const results = await env.DB.batch(statements);
    return { rows: [], changes: results.reduce((total, result) => total + Number(result.meta?.changes || 0), 0) };
  }

  if (operation === "menuStudio") {
    const [draftResult, stateResult, versionsResult, legacyResult, settingsResult] = await env.DB.batch([
      env.DB.prepare("SELECT revision, menu_json, updated_at FROM bot_menu_drafts WHERE id = 1"),
      env.DB.prepare(`SELECT s.active_version_id, s.updated_at AS published_at, v.revision AS published_revision
        FROM bot_menu_state s LEFT JOIN bot_menu_versions v ON v.id = s.active_version_id WHERE s.id = 1`),
      env.DB.prepare("SELECT id, revision, note, created_at FROM bot_menu_versions ORDER BY created_at DESC LIMIT 20"),
      env.DB.prepare("SELECT id, parent_id, label_en, label_bn, action_type, action_value, sort_order FROM bot_menu_buttons ORDER BY parent_id, sort_order, id"),
      env.DB.prepare("SELECT key, value FROM bot_settings"),
    ]);
    const draft = draftResult.results?.[0] || null;
    const state = stateResult.results?.[0] || null;
    let menu = draft ? parseStoredMenu(draft.menu_json) : defaultMenuDocument(legacyResult.results || []);
    if (!draft || !storedMenuHasResponses(draft.menu_json)) {
      menu = hydrateMenuResponses(menu, settingsResult.results || []);
    }
    let productCatalog = [];
    try {
      const payload = await qvRequest(env, "GET", "/products");
      productCatalog = (payload.products || []).slice(0, MENU_MAX_PRODUCT_BUTTONS);
      menu = hydrateProductButtons(menu, productCatalog);
    } catch (error) {
      console.warn(JSON.stringify({ event: "menu_studio_catalog_load_failed", error: error?.message || String(error) }));
    }
    return {
      rows: [{
        draft_json: JSON.stringify(menu),
        draft_revision: Number(draft?.revision || 0),
        draft_updated_at: draft?.updated_at || null,
        active_version_id: state?.active_version_id || null,
        published_revision: Number(state?.published_revision || 0),
        published_at: state?.published_at || null,
        versions_json: JSON.stringify(versionsResult.results || []),
        response_catalog_json: JSON.stringify(menuResponseCatalog()),
        product_catalog_json: JSON.stringify(productCatalog.map((product) => ({
          product_key: normalizePriceKey(product.productKey),
          name: String(product.name || product.productKey || ""),
          stock: productStock(product),
        })).filter((product) => product.product_key)),
      }],
      changes: 0,
    };
  }

  if (operation === "saveMenuDraft") {
    const expectedRevision = Number(payload?.expectedRevision || 0);
    if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 0) throw new Error("menu_invalid_revision");
    const menu = validateMenuDocument(payload?.menu);
    const current = await env.DB.prepare("SELECT revision FROM bot_menu_drafts WHERE id = 1").first();
    const currentRevision = Number(current?.revision || 0);
    if (currentRevision !== expectedRevision) throw new Error("stale_menu_draft");
    const nextRevision = currentRevision + 1;
    await env.DB.prepare(`INSERT INTO bot_menu_drafts (id, revision, menu_json, updated_by, updated_at)
      VALUES (1, ?, ?, 'manager', CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET revision = excluded.revision, menu_json = excluded.menu_json,
        updated_by = excluded.updated_by, updated_at = CURRENT_TIMESTAMP`)
      .bind(nextRevision, JSON.stringify(menu)).run();
    return { rows: [{ revision: nextRevision, updated_at: new Date().toISOString() }], changes: 1 };
  }

  if (operation === "publishMenuDraft") {
    const expectedRevision = Number(payload?.expectedRevision || 0);
    const draft = await env.DB.prepare("SELECT revision, menu_json FROM bot_menu_drafts WHERE id = 1").first();
    if (!draft || Number(draft.revision) !== expectedRevision) throw new Error("stale_menu_draft");
    const menu = validateMenuDocument(parseStoredMenu(draft.menu_json));
    const versionId = crypto.randomUUID();
    const note = String(payload?.note || "Published from menu studio").trim().slice(0, 120);
    await env.DB.batch([
      env.DB.prepare("INSERT INTO bot_menu_versions (id, revision, menu_json, note, created_by) VALUES (?, ?, ?, ?, 'manager')")
        .bind(versionId, expectedRevision, JSON.stringify(menu), note),
      env.DB.prepare(`INSERT INTO bot_menu_state (id, active_version_id, updated_at) VALUES (1, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET active_version_id = excluded.active_version_id, updated_at = CURRENT_TIMESTAMP`).bind(versionId),
      env.DB.prepare("INSERT INTO bot_menu_audit (event_type, version_id, revision, actor) VALUES ('publish', ?, ?, 'manager')")
        .bind(versionId, expectedRevision),
      ...menuSettingsStatements(env, menu),
    ]);
    return { rows: [{ id: versionId, revision: expectedRevision, note, created_at: new Date().toISOString() }], changes: 1 };
  }

  if (operation === "rollbackMenuVersion") {
    const versionId = String(payload?.versionId || "");
    if (!/^[0-9a-f-]{36}$/i.test(versionId)) throw new Error("menu_invalid_version");
    const version = await env.DB.prepare("SELECT id, revision, menu_json, note FROM bot_menu_versions WHERE id = ?").bind(versionId).first();
    if (!version) throw new Error("menu_version_not_found");
    const menu = validateMenuDocument(parseStoredMenu(version.menu_json));
    const current = await env.DB.prepare("SELECT revision FROM bot_menu_drafts WHERE id = 1").first();
    const nextRevision = Number(current?.revision || 0) + 1;
    await env.DB.batch([
      env.DB.prepare(`INSERT INTO bot_menu_drafts (id, revision, menu_json, updated_by, updated_at)
        VALUES (1, ?, ?, 'manager', CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET revision = excluded.revision, menu_json = excluded.menu_json,
          updated_by = excluded.updated_by, updated_at = CURRENT_TIMESTAMP`).bind(nextRevision, JSON.stringify(menu)),
      env.DB.prepare(`INSERT INTO bot_menu_state (id, active_version_id, updated_at) VALUES (1, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET active_version_id = excluded.active_version_id, updated_at = CURRENT_TIMESTAMP`).bind(versionId),
      env.DB.prepare("INSERT INTO bot_menu_audit (event_type, version_id, revision, actor) VALUES ('rollback', ?, ?, 'manager')")
        .bind(versionId, nextRevision),
      ...menuSettingsStatements(env, menu),
    ]);
    return { rows: [{ id: versionId, revision: nextRevision, menu_json: JSON.stringify(menu), note: version.note }], changes: 1 };
  }

  if (operation === "testMenuDraft") {
    if (!env.TELEGRAM_BOT_TOKEN) throw new Error("menu_telegram_not_configured");
    const menu = validateMenuDocument(payload?.menu);
    const language = payload?.language === "bn" ? "bn" : "en";
    const screenId = String(payload?.screenId || "main");
    const screen = menu.screens.find((item) => item.id === screenId) || menu.screens.find((item) => item.id === "main");
    const adminId = csv(env.ADMIN_IDS)[0];
    if (!adminId) throw new Error("menu_admin_not_configured");
    const previewAction = String(payload?.action || "");
    if (previewAction) {
      const preview = await buildMenuActionPreview(env, menu, {
        language,
        action: previewAction,
        value: String(payload?.value || ""),
        callbackData: String(payload?.callbackData || ""),
      });
      const extra = {};
      if (preview.keyboard_type === "inline" && preview.keyboard.length) {
        extra.reply_markup = {
          inline_keyboard: preview.keyboard.map((row) => row.map((button) => {
            if (button.kind === "url") return { text: button.label, url: button.value };
            if (button.kind === "callback") return { text: button.label, callback_data: button.value };
            return { text: button.label, callback_data: "preview_disabled" };
          })),
        };
      } else if (preview.keyboard_type === "reply") {
        extra.reply_markup = keyboardForMenuScreen(menu, preview.screen_id || screen.id, language);
      }
      await sendMessage(env, adminId, `🧪 <b>Menu Studio test</b>\n\n${escapeHtml(preview.text || "Preview")}`, extra);
      return { rows: [{ delivered: true, screen_id: preview.screen_id || screen.id, template_key: preview.template_key }], changes: 0 };
    }
    const title = language === "bn" ? screen.title_bn : screen.title_en;
    await sendMessage(env, adminId, `🧪 <b>Menu Studio test</b>\n\n${escapeHtml(title || "Preview")}`, {
      reply_markup: keyboardForMenuScreen(menu, screen.id, language),
    });
    return { rows: [{ delivered: true, screen_id: screen.id }], changes: 0 };
  }

  if (operation === "previewMenuAction") {
    const menu = validateMenuDocument(payload?.menu);
    const language = payload?.language === "bn" ? "bn" : "en";
    const preview = await buildMenuActionPreview(env, menu, {
      language,
      action: String(payload?.action || "main_menu"),
      value: String(payload?.value || ""),
      callbackData: String(payload?.callbackData || ""),
    });
    return { rows: [preview], changes: 0 };
  }

  if (operation === "menuButtons") {
    const query = await env.DB.prepare("SELECT id, parent_id, label_en, label_bn, action_type, action_value, sort_order, created_at FROM bot_menu_buttons ORDER BY parent_id, sort_order, id").all();
    return { rows: query.results || [], changes: 0 };
  }

  if (operation === "createMenuButton") {
    const count = await env.DB.prepare("SELECT COUNT(*) AS n FROM bot_menu_buttons").first();
    if (Number(count?.n || 0) >= 30) throw new Error("menu_limit_reached");
    const parentId = payload?.parentId ? Number(payload.parentId) : null;
    const labelEn = String(payload?.labelEn || "").trim();
    const labelBn = String(payload?.labelBn || "").trim();
    const actionType = String(payload?.actionType || "");
    const actionValue = String(payload?.actionValue || "").trim();
    if (!labelEn || !labelBn || labelEn.length > 40 || labelBn.length > 40) throw new Error("invalid_menu_label");
    if (!["message", "url", "submenu"].includes(actionType)) throw new Error("invalid_menu_action");
    if (actionType === "message" && (!actionValue || actionValue.length > 2_000)) throw new Error("invalid_menu_message");
    if (actionType === "url" && !/^https:\/\//.test(actionValue)) throw new Error("invalid_menu_url");
    if (parentId) {
      const parent = await env.DB.prepare("SELECT action_type FROM bot_menu_buttons WHERE id = ?").bind(parentId).first();
      if (parent?.action_type !== "submenu") throw new Error("invalid_menu_parent");
    }
    const result = await env.DB.prepare("INSERT INTO bot_menu_buttons (parent_id, label_en, label_bn, action_type, action_value, sort_order) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(parentId, labelEn, labelBn, actionType, actionValue, Number(payload?.sortOrder || 0)).run();
    return { rows: [], changes: Number(result.meta?.changes || 0) };
  }

  if (operation === "deleteMenuButton") {
    const id = Number(payload?.id);
    if (!Number.isSafeInteger(id) || id < 1) throw new Error("invalid_menu_id");
    const children = await env.DB.prepare("SELECT COUNT(*) AS n FROM bot_menu_buttons WHERE parent_id = ?").bind(id).first();
    if (Number(children?.n || 0) > 0) throw new Error("delete_children_first");
    const result = await env.DB.prepare("DELETE FROM bot_menu_buttons WHERE id = ?").bind(id).run();
    return { rows: [], changes: Number(result.meta?.changes || 0) };
  }

  if (operation === "setBalance") {
    const telegramId = Number(payload?.telegramId);
    const balanceBdt = Number(payload?.balanceBdt);
    if (!Number.isSafeInteger(telegramId) || telegramId < 1) throw new Error("invalid_telegram_id");
    if (!Number.isSafeInteger(balanceBdt) || balanceBdt < 0 || balanceBdt > 100_000_000) throw new Error("invalid_balance");
    const query = await env.DB.prepare("UPDATE users SET balance_bdt = ?, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = ?")
      .bind(balanceBdt, telegramId).run();
    return { rows: [], changes: Number(query.meta?.changes || 0) };
  }

  const productKey = String(payload?.productKey || "").trim();
  const variantKey = String(payload?.variantKey || "").trim();
  if (!/^[A-Za-z0-9._-]{1,100}$/.test(productKey) || (variantKey && !/^[A-Za-z0-9._-]{1,100}$/.test(variantKey))) {
    throw new Error("invalid_key");
  }

  if (operation === "setPrice") {
    const priceBdt = Number(payload?.priceBdt);
    if (!Number.isSafeInteger(priceBdt) || priceBdt < 1 || priceBdt > 10_000_000) throw new Error("invalid_price");
    const query = await env.DB.prepare(`INSERT INTO product_prices (product_key, variant_key, price_bdt, updated_by, updated_at)
      VALUES (?, ?, ?, 0, CURRENT_TIMESTAMP)
      ON CONFLICT(product_key, variant_key) DO UPDATE SET price_bdt = excluded.price_bdt, updated_by = 0, updated_at = CURRENT_TIMESTAMP`)
      .bind(productKey, variantKey, priceBdt).run();
    return { rows: [], changes: Number(query.meta?.changes || 0) };
  }

  if (operation === "removePrice") {
    const query = await env.DB.prepare("DELETE FROM product_prices WHERE product_key = ? AND variant_key = ?")
      .bind(productKey, variantKey).run();
    return { rows: [], changes: Number(query.meta?.changes || 0) };
  }

  throw new Error("unknown_operation");
}

async function secureEqual(left, right) {
  const encoder = new TextEncoder();
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(left)),
    crypto.subtle.digest("SHA-256", encoder.encode(right)),
  ]);
  return crypto.subtle.timingSafeEqual(leftHash, rightHash);
}

function safeManagerError(error) {
  const message = String(error?.message || "operation_failed");
  if (message === "stale_menu_draft" || /^menu_[a-z0-9_]+$/.test(message)) return message;
  if (/^(invalid_announcement|invalid_withdrawal|withdrawal_)[a-z0-9_]*$/.test(message)) return message;
  if (/^seller_[a-z0-9_]+$/.test(message)) return message;
  return "operation_failed";
}

function parseStoredMenu(value) {
  try {
    return validateMenuDocument(JSON.parse(String(value || "")));
  } catch (error) {
    if (String(error?.message || "").startsWith("menu_")) throw error;
    throw new Error("menu_invalid_json");
  }
}

function storedMenuHasResponses(value) {
  try {
    const parsed = JSON.parse(String(value || ""));
    return Boolean(parsed?.responses && typeof parsed.responses === "object" && !Array.isArray(parsed.responses));
  } catch {
    return false;
  }
}

function defaultMenuResponses() {
  return Object.fromEntries(Object.entries(MENU_RESPONSE_DEFINITIONS).map(([key, definition]) => [key, {
    text_en: definition.en,
    text_bn: definition.bn,
  }]));
}

function menuResponseCatalog() {
  return Object.entries(MENU_RESPONSE_DEFINITIONS).map(([key, definition]) => ({
    key,
    label: definition.label,
    variables: definition.variables,
  }));
}

function hydrateMenuResponses(menu, settingRows) {
  const settings = new Map(settingRows.map((row) => [String(row.key), String(row.value || "")]));
  const responses = defaultMenuResponses();
  for (const [key, definition] of Object.entries(MENU_RESPONSE_DEFINITIONS)) {
    responses[key] = {
      text_en: settings.get(`${definition.setting}_en`) || menu.responses?.[key]?.text_en || definition.en,
      text_bn: settings.get(`${definition.setting}_bn`) || menu.responses?.[key]?.text_bn || definition.bn,
    };
  }
  return { ...menu, schemaVersion: 3, responses };
}

function menuSettingsStatements(env, menu) {
  const statements = [];
  for (const [key, definition] of Object.entries(MENU_RESPONSE_DEFINITIONS)) {
    const response = menu.responses[key];
    for (const language of ["en", "bn"]) {
      statements.push(env.DB.prepare(`INSERT INTO bot_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`)
        .bind(`${definition.setting}_${language}`, response[`text_${language}`]));
    }
  }
  return statements;
}

function defaultMenuDocument(legacyButtons = []) {
  const builtIns = [
    ["products", "products"],
    ["proxy", "proxy"],
    ["balance", "balance"],
    ["history", "history"],
    ["refer", "refer"],
    ["support", "support"],
  ].map(([id, action]) => ({
    id: `builtin-${id}`,
    label_en: MENU.en[id],
    label_bn: MENU.bn[id],
    action,
    value: "",
    width: "half",
    enabled: true,
  }));

  const screens = [{
    id: "main",
    title_en: "Use the menu buttons below 👇",
    title_bn: "নিচের মেনু ব্যবহার করুন 👇",
    buttons: [...builtIns],
  }];
  const submenuIds = new Set(legacyButtons.filter((button) => button.action_type === "submenu").map((button) => Number(button.id)));
  for (const submenuId of submenuIds) {
    const source = legacyButtons.find((button) => Number(button.id) === submenuId);
    screens.push({
      id: `legacy-screen-${submenuId}`,
      title_en: String(source?.action_value || source?.label_en || "Menu"),
      title_bn: String(source?.action_value || source?.label_bn || "মেনু"),
      buttons: [],
    });
  }
  const byScreen = new Map(screens.map((screen) => [screen.id, screen]));
  for (const source of legacyButtons) {
    const parentId = source.parent_id == null ? null : Number(source.parent_id);
    const screen = byScreen.get(parentId ? `legacy-screen-${parentId}` : "main") || byScreen.get("main");
    const isSubmenu = source.action_type === "submenu";
    screen.buttons.push({
      id: `legacy-button-${source.id}`,
      label_en: String(source.label_en || "Button"),
      label_bn: String(source.label_bn || source.label_en || "বাটন"),
      action: isSubmenu ? "screen" : source.action_type === "url" ? "url" : "message",
      value: isSubmenu ? `legacy-screen-${source.id}` : String(source.action_value || ""),
      width: "half",
      enabled: true,
    });
  }
  return { schemaVersion: 3, screens, responses: defaultMenuResponses(), product_buttons: defaultProductButtons() };
}

function defaultProductButtons() {
  return {
    show_new_products: true,
    items: [],
    refresh: {
      label_en: "📦 Full Stock",
      label_bn: "📦 সম্পূর্ণ স্টক",
      enabled: true,
    },
  };
}

function defaultProductButton(product, enabled = true) {
  const productKey = normalizePriceKey(product?.productKey);
  if (!productKey) return null;
  const fallbackName = String(product?.name || productKey).trim().slice(0, 64) || productKey;
  return {
    product_key: productKey,
    label_en: fallbackName,
    label_bn: fallbackName,
    enabled,
    show_stock: true,
  };
}

function hydrateProductButtons(menu, products = []) {
  const current = menu?.product_buttons || defaultProductButtons();
  const items = Array.isArray(current.items) ? [...current.items] : [];
  const known = new Set(items.map((item) => item.product_key));
  for (const product of products.slice(0, MENU_MAX_PRODUCT_BUTTONS)) {
    const productKey = normalizePriceKey(product?.productKey);
    if (!productKey || known.has(productKey)) continue;
    const item = defaultProductButton(product, current.show_new_products !== false);
    if (!item) continue;
    items.push(item);
    known.add(productKey);
  }
  return {
    ...menu,
    schemaVersion: 3,
    product_buttons: {
      show_new_products: current.show_new_products !== false,
      items: items.slice(0, MENU_MAX_PRODUCT_BUTTONS),
      refresh: {
        label_en: String(current.refresh?.label_en || "📦 Full Stock"),
        label_bn: String(current.refresh?.label_bn || "📦 সম্পূর্ণ স্টক"),
        enabled: current.refresh?.enabled !== false,
      },
    },
  };
}

function validateProductButtons(input) {
  const source = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const rawItems = Array.isArray(source.items) ? source.items : [];
  if (rawItems.length > MENU_MAX_PRODUCT_BUTTONS) throw new Error("menu_too_many_product_buttons");
  const productKeys = new Set();
  const items = rawItems.map((rawItem) => {
    const productKey = normalizePriceKey(rawItem?.product_key);
    const labelEn = String(rawItem?.label_en || "").trim();
    const labelBn = String(rawItem?.label_bn || "").trim();
    if (!productKey || productKeys.has(productKey)) throw new Error("menu_invalid_product_button_key");
    if (!labelEn || !labelBn || labelEn.length > 64 || labelBn.length > 64) throw new Error("menu_invalid_product_button_label");
    productKeys.add(productKey);
    return {
      product_key: productKey,
      label_en: labelEn,
      label_bn: labelBn,
      enabled: rawItem?.enabled !== false,
      show_stock: rawItem?.show_stock !== false,
    };
  });
  const refreshSource = source.refresh && typeof source.refresh === "object" && !Array.isArray(source.refresh) ? source.refresh : {};
  const refreshLabelEn = String(refreshSource.label_en || "📦 Full Stock").trim();
  const refreshLabelBn = String(refreshSource.label_bn || "📦 সম্পূর্ণ স্টক").trim();
  if (!refreshLabelEn || !refreshLabelBn || refreshLabelEn.length > 64 || refreshLabelBn.length > 64) {
    throw new Error("menu_invalid_product_button_label");
  }
  return {
    show_new_products: source.show_new_products !== false,
    items,
    refresh: {
      label_en: refreshLabelEn,
      label_bn: refreshLabelBn,
      enabled: refreshSource.enabled !== false,
    },
  };
}

function validateMenuDocument(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("menu_invalid_document");
  if (!Array.isArray(input.screens) || input.screens.length < 1 || input.screens.length > MENU_MAX_SCREENS) {
    throw new Error("menu_invalid_screens");
  }

  const screenIds = new Set();
  for (const source of input.screens) {
    const id = String(source?.id || "").trim();
    if (!/^[A-Za-z0-9_-]{1,64}$/.test(id) || screenIds.has(id)) throw new Error("menu_invalid_screen_id");
    screenIds.add(id);
  }
  if (!screenIds.has("main")) throw new Error("menu_main_screen_required");

  const buttonIds = new Set();
  const labelsEn = new Set();
  const labelsBn = new Set();
  let buttonCount = 0;
  const screens = input.screens.map((source) => {
    const id = String(source.id).trim();
    const titleEn = String(source.title_en || "").trim();
    const titleBn = String(source.title_bn || "").trim();
    if (!titleEn || !titleBn || titleEn.length > 500 || titleBn.length > 500) throw new Error("menu_invalid_screen_title");
    if (!Array.isArray(source.buttons) || source.buttons.length > 20) throw new Error("menu_too_many_screen_buttons");
    const buttons = source.buttons.map((rawButton) => {
      buttonCount += 1;
      const buttonId = String(rawButton?.id || "").trim();
      const labelEn = String(rawButton?.label_en || "").trim();
      const labelBn = String(rawButton?.label_bn || "").trim();
      const action = String(rawButton?.action || "").trim();
      const value = String(rawButton?.value || "").trim();
      const width = rawButton?.width === "full" ? "full" : "half";
      if (!/^[A-Za-z0-9_-]{1,64}$/.test(buttonId) || buttonIds.has(buttonId)) throw new Error("menu_invalid_button_id");
      if (!labelEn || !labelBn || labelEn.length > 64 || labelBn.length > 64) throw new Error("menu_invalid_button_label");
      if (!MENU_ACTIONS.has(action)) throw new Error("menu_invalid_button_action");
      const normalizedEn = labelEn.toLocaleLowerCase("en");
      const normalizedBn = labelBn.toLocaleLowerCase("bn");
      if (labelsEn.has(normalizedEn) || labelsBn.has(normalizedBn)) throw new Error("menu_duplicate_button_label");
      if (action === "message" && (!value || value.length > 2_000)) throw new Error("menu_invalid_message");
      if (action === "url" && (!/^https:\/\//i.test(value) || value.length > 2_000)) throw new Error("menu_invalid_url");
      if (action === "screen" && !screenIds.has(value)) throw new Error("menu_invalid_screen_target");
      buttonIds.add(buttonId);
      labelsEn.add(normalizedEn);
      labelsBn.add(normalizedBn);
      return { buttonId, labelEn, labelBn, action, value, width, enabled: rawButton?.enabled !== false };
    }).map((button) => ({
      id: button.buttonId,
      label_en: button.labelEn,
      label_bn: button.labelBn,
      action: button.action,
      value: button.value,
      width: button.width,
      enabled: button.enabled,
    }));
    return { id, title_en: titleEn, title_bn: titleBn, buttons };
  });
  if (buttonCount > MENU_MAX_BUTTONS) throw new Error("menu_too_many_buttons");
  const responseSource = input.responses && typeof input.responses === "object" && !Array.isArray(input.responses)
    ? input.responses
    : {};
  const responses = {};
  for (const [key, definition] of Object.entries(MENU_RESPONSE_DEFINITIONS)) {
    const source = responseSource[key];
    const textEn = String(source?.text_en || definition.en).trim();
    const textBn = String(source?.text_bn || definition.bn).trim();
    if (!textEn || !textBn || textEn.length > MENU_MAX_RESPONSE_CHARS || textBn.length > MENU_MAX_RESPONSE_CHARS) {
      throw new Error("menu_invalid_response");
    }
    responses[key] = { text_en: textEn, text_bn: textBn };
  }
  const productButtons = validateProductButtons(input.product_buttons);
  const menu = { schemaVersion: 3, screens, responses, product_buttons: productButtons };
  if (JSON.stringify(menu).length > MENU_DOCUMENT_MAX_CHARS) throw new Error("menu_document_too_large");
  return menu;
}

async function loadPublishedMenu(env) {
  try {
    const row = await env.DB.prepare(`SELECT v.menu_json FROM bot_menu_state s
      JOIN bot_menu_versions v ON v.id = s.active_version_id WHERE s.id = 1`).first();
    return row?.menu_json ? parseStoredMenu(row.menu_json) : null;
  } catch (error) {
    console.warn(JSON.stringify({ event: "published_menu_load_failed", error: error?.message || String(error) }));
    return null;
  }
}

function keyboardForMenuScreen(menu, screenId, language = "en") {
  const screen = menu.screens.find((item) => item.id === screenId) || menu.screens.find((item) => item.id === "main");
  const rows = [];
  let pending = [];
  const flush = () => {
    if (pending.length) rows.push(pending);
    pending = [];
  };
  for (const button of screen.buttons.filter((item) => item.enabled)) {
    const item = { text: language === "bn" ? button.label_bn : button.label_en };
    if (button.width === "full") {
      flush();
      rows.push([item]);
    } else {
      pending.push(item);
      if (pending.length === 2) flush();
    }
  }
  flush();
  if (screen.id !== "main" && !screen.buttons.some((button) => button.enabled && button.action === "main_menu")) {
    rows.push([{ text: "↩ Main menu" }]);
  }
  return { keyboard: rows, resize_keyboard: true };
}

function publishedMenuButton(menu, text, language) {
  for (const screen of menu.screens) {
    const button = screen.buttons.find((item) => item.enabled && (language === "bn" ? item.label_bn : item.label_en) === text);
    if (button) return button;
  }
  return null;
}

function cleanProfileField(value) {
  const normalized = String(value || "").trim();
  return normalized ? normalized.slice(0, 128) : null;
}

function validBotSetting(rule, value) {
  if (rule === "text") return value.length >= 1 && value.length <= 2_000;
  if (rule === "long_text") return value.length >= 1 && value.length <= MENU_MAX_RESPONSE_CHARS;
  if (rule === "phone") return /^\d{8,20}$/.test(value);
  if (rule === "telegram_url") return /^https:\/\/t\.me\/[A-Za-z0-9_]{5,32}$/.test(value);
  return false;
}

async function botSettingValue(env, key, fallback) {
  const row = await env.DB.prepare("SELECT value FROM bot_settings WHERE key = ?").bind(key).first();
  return row?.value || fallback;
}

async function paymentAccount(env, provider) {
  return botSettingValue(env, `payment_${provider}`, PAYMENT_ACCOUNTS[provider] || "");
}

async function botText(env, key, fallback, variables = {}) {
  const row = await env.DB.prepare("SELECT value FROM bot_settings WHERE key = ?").bind(key).first();
  if (!row?.value) return fallback;
  return renderEditableBotText(row.value, variables);
}

function renderEditableBotText(template, variables = {}) {
  let rendered = escapeHtml(String(template || "").trim());
  rendered = rendered
    .replace(/\*\*([^*\n]+)\*\*/g, "<b>$1</b>")
    .replace(/__([^_\n]+)__/g, "<i>$1</i>")
    .replace(/~~([^~\n]+)~~/g, "<s>$1</s>")
    .replace(/`([^`\n]+)`/g, "<code>$1</code>");
  for (const [name, value] of Object.entries(variables)) {
    rendered = rendered.replaceAll(escapeHtml(`{{${name}}}`), escapeHtml(value));
  }
  return polishOutgoingMessage(rendered);
}

function polishOutgoingMessage(text) {
  const lines = String(text ?? "").trim().split("\n");
  const first = lines.findIndex((line) => line.trim());
  if (first < 0) return "";

  const firstVisible = lines[first].replace(/<[^>]+>/g, "").replace(/&[a-z]+;/gi, "").trim();
  if (!/\p{Extended_Pictographic}/u.test(firstVisible)) lines[first] = `✨ ${lines[first]}`;
  if (!/<(?:b|strong)>/i.test(lines[first]) && lines[first].length <= 180) {
    lines[first] = `<b>${lines[first]}</b>`;
  }

  for (let index = first + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) continue;
    const labelled = line.match(/^((?:[\p{Extended_Pictographic}\uFE0F]\s*|[•▪▫]\s*)[^:<]{1,40}:)(\s*.*)$/u);
    if (labelled && !/<b>/i.test(labelled[1])) {
      lines[index] = `<b>${labelled[1]}</b>${labelled[2]}`;
      continue;
    }
    const previousIsBlank = index > 0 && !lines[index - 1].trim();
    const nextHasText = index + 1 < lines.length && Boolean(lines[index + 1].trim());
    if (previousIsBlank && nextHasText && line.length <= 60 && !/<[^>]+>/.test(line)
      && !/^https?:\/\//i.test(line) && !/[.!?।]$/.test(line)) {
      lines[index] = `<b>${line}</b>`;
    }
  }
  return lines.join("\n");
}

function renderPreviewTemplate(menu, key, language, variables = {}) {
  const definition = MENU_RESPONSE_DEFINITIONS[key];
  const template = menu.responses?.[key]?.[`text_${language}`] || definition?.[language] || "";
  let rendered = String(template);
  for (const [name, value] of Object.entries(variables)) {
    rendered = rendered.replaceAll(`{{${name}}}`, String(value ?? ""));
  }
  return rendered;
}

function previewReplyKeyboard(menu, screenId, language) {
  const screen = menu.screens.find((item) => item.id === screenId) || menu.screens.find((item) => item.id === "main");
  const rows = [];
  let pending = [];
  const flush = () => {
    if (pending.length) rows.push(pending);
    pending = [];
  };
  for (const button of screen.buttons.filter((item) => item.enabled)) {
    const item = {
      label: language === "bn" ? button.label_bn : button.label_en,
      kind: "reply",
      value: button.id,
    };
    if (button.width === "full") {
      flush();
      rows.push([item]);
    } else {
      pending.push(item);
      if (pending.length === 2) flush();
    }
  }
  flush();
  return rows;
}

function previewResult(menu, templateKey, language, variables, keyboard = [], extra = {}) {
  return {
    template_key: templateKey || null,
    text: templateKey ? renderPreviewTemplate(menu, templateKey, language, variables) : String(extra.text || ""),
    variables,
    keyboard,
    keyboard_type: extra.keyboardType || (keyboard.length ? "inline" : "none"),
    screen_id: extra.screenId || null,
    warning: extra.warning || null,
  };
}

async function buildMenuActionPreview(env, menu, request) {
  const language = request.language;
  const adminId = Number(csv(env.ADMIN_IDS)[0] || 0);
  const callbackData = request.callbackData;

  if (callbackData === "products:refresh") return previewProductsAction(env, menu, language, adminId);
  if (callbackData.startsWith("product:")) {
    return previewProductDetailAction(env, menu, language, adminId, callbackData.slice("product:".length));
  }
  if (callbackData === "balance") {
    const balance = await getBalance(env, adminId);
    return previewResult(menu, "balance_value", language, { balance: money(balance) });
  }
  if (callbackData === "add_balance") return previewPaymentIntroAction(env, menu, language);
  if (callbackData === "referral:dashboard") return previewReferralAction(env, menu, language, adminId);
  if (callbackData === "referral:terms") return previewReferralTermsAction(menu, language);
  if (callbackData.startsWith("pay_provider:")) {
    const provider = callbackData.slice("pay_provider:".length);
    if (!ACTIVE_PAYMENT_PROVIDERS.includes(provider)) {
      return previewResult(menu, null, language, {}, [], {
        text: language === "bn" ? "এই পেমেন্ট পদ্ধতি সাময়িকভাবে বন্ধ।" : "This payment method is temporarily unavailable.",
        warning: "Preview only — no payment state was changed.",
      });
    }
    const account = await paymentAccount(env, provider);
    return previewResult(menu, "payment_provider", language, {
      provider: provider.toUpperCase(),
      account,
    }, [], { warning: "Preview only — no payment state was changed." });
  }

  if (request.action === "products") return previewProductsAction(env, menu, language, adminId);
  if (request.action === "balance") {
    const balance = await getBalance(env, adminId);
    return previewResult(menu, "balance", language, { balance: money(balance) }, [
      [{ label: language === "bn" ? "💰 ব্যালেন্স দেখুন" : "💰 View Balance", kind: "callback", value: "balance" }],
      [{ label: language === "bn" ? "➕ ব্যালেন্স যোগ করুন" : "➕ Add Balance", kind: "callback", value: "add_balance" }],
    ]);
  }
  if (request.action === "history") return previewHistoryAction(env, menu, language, adminId);
  if (request.action === "refer") return previewReferralAction(env, menu, language, adminId);
  if (request.action === "support") {
    const supportUrl = await botSettingValue(env, "support_url", env.SUPPORT_URL);
    return previewResult(menu, "support", language, {}, [[{
      label: language === "bn" ? "📞 সাপোর্ট" : "📞 Contact Support",
      kind: "url",
      value: supportUrl,
    }]]);
  }
  if (request.action === "proxy") return previewResult(menu, "proxy", language, {});
  if (request.action === "main_menu") {
    return previewResult(menu, "main_menu", language, {}, previewReplyKeyboard(menu, "main", language), {
      keyboardType: "reply",
      screenId: "main",
    });
  }
  if (request.action === "screen") {
    const target = menu.screens.find((screen) => screen.id === request.value);
    if (!target) throw new Error("menu_invalid_screen_target");
    return previewResult(menu, null, language, {}, previewReplyKeyboard(menu, target.id, language), {
      text: language === "bn" ? target.title_bn : target.title_en,
      keyboardType: "reply",
      screenId: target.id,
    });
  }
  if (request.action === "message") return previewResult(menu, null, language, {}, [], { text: request.value });
  if (request.action === "url") return previewResult(menu, null, language, {}, [[{
    label: language === "bn" ? "🔗 লিংক খুলুন" : "🔗 Open link",
    kind: "url",
    value: request.value,
  }]], { text: language === "bn" ? "লিংকটি খুলতে নিচের বাটন চাপুন।" : "Tap below to open the link." });
  throw new Error("menu_invalid_preview_action");
}

async function previewProductsAction(env, menu, language, adminId) {
  const balance = await getBalance(env, adminId);
  try {
    const payload = await qvRequest(env, "GET", "/products");
    const products = payload.products || [];
    const keyboard = productInlineRows(menu, products, language).map((row) => row.map((button) => ({
      label: button.text,
      kind: "callback",
      value: button.callback_data,
    })));
    return previewResult(menu, "products", language, { balance: money(balance) }, keyboard);
  } catch (error) {
    return previewResult(menu, "products", language, { balance: money(balance) }, [], {
      warning: `Live catalog unavailable: ${String(error?.message || error)}`.slice(0, 180),
    });
  }
}

function productInlineRows(menu, products, language = "en") {
  const hydrated = hydrateProductButtons(menu || { product_buttons: defaultProductButtons() }, products);
  const config = hydrated.product_buttons;
  const byKey = new Map(products.slice(0, MENU_MAX_PRODUCT_BUTTONS)
    .map((product) => [normalizePriceKey(product?.productKey), product])
    .filter(([key]) => key));
  const rows = [];
  for (const item of config.items) {
    const product = byKey.get(item.product_key);
    if (!product || !item.enabled) continue;
    const baseLabel = language === "bn" ? item.label_bn : item.label_en;
    const stock = item.show_stock
      ? language === "bn" ? ` (${productStock(product)} স্টক)` : ` (${productStock(product)} in stock)`
      : "";
    rows.push([{
      text: `${baseLabel}${stock}`.slice(0, 64),
      callback_data: `product:${item.product_key}`,
    }]);
    if (rows.length >= 30) break;
  }
  if (config.refresh.enabled) {
    rows.push([{
      text: (language === "bn" ? config.refresh.label_bn : config.refresh.label_en).slice(0, 64),
      callback_data: "products:refresh",
    }]);
  }
  return rows;
}

async function previewProductDetailAction(env, menu, language, adminId, productKey) {
  try {
    const payload = await qvRequest(env, "GET", `/products/${encodeURIComponent(productKey)}`);
    const product = payload.product || payload;
    const balance = await getBalance(env, adminId);
    const fixedPrices = await getFixedPrices(env, productKey);
    const keyboard = [];
    const variants = product.variants || [];
    if (variants.length) {
      for (const variant of variants.slice(0, 20)) {
        const price = fixedUnitPrice(fixedPrices, variant.key);
        if (price != null) keyboard.push([{
          label: `🛒 Buy ${variant.name || variant.key} (${money(price)})`.slice(0, 64),
          kind: "disabled",
          value: "",
        }]);
      }
    } else {
      const price = fixedUnitPrice(fixedPrices);
      if (price != null) keyboard.push([{ label: `🛒 Buy 1 (${money(price)})`, kind: "disabled", value: "" }]);
    }
    if (fixedUnitPrice(fixedPrices) != null) keyboard.push([{
      label: language === "bn" ? "📦 বাল্ক কিনুন" : "📦 Bulk Buy",
      kind: "disabled",
      value: "",
    }]);
    return previewResult(menu, "product_detail", language, {
      product_name: product.name || productKey,
      description: product.description || (language === "bn" ? "কোনো বিবরণ নেই।" : "No description provided."),
      warranty: product.warranty || (language === "bn" ? "উল্লেখ করা হয়নি" : "Not provided"),
      price: fixedProductPriceLabel(product, fixedPrices, language),
      stock: productStock(product),
      balance: money(balance),
    }, keyboard, { warning: "Purchase buttons are disabled inside the safe website preview." });
  } catch (error) {
    return previewResult(menu, "product_detail", language, {
      product_name: productKey,
      description: language === "bn" ? "লাইভ পণ্যটি লোড করা যায়নি।" : "The live product could not be loaded.",
      warranty: "—",
      price: "—",
      stock: "—",
      balance: money(await getBalance(env, adminId)),
    }, [], { warning: String(error?.message || error).slice(0, 180) });
  }
}

async function previewPaymentIntroAction(env, menu, language) {
  const accounts = {
    bkash: await paymentAccount(env, "bkash"),
    nagad: await paymentAccount(env, "nagad"),
    upay: await paymentAccount(env, "upay"),
  };
  return previewResult(menu, "payment_intro", language, accounts, [
    [
      { label: "🟥 bKash", kind: "callback", value: "pay_provider:bkash" },
      { label: "🟧 NAGAD", kind: "callback", value: "pay_provider:nagad" },
    ],
    [
      { label: "🟪 Rocket unavailable", kind: "disabled", value: "" },
      { label: "🟨 upay", kind: "callback", value: "pay_provider:upay" },
    ],
  ]);
}

async function previewHistoryAction(env, menu, language, adminId) {
  const [ordersResult, summary] = await env.DB.batch([
    env.DB.prepare("SELECT product_key, variant_key, quantity, charged_bdt FROM local_orders WHERE telegram_id = ? ORDER BY id DESC LIMIT 10").bind(adminId),
    env.DB.prepare("SELECT COUNT(*) AS total_orders, COALESCE(SUM(charged_bdt), 0) AS total_spent FROM local_orders WHERE telegram_id = ?").bind(adminId),
  ]);
  const orders = ordersResult.results || [];
  const totals = summary.results?.[0] || {};
  const empty = language === "bn" ? "এখনও কোনো অর্ডার নেই।" : "No orders yet.";
  const historyLines = orders.length ? orders.map((order) => {
    const variant = order.variant_key ? ` / ${order.variant_key}` : "";
    return `• ${order.product_key}${variant} × ${order.quantity} — ${money(order.charged_bdt)}`;
  }).join("\n") : empty;
  return previewResult(menu, "history", language, {
    total_orders: totals.total_orders || 0,
    total_spent: money(totals.total_spent || 0),
    history_lines: historyLines,
  });
}

async function previewReferralAction(env, menu, language, adminId) {
  const me = await telegram(env, "getMe", {});
  const dashboard = await getReferralDashboard(env, adminId);
  const referralLines = dashboard.referrals.length
    ? dashboard.referrals.map((item) => {
      const name = item.username ? `@${item.username}` : item.first_name || `User ${item.referred_id}`;
      return `• ${name} — ${item.purchase_count} purchase${Number(item.purchase_count) === 1 ? "" : "s"} — ${money(item.earned_bdt)}`;
    }).join("\n")
    : (language === "bn" ? "এখনও কোনো referral নেই।" : "No referrals yet.");
  const withdrawalLines = dashboard.withdrawals.length
    ? dashboard.withdrawals.map((item) => `${item.status === "paid" ? "✅" : item.status === "rejected" ? "❌" : "⏳"} ${money(item.amount_bdt)} — ${item.status}`).join("\n")
    : (language === "bn" ? "এখনও কোনো withdrawal নেই।" : "No withdrawals yet.");
  return previewResult(menu, "refer", language, {
    referral_link: `https://t.me/${me.result.username}?start=${adminId}`,
    referral_count: dashboard.referrals.length,
    purchase_count: dashboard.wallet.purchase_count,
    total_earned: money(dashboard.wallet.total_earned_bdt),
    available_balance: money(dashboard.wallet.available_bdt),
    pending_withdrawal: money(dashboard.wallet.pending_bdt),
    referral_lines: referralLines,
    withdrawal_lines: withdrawalLines,
  }, [
    [{ label: language === "bn" ? "💸 bKash-এ Withdraw" : "💸 Withdraw to bKash", kind: "disabled", value: "" }],
    [{ label: language === "bn" ? "📘 নিয়ম ও নির্দেশনা" : "📘 Guide and terms", kind: "callback", value: "referral:terms" }],
    [{ label: language === "bn" ? "🔄 Dashboard refresh" : "🔄 Refresh dashboard", kind: "callback", value: "referral:dashboard" }],
  ], { warning: "Withdrawal is disabled inside the safe website preview." });
}

function previewReferralTermsAction(menu, language) {
  return previewResult(menu, "referral_terms", language, {}, [[{
    label: language === "bn" ? "↩️ রেফারেল ড্যাশবোর্ড" : "↩️ Referral dashboard",
    kind: "callback",
    value: "referral:dashboard",
  }]]);
}

async function handleUpdate(update, env) {
  if (update.callback_query) {
    await handleCallback(update.callback_query, env);
    return;
  }
  if (update.message) await handleMessage(update.message, env);
}

async function handleMessage(message, env) {
  const chatId = message.chat.id;
  const user = message.from;
  const text = (message.text || "").trim();
  if (!user || !text) return;

  await ensureUser(env, user.id, user);

  if (text === "/start" || text.startsWith("/start ")) {
    const referrerId = parseStartReferrer(text, user.id);
    if (referrerId) await recordPendingReferral(env, user.id, referrerId);
    await clearState(env, user.id);
    await startLanguageSelection(env, chatId);
    return;
  }

  if (text === "/stats") {
    if (isAdmin(env, user.id)) await adminStatsWithReferrals(env, chatId);
    return;
  }
  if (text.startsWith("/balance_add ")) {
    if (isAdmin(env, user.id)) await adminBalanceAdd(env, chatId, text);
    return;
  }
  if (text.startsWith("/balance_deduct ")) {
    if (isAdmin(env, user.id)) await adminBalanceDeduct(env, chatId, text);
    return;
  }
  if (text.startsWith("/balance_set ")) {
    if (isAdmin(env, user.id)) await adminBalanceSet(env, chatId, text);
    return;
  }
  if (text === "/price_help") {
    if (isAdmin(env, user.id)) await adminPriceHelp(env, chatId);
    return;
  }
  if (text === "/prices") {
    if (isAdmin(env, user.id)) await adminPriceList(env, chatId);
    return;
  }
  if (text === "/price_catalog") {
    if (isAdmin(env, user.id)) await adminPriceCatalog(env, chatId);
    return;
  }
  if (text === "/price_set" || text.startsWith("/price_set ")) {
    if (isAdmin(env, user.id)) await adminPriceSet(env, chatId, user.id, text);
    return;
  }
  if (text === "/price_remove" || text.startsWith("/price_remove ")) {
    if (isAdmin(env, user.id)) await adminPriceRemove(env, chatId, text);
    return;
  }

  const state = await getState(env, user.id);
  const isMenuNavigation = isAnyMenuText(text) || text === "↩ Main menu" || await isPublishedMenuText(env, text) || await isCustomMenuText(env, text);
  if (state?.state && isMenuNavigation) {
    await clearState(env, user.id);
  } else if (state?.state === "awaiting_payment_amount") {
    await handlePaymentAmount(env, chatId, user.id, text, state);
    return;
  } else if (state?.state === "awaiting_transaction_id") {
    await handleTransactionId(env, chatId, user.id, text, state);
    return;
  } else if (state?.state === "awaiting_bulk_quantity") {
    await handleBulkQuantity(env, chatId, user.id, text, state);
    return;
  } else if (state?.state === "awaiting_referral_withdraw_amount") {
    await handleReferralWithdrawalAmount(env, chatId, user.id, text);
    return;
  } else if (state?.state === "awaiting_referral_withdraw_bkash") {
    await handleReferralWithdrawalBkash(env, chatId, user.id, text, state);
    return;
  }

  if (!(await ensureAccess(env, chatId, user.id))) return;

  const lang = await getLanguage(env, user.id);
  if (text === "↩ Main menu") {
    await sendMessage(env, chatId, await botText(env, `menu_hint_${lang}`, lang === "bn" ? "নিচের মেনু ব্যবহার করুন 👇" : "Use the menu buttons below 👇"), { reply_markup: await mainKeyboard(env, lang) });
    return;
  }
  if (await handlePublishedMenuButton(env, chatId, user.id, text, lang)) return;
  if (await handleCustomMenuButton(env, chatId, text, lang)) return;
  if (isMenuText(text, "products")) {
    await showProducts(env, chatId, user.id);
  } else if (isMenuText(text, "balance")) {
    await showBalance(env, chatId, user.id);
  } else if (isMenuText(text, "history")) {
    await showHistory(env, chatId, user.id);
  } else if (isMenuText(text, "refer")) {
    await showReferWithStats(env, chatId, user.id);
  } else if (isMenuText(text, "support")) {
    await showSupport(env, chatId, user.id);
  } else if (isMenuText(text, "proxy")) {
    const fallback = lang === "bn"
      ? "🛒 বর্তমান Quantum Vault API-তে প্রক্সি কেনার অপশন নেই।\nপণ্য কিনতে Products ব্যবহার করুন।"
      : "🛒 Proxy buying is not exposed by the current Quantum Vault API docs.\nUse Products to buy API-backed stock.";
    await sendMessage(env, chatId, await botText(env, `proxy_unavailable_${lang}`, fallback), {
      reply_markup: await mainKeyboard(env, lang),
    });
  } else {
    const fallback = lang === "bn" ? "নিচের মেনু ব্যবহার করুন 👇" : "Use the menu buttons below 👇";
    await sendMessage(env, chatId, await botText(env, `menu_hint_${lang}`, fallback), {
      reply_markup: await mainKeyboard(env, lang),
    });
  }
}

async function handleCallback(query, env) {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const data = query.data || "";
  await answerCallback(env, query.id);
  await ensureUser(env, userId, query.from);

  if (data.startsWith("lang:")) {
    const lang = data.split(":")[1] === "bn" ? "bn" : "en";
    await setLanguage(env, userId, lang);
    if (await ensureChannelMembership(env, chatId, userId)) {
      await startHumanVerification(env, chatId, userId);
    }
    return;
  }

  if (data === "check_channel_join") {
    if (await ensureChannelMembership(env, chatId, userId)) {
      await sendMessage(env, chatId, "✅ Thanks for joining! Setting things up...");
      await startHumanVerification(env, chatId, userId);
    }
    return;
  }

  if (data.startsWith("verify:")) {
    if (!(await ensureChannelMembership(env, chatId, userId))) return;
    await verifyColor(env, chatId, userId, data.split(":")[1]);
    return;
  }

  if (!(await ensureAccess(env, chatId, userId))) return;

  if (data === "products:refresh") {
    await showProducts(env, chatId, userId);
  } else if (data.startsWith("product:")) {
    await showProductDetail(env, chatId, userId, data.split(":")[1]);
  } else if (data.startsWith("bulk:")) {
    const productKey = data.split(":")[1];
    await setState(env, userId, { state: "awaiting_bulk_quantity", bulk_product_key: productKey });
    const lang = await getLanguage(env, userId);
    await sendMessage(env, chatId, lang === "bn"
      ? "📦 <b>বাল্ক কিনুন</b>\n\nকতটি কিনতে চান লিখুন।\nউদাহরণ: <code>20</code>"
      : "📦 <b>Bulk Buy</b>\n\nSend the quantity you want to buy.\nExample: <code>20</code>");
  } else if (data.startsWith("buy:")) {
    await buyProduct(env, chatId, userId, data);
  } else if (data === "balance") {
    const balance = await getBalance(env, userId);
    const lang = await getLanguage(env, userId);
    const fallback = lang === "bn" ? `💵 আপনার ব্যালেন্স: <b>${money(balance)}</b>` : `💵 Your balance: <b>${money(balance)}</b>`;
    await sendMessage(env, chatId, await botText(env, `balance_value_${lang}`, fallback, { balance: money(balance) }));
  } else if (data === "add_balance") {
    await addBalancePrompt(env, chatId, userId);
  } else if (data.startsWith("pay_provider:")) {
    await selectPaymentProvider(env, chatId, userId, data.split(":")[1]);
  } else if (data === "referral:dashboard") {
    await showReferWithStats(env, chatId, userId);
  } else if (data === "referral:terms") {
    await showReferralTerms(env, chatId, userId);
  } else if (data === "referral:withdraw") {
    await startReferralWithdrawal(env, chatId, userId);
  }
}

async function startLanguageSelection(env, chatId) {
  await sendMessage(env, chatId, "🌐 <b>Select language / ভাষা নির্বাচন করুন</b>", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "English", callback_data: "lang:en" }],
        [{ text: "বাংলা", callback_data: "lang:bn" }],
      ],
    },
  });
}

async function ensureAccess(env, chatId, userId) {
  const row = await env.DB.prepare("SELECT human_verified FROM users WHERE telegram_id = ?").bind(userId).first();
  if (!(await ensureChannelMembership(env, chatId, userId))) return false;
  if (row?.human_verified) return true;
  await startHumanVerification(env, chatId, userId);
  return false;
}

async function ensureChannelMembership(env, chatId, userId) {
  if (await isRequiredChannelMember(env, userId)) {
    await completePendingReferral(env, userId);
    return true;
  }
  await showJoinRequired(env, chatId, userId);
  return false;
}

async function isRequiredChannelMember(env, userId) {
  const channel = requiredChannel(env);
  if (!channel) return true;
  try {
    const payload = await telegram(env, "getChatMember", {
      chat_id: channel,
      user_id: userId,
    });
    return ["creator", "administrator", "member"].includes(payload.result?.status);
  } catch (error) {
    console.warn("Channel membership check failed", error?.message || error);
    return false;
  }
}

async function showJoinRequired(env, chatId, userId) {
  const lang = await getLanguage(env, userId);
  const channelUrl = env.REQUIRED_CHANNEL_URL || "";
  const fallback = lang === "bn"
    ? "⚠️ <b>এই বট ব্যবহার করতে আমাদের চ্যানেলে জয়েন করতে হবে!</b>\n\nনিচের ধাপগুলো সম্পন্ন করুন:\n\n• আমাদের অফিসিয়াল চ্যানেলে জয়েন করুন\n\nতারপর ✅ I've Joined চাপুন।"
    : "⚠️ <b>You must join our channel to use this bot!</b>\n\nPlease complete the step below:\n\n• Join our official channel\n\nThen tap ✅ I've Joined to continue.";
  await sendMessage(env, chatId, await botText(env, `join_required_${lang}`, fallback), {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📢 Join Channel", url: channelUrl }],
        [{ text: "✅ I've Joined", callback_data: "check_channel_join" }],
      ],
    },
  });
}

async function startHumanVerification(env, chatId, userId) {
  const lang = await getLanguage(env, userId);
  const colors = Object.keys(VERIFY_COLORS);
  const color = colors[crypto.getRandomValues(new Uint32Array(1))[0] % colors.length];
  await setState(env, userId, { state: "verify", verify_color: color });
  await sendMessage(env, chatId, lang === "bn"
    ? `🤖 <b>মানব যাচাই</b>\n\nচালিয়ে যেতে <b>${VERIFY_COLORS[color].bn}</b> চাপুন।`
    : `🤖 <b>Human verification</b>\n\nTap <b>${VERIFY_COLORS[color].en}</b> to continue.`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: VERIFY_COLORS.yellow[lang], callback_data: "verify:yellow" },
          { text: VERIFY_COLORS.red[lang], callback_data: "verify:red" },
        ],
        [
          { text: VERIFY_COLORS.orange[lang], callback_data: "verify:orange" },
          { text: VERIFY_COLORS.purple[lang], callback_data: "verify:purple" },
        ],
      ],
    },
  });
}

async function verifyColor(env, chatId, userId, selected) {
  const state = await getState(env, userId);
  const lang = await getLanguage(env, userId);
  if (state?.verify_color !== selected) {
    await sendMessage(env, chatId, lang === "bn" ? "❌ ভুল রং। আবার চেষ্টা করুন।" : "❌ Wrong color. Try again.");
    await startHumanVerification(env, chatId, userId);
    return;
  }
  await env.DB.prepare("UPDATE users SET human_verified = 1, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = ?").bind(userId).run();
  await clearState(env, userId);
  await sendMessage(env, chatId, lang === "bn" ? "✅ যাচাই সম্পন্ন।" : "✅ Verification complete.");
  await welcome(env, chatId, userId);
}

async function welcome(env, chatId, userId) {
  const lang = await getLanguage(env, userId);
  const balance = await getBalance(env, userId);
  const fallback = lang === "bn"
    ? `🎉 <b>ToolzAI Bot-এ স্বাগতম!</b>\n\n👤 User ID: <b>${userId}</b>\n💵 আপনার ব্যালেন্স: <b>${money(balance)}</b>\n\nনিচের বাটন ব্যবহার করুন 👇`
    : `🎉 <b>Welcome to ToolzAI Bot!</b>\n\n👤 User ID: <b>${userId}</b>\n💵 Your Balance: <b>${money(balance)}</b>\n\nUse the buttons below to navigate 👇`;
  await sendMessage(env, chatId, await botText(env, `welcome_${lang}`, fallback, { user_id: userId, balance: money(balance) }), {
    reply_markup: await mainKeyboard(env, lang),
  });
}

async function showProducts(env, chatId, userId) {
  const lang = await getLanguage(env, userId);
  try {
    const [products, balance, publishedMenu] = await Promise.all([
      qvRequest(env, "GET", "/products"),
      getBalance(env, userId),
      loadPublishedMenu(env),
    ]);
    const productList = products.products || [];
    const rows = productInlineRows(publishedMenu, productList, lang);
    const fallback = lang === "bn"
      ? `🛍️ <b>প্রোডাক্ট</b>\n━━━━━━━━━━━━━━━━━━━━\n💵 আপনার ব্যালেন্স: <b>${money(balance)}</b>\n\n👇 কিনতে একটি পণ্য সিলেক্ট করুন:`
      : `🛍️ <b>Products</b>\n━━━━━━━━━━━━━━━━━━━━\n💵 Your Balance: <b>${money(balance)}</b>\n\n👇 Tap a product to buy:`;
    const extra = rows.length ? { reply_markup: { inline_keyboard: rows } } : {};
    await sendMessage(env, chatId, await botText(env, `products_${lang}`, fallback, { balance: money(balance) }), extra);
  } catch (error) {
    await sendMessage(env, chatId, `❌ ${escapeHtml(error.message)}`);
  }
}

async function showProductDetail(env, chatId, userId, productKey) {
  const lang = await getLanguage(env, userId);
  try {
    const payload = await qvRequest(env, "GET", `/products/${encodeURIComponent(productKey)}`);
    const product = payload.product || payload;
    const balance = await getBalance(env, userId);
    const variants = product.variants || [];
    const fixedPrices = await getFixedPrices(env, productKey);
    const rows = [];
    if (variants.length) {
      for (const variant of variants.slice(0, 20)) {
        const price = fixedUnitPrice(fixedPrices, variant.key);
        if (price != null) {
          rows.push([{ text: `🛒 Buy ${variant.name || variant.key} (${money(price)})`.slice(0, 64), callback_data: `buy:${productKey}:${variant.key}:1` }]);
        }
      }
    } else {
      const price = fixedUnitPrice(fixedPrices);
      if (price != null) rows.push([{ text: `🛒 Buy 1 (${money(price)})`, callback_data: `buy:${productKey}::1` }]);
    }
    if (fixedUnitPrice(fixedPrices) != null) {
      rows.push([{ text: lang === "bn" ? "📦 বাল্ক কিনুন" : "📦 Bulk Buy", callback_data: `bulk:${productKey}` }]);
    }
    const priceLabel = fixedProductPriceLabel(product, fixedPrices, lang);
    const extra = rows.length ? { reply_markup: { inline_keyboard: rows } } : {};
    const fallback = `✦ <b>${escapeHtml(product.name || productKey)}</b>\n\n${escapeHtml(product.description || "No description provided.")}\n\n🧯 <b>Warranty:</b> ${escapeHtml(product.warranty || "Not provided")}\n\n💵 ${lang === "bn" ? "মূল্য" : "Price"}: <b>${priceLabel}</b>\n📦 ${lang === "bn" ? "স্টক" : "Available"}: <b>${productStock(product)}</b>\n💰 ${lang === "bn" ? "আপনার ব্যালেন্স" : "Your balance"}: <b>${money(balance)}</b>`;
    await sendMessage(env, chatId, await botText(env, `product_detail_${lang}`, fallback, {
      product_name: product.name || productKey,
      description: product.description || (lang === "bn" ? "কোনো বিবরণ নেই।" : "No description provided."),
      warranty: product.warranty || (lang === "bn" ? "উল্লেখ করা হয়নি" : "Not provided"),
      price: priceLabel,
      stock: productStock(product),
      balance: money(balance),
    }), extra);
  } catch (error) {
    await sendMessage(env, chatId, `❌ ${escapeHtml(error.message)}`);
  }
}

async function buyProduct(env, chatId, userId, data) {
  const [, productKey, variantKeyRaw, quantityRaw] = data.split(":");
  const variantKey = variantKeyRaw || null;
  const quantity = Math.max(1, Number.parseInt(quantityRaw || "1", 10));
  try {
    await qvRequest(env, "GET", `/products/${encodeURIComponent(productKey)}`);
    const unitPriceBdt = await getFixedUnitPrice(env, productKey, variantKey);
    if (unitPriceBdt == null) {
      await sendMessage(env, chatId, "❌ This product does not have a fixed price yet. Please contact support.");
      return;
    }
    const expectedTotal = unitPriceBdt * quantity;
    const balance = await getBalance(env, userId);
    if (balance < expectedTotal) {
      await sendMessage(env, chatId, `❌ Insufficient balance. Need ${money(expectedTotal)}, have ${money(balance)}.`);
      return;
    }
    const orderPayload = await qvRequest(env, "POST", "/purchase", { productKey, variantKey, quantity });
    const order = orderPayload.order || orderPayload;
    await recordCompletedPurchase(env, userId, productKey, variantKey, quantity, expectedTotal, String(order.orderId || order.id || ""));
    await sendDelivery(env, chatId, order, expectedTotal);
  } catch (error) {
    await maybeAlertProviderPurchaseFailure(env, {
      error,
      userId,
      chatId,
      productKey,
      variantKey,
      quantity,
    });
    if (isProviderPurchaseError(error)) {
      await sendServiceUnavailable(env, chatId);
      return;
    }
    await sendMessage(env, chatId, `❌ ${escapeHtml(error.message)}`);
  }
}

async function handleBulkQuantity(env, chatId, userId, text, state) {
  if (!/^\d+$/.test(text)) {
    await sendMessage(env, chatId, "📦 Send only the quantity number, for example: 20");
    return;
  }
  const quantity = Number.parseInt(text, 10);
  if (quantity < 1 || quantity > 500) {
    await sendMessage(env, chatId, "❌ Quantity must be between 1 and 500.");
    return;
  }
  await clearState(env, userId);
  try {
    const productKey = state.bulk_product_key;
    await qvRequest(env, "GET", `/products/${encodeURIComponent(productKey)}`);
    const unitPriceBdt = await getFixedUnitPrice(env, productKey);
    if (unitPriceBdt == null) {
      await sendMessage(env, chatId, "❌ This product does not have a fixed price yet. Please contact support.");
      return;
    }
    const expectedTotal = unitPriceBdt * quantity;
    const balance = await getBalance(env, userId);
    if (balance < expectedTotal) {
      await sendMessage(env, chatId, `❌ Insufficient balance. Need ${money(expectedTotal)}, have ${money(balance)}.`);
      return;
    }
    const orderPayload = await qvRequest(env, "POST", "/purchase", { productKey, quantity });
    const order = orderPayload.order || orderPayload;
    await recordCompletedPurchase(env, userId, productKey, null, quantity, expectedTotal, String(order.orderId || order.id || ""));
    await sendDelivery(env, chatId, order, expectedTotal);
  } catch (error) {
    await maybeAlertProviderPurchaseFailure(env, {
      error,
      userId,
      chatId,
      productKey: state.bulk_product_key,
      variantKey: null,
      quantity,
    });
    if (isProviderPurchaseError(error)) {
      await sendServiceUnavailable(env, chatId);
      return;
    }
    await sendMessage(env, chatId, `❌ ${escapeHtml(error.message)}`);
  }
}

async function sendDelivery(env, chatId, order, chargedBdt) {
  const lines = [
    "✅ <b>Purchase complete</b>",
    `🧾 Order: <b>${escapeHtml(order.orderId || order.id || "created")}</b>`,
    `💵 Charged: <b>${money(chargedBdt)}</b>`,
    "",
  ];
  const items = order.items || [];
  items.forEach((item, index) => {
    lines.push(`<b>Item ${index + 1}</b>`);
    const data = item.data || {};
    const fields = item.fields || [];
    if (Object.keys(data).length) {
      for (const [key, value] of Object.entries(data)) lines.push(`${escapeHtml(key)}: <code>${escapeHtml(value)}</code>`);
    } else {
      for (const field of fields) lines.push(`${escapeHtml(field.label || field.name || "value")}: <code>${escapeHtml(field.value || "")}</code>`);
    }
    lines.push("");
  });
  if (!items.length) lines.push("Delivery details were not returned. Contact support with the order ID above.");
  await sendMessageLines(env, chatId, lines);
}

async function showBalance(env, chatId, userId) {
  const lang = await getLanguage(env, userId);
  const balance = await getBalance(env, userId);
  const fallback = lang === "bn"
    ? `💰 <b>ব্যালেন্স</b>\n\n💵 আপনার ব্যালেন্স: <b>${money(balance)}</b>\n\n👇 একটি অপশন বাছুন:`
    : `💰 <b>Balance</b>\n\n💵 Your balance: <b>${money(balance)}</b>\n\n👇 Choose an option:`;
  await sendMessage(env, chatId, await botText(env, `balance_menu_${lang}`, fallback, { balance: money(balance) }), {
    reply_markup: {
      inline_keyboard: [
        [{ text: lang === "bn" ? "💰 ব্যালেন্স দেখুন" : "💰 View Balance", callback_data: "balance" }],
        [{ text: lang === "bn" ? "➕ ব্যালেন্স যোগ করুন" : "➕ Add Balance", callback_data: "add_balance" }],
      ],
    },
  });
}

async function addBalancePrompt(env, chatId, userId) {
  const lang = await getLanguage(env, userId);
  await clearState(env, userId);
  const accounts = {
    bkash: await paymentAccount(env, "bkash"),
    nagad: await paymentAccount(env, "nagad"),
    upay: await paymentAccount(env, "upay"),
  };
  const fallback = lang === "bn"
    ? `➕ <b>ব্যালেন্স যোগ করুন</b>\n\n<b>উপলব্ধ পেমেন্ট অপশন:</b>\n\n• bKash: <code>${accounts.bkash}</code> (Send Money)\n• Nagad: <code>${accounts.nagad}</code> (Send Money)\n• Rocket: সাময়িকভাবে বন্ধ\n• Upay: <code>${accounts.upay}</code> (Send Money)\n\nসবগুলো Personal Account.\n\nপেমেন্ট পদ্ধতি বাছুন:`
    : `➕ <b>Add Balance</b>\n\n<b>Available payment options:</b>\n\n• bKash: <code>${accounts.bkash}</code> (Send Money)\n• Nagad: <code>${accounts.nagad}</code> (Send Money)\n• Rocket: temporarily unavailable\n• Upay: <code>${accounts.upay}</code> (Send Money)\n\nAll are personal accounts.\n\nChoose your payment method:`;
  const instructions = await botText(env, `payment_intro_${lang}`, fallback, accounts);
  await sendMessage(env, chatId, instructions, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🟥 bKash", callback_data: "pay_provider:bkash" },
          { text: "🟧 NAGAD", callback_data: "pay_provider:nagad" },
        ],
        [
          { text: "🟪 Rocket unavailable", callback_data: "pay_provider:rocket" },
          { text: "🟨 upay", callback_data: "pay_provider:upay" },
        ],
      ],
    },
  });
}

async function selectPaymentProvider(env, chatId, userId, provider) {
  const lang = await getLanguage(env, userId);
  if (!ACTIVE_PAYMENT_PROVIDERS.includes(provider)) {
    await clearState(env, userId);
    await sendMessage(env, chatId, lang === "bn"
      ? "❌ এই পেমেন্ট মেথডটি সাময়িকভাবে বন্ধ আছে। অনুগ্রহ করে bKash, NAGAD অথবা upay ব্যবহার করুন।"
      : "❌ This payment method is temporarily unavailable. Please use bKash, NAGAD, or upay.");
    return;
  }
  await setState(env, userId, { state: "awaiting_payment_amount", payment_provider: provider });
  const account = await paymentAccount(env, provider);
  const fallback = lang === "bn"
    ? `💳 <b>${provider.toUpperCase()}</b>\n\nSend Money করুন: <code>${account}</code>\nAccount type: Personal\n\nBDT-তে পেমেন্ট এমাউন্ট লিখুন।\nউদাহরণ: <code>500</code>`
    : `💳 <b>${provider.toUpperCase()}</b>\n\nSend Money to: <code>${account}</code>\nAccount type: Personal\n\nSend the payment amount in BDT.\nExample: <code>500</code>`;
  await sendMessage(env, chatId, await botText(env, `payment_provider_${lang}`, fallback, {
    provider: provider.toUpperCase(),
    account,
  }));
}

async function handlePaymentAmount(env, chatId, userId, text, state) {
  const amount = Math.round(Number(text.replaceAll(",", "")));
  if (!Number.isFinite(amount) || amount <= 0) {
    await sendMessage(env, chatId, "❌ Send a valid BDT amount, for example: 500");
    return;
  }
  await setState(env, userId, { state: "awaiting_transaction_id", payment_provider: state.payment_provider, payment_amount_bdt: amount });
  await sendMessage(env, chatId, `✅ Amount set: <b>${money(amount)}</b>\n\nNow send your <b>${state.payment_provider.toUpperCase()}</b> transaction ID.`);
}

async function handleTransactionId(env, chatId, userId, transactionId, state) {
  const normalized = normalizeTransactionId(transactionId);
  if (!normalized) {
    await sendMessage(env, chatId, "❌ Send a valid transaction ID.");
    return;
  }
  if (!(await consumePaymentAttempt(env, userId))) {
    await sendMessage(env, chatId, "❌ Too many transaction ID checks. Please wait 5 minutes and try again.");
    return;
  }
  const localClaim = await env.DB.prepare("SELECT 1 FROM claimed_payments WHERE transaction_id = ?").bind(normalized).first();
  if (localClaim) {
    await recordPaymentVerificationRejection(env, chatId, userId, "local_claim_exists");
    return;
  }
  try {
    const payment = await findFirestorePayment(env, normalized);
    if (!payment) {
      await recordPaymentVerificationRejection(env, chatId, userId, "payment_not_found");
      return;
    }
    const expectedProvider = state.payment_provider;
    const expectedAmount = Number(state.payment_amount_bdt || 0);
    const actualAmount = Math.round(payment.amount_bdt);
    if (payment.provider !== expectedProvider) {
      await recordPaymentVerificationRejection(env, chatId, userId, "provider_mismatch");
      return;
    }
    if (actualAmount !== expectedAmount) {
      await recordPaymentVerificationRejection(env, chatId, userId, "amount_mismatch");
      return;
    }
    if (await firestoreClaimExists(env, normalized)) {
      await recordPaymentVerificationRejection(env, chatId, userId, "firestore_claim_exists");
      return;
    }
    await createFirestoreClaim(env, payment, userId, actualAmount);
    await env.DB.prepare("INSERT INTO claimed_payments (transaction_id, telegram_id, amount_bdt, provider, source_document) VALUES (?, ?, ?, ?, ?)")
      .bind(payment.transaction_id, userId, actualAmount, payment.provider, payment.document_name)
      .run();
    const newBalance = await addBalance(env, userId, actualAmount);
    await clearState(env, userId);
    await sendMessage(env, chatId, `✅ <b>Payment verified</b>\n\n🏦 Provider: <b>${payment.provider.toUpperCase()}</b>\n💳 Amount: <b>${money(actualAmount)}</b>\n💵 Credited: <b>${money(actualAmount)}</b>\n💰 New balance: <b>${money(newBalance)}</b>`);
  } catch (error) {
    if (error.message === "invalid_payment_provider" || error.message === "This transaction ID was already used.") {
      await recordPaymentVerificationRejection(env, chatId, userId, "invalid_or_already_claimed");
      return;
    }
    console.error(JSON.stringify({
      event: "payment_verification_backend_failed",
      user_id: userId,
      error: error?.message || String(error),
    }));
    await sendPaymentVerificationUnavailable(env, chatId, userId);
  }
}

async function recordPaymentVerificationRejection(env, chatId, userId, reason) {
  console.warn(JSON.stringify({ event: "payment_verification_rejected", user_id: userId, reason }));
  const lang = await getLanguage(env, userId);
  await sendMessage(env, chatId, paymentVerificationRejectionText(lang), {
    reply_markup: { inline_keyboard: [[{
      text: lang === "bn" ? "📞 সাপোর্ট" : "📞 Contact Support",
      url: env.SUPPORT_URL,
    }]] },
  });
}

function paymentVerificationRejectionText(lang) {
  return lang === "bn"
    ? "❌ <b>পেমেন্ট যাচাই করা যায়নি</b>\n\nTransaction ID, নির্বাচিত wallet অথবা amount-এর তথ্য মিলছে না। সব তথ্য ভালোভাবে যাচাই করে আবার চেষ্টা করুন।"
    : "❌ <b>Payment could not be verified</b>\n\nThe transaction ID, selected wallet, or entered amount does not match. Check all details carefully and try again.";
}

async function sendPaymentVerificationUnavailable(env, chatId, userId) {
  const lang = await getLanguage(env, userId);
  await sendMessage(env, chatId, paymentVerificationUnavailableText(lang), {
    reply_markup: { inline_keyboard: [[{
      text: lang === "bn" ? "📞 সাপোর্ট" : "📞 Contact Support",
      url: env.SUPPORT_URL,
    }]] },
  });
}

function paymentVerificationUnavailableText(lang) {
  return lang === "bn"
    ? "⚠️ <b>পেমেন্ট যাচাই সাময়িকভাবে বন্ধ</b>\n\nকিছুক্ষণ পর আবার চেষ্টা করুন। আপনার কোনো গোপন payment তথ্য দেখানো হয়নি।"
    : "⚠️ <b>Payment verification is temporarily unavailable</b>\n\nPlease try again shortly. No private payment details were displayed.";
}

async function showHistory(env, chatId, userId) {
  try {
    const lang = await getLanguage(env, userId);
    const [ordersResult, summary] = await env.DB.batch([
      env.DB.prepare("SELECT product_key, variant_key, quantity, charged_bdt, provider_order_id, created_at FROM local_orders WHERE telegram_id = ? ORDER BY id DESC LIMIT 10").bind(userId),
      env.DB.prepare("SELECT COUNT(*) AS total_orders, COALESCE(SUM(charged_bdt), 0) AS total_spent FROM local_orders WHERE telegram_id = ?").bind(userId),
    ]);
    const orders = ordersResult.results || [];
    const totals = summary.results?.[0] || {};
    const lines = [];
    if (!orders.length) lines.push(lang === "bn" ? "এখনও কোনো অর্ডার নেই।" : "No orders yet.");
    for (const order of orders.slice(0, 10)) {
      const variant = order.variant_key ? ` / ${escapeHtml(order.variant_key)}` : "";
      lines.push(`• <b>${escapeHtml(order.product_key)}</b>${variant} × ${order.quantity} — ${money(order.charged_bdt)}`);
    }
    const fallback = lang === "bn"
      ? `📜 <b>আপনার ক্রয় ইতিহাস</b>\n🧾 মোট অর্ডার: <b>${totals.total_orders || 0}</b>\n💵 মোট খরচ: <b>${money(totals.total_spent || 0)}</b>\n\n${lines.join("\n")}`
      : `📜 <b>Your Purchase History</b>\n🧾 Total orders: <b>${totals.total_orders || 0}</b>\n💵 Total spent: <b>${money(totals.total_spent || 0)}</b>\n\n${lines.join("\n")}`;
    await sendMessage(env, chatId, await botText(env, `history_${lang}`, fallback, {
      total_orders: totals.total_orders || 0,
      total_spent: money(totals.total_spent || 0),
      history_lines: lines.map((line) => line.replace(/<\/?b>/g, "")).join("\n"),
    }));
  } catch (error) {
    await sendMessage(env, chatId, `❌ ${escapeHtml(error.message)}`);
  }
}

async function showRefer(env, chatId, userId) {
  const me = await telegram(env, "getMe", {});
  await sendMessage(env, chatId, `🎁 <b>Refer & Earn</b>\n\nShare your link:\nhttps://t.me/${me.result.username}?start=${userId}`);
}

async function showSupport(env, chatId, userId) {
  const lang = await getLanguage(env, userId);
  const fallback = lang === "bn" ? "📞 সাহায্য প্রয়োজন? সাপোর্টে যোগাযোগ করুন:" : "📞 Need help? Contact support:";
  const supportUrl = await botSettingValue(env, "support_url", env.SUPPORT_URL);
  await sendMessage(env, chatId, await botText(env, `support_${lang}`, fallback), {
    reply_markup: { inline_keyboard: [[{ text: "📞 Contact Support", url: supportUrl }]] },
  });
}

async function sendServiceUnavailable(env, chatId) {
  await sendMessage(env, chatId, "❌ Service is currently unavailable. Please contact admin.", {
    reply_markup: {
      inline_keyboard: [[{ text: "📞 Contact Admin", url: env.SUPPORT_URL }]],
    },
  });
}

async function adminStats(env, chatId) {
  const users = await env.DB.prepare("SELECT COUNT(*) AS n FROM users").first();
  const balance = await env.DB.prepare("SELECT COALESCE(SUM(balance_bdt), 0) AS n FROM users").first();
  const claims = await env.DB.prepare("SELECT COUNT(*) AS n FROM claimed_payments").first();
  const orders = await env.DB.prepare("SELECT COUNT(*) AS n FROM local_orders").first();
  const charged = await env.DB.prepare("SELECT COALESCE(SUM(charged_bdt), 0) AS n FROM local_orders").first();
  await sendMessage(env, chatId, `Admin Stats\n\nUsers: ${users.n}\nUser balances: ${money(balance.n)}\nClaimed payments: ${claims.n}\nLocal orders: ${orders.n}\nLocal charged: ${money(charged.n)}`);
}

async function adminBalanceAdd(env, chatId, text) {
  const [, id, amount] = text.split(/\s+/);
  const newBalance = await addBalance(env, Number(id), Math.round(Number(amount)));
  await sendMessage(env, chatId, `Added ${money(amount)}. New balance: ${money(newBalance)}`);
}

async function adminBalanceDeduct(env, chatId, text) {
  const [, id, amount] = text.split(/\s+/);
  const newBalance = await deductBalance(env, Number(id), Math.round(Number(amount)));
  await sendMessage(env, chatId, `Deducted ${money(amount)}. New balance: ${money(newBalance)}`);
}

async function adminBalanceSet(env, chatId, text) {
  const [, id, amount] = text.split(/\s+/);
  const newBalance = await setBalance(env, Number(id), Math.round(Number(amount)));
  await sendMessage(env, chatId, `Balance set to ${money(newBalance)}`);
}

async function adminPriceHelp(env, chatId) {
  await sendMessage(env, chatId, [
    "💵 <b>Fixed Price Commands</b>",
    "",
    "Set a product price:",
    "<code>/price_set PRODUCT_KEY PRICE_BDT</code>",
    "",
    "Set a variant-specific price:",
    "<code>/price_set PRODUCT_KEY VARIANT_KEY PRICE_BDT</code>",
    "",
    "List configured prices: <code>/prices</code>",
    "Show product and variant keys: <code>/price_catalog</code>",
    "Remove a product price: <code>/price_remove PRODUCT_KEY</code>",
    "Remove a variant price: <code>/price_remove PRODUCT_KEY VARIANT_KEY</code>",
    "",
    "A base product price is also used for variants that do not have their own price.",
  ].join("\n"));
}

async function adminPriceSet(env, chatId, adminId, text) {
  const parts = text.split(/\s+/);
  if (parts.length !== 3 && parts.length !== 4) {
    await adminPriceHelp(env, chatId);
    return;
  }
  const productKey = normalizePriceKey(parts[1]);
  const variantKey = parts.length === 4 ? normalizePriceKey(parts[2]) : "";
  const amountText = parts.at(-1);
  const priceBdt = Number(amountText);
  if (!productKey || (parts.length === 4 && !variantKey) || !/^\d+$/.test(amountText) || !Number.isSafeInteger(priceBdt) || priceBdt < 1 || priceBdt > 10_000_000) {
    await sendMessage(env, chatId, "❌ Invalid product key, variant key, or price. The price must be a whole number from 1 to 10,000,000 BDT.");
    return;
  }
  await env.DB.prepare(`
    INSERT INTO product_prices (product_key, variant_key, price_bdt, updated_by, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(product_key, variant_key) DO UPDATE SET
      price_bdt = excluded.price_bdt,
      updated_by = excluded.updated_by,
      updated_at = CURRENT_TIMESTAMP
  `).bind(productKey, variantKey, priceBdt, adminId).run();
  const target = variantKey ? `${productKey} / ${variantKey}` : productKey;
  await sendMessage(env, chatId, `✅ Fixed price for <code>${escapeHtml(target)}</code> set to <b>${money(priceBdt)}</b>.`);
}

async function adminPriceRemove(env, chatId, text) {
  const parts = text.split(/\s+/);
  if (parts.length !== 2 && parts.length !== 3) {
    await adminPriceHelp(env, chatId);
    return;
  }
  const productKey = normalizePriceKey(parts[1]);
  const variantKey = parts.length === 3 ? normalizePriceKey(parts[2]) : "";
  if (!productKey || (parts.length === 3 && !variantKey)) {
    await sendMessage(env, chatId, "❌ Invalid product key or variant key.");
    return;
  }
  const result = await env.DB.prepare("DELETE FROM product_prices WHERE product_key = ? AND variant_key = ?")
    .bind(productKey, variantKey)
    .run();
  const target = variantKey ? `${productKey} / ${variantKey}` : productKey;
  const message = result.meta?.changes
    ? `✅ Removed the fixed price for <code>${escapeHtml(target)}</code>.`
    : `ℹ️ No fixed price was configured for <code>${escapeHtml(target)}</code>.`;
  await sendMessage(env, chatId, message);
}

async function adminPriceList(env, chatId) {
  const result = await env.DB.prepare("SELECT product_key, variant_key, price_bdt FROM product_prices ORDER BY product_key, variant_key LIMIT 51").all();
  const prices = result.results || [];
  if (!prices.length) {
    await sendMessage(env, chatId, "No fixed prices are configured yet. Use <code>/price_help</code> for instructions.");
    return;
  }
  const lines = ["💵 <b>Configured Fixed Prices</b>", ""];
  for (const price of prices.slice(0, 50)) {
    const target = price.variant_key ? `${price.product_key} / ${price.variant_key}` : price.product_key;
    lines.push(`• <code>${escapeHtml(target)}</code>: <b>${money(price.price_bdt)}</b>`);
  }
  if (prices.length > 50) lines.push("", "Showing the first 50 prices.");
  await sendMessageLines(env, chatId, lines);
}

async function adminPriceCatalog(env, chatId) {
  try {
    const payload = await qvRequest(env, "GET", "/products");
    const products = payload.products || [];
    const lines = ["🛍️ <b>Product Price Catalog</b>", "", "Use the values inside <code>code boxes</code> with <code>/price_set</code>.", ""];
    for (const product of products.slice(0, 20)) {
      lines.push(`• ${escapeHtml(product.name || product.productKey)}: <code>${escapeHtml(product.productKey)}</code>`);
      for (const variant of (product.variants || []).slice(0, 5)) {
        lines.push(`  ↳ ${escapeHtml(variant.name || variant.key)}: <code>${escapeHtml(variant.key)}</code>`);
      }
    }
    if (!products.length) lines.push("No products are currently available from the provider.");
    if (products.length > 20) lines.push("", "Showing the first 20 products.");
    await sendMessageLines(env, chatId, lines);
  } catch (error) {
    await sendMessage(env, chatId, `❌ Could not load the product catalog: ${escapeHtml(error.message)}`);
  }
}

async function qvRequest(env, method, path, body = null, configOverride = null) {
  const config = configOverride || await loadSellerApiConfig(env);
  if (!config.apiKey) throw new Error("seller_api_key_required");
  const request = sellerRequestDescriptor(config, path, body);
  const headers = { accept: "application/json" };
  headers[config.authHeader] = config.authPrefix ? `${config.authPrefix} ${config.apiKey}` : config.apiKey;
  if (request.body) headers["content-type"] = "application/json";

  const response = await fetch(`${config.baseUrl}${request.path}`, {
    method,
    headers,
    body: request.body ? JSON.stringify(request.body) : null,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const providerMessage = readFirstJsonPath(payload, config.mapping.errorMessage);
    const error = new Error(String(providerMessage || `Seller API error ${response.status}`));
    error.status = response.status;
    error.payload = payload;
    error.path = path;
    error.code = "seller_request_failed";
    throw error;
  }
  try {
    return normalizeSellerResponse(payload, request.kind, config.mapping);
  } catch (error) {
    error.status = response.status;
    error.path = path;
    error.code = "seller_response_mapping_failed";
    throw error;
  }
}

function sellerRequestDescriptor(config, logicalPath, body) {
  if (logicalPath === "/products") {
    return { kind: "products", path: config.endpoints.products, body: null };
  }
  if (logicalPath.startsWith("/products/")) {
    const encodedKey = logicalPath.slice("/products/".length);
    const productKey = decodeURIComponent(encodedKey);
    if (!normalizePriceKey(productKey)) throw new Error("seller_invalid_product_key");
    return {
      kind: "product",
      path: config.endpoints.product.replaceAll("{productKey}", encodeURIComponent(productKey)),
      body: null,
    };
  }
  if (logicalPath === "/purchase") {
    const source = dropNulls(body || {});
    const requestBody = {
      [config.mapping.requestProductKey]: source.productKey,
      [config.mapping.requestQuantity]: source.quantity,
    };
    if (source.variantKey) requestBody[config.mapping.requestVariantKey] = source.variantKey;
    return { kind: "purchase", path: config.endpoints.purchase, body: dropNulls(requestBody) };
  }
  if (logicalPath.startsWith("/orders")) return { kind: "orders", path: config.endpoints.orders, body: null };
  if (logicalPath === "/balance") return { kind: "balance", path: config.endpoints.balance, body: null };
  throw new Error("seller_unknown_endpoint");
}

function normalizeSellerResponse(payload, kind, mapping) {
  if (kind === "products") {
    const source = readJsonPath(payload, mapping.products);
    const products = Array.isArray(source) ? source : Array.isArray(payload) ? payload : null;
    if (!products) throw new Error("seller_invalid_products_response");
    return { products: products.map((product) => normalizeSellerProduct(product, mapping)).filter(Boolean) };
  }
  if (kind === "product") {
    const source = readJsonPath(payload, mapping.product) ?? payload;
    const product = normalizeSellerProduct(source, mapping);
    if (!product) throw new Error("seller_invalid_product_response");
    return { product };
  }
  if (kind === "purchase") {
    const source = readJsonPath(payload, mapping.order) ?? payload;
    if (!source || typeof source !== "object" || Array.isArray(source)) throw new Error("seller_invalid_purchase_response");
    return { order: normalizeSellerOrder(source, mapping) };
  }
  return payload;
}

function normalizeSellerProduct(source, mapping) {
  if (!source || typeof source !== "object" || Array.isArray(source)) return null;
  const productKey = normalizePriceKey(readJsonPath(source, mapping.productKey));
  if (!productKey) return null;
  const rawVariants = readJsonPath(source, mapping.variants);
  const variants = Array.isArray(rawVariants) ? rawVariants.map((variant) => {
    if (!variant || typeof variant !== "object" || Array.isArray(variant)) return null;
    const key = normalizePriceKey(readJsonPath(variant, mapping.variantKey));
    if (!key) return null;
    return {
      key,
      name: String(readJsonPath(variant, mapping.variantName) || key),
      price: nullableNumber(readJsonPath(variant, mapping.variantPrice)),
      stock: nullableNumber(readJsonPath(variant, mapping.variantStock)),
      inStock: Boolean(readJsonPath(variant, mapping.variantInStock)),
    };
  }).filter(Boolean) : [];
  return {
    productKey,
    name: String(readJsonPath(source, mapping.productName) || productKey),
    description: String(readJsonPath(source, mapping.productDescription) || ""),
    warranty: String(readJsonPath(source, mapping.productWarranty) || ""),
    price: nullableNumber(readJsonPath(source, mapping.productPrice)),
    stock: nullableNumber(readJsonPath(source, mapping.productStock)),
    inStock: Boolean(readJsonPath(source, mapping.productInStock)),
    variants,
  };
}

function normalizeSellerOrder(source, mapping) {
  const rawItems = readJsonPath(source, mapping.orderItems);
  const items = Array.isArray(rawItems) ? rawItems.map((item) => normalizeSellerOrderItem(item, mapping)).filter(Boolean) : [];
  const firstItemOrderId = items.find((item) => item.orderId)?.orderId || "";
  return {
    orderId: String(readFirstJsonPath(source, mapping.orderId) || firstItemOrderId),
    requested: nullableNumber(readJsonPath(source, mapping.orderRequested)),
    fulfilled: nullableNumber(readJsonPath(source, mapping.orderFulfilled)),
    items,
  };
}

function normalizeSellerOrderItem(source, mapping) {
  if (!source || typeof source !== "object" || Array.isArray(source)) return null;
  const rawFields = readJsonPath(source, mapping.itemFields);
  const fields = Array.isArray(rawFields) ? rawFields.map((field) => ({
    name: String(readJsonPath(field, mapping.fieldName) || "value"),
    label: String(readJsonPath(field, mapping.fieldLabel) || readJsonPath(field, mapping.fieldName) || "Value"),
    value: String(readJsonPath(field, mapping.fieldValue) ?? ""),
  })) : [];
  const rawData = readJsonPath(source, mapping.itemData);
  const data = rawData && typeof rawData === "object" && !Array.isArray(rawData) ? rawData : {};
  return {
    orderId: String(readFirstJsonPath(source, mapping.itemOrderId) || ""),
    fields,
    data,
  };
}

async function loadSellerApiConfig(env) {
  let row = null;
  try {
    row = await env.DB.prepare(`SELECT provider_name, base_url, auth_header, auth_prefix, endpoints_json,
      mapping_json, encrypted_api_key, updated_at FROM seller_api_config WHERE id = 1`).first();
  } catch (error) {
    console.warn(JSON.stringify({ event: "seller_config_fallback", error: error?.message || String(error) }));
  }

  const endpoints = { ...SELLER_API_DEFAULT_ENDPOINTS, ...parseJsonObject(row?.endpoints_json) };
  const mapping = { ...SELLER_API_DEFAULT_MAPPING, ...parseJsonObject(row?.mapping_json) };
  let apiKey = "";
  let apiKeySource = "missing";
  if (row?.encrypted_api_key) {
    try {
      apiKey = await decryptSellerApiKey(row.encrypted_api_key, sellerEncryptionSecret(env));
      apiKeySource = "manager";
    } catch (error) {
      console.error(JSON.stringify({ event: "seller_api_key_decrypt_failed", error: error?.message || String(error) }));
    }
  }
  if (!apiKey && env.QUANTUM_VAULT_API_KEY) {
    apiKey = String(env.QUANTUM_VAULT_API_KEY);
    apiKeySource = "environment";
  }
  const config = validateSellerApiConfig({
    providerName: row?.provider_name || "Quantum Vault",
    baseUrl: row?.base_url || env.QUANTUM_VAULT_BASE_URL || SELLER_API_DEFAULT_BASE_URL,
    authHeader: row?.auth_header || "X-API-Key",
    authPrefix: row?.auth_prefix || "",
    endpoints,
    mapping,
  }, { apiKey });
  return {
    ...config,
    apiKey,
    apiKeySource,
    encryptedApiKey: row?.encrypted_api_key || null,
    updatedAt: row?.updated_at || null,
  };
}

function validateSellerApiConfig(input, base = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("seller_invalid_config");
  const providerName = String(input.providerName || base.providerName || "Seller API").trim();
  if (!providerName || providerName.length > 80) throw new Error("seller_invalid_name");

  let url;
  try {
    url = new URL(String(input.baseUrl || base.baseUrl || SELLER_API_DEFAULT_BASE_URL));
  } catch {
    throw new Error("seller_invalid_base_url");
  }
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.hostname === "localhost") {
    throw new Error("seller_invalid_base_url");
  }
  const baseUrl = url.toString().replace(/\/+$/, "");
  const authHeader = String(input.authHeader || base.authHeader || "X-API-Key").trim();
  const authPrefix = String(input.authPrefix ?? base.authPrefix ?? "").trim();
  if (!/^[!#$%&'*+.^_`|~0-9A-Za-z-]{1,64}$/.test(authHeader) || (authPrefix && !/^[A-Za-z][A-Za-z0-9_-]{0,31}$/.test(authPrefix))) {
    throw new Error("seller_invalid_auth");
  }

  const endpoints = { ...SELLER_API_DEFAULT_ENDPOINTS, ...(base.endpoints || {}), ...(input.endpoints || {}) };
  for (const [name, value] of Object.entries(endpoints)) {
    const path = String(value || "").trim();
    if (!path.startsWith("/") || path.length > 300 || /\s|:\/\//.test(path)) throw new Error(`seller_invalid_endpoint_${name}`);
    endpoints[name] = path;
  }
  if (!endpoints.product.includes("{productKey}")) throw new Error("seller_product_placeholder_required");

  const mapping = { ...SELLER_API_DEFAULT_MAPPING, ...(base.mapping || {}), ...(input.mapping || {}) };
  const requestFields = new Set(["requestProductKey", "requestVariantKey", "requestQuantity"]);
  for (const [name, value] of Object.entries(mapping)) {
    const path = String(value ?? "").trim();
    if (requestFields.has(name)) {
      if (!/^[A-Za-z_][A-Za-z0-9_-]{0,99}$/.test(path)) throw new Error(`seller_invalid_mapping_${name}`);
    } else if (!validJsonPathList(path)) {
      throw new Error(`seller_invalid_mapping_${name}`);
    }
    mapping[name] = path;
  }

  const apiKey = String(input.apiKey || base.apiKey || "").trim();
  if (apiKey && (!/^\S{6,512}$/.test(apiKey))) throw new Error("seller_invalid_api_key");
  return { providerName, baseUrl, authHeader, authPrefix, endpoints, mapping, apiKey };
}

function publicSellerApiConfig(config) {
  return {
    provider_name: config.providerName,
    base_url: config.baseUrl,
    auth_header: config.authHeader,
    auth_prefix: config.authPrefix,
    endpoints: config.endpoints,
    mapping: config.mapping,
    api_key_configured: Boolean(config.apiKey || config.encryptedApiKey),
    api_key_source: config.apiKeySource || (config.encryptedApiKey ? "manager" : "missing"),
    updated_at: config.updatedAt || null,
  };
}

function parseJsonObject(value) {
  try {
    const parsed = JSON.parse(String(value || "{}"));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function validJsonPathList(value) {
  if (value === "") return true;
  if (value.length > 300) return false;
  return value.split(",").every((path) => /^[A-Za-z_][A-Za-z0-9_-]*(?:\.[A-Za-z_][A-Za-z0-9_-]*)*$/.test(path.trim()));
}

function readJsonPath(value, path) {
  const normalized = String(path || "").trim();
  if (!normalized) return value;
  let current = value;
  for (const segment of normalized.split(".")) {
    if (!current || typeof current !== "object" || !Object.prototype.hasOwnProperty.call(current, segment)) return undefined;
    current = current[segment];
  }
  return current;
}

function readFirstJsonPath(value, paths) {
  for (const path of String(paths || "").split(",").map((item) => item.trim()).filter(Boolean)) {
    const result = readJsonPath(value, path);
    if (result !== undefined && result !== null && result !== "") return result;
  }
  return undefined;
}

function nullableNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function sellerEncryptionSecret(env) {
  const secret = String(env.SELLER_CONFIG_ENCRYPTION_KEY || env.MANAGER_API_SECRET || "");
  if (secret.length < 16) throw new Error("seller_encryption_not_configured");
  return secret;
}

async function sellerEncryptionKey(secret) {
  const material = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`seller-api-config-v1:${secret}`));
  return crypto.subtle.importKey("raw", material, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

async function encryptSellerApiKey(apiKey, secret) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await sellerEncryptionKey(secret);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(apiKey));
  return `v1.${base64UrlBytes(iv)}.${base64UrlBytes(new Uint8Array(encrypted))}`;
}

async function decryptSellerApiKey(value, secret) {
  const [version, encodedIv, encodedCiphertext] = String(value || "").split(".");
  if (version !== "v1" || !encodedIv || !encodedCiphertext) throw new Error("invalid_encrypted_api_key");
  const key = await sellerEncryptionKey(secret);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64UrlDecode(encodedIv) },
    key,
    base64UrlDecode(encodedCiphertext),
  );
  return new TextDecoder().decode(decrypted);
}

function base64UrlDecode(value) {
  const normalized = String(value).replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function firestoreFetch(env, url, init = {}) {
  const token = await getFirebaseAccessToken(env);
  const headers = new Headers(init.headers || {});
  headers.set("authorization", `Bearer ${token}`);
  return fetch(url, { ...init, headers });
}

async function getFirebaseAccessToken(env) {
  const now = Math.floor(Date.now() / 1000);
  if (firebaseTokenCache && firebaseTokenCache.expiresAt - FIREBASE_TOKEN_EARLY_REFRESH_SECONDS > now) {
    return firebaseTokenCache.token;
  }
  if (!env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
    throw new Error("Firebase service account is not configured");
  }

  const header = base64UrlJson({ alg: "RS256", typ: "JWT" });
  const claims = base64UrlJson({
    iss: env.FIREBASE_CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/datastore",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  });
  const signingInput = `${header}.${claims}`;
  const privateKey = await importFirebasePrivateKey(env.FIREBASE_PRIVATE_KEY);
  const signature = await crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" },
    privateKey,
    new TextEncoder().encode(signingInput),
  );
  const assertion = `${signingInput}.${base64UrlBytes(new Uint8Array(signature))}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token) {
    throw new Error(`Firebase OAuth failed (${response.status})`);
  }
  firebaseTokenCache = {
    token: payload.access_token,
    expiresAt: now + Number(payload.expires_in || 3600),
  };
  return firebaseTokenCache.token;
}

async function importFirebasePrivateKey(pem) {
  const base64 = String(pem)
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    bytes,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

function base64UrlJson(value) {
  return base64UrlBytes(new TextEncoder().encode(JSON.stringify(value)));
}

function base64UrlBytes(bytes) {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function firestoreHealthCheck(env) {
  const collection = csv(env.FIREBASE_PAYMENTS_COLLECTION)[0] || "transactions";
  const url = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/${encodeURIComponent(collection)}?pageSize=1`;
  const response = await firestoreFetch(env, url);
  if (!response.ok) throw new Error(`Firebase health check failed (${response.status})`);
}

async function findFirestorePayment(env, transactionId) {
  const cached = await getCachedPaymentLookup(env, transactionId);
  if (cached?.status === "found") return cached.payment;
  if (cached?.status === "not_found") return null;
  if (cached?.status === "invalid_provider") throw new Error("invalid_payment_provider");

  for (const collection of csv(env.FIREBASE_PAYMENTS_COLLECTION)) {
    for (const field of TRANSACTION_FIELDS) {
      const payment = await queryFirestorePayment(env, collection, field, transactionId);
      if (payment) {
        await cachePaymentLookup(env, transactionId, "found", payment, PAYMENT_FOUND_CACHE_TTL_SECONDS);
        return payment;
      }
    }
  }
  await cachePaymentLookup(env, transactionId, "not_found", null, PAYMENT_NOT_FOUND_CACHE_TTL_SECONDS);
  return null;
}

async function queryFirestorePayment(env, collection, field, transactionId) {
  const url = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents:runQuery`;
  const body = {
    structuredQuery: {
      from: [{ collectionId: collection }],
      where: { fieldFilter: { field: { fieldPath: field }, op: "EQUAL", value: { stringValue: transactionId } } },
      limit: 1,
    },
  };
  const response = await firestoreFetch(env, url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  if (!response.ok) throw new Error(`Firebase lookup failed: ${await response.text()}`);
  const rows = await response.json();
  for (const row of rows) {
    if (row.document) {
      try {
        return parsePaymentDocument(row.document, transactionId);
      } catch (error) {
        if (error.message === "invalid_payment_provider") {
          await cachePaymentLookup(env, transactionId, "invalid_provider", null, PAYMENT_INVALID_CACHE_TTL_SECONDS);
        }
        throw error;
      }
    }
  }
  return null;
}

async function getCachedPaymentLookup(env, transactionId) {
  const now = unixNow();
  const row = await env.DB.prepare("SELECT * FROM payment_lookup_cache WHERE transaction_id = ? AND expires_at > ?")
    .bind(transactionId, now)
    .first();
  if (!row) return null;
  if (row.status === "found") {
    return {
      status: "found",
      payment: {
        transaction_id: row.transaction_id,
        amount_bdt: Number(row.amount_bdt || 0),
        provider: row.provider,
        document_name: row.source_document || "",
      },
    };
  }
  return { status: row.status };
}

async function cachePaymentLookup(env, transactionId, status, payment, ttlSeconds) {
  const now = unixNow();
  await env.DB.prepare(`
    INSERT INTO payment_lookup_cache (transaction_id, status, amount_bdt, provider, source_document, cached_at, expires_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(transaction_id) DO UPDATE SET
      status = excluded.status,
      amount_bdt = excluded.amount_bdt,
      provider = excluded.provider,
      source_document = excluded.source_document,
      cached_at = excluded.cached_at,
      expires_at = excluded.expires_at
  `).bind(
    transactionId,
    status,
    payment?.amount_bdt || null,
    payment?.provider || null,
    payment?.document_name || null,
    now,
    now + ttlSeconds,
  ).run();
}

async function consumePaymentAttempt(env, userId) {
  const now = unixNow();
  const windowStart = now - (now % PAYMENT_ATTEMPT_WINDOW_SECONDS);
  const row = await env.DB.prepare("SELECT window_start, attempt_count FROM payment_attempt_windows WHERE telegram_id = ?")
    .bind(userId)
    .first();
  if (!row || Number(row.window_start) !== windowStart) {
    await env.DB.prepare(`
      INSERT INTO payment_attempt_windows (telegram_id, window_start, attempt_count)
      VALUES (?, ?, 1)
      ON CONFLICT(telegram_id) DO UPDATE SET window_start = excluded.window_start, attempt_count = 1
    `).bind(userId, windowStart).run();
    return true;
  }
  if (Number(row.attempt_count) >= PAYMENT_ATTEMPT_LIMIT) return false;
  await env.DB.prepare("UPDATE payment_attempt_windows SET attempt_count = attempt_count + 1 WHERE telegram_id = ?")
    .bind(userId)
    .run();
  return true;
}

function parsePaymentDocument(document, fallbackTransactionId) {
  const flat = {};
  for (const [key, value] of Object.entries(document.fields || {})) flat[key] = firestoreValue(value);
  const providerText = PROVIDER_FIELDS.map((field) => String(flat[field] || "")).join(" ").toLowerCase();
  const provider = ELIGIBLE_PROVIDERS.find((item) => providerText.includes(item));
  if (!provider) throw new Error("invalid_payment_provider");
  const amount = firstNumber(flat, AMOUNT_FIELDS);
  if (amount <= 0) throw new Error("Payment found, but amount is missing or invalid.");
  return {
    transaction_id: firstText(flat, TRANSACTION_FIELDS) || fallbackTransactionId,
    amount_bdt: amount,
    provider,
    document_name: document.name || "",
  };
}

async function firestoreClaimExists(env, transactionId) {
  const url = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/${env.FIREBASE_CLAIMS_COLLECTION}/${encodeURIComponent(transactionId)}`;
  const response = await firestoreFetch(env, url);
  if (response.status === 404) return false;
  if (!response.ok) throw new Error(`Firebase claim lookup failed: ${await response.text()}`);
  return true;
}

async function createFirestoreClaim(env, payment, telegramId, amountBdt) {
  const url = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/${env.FIREBASE_CLAIMS_COLLECTION}?documentId=${encodeURIComponent(payment.transaction_id)}`;
  const body = {
    fields: {
      transactionId: { stringValue: payment.transaction_id },
      telegramId: { integerValue: String(telegramId) },
      amount: { integerValue: String(amountBdt) },
      provider: { stringValue: payment.provider },
      sourceDocument: { stringValue: payment.document_name },
      status: { stringValue: "used" },
      claimedAt: { timestampValue: new Date().toISOString() },
    },
  };
  const response = await firestoreFetch(env, url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  if (response.status === 409) throw new Error("This transaction ID was already used.");
  if (!response.ok) throw new Error(`Firebase claim write failed: ${await response.text()}`);
}

async function showReferWithStats(env, chatId, userId) {
  const me = await telegram(env, "getMe", {});
  const lang = await getLanguage(env, userId);
  const dashboard = await getReferralDashboard(env, userId);
  const link = `https://t.me/${me.result.username}?start=${userId}`;
  const referralLines = dashboard.referrals.length
    ? dashboard.referrals.map((item) => {
      const name = item.username ? `@${item.username}` : item.first_name || `User ${item.referred_id}`;
      return `• ${name} — ${item.purchase_count} purchase${Number(item.purchase_count) === 1 ? "" : "s"} — ${money(item.earned_bdt)}`;
    }).join("\n")
    : (lang === "bn" ? "এখনও কোনো referral নেই।" : "No referrals yet.");
  const withdrawalLines = dashboard.withdrawals.length
    ? dashboard.withdrawals.map((item) => {
      const icon = item.status === "paid" ? "✅" : item.status === "rejected" ? "❌" : "⏳";
      return `${icon} ${money(item.amount_bdt)} — ${item.status} — ${String(item.created_at).slice(0, 10)}`;
    }).join("\n")
    : (lang === "bn" ? "এখনও কোনো withdrawal নেই।" : "No withdrawals yet.");
  const fallback = lang === "bn"
    ? `🎁 <b>রেফার করে আয় করুন</b>\n\nআপনার referral থেকে প্রতিটি completed purchase-এ <b>${money(REFERRAL_REWARD_BDT)}</b> আয় হবে।\n\n🔗 আপনার লিংক:\n${link}\n\n👥 রেফার করা user: <b>${dashboard.referrals.length}</b>\n🛍️ তাদের purchase: <b>${dashboard.wallet.purchase_count}</b>\n💰 মোট আয়: <b>${money(dashboard.wallet.total_earned_bdt)}</b>\n✅ Withdraw করা যাবে: <b>${money(dashboard.wallet.available_bdt)}</b>\n⏳ Pending withdraw: <b>${money(dashboard.wallet.pending_bdt)}</b>\n\n<b>Referral activity</b>\n${escapeHtml(referralLines)}\n\n<b>সাম্প্রতিক withdrawal</b>\n${escapeHtml(withdrawalLines)}`
    : `🎁 <b>Refer & Earn</b>\n\nEarn <b>${money(REFERRAL_REWARD_BDT)}</b> for every completed purchase made by a referred user.\n\n🔗 Your link:\n${link}\n\n👥 Referred users: <b>${dashboard.referrals.length}</b>\n🛍️ Their purchases: <b>${dashboard.wallet.purchase_count}</b>\n💰 Total earned: <b>${money(dashboard.wallet.total_earned_bdt)}</b>\n✅ Available to withdraw: <b>${money(dashboard.wallet.available_bdt)}</b>\n⏳ Pending withdrawal: <b>${money(dashboard.wallet.pending_bdt)}</b>\n\n<b>Referral activity</b>\n${escapeHtml(referralLines)}\n\n<b>Recent withdrawals</b>\n${escapeHtml(withdrawalLines)}`;
  await sendMessage(env, chatId, await botText(env, `refer_${lang}`, fallback, {
    referral_link: link,
    referral_count: dashboard.referrals.length,
    purchase_count: dashboard.wallet.purchase_count,
    total_earned: money(dashboard.wallet.total_earned_bdt),
    available_balance: money(dashboard.wallet.available_bdt),
    pending_withdrawal: money(dashboard.wallet.pending_bdt),
    referral_lines: referralLines,
    withdrawal_lines: withdrawalLines,
  }), {
    reply_markup: { inline_keyboard: [
      [{ text: lang === "bn" ? "💸 bKash-এ Withdraw" : "💸 Withdraw to bKash", callback_data: "referral:withdraw" }],
      [{ text: lang === "bn" ? "📘 নিয়ম ও নির্দেশনা" : "📘 Guide and terms", callback_data: "referral:terms" }],
      [{ text: lang === "bn" ? "🔄 Dashboard refresh" : "🔄 Refresh dashboard", callback_data: "referral:dashboard" }],
    ] },
  });
}

async function showReferralTerms(env, chatId, userId) {
  const lang = await getLanguage(env, userId);
  const definition = MENU_RESPONSE_DEFINITIONS.referral_terms;
  const fallback = lang === "bn" ? definition.bn : definition.en;
  await sendMessage(env, chatId, await botText(env, `referral_terms_${lang}`, fallback), {
    reply_markup: { inline_keyboard: [[{
      text: lang === "bn" ? "↩️ রেফারেল ড্যাশবোর্ড" : "↩️ Referral dashboard",
      callback_data: "referral:dashboard",
    }]] },
  });
}

async function getReferralWalletSummary(env, userId) {
  const row = await env.DB.prepare(`SELECT
    (SELECT COUNT(*) FROM referral_rewards WHERE referrer_id = ?) AS purchase_count,
    (SELECT COALESCE(SUM(reward_bdt), 0) FROM referral_rewards WHERE referrer_id = ?) AS total_earned_bdt,
    (SELECT COALESCE(SUM(amount_bdt), 0) FROM referral_withdrawals WHERE telegram_id = ? AND status = 'pending') AS pending_bdt,
    (SELECT COALESCE(SUM(amount_bdt), 0) FROM referral_withdrawals WHERE telegram_id = ? AND status = 'paid') AS paid_bdt`)
    .bind(userId, userId, userId, userId).first();
  const totalEarned = Number(row?.total_earned_bdt || 0);
  const pending = Number(row?.pending_bdt || 0);
  const paid = Number(row?.paid_bdt || 0);
  return {
    purchase_count: Number(row?.purchase_count || 0),
    total_earned_bdt: totalEarned,
    pending_bdt: pending,
    paid_bdt: paid,
    available_bdt: Math.max(0, totalEarned - pending - paid),
  };
}

async function getReferralDashboard(env, userId) {
  const [referralResult, withdrawalResult] = await env.DB.batch([
    env.DB.prepare(`SELECT referrals.referred_id, users.username, users.first_name,
      COUNT(referral_rewards.id) AS purchase_count, COALESCE(SUM(referral_rewards.reward_bdt), 0) AS earned_bdt
      FROM referrals LEFT JOIN users ON users.telegram_id = referrals.referred_id
      LEFT JOIN referral_rewards ON referral_rewards.referred_id = referrals.referred_id
      WHERE referrals.referrer_id = ? AND referrals.status = 'completed'
      GROUP BY referrals.referred_id ORDER BY MAX(referral_rewards.created_at) DESC, referrals.completed_at DESC LIMIT 20`).bind(userId),
    env.DB.prepare(`SELECT id, amount_bdt, bkash_number, status, created_at FROM referral_withdrawals
      WHERE telegram_id = ? ORDER BY created_at DESC LIMIT 5`).bind(userId),
  ]);
  return {
    wallet: await getReferralWalletSummary(env, userId),
    referrals: referralResult.results || [],
    withdrawals: withdrawalResult.results || [],
  };
}

async function startReferralWithdrawal(env, chatId, userId) {
  const lang = await getLanguage(env, userId);
  const wallet = await getReferralWalletSummary(env, userId);
  if (wallet.available_bdt < 1) {
    await sendMessage(env, chatId, lang === "bn"
      ? `ℹ️ এখন withdraw করার মতো balance নেই। Available: <b>${money(wallet.available_bdt)}</b>`
      : `ℹ️ There is no balance available to withdraw yet. Available: <b>${money(wallet.available_bdt)}</b>`);
    return;
  }
  await setState(env, userId, { state: "awaiting_referral_withdraw_amount" });
  await sendMessage(env, chatId, lang === "bn"
    ? `💸 <b>Referral withdrawal</b>\n\nAvailable: <b>${money(wallet.available_bdt)}</b>\n\nকত টাকা withdraw করতে চান, শুধু amount লিখুন।\nউদাহরণ: <code>${Math.min(100, wallet.available_bdt)}</code>`
    : `💸 <b>Referral withdrawal</b>\n\nAvailable: <b>${money(wallet.available_bdt)}</b>\n\nSend only the amount you want to withdraw.\nExample: <code>${Math.min(100, wallet.available_bdt)}</code>`);
}

async function handleReferralWithdrawalAmount(env, chatId, userId, text) {
  const lang = await getLanguage(env, userId);
  if (!/^\d+$/.test(text)) {
    await sendMessage(env, chatId, lang === "bn" ? "❌ শুধু সম্পূর্ণ টাকার amount লিখুন।" : "❌ Send a whole-number amount only.");
    return;
  }
  const amount = Number(text);
  const wallet = await getReferralWalletSummary(env, userId);
  if (!Number.isSafeInteger(amount) || amount < 1 || amount > wallet.available_bdt) {
    await sendMessage(env, chatId, lang === "bn"
      ? `❌ Amount 1 থেকে ${money(wallet.available_bdt)}-এর মধ্যে হতে হবে।`
      : `❌ The amount must be between Tk 1 and ${money(wallet.available_bdt)}.`);
    return;
  }
  await setState(env, userId, { state: "awaiting_referral_withdraw_bkash", withdrawal_amount_bdt: amount });
  await sendMessage(env, chatId, lang === "bn"
    ? `✅ Amount: <b>${money(amount)}</b>\n\nএখন ১১ সংখ্যার personal bKash number লিখুন।\nউদাহরণ: <code>01XXXXXXXXX</code>`
    : `✅ Amount: <b>${money(amount)}</b>\n\nNow send the 11-digit personal bKash number.\nExample: <code>01XXXXXXXXX</code>`);
}

async function handleReferralWithdrawalBkash(env, chatId, userId, text, state) {
  const lang = await getLanguage(env, userId);
  const bkashNumber = String(text || "").replace(/[\s-]/g, "");
  if (!/^01[3-9]\d{8}$/.test(bkashNumber)) {
    await sendMessage(env, chatId, lang === "bn" ? "❌ সঠিক ১১ সংখ্যার bKash number লিখুন।" : "❌ Send a valid 11-digit bKash number.");
    return;
  }
  const amount = Number(state.withdrawal_amount_bdt || 0);
  const withdrawalId = crypto.randomUUID();
  const result = await env.DB.prepare(`INSERT INTO referral_withdrawals (id, telegram_id, amount_bdt, bkash_number)
    SELECT ?, ?, ?, ? WHERE ? <=
      (SELECT COALESCE(SUM(reward_bdt), 0) FROM referral_rewards WHERE referrer_id = ?)
      - (SELECT COALESCE(SUM(amount_bdt), 0) FROM referral_withdrawals WHERE telegram_id = ? AND status IN ('pending', 'paid'))`)
    .bind(withdrawalId, userId, amount, bkashNumber, amount, userId, userId).run();
  if (Number(result.meta?.changes || 0) !== 1) {
    await clearState(env, userId);
    await sendMessage(env, chatId, lang === "bn" ? "❌ Available balance পরিবর্তন হয়েছে। Dashboard খুলে আবার চেষ্টা করুন।" : "❌ Your available balance changed. Open the dashboard and try again.");
    return;
  }
  await clearState(env, userId);
  const wallet = await getReferralWalletSummary(env, userId);
  await sendMessage(env, chatId, lang === "bn"
    ? `✅ <b>Withdrawal request পাঠানো হয়েছে</b>\n\nAmount: <b>${money(amount)}</b>\nbKash: <code>${bkashNumber}</code>\nRequest: <code>${withdrawalId}</code>\n\nAdmin purchase details যাচাই করে payment করবে।`
    : `✅ <b>Withdrawal request submitted</b>\n\nAmount: <b>${money(amount)}</b>\nbKash: <code>${bkashNumber}</code>\nRequest: <code>${withdrawalId}</code>\n\nThe admin will verify the purchase details and send payment.`);
  await notifyAdminsOfWithdrawal(env, { id: withdrawalId, userId, amount, bkashNumber, wallet });
}

async function notifyAdminsOfWithdrawal(env, withdrawal) {
  const [profile, referrals, purchases] = await Promise.all([
    env.DB.prepare("SELECT username, first_name, last_name FROM users WHERE telegram_id = ?").bind(withdrawal.userId).first(),
    env.DB.prepare("SELECT COUNT(*) AS n FROM referrals WHERE referrer_id = ? AND status = 'completed'").bind(withdrawal.userId).first(),
    env.DB.prepare(`SELECT rewards.referred_id, users.username, users.first_name, orders.product_key, orders.variant_key,
      orders.quantity, orders.charged_bdt, rewards.reward_bdt, orders.created_at
      FROM referral_rewards AS rewards JOIN local_orders AS orders ON orders.id = rewards.local_order_id
      LEFT JOIN users ON users.telegram_id = rewards.referred_id
      WHERE rewards.referrer_id = ? ORDER BY rewards.created_at DESC LIMIT 40`).bind(withdrawal.userId).all(),
  ]);
  const displayName = profile?.username ? `@${profile.username}` : [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Unknown";
  const lines = [
    "💸 <b>New referral withdrawal request</b>",
    "",
    `<b>Request:</b> <code>${escapeHtml(withdrawal.id)}</code>`,
    `<b>User:</b> ${escapeHtml(displayName)} (<code>${escapeHtml(withdrawal.userId)}</code>)`,
    `<b>Amount:</b> ${money(withdrawal.amount)}`,
    `<b>bKash:</b> <code>${escapeHtml(withdrawal.bkashNumber)}</code>`,
    `<b>Referred users:</b> ${Number(referrals?.n || 0)}`,
    `<b>Rewarded purchases:</b> ${withdrawal.wallet.purchase_count}`,
    `<b>Total earned:</b> ${money(withdrawal.wallet.total_earned_bdt)}`,
    `<b>Still available:</b> ${money(withdrawal.wallet.available_bdt)}`,
    "",
    "<b>Purchase evidence</b>",
  ];
  for (const purchase of purchases.results || []) {
    const buyer = purchase.username ? `@${purchase.username}` : purchase.first_name || `User ${purchase.referred_id}`;
    const variant = purchase.variant_key ? ` / ${purchase.variant_key}` : "";
    lines.push(`• ${escapeHtml(buyer)} — ${escapeHtml(purchase.product_key)}${escapeHtml(variant)} × ${purchase.quantity} — order ${money(purchase.charged_bdt)} — reward ${money(purchase.reward_bdt)} — ${String(purchase.created_at).slice(0, 16)}`);
  }
  if (!(purchases.results || []).length) lines.push("No rewarded purchases were found.");
  lines.push("", "Review this request in Bot Manager → Referrals.");
  const adminIds = csv(env.ADMIN_IDS);
  await Promise.allSettled(adminIds.map((adminId) => sendMessageLines(env, adminId, lines)));
}

async function adminStatsWithReferrals(env, chatId) {
  const users = await env.DB.prepare("SELECT COUNT(*) AS n FROM users").first();
  const balance = await env.DB.prepare("SELECT COALESCE(SUM(balance_bdt), 0) AS n FROM users").first();
  const claims = await env.DB.prepare("SELECT COUNT(*) AS n FROM claimed_payments").first();
  const referrals = await env.DB.prepare("SELECT COUNT(*) AS n FROM referrals WHERE status = 'completed'").first();
  const orders = await env.DB.prepare("SELECT COUNT(*) AS n FROM local_orders").first();
  const charged = await env.DB.prepare("SELECT COALESCE(SUM(charged_bdt), 0) AS n FROM local_orders").first();
  await sendMessage(env, chatId, `Admin Stats\n\nUsers: ${users.n}\nUser balances: ${money(balance.n)}\nClaimed payments: ${claims.n}\nReferrals: ${referrals.n}\nLocal orders: ${orders.n}\nLocal charged: ${money(charged.n)}`);
}

async function recordPendingReferral(env, referredId, referrerId) {
  await ensureUser(env, referrerId);
  await env.DB.prepare("INSERT OR IGNORE INTO referrals (referred_id, referrer_id, status, completed_at) VALUES (?, ?, 'pending', NULL)")
    .bind(referredId, referrerId)
    .run();
}

async function completePendingReferral(env, referredId) {
  const referral = await env.DB.prepare("SELECT referred_id, referrer_id, status FROM referrals WHERE referred_id = ?")
    .bind(referredId)
    .first();
  if (!referral || referral.status === "completed") return;

  const result = await env.DB.prepare(`
    UPDATE referrals
    SET status = 'completed', completed_at = CURRENT_TIMESTAMP
    WHERE referred_id = ? AND status = 'pending'
  `).bind(referredId).run();
  if ((result.meta?.changes || 0) < 1) return;

  try {
    await createFirestoreReferral(env, referredId, referral.referrer_id);
  } catch (error) {
    console.warn("Firestore referral mirror failed", error?.message || error);
  }

  await notifySuccessfulReferral(env, referral.referrer_id, referredId);
}

async function createFirestoreReferral(env, referredId, referrerId) {
  const collection = env.FIREBASE_REFERRALS_COLLECTION || "referrals";
  const documentId = String(referredId);
  const url = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/${collection}?documentId=${encodeURIComponent(documentId)}`;
  const body = {
    fields: {
      referredId: { integerValue: String(referredId) },
      referrerId: { integerValue: String(referrerId) },
      status: { stringValue: "completed" },
      completedAt: { timestampValue: new Date().toISOString() },
    },
  };
  const response = await firestoreFetch(env, url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  if (response.status === 409) return;
  if (!response.ok) throw new Error(await response.text());
}

async function notifySuccessfulReferral(env, referrerId, referredId) {
  try {
    await sendMessage(env, referrerId, `🎉 <b>Successful referral!</b>\n\nA new user joined using your referral link and completed channel verification.\n\n👤 User ID: <code>${escapeHtml(referredId)}</code>`);
    await env.DB.prepare("UPDATE referrals SET notified_at = CURRENT_TIMESTAMP WHERE referred_id = ?")
      .bind(referredId)
      .run();
  } catch (error) {
    console.warn("Referral notification failed", error?.message || error);
  }
}

async function maybeAlertProviderPurchaseFailure(env, context) {
  if (!isProviderPurchaseError(context.error)) return;
  const reason = isProviderBalanceError(context.error)
    ? "Provider/main account may have insufficient balance"
    : "Provider purchase failed";
  const dedupeKey = `provider_purchase:${reason}:${context.productKey || ""}:${context.variantKey || ""}`;
  if (!(await shouldSendAdminAlert(env, dedupeKey, 10 * 60))) return;

  const message = [
    "🚨 <b>Provider Purchase Alert</b>",
    "",
    `<b>Reason:</b> ${escapeHtml(reason)}`,
    `<b>User:</b> <code>${escapeHtml(context.userId)}</code>`,
    `<b>Product:</b> <code>${escapeHtml(context.productKey || "unknown")}</code>`,
    `<b>Variant:</b> <code>${escapeHtml(context.variantKey || "-")}</code>`,
    `<b>Quantity:</b> <code>${escapeHtml(context.quantity || 1)}</code>`,
    `<b>Status:</b> <code>${escapeHtml(context.error.status || "-")}</code>`,
    `<b>Error:</b> ${escapeHtml(context.error.message || "Unknown provider error")}`,
    "",
    "Check your Quantum Vault/main account balance and provider dashboard.",
  ].join("\n");

  await notifyAdmins(env, message, context.chatId);
}

function isProviderPurchaseError(error) {
  return error?.path === "/purchase";
}

function isProviderBalanceError(error) {
  const text = `${error?.message || ""} ${JSON.stringify(error?.payload || {})}`.toLowerCase();
  return [
    "balance",
    "insufficient",
    "not enough",
    "fund",
    "credit",
    "wallet",
  ].some((needle) => text.includes(needle));
}

async function shouldSendAdminAlert(env, dedupeKey, ttlSeconds) {
  const now = unixNow();
  const key = `alert:${dedupeKey}`;
  const row = await env.DB.prepare("SELECT expires_at FROM payment_lookup_cache WHERE transaction_id = ? AND expires_at > ?")
    .bind(key, now)
    .first();
  if (row) return false;
  await env.DB.prepare(`
    INSERT INTO payment_lookup_cache (transaction_id, status, cached_at, expires_at)
    VALUES (?, 'admin_alert', ?, ?)
    ON CONFLICT(transaction_id) DO UPDATE SET
      status = excluded.status,
      cached_at = excluded.cached_at,
      expires_at = excluded.expires_at
  `).bind(key, now, now + ttlSeconds).run();
  return true;
}

async function processAnnouncementQueue(env) {
  await env.DB.prepare(`UPDATE announcement_deliveries SET status = 'pending', started_at = NULL
    WHERE status = 'processing' AND started_at < datetime('now', '-5 minutes')`).run();
  const campaign = await env.DB.prepare(`SELECT campaigns.id, campaigns.message_text, campaigns.button_label, campaigns.button_url
    FROM announcement_campaigns AS campaigns
    WHERE campaigns.status IN ('queued', 'sending') AND EXISTS (
      SELECT 1 FROM announcement_deliveries AS deliveries
      WHERE deliveries.campaign_id = campaigns.id AND deliveries.status = 'pending'
    ) ORDER BY campaigns.created_at LIMIT 1`).first();
  if (!campaign) return;

  await env.DB.prepare(`UPDATE announcement_campaigns SET status = 'sending', started_at = COALESCE(started_at, CURRENT_TIMESTAMP)
    WHERE id = ?`).bind(campaign.id).run();
  const pending = await env.DB.prepare(`SELECT telegram_id, attempts FROM announcement_deliveries
    WHERE campaign_id = ? AND status = 'pending' ORDER BY telegram_id LIMIT ?`)
    .bind(campaign.id, ANNOUNCEMENT_BATCH_SIZE).all();
  const extra = campaign.button_label && campaign.button_url
    ? { reply_markup: { inline_keyboard: [[{ text: campaign.button_label, url: campaign.button_url }]] } }
    : {};

  for (const delivery of pending.results || []) {
    const claim = await env.DB.prepare(`UPDATE announcement_deliveries SET status = 'processing', attempts = attempts + 1,
      started_at = CURRENT_TIMESTAMP, error_text = NULL WHERE campaign_id = ? AND telegram_id = ? AND status = 'pending'`)
      .bind(campaign.id, delivery.telegram_id).run();
    if (Number(claim.meta?.changes || 0) !== 1) continue;
    try {
      await sendMessage(env, delivery.telegram_id, renderEditableBotText(campaign.message_text), extra);
      await env.DB.prepare(`UPDATE announcement_deliveries SET status = 'delivered', delivered_at = CURRENT_TIMESTAMP
        WHERE campaign_id = ? AND telegram_id = ?`).bind(campaign.id, delivery.telegram_id).run();
    } catch (error) {
      const nextStatus = Number(delivery.attempts || 0) + 1 < 3 ? "pending" : "failed";
      await env.DB.prepare(`UPDATE announcement_deliveries SET status = ?, error_text = ?
        WHERE campaign_id = ? AND telegram_id = ?`).bind(nextStatus, String(error?.message || error).slice(0, 240), campaign.id, delivery.telegram_id).run();
    }
  }

  const totals = await env.DB.prepare(`SELECT
    SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered,
    SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed,
    SUM(CASE WHEN status IN ('pending', 'processing') THEN 1 ELSE 0 END) AS remaining
    FROM announcement_deliveries WHERE campaign_id = ?`).bind(campaign.id).first();
  const completed = Number(totals?.remaining || 0) === 0;
  await env.DB.prepare(`UPDATE announcement_campaigns SET delivered_count = ?, failed_count = ?, status = ?,
    completed_at = CASE WHEN ? = 1 THEN CURRENT_TIMESTAMP ELSE completed_at END WHERE id = ?`)
    .bind(Number(totals?.delivered || 0), Number(totals?.failed || 0), completed ? "completed" : "sending", completed ? 1 : 0, campaign.id).run();
}

async function notifyAdmins(env, message, excludeChatId = null) {
  const adminIds = csv(env.ADMIN_IDS).filter((adminId) => String(adminId) !== String(excludeChatId));
  await Promise.allSettled(adminIds.map((adminId) => sendMessage(env, adminId, message)));
}

async function getReferralCount(env, userId) {
  const row = await env.DB.prepare("SELECT COUNT(*) AS n FROM referrals WHERE referrer_id = ? AND status = 'completed'").bind(userId).first();
  return Number(row?.n || 0);
}

async function ensureUser(env, userId, profile = null) {
  if (!profile) {
    await env.DB.prepare("INSERT OR IGNORE INTO users (telegram_id, balance_bdt, language) VALUES (?, 0, 'en')").bind(userId).run();
    return;
  }
  await env.DB.prepare(`INSERT INTO users (telegram_id, username, first_name, last_name, balance_bdt, language)
    VALUES (?, ?, ?, ?, 0, 'en')
    ON CONFLICT(telegram_id) DO UPDATE SET username = excluded.username, first_name = excluded.first_name,
      last_name = excluded.last_name, updated_at = CURRENT_TIMESTAMP`)
    .bind(userId, cleanProfileField(profile.username), cleanProfileField(profile.first_name), cleanProfileField(profile.last_name))
    .run();
}

async function getLanguage(env, userId) {
  const row = await env.DB.prepare("SELECT language FROM users WHERE telegram_id = ?").bind(userId).first();
  return row?.language === "bn" ? "bn" : "en";
}

async function setLanguage(env, userId, language) {
  await env.DB.prepare("UPDATE users SET language = ?, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = ?").bind(language === "bn" ? "bn" : "en", userId).run();
}

async function getBalance(env, userId) {
  const row = await env.DB.prepare("SELECT balance_bdt FROM users WHERE telegram_id = ?").bind(userId).first();
  return Number(row?.balance_bdt || 0);
}

async function addBalance(env, userId, amount) {
  await ensureUser(env, userId);
  await env.DB.prepare("UPDATE users SET balance_bdt = balance_bdt + ?, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = ?").bind(Math.round(Number(amount)), userId).run();
  return getBalance(env, userId);
}

async function setBalance(env, userId, amount) {
  await ensureUser(env, userId);
  await env.DB.prepare("UPDATE users SET balance_bdt = ?, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = ?").bind(Math.round(Number(amount)), userId).run();
  return getBalance(env, userId);
}

async function deductBalance(env, userId, amount) {
  const balance = await getBalance(env, userId);
  const value = Math.round(Number(amount));
  if (balance < value) throw new Error("Insufficient local balance");
  await env.DB.prepare("UPDATE users SET balance_bdt = balance_bdt - ?, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = ?").bind(value, userId).run();
  return getBalance(env, userId);
}

async function recordCompletedPurchase(env, userId, productKey, variantKey, quantity, chargedBdt, providerOrderId) {
  const amount = Math.round(Number(chargedBdt));
  const purchaseKey = crypto.randomUUID();
  const debit = await env.DB.prepare(`UPDATE users SET balance_bdt = balance_bdt - ?, updated_at = CURRENT_TIMESTAMP
    WHERE telegram_id = ? AND balance_bdt >= ?`).bind(amount, userId, amount).run();
  if (Number(debit.meta?.changes || 0) !== 1) throw new Error("Insufficient local balance");

  try {
    await env.DB.batch([
      env.DB.prepare(`INSERT INTO local_orders
        (telegram_id, product_key, variant_key, quantity, charged_bdt, provider_order_id, purchase_key)
        VALUES (?, ?, ?, ?, ?, ?, ?)`)
        .bind(userId, productKey, variantKey, quantity, amount, providerOrderId, purchaseKey),
      env.DB.prepare(`INSERT OR IGNORE INTO referral_rewards (local_order_id, referred_id, referrer_id, reward_bdt)
        SELECT orders.id, referrals.referred_id, referrals.referrer_id, ?
        FROM local_orders AS orders
        JOIN referrals ON referrals.referred_id = orders.telegram_id
        WHERE orders.purchase_key = ? AND referrals.status = 'completed' AND orders.created_at >= referrals.created_at`)
        .bind(REFERRAL_REWARD_BDT, purchaseKey),
    ]);
  } catch (error) {
    await env.DB.prepare("UPDATE users SET balance_bdt = balance_bdt + ?, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = ?")
      .bind(amount, userId).run();
    throw error;
  }

  const reward = await env.DB.prepare(`SELECT rewards.referrer_id, rewards.reward_bdt, users.username, users.first_name
    FROM referral_rewards AS rewards LEFT JOIN users ON users.telegram_id = rewards.referred_id
    JOIN local_orders ON local_orders.id = rewards.local_order_id WHERE local_orders.purchase_key = ?`).bind(purchaseKey).first();
  if (reward) {
    const wallet = await getReferralWalletSummary(env, reward.referrer_id);
    const buyer = reward.username ? `@${reward.username}` : reward.first_name || `User ${userId}`;
    try {
      await sendMessage(env, reward.referrer_id, [
        "🎉 <b>Referral earning added!</b>",
        "",
        `<b>${escapeHtml(buyer)}</b> completed a purchase.`,
        `Reward: <b>${money(reward.reward_bdt)}</b>`,
        `Available to withdraw: <b>${money(wallet.available_bdt)}</b>`,
        "",
        "Open 🎁 Refer & Earn to see the full dashboard.",
      ].join("\n"));
    } catch (error) {
      console.warn(JSON.stringify({ event: "referral_reward_notification_failed", referrer_id: reward.referrer_id, error: error?.message || String(error) }));
    }
  }
}

async function getState(env, userId) {
  return env.DB.prepare("SELECT * FROM user_state WHERE telegram_id = ?").bind(userId).first();
}

async function setState(env, userId, fields) {
  await env.DB.prepare(`
    INSERT INTO user_state (telegram_id, state, payment_provider, payment_amount_bdt, bulk_product_key, verify_color, withdrawal_amount_bdt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(telegram_id) DO UPDATE SET
      state = excluded.state,
      payment_provider = excluded.payment_provider,
      payment_amount_bdt = excluded.payment_amount_bdt,
      bulk_product_key = excluded.bulk_product_key,
      verify_color = excluded.verify_color,
      withdrawal_amount_bdt = excluded.withdrawal_amount_bdt,
      updated_at = CURRENT_TIMESTAMP
  `).bind(
    userId,
    fields.state || null,
    fields.payment_provider || null,
    fields.payment_amount_bdt || null,
    fields.bulk_product_key || null,
    fields.verify_color || null,
    fields.withdrawal_amount_bdt || null,
  ).run();
}

async function clearState(env, userId) {
  await env.DB.prepare("DELETE FROM user_state WHERE telegram_id = ?").bind(userId).run();
}

async function sendMessage(env, chatId, text, extra = {}) {
  return telegram(env, "sendMessage", {
    chat_id: chatId,
    text: polishOutgoingMessage(text),
    parse_mode: "HTML",
    disable_web_page_preview: true,
    ...extra,
  });
}

async function sendMessageLines(env, chatId, lines, maxLength = 3800) {
  let chunk = "";
  for (const line of lines) {
    const next = chunk ? `${chunk}\n${line}` : line;
    if (chunk && next.length > maxLength) {
      await sendMessage(env, chatId, chunk);
      chunk = line;
    } else {
      chunk = next;
    }
  }
  if (chunk) await sendMessage(env, chatId, chunk);
}

async function answerCallback(env, callbackQueryId) {
  try {
    return await telegram(env, "answerCallbackQuery", { callback_query_id: callbackQueryId });
  } catch (error) {
    if (isExpiredCallbackError(error)) {
      console.warn(JSON.stringify({ event: "expired_callback_ignored" }));
      return null;
    }
    throw error;
  }
}

function isExpiredCallbackError(error) {
  const message = String(error?.message || "").toLowerCase();
  return message.includes("query is too old") || message.includes("query id is invalid");
}

async function telegram(env, method, payload) {
  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) throw new Error(data.description || `Telegram ${method} failed`);
  return data;
}

async function mainKeyboard(env, language = "en") {
  const published = await loadPublishedMenu(env);
  if (published) return keyboardForMenuScreen(published, "main", language);
  const m = MENU[language] || MENU.en;
  const custom = await env.DB.prepare("SELECT label_en, label_bn FROM bot_menu_buttons WHERE parent_id IS NULL ORDER BY sort_order, id LIMIT 12").all();
  const customRows = chunk((custom.results || []).map((button) => ({ text: language === "bn" ? button.label_bn : button.label_en })), 2);
  return {
    keyboard: [
      [{ text: m.products }, { text: m.proxy }],
      [{ text: m.balance }, { text: m.history }],
      [{ text: m.refer }, { text: m.support }],
      ...customRows,
    ],
    resize_keyboard: true,
  };
}

async function isPublishedMenuText(env, text) {
  const menu = await loadPublishedMenu(env);
  return Boolean(menu && menu.screens.some((screen) => screen.buttons.some((button) =>
    button.enabled && (button.label_en === text || button.label_bn === text))));
}

async function handlePublishedMenuButton(env, chatId, userId, text, language) {
  const menu = await loadPublishedMenu(env);
  if (!menu) return false;
  const button = publishedMenuButton(menu, text, language);
  if (!button) return false;

  if (button.action === "products") {
    await showProducts(env, chatId, userId);
  } else if (button.action === "balance") {
    await showBalance(env, chatId, userId);
  } else if (button.action === "history") {
    await showHistory(env, chatId, userId);
  } else if (button.action === "refer") {
    await showReferWithStats(env, chatId, userId);
  } else if (button.action === "support") {
    await showSupport(env, chatId, userId);
  } else if (button.action === "proxy") {
    const fallback = language === "bn"
      ? "🛒 বর্তমানে প্রক্সি কেনার অপশন নেই। পণ্য কিনতে Products ব্যবহার করুন।"
      : "🛒 Proxy buying is currently unavailable. Use Products to buy available stock.";
    await sendMessage(env, chatId, await botText(env, `proxy_unavailable_${language}`, fallback), {
      reply_markup: await mainKeyboard(env, language),
    });
  } else if (button.action === "message") {
    await sendMessage(env, chatId, renderEditableBotText(button.value));
  } else if (button.action === "url") {
    const label = language === "bn" ? button.label_bn : button.label_en;
    await sendMessage(env, chatId, escapeHtml(label), {
      reply_markup: { inline_keyboard: [[{ text: label, url: button.value }]] },
    });
  } else if (button.action === "screen") {
    const target = menu.screens.find((screen) => screen.id === button.value);
    if (!target) {
      await sendMessage(env, chatId, language === "bn" ? "মেনুটি পরিবর্তন হয়েছে। মূল মেনু খুলুন।" : "This menu changed. Open the current main menu.", {
        reply_markup: await mainKeyboard(env, language),
      });
      return true;
    }
    const title = language === "bn" ? target.title_bn : target.title_en;
    await sendMessage(env, chatId, escapeHtml(title), { reply_markup: keyboardForMenuScreen(menu, target.id, language) });
  } else if (button.action === "main_menu") {
    const fallback = language === "bn" ? "নিচের মেনু ব্যবহার করুন 👇" : "Use the menu buttons below 👇";
    await sendMessage(env, chatId, await botText(env, `menu_hint_${language}`, fallback), {
      reply_markup: keyboardForMenuScreen(menu, "main", language),
    });
  }
  return true;
}

async function handleCustomMenuButton(env, chatId, text, language) {
  const button = await env.DB.prepare("SELECT id, label_en, label_bn, action_type, action_value FROM bot_menu_buttons WHERE label_en = ? OR label_bn = ? LIMIT 1").bind(text, text).first();
  if (!button) return false;
  const label = language === "bn" ? button.label_bn : button.label_en;
  if (button.action_type === "message") {
    await sendMessage(env, chatId, renderEditableBotText(button.action_value));
    return true;
  }
  if (button.action_type === "url") {
    await sendMessage(env, chatId, escapeHtml(label), { reply_markup: { inline_keyboard: [[{ text: label, url: button.action_value }]] } });
    return true;
  }
  const children = await env.DB.prepare("SELECT label_en, label_bn FROM bot_menu_buttons WHERE parent_id = ? ORDER BY sort_order, id LIMIT 12").bind(button.id).all();
  const rows = chunk((children.results || []).map((child) => ({ text: language === "bn" ? child.label_bn : child.label_en })), 2);
  rows.push([{ text: "↩ Main menu" }]);
  await sendMessage(env, chatId, button.action_value ? renderEditableBotText(button.action_value) : escapeHtml(label), { reply_markup: { keyboard: rows, resize_keyboard: true } });
  return true;
}

async function isCustomMenuText(env, text) {
  const row = await env.DB.prepare("SELECT 1 AS found FROM bot_menu_buttons WHERE label_en = ? OR label_bn = ? LIMIT 1").bind(text, text).first();
  return Boolean(row?.found);
}

function chunk(items, size) {
  const rows = [];
  for (let index = 0; index < items.length; index += size) rows.push(items.slice(index, index + size));
  return rows;
}

function webhookPath(env) {
  return `/webhook/${env.WEBHOOK_SECRET}`;
}

function isAdmin(env, userId) {
  return csv(env.ADMIN_IDS).includes(String(userId));
}

function requiredChannel(env) {
  const username = String(env.REQUIRED_CHANNEL_USERNAME || "").trim();
  if (!username) return "";
  return username.startsWith("@") ? username : `@${username}`;
}

function isMenuText(text, key) {
  return text === MENU.en[key] || text === MENU.bn[key];
}

function isAnyMenuText(text) {
  return Object.keys(MENU.en).some((key) => isMenuText(text, key));
}

function money(value) {
  const amount = Math.round(Number(value) || 0);
  return `Tk ${amount.toLocaleString("en-US")}`;
}

async function getFixedPrices(env, productKey) {
  const result = await env.DB.prepare("SELECT variant_key, price_bdt FROM product_prices WHERE product_key = ?")
    .bind(productKey)
    .all();
  return new Map((result.results || []).map((row) => [row.variant_key || "", Number(row.price_bdt)]));
}

async function getFixedUnitPrice(env, productKey, variantKey = null) {
  return fixedUnitPrice(await getFixedPrices(env, productKey), variantKey);
}

function fixedUnitPrice(prices, variantKey = null) {
  const exact = variantKey ? prices.get(variantKey) : null;
  const value = exact ?? prices.get("");
  return Number.isSafeInteger(value) && value > 0 ? value : null;
}

function fixedProductPriceLabel(product, prices, lang = "en") {
  const variants = product.variants || [];
  if (!variants.length) {
    const price = fixedUnitPrice(prices);
    return price == null ? (lang === "bn" ? "এখনও নির্ধারিত নয়" : "Not set yet") : money(price);
  }
  const availablePrices = variants.map((variant) => fixedUnitPrice(prices, variant.key)).filter((price) => price != null);
  if (!availablePrices.length) return lang === "bn" ? "এখনও নির্ধারিত নয়" : "Not set yet";
  const minimum = Math.min(...availablePrices);
  const maximum = Math.max(...availablePrices);
  return minimum === maximum ? money(minimum) : `from ${money(minimum)}`;
}

function normalizePriceKey(value) {
  const key = String(value || "").trim();
  return /^[A-Za-z0-9._-]{1,100}$/.test(key) ? key : "";
}

function productStock(product) {
  if (product.stock == null && product.inStock) return "unlimited";
  return String(product.stock || 0);
}

function firestoreValue(value) {
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  if ("booleanValue" in value) return Boolean(value.booleanValue);
  if ("timestampValue" in value) return value.timestampValue;
  if ("mapValue" in value) {
    const out = {};
    for (const [key, child] of Object.entries(value.mapValue.fields || {})) out[key] = firestoreValue(child);
    return out;
  }
  return null;
}

function firstText(values, fields) {
  for (const field of fields) if (values[field]) return String(values[field]);
  return "";
}

function firstNumber(values, fields) {
  for (const field of fields) {
    if (values[field] == null) continue;
    const parsed = Number(String(values[field]).replaceAll(",", ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function csv(value) {
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

function parseStartReferrer(text, userId) {
  const [, payload = ""] = text.split(/\s+/, 2);
  if (!/^\d+$/.test(payload)) return null;
  const referrerId = Number(payload);
  if (!Number.isSafeInteger(referrerId) || referrerId === userId) return null;
  return referrerId;
}

function normalizeTransactionId(value) {
  const normalized = String(value || "").trim().replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z0-9]{6,32}$/.test(normalized)) return "";
  return normalized;
}

function unixNow() {
  return Math.floor(Date.now() / 1000);
}

function dropNulls(input) {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== null && value !== undefined && value !== ""));
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
