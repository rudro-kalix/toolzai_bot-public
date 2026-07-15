import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock3, RefreshCw, Server, ShieldAlert, Webhook } from "lucide-react";
import { ErrorPanel, formatDate, PageHeader, StatusPill } from "@/components/ui";
import { getHealth } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HealthPage() {
  try {
    const health = await getHealth();
    const telegramOk = Boolean(health.telegram.ok);
    const pending = Number(health.telegram.pending_update_count || 0);
    const lastError = String(health.telegram.last_error_message || "");
    const lastErrorAt = Number(health.telegram.last_error_date || 0);
    return <>
      <PageHeader eyebrow="Diagnostics" title="Bot health" description="A fresh check of every service that keeps your bot responding." action={<Link className="primary-action" href="/health"><RefreshCw size={17} /> Check again</Link>} />
      <section className="health-grid">
        <article className="service-card"><span className="service-icon"><Server size={22} /></span><div><p>Cloudflare Worker</p><h2>{health.worker.ok ? "Online" : "Unavailable"}</h2><StatusPill ok={health.worker.ok}>{health.worker.status ? `HTTP ${health.worker.status}` : "Connection failed"}</StatusPill></div><small><Clock3 size={14} /> {health.worker.latency} ms</small></article>
        <article className="service-card"><span className="service-icon"><Webhook size={22} /></span><div><p>Telegram webhook</p><h2>{telegramOk ? "Connected" : "Needs attention"}</h2><StatusPill ok={telegramOk && pending === 0}>{pending} queued update{pending === 1 ? "" : "s"}</StatusPill></div><small><Clock3 size={14} /> {Number(health.telegram.latency || 0)} ms</small></article>
        <article className="service-card"><span className="service-icon"><ShieldAlert size={22} /></span><div><p>Firebase privacy</p><h2>{health.firebase.publicRead ? "Publicly readable" : "Read protected"}</h2><StatusPill ok={!health.firebase.publicRead}>{health.firebase.publicRead ? "Security risk" : "Protected"}</StatusPill></div><small><Clock3 size={14} /> {health.firebase.latency} ms</small></article>
      </section>
      {lastError && <div className="notice warning"><AlertTriangle size={20} /><div><strong>Historical Telegram delivery error</strong><p>{lastError}{lastErrorAt ? ` · Recorded ${formatDate(new Date(lastErrorAt * 1000).toISOString())}` : ""}. The webhook is currently connected with {pending} queued updates.</p></div></div>}
      {!lastError && telegramOk && <div className="notice success"><CheckCircle2 size={20} /><div><strong>No Telegram delivery error is currently recorded</strong><p>The webhook is connected and accepting updates.</p></div></div>}
      {health.firebase.publicRead && <div className="notice danger"><ShieldAlert size={20} /><div><strong>Firebase payment collections are exposed</strong><p>Anonymous reads are currently accepted. Do not close the rules until the bot is moved to authenticated Firestore access, or payment verification will stop.</p></div></div>}
    </>;
  } catch (error) { return <><PageHeader eyebrow="Diagnostics" title="Bot health" description="Live service checks." /><ErrorPanel message={error instanceof Error ? error.message : "Unknown error."} /></>; }
}
