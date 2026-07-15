import { CopyCode } from "@/components/copy-code";
import { EmptyState, ErrorPanel, formatDate, PageHeader, StatusPill } from "@/components/ui";
import { getWithdrawalEvidence, taka } from "@/lib/data";
import Link from "next/link";
import { reviewWithdrawal } from "../actions";

export const dynamic = "force-dynamic";

export default async function WithdrawalEvidencePage({ params }: { params: Promise<{ withdrawalId: string }> }) {
  const { withdrawalId } = await params;
  try {
    const evidence = await getWithdrawalEvidence(withdrawalId);
    const item = evidence.withdrawal;
    const person = (username: string | null, first: string | null, last: string | null, id: number) => username
      ? `@${username}`
      : [first, last].filter(Boolean).join(" ") || `User ${id}`;
    return <>
      <PageHeader eyebrow="Manual verification" title="Withdrawal evidence" description="Cross-check rewarded orders and the invited users' verified transaction IDs before approving this payout." action={<Link className="secondary-link" href="/referrals">Back to withdrawals</Link>} />
      <div className="notice warning"><div><strong>Important</strong><p>Payments fund a user balance and orders spend that balance, so a transaction ID is not directly attached to one specific order. Verify the buyer, amount, purchase history, and dates together.</p></div></div>
      <div className="evidence-summary">
        <article><span>Referrer</span><strong>{person(item.username, item.first_name, item.last_name, item.telegram_id)}</strong><small>{item.telegram_id}</small></article>
        <article><span>Withdrawal</span><strong>{taka(item.amount_bdt)}</strong><small>{item.bkash_number}</small></article>
        <article><span>Rewarded purchases</span><strong>{evidence.totals.purchase_count}</strong><small>{taka(evidence.totals.reward_bdt)} earned</small></article>
        <article><span>Referral payments</span><strong>{evidence.totals.payment_count}</strong><small>{taka(evidence.totals.payment_amount_bdt)} claimed</small></article>
      </div>
      <div className="table-panel evidence-panel"><div className="panel-head"><div><h2>Rewarded purchases</h2><p>Only completed orders that generated referral rewards appear here.</p></div></div><div className="table-scroll"><table className="evidence-table"><thead><tr><th>Invited user</th><th>Product</th><th>Order amount</th><th>Reward</th><th>Provider order</th><th>Purchased</th></tr></thead><tbody>{evidence.purchases.map((purchase) => <tr key={purchase.reward_id}><td><strong>{person(purchase.username, purchase.first_name, purchase.last_name, purchase.referred_id)}</strong><small className="cell-sub">{purchase.referred_id}</small></td><td><code>{purchase.product_key}</code>{purchase.variant_key && <small className="cell-sub">{purchase.variant_key}</small>}<small className="cell-sub">Qty {purchase.quantity}</small></td><td className="money">{taka(purchase.charged_bdt)}</td><td>{taka(purchase.reward_bdt)}</td><td>{purchase.provider_order_id ? <code>{purchase.provider_order_id}</code> : "—"}</td><td>{formatDate(purchase.purchased_at)}</td></tr>)}</tbody></table></div>{!evidence.purchases.length && <EmptyState label="No rewarded purchases were found." />}</div>
      <div className="table-panel evidence-panel"><div className="panel-head"><div><h2>Payments by invited users</h2><p>Verified balance deposits with the transaction IDs needed for manual checking.</p></div></div><div className="table-scroll"><table className="payments-table"><thead><tr><th>Txn ID</th><th>Invited user</th><th>Provider</th><th>Amount</th><th>Claimed</th></tr></thead><tbody>{evidence.payments.map((payment) => <tr key={payment.transaction_id}><td data-label="Txn ID"><CopyCode value={payment.transaction_id} /></td><td data-label="Invited user"><strong>{person(payment.username, payment.first_name, payment.last_name, payment.telegram_id)}</strong><small className="cell-sub">{payment.telegram_id}</small></td><td data-label="Provider"><StatusPill ok>{payment.provider.toUpperCase()}</StatusPill></td><td data-label="Amount" className="money">{taka(payment.amount_bdt)}</td><td data-label="Claimed">{formatDate(payment.claimed_at)}</td></tr>)}</tbody></table></div>{!evidence.payments.length && <EmptyState label="No verified referral payments were found." />}</div>
      <div className="table-panel evidence-review"><div><h2>Review payout</h2><p>Status: <StatusPill ok={item.status === "paid"}>{item.status}</StatusPill></p></div>{item.status === "pending" ? <form className="withdrawal-review" action={reviewWithdrawal}><input type="hidden" name="withdrawal_id" value={item.id} /><input name="note" maxLength={300} placeholder="Optional payment note or rejection reason" /><div><button name="status" value="paid" type="submit">Mark paid</button><button className="reject" name="status" value="rejected" type="submit">Reject</button></div></form> : <small className="review-note">Reviewed {formatDate(item.reviewed_at)}{item.admin_note ? ` · ${item.admin_note}` : ""}</small>}</div>
    </>;
  } catch (error) {
    return <><PageHeader eyebrow="Manual verification" title="Withdrawal evidence" description="Rewarded purchases and verified referral payments." action={<Link className="secondary-link" href="/referrals">Back to withdrawals</Link>} /><ErrorPanel message={error instanceof Error ? error.message : "Unknown error."} /></>;
  }
}
