import { managerD1 } from "@/lib/cloudflare";
import { parseMenuStudioRow, type MenuStudioRow } from "@/lib/menu-studio";

export type Overview = {
  users: number;
  balances: number;
  payments: number;
  payment_total: number;
  orders: number;
  charged: number;
  referrals: number;
  referral_rewards: number;
  pending_withdrawals: number;
};

export type UserRow = { telegram_id: number; username: string | null; first_name: string | null; last_name: string | null; balance_bdt: number; language: string; human_verified: number; created_at: string };
export type PaymentRow = { transaction_id: string; telegram_id: number; amount_bdt: number; provider: string; claimed_at: string };
export type OrderRow = { id: number; telegram_id: number; product_key: string; variant_key: string | null; quantity: number; charged_bdt: number; provider_order_id: string | null; created_at: string };
export type ReferralRow = {
  referred_id: number; referrer_id: number; status: string; created_at: string; completed_at: string | null;
  referred_username: string | null; referred_first_name: string | null; referred_last_name: string | null;
  referrer_username: string | null; referrer_first_name: string | null; referrer_last_name: string | null;
  purchase_count: number; earned_bdt: number;
};
export type ReferralSummary = { referred_users: number; rewarded_purchases: number; rewards_bdt: number; pending_withdrawals: number; pending_bdt: number; paid_bdt: number };
export type WithdrawalRow = {
  id: string; telegram_id: number; amount_bdt: number; bkash_number: string; status: "pending" | "paid" | "rejected";
  admin_note: string; created_at: string; reviewed_at: string | null; reviewed_by: string | null;
  username: string | null; first_name: string | null; last_name: string | null;
  referral_count: number; purchase_count: number; total_earned_bdt: number;
};
export type AnnouncementRow = {
  id: string; message_text: string; button_label: string | null; button_url: string | null;
  status: "queued" | "sending" | "completed"; recipient_count: number; delivered_count: number; failed_count: number;
  created_at: string; started_at: string | null; completed_at: string | null;
};
export type PriceRow = { product_key: string; variant_key: string; price_bdt: number; updated_at: string };
export type CatalogProduct = { productKey: string; name?: string; stock?: number; inStock?: boolean; variants?: Array<{ key: string; name?: string }> };
export type SellerApiConfig = {
  provider_name: string;
  base_url: string;
  auth_header: string;
  auth_prefix: string;
  endpoints: { balance: string; products: string; product: string; purchase: string; orders: string };
  mapping: Record<string, string>;
  api_key_configured: boolean;
  api_key_source: "manager" | "environment" | "missing";
  updated_at: string | null;
};
export type SellerApiTest = { product_count: number; sample_products: Array<{ productKey: string; name: string }> };
export type BotSettingRow = { key: string; value: string; updated_at: string };
export type MenuButtonRow = { id: number; parent_id: number | null; label_en: string; label_bn: string; action_type: "message" | "url" | "submenu"; action_value: string; sort_order: number; created_at: string };

export async function getOverview() {
  const { rows } = await managerD1<Overview>("overview");
  return rows[0];
}

export async function getUsers() {
  return (await managerD1<UserRow>("users")).rows;
}

export async function getPayments() {
  return (await managerD1<PaymentRow>("payments")).rows;
}

export async function getOrders() {
  return (await managerD1<OrderRow>("orders")).rows;
}

export async function getReferrals() {
  return (await managerD1<ReferralRow>("referrals")).rows;
}

export async function getReferralSummary() {
  return (await managerD1<ReferralSummary>("referralSummary")).rows[0];
}

export async function getWithdrawals() {
  return (await managerD1<WithdrawalRow>("withdrawals")).rows;
}

export async function getAnnouncements() {
  return (await managerD1<AnnouncementRow>("announcements")).rows;
}

export async function getPrices() {
  return (await managerD1<PriceRow>("prices")).rows;
}

export async function getBotSettings() {
  return (await managerD1<BotSettingRow>("botSettings")).rows;
}

export async function getMenuButtons() {
  return (await managerD1<MenuButtonRow>("menuButtons")).rows;
}

export async function getMenuStudio() {
  const row = (await managerD1<MenuStudioRow>("menuStudio")).rows[0];
  if (!row) throw new Error("The menu studio could not load its draft.");
  return parseMenuStudioRow(row);
}

export async function getCatalog(): Promise<CatalogProduct[]> {
  return (await managerD1<CatalogProduct>("sellerCatalog")).rows;
}

export async function getSellerApiConfig() {
  const row = (await managerD1<SellerApiConfig>("sellerApiConfig")).rows[0];
  if (!row) throw new Error("The seller API configuration could not be loaded.");
  return row;
}

export async function testSellerApi() {
  const row = (await managerD1<SellerApiTest>("testSellerApi")).rows[0];
  if (!row) throw new Error("The seller API test returned no result.");
  return row;
}

async function timedFetch(url: string, init?: RequestInit) {
  const started = Date.now();
  try {
    const response = await fetch(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(8000) });
    return { ok: response.ok, status: response.status, latency: Date.now() - started, response };
  } catch (error) {
    return { ok: false, status: 0, latency: Date.now() - started, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function getHealth() {
  const workerUrl = process.env.BOT_WORKER_URL?.trim();
  const worker = workerUrl
    ? await timedFetch(workerUrl)
    : { ok: false, status: 0, latency: 0, error: "BOT_WORKER_URL is missing." };

  let telegram: Record<string, unknown> = { ok: false, configured: false, message: "TELEGRAM_BOT_TOKEN is missing." };
  if (process.env.TELEGRAM_BOT_TOKEN) {
    const result = await timedFetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getWebhookInfo`);
    if (result.response) {
      const payload = (await result.response.json()) as { ok?: boolean; result?: Record<string, unknown>; description?: string };
      telegram = { ok: Boolean(payload.ok), latency: result.latency, ...payload.result, message: payload.description };
    } else telegram = { ok: false, latency: result.latency, message: result.error };
  }

  const firebaseProject = process.env.FIREBASE_PROJECT_ID?.trim();
  const firebase = firebaseProject
    ? await timedFetch(`https://firestore.googleapis.com/v1/projects/${firebaseProject}/databases/(default)/documents/transactions?pageSize=1`)
    : { ok: false, status: 0, latency: 0, error: "FIREBASE_PROJECT_ID is missing." };

  return {
    worker: { ok: worker.ok, status: worker.status, latency: worker.latency },
    telegram,
    firebase: { configured: Boolean(firebaseProject), publicRead: firebase.status === 200, status: firebase.status, latency: firebase.latency },
  };
}

export function taka(value: number) {
  return `Tk ${Number(value || 0).toLocaleString("en-US")}`;
}
