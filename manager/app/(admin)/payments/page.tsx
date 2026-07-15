import { EmptyState, ErrorPanel, formatDate, PageHeader, StatusPill } from "@/components/ui";
import { getPayments, taka } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  try {
    const payments = await getPayments();
    return <><PageHeader eyebrow="Money in" title="Verified payments" description="Successfully claimed transactions, newest first." />
      <div className="table-panel"><div className="table-scroll"><table><thead><tr><th>Transaction</th><th>User</th><th>Provider</th><th>Amount</th><th>Claimed</th></tr></thead><tbody>{payments.map((payment) => <tr key={payment.transaction_id}><td><code>{payment.transaction_id}</code></td><td><code>{payment.telegram_id}</code></td><td><StatusPill ok>{payment.provider.toUpperCase()}</StatusPill></td><td className="money">{taka(payment.amount_bdt)}</td><td>{formatDate(payment.claimed_at)}</td></tr>)}</tbody></table></div>{!payments.length && <EmptyState label="No verified payments yet." />}</div></>;
  } catch (error) { return <><PageHeader eyebrow="Money in" title="Verified payments" description="Successfully claimed transactions." /><ErrorPanel message={error instanceof Error ? error.message : "Unknown error."} /></>; }
}
