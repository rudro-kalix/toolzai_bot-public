type ManagerPayload = Record<string, unknown>;

type ManagerResponse<T> = {
  ok: boolean;
  error?: string;
  rows?: T[];
  changes?: number;
};

export async function managerD1<T>(operation: string, input: ManagerPayload = {}) {
  const workerUrl = process.env.BOT_WORKER_URL || "https://toolzai-telegram-bot.toolzai.workers.dev";
  const secret = process.env.MANAGER_API_SECRET;
  if (!secret) throw new Error("The private bot manager connection is not configured yet.");

  const response = await fetch(`${workerUrl.replace(/\/+$/, "")}/manager/d1`, {
    method: "POST",
    headers: { authorization: `Bearer ${secret}`, "content-type": "application/json" },
    body: JSON.stringify({ operation, ...input }),
    cache: "no-store",
    signal: AbortSignal.timeout(operation === "switchFirebaseProject" || operation === "rollbackFirebaseProject" ? 20_000 : 8_000),
  });
  const payload = (await response.json()) as ManagerResponse<T>;
  if (!response.ok || !payload.ok) throw new Error(payload.error || `Bot manager request failed with HTTP ${response.status}.`);
  return { rows: payload.rows || [], changes: Number(payload.changes || 0) };
}
