"use server";

import { requireAdmin } from "@/lib/auth";
import { managerD1 } from "@/lib/cloudflare";
import { quantumVaultDefaults, sellerEndpointFields, sellerMappingFields } from "@/lib/seller-api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function value(form: FormData, name: string) {
  return String(form.get(name) || "").trim();
}

function formConfig(form: FormData) {
  return {
    providerName: value(form, "provider_name"),
    baseUrl: value(form, "base_url"),
    authHeader: value(form, "auth_header"),
    authPrefix: value(form, "auth_prefix"),
    endpoints: Object.fromEntries(sellerEndpointFields.map(([key]) => [key, value(form, `endpoint_${key}`)])),
    mapping: Object.fromEntries(sellerMappingFields.map(([key]) => [key, value(form, `mapping_${key}`)])),
  };
}

function errorCode(error: unknown) {
  const code = error instanceof Error ? error.message : "seller_test_failed";
  return [
    "seller_test_unauthorized",
    "seller_test_failed",
    "seller_api_key_required",
    "seller_invalid_base_url",
    "seller_product_placeholder_required",
  ].includes(code) ? code : "seller_invalid_config";
}

async function update(config: Record<string, unknown>, apiKey = "") {
  const result = await managerD1<{ product_count?: number }>("updateSellerApiConfig", { config, apiKey });
  revalidatePath("/provider");
  revalidatePath("/prices");
  return Number(result.rows[0]?.product_count || 0);
}

export async function saveSellerApi(form: FormData) {
  await requireAdmin();
  let productCount = 0;
  try {
    productCount = await update(formConfig(form), value(form, "api_key"));
  } catch (error) {
    redirect(`/provider?error=${errorCode(error)}`);
  }
  redirect(`/provider?saved=1&products=${productCount}`);
}

export async function resetSellerApi() {
  await requireAdmin();
  let productCount = 0;
  try {
    productCount = await update(quantumVaultDefaults);
  } catch (error) {
    redirect(`/provider?error=${errorCode(error)}`);
  }
  redirect(`/provider?saved=1&reset=1&products=${productCount}`);
}

export async function testSellerApiConnection() {
  await requireAdmin();
  let productCount = 0;
  try {
    const result = await managerD1<{ product_count: number }>("testSellerApi");
    productCount = Number(result.rows[0]?.product_count || 0);
  } catch (error) {
    redirect(`/provider?error=${errorCode(error)}`);
  }
  redirect(`/provider?tested=1&products=${productCount}`);
}
