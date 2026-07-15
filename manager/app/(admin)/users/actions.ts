"use server";

import { requireAdmin } from "@/lib/auth";
import { managerD1 } from "@/lib/cloudflare";
import { revalidatePath } from "next/cache";

export async function updateBalance(form: FormData) {
  await requireAdmin();
  const telegramId = Number(form.get("telegram_id"));
  const amountText = String(form.get("balance_bdt") || "").trim();
  const balanceBdt = Number(amountText);
  if (!Number.isSafeInteger(telegramId) || telegramId < 1) throw new Error("Invalid Telegram user ID.");
  if (!/^\d+$/.test(amountText) || !Number.isSafeInteger(balanceBdt) || balanceBdt < 0 || balanceBdt > 100_000_000) {
    throw new Error("Balance must be a whole BDT amount between 0 and 100,000,000.");
  }
  const result = await managerD1("setBalance", { telegramId, balanceBdt });
  if (result.changes !== 1) throw new Error("User was not found.");
  revalidatePath("/users");
  revalidatePath("/dashboard");
}

export async function refreshProfiles() {
  await requireAdmin();
  await managerD1("syncProfiles");
  revalidatePath("/users");
}
