import Link from "next/link";
import { Activity, ArrowUpRight, BadgeDollarSign, Megaphone, ReceiptText, Tags, Users, WalletCards, Waypoints } from "lucide-react";
import { ErrorPanel, PageHeader, StatusPill } from "@/components/ui";
import { getHealth, getOverview, taka } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [overviewResult, healthResult] = await Promise.allSettled([getOverview(), getHealth()]);
  const overview = overviewResult.status === "fulfilled" ? overviewResult.value : null;
  const health = healthResult.status === "fulfilled" ? healthResult.value : null;
  const cards = overview ? [
    { label: "Total users", value: overview.users, icon: Users, tone: "violet" },
    { label: "Wallet balances", value: taka(overview.balances), icon: WalletCards, tone: "blue" },
    { label: "Verified payments", value: overview.payments, meta: taka(overview.payment_total), icon: BadgeDollarSign, tone: "green" },
    { label: "Completed orders", value: overview.orders, meta: taka(overview.charged), icon: ReceiptText, tone: "orange" },
    { label: "Referrals", value: overview.referrals, meta: `${taka(overview.referral_rewards)} rewards`, icon: Waypoints, tone: "pink" },
  ] : [];
  return (
    <>
      <PageHeader eyebrow="Command center" title="Everything your bot is doing" description="Live business totals, service status, and the controls you use most." action={<Link className="primary-action" href="/health"><Activity size={17} /> Run health check</Link>} />
      {overviewResult.status === "rejected" && <ErrorPanel message={overviewResult.reason instanceof Error ? overviewResult.reason.message : "Unknown data error."} />}
      <section className="metric-grid">
        {cards.map(({ label, value, meta, icon: Icon, tone }) => <article className="metric-card" key={label}><span className={`metric-icon ${tone}`}><Icon size={20} /></span><p>{label}</p><strong>{value}</strong>{meta && <small>{meta} total</small>}</article>)}
      </section>
      <section className="split-grid">
        <article className="panel">
          <div className="panel-head"><div><span className="eyebrow">System pulse</span><h2>Bot services</h2></div><Link href="/health">Details <ArrowUpRight size={15} /></Link></div>
          {health ? <div className="health-list">
            <div><span>Cloudflare Worker</span><StatusPill ok={health.worker.ok}>{health.worker.ok ? `Healthy · ${health.worker.latency} ms` : "Unavailable"}</StatusPill></div>
            <div><span>Telegram webhook</span><StatusPill ok={Boolean(health.telegram.ok)}>{health.telegram.ok ? `${Number(health.telegram.pending_update_count || 0)} queued` : "Needs attention"}</StatusPill></div>
            <div><span>Firebase privacy</span><StatusPill ok={!health.firebase.publicRead}>{health.firebase.publicRead ? "Public reads enabled" : "Private"}</StatusPill></div>
          </div> : <ErrorPanel message="Health services could not be checked." />}
        </article>
        <article className="panel quick-panel">
          <div className="panel-head"><div><span className="eyebrow">Quick actions</span><h2>Manage the bot</h2></div></div>
          <Link href="/prices"><span className="quick-icon"><Tags size={19} /></span><div><strong>Update product prices</strong><small>Set fixed BDT prices safely</small></div><ArrowUpRight size={17} /></Link>
          <Link href="/payments"><span className="quick-icon"><BadgeDollarSign size={19} /></span><div><strong>Review payments</strong><small>See verified transaction claims</small></div><ArrowUpRight size={17} /></Link>
          <Link href="/users"><span className="quick-icon"><Users size={19} /></span><div><strong>Browse users</strong><small>Balances and verification status</small></div><ArrowUpRight size={17} /></Link>
          <Link href="/referrals"><span className="quick-icon"><Waypoints size={19} /></span><div><strong>Review referral payouts</strong><small>{overview?.pending_withdrawals || 0} withdrawal request(s) waiting</small></div><ArrowUpRight size={17} /></Link>
          <Link href="/announcements"><span className="quick-icon"><Megaphone size={19} /></span><div><strong>Post an announcement</strong><small>Broadcast safely to every bot user</small></div><ArrowUpRight size={17} /></Link>
        </article>
      </section>
    </>
  );
}
