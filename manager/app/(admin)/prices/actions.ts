"use server";

import { managerD1 } from "@/lib/cloudflare";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function key(value: FormDataEntryValue | null, optional = false) {
  const normalized = String(value || "").trim();
  if (optional && !normalized) return "";
  if (!/^[A-Za-z0-9._-]{1,100}$/.test(normalized)) throw new Error("Invalid product or variant key.");
  return normalized;
}

export async function setPrice(form: FormData) {
  await requireAdmin();
  const productKey = key(form.get("product_key"));
  const variantKey = key(form.get("variant_key"), true);
  const amountText = String(form.get("price_bdt") || "");
  const amount = Number(amountText);
  if (!/^\d+$/.test(amountText) || !Number.isSafeInteger(amount) || amount < 1 || amount > 10_000_000) throw new Error("Price must be a whole BDT amount between 1 and 10,000,000.");
  await managerD1("setPrice", { productKey, variantKey, priceBdt: amount });
  revalidatePath("/prices");
  revalidatePath("/dashboard");
}

export async function removePrice(form: FormData) {
  await requireAdmin();
  const productKey = key(form.get("product_key"));
  const variantKey = key(form.get("variant_key"), true);
  await managerD1("removePrice", { productKey, variantKey });
  revalidatePath("/prices");
  revalidatePath("/dashboard");
}
