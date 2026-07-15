import { CopyCode } from "@/components/copy-code";
import { EmptyState, ErrorPanel, formatDate, PageHeader, StatusPill } from "@/components/ui";
import { getPayments, taka } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  try {
    const payments = await getPayments();
    const person = (payment: (typeof payments)[number]) => payment.username
      ? `@${payment.username}`
      : [payment.first_name, payment.last_name].filter(Boolean).join(" ") || `User ${payment.telegram_id}`;
    return <>
      <PageHeader eyebrow="Money in" title="Verified payments" description="Every verified transaction ID is shown below and can be copied for manual checking." />
      <div className="table-panel payments-panel"><div className="table-scroll"><table className="payments-table"><thead><tr><th>Txn ID</th><th>User</th><th>Provider</th><th>Amount</th><th>Claimed</th></tr></thead><tbody>{payments.map((payment) => <tr key={payment.transaction_id}>
        <td data-label="Txn ID"><CopyCode value={payment.transaction_id} /></td>
        <td data-label="User"><strong>{person(payment)}</strong><small className="cell-sub">{payment.telegram_id}</small></td>
        <td data-label="Provider"><StatusPill ok>{payment.provider.toUpperCase()}</StatusPill></td>
        <td data-label="Amount" className="money">{taka(payment.amount_bdt)}</td>
        <td data-label="Claimed">{formatDate(payment.claimed_at)}</td>
      </tr>)}</tbody></table></div>{!payments.length && <EmptyState label="No verified payments yet." />}</div>
    </>;
  } catch (error) {
    return <><PageHeader eyebrow="Money in" title="Verified payments" description="Successfully claimed transactions." /><ErrorPanel message={error instanceof Error ? error.message : "Unknown error."} /></>;
  }
}
