import { EmptyState, ErrorPanel, formatDate, PageHeader, StatusPill } from "@/components/ui";
import { getReferrals, getReferralSummary, getWithdrawals, taka } from "@/lib/data";
import { reviewWithdrawal } from "./actions";

export const dynamic = "force-dynamic";

export default async function ReferralsPage() {
  try {
    const [referrals, summary, withdrawals] = await Promise.all([getReferrals(), getReferralSummary(), getWithdrawals()]);
    const person = (username: string | null, first: string | null, last: string | null, id: number) => username ? `@${username}` : [first, last].filter(Boolean).join(" ") || `User ${id}`;
    return <><PageHeader eyebrow="Growth & payouts" title="Referral earnings" description="Every referred-user purchase earns the referrer Tk 100. Review complete purchase evidence before paying bKash withdrawals." />
      <div className="referral-summary-grid">
        <article><span>Referred users</span><strong>{summary?.referred_users || 0}</strong></article>
        <article><span>Rewarded purchases</span><strong>{summary?.rewarded_purchases || 0}</strong></article>
        <article><span>Total rewards</span><strong>{taka(summary?.rewards_bdt || 0)}</strong></article>
        <article><span>Pending payout</span><strong>{taka(summary?.pending_bdt || 0)}</strong><small>{summary?.pending_withdrawals || 0} request(s)</small></article>
        <article><span>Paid out</span><strong>{taka(summary?.paid_bdt || 0)}</strong></article>
      </div>
      <div className="table-panel referral-withdrawals"><div className="panel-head"><h2>Withdrawal requests</h2></div><div className="withdrawal-cards">{withdrawals.map((item) => <article key={item.id} className={item.status === "pending" ? "withdrawal-card pending" : "withdrawal-card"}>
        <div className="withdrawal-head"><div><strong>{person(item.username, item.first_name, item.last_name, item.telegram_id)}</strong><code>{item.telegram_id}</code></div><StatusPill ok={item.status === "paid"}>{item.status}</StatusPill></div>
        <dl><div><dt>Amount</dt><dd>{taka(item.amount_bdt)}</dd></div><div><dt>bKash</dt><dd><code>{item.bkash_number}</code></dd></div><div><dt>Referrals</dt><dd>{item.referral_count}</dd></div><div><dt>Purchases</dt><dd>{item.purchase_count}</dd></div><div><dt>Total earned</dt><dd>{taka(item.total_earned_bdt)}</dd></div><div><dt>Requested</dt><dd>{formatDate(item.created_at)}</dd></div></dl>
        {item.status === "pending" ? <form className="withdrawal-review" action={reviewWithdrawal}><input type="hidden" name="withdrawal_id" value={item.id} /><input name="note" maxLength={300} placeholder="Optional payment note or rejection reason" /><div><button name="status" value="paid" type="submit">Mark paid</button><button className="reject" name="status" value="rejected" type="submit">Reject</button></div></form> : <small className="review-note">Reviewed {formatDate(item.reviewed_at)}{item.admin_note ? ` · ${item.admin_note}` : ""}</small>}
      </article>)}</div>{!withdrawals.length && <EmptyState label="No withdrawal requests yet." />}</div>
      <div className="table-panel compact"><div className="panel-head"><h2>Referral purchase totals</h2></div><div className="table-scroll"><table><thead><tr><th>Invited user</th><th>Referrer</th><th>Status</th><th>Purchases</th><th>Earned</th><th>Joined</th></tr></thead><tbody>{referrals.map((item) => <tr key={item.referred_id}><td><strong>{person(item.referred_username, item.referred_first_name, item.referred_last_name, item.referred_id)}</strong><small className="cell-sub">{item.referred_id}</small></td><td><strong>{person(item.referrer_username, item.referrer_first_name, item.referrer_last_name, item.referrer_id)}</strong><small className="cell-sub">{item.referrer_id}</small></td><td><StatusPill ok={item.status === "completed"}>{item.status}</StatusPill></td><td>{item.purchase_count}</td><td className="money">{taka(item.earned_bdt)}</td><td>{formatDate(item.completed_at || item.created_at)}</td></tr>)}</tbody></table></div>{!referrals.length && <EmptyState label="No referrals yet." />}</div></>;
  } catch (error) { return <><PageHeader eyebrow="Growth & payouts" title="Referral earnings" description="Referral purchases and withdrawals." /><ErrorPanel message={error instanceof Error ? error.message : "Unknown error."} /></>; }
}
