type ManagerPayload = Record<string, unknown>;

type ManagerResponse<T> = {
  ok: boolean;
  error?: string;
  rows?: T[];
  changes?: number;
};

export async function managerD1<T>(operation: string, input: ManagerPayload = {}) {
  const workerUrl = process.env.BOT_WORKER_URL?.trim();
  const secret = process.env.MANAGER_API_SECRET;
  if (!workerUrl) throw new Error("BOT_WORKER_URL is not configured yet.");
  if (!secret) throw new Error("The private bot manager connection is not configured yet.");

  const response = await fetch(`${workerUrl.replace(/\/+$/, "")}/manager/d1`, {
    method: "POST",
    headers: { authorization: `Bearer ${secret}`, "content-type": "application/json" },
    body: JSON.stringify({ operation, ...input }),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  const payload = (await response.json()) as ManagerResponse<T>;
  if (!response.ok || !payload.ok) throw new Error(payload.error || `Bot manager request failed with HTTP ${response.status}.`);
  return { rows: payload.rows || [], changes: Number(payload.changes || 0) };
}
