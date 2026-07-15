"use server";

import { requireAdmin } from "@/lib/auth";
import { managerD1 } from "@/lib/cloudflare";
import { revalidatePath } from "next/cache";

export async function reviewWithdrawal(form: FormData) {
  await requireAdmin();
  const withdrawalId = String(form.get("withdrawal_id") || "");
  const status = String(form.get("status") || "");
  const note = String(form.get("note") || "").trim();
  if (!/^[0-9a-f-]{36}$/i.test(withdrawalId)) throw new Error("Invalid withdrawal request.");
  if (status !== "paid" && status !== "rejected") throw new Error("Choose paid or rejected.");
  if (note.length > 300) throw new Error("The admin note must be 300 characters or less.");
  await managerD1("updateWithdrawalStatus", { withdrawalId, status, note });
  revalidatePath("/referrals");
  revalidatePath(`/referrals/${withdrawalId}`);
}
